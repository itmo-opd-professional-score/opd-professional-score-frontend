<script lang="ts">
import { defineComponent } from 'vue';
import CommonButton from '../../../components/UI/CommonButton.vue';
import CustomInput from '../../../components/UI/inputs/CustomInput.vue';
import { UserState } from '../../../utils/userState/UserState.ts';
import { TestResolver } from '../../../api/resolvers/test/test.resolver.ts';
import { usePopupStore } from '../../../store/popup.store.ts';
import type { CreateCognitiveInputDto } from '../../../api/resolvers/test/dto/input/create-cognitive-input.dto.ts';
import router from '../../../router/router.ts';
import { useTest } from '../../../utils/useTest.ts';

type TestState= 'ready' | 'reacting' | 'completed';

export default defineComponent({
  name: 'NumericalSeriesTest',
  components: { CustomInput, CommonButton },
  setup(props) {
    const { settings, updateTestBlockToken } = useTest({
      testBlockId: props.testBlockId,
      setupId: props.setupId,
      testType: "NUMERICAL"
    })

    return {
      settings,
      updateTestBlockToken,
    }
  },
  data() {
    return {
      userAnswer: '',
      correctAnswer: '',
      currentSequence: [] as string[],
      countOfNumericInSeries: [4, 6, 7],
      levelOfDifficulty: 0,
      score: 0,
      mistakes: 0,
      result: 0,
      minAndMaxForX: [1, 20],
      minAndMaxForY: [1, 5],
      testState: 'ready' as TestState,
      remainingTimeValue: 0,
      roundTime: 30,
      timerIntervalId:  null as ReturnType<typeof setInterval> | null,
      roundTimeoutId:  null as ReturnType<typeof setInterval> | null,
      roundRemainingTime: 0,
      roundTimerIntervalId: null as ReturnType<typeof setInterval> | null,

      functionsForFirstDifficulty: [
        (x: number, y: number): string => (x + y).toString(),
        (x: number, y: number): string => (x - y).toString(),
        (x: number, y: number): string => (x * y).toString(),
        (x: number, y: number): string =>  ` ${x}/${x + y}`,
        (x: number, y: number): string =>  (x * x + y - y).toString(),
        (x: number, y: number): string =>  (x * x * x + y - y).toString()
      ],
      functionsForSecondDifficulty: [
        (x: number, y: number): string =>  (Math.pow(-1, x-y) * x).toString(),
        (x: number, y: number) => {
          const phi = (1 + Math.sqrt(5)) / 2;
          const psi = (1 - Math.sqrt(5)) / 2;
          const fib = (Math.pow(phi, x) - Math.pow(psi, x)) / Math.sqrt(5) + y - y;
          return Math.round(fib).toString();
        },
        (x: number, y: number): string => ` ${x - y}/${x + y}`,
  ],
      functionsForThirdDifficulty: [
        (x: number, y: number) => (x * x + y).toString(),
        (x: number, y: number) => (x*x + x*y).toString(),
        (x: number, y: number): string =>  ` ${x-y}/${2*x + y}`,
        (x: number, y: number): string =>   {
            const safeY = y > 3 ? 3 : y;
            return (Math.pow(x, safeY)).toString();
        }
      ]
    };
  },
  props: {
    testBlockId: String,
    setupId: String
  },
  computed: {
    displayedSequence(): string [] {
      return this.currentSequence.slice(0,-1);
    },
    progressBarWidth() {
      if (this.remainingTimeValue === 0) return '0%';
      return `${(1 - this.remainingTimeValue / (this.settings.duration * 1000)) * 100}%`;
    },
    remainingTime() {
      const minutes = Math.floor(this.remainingTimeValue / 60000);
      const seconds = Math.floor((this.remainingTimeValue % 60000) / 1000);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    },
    testResultsDto(): CreateCognitiveInputDto {
      return {
        userId: UserState.id,
        allSignals: this.score + this.mistakes,
        score: this.score,
        mistakes: this.mistakes,
        testType: 'NUMERICAL'
      }
    },
    totalTime(): number {
      if (!this.settings.duration) return 10
      return this.settings.duration
    }
  },
  methods: {
    generateSequence(lambda: (current: number, step: number) => string): string[] {
      let current = this.generateRandomNumeric(this.minAndMaxForX[0], this.minAndMaxForX[1]);
      const step = this.generateRandomNumeric(this.minAndMaxForY[0], this.minAndMaxForY[1]);
      let iterations = this.countOfNumericInSeries[this.levelOfDifficulty];

      const result: string[] = [];
      while(iterations > 0) {
        result.push(lambda(current, step));
        current+=step
        iterations--;
      }
      return result;
    },
    generateRandomNumeric( min: number, max:  number) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    clickButton() {
      if(this.testState === 'ready') {
        this.startTest();
      }
    },
    async resetTest() {
      if (this.testBlockId) await router.push(`/testBlock/${this.testBlockId}`);
      else router.go(0)
    },
    startTest() {
      this.remainingTimeValue = this.settings.duration;
      this.testState = 'reacting';
      this.startTimer(this.settings.duration);
      this.levelOfDifficulty = 0;
      this.nextRound();
    },
    stopTest() {
      this.testState = 'completed';
      this.stopRoundTimer();
      if(this.score == 0) {
        this.result=0
      }
      else {
        this.result = Math.round((this.score / (this.score + this.mistakes)) * 100);
      }
      this.saveResults()
    },
    async saveResults() {
      const popUpStore = usePopupStore()
      new TestResolver().createCognitive(this.testResultsDto).catch((err) => {
        popUpStore.activateErrorPopup(err.message)
      })
      if (this.testBlockId) await this.updateTestBlockToken()
    },
    nextRound() {
      if (this.testState !== 'reacting') return;

      this.stopRoundTimer(); // Остановить предыдущий раунд
      const timePassed = this.totalTime - this.remainingTimeValue / 1000;
      if (timePassed > this.totalTime * 0.66) {
        this.levelOfDifficulty = 2;
      } else if (timePassed > this.totalTime * 0.33) {
        this.levelOfDifficulty = 1;
      } else {
        this.levelOfDifficulty = 0;
      }

      let lambda: (current: number, step: number) => string;
      if (this.levelOfDifficulty == 0) {
        lambda = this.functionsForFirstDifficulty[
          Math.floor(this.generateRandomNumeric(0, this.functionsForFirstDifficulty.length - 1))
          ];
      } else if (this.levelOfDifficulty == 1) {
        lambda = this.functionsForSecondDifficulty[
          Math.floor(this.generateRandomNumeric(0, this.functionsForSecondDifficulty.length - 1))
          ];
      } else {
        lambda = this.functionsForThirdDifficulty[
          Math.floor(this.generateRandomNumeric(0, this.functionsForThirdDifficulty.length - 1))
          ];
      }

      this.currentSequence = this.generateSequence(lambda);
      this.correctAnswer = this.currentSequence[this.currentSequence.length - 1];
      this.userAnswer = '';

      this.startRoundTimer(); // Запустить новый таймер раунда
    },
    startRoundTimer() {
      this.stopRoundTimer();
      this.roundRemainingTime = this.roundTime * 1000;

      this.roundTimerIntervalId = setInterval(() => {
        this.roundRemainingTime -= 1000;

        if (this.roundRemainingTime <= 0) {
          this.roundRemainingTime = 0;
          clearInterval(this.roundTimerIntervalId!);
          this.roundTimerIntervalId = null;

          this.mistakes++;
          this.nextRound();
        }
      }, 1000);
    },
    stopRoundTimer() {
      if (this.roundTimerIntervalId) {
        clearInterval(this.roundTimerIntervalId);
        this.roundTimerIntervalId = null;
      }
    },
    startTimer(totalSeconds: number) {
      if (this.timerIntervalId) {
        clearInterval(this.timerIntervalId);
      }
      this.remainingTimeValue = totalSeconds * 1000;
      this.timerIntervalId = setInterval(() => {
        this.remainingTimeValue -= 1000;
        if (this.remainingTimeValue <= 0) {
          this.remainingTimeValue = 0;
          clearInterval(this.timerIntervalId!);
          this.stopTest();
        }
      }, 1000);
    },
    checkAnswer() {
      if (this.userAnswer.trim().length > 0 && !isNaN(parseInt(this.userAnswer.trim()))) {
        if (this.userAnswer.trim() === this.correctAnswer.trim()) {
          this.score++;
        } else {
          this.mistakes++;
        }

        if (this.remainingTimeValue <= 0) {
          this.stopTest();
        } else {
          this.nextRound();
        }
      }
    },
    roundTimeFormatted() {
      const effectiveRoundTime = Math.min(this.roundRemainingTime, this.remainingTimeValue);
      const seconds = Math.floor(effectiveRoundTime / 1000);
      return `${seconds < 10 ? '0' : ''}${seconds}`;
    },
  },
});
</script>

