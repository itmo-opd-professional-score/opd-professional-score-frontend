<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'StatisticsCard',
  props: {
    testName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      default: 'Anonymous',
    },
    testCategory: {
      type: String,
      default: 'Без категории',
    },
    score: {
      type: Number,
      required: true,
    },
    maxScore: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: Number,
      required: true,
    },
    valid: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    scorePercentage(): string {
      return ((this.score / this.maxScore) * 100).toFixed(2) + '%';
    },
    cardColors(): string {
      const percentage = (this.score / this.maxScore) * 100;
      return percentage >= 80 ? 'green' : percentage >= 50 ? 'orange' : 'red';
    },
  },
});
</script>

<template>
  <div class="statistics-card">
    <h4 class="title">{{ testName }}</h4>
    <p class="category fields">Категория: {{ testCategory }}</p>
    <p class="user fields">Респондент: {{ userName }}</p>
    <div class="result">
      <div class="score-result">
        <p class="score fields">
          Результат: {{ score }} / {{ maxScore }} ({{ scorePercentage }})
        </p>
        <div class="progress-bar">
          <div
            class="progress"
            :style="{ width: scorePercentage, backgroundColor: cardColors }"
          ></div>
        </div>
      </div>
      <div class="time-result">
        <p class="text fields">Затраченное время:</p>
        <p class="time fields">{{ time }}</p>
      </div>
      <div class="level-result">
        <p class="level fields">Оценка:</p>
      </div>
    </div>
    <p class="date">Дата: {{ date }}</p>
    <p class="valid">Валидность: {{ valid }}</p>
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
  flex: 1;
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

.fields {
  font-size: 16px;
  color: rgb(237, 227, 227, 0.9);
  font-weight: 500;
}
.date {
  margin-top: 30px;
}
.date,
.valid {
  color: #3a3e53;
}
.valid {
  margin-bottom: 15px;
}
.progress-bar {
  max-width: 30rem;
  height: 10px;
  color: rgb(237, 227, 227, 0.9);
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 30px;
}

.progress {
  height: 100%;
  transition: width 0.5s ease-in-out;
}
</style>
