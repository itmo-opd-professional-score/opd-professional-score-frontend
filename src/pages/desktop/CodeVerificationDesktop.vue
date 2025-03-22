<script lang="ts">
import CustomInput from "../../components/UI/inputs/CustomInput.vue";
import CommonButton from "../../components/UI/CommonButton.vue";
import eventBus from "../../store/event-bus.ts";

export default {
  name: "CodeVerificationDesktop",
  components: {CommonButton, CustomInput},
  data() {
    return {
      currentCode: "",
    }
  },
  methods: {
    sendCode() {
      eventBus.emit("sendCode");
    },
    approveCode() {
      eventBus.emit("approveCode", this.currentCode);
    }
  }
}
</script>

<template>
  <div class="container">
    <h1 class="header">
      <slot name="header">Подтверждение электронной почты</slot>
    </h1>

    <div class="input">
      <CustomInput :type="'number'" v-model="currentCode" :min-number="0" :max-number="999999" :max-length="6"
                   :placeholder="'Введите код с почты'"/>
    </div>

    <div class="code-links-container">
      <p @click="sendCode">Отправить код еще раз</p>
    </div>

    <CommonButton class="button" @click="approveCode">
      <template v-slot:placeholder>Подтвердить</template>
    </CommonButton>
  </div>
</template>

<style scoped>
.container {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  background-color: white;
  padding: 1.5rem;
  border-radius: 10px;
}

.input {
  width: 100%;
  height: 2rem;
}

.button, .button:hover {
  width: 100%;
  background-color: #4127e4;
  color: white;
}

.code-links-container {
  display: flex;
  width: 100%;
  justify-content: left;
  font-size: 90%;

  p {
    border-bottom: 1px solid #0d6efd;
    color: #0d6efd;
  }
}

.code-links-container:hover {
  cursor: pointer;
}
</style>