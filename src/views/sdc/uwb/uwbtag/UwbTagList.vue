<template>
<basic-container>
  <div>
      <el-form :inline="true" v-show="isSearchCollapse" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
         <el-form-item prop="tagSerial">
                <el-input size="small" v-model="searchForm.tagSerial" placeholder="设备序列号" clearable></el-input>
         </el-form-item>
         <el-form-item prop="tagName">
                <el-input size="small" v-model="searchForm.tagName" placeholder="标签名称" clearable></el-input>
         </el-form-item>
         <el-form-item prop="tagType">
                  <el-select v-model="searchForm.tagType" placeholder="请选择" size="small" style="width: 100%;">
                    <el-option
                      v-for="item in $dictUtils.getDictList('tag_type')"
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
      <!-- <el-form :inline="true" v-show="isImportCollapse"  class="query-form" ref="importForm">
         <el-form-item>
          <el-button type="default" @click="downloadTpl()" size="small">下载模板</el-button>
         </el-form-item>
         <el-form-item prop="loginName">
            <el-upload
              class="upload-demo"
              :action="`${this.$http.BASE_URL}/ips/uwbtag/uwbTag/import`"
              :on-success="uploadSuccess"
               :show-file-list="true">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只允许导入“xls”或“xlsx”格式文件！</div>
            </el-upload>
        </el-form-item>
      </el-form> -->
      <el-row>
        <el-button  type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
        <el-button  type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
         :disabled="dataListSelections.length != 1" plain>修改</el-button>
        <el-button type="danger"   size="small" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0" plain>删除
        </el-button>
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
      v-loading="loading"
      class="table">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
    <el-table-column
        prop="tagSerial"
        show-overflow-tooltip
        sortable="custom"
        label="设备序列号">
      </el-table-column>
    <el-table-column
        prop="tagName"
        show-overflow-tooltip
        sortable="custom"
        label="标签名称">
      </el-table-column>
      <el-table-column
        prop="bindName"
        show-overflow-tooltip
        sortable="custom"
        label="绑定对象名称">
      </el-table-column>
    <el-table-column
        prop="mac"
        show-overflow-tooltip
        sortable="custom"
        label="标签mac地址">
      </el-table-column>
    <el-table-column
        prop="tagType"
        show-overflow-tooltip
        sortable="custom"
        label="标签类型">
        <template slot-scope="scope">
              {{ $dictUtils.getDictLabel("tag_type", scope.row.tagType, '-') }}
        </template>
      </el-table-column>
    <el-table-column
        prop="areaName"
        show-overflow-tooltip
        sortable="custom"
        label="所在区域">
      </el-table-column>
    <el-table-column
        prop="coordinateX"
        show-overflow-tooltip
        sortable="custom"
        label="x坐标">
      </el-table-column>
    <el-table-column
        prop="coordinateY"
        show-overflow-tooltip
        sortable="custom"
        label="y坐标">
      </el-table-column>
    <el-table-column
        prop="coordinateZ"
        show-overflow-tooltip
        sortable="custom"
        label="z坐标">
      </el-table-column>
    <el-table-column
        prop="onlineStatus"
        show-overflow-tooltip
        sortable="custom"
        label="在线状态">
        <template slot-scope="scope">
              {{ $dictUtils.getDictLabel("device_status", scope.row.onlineStatus, '-') }}
        </template>
      </el-table-column>
    <!-- <el-table-column
        prop="enableStatus"
        show-overflow-tooltip
        sortable="custom"
        label="启用状态">
        <template slot-scope="scope">
              {{ $dictUtils.getDictLabel("enable_status", scope.row.enableStatus, '-') }}
        </template>
      </el-table-column> -->
    <!-- <el-table-column
        prop="remarks"
        show-overflow-tooltip
        sortable="custom"
        label="备注信息">
      </el-table-column> -->
      <el-table-column
        header-align="center"
        align="center"
        fixed="right"
        width="250"
        label="操作">
        <template  slot-scope="scope">
          <el-button type="text" v-show="scope.row.bindType == null?true:false" icon="el-icon-view" size="small" @click="bind(scope.row.id)">绑定</el-button>
          <el-button type="text" v-show="scope.row.bindType != null?true:false" icon="el-icon-view" size="small" @click="unbind(scope.row.id)">解绑</el-button>
          <el-button type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
          <el-button v-show="scope.row.bindType == null?true:false" type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>
          <el-button v-show="scope.row.bindType == null?true:false" type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>
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
    <UwbTagForm  ref="uwbTagForm" @refreshDataList="refreshList"></UwbTagForm>
        <!-- 便签绑定 -->
    <UwbTagBindForm  ref="UwbTagBindForm" @refreshDataList="refreshList"></UwbTagBindForm>
  </div>
</basic-container>
</template>

<script>
  import UwbTagForm from './UwbTagForm'  
  import UwbTagBindForm from './UwbTagBindForm'

  export default {
    data () {
      return {
        searchForm: {
          tagSerial: '',
          tagName: '',
          tagType: ''
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
      UwbTagForm,
      UwbTagBindForm
    },
    activated () {
      this.refreshList()
    },
    mounted () {
      this.refreshList();
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/uwb/ips/uwbtag/uwbTag/list',
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
        this.$refs.uwbTagForm.init('add', '')
      },
      // 修改
      edit (id) {
        if(id == null || id == 'undefined'){
            var flag = true
            this.dataListSelections.forEach((item,i) => {
              if(item.bindType != null && item.bindType != 'undefined'){
                flag = false;
                return;
              }
            });
            if(!flag){
              this.$message.error("请解绑后处理!!!")
              return;
            }
        }
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.uwbTagForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.uwbTagForm.init('view', id)
      },
      // 删除
      del (id) {
          if(id == null || id == 'undefined'){
            var flag = true
            this.dataListSelections.forEach((item,i) => {
              if(item.bindType != null && item.bindType != 'undefined'){
                flag = false;
                return;
              }
            });
            if(!flag){
              this.$message.error("请解绑后处理!!!")
              return;
            }
        }

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
            url: '/uwb/ips/uwbtag/uwbTag/delete',
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
        this.$utils.download('/uwb/ips/uwbtag/uwbTag/import/template')
      },
      exportExcel () {
        let params = {
          ...this.searchForm
        }
        this.$utils.download('/uwb/ips/uwbtag/uwbTag/export', params)
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      },
      // 绑定按钮
     bind (id) {
        this.$refs.UwbTagBindForm.init(id)
      },
      unbind (id) {
        this.$http({
              url: `/uwb/ips/uwbtag/uwbTag/deleteTagBindInfo`,
              method: 'post',
              params: {
                'tagId': id
              }
            }).then(({data}) => {
              this.loading = false
              if (data && data.success) {
                this.visible = false
                this.$message.success(data.msg)
                this.refreshList()
              }
            })
      }
    }
  }
</script>
<style lang="scss">
 @import "@/assets/scss/xps.scss";
</style>