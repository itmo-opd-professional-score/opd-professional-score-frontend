<script lang="ts">
import {useDevice} from "../../../utils/MobileDetector.ts";
import InfoPopupDesktop from "./desktop/InfoPopupDesktop.vue";
import InfoPopupMobile from "./mobile/InfoPopupMobile.vue";

export default {
  name: 'InfoPopup',
  components: {InfoPopupMobile, InfoPopupDesktop},
  data() {
    const isMobile = useDevice().isMobile;
    return {isMobile}
  }
}

</script>

<template>
  <InfoPopupDesktop v-if="!isMobile"/>
  <InfoPopupMobile v-else/>
</template>