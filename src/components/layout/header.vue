<template lang="pug">
  header
    img(:src="logo").logo
    h1 {{ labels.appname[lang] }}
    button.button.button--primary.button-auth(@click="login" v-if="!isLoggedin") {{ labels.buttons.login[lang] }}
    button.button.button--primary.button-auth(@click="logout" v-else) {{ labels.buttons.logout[lang] }}
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { login } from './../../Auth/AuthService'
import { logo } from '../../assets/dataUrl'
export default {
  data () {
    return {
      logo
    }
  },
  computed: {
    ...mapState(['isLoggedin', 'labels', 'lang'])
  },
  methods: {
    login,
    ...mapActions([
      'logout'
    ])
  }
}
</script>

<style lang="scss" scoped>
header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  height: $header-height;
  background-color: rgba(255, 255, 255, 0.9);
  text-align: center;
  border-bottom: solid 1px #aaa;
}

h1 {
  font-size: 24px;
}

.logo {
  width: 40px;
  margin-right: 24px;
  // margin-left: -64px;
}

.button-auth {
  position: absolute;
  top: 50%;
  right: 50px;
  transform: translateY(-50%);
}
</style>
