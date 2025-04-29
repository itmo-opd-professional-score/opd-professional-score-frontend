<script lang="ts">
import CommonButton from './UI/CommonButton.vue';

export default {
  name: 'TestRowElement',
  components: { CommonButton },
  emits: ['removeTest', 'applyTest'],
  props: {
    testName: {
      type: String,
      required: true,
      default: 'Введите название теста',
    },
    testMeta: {
      type: String,
      required: true,
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
        ? this.$emit('removeTest', this.testMeta)
        : this.$emit('applyTest', this.testMeta);
      this.added = !this.added;
    },
  },
};
</script>

<template>
  <div class="wrapper">
    <p class="wrapper-block test-name">{{ testName }}</p>
    <CommonButton
      class="wrapper-block btn"
      :class="buttonClass"
      @click="applyTest"
    >
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

.btn,
.btn:hover {
  width: 20%;
}
</style>
