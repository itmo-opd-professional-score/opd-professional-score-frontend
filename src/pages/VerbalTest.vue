<script lang="ts">
import { defineComponent } from 'vue';
import CommonButton from "../components/UI/CommonButton.vue";

type TestState = 'ready' | 'reacting' | 'completed';
type DifficultyLevel = 0 | 1 | 2;

export default defineComponent({
  name: "VerbalTest",
  components: { CommonButton },

  data() {
    return {
      testState: 'ready' as TestState,
      allSimpleWords: ['дом', 'кот', 'мяч', 'свет', 'стол', 'окно', 'книга', 'хлеб', 'вода', 'лес'],
      allAverageWords: ['параллелепипед', 'эксперимент', 'технология', 'интеллект', 'компетенция',
        'идентификация', 'гипотеза', 'соответствие', 'перспектива', 'катастрофа'],
      allHardWords: ['перпендикуляр', 'электроэнцефалограф', 'электрокардиограф',
        'дезоксирибонуклеиновая', 'рибонуклеиновая', 'метеорологический',
        'гидрометеорологический', 'интервенция', 'инверсия', 'контрреволюционер'],
      currentLevel: 0 as DifficultyLevel,
      timerIntervalId: null as number | null,
      remainingTimeValue: 0,
      score: 0,
      currentWords: [] as string[],
      shownWords: new Set<string>(),
      currentWord: '',
      mistakes: 0,
      correctInRow: 0,
      wordsPerLevel: 0,
      penaltyOnWrong: 2,
      requiredCorrect: 5,
    }
  },

  props: {
    time: { type: Number, required: true },
    showTimer: { type: Boolean, default: false },
    showProgressBar: { type: Boolean, default: false },
  },

  computed: {
    remainingTime() {
      if (this.testState === 'completed') return null;
      const minutes = Math.floor(this.remainingTimeValue / 60000);
      const seconds = Math.floor((this.remainingTimeValue % 60000) / 1000);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    },

    difficultyProbability(): number {
      const probabilities = [0.7, 0.4, 0.2];
      return probabilities[this.currentLevel];
    },
    progressBarWidth() {
      if (this.remainingTimeValue === 0) return '0%';
      return `${(1 - this.remainingTimeValue / (this.time * 1000)) * 100}%`;
    },
  },

  created() {
    this.wordsPerLevel = Math.ceil((this.time / 60) * 20 / 3);
  },

  methods: {
    startTest() {
      this.resetTest();
      this.testState = 'reacting';
      this.generateWordsForLevel(0);
      this.startTimer(this.time);
      this.nextWord();
    },

    generateWordsForLevel(level: DifficultyLevel) {
      const wordList = this.getWordList(level);

      for (let i = 0; i < this.wordsPerLevel; i++) {
        const isRepeated = Math.random() < this.difficultyProbability;
        const word = isRepeated && this.currentWords.length > 0
            ? this.currentWords[Math.floor(Math.random() * this.currentWords.length)]
            : this.getRandomFromList(wordList);

        this.currentWords.push(word);
      }
    },

    getWordList(level: DifficultyLevel): string[] {
      switch(level) {
        case 0: return this.allSimpleWords;
        case 1: return this.allAverageWords;
        case 2: return this.allHardWords;
        default: return [];
      }
    },

    getRandomFromList(list: string[]): string {
      return list[Math.floor(Math.random() * list.length)];
    },

    nextWord() {
      if (this.currentWords.length === 0) {
        if (this.currentLevel < 2) {
          this.currentLevel = (this.currentLevel + 1) as DifficultyLevel;
          this.generateWordsBatch(this.currentLevel);
        } else {
          this.currentWord = '';
          return;
        }
      } else if (this.currentWords.length < 5) {
        this.generateWordsBatch(this.currentLevel);
      }

      this.currentWord = this.currentWords.shift() || '';
    },

    generateWordsBatch(level: DifficultyLevel, batchSize = 10) {
      const wordList = this.getWordList(level);

      for (let i = 0; i < batchSize; i++) {
        const isRepeated = Math.random() < this.difficultyProbability;
        const word = isRepeated && this.currentWords.length > 0
            ? this.currentWords[Math.floor(Math.random() * this.currentWords.length)]
            : this.getRandomFromList(wordList);

        this.currentWords.push(word);
      }
    },

    checkResponse(response: boolean) {
      const isRepeated = this.shownWords.has(this.currentWord);


      const isCorrect = (isRepeated && response === true) || (!isRepeated && response === false);

      if (isCorrect) {
        this.score++;
        this.correctInRow++;
        if (this.correctInRow >= this.requiredCorrect && this.currentLevel < 2) {
          this.currentLevel = (this.currentLevel + 1) as DifficultyLevel;
          this.correctInRow = 0;
          this.generateWordsForLevel(this.currentLevel);
        }
      } else {
        this.mistakes++;
        this.correctInRow = Math.max(0, this.correctInRow - this.penaltyOnWrong);
      }

      // Добавляем слово в shownWords после проверки ответа
      this.shownWords.add(this.currentWord);

      this.nextWord();
    },

    startTimer(totalSeconds: number) {
      this.remainingTimeValue = totalSeconds * 1000;
      this.timerIntervalId = setInterval(() => {
        this.remainingTimeValue -= 1000;
        if (this.remainingTimeValue <= 0) {
          this.finishTest();
        }
      }, 1000);
    },

    finishTest() {
      if (this.timerIntervalId) {
        clearInterval(this.timerIntervalId);
        this.timerIntervalId = null;
      }
      this.testState = 'completed';
      this.remainingTimeValue = 0;
    },

    resetTest() {
      this.finishTest();
      this.testState = 'ready';
      this.currentLevel = 0;
      this.currentWords = [];
      this.shownWords.clear();
      this.score = 0;
      this.mistakes = 0;
      this.correctInRow = 0;
      this.currentWord = '';
    },
  }
});
</script>




