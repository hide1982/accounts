<template lang="pug">
  .message
    .message__item(v-for="(message, i) in messages")
      button.button-closee(@click="closeMessage(i)") ×
      .message__item__content {{ message.message }}
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState(['messages'])
  },
  methods: {
    closeMessage (index) {
      this.deleteMessage(index)
    },
    ...mapActions(['sendMessage', 'deleteMessage'])
  }
}
</script>
<style lang="scss" scoped>
.message {
  position: fixed;
  right: 20;
  bottom: 20;

  &__item {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 30px;
    background-color: $primary-color;

    & + & {
      margin-top: 20px;
    }
  }

  &__item__content {
    color: #fff;
    font-weight: bold;
  }
}

.button-closee {
  position: absolute;
  top: 1px;
  right: 10px;
  color: white;
  font-size: 20px;
}
</style>
