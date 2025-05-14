<script lang="ts">
import { defineComponent } from 'vue';
import TestStatisticsCard from '../../components/TestStatisticsCard.vue';
import TestScoreList from '../../components/TestsScoreList.vue';
import { UserState } from '../../utils/userState/UserState.ts';
import { TestResolver } from '../../api/resolvers/test/test.resolver.ts';
import { TestTypeResolver } from '../../api/resolvers/testType/testType.resolver.ts';
import { UserRole } from '../../utils/userState/UserState.types.ts';
import type { TestDataOutputUnionDto } from '../../api/resolvers/test/dto/output/test-data-output-union.dto.ts';
import type { TestTypeDataOutputDto } from '../../api/resolvers/testType/dto/output/test-type-data-output.dto.ts';
import { UserResolver } from '../../api/resolvers/user/user.resolver.ts';

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
      currentTest: {} as TestDataOutputUnionDto,
      testsData: [] as TestDataOutputUnionDto[],
      userTestsData: [] as TestDataOutputUnionDto[],
      testType: {} as TestTypeDataOutputDto | null,
      endpoint: '',
      username: undefined as string | undefined,
    }
  },
  methods: {
    async load() {
      this.testType = await new TestTypeResolver().getById(parseInt(this.testTypeId))
      switch (this.testType?.name) {
        case 'ADDITION_SOUND':
          this.endpoint = 'at';
          break
        case 'ADDITION_VISUAL':
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
        case 'SIMPLE_RDO':
          this.endpoint = 'rdo';
          break
        case 'HARD_RDO':
          this.endpoint = 'rdo';
          break
        case 'NUMERICAL':
          this.endpoint = 'cognitive';
          break
        case 'STROOP':
          this.endpoint = 'cognitive';
          break
        case 'VERBAL':
          this.endpoint = 'cognitive';
          break
        case 'SIMPLE_TRACKING':
          this.endpoint = 'tracking/simple';
          break
        case 'HARD_TRACKING':
          this.endpoint = 'tracking/hard';
          break
      }
      this.currentTest = await this.testResolver.getByTypeById(this.endpoint, parseInt(this.testId));
      const tests = await this.testResolver.getAllByType(this.endpoint)
      this.testsData = tests.filter(test => test.testTypeId == parseInt(this.testTypeId))
      this.userTestsData = this.testsData.filter((test) => test.userId === this.currentTest.userId)
      if (this.currentTest.userId) this.username = (await new UserResolver().getById(this.currentTest.userId))?.body.username
    },
    checkScore() {
      if ('score' in this.currentTest) return this.currentTest.score
      if ('allSignals' in this.currentTest && 'misclicks' in this.currentTest)
        return this.currentTest.allSignals - this.currentTest.misclicks
      if ('allSignals' in this.currentTest && 'mistakes' in this.currentTest)
        return this.currentTest.allSignals - this.currentTest.mistakes
    },
    checkMaxScore() {
      if ('allSignals' in this.currentTest) return this.currentTest.allSignals;
    },
    checkDispersion() {
      if ('dispersion' in this.currentTest) return this.currentTest.dispersion;
    }
  },
  mounted() {
      this.load()
    console.log(this.userTestsData)
  },
});
</script>

<template>
  <div class="test-results-page">
    <section class="current-test">
      <TestStatisticsCard
        v-if="currentTest.id != undefined"
        :time="
          'averageCallbackTime' in currentTest ?
            parseFloat(currentTest.averageCallbackTime.toFixed(2)) :
            undefined
        "
        :max-score="checkMaxScore()"
        :score="checkScore()"
        :dispersion="checkDispersion()"
        :duration="'duration' in currentTest ? currentTest.duration : undefined"
        :totalOverlapTime="'totalOverlapTime' in currentTest ? currentTest.totalOverlapTime : undefined"
        :bestOverlap="'bestOverlap' in currentTest ? currentTest.bestOverlap : undefined"
        :averageOverlap="'averageOverlap' in currentTest ? currentTest.averageOverlap : undefined"
        :overlapCount="'overlapCount' in currentTest ? currentTest.overlapCount : undefined"
        :date="currentTest.createdAt.substring(0, 10)"
        :test-type="testType ? testType : undefined"
        :user-name="username"
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
