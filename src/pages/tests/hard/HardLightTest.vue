<template>
  <div class="container">
    <div v-if="!testStarted">
      <h1>Тест на реакцию на цвета</h1>
      <div class="instructions">
        <p>Когда появится цветной экран, быстро нажмите кнопку соответствующего цвета.</p>
        <p>На каждый ответ у вас есть 2 секунды.</p>
        <p>Всего будет {{ ALL_SIGNALS }} попыток.</p>
      </div>
      <CommonButton class="start-btn submit_button" @click="startTest">
        <template #placeholder>Начать тест</template>
      </CommonButton>
    </div>

    <div v-else-if="!testCompleted" class="test-screen">
      <div class="timer-container" v-if="showProgress">
        <div class="timer-bar" :style="timerStyle"></div>
      </div>
      <div class="attempt-counter">Попытка: {{ currentAttempt }} / {{ ALL_SIGNALS }}</div>

      <div class="color-display" :style="{ backgroundColor: currentColor }"></div>

      <div class="buttons">
        <CommonButton
          v-for="color in colors"
          :key="color"
          class="color-btn submit_button"
          :style="{ backgroundColor: colorMap[color] }"
          @click="handleColorClick(color)"
        />
      </div>

      <div class="stats">
        <p>Среднее время: {{ avgTime > 0 ? avgTime + ' мс' : '-' }}</p>
        <p>Правильно: {{ correctAnswers }}, Ошибки: {{ wrongAnswers }}, Пропуски: {{ missedAnswers }}</p>
      </div>
    </div>

    <div v-else class="results">
      <div class="short">
        <h2>Поздравляем с прохождением теста!</h2>
      </div>
      <div class="full" v-if="showTotalResults">
        <h2>Результаты теста</h2>
        <p>Среднее время реакции: <strong>{{ avgTime }} мс</strong></p>
        <p>Правильных ответов: <strong>{{ correctAnswers }}</strong></p>
        <p>Лучшее время: <strong>{{ bestTime }} мс</strong></p>
      </div>
      <CommonButton class="restart-btn submit_button" @click="restartTest">
        <template #placeholder>Пройти снова</template>
      </CommonButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, onMounted } from 'vue';
import CommonButton from '../../../components/UI/CommonButton.vue'
import { TestResolver } from '../../../api/resolvers/test/test.resolver.ts';
import { usePopupStore } from '../../../store/popup.store.ts';
import { UserState } from '../../../utils/userState/UserState.ts';
import type { TestSetupOutputDTO } from '../../../api/resolvers/testSetup/dto/output/test-setup-output.dto.ts';
import { TestSetupsResolver } from '../../../api/resolvers/testSetup/test-setups.resolver.ts';
import { TestBlockResolver } from '../../../api/resolvers/testBlocks/test-block.resolver.ts';
import router from '../../../router/router.ts';

const props = defineProps<{
  testBlockId?: string,
  setupId?: string
}>()

type Color = 'red' | 'blue' | 'green' | 'yellow'
const colors: Color[] = ['red', 'blue', 'green', 'yellow']
const colorMap = {
  red: '#ff4444',
  blue: '#4444ff',
  green: '#44ff44',
  yellow: '#ffff44'
}
const duration = ref<number>(2000)
const showTotalResults = ref<boolean>(true)
const showProgress = ref<boolean>(true)
const ALL_SIGNALS = 15

const testStarted = ref(false)
const testCompleted = ref(false)
const currentColor = ref<Color | 'white'>('white')
const currentAttempt = ref(0)
const correctAnswers = ref(0)
const missedAnswers = ref(0)
const wrongAnswers = ref(0)
const reactionTimes = ref<number[]>([])
const startTime = ref<number | null>(null)
const timeLeft = ref(duration.value)
const flashTimeouts = ref<number[]>([])

let timeoutId: number | undefined
let timerInterval: number | undefined



const avgTime = computed(() => {
  return reactionTimes.value.length > 0
    ? Math.round(reactionTimes.value.reduce((a, b) => a + b, 0) / reactionTimes.value.length)
    : 0
})

const bestTime = computed(() => {
  return reactionTimes.value.length > 0 ? Math.min(...reactionTimes.value) : '0'
})

const timerStyle = computed(() => {
  const percentage = (timeLeft.value / duration.value) * 100
  return {
    width: percentage + '%',
    backgroundColor: percentage <= 30 ? '#ff4444' : '#4CAF50'
  }
})

const calculateDispersion = (data: number[]) => {
  const mean = data.reduce((sum, value) => sum + value, 0) / data.length;
  const variance = data.reduce(
    (sum, value) => sum + Math.pow(value - mean, 2),
    0,
  );
  return Math.sqrt(variance / (data.length - 1));
};

function startTest() {
  testStarted.value = true
  showNextColor()
}

function showNextColor() {
  if (currentAttempt.value >= ALL_SIGNALS) {
    endTest()
    return
  }

  const delay = 500 + Math.random() * 1500
  currentColor.value = 'white'

  timeoutId = setTimeout(() => {
    currentAttempt.value++
    currentColor.value = colors[Math.floor(Math.random() * colors.length)]
    startTime.value = Date.now()
    startTimer()
  }, delay)
}

