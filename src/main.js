import Vue from 'vue'
import App from './App.vue'
// import router from './router' //下面不行再用这个东西
import router from './router/index.js'
import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入、挂载axios
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 通过axios请求拦截器添加token，保证拥有获取数据的权限
axios.interceptors.request.use(
  config => {
    // 最后必须return config
    // console.log(config);
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  }
)
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
