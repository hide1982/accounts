<template lang="pug">
  p {{ labels.other.messages.createUserFirst[lang] }}
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['labels', 'lang'])
  }
}
</script>
<style lang="scss" scoped>
p {
  font: {
    size: 20px;
    weight: bold;
  }
}
</style>
