<script lang="ts">
import { defineComponent } from 'vue';
import ReactionCircle from "../../../components/ReactionCircle.vue";
import CommonButton from "../../../components/UI/CommonButton.vue";
import { usePopupStore } from '../../../store/popup.store.ts';
import { TestResolver } from '../../../api/resolvers/test/test.resolver.ts';
import { UserState } from '../../../utils/userState/UserState.ts';
import router from '../../../router/router.ts';
import { jwtDecode } from 'jwt-decode';
import type { TestJwt } from '../types';
import type { CreateRdoInputDto } from '../../../api/resolvers/test/dto/input/create-rdo-input.dto.ts';

interface ReactionCircleInstance {
  startAnimation(): void;
  cancelAnimation(): void;
  clickButton(time: number): void;
  speed: number;
  deviation: number;
}

type TestState = 'ready' | 'reacting' | 'completed';

export default defineComponent({
  name: "SimpleReactionTest",
  components: { CommonButton, ReactionCircle },
  data() {
    return {
      radius: 100,
      centerX: 150,
      centerY: 150,
      speed: 0.001,
      angle: -Math.PI / 2,
      initialAngle: -Math.PI / 2,
      startTime: 0,
      deviation: null as number | null,
      deviationHistory: [] as number[],
      currentDeviation: null as number | null,
      animationFrameId: null as number | null,
      testState: 'ready' as TestState,
      timerIntervalId: null as number | null,
      remainingTimeValue: 0,
      accelerationCount: 0,
      accelerationIntervalId: null as number | null,
      completedTestsLinks: [] as Array<string>,
      completedTestsResults: [] as Array<string>,
    };
  },
  props: {
    token: String,
    time: { type: Number, required: true },
    showTimer: { type: Boolean, default: false },
    showFinalResults: { type: Boolean, default: false },
    showPerMinuteResults: { type: Boolean, default: false },
    showProgressBar: { type: Boolean, default: false },
    accelerationAmount: { type: Number, default: 0.1 },
    accelerationInterval: { type: Number, default: 60000 },
    accelerationFrequency: { type: Number, default: 10 }
  },
  computed: {
    circleX() { return this.centerX + this.radius * Math.cos(this.angle); },
    circleY() { return this.centerY + this.radius * Math.sin(this.angle); },
    standardDeviation(): number {
      const n = this.deviationHistory.length;
      if (n < 2) return 0;
      const mean = this.deviationHistory.reduce((a, b) => a + b) / n;
      const variance = this.deviationHistory.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1);
      return Math.sqrt(variance);
    },
    buttonText() {
      switch (this.testState) {
        case 'ready': return 'Начать тест';
        case 'reacting': return 'Жмите';
        case 'completed': return 'Тест окончен';
        default: return '';
      }
    },
    remainingTime() {
      if (this.testState === 'completed') return null;
      const minutes = Math.floor(this.remainingTimeValue / 60000);
      const seconds = Math.floor((this.remainingTimeValue % 60000) / 1000);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    },
    progressBarWidth() {
      if (this.remainingTimeValue === 0) return '0%';
      return `${(1 - this.remainingTimeValue / (this.time * 1000)) * 100}%`;
    },
    testResultsDto(): CreateRdoInputDto {
      return {
        userId: UserState.id ? UserState.id : null,
        allSignals: this.deviationHistory.length,
        dispersion: this.standardDeviation,
        mistakes: this.deviationHistory.filter(deviation => Math.abs(deviation) > 140).length,
        averageCallbackTime: this.deviationHistory.reduce((a, b) => a + b) / this.deviationHistory.length,
        testType: 'SIMPLE_RDO'
      }
    }
  },
  methods: {
    animate(time: number) {
      if (this.testState !== 'reacting') {
        cancelAnimationFrame(this.animationFrameId!);
        return;
      }
      const elapsed = time - this.startTime;
      this.angle = (this.initialAngle + elapsed * this.speed) % (Math.PI * 2);
      if (elapsed >= this.time * 1000) {
        this.testState = 'completed';
        cancelAnimationFrame(this.animationFrameId!);
        this.stopTest();
      } else {
        this.animationFrameId = requestAnimationFrame(this.animate);
      }
    },
    setupAcceleration() {
      if (!this.accelerationAmount || !this.accelerationInterval) return;
      this.accelerationIntervalId = setInterval(() => {
        if (this.accelerationCount >= this.accelerationFrequency) {
          clearInterval(this.accelerationIntervalId!);
          return;
        }
        const reactionCircle = this.$refs.reactionCircle as ReactionCircleInstance;
        reactionCircle.speed *= 1 + this.accelerationAmount;
        this.accelerationCount++;
      }, this.accelerationInterval);
    },
    startTest() {
      this.accelerationCount = 0;
      this.setupAcceleration();
      this.testState = 'reacting';
      this.startTime = performance.now();
      this.initialAngle = -Math.PI / 2;
      this.angle = this.initialAngle;
      this.animationFrameId = requestAnimationFrame(this.animate);
      this.startTimer(this.time);
      const reactionCircle = this.$refs.reactionCircle as ReactionCircleInstance;
      reactionCircle.startAnimation();
    },
    stopTest() {
      const reactionCircle = this.$refs.reactionCircle as ReactionCircleInstance;
      reactionCircle.cancelAnimation();
      this.saveResults()
    },
    clickButton() {
      if (this.testState === 'ready') {
        this.startTest();
      } else if (this.testState === 'reacting') {
        const currentTime = performance.now();
        const reactionCircle = this.$refs.reactionCircle as ReactionCircleInstance;
        reactionCircle.clickButton(currentTime);
        this.currentDeviation = reactionCircle.deviation;
        this.deviationHistory.push(reactionCircle.deviation);
        reactionCircle.cancelAnimation();
        reactionCircle.startAnimation();
      }
    },
    startTimer(totalSeconds: number) {
      this.remainingTimeValue = totalSeconds * 1000;
      this.timerIntervalId = setInterval(() => {
        this.remainingTimeValue -= 1000;
        if (this.remainingTimeValue <= 0) {
          this.remainingTimeValue = 0;
          clearInterval(this.timerIntervalId!);
          this.testState = 'completed';
          this.stopTest();
        }
      }, 1000);
    },
    cancelTimer() {
      if (this.timerIntervalId) {
        clearInterval(this.timerIntervalId);
        this.timerIntervalId = null;
      }
    },
    saveResults(): void {
      const popUpStore = usePopupStore()
      const testResolver =
        new TestResolver()
      testResolver
        .createRdo(this.testResultsDto).then((result) => {
        if (!UserState.id) {
          this.completedTestsLinks.push(this.token!);
          this.completedTestsResults.push(result.body.testToken);
          localStorage.setItem(
            'completedTestsLinks',
            JSON.stringify(this.completedTestsLinks),
          );
          localStorage.setItem(
            'completedTestsResults',
            JSON.stringify(this.completedTestsResults),
          );
        }
        popUpStore.activateInfoPopup('Results were saved successfully!');
      }).catch((error) => {
        popUpStore.activateErrorPopup(
          `Error code: ${error.status}. ${error.response.data.message}`,
        );
      });
    },
    async load () {
      if (UserState.id) {
        await router.push('/test/simple/rdo');
      } else {
        const linksData = localStorage.getItem('completedTestsLinks');
        const resultsData = localStorage.getItem('completedTestsResults');
        if (linksData) {
          this.completedTestsLinks.push(...JSON.parse(linksData));
        }
        if (resultsData) {
          this.completedTestsResults.push(...JSON.parse(resultsData));
        }
        if (this.token && this.completedTestsLinks.length != 0) {
          this.completedTestsLinks.forEach((link) => {
            const data = jwtDecode(link) as TestJwt;
            if (data.testType != 'SIMPLE_RDO') {
              router.back()
            }
          });
        }
      }
    },
  },
  mounted() {
      this.load()
  },
});

