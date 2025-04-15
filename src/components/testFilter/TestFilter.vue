<script setup lang="ts">

import { computed, ref } from 'vue';
import type { UserSex } from '../../utils/userState/UserState.types.ts';
import type { EnabledFilters } from './testFilter.types';

const emit = defineEmits(['genderUpdate'])
defineProps<{
  enabledFilters: EnabledFilters
}>()
const ruGender = computed(() => {
  return selectedGender.value === 'MALE' ? 'Мужской' : 'Женский'
})
const selectedGender = ref<UserSex | null>(null)
const isGenderOpen = ref<boolean>(false)
const toggleGender = (gender: UserSex) => {
  if (selectedGender.value === gender) {
    selectedGender.value = null
    emit('genderUpdate', null)
  } else {
    selectedGender.value = gender
    emit('genderUpdate', gender)
  }
  isGenderOpen.value = false
}
</script>

<template>
  <div class="filter">
    <div v-if="enabledFilters.gender" class="select gender" @click.capture="isGenderOpen = true">
      Пол: {{ selectedGender ? ruGender : 'не выбран' }}
      <div class="options" v-show="isGenderOpen">
        <div

          :class="selectedGender == 'MALE' ? 'selected' : ''"
          @click="toggleGender('MALE')"
        >Мужской</div>
        <div
          :class="selectedGender == 'FEMALE' ? 'selected' : ''"
          @click="toggleGender('FEMALE')"
        >Женский</div>
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