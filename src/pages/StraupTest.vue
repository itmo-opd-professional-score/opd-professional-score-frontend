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
    remainingTime() {
      const minutes = Math.floor(this.remainingTimeValue / 60000);
      const seconds = Math.floor((this.remainingTimeValue % 60000) / 1000);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    },
    progressBarWidth() {
      if (this.remainingTimeValue === 0) return '0%';
      return `${(1 - this.remainingTimeValue / (this.time * 1000)) * 100}%`;
    },
  },
  mounted() {
    this.startTest();
  },
});
</script>

<template>

  <div class="container">
    <div class="info-block" v-if="testState == 'reacting'">
      <div v-if="showTimer" class="timer">
        Осталось времени: {{ remainingTime() }}
      </div>

      <div v-if="showProgressBar" class="progress-bar-container">
        <div class="progress-bar" :style="{ width: progressBarWidth() }"></div>
      </div>
    </div>

    <h1 :style="{ color: currentColor }">{{ currentWord }}</h1>

    <div class="buttons">
      <CommonButton
        v-for="color in colors"
        :key="color"
        :style="{ backgroundColor: color, color: color === 'yellow' ? 'black' : 'white' }"
        class="reaction-button"
        :disabled="testState === 'completed'"
        @click="checkAnswer(color)"
      >
        <template #placeholder>
          {{ color }}
        </template>
      </CommonButton>
    </div>
  </div>
</template>

<style scoped>
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

.timer {
  font-size: 24px;
  color: #fff;
  margin-bottom: 20px;
}
.progress-bar-container {
  width: 80%;
  height: 10px;
  background-color: #ddd;
  border-radius: 5px;
  margin: 10px auto;
}
.container {
  background: #c1b9f6;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px;
  border-radius: 15px;
  min-height: 50vh;
}
.progress-bar {
  height: 100%;
  background-color: #4CAF50;
  border-radius: 5px;
  transition: width 0.5s ease;
}
.standard-deviation, current-deviation {
  margin-top: 10px;
  font-size: 18px;
  color: #333;
}
</style>