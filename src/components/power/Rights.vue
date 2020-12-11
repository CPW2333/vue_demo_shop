<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 所有分类表格 -->
    <el-card>
      <tree-table
        class="treeTable"
        :data="modifiedRightsTree"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text=""
        border
        :show-row-hover="true"
      >
        <!-- 排序 模板 -->
        <template slot="rank" slot-scope="scope">
          <el-tag type="" v-if="scope.row.level === 0">一级权限</el-tag>
          <el-tag v-if="scope.row.level === 1" type="success">二级权限</el-tag>
          <el-tag v-if="scope.row.level === 2" type="warning">三级权限</el-tag>
        </template>
      </tree-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 所有的权限列表
      rightsList: [],
      // 所以权限树
      rightsTree: [],
      // 改造的权限树
      modifiedRightsTree: [],
      // 为tree-table指定列的定义
      columns: [
        {
          label: '权限名称',
          prop: 'authName'
        },
        {
          label: '路径',
          prop: 'path'
        },
        {
          label: '权限等级',
          type: 'template',
          template: 'rank'
        }
      ]
    }
  },
  created () {
    // this.getRightsList()
    this.getRightsTree()
  },
  methods: {
    /* async getRightsList() {
      // 请求参数设置为list
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('权限列表数据获取失败')
      }
      this.rightsList = res.data
    }, */
    async getRightsTree () {
      // 请求参数设置为Tree
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('权限列表数据获取失败')
      }
      this.rightsTree = res.data
      this.modifyRightsTree()
    },
    // 改造rightsTree加上权限等级
    modifyRightsTree () {
      if (this.rightsTree.length !== 0) {
        this.modifiedRightsTree = this.rightsTree
        // this.rightsTree.push('level:0')
        // map不会改变原数组
        this.modifiedRightsTree.forEach((v1) => {
          v1.level = 0
          v1.children.forEach((v2) => {
            v2.level = 1
            v2.children.forEach((v3) => {
              v3.level = 2
            })
          })
        })
        // console.log(this.modifiedRightsTree)
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
