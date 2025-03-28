<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "StatisticsCard",
  props: {
    testName: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      default: 'Anonimus'
    },
    testCategory: {
      type: String,
      default: 'Без категории'
    },
    score: {
      type: Number,
      required: true
    },
    maxScore: { //можно откорректировать в будущем в зависимости от того
      type: Number,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    time: {
      type: Number,
      required: true
  },
    valid: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    scorePercentage (): string {
      return ((this.score / this.maxScore) * 100).toFixed(2) + "%";
    },
    cardColors (): string {
      const percentage = (this.score / this.maxScore) * 100;
      return percentage >= 80 ? "green" : percentage >= 50 ? "orange" : "red";
    }
  }
});
</script>

<template>
  <div class="statistics-card">
    <h4 class="title">{{ testName }}</h4>
    <p class="category">Категория: {{ testCategory }}</p>
    <p class="user">Респондент: {{ userName }}</p>
    <div class="result">
      <div class="score-result">
        <p class="score">
          Результат: {{ score }} / {{ maxScore }} ({{ scorePercentage }})
       </p>
        <div class="progress-bar">
          <div class="progress" :style="{ width: scorePercentage, backgroundColor: cardColors }"></div>
        </div>
      </div>
      <div class="time-result">
        <p class="text">Затраченное время:</p>
        <p class="time">{{time}}</p>
      </div>
      <div class="level-result">
        <p class="level">Оценка: </p>
      </div>
    </div>
    <p class="date">Дата: {{ date }}</p>
    <p class="valid">Валидность: {{valid}}</p>
  </div>
</template>

<style scoped>
.statistics-card {
  background-color: var(--background-primary);
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 15px;
  border-radius: 15px;
  width: 35vw;
}

.title {
  font-size: 24px;
  margin: 15px 0;
  color: #ffffff;
  font-weight: bold;
}
.result {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  background-color: var(--background-primary);
  padding: 10px;
  border-radius: 15px;
}
.score-result,
.time-result,
.level-result {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.category,
.user,
.score,
.time,
.level,
.text
{
  font-size: 16px;
  color: #ffffff;
}
.date {
  margin-top: 30px;
}
.date,
.valid {
  color: #3a3e53;
}
.valid{
  margin-bottom: 15px;
}
.progress-bar {
  max-width: 500px;
  height: 10px;
  background: #eee;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 30px;
}

.progress {
  height: 100%;
  transition: width 0.5s ease-in-out;
}
</style>