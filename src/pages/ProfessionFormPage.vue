<script lang="ts">
import CommonButton from '../components/UI/CommonButton.vue';
import CustomInput from '../components/UI/inputs/CustomInput.vue';
import CustomTextareaInput from '../components/UI/inputs/CustomTextareaInput.vue';
import CustomSelect from '../components/UI/inputs/CustomSelect.vue';
import ApiResolverUtil from '../utils/ApiResolver.ts';
import router from '../router/router.ts';
import { usePopupStore } from '../store/popup.store.ts';

export default {
  name: 'ProfessionForm',
  components: { CustomSelect, CustomInput, CustomTextareaInput, CommonButton },
  data() {
    return {
      name: '',
      description: '',
      requirements: '',
      sphere: '',
      sphereOptions: [
        { value: 'IT', text: 'IT' },
        { value: 'Инженерия', text: 'Инженерия' },
        { value: 'Образование', text: 'Образование' },
        { value: 'Другая', text: 'Другая' },
      ],
      resolver: new ApiResolverUtil('professions'),
      popupStore: usePopupStore(),
    };
  },
  methods: {
    create() {
      const body = {
        name: this.name,
        description: this.description,
        requirements: this.requirements,
        sphere: this.sphere,
        archived: true,
      };

      const token = localStorage.getItem('token');
      if (token != null) {
        this.resolver
          .request('createProfession', 'POST', body, token)
          .then(() => {
            router.push('/profile');
          });
      } else {
        this.popupStore.activateErrorPopup('No token');
      }
    },
  },
};
</script>

<template>
  <div class="container">
    <h1>Добавить профессию</h1>

    <label for="profession-name">Название профессии:</label>
    <CustomInput
      placeholder="Введите название профессии"
      v-model="name"
      type="text"
    />

    <label for="description">Описание:</label>
    <CustomTextareaInput
      class="textarea"
      :placeholder="'Описание профессии'"
      :rows="4"
      v-model="description"
    />

    <label for="requirements">Требования:</label>
    <CustomTextareaInput
      :placeholder="'Требования к профессии'"
      :rows="4"
      v-model="requirements"
    />

    <label for="sphere">Сфера деятельности:</label>
    <CustomSelect
      :options="sphereOptions"
      v-model="sphere"
      :placeholder="'Выберите сферу'"
      class="sphere-select"
    />

    <CommonButton class="button" @click="create">
      <template v-slot:placeholder>Добавить профессию</template>
    </CommonButton>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  width: 35vw;
}

.input {
  height: 1.75rem;
}

.textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #5d558d;
  border-radius: 5px;
  transition: transform 0.3s;
  margin-bottom: 15px;
  font-size: 16px;
  resize: none;
}

.textarea:hover {
  transform: scale(1.02);
}

.sphere-select {
  width: 100%;
  padding: 10px;
  border: 1px solid #5d558d;
  border-radius: 5px;
  transition: transform 0.3s;
  margin-bottom: 15px;
  font-size: 16px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>');
  background-position: right 10px center;
  background-repeat: no-repeat;
  -webkit-appearance: none;
  appearance: none;
}

.sphere-select {
  cursor: pointer;
}

.button,
.button:hover {
  background-color: #4127e4;
  color: white;
}
</style>
