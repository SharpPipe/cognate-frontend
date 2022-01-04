import Vue from 'vue'
import VueRouter from 'vue-router'
import Groups from './views/Groups'

Vue.use(VueRouter)

export default new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'groups',
            component: Groups,
        },
    ]
})