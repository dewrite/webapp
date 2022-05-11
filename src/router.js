import Vue from 'vue'
import Router from 'vue-router'
import AppHeader from './layout/AppHeader'
import AppFooter from './layout/AppFooter'
import Components from './views/Components.vue'
import Home from './views/Home.vue'
import Dashboard from './views/Dashboard.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import Profile from './views/Profile.vue'
import setting from './views/Setting.vue'
import write from './views/Writing.vue'
import mm from './views/MM.vue'

Vue.use(Router)

// router.beforeEach((to, from, next) => {
//   // ...
// })

export default new Router({
  linkExactActiveClass: 'active',
  // mode: 'history', // require service support
  routes: [
    {
      path: '/',
      name: 'home',
      components: {
        header: AppHeader,
        default: Home,
        footer: AppFooter,
      },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      components: {
        default: Dashboard,
      },
      meta: { admin: true },
    },
    {
      path: '/mm',
      name: 'mm',
      components: {
        default: mm,
      },
      meta: { admin: true },
    },
    {
      path: '/write',
      name: 'write',
      components: {
        default: write,
      },
      meta: { admin: true },
    },
    {
      path: '/setting',
      name: 'setting',
      components: {
        default: setting,
      },
      meta: { admin: true },
    },

    {
      path: '/guide',
      name: 'guide',
      components: {
        header: AppHeader,
        default: Components,
        footer: AppFooter,
      },
    },
    {
      path: '/login',
      name: 'login',
      components: {
        header: AppHeader,
        default: Login,
        footer: AppFooter,
      },
    },
    {
      path: '/register',
      name: 'register',
      components: {
        header: AppHeader,
        default: Register,
        footer: AppFooter,
      },
    },
    {
      path: '/profile',
      name: 'profile',
      components: {
        header: AppHeader,
        default: Profile,
        footer: AppFooter,
      },
    },
  ],
  scrollBehavior: (to) => {
    if (to.hash) {
      return { selector: to.hash }
    } else {
      return { x: 0, y: 0 }
    }
  },
})
