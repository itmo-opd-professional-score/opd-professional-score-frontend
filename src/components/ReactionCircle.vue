<script lang="ts">
import {defineComponent} from 'vue'
import CommonButton from "./UI/CommonButton.vue";

type TestState = 'ready' | 'reacting' | 'completed';

export default defineComponent({
name: "ReactionCircle",
  components: {CommonButton},
  data() {
    return {
      radius: 100,
      centerX: 150,
      centerY: 150,
      speed: 0.005,
      angle: Math.PI / 2,
      startTime: performance.now(),
      deviation:  null as number | null,
      animationFrameId:   null as number | null,
      testState: 'ready' as TestState
    };
  },
  computed: {
    circleX() {
      return this.centerX - this.radius * Math.cos(this.angle)
    },
    circleY() {
      return this.centerY - this.radius * Math.sin(this.angle)
    },
    buttonText():string {
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
    }
  },
  methods: {
    animate(time: number) {
      const elapsed = time - this.startTime
      this.angle = (elapsed * this.speed) % (Math.PI * 2)
      this.animationFrameId = requestAnimationFrame(this.animate)
    },
    startTest() {
      this.testState = 'reacting' as TestState;
      this.startTime = performance.now()
      this.angle = Math.PI / 2
      this.animationFrameId = requestAnimationFrame(this.animate)
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
  <div class="test-container">
    <svg class="circles" width="300" height="300">
      <circle cx="150" cy="150" r="100" stroke="black" stroke-width="2" fill="none" />
      <circle :cx="circleX" :cy="circleY" r="10" fill="rgb(128, 0, 128)" />
    </svg>
    <div class="button-wrapper">
      <CommonButton
          class="reaction-button"
          :class="{ active: testState == 'reacting' }"
          :disabled="testState == 'completed'"
      >
        <template v-slot:placeholder> {{buttonText}}</template>
      </CommonButton>
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
</style>