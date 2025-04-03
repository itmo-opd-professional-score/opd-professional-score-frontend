<script setup lang="ts">
import Button from "../components/UI/CommonButton.vue";
import {onMounted, ref} from "vue";
import TestsManagerList from "../components/TestsManagerList.vue";
import UserManagerList from "../components/UserManagerList.vue";
import ProfessionsManagerList from "../components/ProfessionsManagerList.vue";
import {UserState} from "../utils/userState/UserState.ts";
import {ProfessionResolver} from "../api/resolvers/profession/profession.resolver.ts";
import type {GetProfessionOutputDto} from "../api/resolvers/profession/dto/output/get-profession-output.dto.ts";
import {usePopupStore} from "../store/popup.store.ts";
import type {DefaultErrorDto} from "../api/dto/common/default-error.dto.ts";
import {AuthResolver} from "../api/resolvers/auth/auth.resolver.ts";
import router from "../router/router.ts";
import {TestResolver} from "../api/resolvers/test/test.resolver.ts";
import {UserResolver} from "../api/resolvers/user/user.resolver.ts";
import type {UserDataInputDto} from "../api/resolvers/user/dto/input/user-data-input.dto.ts";
import type {TestDataInputDto} from "../api/resolvers/test/dto/input/test-data-input.dto.ts";
import {UserRole} from "../utils/userState/UserState.types.ts";
import {useTestTypesStore} from "../store/test-types.store.ts";
import type {GetTestBlockInputDto} from "../api/resolvers/testBlocks/dto/input/get-test-block-input.dto.ts";
import {TestBlockResolver} from "../api/resolvers/testBlocks/test-block.resolver.ts";
import TestBlocksManagerList from "../components/TestBlocksManagerList.vue";

const authResolver = new AuthResolver();
const userResolver = new UserResolver();
const testResolver = new TestResolver();
const testBlockResolver = new TestBlockResolver();
const professionResolver = new ProfessionResolver();

const popupStore = usePopupStore();
const testTypesStore = useTestTypesStore();
testTypesStore.loadTestTypes();

const users = ref<UserDataInputDto[]>([]);
const professions = ref<GetProfessionOutputDto[] | null>(null);
const tests = ref<{
  additionSound: TestDataInputDto[],
  additionVisual: TestDataInputDto[],
  simpleSound: TestDataInputDto[],
  simpleLight: TestDataInputDto[],
  hardLight: TestDataInputDto[],
}>({
  additionSound: [],
  additionVisual: [],
  simpleSound: [],
  simpleLight: [],
  hardLight: [],
})
const allTests = ref<TestDataInputDto[]>([]);
const professionsArchive = ref<GetProfessionOutputDto[] | null>(null)
const professionsPublished = ref<GetProfessionOutputDto[] | null>(null)
const testBlocks = ref<GetTestBlockInputDto[] | null>(null)

const reloadTestBlocks = async () => {
  const res = await testBlockResolver.getByUserId(UserState.id ? UserState.id : 0);
  if (res != null) testBlocks.value = res;
}

const reloadUsers = async () => {
  const result = await userResolver.getAll()
  if (result != null) {
    users.value = result.body
  }
}

const reloadProfessions = async () => {
  professionsArchive.value = []
  professionsPublished.value = []
  try {
    professions.value = await professionResolver.getAll();
    if (professions.value.length != 0) {
      professions.value.forEach(profession => {
        if (profession.archived) {
          professionsArchive.value?.push(profession)
        } else {
          professionsPublished.value?.push(profession)
        }
      })
      professionsArchive.value.sort((a, b) => a.id - b.id);
      professionsPublished.value.sort((a, b) => a.id - b.id);

    } else {
      popupStore.activateErrorPopup("Error occurred. No one profession found.")
    }
  } catch (e) {
    popupStore.activateErrorPopup((e as DefaultErrorDto).message)
  }
}

const reloadTests = async () => {
  if (UserState.role) {
    let additionTests: TestDataInputDto[]
    if (UserState.role == UserRole.ADMIN || UserState.role == UserRole.EXPERT) {
      allTests.value.push(...await testResolver.getAllByType('at'))
      allTests.value.push(...await testResolver.getAllByType('sst'))
      allTests.value.push(...await testResolver.getAllByType('slt'))
      allTests.value.push(...await testResolver.getAllByType('hlt'))
    }
    additionTests = await testResolver.getTestsByTypeByUserId(UserState.id!, 'at')
    if (additionTests) {
      tests.value.additionSound = additionTests.filter(test =>
          testTypesStore.checkTestType(test) == "SOUND_ADDITION" ? test : null
      )
      tests.value.additionVisual = additionTests.filter(test =>
          testTypesStore.checkTestType(test) == "VISUAL_ADDITION" ? test : null
      )
    }
    tests.value.simpleSound.push(...await testResolver.getTestsByTypeByUserId(UserState.id!, 'sst'))
    tests.value.simpleLight.push(...await testResolver.getTestsByTypeByUserId(UserState.id!, 'slt'))
    tests.value.hardLight.push(...await testResolver.getTestsByTypeByUserId(UserState.id!, 'hlt'))
  }
}

