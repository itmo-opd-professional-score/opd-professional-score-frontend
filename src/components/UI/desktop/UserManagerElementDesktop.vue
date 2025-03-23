<script lang="ts">
import CommonButton from "../CommonButton.vue";
import eventBus from "../../../store/eventBus/event-bus.ts";

export default {
  name: "UserManagerElementDesktop",
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
    <div class="id" id="id">
      #<slot name="id">12345</slot>
    </div>
    <div class="username" id="username">
      <slot name="username">Ivanov Ivan Ivanovich</slot>
    </div>
    <div class="gender" id="gender">
      <slot name="gender">M</slot>
    </div>
    <div class="age" id="age">
      <slot name="age">35</slot>
    </div>
    <div class="email" id="email">
      <slot name="email">example@mail.com</slot>
    </div>
    <div class="role">
      <slot name="role">NULL</slot>
    </div>
    <div class="changeRole">
      <CommonButton
          @click="eventBus.emit('editUserRole', $event.currentTarget)"
          :disabled="isDisabled"
          class="btn"
      >
        <template v-slot:placeholder>
          <slot name="placeholder">Button name</slot>
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
  padding: 0 1rem;
  justify-content: center;
  align-items: center;
  align-content: center;
  display: grid;
  grid-template-columns: 2fr 7fr 3rem 3rem 7fr 3fr 3fr;
}

.wrapper:hover {
  cursor: pointer;
}

.wrapper > div {
  border-right: 1px solid black;
  padding: 0 5px;
  height: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  text-align: center;
}

#id, #username, #email {
  text-align: left;
}

#gender, #age {
  text-align: center;
}

.wrapper > div:last-child {
  border-right: none;
  padding: 5px;
  height: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  text-align: center;
}

.changeRole {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>