<script setup lang="ts">
  import type { UserDataOutputDto } from '../api/resolvers/user/dto/output/user-data-output.dto.ts';
  import { onMounted, ref } from 'vue';
  import { UserResolver } from '../api/resolvers/user/user.resolver.ts';
  import type { DefaultOutputDto } from '../api/dto/common/default-output.dto.ts';
  const props = defineProps<{
    userId?: number
  }>()
  const currentUser = ref<DefaultOutputDto<UserDataOutputDto> | null>();
  onMounted(async () => {
    if (props.userId && props.userId !== -1) {
      currentUser.value = await new UserResolver().getById(props.userId);
    }
  })
</script>

<template>
  <div class="wrapper">
    <div class="id" id="id">
      #
      <slot name="id">0</slot>
    </div>
    <div class="time" v-if="$slots.time"><slot name="time">00:00:00</slot></div>
    <div class="username" v-if="$slots.username || userId">
      <p v-if="userId">{{ currentUser != null ? currentUser.body.username : "Аноним"}}</p>
      <slot name="username" v-else>Имя пользователя</slot>
    </div>
    <div class="createdAt"><slot name="createdAt">2022-22-22</slot></div>
    <div class="valid"><slot name="valid">true</slot></div>
  </div>
</template>

<style scoped>
.wrapper {
  background: var(--background-secondary);
  border-radius: 10px;
  width: 95%;
  height: 4rem;
  padding: 0 1rem;
  align-items: center;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.wrapper:hover {
  cursor: pointer;
}

.hide-username {
  grid-template-columns: repeat(3, 1fr);
}

.wrapper > div {
  border-right: 1px solid black;
  padding: 5px;
  height: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.wrapper > div:last-child {
  border-right: none;
}
</style>
