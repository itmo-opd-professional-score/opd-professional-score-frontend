
<template>
  <div class="test-wrapper">
    <div v-if="introVisible" class="intro-screen">
      <h2>Тест на координацию</h2>
      <div class="instructions">
        <p>Ваша задача - удерживать синий шарик как можно ближе к зелёному.</p>
        <p>Чем дольше они будут совпадать, тем лучше ваш результат.</p>
        <p>Тест продлится {{ settings.duration }} секунд.</p>
        <ul>
          <li>Перемещайте синий шарик, удерживая его мышкой</li>
          <li>Зелёный шарик двигается самостоятельно</li>
          <li>Старайтесь максимально совмещать их позиции</li>
        </ul>
      </div>
      <CommonButton
        class="start-button"
        @click="startTest"
        :width="'200px'"
        :height="'50px'"
        :color="'primary'"
      >
        <template v-slot:placeholder>Начать тест</template>
      </CommonButton>
    </div>

    <div
      v-if="!introVisible && !testEnded"
      class="test-container"
      @mousedown="startDrag"
      @mousemove="onDrag"
      @mouseup="stopDrag"
      @mouseleave="handleMouseLeave"
    >
      <div class="track-line"></div>

      <div
        class="auto-ball"
        :style="{ left: autoBallPosition + 'px' }"
      ></div>

      <div
        class="ball"
        :style="{ left: userBallPosition + 'px' }"
        ref="ball"
      ></div>

      <div class="timer" v-if="settings.showTimer && !testEnded">
        Осталось: {{ formattedTime }}
      </div>

      <div class="overlap-indicator" v-if="isOverlapping && !testEnded">
        Совпадение: +{{ currentOverlap.toFixed(1) }} сек
      </div>
    </div>

    <div v-if="testEnded" class="results-screen">
      <h2>Тест завершён!</h2>

      <div class="result-card" v-if="settings.showTotalResults">
        <div class="result-value">{{ bestOverlap.toFixed(2) }} сек</div>
        <div class="result-label">Лучшее совпадение</div>
      </div>

      <CommonButton
        class="restart-button"
        @click="restartTest"
        :width="'200px'"
        :height="'50px'"
        :color="'success'"
      >
        <template v-slot:placeholder>
          {{ testBlockId ? 'Вернуться к текущему блоку' : 'Пройти снова' }}
        </template>
      </CommonButton>
    </div>
  </div>
</template>

<script lang="ts">
import CommonButton from '../../../components/UI/CommonButton.vue';
import { defineComponent } from 'vue';
import { UserState } from '../../../utils/userState/UserState.ts';
import type {
  CreateHardTrackingInputDto
} from '../../../api/resolvers/test/dto/input/create-hard-tracking-input.dto.ts';
import { usePopupStore } from '../../../store/popup.store.ts';
import { TestResolver } from '../../../api/resolvers/test/test.resolver.ts';
import { useTest } from '../../../utils/useTest.ts';
import router from '../../../router/router.ts';


