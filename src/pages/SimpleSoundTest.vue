<script lang="ts">
import type { SimpleSoundTestInputDto } from '../api/resolvers/test/dto/input/simple-sound-test-input.dto.ts';
import { defineComponent } from 'vue';
import { usePopupStore } from '../store/popup.store.ts';
import CommonButton from '../components/UI/CommonButton.vue';

type TestState = 'ready' | 'reacting' | 'completed';

export default defineComponent({
  name: 'SimpleSoundTest',
  components: { CommonButton },
  data() {
    return {
      userId: -1,
      testState: 'ready' as TestState,
      audioContext: null as AudioContext | null,
      reactionTimes: [] as number[],
      timeoutIds: [] as number[],
      TRIAL_COUNT: 120,
      currentTrial: 0,
      startTime: 0,
      inactivityTimeout: null as number | null,
      popupStore: usePopupStore(),
      missedCount: 0,
    };
  },
  computed: {
    buttonText(): string {
      switch (this.testState) {
        case 'ready':
          return 'Начать тест';
        case 'reacting':
          return 'Ждите сигнала';
        case 'completed':
          return 'Тест окончен';
        default:
          return '';
      }
    },
    results(): {
      average: number;
      deviation: number;
      best: number;
      worst: number;
    } {
      const times = this.reactionTimes;
      if (!times.length) return { average: 0, deviation: 0, best: 0, worst: 0 };
      const average = Math.round(
        times.reduce((a, b) => a + b, 0) / times.length,
      );
      const variance =
        times.reduce((acc, val) => acc + Math.pow(val - average, 2), 0) /
        times.length;
      const deviation = Math.round(Math.sqrt(variance));
      return {
        average,
        deviation,
        best: Math.min(...times),
        worst: Math.max(...times),
      };
    },
    testResultDto(): SimpleSoundTestInputDto {
      return {
        userId: this.userId,
        averageCallbackTime: this.results.average,
        allSignals: this.TRIAL_COUNT,
        mistakes: this.missedCount,
        dispersion: this.results.deviation,
      };
    },
  },
  methods: {
    handleClick() {
      if (this.testState == 'ready') {
        this.startTest();
      } else if (this.testState == 'reacting') {
        if (this.startTime == 0) {
          this.missedCount++;
          this.currentTrial++;
          return;
        }
        const reactionTime = Date.now() - this.startTime;
        this.reactionTimes.push(reactionTime);
        this.currentTrial++;
        clearTimeout(this.inactivityTimeout!);
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
      const delay = Math.random() * 700 + 300;
      const audioVolume = Math.random() * 0.8 + 0.1;
      const timerId = setTimeout(() => {
        this.playSound(audioVolume);
        this.startTime = Date.now();
        this.setupInactivityTimeout();
      }, delay);
      this.timeoutIds.push(timerId);
    },
    setupInactivityTimeout() {
      this.inactivityTimeout = window.setTimeout(() => {
        this.missedCount++;
        this.currentTrial++;
        if (this.currentTrial < this.TRIAL_COUNT) {
          this.scheduleNextTrial();
        } else {
          this.finishTest();
        }
      }, 1000);
    },
    playSound(audioVolume: number) {
      try {
        const context = this.audioContext || new window.AudioContext();
        this.audioContext = context;
        const oscillator = this.audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1000, context.currentTime);
        const gainNode = context.createGain();
        gainNode.gain.setValueAtTime(audioVolume, context.currentTime);
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        oscillator.start();
        oscillator.stop(context.currentTime + 0.3);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Неизвестная ошибка воспроизведения';
        this.popupStore.activateErrorPopup(
          `Ошибка воспроизведения звука: ${message}`,
        );
        this.finishTest();
      }
    },
    finishTest() {
      this.clearTimeouts();
      this.testState = 'completed';
    },
    resetTest() {
      this.clearTimeouts();
      clearTimeout(this.inactivityTimeout!);
      this.testState = 'ready';
      this.reactionTimes = [];
      this.currentTrial = 0;
      this.missedCount = 0;
      this.startTime = 0;
    },
    clearTimeouts() {
      this.timeoutIds.forEach((id) => clearTimeout(id));
      this.timeoutIds = [];
    },
  },
  beforeUnmount() {
    this.clearTimeouts();
    clearTimeout(this.inactivityTimeout!);
  },
});
</script>

<template>
  <div class="container">
    <h2 class="title">Тест на скорость реакции</h2>
    <p class="description">
      Этот тест измеряет время вашей реакции на звуковой сигнал. После начала
      теста вы услышите 120 звуковых сигналов. Как только услышите сигнал - как
      можно быстрее нажмите большую кнопку. Старайтесь не нажимать кнопку до
      сигнала!
    </p>

    <div class="button-wrapper">
      <CommonButton
        class="reaction-button"
        :class="{ active: testState == 'reacting' }"
        @click="handleClick"
        :disabled="testState == 'completed'"
      >
        <template v-slot:placeholder> {{ buttonText }}</template>
      </CommonButton>
    </div>

    <div v-if="testState == 'completed'" class="results">
      <h2 class="title">Результаты:</h2>
      <p>
        Среднее время: <strong>{{ results.average }} мс</strong>
      </p>
      <p>
        Стандартное отклонение: <strong>{{ results.deviation }} мс</strong>
      </p>
      <p>
        Лучшее время: <strong>{{ results.best }} мс</strong>
      </p>
      <p>
        Худшее время: <strong>{{ results.worst }} мс</strong>
      </p>
      <p>
        Количество пропусков: <strong>{{ missedCount }}</strong>
      </p>
      <CommonButton class="retry-button" @click="resetTest">
        <template v-slot:placeholder>Пройти заново</template>
      </CommonButton>
    </div>

    <CommonButton
      class="reset-button"
      @click="resetTest"
      v-if="testState == 'reacting'"
    >
      <template v-slot:placeholder>Прервать тест</template>
    </CommonButton>
  </div>
</template>

<style scoped>
.title {
  font-size: 46px;
  margin-bottom: 20px;
  color: #fff;
}

.container {
  max-width: 35vw;
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
  width: 40vh;
  height: 40vh;
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
  margin: auto;
}

.reaction-button.active {
  transform: scale(1.1);
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

.results {
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
}

.results h2 {
  margin-bottom: 1rem;
}

.results p {
  color: white;
}

.retry-button {
  margin: 1rem auto;
}
</style>
