<script setup lang="ts">
import type { UpdateProfessionInputDto } from '../../api/resolvers/profession/dto/input/update-profession-input.dto.ts';
import { ref } from 'vue';
import { ProfessionResolver } from '../../api/resolvers/profession/profession.resolver.ts';
import { UserState } from '../../utils/userState/UserState.ts';
import CustomInput from '../UI/inputs/CustomInput.vue';
import CustomTextareaInput from '../UI/inputs/CustomTextareaInput.vue';
import { UserRole } from '../../utils/userState/UserState.types.ts';
import CommonButton from '../UI/CommonButton.vue';

const emit = defineEmits(['profession-update']);
const props = defineProps<{
  profession: UpdateProfessionInputDto | null;
}>();

const localProfession = ref<UpdateProfessionInputDto | null>(props.profession);
const updateProfession = async () => {
  if (localProfession.value != null) {

    const professionResolver = new ProfessionResolver();
    await professionResolver.updateProfession(localProfession.value);
    emit('profession-update');
  }
};
</script>

<template>
  <div class="profession-edit" v-if="localProfession != null">
    <h4>Изменить профессию</h4>
    <form @submit.prevent="updateProfession" id="profession-change-form">
      <CustomInput
        required
        type="text"
        id="profName"
        v-model="localProfession.updatedData.name"
      />
      <CustomTextareaInput
        required
        id="profDesc"
        v-model="localProfession.updatedData.description"
      />
      <CustomTextareaInput
        required
        id="profRequ"
        v-model="localProfession.updatedData.requirements"
      />
      <CustomInput
        required
        type="text"
        id="profSphere"
        v-model="localProfession.updatedData.sphere"
      />
      <CustomInput
        required
        type="number"
        id="profId"
        :hidden="true"
        v-model="localProfession.id"
      />
      <div class="archive">
        <p>Архивировать</p>
        <CustomInput
          type="checkbox"
          id="profArchive"
          :disabled="UserState.role != UserRole.ADMIN"
          :checked="localProfession.updatedData.archived"
          v-model="localProfession.updatedData.archived"
        />
      </div>
      <CommonButton
        class="submit_button"
        type="submit"
      >
        <template #placeholder>Изменить</template>
      </CommonButton>
    </form>
  </div>
</template>

<style scoped>
.profession-edit {
  position: absolute;
  display: flex;
  flex-direction: column;
  background-color: var(--background-primary);
  padding: 2vw;
  width: 25vw;
  box-sizing: border-box;
  backdrop-filter: blur(15px);
  border-radius: 15px;
}

.profession-edit form {
  display: flex;
  flex-direction: column;
  z-index: 10;
  gap: 1vh;
}

.archive {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
