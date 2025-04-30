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
import SelectSettingsPage from '../pages/tests/SelectSettingsPage.vue';
import HardLightTest from '../pages/tests/hard/HardLightTest.vue';
import SimpleSoundTest from '../pages/tests/simple/SimpleSoundTest.vue';
import SimpleLightTest from '../pages/tests/simple/SimpleLightTest.vue';
import HardTrackingTest from '../pages/tests/hard/HardTrackingTest.vue';
import TestResultsPage from '../pages/tests/TestResultsPage.vue';
import SimpleRdoTest from '../pages/tests/simple/SimpleRdoTest.vue';
import HardRdoTest from '../pages/tests/hard/HardRdoTest.vue';
import TestBlockPage from '../pages/tests/TestBlockPage.vue';
import NotFound from '../pages/NotFound.vue';
import TestsCatalogPage from '../pages/TestsCatalogPage.vue';
import SimpleTrackingTest from '../pages/tests/simple/SimpleTrackingTest.vue';
import NumericalSeriesTest from '../pages/tests/cognitive/NumericalSeriesTest.vue';
import StroopTest from '../pages/tests/cognitive/StroopTest.vue';
import VerbalTest from '../pages/tests/cognitive/VerbalTest.vue';
const authRoutes = [
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
]
const professionRoutes = [
  {
    path: '/professions',
    component: ProfessionsList,
    meta: { ruName: 'Список профессий' },
  },
  {
    path: `/profession/new`,
    component: ProfessionForm,
    meta: { ruName: 'Новая профессия', requiresAuth: true, },
  },
  {
    path: `/profession/setup/:professionId`,
    component: PvkSetupPage,
    meta: { ruName: 'Установка ПВК', requiresAuth: true },
    props: true,
  },
  {
    path: `/profession/:id`,
    component: ProfessionPage,
    meta: { ruName: 'Страница профессии'},
    props: true,
  },
]
const testBlockRoutes = [
  {
    path: '/testBlock/create',
    component: CreateTestBlockPage,
    meta: { ruName: 'Создание блока тестов', requiresAuth: true },
  },
  {
    path: '/testBlock/:testBlockId/:testBlockToken',
    component: TestBlockPage,
    meta: { ruName: 'Блок тестов' },
    props: true,
  },
  {
    path: `/testBlock/:testBlockId/test/:testTypeName`,
    component: TestMapper,
    props: true,
  },
  {
    path: '/test/settings/:testType',
    component: SelectSettingsPage,
    meta: { ruName: 'Настройки теста', requiresAuth: true },
    props: true,
  },
]
const testRoutes = [
  {
    path: '/test/simple/light',
    component: SimpleLightTest,
    meta: { ruName: 'Простая реакция на свет', requiresAuth: true },
  },
  {
    path: '/test/simple/sound',
    component: SimpleSoundTest,
    meta: { ruName: 'Простая реакция на звук', requiresAuth: true },
  },
  {
    path: '/test/hard/light',
    component: HardLightTest,
    meta: { ruName: 'Сложная реакция на свет', requiresAuth: true },
  },
  {
    path: '/test/addition/visual',
    component: AdditionVisualTest,
    meta: { ruName: 'Сложение в уме - визуально', requiresAuth: true },
  },
  {
    path: `/test/addition/sound`,
    component: AdditionSoundTest,
    meta: { ruName: 'Сложение в уме - на слух', requiresAuth: true,  },
  },
  {
    path: '/test/simple/rdo',
    component: SimpleRdoTest,
    meta: { ruName: 'Простая реакция на движение', requiresAuth: true },
  },
  {
    path: '/test/hard/rdo',
    component: HardRdoTest,
    meta: { ruName: 'Сложная реакция а движение', requiresAuth: true },
  },
  {
    path: '/test/simple/tracking',
    component: SimpleTrackingTest,
    meta: { ruName: 'Простая реакция на преследование', requiresAuth: true },
  },
  {
    path: '/test/hard/tracking',
    component: HardTrackingTest,
    meta: { ruName: 'Сложная реакция на преследование', requiresAuth: true },
  },
  {
    path: '/test/cognitive/numerical',
    component: NumericalSeriesTest,
    meta: { ruName: 'Числовые закономерности', requiresAuth: true },
  },
  {
    path: '/test/cognitive/stroop',
    component: StroopTest,
    meta: { ruName: 'Тест Струпа', requiresAuth: true },
  },
  {
    path: '/test/cognitive/verbal',
    component: VerbalTest,
    meta: { ruName: 'Вербальное восприятие', requiresAuth: true },
  },

  {
    path: '/test/settings/:testTypeId',
    component: SelectSettingsPage,
    meta: { ruName: 'Настройки теста', requiresAuth: true },
    props: true,
  },
  {
    path: '/test/results/:testTypeId/:testId',
    component: TestResultsPage,
    meta: { ruName: 'Результаты прохождения теста', requiresAuth: true },
    props: true,
  },
]

const routes = [
  ...authRoutes,
  ...professionRoutes,
  ...testBlockRoutes,
  ...testRoutes,
  {
    path: '/',
    component: ProfessionsList,
    meta: { ruName: 'Главная' },
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
    path: '/tests',
    component: TestsCatalogPage,
    meta: { ruName: 'Доступные тесты', requiresAuth: true },
  },
  {
    path: '/:catchAll(.*)*',
    component: NotFound,
    name: 'NotFound',
    meta: { ruName: 'Страница не найдена' },
  },
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
