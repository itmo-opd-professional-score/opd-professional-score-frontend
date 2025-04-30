<script setup lang="ts">
defineProps<{ disabled?: boolean }>();
</script>

<template>
  <button :disabled="disabled" class="wrapper">
    <slot name="placeholder"></slot>
  </button>
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border: 1px solid transparent;
  border-radius: 0.5rem;
  text-align: center;
  background: var(--button-primary);
  transition-duration: 0.2s;
  user-select: none;
}

.wrapper:hover {
  cursor: pointer;
  border: 1px solid var(--button-primary);
  background-color: var(--button-secondary);
  transition-duration: 0.2s;
}

.wrapper:disabled:hover {
  cursor: not-allowed;
}

.wrapper.submit_button {
  background-color: var(--submit-button-secondary);
  border-color: var(--submit-button-primary);
  color: white;
}

.wrapper.submit_button:hover {
  background-color: var(--submit-button-primary);
  border-color: transparent;
  color: white;
}

.wrapper.logout_button {
  background-color: var(--danger-button-secondary);
  border-color: var(--danger-button-primary);
  color: white;
}

.wrapper.logout_button:hover {
  background-color: var(--danger-button-primary);
  border-color: transparent;
  color: white;
}

.wrapper.tranparent {
  background-color: transparent;
  border-color: transparent;
  color: black
}

.wrapper:focus-visible {
  outline: 2px solid black;
  outline-offset: 2px;
}
</style>
