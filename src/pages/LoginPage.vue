<script lang="ts">
import {defineComponent} from 'vue'
import {AuthResolver} from "../api/resolvers/auth/auth.resolver.ts";
import type {LoginUserOutputDto} from "../api/resolvers/auth/dto/output/login-user-output.dto.ts";
import LoginDesktop from "./desktop/LoginDesktop.vue";
import {useDevice} from "../utils/MobileDetector.ts";
import eventBus from "../store/eventBus/event-bus.ts";
import type {LoginEvent} from "../store/eventBus/event-bus.types.ts";
import LoginMobile from "./mobile/LoginMobile.vue";

export default defineComponent({
  name: "LoginPage",
  components: {LoginMobile, LoginDesktop},
  data() {
    const authResolver = new AuthResolver();
    const isMobile = useDevice().isMobile;

    return {
      authResolver,
      isMobile,
    }
  },
  methods: {
    login(body: LoginEvent) {
      const data: LoginUserOutputDto = {
        email: body.email,
        password: body.password
      };
      this.authResolver.login(data)
    }
  },
  mounted() {
    eventBus.on("login", (body: LoginEvent) => this.login(body));
  },
  unmounted() {
    eventBus.off("login");
  }
})
</script>

<template>
  <LoginDesktop v-if="!isMobile"/>
  <LoginMobile v-else/>
</template>

<style scoped>
</style>