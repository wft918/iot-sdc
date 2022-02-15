<template>
<div>
  <basic-container>
      <el-form :inline="true" v-show="isSearchCollapse" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
         <el-form-item prop="alarmName">
                  <el-select size="small" v-model="searchForm.alarmName" placeholder="请选择"  style="width: 100%;">
                    <el-option
                      v-for="item in $dictUtils.getDictList('alarm_param_name')"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
         </el-form-item>
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
              :action="`${this.$http.BASE_URL}/sdc/sdcalarmsetting/sdcAlarmSetting/import`"
              :on-success="uploadSuccess"
               :show-file-list="true">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只允许导入“xls”或“xlsx”格式文件！</div>
            </el-upload>
        </el-form-item>
      </el-form>
      <el-row>
        <el-button  type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
        <el-button  type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
         :disabled="dataListSelections.length != 1" plain>修改</el-button>
        <el-button  type="danger"   size="small" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0" plain>删除
        </el-button>
        <el-button-group class="pull-right">
            <el-button
              type="default"
              size="small"
              icon="el-icon-search"
              @click="isSearchCollapse = !isSearchCollapse, isImportCollapse=false">
            </el-button>
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
      @selection-change="selectionChangeHandle"
      @sort-change="sortChangeHandle"
      v-loading="loading"
      size="medium"
      class="table"> 
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
    <el-table-column header-align="center"
        prop="alarmName"
        show-overflow-tooltip
        sortable="custom"
        label="告警名称">
      </el-table-column>
      <el-table-column header-align="center"
        prop="devicetypeName"
        show-overflow-tooltip
        sortable="custom"
        label="适用设备类型">
      </el-table-column>
      <el-table-column header-align="center"
        prop="noticeUserNames"
        show-overflow-tooltip
        sortable="custom"
        label="通知人员">
      </el-table-column>
      <el-table-column align="center"
        prop="createDate"
        show-overflow-tooltip
        sortable="custom"
        label="创建时间">
      </el-table-column>
    <el-table-column header-align="center"
        prop="remarks"
        show-overflow-tooltip
        sortable="custom"
        label="备注信息">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="250"
        label="操作">
        <template  slot-scope="scope">
          <el-button type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
          <el-button type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>
          <el-button type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>
          <el-button type="text"  icon="el-icon-delete" size="small" @click="selectDevice(scope.row.id,scope.row.devicetype)">选择设备</el-button>
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
        <!-- 弹窗, 新增 / 修改 -->
    <SdcAlarmSettingForm  ref="sdcAlarmSettingForm" @refreshDataList="refreshList"></SdcAlarmSettingForm>    
    <SdcDeviceList  ref="SdcDeviceList" @refreshDataList="refreshList"></SdcDeviceList>
  </basic-container>
</div>
</template>

<script>
  import SdcAlarmSettingForm from './SdcAlarmSettingForm'
  import SdcDeviceList from './SdcDeviceList'
  export default {
    data () {
      return {
        searchForm: {
          alarmName: '',
        },
        dataList: [],
        pageNo: 1,
        pageSize: 10,
        visible: false,
        title: '',
        total: 0,
        orderBy: '',
        dataListSelections: [],
        isSearchCollapse: false,
        isImportCollapse: false,
        loading: false
      }
    },
    components: {
      SdcAlarmSettingForm,
      SdcDeviceList
    },
    activated () {  
      this.refreshList();
    },
    created () {  
      this.refreshList();
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/alarm/sdc/sdcalarmsetting/sdcAlarmSetting/list',
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
        this.$refs.sdcAlarmSettingForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.sdcAlarmSettingForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.sdcAlarmSettingForm.init('view', id)
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
            url: '/alarm/sdc/sdcalarmsetting/sdcAlarmSetting/delete',
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
      selectDevice(setiingId,devicetype){
        this.$refs.SdcDeviceList.init(setiingId, devicetype)
      },
      // 表单提交
      saveBySameDeviceType () {
        this.$confirm(`统一设置会覆盖已存在告警设置，请再次确认！?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.loading = true
            this.$http({
              url: `/sdc/sdcalarmsetting/sdcAlarmSetting/saveBySameDeviceType`,
              method: 'post',
              params: {'deviceId': this.searchForm.deviceId}
            }).then(({data}) => {
              this.loading = false
              if (data && data.success) {
                this.$message.success(data.msg)
                this.loading = false
              }
            })
        })
      },
     // 查看详情
      detail (row) {
        this.$http.get(`/sdc/sdcalarmsetting/sdcAlarmSetting/queryById?id=${row.id}`).then(({data}) => {
          this.dataList.forEach((item, index) => {
            if (item.id === row.id) {
              item.sdcAlarmSettingListList = data.sdcAlarmSetting.sdcAlarmSettingListList
            }
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
        this.$utils.download('/sdc/sdcalarmsetting/sdcAlarmSetting/import/template')
      },
      exportExcel () {
        let params = {
          ...this.searchForm
        }
        this.$utils.download('/sdc/sdcalarmsetting/sdcAlarmSetting/export', params)
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