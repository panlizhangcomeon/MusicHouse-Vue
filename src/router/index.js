import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeList from '../views/HomeList.vue'

Vue.use(VueRouter);

  const routes = [
    {
      path: '/',
      name: 'HomeList',
      component: HomeList
    },
    {
      path: '/home',
      name: 'Home',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../views/MyHomeList.vue')
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/Register.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/changePassword',
      name: 'ChangePassword',
      component: () => import('../views/ChangePassword.vue')
    },
    {
      path: '/userInfo',
      name: 'UserInfo',
      component: () => import('../views/UserInfo.vue')
    },
    {
      path: '/homeDetail',
      name: 'HomeDetail',
      component: () => import('../views/HomeDetail.vue')
    }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router