<template>
    <div class="container">

      <div class="info-block" v-if="testState == 'ready'">
        <h2 class="title">Тест на поиск числовых закономерностей</h2>
        <p class="description">
          Вам будет показываться числовая последовательность. Ваша задача — определить закономерность и ввести следующий элемент ряда.
          Чем быстрее и точнее вы отвечаете, тем выше ваш результат. Тест автоматически повышает уровень сложности по мере прохождения.
          Время выполнения  - {{ totalTime }} с
        </p>
        <CommonButton
          class="reaction-button"
          @click="clickButton"
          >
            <template v-slot:placeholder>Начать тест</template>
        </CommonButton>
      </div>

      <div class="test-container" v-if="testState == 'reacting'" >
        <div v-if="settings.showTimer" class="timer">
          Осталось времени: {{ remainingTime }}
        </div>
        <div v-if="settings.showProgress" class="progress-bar-container">
          <div class="progress-bar" :style="{ width: progressBarWidth }"></div>
        </div>
        <div v-if="settings.showTimer" class="timer">
          Время на раунд: {{ roundTimeFormatted() }} сек
        </div>
          <div class="sequence">
            <p>Последовательность:
              {{ displayedSequence.join(', ') }}</p>
            <CustomInput
              type="text"
              v-model="userAnswer"
              placeholder="Введите следующий элемент"
              class="answer_input"
              @keyup.enter="checkAnswer"
            />
            <CommonButton
              class="reaction-button"
              @click="checkAnswer"
            >
              <template v-slot:placeholder>Далее</template>
            </CommonButton>
        </div>

      </div>
      <div class="test-container" v-if="testState == 'completed'">
        <h2 class="title">Тест завершен!</h2>
        <div class="full" v-if="settings.showTotalResults">
          <p class="result">Правильных ответов: {{ score }}</p>
          <p class="result">Ошибок: {{ mistakes }}</p>
          <p class="result">Результат: {{ result }}%</p>
        </div>
        <CommonButton
          class="reaction-button"
          @click="resetTest"
        >
          <template v-slot:placeholder>
            {{ testBlockId ? 'Вернуться к текущему блоку' : 'Начать заново'}}
          </template>
        </CommonButton>
      </div>
    </div>
