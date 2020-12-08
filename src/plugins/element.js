import Vue from 'vue'
// 按需导入的标签
import { Button, Form, FormItem, Input, Message, Container, Header, Aside, Main, Menu, Submenu, MenuItem } from 'element-ui'

Vue.use(Button)
// 组件注册为全局可用
// 登陆页面的
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 主页的
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
// $自定义名字 = 正确组件名
Vue.prototype.$message = Message
