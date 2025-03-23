<script lang="ts">
import {ProfessionStatisticResolver} from "../../../api/resolvers/professionStatistic/professionStatistic.resolver.ts";
import CommonButton from "../CommonButton.vue";
import eventBus from "../../../store/eventBus/event-bus.ts";

export default {
  name: 'ProfessionsManagerElementMobile',
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
  <div class="wrapper">
    <div class="field" id="id" @click="$router.push(`/profession/${id}`)">
      <span class="bold-text">Profession ID: </span>
      <slot name="id">12345</slot>
    </div>
    <div class="field" id="prof_name" @click="$router.push(`/profession/${id}`)">
      <span class="bold-text">Name: </span>
      <slot name="field">Lorem ipsum dolor sit amet.</slot>
    </div>
    <div class="field" @click="$router.push(`/profession/${id}`)">
      <span class="bold-text">Description: </span>
      <slot name="description">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos tempore, tenetur. Cumque
        fugiat ipsum minima omnis perferendis placeat qui quisquam sapiente. Dignissimos hic incidunt quas repudiandae
        saepe similique? Dignissimos incidunt labore quaerat quo? Accusamus aperiam beatae distinctio neque odit
        reiciendis sequi tempore? Accusantium amet at doloribus harum, minima temporibus veritatis?
      </slot>
    </div>
    <div class="field" @click="$router.push(`/profession/${id}`)">
      <span class="bold-text">Requirements: </span>
      <slot name="requirements">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate dicta, ipsum
        officia qui veritatis voluptate.
      </slot>
    </div>
    <div class="field" @click="$router.push(`/profession/${id}`)">
      <span class="bold-text">Sphere: </span>
      <slot name="sphere">IT</slot>
    </div>
    <div class="change-profession">
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
  display: flex;
  flex-direction: column;
  justify-content: left;
  align-items: center;
  padding: 1rem;
  gap: 0.5rem;
}

.wrapper:hover {
  cursor: pointer;
}

.field {
  width: 100%;
}

#id, #prof_name {
  text-align: left;
}

.bold-text {
  font-weight: bold;
}

.change-profession {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.btn {
  width: 100%;
  height: calc(1rem + 0.4rem);
  padding: 0.2rem 0;
}
</style>