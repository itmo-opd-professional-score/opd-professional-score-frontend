<script setup lang="ts">
import { computed, ref } from 'vue';
import CommonButton from '../UI/CommonButton.vue';
import UserManagerElement from './UserManagerElement.vue';
import { autoUpdate, hide, useFloating } from '@floating-ui/vue';
import RoleSelectForm from './RoleSelectForm.vue';
import { UserState } from '../../utils/userState/UserState.ts';
import type { UserRole } from '../../utils/userState/UserState.types.ts';
import type { UserDataOutputDto } from '../../api/resolvers/user/dto/output/user-data-output.dto.ts';

interface CurrentUser {
  id: number;
  role: UserRole;
}

const reference = ref<HTMLElement | null>(null);
const floating = ref(null);
const { floatingStyles, middlewareData } = useFloating(reference, floating, {
  placement: 'bottom-end',
  whileElementsMounted: autoUpdate,
  middleware: [hide()],
});

const toggleForm = (el: HTMLElement, id: number, role: string) => {
  if (lastEl.value != el) {
    isOpen.value = false;
  }
  if (!isOpen.value) {
    reference.value = el;
    currentUser.value = {
      id: id,
      role: role as UserRole,
    };
  }
  isOpen.value = !isOpen.value;
  lastEl.value = el;
};

const currentUser = ref<CurrentUser | null>(null);
const isOpen = ref(false);
const lastEl = ref();

defineEmits(['users-list-update']);

const props = withDefaults(
  defineProps<{
    maxElementsCount: number;
    users: UserDataOutputDto[];
  }>(),
  {
    maxElementsCount: 5,
  },
);

const currentPage = ref(1);

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * props.maxElementsCount;
  const end = start + props.maxElementsCount;
  return props.users.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(props.users.length / props.maxElementsCount);
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
</script>

<template>
  <RoleSelectForm
    v-if="isOpen"
    ref="floating"
    :style="{
      ...floatingStyles,
      visibility: middlewareData.hide?.referenceHidden ? 'hidden' : 'visible',
    }"
    :user-id="(currentUser as CurrentUser).id"
    :user-role="(currentUser as CurrentUser).role"
    @role-update="
      $emit('users-list-update');
      isOpen = false;
    "
  />
  <div class="component_container">
    <div class="header">
      <div class="id" id="id">Id</div>
      <div class="test_name" id="test_name">Username</div>
      <div class="score">Email</div>
      <div class="time">Role</div>
      <div class="valid">Change role</div>
    </div>
    <UserManagerElement
      v-for="item in paginatedData"
      :key="item.id"
      :is-disabled="UserState.role == item.role"
      @change-role="(el) => toggleForm(el, item.id, item.role)"
    >
      <template #id>{{ item.id }}</template>
      <template #username>{{ item.username }}</template>
      <template #email>{{ item.email }}</template>
      <template #role>{{ item.role }}</template>
      <template v-slot:placeholder>
        <slot name="placeholder"></slot>
      </template>
    </UserManagerElement>

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
  width: 100%;
  margin-top: auto;
  user-select: none;
}

.header {
  background: var(--background-secondary);
  border-radius: 10px;
  width: 100%;
  height: 4rem;
  padding: 0 1rem;
  justify-content: center;
  align-items: center;
  display: grid;
  grid-template-columns: 2fr 7fr 7fr 3fr 3fr;
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

#id {
  text-align: left;
}

.header > div:last-child {
  border-right: none;
}
</style>
