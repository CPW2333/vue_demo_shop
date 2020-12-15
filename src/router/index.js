import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login.vue'
const Login = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Login.vue')
// import Home from '../components/Home.vue'
const Home = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Home.vue')
// import Welcome from '../components/Welcome.vue'
const Welcome = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Welcome.vue')
// import Users from '../components/user/Users.vue'
const Users = () => import(/* webpackChunkName:"user" */ '../components/user/Users.vue')
// import Rights from '../components/power/Rights.vue'
const Rights = () => import(/* webpackChunkName:"power" */ '../components/power/Rights.vue')
// import Roles from '../components/power/Roles.vue'
const Roles = () => import(/* webpackChunkName:"power" */ '../components/power/Roles.vue')
// import Cates from '../components/goods/Cates.vue'
const Cates = () => import(/* webpackChunkName:"goods" */ '../components/goods/Cates.vue')
// import Params from '../components/goods/Params.vue'
const Params = () => import(/* webpackChunkName:"goods" */ '../components/goods/Params.vue')
// import GoodsList from '../components/goods/GoodsList.vue'
const GoodsList = () => import(/* webpackChunkName:"goods" */ '../components/goods/GoodsList.vue')
// import AddGoods from '../components/goods/AddGoods.vue'
const AddGoods = () => import(/* webpackChunkName:"goods" */ '../components/goods/AddGoods.vue')
// import Orders from '../components/orders/Orders.vue'
const Orders = () => import(/* webpackChunkName:"order" */ '../components/orders/Orders.vue')
// import Reports from '../components/reports/Reports.vue'
const Reports = () => import(/* webpackChunkName:"report" */ '../components/reports/Reports.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cates },
      { path: '/params', component: Params },
      { path: '/goods', component: GoodsList },
      { path: '/goods/add', component: AddGoods },
      { path: '/orders', component: Orders },
      { path: '/reports', component: Reports }
    ]
  }
  // { path: '/login', name: 'Login', component: Login }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  /*
  to:将要访问的路径 from:从哪个路径过来
  next:函数，表示放行
    next() 放行
    next('/login') 强制跳转
  */
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
