// 这是备用路由文件
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './components/Login.vue'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    { path: '/login', component: Login }
  ]
})
