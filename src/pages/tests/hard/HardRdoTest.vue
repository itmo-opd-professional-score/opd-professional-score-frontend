<template>
  <div class="container">
    <div class="instruction" v-if="balls.every(ball => ball.state !== 'reacting')">
      <h2 class="title">Тест на скорость реакции на движущиеся объекты</h2>
      <p class="description" v-if="balls.every(ball => ball.state === 'ready')">
        Этот тест измеряет время вашей реакции на движущиеся объекты.
        После начала теста фиолетовые круги начнут двигаться. Как только они будут находиться в начале своего пути (верхняя точка траектории) - как
        можно быстрее нажмите соответствующие кнопки. Старайтесь не нажимать кнопки до или после этой зоны!
      </p>
      <p class="description" v-else>
        Поздравляем с прохождением теста!
        Ваши результаты:<br>
        - Среднее время ответа: {{ testResultsDto.averageCallbackTime}}
        - Среднее стандартное отклонение: {{ testResultsDto.dispersion }}
        - Ошибки (недостаточно точные ответы): {{ testResultsDto.mistakes }}
      </p>
      <CommonButton
        @click="startAllBalls(true)"
        class="start-button"
      >
        <template #placeholder>
          {{ balls.every(ball => ball.state === 'ready') ? 'Начать тест' : 'Пройти заново' }}
        </template>
      </CommonButton>
    </div>
    <div class="test" v-show="balls.some(ball => ball.state === 'reacting')">
      <div v-if="showTimer" class="timer">
        Осталось времени: {{ remainingTime }}
      </div>
      <div v-if="showProgressBar" class="progress-bar-container">
        <div class="progress-bar" :style="{ width: progressBarWidth }"></div>
      </div>
      <div class="balls-row">
        <div v-for="(ball, index) in balls" :key="index" class="ball-container">
          <ReactionCircle ref="reactionCircle" :time="time" />
          <CommonButton
            class="reaction-button"
            :disabled="ball.state === 'completed'"
            @click="handleButtonClick(index)"
          >
            <template #placeholder>{{ ball.buttonText }}</template>
          </CommonButton>
          <div v-if="ball.currentDeviation" class="current-deviation">
            Текущее отклонение: {{ ball.currentDeviation }} мс
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

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

type State = 'ready' | 'reacting' | 'completed';

interface ReactionCircleInstance {
  startAnimation(): void;
  cancelAnimation(): void;
  clickButton(time: number): void;
  speed: number;
  deviation: number;
}

