<template>
  <div class="user">
    <basic-container>
      <!-- 用户管理页面 -->
      <el-row :span="24" style="position:relative;">
       <!-- <el-col   
          :xs="24"
          :sm="24"
          :md="5"
          class="user__tree">
          <avue-tree
            :option="treeOption"
            :data="treeData"
            @node-click="nodeClick"/>
        </el-col>  -->
        <el-col
          :xs="24"
          :sm="24"
          :md="24"
          class="user__main">
          <!-- <input type="text" name="oldUser" style="display:none">
          <input type="password" name="oldPassword" style="display:none"> -->
          <avue-crud
            ref="crud"
            :option="option"
            v-model="form"
            :page="page"
            :table-loading="listLoading"
            :before-open="handleOpenBefore"
            :data="list"
            :aria-autocomplete="false"
            @on-load="getList"
            @search-change="searchChange"
            @search-reset="searchReset"
            @refresh-change="refreshChange"
            @size-change="sizeChange"
            @current-change="currentChange"
            @row-update="update"
            @row-save="create" @cell-click="cellclick">
            
            <template slot="menuLeft">
              <el-button  @click="handleCreate"
                v-if="sys_user_add"
                class="filter-item"
                type="primary"
                size="mini"
                icon="el-icon-edit"
                >添加
              </el-button>
            </template>
            <template
              slot="username"
              slot-scope="scope">
              <span>{{ scope.row.username }}</span>
            </template>
            <template
              slot="role"
              slot-scope="scope">
              <span
                v-for="(role,index) in scope.row.roleList"
                :key="index">
                <el-tag>{{ role.roleName }} </el-tag>&nbsp;&nbsp;
              </span>
            </template>
            <template
              slot="deptId"
              slot-scope="scope">
              {{ scope.row.deptName }}
            </template>
            <template
              slot="lockFlag"
              slot-scope="scope">
              <el-tag>{{ scope.label }}</el-tag>
            </template>
            <template
              slot="menu"
              slot-scope="scope">
              <el-button
                v-if="sys_user_edit"
                type="text"
                size="mini"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row,scope.index)">编辑
              </el-button>
              <el-button
                v-if="sys_user_del"
                type="text"
                size="mini"
                icon="el-icon-delete"
                :disabled="scope.row.username == 'admin'"
                @click="deletes(scope.row,scope.index)">删除
              </el-button>
            </template>

            <template
              slot="passwordForm"
              slot-scope="scope">
              <div style="position: relative;">
                <span style="color:#F56C6C;position:absolute;left:-54px;top:0;">*</span>
                <avue-input
                autocomplete = "new-password"
                v-model="password"
                type="password"
                placeholder="请输入密码"
                style="margin-bottom:10px;" />
                <tr align="center">
                  <td width="40%" align="right" style="color:#aaa;">密码强度:</td>
                  <td width="20%" id="strength_L" bgcolor="#eeeeee" :style="{'background': Lcolor}">弱</td>  
                  <td width="20%" id="strength_M" bgcolor="#eeeeee" :style="{'background': Mcolor}">中</td>  
                  <td width="20%" id="strength_H" bgcolor="#eeeeee" :style="{'background': Hcolor}">强</td>  
                </tr>
              </div>
            </template>
            <template
              slot="deptIdForm"
              slot-scope="scope">
              <avue-input
                v-model="form.deptId"
                :node-click="getNodeData"
                :dic="treeDeptData"
                :props="defaultProps"
                type="tree"
                placeholder="请选择所属部门"/>
            </template>
            <template
              slot="roleForm"
              slot-scope="scope">
              <avue-select
                v-model="role"
                :dic="rolesOptions"
                :props="roleProps"
                multiple
                placeholder="请选择角色"/>
            </template>

            <!-- <template slot-scope="scope" slot="maxCapacityForm">  
               
                <el-input v-model="scope.row.maxCapacity"    @blur="proving1($event)" ></el-input> 
            </template> -->
            <!-- <template slot-scope="{error}" slot="maxCapacityError">
                <p style="color:red">请输入正确最大磁盘容量值</p>
            </template> -->

            <!-- <template slot-scope="scope" slot="maxProjectSizeForm">
               <el-input v-model="scope.row.maxProjectSize" @blur="proving2($event)"></el-input>
            </template> -->
            <!-- <template slot-scope="{error}" slot="maxProjectSizeError">
                <p style="color:red">请输入正确最大可创工程数量</p>
            </template> -->

            <!-- <template slot-scope="scope" slot="maxGisProjSizeForm">
                <el-input v-model="scope.row.maxGisProjSize" @blur="proving3($event)"></el-input>
            </template> -->
            <!-- <template slot-scope="{error}" slot="maxGisProjSizeError">
                <p style="color:red">请输入正确GIS在线最大工程数量</p>
            </template> -->
          </avue-crud>
        </el-col>
        <el-select 
          v-if="userInfo.username == 'root'"
          v-model="active"
          placeholder="点击请选择租户"
          @change="handleCommand"
          clearable size="small"
          style="position:absolute;right:20%">
          <el-option v-for="tenant in tenantList"
                      :key="tenant.id"
                      :label="tenant.name"
                      :value="tenant.id">
          </el-option>
        </el-select>
      </el-row>
    </basic-container>
  </div>

