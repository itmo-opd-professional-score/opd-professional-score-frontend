<template>
  <div class="container">
    <div v-if="!testStarted">
      <h1>Тест на реакцию на цвета</h1>
      <div class="instructions">
        <p>Когда появится цветной экран, быстро нажмите кнопку соответствующего цвета.</p>
        <p>На каждый ответ у вас есть 2 секунды.</p>
        <p>Всего будет 15 попыток.</p>
      </div>
      <CommonButton class="start-btn" @click="startTest">Начать тест</CommonButton>
    </div>

    <div v-else-if="!testCompleted" class="test-screen">
      <div class="timer-container">
        <div class="timer-bar" :style="timerStyle"></div>
      </div>
      <div class="attempt-counter">Попытка: {{ currentAttempt }}/15</div>

      <div class="color-display" :style="{ backgroundColor: currentColor }"></div>

      <div class="buttons">
        <CommonButton
          v-for="color in colors"
          :key="color"
          class="color-btn"
          :style="{ backgroundColor: colorMap[color] }"
          @click="handleColorClick(color)"
        ></CommonButton>
      </div>

      <div class="stats">
        <p>Среднее время: {{ avgTime > 0 ? avgTime + ' мс' : '-' }}</p>
        <p>Правильно: {{ correctAnswers }}, Ошибок: {{ wrongAnswers }}</p>
      </div>
    </div>

    <div v-else class="results">
      <h2>Результаты теста</h2>
      <p>Среднее время реакции: <strong>{{ avgTime }} мс</strong></p>
      <p>Правильных ответов: <strong>{{ correctAnswers }}</strong></p>
      <p>Лучшее время: <strong>{{ bestTime }} мс</strong></p>
      <CommonButton class="restart-btn" @click="restartTest">Пройти снова</CommonButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import CommonButton from './UI/CommonButton.vue'

type Color = 'red' | 'blue' | 'green' | 'yellow'
const colors: Color[] = ['red', 'blue', 'green', 'yellow']
const colorMap = {
  red: '#ff4444',
  blue: '#4444ff',
  green: '#44ff44',
  yellow: '#ffff44'
}
const TIME_LIMIT = 2000

const testStarted = ref(false)
const testCompleted = ref(false)
const currentColor = ref<Color | 'white'>('white')
const currentAttempt = ref(0)
const correctAnswers = ref(0)
const wrongAnswers = ref(0)
const reactionTimes = ref<number[]>([])
const startTime = ref<number | null>(null)
const timeLeft = ref(TIME_LIMIT)
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
  const percentage = (timeLeft.value / TIME_LIMIT) * 100
  return {
    width: percentage + '%',
    backgroundColor: percentage <= 30 ? '#ff4444' : '#4CAF50'
  }
})

function startTest() {
  testStarted.value = true
  showNextColor()
}

function showNextColor() {
  if (currentAttempt.value >= 15) {
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
  timeLeft.value = TIME_LIMIT
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
  wrongAnswers.value++
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
  clearFlashTimeouts() // Добавлена очистка таймаутов
}

function restartTest() {
  testStarted.value = false
  testCompleted.value = false
  currentColor.value = 'white'
  currentAttempt.value = 0
  correctAnswers.value = 0
  wrongAnswers.value = 0
  reactionTimes.value = []
  startTime.value = null
  clearTimeout(timeoutId)
  clearInterval(timerInterval)
  clearFlashTimeouts() // Добавлена очистка таймаутов
}

onUnmounted(() => {
  clearTimeout(timeoutId)
  clearInterval(timerInterval)
  clearFlashTimeouts() // Добавлена очистка таймаутов
})
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