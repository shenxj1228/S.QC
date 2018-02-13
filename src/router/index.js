import Vue from 'vue'
import Router from 'vue-router'
import Smain from '@/components/Smain'
import Slogin from '@/components/Slogin'
import Sdefects from '@/components/Sdefects'
import Ssetting from '@/components/Ssetting'
import Sindex from '@/components/Sindex'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Smain',
      component: Smain,
      redirect: '/index',
      children: [
        { path: '/index', component: Sindex },
        { path: '/defects/:dp', component: Sdefects },
        { path: '/setting/:dp', component: Ssetting }
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