export default defineComponent({
  name: "HardReactionTest",
  components: { ReactionCircle, CommonButton },
  props: {
    token: String,
  },
  data() {
    return {
      balls: [
        {
          state: 'ready' as State,
          currentDeviation: null as number | null,
          buttonText: 'Начать 1-й тест',
          speed: 0.001,
          deviationHistory: [] as Array<number>
        },
        {
          state: 'ready' as State,
          currentDeviation: null as number | null,
          buttonText: 'Начать 2-й тест',
          speed: 0.0015,
          deviationHistory: [] as Array<number>
        },
        {
          state: 'ready' as State,
          currentDeviation: null as number | null,
          buttonText: 'Начать 3-й тест',
          speed: 0.002,
          deviationHistory: [] as Array<number>},
      ],
      completedTestsLinks: [] as Array<string>,
      completedTestsResults: [] as Array<string>,
      time: 60,
      showTimer: false,
      showFinalResults: false,
      showPerMinuteResults: false,
      showProgressBar: false,
      accelerationAmount: 0.1,
      accelerationInterval: 60000,
      accelerationFrequency: 10,
      remainingTimeValue: 6000,
      startTime: 0,
      timerId: 0,
      timerIntervalId: 0,
    };
  },
  computed: {
    testResultsDto(): CreateRdoInputDto {
      return {
        userId: UserState.id ? UserState.id : null,
        allSignals: this.balls[0].deviationHistory.length,
        dispersion: this.standardDeviations.length > 0 ?
          this.standardDeviations.reduce((a, b) => a + b) / 3 : 0,
        mistakes: this.mistakes,
        averageCallbackTime: this.averageCallbackTime,
        testType: 'HARD_RDO'
      }
    },
    standardDeviations(): number[] {
      const standardDeviations: number[] = []
      this.balls.forEach(ball => {
        const n = ball.deviationHistory.length;
        if (n < 2) return 0;
        const mean = ball.deviationHistory.reduce((a, b) => a + b) / n;
        const variance = ball.deviationHistory.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1);
        standardDeviations.push(Math.sqrt(variance))
      })
      return standardDeviations;
    },
    averageCallbackTime(): number {
      let allDeviations: number = 0
      this.balls.forEach(ball => {
        ball.deviationHistory.forEach(deviation => {
          allDeviations += deviation
        })
      })
      const avg = allDeviations / this.balls[0].deviationHistory.length / 3;
      if (isNaN(avg)) return 0;
      return avg
    },
    mistakes(): number {
      let count = 0
      this.balls.forEach(ball => {
        ball.deviationHistory.forEach(deviation => {
          if (Math.abs(deviation) > 140) count ++
        })
      })
      return count
    },
    remainingTime() {
      if (this.balls.every(ball => ball.state === 'completed')) return null;
      const minutes = Math.floor(this.remainingTimeValue / 60000);
      const seconds = Math.floor((this.remainingTimeValue % 60000) / 1000);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    },
    progressBarWidth() {
      if (this.remainingTimeValue === 0) return '0%';
      return `${(1 - this.remainingTimeValue / (this.time * 1000)) * 100}%`;
    },
  },
  methods: {
    startAllBalls(setTimer?: boolean) {
      if (setTimer) {
        clearInterval(this.timerId)
        this.timerIntervalId = setInterval(() => {
          this.remainingTimeValue -= 1000;
          if (this.balls.every(ball => ball.state === 'completed') || this.remainingTimeValue <= 0) {
            this.stopTest()
          }
        }, 1000);
      }
      this.startTime = performance.now()
      this.balls.forEach((ball, index) => {
        ball.state = 'reacting';
        ball.currentDeviation = null;
        if (this.$refs.reactionCircle && this.$refs.reactionCircle as ReactionCircleInstance[]) {
          const reactionCircle = (this.$refs.reactionCircle as ReactionCircleInstance[])[index]
          reactionCircle.startAnimation();
          setTimeout(() => {
            reactionCircle.speed = ball.speed;
          }, 0);
        }
      });
    },
    handleButtonClick(index: number) {
      const ball = this.balls[index];
      if (ball.state === 'reacting') {
        const currentTime = performance.now();
        if (this.$refs.reactionCircle && this.$refs.reactionCircle as ReactionCircleInstance[]) {
          const reactionCircle = (this.$refs.reactionCircle as ReactionCircleInstance[])[index]
          reactionCircle.clickButton(currentTime);
          const deviation = reactionCircle.deviation;
          ball.currentDeviation = deviation;
          ball.deviationHistory.push(deviation);
          console.log(`Отклонение для шара ${index + 1}: ${deviation} мс`);
          ball.state = 'completed';
          reactionCircle.cancelAnimation()
          if (this.balls.every(ball => ball.state == 'completed')) {
            this.startAllBalls()
          }
        }
      }
    },
    stopTest() {
      this.balls.forEach((ball, index) => {
        if (this.$refs.reactionCircle && this.$refs.reactionCircle as ReactionCircleInstance[]) {
          const reactionCircle = (this.$refs.reactionCircle as ReactionCircleInstance[])[index]
          reactionCircle.cancelAnimation()
          ball.state = 'completed';
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
            if (data.testType != 'HARD_RDO') {
              router.back()
            }
          });
        }
      }
      const settings = await new TestSetupsResolver().getById(1)
      if (settings) {
        this.remainingTimeValue = settings.duration * 10
        this.showTimer = settings.showTimer
        this.showProgressBar = settings.showProgress
      }
    },
  },
  mounted() {
    this.load()
  },
});
</script>

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
  margin: 20px 0;
  color: black;
}
.container {
  max-width: 35vw;
  padding: 2rem;
  text-align: center;
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

.start-button {
  margin-bottom: 20px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.start-button:hover {
  background-color: #45a049;
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
