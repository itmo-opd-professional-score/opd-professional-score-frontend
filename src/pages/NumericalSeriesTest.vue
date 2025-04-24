<script lang="ts">
import { defineComponent } from 'vue';
import CommonButton from '../components/UI/CommonButton.vue';

type TestState= 'ready' | 'reacting' | 'completed';

export default defineComponent({
  name: 'NumericalSeriesTest',
  components: { CommonButton },
  data() {
    return {
      countOfNumericInSeries: [6, 5, 4],
      levelOfDifficulty: 0,
      score: 0,
      mistakes: 0,
      minAndMaxForX: [1, 20],
      minAndMaxForY: [1, 5],
      testState: 'ready' as TestState,
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
        (x: number, y: number) => (x * x + y).toString(),
        (x: number, y: number) => (x*x + x*y).toString(),
        (x: number, y: number): string =>  ` ${x-y}/${2*x + y}`,
        (x: number, y: number): string =>  (Math.pow(x, y)).toString()
  ]
    };
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
    startTest() {
      this.testState = 'reacting';
    },
    stopTest() {
      this.testState = 'completed';
    },
    nextRound() {

    }
  }
});
</script>

<template>
    <div class="container">
      <div class="instruction" v-if="testState == 'ready'">
        <h2 class="title">Тест Числовые последовательности</h2>
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

      </div>
      <div class="test-container" v-if="testState == 'completed'">

      </div>
    </div>
</template>

<style scoped>

</style>