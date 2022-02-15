<template>
  <div>
    <basic-container>
      <el-row :gutter="15">
        <el-col :span="5" class="tree-container">
          <el-card shadow="never" class="tree-card">
            <!-- <el-input
              placeholder="输入关键字进行过滤"
              v-model="filterText">
            </el-input> -->
            <el-tree
              class="filter-tree"
              ref="deviceTypeTree"
              :data="condition"
              node-key="id"
              :indent="2"
              accordion
              :default-expanded-keys="expandKey"
              :expand-on-click-node="false"
              :props="defaultProps"
              :filter-node-method="filterNode"
              @node-click="querySiteInfo"
            >
              <div slot-scope="{ node }" class="node-container">
                <span>{{ node.label }}</span>
                 <!-- <el-tooltip class="item" effect="dark" :content="node.label" placement="top">
                  <span>{{ node.label | ellipsis(4) }}</span>
                </el-tooltip>                 -->
                <!-- <div class="node-style" @click="addDevice(node, data)">
                  <i class="el-icon-circle-plus-outline"></i>
                </div>
                <div v-if="data.id !== 0" class="node-style" @click="editDevice(node, data)">
                  <i class="el-icon-edit-outline"></i>
                </div>
                <div v-if="data.id !== 0" class="node-style" @click="deleteDevice(data)">
                  <i class="el-icon-delete"></i>
                </div> -->
              </div>
            </el-tree>
          </el-card>
        </el-col>
        <el-col :span="19">
          <el-row :gutter="15" v-if="isAllType">
            <el-col :span="6">
              <span>所属系统：</span>
              <el-select v-model="sysName" style="width:60%" @change="changeSys">
                <el-option
                  v-for="item in sysTypeMap"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="9">
              <span>设备类型：</span>
              <el-cascader 
                ref="deviceType"
                :options="devCondition" 
                style="width:75%" 
                v-model="devType"
                :props="{ checkStrictly: true,value: 'id', label: 'name', children: 'children' }"
                clearable
                filterable 
                @change="changeDeviceType"
                :disabled="devDisabled"
              ></el-cascader>
            </el-col>
            <el-col :span="8">
              <el-button type="primary" size="small" @click="handleQueryClick">
                <i class="el-icon-search"></i>
                查询
              </el-button>
              <el-button type="primary" size="small" @click="clearCondition">
                <i class="el-icon-delete"></i>
                清空
              </el-button>
            </el-col>
          </el-row>
          <el-row style="margin-top:15px;" v-if="isAllType">
            <el-col :span="23">
              <el-button type="primary" size="small" @click="addNewDevType">
                <i class="el-icon-plus"></i>
                新增设备类型
              </el-button>
              <label class="import-btn" for="importDevcie">导入</label>
              <input type="file" ref="importDevcie" id="importDevcie" @change="deviceTypeImport($event)" style="display:none;" accept=".xls,.xlsx"/>
              <el-button type="primary" size="small" @click="deviceTypeExport">导出</el-button>
              <el-link icon="el-icon-download" type="primary" href="/admin/sys-file/planplat/template_sdc_device_type.xlsx" :underline="false" style="margin-left: 10px">
                下载导入模板
              </el-link>
            </el-col>
            <el-col :span="1">
              <el-tooltip effect="dark" content="显隐" placement="top">
                  <el-button circle="" @click="chooseColumn" size="small" icon="el-icon-menu"></el-button>
                </el-tooltip>
            </el-col>
          </el-row>
          <el-row v-if="!isAllType">
              <el-col :span="12">
                <el-descriptions title="类型信息" style="font-size:16px;" :column="2" border>
                  <el-descriptions-item label="类型名称">{{selectNodeInfo.name}}</el-descriptions-item>
                  <el-descriptions-item label="所属系统">{{selectNodeInfo.typeName}}</el-descriptions-item>
              </el-descriptions>
              </el-col>
            </el-row>
          <el-row v-if="!isAllType">
            <el-col :span="6" style="font-size:16px;margin-top:12px;font-weight:700;">
                <div>子级列表</div>
              </el-col>
              <el-col :span="1" style="float:right;">
                <el-tooltip effect="dark" content="显隐" placement="top">
                  <el-button circle="" @click="chooseColumn" size="small" icon="el-icon-menu"></el-button>
                </el-tooltip>
              </el-col>
          </el-row>
          <div>
            <el-table
              :data="deviceData"
              style="width: 100%; margin: 10px 0"
              border
              :key="dataKey"
            >
              <el-table-column type="index" width="80" align="center">
              </el-table-column>
              <el-table-column prop="name" v-if="columnList[0].show" label="类型" header-align="center" sortable>
                <template slot-scope="scope">
                  <el-link :underline="false" type="primary" @click="mainPropClick(scope.row)">{{scope.row.name}}</el-link>
                </template>
              </el-table-column>
              <el-table-column
                prop="system"
                v-if="columnList[1].show"
                label="所属系统"
                :formatter="typeTranslate"
                header-align="center"
              >
              </el-table-column>
              <!-- <el-table-column prop="remarks" label="备注信息">
              </el-table-column> -->
              <el-table-column label="操作" align="center" width="160">
                <template slot-scope="scope">
                  <!-- <span class="table-action" @click="deviceAction(scope.row, 3)">查看</span>
                  <span class="table-action" @click="deviceAction(scope.row, 2)">编辑</span> -->
                  <span class="table-action" @click="deviceAction(scope.row, 4)">删除</span>
                  <span class="table-action" @click="deviceAction(scope.row, 1)">添加</span>
                </template>
              </el-table-column>
            </el-table>
            <Pagination :page="page" :size="size" :total="total" :key="pageKey" @pagination="queryByPage"></Pagination>
          </div>
        </el-col>
      </el-row>
      <el-dialog 
        :visible.sync="dialogFormVisible" 
        width="60%"
        ref="emgDialog"
        :close-on-click-modal="false"
        :key="dialogKey"
        :title="dialogTitle"
        @close="closeDialog"
        top="5vh"
        v-dialogDrag
      >
        <div style="width:100%;height:70vh;overflow:auto;">
          <el-radio-group
            v-model="radioBtn"
            class="dev-radio"
            @change="changeComponent"
          >
            <el-radio-button label="1">
              基本信息 
            </el-radio-button>
            <el-radio-button label="2">
              信号信息
            </el-radio-button>
          </el-radio-group>

          <!-- 动态组件及组件传参 -->
          <component
            ref="deviceTypeInfo"
            v-bind:is="currentCompent"
            :dialogData="dialogData"
            :formDisabled="isdisabled"
            :parentTypeData="parentTypeData"
            :sysTypeMap="sysTypeMap"
            @closeDialog="closeDialog"
            @refreshAfterAction="refreshAfterAction"
            @deviceTypeValid="deviceTypeValid"
            :key="dialogKey"
          ></component>
        </div>
        <span slot="footer" class="dialog-footer">
          <template v-if="dialogData.actionType === 3">
            <el-button
              @click="closeDialog"
              size="small"
              >关闭</el-button
            >
            <el-button v-if="btnType === 1" type="primary" @click="enableEdit" size="small"
            >编辑</el-button>
            <el-button v-if="btnType === 2" type="primary" @click="submitForm" size="small"
            >保存</el-button>
          </template>
          <template v-else>
            <el-button @click="closeDialog" size="small"
              >取消</el-button
            >
            <el-button type="primary" @click="submitForm" size="small"
              >保存</el-button
            >
          </template>
        </span>
      </el-dialog>
      <el-dialog title="数据删除提醒" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false">
        <span>是否确定删除当前数据！</span>
        <span slot="footer" class="dialog-footer">
          <el-button  type="primary" @click="deleteData">确 定</el-button>
          <el-button @click="dialogVisible = false"
            >取 消</el-button
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
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"
import {
  getSdcDeviceTypeTable,
  sdcDeviceTypeAction,
  getSystemList,
  getSdcDeviceTypeTree,
  sdcDeviceTypeExport,
  sdcDeviceTypeImport,
  getDeviceTypeById
} from "@/api/sdc/deviceType"

