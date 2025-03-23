<script lang="ts">
import {ProfessionStatisticResolver} from "../../../api/resolvers/professionStatistic/professionStatistic.resolver.ts";
import CommonButton from "../CommonButton.vue";
import eventBus from "../../../store/eventBus/event-bus.ts";

export default {
  name: 'ChangeProfessionElementMobile',
  computed: {
    eventBus() {
      return eventBus
    }
  },
  components: {CommonButton},
  props: {
    id: {
      type: Number,
      required: true,
      default: 0,
    }
  },
  data() {
    return {noStats: true}
  },
  async mounted() {
    const profStatsResolver = new ProfessionStatisticResolver();
    const stats = await profStatsResolver.getProfessionStatistics(this.id);
    if (stats.length > 0) {
      this.noStats = false
    }
  }
}
</script>

<template>
  <div class="wrapper" @click="$router.push(`/profession/${id}`)">
    <div class="id" id="id">
      #<slot name="id">12345</slot>
    </div>
    <a class="prof_name" id="name">
      <slot name="name">Lorem ipsum dolor sit amet.</slot>
    </a>
    <div class="changeProfession">
      <CommonButton
          @click="eventBus.emit('editProfession', $event.currentTarget)"
          :disabled="false"
          class="btn"
      >
        <template v-slot:placeholder>
          <slot name="placeholder">Изменить</slot>
        </template>
      </CommonButton>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  background: var(--background-secondary);
  border-radius: 10px;
  width: 90%;
  height: 4rem;
  justify-content: center;
  align-items: center;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
}

.wrapper:hover {
  cursor: pointer;
}

.wrapper > div,
.wrapper > a {
  border-right: 1px solid black;
  padding: 0 5px;
  height: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  box-sizing: border-box;
  text-decoration: none;
  color: black;
}

#id, #name{
  text-align: center;
}

.wrapper > div:last-child {
  border-right: none;
}

.changeProfession {
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn {
  display: flex;
  text-align: center;
}
</style>