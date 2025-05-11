<script lang="ts">
import type { CreateSimpleInputDto } from '../../../api/resolvers/test/dto/input/create-simple-input.dto.ts';
import { defineComponent } from 'vue';
import { usePopupStore } from '../../../store/popup.store.ts';
import CommonButton from '../../../components/UI/CommonButton.vue';
import { UserState } from '../../../utils/userState/UserState.ts';
import { TestResolver } from '../../../api/resolvers/test/test.resolver.ts';
import type { TestSetupOutputDTO } from '../../../api/resolvers/testSetup/dto/output/test-setup-output.dto.ts';
import router from '../../../router/router.ts';
import { useTest } from '../../../utils/useTest.ts';

type TestState = 'ready' | 'reacting' | 'completed';

export default defineComponent({
  name: 'SimpleSoundTest',
  components: { CommonButton },
  props: {
    testBlockId: String,
    setupId: String,
  },
  setup(props) {
    const { settings, updateTestBlockToken } = useTest({
      setupId: props.setupId,
      testBlockId: props.testBlockId,
      testType: "SIMPLE_SOUND"
    });
    return {
      settings,
      updateTestBlockToken,
    }
  },
  data() {
    return {
      testState: 'ready' as TestState,
      audioContext: null as AudioContext | null,
      reactionTimes: [] as number[],
      timeoutIds: [] as number[],
      currentTrial: 0,
      startTime: 0,
      inactivityTimeout: null as number | null,
      popupStore: usePopupStore(),
      missedCount: 0,
      buttonText: 'Сейчас недоступно',
      settings: undefined as TestSetupOutputDTO | undefined,
    };
  },
  computed: {
    results(): {
      average: number;
      deviation: number;
      best: number;
      worst: number;
    } {
      const times = this.reactionTimes;
      if (!times.length) return { average: 0, deviation: 0, best: 0, worst: 0 };
      const average = Math.round(
        times.reduce((a, b) => a + b, 0) / times.length,
      );
      const variance =
        times.reduce((acc, val) => acc + Math.pow(val - average, 2), 0) /
        times.length;
      const deviation = Math.round(Math.sqrt(variance));
      return {
        average,
        deviation,
        best: Math.min(...times),
        worst: Math.max(...times),
      };
    },
    TRIAL_COUNT() {
      if (!this.settings) return 10
      return Math.round(this.settings.duration / 0.6) - 14
    },
    testResultDto(): CreateSimpleInputDto {
      return {
        userId: UserState.id ? UserState.id : null,
        averageCallbackTime: this.results.average,
        allSignals: this.TRIAL_COUNT,
        misclicks: this.missedCount,
        dispersion: this.results.deviation,
      };
    },
  },
  methods: {
    router() {
      return router
    },
    handleClick() {
      if (this.testState == 'reacting' && this.buttonText == "Жмите") {
        const reactionTime = Date.now() - this.startTime;
        if (reactionTime < 200) this.missedCount++
        else this.reactionTimes.push(reactionTime);
        this.buttonText = "Ждите сигнала"
        this.currentTrial++;
        clearTimeout(this.inactivityTimeout!);
        if (this.currentTrial < this.TRIAL_COUNT) {
          this.scheduleNextTrial();
        } else {
          this.finishTest();
        }
      }
    },
    startTest() {
      this.buttonText = 'Ждите сигнала'
      this.popupStore.errorPopupVisible = false;
      this.testState = 'reacting';
      this.currentTrial = 0;
      this.reactionTimes = [];
      this.missedCount = 0;
      this.scheduleNextTrial();
    },
    scheduleNextTrial() {
      this.buttonText = 'Ждите сигнала'
      this.clearTimeouts();
      this.startTime = 0;
      const delay = Math.random() * 700 + 300;
      const audioVolume = Math.random() * 0.8 + 0.1;
      const timerId = setTimeout(() => {
        this.playSound(audioVolume);
        this.buttonText = "Жмите"
        this.startTime = Date.now();
        this.setupInactivityTimeout();
      }, delay);
      this.timeoutIds.push(timerId);
    },
    setupInactivityTimeout() {
      this.inactivityTimeout = window.setTimeout(() => {
        this.missedCount++;
        this.currentTrial++;
        if (this.currentTrial < this.TRIAL_COUNT) {
          this.scheduleNextTrial();
        } else {
          this.finishTest();
        }
      }, 1000);
    },
    playSound(audioVolume: number) {
      try {
        const context = this.audioContext || new window.AudioContext();
        this.audioContext = context;
        const oscillator = this.audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1000, context.currentTime);
        const gainNode = context.createGain();
        gainNode.gain.setValueAtTime(audioVolume, context.currentTime);
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        oscillator.start();
        oscillator.stop(context.currentTime + 0.3);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Неизвестная ошибка воспроизведения';
        this.popupStore.activateErrorPopup(
          `Ошибка воспроизведения звука: ${message}`,
        );
        this.finishTest();
      }
    },
    finishTest() {
      this.clearTimeouts();
      this.testState = 'completed';
      this.buttonText = 'Тест окончен'
      this.saveResults()
    },
    clearTimeouts() {
      this.timeoutIds.forEach((id) => clearTimeout(id));
      this.timeoutIds = [];
    },
    async saveResults() {
      const popUpStore = usePopupStore()
      new TestResolver().createSimple(this.testResultDto, "sst").catch((error) => {
        popUpStore.activateErrorPopup(
          `Error code: ${error.status}. ${error.response.data.message}`,
        );
      });
      if (this.testBlockId) await this.updateTestBlockToken()
    },
  },
  beforeUnmount() {
    this.clearTimeouts();
    clearTimeout(this.inactivityTimeout!);
  },
});
</script>

