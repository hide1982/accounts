<template lang="pug">
</template>
<script>
import { mapActions } from 'vuex'
import { handleAuthentication } from './../../Auth/AuthService'
import router from '../../router'

export default {
  mounted () {
    handleAuthentication().then(() => {
      this.login()
      this.get()
      router.replace('/')
    }).catch(err => {
      console.error(err)
      router.replace('/')
    })
  },
  methods: {
    ...mapActions([
      'login',
      'get'
    ])
  }
}
</script>
