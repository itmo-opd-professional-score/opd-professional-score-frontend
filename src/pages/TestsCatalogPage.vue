<script setup lang="ts">

import router from '../router/router.ts';
import CommonButton from '../components/UI/CommonButton.vue';

const testsData = [
  {
    name: "Простая реакция на свет",
    category: "Простой",
    link: "/test/simple/light"
  },
  {
    name: "Простая реакция на звук",
    category: "Простой",
    link: "/test/simple/sound"
  },
  {
    name: "Сложная реакция на свет",
    category: "Сложный",
    link: "/test/hard/light"
  },
  {
    name: "Сложение в уме - на слух",
    category: "Сложный",
    link: "/test/addition/sound"
  },
  {
    name: "Сложение в уме - визуально",
    category: "Сложный",
    link: "/test/addition/visual"
  },
  {
    name: "Простая реакция на движение",
    category: "Простой",
    link: "/test/simple/rdo"
  },
  {
    name: "Сложная реакция на движение",
    category: "Сложный",
    link: "/test/hard/rdo"
  },
  {
    name: "Простая реакция на преследование",
    category: "Простой",
    link: "/test/simple/tracking"
  },
  {
    name: "Сложная реакция на преследование",
    category: "Сложный",
    link: "/test/simple/tracking"
  },
  {
    name: "Тест Струпа",
    category: "Средний",
    link: "/test/cognitive/stroop"
  },
  {
    name: "Числовые закономерности",
    category: "Средний",
    link: "/test/cognitive/numerical"
  },
  {
    name: "Вербальное восприятие",
    category: "Средний",
    link: "/test/cognitive/verbal"
  }
]
</script>

<template>
  <div class="container">
    <div class="cards">
      <div
        v-for="(test, index) in testsData"
        :key="index"
        class="card"
        @click="router.push(test.link)"
      >
        <div class="pic"></div>
        <h2>{{ test.name }}</h2>
        <p>Категория: <b>{{ test.category }}</b></p>
        <CommonButton class="submit_button">
          <template #placeholder>Пройти</template>
        </CommonButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .container {
    width: 100vw;
    height: 78vh;
    display: flex;
    justify-content: center;
    align-items: center;

    .cards {
      width: 80vw;
      height: 80vh;
      overflow-y: scroll;
      display: grid;
      grid-template-columns: repeat(4, 17.5vw);
      gap: 2vw;
      padding: 2vw;
      background-color: var(--background-secondary);
      border-radius: 15px;

      .card {
        padding: 1vw;
        background-color: var(--background-primary);
        height: 35vh;
        width: 100%;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        gap: 1vw;

        h2 {
          font-size: 1.1vw;
          height: 20%;
          display: flex;
          align-items: center;
        }

        .pic {
          min-height: 50%;
          width: 100%;
          background: linear-gradient(45deg, #1c9ae8, #da65fa);
          border-radius: 10px;
        }

        .submit_button {
          display: flex;
          margin-top: auto;
        }
      }
    }
  }
</style>