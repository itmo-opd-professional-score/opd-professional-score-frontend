<script>
export default {
    data() {
        return {
            number1: 0,
            number2: 0,
            score: 0,
            attempts: 0,
            currentAttempt: 0,
            totalAttempts: 10,
            status: '',
            testStarted: false,
            testCompleted: false,
            startTime: null,
            responseTimes: [],
            standardDeviation: 0
        };
    },
    methods: {
        generateRandomNumbers() {
            this.number1 = Math.floor(Math.random() * 50) + 1;
            this.number2 = Math.floor(Math.random() * 50) + 1;
            this.startTime = Date.now();
        },
        checkEvenOdd(isEven) {
            const sum = this.number1 + this.number2;
            const isSumEven = sum % 2 === 0;
            this.attempts++;
            this.currentAttempt++;
            const responseTime = (Date.now() - this.startTime) / 1000; 
            this.responseTimes.push(responseTime); 

            if ((isEven && isSumEven) || (!isEven && !isSumEven)) {
                this.score++;
            }

            if (this.currentAttempt < this.totalAttempts) {
                setTimeout(() => {
                    this.generateRandomNumbers();
                }, 1000);
            } else {
                this.testCompleted = true; // Устанавливаем флаг завершения теста
                this.status = `Тест завершен! Правильные ответы: ${this.score} из ${this.totalAttempts}`;
                this.calculateStandardDeviation(); // Вызываем метод для расчета стандартного отклонения
                console.log("Времена ответов:", this.responseTimes);
            }
        },
        startTest() {
            this.testStarted = true;
            this.generateRandomNumbers();
        },
        calculateStandardDeviation() {
            const mean = this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length;
                        const variance = this.responseTimes.reduce((sum, time) => sum + Math.pow(time - mean, 2), 0) / this.responseTimes.length;
            this.standardDeviation = Math.sqrt(variance);
        }
    }
};
</script>

<template>
    <div class="container">
        <div v-if="!testStarted">
            <h1>Инструкция</h1>
            <p>Добро пожаловать в тест на четность!</p>
            <p>В этом тесте вам будет предложено определить, является ли сумма двух случайных чисел четным или нечетным числом.</p>
            <p>Перед вами появится сумма двух чисел, и вам нужно будет выбрать, четная она или нет, нажав на соответствующую кнопку.</p>
            <p>Готовы начать? Нажмите кнопку ниже, чтобы пройти тест!</p>
            <div class="buttons">
                <button @click="startTest">Начать тест</button>
            </div>
        </div>

        <div v-else>
            <h1>Определите четность суммы</h1>
            <div class="numbers">
                <span>{{ number1 }}</span>
                <span> + </span> 
                <span>{{ number2 }}</span>
            </div>
            <div class="buttons">
                <button @click="checkEvenOdd(true)" :disabled="testCompleted">Четное</button>
                <button @click="checkEvenOdd(false)" :disabled="testCompleted">Нечетное</button>
            </div>
            <div class="results">
                <p>Правильные ответы: {{ score }}</p>
                <p>Попытки: {{ attempts }}</p>
            </div>
            <p>{{ status }}</p>
            <p v-if="testCompleted">Стандартное отклонение времени ответов: {{ standardDeviation.toFixed(2) }} секунд</p>
        </div>
    </div>
</template>


<style>
body {
    font-family: 'Segoe UI', sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-image: url("general-bg.webp");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.container {
    text-align: center;
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.numbers {
    font-size: 2em;
    margin: 20px 0;
}

.buttons {
    display: flex;
    justify-content: space-around;
}

button {
    padding: 10px 20px;
    font-size: 1.2em;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    background-color: #4127e4;
    color: white;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #9a8bf8;
}

button.correct {
    background-color: #28a745; 
}

button.incorrect {
    background-color: #dc3545; 
}

.results {
    margin: 20px 0;
}

.hidden { display: none; }
</style>
