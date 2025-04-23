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
    randomChangeOfDifficulty: {
      type: Boolean,
      default: false,
    },
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
    checkAnswer (selectedColor: string) {
      if(this.currentWord === selectedColor) {
        this.score++;
      } else {
        this.mistakes++;
      }
      this.nextRound()
    },
    nextRound() {
      this.giveColorName();
      this.giveColorOfWord();
    },
    startTest() {
      this.testState = 'reacting'
      this.nextRound();
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
      this.testState = 'completed'
    }
  },
});
</script>

<template>
  <div class="container">
    <h1 :style="{ color: currentColor }">{{ currentWord }}</h1>
    <div class = "buttons">
      <CommonButton
        v-for="color in colors"
        :key="color"
      :style="{ backgroundColor: color }">
      </CommonButton>
    </div>
  </div>
</template>

<style scoped></style>