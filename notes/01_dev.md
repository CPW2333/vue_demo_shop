### 登录/退出功能 

##### 登录功能
创建并切换到开发分支`git checkout -b dev `

###### 删除不必要的代码
    App.vue:
        #app中的标签删除
        script 不需要导入与注册 helloworld组件
        style样式也清空
        app根组件可以写入自己的东西
    router.js:
        不需要导入Home组件 不需要创建与此有关的规则
    删除views文件夹
    删除components的helloworld.vue组件

###### 创建登录组件
    components文件夹：
        新建Login.vue组件
    router.js:  
        导入登录组件
        设置路由规则、路由重定向
    App.vue:
        设置一个路由占位符router-view
    可视化工具:
        安装开发依赖`less-loader @4.1.0`
        安装开发依赖`less @3.9.0`
    assets文件夹：
        新建css文件夹
        css文件夹：
            新建global.css全局样式
    main.js:
        导入全局样式文件global.css
        import './assets/css/global.css'
    后续步骤可以自由发挥了

###### 登录页面布局
通过 Element-UI 组件实现布局：
```javascript
    plugins文件夹：
        element.js:
            按需导入需要的组件标签
            注册为全局可用的组件标签
    el-form
    el-form-item
    el-input
        通过属性加入图标：prefix-icon="el-icon-search"
    el-button
    字体图标：
        采用阿里图标库
        main.js导入字体图标
        prefix-icon="iconfont icon-password"
```
表单数据绑定：
```javascript
    结构区：
        el-from :model="loginForm"
        el-input v-model="loginForm.username"
        el-input type="password"
    行为区：
        data() {
            return {
                // 登录表单的数据绑定对象
                loginForm: {
                    username: '',
                    password: '',
                }
            }
        },
```        
表单数据验证：
```javascript
    结构区：
        el-from :rules="loginFormRules"
        el-form-item prop="username"
    行为区：
        data() {
            return {
                // 表单验证规则对象
                loginFormRules: {
                    username: [
                    { required: true, message: "请输入用户名", trigger: "blur" },
                    { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" },
                    ],
                    password: [],
                },
            }
        },
```
表单重置：
```javascript
    结构区：
        el-from ref="loginFormRef"
        el-button @click="resetLoginForm" 
    行为区：
        methods: {
        //点击重置按钮事件
        resetLoginFormRef() {
            // console.log(this.$refs);
            this.$refs.loginFormRef.resetFields();
        }
    },
```    
登录前预校验：
```javascript
    结构区：
        el-from ref="loginFormRef"
        el-button @click="login"
    行为区：
        methods: {
        // 登录事件
        login() {
        // 登录预验证
        this.$refs.loginFormRef.validate(async (valid) => {
            if (!valid) return;
            const { data: res } = await this.$http.post("login", this.loginForm);
            console.log(res);
        });
    },
    main.js:
        // 导入、挂载axios
        import axios from 'axios'
        axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
        Vue.prototype.$http = axios
```
弹窗提示：
```javascript
    element.js:
        import { Message} from 'element-ui'
        // $自定义名字 = 正确组件名
        Vue.prototype.$message = Message
    Login.vue:
        login() {
            this.$message.success('登录成功！')
        }
```
登录成功后的行为：
```javascript
    Login.vue:
        login() {
            // 记录token 方便后续访问
            window.sessionStorage.setItem('token', res.data.token);
            // 页面跳转
            this.$router.push("/home")
        }
    新建Home.vue:
        结构、表现、行为
    router.js:
        import Home from '../components/Home.vue'
        { path: '/home', component: Home },
```
路由导航守卫控制访问权限：
```js
// 没有token 重新导航到登录页面
router.js:
    // 挂载路由导航守卫
    router.beforeEach((to, from, next) => {
    /* 
    to:将要访问的路径 from:从哪个路径过来 
    next:函数，表示放行
        next() 放行 
        next('/login') 强制跳转
    */
    if (to.path === '/login') return next();
    // 获取token 
    const tokenStr = window.sessionStorage.getItem('token');
    if (!tokenStr) return next('/login');
    next();
    })
```

##### 退出功能
核心原理：销毁token
```javascript    
    Home.vue:
        <el-button type="info">退出</el-button>
        methods: {
            logout() {
                window.sessionStorage.clear();
                this.$router.push('/login');
                this.$message.success('退出成功！')
            },
        },
```

##### 语法警告处理
根目录创建 `.prettierrc`文件

    不用封号、要单引号
    {
        "semi": false,
        "singleQuote": true
    }
根目录`eslintrc.js`
    
    方法小括号之前不需要空格
    rules: {
        'space-before-function-paren': 0
    },

##### 优化El-ui按需导入的形式
合并需要的组件到一行

    import { Button, Form, FormItem, Input, Message } from 'element-ui'

##### 提交登录部分的代码
    git status
    git add .
    git commit -m "tw完成了登录功能"
    git branch
    git checkout main 
    git push
    git checkout login
    git push -u origin login 

### 主页开发

##### 主页布局
```javascript
    element.js:
        import { Container, Header, Aside, Main } from 'element-ui'
        Vue.use(Container)
        Vue.use(Header)
        Vue.use(Aside)
        Vue.use(Main)
    El-ui中  默认类名是组件名称
```

##### 左侧菜单布局
    导入组件

##### 通过接口获取数据
```js
main.js:
    // 通过axios请求拦截器添加token，保证拥有获取数据的权限
Home.vue:
    结构区：
    行为区：
        data() {
            return {
            // 左侧菜单数据
            menuList: [],
            }
        },
        created() {
            this.getMenuList()
        },
        methods: {
            // 获取所有的菜单
            async getMenuList() {
                const { data: res } = await this.$http.get('menus')
                if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
                this.menuList = res.data
            },
        },
    表现区域：
```

