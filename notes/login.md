### 登录/退出功能 
#### 登录功能
##### 删除不必要的代码
    App.vue:
        #app中的标签删除
        script 不需要导入与注册 helloworld组件
        style样式也清空
        app根组件可以写入自己的东西
    router.js:
        不需要导入Home组件 不需要创建与此有关的规则
    删除views文件夹
    删除components的helloworld.vue组件
##### 创建登录组件
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
##### 登录页面布局
通过 Element-UI 组件实现布局：

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

表单数据绑定：

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
        
表单数据验证：

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

表单重置：

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
    
登录前预校验：

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

弹窗提示：

    element.js:
        import { Message} from 'element-ui'
        // $自定义名字 = 正确组件名
        Vue.prototype.$message = Message
    Login.vue:
        login() {
            this.$message.success('登录成功！')
        }

登录成功后的行为：

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

路由导航守卫控制访问权限：

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
#### 退出功能
核心原理：销毁token
    
    Home.vue:
        <el-button type="info">退出</el-button>
        methods: {
            logout() {
                window.sessionStorage.clear();
                this.$router.push('/login');
                this.$message.success('退出成功！')
            },
        },
#### 语法警告处理
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
#### 优化El-ui按需导入的形式
合并需要的组件到一行

    import { Button, Form, FormItem, Input, Message } from 'element-ui'
#### 提交登录部分的代码
    git status
    git add .
    git commit -m "tw完成了登录功能"
    git branch
    git checkout main 
    git push
    git checkout login
    git push -u origin login 