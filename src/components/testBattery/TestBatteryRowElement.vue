<script lang="ts">
import CommonButton from '../UI/CommonButton.vue';
import CustomSelect from '../UI/inputs/CustomSelect.vue';
import type { PropType } from 'vue';
import type { TestBatteryOutputDto } from '../../api/resolvers/testBattery/dto/output/test-battery-output.dto.ts';

export default {
  name: 'TestBatteryRowElement',
  components: { CustomSelect, CommonButton },
  emits: ['selectBattery', 'editBattery'],
  props: {
    testBattery: {
      type: {} as PropType<TestBatteryOutputDto>,
      required: true,
    },
  },
};
</script>

<template>
  <div class="wrapper">
    <p class="wrapper-block test-name">{{ testBattery.name }}</p>
    <div class="buttons">
      <CommonButton
        class="wrapper-block btn submit_button"
        @click="$emit('editBattery', testBattery)"
      >
        <template v-slot:placeholder>Изменить</template>
      </CommonButton>
      <CommonButton
        class="wrapper-block btn submit_button"
        @click="$emit('selectBattery', testBattery)"
      >
        <template v-slot:placeholder>Выбрать</template>
      </CommonButton>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  width: 100%;
  border-radius: 10px;
  padding: 1vh 1vw;
  border: 1px solid var(--input-border);
  background: white;
  display: grid;
  grid-template-columns: 50% 46%;
  align-items: center;
  column-gap: 4%;
  height: 6vh;

  .test-name {
    white-space: nowrap;
    overflow: hidden;
  }
  .buttons {
    display: flex;
    justify-content: flex-end;
    height: 4vh;
    gap: 1vw;

    .btn, .select {
      display: flex;
      height: 100%;
    }

    .btn {
      max-width: calc((100% - 4vh - 2vw) / 2.5);
    }

    .btn.add {
      padding: 0;
      max-width: 4vh;
      svg {
        scale: 45%;
        stroke: white;
        transition: all 0.3s;
        path {
          fill: white;
        }
      }
    }

    .submit_button svg {
      transform: rotate(-45deg) scale(0.8);
    }
  }
}
</style>
