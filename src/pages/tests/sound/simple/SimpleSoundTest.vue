<script lang="ts">
import { defineComponent } from 'vue';
import CommonButton from "../../../../components/UI/CommonButton.vue";

export default defineComponent({
  name: "SoundReactionTest",
  components: { CommonButton },
  data() {
    return {
      testState: 'waiting', // waiting | countdown | reacting | completed | failed
      reactionTimes: [] as number[],
      startTime: 0,
      audioContext: null as AudioContext | null,
      trials: 5,
      currentTrial: 0,
      timeoutId: null as number | null,
      reactionTimeout: null as number | null,
      results: {
        average: 0,
        best: Infinity,
        worst: 0
      }
    };
  },
  methods: {
    initAudio() {
      if (!this.audioContext) {
        try {
          this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = this.audioContext.createOscillator();
          oscillator.connect(this.audioContext.destination);
          oscillator.start();
          oscillator.stop(this.audioContext.currentTime + 0.001);
        } catch (error) {
          console.error('AudioContext error:', error);
          this.testFailed('Ошибка инициализации аудио');
        }
      }
    },

    playBeep() {
      if (!this.audioContext) return;

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);

      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.5);
    },

    startTest() {
      this.initAudio();
      this.testState = 'countdown';
      this.currentTrial = 0;
      this.reactionTimes = [];
      this.scheduleTrial();
    },

    scheduleTrial() {
      this.timeoutId = setTimeout(() => {
        this.playBeep();
        this.testState = 'reacting';
        this.startTime = Date.now();
        this.setReactionTimeout();
      }, Math.random() * 3000 + 2000);
    },

    setReactionTimeout() {
      this.reactionTimeout = setTimeout(() => {
        this.testFailed('Слишком долгая реакция');
      }, 3000);
    },

    handleMainButton() {
      if (this.testState === 'reacting') {
        const reactionTime = Date.now() - this.startTime;
        this.reactionTimes.push(reactionTime);
        this.currentTrial++;
        if (this.reactionTimeout) clearTimeout(this.reactionTimeout);

        if (this.currentTrial < this.trials) {
          this.testState = 'countdown';
          this.scheduleTrial();
        } else {
          this.calculateResults();
          this.testState = 'completed';
        }
      } else if (this.testState === 'countdown') {
        this.testFailed('Слишком раннее нажатие');
      } else if (this.testState === 'waiting') {
        this.startTest(); // Прямой запуск теста из состояния waiting
      }
    },

    testFailed(reason: string) {
      this.testState = 'failed';
      this.results = { average: 0, best: 0, worst: 0 };
      if (this.timeoutId) clearTimeout(this.timeoutId);
      if (this.reactionTimeout) clearTimeout(this.reactionTimeout);
      //TODO изменить вывод reason
    },

    calculateResults() {
      this.results = {
        average: Math.round(this.reactionTimes.reduce((a, b) => a + b, 0) / this.trials),
        best: Math.min(...this.reactionTimes),
        worst: Math.max(...this.reactionTimes)
      };
    },

    stopTest() {
      this.testFailed('Тест остановлен пользователем');
    }
  }
});
</script>

<template>
  <main>
    <div class="container">
      <h2>Тест на скорость реакции</h2>
      <p class="description">
        Этот тест измеряет время вашей реакции на звуковой сигнал.
        После начала теста вы услышите 5 случайных звуковых сигналов
        с интервалами 2-5 секунд. Как только услышите сигнал -
        как можно быстрее нажмите большую кнопку.
        <br>Старайтесь не нажимать кнопку до сигнала!
      </p>

      <div class="main-button-wrapper">
        <CommonButton
            @click="handleMainButton"
            class="main-button"
            :class="{
            'reacting': testState === 'reacting',
            'waiting': testState === 'waiting'
          }"
        >
          <template v-slot:placeholder>
            {{ testState === 'waiting' ? 'Начать тест' : 'Ждите сигнала' }}
          </template>
        </CommonButton>
      </div>

      <CommonButton
          @click="stopTest"
          class="stop-button"
          v-if="testState !== 'completed' && testState !== 'failed'"
      >
        <template v-slot:placeholder>Прервать тест</template>
      </CommonButton>

      <div v-if="testState === 'completed'" class="results">
        <h3>Результаты</h3>
        <p>Среднее время: {{ results.average }} мс</p>
        <p>Лучший результат: {{ results.best }} мс</p>
        <p>Худший результат: {{ results.worst }} мс</p>
        <CommonButton @click="startTest">
          <template v-slot:placeholder>Повторить тест</template>
        </CommonButton>
      </div>

      <div v-if="testState === 'failed'" class="results">
        <h3>Тест прерван</h3>
        <CommonButton @click="startTest">
          <template v-slot:placeholder>Начать заново</template>
        </CommonButton>
      </div>
    </div>
  </main>
