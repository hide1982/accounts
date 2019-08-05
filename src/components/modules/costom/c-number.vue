<template lang="pug">
  .form-item
    label.form-item__label {{ label }}
    input(type="text" :value="value" @input="$emit('input', $event.target.value)").form-item__text
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true
    }
  }
}
</script>
