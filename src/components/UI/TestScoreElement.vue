<script lang="ts">
import {useDevice} from "../../utils/MobileDetector.ts";
import TestScoreElementDesktop from "./desktop/TestScoreElementDesktop.vue";
import TestScoreElementMobile from "./mobile/TestScoreElementMobile.vue";

export default {
  name: 'TestScoreElement',
  components: {TestScoreElementMobile, TestScoreElementDesktop},
  data() {
    const isMobile = useDevice().isMobile;
    return {isMobile}
  }
}
</script>

<template>
  <TestScoreElementDesktop v-if="!isMobile"/>
  <TestScoreElementMobile v-else/>
</template>