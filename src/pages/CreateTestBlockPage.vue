<script lang="ts">
import TestRowElement from '../components/TestRowElement.vue';
import CommonButton from '../components/UI/CommonButton.vue';
import { TestBlockResolver } from '../api/resolvers/testBlocks/test-block.resolver.ts';
import { UserResolver } from '../api/resolvers/user/user.resolver.ts';
import type { UserDataOutputDto } from '../api/resolvers/user/dto/output/user-data-output.dto.ts';
import UserRowElement from '../components/UserRowElement.vue';
import type { CreateTestBlockInputDto } from '../api/resolvers/testBlocks/dto/input/create-test-block-input.dto.ts';
import { usePopupStore } from '../store/popup.store.ts';
import { useTestTypesStore } from '../store/test-types.store.ts';
import type { TestTypeDataOutputDto } from '../api/resolvers/testType/dto/output/test-type-data-output.dto.ts';
import router from '../router/router.ts';

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
      approvedTests: [] as string[],
      tests: [] as TestTypeDataOutputDto[],
      users,
      testBlockResolver,
      userResolver,
      popupStore,
    };
  },
  async mounted() {
    const usersFromApi = await this.userResolver.getAll();
    const testTypesStore = useTestTypesStore();
    await testTypesStore.loadTestTypes();

    this.tests = testTypesStore.getTestTypes;

    if (usersFromApi?.body) {
      this.users = usersFromApi?.body.sort((a, b) => a.id - b.id);
    }
  },
  methods: {
    async save() {
      if (this.approvedTests.length > 0 && this.approvedUsers.length > 0) {
        const data: CreateTestBlockInputDto = {
          tests: {
            tests: this.approvedTests,
          },
          userIDs: this.approvedUsers,
        };

        await this.testBlockResolver.createTestBlock(data).then((res) => {
          if (res.status == 200) {
            this.popupStore.activateInfoPopup('Блок тестов создан успешно!');
            router.push('/');
          }
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

    <h2 class="block-header">Выберите тесты для блока тестов</h2>
    <div class="tests-container">
      <TestRowElement
        v-for="(test, index) in tests"
        :key="index"
        :test-name="test.description"
        :test-meta="test.name"
        @apply-test="(meta: string) => approvedTests.push(meta)"
        @remove-test="
          (meta: string) => {
            const i = approvedTests.indexOf(meta);
            approvedTests = [
              ...approvedTests.slice(0, i),
              ...approvedTests.slice(i + 1),
            ];
          }
        "
      />
    </div>
    <h2 class="block-header">Выберите пользователей для блока тестов</h2>
    <div class="user-container">
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

    <CommonButton class="submit_button" @click="save">
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
  grid-template-columns: 1.5fr 1fr;
  column-gap: 3vw;
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
}

.user-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tests-container, .user-container {
  overflow-y: scroll;
  padding: 1vw 0;
  height: 46vh;
  gap: 1vw;
  grid-row: 3 / 4;
}

.block-header {
  margin-top: 1rem;
}

@media only screen and (max-width: 600px) {
  .container {
    display: flex;
    flex-direction: column;
  }
}
</style>
