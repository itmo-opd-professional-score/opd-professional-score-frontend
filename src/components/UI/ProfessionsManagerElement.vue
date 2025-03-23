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
  <ProfessionsManagerElementDesktop :id="id" v-if="!isMobile">
    <template v-slot:id><slot name="id">12345</slot></template>
    <template v-slot:name><slot name="name">Name</slot></template>
    <template v-slot:description><slot name="description">Description</slot></template>
    <template v-slot:requirements><slot name="requirements">Requirements</slot></template>
    <template v-slot:sphere><slot name="sphere">Sphere</slot></template>
    <template v-slot:placeholder><slot name="placeholder">Изменить</slot></template>
  </ProfessionsManagerElementDesktop>
  <ProfessionsManagerElementMobile :id="id" v-else>
    <template v-slot:id><slot name="id">12345</slot></template>
    <template v-slot:name><slot name="name">Name</slot></template>
    <template v-slot:description><slot name="description">Description</slot></template>
    <template v-slot:requirements><slot name="requirements">Requirements</slot></template>
    <template v-slot:sphere><slot name="sphere">Sphere</slot></template>
    <template v-slot:placeholder><slot name="placeholder">Изменить</slot></template>
  </ProfessionsManagerElementMobile>
</template>