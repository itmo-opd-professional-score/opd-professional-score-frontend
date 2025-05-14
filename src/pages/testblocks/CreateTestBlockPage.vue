<script lang="ts">
import TestRowElement from '../../components/personalAccount/TestRowElement.vue';
import CommonButton from '../../components/UI/CommonButton.vue';
import { TestBlockResolver } from '../../api/resolvers/testBlocks/test-block.resolver.ts';
import { UserResolver } from '../../api/resolvers/user/user.resolver.ts';
import type { UserDataOutputDto } from '../../api/resolvers/user/dto/output/user-data-output.dto.ts';
import UserRowElement from '../../components/personalAccount/UserRowElement.vue';
import type { CreateTestBlockInputDto } from '../../api/resolvers/testBlocks/dto/input/create-test-block-input.dto.ts';
import { usePopupStore } from '../../store/popup.store.ts';
import type { TestTypeDataOutputDto } from '../../api/resolvers/testType/dto/output/test-type-data-output.dto.ts';
import router from '../../router/router.ts';
import type { TestBlockTest } from '../tests/types';
import { TestTypeResolver } from '../../api/resolvers/testType/testType.resolver.ts';
import CustomInput from '../../components/UI/inputs/CustomInput.vue';
import type { TestBatteryOutputDto } from '../../api/resolvers/testBattery/dto/output/test-battery-output.dto.ts';
import TestBatteryRowElement from '../../components/testBattery/TestBatteryRowElement.vue';
import type {
  CreateTestBatteryInputDto
} from '../../api/resolvers/testBattery/dto/input/create-test-battery-input.dto.ts';
import BatteryForm from '../../components/testBattery/BatteryForm.vue';
import { TestBatteryResolver } from '../../api/resolvers/testBattery/test-battery.resolver.ts';

export default {
  name: 'CreateTestBlockPage',
  components: { BatteryForm, TestBatteryRowElement, CustomInput, UserRowElement, CommonButton, TestRowElement },
  data() {
    const popupStore = usePopupStore();
    const testBlockResolver = new TestBlockResolver();
    const userResolver = new UserResolver();

    return {
      approvedUsers: [] as number[],
      approvedTests: [] as TestBlockTest[],
      testTypes: [] as TestTypeDataOutputDto[],
      usersFromApi: [] as UserDataOutputDto[],
      batteries: [] as TestBatteryOutputDto[],
      searchedUser: '',
      testBlockResolver,
      userResolver,
      popupStore,
      batteryMode: false,
      showModal: false,
      currentBattery: {} as CreateTestBatteryInputDto,
      batteryId: null as number | null
    };
  },
  computed: {
    users() {
      if (this.searchedUser == '') return this.usersFromApi.sort((a, b) => a.id - b.id)
      return this.usersFromApi
        .filter(user => user.username.toLowerCase().includes(this.searchedUser.toLowerCase()))
        .sort((a, b) => a.id - b.id);
    }
  },
  async mounted() {
    try {
      await this.loadBatteries()
      await this.loadTests()
      const usersApi = (await new UserResolver().getAll())?.body.filter(user => user.id !== 999999)
      if (usersApi) this.usersFromApi = usersApi
    } catch (e) {}
  },
  methods: {
    router() {
      return router
    },
    async loadBatteries() {
      const batteriesApi = await new TestBatteryResolver().getAll()
      if (batteriesApi) this.batteries = batteriesApi
      if (this.batteries.length == 0) this.batteryMode = false
    },
    async loadTests() {
      const testTypesApi = await new TestTypeResolver().getAll()
      if (testTypesApi) this.testTypes = testTypesApi
    },
    async save() {
      if (this.approvedTests.length > 0 && this.approvedUsers.length > 0) {
        const data: CreateTestBlockInputDto = {
          tests: this.approvedTests,
          userIDs: this.approvedUsers,
        };

        const token = await this.testBlockResolver.createTestBlock(data);
        this.popupStore.activateInfoPopup('Блок тестов создан успешно!');
        if (this.approvedUsers.some(userId => userId === 999999)) {
          console.log(token)
        }
        localStorage.removeItem("localTestBlock");
        await router.push('/profile');
      } else {
        this.popupStore.activateErrorPopup(
          'Должен быть выбран хотя бы 1 тест и 1 пользователь!',
        );
      }
    },
    updateBatteryOnEdit(selectedBattery: TestBatteryOutputDto) {
      this.showModal = true;
      this.currentBattery = {
        name: selectedBattery.name,
        description: selectedBattery.description,
        tests: selectedBattery.testInTestBattery.map(test => {
          return {
            name: test.name,
            setupId: test.setupId,
          }
        })
      }
      this.batteryId = selectedBattery.id
    },
    updateApproved() {
      this.currentBattery.tests = this.approvedTests.map(test => {
        return {
          name: test.name,
          setupId: test.setupId ? test.setupId : null,
        }
      })
      this.batteryId = null
    },
    clearBattery(id: number) {
      if (id === this.batteryId)  {
        this.batteryId = null;
        this.approvedTests = [];
        this.currentBattery = { description: '', name: '', tests: [] }
        router.go(0)
      }
      this.showModal = false
    },
    async setBattery(selectedBattery: TestBatteryOutputDto) {
      {
        this.currentBattery = {
          name: selectedBattery.name,
          description: selectedBattery.description,
          tests: selectedBattery.testInTestBattery.map(test => {
            return {
              name: test.name,
              setupId: test.setupId,
            }
          }),
        };
        this.approvedTests = selectedBattery.testInTestBattery.map(test => {
          return {
            name: test.name,
            setupId: test.setupId != null ? test.setupId : undefined,
            available: true
          }
        })
        this.batteryMode = false;
        this.batteryId = selectedBattery.id
        this.testTypes = []
        await this.loadTests()
      }
    }
  },
  watch: {
    async showModal() {
      await this.loadBatteries()
    },
  }
};
</script>

