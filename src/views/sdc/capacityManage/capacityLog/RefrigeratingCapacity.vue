<template>
  <basic-container>
    <el-row :gutter="15">
      <!-- 左侧树形菜单 -->
      <el-col :span="5" class="tree-area">
        <el-card shadow="never" :body-style="contentViewHeight">
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
            size="small"
            v-model="filterText">
          </el-input>  -->
          <el-tree
            class="filter-tree"
            :data="siteData"
            :indent="2"
            :props="{
                      value: 'id',
                      label: 'name',
                      children: 'children'
                    }"
            default-expand-all
            node-key="id"
            :highlight-current="false"
            :filter-node-method="filterNode"
            :expand-on-click-node="true"
            @node-click="handleNodeClick"
            ref="leftTree">
          </el-tree>
        </el-card>
      </el-col>
      <!-- 右侧表格 -->
      <el-col :span="19">
        <el-row>
          <el-col :span="8" :offset="1">
            <span>所属位置：</span>
            <el-cascader 
              ref="siteChoose"
              :options="siteData" 
              style="width:70%" 
              v-model="querySiteId"
              filterable
              @change="changeSite"
              :props="{value: 'id', label: 'name', children: 'children'}"
            >
            </el-cascader>
          </el-col>
          <el-col :span="4">
            <span>名称：</span>
            <el-input v-model="queryName" style="width: 70%" clearable></el-input>
          </el-col>
          <el-col :span="10">
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              class="refresh-btn"
              @click="queryTableData"
              >查询</el-button>
            <el-button
              type="primary"
              icon="el-icon-refresh"
              size="small"
              class="refresh-btn"
              @click="resetTable"
              >重置</el-button>
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
            prop="siteName"
            label="名称"
            align="center"
            width="180"
            show-overflow-tooltip
          ></el-table-column>
          <!-- <el-table-column
            prop=""
            label="所处位置"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.expand">{{scope.row.expand.siteNames.join('/')}}</span>
            </template>
          </el-table-column> -->
          <el-table-column
            v-if="columnList[1].show"
            prop="expand.siteArea"
            label="面积(㎡)"
            align="center"
          ></el-table-column>
          <el-table-column
            v-if="columnList[2].show"
            prop="rated"
            label="设计需要冷量(kw)"
            align="center"
          ></el-table-column>
          <el-table-column
            v-if="columnList[3].show"
            prop="used"
            label="机房冷负荷(kw)"
            align="center"
          ></el-table-column>
          <el-table-column
            v-if="columnList[4].show"
            prop="free"
            label="制冷空闲(kw)"
            align="center"
          ></el-table-column>
          <el-table-column
            v-if="columnList[5].show"
            prop="percent"
            label="负载率(%)"
            align="center"
          >
          </el-table-column>
          <el-table-column
            v-if="columnList[6].show"
            prop="dataDate"
            label="记录时间"
            align="center"
          ></el-table-column>
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
import { getCapacityCoolLog } from "@/api/sdc/capacityManage";
import { modifyData} from "@/util/domainFilter";
import { getFirstChild } from "@/util/getFirstChild";
import { getFilterFlag } from "@/util/getFilterFlag";
import _ from "lodash"
export default {
  components: {
    Pagination
  },
  data() {
    return {
      // 左侧树型目录相关
      filterText: '',
      siteData: [],
      selectName: '',
      firstChild: [],
      // 右侧表格相关
      querySiteId: null,
      queryName: '',
      recordTable: [],
      recordEmptyText: '数据加载中',
      // 分页器
      PageInfo: {
        page: 1,
        size: 10,
        total: 0
      },
      PageKey: Math.random().toString(36).slice(-6),
      queryCondition: {
        current: 1,
        size: 10
      },
      columnList: [
        {
          prop: 'siteName',
          label: '名称',
          show: true
        },
        {
          prop: 'siteArea',
          label: '面积(㎡)',
          show: true
        },
        {
          prop: 'rated',
          label: '设计需要冷量(kw)',
          show: true
        },
        {
          prop: 'used',
          label: '机房冷负荷(kw)',
          show: true
        },
        {
          prop: 'free',
          label: '制冷空闲(kw)',
          show: true
        },
        {
          prop: 'percent',
          label: '负载率(%)',
          show: true
        },
        {
          prop: 'dataDate',
          label: '记录时间',
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
      this.getSiteData()
    },
    methods: {
      /**
       * 网络请求
       */
      _getCapacityCoolLog(params) {
        getCapacityCoolLog(params).then(res => {
          console.log(res);
          if (res.data.code === 0) {
            let data = res.data.data.records
            this.recordTable = data
            this.PageInfo.total = res.data.data.total
            this.PageInfo.current = res.data.data.current
            if (this.recordTable.length === 0) {
              this.recordEmptyText = '暂无数据'
            }
          } else {
            return this.$message.error('获取数据出错，请刷新重试')
          }
        })
      },
      // 获取树形目录数据
      async getSiteData() {
        let data = await sdcSiteAction("", "/tree", "get");
        let ftData = this.getFloorTree(data.data.data)
        let mData = modifyData(ftData)
        this.siteData = _.cloneDeep(mData)
        this.siteTreeData = this.setDisable(mData)
        getFirstChild(this.siteData, this.firstChild, 'F00')
        this.querySiteId = this.firstChild[0].id
        this.selectName = '已选区域: ' + this.firstChild[0].name 
        this.setQueryCondition()      
        this._getCapacityCoolLog(this.queryCondition)
        this.$nextTick(() => {
          this.$refs.leftTree.setCurrentKey(this.firstChild[0].id)
        })
      },

      /**
       * 方法监听
       */
      setDisable (data) {
        data.forEach(item => {
          if (item.type !== 'F00') {
            item.disabled = true
          } else {
            if (item.children && item.children.length) {
              this.setDisable(item.children)
            }
          }
        })
        return data
      },
      getFloorTree(data) {
        data.forEach(item => {
          if (item.type === 'F00') {
            item.children = []
          } else {
            if (item.children && item.children.length) {
              this.getFloorTree(item.children)
            }
          }
        })
        return data
      },
      filterNode(value, data, node) {
        return getFilterFlag(value, data, node)
      },
      handleNodeClick(data) {
        if (data.type === 'F00') {
          this.querySiteId = data.id
          this.selectName = '已选区域: ' + data.name
          this.setQueryCondition()
          this._getCapacityCoolLog(this.queryCondition)
        } else {
          this.$refs.leftTree.setCurrentKey(null)
        }
      },
      handleNodeClose() {
        this.selectName = ''
        this.querySiteId = null
        this.$refs.leftTree.setCurrentKey(null)
        this.setQueryCondition()
        this._getCapacityCoolLog(this.queryCondition)
      },
      changeSite() {
        let checkLeafNode = this.$refs.siteChoose.getCheckedNodes()
        this.selectName = '已选区域: ' + checkLeafNode[0].label
        this.querySiteId = this.querySiteId[this.querySiteId.length - 1]
        this.$refs.leftTree.setCurrentKey(this.querySiteId)
        this.setQueryCondition()
        this._getCapacityCoolLog(this.queryCondition)
      },
      queryTableData() {
        this.setQueryCondition()
        this._getCapacityCoolLog(this.queryCondition)
      },
      resetTable() {
        this.querySiteId = null
        this.queryName = ''
        this.$refs.leftTree.setCurrentKey(null)
        this.selectName = ''
        this.setQueryCondition()
        this._getCapacityCoolLog(this.queryCondition)
      },
      chooseColumn() {
        this.dialogColumnVisible = true
      },
      // 分页器事件
      queryByPage(info) {
        this.PageInfo.page = info.page
        this.PageInfo.size = info.size
        this.setQueryCondition()
        this.queryCondition.current = info.page
        this.queryCondition.size = info.size
        this._getCapacityCoolLog(this.queryCondition)
      },
      setQueryCondition() {
        this.queryCondition = {
          current: 1,
          size: 10
        }
        this.querySiteId ? this.queryCondition.siteId = this.querySiteId : ''
        this.queryName ? this.queryCondition.siteName = this.queryName : ''
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

</style>