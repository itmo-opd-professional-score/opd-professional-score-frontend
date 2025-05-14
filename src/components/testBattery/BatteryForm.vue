<script setup lang="ts">
import { ref } from 'vue';
import CustomInput from '../UI/inputs/CustomInput.vue';
import CommonButton from '../UI/CommonButton.vue';
import { TestBatteryResolver } from '../../api/resolvers/testBattery/test-battery.resolver.ts';
import type {
  CreateTestBatteryInputDto
} from '../../api/resolvers/testBattery/dto/input/create-test-battery-input.dto.ts';
import CustomTextareaInput from '../UI/inputs/CustomTextareaInput.vue';

const props = defineProps<{
  currentBattery: CreateTestBatteryInputDto,
  batteryId?: number
}>()
const emits = defineEmits(['createOrUpdate', 'delete', 'closeModal'])

const currentBattery = ref<CreateTestBatteryInputDto>(props.currentBattery)

const createOrUpdateBattery = async () => {
  let batteryId = props.batteryId
  if (batteryId) {
    await new TestBatteryResolver().updateById({
      testBatteryId: batteryId,
      updatedData: currentBattery.value
    })
  } else {
    batteryId = (await new TestBatteryResolver().create(currentBattery.value)).body.id
  }
  emits('createOrUpdate', batteryId)
}

const deleteBattery = async () => {
  if (props.batteryId) {
    await new TestBatteryResolver().deleteById(props.batteryId)
  }
  emits('delete', props.batteryId)
}
</script>

<template>
  <div class="background" @click.self="$emit('closeModal')">
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
        <CommonButton
          :disabled="!currentBattery.description || !currentBattery.name"
          @click="createOrUpdateBattery"
        >
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