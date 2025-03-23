<script lang="ts">
import {useDevice} from "../../../utils/MobileDetector.ts";
import ErrorPopupDesktop from "./desktop/ErrorPopupDesktop.vue";
import ErrorPopupMobile from "./mobile/ErrorPopupMobile.vue";

export default {
  name: 'ErrorPopup',
  components: {ErrorPopupMobile, ErrorPopupDesktop},
  data() {
    const isMobile = useDevice().isMobile;
    return {
      isMobile: isMobile,
    }
  },
}

</script>

<template>
  <ErrorPopupDesktop v-if="!isMobile"/>
  <ErrorPopupMobile v-else/>
</template>