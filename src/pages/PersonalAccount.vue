<script setup lang="ts">
import Button from '../components/UI/CommonButton.vue';
import { onMounted, ref } from 'vue';
import TestsManagerList from '../components/TestsManagerList.vue';
import UserManagerList from '../components/UserManagerList.vue';
import ProfessionsManagerList from '../components/ProfessionsManagerList.vue';
import { calculateAge, updateUserState, UserState } from '../utils/userState/UserState.ts';
import { ProfessionResolver } from '../api/resolvers/profession/profession.resolver.ts';
import type { GetProfessionOutputDto } from '../api/resolvers/profession/dto/output/get-profession-output.dto.ts';
import { usePopupStore } from '../store/popup.store.ts';
import type { DefaultErrorDto } from '../api/dto/common/default-error.dto.ts';
import { AuthResolver } from '../api/resolvers/auth/auth.resolver.ts';
import router from '../router/router.ts';
import { TestResolver } from '../api/resolvers/test/test.resolver.ts';
import { UserResolver } from '../api/resolvers/user/user.resolver.ts';
import type { UserDataOutputDto } from '../api/resolvers/user/dto/output/user-data-output.dto.ts';
import type { TestDataOutputDto } from '../api/resolvers/test/dto/output/test-data-output.dto.ts';
import { UserRole } from '../utils/userState/UserState.types.ts';
import { useTestTypesStore } from '../store/test-types.store.ts';
import type { GetTestBlockOutputDto } from '../api/resolvers/testBlocks/dto/output/get-test-block-output.dto.ts';
import { TestBlockResolver } from '../api/resolvers/testBlocks/test-block.resolver.ts';
import TestBlocksManagerList from '../components/TestBlocksManagerList.vue';
import CommonButton from '../components/UI/CommonButton.vue';

const authResolver = new AuthResolver();
const userResolver = new UserResolver();
const testResolver = new TestResolver();
const testBlockResolver = new TestBlockResolver();
const professionResolver = new ProfessionResolver();

const popupStore = usePopupStore();
const testTypesStore = useTestTypesStore();
testTypesStore.loadTestTypes();

const users = ref<UserDataOutputDto[]>([]);
const professions = ref<GetProfessionOutputDto[] | null>(null);
const tests = ref<{
  additionSound: TestDataOutputDto[];
  additionVisual: TestDataOutputDto[];
  simpleSound: TestDataOutputDto[];
  simpleLight: TestDataOutputDto[];
  hardLight: TestDataOutputDto[];
  simpleRdo: TestDataOutputDto[];
  hardRdo: TestDataOutputDto[];
}>({
  additionSound: [],
  additionVisual: [],
  simpleSound: [],
  simpleLight: [],
  hardLight: [],
  simpleRdo: [],
  hardRdo: [],
});
const allTests = ref<TestDataOutputDto[]>([]);
const professionsArchive = ref<GetProfessionOutputDto[]>([]);
const professionsPublished = ref<GetProfessionOutputDto[]>([]);
const testBlocks = ref<GetTestBlockOutputDto[]>([]);

const reloadTestBlocks = async () => {
  const res = await testBlockResolver.getByUserId(
    UserState.id ? UserState.id : 0,
  );
  if (res != null) testBlocks.value = res;
};

const reloadUsers = async () => {
  const result = await userResolver.getAll();
  if (result != null) {
    users.value = result.body;
  }
};

const reloadProfessions = async () => {
  professionsArchive.value = [];
  professionsPublished.value = [];
  try {
    professions.value = await professionResolver.getAll();
    if (professions.value.length != 0) {
      professions.value.forEach((profession) => {
        if (profession.archived) {
          professionsArchive.value?.push(profession);
        } else {
          professionsPublished.value?.push(profession);
        }
      });
      professionsArchive.value.sort((a, b) => a.id - b.id);
      professionsPublished.value.sort((a, b) => a.id - b.id);
    } else {
      popupStore.activateErrorPopup('Error occurred. No one profession found.');
    }
  } catch (e) {
    popupStore.activateErrorPopup((e as DefaultErrorDto).message);
  }
};

