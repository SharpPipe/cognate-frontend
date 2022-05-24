import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

export default new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    // public
    {
      path: "/",
      name: "home",
      component: () => import("./views/BaseHome"),
    },
    {
      path: "/pricing/",
      name: "pricing",
      component: () => import("./views/BasePricing"),
      meta: {
        breadcrumb: "Pricing",
      },
    },
    // authentications
    {
      path: "/login/",
      name: "login",
      component: () => import("./components/AuthLogin"),
      meta: {
        requiresLogged: true,
      },
    },
    {
      path: "/register/",
      name: "register",
      component: () => import("./components/AuthRegister"),
      meta: {
        requiresLogged: true,
      },
    },
    {
      path: "/logout/",
      name: "logout",
      component: () => import("./components/AuthLogout"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/profile/",
      name: "profile",
      component: () => import("./views/BaseProfileSettings"),
      meta: {
        requiresAuth: true,
        breadcrumb: "Profile",
      },
    },
    // authenticated users
    {
      path: "/groups/",
      name: "groups",
      component: () => import("./views/GroupList"),
      meta: {
        requiresAuth: true,
        breadcrumb: "Groups",
      },
    },
    {
      path: "/group/:groupid/",
      name: "group-projects",
      component: () => import("./views/GroupProjects"),
      meta: {
        requiresAuth: true,
        breadcrumb: {
          label: "Group Projects",
          parent: "groups",
        },
      },
    },
    {
      path: "/group/:groupid/project/:repoid/",
      name: "project",
      component: () => import("./views/Project"),
      meta: {
        requiresAuth: true,
        breadcrumb: {
          label: "Project",
          parent: "group-projects",
        },
      },
    },
    {
      path: "/group/:groupid/project/:repoid/manage",
      name: "managerepo",
      component: () => import("./views/ProjectManageSprints"),
      meta: {
        requiresAuth: true,
        breadcrumb: {
          label: "Manage Project",
          parent: "project",
        },
      },
    },
    {
      path: "/group/:groupid/milestone/:msid/",
      name: "group-milestone-summary",
      component: () => import("./views/GroupMilestoneSummary"),
      meta: {
        requiresAuth: true,
        breadcrumb: {
          label: "Group Sprint Stats",
          parent: "group-projects",
        },
      },
    },
    {
      path: "/group/:groupid/config/",
      name: "group-admin-view",
      component: () => import("./views/GroupAdminView"),
      meta: {
        requiresAuth: true,
        breadcrumb: {
          label: "Group Admin",
          parent: "groups",
        },
      },
    },
    {
      path: "/group/:groupid/assessment/",
      name: "assessment",
      component: () => import("./views/GroupAssessingTree"),
      meta: {
        requiresAuth: true,
        breadcrumb: {
          label: "Group Assessment Configuration",
          parent: "groups",
        },
      },
    },
    {
      path: "/group/:groupid/project/:repoid/assessment/:msid/",
      name: "assess-sprint",
      component: () => import("./views/ProjectAssessSprint"),
      meta: {
        requiresAuth: true,
        breadcrumb: {
          label: "Assess Milestone",
          parent: "project",
        },
      },
    },
    {
      path: "/groupadd/",
      name: "groupadd",
      component: () => import("./views/GroupAdd"),
      meta: {
        requiresAuth: true,
        breadcrumb: {
          label: "Add new Group",
        },
      },
    },
    {
      path: "/feedback/",
      name: "feedback",
        component: () => import("./views/BaseFeedback"),
      meta: {
        requiresAuth: true,
        breadcrumb: {
          label: "Give us Feedback now!",
        },
      },
    },
    // Debug views
    {
      path: "/gittime/",
      name: "gittime",
      component: () => import("./components/visualizations/GitTime.vue"),
    },
  ],
});
