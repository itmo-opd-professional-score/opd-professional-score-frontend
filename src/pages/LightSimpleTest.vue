<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
name: "LightSimpleTest"
})

</script>

<template>
    <div class="container">
      <h1>Тест на скорость реакции</h1>
      <p id="instruction">Нажмите на кнопку, когда она станет зелёной.</p>
      <button id="reactionButton" disabled>Ждите...</button>
      <p id="result"></p>
    </div>
</template>

<style scoped>

</style>