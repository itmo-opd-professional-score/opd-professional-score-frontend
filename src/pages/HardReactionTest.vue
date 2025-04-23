<template>
  <div class="container">
    <h2 class="title">Тест на скорость реакции на движущиеся объекты</h2>
    <p class="description">
      Этот тест измеряет время вашей реакции на движущиеся объекты.
      После начала теста фиолетовые круги начнут двигаться. Как только они будут находиться в начале своего пути (верхняя точка траектории) - как
      можно быстрее нажмите соответствующие кнопки. Старайтесь не нажимать кнопки до или после этой зоны!
    </p>
    <MultiReactionTest :time="time" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MultiReactionTest from '../components/MultiReactionTest.vue';

export default defineComponent({
  name: "HardReactionTest",
  components: { MultiReactionTest },
  props: {
    time: {
      type: Number,
      required: true
    },
  },
});
</script>

<style scoped>
.title {
  font-size: 46px;
  margin-bottom: 20px;
  color: #fff;
}
.description {
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 15px;
  margin: 20px 0;
  color: black;
}
.container {
  max-width: 35vw;
  padding: 2rem;
  text-align: center;
}
</style>
