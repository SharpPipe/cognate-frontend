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
            meta: {
                breadcrumb: "Pricing"
            }
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
                requiresAuth: true,
                breadcrumb: "Profile"
            }
        },
        // authenticated users
        {
            path: '/groups/',
            name: 'groups',
            component: () => import("./views/Groups"),
            meta: {
                requiresAuth: true,
                breadcrumb: "Groups"
            }
        },
        {
            path: '/group/:groupid/',
            name: 'group-repos',
            component: () => import("./views/ProjectRepos"),
            meta: {
                requiresAuth: true,
                breadcrumb: {
                    label: "Group Projects",
                    parent: 'groups'
                }
            }
        },
        {
            path: '/group/:groupid/repo/:repoid/',
            name: 'repo',
            component: () => import("./views/Repo"),
            meta: {
                requiresAuth: true,
                breadcrumb: {
                    label: "Project",
                    parent: 'group-repos'
                }
            }
        },
        {
            path: '/group/:groupid/repo/:repoid/manage',
            name: 'managerepo',
            component: () => import("./views/RepoMilestoneManager"),
            meta: {
                requiresAuth: true,
                breadcrumb: {
                    label: "Manage Project",
                    parent: 'repo'
                }
            }
        },
        {
            path: '/group/:groupid/milestone/:msid/',
            name: 'group-milestone-summary',
            component: () => import("./views/GroupMilestoneSummary"),
            meta: {
                requiresAuth: true,
                breadcrumb: {
                    label: "Group Sprint Stats",
                    parent: 'group-repos'
                }
            }
        },
        {
            path: '/group/:groupid/config/',
            name: 'group-admin-view',
            component: () => import("./views/GroupAdminView"),
            meta: {
                requiresAuth: true,
                breadcrumb: {
                    label: "Group Admin",
                    parent: 'groups'
                }
            }
        },
        {
            path: '/group/:groupid/assessment/',
            name: 'assessment',
            component: () => import("./views/AssessingTree"),
            meta: {
                requiresAuth: true,
                breadcrumb: {
                    label: "Group Assessment Configuration",
                    parent: 'groups'
                }
            }
        },
        {
            path: '/group/:groupid/repo/:repoid/assessment/:msid/',
            name: 'assess-milestone',
            component: () => import("./views/AssessMilestone"),
            meta: {
                requiresAuth: true,
                breadcrumb: {
                    label: "Assess Milestone",
                    parent: 'repo'
                }
            }
        },
        {
            path: '/groupadd/',
            name: 'groupadd',
            component: () => import("./views/GroupAdd"),
            meta: {
                requiresAuth: true,
                breadcrumb: {
                    label: "Add new Group",
                }
            }
        },
        {
            path: '/feedback/',
            name: 'feedback',
            component: () => import("./views/Feedback"),
            meta: {
                requiresAuth: true,
                breadcrumb: {
                    label: "Give us Feedback now!",
                }
            }
        },
        // Debug views
        {
            path: '/gittime/',
            name: 'gittime',
            component: () => import("./components/visualizations/GitTime.vue")
        },

    ]
})