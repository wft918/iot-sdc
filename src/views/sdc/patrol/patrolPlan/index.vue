<template>
  <div>
    <basic-container>

    <!-- 搜索区 -->
      <el-row :gutter="15" class="search-area">
        <el-col :span="6">
          <span>名称：</span>         
          <el-input
            placeholder="请输入线路名称"
            v-model="searchName"
            style="width: 80%"
          ></el-input>        
        </el-col>
        <el-col :span="6">
          <span>类型：</span>         
          <el-select v-model="searchType" style="width: 80%">
            <el-option
              v-for="item in typeValue"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>        
        </el-col>
        <el-col :span="8">
        <el-button
        type="primary"
          icon="el-icon-search"
          size="small"
          @click="searchPlan"
        >查询</el-button>
        <el-button
          icon="el-icon-delete"
          size="small"
          @click="resetSearch"
        >重置</el-button>  
        </el-col>      
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-button 
            type="primary" 
            size="small" 
            icon="el-icon-plus"
            @click="showAddDialog"  
          >新增</el-button>
        </el-col> 
      </el-row>
      <!-- 列表区 -->
      <el-table :data="planList" border stripe>
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column prop="planname" label="计划名称" align="center"></el-table-column>
        <el-table-column label="类型" align="center">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <span v-if="scope.row.state === 0">日计划</span>
            <span v-else-if="scope.row.state === 1">周计划</span>
            <span v-else-if="scope.row.state === 2">月计划</span>
            <span v-else>年计划</span>
          </template>
        </el-table-column>
        <el-table-column prop="interval" label="执行间隔" align="center"></el-table-column>
        <el-table-column prop="start" label="开始日期" align="center"></el-table-column>
        <el-table-column prop="end" label="结束日期" align="center"></el-table-column>
        <el-table-column prop="route" label="巡检线路" align="center"></el-table-column>
        <el-table-column prop="patrolman" label="执行人" align="center"></el-table-column>
        <el-table-column label="是否启用" align="center">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <span v-if="scope.row.state === 1">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="175" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-view"
              size="mini"
              @click="handleView(scope.row)"
            >查看</el-button>
            <el-button
              type="text"
              icon="el-icon-edit"
              size="mini"
              @click="handleEdit(scope.row)"
            >修改</el-button>
            <el-button
                type="text"
                icon="el-icon-delete"
                size="mini"
                @click="handleRemove(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <Pagination :page="page.currentPage" :size="page.pageSize" :total="page.total" :key="pageKey" @pagination="queryByPage"></Pagination>
      <!-- 新增巡检计划 -->
      <el-dialog 
        title="新增巡检路线" 
        :visible.sync="addPlanVisible"
        width="50%"
        :close-on-click-modal="false"
        @closed="addDialogClosed"  
      >
        <el-form 
          :model="addForm"
          label-width="100px"
          ref="addFormRef"
          :rules="addFormRules"
        >
          <el-row>
            <el-form-item label="计划名称" prop="planname">
              <el-input v-model="addForm.planname"></el-input>
            </el-form-item>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="计划类型" prop="plantype">
                <el-select v-model="addForm.plantype" placeholder="请选择">
                  <el-option
                    v-for="item in typeValue"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="执行间隔" prop="interval">
                <el-input v-model="addForm.interval"></el-input>
              </el-form-item>
            </el-col>            
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="开始日期" prop="start">
                <el-date-picker
                  v-model="addForm.start"
                  type="date"
                  placeholder="选择开始日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束日期" prop="end">
                <el-date-picker
                  v-model="addForm.end"
                  type="date"
                  placeholder="选择结束日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>            
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="执行日期" prop="executedate"> 
                <el-date-picker
                  v-model="addForm.executedate"
                  type="date"
                  placeholder="选择执行日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="执行时间" prop="executetime">
                <el-time-picker
                  v-model="addForm.executetime"
                  :picker-options="{
                    selectableRange: '00:00:00 - 23:59:59'
                  }"
                  placeholder="选择执行时间"
                >
                </el-time-picker>
              </el-form-item>
            </el-col>            
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="执行时长" prop="executeduration">
                <el-input v-model="addForm.executeduration"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="巡检线路" prop="route">
                <el-input v-model="addForm.route"></el-input>
              </el-form-item>
            </el-col>            
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="巡检人员" prop="patrolman">
                <el-select v-model="addForm.patrolman" placeholder="请选择">
                  <el-option
                    v-for="item in patrolmanList"
                    :key="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>          
            <el-col :span="12">
              <el-form-item label="是否启用" prop="state">
                <el-select v-model="addForm.state">
                  <el-option
                    v-for="item in stateOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>           
          </el-row>
        </el-form>      
        <div slot="footer" class="dialog-footer">
          <el-button @click="addPlanVisible = false">关 闭</el-button>
          <el-button type="primary" @click="addPlanSubmit(addForm)">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 查看线路 -->
      <el-dialog 
        title="查看巡检线路" 
        :visible.sync="viewDialogVisible" 
        width="50%"
        :close-on-click-modal="false"
      >
        <el-form 
          :model="viewForm" 
          label-width="100px" 
          disabled 
          class="view-form"
        >
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="计划名称">
                <el-input v-model="viewForm.planname"></el-input>
              </el-form-item>
            </el-col> 
            <el-col :span="12">
              <el-form-item label="计划类型">
                <el-select v-model="viewForm.plantype" placeholder="请选择">
                  <el-option
                    v-for="item in typeValue"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>           
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="执行间隔">
                <el-input v-model="viewForm.interval"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开始日期">
                <el-input v-model="viewForm.start"></el-input>
              </el-form-item>
            </el-col>            
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="结束日期"> 
                <el-input v-model="viewForm.end"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="巡检线路">
                <el-input v-model="viewForm.route"></el-input>
              </el-form-item>
            </el-col>            
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="巡检人员">
                <el-select v-model="viewForm.patrolman" placeholder="请选择">
                  <el-option
                    v-for="item in patrolmanList"
                    :key="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>          
            <el-col :span="12">
              <el-form-item label="是否启用">
                <el-select v-model="viewForm.state">
                  <el-option
                    v-for="item in stateOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>           
          </el-row>     
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="viewDialogVisible = false">关 闭</el-button>
          
        </div>
      </el-dialog>
      <!-- 修改线路 -->
      <el-dialog 
        title="修改巡检线路" 
        :visible.sync="editDialogVisible" 
        width="50%"
        :close-on-click-modal="false"
      >
        <el-form 
          :model="editForm" 
          label-width="120px" 
          class="edit-form"
          :rules="editFormRules"
          ref="editFormRef"
        >
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="计划名称" prop="planname">
                <el-input v-model="editForm.planname"></el-input>
              </el-form-item>
            </el-col> 
            <el-col :span="12">
              <el-form-item label="计划类型" prop="plantype">
                <el-select v-model="editForm.plantype" placeholder="请选择">
                  <el-option
                    v-for="item in typeValue"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>           
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="执行间隔" prop="interval">
                <el-input v-model="editForm.interval"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开始日期" prop="start">
                <el-date-picker
                  v-model="editForm.start"
                  type="date"
                  placeholder="选择开始日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>            
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="结束日期" prop="end"> 
                <el-date-picker
                  v-model="editForm.end"
                  type="date"
                  placeholder="选择开始日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="巡检线路" prop="route">
                <el-input v-model="editForm.route"></el-input>
              </el-form-item>
            </el-col>            
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="巡检人员" prop="patrolman">
                <el-select v-model="editForm.patrolman" placeholder="请选择">
                  <el-option
                    v-for="item in patrolmanList"
                    :key="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>          
            <el-col :span="12">
              <el-form-item label="是否启用" prop="state">
                <el-select v-model="editForm.state">
                  <el-option
                    v-for="item in stateOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>           
          </el-row>     
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">关 闭</el-button>
          <el-button type="primary" @click="editPlanSubmit">确 定</el-button>          
        </div>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import moment from "moment"
