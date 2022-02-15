<template>
  <basic-container>
    <el-row>
      <el-col :span="4">
        <span>园区：</span>
          <el-select v-model="parkId" placeholder="请选择" @change="changePark">
            <el-option style="width:100%" 
              v-for="item in parkData"
              :key="item.code"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
      </el-col>
      <!-- <el-col :span="6">
        <span>方案名称：</span>
        <el-input v-model="planName" style="width:70%" ></el-input>
      </el-col> -->
      <el-col :span="4" :offset="1">
        <el-button type="primary" icon="el-icon-search" @click="queryData">查询</el-button>
         <el-button type="primary" icon="el-icon-refresh" @click="refreshData">重置</el-button>
      </el-col>
    </el-row>
    <el-row  class="add-btn">
      <el-col :span="23">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="addPlan">新增PUE方案</el-button>
      </el-col>
      <el-col :span="1">
        <el-tooltip effect="dark" content="显隐" placement="top">
          <el-button circle="" @click="chooseColumn" size="small" icon="el-icon-menu"></el-button>
        </el-tooltip>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
         <el-table
          :data="planData" 
          border 
          row-key="id"
          style="margin: 0.75rem 0"
          v-loading="loading"
        >
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="50"
          ></el-table-column>
          <el-table-column
            v-if="columnList[0].show"
            prop="planName"
            label="方案名称"
            header-align="center"
            width="200"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <el-link :underline="false" type="primary" @click="tableAction(scope.row, 3)">{{scope.row.planName}}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            v-if="columnList[1].show"
            label="总能耗设备"
            header-align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.expand.totalName">{{scope.row.expand.totalName.join(',')}}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="columnList[2].show"
            label="IT能耗设备"
            header-align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.expand.itDeviceName">{{scope.row.expand.itDeviceName.join(',')}}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="160"
            v-if="columnList[3].show"
            prop="updateBy"
            label="修改人"
            align="center"
          ></el-table-column>         
          <el-table-column
            v-if="columnList[4].show"
            width="180"
            prop="updateDate"
            label="修改时间"
            align="center"
          ></el-table-column>
          <el-table-column label="操作" width="120" align="center">
            <template slot-scope="scope">
              <!-- <span class="table-action" @click="tableAction(scope.row, 2)">查看</span> -->
              <!-- <span class="table-action" @click="tableAction(scope.row, 3)">编辑</span> -->
              <span class="table-action" @click="tableAction(scope.row, 4)">删除</span>
            </template>
          </el-table-column>
        </el-table>
        <Pagination
          :page="current"
          :size="size"
          :total="total"
          :key="PageKey"
          @pagination="queryByPage"
        ></Pagination>
      </el-col>
    </el-row>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="80%"
      @closed="dialogClosed"
      top="2vh"
      v-dialogDrag
    >
      <el-form label-width="80px" :model="inputForm" ref="inputFormRef">
        <el-form-item label="方案名称" prop="planName" :rules="[{required: true, message: '请输入方案名称', trigger: 'blur'}]">
          <el-input v-model="inputForm.planName" style="width:30%"></el-input>
        </el-form-item>
      </el-form>
      <el-row :gutter="15">
        <!-- 左侧树形菜单 -->
        <el-col :span="6" class="tree-container">
          <span>区域</span>
          <el-card shadow="never" class="tree-card"> 
            <!-- <el-tag
              closable
              size="small" 
              style="margin-bottom:5px"
              v-if="selectName"
              :disable-transitions="false"
              @close="handleNodeClose">
              {{selectName}}
            </el-tag>
            <el-input
              placeholder="输入关键字进行过滤"
              v-model="filterText">
            </el-input> -->
            <el-tree
              v-loading="treeLoading"
              :indent="2"
              class="filter-tree"
              :data="siteData"
              :props="{
                value: 'id',
                label: 'name',
                children: 'children'
              }"
              empty-text="数据加载中"
              default-expand-all
              node-key="id"
              :highlight-current="false"
              :filter-node-method="filterNode"
              :expand-on-click-node="false"
              @node-click="handleNodeClick"
              ref="leftTree"> 
              <!-- <span slot-scope="{node}">
                <span :class="node.data.flag === 1 ? 'hasConfig' :' notConfig'">
                  {{node.label}}
                </span>
                <span v-if="node.data.flag === 1" class="hasConfig">(已配置)</span>
                <span v-if="node.data.flag === 0" class="notConfig">(未配置)</span>
              </span> -->
            </el-tree>
          </el-card>
        </el-col>
        <!-- 右侧 -->
        <el-col :span="18">
          <div class="right-area">
            <el-row :gutter="60">
              <el-col :span="4">
                <div class="pue-result">
                  <span>PUE &nbsp; = </span>
                </div>              
              </el-col>
              <el-col :span="8" class="tree-container">
                <div class="enc-total-text">总能耗</div>
                <el-card shadow="never" class="tree-card"> 
                <el-tree
                  v-loading="totalLoading"
                  class="filter-tree"
                  :data="totalCurrentSite"
                  :indent="2"
                  :props="{
                    value: 'id',
                    label: 'name',
                    children: 'children'
                  }"
                  empty-text="数据加载中"
                  default-expand-all
                  node-key="id"
                  :default-checked-keys="totalCheckedKeys"
                  :highlight-current="true"
                  show-checkbox
                  :expand-on-click-node="false"
                  ref="totalEncTree">
                </el-tree>
              </el-card>
              </el-col>
              <el-col :span="4" class="pue-eql">
              <span>/</span>
              </el-col>
              <el-col :span="8" class="tree-container">
                <div class="enc-it-text">IT设备能耗</div>
              <el-card shadow="never" class="tree-card"> 
                <el-tree
                  v-loading="itLoading"
                  class="filter-tree"
                  :data="itCurrentSite"
                  :indent="2"
                  :props="{
                    value: 'id',
                    label: 'name',
                    children: 'children'
                  }"
                  empty-text="数据加载中"
                  default-expand-all
                  node-key="id"
                  :default-checked-keys="itCheckedKeys"
                  :highlight-current="true"
                  show-checkbox
                  :expand-on-click-node="false"
                  ref="itEncTree">
                </el-tree>
              </el-card>
              </el-col>
            </el-row>
          </div>       
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveFormula">保 存</el-button>
      </span>
    </el-dialog>
    <!-- <el-dialog
      title="查看"
      :visible.sync="viewDialogVisible"
      width="30%"
    >
      <el-form :model="viewform" label-width="100px" disabled>
        <el-form-item label="方案名称">
          <el-input v-model="viewform.planName"></el-input>
        </el-form-item>
        <el-form-item label="总能耗设备">
          <el-input type="textarea" resize="none" v-model="viewform.totalName"></el-input>
        </el-form-item>
        <el-form-item label="IT能耗设备">
          <el-input type="textarea" resize="none" v-model="viewform.itDeviceName"></el-input>
        </el-form-item>
        <el-form-item label="创建者">
          <el-input v-model="viewform.createBy"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="viewform.createDate"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="viewDialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog> -->
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
import { modifyData} from "@/util/domainFilter";
import { sdcSiteAction} from "@/api/sdc/addressInfo";
import _ from "lodash"
import { getPlanList, getElectricList, postFormula, putFormula, deleteFormula } from "@/api/sdc/energy"
export default {
  components: {
    Pagination
  },
  data() {
    return {
      parkId: '',
      parkData: [],
      planData: [],
      loading: true,
      totalLoading: true,
      itLoading: true,
      treeLoading: true,
      current: 1,
      size: 10,
      total: 0,
      // planName: '',
      queryCondition: {
        current: 1,
        size: 10
      },
      PageKey: Math.random().toString(36).slice(-6),
      siteData: [],
      siteCopy: [],
      totalSiteCopy: [],
      itSiteCopy: [],
      totalCurrentSite: [],
      itCurrentSite: [],
      selectName: '',
      querySiteId: '',
      filterText: '',
      totalElectric: [],
      ItElectric: [],
      totalCheckedKeys: [],
      itCheckedKeys: [],
      dataForm: {},
      dialogTitle: '新增配置',
      dialogVisible: false,
      inputForm: {
        planName: '',
      },
      actionType: 1,
      // viewDialogVisible: false,
      // viewform: {},
      columnList: [
        {
          prop: 'planName',
          label: '方案名称',
          show: true
        },
        {
          prop: 'totalName',
          label: '总能耗设备',
          show: true
        },
        {
          prop: 'itDeviceName',
          label: 'IT能耗设备',
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
    }
  },
  watch: {
    filterText(val) {
      this.$refs.leftTree.filter(val);
    }
  },
  created() {
    this.init()
  },
  mounted() {
  },
  methods: {
    /**
     * 网络请求
     */
    // 初始化
    async init() {
        let data = await sdcSiteAction('','/tree','get')
        this.parkData = data.data.data
        this.parkId = this.parkData[0].id
        this.setQueryCondition()
        this._getPlanList(this.queryCondition)
        this.siteData = modifyData(data.data.data)
      },
    // 新增初始化
      async setAdd() {
        let data = await sdcSiteAction('','/tree','get')
        this.siteCopy = _.cloneDeep(data.data.data)
        this.totalSiteCopy = _.cloneDeep(this.siteCopy)
        this.itSiteCopy = _.cloneDeep(this.siteCopy)
        this.siteData = modifyData(data.data.data)
        this.treeLoading = false
        this.querySiteId = this.parkId
        this.totalCurrentSite = []
        this.itCurrentSite = []
        this.getCurrentSiteTree(this.totalSiteCopy, this.totalCurrentSite)
        this.getCurrentSiteTree(this.itSiteCopy, this.itCurrentSite)
        this.siteData.forEach(item => {
          if (item.id  === this.querySiteId) {
            this.selectName = '已选区域: ' + item.name 
            this.$nextTick(() => {
              this.$refs.leftTree.setCurrentKey(item.id)
            }) 
          }
        })   
        getElectricList(this.querySiteId).then(res => {
          if (res.data.code === 0) {
             this._getElectricList(res)
             this._getItElectricList(res)
             console.log(this.totalLoading, this.itLoading, 'loading-------------');
          }
        })
      },
      // 修改初始化
      async setEdit(selectId) {
        let data = await sdcSiteAction('','/tree','get')
        this.siteCopy = _.cloneDeep(data.data.data)
        this.totalSiteCopy = _.cloneDeep(this.siteCopy)
        this.itSiteCopy = _.cloneDeep(this.siteCopy)
        this.siteData = modifyData(data.data.data)
        this.treeLoading = false
        this.querySiteId = selectId
        this.totalCurrentSite = []
        this.itCurrentSite = []
        this.getCurrentSiteTree(this.totalSiteCopy, this.totalCurrentSite)
        this.getCurrentSiteTree(this.itSiteCopy, this.itCurrentSite)
        this.setSelectedName(selectId)
        this.$nextTick(() => {
          this.$refs.leftTree.setCurrentKey(selectId)
        })
        getElectricList(selectId).then(res => {
          if (res.data.code === 0) {
             this._getElectricList(res)
             this._getItElectricList(res)
          }
        })
      },
      // 获取方案列表
      _getPlanList(params) {
        getPlanList(params).then(res => {
          if (res.data.code === 0) {
            this.planData = res.data.data.records
            this.total = res.data.data.total
            this.current = res.data.data.current
            this.loading = false
          } 
        })
      },
      // 构造总能耗电表树
      _getElectricList(res) {
        this.totalLoading = false
        this.totalElectric = res.data.data
        // this.totalCheckedKeys = []
        this.totalSiteCopy = _.cloneDeep(this.siteCopy)
        this.constructElectricTree(this.totalCurrentSite, this.totalElectric)
        this.setDisabled(this.totalCurrentSite)
        this.$nextTick(() => {
          if (this.$refs.totalEncTree) {
            this.$refs.totalEncTree.setCheckedKeys(this.totalCheckedKeys)
          }
        }) 
      },
      // 构造it设备电表树
      _getItElectricList(res) {
        this.itLoading = false
        this.itElectric = res.data.data
        // this.itCheckedKeys = []
        this.itSiteCopy = _.cloneDeep(this.siteCopy)
        this.constructElectricTree(this.itCurrentSite, this.itElectric)
        this.setDisabled(this.itCurrentSite)
        this.$nextTick(() => {
          if (this.$refs.itEncTree) {
            this.$refs.itEncTree.setCheckedKeys(this.itCheckedKeys)
          }
        }) 
      },
      /**
       * 事件
       */
      queryData() {
        this.setQueryCondition()
        this.loading = true
        this._getPlanList(this.queryCondition)
      },
      refreshData() {
        // this.planName = ''
        this.parkId = this.parkData[0].id
        this.setQueryCondition()
        this._getPlanList(this.queryCondition)
      },
      // 控制列显隐
      chooseColumn() {
        this.dialogColumnVisible = true
      },
      addPlan() {
        this.actionType = 1
        this.dialogTitle = '新增方案'
        this.itLoading = true
        this.totalLoading = true
        this.dialogVisible = true
        this.setAdd()
      },
      tableAction(row, type) {
        // if (type === 2) {
        //   // 查看
        //   this.viewform.planName = row.planName
        //   this.viewform.totalName = row.expand.totalName ? row.expand.totalName.join(',') : ''
        //   this.viewform.itDeviceName = row.expand.itDeviceName ? row.expand.itDeviceName.join(',') : '' 
        //   this.viewform.createBy = row.createBy
        //   this.viewform.createDate = row.createDate
        //   this.viewDialogVisible = true
        // }
        if (type === 3) {
          // 编辑
          this.actionType = 3
          this.inputForm.planName = row.planName
          this.dataForm.id = row.id
          this.totalCheckedKeys = row.totalDeviceIds.split(',')
          this.itCheckedKeys = row.itDeviceIds.split(',')
          let siteId = row.siteId
          this.dialogTitle = '编辑方案'
          this.itLoading = true
          this.totalLoading = true
          this.dialogVisible = true
          this.setEdit(siteId)
          
        }
        if (type === 4) {
          // 删除
           this.$confirm('确定删除此方案?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deleteFormula(row.id).then(res => {
              if (res.data.code === 0) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this._getPlanList(this.queryCondition)
              }
            })
          }).catch(() => {});
        }
      },
      queryByPage() {},
      setQueryCondition() {
        this.queryCondition = {
          current: 1,
          size: 10
        }
        // this.planName ? this.queryCondition.planName = this.planName : null
        this.parkId ? this.queryCondition.siteId = this.parkId : null       
      },
      changePark(val) {
        this.parkId = val
        this.setQueryCondition()
        this._getPlanList(this.queryCondition)

      },
      // 请求区域的公式数据
      handleNodeClick(data, node) {
          this.dataForm.totalDeviceIds = ''
          this.dataForm.itDeviceIds = ''
          this.querySiteId = data.id
          this.totalCurrentSite = []
          this.itCurrentSite = []
          this.getCurrentSiteTree(this.totalSiteCopy, this.totalCurrentSite)
          this.getCurrentSiteTree(this.itSiteCopy, this.itCurrentSite)         
          this.selectName = '已选区域: ' + data.name
          // this.setQueryCondition()
          getElectricList(this.querySiteId).then(res => {
          if (res.data.code === 0) {
             this._getElectricList(res)
             this._getItElectricList(res)
          }
        })
      },
      // 获取等级父节点
      getRootParentNode(node) {
        if (node.data.type === 'P00') {
          this.dataForm.siteId = node.data.id
        } else {
          this.getRootParentNode(node.parent)
        }
      },
      handleNodeClose() {
        this.selectName = ''
        this.querySiteId = null
        this.$refs.leftTree.setCurrentKey(null)
        this.totalCurrentSite = []
        this.itCurrentSite = []
      },
      filterNode(value, data, node) {
        return getFilterFlag(value, data, node)
      },
      // 保存公式
      saveFormula() {
        this.$refs.inputFormRef.validate((valid) => {
          if (valid) {
            let totalDeviceIds = this.$refs.totalEncTree.getCheckedKeys(true),
                itDeviceIds = this.$refs.itEncTree.getCheckedKeys(true)
            if (totalDeviceIds.length > 0 && itDeviceIds.length > 0) {
              this.dataForm.planName = this.inputForm.planName
              this.dataForm.totalDeviceIds = totalDeviceIds.join(',')
              this.dataForm.itDeviceIds = itDeviceIds.join(',')
              let currentSiteNode = this.$refs.leftTree.getNode(this.querySiteId)
              this.getRootParentNode(currentSiteNode)
              if (this.actionType === 1) {
                postFormula(this.dataForm).then(res => {
                  if (res.data.code === 0) {
                    this.$message.success('新增方案成功')
                    this.dialogVisible = false
                    this._getPlanList(this.queryCondition)
                  } 
                })
              }
              if (this.actionType === 3) {
                console.log(this.dataForm, '修改dataForm');
                putFormula(this.dataForm).then(res => {
                  if (res.data.code === 0) {
                    this.$message.success('修改方案成功')
                    this.dialogVisible = false
                    this._getPlanList(this.queryCondition)
                  } 
                })
              }
            } else {
                this.$message.error('请选择总能耗电表和IT能耗电表')
              }
          }
        })
      },
      // 获取当前站点树
      getCurrentSiteTree(site, currentSite) {
        site.forEach(item => {
          if (this.querySiteId === item.id) {
            currentSite.push(item)
            return
          } else {
            if (item.children && item.children.length > 0) {
              this.getCurrentSiteTree(item.children, currentSite)
            } else {
              return
            }
          }
        })
      },
      // 构造当前站点电表树
      constructElectricTree(site, electric) {
        site.forEach((item) => {
          if (item.type === 'R00') {
            electric.forEach(ele => {
              if (ele.siteId === item.id) {
                item.children.push({
                  id: ele.deviceId,
                  name: ele.deviceName,
                  type: 'Elec00'
                })
              }
            })
          } else {
            if (item.children && item.children.length > 0) {
              this.constructElectricTree(item.children, electric)
            } else {
              return
            }
          }
        })
      },
      // 设置禁选
      setDisabled(site) {
        site.forEach(item => {
          if (item.children) {
            if (item.children.length === 0) {
              // 直接item.disabled = true不能实时生效
              // $set向响应式对象中添加一个 property，并确保这个新 property 同样是响应式的，且触发视图更新。它必须用于向响应式对象上添加新 property，因为 Vue 无法探测普通的新增 property 
              this.$set(item, 'disabled', true)
            } else {
              this.setDisabled(item.children)
            }
          } else {
            return
          }
        })
      },
      // 设置已选择区域名称
      setSelectedName(siteId) {
        this.siteData.forEach(item => {
          if (item.id === siteId) {
            this.selectName = '已选区域: ' + item.name 
          }
        })
      },
      dialogClosed() {
        this.$refs.inputFormRef.resetFields()
        this.inputForm.planName = null
        this.selectName = ''
        this.totalCurrentSite = []
        this.itCurrentSite = [],
        this.dataForm = {}
        this.totalCheckedKeys = []
        this.itCheckedKeys = []
      },
  },
}
</script>