const connectLocalTestsResults = () => {
  const resultsData = localStorage.getItem("completedTestsResults")
  if (resultsData && UserState.id) {
    const completedTestsResults: string[] = JSON.parse(resultsData)
    testResolver.updateUserIDs({
      userId: UserState.id,
      tokens: completedTestsResults,
    })
  }
}

onMounted(() => {
  if (UserState.role == UserRole.ADMIN) {
    reloadUsers()
  }
  connectLocalTestsResults()
  reloadProfessions()
  reloadTests()
  reloadTestBlocks()
})
</script>

<template>
  <div class="container">
    <div class="user-info">
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

      <div class="tests-info" v-if="UserState.role == UserRole.ADMIN">
        <p class="block_header">Все пользователи</p>
        <div class="user_data_block">
          <UserManagerList
              :users="users"
              :max-elements-count="5"
              @users-list-update="reloadUsers"
          >
            <template v-slot:placeholder>Установить роль</template>
          </UserManagerList>
        </div>
      </div>

      <div class="tests-info" v-if="UserState.role == UserRole.EXPERT || UserState.role == UserRole.ADMIN">
        <div class="test-info-all">
          <p class="block_header">Все тесты</p>
          <div class="test_data_block">
            <TestsManagerList
                :tests="allTests"
                :max-elements-count="5"
            />
          </div>
        </div>
      </div>

      <div class="tests-info"
           v-if="UserState.role == UserRole.EXPERT || UserState.role == UserRole.ADMIN && professionsPublished != null && professionsPublished.length > 0">
        <p class="block_header">Опубликованные профессии</p>
        <div class="profession_data_block">
          <ProfessionsManagerList
              :professions="professionsPublished as GetProfessionOutputDto[]"
              :max-elements-count="5"
              @professions-list-update="reloadProfessions"
              v-if="professions != null"
          />
        </div>
      </div>

      <div class="tests-info"
           v-if="(UserState.role == UserRole.EXPERT || UserState.role == UserRole.ADMIN) && professionsPublished != null && professionsPublished.length > 0">
        <p class="block_header">Архивные профессии</p>
        <div class="profession_data_block">
          <ProfessionsManagerList
              :professions="professionsArchive as GetProfessionOutputDto[]"
              :max-elements-count="5"
              :is-archive="true"
              @professions-list-update="reloadProfessions"
          />
        </div>
      </div>

      <div class="tests-info" v-if="testBlocks && testBlocks.length > 0">
        <div class="block_header">Информация о назначенных блоках тестов</div>
        <div class="profession_data_block">
          <TestBlocksManagerList :test-blocks="testBlocks"/>
        </div>
      </div>

      <div class="tests-info" v-if="Object.values(tests).reduce((acc, arr) => acc + arr.length, 0)">
        <div class="heading">
          <p class="block_header">Информация о пройденных тестах </p>
        </div>

        <div class="test-info" v-if="tests.simpleSound.length > 0">
          <p class="block_header">Реакция на простой звуковой сигнал</p>
          <div class="test_data_block">
            <TestsManagerList :tests="tests.simpleSound" :max-elements-count="5"/>
          </div>
        </div>

        <div class="test-info" v-if="tests.simpleLight.length > 0">
          <p class="block_header">Реакция на простой световой сигнал</p>
          <div class="test_data_block">
            <TestsManagerList :tests="tests.simpleLight" :max-elements-count="5"/>
          </div>
        </div>

        <div class="test-info" v-if="tests.hardLight.length > 0">
          <p class="block_header">Реакция на сложный световой сигнал</p>
          <div class="test_data_block">
            <TestsManagerList :tests="tests.hardLight" :max-elements-count="5"/>
          </div>
        </div>

        <div class="test-info" v-if="tests.additionSound.length > 0">
          <p class="block_header">Реакция на сложение по звуку</p>
          <div class="test_data_block">
            <TestsManagerList :tests="tests.additionSound" :max-elements-count="5"/>
          </div>
        </div>

        <div class="test-info" v-if="tests.additionVisual.length > 0">
          <p class="block_header">Реакция на сложение визуально</p>
          <div class="test_data_block">
            <TestsManagerList :tests="tests.additionVisual" :max-elements-count="5"/>
          </div>
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

.user-info, .tests-info {
  display: flex;
  flex-direction: column;
  background-color: var(--background-primary);
  padding: 1rem;
  border-radius: 15px;
  min-height: 75vh;
  overflow: scroll;

  .test-info {
    height: 80%;
  }

  .user_data_block {
    height: 100%;
  }

  .test-info-all, .profession_data_block {
    height: 90%;
  }
}

.user-info {
  justify-content: space-between;
  height: 75vh;
}

.right-block {
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  height: 75vh;
}

.user-data-block {
  padding: 0 10px;
  border-radius: 10px;
  color: rgb(237, 227, 227);
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

.info-block {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5rem;
}

.field_label {
  font-weight: 600;
}

.buttons_container {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.test_data_block {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}
</style>