import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout',
      redirect: '/home',
      component: () => import('@/views/LayoutContainer.vue'),
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('@/views/HomeView.vue')
        },
        {
          path: '/gridMember',
          name: 'grid member',
          component: () => import('@/views/GridMemberMngView.vue')
        },
        {
          path: '/supervisor',
          name: 'supervisor',
          component: () => import('@/views/SupervisorMngView.vue')
        },
        {
          path: '/admin',
          name: 'admin',
          component: () => import('@/views/AdminMngView.vue')
        },
        {
          path: '/assign',
          name: 'assign',
          component: () => import('@/views/AssignMngView.vue')
        },
        {
          path: '/crossDomain',
          name: 'cross domain',
          component: () => import('@/views/CrossDomainRequestView.vue')
        },
        {
          path: '/leaveRequest',
          name: 'leaveRequest',
          component: () => import('@/views/LeaveRequestView.vue')
        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    }
  ]
})

export default router
