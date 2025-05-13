<script lang="ts">
import CommonButton from '../../../../components/UI/CommonButton.vue';
import { TestResolver } from '../../../../api/resolvers/test/test.resolver.ts';
import { UserState } from '../../../../utils/userState/UserState.ts';
import router from '../../../../router/router.ts';
import { useTest } from '../../../../utils/useTest.ts';

export default {
  name: 'AdditionVisualTest',
  components: { CommonButton },
  props: {
    testBlockId: String,
    setupId: String
  },
  setup(props) {
    const { settings, updateTestBlockToken } = useTest({
      testBlockId: props.testBlockId,
      setupId: props.setupId,
      testType: "ADDITION_VISUAL"
    })

    return {
      settings,
      updateTestBlockToken,
    }
  },
  data() {
    return {
      number1: 0,
      number2: 0,
      score: 0,
      attempts: 0,
      currentAttempt: 0,
      totalAttempts: 10,
      status: '',
      testStarted: false,
      testCompleted: false,
      startTime: 0,
      responseTimes: [] as Array<number>,
      standardDeviation: 0,
    };
  },
  methods: {
    generateRandomNumbers() {
      this.number1 = Math.floor(Math.random() * 50) + 1;
      this.number2 = Math.floor(Math.random() * 50) + 1;
      this.startTime = Date.now();
    },
    checkEvenOdd(isEven: boolean) {
      const sum = this.number1 + this.number2;
      const isSumEven = sum % 2 === 0;
      this.attempts++;
      this.currentAttempt++;
      const responseTime = (Date.now() - this.startTime) / 1000;
      this.responseTimes.push(responseTime);

      if ((isEven && isSumEven) || (!isEven && !isSumEven)) {
        this.score++;
      }

      if (this.currentAttempt < this.totalAttempts) {
        this.generateRandomNumbers();
      } else {
        this.testCompleted = true;
        this.status = `Правильные ответы: ${this.score} из ${this.totalAttempts}`;
        this.calculateStandardDeviation();
        this.saveResults()
      }
    },
    startTest() {
      this.testStarted = true;
      this.generateRandomNumbers();
    },
    calculateStandardDeviation() {
      const mean =
        this.responseTimes.reduce((a, b) => a + b, 0) /
        this.responseTimes.length;
      const variance =
        this.responseTimes.reduce(
          (sum, time) => sum + Math.pow(time - mean, 2),
          0,
        ) / this.responseTimes.length;
      this.standardDeviation = Math.sqrt(variance);
    },
    async saveResults() {
      await new TestResolver().createAddition({
        userId: UserState.id ? UserState.id : null,
        dispersion: this.standardDeviation,
        averageCallbackTime: this.responseTimes.reduce(
          (sum, time) => sum + time, 0
        ) / this.responseTimes.length,
        allSignals: this.totalAttempts,
        mistakes: this.totalAttempts - this.score,
      }, "Visual")
      if (this.testBlockId) await this.updateTestBlockToken()
    },
    async resetTest() {
      if (this.testBlockId) await router.push(`/testBlock/${this.testBlockId}`);
      else router.go(0)
    },
  },
};
</script>

<template>
  <div class="container">
    <div v-if="!testStarted" class="instruction">
      <h2>Инструкция</h2>
      <p>Добро пожаловать в тест на четность!</p>
      <p>
        В этом тесте вам будет предложено определить, является ли сумма двух
        случайных чисел четным или нечетным числом.
      </p>
      <p>
        Перед вами появится сумма двух чисел, и вам нужно будет выбрать, четная
        она или нет, нажав на соответствующую кнопку.
      </p>
      <p>Готовы начать? Нажмите кнопку ниже, чтобы пройти тест!</p>
      <CommonButton class="button submit_button" @click="startTest">
        <template v-slot:placeholder>Начать</template>
      </CommonButton>
    </div>

    <div v-else :class="testCompleted && testStarted ? 'completed test' : 'test'">
      <h2 v-if="!testCompleted">Определите четность суммы</h2>
      <div class="progress" v-if="!testCompleted">
        <div>Правильные ответы: {{ score }}</div>
        <div>Попытки: {{ attempts }}</div>
      </div>
      <div class="results" v-if="testCompleted">
        <div class="short">
          <h2>Поздравляем с выполнением теста!</h2>
        </div>
        <div class="full" v-if="settings.showTotalResults">
          <p>{{ status }}</p>
          <p>
            Стандартное отклонение времени ответов:
            {{ standardDeviation.toFixed(2) }} с
          </p>
        </div>
      </div>
      <div class="numbers" v-if="!testCompleted">
        <span>{{ number1 }}</span>
        <span> + </span>
        <span>{{ number2 }}</span>
      </div>
      <div class="buttons">
        <CommonButton v-if="!testCompleted" class="even submit_button" @click="checkEvenOdd(true)">
          <template v-slot:placeholder>Четное</template>
        </CommonButton>
        <CommonButton v-if="!testCompleted" class="odd submit_button" @click="checkEvenOdd(false)">
          <template v-slot:placeholder>Нечетное</template>
        </CommonButton>
        <CommonButton v-else class="submit_button" @click="resetTest">
          <template v-slot:placeholder>{{ testBlockId ? 'Вернуться к блоку' : 'Пройти еще раз'}}</template>
        </CommonButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  background: white;
  padding: 1.25rem;
  border-radius: 0.625rem;
  box-shadow: 0 0 0.625rem rgba(0, 0, 0, 0.1);
  margin-top: 15vh;
  max-width: 30vw;

  .instruction, .test {
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: space-between;
    gap: 1vw;

    h2 {
      text-align: center;
    }

    .results {
      display: flex;
      flex-direction: column;
      gap: 1vw;
    }
  }

  .test {
    .progress {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }

    .numbers {
      font-size: 3rem;
      margin: 1.25rem 0;
      display: flex;
      justify-content: center;
    }
  }

  .test.completed {
    justify-content: center;
  }
}

.buttons {
  display: flex;
  justify-content: space-between;
  gap: 1vw;

  button {
    flex: 1;
  }

  .even, .odd {
    aspect-ratio: 2 / 1
  }
}
</style>
