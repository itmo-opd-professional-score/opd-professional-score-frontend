<script lang="ts">
import CommonButton from "../CommonButton.vue";

export default {
  name: "TestManagerElementMobile",
  components: {CommonButton},
}
</script>

<template>
  <div class="wrapper">
    <div class="field" id="id">
      <span class="bold-text">Test ID: </span>
      <slot name="id">12345</slot>
    </div>
    <div class="field" id="test_name">
      <span class="bold-text">Name: </span>
      <slot name="test_name">Lorem ipsum dolor sit amet.</slot>
    </div>
    <div class="field" id="test_header">
      <span class="bold-text">Header: </span>
      <slot name="test_header">Lorem ipsum dolor sit amet.</slot>
    </div>
    <div class="field" id="created">
      <span class="bold-text">Created: </span>
      <slot name="created">01.01.2020</slot>
    </div>
    <div class="remove-btn">
      <CommonButton class="btn" @click="console.log('remove')">
        <template v-slot:placeholder>
          Удалить тест
        </template>
      </CommonButton>
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

.remove-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.btn {
  width: 100%;
  height: calc(1rem + 0.4rem);
  padding: 0.2rem 0;
  background-color: var(--danger-button-secondary);
  border: 2px solid var(--danger-button-primary);
}
</style>