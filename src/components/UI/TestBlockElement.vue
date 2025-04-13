<script lang="ts">
import { defineComponent } from 'vue';
import CommonButton from './CommonButton.vue';

export default defineComponent({
  name: 'TestBlockElement',
  components: { CommonButton },
  methods: {
    open() {},
  },
});
</script>

<template>
  <div class="test-block-element-wrapper">
    <div class="field" id="id">#<slot name="id">12345</slot></div>
    <div class="field" id="name">
      <slot name="name">Название</slot>
    </div>
    <CommonButton class="open-button" id="btn" @click="open">
      <template v-slot:placeholder>Открыть</template>
    </CommonButton>
  </div>
</template>

<style scoped>
.test-block-element-wrapper {
  background: var(--background-secondary);
  border-radius: 10px;
  width: 100%;
  height: 4rem;
  padding: 0 1rem;
  justify-content: center;
  align-items: center;
  display: grid;
  grid-template-columns: 1fr 5fr 1fr;
  gap: 2rem;
}

.test-block-element-wrapper:hover {
  cursor: pointer;
}

.test-block-element-wrapper > div {
  border-right: 1px solid black;
  padding: 5px;
  height: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.test-block-element-wrapper > div:last-child {
  border-right: none;
}

.open-button {
  width: 90%;
  height: 60%;
}

#id,
#name {
  text-align: left;
}
</style>
