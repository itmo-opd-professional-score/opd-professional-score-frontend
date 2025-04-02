<script lang="ts">
import CommonButton from "./UI/CommonButton.vue";

export default {
  name: 'TestRowElement',
  components: {CommonButton},
  emits: ["removeTest", "applyTest"],
  props: {
    testName: {
      type: String,
      required: true,
      default: "Введите название теста"
    },
    testMeta: {
      type: String,
      required: true,
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
        this.buttonClass = "remove-test";
        return "Удалить тест";
      } else {
        this.buttonClass = "add-test";
        return "Добавить тест";
      }
    }
  },
  methods: {
    applyTest() {
      this.added ? this.$emit("removeTest", this.testMeta) : this.$emit("applyTest", this.testMeta);
      this.added = !this.added;
    }
  }
}
</script>

<template>
  <div class="wrapper">
    <p class="wrapper-block test-name"> {{testName}} </p>
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

.add-test, .add-test:hover {
  background-color: #4127e4;
  color: white;
}

.remove-test, .remove-test:hover {
  background-color: #e13a3a;
}
</style>