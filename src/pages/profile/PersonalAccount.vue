<script setup lang="ts">
import Button from '../../components/UI/CommonButton.vue';
import { computed, onMounted, ref } from 'vue';
import TestsManagerList from '../../components/personalAccount/TestsManagerList.vue';
import UserManagerList from '../../components/personalAccount/UserManagerList.vue';
import ProfessionsManagerList from '../../components/personalAccount/ProfessionsManagerList.vue';
import { calculateAge, UserState } from '../../utils/userState/UserState.ts';
import { ProfessionResolver } from '../../api/resolvers/profession/profession.resolver.ts';
import type { GetProfessionOutputDto } from '../../api/resolvers/profession/dto/output/get-profession-output.dto.ts';
import type { DefaultErrorDto } from '../../api/dto/common/default-error.dto.ts';
import { AuthResolver } from '../../api/resolvers/auth/auth.resolver.ts';
import router from '../../router/router.ts';
import { TestResolver } from '../../api/resolvers/test/test.resolver.ts';
import { UserResolver } from '../../api/resolvers/user/user.resolver.ts';
import type { UserDataOutputDto } from '../../api/resolvers/user/dto/output/user-data-output.dto.ts';
import { UserRole } from '../../utils/userState/UserState.types.ts';
import { useTestTypesStore } from '../../store/test-types.store.ts';
import type { GetTestBlockOutputDto } from '../../api/resolvers/testBlocks/dto/output/get-test-block-output.dto.ts';
import { TestBlockResolver } from '../../api/resolvers/testBlocks/test-block.resolver.ts';
import TestBlocksManagerList from '../../components/personalAccount/TestBlocksManagerList.vue';
import CommonButton from '../../components/UI/CommonButton.vue';
import type {
  TestDataOutputAdditionRdoDto
} from '../../api/resolvers/test/dto/output/test-data-output-addition-rdo.dto.ts';
import type {
  TestDataOutputSimpleTrackingDto
} from '../../api/resolvers/test/dto/output/test-data-output-simple-tracking.dto.ts';
import type {
  TestDataOutputHardTrackingDto
} from '../../api/resolvers/test/dto/output/test-data-output-hard-tracking.dto.ts';
import type { TestDataOutputCognitiveDto } from '../../api/resolvers/test/dto/output/test-data-output-cognitive.dto.ts';
import type {
  TestDataOutputHardLightDto
} from '../../api/resolvers/test/dto/output/test-data-output-hard-light.dto.ts';
import type {
  TestDataOutputSimpleLightSoundDto
} from '../../api/resolvers/test/dto/output/test-data-output-simple-light-sound.dto.ts';
import type { TestDataOutputUnionDto } from '../../api/resolvers/test/dto/output/test-data-output-union.dto.ts';

const authResolver = new AuthResolver();
const userResolver = new UserResolver();
const testResolver = new TestResolver();
const testBlockResolver = new TestBlockResolver();
const professionResolver = new ProfessionResolver();

const testTypesStore = useTestTypesStore();
testTypesStore.loadTestTypes();

const users = ref<UserDataOutputDto[]>([]);
const professions = ref<GetProfessionOutputDto[] | null>(null);
const tests = ref<{
  additionSound: TestDataOutputAdditionRdoDto[];
  additionVisual: TestDataOutputAdditionRdoDto[];
  simpleSound: TestDataOutputSimpleLightSoundDto[];
  simpleLight: TestDataOutputSimpleLightSoundDto[];
  hardLight: TestDataOutputHardLightDto[];
  simpleRdo: TestDataOutputAdditionRdoDto[];
  hardRdo: TestDataOutputAdditionRdoDto[];
  simpleTracking: TestDataOutputSimpleTrackingDto[];
  hardTracking: TestDataOutputHardTrackingDto[];
  numerical: TestDataOutputCognitiveDto[];
  stroop: TestDataOutputCognitiveDto[];
  verbal: TestDataOutputCognitiveDto[];
}>({
  additionSound: [],
  additionVisual: [],
  simpleSound: [],
  simpleLight: [],
  hardLight: [],
  simpleRdo: [],
  hardRdo: [],
  simpleTracking: [],
  hardTracking: [],
  numerical: [],
  stroop: [],
  verbal: [],
});
const allTests = ref<TestDataOutputUnionDto[]>([]);
const professionsArchive = ref<GetProfessionOutputDto[]>([]);
const professionsPublished = ref<GetProfessionOutputDto[]>([]);
const testBlocks = ref<GetTestBlockOutputDto[]>([]);
const publicTestBlocks = ref<GetTestBlockOutputDto[]>([]);

