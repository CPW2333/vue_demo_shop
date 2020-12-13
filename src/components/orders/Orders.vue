<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 El-UI的栅格布局 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入关键字查询"
            v-model="queryInfo.query"
            clearable
            @clear="getOrdersList"
            @keyup.enter.native="handleInputConfirm()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="showTips"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表区域 -->
      <el-table :data="ordersList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="付款方式">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.order_pay === '0'"
              >未付款</el-tag
            >
            <el-tag type="" v-if="scope.row.order_pay === '1'">支付宝</el-tag>
            <el-tag type="success" v-if="scope.row.order_pay === '2'"
              >微信支付</el-tag
            >
            <el-tag type="warning" v-if="scope.row.order_pay === '3'"
              >银行卡</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="发货状态" prop="is_send">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.is_send === '否'">否</el-tag>
            <el-tag type="success" v-if="scope.row.is_send === '是'">是</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <!-- slot-scope="scope" -->
          <template>
            <!-- 修改订单地址 只是模拟 -->
            <el-tooltip
              effect="dark"
              content="修改订单地址"
              placement="top"
              :enterable="false"
              :open-delay="1000"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditGoodsAddressDialog"
              ></el-button>
            </el-tooltip>
            <!-- 物流信息 -->
            <el-tooltip
              effect="dark"
              content="物流信息"
              placement="top"
              :enterable="false"
              :open-delay="1000"
            >
              <el-button
                type="success"
                icon="el-icon-truck"
                size="mini"
                @click="showLogisticsStatusBox"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
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

    <!-- 编辑地址的对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editAddressDialogVisible"
      width="40%"
      @close="editAddressDialogClose"
    >
      <!-- 内容主体区域 -->
      <span>
        <el-form
          :model="editAddressrForm"
          :rules="editAddressrFormRules"
          ref="editAddressrFormRef"
          label-width="100px"
        >
          <el-form-item label="省市区/县：" prop="address1">
            <el-cascader
              :options="cityData"
              :props="{ expandTrigger: 'hover' }"
              v-model="editAddressrForm.address1"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址：" prop="address2">
            <el-input v-model="editAddressrForm.address2"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAddressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditAddress">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 显示物流的对话框 -->
    <el-dialog
      title="物流信息"
      :visible.sync="logisticsStatusDialogVisible"
      width="40%"
      @close="showLogisticsStatusDialogClose"
    >
      <!-- 内容主体区域 -->
      <span>
        <el-alert
          title="暂无数据！"
          type="warning"
          center
          :closable="false"
          show-icon
        >
        </el-alert>
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in logisticInfo"
            :key="index"
            :timestamp="activity.time"
          >
            {{ activity.context }}
          </el-timeline-item>
        </el-timeline>
      </span>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="logisticsStatusDialogVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="logisticsStatusDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        // 每页显示数据条数
        pagesize: 5
      },
      // 订单列表数据
      ordersList: [],
      // 总数据条数
      total: 0,

      // 修改地址对话框
      editAddressDialogVisible: false,
      editAddressrForm: {
        // 省市区/县
        address1: [],
        // 详细地址
        address2: ''
      },
      editAddressrFormRules: {
        address1: [
          { required: true, message: '请选择省市区/县！', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址！', trigger: 'blur' },
          {
            min: 5,
            max: 40,
            message: '长度在 5 到 40 个字符',
            trigger: 'blur'
          }
        ]
      },
      // 省市区数据
      cityData: cityData,

      // 显示物流信息对话框
      logisticsStatusDialogVisible: false,
      // 物流信息表单
      showLogisticsStatusrForm: {},
      // 供测试的物流单号：1106975712662
      logisticId: '1106975712662',
      // logisticInfo 物流信息
      logisticInfo: [
        {
          time: '2018-05-10 09:39:00',
          ftime: '2018-05-10 09:39:00',
          context: '已签收,感谢使用顺丰,期待再次为您服务',
          location: ''
        },
        {
          time: '2018-05-10 08:23:00',
          ftime: '2018-05-10 08:23:00',
          context:
            '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
          location: ''
        },
        {
          time: '2018-05-10 07:32:00',
          ftime: '2018-05-10 07:32:00',
          context: '快件到达 [北京海淀育新小区营业点]',
          location: ''
        },
        {
          time: '2018-05-10 02:03:00',
          ftime: '2018-05-10 02:03:00',
          context:
            '快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]',
          location: ''
        },
        {
          time: '2018-05-09 23:05:00',
          ftime: '2018-05-09 23:05:00',
          context: '快件到达 [北京顺义集散中心]',
          location: ''
        },
        {
          time: '2018-05-09 21:21:00',
          ftime: '2018-05-09 21:21:00',
          context: '快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]',
          location: ''
        },
        {
          time: '2018-05-09 13:07:00',
          ftime: '2018-05-09 13:07:00',
          context: '顺丰速运 已收取快件',
          location: ''
        },
        {
          time: '2018-05-09 12:25:03',
          ftime: '2018-05-09 12:25:03',
          context: '卖家发货',
          location: ''
        },
        {
          time: '2018-05-09 12:22:24',
          ftime: '2018-05-09 12:22:24',
          context: '您的订单将由HLA（北京海淀区清河中街店）门店安排发货。',
          location: ''
        },
        {
          time: '2018-05-08 21:36:04',
          ftime: '2018-05-08 21:36:04',
          context: '商品已经下单',
          location: ''
        }
      ]
    }
  },
  created () {
    this.getOrdersList()
  },
  methods: {
    async getOrdersList () {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.ordersList = res.data.goods
      this.total = res.data.total
      //   console.log(res)
    },
    // 监听pagesize改变的
    handleSizeChange (newSize) {
      //   console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getOrdersList()
    },
    // 监听页码值改变的
    handleCurrentChange (newPage) {
      //   console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getOrdersList()
    },

    // 回车按钮
    handleInputConfirm () {
      //   console.log(this.queryInfo)
      this.showTips()
    },
    // 搜索框提示
    showTips () {
      this.$message.warning('暂不支持查询，敬请期待！')
    },

    // 修改订单地址
    showEditGoodsAddressDialog () {
      this.editAddressDialogVisible = true
    },
    // 关闭编辑地址对话框
    editAddressDialogClose () {
      this.$refs.editAddressrFormRef.resetFields()
    },
    // 提交编辑地址
    submitEditAddress () {},

    // 查看物流进度
    showLogisticsStatusBox () {
      /* const { data: res } = await this.$http.post(
        'http://api.kdniao.cc/Ebusiness/EbusinessOrderHandle.aspx',
        {
          OrderCode: '',
          ShipperCode: 'SF',
          LogisticCode: '118650888018',
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg) */
      //   console.log(res)
      this.logisticsStatusDialogVisible = true
    },
    // 查看物流对话框关闭
    showLogisticsStatusDialogClose () {}
  }
}
</script>

<style lang="less" scoped>
@import '../../plugins/timeline/timeline.css';
@import '../../plugins/timeline-item/timeline-item.css';

.el-cascader {
  width: 100%;
}
</style>
