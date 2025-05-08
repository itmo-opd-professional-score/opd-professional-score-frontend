<script setup lang="ts"></script>

<template>
  <div class="wrapper">
    <div class="id" id="id">
      #
      <slot name="id">12345</slot>
    </div>
    <div class="test_name">
      <slot name="test_type">Lorem ipsum dolor sit amet.</slot>
    </div>
    <div class="test_header">
      <slot name="average_callback">Lorem ipsum dolor sit amet.</slot>
    </div>
    <div class="test_header">
      <slot name="user">Lorem ipsum dolor sit amet.</slot>
    </div>
    <div class="test_header">
      <slot name="valid">Lorem ipsum dolor sit amet.</slot>
    </div>
    <div class="created">
      <slot name="created_at">01.01.2000</slot>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  background: var(--background-secondary);
  border-radius: 10px;
  width: 100%;
  height: 4rem;
  padding: 0 1rem;
  justify-content: center;
  align-items: center;
  display: grid;
  grid-template-columns: 1fr 3fr 3fr 3fr 2fr 2fr;
}

.wrapper:hover {
  cursor: pointer;
}

.wrapper > div {
  border-right: 1px solid black;
  padding: 5px;
  height: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

#id,
#test_name,
#test_header {
  text-align: left;
}

.wrapper > div:last-child {
  border-right: none;
}

.remove {
  scale: 60%;
  transition-duration: 0.2s;
}

.remove:hover {
  scale: 65%;
  transition-duration: 0.2s;
}
</style>
