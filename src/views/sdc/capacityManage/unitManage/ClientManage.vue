<template>
  <basic-container>
    <el-row>
      <el-col :span="6">
        <span>客户名称：</span>
        <el-input placeholder="请输入客户名称" v-model="clientName" clearable style="width: 70%"></el-input>
      </el-col>
      <el-col :span="4"> 
        <el-button type="primary" icon="el-icon-search" size="small" @click="searchClient" class="search-btn">查询</el-button>
        <el-button type="primary" icon="el-icon-refresh" size="small" @click="refreshList" class="search-btn">重置</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="23">
        <el-button 
          type="primary" 
          icon="el-icon-plus" 
          size="small" 
          @click="addClick" 
          class="add-btn">新增</el-button>
      </el-col>
      <el-col :span="1">
        <el-tooltip effect="dark" content="显隐" placement="top">
          <el-button circle="" @click="chooseColumn" size="small" icon="el-icon-menu"></el-button>
        </el-tooltip>
      </el-col>
    </el-row>
    <el-table 
      :data="personTable" 
      border
      row-key="id" 
      style="margin: 0.75rem 0"
      :empty-text="personEmptyText"
      ref="personReTableRef">
    >
      <el-table-column
        type="index"
        label="序号"
        width="50"
        align="center"
        sortable
      ></el-table-column>
      <el-table-column
        v-if="columnList[0].show"
        prop="name"
        label="客户名称"
        align="center"
      >
        <template slot-scope="scope">
          <el-link :underline="false" type="primary" @click="tableAction(scope.row, 2)">{{scope.row.name}}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        v-if="columnList[1].show"
        prop="contract"
        label="联系人"
        align="center"
      >
      </el-table-column>
      <el-table-column
        v-if="columnList[2].show"
        prop="phone"
        label="联系电话"
        align="center"
      >
      </el-table-column>
      <el-table-column
        v-if="columnList[3].show"
        prop="updateBy"
        label="修改人"
        align="center"
      >
      </el-table-column>
      <el-table-column
        v-if="columnList[4].show"
        prop="updateDate"
        label="修改时间"
        align="center"
      >
      </el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template slot-scope="scope">
          <span class="table-action" @click="tableAction(scope.row, 2)">编辑</span>
          <span class="table-action" @click="tableAction(scope.row, 3)">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :page="personPageInfo.page"
      :size="personPageInfo.size"
      :total="personPageInfo.total"
      :key="personPageKey"
      @pagination="personQueryByPage"
    ></Pagination>
    <!-- 新增编辑对话框 -->
    <el-dialog
      :visible.sync="formDialogVisible"
      width="30%"
      ref="formDialogRef"
      :close-on-click-modal="false"
      @closed="refreshData"
      :title="dialogTitle"
    >
      <el-form
        :model="inputForm"
        label-width="120px"
        :rules="inputFormRules"
        ref="inputFormRef"
        :key="inputFormKey"
      >
        <el-form-item label="客户名称" prop="name">
          <el-input v-model="inputForm.name"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="contract">
          <el-input v-model="inputForm.contract"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="inputForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="inputForm.remarks"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <template>
          <el-button @click="formDialogVisible = false" size="small"
            >取消</el-button
          >
          <el-button type="primary" @click="submitForm" size="small"
            >保存</el-button
          >
        </template>
      </span>
    </el-dialog>
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
import _ from 'lodash'
import { getClientList, addClient, editClient, deleteClient } from "@/api/sdc/capacityManage";
export default {
  components: {
    Pagination
  },
  data() {
    // 表单验证规则
    var checkPhone = (rule, value, callback) => {
            const regPhone = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/;
            if (regPhone.test(value)) {
                return callback();
            }
            callback(new Error('请输入正确的联系方式'));
        }
    return {
      clientName: null,
      // 新增编辑对话框
      formDialogVisible: false,
      dialogTitle: '',
      // 表单相关
      actionType: 0,
      inputForm: {
        contract: null,
        phone: null,
        remarks: null
      },
      inputFormRules: {
        name: [
          {required: true, message: '请输入客户名', trigger: 'blur'}
        ],
        phone: [
          { validator: checkPhone, trigger: 'blur' }
        ]
      },
      inputFormKey: Math.random().toString(36).slice(-6),
      personTable: [],
      personEmptyText: '数据加载中...',
      personPageInfo: {
        page: 1,
        size: 10,
        total: 0
      },
      personPageKey: Math.random().toString(36).slice(-6), 
      //查询条件
      clickQueryCondition: {},
      pageQueryCondition: {},
      columnList: [
        {
          prop: 'name',
          label: '客户名称',
          show: true
        },
        {
          prop: 'contract',
          label: '联系人',
          show: true
        },
        {
          prop: 'phone',
          label: '联系电话',
          show: true
        },
        {
          prop: 'updateBy',
          label: '修改人',
          show: true
        },
        {
          prop: 'updateDate',
          label: '修改时间',
          show: true
        }
      ],
      dialogColumnVisible: false  
    }
  },
  computed: {
    },
    watch: {},
    created() {
      this._getClientList(this.personPageInfo.page, this.personPageInfo.size)
    },
    methods: {
      /**
       * 网络请求
       */
      _getClientList(page, size, contract) {
        getClientList(page, size, contract).then(res => {
          if (res.data.code === 0) {
            let data = res.data.data.records
            this.personTable = data
            this.personPageInfo.total = res.data.data.total
            if (this.personTable.length == 0) {
              this.personEmptyText = '暂无数据'
            }
          } else {
            this.$message.error('获取数据出错，请刷新重试')
          }
        })
      },
      /**
       * 事件监听
       */
      // 点击搜索
      searchClient() {
        this.clickQueryCondition = {
          current: 1,
          size: this.personPageInfo.size
        }
        this.clientName ? this.clickQueryCondition.name = this.clientName : ''
        this._getClientList(this.clickQueryCondition)
      },
      // 控制列显隐
      chooseColumn() {
        this.dialogColumnVisible = true
      },
      // 点击新增
      addClick() {
        console.log(this.inputForm, 'add');
        this.actionType = 1
        this.dialogTitle = '新增',
        this.formDialogVisible = true
      },
      // 表格点击事件
      tableAction(row, type) {
        if (type === 2) {
          // 编辑
          this.actionType = 2
          this.dialogTitle = '编辑'
          let dataCD = _.cloneDeep(row)
          this.inputForm.id = dataCD.id
          this.inputForm.name = dataCD.name
          this.inputForm.phone = dataCD.phone
          this.inputForm.contract = dataCD.contract
          this.inputForm.remarks = dataCD.remarks
          this.formDialogVisible = true
          console.log(this.inputForm, 'edit');
        }
        if (type === 3) {
          // 删除
          let id = row.id
          this.$confirm('是否确定删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deleteClient(id).then(res => {
              if (res.data.code === 0) {
                this.$message.success({message: '删除成功', center: true})
                this.setPageQuery()
                this._getClientList(this.pageQueryCondition)
              } else {
                return this.$message.error({message: '删除失败，请重试', center: true})
              }
            })
          }).catch(() => {})
        }
      },
      // 提交表单
      submitForm() {
        if (this.actionType === 1) {
          this.$refs.inputFormRef.validate(valid => {
            if (valid) {
              // 提交新增
              addClient(this.inputForm).then(res => {
                if (res.data.code === 0) {
                  this.$message.success('添加客户成功')
                  this.setPageQuery()
                  this._getClientList(this.pageQueryCondition)
                  this.formDialogVisible = false
                } else {
                  return this.$message.error('添加客户出错，请重试')
                }
              })
            }
          })          
        }
        if (this.actionType === 2) {
          this.$refs.inputFormRef.validate(valid => {
            if (valid) {
              // 提交修改
              editClient(this.inputForm).then(res => {
                if (res.data.code === 0) {
                  this.$message.success('修改成功')
                  this.setPageQuery()
                  this._getClientList(this.pageQueryCondition)
                  this.formDialogVisible = false
                } else {
                  return this.$message.error('修改客户出错，请重试')
                }
              })
            }            
          })        
        }
      },
      // 对话框关闭刷新表单
      refreshData() {
        console.log(this.inputForm);
        this.$refs.inputFormRef.resetFields()
        this.inputForm.id = ''
        this.inputForm.name = ''
        this.inputForm.phone = ''
        this.inputForm.contract = ''
        this.inputForm.remarks = ''
      },
      refreshList() {
        this.clientName = ''
        this.clickQueryCondition = {
          current: 1,
          size: this.personPageInfo.size
        }
        this._getClientList(this.clickQueryCondition)
      },
      // 分页器事件
      personQueryByPage(pageInfo) {
        this.personPageInfo.page = pageInfo.page
        this.personPageInfo.size = pageInfo.size
        this.setPageQuery()
        this._getClientList(this.pageQueryCondition)
      },
      setPageQuery() {
        this.pageQueryCondition = {
          current: this.personPageInfo.page,
          size: this.personPageInfo.size,
          name: this.clickQueryCondition.name
        }
      }
    }
}
</script>

<style lang="scss" scoped>
.add-btn {
  margin-top: 15px;
}
.search-btn {
  margin: 2px 0 0 15px ;
}
</style>