<template lang="pug">
  .form-item
    label.form-item__label {{ label }}
    el-date-picker(type="date" :value="value" @input="updateValue" :class="{ 'form-item--error': error }").form-item__date
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
    error: {
      type: String | Object
    }
  },
  methods: {
    updateValue (e) {
      this.$emit('input', e)
    }
  }
}
</script>
