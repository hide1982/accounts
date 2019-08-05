<template lang="pug">
  transition(name="fade")
    .modal(v-if="trigger")
      .modal__mask(@click.self="close")
        .modal__contents
          slot
</template>
<script>
export default {
  props: {
    trigger: {
      type: Boolean,
      required: true
    },
    isCloseMaskClick: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close (e) {
      if (this.isCloseMaskClick) {
        this.$emit('close')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  &__mask {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
  }

  &__contents {
    position: relative;
    overflow: scroll;
    max-height: 90vh;
  }
}
</style>
