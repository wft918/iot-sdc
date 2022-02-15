<template>
  <div>
    <basic-container>
      <el-form :inline="true" v-show="isSearchCollapse" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
         <el-form-item prop="alarmName">
                <el-input size="small" v-model="searchForm.alarmName" placeholder="告警等级名称" clearable></el-input>
         </el-form-item>
         <!-- <el-form-item prop="status">
                  <el-select v-model="searchForm.status" placeholder="请选择" size="small" style="width: 100%;">
                    <el-option
                      v-for="item in $dictUtils.getDictList('enable_status')"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
         </el-form-item> -->
          <el-form-item>
            <el-button type="primary" @click="refreshList()" size="small">查询</el-button>
            <el-button @click="resetSearch()" size="small">重置</el-button>
          </el-form-item>
      </el-form>
        <!-- 导入导出-->
      <el-form :inline="true" v-show="isImportCollapse"  class="query-form" ref="importForm">
         <el-form-item>
          <el-button type="default" @click="downloadTpl()" size="small">下载模板</el-button>
         </el-form-item>
         <el-form-item prop="loginName">
            <el-upload
              class="upload-demo"
              :action="`${this.$http.BASE_URL}/sdc/scdalarmlevel/sdcAlarmLevel/import`"
              :on-success="uploadSuccess"
               :show-file-list="true">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只允许导入“xls”或“xlsx”格式文件！</div>
            </el-upload>
        </el-form-item>
      </el-form>
      <el-row>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
        <el-button type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
         :disabled="dataListSelections.length != 1" plain>修改</el-button>
        <!-- <el-button ype="danger"   size="small" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0" plain>删除
        </el-button> -->
        <el-button-group class="pull-right">
            <el-button
              type="default"
              size="small"
              icon="el-icon-search"
              @click="isSearchCollapse = !isSearchCollapse, isImportCollapse=false">
            </el-button>
            <!-- <el-button  type="default" size="small" icon="el-icon-upload2" title="导入" @click="isImportCollapse = !isImportCollapse, isSearchCollapse=false"></el-button>
            <el-button  type="default" size="small" icon="el-icon-download" title="导出" @click="exportExcel()"></el-button> -->
            <el-button
              type="default"
              size="small"
              icon="el-icon-refresh"
              @click="refreshList">
            </el-button>
        </el-button-group>
      </el-row>
    <el-table
      :data="dataList"
      border
      size="medium"
      @selection-change="selectionChangeHandle"
      @sort-change="sortChangeHandle"
      :row-style="changeRowBgColor"
      v-loading="loading"
      class="table">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
    <el-table-column
        prop="alarmName"
        show-overflow-tooltip
        sortable="custom"
        label="告警等级名称">
            <!-- <template slot-scope="scope">
              <el-link  type="primary" :underline="false" v-if="hasPermission('sdc:scdalarmlevel:sdcAlarmLevel:edit')" @click="edit(scope.row.id)">{{scope.row.alarmName}}</el-link>
              <el-link  type="primary" :underline="false" v-else-if="hasPermission('sdc:scdalarmlevel:sdcAlarmLevel:view')"  @click="view(scope.row.id)">{{scope.row.alarmName}}</el-link>
              <span v-else>{{scope.row.alarmName}}</span>
            </template> -->
      </el-table-column>
    <!-- <el-table-column
        prop="alarmColor"
        show-overflow-tooltip
        sortable="custom"
        label="颜色显示">
      </el-table-column> -->
    <el-table-column
        prop="noticeFreq"
        show-overflow-tooltip
        sortable="custom"
        label="通知频率（分钟)">
      </el-table-column>
    <el-table-column
        prop="noticeUplimit"
        show-overflow-tooltip
        sortable="custom"
        label="通知上限（次）">
      </el-table-column>
    <el-table-column
        prop="upgradeTime"
        show-overflow-tooltip
        sortable="custom"
        label="升级时间（分钟）">
      </el-table-column>
    <el-table-column
        prop="alarmDealline"
        show-overflow-tooltip
        sortable="custom"
        label="处理时限（分钟）">
      </el-table-column>
    <el-table-column
        prop="status"
        show-overflow-tooltip
        sortable="custom"
        align="center"
        label="启用状态">
        <!-- <template slot-scope="scope">
              {{ $dictUtils.getDictLabel("enable_status", scope.row.status, '-') }}
        </template> -->
        <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              v-if="scope.row.status === '0' || scope.row.status === '1'"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="statusChange(scope.row)"
              active-value="0"
              inactive-value="1">
            </el-switch>
        </template>
      </el-table-column>
    <el-table-column
        prop="remarks"
        show-overflow-tooltip
        sortable="custom"
        label="备注信息">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        fixed="right"
        width="200"
        label="操作">
        <template  slot-scope="scope">
          <el-button  type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
          <el-button  type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>
          <el-button v-if="scope.row.deletable!=='0'" type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageNo"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="total"
      background
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    </basic-container>
        <!-- 弹窗, 新增 / 修改 -->
    <SdcAlarmLevelForm  ref="sdcAlarmLevelForm" @refreshDataList="refreshList"></SdcAlarmLevelForm>
  </div>
