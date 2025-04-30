<template>
  <div class="test-wrapper">
    <div v-if="introVisible" class="intro-screen">
      <h2>Тест на аналоговое слежение</h2>
      <div class="instructions">
        <p>Ваша задача - поймать движущийся шарик и перетащить его в центр.</p>
        <p>Тест продлится {{ duration }} секунд.</p>
        <ul>
          <li>Шарик начинает движение из центра</li>
          <li>Кликните и удерживайте, чтобы поймать</li>
          <li>Перетащите его к красной линии в центре</li>
          <li>Отпустите, когда будете готовы</li>
        </ul>
      </div>
      <CommonButton
        class="start-button primary_button"
        @click="startTest"
        :width="'12.5rem'"
        :height="'3.125rem'"
        :color="'primary'"
      >
        <template v-slot:placeholder>Начать тест</template>
      </CommonButton>
    </div>

    <div
      v-if="!introVisible && !testEnded"
      class="test-container"
      @mousemove="onDrag"
      @mouseup="stopDrag"
      @mouseleave="stopDrag"
    >
      <div class="track-line"></div>
      <div class="center-line"></div>

      <div
        class="ball"
        :style="{ left: ballPosition + '%' }"
        @mousedown="startDrag"
        ref="ball"
        :class="{ 'caught': isCaught, 'in-center': isInCenter }"
      ></div>

      <div class="status-indicator">
        <div>Осталось: {{ remainingTime.toFixed(1) }} сек</div>
        <div>Успешных попыток: {{ successCount }}</div>
        <div v-if="lastSuccessTime">Последнее время: {{ lastSuccessTime.toFixed(2) }} сек</div>
      </div>
    </div>


    <div v-if="testEnded" class="results-screen">
      <h2>Тест завершён!</h2>

      <div class="stats-container">
        <div class="stat-card">
          <div class="stat-value">{{ successCount }}</div>
          <div class="stat-label">Успешных попыток</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ avgTime.toFixed(2) }} сек</div>
          <div class="stat-label">Среднее время</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ timeDeviation.toFixed(2) }} сек</div>
          <div class="stat-label">Отклонение</div>
        </div>
      </div>

      <CommonButton
        class="restart-button primary_button"
        @click="restartTest"
        :width="'12.5rem'"
        :height="'3.125rem'"
        :color="'success'"
      >
        <template v-slot:placeholder>Повторить тест</template>
      </CommonButton>
    </div>
  </div>
</template>

<script lang="ts">
import CommonButton from '../../../components/UI/CommonButton.vue';
import { defineComponent } from 'vue';
import { usePopupStore } from '../../../store/popup.store.ts';
import { TestResolver } from '../../../api/resolvers/test/test.resolver.ts';
import { UserState } from '../../../utils/userState/UserState.ts';
import type { AccelerationMode } from '../types';
import type { CreateTrackingInputDto } from '../../../api/resolvers/test/dto/input/create-tracking-input.dto.ts';
import { TestBlockResolver } from '../../../api/resolvers/testBlocks/test-block.resolver.ts';
import { TestSetupsResolver } from '../../../api/resolvers/testSetup/test-setups.resolver.ts';
import router from '../../../router/router.ts';

