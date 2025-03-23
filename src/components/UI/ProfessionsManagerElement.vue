<script lang="ts">
import {useDevice} from "../../utils/MobileDetector.ts";
import ProfessionsManagerElementDesktop from "./desktop/ProfessionsManagerElementDesktop.vue";
import eventBus from "../../store/eventBus/event-bus.ts";
import ProfessionsManagerElementMobile from "./mobile/ProfessionsManagerElementMobile.vue";

export default {
  name: "ProfessionsManagerElement",
  components: {ProfessionsManagerElementMobile, ProfessionsManagerElementDesktop},
  emits: ["edit-profession"],
  props: {
    id: {
      type: Number,
      required: true,
      default: 0,
    }
  },
  data() {
    const isMobile = useDevice().isMobile;
    return {isMobile};
  },
  mounted() {
    eventBus.on("editProfession", (event) => this.$emit('edit-profession', event));
  }
}
</script>

<template>
  <ProfessionsManagerElementDesktop :id="id" v-if="!isMobile"/>
  <ProfessionsManagerElementMobile :id="id" v-else/>
</template>