<script lang="ts">
import { defineComponent } from 'vue';
import ReactionCircle from '../components/ReactionCircle.vue';
import CommonButton from '../components/UI/CommonButton.vue';

interface ReactionCircleInstance {
  startAnimation(): void;
  cancelAnimation(): void;
  clickButton(time: number): void;
  speed: number;
  deviation: number;
  startTime: number;
}

export default defineComponent({
  name: 'MultiReactionTest',
  components: { ReactionCircle, CommonButton },
  data() {
    return {
      balls: [
        { id: 1, speed: 0.001, deviations: [] as number[], currentDeviation: null as number | null },
        { id: 2, speed: 0.0015, deviations: [] as number[], currentDeviation: null as number | null },
        { id: 3, speed: 0.0009, deviations: [] as number[], currentDeviation: null as number | null },
      ],
      testStarted: false,
      testEnded: false,
    };
  },
  computed: {
    standardDeviations() {
      return this.balls.map((ball) => {
        const n = ball.deviations.length;
        if (n < 2) return null;
        const mean = ball.deviations.reduce((a, b) => a + b, 0) / n;
        const variance = ball.deviations.reduce((sum, d) => sum + (d - mean) ** 2, 0) / (n - 1);
        return Math.sqrt(variance);
      });
    }
  },
  methods: {
    startTest() {
      this.testStarted = true;
      this.testEnded = false;

      this.balls.forEach((ball, index) => {
        const circle = (this.$refs.reactionCircles as ReactionCircleInstance[])[index];
        circle.startAnimation();
        ball.deviations = [];
        ball.currentDeviation = null;
      });

      setTimeout(() => {
        this.testEnded = true;
        this.balls.forEach((_, index) => {
          const circle = (this.$refs.reactionCircles as ReactionCircleInstance[])[index];
          circle.cancelAnimation();
        });
      }, 20000); // 20 секунд
    },
    handleClick(index: number) {
      if (!this.testStarted || this.testEnded) return;

      const currentTime = performance.now();
      const circle = (this.$refs.reactionCircles as ReactionCircleInstance[])[index];
      circle.clickButton(currentTime);
      const deviation = circle.deviation;

      this.balls[index].currentDeviation = deviation;
      this.balls[index].deviations.push(deviation);

      circle.cancelAnimation();
      circle.startAnimation();
    }
  }
});
</script>

<template>
  <div class="container">
    <h2 class="title">Множественный тест на реакцию</h2>
    <p class="description">Нажимайте на кнопку под каждым кругом, когда круг достигнет верхней точки (зелёный маркер).</p>
    <CommonButton
      v-if="!testStarted || testEnded"
      class="start-button"
      @click="startTest"
    >
      <template v-slot:placeholder>Начать тест</template>
    </CommonButton>

    <div class="circles-wrapper">
      <div
        v-for="(ball, index) in balls"
        :key="ball.id"
        class="circle-container"
      >
        <ReactionCircle
          ref="reactionCircles"
          :time="5"
          :speed="ball.speed"
        />
        <CommonButton
          class="reaction-button"
          :disabled="!testStarted || testEnded"
          @click="handleClick(index)"
        >
          <template v-slot:placeholder>Жми!</template>
        </CommonButton>
        <div v-if="ball.currentDeviation !== null" class="current-deviation">
          Текущее отклонение: {{ ball.currentDeviation.toFixed(2) }} мс
        </div>
        <div
          v-if="standardDeviations[index] !== null && testEnded"
          class="standard-deviation"
        >
          Стандартное отклонение: {{ standardDeviations[index]?.toFixed(2) }} мс
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 100%;
  margin: 0 auto;
  text-align: center;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 36px;
  margin-bottom: 1rem;
  color: #fff;
}

.description {
  background: #fff;
  color: #000;
  padding: 1rem;
  margin-bottom: 2rem;
  border-radius: 12px;
  max-width: 800px;
}

.circles-wrapper {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
  width: 100%;
  padding: 1rem;
  margin: 0 auto;
}

.circle-container {
  background: #e0d6fd;
  padding: 1rem;
  border-radius: 15px;
  width: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.start-button {
  margin-bottom: 2rem;
  padding: 0.75rem 2rem;
  font-size: 18px;
  background-color: #4CAF50;
  color: white;
  border-radius: 8px;
}
</style>