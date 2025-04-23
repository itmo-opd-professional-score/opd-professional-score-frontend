<script setup lang="ts">
import TestScore from './UI/TestScoreElement.vue';
import { computed, type PropType, ref, watch } from 'vue';
import CommonButton from './UI/CommonButton.vue';
import type { TestDataOutputDto } from '../api/resolvers/test/dto/output/test-data-output.dto.ts';
import TestFilter from './testFilter/TestFilter.vue';
import type { UserSex } from '../utils/userState/UserState.types.ts';
import { UserResolver } from '../api/resolvers/user/user.resolver.ts';
import type { EnabledFilters } from './testFilter/testFilter.types';

const props = defineProps({
  maxElementsCount: {
    type: Number,
    default: 5,
  },
  tests: {
    type: Array as PropType<TestDataOutputDto[]>,
    required: true,
  },
  enabledFilters: {
    type: {} as PropType<EnabledFilters>,
    default: {
      gender: false,
      age: false
    }
  },
  hideUserId: Boolean
});

const userResolver = new UserResolver()
const currentPage = ref(1);
const currentGender = ref<UserSex | null>(null)
const filteredTests = ref<TestDataOutputDto[]>(props.tests);

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * props.maxElementsCount;
  const end = start + props.maxElementsCount;
  return filteredTests.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredTests.value.length / props.maxElementsCount);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const filterByGender = async (gender: UserSex | null) => {
  filteredTests.value = []
  if (gender == null) {
    filteredTests.value = props.tests
  } else {
    const filtered = await Promise.all(
      props.tests.map(async (test) => {
        if (test.userId == null) return false;
        const user = await userResolver.getById(test.userId);
        return user?.body.gender === gender ? test : false;
      })
    );

    filteredTests.value = filtered.filter(test => test != false);
  }
  currentGender.value = gender
}

watch(() => props.tests, (newTests) => {
  filteredTests.value = newTests;
})

</script>

<template>
  <div class="component_container">
    <TestFilter
      :enabledFilters="enabledFilters"
      @gender-update="(gender: UserSex) => filterByGender(gender)"
    />
    <div :class="hideUserId ? 'hide-username header' : 'header'">
      <div class="id" id="id">Id</div>
      <div class="score">Score</div>
      <div class="time">Time</div>
      <div class="username" v-if="!hideUserId">Username</div>
      <div class="createdAt">Pass date</div>
      <div class="valid">Valid</div>
    </div>
    <TestScore
      v-for="item in paginatedData"
      :key="item.id"
      :class="hideUserId ? 'hide-username' : ''"
      :user-id="
      !hideUserId ?
        item.userId ?
          item.userId :
          -1 :
        undefined"
    >
      <template #id>{{ item.id }}</template>
      <template #current_points>{{
          item.misclicks != null ?
            item.allSignals - item.misclicks :
            item.allSignals - item.mistakes
        }}</template>
      <template #max_points>{{ item.allSignals }}</template>
      <template #time>{{ item.averageCallbackTime.toFixed(2) }}</template>
      <template #username v-if="!hideUserId">{{ item.userId}}</template>
      <template #createdAt>{{ item.createdAt.substring(0, 10) }}</template>
      <template #valid>{{ (item.misclicks != null ?
        item.allSignals - item.misclicks :
        item.allSignals - item.mistakes / item.allSignals) > 0.6 }}</template>
    </TestScore>

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
  align-items: center;
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
  grid-template-columns: 1fr repeat(5, 2fr);
  margin-bottom: 1rem;
}

.hide-username {
  grid-template-columns: 1fr repeat(4, 2fr);
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

#id,
#test_name {
  text-align: left;
}

.header > div:last-child {
  border-right: none;
}
</style>
