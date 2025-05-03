<script lang="ts">
import TestRowElement from '../components/TestRowElement.vue';
import CommonButton from '../components/UI/CommonButton.vue';
import { TestBlockResolver } from '../api/resolvers/testBlocks/test-block.resolver.ts';
import { UserResolver } from '../api/resolvers/user/user.resolver.ts';
import type { UserDataOutputDto } from '../api/resolvers/user/dto/output/user-data-output.dto.ts';
import UserRowElement from '../components/UserRowElement.vue';
import type { CreateTestBlockInputDto } from '../api/resolvers/testBlocks/dto/input/create-test-block-input.dto.ts';
import { usePopupStore } from '../store/popup.store.ts';
import type { TestTypeDataOutputDto } from '../api/resolvers/testType/dto/output/test-type-data-output.dto.ts';
import router from '../router/router.ts';
import type { TestBlockTest } from './tests/types';
import { TestTypeResolver } from '../api/resolvers/testType/testType.resolver.ts';

export default {
  name: 'CreateTestBlockPage',
  components: { UserRowElement, CommonButton, TestRowElement },
  data() {
    const popupStore = usePopupStore();
    const testBlockResolver = new TestBlockResolver();
    const userResolver = new UserResolver();
    const users: UserDataOutputDto[] = [];

    return {
      approvedUsers: [] as number[],
      approvedTests: [] as TestBlockTest[],
      tests: [] as TestTypeDataOutputDto[],
      users,
      testBlockResolver,
      userResolver,
      popupStore,
    };
  },
  async mounted() {
    try {
      const usersFromApi = await this.userResolver.getAll();
      const types = await new TestTypeResolver().getAll();
      if (usersFromApi !== null) this.users = usersFromApi.body.sort((a, b) => a.id - b.id);
      if (types !== null) this.tests = types.sort((a, b) => a.id - b.id);
    } catch (e) {}
  },
  methods: {
    async save() {
      if (this.approvedTests.length > 0 && this.approvedUsers.length > 0) {
        const data: CreateTestBlockInputDto = {
          tests: this.approvedTests,
          userIDs: this.approvedUsers,
        };

        await this.testBlockResolver.createTestBlock(data).then(() => {
          this.popupStore.activateInfoPopup('Блок тестов создан успешно!');
          router.push('/profile');
        });
      } else {
        this.popupStore.activateErrorPopup(
          'Должен быть выбран хотя бы 1 тест и 1 пользователь!',
        );
      }
    },
  },
};
</script>

<template>
  <div class="container">
    <h1 class="container-header">Создание блока тестов</h1>

    <h2 class="block-header">Выберите тесты:</h2>
    <div class="tests-container" v-if="tests.length > 0">
      <TestRowElement
        v-for="(test, index) in tests"
        :key="index"
        :test-type-id="test.id"
        :test-name="test.description"
        :test-meta="test.name"
        @apply-test="(meta) => approvedTests.push(meta)"
        @remove-test="
          (meta) => {
            const i = approvedTests.indexOf(meta);
            approvedTests = [
              ...approvedTests.slice(0, i),
              ...approvedTests.slice(i + 1),
            ];
          }
        "
      />
    </div>
    <h2 class="block-header">Выберите пользователей:</h2>
    <div class="user-container" v-if="users.length > 0">
      <UserRowElement
        v-for="(user, index) in users"
        :key="index"
        :user-email="user.email"
        :user-id="user.id"
        :user-name="user.username"
        @apply-user="(id: number) => approvedUsers.push(id)"
        @remove-user="
          (id: number) => {
            const i = approvedUsers.indexOf(id);
            approvedUsers = [
              ...approvedUsers.slice(0, i),
              ...approvedUsers.slice(i + 1),
            ];
          }
        "
      />
    </div>

    <CommonButton class="submit_button save" @click="save">
      <template v-slot:placeholder> Сохранить </template>
    </CommonButton>
  </div>
</template>

<style scoped>
.container {
  width: 80vw;
  border-radius: 10px;
  padding: 3vw 2vw;
  background-color: white;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  column-gap: 2vw;
  grid-template-rows: repeat(3, auto);
}

.container-header {
  margin-bottom: 1rem;
  grid-column: 1 / 3;
}

.tests-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.user-container {
  display: flex;
  flex-direction: column;
}

.tests-container, .user-container {
  overflow-y: scroll;
  height: 41vh;
  width: 100%;
  gap: 1vh;
  grid-row: 3 / 4;
}

.block-header {
  margin: 2vw 0;
}

.save {
  grid-column: 1 / 3;
  margin-left: auto;
  margin-bottom: -2vw;
  margin-right: -1vw;
  width: 20%;
}

@media only screen and (max-width: 900px) {
  .container {
    display: flex;
    flex-direction: column;
  }
}
</style>
