<script lang="ts">
import { defineComponent } from 'vue'
import { UserState } from '../../../utils/userState/UserState.ts';
import router from '../../../router/router.ts';
import CommonButton from '../../../components/UI/CommonButton.vue';
import type { CreateSimpleInputDto } from '../../../api/resolvers/test/dto/input/create-simple-input.dto.ts';
import { usePopupStore } from '../../../store/popup.store.ts';
import { TestResolver } from '../../../api/resolvers/test/test.resolver.ts';
import { useTest } from '../../../utils/useTest.ts';

export default defineComponent({
  name: "LightSimpleTest",
  components: { CommonButton },
  props: {
    testBlockId: String,
    setupId: String
  },
  setup(props) {
    const { settings, updateTestBlockToken } = useTest({
      setupId: props.setupId,
      testBlockId: props.testBlockId,
      testType: "SIMPLE_LIGHT"
    });
    return {
      settings,
      updateTestBlockToken,
    }
  },
  data() {
    return {
      isButtonActive: false,
      buttonText: 'Начать тест',
      reactionTimes: [] as Array<number>,
      showResults: false,
      isTestRunning: false,
      startTime: 0,
      TRIAL_COUNT: 3,
      currentTrial: 0,
      timer: 0,
    }
  },
  computed: {
    results(): {
      average: number;
      deviation: number;
      best: number;
      worst: number;
      missedCount: number;
    } {
      const times = this.reactionTimes;
      if (!times.length) return { average: 0, deviation: 0, best: 0, worst: 0, missedCount: 0 };
      const average = Math.round(
        times.reduce((a, b) => a + b, 0) / times.length,
      );
      const variance =
        times.reduce((acc, val) => acc + Math.pow(val - average, 2), 0) /
        times.length;
      const deviation = Math.round(Math.sqrt(variance));
      console.log(this.reactionTimes)
      return {
        average,
        deviation,
        best: Math.min(...times),
        worst: Math.max(...times),
        missedCount: this.reactionTimes.filter(reaction => reaction > 600).length
      };
    },
    testResultDto(): CreateSimpleInputDto {
      return {
        userId: UserState.id ? UserState.id : null,
        averageCallbackTime: this.results.average,
        allSignals: this.TRIAL_COUNT,
        misclicks: this.results.missedCount,
        dispersion: this.results.deviation,
      };
    },
  },
  methods: {
    router() {
      return router
    },
    changeButtonColor(): void {
      this.isButtonActive = true;
      this.buttonText = 'Нажмите на кнопку';
      this.startTime = new Date().getTime();
    },
    handleClick(): void {
      if (this.currentTrial < this.TRIAL_COUNT) {
        const endTime = new Date().getTime();
        this.reactionTimes.push(endTime - (this.startTime as number));
        this.isButtonActive = false;
        this.buttonText = 'Ждите...';
        clearTimeout(this.timer)
        this.timer = setTimeout(this.changeButtonColor, Math.random() * 3000 + 1000);
        this.currentTrial++;
      } else {
        this.saveResults()
      }
    },
    startTest(): void {
      this.isTestRunning = true
      this.buttonText = 'Ждите...';
      this.timer = setTimeout(this.changeButtonColor, Math.random() * 3000 + 1000);
    },
    async saveResults() {
      this.isTestRunning = false
      this.isButtonActive = false
      this.buttonText = 'Тест окончен'
      this.showResults = true;

      const popUpStore = usePopupStore()
      new TestResolver().createSimple(this.testResultDto, "slt").catch((error) => {
        popUpStore.activateErrorPopup(
          `Error code: ${error.status}. ${error.response.data.message}`,
        );
      });
      if (this.testBlockId) await this.updateTestBlockToken()
    },
  },
})

</script>

<template>
  <div class="container" v-if="settings">
    <div class="test" v-if="!showResults">
      <h2 class="title1">Оценка скорости простых реакции на свет</h2>
      <p class="description">
        Этот тест измеряет время вашей реакции на визуальный сигнал.
        Как только кнопка станет красной, нажмите на неё как можно быстрее.
        Старайтесь не нажимать кнопку до сигнала!
      </p>

      <div class="button-wrapper">
        <CommonButton
          class="reaction-button"
          :class="{ active: isButtonActive }"
          @click="handleClick"
          :disabled="!isButtonActive"
        >
          <template v-slot:placeholder> {{ buttonText }}</template>
        </CommonButton>
      </div>
      <CommonButton
        class="reset-button"
        @click="router().go(0)"
        v-if="isTestRunning"
      >
        <template v-slot:placeholder>Прервать тест</template>
      </CommonButton>
      <CommonButton
        class="reset-button"
        @click="startTest()"
        v-else
      >
        <template v-slot:placeholder>Начать тест</template>
      </CommonButton>
    </div>

    <div v-else class="results">
      <div class="congrats">
        <h2>Поздравляем с прохождением теста!</h2>
      </div>
      <div class="final-results" v-if="settings?.showTotalResults">
        <h2 class="title">Результаты:</h2>
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
          Количество пропусков: <strong>{{ results.missedCount }}</strong>
        </p>
      </div>
      <CommonButton
        class="retry-button"
        @click="testBlockId ? router().push(`/testBlock/${testBlockId}`) : router().go(0)"
      >
        <template v-slot:placeholder>{{ testBlockId ? 'Вернуться к блоку тестов' : 'Пройти заново'}}</template>
      </CommonButton>
    </div>
  </div>
</template>


<style scoped>
.title1 {
  font-size: 2rem;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
  color: #fff;
}
.title {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #fff;
}

.retry-button:hover {
  background-color: #a598ff;
}

.retry-button:active {
  background-color: #7c6fb5;
}

.reset-button, .retry-button {
  font-size: 1.3rem;
  margin-bottom: 1.25rem;
  color: #000000;
  background-color: #ffffff;
  opacity: 0.8;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.reset-button:hover {
  background-color: #a598ff;
}

.reset-button:active {
  background-color: #7c6fb5;
}

.container {
  .test {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  padding-bottom: 2rem;
}

.description {
  background: rgba(255, 255, 255, 0.9);
  opacity: 0.85;
  padding: 0.7rem;
  border-radius: 1rem;
  margin: 0.8rem 0;
  color: #000000;
  width: 50vw;
  min-height: 3rem;
  text-align: center;
}

.button-wrapper {
  margin: 2rem 0;
  perspective: 10px;
  display: flex;
  justify-content: center;
}

.reaction-button {
  width: 40vh;
  height: 40vh;
  border-radius: 50%;
  background: #80008099;
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 10px 20px #80008033;
  display: flex;
  justify-content: center;
  align-items: center;
}

.reaction-button.active {
  background-color: #cf1a1a;
}

.reaction-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}


.results {
  margin-top: 10rem;
  padding: 1rem 1.5rem;
  background: #FFFFFF33;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  
  h2 {
    text-align: center;
  }

  p {
    color: white;
    font-size: 1.2rem;
  }

  .retry-button {
    margin-top: 2vw;
  }
}

</style>
