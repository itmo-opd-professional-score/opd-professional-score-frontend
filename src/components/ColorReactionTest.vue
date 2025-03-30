<template>
  <div class="container">
    <div v-if="!testStarted">
      <h1>Тест на реакцию на цвета</h1>
      <div class="instructions">
        <p>Когда появится цветной экран, быстро нажмите кнопку соответствующего цвета.</p>
        <p>На каждый ответ у вас есть 2 секунды.</p>
        <p>Всего будет 15 попыток.</p>
      </div>
      <button class="start-btn" @click="startTest">Начать тест</button>
    </div>

    <div v-else-if="!testCompleted" class="test-screen">
      <div class="timer-container">
        <div class="timer-bar" :style="timerStyle"></div>
      </div>
      <div class="attempt-counter">Попытка: {{ currentAttempt }}/15</div>

      <div class="color-display" :style="{ backgroundColor: currentColor }"></div>

      <div class="buttons">
        <button
            v-for="color in colors"
            :key="color"
            class="color-btn"
            :style="{ backgroundColor: colorMap[color] }"
            @click="handleColorClick(color)"
        ></button>
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
      <button class="restart-btn" @click="restartTest">Пройти снова</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'

const colors = ['red', 'blue', 'green', 'yellow']
const colorMap = {
  red: '#ff4444',
  blue: '#4444ff',
  green: '#44ff44',
  yellow: '#ffff44'
}
const TIME_LIMIT = 2000

const testStarted = ref(false)
const testCompleted = ref(false)
const currentColor = ref('')
const currentAttempt = ref(0)
const correctAnswers = ref(0)
const wrongAnswers = ref(0)
const reactionTimes = ref([])
const startTime = ref(null)
const timeLeft = ref(TIME_LIMIT)
let timeoutId = null
let timerInterval = null

const avgTime = computed(() => {
  return reactionTimes.value.length > 0
      ? Math.round(reactionTimes.value.reduce((a, b) => a + b, 0) / reactionTimes.value.length)
      : 0
})

const bestTime = computed(() => {
  return reactionTimes.value.length > 0 ? Math.min(...reactionTimes.value) : '-'
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
  setTimeout(() => {
    flash()
    setTimeout(() => {
      flash()
      setTimeout(() => showNextColor(), 200)
    }, 200)
  }, 200)
}

function handleColorClick(selectedColor) {
  if (!startTime.value) return

  clearInterval(timerInterval)
  const reactionTime = Date.now() - startTime.value

  if (selectedColor === currentColor.value) {
    correctAnswers.value++
    reactionTimes.value.push(reactionTime)
  } else {
    wrongAnswers.value++
  }

  startTime.value = null
  clearTimeout(timeoutId)
  showNextColor()
}

function endTest() {
  testCompleted.value = true
}

function restartTest() {
  testStarted.value = false
  testCompleted.value = false
  currentColor.value = ''
  currentAttempt.value = 0
  correctAnswers.value = 0
  wrongAnswers.value = 0
  reactionTimes.value = []
  startTime.value = null
  clearTimeout(timeoutId)
  clearInterval(timerInterval)
}

onUnmounted(() => {
  clearTimeout(timeoutId)
  clearInterval(timerInterval)
})
</script>

<style>
body {
  font-family: 'Segoe UI', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  background-color: #f5f5f5;
}

.container {
  text-align: center;
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 90%;
}

.color-display {
  width: 100%;
  height: 200px;
  margin: 20px 0;
  border-radius: 10px;
  border: 2px solid #333;
  transition: background-color 0.2s;
}

.buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin: 20px 0;
}

.color-btn {
  height: 50px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.1s;
}

.color-btn:active {
  transform: scale(0.95);
}

.timer-container {
  width: 100%;
  height: 10px;
  background-color: #eee;
  border-radius: 5px;
  margin-bottom: 15px;
}

.timer-bar {
  height: 100%;
  border-radius: 5px;
  transition: width 0.1s linear, background-color 0.3s;
}

button {
  padding: 10px 20px;
  font-size: 1em;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  background-color: #4127e4;
  color: white;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #5a42e8;
}

.start-btn {
  margin-top: 20px;
  padding: 12px 25px;
  font-size: 1.1em;
}

.restart-btn {
  background-color: white;
  color: #4127e4;
  border: 2px solid #4127e4;
  font-weight: bold;
  margin-top: 20px;
}

.attempt-counter {
  font-weight: bold;
  margin: 10px 0;
  font-size: 1.1em;
}

.results {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
}

.results p {
  margin: 10px 0;
  font-size: 1.1em;
}

.instructions {
  background-color: #e9f7ef;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}
</style>