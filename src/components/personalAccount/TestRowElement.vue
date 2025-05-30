<script lang="ts">
import CommonButton from '../UI/CommonButton.vue';
import CustomSelect from '../UI/inputs/CustomSelect.vue';
import { TestSetupsResolver } from '../../api/resolvers/testSetup/test-setups.resolver.ts';
import router from '../../router/router.ts';
import type { TestBlockTest } from '../../pages/tests/types';
import type { DefaultErrorDto } from '../../api/dto/common/default-error.dto.ts';
import type { PropType } from 'vue';
import type { TestTypeDataOutputDto } from '../../api/resolvers/testType/dto/output/test-type-data-output.dto.ts';

export default {
  name: 'TestRowElement',
  components: { CustomSelect, CommonButton },
  emits: ['removeTest', 'applyTest'],
  props: {
    test: {
      type: {} as PropType<TestTypeDataOutputDto>,
      required: true,
    },
    selected: Boolean,
    setupId: Number
  },
  data() {
    return {
      added: this.selected,
      buttonClass: 'submit_button',
      setups: [] as { value: string; text: string }[],
      currentSetup: this.setupId ? this.setupId.toString() : 'default',
    };
  },
  computed: {
    buttonText() {
      if (this.added && this.selected) {
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
        ? this.$emit('removeTest', {
            name: this.test.name,
            setupId: parseInt(this.currentSetup),
            available: true
          } as TestBlockTest)
        : this.$emit('applyTest', {
            name: this.test.name,
            setupId: parseInt(this.currentSetup),
            available: true
          } as TestBlockTest);
      this.added = !this.added;
    },
  },
  async mounted() {
    this.added = this.selected
    try {
      const setups = await new TestSetupsResolver().getAllByTestType(this.test.name)
      setups.forEach((setup) => {
        this.setups.push({
          value: setup.id.toString(),
          text: `Конфиг №${setup.id}`,
        });
      })
      if (!this.setups.find(setup => setup.value == this.currentSetup)) this.currentSetup = 'default'
      this.setups.sort((a, b) => parseInt(a.value) - parseInt(b.value));
    } catch (e) { return (e as DefaultErrorDto).message }
  },
  watch: {
    currentSetup() {
      console.log('currentSetup', this.currentSetup);
      this.added = true
      this.applyTest()
    }
  }
};
</script>

<template>
  <div class="wrapper">
    <p class="wrapper-block test-name">{{ test.description }}</p>
    <div class="buttons">
      <CustomSelect
        v-if="setups.length > 0"
        v-model="currentSetup"
        :options="[
          {value: 'default', text: 'Не выбран'},
          ...setups
        ]"
        placeholder="Не выбран"
        class="select"
      />
      <CommonButton
        @click="router().push(`/test/settings/${test.name}/${currentSetup}`)"
        class="submit_button btn"
      >
        <template v-slot:placeholder>Настроить</template>
      </CommonButton>
      <CommonButton
        class="wrapper-block btn add"
        :class="buttonClass"
        @click="applyTest"
      >
        <template v-slot:placeholder>
          <svg width="30" height="31" viewBox="0 0 30 31" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.48311 0.738L15.0338 11.2887L25.5298 0.792667C25.7616 0.545894 26.0409 0.348485 26.3509 0.212277C26.6609 0.0760682 26.9952 0.00386587 27.3338 0C28.0587 0 28.7539 0.287975 29.2665 0.800575C29.7791 1.31317 30.0671 2.00841 30.0671 2.73333C30.0735 3.06845 30.0113 3.40132 29.8844 3.71154C29.7575 4.02176 29.5685 4.30277 29.3291 4.53733L18.6964 15.0333L29.3291 25.666C29.7796 26.1067 30.0438 26.7035 30.0671 27.3333C30.0671 28.0583 29.7791 28.7535 29.2665 29.2661C28.7539 29.7787 28.0587 30.0667 27.3338 30.0667C26.9854 30.0811 26.6379 30.023 26.3132 29.8959C25.9885 29.7689 25.6938 29.5757 25.4478 29.3287L15.0338 18.778L4.51045 29.3013C4.27949 29.5399 4.00359 29.7303 3.69865 29.8617C3.39371 29.993 3.06578 30.0627 2.73378 30.0667C2.00885 30.0667 1.31362 29.7787 0.801019 29.2661C0.28842 28.7535 0.000444732 28.0583 0.000444732 27.3333C-0.00592802 26.9982 0.0562469 26.6653 0.183154 26.3551C0.310062 26.0449 0.499024 25.7639 0.738445 25.5293L11.3711 15.0333L0.738445 4.40067C0.28795 3.95994 0.0237864 3.36313 0.000444732 2.73333C0.000444732 2.00841 0.28842 1.31317 0.801019 0.800575C1.31362 0.287975 2.00885 0 2.73378 0C3.38978 0.0082 4.01845 0.273333 4.48311 0.738Z"/>
            {{ buttonText }}
          </svg>
        </template>
      </CommonButton>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  width: 100%;
  border-radius: 10px;
  padding: 1vh 1vw;
  border: 1px solid var(--input-border);
  background: white;
  display: grid;
  grid-template-columns: 50% 46%;
  align-items: center;
  column-gap: 4%;
  height: 6vh;

  .test-name {
    white-space: nowrap;
    overflow: hidden;
  }
  .buttons {
    display: flex;
    justify-content: flex-end;
    height: 4vh;
    gap: 1vw;

    .btn, .select {
      display: flex;
      height: 100%;
    }

    .btn {
      max-width: calc((100% - 4vh - 2vw) / 2.5);
    }

    .btn.add {
      padding: 0;
      max-width: 4vh;
      svg {
        scale: 45%;
        stroke: white;
        transition: all 0.3s;
        path {
          fill: white;
        }
      }
    }

    .submit_button svg {
      transform: rotate(-45deg) scale(0.8);
    }
  }
}
</style>