export default defineComponent({
  name: 'SimpleTrackingTest',
  components: {
    CommonButton
  },
  props: {
    testBlockId: String,
    setupId: String,
  },

  data() {
    return {
      animationFrame: null as number | null,
      minSpeed: 0.2,
      maxSpeed: 0.5,
      direction: 1,
      isInCenter: false,
      ballPosition: 50,
      ballSpeed: 0.3,
      isMoving: false,
      isCaught: false,
      successCount: 0,
      successTimes: [] as number[],
      testEnded: false,
      introVisible: true,
      remainingTime: 0,
      startTime: 0 as number,
      isDragging: false,
      currentDragTime: 0,
      lastSuccessTime: 0,

      duration: 30,
      accelerationMode: 'DISCRETE' as AccelerationMode,
      showProgressBar: true,
      showTimer: false,
      showTotalResults: false,
    };
  },

  computed: {
    testResultsDto(): CreateTrackingInputDto {
      return {
        userId: UserState.id
          ? String(UserState.id)
          : null,
        allSignals: this.successTimes.length,
        successCount: this.successCount,
        avgTime: this.avgTime,
        timeDeviation: this.timeDeviation,
      };
    },

    avgTime(): number {
      if (!this.successTimes.length) return 0;
      return this.successTimes.reduce((a, b) => a + b, 0) / this.successTimes.length;
    },
    timeDeviation(): number {
      const n = this.successTimes.length;
      if (n < 2) return 0;
      const mean = this.avgTime;
      const variance = this.successTimes.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1);
      return Math.sqrt(variance);
    }
  },

  methods: {
    saveResults(): void {
      const popUpStore = usePopupStore()
      new TestResolver().createTracking(this.testResultsDto).catch((err) => {
        popUpStore.activateErrorPopup(err.message)
      })
      if (this.testBlockId && !isNaN(parseInt(this.testBlockId))) {
        let setupId = this.setupId ? parseInt(this.setupId) : undefined;
        if (setupId && isNaN(setupId)) setupId = undefined
        new TestBlockResolver().updateTestBlock({
          testBlockId: parseInt(this.testBlockId),
          updatedTest: {
            name: "SIMPLE_TRACKING",
            setupId: setupId,
            available: false
          }
        })
      }
    },

    getErrorMessage(error: unknown): string {
      if (typeof error !== 'object' || error === null) {
        return 'Неизвестная ошибка';
      }

      const axiosError = error as { response?: { data?: { message?: string } } };
      return axiosError?.response?.data?.message ??
        (error instanceof Error ? error.message : 'Неизвестная ошибка');
    },

    startTest() {
      this.introVisible = false;
      this.testEnded = false;
      this.successCount = 0;
      this.successTimes = [];
      this.startTime = performance.now();
      this.remainingTime = this.duration;

      this.resetBall();
      this.animate();
    },

    resetBall() {
      this.isCaught = false;
      this.isMoving = true;
      this.ballPosition = 50;
      this.direction = Math.random() > 0.5 ? 1 : -1;
      this.ballSpeed = this.minSpeed + Math.random() * (this.maxSpeed - this.minSpeed);
    },

    animate() {
      if (this.testEnded) return;

      const now = performance.now();
      this.remainingTime = this.duration - (now - this.startTime) / 1000;

      if (this.remainingTime <= 0) {
        this.testEnded = true;
        return;
      }

      if (this.isMoving && !this.isCaught) {
        this.ballPosition += this.direction * this.ballSpeed;

        if (this.ballPosition <= 5 || this.ballPosition >= 95) {
          this.direction *= -1;
        }
      }

      this.isInCenter = Math.abs(this.ballPosition - 50) < 2;
      this.animationFrame = requestAnimationFrame(this.animate);
    },

    stopTest() {
      this.testEnded = true;
      this.saveResults();
    },

    startDrag(_event: MouseEvent) {
      if (this.testEnded || this.isCaught) return;

      this.isCaught = true;
      this.isMoving = false;
      this.isDragging = true;
      this.currentDragTime = performance.now();
    },

    onDrag(event: MouseEvent) {
      if (!this.isDragging) return;

      const rect = this.$el.querySelector('.test-container')!.getBoundingClientRect();
      const relativeX = ((event.clientX - rect.left) / rect.width) * 100;
      this.ballPosition = Math.max(0, Math.min(relativeX, 100));
    },

    stopDrag() {
      if (!this.isDragging) return;

      this.isDragging = false;

      if (this.isInCenter) {
        const successTime = (performance.now() - this.currentDragTime) / 1000;
        this.successCount++;
        this.successTimes.push(successTime);
        this.lastSuccessTime = successTime;
      }

      this.resetBall();
    },

    async restartTest() {
      if (this.testBlockId) await router.push(`/testBlock/${this.testBlockId}`);
      else router.go(0)
    },
    async load() {
      if (this.setupId && !isNaN(parseInt(this.setupId))) {
        const settings = await new TestSetupsResolver().getById(parseInt(this.setupId))
        if (settings) {
          this.duration = settings.duration
          this.showProgressBar = settings.showProgress
          this.showTimer = settings.showTimer
          this.showTotalResults = settings.showTotalResults
          this.accelerationMode = settings.accelerationMode
        }
      }
    }
  },
  mounted() { this.load() },
  beforeUnmount() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
});
</script>

