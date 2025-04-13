<script lang="ts">
import { defineComponent } from 'vue';
import TestStatisticsCard from '../../components/TestStatisticsCard.vue';
import TestScoreList from '../../components/TestsScoreList.vue';
import { UserState } from '../../utils/userState/UserState.ts';
import type { TestDataOutputDto } from '../../api/resolvers/test/dto/output/test-data-output.dto.ts';
import { TestResolver } from '../../api/resolvers/test/test.resolver.ts';
import { TestTypeResolver } from '../../api/resolvers/testType/testType.resolver.ts';
import { UserRole } from '../../utils/userState/UserState.types.ts';
import type { TestTypeDataOutputDto } from '../../api/resolvers/testType/dto/output/test-type-data-output.dto.ts';

export default defineComponent({
  name: 'TestResultsPage',
  computed: {
    UserRole() {
      return UserRole
    },
    UserState() {
      return UserState;
    },
  },
  components: {
    TestStatisticsCard,
    TestScoreList,
  },
  props: {
    testId: {
      type: String,
      required: true,
    },
    testTypeId: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      testResolver: new TestResolver(),
      currentTest: {} as TestDataOutputDto,
      testsData: [] as TestDataOutputDto[],
      userTestsData: [] as TestDataOutputDto[],
      testType: {} as TestTypeDataOutputDto | null,
      endpoint: ''
    }
  },
  methods: {
    async load() {
      this.testType = await new TestTypeResolver().getById(parseInt(this.testTypeId))
      switch (this.testType?.name) {
        case 'SOUND_ADDITION':
          this.endpoint = 'at';
          break
        case 'VISUAL_ADDITION':
          this.endpoint = 'at';
          break
        case 'SIMPLE_SOUND':
          this.endpoint = 'sst';
          break
        case 'SIMPLE_LIGHT':
          this.endpoint = 'slt';
          break
        case 'HARD_LIGHT':
          this.endpoint = 'hlt';
          break
      }
      this.currentTest = await this.testResolver.getByTypeById(this.endpoint, parseInt(this.testId));
      this.testsData = await this.testResolver.getAllByType(this.endpoint)
      this.userTestsData = this.testsData.filter((test) => test.userId === UserState.id)
    }
  },
  mounted() {
      this.load()
  },
});
</script>

<template>
  <div class="test-results-page">
    <h3>Текущий тест</h3>
    <section class="current-test">
      <TestStatisticsCard
        v-if="currentTest.id != undefined"
        :time="parseFloat(currentTest.averageCallbackTime.toFixed(2))"
        :date="currentTest.createdAt.substring(0, 10)"
        :max-score="currentTest.allSignals"
        :test-category="testType?.name"
        :user-name="UserState.username"
        :score="
          currentTest.misclicks ?
          currentTest.allSignals - currentTest.misclicks :
          currentTest.allSignals - currentTest.mistakes  !
        "
        :valid="currentTest.valid"
        :test-name="'Проверка на скорость'"
      />
      <div class="user-test-history">
        <h4>Ваши последние результаты:</h4>
        <TestScoreList
          :tests="userTestsData"
          :max-elements-count="5"
          :hide-user-id="true"
        />
      </div>
    </section>
    <section
      class="test-history"
      v-if="UserState.role == UserRole.EXPERT || UserState.role == UserRole.ADMIN"
    >
      <h4>Последние результаты всех пользователей:</h4>
      <TestScoreList :tests="testsData" :max-elements-count="8" />
    </section>
  </div>
</template>

<style scoped>
.test-results-page {
  display: flex;
  flex-direction: column;
  background-color: var(--background-primary);
  padding: 2vw;
  width: 90vw;
  border-radius: 15px;
  gap: 2vw;
}
.current-test {
  display: flex;
  height: 70vh;
  gap: 2vw;
}
.user-test-history {
  display: flex;
  background-color: var(--background-primary);
  padding: 15px;
  border-radius: 15px;
  flex-direction: column;
  justify-content: center;
  flex: 1.2;
}

.test-history {
  background-color: var(--background-primary);
  display: flex;
  flex-direction: column;
  border-radius: 15px;
  padding: 15px 0;
  height: 90vh;
}
h3 {
  font-size: 36px;
  color: rgb(237, 227, 227, 0.9);
  font-weight: bold;
}
h4 {
  display: flex;
  justify-content: center;
  border-radius: 10px;
  padding: 0.5rem 0;
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  font-weight: bolder;
  color: rgb(237, 227, 227, 0.9);
}
</style>
