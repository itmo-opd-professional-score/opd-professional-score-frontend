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
import SimpleSoundTest from "../pages/tests/sound/simple/SimpleSoundTest.vue";
import SimpleSoundTest2 from "../pages/tests/sound/simple/SimpleSoundTest2.vue";

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
    meta: {ruName: "SoundSimpleTest"}
  },  {
    path: '/test/sound/simple2',
    component: SimpleSoundTest2,
    meta: {ruName: "SoundSimpleTest2"}
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


router.beforeEach((to, from, next) => {
  if ((to.meta.requiresAuth && UserState.status != "authorized") || from.meta.requiresAuth && UserState.status != "authorized") {
    next({path: '/auth/login/'})
  } else {
    next()
  }

  document.title = to.meta.ruName ? `${to.meta.ruName} | OPD Professional Score` : `OPD Professional Score`;
})


export default router;