<style scoped>

.test-wrapper {
  max-width: 90%;
  width: 90%;
  margin: 0 auto;
  color: #333;
  padding: 1.25rem;
}

.intro-screen {
  text-align: center;
  padding: 1.25rem;
  background: #f8f9fa;
  border-radius: 0.625rem;
  box-shadow: 0 0.25rem 0.375rem rgba(0, 0, 0, 0.1);
}

.intro-screen h2 {
  color: #2c3e50;
  margin-bottom: 0.9375rem;
  font-size: 1.5rem;
}

.instructions {
  text-align: left;
  background: white;
  padding: 0.9375rem;
  border-radius: 0.5rem;
  margin-bottom: 1.25rem;
  font-size: 1rem;
}

.test-container {
  position: relative;
  width: 96%;
  height: 30vh;
  margin: 0 auto;
  user-select: none;
  background: #f8f9fa;
  border-radius: 0.6vw;
  padding: 1.5%;
  box-sizing: border-box;
  cursor: grab;
}

.test-container:active {
  cursor: grabbing;
}

.track-line {
  position: absolute;
  top: 50%;
  left: 5%;
  width: 90%;
  height: 0.5rem;
  background-color: #e0e0e0;
  transform: translateY(-50%);
  border-radius: 0.25rem;
}

.center-line {
  position: absolute;
  top: 20%;
  left: 50%;
  width: 0.125rem;
  height: 60%;
  background-color: #ff6b6b;
  transform: translateX(-50%);
}

.ball {
  position: absolute;
  top: 50%;
  width: 1.875rem;
  height: 1.875rem;
  border-radius: 50%;
  background: #007bff;
  cursor: pointer;
  transform: translate(-50%, -50%);
  transition: background 0.3s, transform 0.2s;
  z-index: 2;
}

.ball:hover {
  background: #0056b3;
}

.ball.caught {
  background: #ff6b6b;
  transform: translate(-50%, -50%) scale(1.1);
}

.ball.in-center {
  box-shadow: 0 0 0.625rem rgba(0, 200, 0, 0.7);
}

.status-indicator {
  position: absolute;
  top: 0.9375rem;
  left: 0.9375rem;
  font-size: 1rem;
  font-weight: bold;
  color: #6c757d;
  background: rgba(255, 255, 255, 0.8);
  padding: 0.5rem 0.75rem;
  border-radius: 0.25rem;
}

.results-screen {
  text-align: center;
  padding: 1.25rem;
  background: #f8f9fa;
  border-radius: 0.625rem;
}

.results-screen h2 {
  color: #2c3e50;
  margin-bottom: 1.25rem;
  font-size: 1.5rem;
}

.stats-container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;
  gap: 1.25rem;
}

.stat-card {
  background: white;
  border-radius: 0.5em;
  padding: 1.5% 2%;
  min-width: 20vw;
  max-width: 90%;
  box-shadow: 0 0.2vh 0.4vh rgba(0, 0, 0, 0.1);
  flex: 1;
  margin: 0.5vh 0.5vw;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 0.3125rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6c757d;
}

.start-button,
.restart-button {
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 768px) {
  .test-wrapper {
    width: 90%;
    padding: 0.625rem;
  }

  .test-container {
    height: 200px;
  }

  .stats-container {
    flex-direction: column;
    gap: 0.625rem;
  }

  .stat-card {
    min-width: auto;
    width: 100%;
  }
}
</style>