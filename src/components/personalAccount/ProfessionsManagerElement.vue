<script setup lang="ts">
import CommonButton from '../UI/CommonButton.vue';
import { onMounted, ref } from 'vue';
import { ProfessionStatisticResolver } from '../../api/resolvers/professionStatistic/professionStatistic.resolver.ts';
import { UserRole } from '../../utils/userState/UserState.types.ts';
import { UserState } from '../../utils/userState/UserState.ts';
const props = defineProps<{ id: number }>();
defineEmits(['edit-profession']);

const noStats = ref(true);

onMounted(async () => {
  const profStatsResolver = new ProfessionStatisticResolver();
  const stats = await profStatsResolver.getProfessionStatistics(props.id);
  if (stats.length > 0) {
    noStats.value = false;
  }
});
</script>

<template>
  <div class="wrapper">
    <div class="id" id="id">
      #
      <slot name="id">12345</slot>
    </div>
    <a class="prof_name" id="test_name" :href="`/profession/${id}`">
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
        @click="$emit('edit-profession', $event.currentTarget)"
        :disabled="false"
        v-if="noStats || UserState.role == UserRole.ADMIN"
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
  width: 100%;
  padding: 1vw;
  justify-content: center;
  align-items: center;
  display: grid;
  grid-template-columns: 1fr 3fr 6fr 3fr 1fr 1.7fr;
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

#id,
#test_name {
  text-align: left;
}

.wrapper > div:last-child {
  border-right: none;
}
</style>
