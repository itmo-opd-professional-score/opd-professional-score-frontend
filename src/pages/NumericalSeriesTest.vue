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
      countOfNumericInSeries: [6, 5, 4],
      levelOfDifficulty: 0,
      score: 0,
      mistakes: 0,
      result: 0,
      minAndMaxForX: [1, 20],
      minAndMaxForY: [1, 5],
      testState: 'ready' as TestState,
      remainingTimeValue: 0,
      timerIntervalId:  null as ReturnType<typeof setInterval> | null,
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
  methods: {
    //лямбда принимает два парамета ВСЕГДА
    generateSequence(initial: number, step: number, iterations: number, lambda: (current: number, step: number) => string): string[] {
      const result: string[] = [];
      let current: number = initial;
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
      this.testState = 'reacting';
      this.nextRound();
      this.startTimer(this.time);
    },
    stopTest() {
      this.testState = 'completed';
    },
    nextRound() {
      if(!this.randomChangeOfDifficulty) {

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

    }
  }
});
</script>

<template>
    <div class="container">

      <div class="instruction" v-if="testState == 'ready'">
        <h2 class="title">Тест Числовые последовательности</h2>
        <CustomInput type=""></CustomInput>
        <p class="description">
        </p>
        <CommonButton
          class="reaction-button"
          @click="clickButton"
          >
            <template v-slot:placeholder>Начать тест</template>
        </CommonButton>
      </div>

      <div class="test-container" v-if="testState == 'reacting'" >
        <div class="sequence">
          Последовательность:
          <CustomInput type="text"
                       v-model="userAnswer"
                       placeholder="Введите следующий элемент"
                       @keyup.enter="checkAnswer"/>
          <CommonButton class="check-button"
                        @click="checkAnswer">
            <template>Далее</template>
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

</style>