<script lang="ts">
import {useDevice} from "../utils/MobileDetector.ts";
import PasswordChangingDesktop from "./desktop/PasswordChangingDesktop.vue";
import PasswordChangingMobile from "./mobile/PasswordChangingMobile.vue";

export default {
  name: 'PasswordChangingPage',
  components: {PasswordChangingMobile, PasswordChangingDesktop},
  data() {
    const isMobile = useDevice().isMobile;

    return {isMobile}
  },
}

</script>

<template>
  <PasswordChangingDesktop v-if="!isMobile"/>
  <PasswordChangingMobile v-else/>
</template>

<style scoped>

</style>