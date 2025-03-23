<script lang="ts">
import {useDevice} from "../../utils/MobileDetector.ts";
import ChangeProfessionElementDesktop from "./desktop/ChangeProfessionElementDesktop.vue";
import eventBus from "../../store/eventBus/event-bus.ts";
import ChangeProfessionElementMobile from "./mobile/ChangeProfessionElementMobile.vue";

export default {
  name: "ProfessionsManagerElement",
  emits: ["edit-profession"],
  components: {ChangeProfessionElementMobile, ChangeProfessionElementDesktop},
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
  <ChangeProfessionElementDesktop :id="id" v-if="!isMobile"/>
  <ChangeProfessionElementMobile :id="id" v-else/>
</template>