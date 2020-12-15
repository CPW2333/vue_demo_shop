<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加区域 El-UI的栅格布局 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入关键字查询"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
            @keyup.enter.native="handleInputConfirm()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoodsPage()">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 渲染商品列表表格 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column
          label="商品名称"
          prop="goods_name"
          min-width="300px"
        ></el-table-column>
        <el-table-column
          label="商品价格(￥)"
          prop="goods_price"
          width="100px"
        ></el-table-column>
        <el-table-column
          label="商品数量"
          width="100px"
          prop="goods_number"
        ></el-table-column>
        <el-table-column label="商品入库时间" prop="add_time">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="175px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditGoodsInfoDialog(scope.row.goods_id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeGoodsById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页视图区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加商品对话框 -->
    <!-- 编辑商品对话框 -->
    <el-dialog
      title="修改商品"
      :visible.sync="editGoodsInfoDialogVisible"
      width="40%"
      @close="editGoodsInfoDialogClose"
    >
      <span>
        <el-form
          :model="editGoodsInfoForm"
          :rules="editGoodsInfoFormRules"
          ref="editGoodsInfoFormRef"
          label-width="95px"
        >
          <el-form-item label="商品名称：" prop="goods_name">
            <el-input v-model="editGoodsInfoForm.goods_name"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editGoodsInfoDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditGoodsInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取商品列表的参数对象
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        // 每页显示数据条数
        pagesize: 5
      },
      // 商品列表数据
      goodsList: [],
      // 总数据条数
      total: 0,

      // 添加商品对话框是否显示
      //   addGoodsPage: false,
      // 添加商品所需信息对象
      addGoodsForm: {
        goods_name: ''
      },
      // 验证规则
      addGoodsFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名！', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur'
          }
        ]
      },

      // 编辑商品对话框是否显示
      editGoodsInfoDialogVisible: false,
      // 接收请求到的商品信息对象
      editGoodsInfoForm: {},
      //   验证规则
      editGoodsInfoFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名！', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    // 获取商品列表数据
    async getGoodsList () {
      // 去除输入框空格
      this.queryInfo.query = this.queryInfo.query.trim()
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // console.log(res)
      // 查询结果优化
      if (res.data.goods.length === 0 && res.data.total !== 0) {
        // console.log(this.queryInfo.query.length)
        // 判断输入框是否有值
        if (this.queryInfo.query.length !== 0) {
          // 输入框有值 是条件查询 改页码再来一次请求
          this.queryInfo.pagenum = 1
          this.getGoodsList()
        } else {
          // 输入框没有值 是删除操作
          this.queryInfo.pagenum = res.data.pagenum - 1
          // 页码不能为0
          if (this.queryInfo.pagenum === 0) this.queryInfo.pagenum = 1
          // 再请求一次
          this.getGoodsList()
        }
      }
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 监听pagesize改变的
    handleSizeChange (newSize) {
      //   console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 监听页码值改变的
    handleCurrentChange (newPage) {
      //   console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 监听在输入框按了回车键
    handleInputConfirm () {
      // console.log('按了回车键');
      this.getGoodsList()
    },

    // 监听打开添加商品页面
    addGoodsPage () {
      // 添加路由导航页面
      this.$router.push('/goods/add')
    },

    // 监听编辑商品对话框是否显示
    async showEditGoodsInfoDialog (goodsId) {
      // 发送请求
      const { data: res } = await this.$http.get('goods/' + goodsId)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 保存查询到的商品信息
      this.editGoodsInfoForm = res.data
      this.editGoodsInfoDialogVisible = true
      //   console.log(res)
    },
    // 监听提交编辑商品、
    submitEditGoodsInfo () {
      console.log('点击了商品提交按钮')
      this.$refs.editGoodsInfoFormRef.validate((valid) => {
        if (!valid) return this.$message.warning('规则校验失败')
      })
    },
    // 监听编辑商品对话框是否关闭
    editGoodsInfoDialogClose () {
      console.log('关闭了编辑商品对话框')
      this.$refs.editGoodsInfoFormRef.resetFields()
    },

    // 监听移除商品
    async removeGoodsById (goodsId) {
      // 弹框提示
      const confirmRes = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (confirmRes !== 'confirm') {
        return this.$message.info('已取消删除！')
      }
      // 发起删除请求
      const { data: res } = await this.$http.delete('goods/' + goodsId)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getGoodsList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
