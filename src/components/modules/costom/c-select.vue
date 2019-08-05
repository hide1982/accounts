<template lang="pug">
  .form-item.element-margin-top
    label.form-item__label {{ label }}
    select(type="text" :value="value" @change="updateValue" :class="{ 'form-item--error': error }").form-item__select
      option(selected="selected" value="") ---
      option(v-for="(option, i) in options" :value="i") {{ option.company }}
    slot
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      required: true
    },
    options: {
      type: Array,
      default () {
        return []
      }
    },
    error: {
      type: String | Object
    }
  },
  methods: {
    updateValue (e) {
      this.$emit('input', e.target.value)
    }
  }
}
</script>
