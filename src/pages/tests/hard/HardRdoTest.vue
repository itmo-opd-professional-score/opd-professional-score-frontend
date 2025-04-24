<script lang="ts">
import { defineComponent } from 'vue';
import CommonButton from '../../../components/UI/CommonButton.vue';
import ReactionCircle from '../../../components/ReactionCircle.vue';
import { usePopupStore } from '../../../store/popup.store.ts';
import { TestResolver } from '../../../api/resolvers/test/test.resolver.ts';
import { UserState } from '../../../utils/userState/UserState.ts';
import router from '../../../router/router.ts';
import { jwtDecode } from 'jwt-decode';
import type { TestJwt } from '../types';
import type { CreateRdoInputDto } from '../../../api/resolvers/test/dto/input/create-rdo-input.dto.ts';
import { TestSetupsResolver } from '../../../api/resolvers/testSetup/test-setups.resolver.ts';
import SimpleRdoTest from '../simple/SimpleRdoTest.vue';

type TestState = 'ready' | 'reacting' | 'completed';

interface SimpleRdoTest {
  testState: TestState,
  currentDeviation: number;
  deviationHistory: Array<number>,
  speed: number,
  loopCount: number,
  buttonText(): String,
  handleClick(): void,
  stopTest(): void,
}

export default defineComponent({
  name: "HardReactionTest",
  components: { SimpleRdoTest, ReactionCircle, CommonButton },
  props: {
    token: String,
    presetId: Number
  },
  data() {
    return {
      balls: [null, null, null] as Array<SimpleRdoTest | null>,
      completedTestsLinks: [] as Array<string>,
      completedTestsResults: [] as Array<string>,
      time: 10,
      showTimer: true,
      showTotalResults: true,
      showProgressBar: true,
      remainingSeconds: 0,
      timerIntervalId: 0,
    };
  },
  computed: {
    testResultsDto(): CreateRdoInputDto {
      return {
        userId: UserState.id ? UserState.id : null,
        allSignals: this.allSignals,
        dispersion: this.standardDeviations.length > 0 ?
          this.standardDeviations.reduce((a, b) => a + b) / this.standardDeviations.length : 0,
        mistakes: this.mistakes,
        averageCallbackTime: this.averageCallbackTime,
        testType: 'HARD_RDO'
      }
    },
    standardDeviations(): number[] {
      const standardDeviations: number[] = []
      this.balls.forEach(ball => {
        if (ball != null) {
          const n = ball?.deviationHistory.length;
          if (n < 2) return 0;
          const mean = ball.deviationHistory.reduce((a, b) => a + b) / n;
          const variance = ball.deviationHistory.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1);
          standardDeviations.push(Math.sqrt(variance))
        }
      })
      return standardDeviations;
    },
    averageCallbackTime(): number {
      let allDeviations: number = 0
      let count = 0
      this.balls.forEach(ball => {
        ball?.deviationHistory.forEach(deviation => {
          allDeviations += deviation
          count++
        })
      })
      const avg = allDeviations / count;
      if (isNaN(avg)) return 0;
      return avg
    },
    mistakes(): number {
      let count = 0
      this.balls.forEach(ball => {
        if (ball != null) {
          count += ball.loopCount - ball.deviationHistory.length;
        }
      })
      return count
    },
    allSignals(): number {
      let count = 0
      this.balls.forEach(ball => {
        if (ball != null) count += ball.loopCount
      })
      return count
    },
    remainingTime() {
      if (this.balls.every(ball => ball?.testState === 'completed')) return null;
      const minutes = Math.floor(this.remainingSeconds / 60);
      const seconds = Math.floor(this.remainingSeconds % 60);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    },
    progressBarWidth() {
      if (this.remainingSeconds === 0) return '0%';
      return `${this.remainingSeconds / this.time * 100}%`;
    },
  },
  methods: {
    startAllBalls(setTimer?: boolean) {
      if (this.balls.every(ball => ball?.testState === 'completed')) router.go(0)
      else {
        if (setTimer) {
          clearInterval(this.timerIntervalId)
          this.timerIntervalId = setInterval(() => {
            if (this.remainingSeconds == 0) this.stopTest()
            this.remainingSeconds--
          }, 1000)
        }
        this.remainingSeconds = this.time
        this.balls.forEach((ball) => {
          if (ball != null) {
            ball.testState = 'ready'
            ball.handleClick()
          }
        });
      }
    },
    stopTest() {
      this.balls.forEach((ball) => {
        if (ball != null) {
          ball.stopTest()
        }
      })
      this.saveResults()
    },
    saveResults(): void {
      const popUpStore = usePopupStore()
      const testResolver =
        new TestResolver()
      testResolver
        .createRdo(this.testResultsDto).then((result) => {
        if (!UserState.id) {
          this.completedTestsLinks.push(this.token!);
          this.completedTestsResults.push(result.body.testToken);
          localStorage.setItem(
            'completedTestsLinks',
            JSON.stringify(this.completedTestsLinks),
          );
          localStorage.setItem(
            'completedTestsResults',
            JSON.stringify(this.completedTestsResults),
          );
        }
        popUpStore.activateInfoPopup('Results were saved successfully!');
      }).catch((error) => {
        popUpStore.activateErrorPopup(
          `Error code: ${error.status}. ${error.response.data.message}`,
        );
      });
    },
    async loadSettings() {
      const testSetupResolver = new TestSetupsResolver()
      const settings = await testSetupResolver.getById(this.presetId!)
      if (settings) {
        this.time = settings.duration
        this.showProgressBar = settings.showProgress
        this.showTimer = settings.showTimer
        this.showTotalResults = settings.showTotalResults
      }
    },
    async load () {
      if (UserState.id) {
        await router.push('/test/hard/rdo');

      } else {
        const linksData = localStorage.getItem('completedTestsLinks');
        const resultsData = localStorage.getItem('completedTestsResults');
        if (linksData) {
          this.completedTestsLinks.push(...JSON.parse(linksData));
        }
        if (resultsData) {
          this.completedTestsResults.push(...JSON.parse(resultsData));
        }
        if (this.token && this.completedTestsLinks.length != 0) {
          this.completedTestsLinks.forEach((link) => {
            const data = jwtDecode(link) as TestJwt;
            if (data.testType == 'HARD_RDO') {
              router.back()
            }
          });
        }
      }
    },
  },
  mounted() {
    this.load()
    this.balls.forEach((_, index) => {
      this.balls[index] = (this.$refs.simpleRdoTest as SimpleRdoTest[])[index];
    })
  },
});
</script>

