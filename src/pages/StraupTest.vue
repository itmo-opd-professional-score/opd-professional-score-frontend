<script lang="ts">
import { defineComponent } from 'vue';
import CommonButton from '../components/UI/CommonButton.vue';

type TestState = 'ready' | 'reacting' | 'completed';

export default defineComponent({
  name: 'StraupTest',
  components: { CommonButton },
  data() {
    return {
      colors: ['red', 'green', 'yellow', 'blue', 'purple'],
      currentWord: '',
      currentColor: '',
      levelOfDifficulty: 0,
      score: 0,
      mistakes: 0,
      remainingTimeValue: 0,
      timerIntervalId: null as ReturnType<typeof setInterval> | null,
      testState: 'ready' as TestState,
    };
  },
  props: {
    randomChangeOfDifficulty: { type: Boolean, default: false },
    time: { type: Number, required: true },
    showTimer: { type: Boolean, default: false },
    showFinalResults: { type: Boolean, default: false },
    showPerMinuteResults: { type: Boolean, default: false },
    showProgressBar: { type: Boolean, default: false },
  },
  methods: {
    giveColorName() {
      this.currentWord =
        this.colors[Math.floor(Math.random() * this.colors.length)];
    },
    giveColorOfWord() {
      if (this.currentWord) {
        if (Math.random() < this.givePropabilityOfWordAndColorMatch()) {
          this.currentColor = this.currentWord;
        } else {
          let color;
          do {
            color = this.colors[Math.floor(Math.random() * this.colors.length)];
          } while (color == this.currentWord);
          this.currentColor = color;
        }
      }
    },
    givePropabilityOfWordAndColorMatch() {
      if (this.randomChangeOfDifficulty) {
        return [0.7, 0.4, 0.1][Math.floor(Math.random() * 3)];
      }
      return [0.7, 0.4, 0.1][this.levelOfDifficulty];
    },
    checkAnswer(selectedColor: string) {
      if (this.currentColor === selectedColor) {
        this.score++;
      } else {
        this.mistakes++;
      }
      this.nextRound();
    },
    nextRound() {
      this.giveColorName();
      this.giveColorOfWord();
    },
    startTest() {
      this.testState = 'reacting';
      this.nextRound();
      this.startTimer(this.time);
    },
    startTimer(totalSeconds: number) {
      this.remainingTimeValue = totalSeconds * 1000;
      this.timerIntervalId = setInterval(() => {
        this.remainingTimeValue -= 1000;
        if (this.remainingTimeValue <= 0) {
          this.remainingTimeValue = 0;
          clearInterval(this.timerIntervalId!);
          this.stopTest();
        }
      }, 1000);
    },
    stopTest() {
      this.testState = 'completed';
    },
    resetTest() {
      this.cancelTimer();
      this.testState = 'ready';
      this.score = 0;
      this.mistakes = 0;
      this.currentWord = '';
    },
    cancelTimer() {
      if (this.timerIntervalId) {
        clearInterval(this.timerIntervalId);
        this.timerIntervalId = null;
      }
    },
    remainingTime() {
      const minutes = Math.floor(this.remainingTimeValue / 60000);
      const seconds = Math.floor((this.remainingTimeValue % 60000) / 1000);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    },
    progressBarWidth() {
      if (this.remainingTimeValue === 0) return '0%';
      return `${(1 - this.remainingTimeValue / (this.time * 1000)) * 100}%`;
    },
    clickButton() {
      if (this.testState === 'ready') {
        this.startTest();
      }
    },
  },
});
</script>

<template>
  <div class="container">
    <div class="instruction" v-show="testState == 'ready'">
      <h2 class="title">Тест Струпа</h2>
      <p class="description">
        В этом тесте вам нужно выбрать цвет слова, а не прочитать его. Например,
        если слово "зелёный" написано красным цветом, правильный ответ —
        "красный". Нажимайте на кнопку соответствующего цвета как можно быстрее!
      </p>
      <CommonButton
        class="reaction-button"
        :class="{ active: testState == 'reacting' }"
        :disabled="testState == 'completed'"
        @click="clickButton"
      >
        <template v-slot:placeholder>Начать тест</template>
      </CommonButton>
    </div>
    <div class="test-container" v-show="testState == 'reacting'">
      <div class="info-block" v-if="testState == 'reacting'">
        <div v-if="showTimer" class="timer">
          Осталось времени: {{ remainingTime() }}
        </div>

        <div v-if="showProgressBar" class="progress-bar-container">
          <div
            class="progress-bar"
            :style="{ width: progressBarWidth() }"
          ></div>
        </div>
      </div>
      <div class="current-word">
        <h1 :style="{ color: currentColor }">{{ currentWord }}</h1>
      </div>
      <div class="buttons">
        <CommonButton
          v-for="color in colors"
          :key="color"
          :style="{
            backgroundColor: color,
            color: color === 'yellow' ? 'black' : 'white',
          }"
          class="color-button"
          :disabled="testState === 'completed'"
          @click="checkAnswer(color)"
        >
          <template #placeholder>
            {{ color }}
          </template>
        </CommonButton>
      </div>
    </div>
    <div v-if="testState == 'completed'" class="test-container">
      <h2 class="title">Тест завершен!</h2>
      <p class="result">Правильных ответов: {{ score }}</p>
      <p class="result">Ошибок: {{ mistakes }}</p>
      <CommonButton
        class="reaction-button"
        @click="resetTest"
      >
        <template v-slot:placeholder>Начать заново</template>
      </CommonButton>
    </div>
  </div>


</template>

<style scoped>
.description {
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 15px;
  margin: 20px 0;
  color: black;
}

.title {
  font-size: 36px;
  margin-bottom: 20px;
  color: #fff;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.info-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.progress-bar-container {
  width: 100%;
  height: 8px;
  background-color: #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.5s ease;
}

.timer {
  font-weight: bold;
}

.current-word {
  margin-bottom: 10vh;
  margin-top: 5vh;
}

.timer {
  font-size: 24px;
  color: #fff;
  margin-bottom: 1vh;
}

.progress-bar-container {
  width: 80%;
  height: 10px;
  background-color: #ddd;
  border-radius: 5px;
  margin: 3vh auto;
}

.test-container {
  background: #c1b9f6;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px;
  border-radius: 15px;
  min-height: 50vh;
}

.container {
  max-width: 35vw;
  padding: 2rem;
  text-align: center;
}

.progress-bar {
  height: 100%;
  background-color: #4caf50;
  border-radius: 5px;
  transition: width 0.5s ease;
}

.color-button {
  width: 10vh;
}

.reaction-button {
  display: flex;
  width: 15vh;
  height: 10vh;
  background: rgba(128, 0, 128, 0.6);
  border: none;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  box-shadow: 0 10px 20px rgba(128, 0, 128, 0.2);
  outline: none;
  margin: 3vh auto;
}
.result {
  font-size: 20px;
  color: #333;
  margin: 10px 0;
}
</style>