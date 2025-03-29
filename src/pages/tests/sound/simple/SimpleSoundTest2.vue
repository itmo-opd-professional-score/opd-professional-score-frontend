
<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SoundReactionTest',
  data() {
    return {
      testState: 'ready', // ready | reacting | completed
      audioContext: null,
      reactionTimes: [],
      timeoutIds: [],
      TRIAL_COUNT: 5,
      currentTrial: 0,
      startTime: 0,
      inactivityTimeout: null
    };
  },
  computed: {
    buttonText() {
      switch(this.testState) {
        case 'ready': return 'Начать тест';
        case 'reacting': return 'Ждите сигнала';
        case 'completed': return 'Тест окончен';
        default: return '';
      }
    },
    results() {
      const times = this.reactionTimes;
      return {
        average: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
        best: Math.min(...times),
        worst: Math.max(...times)
      };
    }
  },
  methods: {
    handleClick() {
      if (this.testState === 'ready') {
        this.startTest();
      } else if (this.testState === 'reacting') {
        const reactionTime = Date.now() - this.startTime;
        this.reactionTimes.push(reactionTime);
        this.currentTrial++;
        clearTimeout(this.inactivityTimeout);

        if (this.currentTrial < this.TRIAL_COUNT) {
          this.scheduleNextTrial();
        } else {
          this.finishTest();
        }
      }
    },

    startTest() {
      this.testState = 'reacting';
      this.currentTrial = 0;
      this.reactionTimes = [];
      this.scheduleNextTrial();
    },

    scheduleNextTrial() {
      this.clearTimeouts();

      const delay = Math.random() * 3000 + 2000;
      const timerId = setTimeout(() => {
        this.playSound();
        this.startTime = Date.now();
        this.setupInactivityTimeout();
      }, delay);

      this.timeoutIds.push(timerId);
    },

    setupInactivityTimeout() {
      this.inactivityTimeout = setTimeout(() => {
        this.failTest('Время вышло!');
      }, 5000);
    },

    playSound() {
      try {
        if (!this.audioContext) {
          this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const oscillator = this.audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);

        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.5);
      } catch (error) {
        console.error('Ошибка воспроизведения звука:', error);
        this.finishTest();
      }
    },

    finishTest() {
      this.clearTimeouts();
      this.testState = 'completed';
    },

    failTest(reason) {
      alert(`Тест провален: ${reason}`);
      this.resetTest();
    },

    resetTest() {
      this.clearTimeouts();
      clearTimeout(this.inactivityTimeout);
      this.testState = 'ready';
      this.reactionTimes = [];
      this.currentTrial = 0;
    },

    clearTimeouts() {
      this.timeoutIds.forEach(id => clearTimeout(id));
      this.timeoutIds = [];
    }
  },
  beforeUnmount() {
    this.clearTimeouts();
    clearTimeout(this.inactivityTimeout);
  }
});
</script>
<template>
  <main class="sound-test">
    <div class="container">
      <h1>Тест на скорость реакции</h1>
      <p class="instructions">
        После старта вы услышите 5 звуковых сигналов с интервалами 2-5 секунд.
        Как можно быстрее нажмите кнопку после каждого сигнала.
      </p>

      <div class="button-wrapper">
        <button
            class="reaction-button"
            :class="{ active: testState === 'reacting' }"
            @click="handleClick"
            :disabled="testState === 'completed'"
            aria-label="Нажмите при появлении звука"
        >
          {{ buttonText }}
        </button>
      </div>

      <div v-if="testState === 'completed'" class="results">
        <h2>Результаты:</h2>
        <p>Среднее: <strong>{{ results.average }} мс</strong></p>
        <p>Лучший: <strong>{{ results.best }} мс</strong></p>
        <p>Худший: <strong>{{ results.worst }} мс</strong></p>
        <button class="retry-button" @click="resetTest">Пройти заново</button>
      </div>

      <button
          v-if="testState !== 'completed'"
          class="reset-button"
          @click="resetTest"
          aria-label="Прервать тест"
      >
        {{ testState === 'ready' ? 'Отмена' : 'Прервать' }}
      </button>
    </div>
  </main>
</template>

<style scoped>
.sound-test {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #2c3e50, #3498db);
  color: white;
  font-family: Arial, sans-serif;
}

.container {
  max-width: 500px;
  padding: 2rem;
  text-align: center;
}

.instructions {
  margin: 1.5rem 0;
  line-height: 1.6;
}

.button-wrapper {
  margin: 2rem 0;
  perspective: 1000px;
}

.reaction-button {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: #34495e;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
  outline: none;
}

