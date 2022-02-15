<template>
  <div>
    <basic-container>
    <el-row>
      <el-button type="primary" icon="el-icon-plus" size="small" @click="add()">新增</el-button>
      </el-row>
     <el-table
      :data="dataList"
      border
      stripe
      row-key="id"
      isBigData
      max-height="1200"
      istable
      v-loading="loading"
      class="table">
      <el-table-column
        prop="name"
        align="left"
        header-align="center"
        label="区域名称"> 
        <!-- <template slot-scope="scope">
          <el-link  type="primary" :underline="false"  @click="edit(scope.row.id)">{{scope.row.name}}</el-link>
          <el-link  type="primary" :underline="false"   @click="view(scope.row.id)">{{scope.row.name}}</el-link>
          <span v-else>{{scope.row.name}}</span>
        </template> -->
       </el-table-column>
      <el-table-column
        prop="code"
        label="区域编码">
      </el-table-column>
      <el-table-column
        prop="type"
        label="区域类型"> 
        <!-- <template slot-scope="scope">
          {{$dictUtils.getDictLabel("sys_area_type", scope.row.type)}}
        </template> -->
       </el-table-column>
      <el-table-column
        prop="sort"
        label="排序号">
      </el-table-column>
      <el-table-column
        prop="remarks"
        label="备注">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="300"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small"  icon="el-icon-view" @click="view(scope.row.id)">查看</el-button>
          <el-button  type="text" size="small" icon="el-icon-edit" @click="edit(scope.row.id)">修改</el-button>
          <el-button  type="text" size="small" icon="el-icon-delete" @click="del(scope.row.id)">删除</el-button>
          <el-button  type="text" size="small" icon="el-icon-circle-plus-outline" @click="addChild(scope.row.id, scope.row.name)">添加下级区域</el-button>
        </template>
      </el-table-column>
    </el-table> 
    <!-- 弹窗, 新增 / 修改 -->
    <AreaForm ref="areaForm" @refreshDataList="refreshList"></AreaForm>  
    </basic-container>
  </div>
</template>

<script>
  import AreaForm from './AreaForm'
  import request from '@/router/axios'  
  export default {
    data () {
      return {
        loading: false,
        dataList: []
      }
    },
    components: {
      AreaForm
    },
    created () {
       this.refreshList()
    },
    activated () {
       this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        request({
          url: '/admin/area/treeData',
          method: 'get',    
          params: {}
        }).then(response => {
          this.dataList = response.data.data
          this.loading = false
        })
      },
      // 新增下级
      addChild (id, name) {
         this.$refs.areaForm.init('addChild', {id: '', parent: {id: id, name: name}})
      },
       // 新增
      add () {
         this.$refs.areaForm.init('add', {id: '', parent: {id: '', name: ''}})
      },
      // 修改
      edit (id) {
         this.$refs.areaForm.init('edit', {id: id, parent: {id: '', name: ''}})
      },
      // 查看
      view (id) {
         this.$refs.areaForm.init('view', {id: id, parent: {id: '', name: ''}})
      },
      // 删除
      del (id) {
        this.$confirm(`确定删除该记录吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          request({
            url: '/admin/area/delete',
            method: 'delete',    
            params: {id: id}
          }).then(response => {
            this.dataList = response.data.data
            this.loading = false
             if ("0" == response.data.code) {
              this.$message({
                message: response.data.msg,
                type: 'success',
                duration: 1500
              })
              this.refreshList()
            }
          })
        })
      }
    }
  }
</script>
