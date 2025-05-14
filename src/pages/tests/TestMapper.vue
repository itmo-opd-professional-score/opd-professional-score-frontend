<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { TestType } from './types';
import NotFound from '../NotFound.vue';
import AdditionSoundTest from './addition/sound/AdditionSoundTest.vue';
import AdditionVisualTest from './addition/visual/AdditionVisualTest.vue';
import SimpleSoundTest from './simple/SimpleSoundTest.vue';
import SimpleLightTest from './simple/SimpleLightTest.vue';
import HardLightTest from './hard/HardLightTest.vue';
import SimpleRdoTest from './simple/SimpleRdoTest.vue';
import HardRdoTest from './hard/HardRdoTest.vue';
import SimpleTrackingTest from './simple/SimpleTrackingTest.vue';
import HardTrackingTest from './hard/HardTrackingTest.vue';
import NumericalSeriesTest from './cognitive/NumericalSeriesTest.vue';
import StroopTest from './cognitive/StroopTest.vue';
import VerbalTest from './cognitive/VerbalTest.vue';
import { useTestBlock } from '../../utils/useTestBlock.ts';

const testSetupId = ref<string>('')
const props = defineProps<{
  blockId: string;
  testTypeName: string;
}>();
const testComponent = computed(() => {
  switch (props.testTypeName as TestType) {
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
    case 'SIMPLE_TRACKING':
      return SimpleTrackingTest;
    case 'HARD_TRACKING':
      return HardTrackingTest;
    case 'NUMERICAL':
      return NumericalSeriesTest;
    case 'STROOP':
      return StroopTest;
    case 'VERBAL':
      return VerbalTest;
    default:
      return NotFound;
  }
});

onMounted(async () => {
  const { loadTestBlock } = useTestBlock(parseInt(props.blockId))
  const testBlock = await loadTestBlock()
  if (testBlock.value) {
    const test = testBlock.value.tests.find(test => test.name === props.testTypeName)
    if (test && test.available) {
      testSetupId.value = test.setupId ? test.setupId?.toString() : '-1'
    }
  }
})
</script>

<template>
  <component
    v-if="testSetupId !== ''"
    :test-block-id="blockId"
    :setup-id="testSetupId"
    :is="testComponent"
  />
</template>

<style scoped></style>
