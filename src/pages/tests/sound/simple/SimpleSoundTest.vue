<script>
import { defineComponent } from 'vue';
import { usePopupStore } from "../../../../store/popup.store.js";
import CommonButton from "../../../../components/UI/CommonButton.vue";

export default defineComponent({
  name: 'SimpleSoundTest',
  components: { CommonButton },
  data() {
    return {
      testState: 'ready',
      audioContext: null,
      reactionTimes: [],
      timeoutIds: [],
      TRIAL_COUNT: 120,
      currentTrial: 0,
      startTime: 0,
      inactivityTimeout: null,
      popupStore: usePopupStore(),
      missedCount: 0,
    };
  },
  computed: {
    buttonText() {
      switch(this.testState) {
        case 'ready': return 'Начать тест';
        case 'reacting': return 'Ждите сигнала';
        case 'completed': return 'Тест окончен';
        default: return '';
      }
    },
    results() {
      const times = this.reactionTimes;
      if (!times.length) return { average: 0, deviation: 0, best: 0, worst: 0 };
      const average = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
      const variance = times.reduce((acc, val) => acc + Math.pow(val - average, 2), 0) / times.length;
      const deviation = Math.round(Math.sqrt(variance));
      return {
        average,
        deviation,
        best: Math.min(...times),
        worst: Math.max(...times)
      };
    }
  },
  methods: {
    handleClick() {
      if (this.testState === 'ready') {
        this.startTest();
      } else if (this.testState === 'reacting') {
        if (this.startTime === 0) {
          this.failTest('Слишком раннее нажатие!');
          return;
        }
        const reactionTime = Date.now() - this.startTime;
        this.reactionTimes.push(reactionTime);
        this.currentTrial++;
        clearTimeout(this.inactivityTimeout);
        if (this.currentTrial < this.TRIAL_COUNT) {
          this.scheduleNextTrial();
        } else {
          this.finishTest();
        }
      }
    },
    startTest() {
      this.popupStore.errorPopupVisible = false;
      this.testState = 'reacting';
      this.currentTrial = 0;
      this.reactionTimes = [];
      this.missedCount = 0;
      this.scheduleNextTrial();
    },
    scheduleNextTrial() {
      this.clearTimeouts();
      this.startTime = 0;
      const delay = Math.random() * 500 + 1000;
      const audioVolume=Math.random()* 0.8 + 0.1;
      const timerId = setTimeout(() => {
        this.playSound(audioVolume);
        this.startTime = Date.now();
        this.setupInactivityTimeout();
      }, delay);
      this.timeoutIds.push(timerId);
    },
    setupInactivityTimeout() {
      this.inactivityTimeout = setTimeout(() => {
        this.missedCount++;
        this.currentTrial++;
        if (this.currentTrial < this.TRIAL_COUNT) {
          this.scheduleNextTrial();
        } else {
          this.finishTest();
        }
      }, 1000);
    },
    playSound(audioVolume) {
      try {
        if (!this.audioContext) {
          this.audioContext = new (window.AudioContext)();
        }
        const oscillator = this.audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(audioVolume, this.audioContext.currentTime);
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.3);
      } catch (error) {
        console.error('Ошибка воспроизведения звука:', error);
        this.finishTest();
      }
    },
    finishTest() {
      this.clearTimeouts();
      this.testState = 'completed';
    },
    failTest(reason) {
      this.popupStore.activateErrorPopup(`Тест провален: ${reason}`);
      this.resetTest();
    },
    resetTest() {
      this.clearTimeouts();
      clearTimeout(this.inactivityTimeout);
      this.testState = 'ready';
      this.reactionTimes = [];
      this.currentTrial = 0;
      this.missedCount = 0;
      this.startTime = 0;
    },
    clearTimeouts() {
      this.timeoutIds.forEach(id => clearTimeout(id));
      this.timeoutIds = [];
    }
  },
  beforeUnmount() {
    this.clearTimeouts();
    clearTimeout(this.inactivityTimeout);
  }
});
</script>

<template>
  <div class="container">
    <h2>Тест на скорость реакции</h2>
    <p class="description">
      Этот тест измеряет время вашей реакции на звуковой сигнал.
      После начала теста вы услышите 120 звуковых сигналов
      с интервалами 2-5 секунд. Как только услышите сигнал -
      как можно быстрее нажмите большую кнопку.
      Старайтесь не нажимать кнопку до сигнала!
    </p>

    <div class="button-wrapper">
      <button
          class="reaction-button"
          :class="{ active: testState === 'reacting' }"
          @click="handleClick"
          :disabled="testState === 'completed'"
      >
        {{ buttonText }}
      </button>
    </div>

    <div v-if="testState === 'completed'" class="results">
      <h2>Результаты:</h2>
      <p>Среднее время: <strong>{{ results.average }} мс</strong></p>
      <p>Стандартное отклонение: <strong>{{ results.deviation }} мс</strong></p>
      <p>Лучшее время: <strong>{{ results.best }} мс</strong></p>
      <p>Худшее время: <strong>{{ results.worst }} мс</strong></p>
      <p>Количество пропусков: <strong>{{ missedCount }}</strong></p>
      <CommonButton class="retry-button" @click="resetTest">
        <template v-slot:placeholder>Пройти заново</template>
      </CommonButton>
    </div>

    <CommonButton
        class="reset-button"
        @click="resetTest"
        v-if="testState === 'reacting'"
    >
      <template v-slot:placeholder>Прервать тест</template>
    </CommonButton>
  </div>
</template>

<style scoped>
.sound-test {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  color: white;
  font-family: Arial, sans-serif;
}

h2{
  font-size: 46px;
  margin-bottom: 20px;
  color: #fff;
}
.container {
  max-width: 800px;
  padding: 2rem;
  text-align: center;
}

.description {
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 15px;
  margin: 20px 0;
  color: black;
}

.button-wrapper {
  margin: 2rem 0;
  perspective: 1000px;
}

.reaction-button {
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: rgba(128, 0, 128, 0.6);
  border: none;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 10px 20px rgba(128, 0, 128, 0.2);
  outline: none;
}

.reaction-button.active {
  background: darkblue;
  color: white;
  transform: scale(1.1);
  box-shadow: 0 15px 40px rebeccapurple;
}

.reaction-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.reset-button {
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 1rem;
  margin: 3rem auto auto;
}


.retry-button {
  margin: auto;
  font-size: 1.2rem;
}


.results {
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

.results h2 {
  margin-bottom: 1rem;
}

.results p {
  margin: 0.5rem 0;
}
</style>


<!--
testState - текущий этап теста=
1 ready - готовность к началу
2 reacting - активный тест
3 completed - завершенный тест
reactionTimes - массив для хранения результатов
TRIAL_COUNT - количество испытаний
currentTrial - текущее испытание
startTime - время начала текущего сигнала
inactivityTimeout - таймер бездействия

scheduleNextTrial():
- Создает случайную задержку (2-5 сек)
- Воспроизводит звук после задержки
- Запоминает время начала сигнала
- Устанавливает таймер бездействия (3 сек)
-->