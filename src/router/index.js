import Vue from 'vue'
import VueRouter from 'vue-router'

// Component imports
import LoginPage from '../components/LoginPage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'LoginPage',
    component: LoginPage
  },
  {
    path: '/signup',
    name: 'SignUpPage',
    component: () => import('../components/SignUpPage.vue')
  },
  {
    path: '/testing',
    name: 'testing',
    component: () => import('../components/HelloWorld.vue')
  },
  {
    path: '/setting/:iduser',
    name: 'Settings',
    component: () => import('../components/SettingView/SettingView.vue')
  },
  {
    path: '/dashboard',
    name: 'DashboardPage',
    component: () => import('../components/DashboardView/DashboardPage.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect:"today"
      },
      {
        path: 'today',
        component: () => import('@/components/DashboardView/MenuView/TodayView.vue'),
      },

      {
        path: 'comingup',
        component: () => import('@/components/DashboardView/MenuView/ComingUpView.vue'),
      },

      {
        path: 'all-tasks',
        component:()=>import("@/components/DashboardView/MenuView/AlltaskView.vue")
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// Global middleware guard
// Global middleware guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token')
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({
        path: '/',
        query: { redirect: to.fullPath }
      })
    } else {
      next() // đã đăng nhập thì cho qua
    }
  } else {
    next() // không cần auth thì cho qua
  }
})

export default router
