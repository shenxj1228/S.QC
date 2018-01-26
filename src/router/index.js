import Vue from 'vue'
import Router from 'vue-router'
import Smain from '@/components/Smain'
import Slogin from '@/components/Slogin'
import Sblank from '@/components/Sblank'
import Sdefects from '@/components/Sdefects'
import Ssetting from '@/components/Ssetting'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Smain',
      component: Smain,
      children: [
        { path: '/defects/:dp', component: Sdefects },
        { path: '/setting', component: Ssetting }
      ]
    },
    {
      path: '/login',
      name: 'Slogin',
      component: Slogin
    }
  ]
})

export default router
