<script setup lang="ts">
import { ref } from 'vue';
import CustomInput from '../UI/inputs/CustomInput.vue';
import CommonButton from '../UI/CommonButton.vue';
import { TestBatteryResolver } from '../../api/resolvers/testBattery/test-battery.resolver.ts';
import type {
  CreateTestBatteryInputDto
} from '../../api/resolvers/testBattery/dto/input/create-test-battery-input.dto.ts';
import CustomTextareaInput from '../UI/inputs/CustomTextareaInput.vue';
import type { LocalTestBlock } from './types';

const props = defineProps<{
  currentBattery: CreateTestBatteryInputDto,
  batteryId?: number
}>()
const emits = defineEmits(['closeModal', 'deleteBattery'])

const currentBattery = ref<CreateTestBatteryInputDto>(props.currentBattery)

const createOrUpdateBattery = async () => {
  if (props.batteryId) {
    await new TestBatteryResolver().updateById({
      testBatteryId: props.batteryId,
      updatedData: currentBattery.value
    })
  } else {
    const batteryId = (await new TestBatteryResolver().create(currentBattery.value)).body.id
    const localTestBlockCash = localStorage.getItem('localTestBlock');
    if (localTestBlockCash) {
      const localTestBlock = JSON.parse(localTestBlockCash) as LocalTestBlock;
      localTestBlock.testBatteryId = batteryId
      localStorage.setItem('localTestBlock', JSON.stringify(localTestBlock))
    }
  }
  emits('closeModal')
}

const deleteBattery = async () => {
  if (props.batteryId) {
    const localTestBlockCash = localStorage.getItem('localTestBlock');
    if (localTestBlockCash) {
      const localTestBlockId = JSON.parse(localTestBlockCash).testBatteryId
      if (localTestBlockId === props.batteryId) localStorage.removeItem("localTestBlock");
    }
    await new TestBatteryResolver().deleteById(props.batteryId)
  }
  emits('closeModal')
  emits('deleteBattery')
}
</script>

<template>
  {{currentBattery}}
  <div class="background">
    <div class="container">
      <div class="inputs">
        <CustomInput
          type="text"
          v-model="currentBattery.name"
          placeholder="Название батареи тестов"
          required
        />
        <CustomTextareaInput
          v-model="currentBattery.description"
          placeholder="Описание батареи тестов"
          required
        />
      </div>
      <div class="buttons">
        <CommonButton @click="deleteBattery" v-if="batteryId">
          <template #placeholder>Удалить</template>
        </CommonButton>
        <CommonButton @click="createOrUpdateBattery">
          <template #placeholder>{{ batteryId ? 'Обновить' : 'Сохранить' }}</template>
        </CommonButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(32, 46, 66, 0.75);
    z-index: 5;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .container {
    background-color: white;
    padding: 2vw;
    width: 50vw;
    border-radius: 10px;

    .buttons {
      display: flex;
      justify-content: space-between;
      gap: 2vw;
      margin-top: 2vw;

      button {
        width: 100%;
      }
    }
  }
</style>