</template>

<style scoped>
.container {
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

h2 {
  font-size: 46px;
  margin-bottom: 20px;
  color: #fff;
}

.description {
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 15px;
  margin: 20px 0;
}

.main-button-wrapper {
  margin: 40px 0;
  display: flex;
  justify-content: center;
}

.main-button {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  font-size: 24px;
  transition: all 0.3s ease;
  margin: 0 auto;
}

.main-button.reacting {
  background-color: #4CAF50;
  transform: scale(1.05);
}

.stop-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 12px 24px;
  background-color: #ff4444;
  border-radius: 25px;
}

.results {
  background: rgba(255, 255, 255, 0.9);
  padding: 25px;
  border-radius: 15px;
  margin-top: 30px;
}

.results h3 {
  margin-bottom: 15px;
}

.results p {
  margin: 10px 0;
  font-size: 18px;
}
</style>


<!--
### Логика работы страницы теста скорости реакции:

#### **1. Состояния (testState):**
- **`waiting`**
- Начальное состояние, ожидание старта теста.
- Отображается кнопка "Начать тест".

- **`countdown`**
- Подготовка к сигналу после нажатия кнопки.
- Запускается случайная задержка (2-5 секунд).

- **`reacting`**
- Воспроизводится звуковой сигнал.
- Начало отсчёта времени реакции.
- Пользователь должен нажать кнопку как можно быстрее.

- **`completed`**
- Все 5 попыток завершены.
- Отображаются результаты: среднее, лучшее и худшее время.

- **`failed`**
- Тест прерван из-за ошибки (преждевременное нажатие или медленная реакция).

---

#### **2. Ключевые методы:**

- **`initAudio()`**
- Инициализирует аудиоконтекст браузера.
- Запускает пустой звук для активации аудио (обход ограничений браузеров).

- **`playBeep()`**
- Генерирует звуковой сигнал (синусоида 1000 Гц) через Web Audio API.
- Длительность сигнала: 0.5 секунд.

- **`startTest()`**
- Запускает тест:
- Сбрасывает результаты.
- Переводит в состояние `countdown`.
- Запускает первый сигнал через случайную задержку.

- **`scheduleTrial()`**
- Планирует следующий сигнал через 2-5 секунд.
- Использует `setTimeout` для задержки.

- **`handleMainButton()`**
- Обрабатывает нажатие основной кнопки:
- **В состоянии `reacting`:**
Фиксирует время реакции, запускает следующий сигнал или завершает тест.
- **В состоянии `countdown` или `waiting`:**
Прерывает тест (преждевременное нажатие).

- **`testFailed(reason)`**
- Сбрасывает тест, очищает таймеры, отображает причину ошибки.

- **`calculateResults()`**
- Рассчитывает:
- Среднее время: `(Σ времён) / 5`
- Лучший результат: минимальное время.
- Худший результат: максимальное время.

---

#### **3. Жизненный цикл теста:**

1. **Старт:**
- Пользователь нажимает "Начать тест" → `startTest()` → `countdown`.
- Через 2-5 секунд → `playBeep()` → `reacting`.

2. **Реакция:**
- Звуковой сигнал → пользователь нажимает кнопку.
- Фиксируется время реакции.
- Повторяется 5 раз.

3. **Завершение:**
- После 5 попыток → `calculateResults()` → `completed`.
- Результаты сохраняются в `results`.

4. **Ошибки:**
- **Преждевременное нажатие** → `testFailed('Слишком раннее нажатие')`.
- **Нет реакции за 3 секунды** → `testFailed('Слишком долгая реакция')`.

---

#### **4. Визуальные элементы:**

- **Основная кнопка:**
- Диаметр: 300px, всегда по центру.
- Меняет цвет только во время сигнала (`reacting`).
- Текст: "Ждите сигнала" / "Начать тест".

- **Кнопка "Прервать тест":**
- Фиксирована в правом нижнем углу.
- Видна всегда, кроме завершённых состояний.

- **Результаты:**
- Отображаются в виде карточек с метриками.
- Кнопка "Повторить тест" → сброс и новый запуск.

---

#### **5. Особенности работы:**

- **Аудио:**
- Для генерации звука используется Web Audio API (без внешних файлов).
- Аудиоконтекст активируется при первом клике.

- **Таймеры:**
- Все таймауты (`setTimeout`) сохраняются в `timeoutId` и `reactionTimeout` для корректного сброса.

- **Безопасность:**
- Браузер может запросить разрешение на использование аудио при первом запуске.

---

**Итог:** Страница реализует полноценный тест на скорость реакции с обработкой ошибок, случайными интервалами и статистикой.
Логика построена на управлении состояниями и точном отслеживании времени. -->