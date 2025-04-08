<template>
  <div>
    <h2>Тест на скорость реакции с тремя шарами</h2>
    <button @click="startAllBalls" class="start-button">Старт</button>
    <div class="balls-row">
      <div v-for="(ball, index) in balls" :key="index" class="ball-container">
        <ReactionCircle ref="reactionCircle" :time="time" />
        <CommonButton
          class="reaction-button"
          :disabled="ball.state === 'completed'"
          @click="handleButtonClick(index)"
        >
          {{ ball.buttonText }}
        </CommonButton>
        <div v-if="ball.currentDeviation" class="current-deviation">
          Текущее отклонение: {{ ball.currentDeviation }} мс
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ReactionCircle from "../components/ReactionCircle.vue";
import CommonButton from "../components/UI/CommonButton.vue";

type BallState = 'ready' | 'reacting' | 'completed';

export default defineComponent({
  name: "MultiReactionTest",
  components: { CommonButton, ReactionCircle },
  data() {
    return {
      time: 60,
      balls: [
        { state: 'ready' as BallState, currentDeviation: null as number | null, buttonText: 'Начать 1-й тест', speed: 0.001 },
        { state: 'ready' as BallState, currentDeviation: null as number | null, buttonText: 'Начать 2-й тест', speed: 0.0015 },
        { state: 'ready' as BallState, currentDeviation: null as number | null, buttonText: 'Начать 3-й тест', speed: 0.002 },
      ],
    };
  },
  methods: {
    startAllBalls() {
      this.balls.forEach((ball, index) => {
        ball.state = 'reacting';
        ball.currentDeviation = null;

        const reactionCircle = this.$refs.reactionCircle[index] as any;
        reactionCircle.startAnimation();

        setTimeout(() => {
          reactionCircle.speed = ball.speed;
        }, 0);
      });
    },
    handleButtonClick(index: number) {
      const ball = this.balls[index];
      if (ball.state === 'reacting') {
        const currentTime = performance.now();
        const reactionCircle = this.$refs.reactionCircle[index] as any;
        reactionCircle.clickButton(currentTime);
        const deviation = reactionCircle.deviation;
        ball.currentDeviation = deviation;
        console.log(`Отклонение для шара ${index + 1}: ${deviation} мс`);
        ball.state = 'completed';
      }
    },
  },
});
</script>

<style scoped>
.balls-row {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.ball-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 20px;
}

.start-button {
  margin-bottom: 20px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.start-button:hover {
  background-color: #45a049;
}
</style>