<template>
  <div class="container">
    <div class="test" v-if="testState != 'completed'">
      <h2 class="title">Тест на скорость простой реакции на звук</h2>
      <p class="description">
        Этот тест измеряет время вашей реакции на звуковой сигнал. После начала
        теста вы услышите {{ TRIAL_COUNT }} звуковых сигналов. Как только услышите сигнал - как
        можно быстрее нажмите большую кнопку. Не стоит при этом пытаться нажать заранее - попытка не будет засчитана
      </p>

      <div class="button-wrapper">
        <CommonButton
          class="reaction-button"
          :class="{ active: testState == 'reacting' }"
          :disabled="testState != 'reacting' || buttonText != 'Жмите'"
          @click="handleClick"
        >
          <template v-slot:placeholder> {{ buttonText }}</template>
        </CommonButton>
      </div>

      <CommonButton
        class="reset-button"
        @click="router().go(0)"
        v-if="testState == 'reacting'"
      >
        <template v-slot:placeholder>Прервать тест</template>
      </CommonButton>
      <CommonButton
        class="reset-button"
        @click="startTest()"
        v-if="testState == 'ready'"
      >
        <template v-slot:placeholder>Начать тест</template>
      </CommonButton>
    </div>

    <div v-else class="results">
      <h2>Поздравляем с прохождением теста!</h2>
      <div class="full" v-if="settings.showTotalResults">
        <h2>Результаты:</h2>
        <p>
          Среднее время: <strong>{{ results.average }} мс</strong>
        </p>
        <p>
          Стандартное отклонение: <strong>{{ results.deviation }} мс</strong>
        </p>
        <p>
          Лучшее время: <strong>{{ results.best }} мс</strong>
        </p>
        <p>
          Худшее время: <strong>{{ results.worst }} мс</strong>
        </p>
        <p>
          Количество пропусков: <strong>{{ missedCount }}</strong>
        </p>
      </div>
      <CommonButton
        class="retry-button submit_button"
        @click="testBlockId ? router().push(`/testBlock/${testBlockId}`) : router().go(0)"
      >
        <template v-slot:placeholder>{{ testBlockId ? 'Вернуться к текущему блоку тестов' : 'Пройти заново'}}</template>
      </CommonButton>
    </div>
  </div>
</template>

<style scoped>
.title {
  font-size: 2rem;
  color: #fff;
}

.test {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3vh;
}

.description, .results {
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 15px;
  color: black;
  max-width: 45vw;
  display: flex;
  flex-direction: column;
  gap: 1vw;
}

.results {
  max-width: 25vw;
  margin: 0 auto auto;
}

.button-wrapper {
  margin: 3vh 0;
}

.reaction-button {
  width: 40vh;
  height: 40vh;
  border-radius: 50%;
  background: rgba(128, 0, 128, 0.6);
  border: none;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 10px 20px rgba(128, 0, 128, 0.2);
  outline: none;
}

.reaction-button.active {
  transform: scale(1.1);
}

.reaction-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.reset-button {
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 1rem;
}
</style>
