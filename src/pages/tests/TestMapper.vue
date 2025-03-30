<script setup lang="ts">
import {computed} from "vue";
  import {jwtDecode} from "jwt-decode";
import SoundHardTest from "./sound/hard/SoundHardTest.vue";
import type {TestJwt} from "./types";

  const props = defineProps<{
    token: string
  }>()
  const testComponent = computed(() => {
    const data = jwtDecode(props.token) as TestJwt
    switch (data.testType) {
      case "SOUND_ADDITION":
        return SoundHardTest
      default:
        return null
        //TODO default not found component
    }
  })
</script>

<template>
  <component :is="testComponent"></component>
</template>

<style scoped>

</style>