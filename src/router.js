import store from './store'
import VueRouter from 'vue-router'
import NotFound from './components/pages/notfound.vue'
import Login from './components/auth/login.vue'
import MyPage from './components/pages/mypage.vue'
import Client from './components/pages/client.vue'
import Invoice from './components/pages/invoice.vue'
import Quotation from './components/pages/quotation.vue'
import Setting from './components/pages/setting.vue'
import Auth from './components/auth/callback.vue'
import Etc from './components/pages/etc.vue'

const routes = [
  { path: '/', component: MyPage },
  { path: '/client', component: Client },
  { path: '/invoice', component: Invoice },
  { path: '/quotation', component: Quotation },
  { path: '/etc', component: Etc },
  { path: '/auth', component: Auth },
  { path: '/setting', component: Setting },
  { path: '/login', component: Login },
  { path: '/*', component: NotFound }
]
const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes
})

const ignorePath = new RegExp('^(?!.*(^/auth$|^/login$)).+$')

router.beforeEach((to, from, next) => {
  if (ignorePath.test(to.path) && !store.state.isLoggedin) {
    next({ path: '/login' })
  } else {
    next()
  }
})

export default router
