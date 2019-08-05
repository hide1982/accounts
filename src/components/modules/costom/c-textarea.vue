<template lang="pug">
  .form-item
    label.form-item__label {{ label }}
    textarea(:value="value" @input="$emit('input', $event.target.value)").form-item__textarea
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
    }
  }
}
</script>
