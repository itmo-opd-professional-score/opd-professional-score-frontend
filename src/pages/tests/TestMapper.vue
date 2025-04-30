<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { jwtDecode } from 'jwt-decode';
import type { TestBlockJwt, TestType } from './types';
import { usePopupStore } from '../../store/popup.store.ts';
import NotFound from '../NotFound.vue';
import AdditionSoundTest from './addition/sound/AdditionSoundTest.vue';
import AdditionVisualTest from './addition/visual/AdditionVisualTest.vue';
import SimpleSoundTest from './simple/SimpleSoundTest.vue';
import SimpleLightTest from './simple/SimpleLightTest.vue';
import HardLightTest from './hard/HardLightTest.vue';
import SimpleRdoTest from './simple/SimpleRdoTest.vue';
import HardRdoTest from './hard/HardRdoTest.vue';
import { TestBlockResolver } from '../../api/resolvers/testBlocks/test-block.resolver.ts';
import router from '../../router/router.ts';

const usePopUp = usePopupStore()
const testSetupId = ref<number | undefined>(undefined)
const props = defineProps<{
  testBlockId: string;
  testTypeName: string;
}>();
const testComponent = computed(() => {
  switch (props.testTypeName) {
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
});

onMounted(async () => {
  try {
    const testBlockId = !isNaN(parseInt(props.testBlockId)) ? parseInt(props.testBlockId) : -1;
    if (testBlockId < 0) usePopUp.activateErrorPopup("Test Block id is incorrect!");
    else {
      const testBlockToken = (await new TestBlockResolver().getById(testBlockId)).testBlockToken
      const data = jwtDecode(testBlockToken) as TestBlockJwt
      const test = data.tests.find(test => test.name === props.testTypeName)
      if (test && test.available) testSetupId.value = test.setupId
      else await router.push(`/testBlock/${testBlockId}`)
    }
  } catch (error) {}
})
</script>

<template>
  <component
    :test-block-id="testBlockId"
    :setup-id="testSetupId"
    :is="testComponent"
  />
</template>

<style scoped></style>
