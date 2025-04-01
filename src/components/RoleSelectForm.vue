<script setup lang="ts">
import {ref} from "vue";
import {usePopupStore} from "../store/popup.store.ts";
import {UserResolver} from "../api/resolvers/user/user.resolver.ts";
import type {DefaultErrorDto} from "../api/dto/common/default-error.dto.ts";
import {UserRole} from "../utils/userState/UserState.types.ts";

const emit = defineEmits(['role-update'])
const props = defineProps<{
  userId: number;
  userRole: UserRole;
}>()
const selectedRole = ref<UserRole>(props.userRole)
const popupStore = usePopupStore();
const userResolver = new UserResolver()

const updateRole = async () => {
  const result = await userResolver.setRole({
    id: props.userId,
    role: selectedRole.value
  });
  if (result.status === 200) {
    emit("role-update");
    popupStore.activateInfoPopup(result.body);
  } else {
    const error = result as unknown as DefaultErrorDto;
    popupStore.activateErrorPopup(error.message)
  }
}
</script>

<template>
  <form @submit.prevent="updateRole()">
    <label :key="role" v-for="role in Object.values(UserRole)">
      <input
          name="role"
          type="radio"
          :value="role"
          :checked="userRole == role"
          v-model="selectedRole"
      >
      {{ role }}
    </label>
    <input type="submit" value="Изменить">
  </form>
</template>

<style scoped>
  form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: max-content;
    padding: 2vw;
    background-color: var(--background-primary);
    backdrop-filter: blur(15px);
    border-radius: 15px;
  }
</style>