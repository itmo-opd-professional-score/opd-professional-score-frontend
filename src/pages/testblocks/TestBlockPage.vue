<script setup lang="ts">

import { onMounted, ref } from 'vue';
import CommonButton from '../../components/UI/CommonButton.vue';
import router from '../../router/router.ts';
import { useTestBlock } from '../../utils/useTestBlock.ts';
import type { TestType } from '../tests/types';
import { UserState } from '../../utils/userState/UserState.ts';

const props = defineProps<{
  blockId: string,
}>()
const { loadTestBlock, loadMatchedTests } = useTestBlock(parseInt(props.blockId))
const tests = ref<{
  id?: number,
  name: TestType,
  setupId?: number,
  available: boolean,
  testTypeId?: number
}[]>([])
onMounted(async () => {
  const testBlock = await loadTestBlock()
  if (testBlock.value) {
    tests.value = testBlock.value.tests
  }
})
</script>

<template>
  <div class="container">
    <div class="header" v-if="tests.every(test => test.available === false)">
      <h2>Вы успешно прошли весь блок!</h2>
      <h2>Перейдите в профиль и ознакомьтесь с результатами!</h2>
    </div>
    <div class="test-block">
      <div
        v-for="(test, index) in tests"
        :key="index"
        class="test-block-element"
      >
        <p class="test-name">Тест {{ test.name }}</p>
        <CommonButton
          v-if="test.id && test.testTypeId"
          class="submit_button"
          @click="router.push(`/test/results/${test.testTypeId}/${test.id}`)"
        >
          <template v-slot:placeholder>Результаты</template>
        </CommonButton>
        <CommonButton
          :disabled="!test.available"
          class="submit_button"
          @click="router.push(`/testBlock/${blockId}/test/${test.name}`)"
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
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 3vw;

    .header {
      max-width: 50%;

      h2 {
        color: white;
      }
    }

    .test-block {
      width: 50%;
      max-height: 79%;
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