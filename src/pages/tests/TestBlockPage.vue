<script setup lang="ts">

import { onMounted, ref } from 'vue';
import CommonButton from '../../components/UI/CommonButton.vue';
import router from '../../router/router.ts';
import { useTestBlock } from '../../utils/useTestBlock.ts';

const props = defineProps<{
  blockId: string,
}>()
const testTypes = ref()
onMounted(async () => {
  const { testBlock } = await useTestBlock(parseInt(props.blockId))
  if (testBlock.value) testTypes.value = testBlock.value.tests
  else console.log(props.blockId)
})
</script>

<template>
  <div class="container">
    <div class="test-block">
      <div
        v-for="(testType, index) in testTypes"
        :key="index"
        class="test-block-element"
      >
        <p class="test-name">Тест {{ testType.name }}</p>
        <CommonButton
          :disabled="!testType.available"
          class="submit_button"
          @click="router.push(`/testBlock/${blockId}/test/${testType.name}`)"
        >
          <template v-slot:placeholder>Пройти тест</template>
        </CommonButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .container {
    width: 100vw;
    height: 70vh;
    display: flex;
    justify-content: center;
    align-items: center;

    .test-block {
      width: 50%;
      height: 79%;
      overflow-y: scroll;
      background-color: var(--background-primary);
      padding: 2vw;
      border-radius: 15px;
      display: flex;
      flex-direction: column;
      gap: 2vw;

      .test-block-element {
        display: flex;
        align-items: center;
        width: 100%;
        background-color: var(--background-secondary);
        padding: 1vw;
        border-radius: 15px;

        .submit_button {
          margin-left: auto;
        }
      }
    }
  }
</style>