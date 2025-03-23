<script lang="ts">
import {ProfessionStatisticResolver} from "../../../api/resolvers/professionStatistic/professionStatistic.resolver.ts";
import CommonButton from "../CommonButton.vue";
import eventBus from "../../../store/eventBus/event-bus.ts";

export default {
  name: 'ProfessionsManagerElementDesktop',
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
    <div class="id" id="id">#
      <slot name="id">12345</slot>
    </div>
    <a class="prof_name" id="prof_name">
      <slot name="name">Lorem ipsum dolor sit amet.</slot>
    </a>
    <div class="created">
      <slot name="description">Ivanov Ivan Ivanovich</slot>
    </div>
    <div class="created">
      <slot name="requirements">Ivanov Ivan Ivanovich</slot>
    </div>
    <div class="created">
      <slot name="sphere">Ivanov Ivan Ivanovich</slot>
    </div>
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
  width: 95%;
  padding: 1vw;
  justify-content: center;
  align-items: center;
  display: grid;
  grid-template-columns: 1fr 2fr 4fr 3fr 1fr 1fr;
}

.wrapper:hover {
  cursor: pointer;
}

.wrapper > div,
.wrapper > a {
  border-right: 1px solid black;
  padding: 5px;
  height: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  box-sizing: border-box;
  text-decoration: none;
  color: black;
}

#id, #prof_name{
  text-align: left;
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