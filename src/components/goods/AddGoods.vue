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
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="提交" icon="iconfont icon-shangchuan"></el-step>
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
          @tab-click="TabClicked"
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
          <el-tab-pane label="商品参数" name="1" prop="goods_cat">
            <!-- 渲染表单的item -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals"
                ><el-checkbox
                  :label="item1"
                  :key="i1"
                  v-for="(item1, i1) in item.attr_vals"
                ></el-checkbox
              ></el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              :key="item.attr_id"
              v-for="item in onlyTableData"
              ><el-input v-model="item.attr_vals"></el-input
            ></el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-tag class="upImgTag" :closable="false" center type="warning"
              >点 "+" 上传商品图片</el-tag
            >
            <!-- action="https://jsonplaceholder.typicode.com/posts/" -->
            <el-upload
              :action="UploadImgUrl"
              :headers="UpImgResHeaderOjb"
              list-type="picture-card"
              multiple
              :on-success="handleUpImgOk"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleImgRemove"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog
              title="图片预览"
              class="previewImg"
              :visible.sync="uploadImgDialogVisible"
            >
              <img width="100%" :src="uploadImgDialogImgUrl" alt="" />
            </el-dialog>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addGoodsForm.goods_introduce"></quill-editor>
            <!-- 添加商品按钮 -->
            <el-button
              class="btnAddGoods"
              @click="submitAddGoods"
              type="primary"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import _ from 'lodash'
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
        goods_cat: [],
        // 图片临时路劲
        pics: [],
        // 商品详情描述 富文本编辑器里面
        goods_introduce: '',
        // 商品的参数
        attrs: []
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
      },
      // 级联选择器双向绑定的数据
      //   selectedCateKeys: [],

      // 获取的动态参数的数据
      manyTableData: [],
      // 获取的静态属性的数据
      onlyTableData: [],

      // 图片预览的图片url路径
      uploadImgDialogImgUrl: '',
      // 图片预览对话框
      uploadImgDialogVisible: false,
      // 图片上传的路径
      UploadImgUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传需要的token
      UpImgResHeaderOjb: {
        Authorization: window.sessionStorage.getItem('token')
      }
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
        if (this.addGoodsForm.goods_cat.length === 2) {
          this.$message.warning('只允许选中第三级分类')
        }
        this.addGoodsForm.goods_cat = []
      }
      // console.log(this.addGoodsForm.goods_cat)
      //   this.$message.warning('只能选中三级')
      //   this.getParamsOrAttrsData()
    },

    // tab标签切换
    beforeTabLeave (activeName, oldActiveName) {
      // activeName:即将离开的标签页名字
      if (oldActiveName === '0' && this.addGoodsForm.goods_cat.length !== 3) {
        this.$message.warning('请先选中第三级商品分类！')
        // 阻止标签页切换
        return false
      }
    },
    // 监听点击tabs
    async TabClicked () {
      // console.log(this.activeIndex);
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'many' }
          }
        )
        if (res.meta.status !== 200) return this.$message.error('获取数据失败')
        res.data.forEach((v) => {
          v.attr_vals = v.attr_vals ? v.attr_vals.split(' ') : []
        })
        this.manyTableData = res.data
        // console.log(this.manyTableData)
      }
      if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        if (res.meta.status !== 200) return this.$message.error('获取数据失败')
        this.onlyTableData = res.data
        // console.log(this.onlyTableData)
      }
    },

    // 移除图片
    handleImgRemove (file, fileList) {
      // 删除pics数组的图片
      const filePath = file.response.data.tmp_path
      const index = this.addGoodsForm.pics.findIndex((v) => v.pic === filePath)
      this.addGoodsForm.pics.splice(index, 1)
      // console.log(this.addGoodsForm.pics)
    },
    // 图片预览
    handlePictureCardPreview (file) {
      this.uploadImgDialogImgUrl = file.url
      this.uploadImgDialogVisible = true
    },
    // 图片上传成功
    handleUpImgOk (response, file, fileList) {
      const picInfo = { pic: response.data.tmp_path }
      this.addGoodsForm.pics.push(picInfo)
      // console.log(this.addGoodsForm.pics)
    },

    // 添加商品
    submitAddGoods () {
      // console.log(this.addGoodsForm)
      this.$refs.addGoodsFormRef.validate(async (valid) => {
        if (!valid) return this.$message.warning('请正确填写商品信息')

        // 发送请求 先改造数据
        // Lodash 做深拷贝 cloneDeep(obj)
        const form = _.cloneDeep(this.addGoodsForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数 静态属性
        this.manyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addGoodsForm.attrs.push(newInfo)
        })
        this.onlyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addGoodsForm.attrs.push(newInfo)
        })
        form.attrs = this.addGoodsForm.attrs
        // console.log(form)
        // 发请求 商品名字唯一
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) {
          // console.log(res)
          // 清空attrs数组
          this.addGoodsForm.attrs = []
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        // console.log(res)
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId () {
      if (this.addGoodsForm.goods_cat.length === 3) {
        // console.log(this.addGoodsForm.goods_cat[2]);
        return this.addGoodsForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 30px 0 0 !important;
}
.upImgTag {
  margin-bottom: 15px;
}
.btnAddGoods {
  margin-top: 15px;
}
</style>
