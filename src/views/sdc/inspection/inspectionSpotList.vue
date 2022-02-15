<!-- 巡检点管理 -->
<template>
<basic-container>
  <div>
    <el-form :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
      <!-- 搜索框-->
      <el-form-item prop="siteName" label="名称">
        <el-input size="small" v-model="searchForm.siteName" placeholder="请输入名称" clearable></el-input>
      </el-form-item>
      <!-- <el-form-item prop="projectId" label="所属项目">
        <el-select v-model="searchForm.projectId" placeholder="请选择">
          <el-option
            v-for="item in projectList"
            :key="item.projectId"
            :label="item.projectName"
            :value="item.projectId">
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="refreshList()" size="small">查询</el-button>
        <el-button @click="resetSearch()" size="small">重置</el-button>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
        <el-button type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
         :disabled="dataListSelections.length != 1" plain>编辑</el-button>
        <el-button type="danger" size="small" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0" plain>删除
        </el-button>
        <el-tooltip effect="dark" content="显隐" placement="top">
          <el-button circle="" @click="chooseColumn" size="small" icon="el-icon-menu"></el-button>
        </el-tooltip>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      size="medium"
      @selection-change="selectionChangeHandle"
      v-loading="loading"
      class="table">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        v-if="columnList[0].show"
        prop="siteName"
        show-overflow-tooltip
        label="巡检点名称">
        <template slot-scope="scope">
          <el-link :underline="false" type="primary" @click="mainPropClick(scope.row)">{{scope.row.siteName}}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        v-if="columnList[1].show"
        prop="projectName"
        show-overflow-tooltip
        label="所属位置">
      </el-table-column>
      <el-table-column
        v-if="columnList[2].show"
        prop="located"
        show-overflow-tooltip
        label="定位启用状态">
        <template slot-scope="scope">
          {{scope.row.located == '1'?'已启用':scope.row.located == '0'?'未启用':''}}
        </template>
      </el-table-column>
      <el-table-column
        v-if="columnList[3].show"
        prop="enable"
        show-overflow-tooltip
        label="是否启用">
        <template slot-scope="scope">
          {{scope.row.enable == '1'?'已启用':scope.row.enable == '0'?'未启用':''}}
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop=""
        show-overflow-toolti
        label="检查项">
        <template slot-scope="scope">
          <div v-for="item in scope.row.itemList">{{item}}</div>
        </template>
      </el-table-column> -->
      <el-table-column
        header-align="center"
        align="center"
        width="140"
        label="操作">
        <template  slot-scope="scope">
          <!-- <el-button type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
          <el-button type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button> -->
          <el-button type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>
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

    <inspectionSpotForm ref="inspectionSpotForm" @refreshDataList="refreshList"></inspectionSpotForm>
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
  import inspectionSpotForm from './inspectionSpotForm'
  export default {
    data() {
      return {
        searchForm:{
          siteName:"",
          projectId:""
        },
        projectList:[],//所属项目列表
        dataList: [],
        pageNo: 1,
        pageSize: 10,
        total: 0,
        // orderBy: '',
        dataListSelections: [],
        loading:false,
        dialogColumnVisible: false,
        columnList: [
          {
            prop: 'siteName',
            label: '巡检点名称',
            show: true
          },
          {
            prop: 'projectName',
            label: '所属位置',
            show: true
          },
          {
            prop: 'located',
            label: '定位启用状态',
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
    components: {
      inspectionSpotForm
    },
    created() {
      this.refreshList()
      // this.getprojectInfolist()
    },
    methods: {
      // 获取数据列表
      refreshList() {
        this.loading = true
        this.$http({
          url:"/check/inspect/inspectSite/list",
          method:"get",
          params: {
            pageNo:this.pageNo,
            pageSize:this.pageSize,
            // orderBy:this.orderBy,
            delFlag:'1',
            ...this.searchForm
          }
        }).then(({data}) => {
          if(data && data.success) {
            this.dataList = data.page.list
            this.total = data.page.count
            this.loading = false
          }
        })
      },
      // // 获取所属项目列表
      // getprojectInfolist() {
      //   this.$http({
      //     url:"/check/iot/tsg/projectInfo/listByUser",
      //     method:"get",
      //   }).then(({data}) => {
      //     if(data && data.success) {
      //       this.projectList = data.projects
      //       this.searchForm.projectId = data.projects[0].projectId
      //       this.refreshList()
      //     }
      //   })
      // },
      // 重置
      resetSearch() {
        // this.$refs.searchForm.resetFields()
        this.searchForm.siteName = ''
        // this.searchForm = {
        //   siteName:"",
        //   projectId:this.projectList[0].projectId
        // }
        this.refreshList()
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
      // // 排序
      // sortChangeHandle (obj) {
      //   if (obj.order === 'ascending') {
      //     this.orderBy = obj.prop + ' asc'
      //   } else if (obj.order === 'descending') {
      //     this.orderBy = obj.prop + ' desc'
      //   } else {
      //     this.orderBy = ''
      //   }
      //   this.refreshList()
      // },
      // 控制列显隐
      chooseColumn() {
        this.dialogColumnVisible = true
      },
      mainPropClick(row) {
        this.$refs.inspectionSpotForm.init('view', row.id)
      },
      // 新增
      add () {
        this.$refs.inspectionSpotForm.init('add','')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.inspectionSpotForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.inspectionSpotForm.init('view', id)
      },
      // 删除
      del (id) {
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
            url: '/check/inspect/inspectSite/delete',
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
      },
    },
  }
</script>
<style scoped></style>