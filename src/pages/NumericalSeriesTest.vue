<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'NumericalSeriesTest',
  data() {
    return {
      countOfNumericInSeries: [6, 5, 4],
      levelOfDifficulty: 0,
      score: 0,
      mistakes: 0,
      minAndMaxForX: [1, 20],
      minAndMaxForY: [1, 5],
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
  }
});
</script>

<template>

</template>

<style scoped>

</style>