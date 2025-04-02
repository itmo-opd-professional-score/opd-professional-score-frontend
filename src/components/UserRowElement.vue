<script lang="ts">
import CommonButton from "./UI/CommonButton.vue";

export default {
  name: 'UserRowElement',
  components: {CommonButton},
  emits: ["removeUser", "applyUser"],
  props: {
    userName: {
      type: String,
      required: true,
      default: "username"
    },
    userId: {
      type: Number,
      required: true,
      default: "1"
    },
    userEmail: {
      type: String,
      required: true,
      default: "test@mail.ru"
    }
  },
  data() {
    return {
      added: false,
      buttonClass: "add-test"
    }
  },
  computed: {
    buttonText() {
      if (this.added) {
        this.buttonClass = "remove-user";
        return "Удалить";
      } else {
        this.buttonClass = "add-user";
        return "Добавить";
      }
    }
  },
  methods: {
    applyTest() {
      this.added ? this.$emit("removeUser", this.userId) : this.$emit("applyUser", this.userId);
      this.added = !this.added;
    }
  }
}
</script>

<template>
  <div class="wrapper">
    <p class="wrapper-block user-id"> {{ userId }} </p>
    <p class="wrapper-block user-name"> {{ userName }} </p>
    <p class="wrapper-block user-email"> {{ userEmail }} </p>
    <CommonButton class="wrapper-block btn" :class="buttonClass" @click="applyTest">
      <template v-slot:placeholder>
        {{ buttonText }}
      </template>
    </CommonButton>
  </div>
</template>

<style scoped>
.wrapper {
  width: 100%;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  border: 1px solid var(--input-border);
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn, .btn:hover {
  width: 20%;
  background-color: #4127e4;
  color: white;
}

.add-user, .add-user:hover {
  background-color: #4127e4;
  color: white;
}

.remove-user, .remove-user:hover {
  background-color: #e13a3a;
}
</style>