const reloadTestBlocks = async () => {
  try {
    testBlocks.value = await testBlockResolver.getAllByUserId(UserState.id!);
    publicTestBlocks.value = await testBlockResolver.getAllByUserId(999999);
    testBlocks.value.sort((a, b) => a.id - b.id);
    publicTestBlocks.value.sort((a, b) => a.id - b.id);
  } catch (e) {}
};

const reloadUsers = async () => {
  const result = await userResolver.getAll();
  if (result != null) {
    users.value = result.body.filter(user => user.id !== 999999).sort((a, b) => a.id - b.id);
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
    }
  } catch (e) {
    console.log((e as DefaultErrorDto).message)
  }
};

const reloadTests = async () => {
  if (UserState.role) {
    try {
      let additionTests: TestDataOutputAdditionRdoDto[];
      let rdoTests: TestDataOutputAdditionRdoDto[];
      let cognitiveTests: TestDataOutputCognitiveDto[];
      if (UserState.role == UserRole.ADMIN || UserState.role == UserRole.EXPERT) {
        const promises: TestDataOutputUnionDto[] = [
          ...await testResolver.getAllByType<'at'>('at'),
          ...await testResolver.getAllByType<'sst'>('sst'),
          ...await testResolver.getAllByType<'slt'>('slt'),
          ...await testResolver.getAllByType<'hlt'>('hlt'),
          ...await testResolver.getAllByType<'rdo'>('rdo'),
          ...await testResolver.getAllByType<'tracking/simple'>('tracking/simple'),
          ...await testResolver.getAllByType<'tracking/hard'>('tracking/hard'),
          ...await testResolver.getAllByType<'cognitive'>('cognitive')
        ]
        await Promise.all(promises);
        allTests.value.push(...promises)
      }
      additionTests = await testResolver.getTestsByTypeByUserId(
        UserState.id!,
        'at',
      );
      rdoTests = await testResolver.getTestsByTypeByUserId(
        UserState.id!,
        'rdo'
      );
      cognitiveTests = await testResolver.getTestsByTypeByUserId(
        UserState.id!,
        'cognitive'
      );
      if (additionTests) {
        tests.value.additionSound = additionTests.filter((test) =>
          testTypesStore.checkTestType(test).name == 'ADDITION_SOUND' ? test : null,
        );
        tests.value.additionVisual = additionTests.filter((test) =>
          testTypesStore.checkTestType(test).name == 'ADDITION_VISUAL' ? test : null,
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
      if (cognitiveTests) {
        tests.value.numerical = cognitiveTests.filter((test) =>
          testTypesStore.checkTestType(test).name == 'NUMERICAL' ? test : null,
        );
        tests.value.stroop = cognitiveTests.filter((test) =>
          testTypesStore.checkTestType(test).name == 'STROOP' ? test : null,
        );
        tests.value.verbal = cognitiveTests.filter((test) =>
          testTypesStore.checkTestType(test).name == 'VERBAL' ? test : null,
        );
      }

      tests.value.simpleSound.push(
        ...(await testResolver.getTestsByTypeByUserId<TestDataOutputSimpleLightSoundDto>(UserState.id!, 'sst')),
      );
      tests.value.simpleLight.push(
        ...(await testResolver.getTestsByTypeByUserId<TestDataOutputSimpleLightSoundDto>(UserState.id!, 'slt')),
      );
      tests.value.hardLight.push(
        ...(await testResolver.getTestsByTypeByUserId<TestDataOutputHardLightDto>(UserState.id!, 'hlt')),
      );
      tests.value.simpleTracking.push(
        ...(await testResolver.getTestsByTypeByUserId<TestDataOutputSimpleTrackingDto>(UserState.id!, 'tracking/simple'))
      )
      tests.value.hardTracking.push(
        ...(await testResolver.getTestsByTypeByUserId<TestDataOutputHardTrackingDto>(UserState.id!, 'tracking/hard'))
      )
      Object.entries(tests.value).forEach(([_, category]) => {
        category.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      })
      allTests.value.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {}
  }
};

const emptyProfile = computed(() => {
  return allTests.value.length == 0 &&
    Object.values(tests.value).reduce((acc, category) => acc + category.length, 0) == 0 &&
    users.value.length == 0
})

onMounted(() => {
  reloadUsers();
  reloadTests();
  reloadTestBlocks();
  if (UserState.role == UserRole.EXPERT || UserState.role == UserRole.ADMIN) {
    reloadProfessions();
  }
});
</script>

<template>
  <div class="container" v-if="testTypesStore.getTestTypes.length > 0">
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
          (UserState.role == UserRole.EXPERT || UserState.role == UserRole.ADMIN)
          && allTests.length > 0
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

      <div class="tests-info" v-if="publicTestBlocks && publicTestBlocks.length > 0">
        <div class="block_header">Гостевые блоки тестов</div>
        <TestBlocksManagerList :test-blocks="publicTestBlocks" :guest="true"/>
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

        <div class="test-info" v-if="tests.hardLight.length > 0">
          <p class="block_header">Реакция на сложный световой сигнал</p>
          <TestsManagerList
            :tests="tests.hardLight"
            :max-elements-count="5"
          />
        </div>

        <div class="test-info" v-if="tests.simpleRdo.length > 0">
          <p class="block_header">Простая реакция на движущийся объект</p>
          <TestsManagerList
            :tests="tests.simpleRdo"
            :max-elements-count="5"
          />
        </div>

        <div class="test-info" v-if="tests.hardRdo.length > 0">
          <p class="block_header">Сложная реакция на движущийся объект</p>
          <TestsManagerList
            :tests="tests.hardRdo"
            :max-elements-count="5"
          />
        </div>

        <div class="test-info" v-if="tests.simpleTracking.length > 0">
          <p class="block_header">Простая реакция на аналаговое преследование</p>
          <TestsManagerList
            :tests="tests.simpleTracking"
            :max-elements-count="5"
          />
        </div>

        <div class="test-info" v-if="tests.hardTracking.length > 0">
          <p class="block_header">Сложная реакция на аналаговое преследование</p>
          <TestsManagerList
            :tests="tests.hardTracking"
            :max-elements-count="5"
          />
        </div>

        <div class="test-info" v-if="tests.numerical.length > 0">
          <p class="block_header">Числовые последовательности</p>
          <TestsManagerList
            :tests="tests.numerical"
            :max-elements-count="5"
          />
        </div>

        <div class="test-info" v-if="tests.stroop.length > 0">
          <p class="block_header">Тест Струпа</p>
          <TestsManagerList
            :tests="tests.stroop"
            :max-elements-count="5"
          />
        </div>

        <div class="test-info" v-if="tests.verbal.length > 0">
          <p class="block_header">Тест на вербальное восприятие</p>
          <TestsManagerList
            :tests="tests.verbal"
            :max-elements-count="5"
          />
        </div>
      </div>
      <div
        v-if="emptyProfile"
        class="empty-profile tests-info"
      >
        <h2>Похоже, тут еще ничего нет</h2>
        <CommonButton
          class="submit_button"
          @click="router.push('/tests')"
        >
          <template #placeholder>Перейти в каталог тестов</template>
        </CommonButton>
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

.empty-profile {
  display: flex;
  justify-content: center;
  align-items: center;

  .submit_button {
    width: 50%;
  }
}
</style>
