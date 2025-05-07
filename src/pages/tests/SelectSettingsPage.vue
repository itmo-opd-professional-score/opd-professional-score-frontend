<script lang="ts">
import { defineComponent } from 'vue';
import CustomInput from '../../components/UI/inputs/CustomInput.vue';
import CommonButton from '../../components/UI/CommonButton.vue';
import type { AccelerationMode, TestType } from './types';
import type { TestTypeDataOutputDto } from '../../api/resolvers/testType/dto/output/test-type-data-output.dto.ts';
import { TestTypeResolver } from '../../api/resolvers/testType/testType.resolver.ts';
import { TestSetupsResolver } from '../../api/resolvers/testSetup/test-setups.resolver.ts';
import type { TestSetupInputDto } from '../../api/resolvers/testSetup/dto/input/test-setup-input.dto.ts';
import { UserState } from '../../utils/userState/UserState.ts';
import { UserRole } from '../../utils/userState/UserState.types.ts';
import router from '../../router/router.ts';
import { max, min } from '@floating-ui/utils';
import type { DefaultErrorDto } from '../../api/dto/common/default-error.dto.ts';


export default defineComponent({
  name: 'SelectSettingsPage',
  components: { CustomInput, CommonButton },
  props: {
    testTypeId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      duration: 1200,
      showTimer: false,
      showTotalResults: false,
      showProgress: false,
      accelerationMode: 'DISCRETE' as AccelerationMode,
      currentTestType: null as TestTypeDataOutputDto | null,
      specialTypes: [
        "SIMPLE_RDO",
        "HARD_RDO",
        "SIMPLE_TRACKING",
        "HARD_TRACKING"
      ] as Array<TestType>
    };
  },
  computed: {
    formattedInterval() {
      const minutes = Math.floor(this.duration / 60);
      const seconds = (this.duration % 60).toString().padStart(2, '0');
      return `${minutes} мин ${seconds} сек`;
    },
    minTimeValue() {
      if (this.currentTestType === null) return 120
      switch (this.currentTestType.name) {
        case "HARD_LIGHT":
          return 0.5
        default:
          return 120
      }
    },
    maxTimeValue() {
      if (this.currentTestType === null) return 2700
      switch (this.currentTestType.name) {
        case "HARD_LIGHT":
          return 3
        default:
          return 2700
      }
    }
  },
  methods: {
    min,
    max,
    async saveSettings() {
      const settings: TestSetupInputDto = {
        testName: `LOL-{this.testTypeId}`,
        testTypeId: parseInt(this.testTypeId),
        duration: this.duration,
        showTimer: this.showTimer,
        showTotalResults: this.showTotalResults,
        showProgress: this.showProgress,
        accelerationMode: this.accelerationMode,
      };
      try {
        await new TestSetupsResolver().create(settings)
        await router.push('/testBlock/create')
      } catch (e) {
        console.log((e as DefaultErrorDto).message)
      }
    },
  },
  async mounted() {
    if ( ![UserRole.EXPERT, UserRole.ADMIN].includes(UserState.role!) ) await router.push('/profile')
    this.currentTestType = await new TestTypeResolver().getById(parseInt(this.testTypeId))
  }
});
</script>

<template>
  <div class="choose-settings">
    <div class="choose-settings-form">
      <div class="section header-section">
        <h2>Выберите настройки теста: <br />{{ currentTestType ? currentTestType.description : "Load error" }}</h2>
      </div>
      <div v-if="currentTestType" class="settings-group">
        <div class="time-interval-selector">
          <label
            >Время прохождения теста:
            <strong>{{ formattedInterval }}</strong></label
          >
          <CustomInput
            type="range"
            v-model.number="duration"
            :minNumber="minTimeValue"
            :maxNumber="maxTimeValue"
            selector="range"
            class="custom-slider"
          />
          <div class="slider-labels">
            <span>{{ minTimeValue > 60 ? (minTimeValue / 60).toFixed(1) + ' мин' : minTimeValue + ' сек'}}</span>
            <span>{{ maxTimeValue > 60 ? (maxTimeValue / 60).toFixed(1) + ' мин' : maxTimeValue + ' сек'}}</span>
          </div>
          <div class="setting-item">
            <CustomInput
              type="checkbox"
              @change="showTimer = !showTimer"
              labelText="Отображать оставшееся время"
              selector="checkbox"
            />
          </div>

          <div class="setting-item">
            <CustomInput
              type="checkbox"
              @change="showTotalResults = !showTotalResults"
              labelText="Показывать общий результат"
              selector="checkbox"
            />
          </div>

          <div class="setting-item">
            <CustomInput
              type="checkbox"
              @change="showProgress = !showProgress"
              labelText="Отображать прогресс выполнения"
              selector="checkbox"
            />
          </div>
          <div
            class="special-settings"
            v-if="specialTypes.includes(currentTestType.name)"
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
.choose-settings {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.choose-settings-form {
  width: 50%;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border-radius: 10px;
}

.choose-settings-form h2 {
  text-align: center;
  color: white;
  width: 100%;
  padding: 0 2rem;
}

.choose-settings button {
  margin: 0.3vh auto;
}

.section {
  width: 100%;
  background: rgb(16, 73, 231);
  padding: 0.5rem;
  border-radius: 10px;
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
  border-radius: 1rem;
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
  padding: 0.5rem 2rem 0.5rem 0.5rem;
}

.radio-group {
  display: flex;
  justify-content: space-around;
}

.input-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.special-settings .input-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
