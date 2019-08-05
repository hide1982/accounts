<template lang="pug">
  .body
    c-spinner(:trigger="isProcessing")
    Menu
    Content
</template>
<script>
import { mapState } from 'vuex'
import Menu from './menu.vue'
import Content from './content.vue'
export default {
  components: {
    Menu,
    Content
  },
  computed: {
    ...mapState(['isProcessing'])
  }
}
</script>
<style lang="scss">
.body {
  display: flex;
  height: calc(100vh - #{$header-height});
}
</style>
