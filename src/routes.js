import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        // public
        {
            path: '/',
            name: 'home',
            component: () => import("./views/Home"),
        },
        {
            path: '/pricing/',
            name: 'pricing',
            component: () => import("./views/Pricing"),
        },
        {
            path: '/browse/',
            name: 'browse',
            component: () => import("./views/Browse"),
        },
        // authentications
        {
            path: '/login/',
            name: 'login',
            component: () => import("./components/Login"),
            meta: {
                requiresLogged: true
            }
        },
        {
            path: '/register/',
            name: 'register',
            component: () => import("./components/Register"),
            meta: {
                requiresLogged: true
            }
        },
        {
            path: '/logout/',
            name: 'logout',
            component: () => import("./components/Logout"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/profile/',
            name: 'profile',
            component: () => import("./views/Profile"),
            meta: {
                requiresAuth: true
            }
        },
        // authenticated users
        {
            path: '/groups/',
            name: 'groups',
            component: () => import("./views/Groups"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/group/:groupid/repo/:repoid/',
            name: 'repo',
            component: () => import("./views/Repo"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/group/:id/',
            name: 'group-repos',
            component: () => import("./views/ProjectRepos"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/group/:id/milestone/:msid/',
            name: 'group-milestone-summary',
            component: () => import("./views/GroupMilestoneSummary"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/group/:id/grading/',
            name: 'grading',
            component: () => import("./views/Grading"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/group/:groupid/repo/:repoid/grade/:msid/',
            name: 'grade-milestone',
            component: () => import("./views/GradeMilestone"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/groupadd/',
            name: 'groupadd',
            component: () => import("./views/GroupAdd"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/feedback/',
            name: 'feedback',
            component: () => import("./views/Feedback"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/gittime/',
            name: 'gittime',
            component: () => import("./components/visualizations/GitTime.vue")
        },

    ]
})