<template>
  <div class="container">
    <!-- Описание теста -->
    <div v-if="testState === 'ready'" class="description-container">
      <h1 class="title">Тест на вербальное мышление</h1>
      <div class="description">
        Проверьте свою способность запоминать слова. Нажмите "Было", если слово уже встречалось, или "Не было", если это новое слово.
      </div>
      <CommonButton class="start-button" @click="startTest">
        <template v-slot:placeholder>Начать тест</template>
      </CommonButton>
    </div>

    <!-- Контейнер теста -->
    <div v-else-if="testState === 'reacting'" class="test-container">
      <!-- Таймер -->
      <div v-if="showTimer" class="timer">Осталось времени: {{ remainingTime }}</div>

      <!-- Прогресс-бар -->
      <div v-if="showProgressBar" class="progress-bar-container">
        <div class="progress-bar" :style="{ width: progressBarWidth }"></div>
      </div>

      <!-- Текущее слово -->
      <h2 class="current-word">{{ currentWord }}</h2>

      <!-- Кнопки "Было" и "Не было" -->
      <div class="button-container">
        <CommonButton class="reaction-button" @click="checkResponse(true)">
          <template v-slot:placeholder>Было</template>
        </CommonButton>
        <CommonButton class="reaction-button" @click="checkResponse(false)">
          <template v-slot:placeholder>Не было</template>
        </CommonButton>
      </div>

      <!-- Статистика -->
      <div class="stats">
        <p>Очки: {{ score }}</p>
        <p>Ошибки: {{ mistakes }}</p>
      </div>
    </div>

    <!-- Результаты -->
    <div v-else-if="testState === 'completed'" class="test-container">
      <h2 class="title">Тест завершен!</h2>
      <p class="result">Правильных ответов: {{ score }}</p>
      <p class="result">Ошибок: {{ mistakes }}</p>
      <CommonButton class="restart-button" @click="resetTest">
        <template v-slot:placeholder>Начать заново</template>
      </CommonButton>
    </div>
  </div>
</template>

<style scoped>
/* Основной контейнер */
.container {
  max-width: 35vw;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

/* Заголовок */
.title {
  font-size: 36px;
  margin-bottom: 20px;
  color: #fff;
  font-weight: bold;
}

/* Описание теста */
.description-container {
  background: #c1b9f6;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-radius: 15px;
  min-height: 50vh;
}

.description {
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 15px;
  margin: 20px 0;
  color: black;
  font-size: 18px;
  line-height: 1.5;
}

/* Контейнер теста */
.test-container {
  background: #c1b9f6;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px;
  border-radius: 15px;
  min-height: 50vh;
}

/* Таймер */
.timer {
  font-size: 24px;
  color: #fff;
  margin-bottom: 20px;
}

/* Прогресс-бар */
.progress-bar-container {
  width: 80%;
  height: 10px;
  background-color: #ddd;
  border-radius: 5px;
  margin: 10px auto;
}

.progress-bar {
  height: 100%;
  background-color: #4CAF50;
  border-radius: 5px;
  transition: width 0.5s ease;
}

/* Текущее слово */
.current-word {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-top: 20px; /* Расстояние между прогресс-баром и словом */
  margin-bottom: 20px;
}

/* Контейнер для кнопок */
.button-container {
  display: flex;
  justify-content: center;
  gap: 20px; /* Расстояние между кнопками */
  margin-top: 20px;
}

/* Кнопки "Было" и "Не было" */
.reaction-button {
  display: inline-flex; /* Flexbox для центрирования текста */
  align-items: center;
  justify-content: center;
  width: 120px; /* Фиксированная ширина */
  height: 60px; /* Фиксированная высота */
  background: rgba(128, 0, 128, 0.6);
  border: none;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  box-shadow: 0 10px 20px rgba(128, 0, 128, 0.2);
  outline: none;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  border-radius: 10px;
}

.reaction-button:hover {
  transform: scale(1.1); /* Увеличение при наведении */
}

/* Кнопка "Начать тест" */
.start-button,
.restart-button {
  display: flex;
  width: 25vh;
  height: 10vh;
  background: rgba(128, 0, 128, 0.6);
  border: none;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  box-shadow: 0 10px 20px rgba(128, 0, 128, 0.2);
  outline: none;
  margin: 3vh auto;
}

.start-button:hover,
.restart-button:hover {
  background: #45a049;
}

/* Результаты */
.result {
  font-size: 20px;
  color: #333;
  margin: 10px 0;
}

/* Статистика */
.stats {
  margin-top: 10px;
  font-size: 18px;
  color: #333;
}
</style>
