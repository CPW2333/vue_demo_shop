<template>
  <div class="login_container">
    <!-- 登录组件 -->
    <div class="login_box">
      <!-- 头像盒子 -->
      <div class="avater_box">
        <img src="../assets/user.png" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        ref="loginFormRef"
        :rules="loginFormRules"
        :model="loginForm"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-password"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 测试账号密码区域 -->
        <div class="el-upload__tip">测试账号:testuser,密码:123456</div>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button @click="login" type="primary">登录</el-button>
          <el-button @click="resetLoginFormRef" type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 登录表单的数据绑定对象
      loginForm: {
        username: '',
        password: ''
      },
      // 表单验证规则对象
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名！', trigger: 'blur' }
          /* {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur',
          }, */
        ],
        password: [
          { required: true, message: '请输入密码！', trigger: 'blur' }
          /* {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          }, */
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮事件
    resetLoginFormRef () {
      // console.log(this.$refs);
      this.$refs.loginFormRef.resetFields()
    },
    // 登录事件
    login () {
      // 登录预验证
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        // console.log(res);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        // 记录token 方便后续访问
        window.sessionStorage.setItem('token', res.data.token)
        // 页面跳转
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  .login_box {
    /* 绝对定位再加位移居中 */
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    .avater_box {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 10px;
      width: 130px;
      height: 130px;
      background-color: #fff;
      border-bottom: 1px solid #eee;
      border-radius: 50%;
      box-shadow: 0 0 10px #ddd;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .login_form {
      box-sizing: border-box;
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 40px;
      .btns {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
