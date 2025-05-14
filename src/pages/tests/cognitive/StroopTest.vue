<script lang="ts">
import { defineComponent } from 'vue';
import CommonButton from '../../../components/UI/CommonButton.vue';
import { TestResolver } from '../../../api/resolvers/test/test.resolver.ts';
import { usePopupStore } from '../../../store/popup.store.ts';
import { UserState } from '../../../utils/userState/UserState.ts';
import router from '../../../router/router.ts';
import type { CreateCognitiveInputDto } from '../../../api/resolvers/test/dto/input/create-cognitive-input.dto.ts';
import { useTest } from '../../../utils/useTest.ts';

type TestState = 'ready' | 'reacting' | 'completed';

export default defineComponent({
  name: 'StroopTest',
  components: { CommonButton },
  setup(props) {
    const { settings, updateTestBlockToken } = useTest({
      testBlockId: props.testBlockId,
      setupId: props.setupId,
      testType: "STROOP"
    })

    return {
      settings,
      updateTestBlockToken,
    }
  },
  data() {
    return {
      colors: ['red', 'green', 'yellow', 'blue', 'purple'],
      currentWord: '',
      currentWordTranslation: undefined,
      currentColor: '',
      levelOfDifficulty: 0,
      score: 0,
      mistakes: 0,
      remainingTimeValue: 0,
      timerIntervalId: null as ReturnType<typeof setInterval> | null,
      roundTimeoutId: null as ReturnType<typeof setTimeout> | null,
      testState: 'ready' as TestState,
      result: 0,
    };
  },
  props: {
    testBlockId: String,
    setupId: String
  },
  computed: {
    testResults(): CreateCognitiveInputDto {
      return {
        userId: UserState.id,
        allSignals: this.score + this.mistakes,
        mistakes: this.mistakes,
        score: this.score,
        testType: 'STROOP'
      }
    }
  },
  methods: {
    giveColorName() {
      this.currentWord =
        this.colors[Math.floor(Math.random() * this.colors.length)];
    },
    giveColorOfWord() {
      if (this.currentWord) {
        if (Math.random() < this.giveProbabilityOfWordAndColorMatch()) {
          this.currentColor = this.currentWord;
        } else {
          let color;
          do {
            color = this.colors[Math.floor(Math.random() * this.colors.length)];
          } while (color === this.currentWord);
          this.currentColor = color;
        }
      }
    },
    giveProbabilityOfWordAndColorMatch() {
      return [0.7, 0.4, 0.1][this.levelOfDifficulty];
    },
    checkAnswer(selectedColor: string) {
      this.clearRoundTimeout();
      if (this.currentColor === selectedColor) {
        this.score++;
      } else {
        this.mistakes++;
      }
      this.nextRound();
    },
    nextRound() {
      const timePassed = (this.settings.duration * 1000 - this.remainingTimeValue) / 1000;
      const thirdTime = this.settings.duration / 3;
      if (timePassed >= thirdTime * 2 && this.levelOfDifficulty < 2) {
        this.levelOfDifficulty = 2;
      } else if (timePassed >= thirdTime && this.levelOfDifficulty < 1) {
        this.levelOfDifficulty = 1;
      }

      this.clearRoundTimeout();
      this.giveColorName();
      this.giveColorOfWord();
      this.roundTimeoutId = setTimeout(() => {
        this.mistakes++;
        this.nextRound();
      }, 3000);
    },
    startTest() {
      this.remainingTimeValue = this.settings.duration * 1000;
      this.testState = 'reacting';
      this.nextRound();
      this.startTimer(this.settings.duration);
    },
    startTimer(totalSeconds: number) {
      this.remainingTimeValue = totalSeconds * 1000;
      this.timerIntervalId = setInterval(() => {
        this.remainingTimeValue -= 1000;
        if (this.remainingTimeValue <= 0) {
          this.remainingTimeValue = 0;
          clearInterval(this.timerIntervalId!);
          this.stopTest();
        }
      }, 1000);
    },
    stopTest() {
      this.testState = 'completed';
      this.clearRoundTimeout();
      if(this.score == 0) {
        this.result=0
      }
      else {
        this.result = Math.round((this.score / (this.score + this.mistakes)) * 100);
      }
      this.saveResults()
    },
    async saveResults() {
      const popUpStore = usePopupStore()
      new TestResolver().createCognitive(this.testResults).catch((err) => {
        popUpStore.activateErrorPopup(err.message)
      })
      if (this.testBlockId) await this.updateTestBlockToken()
    },
    async resetTest() {
      if (this.testBlockId) await router.push(`/testBlock/${this.testBlockId}`);
      else router.go(0)
    },
    clearRoundTimeout() {
      if (this.roundTimeoutId) {
        clearTimeout(this.roundTimeoutId);
        this.roundTimeoutId = null;
      }
    },
    remainingTime() {
      const minutes = Math.floor(this.remainingTimeValue / 60000);
      const seconds = Math.floor((this.remainingTimeValue % 60000) / 1000);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    },
    progressBarWidth() {
      if (this.remainingTimeValue === 0) return '0%';
      return `${(1 - this.remainingTimeValue / (this.settings.duration * 1000)) * 100}%`;
    },
    clickButton() {
      if (this.testState === 'ready') {
        this.startTest();
      }
    },
  },
});
</script>

