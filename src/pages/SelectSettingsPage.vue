<script lang="ts">
import { defineComponent } from 'vue';
import CommonButton from '../components/UI/CommonButton.vue';
import type { TestSettingsDto } from '../api/dto/test-settings.dto.ts';
import CustomInput from '../components/UI/inputs/CustomInput.vue';
import type { AccelerationMode } from './tests/types';

export default defineComponent({
  name: 'SelectSettingsPage',
  components: { CustomInput, CommonButton },
  props: {
    testType: {
      type: String,
      default: 'No test name',
    },
  },
  data() {
    return {
      duration: 1200,
      showTimer: false,
      showTotalResults: false,
      showProgress: false,
      difficultyMode: true,
      accelerationMode: 'DISCRETE' as AccelerationMode,
      testTypeLabels: {
        lab4_3: 'Оценка простой реакции человека на движущийся объект',
        lab4_4: 'Оценка сложной реакции человека на движущийся объект',
        lab5_3: 'Оценка аналогового слежения',
        lab5_4: 'Оценка слежения с преследованием',
        lab6_3: 'Оценка внимания',
        lab6_4: 'Оценка памяти',
        lab6_5: 'Оценка мышления',
      },
    };
  },
  computed: {
    formattedInterval() {
      const minutes = Math.floor(this.duration / 60);
      const seconds = (this.duration % 60).toString().padStart(2, '0');
      return `${minutes} мин ${seconds} сек`;
    },
    testTitle(): string {
      return this.testType in this.testTypeLabels
        ? this.testTypeLabels[this.testType as keyof typeof this.testTypeLabels]
        : this.testType;
    },
  },
  methods: {
    saveSettings() {
      const settings: TestSettingsDto = {
        testType: this.testType,
        duration: this.duration,
        showTimer: this.showTimer,
        showTotalResults: this.showTotalResults,
        showProgress: this.showProgress,
        accelerationMode: this.accelerationMode,
        difficultyMode: this.difficultyMode,
      };
      this.$emit('newSettings', settings);
    },
  },
  emits: ['newSettings'],
});
</script>

<template>
  <div id="choose-settings">
    <div class="choose-settings-form">
      <div class="section header-section">
        <h2>Выберите настройки теста: <br />{{ testTitle }}</h2>
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
              @change="showTimer = !showTimer"
              labelText="Отображать оставшееся время"
            />
          </div>

          <div class="setting-item">
            <CustomInput
              type="checkbox"
              @change="showTotalResults = !showTotalResults"
              labelText="Показывать общий результат"
            />
          </div>

          <div class="setting-item">
            <CustomInput
              type="checkbox"
              @change="showProgress = !showProgress"
              labelText="Отображать прогресс выполнения"
            />
          </div>
          <div
            class="special-settings"
            v-if="['lab4_3', 'lab4_4', 'lab5_3', 'lab5_4'].includes(testType)"
          >
            <h3>Ускорения:</h3>
            <div class="radio-group">
              <CustomInput
                type="radio"
                labelText="Дискретное"
                name="accelerationMode"
                @click="accelerationMode = 'DISCRETE'"
                checked
              />
              <CustomInput
                type="radio"
                labelText="Непрерывное"
                name="accelerationMode"
                @click="accelerationMode = 'STEADY'"
              />
            </div>
            <br />
          </div>
          <div
            class="special-settings"
            v-if="['lab6_5', 'lab6_3', 'lab6_4'].includes(testType)"
          >
            <h3>Выберите уровень сложности:</h3>
            <div class="radio-group">
              <CustomInput
                type="radio"
                labelText="Произвольный режим"
                name="diff"
                @click="difficultyMode = true"
                :checked="true"
              />
              <CustomInput
                type="radio"
                labelText="Режим от простого к сложному"
                name="diff"
                @click="difficultyMode = false"
              />
            </div>
            <br />
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
  width: 60%;
}

.special-settings {
  margin-top: 2rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.special-settings h3 {
  margin: 0.5rem;
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

.radio-group {
  display: flex;
  justify-content: space-around;
}

.custom-slider * {
  padding: 0;
}


.input-wrapper{
  all: unset;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.input-wrapper>* {
  margin: 0.3rem;
}


.select-mode>* {
  margin-bottom: 0.5rem;
}

</style>