.reaction-button.active {
  background: #4caf50;
  transform: scale(1.1);
  box-shadow: 0 15px 30px rgba(76, 175, 80, 0.4);
}

.reaction-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.reset-button {
  margin-top: 1rem;
  padding: 0.8rem 1.5rem;
  background: #e74c3c;
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-button:hover {
  background: #c0392b;
}

.retry-button {
  margin-top: 1rem;
  padding: 0.8rem 1.5rem;
  background: #3498db;
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-button:hover {
  background: #2980b9;
}

.results {
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.results h2 {
  margin-bottom: 1rem;
}

.results p {
  margin: 0.5rem 0;
}
</style>


<!--
Вот детальное описание логики работы приложения:

**1. Основные компоненты:**
- **Шаблон (template):** Отвечает за отображение интерфейса
- **Скрипт (script):** Содержит логику теста
- **Стили (style):** Управляют внешним видом

**2. Основные состояния (data):**
- `testState` - текущий этап теста:
  - `ready` - готовность к началу
  - `reacting` - активный тест
  - `completed` - завершенный тест
- `reactionTimes` - массив для хранения результатов
- `TRIAL_COUNT` - количество испытаний (5)
- `currentTrial` - текущее испытание
- `startTime` - время начала текущего сигнала
- `inactivityTimeout` - таймер бездействия

**3. Ключевые функции:**

**a. handleClick()**
- Обрабатывает нажатие на главную кнопку
- В состоянии `ready` запускает тест
- В состоянии `reacting`:
  - Фиксирует время реакции
  - Переходит к следующему испытанию или завершает тест
  - Сбрасывает таймер бездействия

**b. startTest()**
- Инициализирует тест:
  - Сбрасывает результаты
  - Меняет состояние на `reacting`
  - Запускает первое испытание

**c. scheduleNextTrial()**
- Создает случайную задержку (2-5 сек)
- Воспроизводит звук после задержки
- Запоминает время начала сигнала
- Устанавливает таймер бездействия (5 сек)

**d. playSound()**
- Создает звуковой сигнал:
  - Использует Web Audio API
  - Генерирует синусоидальный звук 1000 Гц
  - Автоматически останавливается через 0.5 сек

**e. setupInactivityTimeout()**
- Устанавливает 5-секундный таймер
- Автоматически завершает тест с ошибкой при бездействии

**f. finishTest()**
- Завершает тест успешно:
  - Меняет состояние на `completed`
  - Сбрасывает все таймеры

**g. failTest()**
- Принудительно завершает тест с ошибкой:
  - Показывает сообщение
  - Сбрасывает тест

**h. resetTest()**
- Полностью сбрасывает тест:
  - Возвращает в состояние `ready`
  - Очищает все данные и таймеры

**4. Жизненный цикл теста:**

**1. Стартовый экран**
- Кнопка "Начать тест" активна
- Пользователь видит инструкции

**2. Выполнение теста**
- После нажатия кнопки:
  - Запускается первое испытание
  - Кнопка показывает "Ждите сигнала"
- На каждом этапе:
  - Случайная задержка 2-5 сек
  - Звуковой сигнал
  - Ожидание реакции (максимум 5 сек)
  - Фиксация времени реакции

**3. Завершение теста**
- После 5 успешных реакций:
  - Показываются результаты
  - Появляется кнопка "Пройти заново"

**4. Обработка ошибок**
- Тест завершается досрочно если:
  - Пользователь не реагирует 5 сек
  - Происходит ошибка воспроизведения звука

**5. Визуальная обратная связь:**
- Анимация кнопки:
  - Масштабирование при активации
  - Смена цвета на зеленый при реакции
- Тень и плавные переходы
- Градиентный фон для улучшенной визуализации

**6. Дополнительные особенности:**
- Автоматическая очистка таймеров
- Обработка ошибок аудио
- Адаптивный дизайн
- Доступность через ARIA-атрибуты
- Плавные CSS-переходы

**Поток выполнения теста:**
1. Пользователь нажимает "Начать тест"
2. Случайная задержка (2-5 сек)
3. Воспроизводится звук
4. Начинается отсчет времени реакции
5. Пользователь нажимает кнопку
6. Время реакции фиксируется
7. Повторяется 5 раз
8. Показ результатов

**Обработка ошибок:**
- Если пользователь не нажимает кнопку 5 секунд:
  - Тест завершается с сообщением "Время вышло!"
  - Автоматический сброс теста
- При ошибках звука:
  - Тест завершается
  - Выводится сообщение об ошибке

Этот код обеспечивает надежное и удобное тестирование реакции с учетом множества сценариев использования и возможных ошибок. -->