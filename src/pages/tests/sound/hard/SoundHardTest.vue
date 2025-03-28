<script setup lang="ts">
  import CommonButton from "../../../../components/UI/CommonButton.vue";
  import {ref} from "vue";
  import router from "../../../../router/router.ts";
  import type {SoundHardTestQuestionDto} from "./dto/SoundHardTestQuestion.dto.ts";
  import type {SoundHardTestAnswerDto} from "./dto/SoundHardTestAnswer.dto.ts";
  import type {SoundHardTestDto} from "./dto/SoundHardTest.dto.ts";
  import type {SoundHardTestSumType} from "./dto/SoundHardTestSumType.types.ts";
  const questionsCount = 10
  const step = ref<number>(0);
  const score = ref<number>(0);
  const questionStartTime = ref<number>(0);
  const testStartTime = ref<number>(0);
  const questionNumber = ref<number>(-1);
  const averageResponse = ref<string>()
  const questions: SoundHardTestQuestionDto[] = []
  const answers: SoundHardTestAnswerDto[] = []
  const testResults = ref<SoundHardTestDto>()

  const changeStep = () => {
    step.value = step.value + 1;
    if (step.value == 1) {
      testStartTime.value = Date.now();
      generateQuestion()
    } else if (step.value == 2) {
      let timeSum = 0
      answers.forEach((answer: SoundHardTestAnswerDto) => {
        timeSum += answer.elapsedTime
      })
      averageResponse.value = (timeSum / questionsCount).toFixed(2)
      testResults.value = {
        id: Math.floor(timeSum * 10 / questionsCount),
        questions: questions,
        answers: answers,
        elapsedTime: Date.now() - timeSum,
      }
    }
  }

  const submitAnswer = (answer: SoundHardTestSumType) => {
    let isCorrect: boolean
    if (questions[questionNumber.value].answer === answer) {
      score.value += 1
      isCorrect = true
    } else {
      isCorrect = false
    }
    answers.push({
      answer: answer,
      questionId: questionNumber.value,
      isCorrect: isCorrect,
      elapsedTime: (Date.now() - questionStartTime.value) / 1000,
    })
    if (questionNumber.value < questionsCount - 1) {
      generateQuestion()
    } else {
      changeStep()
    }
  }

  const generateQuestion = () => {
    const num1 = Math.floor(Math.random() * 1000);
    const num2 = Math.floor(Math.random() * 1000);
    questions.push({
      id: questionNumber.value,
      question: `${num1} + ${num2}`,
      answer: (num1 + num2) % 2 == 0 ? "EVEN" : "ODD",
    })
    questionStartTime.value = Date.now()
    questionNumber.value++
  }

  const saveResults = () => {
    //TODO implement data upload
  }
</script>

<template>
  <div class="wrapper">
    <div class="greetings block" v-if="step == 0">
      <h1 class="heading">Тест "Оценка скорости реакции на сложный звуковой сигнал - сложение в уме"</h1>
      <div class="description">
        <p>Тест генерирует случайные суммы двух чисел, и Ваша задача как можно быстрее определить чётность суммы</p>
        <ul>
          <li>Кол-во вопросов: {{ questionsCount }}</li>
          <li>Время выполнения: ~ {{ 5 }} минут</li>
          <li>Варианты ответа: ЧЕТ / НЕЧЕТ </li>
          <li>Диапазон чисел: от 100 до 1000 </li>
        </ul>
        <p>Результат будет отображен после ответа на все вопросы</p>
      </div>
      <div class="controls">
        <CommonButton class="button submit_button" @click="changeStep">
          <template v-slot:placeholder>Start</template>
        </CommonButton>
      </div>
    </div>
    <div class="test block" v-if="step == 1 && questions.length > questionNumber">
      <div class="stats">
        <h4 class="score">Score: {{ score }} / {{ questionsCount }}</h4>
        <h4 class="question">Question: {{ questionNumber + 1 }} / {{ questionsCount }}</h4>
      </div>
      <h3 class="question">{{ questions[questionNumber].question }}</h3>
      <div class="controls">
        <CommonButton class="button" @click="submitAnswer('ODD')">
          <template v-slot:placeholder>ODD</template>
        </CommonButton>
        <CommonButton class="button" @click="submitAnswer('EVEN')">
          <template v-slot:placeholder>EVEN</template>
        </CommonButton>
      </div>
    </div>
    <div class="results block" v-if="step == 2">
      <h1 class="heading">Тест пройден!"</h1>
      <div class="description">
        <p>Поздравляем Вас с прохождением теста на проверку скорости реакции на сложный звуковой сигнал! Ваши результаты:</p>
        <ul>
          <li>Кол-во вопросов: {{ questionsCount }}</li>
          <li>Время выполнения: ~{{ 5 }}</li>
          <li>Правильные ответы: {{ score }} / {{ questionsCount }} </li>
          <li>Среднее время ответа: {{ averageResponse }} сек</li>
        </ul>
        <p>Результат будет отображен после ответа на все вопросы</p>
      </div>
      <div class="controls">
        <CommonButton class="button" @click="router.go">
          <template v-slot:placeholder>Пройти заново</template>
        </CommonButton>
        <CommonButton class="button submit_button" @click="saveResults">
          <template v-slot:placeholder>Сохранить результаты</template>
        </CommonButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    border-radius: 15px;
    width: 60vw;
    aspect-ratio: 4 / 3;
    padding: 2vw;
    background-color: var(--background-secondary);

    .block {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      background-color: var(--background-primary);
      border-radius: 15px;
      box-sizing: border-box;
      padding: 2vw;

      .heading {
        font-size: 2vw;
      }

      .description {
        padding: 3vw 0;

        ul {
          display: flex;
          flex-direction: column;
          gap: 1vw;
          padding-left: 2vw;
          margin: 1vw 0;

          li {
            font-size: 1.3vw;
          }
        }

        p {
          font-size: 1.3vw;
        }
      }

      .controls {
        display: flex;
        justify-content: space-between;
        width: 100%;
        margin-top: auto;

        .button {
          width: 15vw;
          height: 10vw;
        }
      }
    }

    .greetings {

      .controls {
        .button {
          height: 5vw;
          width: 100%;
        }
      }
    }

    .test {

      .stats {
        display: flex;
        justify-content: space-between;

        h4 {
          font-size: 1.2vw;
        }
      }

      .question {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        font-size: 4vw;
      }
    }

    .results {
      .controls {
        .button {
          width: 45%;
          height: 5vw;
        }
      }
    }
  }
</style>