##### 左侧菜单UI绘制
```js
要点是for循环渲染页面：
    <el-menu
        background-color="#333744"
        text-color="#fff"
        active-text-color="#409EFF"
        unique-opened
    >
        <!-- 一级菜单 -->
        <el-submenu
        :index="item.id + ''"
        v-for="item in menuList"
        :key="item.id"
        >
        <!-- 一级菜单模板区域 -->
        <template slot="title">
            <i :class="iconsObj[item.id]"></i>
            <span>{{ item.authName }}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item
            :index="subItem.id + ''"
            v-for="subItem in item.children"
            :key="subItem.id"
        >
            <template slot="title">
            <i class="el-icon-menu"></i>
            <span>{{ subItem.authName }}</span>
            </template>
        </el-menu-item>
        </el-submenu>
    </el-menu>
左侧菜单的折叠与展开：
    <div class="toggle-button" @click="toggleCollapse">|||</div>
    <el-menu :collapse="isCollapse" :collapse-transition="false" >
    data:
        isCollapse: false,
    methods:
        toggleCollapse() {
            this.isCollapse = !this.isCollapse
        },
    <el-aside :width="isCollapse ? '64px' : '200px'">
```

##### 首页路由重定向
```js
创建Welcome.vue
配置router.js:
    导入Welcome组件
    添加子路由规则
    import Welcome from '../components/Welcome.vue'
    {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [
        { path: '/welcome', component: Welcome }
        ]
    }
Home.vue:
    <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
    </el-main>

```

##### 左侧菜单改为路由链接
```js
侧边栏开启路由模式：
    <el-menu router >
    <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
            >
```

### 用户管理模块开发

##### 创建用户列表组件:
```js
组件创建：
    components/user/Users.vue
router.js:
    import Users from '../components/user/Users.vue'
    {
        path: '/home',
        children: [
        { path: '/users', component: Users },
        ]
    }
创建面包屑导航区域：
创建卡片视图区域：
```

##### 获取用户列表数据
```js
User.js:
    行为区：
        发送请求
        保存到data

```

##### 渲染用户列表数据
```js
用户列表区域:
    <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
    </el-table>
状态列修改：
    <el-table-column label="状态" >
        <template slot-scope="scope">
            <el-switch
                v-model="scope.row.mg_state"
                active-color="#13ce66"
            >
            </el-switch>
        </template>
    </el-table-column>
自定义操作列渲染：
添加分页视图：
实现用户状态改变：
实现搜索功能：
实现添加用户功能：
邮箱手机号校验:
关闭添加用户重置表单：
用户表单预校验与提交：
添加用户信息修改功能：
根据ID查询用户信息并显示到修改用户对话框中：
关闭编辑用户重置表单：
编辑提交之前的表单预校验与提交：
实现删除操作：
分配角色与权限管理相关，先不管
提交git
```

### 权限管理模块开发

##### 权限列表页面开发
创建、引入组件
权限列表页面布局
```js
发送请求获取所有权限列表
渲染table表格
```

##### 角色列表页面开发
创建、引入组件
角色列表页面布局
```js
添加角色的按钮
发送请求获取所有角色列表
渲染table表格
```


### 商品管理模块开发

##### 商品分类页面
```js
第三方插件实现树形表格：
    安装运行依赖：`vue-table-tree-grid`
    main.js:
        // 导入树形表格插件
        import TreeTable from 'vue-table-with-tree-grid'
        // 自定义组件的声明 
        Vue.component('tree-table', TreeTable) 

```

##### 分类参数页面
```js
数据绑定实现多个按钮共用一个对话框

```

##### 商品列表页面
```js
创建全局时间过滤器
    main.js:
        Vue.filter('dataFormat', function (originVal) {
            const date = new Date(originVal)
            const y = date.getFullYear()
            const m = (date.getMonth() + 1 + '').padStart(2, '0')
            const d = (date.getDay() + '').padStart(2, '0')

            const hh = (date.getHours() + '').padStart(2, '0')
            const mm = (date.getMinutes() + '').padStart(2, '0')
            const ss = (date.getSeconds() + '').padStart(2, '0')

            return `${y}-${m}-${d} ${hh}:${mm}:${ss}`

        })
跳转到添加商品页面：
    // 添加路由导航页面
    this.$router.push('/goods/add')
    goods文件夹添加组件：
        AddGoods.vue
    第一个children添加子路由规则：
        { path: '/goods/add', component: AddGoods },
    简单字符串到数字转换：
        activeIndex - 0
    Upload组件自己封装了一个请求Ajax，需要改掉：
    商品内容需要富文本编辑器：
        安装运行依赖 `vue-quill-editor @3.0.6`
    安装运行依赖 lodash @4.17.111:
        做深拷贝 `cloneDeep(obj)`
        script中 第一行导入
跳转到编辑商品页面：
```

### 订单管理模块开发

##### 订单列表页面
```js
导入省市区数据：
    script区域 导入数据
    import cityData from './citydata.js'
使用时间轴组件：
    插件版本旧  不能直接使用 需要外部导入src
    element.js:
        import Timeline from '../plugins/timeline/index'
        import TimelineItem from '../plugins/timeline-item/index'
    Orders.vue:
        <style lang="less" scoped>
        @import '../../plugins/timeline/timeline.css';
        @import '../../plugins/timeline-item/timeline-item.css';
```

### 数据统计模块开发

##### 数据报表页面
```js
安装运行依赖：`echarts @4.1.0` 看教程操作
    npm install echarts@4.1.0 --save
Reports.vue:
    行为区第一行导入 ：
        import echarts from 'echarts'
        import _ from 'lodash'
    dom初始化完毕:
    mounted() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'))
    },
```