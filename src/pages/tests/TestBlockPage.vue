<script setup lang="ts">

import { onMounted, ref } from 'vue';
import { TestBlockResolver } from '../../api/resolvers/testBlocks/test-block.resolver.ts';
import { jwtDecode } from 'jwt-decode';
import CommonButton from '../../components/UI/CommonButton.vue';
import router from '../../router/router.ts';
import type { TestBlockJwt, TestBlockTest } from './types';
import { usePopupStore } from '../../store/popup.store.ts';
import { UserState } from '../../utils/userState/UserState.ts';

const props = defineProps<{
  testBlockId: string,
  testBlockToken: string,
}>()
const token = ref<string | undefined>(props.testBlockToken);
const testBlockResolver = new TestBlockResolver()
const usePopUp = usePopupStore()
const testTypes = ref<TestBlockTest[]>([])
onMounted(async () => {
  if (!token.value) {
    if (props.testBlockId) {
      try {
        const testBlockId = !isNaN(parseInt(props.testBlockId)) ? parseInt(props.testBlockId) : -1
        token.value = (await testBlockResolver.getById(testBlockId)).testBlockToken
      } catch (error) {
        await router.replace({ name: 'NotFound' })
      }
    } else usePopUp.activateErrorPopup("Test Block token isn't specified!")
  } else token.value = props.testBlockToken
  if (token.value) {
    if (token.value !== props.testBlockToken) await router.push('/profile')
    const testBlockData = jwtDecode(token.value) as TestBlockJwt
    if (testBlockData.userId === 999999 && !UserState.id ||
    testBlockData.userId === UserState.id) {
      testTypes.value = testBlockData.tests
    } else await router.push('/profile')
  }
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
          @click="router.push(`/testBlock/${testBlockId}/test/${testType.name}`)"
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