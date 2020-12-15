<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 头部警告区域 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        :closable="false"
        show-icon
        type="warning"
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="car_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            clearable
            v-model="selectedCateKeys"
            :options="catesList"
            :props="catesProps"
            @change="keysSelected"
          >
          </el-cascader>
        </el-col>
      </el-row>
      <!-- 添加静态/动态参数的面板 -->
      <el-tabs v-model="activeTabName" @tab-click="handleTabsClick">
        <el-tab-pane label="动态参数" name="many"
          ><el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="showAddParamOrAttrDialog"
            >添加动态参数</el-button
          >
          <!-- 渲染动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag
                  @close="handleTagsClose(i, scope.row)"
                  closable
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  >{{ item }}</el-tag
                >
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加tag的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  type="success"
                  @click="showInput(scope.row)"
                  plain
                  >+ 添加</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <!-- 数据列 -->
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditParamOrAttrDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParamOrAttr(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only"
          ><el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="showAddParamOrAttrDialog"
            >添加静态属性</el-button
          >
          <!-- 渲染静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag
                  @close="handleTagsClose(i, scope.row)"
                  closable
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  >{{ item }}</el-tag
                >
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加tag的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  type="success"
                  @click="showInput(scope.row)"
                  plain
                  >+ 添加</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <!-- 数据列 -->
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditParamOrAttrDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParamOrAttr(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加静态属性、动态参数的对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addParamOrAttrDialogVisible"
      width="40%"
      @close="addParamOrAttrDialogClose"
    >
      <!-- 添加参数\属性的对话框 -->
      <span>
        <el-form
          :model="addParamOrAttrForm"
          :rules="addParamOrAttrFormRules"
          ref="addParamOrAttrFormRef"
          label-width="110px"
        >
          <el-form-item :label="titleText + '名：'" prop="attr_name">
            <el-input v-model="addParamOrAttrForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamOrAttrDialogVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="submitAddParamOrAttr"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 编辑静态属性、动态参数的对话框 -->
    <el-dialog
      :title="'编辑' + titleText"
      :visible.sync="editParamOrAttrDialogVisible"
      width="40%"
      @close="editParamOrAttrDialogClose"
    >
      <!-- 添加参数\属性的对话框 -->
      <span>
        <el-form
          :model="editParamOrAttrForm"
          :rules="editParamOrAttrFormRules"
          ref="editParamOrAttrFormRef"
          label-width="110px"
        >
          <el-form-item :label="titleText + '名：'" prop="attr_name">
            <el-input v-model="editParamOrAttrForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamOrAttrDialogVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="submitEditParamOrAttr"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 商品分类数据列表
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
      selectedCateKeys: [],

      // tabs栏默认激活选项
      activeTabName: 'many',
      // 获取的动态参数的数据
      manyTableData: [],
      // 获取的静态属性的数据
      onlyTableData: [],

      // 默认添加参数对话框是否显示
      addParamOrAttrDialogVisible: false,
      // 添加参数、属性所需的对象
      addParamOrAttrForm: {
        attr_name: ''
      },
      // 校验规则
      addParamOrAttrFormRules: {
        attr_name: [
          { required: true, message: '请输入参数或属性名！', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur'
          }
        ]
      },

      // 默认编辑参数对话框是否显示
      editParamOrAttrDialogVisible: false,
      // 添加参数、属性所需的对象
      editParamOrAttrForm: {
        attr_name: ''
      },
      // 校验规则
      editParamOrAttrFormRules: {
        attr_name: [
          { required: true, message: '请输入参数或属性名！', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur'
          }
        ]
      }

      //   // 控制按钮与文本框的显示隐藏
      //   inputVisible: false,
      //   // 文本框中输入的内容
      //   inputValue: '',
    }
  },
  created () {
    this.getCatesList()
  },
  methods: {
    // 获取商品分类列表
    async getCatesList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.catesList = res.data
      //   console.log(this.catesList)
    },

    // 级联选择框选中项变化
    keysSelected () {
      this.getParamsOrAttrsData()
    },
    // 监听tabs切换
    handleTabsClick (tab, event) {
      this.getParamsOrAttrsData()
    },
    // 请求参数列表
    async getParamsOrAttrsData () {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
        // this.$message.error('只允许选中第三级分类')
      }
      // console.log(this.selectedCateKeys)
      // 发起请求获取参数列表
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeTabName }
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      res.data.forEach((v) => {
        v.attr_vals = v.attr_vals ? v.attr_vals.split(' ') : []
        // 控制文本框显示与隐藏
        v.inputVisible = false
        // 文本框默认值
        v.inputValue = ''
      })
      // console.log(res.data)
      // 如果是动态参数
      if (this.activeTabName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },

    // 点击添加动态参数、静态属性
    showAddParamOrAttrDialog () {
      this.addParamOrAttrDialogVisible = true
    },
    // 提交添加参数或属性
    submitAddParamOrAttr () {
      this.$refs.addParamOrAttrFormRef.validate(async (valid) => {
        if (!valid) return this.$message.warning('规则校验失败')
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addParamOrAttrForm.attr_name,
            attr_sel: this.activeTabName
          }
        )
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getParamsOrAttrsData()
        this.addParamOrAttrDialogVisible = false
      })
    },
    // 监听添加属性\参数对话框关闭
    addParamOrAttrDialogClose () {
      //   this.addParamOrAttrForm.attr_name = ''
      this.$refs.addParamOrAttrFormRef.resetFields()
    },

    // 监听编辑属性或参数对话框
    async showEditParamOrAttrDialog (attrId) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attrId}`,
        {
          params: {
            attr_sel: this.activeTabName
          }
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editParamOrAttrForm = res.data
      this.editParamOrAttrDialogVisible = true
    },
    // 监听修改属性的提交
    submitEditParamOrAttr () {
      this.$refs.editParamOrAttrFormRef.validate(async (valid) => {
        if (!valid) return this.$message.warning('规则校验失败')
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editParamOrAttrForm.attr_id}`,
          {
            attr_name: this.editParamOrAttrForm.attr_name,
            attr_sel: this.activeTabName
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getParamsOrAttrsData()
        this.editParamOrAttrDialogVisible = false
      })
    },
    // 监听修改属性\参数对话框关闭
    editParamOrAttrDialogClose () {
      //   this.editParamOrAttrForm.attr_name = ''
      this.$refs.editParamOrAttrFormRef.resetFields()
    },

    // 点击移除参数\属性
    async removeParamOrAttr (attrId) {
      // 弹框提示
      const confirmRes = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
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
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attrId}`
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getParamsOrAttrsData()
    },

    // 按下回车或者失去焦点添加tag
    async handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''

      this.saveAttrVals(row)

      row.inputVisible = false
    },
    // 按下就切换到输入框
    showInput (row) {
      row.inputVisible = true
      // 文本框自动获取焦点
      // 页面元素重新被渲染之后 执行里面的代码
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    // 删除参数属性的具体选项tag
    handleTagsClose (index, row) {
      // splice(修改原数组)
      row.attr_vals.splice(index, 1)
      this.saveAttrVals(row)
    },
    // 保存 attr_vals 到数据库
    async saveAttrVals (row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
    }
  },
  computed: {
    // 如果按钮被禁用返回true
    isBtnDisabled () {
      if (this.selectedCateKeys.length !== 3) return true
      return false
    },
    // 当前选中的三级分类的id
    cateId () {
      if (this.selectedCateKeys.length === 3) return this.selectedCateKeys[2]
      return null
    },
    // 动态计算标题文本
    titleText () {
      if (this.activeTabName === 'many') return '动态参数'
      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
.car_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