import _ from "lodash"
export default {
  components: {
    Pagination
  },
  data() {
    return {  
      // 计划表   
      planList: [
        {
          planname: '巡检计划1',
          plantype: 0,
          interval: 1,
          start: moment(1624332563000).format(
                  "YYYY-MM-DD"
                ),
          end: moment(1626924563000).format(
                  "YYYY-MM-DD"
                ),
          route: '线路1',
          patrolman: '张三',
          state: 1
        },
        {
          planname: '巡检计划2',
          plantype: 1,
          interval: 2,
          start: moment(1621135763000).format(
                  "YYYY-MM-DD"
                ),
          end: moment(1622258963000).format(
                  "YYYY-MM-DD"
                ),
          route: '线路2',
          patrolman: '李四',
          state: 0
        }
      ], 
      // 搜索文本 
      searchName: '',
      searchType: '',
      page: {
        total: 2,
        currentPage: 1,
        pageSize: 10
      },
      pageKey: Math.random().toString(36).slice(-6),
      addPlanVisible: false,
      // 添加计划表单
      addForm: {
        planname: '',
        plantype: 0,
        interval: 0,
        start: new Date(),
        end: new Date(),
        executedate: new Date(),
        executetime: new Date(),
        executeduration: 0,
        route: '',
        patrolman: '',
        state: 0
      }, 
      // 计划类型
      typeValue: [
        {
          value: 0,
          label: '日计划'
        },
        {
          value: 1,
          label: '周计划'
        },
        {
          value: 2,
          label: '月计划'
        },
        {
          value: 3,
          label: '年计划'
        },
      ],
      // 巡检人员
      patrolmanList: ['张三', '李四', '王五', '陆六'],
      // 添加计划表单验证规则
      addFormRules: {
        planname: [
          {required: true, message: '请输入线路名称', trigger: 'blur' }
        ],
        plantype: [
          {required: true, message: '请选择计划类型', trigger: 'blur' }
        ],
        interval: [
          {required: true, message: '请输入执行间隔', trigger: 'blur' }
        ],
        start: [
          {required: true, message: '请输入开始日期', trigger: 'blur' }
        ],
        end: [
          {required: true, message: '请输入结束日期', trigger: 'blur' }
        ],
        executedate: [
          {required: true, message: '请输入执行日期', trigger: 'blur' }
        ],
        executetime: [
          {required: true, message: '请输入执行时间', trigger: 'blur' }
        ],
        executeduration: [
          {required: true, message: '请输入执行时长', trigger: 'blur' }
        ],
        route: [
          {required: true, message: '请输入巡检线路', trigger: 'blur' }
        ],
        patrolman: [
          {required: true, message: '请选择巡检人员', trigger: 'blur' }
        ],
        state: [
          {required: true, message: '请选择是否启用', trigger: 'blur' }
        ],
      }, 
      
      viewDialogVisible: false,
      viewForm: {}, // 查看计划表单
      stateOptions: [
        {
          value: 0,
          label: '是'
        }, 
        {
          value: 1,
          label: '否'
        }],
      editDialogVisible: false,
      editForm: {},  // 修改计划表单
      editFormRules: {
        planname: [
          {required: true, message: '请输入线路名称', trigger: 'blur' }
        ],
        plantype: [
          {required: true, message: '请选择计划类型', trigger: 'blur' }
        ],
        interval: [
          {required: true, message: '请输入执行间隔', trigger: 'blur' }
        ],
        start: [
          {required: true, message: '请输入开始日期', trigger: 'blur' }
        ],
        end: [
          {required: true, message: '请输入结束日期', trigger: 'blur' }
        ],
        route: [
          {required: true, message: '请输入巡检线路', trigger: 'blur' }
        ],
        patrolman: [
          {required: true, message: '请选择巡检人员', trigger: 'blur' }
        ],
        state: [
          {required: true, message: '请选择是否启用', trigger: 'blur' }
        ],
      }
    }
  },
  created() {
    // 请求线计划表数据
  },
  methods: {
    queryByPage(data) {
      // 页数或每页条数变化重新请求数据
      console.log('pagination changed');
    },
    // 查询计划
    searchPlan() {
      console.log('查询计划');
      // 网络请求
    },
    // 重置搜索框
    resetSearch() {
      this.searchName = ''
      this.searchType = ''
      // 重新请求线路列表
    },

    // 添加线路相关
    showAddDialog() {
      // 请求数据
      this.addPlanVisible = true
    },
    addPlanSubmit() {
      this.$refs.addFormRef.validate((valid => {
        if (valid) {
          // 网络请求
        } else {
          return false
        }
      }))
      console.log(this.addForm);
    },
    addDialogClosed() {
      // 对话框关闭重置表单内容
      this.$refs.addFormRef.resetFields()
    },
    // 查看计划
    handleView(row) {
      this.viewForm = row
      this.viewDialogVisible = true
    },
    // 修改线路
    handleEdit(row) {
      // 将row深拷贝后赋给editForm
      console.log(row);
      const rowDC = _.cloneDeep(row)
      this.editForm = rowDC
      this.editDialogVisible = true
    },
    editPlanSubmit() {
      this.$refs.editFormRef.validate(valid => {
        if (valid) {
          // 网络请求
        } else {
          return false
        }
      })
    },
    // 删除线路
    handleRemove(row) {
      this.$confirm('确定删除此计划?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 网络请求
          console.log('点击了确定')
        }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
  .search-area {
    margin-bottom: 10px;
  }
  .el-table {
    margin-bottom: 15px;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #333;
    margin-left: 15px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .el-select {
    width: 100%;
  }
  /deep/ .el-input.is-disabled .el-input__inner {
    color: #333;
  }
  .el-date-editor {
    width: 100%;
  }
</style>