<template>
  <div class="container">
    <div class="instruction" v-if="testState == 'ready'">
      <h2 class="title">Тест Струпа</h2>
      <p class="description">
        В этом тесте вам нужно выбрать цвет слова, а не прочитать его. Например,
        если слово "зелёный" написано красным цветом, правильный ответ —
        "красный". Нажимайте на кнопку соответствующего цвета как можно быстрее.
        Внимание! На каждый ответ дается до 3 секунд!
      </p>
      <CommonButton
        class="reaction-button"
        @click="clickButton"
      >
        <template v-slot:placeholder>Начать тест</template>
      </CommonButton>
    </div>
    <div class="test-container" v-if="testState == 'reacting'">
      <div class="info-block" v-if="testState == 'reacting'">
        <div v-if="settings.showTimer" class="timer">
          Осталось времени: {{ remainingTime() }}
        </div>

        <div v-if="settings.showProgress" class="progress-bar-container">
          <div
            class="progress-bar"
            :style="{ width: progressBarWidth() }"
          ></div>
        </div>
      </div>
      <div class="current-word">
        <h1 :style="{ color: currentColor }">{{ currentWordTranslation ? currentWordTranslation : currentWord }}</h1>
      </div>
      <div class="buttons">
        <CommonButton
          v-for="color in colors"
          :key="color"
          :style="{
            backgroundColor: color,
            color: color === 'yellow' ? 'black' : 'white',
          }"
          class="color-button"
          @click="checkAnswer(color)"
        >
          <template #placeholder>
            {{ color }}
          </template>
        </CommonButton>
      </div>
    </div>
    <div v-if="testState == 'completed'" class="test-container">
      <h2 class="title">Тест завершен!</h2>
      <div class="full" v-if="settings.showTotalResults">
        <p class="result">Правильных ответов: {{ score }}</p>
        <p class="result">Ошибок: {{ mistakes }}</p>
        <p class="result">Результат: {{ result }}%</p>
      </div>
      <CommonButton
        class="reaction-button"
        @click="resetTest"
      >
        <template v-slot:placeholder>
          {{ testBlockId ? 'Назад к блоку' : 'Начать заново'}}
        </template>
      </CommonButton>
    </div>
  </div>


</template>

<style scoped>
.description {
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 15px;
  margin: 20px 0;
  color: black;
}

.title {
  font-size: 36px;
  margin-bottom: 20px;
  color: #fff;
}



.info-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}


.current-word {
  margin-bottom: 10vh;
  margin-top: 5vh;
}

.timer {
  font-size: 24px;
  color: #fff;
  margin-bottom: 1vh;
  font-weight: bold;
}

.progress-bar-container {
  width: 50vw;
  height: 10px;
  background-color: #ddd;
  border-radius: 5px;
  margin: 3vh auto;
}

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

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  max-width: 55vw;
  padding: 2rem;
  text-align: center;
}

.buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.progress-bar {
  height: 100%;
  background-color: #4caf50;
  border-radius: 5px;
  transition: width 0.5s ease;
}

.color-button {
  width: 10vh;
}

.reaction-button {
  display: flex;
  width: 15vh;
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
.result {
  font-size: 20px;
  color: #333;
  margin: 10px 0;
}
</style>