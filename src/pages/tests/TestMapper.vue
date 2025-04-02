<script setup lang="ts">
import {computed} from "vue";
import {InvalidTokenError, jwtDecode} from "jwt-decode";
import type {TestJwt} from "./types";
import {usePopupStore} from "../../store/popup.store.ts";
import NotFound from "../NotFound.vue";
import AdditionSoundTest from "./addition/sound/AdditionSoundTest.vue";
import AdditionVisualTest from "./addition/visual/AdditionVisualTest.vue";

  const props = defineProps<{
    token: string
  }>()
  const testComponent = computed( () => {
    try {
      const data = jwtDecode(props.token) as TestJwt
      switch (data.testType) {
        case "SOUND_ADDITION":
          return AdditionSoundTest
        case "VISUAL_ADDITION":
          return AdditionVisualTest;
        default:
          return NotFound
      }
    } catch (error: unknown) {
      if (error instanceof InvalidTokenError) {
        const usePopUp = usePopupStore()
        usePopUp.activateErrorPopup(error.message)
      }
      return NotFound
    }
  })
</script>

<template>
  <component :token="token" :is="testComponent"></component>
</template>

<style scoped>

</style>