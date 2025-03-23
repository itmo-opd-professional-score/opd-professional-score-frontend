<script setup lang="ts">
import {useDevice} from "../../utils/MobileDetector.ts";
import FlipCardDesktop from "./desktop/FlipCardDesktop.vue";
import FlipCardMobile from "./mobile/FlipCardMobile.vue";

const isMobile = useDevice().isMobile;

defineProps<{
  id: number,
  title: string,
  description: string,
  requirements: string,
  sphere: string,
  icon?: string,
}>();
</script>

<template>
  <FlipCardDesktop :id="id"
                   :title="title"
                   :description="description"
                   :requirements="requirements"
                   :sphere="sphere"
                   v-if="!isMobile"
  />
  <FlipCardMobile :id="id"
                  :title="title"
                  :description="description"
                  :requirements="requirements"
                  :sphere="sphere"
                  v-else
  />
</template>