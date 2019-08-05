import Vue from 'vue'
import Vuex, { mapState } from 'vuex'
import VueRouter from 'vue-router'
import Vuelidate from 'vuelidate'
import { upperFirst, camelCase } from 'lodash'
import VueMomentLib from 'vue-moment-lib'
import { DatePicker } from 'element-ui'
import locale from 'element-ui/lib/locale'
import lang from 'element-ui/lib/locale/lang/ja'

import router from './router'
import App from './App.vue'
import store from './store'

const requireComponent = require.context(
  './components/modules/costom',
  false,
  /\.vue$/
)
requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)
  const componentName = upperFirst(
    camelCase(
      fileName.replace(/^\.\/(.*)\.\w+$/, '$1')
    )
  )
  Vue.component(
    componentName,
    componentConfig.default || componentConfig
  )
})

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(Vuelidate)
Vue.use(VueMomentLib)
Vue.use(DatePicker)
locale.use(lang)

const app = new Vue({
  components: { App },
  template: '<App/>',
  mounted () {
    if (this.isLoggedin) {
      this.$store.dispatch('get')
    }
  },
  computed: {
    ...mapState(['isLoggedin'])
  },
  store,
  router
})

app.$mount('#app')
