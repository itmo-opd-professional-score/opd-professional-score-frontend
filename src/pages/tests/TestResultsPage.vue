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
    <section class="current-test">
      <TestStatisticsCard
        v-if="currentTest.id != undefined"
        :time="parseFloat(currentTest.averageCallbackTime.toFixed(2))"
        :date="currentTest.createdAt.substring(0, 10)"
        :max-score="currentTest.allSignals"
        :test-type="testType ? testType : undefined"
        :user-name="UserState.username"
        :score="
          currentTest.misclicks ?
          currentTest.allSignals - currentTest.misclicks :
          currentTest.allSignals - currentTest.mistakes  !
        "
        :valid="currentTest.valid"
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
      <TestScoreList
        :tests="testsData"
        :max-elements-count="7"
        :enabled-filters="{age: true, gender: true}"
      />
    </section>
  </div>
</template>

<style scoped>
.test-results-page {
  display: flex;
  flex-direction: column;
  width: 90vw;
  gap: 4vw;
}
.current-test {
  display: flex;
  height: 80vh;
  gap: 2vw;
  padding: 2vw;
  border-radius: 15px;
  background-color: var(--background-primary);
}
.user-test-history {
  gap: 2vw;
  display: flex;
  background-color: var(--background-primary);
  padding: 15px;
  border-radius: 15px;
  flex-direction: column;
  justify-content: center;
  flex: 2;
}

.test-history {
  background-color: var(--background-primary);
  display: flex;
  flex-direction: column;
  border-radius: 15px;
  padding: 15px 0;
  height: 90vh;
  gap: 2vw;
}
h4 {
  display: flex;
  justify-content: center;
  border-radius: 10px;
  margin-top: 1vw;
  font-size: 24px;
  font-weight: bolder;
  color: white;
}
</style>
