<script lang="ts">

export default {
  name: 'CustomInput',
  emits: ['search', 'update:modelValue'],
  data() {
    return {
      id: `input-${Math.random().toString(36).substring(2, 9)}`,
    }
  },
  props: {
    placeholder: String,
    type: {
      type: String,
      default: 'text',
      required: true,
      validator: (v: string) =>
          ['text', 'password', 'email', 'number', 'radio', 'checkbox', 'tel', 'date'].includes(v),
    },
    selector: String,
    modelValue: {
      type: [String, Number],
    },
    minNumber: {
      type: Number,
      default: 0,
    },
    maxNumber: {
      type: Number,
      default: 100,
    },
    maxLength: {
      type: Number,
      default: 1000,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
    },
    required: {
      type: Boolean,
      default: false,
    },
    labelText: {
      type: String,
    }
  },
  methods: {
    validate(event: InputEvent) {
      const inputValue = (event.target as HTMLInputElement).value;

      if (isNaN(Number(inputValue))) {
        return;
      }

      if (inputValue.length > this.maxLength) {
        (event.target as HTMLInputElement).value = inputValue.slice(0, this.maxLength);
        this.$emit('update:modelValue', parseFloat((event.target as HTMLInputElement).value));
        return;
      }

      if (Number(inputValue) < this.minNumber) {
        this.$emit('update:modelValue', this.minNumber);
      } else if (Number(inputValue) > this.maxNumber) {
        this.$emit('update:modelValue', this.maxNumber);
      } else {
        this.$emit('update:modelValue', inputValue);
      }
    },
    update(event: InputEvent) {
      this.$emit('search');
      this.$emit('update:modelValue', (event.target as HTMLInputElement).value)
    },
  },
}
</script>

<template>
  <div class="input-wrapper">
    <label :for="id" v-if="labelText">
      {{ labelText }}
    </label>
    <input
        class="input"
        :type="type"
        :min="minNumber"
        :max="maxNumber"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="selector"
        :name="name"
        @input="update($event as InputEvent)"
        :id="id"
    >
  </div>
</template>

<style scoped>
.input-wrapper {
  min-height: 2.5rem;
}
.input {
  width: 100%;
  height: 100%;
  border: 1px solid var(--input-border);
  border-radius: 0.5rem;
  transition-duration: 0.2s;
  background-color: white;
  padding: 0.5rem;
  text-align: left;
  text-indent: 2%;
}

.input::placeholder {
  text-align: left;
  color: rgba(0, 0, 0, 0.7);
  text-indent: 2%;
}

.input:active, .input:focus {
  border: 1px solid var(--input-border);
  outline: none;
  transition-duration: 0.2s;
  text-indent: 2%;
}

.input:hover {
  border: 1px solid var(--input-border);
  transition-duration: 0.2s;
  text-indent: 2%;
}

input[type="number"] {
  text-align: center;
}

input[type="date"] {
  padding: 1vw;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.input.no-borders {
  border: none;

  :focus, :active, :focus {
    border: none;
  }
}
</style>