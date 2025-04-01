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
    <h2 class="title1">Простой тест на свет</h2>
    <p class="description">
      Этот тест измеряет время вашей реакции на визуальный сигнал.
      Как только кнопка станет красной, нажмите на неё как можно быстрее.
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
.title1 {
  font-size: 3rem;
  margin-top: 3rem;
  margin-bottom: 1.5rem;
  color: #fff;
}
.title {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #fff;
}
.retry-button{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  color: #000000;
  background-color: #ffffff;
  opacity: 0.8;
  padding: 1rem 2rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}
.retry-button:hover {
  background-color: #a598ff;
}

.retry-button:active {
  background-color: #7c6fb5;
}

.reset-button {
  font-size: 2.875rem;
  margin-bottom: 1.25rem;
  color: #000000;
  background-color: #ffffff;
  opacity: 0.8;
  padding: 1rem 2rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.reset-button:hover {
  background-color: #a598ff;
}

.reset-button:active {
  background-color: #7c6fb5;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding-bottom: 2rem;
}

.description {
  background: rgba(255, 255, 255, 0.9);
  opacity: 0.85;
  padding: 0.7rem;
  border-radius: 1rem;
  margin: 0.8rem 0;
  color: black;
  max-width: 60rem;
  min-height: 3rem;
  text-align: center;
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
  background-color: #cf1a1a;
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
  margin-top: 1rem;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  text-align: center;
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
