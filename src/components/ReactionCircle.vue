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
      speed: 0.001,
      angle: -Math.PI / 2,
      initialAngle: -Math.PI / 2,
      startTime: 0,
      deviation:  null as number | null,
      animationFrameId:   null as number | null,
      testState: 'ready' as TestState
    };
  },
  props: {
    time: {
      type: Number,
      required: true
    }
  },
  computed: {
    circleX() {
      return this.centerX + this.radius * Math.cos(this.angle)
    },
    circleY() {
      return this.centerY + this.radius * Math.sin(this.angle)
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
      const elapsed = time - this.startTime;
      this.angle = (this.initialAngle + elapsed * this.speed) % (Math.PI * 2);
      this.animationFrameId = requestAnimationFrame(this.animate);
    },
    startTest() {
      this.testState = 'reacting' as TestState;
      this.startTime = performance.now();
      this.initialAngle = -Math.PI / 2;
      this.angle = this.initialAngle;
      this.animationFrameId = requestAnimationFrame(this.animate);
    },
    clickButton() {
      if(this.testState === 'ready') {
        this.startTest();
      } else if (this.testState === 'reacting') {
      } else {

      }
    }
  },
})

</script>

<template>
  <div class="test-container">
    <svg class="circles" width="300" height="300">
      <circle cx="150" cy="150" r="100" stroke="black" stroke-width="2" fill="none" />
      <circle  cx="150" cy="50" r="10" fill="rgb( 0,128,0)"/>
      <circle :cx="circleX" :cy="circleY" r="10" fill="rgb(128, 0, 128)" />
    </svg>
  </div>

</template>


<style scoped>
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
</style>