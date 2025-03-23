<script lang="ts">
import UserManagerElementDesktop from "./desktop/UserManagerElementDesktop.vue";
import {useDevice} from "../../utils/MobileDetector.ts";
import UserManagerElementMobile from "./mobile/UserManagerElementMobile.vue";

export default {
  name: "UserManagerElement",
  components: {UserManagerElementMobile, UserManagerElementDesktop},
  data() {
    const isMobile = useDevice().isMobile;
    return {isMobile};
  }
}
</script>

<template>
  <UserManagerElementDesktop v-if="!isMobile"/>
  <UserManagerElementMobile v-else/>
</template>