<template>
  <div class="container">
    <div class="instruction" v-if="balls.every(ball => ball?.testState != 'reacting')">
      <h2 class="title">Тест на скорость реакции на движущиеся объекты</h2>
      <div class="description" v-if="balls.every(ball => ball?.testState === 'ready')">
        <p>
          Этот тест измеряет время вашей реакции на движущиеся объекты.<br>
          После начала теста фиолетовые круги начнут двигаться. Как только они будут находиться в начале своего пути (верхняя точка траектории) - как
          можно быстрее нажмите соответствующие кнопки. Старайтесь не нажимать кнопки до или после этой зоны!
        </p>
      </div>
      <div class="description" v-else>
        <p v-if="showTotalResults">
          Поздравляем с прохождением теста!<br>
          Ваши результаты:<br>
          - Среднее время ответа: {{ testResultsDto.averageCallbackTime.toFixed(2) }}<br>
          - Среднее стандартное отклонение: {{ testResultsDto.dispersion.toFixed(2) }}<br>
          - Ошибки (недостаточно точные ответы): {{ testResultsDto.mistakes }}<br>
        </p>
      </div>
      <CommonButton
        @click="startAllBalls(true)"
        class="start-button"
      >
        <template #placeholder>
          {{ balls.every(ball => ball?.testState === 'ready') ? 'Начать тест' : 'Пройти заново' }}
        </template>
      </CommonButton>
    </div>
    <div class="test" v-show="balls.some(ball => ball?.testState === 'reacting')">
      <div v-if="showTimer" class="timer">
        Осталось времени: {{ remainingTime }}
      </div>
      <div v-if="showProgressBar" class="progress-bar-container">
        <div class="progress-bar" :style="{ width: progressBarWidth }"></div>
      </div>
      <div class="balls-row">
        <div v-for="(ball, index) in balls" :key="index" class="ball-container">
          <SimpleRdoTest
            ref="simpleRdoTest"
            :is-module="true"
            :start-acceleration="Math.random() * 0.009"
            :preset-id="presetId"
          />
          <div v-if="ball?.currentDeviation" class="current-deviation">
            Текущее отклонение: {{ ball?.currentDeviation.toFixed(2) }} мс
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.title {
  font-size: 36px;
  margin-bottom: 20px;
  color: #fff;
}
.description {
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 15px;
  color: black;
  text-align: left;
  display: flex;
}
.container {
  max-width: 35vw;
  padding: 2rem;
  text-align: center;

  .instruction {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2vw;

    button {
      width: 100%;
      color: white;
      font-size: 1.2vw;
      background-color: #4CAF50;
    }

    button:hover {
      background-color: #28a745;
    }
  }
}

.test {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.balls-row {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.ball-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 20px;
}

.timer {
  font-size: 24px;
  color: #fff;
  margin-bottom: 20px;
}
.progress-bar-container {
  width: 80%;
  height: 10px;
  background-color: #ddd;
  border-radius: 5px;
  margin: 10px auto;
}

.progress-bar {
  height: 100%;
  background-color: #4CAF50;
  border-radius: 5px;
  transition: width 0.5s ease;
}
</style>
