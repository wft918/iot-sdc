<template>
  <basic-container>
    <el-row :gutter="30">
      <!-- 左侧树形菜单 -->
      <el-col :span="5" class="tree-area">
        <el-card shadow="never" :body-style="contentViewHeight">
          <!-- <el-tag
            size="small" 
            style="margin-bottom:5px"
            v-if="selectName"
            :disable-transitions="false">
            {{selectName}}
          </el-tag> 
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input> -->
          <el-tree
            :highlight-current="false"
            :data="rackTree"
            :indent="2"
            node-key="id"
            :filter-node-method="filterNode"
            :props="{
                      value: 'id',
                      label: 'name',
                      children: 'children'
                    }"
            default-expand-all
            @node-click="handleNodeClick"
            ref="leftTree">
          </el-tree>
        </el-card>
      </el-col>
      <!-- 右侧表格 -->
      <el-col :span="19">
        <el-row :gutter="15" style="margin-top:15px;">
          <el-col :span="23">
            <span>所属位置：</span>
            <el-cascader
              ref="siteChoose"
              :options="siteData" 
              style="width:50%" 
              v-model="querySiteId"
              filterable
              @change="changeSite"
              :props="{value: 'id', label: 'name', children: 'children'}"
            >
            </el-cascader>         
          </el-col>
          <el-col :span="1">
            <el-tooltip effect="dark" content="显隐" placement="top">
              <el-button circle="" @click="chooseColumn" size="small" icon="el-icon-menu"></el-button>
            </el-tooltip>
          </el-col>
        </el-row>
        <el-table
          :data="recordTable" 
          border 
          row-key="id"
          style="margin: 0.75rem 0"
          :default-sort = "{prop: 'unitIndex'}"
          :empty-text="recordEmptyText"
        >
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="50"
          ></el-table-column>
          <el-table-column
            v-if="columnList[0].show"
            prop="unitIndex"
            label="名称"
            sortable
            show-overflow-tooltip
            :sort-method="(a, b) => sortTable(a, b, 'unitIndex')"
            align="center"
          >
          <template slot-scope="scope">
            <el-link :underline="false" type="primary" @click="tableAction(scope.row, 2)">{{'U' + scope.row.unitIndex}}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            v-if="columnList[1].show"
            label="所处位置"
            align="center"
            width="220"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span v-if="scope.row.expand.siteNames">{{scope.row.expand.siteName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="columnList[2].show"
            prop="rackName"
            label="机柜"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            v-if="columnList[3].show"
            prop="state"
            label="租用情况"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.state === '0'">空闲</span>
              <span v-else>已出租</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="columnList[4].show"
            prop="expand.name"
            label="客户"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            v-if="columnList[5].show"
            prop="contract"
            label="联系人"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            v-if="columnList[6].show"
            prop="phone"
            label="联系电话"
            align="center"
            width="110"
            show-overflow-tooltip
          ></el-table-column>
          <!-- <el-table-column
            prop="dataDate"
            label="数据日期"
            align="center"
          ></el-table-column> -->
          <el-table-column
            v-if="columnList[7].show"
            prop="updateBy"
            label="修改人"
            align="center"
            show-overflow-tooltip
          ></el-table-column>         
          <el-table-column
            v-if="columnList[8].show"
            prop="updateDate"
            label="修改时间"
            align="center"
            width="158"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <span class="table-action" @click="tableAction(scope.row, 2)">编辑</span>
              <!-- <span class="table-action" @click="tableAction(scope.row, 3)">删除</span> -->
            </template>
          </el-table-column>
        </el-table>
        <Pagination
          :page="PageInfo.page"
          :size="PageInfo.size"
          :total="PageInfo.total"
          :key="PageKey"
          @pagination="queryByPage"
        ></Pagination>
      </el-col>
    </el-row>
    <el-dialog
      :visible.sync="formDialogVisible"
      width="30%"
      ref="formDialogRef"
      :close-on-click-modal="false"
      @closed="refreshData"
      :title="dialogTitle"
      v-dialogDrag
    >
      <el-form
        :model="inputForm"
        label-width="120px"
        :rules="inputFormRules"
        ref="inputFormRef"
        :key="inputFormKey"
      >
        <el-form-item label="机柜" prop="rackId">
          <el-select v-model="inputForm.rackId" placeholder="请选择" :disabled="true">
            <el-option style="width:100%" 
              v-for="item in rackSelect"
              :key="item.index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="日期" prop="dataDate">
          <el-date-picker
            :disabled="actionType === 2"
            class="form-date-picker"
            v-model="inputForm.dataDate"
            align="right"
            :clearable="false"
            placeholder="选择日期"
            @change="dateChange">
          </el-date-picker>
        </el-form-item> -->
        <el-form-item label="U位" prop="unitIndex">
          <el-input v-model="inputForm.unitIndex" disabled></el-input>
          <!-- <el-select
            v-model="inputForm.unitIndex" 
            :disabled="true">
            <el-option style="width:100%" 
              v-for="item in unitNums"
              :key="item"
              :label="'U' + item"
              :value="item + ''">
            </el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item label="占用" prop="state">
          <el-switch 
            v-model="inputForm.state"
            active-value="1"
            inactive-value="0"
            @change="stateChange"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="客户" prop="expand.name" :rules="inputForm.state === '1' ? [{required: true, message:'状态为占用，请填写客户'}] : []" ref="nameRef">
          <el-input :disabled="inputForm.state === '0'" v-model="inputForm.expand.name" @focus="selectClient" clearable @clear="clearContract"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="clientId">
          <el-input v-show="false" v-model="inputForm.clientId"></el-input>
          <el-input v-model="inputForm.contract" :disabled="true"></el-input>
          
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input :disabled="true" v-model="inputForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <template>
          <el-button @click="formDialogVisible = false" size="small"
            >取消</el-button
          >
          <el-button type="primary" @click="submitForm" size="small"
            >保存</el-button
          >
        </template>
      </span>
    </el-dialog>
    <!-- 选择客户对话框 -->
    <el-dialog
      :visible.sync="dialogPersonVisible"
      width="60%"
      ref="personDialogRef"
      :close-on-click-modal="false"
      title="单击表格行选择客户"
      @closed="clientDialogClosed"
      v-dialogDrag
    >
      <el-row>
        <el-col :span="8">
          <span>客户名称：</span>
          <el-input placeholder="请输入客户名称" v-model="contractSearchInfo" clearable style="width: 70%"></el-input>
        </el-col>
        <el-col :span="6"> 
          <el-button type="primary" icon="el-icon-search" size="small" @click="searchClient" class="search-btn">查询</el-button>
        </el-col>
      </el-row>
      <el-table 
        :data="personTable" 
        border
        style="margin: 0.75rem 0"
        :empty-text="personEmptyText"
        highlight-current-row
        @current-change="handleCurrentChange"
        ref="personReTableRef">
      >
        <el-table-column
          type="index"
          label="序号"
          width="50"
          align="center"
          sortable
        ></el-table-column>
        <el-table-column
          prop="name"
          label="客户名称"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="contract"
          label="联系人"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="phone"
          label="联系电话"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="remarks"
          label="备注"
          align="center"
        >
        </el-table-column>
      </el-table>
      <Pagination
        :page="personPageInfo.page"
        :size="personPageInfo.size"
        :total="personPageInfo.total"
        :key="personPageKey"
        @pagination="personQueryByPage"
      ></Pagination>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogPersonVisible = false" size="small"
          >取消</el-button
        >
        <el-button type="primary" @click="submitSelectPerson" size="small"
          >保存</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogColumnVisible"
      title="请选择要显示的列"
      :close-on-click-modal="false"
      width="35%"
      v-dialogDrag
    >
      <el-checkbox v-for="item in columnList" v-model="item.show" :key="item.prop">{{item.label}}</el-checkbox>
    </el-dialog>
  </basic-container>
</template>

<script>
import Pagination from "@/components/Pagination";

import { sdcSiteAction } from "@/api/sdc/addressInfo";
import { getUnitList, getRackList, getUnum, getClientList, addUnitUsage, editUnitUsage, deleteUnitUsage } from "@/api/sdc/capacityManage";
import { modifyData } from "@/util/domainFilter";
import { getFirstChild } from "@/util/getFirstChild";
import { getFilterFlag } from "@/util/getFilterFlag";
import moment from "moment";
import _ from "lodash"
export default {
  components: {
    Pagination
  },
  data() {
    return {
      // 左侧树型目录相关
      siteData: [],
      nodeRackId: null,
      firstChild: [],
      selectName: '',
      filterText: '',
      // 机柜列表
      rackTree: [],
      rackSelect: [],
      // 右侧表格相关
      querySiteId: [],
      // pickedDate: [new Date(new Date().toLocaleDateString()).getTime() - (3600 * 1000 * 24 * 7), new Date(new Date().toLocaleDateString()).getTime()],
      pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
      },
      recordTable: [],
      recordEmptyText: '数据加载中',
      queryCondition: null,
      // 分页器
      PageInfo: {
        page: 1,
        size: 10,
        total: 0
      },
      PageKey: Math.random().toString(36).slice(-6),
      // 新增编辑对话框
      formDialogVisible: false,
      dialogTitle: '',
      // 表单相关
      // actionType: 0,
      inputForm: {
        siteId: null,
        rackId: null,
        rackName: null,
        unitIndex: null,
        state: '0',
        clientId: null,
        expand: {
          name: null
        }
        // dataDate: null
      },
      selectClientRow: null,
      // selectContract: null, // 选中客户的客户名
      inputFormRules: {
        rackId: [
          {required: true, message: '请选择机柜'}
        ],
        unitIndex: [
          {required: true, message: '请选择U位'}
        ],
        state: [
          {required: true}
        ],
        // dataDate: [
        //   {required: true, message: '请选择日期'}
        // ]
      },
      inputFormKey: Math.random().toString(36).slice(-6),
      unitNums: [],
      // 选择客户相关
      dialogPersonVisible: false,
      contractSearchInfo: null,
      personTable: [],
      personEmptyText: '数据加载中...',
      personPageInfo: {
        page: 1,
        size: 10,
        total: 0
      },
      personPageKey: Math.random().toString(36).slice(-6),
      queryPersonCondition: {},
      clickQueryCondition: {},
      columnList: [
        {
          prop: 'unitIndex',
          label: '名称',
          show: true
        },
        {
          prop: 'siteNames',
          label: '所处位置',
          show: true
        },
        {
          prop: 'rackName',
          label: '机柜',
          show: true
        },
        {
          prop: 'state',
          label: '租用情况',
          show: true
        },
        {
          prop: 'clientName',
          label: '客户',
          show: true
        },
        {
          prop: 'contract',
          label: '联系人',
          show: true
        },
        {
          prop: 'phone',
          label: '联系电话',
          show: true
        },
        {
          prop: 'updateBy',
          label: '修改人',
          show: true
        },
        {
          prop: 'updateDate',
          label: '修改时间',
          show: true
        }
      ],
      dialogColumnVisible: false
    }
  },
  computed: {
      contentViewHeight () {
        let height = this.$store.state.common.documentClientHeight - 122
        return {minHeight: height + 'px'}
      },
      // unitDisabled() {
      //   return !(this.inputForm.rackId && this.inputForm.dataDate)
      // }
    },
    watch: {
      filterText(val) {
        this.$refs.leftTree.filter(val);
      }
    },
    created() {
      this.getSiteData()
    },
    methods: {
      /**
       * 网络请求
       */
      // 获取树形目录数据
      async getSiteData() {
        let data = await sdcSiteAction("", "/tree", "get");
        let mData = modifyData(data.data.data);
        this.siteData = this.setDisable(mData)
        getFirstChild(this.siteData, this.firstChild, 'R00')
        this.querySiteId= this.firstChild[0].id 
        this._getRackList(1, 10000, this.querySiteId, 'rack')
        this.$nextTick(() => {
          this.$refs.leftTree.setCurrentKey(this.firstChild[0].id)
        })      
      },
      // 获取u位表
      _getUnitList(condition) {
        getUnitList(condition).then(res => {
          console.log(res, 'unitList');
          if(res.data.code === 0) {
            let data = res.data.data.records
            this.recordTable = data
            this.PageInfo.total = res.data.data.total
            this.PageInfo.page = res.data.data.current
            if (this.recordTable.length === 0) {
              this.recordEmptyText = '暂无数据'
            }
          } else {
            this.$message.error('获取数据出错，请刷新重试')
          }
        })
      },
      // 根据siteId机柜表
      _getRackList(page, size, siteId, topTypeCode) {
        getRackList(page, size, siteId, topTypeCode).then(res => {
          console.log(res);
          if (res.data.code === 0) {
            let data = res.data.data.records
            // 根据机柜列表第一个数据的id获取U位情况
            if (data.length !== 0) {
              this.nodeRackId = data[0].id
              this.setQueryCondition()
              this.queryCondition.current = 1
              this._getUnitList(this.queryCondition)
              let treeData = [
                {
                  id: 'parent',
                  name: data[0].siteName,
                  children: []
                }
              ]
              data.forEach((item, index) => {
                let childData = {
                  name: item.name,
                  id: item.id
                }
                treeData[0].children.push(childData)
              })
              this.rackTree = treeData
              this.rackSelect = treeData[0].children
              this.selectName = '已选机柜: ' + treeData[0].children[0].name 
              let _this = this
              this.$nextTick(() => {
                _this.$refs.leftTree.setCurrentKey(treeData[0].children[0].id)
              })
            } else {
              this.rackTree = []
              this.rackSelect = []
              this.$message('该机房暂无机柜数据')
              this.selectName = ''
            }           
          }
        })
      },
      // 获取客户列表
      _getClientList(page, size, contract) {
        getClientList(page, size, contract).then(res => {
          if (res.data.code === 0) {
            let data = res.data.data.records
            // console.log(data);
            this.personTable = data
            this.personPageInfo.total = res.data.data.total
            this.personPageInfo.current = res.data.data.current
            if (this.personTable.length == 0) {
              this.personEmptyText = '暂无数据'
            }
          } else {
            this.$message.error('获取数据出错，请刷新重试')
          }
        })
      },

      /**
       * 事件监听
       */
      setDisable (data) {
        data.forEach(item => {
          if (item.type !== 'R00' && !item.children) {
            item.disabled = true
          } else {
            if (item.children && item.children.length) {
              this.setDisable(item.children)
            }
          }
        })
        return data
      },
      filterNode(value, data, node) {
        return getFilterFlag(value, data, node)
      },
      handleNodeClick(data) {
        if (data.id !== 'parent') {
          console.log(data.id);
          this.nodeRackId = data.id
          this.selectName = '已选机柜: ' + data.name
          // 根据机柜id获取U位情况表
          this.setQueryCondition()
          this.queryCondition.current = 1
          this._getUnitList(this.queryCondition)
        } else {
          this.$refs.leftTree.setCurrentKey(null)
        }
      },
      changeSite() {
        let siteId = this.querySiteId[this.querySiteId.length - 1]
          this._getRackList(1, 10000, siteId, 'rack')
      },
      // changeDate(data) {       
      //   this.setQueryCondition()
      //   this.queryCondition.current = 1
      //   this._getUnitList(this.queryCondition)
      // },
      // resetTable() {
      //   this.querySiteId = []
      //   this.nodeRackId = null
      //   // this.pickedDate = null
      //   this.selectName = ''
      //   this.rackTree = []
      //   this.rackSelect = []
      //   this.setQueryCondition()
      //   this._getUnitList(this.queryCondition)
      // },
      // 表格排序
      sortTable(row1, row2, column) {
        // console.log(a, b);
        let a = row1[column]
        let b = row2[column]
        return a - b
      },
      chooseColumn() {
        this.dialogColumnVisible = true
      },
      // 点击表格操作
      tableAction(row, type) {
        if (type === 2) {
          // 编辑
          // this.actionType = 2
          this.dialogTitle = '编辑'
          let rowCD = _.cloneDeep(row)
          this.inputForm.id = rowCD.id
          this.inputForm.rackId = rowCD.rackId
          this.inputForm.unitIndex = rowCD.unitIndex
          this.inputForm.rackName = rowCD.rackName
          this.inputForm.siteId = rowCD.siteId
          this.inputForm.state = rowCD.state
          this.inputForm.contract = rowCD.contract
          this.inputForm.clientId = rowCD.clientId
          this.inputForm.phone = rowCD.phone
          // this.inputForm.dataDate = rowCD.dataDate
          this.inputForm.expand.name = rowCD.expand.name
          
          this.formDialogVisible = true
        }
      },
      // 占用状态变化
      stateChange(data) {
        if (data === '0') {
          this.inputForm.clientId = ''
          this.inputForm.expand.name = ''
          this.inputForm.phone = ''
          this.inputForm.contract = ''
          this.$refs.nameRef.clearValidate()
        }
      },
      // 点击搜索客户
      searchClient() {
        this.clickQueryCondition = {
          current: 1,
          size: this.personPageInfo.size
        }
        this.contractSearchInfo ? this.clickQueryCondition.contract = this.contractSearchInfo : ''
        this._getClientList(this.clickQueryCondition)
      },
      // 表单中选择客户
      selectClient() {
        this.dialogPersonVisible = true
        // 获取客户表
        this._getClientList(this.personPageInfo.page, this.personPageInfo.size)
      },
      // 选中的客户
      handleCurrentChange(row) {
        this.selectClientRow = row
      },
      // 客户表分页器事件
      personQueryByPage(info) {
        this.personPageInfo.page = info.page
        this.personPageInfo.size = info.size
        this.queryPersonCondition.current = this.personPageInfo.page 
        this.queryPersonCondition.size = this.personPageInfo.size 
        this.queryPersonCondition.contract = this.clickQueryCondition.contract
        this._getClientList(this.queryPersonCondition)
      },
      clientDialogClosed() {
        this.contractSearchInfo = null
        this.personPageInfo.page = 1
        this.personPageInfo.size = 10
      },
      // 保存选择的客户
      submitSelectPerson() {
        if (this.selectClientRow === null) {
          return this.$message.error('请选择一个客户')
        } else {
          // this.selectContract = this.selectClientRow.name
          this.inputForm.expand.name = this.selectClientRow.name
          this.inputForm.clientId = this.selectClientRow.id
          this.inputForm.phone = this.selectClientRow.phone
          this.inputForm.contract = this.selectClientRow.contract
          this.dialogPersonVisible = false
        }
      },
      // 清除选择的客户
      clearContract() {
        this.inputForm.clientId = null
        this.inputForm.phone = null
        this.inputForm.expand.name = null
        this.inputForm.contract = null
      },
      // 提交新增或修改信息
      submitForm() {
        console.log(this.inputForm);
        // if (this.actionType === 2) {
          this.$refs.inputFormRef.validate(valid => {
            if (valid) {
              // this.inputForm.dataDate = moment(this.inputForm.dataDate).format('YYYY-MM-DD HH:mm:ss')
              editUnitUsage(this.inputForm).then(res => {
                if (res.data.code === 0) {
                  this.formDialogVisible = false
                  this.$message.success('修改成功')
                  this.setQueryCondition()
                  this._getUnitList(this.queryCondition)
                }
              })
            }           
          })         
        // }
      },
      // 分页器事件
      queryByPage(info) {
        this.PageInfo.page = info.page
        this.PageInfo.size = info.size
        this.queryCondition.current = this.PageInfo.page
        this.queryCondition.size = this.PageInfo.size
        this._getUnitList(this.queryCondition)
      },
      // 判断查询条件
      setQueryCondition() {
        this.queryCondition = {
          current: this.PageInfo.page,
          size: this.PageInfo.size
        }
        this.nodeRackId ? this.queryCondition.rackId = this.nodeRackId : null
        
      },
      // 关闭修改功率对话框后刷新数据
      refreshData() {
        this.$refs.inputFormRef.resetFields()
        this.inputForm.rackId = null
        this.inputForm.unitIndex = null
        this.inputForm.state = '0'
        this.inputForm.expand.name = null
        this.inputForm.contract = null
        this.inputForm.clientId = null
        this.inputForm.phone = null
      }
    }
}
</script>

<style lang="scss" scoped>
.tree-area {
  overflow-y:auto;
  height:800px
}
.refresh-btn {
  margin-left: 20px;
}
.add-btn {
  margin-top: 15px;
}
.search-btn {
  margin: 2px 0 0 15px ;
}
.el-select {
  width: 100%;
}
.form-date-picker {
  width: 100%;
}
/deep/ .el-table__body tr.current-row>td{
  background-color: #8CC5FF !important;
  color: #fff;
} 
</style>