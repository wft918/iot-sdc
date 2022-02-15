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
              ref="addressTree"
              :data="condition"
              node-key="id"
              :indent="2"
              accordion
              :expand-on-click-node="false"
              :default-expanded-keys="expandKey"
              :props="defaultProps"
              :filter-node-method="filterNode"
              @node-click="querySiteInfo"
            >
              <span slot-scope="{ node }" class="node-container">
                {{ node.label }}
                <!-- <span
                  class="node-style"
                  @click="addAddress(node, data)"
                  v-if="data.type !== 'R00'"
                >
                  <i class="el-icon-circle-plus-outline"></i>
                </span>
                <span
                  class="node-style"
                  @click="editAddress(node, data)"
                  v-if="data.id !== 0"
                >
                  <i class="el-icon-edit-outline"></i>
                </span>
                <span
                  class="node-style"
                  @click="deleteAddress(data)"
                  v-if="data.id !== 0"
                >
                  <i class="el-icon-delete"></i>
                </span> -->
              </span>
            </el-tree>
          </el-card>
        </el-col>
        <el-col :span="19">
          <div>
            <el-row v-if="isAllPark">
              <el-col :span="23">
                <el-button type="primary" @click="addPark" size="small" icon="el-icon-plus">新增园区</el-button>
              </el-col>
              <el-col :span="1" style="float:right;">
                <el-tooltip effect="dark" content="显隐" placement="top">
                  <el-button circle="" @click="chooseColumn" size="small" icon="el-icon-menu"></el-button>
                </el-tooltip>
              </el-col>
            </el-row>
            <el-row v-else>
              <el-col :span="12">
                <el-descriptions title="地点信息" style="font-size:16px;" :column="2" border>
                  <el-descriptions-item label="名称">{{selectSiteInfo.name}}</el-descriptions-item>
                  <el-descriptions-item v-if="selectSiteInfo.type === 'P00'" label="类型">园区</el-descriptions-item>
                  <el-descriptions-item v-if="selectSiteInfo.type === 'B00'" label="类型">楼宇</el-descriptions-item>
                  <el-descriptions-item v-if="selectSiteInfo.type === 'F00'" label="类型">楼层</el-descriptions-item>
                  <el-descriptions-item v-if="selectSiteInfo.type === 'T00'" label="类型">停车场</el-descriptions-item>
                  <el-descriptions-item v-if="selectSiteInfo.type === 'R00'" label="类型">房间</el-descriptions-item>
              </el-descriptions>
              </el-col>
            </el-row>
            <el-row v-if="!isAllPark">
              <el-col :span="6" style="font-size:16px;margin-top:12px;font-weight:700;">
                <div>子级列表</div>
              </el-col>
              <el-col :span="1" style="float:right;">
                <el-tooltip effect="dark" content="显隐" placement="top">
                  <el-button circle="" @click="chooseColumn" size="small" icon="el-icon-menu"></el-button>
                </el-tooltip>
              </el-col>
            </el-row>
          </div>
          <div>
            <!-- <el-table
              :data="siteInfo"
              style="width: 100%; margin: 20px 0"
              row-key="id"
              border
              default-expand-all
              :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
              :key="siteKey"
            > -->
            <el-table
              :data="siteInfo"
              style="width: 100%; margin: 10px 0"
              border
              :key="siteKey"
              ref="tableRef"
            >
              <el-table-column align="center" type="index" label="序号" width="50">
              </el-table-column>
              <el-table-column v-if="columnList[0].show" header-align="center" prop="name" label="名称" sortable>
                <template slot-scope="scope">
                  <el-link :underline="false" type="primary" @click="mainPropClick(scope.row)">{{scope.row.name}}</el-link>
                </template>
              </el-table-column>
              <el-table-column
                prop="code"
                label="编号"
                sortable
                header-align="center"
                v-if="columnList[1].show"
              >
              </el-table-column>
              <el-table-column
                prop="type"
                label="类型"
                align="center"
                width="100"
                :formatter="typeTranslate"
                v-if="columnList[2].show"
              >
              </el-table-column>
              <!-- <el-table-column prop="siteDesc" label="备注信息" 
                header-align="center" align="center" v-if="columnList[3].show">
              </el-table-column> -->
              <el-table-column label="操作" align="center" width="160">
                <template slot-scope="scope">
                  <!-- <span
                    class="table-action"
                    @click="addressAction(scope.row, 3)"
                    >查看</span
                  >
                  <span
                    class="table-action"
                    @click="addressAction(scope.row, 2)"
                    >修改</span
                  > -->
                  <span
                    class="table-action"
                    @click="addressAction(scope.row, 4)"
                    >删除</span
                  >
                  <template v-if="scope.row.type !== 'R00' && scope.row.type !== 'T00'">
                    <span
                      class="table-action"
                      @click="addressAction(scope.row, 1)"
                      >添加下级</span
                    >
                  </template>
                </template>
              </el-table-column>
            </el-table>
            <Pagination :page="page" :size="size" :total="total" :key="pageKey" @pagination="queryByPage"></Pagination>
          </div>
        </el-col>
      </el-row>
      <el-dialog
        :visible.sync="dialogFormVisible"
        :title="dialogTitle"
        :close-on-click-modal="false"
        width="35%"
        top="5vh"
        ref="siteDialog"
        v-dialogDrag
      >
        <div style="width:100%;height:70vh;overflow:auto;">
          <Address
            ref="addressDialog"
            :dialogData="dialogData"
            :siteTypeMap="siteTypeMap"
            :nodeTypeMap="nodeTypeMap"
            :stationTypeMap="stationTypeMap"
            :isdisabled="isdisabled"
            :key="dialogKey"
            @close="closeDialog"
            @refreshDataList="init"
          ></Address>
        </div>
        
        <span slot="footer" class="dialog-footer">
          <template v-if="dialogData.actionType === 3">
            <el-button @click="closeDialog" size="small"
            >关闭</el-button>
            <el-button v-if="btnType === 1" type="primary" @click="enableEdit" size="small"
            >编辑</el-button>
            <el-button v-if="btnType === 2" type="primary" @click="submitForm" size="small"
            >保存</el-button>
          </template>
          <template v-else>
            <el-button @click="closeDialog" size="small">取消</el-button>
            <el-button type="primary" @click="submitForm" size="small"
            >保存</el-button>
          </template>
        </span>
      </el-dialog>
      
      <el-dialog  title="数据删除提醒" :visible.sync="dialogVisible" width="30%" v-dialogDrag>
        <span>是否确定删除当前数据！！！！</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="deleteData">确 定</el-button>
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
import Pagination from "@/components/Pagination";
import Address from "./Address";
import { addressTitleTypeMapFilter } from "@/util/domainFilter";
// import '@/directive'
import { sdcSiteAction,getSdcSiteTable,getAddressList,getNodeList,getStationList,getSiteById } from "@/api/sdc/addressInfo";
import { addressTypeMapFilter } from "@/util/domainFilter";
import { getFilterFlag } from "@/util/getFilterFlag";

