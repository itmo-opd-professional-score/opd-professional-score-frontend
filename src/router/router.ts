import {createRouter, createWebHistory} from "vue-router";
import PersonalAccount from "../pages/PersonalAccount.vue";
import {UserState} from "../utils/userState/UserState.ts";
import ProfessionsList from "../components/ProfessionsList.vue";
import ProfessionPage from "../pages/ProfessionPage.vue";
import ProfessionForm from "../components/ProfessionForm.vue";
import PvkSetupPage from "../pages/PvkSetupPage.vue";
import PasswordChanging from "../pages/PasswordChanging.vue";
import LogInPage from "../pages/LogInPage.vue";
import RegistrationPage from "../pages/RegistrationPage.vue";
import SimpleSoundTest from "../pages/SimpleSoundTest.vue";
import PersonalAccountChanging from "../pages/PersonalAccountChanging.vue";
import SoundHardTest from "../pages/tests/sound/hard/SoundHardTest.vue";
import TestMapper from "../pages/tests/TestMapper.vue";

const routes = [
  {
    path: '/',
    component: ProfessionsList,
    meta: {ruName: "Главная"}
  },
  {
    path: '/professions',
    component: ProfessionsList,
    meta: {ruName: "Профессии"}
  },
  {
    path: `/profession/new`,
    component: ProfessionForm,
    meta: {requiresAuth: true, ruName: "Новая профессия"}
  },
  {
    path: `/profession/setup/:professionId`,
    component: PvkSetupPage,
    meta: {requiresAuth: true, ruName: "Установка ПВК"},
    props: true
  },
  {
    path: `/profession/:id`,
    component: ProfessionPage,
    props: true,
    meta: {ruName: "Профессия "}
  },
  {
    path: '/profile',
    component: PersonalAccount,
    meta: {requiresAuth: true, ruName: "Профиль"}
  },
  {
    path: `/profile/change`,
    component: PersonalAccountChanging,
    meta: {requiresAuth: true, ruName: "Изменение профиля"}
  },
  {
    path: '/auth/login',
    component: LogInPage,
    meta: {ruName: "Вход"}
  },
  {
    path: '/auth/registration',
    component: RegistrationPage,
    meta: {ruName: "Регистрация"}
  },
  {
    path: '/auth/changePassword',
    component: PasswordChanging,
    meta: {ruName: "Изменение пароля"}
  },
  {
    path: '/test/sound/simple',
    component: SimpleSoundTest,
    meta: {ruName: "Простой звуковой тест", requiresAuth: true}
  },
  {
    path: `/test/addition/sound`,
    component: SoundHardTest,
    meta: {requiresAuth: true, ruName: "Оценка скорости реакции на сложный звуковой сигнал - сложение в уме"}
  },
  {
    path: `/invitation/test/:token`,
    props: true,
    component: TestMapper,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


router.beforeEach((to, _, next) => {
  if ((to.meta.requiresAuth && UserState.status != "authorized")) {
    next({path: '/auth/login/'})
  } else {
    next()
  }

  document.title = to.meta.ruName ? `${to.meta.ruName} | OPD Professional Score` : `OPD Professional Score`;
})


export default router;