export default defineComponent({
  name: 'HardTrackingTest',
  components: {
    CommonButton
  },
  props: {
    testBlockId: String,
    setupId: String,
  },
  setup(props) {
    const { settings, updateTestBlockToken } = useTest({
      testBlockId: props.testBlockId,
      setupId: props.setupId,
      testType: "HARD_TRACKING"
    })

    return {
      settings,
      updateTestBlockToken,
    }
  },
  data() {
    return {
      trackWidth: 800,
      ballRadius: 20,

      autoBallPosition: 200,
      userBallPosition: 400,

      autoDirection: 1,
      userDirection: 1,
      autoSpeed: 0.1,
      userSpeed: 0.09,
      lastAutoSpeedChange: 0,
      lastUserSpeedChange: 0,

      isDragging: false,

      isOverlapping: false,
      overlapStart: null as number | null,
      overlapTimes: [] as number[],
      currentOverlap: 0,

      elapsedTime: 0,
      lastFrameTime: null as number | null,
      testEnded: false,

      animationFrame: null as number | null,
      introVisible: true,
    };
  },

  computed: {
    formattedTime() {
      if (!this.settings.showTimer || this.testEnded) return '';
      return `${Math.max(0, parseInt((this.settings.duration - this.elapsedTime / 1000).toFixed(1)))} сек`;
    },

    bestOverlap() {
      if (!this.overlapTimes.length) return 0;
      return Math.max(...this.overlapTimes);
    },


    testResults(): CreateHardTrackingInputDto {

      const totalOverlapTime = this.overlapTimes.reduce((sum, t) => sum + t, 0);
      const averageOverlap = this.overlapTimes.length
        ? totalOverlapTime / this.overlapTimes.length
        : 0;
      const successRate = (totalOverlapTime / this.settings.duration) * 100;


      return {
        userId: UserState.id ? UserState.id : null,
        duration: this.settings.duration,
        totalOverlapTime: totalOverlapTime,
        bestOverlap: this.bestOverlap,
        averageOverlap: averageOverlap,
        overlapCount: this.overlapTimes.length,
        score: successRate,
      };
    },
  },

  methods: {
    startTest() {
      this.introVisible = false;
      this.lastFrameTime = performance.now();
      this.lastAutoSpeedChange = this.lastUserSpeedChange = performance.now();
      this.animate();
    },

    async restartTest() {
      if (this.testBlockId) await router.push(`/testBlock/${this.testBlockId}`);
      else router.go(0)
    },

    startDrag(event: any) {
      if (event.target !== this.$refs.ball || this.testEnded) return;
      this.isDragging = true;
    },

    onDrag(event: any) {
      if (!this.isDragging || this.testEnded) return;
      const rect = this.$el.querySelector('.test-container').getBoundingClientRect();
      this.userBallPosition = Math.max(
        this.ballRadius,
        Math.min(event.clientX - rect.left, this.trackWidth - this.ballRadius)
      );
    },

    stopDrag() {
      if (this.testEnded) return;
      this.isDragging = false;
    },

    handleMouseLeave() {
      this.stopDrag();
    },

    animate() {
      const now = performance.now();
      const deltaTime = this.lastFrameTime != null ? now - this.lastFrameTime : now;
      this.lastFrameTime = now;

      this.elapsedTime += deltaTime;
      if (this.elapsedTime >= this.settings.duration * 1000) {
        this.finishTest();
        return;
      }

      if (now - this.lastAutoSpeedChange > 2000) {
        this.autoSpeed = 0.15 + Math.random() * 0.2;
        this.lastAutoSpeedChange = now;
      }

      this.autoBallPosition += this.autoDirection * this.autoSpeed * deltaTime;
      if (this.autoBallPosition <= this.ballRadius || this.autoBallPosition >= this.trackWidth - this.ballRadius) {
        this.autoDirection *= -1;
      }

      if (!this.isDragging && now - this.lastUserSpeedChange > 2500) {
        this.userSpeed = 0.1 + Math.random() * 0.2;
        this.lastUserSpeedChange = now;
        this.userBallPosition += this.userDirection * this.userSpeed * deltaTime;
        if (this.userBallPosition <= this.ballRadius || this.userBallPosition >= this.trackWidth - this.ballRadius) {
          this.userDirection *= -1;
        }
      }

      const distance = Math.abs(this.autoBallPosition - this.userBallPosition);
      const isOverlappingNow = distance <= this.ballRadius * 2;

      if (isOverlappingNow && !this.isOverlapping) {
        this.isOverlapping = true;
        this.overlapStart = now;
      } else if (!isOverlappingNow && this.isOverlapping) {
        this.isOverlapping = false;
        if (this.overlapStart != null) this.overlapTimes.push((now - this.overlapStart) / 1000);
        this.overlapStart = null;
      }

      if (this.isOverlapping && this.overlapStart) {
        this.currentOverlap = (now - this.overlapStart) / 1000;
      }

      this.animationFrame = requestAnimationFrame(this.animate);
    },

    finishTest() {
      this.testEnded = true;
      if (this.animationFrame != null) cancelAnimationFrame(this.animationFrame);

      if (this.isOverlapping && this.overlapStart) {
        const now = performance.now();
        const overlapDuration = (now - this.overlapStart) / 1000;
        this.overlapTimes.push(overlapDuration);
      }
      this.saveResults()
    },
    async saveResults() {
      const popUpStore = usePopupStore()
      new TestResolver().createHardTracking(this.testResults).catch((err) => {
        popUpStore.activateErrorPopup(err.message)
      })
      if (this.testBlockId) await this.updateTestBlockToken()
    },
  },
  beforeUnmount() {
    if (this.animationFrame != null) cancelAnimationFrame(this.animationFrame);
  },
});
</script>

<style scoped>
.test-wrapper {
  font-family: 'Arial', sans-serif;
  max-width: 800px;
  margin: 0 auto;
  color: #333;
}

.intro-screen {
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.intro-screen h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.instructions {
  text-align: left;
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.test-container {
  position: relative;
  width: 800px;
  height: 250px;
  margin: 0 auto;
  user-select: none;
  touch-action: none;
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  box-sizing: border-box;
}

.track-line {
  position: absolute;
  top: 50%;
  left: 20px;
  width: calc(100% - 40px);
  height: 8px;
  background-color: #e0e0e0;
  transform: translateY(-50%);
  border-radius: 4px;
}

.ball,
.auto-ball {
  position: absolute;
  top: 50%;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.ball {
  background: #007bff;
  cursor: pointer;
  z-index: 2;
}

.auto-ball {
  background: #28a745;
  z-index: 1;
}

.timer {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 16px;
  font-weight: bold;
  color: #6c757d;
}

.overlap-indicator {
  position: absolute;
  top: 15px;
  left: 15px;
  font-size: 16px;
  font-weight: bold;
  color: #28a745;
}

.results-screen {
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 10px;
}

.results-screen h2 {
  color: #2c3e50;
  margin-bottom: 2rem;
}

.result-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 0 auto 2rem;
  max-width: 300px;
}

.result-value {
  font-size: 2rem;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 0.5rem;
}

.result-label {
  font-size: 1.2rem;
  color: #6c757d;
}

.start-button,
.restart-button {
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>