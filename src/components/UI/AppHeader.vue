<script lang="ts">
import {useDevice} from "../../utils/MobileDetector.ts";
import AppHeaderDesktop from "./desktop/AppHeaderDesktop.vue";
import AppHeaderMobile from "./mobile/AppHeaderMobile.vue";

export default {
  components: {AppHeaderMobile, AppHeaderDesktop},
  data() {
    const isMobile = useDevice().isMobile;
    return {isMobile};
  }
}
</script>

<template>
  <AppHeaderDesktop v-if="!isMobile"/>
  <AppHeaderMobile v-else/>
</template>