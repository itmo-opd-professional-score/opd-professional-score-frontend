<script lang="ts">
import {defineComponent} from 'vue'
import CommonButton from '../components/UI/CommonButton.vue';

interface TestSettings {
  testName: string
  duration: number
  showTimer: boolean
  showMinuteResults: boolean
  showTotalResults: boolean
  showProgress: boolean
  accelerationAmount: number
  accelerationInterval: number
  accelerationFrequency: number
}

export default defineComponent({
  name: "SelectSettingsPage",
  components: {CommonButton},
  data() {
    return {
      selectedInterval: 1200,
      showTimer: true,
      showMinuteResults: true,
      showTotalResults: true,
      showProgress: true,
      accelerationAmount: 40,
      accelerationInterval: 60,
      accelerationFrequency: 10,
      defaultSettings: {
        selectedInterval: 1200,
        showTimer: true,
        showMinuteResults: true,
        showTotalResults: true,
        showProgress: true,
        accelerationAmount: 40,
        accelerationInterval: 60,
        accelerationFrequency: 10,
      }
    }
  },
  computed: {
   testName() {
        return this.$route.params.testName || "No test name";
      },
    formattedInterval() {
      const minutes = Math.floor(this.selectedInterval / 60);
      const seconds = this.selectedInterval % 60;
      return `${minutes} мин ${seconds ? seconds : '00'} сек`;
    }
  }, methods: {
    saveSettings() {
      const settings: TestSettings = {
        testName: this.testName,
        duration: this.selectedInterval,
        showTimer: this.showTimer,
        showMinuteResults: this.showMinuteResults,
        showTotalResults: this.showTotalResults,
        showProgress: this.showProgress,
        accelerationAmount: this.accelerationAmount,
        accelerationInterval: this.accelerationInterval,
        accelerationFrequency: this.accelerationFrequency
      }
      this.$emit('newSettings', settings)
    },
    resetToDefault() {
      this.selectedInterval = this.defaultSettings.selectedInterval;
      this.showTimer = this.defaultSettings.showTimer;
      this.showMinuteResults = this.defaultSettings.showMinuteResults;
      this.showTotalResults = this.defaultSettings.showTotalResults;
      this.showProgress = this.defaultSettings.showProgress;
      this.accelerationAmount = this.defaultSettings.accelerationAmount;
      this.accelerationInterval = this.defaultSettings.accelerationInterval;
      this.accelerationFrequency = this.defaultSettings.accelerationFrequency;
      this.saveSettings();
    }
  },
  emits: ['newSettings'],
})
</script>

<template>
  <div id="choose-settings">
    <div class="choose-settings-form">
      <div class="section header-section">
        <h2>Выберите настройки теста: <br>{{ testName }}</h2>
        <CommonButton class="close-btn" @click="resetToDefault">
          <template v-slot:placeholder>×</template>
        </CommonButton>
      </div>
      <div class="settings-group">
        <div class="time-interval-selector">
          <label>Время прохождения теста: <strong>{{ formattedInterval }}</strong></label>
          <input
              type="range"
              min="120"
              max="2700"
              step="30"
              v-model="selectedInterval"
              class="custom-slider"
          >
          <div class="slider-labels">
            <span>2 мин</span>
            <span>45 мин</span>
          </div>
          <div class="setting-item">
            <label>
              <input type="checkbox" v-model="showTimer">
              Отображать оставшееся время
            </label>
          </div>

          <div class="setting-item">
            <label>
              <input type="checkbox" v-model="showMinuteResults">
              Показывать результаты за минуту
            </label>
            <label>
              <input type="checkbox" v-model="showTotalResults">
              Показывать общий результат
            </label>
          </div>

          <div class="setting-item">
            <label>
              <input type="checkbox" v-model="showProgress">
              Отображать прогресс выполнения
            </label>
          </div>
          <div class="acceleration-settings">
            <h3>Настройки ускорения:</h3>
            <div class="acceleration-input">
              <label>Величина ускорения(%):
                <input type="number" v-model.number="accelerationAmount" min="0" max="100">
              </label>
            </div>

            <div class="acceleration-input">
              <label>Интервал применения(от 1 до 1000):
                <input type="number" v-model.number="accelerationInterval" min="1" max="1000">
              </label>
            </div>
            <div class="acceleration-input">
              <label>Как часто(от 1 до 1000):
                <input type="number" v-model.number="accelerationFrequency" min="1" max="1000">
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="section">
        <CommonButton @click="saveSettings">
          <template v-slot:placeholder>Сохранить настройки</template>
        </CommonButton>
      </div>
    </div>
  </div>

</template>

<style scoped>
#choose-settings {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 2;
  transition: all 0.3s ease-out;
}

.choose-settings-form {
  width: 40%;
  margin: auto;
  background: rgba(255, 255, 255, 1);
  border-radius: 1.4rem;
  color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-clip-margin: 0.02rem;
  overflow: clip;
}

.choose-settings-form h2 {
  text-align: center;
  color: white;
  width: 100%;
  padding: 0 2rem;
}

#choose-settings button {
  margin: 0.3vh auto;
}

.section {
  width: 100%;
  background: rgb(16, 73, 231);
  padding: 0.5rem;
}

.time-interval-selector {
  width: 100%;
  padding: 1rem;
  color: black;
}

.time-interval-selector label {
  display: block;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.custom-slider {
  width: 100%;
  height: 0.4rem;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 0.1rem;
  color: rgba(0, 0, 0, 0.7);
}

.settings-group {
  padding: 1rem;
  width: 100%;
}

.setting-item {
  margin: 1rem 0;
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
}

.acceleration-settings {
  margin-top: 2rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.acceleration-input {
  margin: 0.5rem 0;
}

.acceleration-input input {
  margin-left: 0.5rem;
  padding: 0.3rem;
  min-width: 2.5vw;
}

.header-section {
  position: relative;
  padding: 0.5rem 2rem 0.5rem 0.5rem !important;
}

.close-btn {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: white;
  font-size: 2.5rem;
  cursor: pointer;
  transition: opacity 0.2s;
  padding: 0 0.5rem;
  line-height: 1;
}

.close-btn:hover {
  opacity: 0.8;
  border: none;
  background-color: transparent;
}
</style>