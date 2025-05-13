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
import { TestBatteryResolver } from '../../api/resolvers/testBattery/test-battery.resolver.ts';
import type { LocalTestBlock } from '../../components/testBattery/types';
import TestBatteryRowElement from '../../components/testBattery/TestBatteryRowElement.vue';

export default {
  name: 'CreateTestBlockPage',
  components: { TestBatteryRowElement, CustomInput, UserRowElement, CommonButton, TestRowElement },
  data() {
    const popupStore = usePopupStore();
    const testBlockResolver = new TestBlockResolver();
    const userResolver = new UserResolver();

    return {
      approvedUsers: [] as number[],
      approvedTests: [] as TestBlockTest[],
      tests: [] as TestTypeDataOutputDto[],
      searchedUser: '',
      usersFromApi: [] as UserDataOutputDto[],
      batteries: [] as TestBatteryOutputDto[],
      localTestBlock: {} as LocalTestBlock,
      testBlockResolver,
      userResolver,
      popupStore,
      batteryMode: false,
    };
  },
  computed: {
    users() {
      if (this.searchedUser == '') return this.usersFromApi
      return this.usersFromApi
        .filter(user => user.username.toLowerCase().includes(this.searchedUser.toLowerCase()));
    }
  },
  async mounted() {
    await this.loadBatteries()
    try {
      const usersFromApi = await this.userResolver.getAll();
      const types = await new TestTypeResolver().getAll();
      if (usersFromApi !== null) this.usersFromApi = usersFromApi.body
        .filter(user => user.id !== 999999)
        .sort((a, b) => a.id - b.id);
      if (types !== null) this.tests = types.sort((a, b) => a.id - b.id);

      const localTestBlockCash = localStorage.getItem("localTestBlock")
      if (localTestBlockCash != null) {
        const localTestBlock = JSON.parse(localTestBlockCash) as LocalTestBlock;
        this.approvedUsers = localTestBlock.userIds
        this.approvedTests = localTestBlock.tests
      }
    } catch (e) {}
  },
  methods: {
    async loadBatteries() {
      try {
        this.batteries = await new TestBatteryResolver().getAll()
      } catch (error) {}
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
        await router.push('/profile');
      } else {
        this.popupStore.activateErrorPopup(
          'Должен быть выбран хотя бы 1 тест и 1 пользователь!',
        );
      }
    },
    reset() {
      router.go(0)
      this.approvedTests = []
      this.approvedUsers = []
    },
    saveTestBlockConfig() {
      this.localTestBlock = {
        testBatteryId: this.localTestBlock.testBatteryId ?
          this.localTestBlock.testBatteryId : null,
        userIds: this.approvedUsers,
        tests: this.approvedTests,
      }
      localStorage.removeItem("localTestBlock");
      localStorage.setItem("localTestBlock", JSON.stringify(this.localTestBlock));
    },
  },
  watch: {
    approvedTests() { this.saveTestBlockConfig() },
    approvedUsers() { this.saveTestBlockConfig() }
  }
};
</script>

<template>
  <div class="container" v-if="tests.length > 0 && usersFromApi.length > 0">
    <h1 class="container-header">Создание блока тестов</h1>

    <div class="block-header">
      <h2>Выберите тесты:</h2>
      <div class="battery-controls">
        <CommonButton
          class="battery-switch"
          @click="batteryMode = !batteryMode"
        >
          <template v-slot:placeholder>{{ batteryMode ? 'Скрыть' : 'Показать'}} батареи</template>
        </CommonButton>
        <CommonButton
          class="battery-switch"
          :disabled="approvedTests.length == 0"
          @click=""
        >
          <template v-slot:placeholder>Сохранить батарею</template>
        </CommonButton>
      </div>
    </div>
    <div class="tests-container">
      <TestRowElement
        v-for="(test, index) in tests"
        :key="index"
        :test="test"
        :selected="approvedTests.find(tesT => tesT.name == test.name) !== undefined"
        :setup-id="approvedTests.find(tesT => tesT.name == test.name)?.setupId"
        @apply-test="(appliedTest) => approvedTests = [...approvedTests, appliedTest]"
        @remove-test="(removedTest) =>approvedTests = approvedTests.filter(tesT => tesT.name !== removedTest.name)"
      />

      <div class="batteries-container" v-if="batteryMode">
        <TestBatteryRowElement
          v-for="(battery, index) in batteries"
          :key="index"
          :test-battery="battery"
        />
      </div>
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
        @click="reset"
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

.tests-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  position: relative;

  .batteries-container {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background-color: white;
  }
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
  display: flex;
  align-items: center;
  justify-content: space-between;
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
