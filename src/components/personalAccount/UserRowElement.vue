<script lang="ts">
import CommonButton from '../UI/CommonButton.vue';

export default {
  name: 'UserRowElement',
  components: { CommonButton },
  emits: ['removeUser', 'applyUser'],
  props: {
    disabled: Boolean,
    userName: {
      type: String,
      required: true,
      default: 'username',
    },
    userId: {
      type: Number,
      required: true,
      default: '1',
    },
    userEmail: {
      type: String,
      required: true,
      default: 'test@mail.ru',
    },
  },
  data() {
    return {
      added: false,
      buttonClass: 'submit_button',
    };
  },
  computed: {
    buttonText() {
      if (this.added) {
        this.buttonClass = 'logout_button';
        return 'Удалить';
      } else {
        this.buttonClass = 'submit_button';
        return 'Добавить';
      }
    },
  },
  methods: {
    applyTest() {
      this.added
        ? this.$emit('removeUser', this.userId)
        : this.$emit('applyUser', this.userId);
      this.added = !this.added;
    },
  },
};
</script>

<template>
  <div class="user-row-wrapper">
    <p class="wrapper-block user-id">{{ userId }}</p>
    <p class="wrapper-block user-name">{{ userName }}</p>
    <p class="wrapper-block user-email">{{ userEmail }}</p>
    <CommonButton :disabled="disabled" class="user-button" :class="buttonClass" @click="applyTest">
      <template v-slot:placeholder>{{ buttonText }}</template>
    </CommonButton>
  </div>
</template>

<style scoped>
.user-row-wrapper {
  width: 100%;
  padding: 1vh 1vw;
  border-radius: 10px;
  border: 1px solid var(--input-border);
  background: white;
  display: grid;
  grid-template-columns: 4% 16% 44% 26%;
  align-items: center;
  justify-items: center;
  gap: 2vh;
  max-height: 8vh;

  .wrapper-block, .user-button {
    width: 100%;
  }
}

.anonymous {
  grid-template-columns: 64% 26%;
  gap: 6vh;
  margin-top: 2vw;
  white-space: nowrap;
  .user-id, .user-email {
    display: none;
  }
}
</style>
