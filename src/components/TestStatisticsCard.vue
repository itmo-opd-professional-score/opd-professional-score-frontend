<script lang="ts">
import { defineComponent } from 'vue';
import CommonButton from './UI/CommonButton.vue';

export default defineComponent({
  name: 'StatisticsCard',
  components: { CommonButton },
  props: {
    testName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      default: 'Anonymous',
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
  methods: {
    async generateTestLink() {
      //TODO
    }
  }
});
</script>

<template>
  <div class="statistics-card">
    <h4 class="title">{{ testName }}</h4>
    <div class="result">
      <div class="valid">
        <p>{{ scorePercentage}}</p>
      </div>
      <div class="bar">
        <div
          class="progress"
          :style="{ width: scorePercentage, backgroundColor: cardColors }"
        ></div>
      </div>
      <p class="fields">Правильные ответы: {{ score }} / {{ maxScore }}</p>
      <p class="fields">Респондент: {{ userName }}</p>
      <p class="fields">Среднее время реакции: {{ time }} мс</p>
      <p class="fields">Статус:
        <span :style="{ color: valid ? 'green' : 'red'}">
            {{ valid ? 'Сдан' : 'Не сдан' }}
          </span>
      </p>
      <p class="fields">Дата: {{ date }}</p>
    </div>
    <div class="share-link">
      <CommonButton>
        <template #placeholder>Другие тесты</template>
      </CommonButton>
      <CommonButton class="submit_button" @click="generateTestLink()">
        <template #placeholder>Поделиться тестом</template>
      </CommonButton>
    </div>
  </div>
</template>

<style scoped>
.statistics-card {
  background-color: var(--background-primary);
  display: flex;
  flex-direction: column;
  gap: 2vw;
  padding: 15px;
  border-radius: 15px;
  flex: 1;
}

.title {
  font-size: 24px;
  margin-top: 1vw;
  color: #ffffff;
  font-weight: bold;
}
.result, .share-link {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: var(--background-secondary);
  padding: 1vw;
  gap: 1vw;
  border-radius: 15px;
}

.result {
  display: flex;
  flex-direction: column;
}

.share-link {
  margin-top: auto;
}

.fields {
  font-size: 18px;
  font-weight: 500;
  display: flex;
}

.valid p {
  display: flex;
  justify-content: center;
  padding: 1vw;
  font-size: 36px;
}

.bar {
  height: 1.2vw;
  color: white;
  border-radius: 15px;
  overflow: hidden;
  border: solid 2px white;
  position: relative;

  &::before {
    position: absolute;
    content: 'df';
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
    background-color: var(--background-primary);
  }
}

.progress {
  height: 100%;
  transition: width 0.5s ease-in-out;
  border-radius: 15px;
  position: absolute;
  inset: 0;
}
</style>
