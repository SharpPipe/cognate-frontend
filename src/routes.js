import Vue from 'vue'
import VueRouter from 'vue-router'
import Groups from './views/Groups'
import Browse from './views/Browse'
import Home from './views/Home'
import Repo_management from "./views/Repo_management";
import Repo from "./views/Repo";
import Milestone from "./views/Milestone";
import Pricing from "./views/Pricing";

Vue.use(VueRouter)

export default new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
        },
        {
            path: '/groups',
            name: 'groups',
            component: Groups,
        },
        {
            path: '/browse',
            name: 'browse',
            component: Browse,
        },
        {
            path: '/repo',
            name: 'repo',
            component: Repo,
        },
        {
            path: '/repos',
            name: 'repos',
            component: Repo_management,
        },
        {
            path: '/signup',
            name: 'signup',
            component: () => import('./components/Signup.vue')
        },
        {
            path: '/signin',
            name: 'signin',
            component: () => import('./components/Signin.vue')
        },
        {
            path: '/milestone',
            name: 'milestone',
            component: Milestone,
        },
        {
            path: '/pricing',
            name: 'pricing',
            component: Pricing,
        },

    ]
})