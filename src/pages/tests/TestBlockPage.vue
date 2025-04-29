<script setup lang="ts">

import { onMounted, ref } from 'vue';
import { TestBlockResolver } from '../../api/resolvers/testBlocks/test-block.resolver.ts';
import { jwtDecode } from 'jwt-decode';
import CommonButton from '../../components/UI/CommonButton.vue';
import router from '../../router/router.ts';
import type { TestBlockJwt, TestType } from './types';
import { usePopupStore } from '../../store/popup.store.ts';
import { TestResolver } from '../../api/resolvers/test/test.resolver.ts';

const props = defineProps<{
  testBlockId: string,
  token?: string
}>()
const token = ref<string | undefined>(props.token);
const testResolver = new TestResolver()
const testBlockResolver = new TestBlockResolver()
const usePopUp = usePopupStore()
const testTypes = ref<{testName: string, available: boolean, token: string}[]>([])
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
  } else token.value = props.token
  if (token.value) {
    const testBlockData = jwtDecode(token.value) as TestBlockJwt
    for (const test of testBlockData.tests) {
      const token = await testResolver.generateTestLink({testType: test as TestType})
      if (token !== null) {
        testTypes.value.push({
          testName: test,
          available: true,
          token: token,
        });
      }
    }
    localStorage.setItem("currentTestBlock", JSON.stringify(testTypes.value))
  }
})
</script>

<template>
  <div class="container">
    <div
      v-for="(testType, index) in testTypes"
      :key="index"
      class="test-block-element"
    >
      <p class="test-name">Тест {{ testType.testName }}</p>
      <CommonButton
        :disabled="!testType.available"
        class="submit-button"
        @click="router.push(`/invitation/test/${testType.token}`)"
      >
        <template v-slot:placeholder></template>
      </CommonButton>
    </div>
  </div>
</template>

<style scoped>

</style>