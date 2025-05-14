<script lang="ts">
import { defineComponent } from 'vue';
import CustomInput from '../../components/UI/inputs/CustomInput.vue';
import CommonButton from '../../components/UI/CommonButton.vue';
import type { TestType } from './types';
import type { TestTypeDataOutputDto } from '../../api/resolvers/testType/dto/output/test-type-data-output.dto.ts';
import { TestTypeResolver } from '../../api/resolvers/testType/testType.resolver.ts';
import { TestSetupsResolver } from '../../api/resolvers/testSetup/test-setups.resolver.ts';
import type { TestSetupInputDto } from '../../api/resolvers/testSetup/dto/input/test-setup-input.dto.ts';
import { UserState } from '../../utils/userState/UserState.ts';
import { UserRole } from '../../utils/userState/UserState.types.ts';
import router from '../../router/router.ts';
import { max, min } from '@floating-ui/utils';
import type { DefaultErrorDto } from '../../api/dto/common/default-error.dto.ts';
import { defaultTestSettingsInput } from '../testSetups/defaultValues.ts';

export default defineComponent({
  name: 'SelectSettingsPage',
  components: { CustomInput, CommonButton },
  props: {
    testTypeName: {
      type: String,
      required: true
    },
    setupId: String
  },
  data() {
    return {
      currentTestType: null as TestTypeDataOutputDto | null,
      settings: defaultTestSettingsInput,
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
      const minutes = Math.floor(this.settings.duration / 60);
      const seconds = (this.settings.duration % 60).toString().padStart(2, '0');
      return `${minutes} мин ${seconds} сек`;
    },
    minTimeValue() {
      if (this.currentTestType === null) return 120
      switch (this.currentTestType.name) {
        case "HARD_LIGHT": return 60
        case "SIMPLE_LIGHT": return 60
        case "SIMPLE_SOUND": return 60
        default: return 120
      }
    },
    maxTimeValue() {
      if (this.currentTestType === null) return 2700
      switch (this.currentTestType.name) {
        case "SIMPLE_LIGHT": return 180
        case "SIMPLE_SOUND": return 180
        case "HARD_LIGHT": return 180
        default: return 2700
      }
    }
  },
  methods: {
    min,
    max,
    async saveSettings() {
      if (this.currentTestType) {
        this.settings.testTypeId = this.currentTestType.id
        try {
          const setupId = this.setupId
          if (!setupId || isNaN(parseInt(setupId))) {
            await new TestSetupsResolver().create(this.settings)
          }
          else {
            await new TestSetupsResolver().update({
              id: parseInt(setupId),
              updated: this.settings
            })
          }
          await router.push('/testBlock/create')
        } catch (e) {
          console.log((e as DefaultErrorDto).message)
        }
      }
    },
    async removeSettings() {
      if (this.setupId && !isNaN(parseInt(this.setupId))) {
        await new TestSetupsResolver().deleteById(parseInt(this.setupId))
      }
      await router.push('/testBlock/create')
    }
  },
  async mounted() {
    if ( ![UserRole.EXPERT, UserRole.ADMIN].includes(UserState.role!) ) await router.push('/profile')
    if (this.setupId && !isNaN(parseInt(this.setupId))) {
      const setupId = this.setupId
      const existedSettings = (await new TestSetupsResolver().getAllByTestType(this.testTypeName as TestType))
        .find((setup) => setup.id === parseInt(setupId))
      this.settings = {...existedSettings} as TestSetupInputDto
      if (existedSettings) this.currentTestType = await new TestTypeResolver().getById(existedSettings.testTypeId)
      else {
        this.currentTestType = await new TestTypeResolver().getByName(this.testTypeName)
        this.settings.duration = this.maxTimeValue / 2
      }
    } else {
      this.currentTestType = await new TestTypeResolver().getByName(this.testTypeName)
      this.settings.duration = this.maxTimeValue / 2
    }

  }
});
</script>

<template>
  <div class="choose-settings" v-if="currentTestType">
    <div class="choose-settings-form">
      <div class="section header-section">
        <h2>Выберите настройки теста: <br />{{ currentTestType ? currentTestType.description : "Load error" }}</h2>
      </div>
      <div class="settings-group">
        <div class="setup-name">
          <CustomInput
            type="text"
            v-model="settings.testName"
            required
          />
        </div>
        <div class="time-interval-selector">
          <label
            >Время прохождения теста:
            <strong>{{ formattedInterval }}</strong></label
          >
          <CustomInput
            type="range"
            v-model.number="settings.duration"
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
              v-model="settings.showTimer"
              :checked="settings.showTimer"
              labelText="Отображать оставшееся время"
              selector="checkbox"
            />
          </div>

          <div class="setting-item">
            <CustomInput
              type="checkbox"
              v-model="settings.showTotalResults"
              :checked="settings.showTotalResults"
              labelText="Показывать общий результат"
              selector="checkbox"
            />
          </div>

          <div class="setting-item">
            <CustomInput
              type="checkbox"
              v-model="settings.showProgress"
              :checked="settings.showProgress"
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
                @click="settings.accelerationMode = 'DISCRETE'"
                :checked="settings.accelerationMode === 'DISCRETE'"
              />
              <CustomInput
                type="radio"
                labelText="Непрерывное"
                name="accelerationMode"
                @click="settings.accelerationMode = 'STEADY'"
                :checked="settings.accelerationMode === 'STEADY'"
              />
            </div>
            <br />
          </div>
        </div>
      </div>
      <div class="section">
        <CommonButton @click="removeSettings" class="logout_button">
          <template v-slot:placeholder>{{ setupId != 'default' ? 'Удалить настройки' : 'Вернуться назад' }}</template>
        </CommonButton>
        <CommonButton @click="saveSettings" class="submit_button">
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

.section {
  width: 100%;
  background: rgb(16, 73, 231);
  padding: 2vh 2vw;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  gap: 1vw;

  button {
    width: 100%;
  }
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
