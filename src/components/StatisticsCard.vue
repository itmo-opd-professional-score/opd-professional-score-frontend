<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "StatisticsCard",
  props: {
    title: {
      type: String,
      required: true
    },
    info: {
      type: [String, Number],
      required: true
    },
    version: {
      type: String, //для солидности
      default: '' // Необязательное поле
    }
  }
})
</script>

<template>
  <div class="statistics-card">
    <h4 class="statistics-card__title">{{ title }}</h4>
    <div class="statistics-card__info">{{ info }}</div>
    <div class="statistics-card__version">{{ version }}</div>
  </div>
</template>

<style scoped>
.statistics-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px; /* Отступ между элементами */
  background: #ffffff;
}

.statistics-card__title {
  margin: 0;
  font-size: 24px;
  color: #000000;
}

.statistics-card__info {
  font-size: 14px;
  color: #333;
}

.statistics-card__version {
  font-size: 12px;
  color: #888;
  font-style: italic;
}
</style>