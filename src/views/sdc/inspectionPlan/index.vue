<template>
<basic-container>
  <div class="page">
    <!-- 顶部查询 -->
    <el-form :inline="true" ref="searchForm" :model="searchForm" class="demo-form-inline" size="small">
      <el-form-item label="名称" prop="planName">
        <el-input v-model="searchForm.planName" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="planType">
        <el-select v-model="searchForm.planType" placeholder="类型">
          <el-option v-for="item in planTypeList" :key="item.id" :label="item.label" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="refreshList" style="margin-top: -3px;">查询</el-button>
        <el-button @click="resetSearch" style="margin-top: -3px;">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 操作 -->
    <div style="position: absolute;right: 20px;top: 20px;">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
        <el-button type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
         :disabled="dataListSelections.length != 1" plain>编辑</el-button>
        <el-button type="danger" size="small" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0" plain>删除
        </el-button>
        <el-tooltip effect="dark" content="显隐" placement="top">
          <el-button circle="" @click="chooseColumn" size="small" icon="el-icon-menu"></el-button>
        </el-tooltip>
    </div>

    <!-- 列表 -->
    <el-table size="medium" @selection-change="selectionChangeHandle" v-loading="loading" :data="tableData" style="width: 100%">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column v-if="columnList[0].show" prop="planName" show-overflow-tooltip label="计划名称" width="260">
        <template slot-scope="scope">
          <el-link :underline="false" type="primary" @click="mainPropClick(scope.row)">{{scope.row.planName}}</el-link>
        </template>
      </el-table-column>
      <el-table-column v-if="columnList[1].show" prop="" show-overflow-tooltip label="类型" width="120">
        <template slot-scope="scope">
          {{scope.row.planType == 1?'日计划':scope.row.planType == 2?'周计划':scope.row.planType == 3?'月计划':scope.row.planType == 4?'年计划':scope.row.planType == 5?'时计划':''}}
        </template>
      </el-table-column>
      <el-table-column v-if="columnList[2].show" prop="executionInterval" show-overflow-tooltip label="执行间隔(天)" align="center" width="120">
      </el-table-column>
      <el-table-column v-if="columnList[3].show" prop="startDate" show-overflow-tooltip align="center" label="开始日期">
      </el-table-column>
      <el-table-column v-if="columnList[4].show" prop="endDate" show-overflow-tooltip align="center" label="结束日期">
      </el-table-column>
      <el-table-column v-if="columnList[5].show" prop="routeName" show-overflow-tooltip label="巡检线路" width="260">
      </el-table-column>
      <el-table-column v-if="columnList[6].show" prop="inspectorName" show-overflow-tooltip label="执行人">
      </el-table-column>
      <el-table-column v-if="columnList[7].show" prop="" show-overflow-tooltip label="是否启用">
        <template slot-scope="scope">
          {{scope.row.enable == 1?'已启用':scope.row.enable == 0?'未启用':''}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140">
        <template slot-scope="scope" align="center">
          <!-- <el-button type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
          <el-button type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">编辑</el-button> -->
          <el-button type="text" icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top:15px;"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageNo"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="total"
      background
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗 -->
    <add ref="addModel" @refreshDataList="refreshList"></add>
    <el-dialog
      :visible.sync="dialogColumnVisible"
      title="请选择要显示的列"
      :close-on-click-modal="false"
      width="35%"
      v-dialogDrag
    >
      <el-checkbox v-for="item in columnList" v-model="item.show" :key="item.prop">{{item.label}}</el-checkbox>
    </el-dialog>
  </div>
</basic-container>
</template>
<script>
  import add from './model/add'
  export default {
    components: {
      add,
    },
    data() {
      return {
        searchForm: {
          planName: '',
          planType: ''
        },
        planTypeList:[
          {
            label:"时计划",
            id:5
          },
          {
            label:"日计划",
            id:1
          },
          {
            label:"周计划",
            id:2
          },
          {
            label:"月计划",
            id:3
          },
          {
            label:"年计划",
            id:4
          },
        ],//计划类型
        loading:false,
        pageNo: 1,
        pageSize: 10,
        total: 0,
        dataListSelections: [],
        tableData: [],
        dialogColumnVisible: false,
        columnList: [
          {
            prop: 'planName',
            label: '计划名称',
            show: true
          },
          {
            prop: 'planType',
            label: '类型',
            show: true
          },
          {
            prop: 'executionInterval',
            label: '执行间隔',
            show: true
          },
          {
            prop: 'startDate',
            label: '开始日期',
            show: true
          },
          {
            prop: 'endDate',
            label: '结束日期',
            show: true
          },
          {
            prop: 'routeName',
            label: '巡检线路',
            show: true
          },
          {
            prop: 'inspectorName',
            label: '执行人',
            show: true
          },
          {
            prop: 'enable',
            label: '是否启用',
            show: true
          }
        ]
      }
    },
    activated() {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList() {
        this.loading = true
        this.$http({
          url:"/check/inspect/inspectPlan/list",
          method:"get",
          params:{
            pageNo:this.pageNo,
            pageSize:this.pageSize,
            delFlag:'1',
            ...this.searchForm
          }
        }).then(({data}) => {
          if(data && data.success) {
            this.tableData = data.page.list
            this.total = data.page.count
            this.loading = false
          }
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageNo = 1
        this.refreshList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageNo = val
        this.refreshList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 重置
      resetSearch() {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      },
      chooseColumn() {
        this.dialogColumnVisible = true
      },
      mainPropClick(row) {
        this.$refs.addModel.init('view', row.id)
      },
      // 新增
      add() {
        this.$refs.addModel.init('add','')
      },
      // 编辑
      edit(id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.addModel.init('edit',id)
      },
      // 查看
      view(id) {
        this.$refs.addModel.init('view',id)
      },
      // 删除
      del(id) {
        let ids = id || this.dataListSelections.map(item => {
          return item.id
        }).join(',')
        this.$confirm(`确定删除所选项吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.$http({
            url: '/check/inspect/inspectPlan/delete',
            method: 'delete',
            params: {'ids': ids}
          }).then(({data}) => {
            if (data && data.success) {
              this.$message.success(data.msg)
              this.refreshList()
            }
            this.loading = false
          })
        })
      }
    }
  }
</script>
<style scoped>
  .page {
    height: 850px;
    padding: 20px;
    position: relative;
  }
</style>