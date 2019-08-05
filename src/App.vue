<template lang="pug">
  #app
    Header
    Body
</template>

<script>
import Header from './components/layout/header.vue'
import Body from './components/layout/body.vue'

export default {
  components: {
    Header,
    Body
  },
  name: 'App'
}
</script>

<style lang="scss">
@import './assets/sass/global.scss';

.container {
  display: flex;
}
</style>
