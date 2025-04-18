import { createRouter, createWebHistory } from 'vue-router';
import PersonalAccount from '../pages/PersonalAccount.vue';
import { UserState } from '../utils/userState/UserState.ts';
import ProfessionsList from '../components/ProfessionsList.vue';
import ProfessionPage from '../pages/ProfessionPage.vue';
import ProfessionForm from '../components/ProfessionForm.vue';
import PvkSetupPage from '../pages/PvkSetupPage.vue';
import PasswordChanging from '../pages/PasswordChanging.vue';
import LogInPage from '../pages/LogInPage.vue';
import RegistrationPage from '../pages/RegistrationPage.vue';
import PersonalAccountChanging from '../pages/PersonalAccountChanging.vue';
import TestMapper from '../pages/tests/TestMapper.vue';
import CreateTestBlockPage from '../pages/CreateTestBlockPage.vue';
import AdditionVisualTest from '../pages/tests/addition/visual/AdditionVisualTest.vue';
import AdditionSoundTest from '../pages/tests/addition/sound/AdditionSoundTest.vue';
import SelectSettingsPage from '../pages/SelectSettingsPage.vue';
import SimpleReactionTest from "../pages/SimpleReactionTest.vue";
import SimpleSoundTest from '../pages/tests/simple/SimpleSoundTest.vue';
import SimpleLightTest from '../pages/tests/simple/SimpleLightTest.vue';
import TestResultsPage from '../pages/tests/TestResultsPage.vue';

const routes = [
  {
    path: '/',
    component: ProfessionsList,
    meta: { ruName: 'Главная' },
  },
  {
    path: '/professions',
    component: ProfessionsList,
    meta: { ruName: 'Профессии' },
  },
  {
    path: `/profession/new`,
    component: ProfessionForm,
    meta: { requiresAuth: true, ruName: 'Новая профессия' },
  },
  {
    path: `/profession/setup/:professionId`,
    component: PvkSetupPage,
    meta: { requiresAuth: true, ruName: 'Установка ПВК' },
    props: true,
  },
  {
    path: `/profession/:id`,
    component: ProfessionPage,
    props: true,
    meta: { ruName: 'Профессия ' },
  },
  {
    path: '/profile',
    component: PersonalAccount,
    meta: { requiresAuth: true, ruName: 'Профиль' },
  },
  {
    path: `/profile/change`,
    component: PersonalAccountChanging,
    meta: { requiresAuth: true, ruName: 'Изменение профиля' },
  },
  {
    path: '/auth/login',
    component: LogInPage,
    meta: { ruName: 'Вход' },
  },
  {
    path: '/auth/registration',
    component: RegistrationPage,
    meta: { ruName: 'Регистрация' },
  },
  {
    path: '/auth/changePassword',
    component: PasswordChanging,
    meta: { ruName: 'Изменение пароля' },
  },
  {
    path: '/test/addition/visual',
    component: AdditionVisualTest,
    meta: { requiresAuth: true, ruName: 'Тест на определение четности' },
  },
  {
    path: `/test/addition/sound`,
    component: AdditionSoundTest,
    meta: {
      requiresAuth: true,
      ruName:
        'Оценка скорости реакции на сложный звуковой сигнал - сложение в уме',
    },
  },
  {
    path: '/test/simple/sound',
    component: SimpleSoundTest,
    meta: { ruName: 'Простой звуковой тест', requiresAuth: true },
  },
  {
    path: '/test/simple/light',
    component: SimpleLightTest,
    meta: {ruName: "Оценка скорости простых реакции на свет", requiresAuth: true}
  },
  {
    path: '/test/results/:testTypeId/:testId',
    props: true,
    component: TestResultsPage,
    meta: {ruName: "Результаты прохождения теста", requiresAuth: true},
  },
  {
    path: `/invitation/test/:token`,
    props: true,
    component: TestMapper,
  },
  {
    path: '/testBlock/create',
    component: CreateTestBlockPage,
    meta: { ruName: 'Создание блока тестов', requiresAuth: true },
  },
   {path: '/test/settings/:testName',
      component: SelectSettingsPage,
      meta: { ruName: 'Настройки теста', requiresAuth: true },
     props: true,
    },
  {
    path: '/simple-reaction-test',
    name: 'SimpleReactionTest',
    component: SimpleReactionTest,
    props: {
      time: 10,
      showTimer: true,
      showProgressBar: true
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  if (to.meta.requiresAuth && UserState.status != 'authorized') {
    next({ path: '/auth/login/' });
  } else {
    next();
  }

  document.title = to.meta.ruName
    ? `${to.meta.ruName} | OPD Professional Score`
    : `OPD Professional Score`;
});

export default router;
