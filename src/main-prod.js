import Vue from 'vue'
import App from './App.vue'
// import router from './router' //下面不行再用这个东西
import router from './router/index.js'
// import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入、挂载axios
import axios from 'axios'
// 导入树形表格插件
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 对应的样式
// import 'quill/dist/quill.core.css' // import styles
// import 'quill/dist/quill.snow.css' // for snow theme
// import 'quill/dist/quill.bubble.css' // for bubble theme

// 导入进度条插件
import NProgress from 'nprogress'
// 导入进度条样式
// import 'nprogress/nprogress.css'

axios.defaults.baseURL = 'http://www.wjforwk.xyz:8888/api/private/v1/'
// 通过axios请求拦截器添加token，保证拥有获取数据的权限
axios.interceptors.request.use(
  config => {
    // 当进入request拦截器，表示发送了请求，我们就开启进度条
    NProgress.start()
    // console.log(config);
    config.headers.Authorization = window.sessionStorage.getItem('token')
    // 最后必须return config
    return config
  }
)

// 在response拦截器中，隐藏进度条
axios.interceptors.response.use(config => {
  // 当进入response拦截器，表示请求已经结束，我们就结束进度条
  NProgress.done()
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

// 自定义组件的声明
Vue.component('tree-table', TreeTable)
// 富文本编辑器注册为全局可以使用
Vue.use(VueQuillEditor /* { default global options } */)

// 自定义全局时间过滤器
Vue.filter('dateFormat', function (originVal) {
  const date = new Date(originVal)
  const y = date.getFullYear()
  const m = (date.getMonth() + 1 + '').padStart(2, '0')
  const d = (date.getDay() + '').padStart(2, '0')

  const hh = (date.getHours() + '').padStart(2, '0')
  const mm = (date.getMinutes() + '').padStart(2, '0')
  const ss = (date.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
