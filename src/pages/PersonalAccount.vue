<script setup lang="ts">
import Button from "../components/UI/CommonButton.vue";
import {onMounted, ref} from "vue";
import TestsManagerList from "../components/TestsManagerList.vue";
import UserManagerList from "../components/UserManagerList.vue";
import ProfessionsManagerList from "../components/ProfessionsManagerList.vue";
import TestScoreList from "../components/TestsScoreList.vue";
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
import {checkTestType} from "../utils/testTypeState/TestTypeState.ts";
import * as test from "node:test";

const authResolver = new AuthResolver();
const userResolver = new UserResolver()
const testResolver = new TestResolver();
const professionResolver = new ProfessionResolver()

const popupStore = usePopupStore();
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
const professionsArchive = ref<GetProfessionOutputDto[] | null>(null)
const professionsPublished = ref<GetProfessionOutputDto[] | null>(null)

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
      professionsArchive.value.sort((a, b) => a.id - b.id );
      professionsPublished.value.sort((a, b) => a.id - b.id );

    } else {
      popupStore.activateErrorPopup("Error occurred. No one profession found.")
    }
  } catch (e) {
    popupStore.activateErrorPopup((e as DefaultErrorDto).message)
  }
}

const reloadTests = async () => {
  let additionTests: TestDataInputDto[] | null
  const simpleSoundTests: TestDataInputDto[] = []
  const simpleLightTests: TestDataInputDto[] = []
  const hardLightTests: TestDataInputDto[] = []
  switch (UserState.role) {
    case UserRole.ADMIN:
      break
    case UserRole.USER:
      additionTests = await testResolver.getAdditionByUserId(UserState.id!)
      if (additionTests) {
        tests.value.additionSound = additionTests.filter(test =>
            checkTestType(test) == "SOUND_ADDITION" ? test : null
        )
        tests.value.additionVisual = additionTests.filter(test =>
            checkTestType(test) == "VISUAL_ADDITION" ? test : null
        )
      }
      break
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




const testData = ref([
  {
    id: 1,
    test_name: 'Test 1',
    current_points: 80,
    max_points: 100,
    time: '00:10:00',
    username: "Фокин Владимир",
    createdAt: "13.04.2023 13:00",
    valid: true
  },
  {
    id: 2,
    test_name: 'Test 2',
    current_points: 90,
    max_points: 100,
    time: '00:15:00',
    username: "Фокин Владимир",
    createdAt: "13.04.2023 13:00",
    valid: true
  },
  {
    id: 3,
    test_name: 'Test 3',
    current_points: 75,
    max_points: 100,
    time: '00:12:00',
    username: "Фокин Владимир",
    createdAt: "13.04.2023 13:00",
    valid: false
  },
  {
    id: 4,
    test_name: 'Test 4',
    current_points: 60,
    max_points: 100,
    time: '00:08:00',
    username: "Фокин Владимир",
    createdAt: "13.04.2023 13:00",
    valid: true
  },
  {
    id: 5,
    test_name: 'Test 5',
    current_points: 95,
    max_points: 100,
    time: '00:20:00',
    username: "Фокин Владимир",
    createdAt: "13.04.2023 13:00",
    valid: true
  },
  {
    id: 6,
    test_name: 'Test 6',
    current_points: 50,
    max_points: 100,
    time: '00:05:00',
    username: "Фокин Владимир",
    createdAt: "13.04.2023 13:00",
    valid: false
  },
  {
    id: 7,
    test_name: 'Test 7',
    current_points: 85,
    max_points: 100,
    time: '00:13:00',
    username: "Фокин Владимир",
    createdAt: "13.04.2023 13:00",
    valid: true
  },
  {
    id: 8,
    test_name: 'Test 8',
    current_points: 70,
    max_points: 100,
    time: '00:09:00',
    username: "Фокин Владимир",
    createdAt: "13.04.2023 13:00",
    valid: false
  },
  {
    id: 9,
    test_name: 'Test 9',
    current_points: 100,
    max_points: 100,
    time: '00:25:00',
    username: "Фокин Владимир",
    createdAt: "13.04.2023 13:00",
    valid: true
  },
  {
    id: 10,
    test_name: 'Test 10',
    current_points: 40,
    max_points: 100,
    time: '00:04:00',
    username: "Фокин Владимир",
    createdAt: "13.04.2023 13:00",
    valid: false
  },
  {
    id: 11,
    test_name: 'Test 11',
    current_points: 65,
    max_points: 100,
    time: '00:11:00',
    username: "Фокин Владимир",
    createdAt: "13.04.2023 13:00",
    valid: true
  },
  {
    id: 12,
    test_name: 'Test 12',
    current_points: 55,
    max_points: 100,
    time: '00:07:00',
    username: "Фокин Владимир",
    createdAt: "13.04.2023 13:00",
    valid: false
  },
  {
    id: 13,
    test_name: 'Test 13',
    current_points: 78,
    max_points: 100,
    time: '00:14:00',
    username: "Фокин Владимир",
    createdAt: "13.04.2023 13:00",
    valid: true
  },
  {
    id: 14,
    test_name: 'Test 14',
    current_points: 92,
    max_points: 100,
    time: '00:18:00',
    username: "Фокин Владимир",
    createdAt: "13.04.2023 13:00",
    valid: true
  },
  {
    id: 15,
    test_name: 'Test 15',
    current_points: 30,
    max_points: 100,
    time: '00:03:00',
    username: "Фокин Владимир",
    createdAt: "13.04.2023 13:00",
    valid: false
  },
  {
    id: 16,
    test_name: 'Test 16',
    current_points: 23,
    max_points: 100,
    time: '00:02:00',
    username: "Фокин Владимир",
    createdAt: "13.04.2023 13:00",
    valid: false
  },
]);


onMounted(() => {
  if (UserState.role == UserRole.ADMIN) {
    reloadUsers()
  }
  connectLocalTestsResults()
  reloadProfessions()
  reloadTests()
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

      <div class="tests-info" v-if="UserState.role == 'ADMIN'">
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

      <div class="tests-info" v-if="UserState.role == 'EXPERT' || UserState.role == 'ADMIN'">
        <p class="block_header">Все тесты</p>
        <div class="test_data_block">
          <TestsManagerList :tests="tests.additionSound" :max-elements-count="5"/>
        </div>
      </div>

      <div class="tests-info" v-if="UserState.role == 'EXPERT' || UserState.role == 'ADMIN'">
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

      <div class="tests-info" v-if="(UserState.role == 'EXPERT' || UserState.role == 'ADMIN') && professions != null">
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

      <div class="tests-info">
        <p class="block_header">Информация о пройденных тестах</p>
        <div class="test_data_block">
          <TestsManagerList :tests="tests.additionSound" :max-elements-count="5"/>
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
  padding: 0.75rem;
  border-radius: 15px;
  min-height: 75vh;
  overflow: scroll;
}

.user-info {
  justify-content: space-between;
  height: 75vh;
}

.right-block {
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
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
  justify-content: center;
  align-items: center;
}
</style>