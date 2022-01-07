import Vue from 'vue'
import App from './App.vue'
import router from './routes.js'
//import 'bootstrap/dist/css/bootstrap-dark.min.css'
import '@forevolve/bootstrap-dark/dist/css/bootstrap-dark.css'
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
