<script lang="ts">
export default {
  name: "TestScoreElementMobile",
}
</script>

<template>
  <div class="wrapper">
    <div class="field" id="id">
      <span class="bold-text">ID: </span>
      <slot name="id">12345</slot>
    </div>
    <div class="field" id="test_name">
      <span class="bold-text">Name: </span>
      <slot name="test_name">Lorem ipsum dolor sit amet.</slot>
    </div>
    <div class="field">
      <span class="bold-text">Score: </span>
      <slot name="current_points">0</slot>
      /
      <slot name="max_points">100</slot>
    </div>
    <div class="field">
      <span class="bold-text">Time: </span>
      <slot name="time">00:00:00</slot>
    </div>
    <div class="field">
      <span class="bold-text">Username: </span>
      <slot name="username">Имя пользователя</slot>
    </div>
    <div class="field">
      <span class="bold-text">Date: </span>
      <slot name="createdAt">2022-22-22</slot>
    </div>
    <div class="field">
      <span class="bold-text">Valid: </span>
      <slot name="valid">true</slot>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  background: var(--background-secondary);
  border-radius: 10px;
  width: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  gap: 0.5rem;
}

.wrapper:hover {
  cursor: pointer;
}

.field {
  width: 100%;
}

.bold-text {
  font-weight: bold;
}
</style>