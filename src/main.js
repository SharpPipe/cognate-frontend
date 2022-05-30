import Vue from 'vue'
import App from './App.vue'
import router from './routes.js'
import store from './store'
import '@forevolve/bootstrap-dark/dist/js/bootstrap.js'
import '@forevolve/bootstrap-dark/dist/js/bootstrap.bundle.js'
import 'bootstrap-colorpicker/dist/js/bootstrap-colorpicker.js'
import 'bootstrap-colorpicker/dist/css/bootstrap-colorpicker.css'
import 'popper.js/dist/popper.min.js'
import VueBreadcrumbs from 'vue-2-breadcrumbs'

// https://fontawesome.com/v6/docs/web/use-with/vue/add-icons
import { library } from '@fortawesome/fontawesome-svg-core'
import { faGitlab } from '@fortawesome/free-brands-svg-icons'
import { faClipboard, faClock, faStarHalfAlt } from '@fortawesome/free-regular-svg-icons'
import { faClipboardList, faCode, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faGitlab)
library.add(faClock)
library.add(faCode)
library.add(faInfoCircle)
library.add(faClipboardList)
library.add(faClipboard)
library.add(faStarHalfAlt)

Vue.component('font-awesome-icon', FontAwesomeIcon)

// env variables
import dotenv from 'dotenv'
dotenv.config()

// Navigation Breadcrumbs
Vue.use(VueBreadcrumbs)

// Router permissions
router.beforeEach((to, from, next) => {
  // ./router.js has a meta named 'requiresAuth: true'
  // then check if the user is logged in before routing to this path:
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.loggedIn)
      next({ name: 'login' })
    else
      next()

  } else if (to.matched.some(record => record.meta.requiresLogged)) {
    // ./router.js has a meta named 'requiresLogged: true'
    // then check if the user is logged in; if true continue to home page else continue routing to the destination path
    // this comes to play if the user is logged in and tries to access the login/register page
    if (store.getters.loggedIn)
      next({ name: 'home' })
    else
      next()

  } else {
    next()
  }
})

Vue.config.productionTip = false
new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