function startTimer() {
  timeLeft.value = duration.value
  clearInterval(timerInterval)

  timerInterval = setInterval(() => {
    timeLeft.value -= 10
    if (timeLeft.value <= 0) {
      clearInterval(timerInterval)
      handleTimeOut()
    }
  }, 10)
}

function handleTimeOut() {
  missedAnswers.value++
  flashScreen()
}

function flashScreen() {
  const originalColor = currentColor.value
  const flash = () => {
    currentColor.value = currentColor.value === 'white' ? originalColor : 'white'
  }

  flash()
  flashTimeouts.value.push(setTimeout(() => {
    flash()
    flashTimeouts.value.push(setTimeout(() => { // Исправлено на flashTimeouts.value
      flash()
      flashTimeouts.value.push(setTimeout(() => showNextColor(), 200)) // Исправлено на flashTimeouts.value
    }, 200))
  }, 200))
}

function clearFlashTimeouts() {
  flashTimeouts.value.forEach((timeout: number) => clearTimeout(timeout))
  flashTimeouts.value = []
}

function handleColorClick(selectedColor: 'red' | 'blue' | 'green' | 'yellow') {
  if (!startTime.value) return

  if (timerInterval) clearInterval(timerInterval)
  const reactionTime = Date.now() - startTime.value

  if (selectedColor === currentColor.value) {
    correctAnswers.value++
    reactionTimes.value.push(reactionTime)
  } else {
    wrongAnswers.value++
  }

  startTime.value = null
  clearTimeout(timeoutId)
  clearFlashTimeouts() // Добавлена очистка таймаутов
  showNextColor()
}

function endTest() {
  testCompleted.value = true
  saveResults()
  clearFlashTimeouts() // Добавлена очистка таймаутов
}

async function restartTest() {
  if (props.testBlockId) await router.push(`/testblock/${props.testBlockId}`);
  else router.go(0)
}

onUnmounted(() => {
  clearTimeout(timeoutId)
  clearInterval(timerInterval)
  clearFlashTimeouts() // Добавлена очистка таймаутов
})

const saveResults = () => {
  const usePopUp = usePopupStore()
  new TestResolver().createHardLight({
    allSignals: ALL_SIGNALS,
    averageCallbackTime: avgTime.value,
    dispersion: parseFloat(calculateDispersion(reactionTimes.value).toFixed(2)),
    misclicks: missedAnswers.value,
    mistakes: wrongAnswers.value,
    userId: UserState.id ? UserState.id : null,
  }).catch((error) => {
    usePopUp.activateErrorPopup(error.message)
  })
  if (props.testBlockId && !isNaN(parseInt(props.testBlockId))) {
    let setupId = props.setupId ? parseInt(props.setupId) : undefined;
    if (setupId && isNaN(setupId)) setupId = undefined
    new TestBlockResolver().updateTestBlock({
      testBlockId: parseInt(props.testBlockId),
      updatedTest: {
        name: "HARD_LIGHT",
        setupId: setupId,
        available: false
      }
    })
  }
}
onMounted(async () => {
  if (props.setupId && !isNaN(parseInt(props.setupId))) {
    const settings: TestSetupOutputDTO | null = await new TestSetupsResolver().getById(parseInt(props.setupId))
    if (settings) {
      showTotalResults.value = settings.showTotalResults
      duration.value = settings.duration
      showProgress.value = settings.showProgress
    }
  }
});
</script>

<style scoped>
/* Стили остались без изменений */
.container {
  text-align: center;
  background: white;
  padding: 5vh 3vw;
  border-radius: 1vh;
  box-shadow: 0 0 2vw rgba(0, 0, 0, 0.1);
  max-width: 80vw;
  width: 90vw;
  margin: 0 auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Segoe UI', sans-serif;
}

.color-display {
  width: 100%;
  height: 25vh;
  margin: 2vh 0;
  border-radius: 1vh;
  border: 0.3vw solid #333;
  transition: background-color 0.2s;
}

.buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1vw;
  margin: 2vh 0;
}

.color-btn {
  height: 6vh;
  border: none;
  border-radius: 0.5vw;
  cursor: pointer;
  transition: transform 0.1s;
}

.timer-container {
  width: 100%;
  height: 1vh;
  background-color: #eee;
  border-radius: 0.5vw;
  margin-bottom: 2vh;
}

.timer-bar {
  height: 100%;
  border-radius: 0.5vw;
  transition: width 0.1s linear, background-color 0.3s;
}

.start-btn {
  margin-top: 2vh;
  padding: 2vh 3vw;
  font-size: 2.2vh;
}

.restart-btn {
  background-color: white;
  color: #4127e4;
  border: 0.3vw solid #4127e4;
  font-weight: bold;
  margin-top: 2vh;
}

.attempt-counter {
  font-weight: bold;
  margin: 1vh 0;
  font-size: 2.2vh;
}

.results {
  background-color: #f8f9fa;
  padding: 2vh;
  border-radius: 1vh;
  margin-top: 2vh;
}

.results p {
  margin: 1vh 0;
  font-size: 2.2vh;
}

.instructions {
  background-color: #e9f7ef;
  padding: 1.5vh;
  border-radius: 0.8vh;
  margin-bottom: 2vh;
}
</style>