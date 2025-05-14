<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import CommonButton from './UI/CommonButton.vue';
import type { TestTypeDataOutputDto } from '../api/resolvers/testType/dto/output/test-type-data-output.dto.ts';
import router from '../router/router.ts';

export default defineComponent({
  name: 'StatisticsCard',
  components: { CommonButton },
  props: {
    userName: {
      type: String,
      default: 'Anonymous',
    },
    score: Number,
    maxScore: Number,
    time: Number,
    duration: Number,
    totalOverlapTime: Number,
    bestOverlap: Number,
    averageOverlap: Number,
    overlapCount: Number,
    dispersion: Number,
    date: {
      type: String,
      required: true,
    },
    valid: {
      type: Boolean,
      required: true,
    },
    testType: {} as PropType<TestTypeDataOutputDto>,
  },
  computed: {
    scorePercentage() {
      if (!this.maxScore || !this.score) return undefined
      return ((this.score / this.maxScore) * 100).toFixed(2) + '%';
    },
    cardColors() {
      if (!this.maxScore || !this.score) return undefined
      const percentage = (this.score / this.maxScore) * 100;
      return percentage >= 80 ? 'green' : percentage >= 50 ? 'orange' : 'red';
    },
    shareLink(): string {
      const origin = window.location.origin;
      return `${origin}/invitation/test/${this.invitationToken}`
    }
  },
  data() {
    return {
      invitationToken: null as string | null,
    }
  },
  methods: {
    router() {
      return router
    },
  }
});
</script>

<template>
  <div class="statistics-card">
    <h4 class="title">{{ testType?.description }}</h4>
    <div class="result">
      <div class="valid" v-if="scorePercentage">
        <p>{{ scorePercentage}}</p>
      </div>
      <div class="bar" v-if="scorePercentage">
        <div
          class="progress"
          :style="{ width: scorePercentage, backgroundColor: cardColors }"
        ></div>
      </div>
      <p class="fields" v-if="score && maxScore">Правильные ответы: {{ score }} / {{ maxScore }}</p>
      <p class="fields">Респондент: {{ userName }}</p>
      <p class="fields" v-if="time">Среднее время реакции: {{ time > 50 ? Math.abs(time / 100) : Math.abs(time) }} c</p>
      <p class="fields" v-if="score && maxScore">Статус:
        <span :style="{ color: (score / maxScore) > 0.6 ? 'green' : 'red'}">
            {{ (score / maxScore) > 0.6 ? 'Сдан' : 'Не сдан' }}
          </span>
      </p>
      <p class="fields" v-if="dispersion">Отклонение: {{ dispersion > 50 ? (dispersion / 100).toFixed(2) : dispersion.toFixed(2) }} c </p>
      <p class="fields" v-if="duration">Длительность: {{ duration }} c </p>
      <p class="fields" v-if="averageOverlap">Среднее время наложения: {{ averageOverlap.toFixed(2) }} c </p>
      <p class="fields" v-if="overlapCount">Количество наложений: {{ overlapCount }}</p>
      <p class="fields" v-if="bestOverlap">Лучшее наложение: {{ bestOverlap.toFixed(2) }} c</p>
      <p class="fields">Дата: {{ date }}</p>
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
  overflow: hidden;
  flex: 1;
}

.title {
  font-size: 24px;
  margin-top: 1vw;
  color: #ffffff;
  font-weight: bold;
}
.result {
  display: flex;
  flex-direction: column;
  background-color: var(--background-secondary);
  padding: 1vw;
  gap: 1vw;
  border-radius: 15px;
  height: 100%;
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
    content: '';
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
