<script lang="ts">
import { defineComponent } from 'vue'

interface TestData {
  isButtonActive: boolean;
  isButtonDisabled: boolean;
  buttonText: string;
  reactionTime: number | null;
  showResults: boolean;
  isTestRunning: boolean;
  startTime: number | null;
}

export default defineComponent({
  data(): TestData {
    return {
      isButtonActive: false,
      isButtonDisabled: true,
      buttonText: 'Ждите...',
      reactionTime: null,
      showResults: false,
      isTestRunning: false,
      startTime: null
    }
  },
  methods: {
    changeButtonColor(): void {
      this.isButtonActive = true;
      this.isButtonDisabled = false;
      this.buttonText = 'Нажмите на кнопку';
      this.startTime = new Date().getTime();
    },
    handleClick(): void {
      if (this.isButtonActive) {
        const endTime = new Date().getTime();
        this.reactionTime = endTime - (this.startTime as number);
        this.showResults = true;
        this.isButtonActive = false;
        this.isButtonDisabled = true;
        this.buttonText = 'Ждите...';
        this.isTestRunning = false;
      }
    },
    resetTest(): void {
      this.showResults = false;
      this.isTestRunning = true;
      this.buttonText = 'Ждите...';
      this.isButtonActive = false;
      this.isButtonDisabled = true;
      setTimeout(this.changeButtonColor, Math.random() * 3000 + 1000);
    }
  },
  mounted(): void {
    this.resetTest();
  }
})

</script>

<template>
  <div class="container">
    <h2 class="title">Тест на скорость реакции</h2>
    <p class="description">
      Этот тест измеряет время вашей реакции на визуальный сигнал.
      Как только кнопка станет зелёной, нажмите на неё как можно быстрее.
      Старайтесь не нажимать кнопку до сигнала!
    </p>

    <div class="button-wrapper">
      <button
          class="reaction-button"
          :class="{ active: isButtonActive }"
          @click="handleClick"
          :disabled="isButtonDisabled"
      >
        {{ buttonText }}
      </button>
    </div>

    <div v-if="showResults" class="results">
      <h2 class="title">Результаты:</h2>
      <p>Ваша скорость реакции: <strong>{{ reactionTime }} мс</strong></p>
      <button class="retry-button" @click="resetTest">
        Пройти заново
      </button>
    </div>

    <button
        class="reset-button"
        @click="resetTest"
        v-if="isTestRunning"
    >
      Прервать тест
    </button>
  </div>
</template>


<style scoped>

.title {
  font-size: 46px;
  margin-bottom: 20px;
  color: #fff;
}

.container {
  max-width: 35vw;
  padding: 2rem;
  text-align: center;
}

.description {
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 15px;
  margin: 20px 0;
  color: black;
}

.button-wrapper {
  margin: 2rem 0;
  perspective: 1000px;
}

.reaction-button {
  width: 40vh;
  height: 40vh;
  border-radius: 50%;
  background: rgba(128, 0, 128, 0.6);
  border: none;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 10px 20px rgba(128, 0, 128, 0.2);
  outline: none;
  margin: auto;
}

.reaction-button.active {
  background-color: green;
}

.reaction-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.reset-button {
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 1rem;
  margin: 3rem auto auto;
}

.results {
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
}

.results h2 {
  margin-bottom: 1rem;
}

.results p {
  color: white;
}

.retry-button {
  margin: 1rem auto;
}
</style>