</script>

<template>
  <div class="container">
  <div class="instruction" v-show="testState !== 'reacting'">
    <h2 class="title">Тест на скорость реакции на движущиеся объекты</h2>
    <p class="description">
      Этот тест измеряет время вашей реакции на движущийся объект.
      После начала теста фиолетовый круг начнет двигаться. Как только он будет находиться в начале своего пути (верхняя точка траектории) - как
      можно быстрее нажмите большую кнопку. Старайтесь не нажимать кнопку до или после этой зоны!
    </p>
    <CommonButton
      class="reaction-button"
      :class="{ active: testState == 'reacting' }"
      :disabled="testState == 'completed'"
      @click="clickButton"
    >
      <template v-slot:placeholder>Начать тест</template>
    </CommonButton>
  </div>
  <div class="test-container" v-show="testState === 'reacting'">
    <div v-if="showTimer" class="timer">
      Осталось времени: {{ remainingTime }}
    </div>
    <div v-if="showProgressBar" class="progress-bar-container">
      <div class="progress-bar" :style="{ width: progressBarWidth }"></div>
    </div>
    <ReactionCircle ref="reactionCircle" :time="time"></ReactionCircle>
    <div class="button-wrapper">
      <CommonButton
          class="reaction-button"
          :class="{ active: testState == 'reacting' }"
          :disabled="testState == 'completed'"
          @click="clickButton"
      >
        <template v-slot:placeholder> {{buttonText}}</template>
      </CommonButton>
      <div class="current-deviation">
        Текущее отклонение:
        {{
          currentDeviation !== null ? currentDeviation.toFixed(2) : '0'
        }} мс
      </div>
      <div class="standard-deviation">
        Стандартное отклонение:
        {{
          standardDeviation !== null ? standardDeviation.toFixed(2) : '0'
        }} мс
      </div>
    </div>
  </div>
  </div>

</template>


<style scoped>
.title {
  font-size: 36px;
  margin-bottom: 20px;
  color: #fff;
}
.description {
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 15px;
  margin: 20px 0;
  color: black;
}
.container {
  max-width: 35vw;
  padding: 2rem;
  text-align: center;
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
.timer {
  font-size: 24px;
  color: #fff;
  margin-bottom: 20px;
}
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
.standard-deviation, .current-deviation {
  margin-top: 10px;
  font-size: 18px;
  color: #333;
}
</style>