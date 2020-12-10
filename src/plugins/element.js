import Vue from 'vue'
// 按需导入的标签
import { Button, Form, FormItem, Input, Message, Container, Header, Aside, Main, Menu, Submenu, MenuItem, Breadcrumb, BreadcrumbItem, Card, Row, Col, Table, TableColumn, Switch, Tooltip, Pagination, Dialog, MessageBox, Tag, Tree, Select, Option } from 'element-ui'

Vue.use(Button)
// 组件注册为全局可用
// $自定义名字 = 正确组件名
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
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
// 用户管理模块的
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Select)
Vue.use(Option)
// 权限管理模块的
Vue.use(Tag)
Vue.use(Tree)
