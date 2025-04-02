<script setup lang="ts">
import {computed, ref} from "vue";
import CommonButton from "./UI/CommonButton.vue";
import TestManagerElement from "./UI/TestManagerElement.vue";
import type {TestDataInputDto} from "../api/resolvers/test/dto/input/test-data-input.dto.ts";
import { checkTestType } from '../utils/testTypeState/TestTypeState.ts';

const props = withDefaults(defineProps<{
  maxElementsCount: number;
  tests: TestDataInputDto[]
}>(), {
  maxElementsCount: 5
})

const currentPage = ref(1);
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * props.maxElementsCount;
  const end = start + props.maxElementsCount;
  if (props.tests) {
    return props.tests.slice(start, end);
  }
  return null
});

const totalPages = computed(() => {
  if (props.tests) {
    return Math.ceil(props.tests.length / props.maxElementsCount);
  }
  return null
});

const nextPage = () => {
  if (totalPages.value != null && currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};
</script>

<template>
  <div class="component_container">
    <div class="header">
      <div class="id">Id</div>
      <div class="test_type">Тип теста</div>
      <div class="test_type">Время ответа</div>
      <div class="test_type">Пользователь</div>
      <div class="test_type">Пройден</div>
      <div class="test_type">Дата</div>
    </div>
    <TestManagerElement
        v-for="item in paginatedData"
        :key="item.id"
    >
      <template #id>{{ item.id }}</template>
      <template #test_type>{{ checkTestType(item) }}</template>
      <template #average_callback>{{ item.averageCallbackTime.toFixed(2) }}</template>
      <template #user>{{ item.userId ? item.userId : 'Аноним'}}</template>
      <template #valid>{{ item.valid }}</template>
      <template #created_at>{{ item.createdAt.substring(0, 10) }}</template>
    </TestManagerElement>

    <div class="pagination_controls">
      <CommonButton @click="prevPage">
        <template v-slot:placeholder>Назад</template>
      </CommonButton>

      <span>{{ currentPage }} / {{ totalPages }}</span>

      <CommonButton @click="nextPage">
        <template v-slot:placeholder>Вперед</template>
      </CommonButton>
    </div>
  </div>
</template>

<style scoped>
.component_container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.pagination_controls {
  display: flex;
  justify-content: space-between;
  width: 95%;
  margin-top: auto;
  user-select: none;
}

.header {
  background: var(--background-secondary);
  border-radius: 10px;
  width: 95%;
  height: 4rem;
  padding: 0 1rem;
  justify-content: center;
  align-items: center;
  display: grid;
  grid-template-columns: 1fr 3fr 3fr 3fr 2fr 2fr;
  margin-bottom: 1rem;
}

.header:hover {
  cursor: pointer;
}

.header > div {
  border-right: 1px solid black;
  padding: 5px;
  height: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

#id, #test_name {
  text-align: left;
}

.header > div:last-child {
  border-right: none;
}
</style>