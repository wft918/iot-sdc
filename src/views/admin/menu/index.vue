<template>
  <basic-container>
    <div style="position:relative;">
      <avue-crud :option="option"
                :data="data"
                ref="crud"
                v-model="form"
                :permission="permissionList"
                :before-open="beforeOpen"
                @row-del="rowDel"
                @row-update="rowUpdate"
                @row-save="rowSave"
                @tree-load="treeLoad">
        <template slot-scope="scope"
                  slot="icon">
          <div style="text-align:center">
            <i :class="scope.row.icon"></i>
          </div>
        </template>
        <template slot-scope="scope"
                  slot="type">
          <div style="text-align:center">
            <el-tag v-if="scope.row.type !== '1'" size="small" type="success">菜单</el-tag>
            <el-tag v-else-if="scope.row.type === '1'" size="small" type="info">按钮</el-tag>
          </div>
        </template>
      </avue-crud>
      <el-select 
        v-if="userInfo.username == 'root'"
        v-model="active"
        placeholder="点击请选择租户"
        @change="handleCommand"
        clearable size="small"
        style="position:absolute;right:20%;top:0;">
        <el-option v-for="tenant in tenantList"
                    :key="tenant.id"
                    :label="tenant.name"
                    :value="tenant.id">
        </el-option>
      </el-select>
    </div>
  </basic-container>
</template>

<script>
  import request from '@/router/axios'
  import {addObj, delObj, fetchMenuTree, getObj, putObj} from '@/api/admin/menu'
  import { validatenull } from '@/util/validate'
  import {mapGetters} from "vuex";
  import {tableOption} from '@/const/crud/admin/menu'

  export default {
    data() {
      return {
        form: {},
        option: tableOption,
        lazy:true,
        data: [],
        tenantList: [],
        // active: 1,
        active: '',
        tenantId: '',
      };
    },
    created() {
      this.onLoad()
      this.getTenantList()
    },
    watch: {
      'form.type'() {
        this.showHide()
      }
    },
    computed: {
      ...mapGetters(["permissions", "userInfo"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permissions.sys_menu_add, false),
          delBtn: this.vaildData(this.permissions.sys_menu_del, false),
          editBtn: this.vaildData(this.permissions.sys_menu_edit, false)
        };
      }
    },
    methods: {
      rowSave(row,done,loading) {
        if (validatenull(row.parentId)){
          row.parentId = -1
        }
        addObj(row).then(() => {
          done()
          this.onLoad();
          this.$message.success("添加成功");
        });
      },
      rowUpdate(row,index, done,loading) {
        if (validatenull(row.parentId)){
          row.parentId = -1
        }
        putObj(row).then(() => {
          done()
          this.onLoad();
          this.$message.success("修改成功");
        });
      },
      rowDel(row) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          return delObj(row.id);
        }).then(() => {
          this.onLoad();
          this.$message.success("删除成功");
        });
      },
      beforeOpen(done, type) {
        if (["edit", "view"].includes(type)) {
          getObj(this.form.id).then(res => {
            this.form = res.data.data;
          });
        }
        done();
      },
      onLoad() {
        fetchMenuTree(this.option.lazy, '', this.tenantId).then(res => {
          this.data = res.data.data;
        });
      },
      treeLoad(node, child, resolve){
        fetchMenuTree(this.option.lazy, node.id, this.tenantId).then(res => {
          resolve(res.data.data)
        })
      },
      showHide(){
        this.$refs.crud.option.column.filter(item => {
          // 不是按钮类型 要输入path
          if (item.prop === "path") {
            item.addDisplay = this.form.type !== "1"
            item.editDisplay = this.form.type !== "1"
          }
          // 不是按钮类型 要输入path
          if (item.prop === "icon") {
            item.addDisplay = this.form.type !== "1"
            item.editDisplay = this.form.type !== "1"
          }

          // 是按钮类型输入code
          if (item.prop === "code") {
            item.addDisplay = this.form.type === "1"
            item.editDisplay = this.form.type === "1"
          }

          // 是按钮类型输入code
          if (item.prop === "code") {
            item.addDisplay = this.form.type === "1"
            item.editDisplay = this.form.type === "1"
          }

          // 是顶部菜单不显示上级菜单
          if (item.prop === "parentId") {
            item.addDisplay = this.form.type !== "2"
            item.editDisplay = this.form.type !== "2"
          }

          // 是按钮类型输入 上级菜单
          if (item.prop === "parentId") {
            item.rules[0].required = this.form.type === "1"
          }
        });
      },
      //获取租户信息
      handleCommand (command) {
        //this.getList(this.page, {tenantId: command})
        this.tenantId = command;
        // this.active = command
        if(this.tenantId != 1) {
          this.option.editBtn = false;
          this.option.delBtn = false;
        }  
        if(this.tenantId == 1){
          this.option.editBtn = true;
          this.option.delBtn = true;
        }
        this.onLoad();
      },
      getTenantList () {
        request({
          url: '/admin/tenant/list',
          method: 'get'
        }).then(response => {
          this.tenantList = response.data.data
        })
      },
    }
  };
</script>

<style>
</style>
