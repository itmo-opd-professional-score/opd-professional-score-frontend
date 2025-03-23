<script lang="ts">
import {defineComponent} from 'vue'
import RegistrationDesktop from "./desktop/RegistrationDesktop.vue";
import {useDevice} from "../utils/MobileDetector.ts";
import type {RegUserFirstStepOutputDto} from "../api/resolvers/auth/dto/output/reg-user-first-step-output.dto.ts";
import {AuthResolver} from "../api/resolvers/auth/auth.resolver.ts";
import type {RegisterFirstStepEvent, RegisterSecondStepEvent} from "../store/eventBus/event-bus.types.ts";
import eventBus from "../store/eventBus/event-bus.ts";
import type {RegUserSecondStepOutputDto} from "../api/resolvers/auth/dto/output/reg-user-second-step-output.dto.ts";
import RegistrationMobile from "./mobile/RegistrationMobile.vue";

export default defineComponent({
  name: "RegistrationPage",
  components: {RegistrationMobile, RegistrationPageDesktop: RegistrationDesktop},
  data() {
    const isMobile = useDevice().isMobile;
    const authResolver = new AuthResolver();
    return {
      step: 1,
      isMobile,
      authResolver,
    }
  },
  methods: {
    registerFirstStep(body: RegisterFirstStepEvent) {
      const data: RegUserFirstStepOutputDto = {
        email: body.email,
        username: body.username,
      }

      this.authResolver.registrationFirstStep(data).then((res) => {
        if (res) this.step = 2
      })
    },
    registerSecondStep(body: RegisterSecondStepEvent) {
      const data: RegUserSecondStepOutputDto = {
        userData: {
          username: body.username,
          email: body.email,
          password: body.password,
        },
        code: body.code
      }
      this.authResolver.registrationSecondStep(data);
    },
  },
  mounted() {
    eventBus.on("registerFirstStep", (body: RegisterFirstStepEvent) => this.registerFirstStep(body));
    eventBus.on("registerSecondStep", (body: RegisterSecondStepEvent) => this.registerSecondStep(body));
  },
  unmounted() {
    eventBus.off("registerFirstStep");
  }
})
</script>

<template>
  <RegistrationPageDesktop :step="step" v-if="!isMobile"/>
  <RegistrationMobile :step="step" v-else/>
</template>