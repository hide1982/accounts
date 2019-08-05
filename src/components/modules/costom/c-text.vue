<template lang="pug">
  .form-item
    label.form-item__label {{ label }}
    input(type="text" :value="value" @input="$emit('input', $event.target.value)" :class="{ 'form-item--error': error }").form-item__text
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
  }
}
</script>
