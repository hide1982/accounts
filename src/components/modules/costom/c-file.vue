<template lang="pug">
  div
    label.file {{ label }}
      input(type="file" @change="onChange")
</template>
<script>
export default {
  props: {
    label: {
      type: String
    },
    button: {
      type: String,
      default: 'ファイルを読み込む'
    },
    onChange: {
      type: Function,
      required: true
    }
  }
}
</script>
<style lang="scss" scoped>
  label.file {
    display: inline-block;
    padding: 7px 14px;
    background-color: $primary-color;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
  }

  input {
    display: none;
  }
</style>
