<script setup lang="ts">

import { usePopupStore } from './store/popup.store.ts';

</script>

<template>
  <div class="app_container">
   <StaupTest></StaupTest>
  </div>
</template>

<style scoped>
.app_container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding-bottom: 2rem;
}

.app_header {
  width: 100%;
  margin-bottom: 2rem;
}

.popup-container {
  width: 100%;
  position: absolute;
  top: 10vh;
  display: flex;
  flex-direction: row;
  justify-content: right;
  align-items: center;
}
</style>