<script lang="ts">
import {UserResolver} from "../api/resolvers/user/user.resolver.ts";
import {usePopupStore} from "../store/popup.store.ts";
import {AuthResolver} from "../api/resolvers/auth/auth.resolver.ts";
import {useDevice} from "../utils/MobileDetector.ts";
import PasswordChangingDesktop from "./desktop/PasswordChangingDesktop.vue";
import PasswordChangingMobile from "./mobile/PasswordChangingMobile.vue";

export default {
  name: 'PasswordChangingPage',
  components: {PasswordChangingMobile, PasswordChangingDesktop},
  data() {
    const userResolver = new UserResolver();
    const authResolver = new AuthResolver();
    const isMobile = useDevice().isMobile;
    const popupStore = usePopupStore();

    return {
      userResolver,
      authResolver,
      isMobile,
      popupStore,
    }
  },
}

</script>

<template>
  <PasswordChangingDesktop v-if="!isMobile"/>
  <PasswordChangingMobile v-else/>
</template>

<style scoped>

</style>