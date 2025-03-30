<script setup lang="ts">
  import CommonButton from "../../../../components/UI/CommonButton.vue";
  import {onMounted, ref} from "vue";
  import router from "../../../../router/router.ts";
  import type {SoundHardTestAnswerDto, SoundHardTestQuestionDto, SoundHardTestSumType} from "./SoundHardTest.types.ts";
  import {TestResolver} from "../../../../api/resolvers/test/test.resolver.ts";
  import {usePopupStore} from "../../../../store/popup.store.ts";
  import {UserState} from "../../../../utils/userState/UserState.ts";
  import type {CreateSoundAdditionOutputDto} from "../../../../api/resolvers/test/dto/output/create-sound-addition-output.dto.ts";
  import {jwtDecode} from "jwt-decode";
  import type {TestJwt} from "../../types";

  const questionsCount = 10
  const step = ref<number>(0);
  const score = ref<number>(0);
  const questionStartTime = ref<number>(0);
  const testStartTime = ref<number>(0);
  const questionNumber = ref<number>(-1);
  const averageResponse = ref<string>()
  const isSpeaking = ref<boolean>(false);
  const questions: SoundHardTestQuestionDto[] = []
  const answers: SoundHardTestAnswerDto[] = []
  const utterance = new SpeechSynthesisUtterance()
  let voices = speechSynthesis.getVoices()
  let completedTestsLinks = []
  let completedTestsResults = []
  const props = defineProps<{
    token?: string
  }>()

  speechSynthesis.onvoiceschanged = () => {
    voices = speechSynthesis.getVoices()
  }

  const convertTextToSpeech = (str: string) => {

    return new Promise<void>((resolve): void => {
      utterance.onstart = () => {
        isSpeaking.value = true
      }
      utterance.onend = () => {
        isSpeaking.value = false
        resolve()
      }
      const voice = voices[0];
      if (!str) return;
      utterance.text = str;
      utterance.voice = voice;
      utterance.rate = 2
      utterance.lang = voice.lang;
      speechSynthesis.speak(utterance);
    })
  }

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
      saveResults()
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

  const generateQuestion = async () => {
    const num1 = Math.floor(Math.random() * 1000);
    const num2 = Math.floor(Math.random() * 1000);
    questions.push({
      id: questionNumber.value,
      question: `${num1} + ${num2}`,
      answer: (num1 + num2) % 2 == 0 ? "EVEN" : "ODD",
    })
    questionNumber.value++
    await convertTextToSpeech(`${num1} + ${num2}`)
    questionStartTime.value = Date.now()
  }

  const calculateDispersion = (data: number[]) => {
    const mean = data.reduce((sum, value) => sum + value, 0) / data.length;
    const variance = data.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0);
    return Math.sqrt(variance / (data.length - 1));
  }

  const saveResults = () => {
    const testResolver = new TestResolver()
    const popUpStore = usePopupStore()
    const data: CreateSoundAdditionOutputDto = {
      userId: UserState.id != undefined ? UserState.id : null,
      averageCallbackTime: answers.reduce((sum, answer) => sum + answer.elapsedTime, 0) / questionsCount,
      dispersion: calculateDispersion(answers.map(answer => answer.elapsedTime)),
      allSignals: questionsCount,
      mistakes: questionsCount - score.value,
    }
    testResolver.createSoundAddition(data).then(result => {
      completedTestsLinks.push(props.token)
      completedTestsResults.push(result.body.testToken)
      localStorage.setItem("completedTestsLinks", JSON.stringify(completedTestsLinks))
      localStorage.setItem("completedTestsResults", JSON.stringify(completedTestsResults))
      popUpStore.activateInfoPopup("Results were saved successfully!")
    }).catch(error => {
      popUpStore.activateErrorPopup(`Error code: ${error.status}. ${error.response.data.message}`)
    })
  }
  onMounted(async () => {
    const linksData = localStorage.getItem("completedTestsLinks")
    const resultsData = localStorage.getItem("completedTestsResults")
    if (linksData) {
      completedTestsLinks.push(...JSON.parse(linksData))
    }

    if (resultsData) {
      completedTestsResults.push(...JSON.parse(resultsData))
    }
    if (props.token && completedTestsLinks.length != 0) {
      completedTestsLinks.forEach(link => {
        const data = jwtDecode(link) as TestJwt
        if (data.testType == "SOUND_ADDITION") {
          step.value = -1
        }
      })
    }
  })
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
          <template v-slot:placeholder>Начать тестирование</template>
        </CommonButton>
      </div>
    </div>
    <div class="test block" v-if="step == 1 && questions.length > questionNumber">
      <div class="stats">
        <h4 class="score">Score: {{ score }} / {{ questionsCount }}</h4>
        <h4 class="question">Question: {{ questionNumber + 1 }} / {{ questionsCount }}</h4>
      </div>
      <div class="controls">
        <CommonButton :disabled="isSpeaking" class="button" @click="submitAnswer('ODD')">
          <template v-slot:placeholder>НЕЧЕТ</template>
        </CommonButton>
        <CommonButton :disabled="isSpeaking" class="button" @click="submitAnswer('EVEN')">
          <template v-slot:placeholder>ЧЕТ</template>
        </CommonButton>
      </div>
    </div>
    <div class="results block" v-if="step == 2">
      <h1 class="heading">Тест пройден!</h1>
      <div class="description">
        <p>Поздравляем Вас с прохождением теста на проверку скорости реакции на сложный звуковой сигнал! Ваши результаты:</p>
        <ul>
          <li>Кол-во вопросов: {{ questionsCount }}</li>
          <li>Время выполнения: ~{{ 5 }}</li>
          <li>Правильные ответы: {{ score }} / {{ questionsCount }} </li>
          <li>Среднее время ответа: {{ averageResponse }} сек</li>
        </ul>
        <a href="#">Посмотреть рейтинг и оценку результатов</a>
      </div>
      <div class="controls">
        <CommonButton v-if="UserState.id" class="button" @click="router.go">
          <template v-slot:placeholder>Пройти заново</template>
        </CommonButton>
        <CommonButton v-else class="button" @click="router.push('/auth/login')">
          <template v-slot:placeholder>Сохранить результаты</template>
        </CommonButton>
      </div>
    </div>
    <div class="error block" v-if="step == -1">
      <h1 class="heading">Тест недоступен</h1>
      <div class="description">
        <p>К сожалению, вы не можете пройти данный тест. Возможные причины</p>
        <ul>
          <li>Пригласительная ссылка недействительна</li>
          <li>Тест не опубликован</li>
          <li>Вы уже проходили этот тест</li>
        </ul>
        <p>Если ни один из вариантов Вам не подходит, то можете связаться с нами</p>
      </div>
      <div class="controls">
        <CommonButton class="button" @click="router.push('/auth/login')">
          <template v-slot:placeholder>Список доступных тестов</template>
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
        gap: 2vw;

        .button {
          flex: 1;
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