<template>
  <div class="execution">
    <basic-container>
      <!-- 租户管理页面 -->
      <avue-crud id="tenantClass"
        ref="crud"
        :page="page"
        :data="tableData"
        :permission="permissionList"
        :table-loading="tableLoading"
        :option="tableOption"
        v-model="form"
        @on-load="getList"
        @search-change="searchChange"
        @search-reset="searchReset"
        @refresh-change="refreshChange"
        @size-change="sizeChange"
        @current-change="currentChange"
        @row-update="update"
        @row-save="handleSave">
        <template
          slot="menu"
          slot-scope="scope">
          <el-button
            v-if="roleManager_btn_edit"
            type="text"
            size="mini"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row,scope.index)">编辑
          </el-button>
          <el-button
            v-if="roleManager_btn_del"
            type="text"
            size="mini"
            icon="el-icon-delete"
            @click="rowDel(scope.row,scope.index)">删除
          </el-button>
          <el-button
            v-if="roleManager_btn_perm "
            type="text"
            size="mini"
            icon="el-icon-plus"
            :disabled="scope.row.id == 1"
            @click="handlePermission(scope.row,scope.index)">权限
          </el-button>
        </template>
        <!-- <template slot-scope="scope" slot="maxCapacityForm">
           <el-input v-model="scope.row.maxCapacity" @blur="proving1($event)"   ></el-input> 
            <el-input-number v-model="form.maxCapacity" :max="99999" :min="0" @change="checkType()"></el-input-number>
        </template> -->
        <!-- <template slot-scope="{error}" slot="maxCapacityError">
            <p style="color:red">请输入最大磁盘容量</p>
        </template>
        <template slot-scope="scope" slot="maxProjectSizeForm">
            <el-input v-model="scope.row.maxProjectSize" @blur="proving2($event)"></el-input>
             <el-input-number v-model="form.maxProjectSize" :max="99999" :min="0" @change="checkmaxGisProjSize()"></el-input-number> 
        </template>
        <template slot-scope="{error}" slot="maxProjectSizeError">
            <p style="color:red">请输入正确最多工程数量</p>
        </template>
        <template slot-scope="scope" slot="maxGisProjSizeForm">
          <el-input v-model="scope.row.maxGisProjSize" @blur="proving3($event)"></el-input>
             <el-input-number v-model="form.maxGisProjSize" :max="form.maxProjectSize" :min="0"></el-input-number>
        </template>
        <template slot-scope="{error}" slot="maxGisProjSizeError">
            <p style="color:red">请输入正确GIS在线最大工程数量</p>
        </template> -->
      </avue-crud>
    </basic-container>
    <el-dialog
      :visible.sync="dialogPermissionVisible"
      :close-on-click-modal="false"
      title="分配权限">
      <div class="dialog-main-tree">
      <el-tree
        ref="menuTree"
        :data="treeData"
        :default-checked-keys="checkedKeys"
        :check-strictly="false"
        :props="defaultProps"
        :filter-node-method="filterNode"
        class="filter-tree"
        node-key="id"
        highlight-current
        show-checkbox
        default-expand-all/>
      </div>
      <div slot="footer"
        class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          @click="updatePermession(roleId)" :loading="permissionLoading">更 新
        </el-button>
        <el-button
	        type="default"
          size="small"
          @click="cancal()">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {addObj, delObj, fetchList, putObj, permissionUpd} from '@/api/admin/tenant'
  import {fetchRoleTree, getRoleId} from '@/api/admin/role'
  import {getPermissionShow} from '@/api/admin/tenant'
  import {fetchMenuTree } from '@/api/admin/menu'
  import {tableOption} from '@/const/crud/admin/tenant'
  import {mapGetters} from 'vuex'
  import { getStore } from '@/util/store'

  export default {
    name: 'Tenant',
    data() {
      return {
        tableData: [],
        searchForm: {},
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 20 // 每页显示多少条
        },
        tableLoading: false,
        tableOption: tableOption,
        roleManager_btn_edit: false,
        roleManager_btn_del: false,
        roleManager_btn_perm: false,
        //权限
        dialogPermissionVisible: false,
        //租户Id赋值
        roleId: undefined,
        //roleId赋值
        getRoleId: '',
        roleCode: undefined,
        treeData: [],
        checkedKeys: [],
        checkedDsScope: [],
        defaultProps: {
          label: 'name',
          value: 'id'
        },
        menuIds: '',
        permissionLoading: false,
        form: {},
      }
    },
    computed: {
      ...mapGetters(['permissions']),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permissions.admin_systenant_add, false),
          delBtn: this.vaildData(this.permissions.admin_systenant_del, false),
          editBtn: this.vaildData(this.permissions.admin_systenant_edit, false)
        }
      }
    },
    methods: {
       //校验最大磁盘容量
      // proving1(event){
      //  var val =event.target.value;
      //   var regu = /^[+]{0,1}(\d+)$/;
      //   if (!regu.test(val)) {                             //^[0-9]+(\.[0-9]{1,9})?$
      //     this.$message.warning('最大磁盘容量请输入正整数字值！');
      //     event.target.value = '';
      //     this.form.maxCapacity=''
      //   }
      // },
      //  //校验最多工程数量
      // proving2(event){
      //  var val =event.target.value;
      //   var regu = /^[+]{0,1}(\d+)$/;
      //   if (!regu.test(val)) {                             //^[0-9]+(\.[0-9]{1,9})?$
      //     this.$message.warning('最多工程数量请输入正整数字值！');
      //     event.target.value = '';
      //     this.form.maxProjectSize=''
      //   }
      // },

      // //校验GIS在线最大工程数量
      // proving3(event){
      //  var val =event.target.value;
      //   var regu = /^[+]{0,1}(\d+)$/;
      //   if (!regu.test(val)) {                             //^[0-9]+(\.[0-9]{1,9})?$
      //     this.$message.warning('GIS在线最大工程数量请输入正整数字值！');
      //     event.target.value = '';
      //     this.form.maxGisProjSize=''
      //   }
      // },
      // checkmaxGisProjSize(){
      //   if(this.form.maxGisProjSize){
      //     if(this.form.maxGisProjSize>this.form.maxProjectSize){
      //       this.form.maxGisProjSize=this.form.maxProjectSize
      //     }
      //   }
      // },
      getList(page, params) {
        this.tableLoading = true
        fetchList(Object.assign({
          current: page.currentPage,
          size: page.pageSize
        }, params, this.searchForm)).then(response => {
          this.tableData = response.data.data.records
          this.page.total = response.data.data.total
          this.tableLoading = false
        }).catch(() => {
          this.tableLoading = false
        })
      },
      rowDel: function (row, index) {
        // console.log(this.page)
        var _this = this
        this.$confirm('是否确认删除ID为' + row.id, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return delObj(row.id)
        }).then(data => {
          _this.$message.success('删除成功')
          const totalPage = Math.ceil((_this.page.total - 1)  / _this.page.pageSize) // 总页数
          _this.page.currentPage = _this.page.currentPage > totalPage ? totalPage : _this.page.currentPage
          _this.page.currentPage = _this.page.currentPage < 1 ? 1 : _this.page.currentPage
             _this.getList( _this.page)
        })
      },
      // handleUpdate: function (row, index, done, loading) {
      //   putObj(row).then(data => {
      //     this.$message.success('修改成功')
      //     done()
      //     this.getList(this.page)
      //   }).catch(() => {
      //     loading()
      //   })
      // },
      handleUpdate(row, index) {
        this.$refs.crud.rowEdit(row, index)
      },

      update(row, index, done, loading) {
        putObj(row).then((res) => {
          if(res.data.code==0){
               this.getList(this.page)
              done()
             this.$message.success('修改成功')
          }else{
            this.$message.error(res.data.msg)
          }
        }).catch((err) => {
           loading()
        })
      },

      handleSave: function (row, done, loading) {
        addObj(row).then(data => {
          this.$message.success('添加成功')
          done()
          this.getList(this.page)
        }).catch(() => {
          loading()
        })
      },
      searchChange(form, done) {
        this.searchForm = form
        this.page.currentPage=1
        this.getList(this.page, form)
        done()
      },
      searchReset() {
        this.searchForm = {}
        this.page.currentPage=1
        this.getList(this.page,this.searchForm)
      },
      refreshChange() {
        this.getList(this.page)
      },
      sizeChange(pageSize) {
        this.page.pageSize = pageSize
      },
      currentChange(current) {
        this.page.currentPage = current
      },
      cancal () {
        this.dialogPermissionVisible = false;
      },
      //添加权限
      handlePermission(row) {
        // console.log(row)
        getRoleId(row.id).then(res => {
          if(res.data.code == 0) {
            this.getRoleId = res.data.data.roleId
            // console.log(this.getRoleId)
            getPermissionShow(this.getRoleId, row.id)
            .then(response => {
              this.checkedKeys = response.data.data
              return fetchMenuTree()
            })
            .then(response => {
              this.treeData = response.data.data
              // console.log("选中",this.checkedKeys)
              // this.checkedKeys = [...this.checkedKeys, ...this.checkedKeys]
              // 解析出所有的太监节点
              this.checkedKeys = this.resolveAllEunuchNodeId(this.treeData, this.checkedKeys, [])
              this.dialogPermissionVisible = true
              //租户Id
              this.roleId = row.id
              // this.roleCode = row.roleCode
            })
          }
        })
        
      },
      /**
         * 解析出所有的太监节点id
         * @param json 待解析的json串
         * @param idArr 原始节点数组
         * @param temp 临时存放节点id的数组
         * @return 太监节点id数组
         */
      resolveAllEunuchNodeId(json, idArr, temp) {
        for (let i = 0; i < json.length; i++) {
          const item = json[i]
          // 存在子节点，递归遍历;不存在子节点，将json的id添加到临时数组中
          if (item.children && item.children.length !== 0) {
            this.resolveAllEunuchNodeId(item.children, idArr, temp)
          } else {
            temp.push(idArr.filter(id => id === item.id))
          }
        }
        return temp
      },
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      getNodeData(data, done) {
        done()
      },
      updatePermession (roleId) {
        this.permissionLoading = true
        this.menuIds = ''
        this.menuIds = this.$refs.menuTree.getCheckedKeys().join(',').concat(',').concat(this.$refs.menuTree.getHalfCheckedKeys().join(','))
        this.menuIds = this.menuIds.split(",").map(Number);
        // console.log(this.menuIds)
        permissionUpd(roleId, this.menuIds).then((res) => {
            this.dialogPermissionVisible = false
            this.$store.dispatch('GetMenu', {type:false})
            if(res.data.code == 0) {
              this.$message.success('修改成功')
              this.permissionLoading = false
            }
            if(res.data.code == 1) {
              this.$message.warning(res.data.data.msg);
              this.permissionLoading = false
              return;
            }
        })
      }
    },
    created() {
      this.roleManager_btn_edit = this.permissions['sys_role_edit']
      this.roleManager_btn_del = this.permissions['sys_role_del']
      this.roleManager_btn_perm = this.permissions['sys_role_perm']

      const TENANT_ID = getStore({ name: 'tenantId' })
      // console.log(TENANT_ID)

    },
  }
</script>
<style lang="scss" scoped>
  
  .el-dialog__wrapper {
  .el-dialog {
    width: 61% !important;
  .dialog-main-tree {
    max-height: 400px;
    overflow-y: auto;
  }
  }
  .el-form-item__label {
    width: 20% !important;
    padding-right: 20px;
  }
  .el-form-item__content {
    margin-left: 20% !important;
  }
  }
</style>
<style lang="scss">
  .avue-form__line{
    display: none;//莫名的空格，全局修改
  }
</style>