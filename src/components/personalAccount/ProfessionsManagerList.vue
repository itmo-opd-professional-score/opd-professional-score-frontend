<script setup lang="ts">
import { computed, ref } from 'vue';
import CommonButton from '../UI/CommonButton.vue';
import ProfessionsManagerElement from './ProfessionsManagerElement.vue';
import ProfessionEditForm from './ProfessionEditForm.vue';
import { autoUpdate, hide, useFloating } from '@floating-ui/vue';
import router from '../../router/router.ts';
import type { GetProfessionOutputDto } from '../../api/resolvers/profession/dto/output/get-profession-output.dto.ts';
import type { UpdateProfessionInputDto } from '../../api/resolvers/profession/dto/input/update-profession-input.dto.ts';

const reference = ref<HTMLElement | null>(null);
const floating = ref(null);
const { floatingStyles, middlewareData } = useFloating(reference, floating, {
  placement: 'bottom-end',
  whileElementsMounted: autoUpdate,
  middleware: [hide()],
});

const toggleForm = (
  el: HTMLElement,
  id: number,
  name: string,
  description: string,
  requirements: string,
  sphere: string,
  archived: boolean,
) => {
  if (lastEl.value != el) {
    isOpen.value = false;
  }
  if (!isOpen.value) {
    reference.value = el;
    currentProfession.value = {
      id: id,
      updatedData: {
        name: name,
        description: description,
        requirements: requirements,
        sphere: sphere,
        archived: archived,
      },
    } as UpdateProfessionInputDto;
  }
  isOpen.value = !isOpen.value;
  lastEl.value = el;
};

const currentProfession = ref<UpdateProfessionInputDto | null>(null);
const isOpen = ref(false);
const lastEl = ref();

defineEmits(['professions-list-update']);

const props = defineProps<{
  professions: GetProfessionOutputDto[],
  maxElementsCount: number;
  isArchive?: boolean
}>()
const currentPage = ref(1);

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * props.maxElementsCount;
  const end = start + props.maxElementsCount;
  return props.professions.slice(start, end);
});

const totalPages = computed(() => {
  if (Math.ceil(props.professions.length / props.maxElementsCount) == 0) {
    return 1;
  } else {
    return Math.ceil(props.professions.length / props.maxElementsCount);
  }
});

const nextPage = () => {
  if (currentPage.value < (totalPages.value as number)) {
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
  <ProfessionEditForm
    v-if="isOpen"
    ref="floating"
    :style="{
      ...floatingStyles,
      visibility: middlewareData.hide?.referenceHidden ? 'hidden' : 'visible',
    }"
    :profession="currentProfession"
    @profession-update="
      $emit('professions-list-update');
      isOpen = false;
    "
  />
  <div class="component_container">
    <div class="header">
      <div class="id" id="id">Id</div>
      <div class="time">Название</div>
      <div class="valid">Описание</div>
      <div class="valid">Требования</div>
      <div class="valid">Сфера</div>
      <div class="valid"></div>
    </div>
    <div class="professions">
      <ProfessionsManagerElement
        v-for="item in paginatedData"
        :key="item.id"
        :id="item.id"
        @edit-profession="
          (el) =>
            toggleForm(
              el,
              item.id,
              item.name,
              item.description,
              item.requirements,
              item.sphere,
              item.archived,
            )
        "
      >
        <template #id>{{ item.id }}</template>
        <template #name>{{ item.name }}</template>
        <template #description>{{ item.description }}</template>
        <template #requirements>{{ item.requirements }}</template>
        <template #sphere>{{ item.sphere }}</template>
      </ProfessionsManagerElement>

      <CommonButton
        class="new-profession"
        @click="router.push('/profession/new')"
        v-if="isArchive"
      >
        <template v-slot:placeholder>Добавить профессию</template>
      </CommonButton>
    </div>

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
  overflow: hidden;
}

.professions {
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 0.5vw;
  margin-bottom: 2vw;

  .new-profession {
    align-self: flex-end;
  }
}

.pagination_controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: auto;
  user-select: none;
}

.header {
  background: var(--background-secondary);
  border-radius: 10px;
  width: 100%;
  height: 4rem;
  padding: 0 1vw;
  justify-content: center;
  align-items: center;
  display: grid;
  grid-template-columns: 1fr 3fr 6fr 3fr 1fr 1.7fr;
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

#id,
#test_name {
  text-align: left;
}

.header > div:last-child {
  border-right: none;
}
</style>
