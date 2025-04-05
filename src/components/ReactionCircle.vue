<script lang="ts">
import {defineComponent} from 'vue'
import CommonButton from "./UI/CommonButton.vue";

export default defineComponent({
name: "ReactionCircle",
  components: {CommonButton},
  data() {
    return {
      radius: 100,
      centerX: 150,
      centerY: 150,
      speed: 0.005,
      angle: 0,
      startTime: performance.now(),
      deviation: null,
      animationFrameId: null
    }
  },
  computed: {
    circleX() {
      return this.centerX - this.radius * Math.cos(this.angle)
    },
    circleY() {
      return this.centerY - this.radius * Math.sin(this.angle)
    }
  },
  methods: {
    animate(time) {
      const elapsed = time - this.startTime
      this.angle = (elapsed * this.speed) % (Math.PI * 2)
      this.animationFrameId = requestAnimationFrame(this.animate)
    }
  },
  mounted() {
    this.animationFrameId = requestAnimationFrame(this.animate)
  },
  unmounted() {
    cancelAnimationFrame(this.animationFrameId)
  }
})

</script>

<template>
  <div class="test-container">
    <svg width="300" height="300">
      <circle cx="150" cy="150" r="100" stroke="black" stroke-width="2" fill="none" />
      <circle :cx="circleX" :cy="circleY" r="10" fill="rgb(128, 0, 128)" />
    </svg>
  </div>
</template>


<style scoped>
.test-container {
  /*background-color: #ffffff;
  display: flex;
  flex-direction: column;
  padding: 15px;
  border-radius: 15px;
  width: 30vw;*/
}
</style>