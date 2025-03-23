<script lang="ts">
import {useDevice} from "../../utils/MobileDetector.ts";
import TestManagerElementDesktop from "./desktop/TestManagerElementDesktop.vue";
import TestManagerElementMobile from "./mobile/TestManagerElementMobile.vue";

export default {
  name: "TestManagerElement",
  components: {TestManagerElementMobile, TestManagerElementDesktop},
  data() {
    const isMobile = useDevice().isMobile;
    return {isMobile}
  }
}
</script>

<template>
  <TestManagerElementDesktop v-if="!isMobile"/>
  <TestManagerElementMobile v-else/>
</template>