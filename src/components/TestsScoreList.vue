<script setup lang="ts" generic="T extends TestDataOutputDto">
import TestScore from './TestScoreElement.vue';
import { computed, type PropType, ref, watch } from 'vue';
import CommonButton from './UI/CommonButton.vue';
import TestFilter from './testFilter/TestFilter.vue';
import type {
  UserAgeRange,
  UserSex,
} from '../utils/userState/UserState.types.ts';
import { UserResolver } from '../api/resolvers/user/user.resolver.ts';
import type { EnabledFilters } from './testFilter/testFilter.types';
import { calculateAge } from '../utils/userState/UserState.ts';
import type { TestDataOutputDto } from '../api/resolvers/test/dto/output/test-data-output.dto.ts';

const props = defineProps({
  maxElementsCount: {
    type: Number,
    default: 5,
  },
  tests: {
    type: Array as PropType<T[]>,
    required: true,
  },
  enabledFilters: {
    type: {} as PropType<EnabledFilters>,
    default: {
      gender: false,
      age: false,
    },
  },
  hideUserId: Boolean,
});

const userResolver = new UserResolver();
const currentPage = ref(1);
const currentGender = ref<UserSex | null>(null);
const filteredTests = ref<T[]>(props.tests);
const currentAgeRange = ref<UserAgeRange | null>(null);

const handleAgeUpdate = (ageRange: UserAgeRange | null) => {
  currentAgeRange.value = ageRange;
  applyFilters();
};

const handleGenderUpdate = (gender: UserSex | null) => {
  currentGender.value = gender;
  applyFilters();
};

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

const applyFilters = async () => {
  filteredTests.value = [];
  const filtered = await Promise.all(
    props.tests.map(async (test) => {
      if (test.userId == null) return false;

      const user = await userResolver.getById(test.userId);
      if (!user?.body) return false;

      // Проверка пола
      const genderMatch = currentGender.value
        ? user.body.gender === currentGender.value
        : true;

      // Проверка возраста
      let ageMatch = true;
      if (currentAgeRange.value) {
        const birthDate = user.body.age;
        const ageStr = calculateAge(birthDate);
        if (ageStr === undefined) {
          ageMatch = false;
        } else {
          const ageNumber = parseInt(ageStr);
          switch (currentAgeRange.value) {
            case '<18':
              ageMatch = ageNumber < 18;
              break;
            case '18-25':
              ageMatch = ageNumber >= 18 && ageNumber <= 25;
              break;
            case '26-35':
              ageMatch = ageNumber >= 26 && ageNumber <= 35;
              break;
            case '36+':
              ageMatch = ageNumber >= 36;
              break;
            default:
              ageMatch = true;
          }
        }
      }

      return genderMatch && ageMatch ? test : false;
    }),
  );

  filteredTests.value = filtered.filter(
    (test) => test !== false,
  ) as T[];
};

watch(
  () => props.tests,
  (newTests) => {
    filteredTests.value = newTests;
  },
);
</script>

<template>
  <div class="component_container">
    <TestFilter
      :enabledFilters="enabledFilters"
      @gender-update="handleGenderUpdate"
      @age-update="handleAgeUpdate"
    />
    <div :class="hideUserId ? 'hide-username header' : 'header'">
      <div class="id" id="id">Id</div>
      <div class="score">Score</div>
      <div class="time">Time</div>
      <div class="username" v-if="!hideUserId">Имя пользователя</div>
      <div class="createdAt">Дата</div>
      <div class="valid">Результат</div>
    </div>
    <TestScore
      v-for="item in paginatedData"
      :key="item.id"
      :class="hideUserId ? 'hide-username' : ''"
      :user-id="!hideUserId ? (item.userId ? item.userId : -1) : undefined"
    >
      <template #id>{{ item.id }}</template>
      <template
        #current_points
        v-if="'allSignals' in item && typeof item.allSignals === 'number'"
      >
        {{ 'misclicks' in item && typeof item.misclicks === 'number' ? item.allSignals - item.misclicks : undefined }}
        {{ 'mistakes' in item && typeof item.mistakes === 'number' ? item.allSignals - item.mistakes : undefined }}
      </template>
      <template
        #max_points
        v-if="'allSignals' in item && typeof item.allSignals === 'number'"
      >
        {{ item.allSignals }}
      </template>
      <template
        #time
        v-if="'averageCallbackTime' in item && typeof item.averageCallbackTime === 'number'"
      >
        {{ item.averageCallbackTime.toFixed(2) }}
      </template>
      <template #username v-if="!hideUserId">{{ item.userId }}</template>
      <template #createdAt>{{ item.createdAt.substring(0, 10) }}</template>
      <template #valid>{{ item.valid }}</template>
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
