<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', 'vcenter', i1 === 0 ? 'bdtop' : '']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级、三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                >
                  <!-- 二级权限 -->
                  <el-col :span="5">
                    <el-tag
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      type="success"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="19">
                    <el-tag
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <!-- 标题列 -->
        <el-table-column label="角色名称" width="150px" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditRoleInfoDialog(scope.row.id)"
              >编辑</el-button
            >
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRoleById(scope.row.id)"
              >删除</el-button
            >
            <!-- 分配角色按钮 -->
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色的对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="40%"
      @close="addRoleDialogClose"
    >
      <!-- 内容主体区域 -->
      <span>
        <el-form
          :model="addRoleForm"
          :rules="addRoleFormRules"
          ref="addRoleFormRef"
          label-width="95px"
        >
          <el-form-item label="角色名称：" prop="roleName">
            <el-input v-model="addRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述：">
            <el-input v-model="addRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色信息的对话框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editRoleInfoDialogVisible"
      width="40%"
      @close="editRoleInfoDialogClose"
    >
      <span>
        <el-form
          :model="editRoleInfoForm"
          :rules="editRoleInfoFormRules"
          ref="editRoleInfoFormRef"
          label-width="95px"
        >
          <el-form-item label="角色名称：" prop="roleName">
            <el-input v-model="editRoleInfoForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述：">
            <el-input v-model="editRoleInfoForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleInfoDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="40%"
      @close="setRightDialogClose"
    >
      <!-- 内容主体区域 -->
      <span>
        <el-tree
          :data="rightsList"
          :props="treeProps"
          show-checkbox
          node-key="id"
          :default-expand-all="false"
          :default-checked-keys="defKeys"
          ref="treeRef"
        ></el-tree>
      </span>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitSetRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 所有的角色列表
      rolesList: [],

      // 添加角色对话框是否显示
      addRoleDialogVisible: false,
      // 添加角色所需的对象信息
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色需要的表单验证规则对象
      addRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名！', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur'
          }
        ]
      },

      // 编辑角色对话框是否显示
      editRoleInfoDialogVisible: false,
      // 编辑角色信息所需的对象信息
      editRoleInfoForm: {},
      // 编辑角色信息需要的表单验证规则对象
      editRoleInfoFormRules: {
        roleName: [
          { required: true, message: '请输入角色名！', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur'
          }
        ]
      },

      // 分配权限对话框是否显示
      setRightDialogVisible: false,
      // 保存获取的所有的权限列表
      rightsList: [],
      // 定义树形结构显示规则字段
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的三级节点id值是否选中
      defKeys: [],
      // 保存当前即将分配权限的角色的id
      roleId: ''
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    //   获取角色列表
    async getRolesList () {
      // 请求参数设置为list
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.rolesList = res.data
    },
    // 添加角色对话框关闭
    addRoleDialogClose () {
      this.$refs.addRoleFormRef.resetFields()
    },
    // 添加角色按钮
    submitAddRole () {
      // 表单预校验与提交信息
      this.$refs.addRoleFormRef.validate(async (valid) => {
        if (!valid) return this.$message.warning('规则校验失败')
        // 发起网络请求
        const { data: res } = await this.$http.post('roles', this.addRoleForm)
        // console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.addRoleDialogVisible = false
        this.getRolesList()
      })
    },

    // 点击编辑角色信息按钮
    async showEditRoleInfoDialog (id) {
      const { data: res } = await this.$http.get(`roles/${id}`)
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 保存查询到的角色信息
      this.editRoleInfoForm = res.data
      // console.log(this.editRoleInfoForm);
      // 显示修改角色对话框
      this.editRoleInfoDialogVisible = true
    },

    // 移除角色信息
    async removeRoleById (id) {
      // 弹框提示
      const confirmRes = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
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
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getRolesList()
    },

    // 关闭编辑角色对话框
    editRoleInfoDialogClose () {
      this.$refs.editRoleInfoFormRef.resetFields()
    },
    // 提交编辑角色信息
    submitEditRoleInfo () {
      this.$refs.editRoleInfoFormRef.validate(async (valid) => {
        if (!valid) return this.$message.warning('规则校验失败')
        // 发起网络请求
        const { data: res } = await this.$http.put(
          `roles/${this.editRoleInfoForm.roleId}`,
          {
            roleName: this.editRoleInfoForm.roleName,
            roleDesc: this.editRoleInfoForm.roleDesc
          }
        )
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.editRoleInfoDialogVisible = false
        this.getRolesList()
      })
    },

    // 点击删除权限叉号
    async removeRightById (role, rightId) {
      // 弹框提示
      const confirmRes = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
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
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      // 不刷新页面 只刷新权限列表
      role.children = res.data
    },

    // 点击显示分配权限对话框
    async showSetRightDialog (role) {
      // 保存当前角色id
      this.roleId = role.id
      // 获取所有权限数据
      const { data: res } = await this.$http.get('rights/tree')
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 保存查询到的所有权限信息
      this.rightsList = res.data
      //   递归获取三级节点的id
      this.getLeafKeys(role, this.defKeys)
      //   显示对话框
      this.setRightDialogVisible = true
    },
    // 关闭分配权限对话框
    setRightDialogClose () {
      this.defKeys = []
    },
    // 分配权限提交
    async submitSetRight () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')

      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getRolesList()
      this.setRightDialogVisible = false
    },
    // 获取三级权限的id,保存到数组
    getLeafKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach((item) => this.getLeafKeys(item, arr))
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
