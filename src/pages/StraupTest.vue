<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'StraupTest',
  data() {
    return {
      colors: ['red', 'green', 'yellow', 'blue', 'orange', 'pink', 'purple', 'black', 'white', 'gray'],
      currentWord : '',
      currentColor : '',
      levelOfDifficulty: 0
    }
  },
  methods : {
    giveColor() {
      this.currentWord = this.colors[Math.floor(Math.random() * 10)];
    },
    giveColorOfWord() {
      if (this.currentWord !== '') {
        if (Math.random() < this.givePropabilityOfWordAndColorMatch()) {
          this.currentColor = this.currentWord
        } else {
          this.currentColor = this.colors[Math.floor(Math.random() * 10)];
        }
      }
    },
    givePropabilityOfWordAndColorMatch() {
      return [0.7, 0.4,  0.1][this.levelOfDifficulty];
    }
  }
});
</script>

<template>

</template>

<style scoped>

</style>