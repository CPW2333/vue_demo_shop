<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog()"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 所有分类表格 -->
      <tree-table
        class="treeTable"
        :data="catesList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text=""
        border
        :show-row-hover="true"
      >
        <!-- 是否有效 模板 -->
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: #21b10d"
          ></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <!-- 排序 模板 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" type="" size="mini"
            >一级分类</el-tag
          >
          <el-tag v-if="scope.row.cat_level === 1" type="success" size="mini"
            >二级分类</el-tag
          >
          <el-tag v-if="scope.row.cat_level === 2" type="warning" size="mini"
            >三级分类</el-tag
          >
        </template>
        <!-- 操作 模板 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditCateInfoDialog(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeCateById(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="40%"
      @close="addCateDialogClose"
    >
      <!-- 内容主体区域 -->
      <span>
        <el-form
          :model="addCateForm"
          :rules="addCateFormRules"
          ref="addCateFormRef"
          label-width="95px"
        >
          <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类：">
            <!-- 级联选择框
            options:用来指定数据源
            props:用来指定数据对象-->
            <el-cascader
              clearable
              v-model="selectedKeys"
              :options="parentCatesList"
              :props="cascaderProps"
              @change="parentKeysSelected"
            >
            </el-cascader>
          </el-form-item>
        </el-form>
      </span>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitaddCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类信息的对话框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editCateInfoDialogVisible"
      width="40%"
      @close="editCateInfoDialogClose"
    >
      <span>
        <el-form
          :model="editCateInfoForm"
          :rules="editCateInfoFormRules"
          ref="editCateInfoFormRef"
          label-width="95px"
        >
          <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="editCateInfoForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateInfoDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditCateInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 商品列表查询携带参数
      queryInfo: {
        // 最多显示3级分类
        type: 3,
        // 默认第几页 比返回的pagenum多一夜
        pagenum: 1,
        // 每页几条数据
        pagesize: 5
      },
      // 商品分类数据列表
      catesList: [],
      // 商品总条数
      total: 0,

      // 为tree-table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 表示将当前列定义为模板列
          type: 'template',
          // 当前这一列使用的模板名称
          template: 'isOk'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],

      // 添加分类对话框是否显示
      addCateDialogVisible: false,
      // 添加分类表单对象
      addCateForm: {
        // 父级分类的id 默认为0
        cat_pid: 0,
        cat_name: '',
        // 分类等级 0为一级分类
        cat_level: 0
      },
      // 添加分类表单验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名！', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur'
          }
        ]
      },
      // 所有父级分类列表
      parentCatesList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        checkStrictly: true,
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 保存被选择的父级分类id
      selectedKeys: [],
      // 控制级联框显示隐藏
      cascaderStyles: {
        display: 'block'
      },

      // 编辑分类对话框是否可见
      editCateInfoDialogVisible: false,
      // 编辑分类要提交的参数的对象
      editCateInfoForm: {},
      // 校验规则
      editCateInfoFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名！', trigger: 'blur' },
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
    this.getCatesList()
  },
  methods: {
    // 获取商品分类列表
    async getCatesList () {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.catesList = res.data.result
      this.total = res.data.total
      // console.log(res);
    },
    // 监听每页大小变化
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCatesList()
    },
    // 监听页码变化
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCatesList()
    },

    // 监听添加分类对话框
    showAddCateDialog () {
      this.getParentCatesList()
      this.addCateDialogVisible = true
    },
    // 获取一级二级分类列表
    async getParentCatesList () {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.parentCatesList = res.data
      // console.log(res)
    },
    // 监听级联选择器父级分类id被选中
    parentKeysSelected () {
      // this.selectedKeys长度大于0 则选中父级分类
      if (this.selectedKeys.length > 0) {
        // 设置父级分类id
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        // 设置分类等级
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
      // 关闭级联框
      // this.cascaderStyles.display = 'none'
    },
    // 监听添加分类对话框关闭
    addCateDialogClose () {
      this.$refs.addCateFormRef.resetFields()
      // 重置父级分类
      this.selectedKeys = []
      // 重置表单数据
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 监听添加分类确认提交
    submitaddCate () {
      // 预校验
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('规则校验失败')
        // 发送请求
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        // console.log(res.data)
        this.$message.success(res.meta.msg)
        this.getCatesList()
        this.addCateDialogVisible = false
      })
    },

    // 监听编辑分类对话框开启
    async showEditCateInfoDialog (id) {
      // console.log(id)
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editCateInfoForm = res.data
      // console.log(this.editCateInfoForm);
      this.editCateInfoDialogVisible = true
    },
    // 监听编辑分类对话框关闭
    editCateInfoDialogClose () {
      this.$refs.editCateInfoFormRef.resetFields()
    },
    // 监听提交编辑分类按钮
    submitEditCateInfo () {
      this.$refs.editCateInfoFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('规则校验失败')
        // 发起网络请求
        const { data: res } = await this.$http.put(
          `categories/${this.editCateInfoForm.cat_id}`,
          {
            cat_name: this.editCateInfoForm.cat_name
          }
        )
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.editCateInfoDialogVisible = false
        this.getCatesList()
      })
    },

    // 监听删除分类事件
    async removeCateById (id) {
      // console.log(id);
      // 弹框提示
      const confirmRes = await this.$confirm(
        '此操作将永久删除该分类, 是否继续?',
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
      const { data: res } = await this.$http.delete('categories/' + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getCatesList()
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}

.el-cascader {
  width: 100%;
}
</style>
