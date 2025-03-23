<script lang="ts">
import CommonButton from "../CommonButton.vue";
import eventBus from "../../../store/eventBus/event-bus.ts";

export default {
  name: "UserManagerElementMobile",
  computed: {
    eventBus() {
      return eventBus
    }
  },
  components: {CommonButton},
  props: {
    isDisabled: {
      type: Boolean,
      default: false,
    },
  }
}
</script>

<template>
  <div class="wrapper" ref="reference">
    <div class="field" id="id">
      <span class="bold-text">User ID: </span>
      <slot name="id">12345</slot>
    </div>
    <div class="field" id="username">
      <span class="bold-text">Username: </span>
      <slot name="username">Ivanov Ivan Ivanovich</slot>
    </div>
    <div class="field" id="gender">
      <span class="bold-text">Gender: </span>
      <slot name="gender">M</slot>
    </div>
    <div class="field" id="age">
      <span class="bold-text">Age: </span>
      <slot name="age">35</slot>
    </div>
    <div class="field" id="email">
      <span class="bold-text">Email: </span>
      <slot name="email">example@mail.com</slot>
    </div>
    <div class="field">
      <span class="bold-text">Role: </span>
      <slot name="role">NULL</slot>
    </div>
    <div class="change-role-btn">
      <CommonButton
          @click="eventBus.emit('editUserRole', $event.currentTarget)"
          :disabled="isDisabled"
          class="btn"
      >
        <template v-slot:placeholder>
          <slot name="placeholder">
            Изменить роль
          </slot>
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
  justify-content: center;
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

.bold-text {
  font-weight: bold;
}

.change-role-btn {
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