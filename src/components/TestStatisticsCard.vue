<script lang="ts">
import {computed, defineComponent} from 'vue'

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
    <p class="score">
      Результат: {{ score }} / {{ maxScore }} ({{ scorePercentage }})
    </p>
    <div class="progress-bar">
      <div class="progress" :style="{ width: scorePercentage, backgroundColor: cardColors }"></div>
    </div>
    <p class="time">Затраченное время: </p>
    <p class="level">Оценка: <b></b></p>
    <p class="date">Дата: {{ date }}</p>
    <p class="valid">Валидность: {{valid}}</p>
  </div>
</template>

<style scoped>
.statistics-card {
  display: flex;
  flex-direction: column;
  padding: 15px;
  border-radius: 10px;
  border: 2px solid;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  background: #fff;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.category,
.user,
.score,
.time,
.level,
.date,
.valid
{
  font-size: 14px;
  margin: 4px 0;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: #eee;
  border-radius: 5px;
  overflow: hidden;
  margin: 5px 0;
}

.progress {
  height: 100%;
  transition: width 0.5s ease-in-out;
}
</style>