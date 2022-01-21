import Vue from 'vue'
import App from './App.vue'
import router from './routes.js'
import '@forevolve/bootstrap-dark/dist/css/bootstrap-dark.css'
import '@forevolve/bootstrap-dark/dist/js/bootstrap.js'
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
