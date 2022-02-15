<template>
  <div>
    <basic-container>
    <!-- 搜索区 -->
      <el-row :gutter="15" class="search-area">
        <el-col :span="8">
          <span>名称：</span>         
          <el-input
            placeholder="请输入线路名称"
            v-model="searchText"
            style="width: 80%"
          ></el-input>        
        </el-col>
        <el-col :span="8">
        <el-button
        type="primary"
          icon="el-icon-search"
          size="small"
          @click="searchRoute"
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
      <el-table :data="routeList" border stripe>
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column prop="routename" label="巡检线路名称" align="center"></el-table-column>
        <el-table-column prop="patrolpoint" label="巡检点" align="center">
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.patrolpoint" :key="index">{{item}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="patrolman" label="负责人" align="center"></el-table-column>
        <el-table-column prop="mobile" label="联系电话" align="center"></el-table-column>
        <el-table-column label="启用状态" align="center">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <span v-if="scope.row.state === 1">已启用</span>
            <span v-else>未启用</span>
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
      <!-- 新增巡检线路 -->
      <el-dialog 
        title="新增巡检路线" 
        :visible.sync="addRouteVisible"
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
          <el-form-item label="线路名称：" prop="routename">
            <el-input v-model="addForm.routename" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="负责人：" prop="patrolman">
            <el-select v-model="addForm.patrolman" class="patrolman-select">
              <el-option
                v-for="item in patrolmanList"
                :key="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="巡检点：">
            <el-transfer 
              v-model="selectedPoint" 
              :data="allPoint"
              :titles="['所有巡检点', '已选巡检点']"  
            ></el-transfer>
          </el-form-item>
          <el-form-item label="备注：" prop="postscript">
            <el-input type="textarea" v-model="addForm.postscript" :rows="3"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addRouteVisible = false">关 闭</el-button>
          <el-button type="primary" @click="addRouteSubmit(addForm)">确 定</el-button>
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
              <el-form-item label="巡检线路名称">
                <el-input v-model="viewForm.routename"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="巡检点">
                <el-dropdown trigger="click">
                  <span class="el-dropdown-link">
                    点击查看<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(item, index) in viewForm.patrolpoint" :key="index">{{item}}</el-dropdown-item>                   
                  </el-dropdown-menu>
                </el-dropdown>
              </el-form-item>
            </el-col>            
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="负责人">
                <el-input v-model="viewForm.patrolman"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话">
                <el-input v-model="viewForm.mobile"></el-input>
              </el-form-item>
            </el-col>            
          </el-row>
           <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="启用状态">
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
          <el-form-item label="巡检线路名称：" prop="routename">
            <el-input v-model="editForm.routename"></el-input>
          </el-form-item>
          <el-form-item label="巡检点：">
            <el-transfer 
              v-model="selectedPoint" 
              :data="allPoint"
              :titles="['所有巡检点', '已选巡检点']"  
            ></el-transfer>
          </el-form-item>
          <el-form-item label="负责人：" prop="patrolman">
            <el-select v-model="editForm.patrolman">
              <el-option
                v-for="item in patrolmanList"
                :key="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系电话：" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item> 
          <el-form-item label="启用状态：" prop="state">
            <el-select v-model="editForm.state">
              <el-option
                v-for="item in stateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>   
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">关 闭</el-button>
          <el-button type="primary" @click="editRouteSubmit">确 定</el-button>          
        </div>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import _ from "lodash"
export default {
  components: {
    Pagination
  },
  data() {
    const generateData = _ => {
        const data = [];
        for (let i = 1; i <= 15; i++) {
          data.push({
            key: i,
            label: `巡检点 ${ i }`
          });
        }
        return data;
      }
    return {
      // 路线表     
      routeList: [
        {
          routename: '宜家花园二期',
          patrolpoint: ['巡检点1', '巡检点3', '巡检点4', '巡检点8'],
          patrolman: '张三',
          mobile: '13569548565',
          state: 1
        },
        {
          routename: '线路2',
          patrolpoint: ['巡检点2', '巡检点3', '巡检点7', '巡检点6'],
          patrolman: '李四',
          mobile: '15796853694',
          state: 0
        }
      ],  
      patrolmanList: ['张三', '李四', '王五', '陆六'], // 巡检人员列表
      // 搜索文本
      searchText: '',
      page: {
        total: 2,
        currentPage: 1,
        pageSize: 10
      },
      pageKey: Math.random().toString(36).slice(-6),
      addRouteVisible: false,
      // 添加线路表单
      addForm: {
        routename: '',
        patrolman: '',
        postscript: ''
      }, 
      // 添加线路表单验证
      addFormRules: {
        routename: [
          {required: true, message: '请输入线路名称', trigger: 'blur' }
        ],
        patrolman: [
          {required: true, message: '请选择负责人', trigger: 'blur' }
        ]
      },
      // 所有巡检点
      allPoint: generateData(),
      // 已选巡检点(allPoint的key)
      selectedPoint: [],
      viewDialogVisible: false,
      viewForm: {}, // 查看线路表单
      stateOptions: [
        {
          value: 0,
          label: '未启用'
        }, 
        {
          value: 1,
          label: '已启用'
        }],
      editDialogVisible: false,
      editForm: {},  // 修改线路表单
      editFormRules: {
        routename: [
          {required: true, message: '请输入线路名称', trigger: 'blur' }
        ],
        patrolman: [
          {required: true, message: '请输入线路名称', trigger: 'blur' }
        ],
        mobile: [
          {required: true, message: '请输入线路名称', trigger: 'blur' }
        ],
        state: [
          {required: true, message: '请输入线路名称', trigger: 'blur' }
        ],
      }
    }
  },
  created() {
    // 请求线路列表数据

  },
  methods: {
    queryByPage(data) {
      // 页数或每页条数变化重新请求数据
      console.log('pagination changed');
    },
    // 查询线路
    searchRoute() {
      console.log('查询');
      // 网络请求
    },
    // 重置搜索框
    resetSearch() {
      this.searchText = ''
      // 重新请求线路列表
    },

    // 添加线路相关
    showAddDialog() {
      // 请求数据
      this.addRouteVisible = true
    },
    addRouteSubmit() {
      this.$refs.addFormRef.validate((valid => {
        if (valid) {
          // 网络请求
        } else {
          return false
        }
      }))
      console.log('点击了确定');
    },
    addDialogClosed() {
      // 对话框关闭重置表单内容
      this.$refs.addFormRef.resetFields()
      this.selectedPoint = []
    },
    // 查看线路
    handleView(row) {
      this.viewForm = row
      this.viewDialogVisible = true
    },
    // 修改线路
    handleEdit(row) {
      // 将row深拷贝后赋给editForm
      const rowDC = _.cloneDeep(row)
      // 
      
      this.editForm = rowDC
      this.editDialogVisible = true
    },
    editRouteSubmit() {
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
      this.$confirm('确定删除此线路?', '警告', {
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
  
</style>