export default {
  components: {
    Pagination,
    Address
  },
  filters: {
    addressTypeMapFilter
  },
  data() {
    return {
      page: 1,
      size: 10,
      total: 0,
      siteKey: (new Date()).toString(),
      dialogKey:(new Date()).toString(),
      pageKey: Math.random().toString(36).slice(-6),
      dialogFormVisible: false,
      dialogVisible: false,
      dialogMapVisible: false,
      isdisabled: false,
      dialogData: {
        actionType: null,
        editId: null,
        addType: null,
        parentAddress: null
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      expandKey: [0],
      condition: [
        {
          id: 0,
          name: "全部园区",
          parentId: "",
          sdcSiteDesc: "",
          code: "",
          type: "",
          children: [],
        }
      ],
      siteData: [],
      siteInfo: [],
      delId: null,
      queryId: '',
      siteTypeMap: [],
      siteTypeTransMap: [],
      nodeTypeMap: [],
      stationTypeMap: [],
      dialogTitle: '',
      filterText: '',
      btnType: 1,
      columnList: [
        {
          prop: 'name',
          label: '名称',
          show: true
        },
        {
          prop: 'code',
          label: '编号',
          show: true
        },
        {
          prop: 'type',
          label: '类型',
          show: true
        },
        // {
        //   prop: 'siteDesc',
        //   label: '备注信息',
        //   show: true
        // }
      ],
      dialogColumnVisible: false,
      isAllPark: true,
      selectSiteInfo: {}
    }
  },
  watch: {
      filterText(val) {
        this.$refs.addressTree.filter(val);
      }
    },
  mounted() {
    // this.initBMap()
  },
  created() {
    this.getAddressList()
    this.getNodeList()
    this.getStationList()
    this.init()
  },
  methods: {
    //初始化获取数据
    async init() {
      let data = await sdcSiteAction('','/tree','get')
      this.condition[0].children = data.data.data
      
      let queryTableData = await getSdcSiteTable(this.page,this.size,this.queryId)
      
      this.siteInfo = queryTableData.data.data.records
      console.log(this.siteInfo);
      this.setpage(queryTableData.data.data)
      
    },
    async queryByPage(data) {
      console.log(data);
      let queryTableData = await getSdcSiteTable(
        data.page,
        data.size,
        this.queryId
      );
      this.siteInfo = queryTableData.data.data.records;
      this.setpage(queryTableData.data.data)
      this.siteKey = new Date().toString()
    },
    async getAddressList() {
      this.siteTypeTransMap = []
      let addressList = await getAddressList()
      addressList.data.data.forEach( el => {
        this.siteTypeTransMap.push({
          value: el.value,
          label: el.description
        })
      })
    },
    async getNodeList() {
      this.nodeTypeMap = []
      let nodeList = await getNodeList()
      nodeList.data.data.forEach( el => {
        this.nodeTypeMap.push({
          value: el.value,
          label: el.description
        })
      })
    },
    async getStationList() {
      this.stationTypeMap = []
      let stationList = await getStationList()
      stationList.data.data.forEach( el => {
        this.stationTypeMap.push({
          value: el.value,
          label: el.description
        })
      })
    },
    // 控制列显隐
    chooseColumn() {
      this.dialogColumnVisible = true
    },
    async mainPropClick(row) {
      this.dialogData = {}
      this.btnType = 1
      let queryData = await sdcSiteAction('','/'+ row.id,'get')
      this.dialogData = queryData.data.data
      this.dialogData.parentAddress = queryData.data.data.parentName
      this.dialogData.addType = row.type
      this.siteTypeMap = this.siteTypeTransMap
      this.dialogFormVisible = true
      this.dialogData.actionType = 3
      this.isdisabled = true
      this.dialogTitle = addressTitleTypeMapFilter(this.dialogData.actionType, this.dialogData.addType)
      this.dialogKey = (new Date()).toString()
    },
    enableEdit() {
      this.isdisabled = false
      this.btnType = 2
      this.dialogTitle = addressTitleTypeMapFilter(2, this.dialogData.addType)
    },
    addPark() {
      this.dialogData = {}
      this.dialogData.actionType = 1
      this.isdisabled = false
      this.dialogFormVisible = true
      this.dialogData.addType = 'P00'
      this.siteTypeMap = [{
        value: 'P00',
        label: '园区'
      }]
      this.dialogTitle = addressTitleTypeMapFilter(this.dialogData.actionType, this.dialogData.addType)
      this.dialogKey = (new Date()).toString()
    },
    //新建站点
    addAddress(node, data){
      this.dialogData = {}
      this.dialogData.actionType = 1
      this.isdisabled = false
      this.setDialogData(node, data)
    },
    //修改站点
    async editAddress(node, data){
      let queryData = await sdcSiteAction('','/'+data.id,'get')
      this.dialogData = queryData.data.data
      this.dialogData.actionType = 2
      this.isdisabled = false
      this.setDialogData(node, data)
    },
    //设置dialog数据
    setDialogData(node, data) {
      this.dialogKey = (new Date()).toString()
      this.dialogFormVisible = true
      if(this.dialogData.actionType == 1){
        this.setAddType(data.type) 
        if (data.type) {
          this.dialogData.parentId = data.id;
        }
        this.dialogData.parentAddress = node.label
        // this.dialogData.addType = data.type + 1 
      }else{
        this.dialogData.addType = data.type
        this.siteTypeMap = this.siteTypeTransMap
      }
      this.dialogTitle = addressTitleTypeMapFilter(this.dialogData.actionType, this.dialogData.addType)
    },
    setAddType(val) {
      switch (val) {
        case 'P00':
          this.dialogData.addType = 'B00'
          this.siteTypeMap = [
            {
              value: 'B00',
              label: '楼宇'
            },
            {
              value: 'T00',
              label: '停车场'
            }
          ]
          break;
        case 'B00':
          this.dialogData.addType = 'F00'
          this.siteTypeMap = [
            {
              value: 'F00',
              label: '楼层'
            },
            {
              value: 'T00',
              label: '停车场'
            }
          ]
          break;
        case 'F00':
          this.dialogData.addType = 'R00'
          this.siteTypeMap = [
            {
              value: 'R00',
              label: '房间'
            },
            {
              value: 'T00',
              label: '停车场'
            }
          ]
          break;
        case '':
          this.dialogData.addType = 'P00'
           this.siteTypeMap = [
            {
              value: 'P00',
              label: '园区'
            }
          ]
          break;
      }
    },
    //删除数据
    deleteAddress(data) {
      this.dialogVisible = true
      this.delId = data.id
    },
    //站点操作
    async addressAction(data, type) {
      console.log(data.id,'结果');
      this.dialogData = {}
      if (type === 4) {
        this.dialogVisible = true
        this.delId = data.id
        return
      }
      let queryData = await sdcSiteAction('','/'+ data.id,'get')
      switch (type) {
        case 1:
          //添加
          // this.dialogData.parentAddress = queryData.data.data.name
          this.dialogData.parentId = queryData.data.data.id;
          this.dialogData.parentAddress = queryData.data.data.name
          this.dialogData.parentId = data.id
          this.isdisabled = false
          this.setAddType(queryData.data.data.type)
          break;
        case 2:
          // this.dialogData = queryData.data.data
          // this.dialogData.parentAddress = queryData.data.data.parentName
          // this.dialogData.parentId = queryData.data.data.parentId
          // this.dialogData.addType = data.type
          // this.dialogData.isdisabled = false
          // this.setAddType(queryData.data.data.type)
          this.dialogData = queryData.data.data
          this.dialogData.parentAddress = queryData.data.data.parentName
          this.dialogData.addType = data.type
          this.siteTypeMap = this.siteTypeTransMap
          this.isdisabled = false
          break;
        case 3:
          this.btnType = 1
          this.dialogData = queryData.data.data
          this.dialogData.parentAddress = queryData.data.data.parentName
          this.dialogData.addType = data.type
          this.isdisabled = true
          this.siteTypeMap = this.siteTypeTransMap
          break; 
      }
      this.dialogFormVisible = true
      this.dialogData.actionType = type
      this.dialogTitle = addressTitleTypeMapFilter(this.dialogData.actionType, this.dialogData.addType)
      this.dialogKey = (new Date()).toString()
    },
    //查询站点信息
    async querySiteInfo(val) {
      if (val.id === 0) {
        this.isAllPark = true
      } else {
        this.isAllPark = false
        getSiteById(val.id).then(res => {
          if (res.data.code === 0) {
            this.selectSiteInfo = res.data.data
          }
        })
      }
      this.queryId = val.id === 0 ? '' : val.id
      let queryTableData = await getSdcSiteTable(1,10,this.queryId)
      this.siteInfo = queryTableData.data.data.records
      this.siteKey = (new Date()).toString()
      this.setpage(queryTableData.data.data)
    },
    //递归遍历数据
    findData(tableData, id) {
      for (let index = 0; index < tableData.length; index++) {
        const element = tableData[index];
        if(element.id === id) {
          this.siteInfo = []
          this.siteInfo.push(element)
        } else {
          if( element.children.length !== 0) {
            this.findData(element.children,id)
          }
        }
      }
    },
    //关闭弹窗，刷新数据
    closeDialog(){
      // this.init()
      this.dialogFormVisible = false
    },
    //删除数据
    deleteData() {
      this.dialogVisible = false
      sdcSiteAction('','/'+this.delId,'delete').then(() => {
          this.queryId = ''
          this.init()
          this.$message({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
    },
    //转换表格中siteType的显示
    typeTranslate(row,column) {
      let rowText
      for(let i = 0; i < this.siteTypeTransMap.length; i++) {
        let el = this.siteTypeTransMap[i]
        if(el.value === row.type) {
          rowText = el.label
          break
        }
      }
      return rowText
    },
    //处理每页条数改变事件
    async handleSizeChange(val) {
      // //向父组件传递改变的值
      // this.$emit('pagination',{ page: this.page, size: val } )
      let params = {
        current:this.page,
        size:val,
        id: this.queryId
      }
      let queryTableData = await getSdcSiteTable(params)
      this.siteInfo = queryTableData.data.data
    },
    //处理当前页数改变事件
    async handleCurrentChange(val) {
      //向父组件传递改变的值
      // this.$emit('pagination',{ page: val, size: this.size } )
      let params = {
        current:this.page,
        size:val,
        id: this.queryId
      }
      let queryTableData = await getSdcSiteTable(params)
      this.siteInfo = queryTableData.data.data
    },
    //
    setpage(data){
      this.page = data.current
      this.size = data.size
      this.total = data.total
      this.pageKey = (new Date()).toString() + 1
    },
    submitForm() {
      // this.dialogFormVisible = false
      this.$refs.addressDialog.submitForm()
    },
    filterNode(value, data, node) {
        return getFilterFlag(value, data, node)
      }
  }
}
</script>

<style lang="scss" scoped>
.tree-container {
  // border: 1px solid #eee;
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
  margin-left: 5px;
  z-index: 1000;
  color: #409eff;
}

.table-action {
  cursor: pointer;
  margin-left: 10px;
  color: #409eff;
}

.bmap {
  min-height: 600px;
  height: 100%;
  width: 100%;
}
// /deep/.el-descriptions__title {
//   font-weight: normal;
// }
</style>
