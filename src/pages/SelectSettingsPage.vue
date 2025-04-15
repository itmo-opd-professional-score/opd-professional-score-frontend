<script lang="ts">
import {defineComponent} from 'vue';
import CommonButton from '../components/UI/CommonButton.vue';
import type {TestSettingsDto} from '../api/dto/test-settings.dto.ts';
import CustomInput from '../components/UI/inputs/CustomInput.vue';


export default defineComponent({
  name: 'SelectSettingsPage',
  components: {CustomInput, CommonButton},
  props: {
    testName: {
      type: String,
      default: 'No test name',
    },
  },
  data() {
    return {
      duration: 1200,
      showTimer: false,
      showMinuteResults: false,
      showTotalResults: false,
      showProgress: false,
      accelerationAmount: 40,
      accelerationInterval: 60,
      accelerationFrequency: 10,
    };
  },
  computed: {
    formattedInterval() {
      const minutes = Math.floor(this.duration / 60);
      const seconds = (this.duration % 60)
          .toString()
          .padStart(2, '0');
      return `${minutes} мин ${seconds} сек`;
    },
  },
  methods: {
    saveSettings() {
      const settings: TestSettingsDto = {
        testName: this.testName,
        duration: this.duration,
        showTimer: this.showTimer,
        showMinuteResults: this.showMinuteResults,
        showTotalResults: this.showTotalResults,
        showProgress: this.showProgress,
        accelerationAmount: this.accelerationAmount,
        accelerationInterval: this.accelerationInterval,
        accelerationFrequency: this.accelerationFrequency
      };
      this.$emit('newSettings', settings);
    }
  },
  emits: ['newSettings'],
});
</script>

<template>
  <div id="choose-settings">
    <div class="choose-settings-form">
      <div class="section header-section">
        <h2>Выберите настройки теста: <br/>{{ testName }}</h2>
      </div>
      <div class="settings-group">
        <div class="time-interval-selector">
          <label
          >Время прохождения теста:
            <strong>{{ formattedInterval }}</strong></label
          >
          <CustomInput
              type="range"
              v-model.number="duration"
              :minNumber="120"
              :maxNumber="2700"
              class="custom-slider"
          />
          <div class="slider-labels">
            <span>2 мин</span>
            <span>45 мин</span>
          </div>
          <div class="setting-item">
            <CustomInput
                type="checkbox"
                @change="showTimer=!showTimer"
                labelText="Отображать оставшееся время"
            />
          </div>

          <div class="setting-item">
            <CustomInput
                type="checkbox"
                @change="showMinuteResults=!showMinuteResults"
                labelText="Показывать результаты за минуту"
            />
            <CustomInput
                type="checkbox"
                @change="showTotalResults=!showTotalResults"
                labelText="Показывать общий результат"
            />
          </div>

          <div class="setting-item">
            <CustomInput
                type="checkbox"
                @change="showProgress=!showProgress"
                labelText="Отображать прогресс выполнения"
            />
          </div>
          <div class="acceleration-settings">
            <h3>Настройки ускорения:</h3>
            <div class="acceleration-input">
              <CustomInput
                  type="number"
                  v-model.number="accelerationAmount"
                  :minNumber="0"
                  :maxNumber="100"
                  labelText="Величина ускорения(%):"
              />
            </div>

            <div class="acceleration-input">
              <CustomInput
                  type="number"
                  v-model.number="accelerationInterval"
                  :minNumber="1"
                  :maxNumber="1000"
                  labelText="Интервал применения(от 1 до 1000):"
              />
            </div>
            <div class="acceleration-input">
              <CustomInput
                  type="number"
                  v-model.number="accelerationFrequency"
                  :minNumber="1"
                  :maxNumber="1000"
                  labelText="Как часто(от 1 до 1000):"
              />
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
  padding: 0.5rem 2rem 0.5rem 0.5rem;
}
</style>