const reloadTests = async () => {
  if (UserState.role) {
    let additionTests: TestDataOutputDto[];
    let rdoTests: TestDataOutputDto[];
    if (UserState.role == UserRole.ADMIN || UserState.role == UserRole.EXPERT) {
      allTests.value.push(...(await testResolver.getAllByType('at')));
      allTests.value.push(...(await testResolver.getAllByType('sst')));
      allTests.value.push(...(await testResolver.getAllByType('slt')));
      allTests.value.push(...(await testResolver.getAllByType('hlt')));
      allTests.value.push(...(await testResolver.getAllByType('rdo')));
    }
    additionTests = await testResolver.getTestsByTypeByUserId(
      UserState.id!,
      'at',
    );
    rdoTests = await testResolver.getTestsByTypeByUserId(
      UserState.id!,
      'rdo'
    )
    if (additionTests) {
      tests.value.additionSound = additionTests.filter((test) =>
        testTypesStore.checkTestType(test).name == 'SOUND_ADDITION' ? test : null,
      );
      tests.value.additionVisual = additionTests.filter((test) =>
        testTypesStore.checkTestType(test).name == 'VISUAL_ADDITION' ? test : null,
      );
    }
    if (rdoTests) {
      tests.value.simpleRdo = rdoTests.filter((test) =>
        testTypesStore.checkTestType(test).name == 'SIMPLE_RDO' ? test : null,
      );
      tests.value.hardRdo = rdoTests.filter((test) =>
        testTypesStore.checkTestType(test).name == 'HARD_RDO' ? test : null,
      );
    }

    tests.value.simpleSound.push(
      ...(await testResolver.getTestsByTypeByUserId(UserState.id!, 'sst')),
    );
    tests.value.simpleLight.push(
      ...(await testResolver.getTestsByTypeByUserId(UserState.id!, 'slt')),
    );
    tests.value.hardLight.push(
      ...(await testResolver.getTestsByTypeByUserId(UserState.id!, 'hlt')),
    );
  }
};

const connectLocalTestsResults = () => {
  const resultsData = localStorage.getItem('completedTestsResults');
  if (resultsData && UserState.id) {
    const completedTestsResults: string[] = JSON.parse(resultsData);
    testResolver.updateUserIDs({
      userId: UserState.id,
      tokens: completedTestsResults,
    });
  }
};

onMounted(() => {
  if (UserState.role == UserRole.ADMIN) {
    reloadUsers();
  }
  connectLocalTestsResults();
  reloadProfessions();
  reloadTests();
  reloadTestBlocks();
});
</script>

