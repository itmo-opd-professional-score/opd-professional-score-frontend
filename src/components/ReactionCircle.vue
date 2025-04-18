<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: "ReactionCircle",
  data() {
    return {
      radius: 100,
      centerX: 150,
      centerY: 150,
      speed: 0.001,
      angle: Math.PI / 2,
      initialAngle: Math.PI / 2,
      startTime: 0,
      deviation: null as number | null,
      animationFrameId: null as number | null,
      isMoving: false,
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
      return this.centerX + this.radius * Math.cos(this.angle);
    },
    circleY() {
      return this.centerY + this.radius * Math.sin(this.angle);
    },
  },
  methods: {
    animate(time: number) {
      if (!this.isMoving) return;
      const elapsed = time - this.startTime;
      this.angle = (this.initialAngle + elapsed * this.speed) % (Math.PI * 2);
      this.animationFrameId = requestAnimationFrame(this.animate);
    },
    startAnimation() {
      this.isMoving = true;
      this.startTime = performance.now();
      this.initialAngle = Math.PI / 2;
      this.angle = this.initialAngle;
      this.animationFrameId = requestAnimationFrame(this.animate);
    },
    cancelAnimation() {
      if (this.animationFrameId != null) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
      this.isMoving = false;
    },
    clickButton(time: number) {
      const idealTime = this.startTime + (Math.PI / this.speed);
      this.deviation = idealTime - time;
    },
  },
  beforeUnmount() {
    this.cancelAnimation();
  }
});
</script>

<template>
  <div class="container">
    <svg class="circles" width="300" height="300">
      <circle cx="150" cy="150" r="100" stroke="black" stroke-width="2" fill="none" />
      <circle cx="150" cy="50" r="10" fill="rgb(0,128,0)"/>
      <circle :cx="circleX" :cy="circleY" r="10" fill="rgb(128, 0, 128)" />
    </svg>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px;
  border-radius: 15px;
}
.circles {
  display: flex;
}
</style>