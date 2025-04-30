<script setup lang="ts">

import { onMounted, ref } from 'vue';
import { TestBlockResolver } from '../../api/resolvers/testBlocks/test-block.resolver.ts';
import { jwtDecode } from 'jwt-decode';
import CommonButton from '../../components/UI/CommonButton.vue';
import router from '../../router/router.ts';
import type { TestBlockJwt, TestBlockTest } from './types';
import { usePopupStore } from '../../store/popup.store.ts';

const props = defineProps<{
  testBlockId: string,
  testBlockToken: string,
  token?: string
}>()
const token = ref<string | undefined>(props.token);
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
  } else token.value = props.token
  if (token.value) {
    if (token.value !== props.token) await router.push('/profile')
    testTypes.value = (jwtDecode(token.value) as TestBlockJwt).tests
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
      <p class="test-name">Тест {{ testType.name }}</p>
      <CommonButton
        :disabled="!testType.available"
        class="submit-button"
        @click="router.push(`/testBlock/${testBlockId}/test/${testType.name}`)"
      >
        <template v-slot:placeholder></template>
      </CommonButton>
    </div>
  </div>
</template>

<style scoped>

</style>