<style lang="scss" scoped>
.add-btn {
  margin-top: 15px;
}
// .tree-card {
//   overflow: auto;
//   width: 280px;
//   height: calc(100% - 45px);
// }
// .filter-tree {
//   min-width: 100%;
//   display: inline-block;
//   overflow: auto;
//   margin-top: 12px; 
// }
// .tree-area {
//   display: flex;
//   flex-direction: column;
//   justify-content: flex-start;
//   align-items: center;
//   height: 600px;
//   span {
//     margin-bottom: 10px;
//   }
// }
.tree-container {
  // border: 1px solid #eee;
  height: 600px;
  .tree-card {
    overflow: auto;
    width: 280px;
    height: calc(100% - 45px);
    .filter-tree {
      min-width: 100%;
      margin-left: -30px;
      display: inline-block;
      overflow: auto;
      margin-top: 12px;
    }
  }
}
.right-area {
  .pue-result {
    height: 600px;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      font-size: 30px; 
      font-weight: 700;    
      color:#3F8EF7;
    }
  }
  .enc-total-text {
      margin-bottom: 15px;
      font-size: 20px;
      font-weight: 700;
      color: #FFA500;
    }
  // .enc-total {
  //   height: 600px;
  //   display: flex;
  //   flex-direction: column;
  //   justify-content:flex-start;
  //   align-items: center;
    
  // }
  .pue-eql {
    height: 600px;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      font-size: 70px;
      font-weight: 700;     
      color: #000;
    }
  }
  .enc-it-text {
      margin-bottom: 15px;
      font-size: 20px;
      font-weight: 700;
      color: yellowgreen
    }
  // .enc-it {
  //   height: 600px;
  //   display: flex;
  //   flex-direction: column;
  //   justify-content:flex-start;
  //   align-items: center;
    
  // }
  .submit-btn {
    display: flex;
    justify-content: center;
  }
}
.hasConfig {
  color: yellowgreen;
} 
.notConfig {
  color: #FFA500;
}
</style>