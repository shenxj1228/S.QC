import Vue from 'vue'
import Router from 'vue-router'
import Smain from '@/components/Smain'
import Slogin from '@/components/Slogin'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Smain',
      component: Smain
    },
    {
      path: '/login',
      name: 'Slogin',
      component: Slogin
    }
  ]
})

export default router
