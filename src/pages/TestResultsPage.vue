<script setup lang="ts">
import TestStatisticsCard from "../components/TestStatisticsCard.vue";
</script>

<template>
  <div class="test-results-page">
    <!-- Блок 1: Информация о текущем тесте -->
    <section class="current-test">
      <h3>Текущий тест</h3>
      <TestStatisticsCard :time="2" :date="'33'" :max-score="10" :score="10" :test-name="'Проверка на скорость'"></TestStatisticsCard>
    </section>
    <!--Блок 2: Все результаты теста этого пользователя-->
    <section class="user-test-history">

    </section>
    </div>


</template>

<style scoped>
.test-results-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: var(--background-primary);
  padding: 15px;
  width: 75vw;
  height: 80vh;
  border-radius: 15px;
}

h3 {
  margin-bottom: 40px;
  font-size: 48px;
  color: #ffffff;
}
</style>
