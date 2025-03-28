<script lang="ts">
import {defineComponent} from 'vue'
import TestStatisticsCard from "../components/TestStatisticsCard.vue";

/*export default defineComponent({
  name: "TestInfoPage",
  components: {StatisticsCard: TestStatisticsCard},
  props: {
    test {
      name: String,

    }
  }
})*/
</script>

<template>
  <div class="test-result-page">
    <section class="current-test-section">
      <h2> Результаты теста: {{}}</h2>
      <div class="test-result">

      </div>
    </section>
  </div>
</template>

<style scoped>

</style>