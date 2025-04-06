<script lang="ts">
import { defineComponent } from 'vue'
import ReactionCircle from "../components/ReactionCircle.vue";
import CommonButton from "../components/UI/CommonButton.vue";

type TestState = 'ready' | 'reacting' | 'completed';

export default defineComponent({
  name: "SimpleReactionTest",

  components: { CommonButton, ReactionCircle },

  data() {
    return {
      radius: 100,
      centerX: 150,
      centerY: 150,
      speed: 0.001,
      angle: -Math.PI / 2,
      initialAngle: -Math.PI / 2,
      startTime: 0,
      deviation: null as number | null,
      deviationHistory: [] as number[],
      currentDeviation: null as number | null,
      animationFrameId: null as number | null,
      testState: 'ready' as TestState,
      timerIntervalId: null as number | null, // Для отслеживания ID интервала
      remainingTimeValue: 0, // Первоначальное значение оставшегося времени
    };
  },
  props: {
    time: {
      type: Number,
      required: true
    },
    showTimer: {
      type: Boolean,
      default: false
    },
    showFinalResults: {
      type: Boolean,
      default: false
    },
    showPerMinuteResults: {
      type: Boolean,
      default: false
    },
    showProgressBar: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    circleX() {
      return this.centerX + this.radius * Math.cos(this.angle)
    },
    circleY() {
      return this.centerY + this.radius * Math.sin(this.angle)
    },
    buttonText(): string {
      switch (this.testState) {
        case 'ready':
          return 'Начать тест';
        case 'reacting':
          return 'Жмите';
        case 'completed':
          return 'Тест окончен';
        default:
          return '';
      }
    },
    remainingTime(): string | null {
      if (this.testState === 'completed') return null;
      const minutes = Math.floor(this.remainingTimeValue / 60000);
      const seconds = Math.floor((this.remainingTimeValue % 60000) / 1000);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    },
    progressBarWidth(): string {
      if (this.remainingTimeValue === 0) return '0%';
      const totalSeconds = 2 * 60;
      const progress = (1 - (this.remainingTimeValue / (totalSeconds * 1000))) * 100;
      return `${progress}%`;
    },
  },
  methods: {
    animate(time: number) {
      if (this.testState !== 'reacting') {
        cancelAnimationFrame(this.animationFrameId as number);
        return;
      }
      const elapsed = time - this.startTime;
      this.angle = (this.initialAngle + elapsed * this.speed) % (Math.PI * 2);
      if (elapsed >= this.time * 1000) {
        this.testState = 'completed';
        cancelAnimationFrame(this.animationFrameId as number);
      } else {
        this.animationFrameId = requestAnimationFrame(this.animate);
      }
    },
    startTest() {
      this.testState = 'reacting';
      this.startTime = performance.now();
      this.initialAngle = -Math.PI / 2;
      this.angle = this.initialAngle;
      this.animationFrameId = requestAnimationFrame(this.animate);
      this.startTimer(2 * 60);
      (this.$refs.reactionCircle as any).startAnimation();
    },
    clickButton() {
      if (this.testState === 'ready') {
        this.startTest();
      } else if (this.testState === 'reacting') {
        const currentTime = performance.now();
        const reactionCircle = this.$refs.reactionCircle as any;
        reactionCircle.clickButton(currentTime);
        const deviation = reactionCircle.deviation;
        this.currentDeviation = deviation;
        this.deviationHistory.push(deviation);
        console.log(`Текущее отклонение: ${deviation} мс`);
        reactionCircle.speed *= 1.1;
        reactionCircle.cancelAnimation();
        reactionCircle.startAnimation();
      } else if (this.testState === 'completed') {
        return;
      }
    },
    startTimer(totalSeconds: number) {
      this.remainingTimeValue = totalSeconds * 1000;
      this.timerIntervalId = setInterval(() => {
        this.remainingTimeValue -= 1000;
        if (this.remainingTimeValue <= 0) {
          this.remainingTimeValue = 0;
          clearInterval(this.timerIntervalId as number);
          this.testState = 'completed';
        }
      }, 1000); // Обновлять каждую секунду
    },
    cancelTimer() {
      if (this.timerIntervalId) {
        clearInterval(this.timerIntervalId);
        this.timerIntervalId = null;
      }
    },
  },
  beforeUnmount() {
    if (this.timerIntervalId) {
      clearInterval(this.timerIntervalId);
    }
  },
})
</script>

<template>
  <div class="container">
  <h2 class="title">Тест на скорость реакции на движущиеся объекты</h2>
    <p class="description">
      Этот тест измеряет время вашей реакции на движущийся объект.
      После начала теста фиолетовый круг начнет двигаться. Как только он будет находиться в начале своего пути (верхняя точка траектории) - как
      можно быстрее нажмите большую кнопку. Старайтесь не нажимать кнопку до или после этой зоны!
    </p>
    <div v-if="showTimer" class="timer">
      Осталось времени: {{ remainingTime }}
    </div>
    <div v-if="showProgressBar" class="progress-bar-container">
      <div class="progress-bar" :style="{ width: progressBarWidth }"></div>
    </div>
  <div class="test-container">
    <ReactionCircle ref="reactionCircle" :time="time"></ReactionCircle>
    <div class="button-wrapper">
      <CommonButton
          class="reaction-button"
          :class="{ active: testState == 'reacting' }"
          :disabled="testState == 'completed'"
          @click="clickButton"
      >
        <template v-slot:placeholder> {{buttonText}}</template>
      </CommonButton>
      <div v-if="currentDeviation" class="current-deviation">
        Текущее отклонение: {{ currentDeviation }} мс
      </div>
    </div>
  </div>
  </div>

</template>


<style scoped>
.title {
  font-size: 46px;
  margin-bottom: 20px;
  color: #fff;
}
.description {
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 15px;
  margin: 20px 0;
  color: black;
}
.container {
  max-width: 35vw;
  padding: 2rem;
  text-align: center;
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
.circles {
  display: flex;
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
  margin: 0 auto;
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

.progress-bar {
  height: 100%;
  background-color: #4CAF50;
  border-radius: 5px;
  transition: width 0.5s ease;
}
</style>