</template>

<style scoped>
.description, .results {
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 15px;
  color: black;
  max-width: 45vw;
  display: flex;
  flex-direction: column;
  gap: 1vw;
}

.results {
  max-width: 25vw;
  margin: 0 auto auto;
}

.title {
  font-size: 36px;
  margin-bottom: 20px;
  color: #fff;
}

.info-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.timer {
  font-size: 24px;
  color: #fff;
  margin-bottom: 1vh;
  font-weight: bold;
}

.progress-bar-container {
  width: 80%;
  height: 10px;
  background-color: #ddd;
  border-radius: 5px;
  margin: 3vh auto;
}

.test-container {
  background: #c1b9f6;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3vw;
  border-radius: 15px;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  width: 60vw;
  height: 70vh;
  padding: 2rem;
  text-align: center;
}

.progress-bar {
  height: 100%;
  background-color: #4caf50;
  border-radius: 5px;
  transition: width 0.5s ease;
}
.sequence {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 1vh;
  padding: 3vh;
  margin: 2vh 0;
  text-align: center;
  font-size: 1.4rem;
  font-weight: bold;
  color: #4a4a4a;
  white-space: nowrap;
  box-shadow: 0 0.5vh 1.2vh rgba(0, 0, 0, 0.15);
  transition: background-color 0.3s ease;

  p {
    margin-bottom: 2vw;
  }
}

.reaction-button {
  display: flex;
  width: 25vh;
  height: 8vh;
  background: rgba(128, 0, 128, 0.6);
  border: none;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  box-shadow: 0 10px 20px rgba(128, 0, 128, 0.2);
  outline: none;
  margin: 3vh auto;
}
.result {
  font-size: 20px;
  color: #333;
  margin: 10px 0;
}
</style>