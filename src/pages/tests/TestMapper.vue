<script setup lang="ts">
import { computed } from 'vue';
import { InvalidTokenError, jwtDecode } from 'jwt-decode';
import type { TestJwt } from './types';
import { usePopupStore } from '../../store/popup.store.ts';
import NotFound from '../NotFound.vue';
import AdditionSoundTest from './addition/sound/AdditionSoundTest.vue';
import AdditionVisualTest from './addition/visual/AdditionVisualTest.vue';
import SimpleSoundTest from './simple/SimpleSoundTest.vue';
import SimpleLightTest from './simple/SimpleLightTest.vue';
import HardLightTest from './hard/HardLightTest.vue';
import SimpleRdoTest from './simple/SimpleRdoTest.vue';
import HardRdoTest from './hard/HardRdoTest.vue';

const props = defineProps<{
  token: string;
}>();
const testComponent = computed(() => {
  try {
    const data = jwtDecode(props.token) as TestJwt;
    switch (data.testType) {
      case 'ADDITION_SOUND':
        return AdditionSoundTest;
      case 'ADDITION_VISUAL':
        return AdditionVisualTest;
      case 'SIMPLE_SOUND':
        return SimpleSoundTest;
      case 'SIMPLE_LIGHT':
        return SimpleLightTest;
      case 'HARD_LIGHT':
        return HardLightTest;
      case 'SIMPLE_RDO':
        return SimpleRdoTest;
      case 'HARD_RDO':
        return HardRdoTest;
      default:
        return NotFound;
    }
  } catch (error: unknown) {
    if (error instanceof InvalidTokenError) {
      const usePopUp = usePopupStore();
      usePopUp.activateErrorPopup(error.message);
    }
    return NotFound;
  }
});
</script>

<template>
  <component :token="token" :is="testComponent"></component>
</template>

<style scoped></style>
