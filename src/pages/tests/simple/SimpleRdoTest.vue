<script lang="ts">
import { defineComponent } from 'vue';
import CommonButton from "../../../components/UI/CommonButton.vue";
import { usePopupStore } from '../../../store/popup.store.ts';
import { TestResolver } from '../../../api/resolvers/test/test.resolver.ts';
import { UserState } from '../../../utils/userState/UserState.ts';
import router from '../../../router/router.ts';
import { jwtDecode } from 'jwt-decode';
import type { AccelerationMode, TestJwt } from '../types';
import type { CreateRdoInputDto } from '../../../api/resolvers/test/dto/input/create-rdo-input.dto.ts';
import { TestSetupsResolver } from '../../../api/resolvers/testSetup/test-setups.resolver.ts';

type TestState = 'ready' | 'reacting' | 'completed';

export default defineComponent({
  name: "SimpleRdoTest",
  components: { CommonButton },
  emits: ['test completed'],
  props: {
    token: String,
    presetId: Number,
    isModule: Boolean,
    startAcceleration: Number,
    timeAsModule: Number
  },
  data() {
    return {
      radius: 100,
      centerX: 150,
      centerY: 150,
      speed: 0.001,
      angle: 0,
      animationFrameId: 0,
      loopStartTime: null as number | null,
      loopCount: 0,
      acceleration: 0.001,

      currentDeviation: 0,
      deviationHistory: [] as Array<number>,
      testState: 'ready' as TestState,
      remainingSeconds: 0,
      time: 10,

      completedTestsLinks: [] as Array<string>,
      completedTestsResults: [] as Array<string>,

      accelerationMode: 'DISCRETE' as AccelerationMode,
      timerIntervalId: 0,
      showTimer: true,
      showProgressBar: true,
      showTotalResults: true,
      loopChecked: false,
      checkLooped: false
    };
  },
  computed: {
    circleX() { return this.centerX + this.radius * Math.sin(this.angle); },
    circleY() { return this.centerY + this.radius * Math.cos(this.angle); },
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
      const minutes = Math.floor(this.remainingSeconds / 60);
      const seconds = Math.floor(this.remainingSeconds % 60);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    },
    progressBarWidth() {
      if (this.remainingSeconds === 0) return '0%';
      return `${this.remainingSeconds / this.time * 100}%`;
    },
    averageCallbackTime(): number {
      if (this.deviationHistory.length == 0) return 0;
      return this.deviationHistory.reduce((a, b) => a + b) / this.deviationHistory.length
    },
    testResultsDto(): CreateRdoInputDto {
      return {
        userId: UserState.id ? UserState.id : null,
        allSignals: this.loopCount - 1,
        dispersion: this.standardDeviation,
        mistakes: this.loopCount - 1 - this.deviationHistory.length,
        averageCallbackTime: this.averageCallbackTime,
        testType: 'SIMPLE_RDO'
      }
    }
  },
  methods: {
    handleClick() {
      if (this.testState === 'ready') {
        this.testState = 'reacting';
        this.animationFrameId = requestAnimationFrame(this.animate)
        this.remainingSeconds = this.time
        this.startTimer()
      } else if (this.testState === 'reacting') {
        if (!this.checkLooped) {
          if (this.circleX < 150) this.deviationHistory.push(-this.circleY * this.speed * 10)
          else this.deviationHistory.push(this.circleY * this.speed * 10)
          this.checkLooped = true;
        }
      } else {
        router.go(0)
      }
    },
    startTimer() {
      this.timerIntervalId = setInterval(() => {
        if (this.remainingSeconds == 0) this.stopTest()
        this.remainingSeconds--
      }, 1000)
    },
    stopTest(){
      this.testState = 'completed'
      if (this.isModule) {
        this.$emit("test completed", this.testResultsDto)
      } else {
        this.saveResults()
      }
    },
    animate() {
      if (this.testState == 'completed') cancelAnimationFrame(this.animationFrameId)
      else {
        this.angle -= (0.025 + this.acceleration)
        if (50 <= this.circleY && this.circleY <= 51 && this.loopChecked) {
          this.loopChecked = false
        }
        if (249 <= this.circleY && this.circleY <= 250 && !this.loopChecked) {
          this.loopChecked = true
          this.checkLooped = false
          this.loopCount++
        }
        if (this.animationFrameId > 0) {}
        requestAnimationFrame(this.animate)
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
            if (data.testType == 'SIMPLE_RDO') {
              router.back()
            }
          });
        }
      }
      if (this.presetId != null) {
        await this.loadSettings()
      }
    },
    async loadSettings() {
      const testSetupResolver = new TestSetupsResolver()
      const settings = await testSetupResolver.getById(this.presetId!)
      if (settings) {
        this.time = settings.duration
        if (!this.isModule) {
          this.showProgressBar = settings.showProgress
          this.showTimer = settings.showTimer
          this.accelerationMode = settings.accelerationMode
        }
        this.showTotalResults = settings.showTotalResults
      }
    }
  },
  mounted() {
    if (!this.isModule) this.load()
    else {
      if (this.timeAsModule) this.time = this.timeAsModule
      this.showProgressBar = false
      this.showTimer = false
    }
    if (this.startAcceleration) this.acceleration = this.startAcceleration
  },
  watch: {
    loopCount(): void {
      if (this.loopCount % (this.acceleration * 1000  + 1) == 0) {
        if (this.accelerationMode == 'DISCRETE') {
          this.acceleration += 0.005
        } else {
          this.acceleration **= 1.01
        }
      }
    }
  }
});

