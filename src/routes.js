import Vue from 'vue'
import VueRouter from 'vue-router'

import Groups    from './views/Groups'
import Browse    from './views/Browse'
import Home      from './views/Home'
import Repo_management from "./views/Repo_management";
import GroupMilestoneSummary from "./views/GroupMilestoneSummary";
import Repo      from "./views/Repo";
import Milestone from "./views/Milestone";
import GradeMS   from "./views/GradeMilestone";
import Pricing   from "./views/Pricing";
import Grading   from "./views/Grading";
import Profile   from "./views/Profile";
import GroupAdd  from "./views/GroupAdd";
import Feedback  from "./views/Feedback";
import Login     from "./components/Login";
import Register  from "./components/Register";
import Logout    from "./components/Logout";

Vue.use(VueRouter)

export default new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        // public
        {
            path: '/',
            name: 'home',
            component: Home,
        },
        {
            path: '/pricing/',
            name: 'pricing',
            component: Pricing,
        },
        {
            path: '/browse/',
            name: 'browse',
            component: Browse,
        },
        // authentications
        {
            path: '/login/',
            name: 'login',
            component: Login,
            meta: {
                requiresLogged: true
            }
        },
        {
            path: '/register/',
            name: 'register',
            component: Register,
            meta: {
                requiresLogged: true
            }
        },
        {
            path: '/profile/',
            name: 'profile',
            component: Profile,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/logout/',
            name: 'logout',
            component: Logout,
            meta: {
                requiresAuth: true
            }
        },
        // authenticated users
        {
            path: '/groups/',
            name: 'groups',
            component: Groups,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/group/:groupid/repo/:repoid/',
            name: 'repo',
            component: Repo,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/group/:id/',
            name: 'group-repos',
            component: Repo_management,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/group/:id/milestone/:msid/',
            name: 'group-milestone-summary',
            component: GroupMilestoneSummary,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/group/:id/grading/',
            name: 'grading',
            component: Grading,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/milestone/',
            name: 'milestone',
            component: Milestone,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/group/:groupid/repo/:repoid/grade/:msid/',
            name: 'grade-milestone',
            component: GradeMS,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/groupadd/',
            name: 'groupadd',
            component: GroupAdd,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/feedback/',
            name: 'feedback',
            component: Feedback,
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