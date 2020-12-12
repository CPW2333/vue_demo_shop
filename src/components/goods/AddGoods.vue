<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 头部警告区域 -->
      <el-alert
        title="添加商品信息"
        :closable="false"
        show-icon
        center
        type="info"
      >
      </el-alert>
      <!-- 步骤条区域 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        align-center
        finish-status="success"
      >
        <el-step title="基本信息" icon="el-icon-edit"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成" icon="iconfont icon-shangchuan"></el-step>
      </el-steps>
      <!-- taba栏区域 -->
      <el-form
        :model="addGoodsForm"
        :rules="addGoodsFormRules"
        ref="addGoodsFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTabLeave"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name"
              ><el-input v-model="addGoodsForm.goods_name"></el-input
            ></el-form-item>
            <el-form-item label="商品价格" prop="goods_price"
              ><el-input
                type="number"
                v-model="addGoodsForm.goods_price"
              ></el-input
            ></el-form-item>
            <el-form-item label="商品重量" prop="goods_weight"
              ><el-input
                type="number"
                v-model="addGoodsForm.goods_weight"
              ></el-input
            ></el-form-item>
            <el-form-item label="商品数量" prop="goods_number"
              ><el-input
                type="number"
                v-model="addGoodsForm.goods_number"
              ></el-input
            ></el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 选择商品分类的级联选择框 -->
              <el-cascader
                clearable
                v-model="addGoodsForm.goods_cat"
                :options="catesList"
                :props="catesProps"
                @change="keysSelected"
              >
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
          <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 默认激活的步骤
      activeIndex: '0',
      //   添加商品的表单对象
      addGoodsForm: {
        goods_name: '',
        goods_price: 100,
        goods_weight: 100,
        goods_number: 100,
        // 商品所属的分类数组 级联选择器双向绑定的数据
        goods_cat: []
      },
      //   添加商品的表单对象验证规则
      addGoodsFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名！', trigger: 'blur' },
          {
            min: 2,
            max: 60,
            message: '长度在 2 到 60 个字符',
            trigger: 'blur'
          }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格！', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量！', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类！', trigger: 'blur' }
        ]
      },
      // 获取所有商品分类数据
      catesList: [],
      // 指定级联选择器的配置对象
      catesProps: {
        expandTrigger: 'hover',
        // checkStrictly: true,
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
      // 级联选择器双向绑定的数据
      //   selectedCateKeys: [],
    }
  },
  created () {
    this.getCatesList()
  },
  methods: {
    // 获取商品分类列表
    async getCatesList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)

      this.catesList = res.data
      // console.log(this.catesList)
    },

    // 级联选择框选中项变化
    keysSelected () {
      if (this.addGoodsForm.goods_cat.length !== 3) {
        this.addGoodsForm.goods_cat = []
        return this.$message.warning('只允许选中第三级分类')
      }
      console.log(this.addGoodsForm.goods_cat)
      //   this.$message.warning('只能选中三级')
      //   this.getParamsOrAttrsData()
    },

    // tab标签切换
    beforeTabLeave (activeName, oldActiveName) {
      // activeName:即将离开的标签页名字
      if (oldActiveName === '0' && this.addGoodsForm.goods_cat.length !== 3) {
        this.$message.warning('请先完成基本信息的填写')
        // 阻止标签页切换
        return false
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
