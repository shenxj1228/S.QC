// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import $ from 'jquery'

Vue.config.productionTip = false
Vue.use(iView)
axios.defaults.withCredentials = true

//axios.defaults.baseURL = 'http://192.168.42.50:8088' /*开发时注释，打包时取消注释 */
Vue.prototype.$http = axios
Vue.prototype.jquery = $
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