<template>
  <div class="container">
    <div class="user-info-left">
      <div class="user-data-block">
        <p class="block_header">Информация о пользователе</p>

        <div class="info-block">
          <p class="field_label">Имя пользователя</p>
          <p class="field">{{ UserState.username }}</p>
        </div>
        <div class="info-block">
          <p class="field_label">Email</p>
          <p class="field">{{ UserState.email }}</p>
        </div>
        <div class="info-block">
          <p class="field_label">Role</p>
          <p class="field">{{ UserState.role }}</p>
        </div>
        <div class="info-block" v-if="UserState.age">
          <p class="field_label">Age</p>
          <p class="field">{{ calculateAge(UserState.age) }}</p>
        </div>
        <div class="info-block" v-if="UserState.gender">
          <p class="field_label">Gender</p>
          <p class="field">{{ UserState.gender }}</p>
        </div>
        <div class="test buttons">
          <CommonButton
            @click="router.push('/test/simple/sound')"
            class="submit_button"
          >
            <template #placeholder>Simple sound test</template>
          </CommonButton>
          <CommonButton
            @click="router.push('/test/simple/light')"
            class="submit_button"
          >
            <template #placeholder>Simple light test</template>
          </CommonButton>
          <CommonButton
            @click="router.push('/test/addition/sound')"
            class="submit_button"
          >
            <template #placeholder>Addition sound test</template>
          </CommonButton>
          <CommonButton
            @click="router.push('/test/addition/visual')"
            class="submit_button"
          >
            <template #placeholder>Addition visual test</template>
          </CommonButton>
          <CommonButton
            @click="router.push('/test/simple/rdo')"
            class="submit_button"
          >
            <template #placeholder>Simple rdo test</template>
          </CommonButton>
          <CommonButton
            @click="router.push('/test/hard/rdo')"
            class="submit_button"
          >
            <template #placeholder>Hard rdo test</template>
          </CommonButton>
        </div>
      </div>
      <div class="buttons_container">
        <Button @click="router.push('/profile/change')">
          <template v-slot:placeholder>Редактировать профиль</template>
        </Button>
        <Button @click="authResolver.logout" class="logout_button">
          <template v-slot:placeholder>Выйти из аккаунта</template>
        </Button>
      </div>
    </div>
    <div class="right-block">
      <div class="users-info" v-if="UserState.role == UserRole.ADMIN">
        <p class="block_header">Все пользователи</p>
        <UserManagerList
          :users="users"
          :max-elements-count="5"
          @users-list-update="reloadUsers"
        >
          <template v-slot:placeholder>Установить роль</template>
        </UserManagerList>
      </div>

      <div
        class="tests-info"
        v-if="
          UserState.role == UserRole.EXPERT || UserState.role == UserRole.ADMIN
        "
      >
        <p class="block_header">Все тесты</p>
        <TestsManagerList
          :tests="allTests"
          :max-elements-count="5"
          :users="users"
        />
      </div>

      <div
        class="tests-info"
        v-if="
          (UserState.role == UserRole.ADMIN || UserState.role == UserRole.EXPERT)
          && professionsPublished.length > 0
        "
      >
        <p class="block_header">Опубликованные профессии</p>
        <ProfessionsManagerList
          :professions="professionsPublished"
          :max-elements-count="5"
          @professions-list-update="reloadProfessions"
        />
      </div>

      <div
        class="tests-info"
        v-if="
          (UserState.role == UserRole.EXPERT || UserState.role == UserRole.ADMIN)
          && professionsArchive.length > 0
        "
      >
        <div class="block_header">Архивные профессии</div>
        <ProfessionsManagerList
          :professions="professionsArchive"
          :max-elements-count="3"
          :is-archive="true"
          @professions-list-update="reloadProfessions"
        />
      </div>

      <div class="tests-info" v-if="testBlocks && testBlocks.length > 0">
        <div class="block_header">Информация о назначенных блоках тестов</div>
        <TestBlocksManagerList :test-blocks="testBlocks" />
      </div>

      <div
        class="tests-info all"
        v-if="Object.values(tests).reduce((acc, arr) => acc + arr.length, 0)"
      >
        <div class="heading">
          <p class="block_header">Информация о пройденных тестах</p>
        </div>

        <div class="test-info" v-if="tests.simpleSound.length > 0">
          <p class="block_header">Реакция на простой звуковой сигнал</p>
          <TestsManagerList
            :tests="tests.simpleSound"
            :max-elements-count="5"
          />
        </div>

        <div class="test-info" v-if="tests.simpleLight.length > 0">
          <p class="block_header">Реакция на простой световой сигнал</p>
          <TestsManagerList
            :tests="tests.simpleLight"
            :max-elements-count="5"
          />
        </div>


        <div class="test-info" v-if="tests.additionSound.length > 0">
          <p class="block_header">Реакция на сложение по звуку</p>
          <TestsManagerList
            :tests="tests.additionSound"
            :max-elements-count="5"
          />
        </div>

        <div class="test-info" v-if="tests.additionVisual.length > 0">
          <p class="block_header">Реакция на сложение визуально</p>
          <TestsManagerList
            :tests="tests.additionVisual"
            :max-elements-count="5"
          />
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 95vw;
  height: 80vh;
  background-color: var(--background-primary);
  border-radius: 15px;
  padding: 2vh;
  display: grid;
  grid-template-columns: 2fr 7fr;
  gap: 1rem;
}

.user-info-left {
  height: 75vh;
  background-color: var(--background-primary);
  padding: 1.5vw;
  border-radius: 15px;
  display: flex;
  flex-direction: column;

  .buttons_container {
    margin-top: auto;
  }
}

.test.buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1vw;
}

.users-info, .tests-info, .test-info {
  display: flex;
  flex-direction: column;
  min-height: 75vh;
  padding: 1.5vw;
  background-color: var(--background-primary);
  border-radius: 15px;
}

.tests-info {
  gap: 1vw;
}

.tests-info.all {
  min-height: fit-content;
  padding: 0;
  background-color: transparent;
}

.right-block {
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  height: 75vh;
}

.block_header {
  display: flex;
  justify-content: center;
  border-radius: 10px;
  padding: 0.5rem 0;
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  font-weight: bolder;
  color: rgb(237, 227, 227, 0.9);
}

.field_label {
  font-weight: 600;
  color: white;
}

.field {
  color: white;
  margin-bottom: 1vw;
}

.buttons_container {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
</style>
