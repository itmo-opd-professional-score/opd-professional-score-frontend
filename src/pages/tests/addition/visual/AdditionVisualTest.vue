<script lang="ts">
import CommonButton from "./UI/CommonButton.vue";

export default {
    name: 'AdditionalVisualTest',
  components: {CommonButton},
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
                this.testCompleted = true;
                this.status = `Тест завершен! Правильные ответы: ${this.score} из ${this.totalAttempts}`;
                this.calculateStandardDeviation(); 
                
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
            <CommonButton class="button" @click="startTest">
                <template v-slot:placeholder>Начать</template>
            </CommonButton>
        </div>

        <div v-else>
            <h1>Определите четность суммы</h1>
            <div class="numbers">
                <span>{{ number1 }}</span>
                <span> + </span> 
                <span>{{ number2 }}</span>
            </div>
            <CommonButton class="button" @click="checkEvenOdd(true)">
                <template v-slot:placeholder>Четное</template>
            </CommonButton>
            <CommonButton class="button" @click="checkEvenOdd(false)">
                <template v-slot:placeholder>Нечетное</template>
            </CommonButton>
            <div class="results">
                <p>Правильные ответы: {{ score }}</p>
                <p>Попытки: {{ attempts }}</p>
            </div>
            <p>{{ status }}</p>
            <p v-if="testCompleted">Стандартное отклонение времени ответов: {{ standardDeviation.toFixed(2) }} секунд</p>
        </div>
    </div>
</template>


<style scoped>
.container {
    text-align: center;
    background: white;
    padding: 1.25rem;
    border-radius: 0.625rem;
    box-shadow: 0 0 0.625rem rgba(0, 0, 0, 0.1);
}

.numbers {
    font-size: 2rem;
    margin: 1.25rem 0;
}

.buttons {
    display: flex;
    justify-content: space-around;
}

button {
    padding: 0.625rem 1.25rem;
    font-size: 1.2rem;
    cursor: pointer;
    border: none;
    border-radius: 0.3125rem;
    background-color: #4127e4;
    color: white;
    transition: background-color 0.3s;
}

button.correct {
    background-color: #28a745; 
}

button.incorrect {
    background-color: #dc3545; 
}

.results {
    margin: 1.25rem 0;
}
</style>
