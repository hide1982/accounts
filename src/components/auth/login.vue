<template lang="pug">
h2 Please login first.
</template>

<script>
import { login } from '../../Auth/AuthService.js'
export default {
  mounted () {
    login()
  }
}
</script>
