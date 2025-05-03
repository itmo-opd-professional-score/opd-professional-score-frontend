<script lang="ts">
import { defineComponent } from 'vue';
import CommonButton from '../../../components/UI/CommonButton.vue';
import { TestResolver } from '../../../api/resolvers/test/test.resolver.ts';
import { usePopupStore } from '../../../store/popup.store.ts';
import { TestBlockResolver } from '../../../api/resolvers/testBlocks/test-block.resolver.ts';
import { UserState } from '../../../utils/userState/UserState.ts';
import type { TestSetupOutputDTO } from '../../../api/resolvers/testSetup/dto/output/test-setup-output.dto.ts';
import { TestSetupsResolver } from '../../../api/resolvers/testSetup/test-setups.resolver.ts';
import router from '../../../router/router.ts';
import type { CreateCognitiveInputDto } from '../../../api/resolvers/test/dto/input/create-cognitive-input.dto.ts';

type TestState = 'ready' | 'reacting' | 'completed';

export default defineComponent({
  name: 'StroopTest',
  components: { CommonButton },
  emits: ['test-completed'],
  data() {
    return {
      colors: ['red', 'green', 'yellow', 'blue', 'purple'],
      currentWord: '',
      currentColor: '',
      levelOfDifficulty: 0,
      score: 0,
      mistakes: 0,
      remainingTimeValue: 0,
      timerIntervalId: null as ReturnType<typeof setInterval> | null,
      roundTimeoutId: null as ReturnType<typeof setTimeout> | null,
      testState: 'ready' as TestState,
      result: 0,
      randomChangeOfDifficulty: false,

      duration: 10,
      showTimer: false,
      showTotalResults: false,
      showProgressBar: true
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
      if (this.randomChangeOfDifficulty) {
        return [0.7, 0.4, 0.1][Math.floor(Math.random() * 3)];
      }
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
      if (!this.randomChangeOfDifficulty) {
        const timePassed = (this.duration * 1000 - this.remainingTimeValue) / 1000;
        const thirdTime = this.duration / 3;
        if (timePassed >= thirdTime * 2 && this.levelOfDifficulty < 2) {
          this.levelOfDifficulty = 2;
        } else if (timePassed >= thirdTime && this.levelOfDifficulty < 1) {
          this.levelOfDifficulty = 1;
        }
      } else {

        this.levelOfDifficulty = Math.floor(Math.random() * 3);
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
      this.remainingTimeValue = this.duration * 1000;
      this.testState = 'reacting';
      this.nextRound();
      this.startTimer(this.duration);
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
    },
    async saveResults() {
      const popUpStore = usePopupStore()
      new TestResolver().createCognitive(this.testResults).catch((err) => {
        popUpStore.activateErrorPopup(err.message)
      })
      if (this.testBlockId && !isNaN(parseInt(this.testBlockId))) {
        let setupId = this.setupId ? parseInt(this.setupId) : undefined;
        if (setupId && isNaN(setupId)) setupId = undefined
        const result = await new TestBlockResolver().updateTestBlock({
          testBlockId: parseInt(this.testBlockId),
          updatedTest: {
            name: "STROOP",
            setupId: setupId,
            available: false
          }
        })
        this.$emit('test-completed', result.body)
      }
    },
    async resetTest() {
      if (this.testBlockId) await router.push(`/testBlock/${this.testBlockId}`);
      else router.go(0)
    },
    cancelTimer() {
      if (this.timerIntervalId) {
        clearInterval(this.timerIntervalId);
        this.timerIntervalId = null;
      }
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
      return `${(1 - this.remainingTimeValue / (this.duration * 1000)) * 100}%`;
    },
    clickButton() {
      if (this.testState === 'ready') {
        this.startTest();
      }
    },
    async load () {
      if (this.setupId && !isNaN(parseInt(this.setupId))) {
        const settings: TestSetupOutputDTO | null = await new TestSetupsResolver().getById(parseInt(this.setupId))
        if (settings) {
          this.duration = settings.duration
          this.showTotalResults = settings.showTotalResults
          this.showTimer = settings.showTimer
          this.showProgressBar = settings.showProgress
        }
      }
    },
  },
  mounted() { this.load() },
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
        <div v-if="showTimer" class="timer">
          Осталось времени: {{ remainingTime() }}
        </div>

        <div v-if="showProgressBar" class="progress-bar-container">
          <div
            class="progress-bar"
            :style="{ width: progressBarWidth() }"
          ></div>
        </div>
      </div>
      <div class="current-word">
        <h1 :style="{ color: currentColor }">{{ currentWord }}</h1>
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
      <div class="full" v-if="showTotalResults">
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
  max-width: 35vw;
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