</script>

<template>
  <div class="container">
    <div class="instruction" v-show="testState === 'ready'">
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
        @click="handleClick"
      >
        <template v-slot:placeholder>{{ buttonText }}</template>
      </CommonButton>
    </div>
    <div class="test-container" v-show="testState === 'reacting'">
      <div v-if="showTimer" class="timer">
        Осталось времени: {{ remainingTime }}
      </div>
      <div v-if="showProgressBar" class="progress-bar-container">
        <div class="progress-bar" :style="{ width: progressBarWidth }"></div>
      </div>
      <div class="circle" ref="reactionCircle">
        <svg class="circles" width="300" height="300">
          <circle cx="150" cy="150" r="100" stroke="black" stroke-width="2" fill="none" />
          <circle cx="150" cy="50" r="10" fill="rgb(0,128,0)"/>
          <circle :cx="circleX" :cy="circleY" r="10" fill="rgb(128, 0, 128)" />
        </svg>
      </div>
      <div class="button-wrapper">
        <CommonButton
            class="reaction-button"
            :class="{ active: testState == 'reacting' }"
            :disabled="testState == 'completed'"
            @click="handleClick"
        >
          <template v-slot:placeholder> {{ buttonText }}</template>
        </CommonButton>
        <div class="current-deviation">
          Текущее отклонение:
          {{ currentDeviation !== null ? currentDeviation.toFixed(2) : '0' }} мс
        </div>
        <div class="standard-deviation">
          Стандартное отклонение:
          {{ standardDeviation !== null ? standardDeviation.toFixed(2) : '0' }}с
        </div>
      </div>
    </div>
    <div class="results" v-show="testState === 'completed'">
      <h2 class="title">Результаты</h2>
      <div>
        <p>Поздравляем с прохождением теста!</p>
        <div v-if="showTotalResults">
          <p>Ваши результаты:</p>
          <ul>
            <li :key="index" v-for="(deviation, index) in deviationHistory">
              Реакция №{{index + 1}}: {{deviation.toFixed(2)}}
            </li>
          </ul>
        </div>
      </div>
      <CommonButton
        class="reaction-button"
        :class="{ active: testState == 'reacting' }"
        :disabled="testState == 'completed'"
        @click="handleClick"
      >
        <template v-slot:placeholder>{{ buttonText }}</template>
      </CommonButton>
    </div>
  </div>

</template>


<style scoped>
.title {
  font-size: 36px;
  margin-bottom: 20px;
  color: #fff;
}
.results, .description {
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 15px;
  margin: 20px 0;
  color: black;

  ul {
    list-style: none;
  }
}
.container {
  max-width: 35vw;
  padding: 2rem;
  text-align: center;

  .instruction {
    display: flex;
    flex-direction: column;
    align-items: center;

    button {
      width: 100%;
    }
  }
}

.circle {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px;
  border-radius: 15px;

  .circles {
    display: flex;
  }
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