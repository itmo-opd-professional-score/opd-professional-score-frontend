<script lang="ts">
import CommonButton from './UI/CommonButton.vue';
import CustomSelect from './UI/inputs/CustomSelect.vue';
import { TestSetupsResolver } from '../api/resolvers/testSetup/test-setups.resolver.ts';
import router from '../router/router.ts';

export default {
  name: 'TestRowElement',
  components: { CustomSelect, CommonButton },
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
    testTypeId: Number,
  },
  data() {
    return {
      added: false,
      buttonClass: 'submit_button',
      setups: [] as { value: string; text: string }[],
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
    router() {
      return router
    },
    applyTest() {
      this.added
        ? this.$emit('removeTest', this.testMeta)
        : this.$emit('applyTest', this.testMeta);
      this.added = !this.added;
    },
  },
  async mounted() {
    if (this.testTypeId) {
      const presets = await new TestSetupsResolver().getAllByTestTypeId(this.testTypeId)
      presets.forEach((preset) => {
        this.setups.push({
          value: preset.id.toString(),
          text: `Конфиг №${preset.id}`,
        });
      })
    }
  },
};
</script>

<template>
  <div class="wrapper">
    <p class="wrapper-block test-name">{{ testName }}</p>
    <div class="buttons">
      <CustomSelect
        v-if="setups.length > 0"
        :options="setups"
        class="select"
      />
      <CommonButton
        v-if="testTypeId"
        @click="router().push(`/test/settings/${testTypeId}`)"
        class="submit_button btn"
      >
        <template v-slot:placeholder>Настроить</template>
      </CommonButton>
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
  </div>
</template>

<style scoped>
.wrapper {
  width: 100%;
  border-radius: 10px;
  padding: 1vh;
  border: 1px solid var(--input-border);
  background: white;
  display: grid;
  grid-template-columns: 30% auto;
  align-items: center;
  column-gap: 3%;
  height: 8vh;
  .buttons {
    display: flex;
    gap: 1vw;
    justify-content: flex-end;

    .btn, .select {
      max-width: 30%;
      display: flex;
      justify-content: center;
      height: 100%;
    }
  }
}
</style>
