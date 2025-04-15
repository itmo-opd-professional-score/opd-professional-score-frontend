<script setup lang="ts">
import CommonButton from './CommonButton.vue';
import { TestBlockResolver } from '../../api/resolvers/testBlocks/test-block.resolver.ts';
import { jwtDecode } from 'jwt-decode';
import { ref } from 'vue';
import router from '../../router/router.ts';

interface TestBlockJwt {
  tests: string,
  iat: number,
  exp: number
}

const testLink = (testType: string) => {
  return `/test/${testType.split('_')[0].toLowerCase()}/${testType.split('_')[1].toLowerCase()}`
}

const props = defineProps<{
  blockId: number
}>()

const isOpen = ref<boolean>(false);
const testsTypes = ref<string[]>()
const testBlockResolver = new TestBlockResolver()
const openBlock = async () => {
  const testBlock = await testBlockResolver.getById(props.blockId)
  testsTypes.value = (jwtDecode(testBlock.testBlockToken) as TestBlockJwt).tests.split(' ')
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="test-block-element-wrapper">
    <div class="field" id="id">#<slot name="id">12345</slot></div>
    <div class="field" id="name">
      <slot name="name">Название</slot>
    </div>
    <CommonButton class="open-button" id="btn" @click="openBlock()">
      <template v-slot:placeholder>Открыть</template>
    </CommonButton>
    <div class="block-links" v-if="isOpen">
      <div
        class="link"
        v-for="(testType, index) in testsTypes"
        :key="index"
      >
       <CommonButton @click="router.push(testLink(testType))">
         <template #placeholder>Пройти тест #{{ index + 1 }}</template>
       </CommonButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.test-block-element-wrapper {
  background: var(--background-secondary);
  border-radius: 10px;
  width: 100%;
  height: 4rem;
  padding: 0 1rem;
  justify-content: center;
  align-items: center;
  display: grid;
  grid-template-columns: 1fr 5fr 1fr;
  gap: 2rem;
  position: relative;

  .block-links {
    position: absolute;
    right: 0;
    top: 100%;
    background-color: var(--background-primary);
    backdrop-filter: blur(15px);
    height: min-content;
    border-radius: 10px;
    margin-top: 1vw;

    .link {
      padding: 1vw;
    }
  }
}

.test-block-element-wrapper:hover {
  cursor: pointer;
}

.test-block-element-wrapper > div {
  border-right: 1px solid black;
  padding: 5px;
  height: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.test-block-element-wrapper > div:last-child {
  border-right: none;
}

.open-button {
  width: 90%;
  height: 60%;
}

#id,
#name {
  text-align: left;
}
</style>
