<script lang="ts">
import {useDevice} from "../utils/MobileDetector.ts";
import CodeVerificationDesktop from "./desktop/CodeVerificationDesktop.vue";
import CodeVerificationMobile from "./mobile/CodeVerificationMobile.vue";

export default {
  name: "CodeVerification",
  components: {CodeVerificationMobile, CodeVerificationDesktop},
  data() {
    const isMobile = useDevice().isMobile;
    return { isMobile }
  }
}
</script>

<template>
  <CodeVerificationDesktop v-if="!isMobile"/>
  <CodeVerificationMobile v-else/>
</template>

<style scoped>
</style>