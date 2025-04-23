<script setup lang="ts">
import { computed, ref } from 'vue';
import type {
  UserSex,
  UserAgeRange,
} from '../../utils/userState/UserState.types.ts';
import type { EnabledFilters } from './testFilter.types';

const emit = defineEmits(['genderUpdate', 'ageUpdate']);
defineProps<{
  enabledFilters: EnabledFilters;
}>();
const selectedGender = ref<UserSex | null>(null);
const selectedAgeRange = ref<UserAgeRange | null>(null);
const isGenderOpen = ref(false);
const isAgeOpen = ref(false);

const ruGender = computed(() => {
  return selectedGender.value === 'MALE' ? 'Мужской' : 'Женский';
});

const ageRangeLabel = computed(() => {
  if (selectedAgeRange.value === null) return 'не выбран';
  return typeof selectedAgeRange.value === 'number'
    ? selectedAgeRange.value
    : selectedAgeRange.value.replace(/</g, 'до ');
});

const toggleGender = (gender: UserSex) => {
  selectedGender.value = selectedGender.value === gender ? null : gender;
  emit('genderUpdate', selectedGender.value);
  isGenderOpen.value = false;
};

const toggleAgeRange = (ageRange: UserAgeRange) => {
  selectedAgeRange.value =
    selectedAgeRange.value === ageRange ? null : ageRange;
  emit('ageUpdate', selectedAgeRange.value);
  isAgeOpen.value = false;
};
</script>

<template>
  <div class="filter">
    <div
      v-if="enabledFilters.gender"
      class="select gender"
      @click.capture="isGenderOpen = !isGenderOpen"
    >
      Пол: {{ selectedGender ? ruGender : 'не выбран' }}
      <div class="options" v-show="isGenderOpen">
        <div
          :class="selectedGender == 'MALE' ? 'selected' : ''"
          @click="toggleGender('MALE')"
        >
          Мужской
        </div>
        <div
          :class="selectedGender == 'FEMALE' ? 'selected' : ''"
          @click="toggleGender('FEMALE')"
        >
          Женский
        </div>
      </div>
    </div>
    <div
      v-if="enabledFilters.age"
      class="select age"
      @click.stop="isAgeOpen = !isAgeOpen"
    >
      Возраст: {{ ageRangeLabel }}
      <div v-show="isAgeOpen" class="options">
        <div
          :class="{ selected: selectedAgeRange === '<18' }"
          @click.stop="toggleAgeRange('<18')"
        >
          <18
        </div>
        <div
          :class="{ selected: selectedAgeRange === '18-25' }"
          @click.stop="toggleAgeRange('18-25')"
        >
          18-25
        </div>
        <div
          :class="{ selected: selectedAgeRange === '26-35' }"
          @click.stop="toggleAgeRange('26-35')"
        >
          26-35
        </div>
        <div
          :class="{ selected: selectedAgeRange === '36+' }"
          @click.stop="toggleAgeRange('36+')"
        >
          36+
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter {
  display: flex;
  width: 95%;
  border-radius: 10px;
  margin-bottom: 1vw;

  .select {
    position: relative;
    background-color: var(--background-secondary);
    padding: 0.5vw;
    border-radius: inherit;
    margin-left: 1vw;

    .options {
      position: absolute;
      top: 100%;
      left: 0;
      background-color: var(--background-secondary);
      border-radius: inherit;
      margin-top: 0.5vw;
      backdrop-filter: blur(8px);
      display: flex;
      flex-direction: column;

      div {
        padding: 0.5vw 1vw;
        border-radius: inherit;
        user-select: none;
      }

      .selected {
        background-color: #0d6efd;
        color: white;
      }
    }
  }
}
</style>
