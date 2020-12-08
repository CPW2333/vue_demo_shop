import Vue from 'vue'
// 按需导入的标签
import { Button, Form, FormItem, Input, Message } from 'element-ui'

Vue.use(Button)
// 组件注册为全局可用
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// $自定义名字 = 正确组件名
Vue.prototype.$message = Message
