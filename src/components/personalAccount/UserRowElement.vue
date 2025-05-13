<script lang="ts">
import CommonButton from '../UI/CommonButton.vue';

export default {
  name: 'UserRowElement',
  components: { CommonButton },
  emits: ['removeUser', 'applyUser'],
  props: {
    disabled: Boolean,
    selected: Boolean,
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
      buttonClass: 'submit_button',
    };
  },
  computed: {
    added() {
      return this.selected
    },
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
    <a class="wrapper-block user-email" :href="`mailto:${userEmail}`">{{ userEmail }}</a>
    <CommonButton :disabled="disabled" class="user-button" :class="buttonClass" @click="applyTest">
      <template v-slot:placeholder>{{ buttonText }}</template>
    </CommonButton>
  </div>
</template>

<style scoped>
.user-row-wrapper {
  width: 100%;
  border-radius: 10px;
  padding: 1vh 1vw;
  border: 1px solid var(--input-border);
  background: white;
  display: grid;
  grid-template-columns: 2% 35% 35% 19%;
  align-items: center;
  column-gap: 3%;
  height: 6vh;

  .wrapper-block, .user-button {
    width: 100%;
  }

  .user-email {
    overflow-x: hidden;
    text-overflow: ellipsis;
    text-decoration: none;
  }
}

.anonymous {
  grid-template-columns: 64% 26%;
  column-gap: 10%;
  margin-top: 2vw;
  white-space: nowrap;
  .user-id, .user-email {
    display: none;
  }
}
</style>
