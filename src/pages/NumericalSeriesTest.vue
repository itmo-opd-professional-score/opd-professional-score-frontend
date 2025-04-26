<script lang="ts">
import { defineComponent } from 'vue';
import CommonButton from '../components/UI/CommonButton.vue';
import CustomInput from '../components/UI/inputs/CustomInput.vue';

type TestState= 'ready' | 'reacting' | 'completed';

export default defineComponent({
  name: 'NumericalSeriesTest',
  components: { CustomInput, CommonButton },
  data() {
    return {
      userAnswer: '',
      correctAnswer: '',
      currentSequence: [] as string[],
      countOfNumericInSeries: [6, 5, 4],
      levelOfDifficulty: 0,
      score: 0,
      mistakes: 0,
      result: 0,
      minAndMaxForX: [1, 20],
      minAndMaxForY: [1, 5],
      testState: 'ready' as TestState,
      totalTime: 0,
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
        (x: number, y: number): string =>  (Math.pow(x, y)).toString()
      ]
    };
  },
  props: {
    randomChangeOfDifficulty: { type: Boolean, default: false },
    time: { type: Number, required: true },
    showTimer: { type: Boolean, default: false },
    showFinalResults: { type: Boolean, default: false },
    showPerMinuteResults: { type: Boolean, default: false },
    showProgressBar: { type: Boolean, default: false },
  },
  computed: {
    displayedSequence(): string [] {
      return this.currentSequence.slice(0,-1);
    },
    progressBarWidth() {
      if (this.remainingTimeValue === 0) return '0%';
      return `${(1 - this.remainingTimeValue / (this.time * 1000)) * 100}%`;
    },
    remainingTime() {
      const minutes = Math.floor(this.remainingTimeValue / 60000);
      const seconds = Math.floor((this.remainingTimeValue % 60000) / 1000);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    },
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
    resetTest() {
      this.testState = 'ready';
      this.score = 0;
      this.result = 0;
      this.mistakes = 0;
      this.startTimer(this.time);
    },
    startTest() {
      this.totalTime = this.time;
      this.remainingTimeValue = this.time;
      this.testState = 'reacting';
      this.nextRound();
      this.startTimer(this.time);
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
    },
    nextRound() {
      if (this.testState !== 'reacting') return;
      if (!this.randomChangeOfDifficulty) {
        const timePassed = this.totalTime - this.remainingTimeValue / 1000;
        if (timePassed > this.totalTime * 0.66) {
          this.levelOfDifficulty = 2;
        } else if (timePassed > this.totalTime * 0.33) {
          this.levelOfDifficulty = 1;
        } else {
          this.levelOfDifficulty = 0;
        }
      } else {
        this.levelOfDifficulty = Math.floor(Math.random() * 3); // случайная сложность
      }
      let lambda: (current: number, step: number) => string;
      if (this.levelOfDifficulty === 0) {
        lambda = this.functionsForFirstDifficulty[
          Math.floor(this.generateRandomNumeric(0, this.functionsForFirstDifficulty.length - 1))
          ];
      } else if (this.levelOfDifficulty === 1) {
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
      this.startRoundTimer();
      if (this.roundTimeoutId) clearTimeout(this.roundTimeoutId);
      this.roundTimeoutId = setTimeout(() => {
        this.mistakes++;
        this.nextRound();
      }, this.roundTime * 1000);
    },
    startRoundTimer() {
      this.stopRoundTimer();
      if (this.roundTimerIntervalId) clearInterval(this.roundTimerIntervalId);
      this.roundRemainingTime = this.roundTime * 1000;
      this.roundTimerIntervalId = setInterval(() => {
        this.roundRemainingTime -= 1000;
        if (this.roundRemainingTime <= 0) {
          this.roundRemainingTime = 0;
          clearInterval(this.roundTimerIntervalId!);
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
      if (this.userAnswer.trim() === this.correctAnswer.trim()) {
        this.score++;
      } else {
        this.mistakes++;
      }
      if (this.remainingTimeValue <= 0) {
        this.stopTest();
      } else {
        this.nextRound();
        this.stopRoundTimer();
      }
    },
    roundTimeFormatted() {
      const effectiveRoundTime = Math.min(this.roundRemainingTime, this.remainingTimeValue);
      const seconds = Math.floor(effectiveRoundTime / 1000);
      return `${seconds < 10 ? '0' : ''}${seconds}`;
    }
  }
});
</script>

<template>
    <div class="container">

      <div class="info-block" v-if="testState == 'ready'">
        <h2 class="title">Тест Числовые последовательности</h2>
        <p class="description">
          Вам будет показываться числовая последовательность. Ваша задача — определить закономерность и ввести следующий элемент ряда.
          Чем быстрее и точнее вы отвечаете, тем выше ваш результат. Тест автоматически повышает уровень сложности по мере прохождения.
          Время на прохождение ограничено. Удачи!
        </p>
        <CommonButton
          class="reaction-button"
          @click="clickButton"
          >
            <template v-slot:placeholder>Начать тест</template>
        </CommonButton>
      </div>

      <div class="test-container" v-if="testState == 'reacting'" >
        <div v-if="showTimer" class="timer">
          Осталось времени: {{ remainingTime }}
        </div>
        <div v-if="showProgressBar" class="progress-bar-container">
          <div class="progress-bar" :style="{ width: progressBarWidth }"></div>
        </div>
        <div v-if="showTimer" class="timer">
          Время на раунд: {{ roundTimeFormatted() }} сек
        </div>
          <div class="sequence">
            Последовательность:
            {{ displayedSequence.join(', ') }}
          <CustomInput type="text"
                       v-model="userAnswer"
                       placeholder="Введите следующий элемент"
                       @keyup.enter="checkAnswer"/>
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
        <p class="result">Правильных ответов: {{ score }}</p>
        <p class="result">Ошибок: {{ mistakes }}</p>
        <p class="result">Результат: {{ result }}%</p>
        <CommonButton
          class="reaction-button"
          @click="resetTest"
        >
          <template v-slot:placeholder>Начать заново</template>
        </CommonButton>
      </div>
    </div>
</template>

<style scoped>
.description {
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 15px;
  margin: 20px 0;
  color: black;
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
  padding: 15px;
  border-radius: 15px;
  min-height: 70vh;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  max-width: 50vw;
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
  border-radius: 1em;
  padding: 2em;
  margin: 2vh 0;
  width: 90%;
  max-width: 50em;
  min-width: 30em;
  text-align: center;
  font-size: 1.4rem;
  font-weight: bold;
  color: #4a4a4a;
  box-shadow: 0 0.5em 1.2em rgba(0, 0, 0, 0.15);
  transition: background-color 0.3s ease;
}

.reaction-button {
  display: flex;
  width: 15vh;
  height: 10vh;
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