</template>

<script>
  import SdcAlarmLevelForm from './SdcAlarmLevelForm'
  export default {
    data () {
      return {
        searchForm: {
          alarmName: '',
          status: ''
        },
        dataList: [],
        pageNo: 1,
        pageSize: 10,
        total: 0,
        orderBy: '',
        dataListSelections: [],
        isSearchCollapse: false,
        isImportCollapse: false,
        loading: false
      }
    },
    components: {
      SdcAlarmLevelForm
    },
    activated () {
      this.refreshList()
    },
    created () {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/alarm/sdc/scdalarmlevel/sdcAlarmLevel/list',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            'orderBy': this.orderBy,
            ...this.searchForm
          }
        }).then(({data}) => {
          if (data && data.success) {
            this.dataList = data.page.list
            this.total = data.page.count
            this.loading = false
          }
        })
      },
      changeRowBgColor({ row, rowIndex }) {
      let styleJson =  { "color":  row.alarmColor };
      return styleJson;
    },
    statusChange (row) {
        this.loading = true
        this.$http({
          url: `/alarm/sdc/scdalarmlevel/sdcAlarmLevel/updateStatus`,
          method: 'post',
          data: {id: row.id, status: row.status}
        }).then(({data}) => {
          if (data && data.success) {
            this.$message({
              message: data.msg,
              type: 'success',
              duration: 1500
            })
          }
          this.loading = false
          this.refreshList()
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

    // 排序
      sortChangeHandle (obj) {
        if (obj.order === 'ascending') {
          this.orderBy = obj.prop + ' asc'
        } else if (obj.order === 'descending') {
          this.orderBy = obj.prop + ' desc'
        } else {
          this.orderBy = ''
        }
        this.refreshList()
      },
      // 新增
      add () {
        this.$refs.sdcAlarmLevelForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.sdcAlarmLevelForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.sdcAlarmLevelForm.init('view', id)
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
            url: '/alarm/sdc/scdalarmlevel/sdcAlarmLevel/delete',
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
      // 导入成功
      uploadSuccess (res, file) {
        if (res.success) {
          this.$message.success({dangerouslyUseHTMLString: true,
            message: res.msg})
        } else {
          this.$message.error(res.msg)
        }
      },
      // 下载模板
      downloadTpl () {
        this.$utils.download('/alarm/sdc/scdalarmlevel/sdcAlarmLevel/import/template')
      },
      exportExcel () {
        let params = {
          ...this.searchForm
        }
        this.$utils.download('/alarm/sdc/scdalarmlevel/sdcAlarmLevel/export', params)
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>
<style lang="scss">
 @import "@/assets/scss/xps.scss";
</style>