import DeviceType from "./DeviceType";
import TelemetryInfo from "./TelemetryInfo";
import { modifyData } from "@/util/domainFilter";
import { getFilterFlag } from "@/util/getFilterFlag";

export default {
  components: {
    Pagination,
    TelemetryInfo,
    DeviceType
  },
  data() {
    return {
      page: 1,
      size: 10,
      total: 0,
      pageKey: Math.random().toString(36).slice(-6),
      dialogFormVisible: false,
      dialogVisible: false,
      dialogTitle:'',
      dialogData: {
        actionType: null,
        editId: null,
        parentName: null,
        system: null,
        // isdisabled:false,
        isFormDisabled: false,
      },
      defaultProps: {
        children: "children",
        label: "name",
      },
      checkedKey: ["park01"],
      condition: [
        {
          code: "0",
          id: 0,
          name: "全部",
          parentId: "",
          remarks: "",
          sort: 30,
          type: "",
          children:[]
        }
      ],
      deviceData: [],
      delId: null,
      dialogKey: (new Date()).toString(),
      sysTypeMap: [],
      currentCompent: 'DeviceType',
      radioBtn: '1',
      dataKey: (new Date()).toString(),
      queryId: null,
      parentTypeData: null,
      filterText: '',
      sysName: null,
      devDisabled: true,
      devType: [],
      devCondition: null,
      queryCondition: {},
      deviceTypeParamValid: null,
      dialogColumnVisible: false,
      columnList: [
        {
          prop: 'name',
          label: '类型',
          show: true
        },
        {
          prop: 'system',
          label: '所属系统',
          show: true
        }
      ],
      btnType: 1,
      isdisabled: false,
      expandKey: [0],
      isAllType: true,
      selectNodeInfo: {}
    }
  },
  watch: {
      filterText(val) {
        this.$refs.deviceTypeTree.filter(val);
      }
    },
  created() {
    this.getSystemList()
    this.init()
  },
  methods: {
    //初始化获取数据
    async init() {
      this.condition[0].children = []
      //获取左边设备类型tree
      let data = await sdcDeviceTypeAction("", "/tree", "get")
      this.condition[0].children = data.data.data;
      //获取父级设备类型
      this.parentTypeData = modifyData(data.data.data)
      this.queryDevType()
    },
    async queryByPage(data) {
      // this.queryCondition.id = this.queryId
      this.page = data.page
      this.size = data.size
      this.queryCondition.current = this.page
      this.queryCondition.size = this.size
      this.queryDevType()
    },
    //获取系统分类
    async getSystemList() {
      let sysList = await getSystemList()
      sysList.data.data.forEach((el) => {
        this.sysTypeMap.push({
          value: el.value,
          label: el.label,
        })
      })
    },
    addNewDevType() {
      this.dialogData = {}
      this.isdisabled = false
      this.dialogData.isFormDisabled = false
      this.radioBtn = '1'
      this.currentCompent = 'DeviceType'
      this.dialogData.actionType = 1
      this.dialogFormVisible = true
      this.dialogData.parentId = null
      this.dialogData.parentName = null
      this.dialogTitle = '新建设备类型'
    },
    //通过tree添加设备类型
    addDevice(node, data) {
      this.dialogData = {}
      this.dialogTitle = '新建设备类型'
      this.dialogData.isFormDisabled = true
      this.isdisabled = false
      this.radioBtn = '1'
      this.currentCompent = 'DeviceType'
      this.dialogData.actionType = 1
      this.setDialogData(node, data)
    },
    chooseColumn() {
      this.dialogColumnVisible = true
    },
    async mainPropClick(row) {
      this.btnType = 1
      let queryData = await sdcDeviceTypeAction("", "/" + row.id, "get")
      this.dialogData = queryData.data.data
      this.dialogData.parentName = queryData.data.data.parentName
      this.isdisabled = true
      this.dialogTitle = '查看设备类型'
      this.dialogFormVisible = true
      this.dialogData.actionType = 3
      this.dialogData.isFormDisabled = true
      this.dialogKey = new Date().toString()
    },
    enableEdit() {
      this.isdisabled = false
      this.btnType = 2
      this.dialogTitle = '编辑设备类型'
    },
    //通过tree修改设备类型
    async editDevice(node, data) {
      if (data.id !== 0) {
        this.dialogTitle = '编辑设备类型'
        console.log(node, data);
        this.dialogData.isFormDisabled = true
        this.isdisabled = false
        this.radioBtn = '1'
        this.currentCompent = 'DeviceType'
        let queryData = await sdcDeviceTypeAction("", "/" + data.id, "get")
        this.dialogData = queryData.data.data
        this.dialogData.actionType = 2
        this.dialogFormVisible = true
        if(this.dialogData.parentId === '') {
          this.dialogData.parentId = null
        }
      }
    },
    setDialogData(node, data) {
      console.log(data);
      this.dialogFormVisible = true
      this.dialogData.system = data.system
      
      if(data.id === 0) {
        this.dialogData.parentId = null
        this.dialogData.parentName = null
      } else {
        this.dialogData.parentId = data.id
        this.dialogData.parentName = node.label
      }
    },
    deleteDevice(data) {
      this.dialogVisible = true
      this.delId = data.id
    },
    async deviceAction(data, type) {
      this.radioBtn = '1'
      this.currentCompent = 'DeviceType'
      this.dialogData = {}
      
      if (type === 4) {
        this.dialogVisible = true
        this.delId = data.id
        return
      }
      let queryData = await sdcDeviceTypeAction("", "/" + data.id, "get")
      switch (type) {
        case 1:
          this.dialogData.parentName = data.name
          this.dialogData.parentId = data.id
          this.dialogData.isFormDisabled = true
          this.isdisabled = false
          this.dialogTitle = '新建设备类型'
          break;
        case 2:
          this.dialogData = queryData.data.data
          this.dialogData.parentName = queryData.data.data.parentName
          if(queryData.data.data.parentId === '') {
            this.dialogData.parentId = null
          }else {
            this.dialogData.parentId = queryData.data.data.parentId
          }
          this.dialogTitle = '编辑设备类型'
          this.isdisabled = false
          this.dialogData.isFormDisabled = true
          break;
        case 3:
          this.btnType = 1
          this.dialogData = queryData.data.data
          this.dialogData.parentName = queryData.data.data.parentName
          this.isdisabled = true
          this.dialogTitle = '查看设备类型'
          break;
      }
      this.dialogFormVisible = true
      this.dialogData.actionType = type
      this.dialogKey = new Date().toString()
    },
    //查询站点信息
    async querySiteInfo(val) {
      if (val.id === 0) {
        this.isAllType = true
      } else {
        this.isAllType = false
        getDeviceTypeById(val.id).then(res => {
          if (res.data.code === 0) {
            this.selectNodeInfo = res.data.data
            this.sysTypeMap.forEach(item => {
              if (this.selectNodeInfo.type === item.value) {
                this.selectNodeInfo.typeName = item.label
              }
            })
          }
        })
      }
      this.queryId = val.id === 0 ? "" : val.id
      this.queryCondition.id = this.queryId
      this.queryDevType()
    },
    deviceTypeValid(val){
      this.deviceTypeParamValid = val
    },
    //关闭弹窗，刷新数据
    closeDialog() {
      this.dialogFormVisible = false
      this.dialogKey = new Date().toString()
      // this.init()
    },
    //删除数据
    deleteData() {
      this.dialogVisible = false
      sdcDeviceTypeAction("", "/" + this.delId, "delete").then( res => {
        this.queryId = ''
        this.init()
      })
    },
    setpage(data) {
      this.page = data.current
      this.size = data.size
      this.total = data.total
      this.pageKey = (new Date()).toString() + 1
    },
    //转换表格中siteType的显示
    typeTranslate(row, column) {
      let rowText
      for (let i = 0; i < this.sysTypeMap.length; i++) {
        let el = this.sysTypeMap[i];
        if (el.value === row.type) {
          rowText = el.label
          break
        }
      }
      return rowText
    },
    submitForm() {
      this.$refs.deviceTypeInfo.submitData()
    },
    changeComponent() {
      switch (this.radioBtn) {
        case '1':
          this.currentCompent = 'DeviceType'
          break;
        case '2':
          this.$refs.deviceTypeInfo.verifyParam()
          if(this.deviceTypeParamValid){
            this.currentCompent = 'TelemetryInfo'
          }else{
            this.radioBtn = '1'
            alert("请先填写基础信息！")
          }
      }
      this.dialogKey = new Date().toString()
    },
    filterNode(value, data, node) {
        return getFilterFlag(value, data, node)
    },
    async changeSys() {
      let data = await getSdcDeviceTypeTree(this.sysName)
      this.devCondition = modifyData(data.data.data)
      this.devType = []
      this.queryId = null
      this.devDisabled = false
    },
    changeDeviceType(data) {
      if (data.length === 0) {
        this.queryId = null
      }
    },
    setQueryCondition() {
      this.queryCondition = {
        current: this.page,
        size: this.size
      }
      this.sysName ? this.queryCondition.type = this.sysName : null
      if(this.devType.length !== 0) {
        this.queryId = this.devType[this.devType.length - 1]
      }
      this.queryId ? this.queryCondition.id = this.queryId : null
    },
    // 点击查询
    handleQueryClick() {    
      this.setQueryCondition()
      this.queryCondition.current = 1
      this.queryDevType()
    },
    async queryDevType() {
      this.deviceData = []
      let queryTableData = await getSdcDeviceTypeTable(this.queryCondition)
      console.log(queryTableData);
      this.deviceData = queryTableData.data.data.records
      //设置分页
      this.setpage(queryTableData.data.data)
      //更新数据
      this.dataKey = (new Date()).toString()
    },
    clearCondition() {
      this.sysName = null
      this.devType = []
      this.queryId = null
      this.devDisabled = true
    },
    //导出物模型
    deviceTypeExport() {
      sdcDeviceTypeExport().then( res => {
        let filename = res.headers['content-disposition'].split('=')[1]
        let bolb = new Blob([res.data], {type: "application/vnd.ms-excel;charset=utf-8"})
        if (window.navigator.msSaveOrOpenBlob) { //兼容IE10
            navigator.msSaveBlob(bolb, filename)
        } else {
            const href = URL.createObjectURL(bolb) //创建新的URL表示指定的blob对象
            const a = document.createElement('a') //创建a标签
            a.href = href // 指定下载链接
            a.download = filename //指定下载文件名
            a.click() //触发下载
            URL.revokeObjectURL(a.href) //释放URL对象
        }
      })
    },
    //导入物模型
    deviceTypeImport(e) {
      let formData = new FormData()
      formData.append('file',e.target.files[0])
      if (e.target.files[0]) {
        sdcDeviceTypeImport(formData).then( res => {
          if(res.data.code === 0) {
            this.$notify({
              title: '成功',
              message: '导入成功',
              type: 'success',
              duration: 5000
            })
            this.refreshAfterAction();
          }
        })
        e.target.value = ''
      }   
    },
    // 新增或编辑后刷新数据
    refreshAfterAction() {
      this.queryId = ''
      this.init()
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-container {
  height: 800px;
  .tree-card {
    overflow: auto;
    width: 300px;
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
.node-container:hover .node-style {
  visibility: visible;
}
.node-style {
  visibility: hidden;
  display: inline;
  margin-left: 2px;
  z-index: 1000;
  color: #409eff;
}

.table-action {
  cursor: pointer;
  margin-left: 10px;
  color: #409eff;
}

.device-btnGroup {
  float: right;
  margin-bottom: 20px;
}

.import-btn {
    color: #FFF;
    background-color: #409EFF;
    border-color: #409EFF;
    font-size: 12px;
    border-radius: 3px;
    padding: 9px 15px;
    margin: 0 10px;
    cursor: pointer;
}
</style>