<template>
  {{ batteryMode }}
  <BatteryForm
    v-if="currentBattery && showModal"
    :current-battery="currentBattery"
    :battery-id="batteryId ? batteryId : undefined"
    @create-or-update="id => {showModal = false; batteryId = id}"
    @delete="id => clearBattery(id)"
    @close-modal="showModal = false"
  />
  <div class="container" v-if="usersFromApi.length > 0 && testTypes.length > 0">
    <h1 class="container-header">Создание блока тестов</h1>
    <div class="block-header">
      <h2>Выберите тесты:</h2>
      <div class="battery-controls">
        <CommonButton
          class="battery-switch"
          :disabled="batteries.length == 0"
          @click="batteryMode = !batteryMode"
        >
          <template v-slot:placeholder>{{ batteryMode ? 'Скрыть' : 'Показать'}} батареи</template>
        </CommonButton>
        <CommonButton
          class="battery-switch"
          :disabled="approvedTests.length == 0 || batteryMode"
          @click="showModal = true"
        >
          <template v-slot:placeholder>{{ batteryId != null ? 'Изменить' : 'Сохранить'}} батарею</template>
        </CommonButton>
      </div>
    </div>
    <div class="batteries-container" v-if="batteryMode">
      <TestBatteryRowElement
        v-for="(battery, index) in batteries"
        :key="index"
        :test-battery="battery"
        @edit-battery="(selectedBattery) => updateBatteryOnEdit(selectedBattery)"
        @select-battery="selectedBattery => setBattery(selectedBattery)"
      />
    </div>
    <div class="tests-container" v-else>
      <TestRowElement
        v-for="(test, index) in testTypes"
        :key="index"
        :test="test"
        :selected="approvedTests.find(tesT => tesT.name == test.name) !== undefined"
        :setup-id="approvedTests.find(tesT => tesT.name == test.name)?.setupId"
        @apply-test="(appliedTest) => {
          approvedTests = [...approvedTests, appliedTest]; updateApproved()
        }"
        @remove-test="(removedTest) => {
          approvedTests = approvedTests.filter(tesT => tesT.name !== removedTest.name); updateApproved()
        }"
      />
    </div>
    <h2 class="block-header">Выберите пользователей:</h2>
    <div class="user-container">
      <div class="search-field">
        <CustomInput
          class="inner"
          type="text"
          v-model="searchedUser"
          placeholder="Напишите имя пользователя"
        />
      </div>
      <UserRowElement
        v-for="(user, index) in users"
        :key="index"
        :user-email="user.email"
        :user-id="user.id"
        :user-name="user.username"
        :disabled="approvedUsers.some(id => id == 999999)"
        :selected="approvedUsers.some(userId => userId == user.id)"
        @apply-user="(id: number) => approvedUsers = [...approvedUsers, id]"
        @remove-user="(id: number) => approvedUsers = approvedUsers.filter(userId => userId !== id)"
      />
    </div>
    <UserRowElement
      class="anonymous"
      user-email=""
      :user-id="999999"
      :disabled="approvedUsers.some(id => id !== 999999)"
      :selected="approvedUsers.some(id => id == 999999)"
      user-name="Сделать доступным для гостей"
      @apply-user="(id: number) => approvedUsers = [...approvedUsers, id]"
      @remove-user="(id: number) => approvedUsers = approvedUsers.filter(userId => userId !== id)"
    />

    <div class="controls">
      <CommonButton
        class="btn"
        @click="router().go(0)"
        :disabled="approvedTests.length === 0 && approvedUsers.length === 0"
      >
        <template v-slot:placeholder> Сбросить </template>
      </CommonButton>
      <CommonButton
        class="submit_button btn"
        @click="save"
        :disabled="approvedTests.length === 0 || approvedUsers.length === 0"
      >
        <template v-slot:placeholder> Сохранить </template>
      </CommonButton>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 80vw;
  border-radius: 10px;
  padding: 3vw 2vw;
  background-color: white;
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  column-gap: 2vw;
  grid-template-rows: repeat(3, auto);
}

.container-header {
  margin-bottom: 1rem;
  grid-column: 1 / 3;
}

.tests-container, .batteries-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  grid-column: 1 / 2;
}

.user-container {
  display: flex;
  flex-direction: column;
  grid-column: 2 / 3;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  grid-row: 2 / 3;
}

.battery-controls {
  display: flex;
  gap: 1vw;
}

.controls {
  display: flex;
  justify-content: space-between;
  height: 6vh;
  margin-top: 2vw;
  padding: 1vh 0;
  gap: 1vw;

  .btn {
    width: 100%;
  }
}

.search-field {
  min-height: 6vh;

  .inner {
    display: flex;
    height: 100%;
  }
}

@media only screen and (max-width: 900px) {
  .container {
    display: flex;
    flex-direction: column;
  }
}
</style>
