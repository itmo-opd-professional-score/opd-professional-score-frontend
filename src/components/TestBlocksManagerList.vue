<script lang="ts">
import TestBlockElement from './UI/TestBlockElement.vue';
import type { GetTestBlockOutputDto } from '../api/resolvers/testBlocks/dto/output/get-test-block-output.dto.ts';
import CommonButton from './UI/CommonButton.vue';
import type { PropType } from 'vue';

export default {
  name: 'TestBlocksManagerList',
  components: { CommonButton, TestBlockElement },
  props: {
    maxElementsCount: {
      type: Number,
      default: 5,
    },
    testBlocks: {
      type: Array as PropType<GetTestBlockOutputDto[]> | null,
      required: true,
    },
  },
  data() {
    return {
      currentPage: 1,
    };
  },
  computed: {
    paginatedData(): GetTestBlockOutputDto[] {
      const start = (this.currentPage - 1) * this.maxElementsCount;
      const end = start + this.maxElementsCount;

      if (this.testBlocks != null) {
        return this.testBlocks.slice(start, end);
      }
      return [];
    },
    totalPages(): number {
      const _ = Math.ceil(this.testBlocks.length / this.maxElementsCount);
      return _ > 0 ? _ : 1;
    },
  },
  methods: {
    nextPage() {
      if (this.totalPages != null && this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
  },
};
</script>

<template>
  <div class="test-block-manager-container">
    <div class="container-header">
      <div class="field" id="id">ID</div>
      <div class="field" id="name">Название блока тестов</div>
      <div class="field">Открыть блок</div>
    </div>

    <TestBlockElement v-for="(testBlock, index) in paginatedData" :key="index">
      <template v-slot:id> {{ testBlock.id }} </template>
      <template v-slot:name> Блок тестов #{{ testBlock.id }} </template>
    </TestBlockElement>

    <div class="pagination-controls">
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
.test-block-manager-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.container-header {
  background: var(--background-secondary);
  border-radius: 10px;
  height: 4rem;
  width: 100%;
  padding: 0 1rem;
  justify-content: center;
  align-items: center;
  display: grid;
  grid-template-columns: 1fr 5fr 1fr;
  gap: 2rem;
  margin-bottom: 1rem;
}

.container-header:hover {
  cursor: pointer;
}

.container-header > div {
  border-right: 1px solid black;
  padding: 5px;
  height: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.container-header > div:last-child {
  border-right: none;
}

.pagination-controls {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: auto;
  user-select: none;
}

#id,
#name {
  text-align: left;
}
</style>