</template>

<script>
  import request from '@/router/axios'
  import {addObj, delObj, fetchList, putObj} from '@/api/admin/user'
  import {deptRoleList} from '@/api/admin/role'
  import {fetchTree} from '@/api/admin/dept'
  import {tableOption} from '@/const/crud/admin/user'
  import {mapGetters} from 'vuex'

  export default {
    name: 'SysUser',
    data() {
      return {
        maxData:[],
        searchForm: {},
        treeOption: {
          nodeKey: 'id',
          addBtn: false,
          menu: false,
          props: {
            label: 'name',
            value: 'id'
          }
        },
        treeData: [],
        option: tableOption,
        treeDeptData: [],
        checkedKeys: [],
        roleProps: {
          label: 'roleName',
          value: 'roleId'
        },
        defaultProps: {
          label: 'name',
          value: 'id'
        },
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 20, // 每页显示多少条,
          isAsc: false// 是否倒序
        },
        list: [],
        listLoading: true,
        role: [],
        form: {

        },
        rolesOptions: [],
        password: '',
        //密码强度颜色
        Mcolor: '#eeeeee',
        Lcolor: '#eeeeee',
        Hcolor: '#eeeeee',
        tenantList: [],
        active: 1,
        userLoginName: '',
        tenantId: '',
      }
    },
    computed: {
      ...mapGetters(['permissions', 'userInfo'])
    },
    watch: {
      role() {
        this.form.role = this.role
      },
      password(val) {
        this.pwStrength(val);
        this.form.password = '';
        this.form.password = val;
      }
    },
    created() {
      this.sys_user_add = this.permissions['sys_user_add']
      this.sys_user_edit = this.permissions['sys_user_edit']
      this.sys_user_del = this.permissions['sys_user_del']
      this.init()

      this.getTenantList()

      //调角色接口
      this.getNodeData();
    },
    mounted(){
      //默认租户信息为当前用户的租户
      this.tenantId = this.userInfo.tenantId
    },
    methods: {
      checkmaxGisProjSize(){
        if(this.form.maxGisProjSize){
          if(this.form.maxGisProjSize>this.form.maxProjectSize){
            this.form.maxGisProjSize=this.form.maxProjectSize
          }
        }
      },
      init() {
        fetchTree().then(response => {
          this.treeData = response.data.data
        })
      },
      //获取租户信息
      handleCommand (command) {
        this.tenantId = command;
        this.active = command
        if(this.tenantId != 1) {
          this.sys_user_del = false;
        }  
        if(this.tenantId == 1){
          this.sys_user_del = true;
        }
        this.getList(this.page)
      },
      getTenantList () {
        request({
          url: '/admin/tenant/list',
          method: 'get'
        }).then(response => {
          this.tenantList = response.data.data
        })
      },
      nodeClick(data) {
        this.page.page = 1
        this.getList(this.page, {deptId: data.id})
      },
      getList(page, params) {
        this.listLoading = true
        fetchList(Object.assign({
          current: page.currentPage,
          size: page.pageSize,
          tenantId: this.tenantId
        }, params, this.searchForm)).then(response => {
          console.log(response);
          this.list = response.data.data.records
          this.page.total = response.data.data.total
          this.listLoading = false
        })
      },
      getNodeData() {
        deptRoleList(this.tenantId).then(response => {
          this.rolesOptions = response.data.data
        })
      },
      handleDept() {
        fetchTree().then(response => {
          console.log(response);
          this.treeDeptData = response.data.data
          this.form.deptName = this.treeDeptData[0].name
        })
      },
      searchChange(param,done) {
        this.searchForm = param
        this.page.currentPage=1
        this.getList(this.page, param)
        done()
      },
       searchReset() {
        this.searchForm = {}
        this.page.currentPage=1
        this.getList(this.page,this.searchForm)
      },
      sizeChange(pageSize) {
        this.page.pageSize = pageSize
      },
      currentChange(current) {
        this.page.currentPage = current
      },
      refreshChange() {
        this.getList(this.page)
      },

      //添加方法
      handleCreate() {
         this.maxData=[]
        // getMaxData(this.tenantId?this.tenantId:1).then(response => {
        //    console.log('还可以用的资源',response)
        //   this.maxData = [response.data.data[0],response.data.data[1],response.data.data[2]]
        //   console.log(this.maxData)
        //   //alert(this.maxData)
        // })
        // this.form.maxCapacity = 0
        // this.form.maxProjectSize = 0
        this.password = ''
        this.$refs.crud.rowAdd()
      },
      handleOpenBefore(show, type) {
        window.boxType = type
        this.handleDept()
        if (['edit', 'views'].includes(type)) {
          this.role = []
          for (var i = 0; i < this.form.roleList.length; i++) {
            this.role[i] = this.form.roleList[i].roleId
          }
          deptRoleList(this.tenantId).then(response => {
            this.rolesOptions = response.data.data
          })
        } else if (type === 'add') {
          this.role = []
        }
        show()
      },

      //编辑
      handleUpdate(row, index) {
        console.log(row)
        this.$refs.crud.rowEdit(row, index)
        //this.form.password = null
        this.password = ''
      },
      
      //新建保存
      create(row, done, loading) {
        console.log('新建',this.form)
        if (this.form.phone.indexOf('*') > 0) {
          this.form.phone = undefined
        }
        if(this.form.password.length ==0) {
          this.$message.warning("您的密码不能为空");
          loading()
          return false;
        } 
        if(this.form.password.length < 6 || this.form.password.length > 20) {
          this.$message.warning("您的密码长度应在 6 到 20 个字符");
          loading()
          return false;
        } 
        if(this.Lcolor=='#FF0000') {
          this.$message.warning("您的密码强度太弱，请重新输入");
          loading()
          return false;
        }
        if(this.form.maxCapacity){
            if(this.form.maxCapacity>this.maxData[0]){
              if(this.maxData[0]==0){
                 this.$message.warning("当前无可分配磁盘容量");
              }else{
                 this.$message.warning("可用最大磁盘容量不能超过"+this.maxData[0]+"G");
              }
              loading()
              return false;
            }
        }

        if(this.form.maxProjectSize){
            if(this.form.maxProjectSize>this.maxData[1]){
              if(this.maxData[1]==0){
                this.$message.warning("当前无可分配工程");
              }else{
                this.$message.warning("可用最多工程数量不能超过"+this.maxData[1]+"个");
              }
              loading()
              return false;
            }
        }

        if(this.form.maxGisProjSize){
            if(this.form.maxGisProjSize>this.maxData[2]){
              if(this.maxData[2]==0){
                this.$message.warning("当前无可分配GIS在线工程数量");
              }else{
                this.$message.warning("可用GIS在线最大工程数量不能超过"+this.maxData[2]+"个");
              }
              loading()
              return false;
            }
        }
        if(Number(this.form.maxGisProjSize ) > Number( this.form.maxProjectSize)){
            this.$message.warning("GIS在线最大工程数量不能大于最多工程数量");
            loading()
            return false;
        }


        addObj(this.form).then(() => {
          this.getList(this.page)
          done()
          this.$message.success('创建成功')
        }).catch(() => {
          loading()
        })
      },

      //修改方法
      update(row, index, done, loading) {
        console.log('修改',this.form)
        if (this.form.phone && this.form.phone.indexOf('*') > 0) {
          this.form.phone = undefined
        }
        if(!this.password) {
          this.form.password = null
        }
        if(this.form.password) {
          if(this.form.password.length ==0) {
            this.$message.warning("您的密码不能为空");
            loading()
            return false;
          } 
          if(this.form.password.length < 6 || this.form.password.length > 20) {
            this.$message.warning("您的密码长度应在 6 到 20 个字符");
            loading()
            return false;
          } 
          if(this.Lcolor=='#FF0000') {
            this.$message.warning("您的密码强度太弱，请重新输入");
            loading()
            return false;
          }
        }
        // if(this.form.maxCapacity){
        //     if(this.form.maxCapacity>this.maxData[0]){
        //       if(this.maxData[0]==0){
        //         this.$message.warning("当前无可分配磁盘容量");
        //       }else{
        //         this.$message.warning("可用最大磁盘容量不能超过"+this.maxData[0]+"G");
        //       }
        //       loading()
        //       return false;
        //     }
        // }

        // if(this.form.maxProjectSize){
        //   if(this.form.maxProjectSize>this.maxData[1]){
        //     if(this.maxData[1]==0){
        //       this.$message.warning("当前无可分配工程");
        //     }else{
        //       this.$message.warning("可用最多工程数量不能超过"+this.maxData[1]+"个");
        //     }
                
        //     loading()
        //     return false;
        //   }
        // }

        // if(this.form.maxGisProjSize){
        //     if(this.form.maxGisProjSize>this.maxData[2]){
        //       if(this.maxData[2]==0){
        //         this.$message.warning("当前无可分配GIS在线工程数量");
        //       }else{
        //         this.$message.warning("可用GIS在线最大工程数量不能超过"+this.maxData[2]+"个");
        //       }
        //       loading()
        //       return false;
        //     }
        // }
        // //console.log(this.form.maxGisProjSize,this.form.maxProjectSize)
        // if(Number(this.form.maxGisProjSize) >Number(this.form.maxProjectSize) ){
        //     this.$message.warning("GIS在线最大工程数量不能大于最多工程数量");
        //     loading()
        //     return false;
        // }
        // console.log(this.form)
        putObj(this.form).then(res => {
          if(res.data.code==0){
            this.getList(this.page)
            done()
            this.$message.success('修改成功')
          }else{
            this.$message.error(res.data.msg)
          }
        }).catch(() => {
          loading()
        })
      },
      //单元格点击触发事件
      cellclick(row,col,cell,e){
       // console.log('点击单元',row)
        getMaxData(row.tenantId).then(response => {
          console.log('最大',response)
          //this.maxData = [response.data.data[0],response.data.data[1],response.data.data[2]]
          this.maxData = [response.data.data[0]+row.maxCapacity,response.data.data[1]+row.maxProjectSize,response.data.data[2]+row.maxGisProjSize]
          console.log(this.maxData )
       })
      
      },
      deletes(row, index) {
        this.$confirm('此操作将永久删除该用户(用户名:' + row.username + '), 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          delObj(row.userId)
            .then(() => {
              this.list.splice(index, 1)
              this.$message.success('删除成功')
            }).catch(() => {
              this.$message.error('删除失败')
            })
        })
      },
      //判断输入密码的类型  
    CharMode(iN){  
        if (iN>=48 && iN <=57) //数字  
            return 1;  
        if (iN>=65 && iN <=90) //大写  
            return 2;  
        if (iN>=97 && iN <=122) //小写  
            return 4;  
        else  
            return 8;   
    },
    //bitTotal函数  
    //计算密码模式  
    bitTotal(num){  
        var modes=0;  
        for (var i=0;i<4;i++){  
            if (num & 1) modes++;  
            num>>>=1;  
        }
        return modes;  
    },
    //返回强度级别  
    checkStrong(sPW){  
        if (sPW.length<6)  
            return 0; //密码太短，不检测级别
        var Modes=0;  
        for (var i=0;i<sPW.length;i++){  
            //密码模式  
            Modes|=this.CharMode(sPW.charCodeAt(i));  
        }
        return this.bitTotal(Modes);  
    },
  
    //显示颜色  
    pwStrength(pwd){  
        var Dfault_color="#eeeeee";        //默认颜色
        var L_color="#FF0000";        //低强度的颜色，且只显示在最左边的单元格中
        var M_color="#FF9900";        //中等强度的颜色，且只显示在左边两个单元格中
        var H_color="#33CC00";        //高强度的颜色，三个单元格都显示
        //var Lcolor,Hcolor,Mcolor;
        if (pwd==null||pwd==''){  
            this.Lcolor=this.Mcolor=this.Hcolor=Dfault_color;
        }  
        else{  
            var S_level=this.checkStrong(pwd);  
            switch(S_level) {  
            case 0:  
                this.Lcolor=this.Mcolor=this.Hcolor=Dfault_color;
                break;
            case 1:  
                this.Lcolor=L_color;
                this.Mcolor=this.Hcolor=Dfault_color;
                break;  
            case 2:  
                this.Lcolor=this.Mcolor=M_color;  
                this.Hcolor=Dfault_color;  
                break;  
            default:  
                this.Lcolor=this.Mcolor=this.Hcolor=H_color;  
            }  
        }
      },

      //校验最大磁盘容量
      proving1(event){
       var val =event.target.value;
        var regu =/^[+]{0,1}(\d+)$/;
        if (!regu.test(val)) {                             //^[0-9]+(\.[0-9]{1,9})?$
          this.$message.warning('最大磁盘容量请输入数字值！');
          event.target.value = '';
          this.form.maxCapacity=''
        }
      },
      //校验最多工程数量
      proving2(event){
       var val =event.target.value;
        var regu = /^[+]{0,1}(\d+)$/;
        if (!regu.test(val)) {                             //^[0-9]+(\.[0-9]{1,9})?$
          this.$message.warning('最多工程数量请输入正整数！');
          event.target.value = '';
          this.form.maxProjectSize=''
        }
      },

      //校验GIS在线最大工程数量
      proving3(event){
       var val =event.target.value;
        var regu = /^[+]{0,1}(\d+)$/;
        if (!regu.test(val)) {                             //^[0-9]+(\.[0-9]{1,9})?$
          this.$message.warning('GIS在线最大工程数量请输入正整数！');
          event.target.value = '';
          this.form.maxGisProjSize=''
        }
      },


    }
  }
</script>
<style lang="scss">
  .user {
    height: 100%;

    &__tree {
      padding-top: 3px;
      padding-right: 20px;
    }

    &__main {
      .el-card__body {
        padding-top: 0;
      }
    }
  }
</style>
