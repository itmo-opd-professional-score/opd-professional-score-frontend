<script lang="ts">
import { defineComponent } from 'vue';
import TestStatisticsCard from '../../components/TestStatisticsCard.vue';
import TestScoreList from '../../components/TestsScoreList.vue';
import { UserState } from '../../utils/userState/UserState.ts';

export default defineComponent({
  name: 'TestResultsPage',
  computed: {
    UserState() {
      return UserState;
    },
  },
  components: {
    TestStatisticsCard,
    TestScoreList,
  },
  props: {
    testId: Number
  },
  data() {
    return {
      testData: [
        {
          id: 1,
          test_name: 'Кто ты в мире Danganronpa?',
          current_points: 72,
          max_points: 120,
          time: '00:14:00',
          username: 'Слудная Виктория',
          createdAt: '15.05.2023 10:30',
          valid: true,
        },
        {
          id: 2,
          test_name: 'Насколько хорошо ты знаешь Монокуму?',
          current_points: 88,
          max_points: 110,
          time: '00:18:00',
          username: 'Слудная Виктория',
          createdAt: '22.06.2023 16:45',
          valid: false,
        },
        {
          id: 3,
          test_name: 'Какой у тебя талант в стиле Danganronpa?',
          current_points: 67,
          max_points: 90,
          time: '00:11:30',
          username: 'Слудная Виктория',
          createdAt: '01.07.2023 08:15',
          valid: true,
        },
        {
          id: 4,
          test_name: 'Какой у тебя талант в стиле Danganronpa?',
          current_points: 55,
          max_points: 85,
          time: '00:09:20',
          username: 'Слудная Виктория',
          createdAt: '10.08.2023 12:20',
          valid: false,
        },
        {
          id: 5,
          test_name: 'Сможешь ли ты выжить в игре на выживание?',
          current_points: 100,
          max_points: 130,
          time: '00:25:00',
          username: 'Слудная Виктория',
          createdAt: '05.09.2023 14:50',
          valid: true,
        },
        {
          id: 6,
          test_name: 'Какой персонаж Danganronpa был бы твоим напарником?',
          current_points: 45,
          max_points: 75,
          time: '00:06:40',
          username: 'Слудная Виктория',
          createdAt: '19.10.2023 09:10',
          valid: false,
        },
        {
          id: 7,
          test_name: 'Сможешь ли ты раскрыть убийство?',
          current_points: 90,
          max_points: 100,
          time: '00:16:25',
          username: 'Слудная Виктория',
          createdAt: '30.11.2023 17:30',
          valid: true,
        },
        {
          id: 8,
          test_name: 'Какой ты монокуб?',
          current_points: 65,
          max_points: 95,
          time: '00:10:10',
          username: 'Слудная Виктория',
          createdAt: '12.12.2023 11:55',
          valid: true,
        },
      ],
    };
  },
});
</script>

<template>
  <div class="test-results-page">
    <h3>Текущий тест</h3>
    <section class="current-test">
      <TestStatisticsCard
        :time="2"
        :date="'33'"
        :max-score="10"
        :score="10"
        :test-name="'Проверка на скорость'"
      ></TestStatisticsCard>
    </section>
    <section class="user-test-history" v-if="testData.length > 0">
      <h4>Ваши последние результаты:</h4>
      <TestScoreList :tests="testData" :max-elements-count="5" />
    </section>
    <section
      class="user-test-history"
      v-if="UserState.role == 'EXPERT' || UserState.role == 'ADMIN'"
    >
      <h4>Последние результаты всех пользователей:</h4>
      <TestScoreList :tests="testData" :max-elements-count="5" />
    </section>
  </div>
</template>

<style scoped>
.test-results-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: var(--background-primary);
  padding: 15px;
  width: 75vw;
  border-radius: 15px;
}
.current-test {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.user-test-history {
  display: flex;
  background-color: var(--background-primary);
  padding: 15px;
  border-radius: 15px;
  flex-direction: column;
  justify-content: center;
}
h3 {
  margin-bottom: 40px;
  font-size: 48px;
  color: rgb(237, 227, 227, 0.9);
  font-weight: bold;
}
h4 {
  display: flex;
  justify-content: center;
  border-radius: 10px;
  padding: 0.5rem 0;
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  font-weight: bolder;
  color: rgb(237, 227, 227, 0.9);
}
</style>
