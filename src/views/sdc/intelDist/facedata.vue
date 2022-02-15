<template>
  <div>
    <basic-container>
      <!-- 搜索区 -->
      <el-row :gutter="20" class="search-area">
        <el-col :span="8" :offset="1">
          <span>所属园区：</span>
          <el-select v-model="campusId" placeholder="请选择" @change="changeCampus">
            <el-option style="width:100%" 
              v-for="item in campusList"
              :key="item.code"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-button
            type="primary"
            icon="el-icon-refresh"
            size="small"
            class="refresh-btn"
            @click="resetfdTable"
            >重置</el-button
          >
        </el-col>
        <el-col :span="8" :offset="6">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="small"
            @click="handleAdd"
            >新增</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            @click="handleRemove"
            :disabled="removeFlag"
            >删除</el-button
          >
          <!-- <el-button size="small">导入</el-button>
          <el-button size="small">导出</el-button> -->
        </el-col>
      </el-row>
      <!-- 人脸库列表 -->
      <el-table 
        :data="faceDataTable" 
        border 
        row-key="id"
        style="margin: 0.75rem 0"
        @selection-change="fdSelectionChange"
        :empty-text="faceDataEmptyText"
      >
        <el-table-column 
          type="selection" 
          width="55" 
          align="center"
          :reserve-selection="true"
        ></el-table-column>
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="50"
          sortable
        ></el-table-column>
        <el-table-column
          prop="name"
          label="人脸库名称"
          align="center"
        ></el-table-column>
        <el-table-column
          label="所属园区"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{scope.row.expand.siteName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="启用状态"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.status === '0'">未启用</span>
            <span v-else>启用</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="成员列表"
          align="center"
        >
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.expand.fdPNames.join('、')" placement="top">
              <span>{{scope.row.expand.fdPNames.join('、').slice(0, 15)}}</span>
            </el-tooltip>           
          </template>
        </el-table-column> -->
        <el-table-column
          prop="updateDate"
          label="修改时间"
          width="180"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="updateBy"
          label="修改人"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="240">
          <template slot-scope="scope">
            <span class="table-action" @click="tableAction(scope.row, 2)"
              >查看</span
            >
            <span class="table-action" @click="tableAction(scope.row, 3)"
              >修改</span
            >
            <span class="table-action" @click="tableAction(scope.row, 4)"
              >删除</span
            >
            <span class="table-action" @click="tableAction(scope.row, 5)"
              >关联人员</span
            >
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        :page="fdPageInfo.page"
        :size="fdPageInfo.size"
        :total="fdPageInfo.total"
        :key="fdPageKey"
        @pagination="queryfdByPage"
      ></Pagination>
      <!-- 表单dialog -->
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
          :disabled="isdisabled"
        >
          <el-form-item label="人脸库名称" prop="name">
            <el-input v-model="inputForm.name"></el-input>
          </el-form-item>
          <el-form-item label="所属园区" prop="siteId">
            <el-select v-model="inputForm.siteId" placeholder="请选择" class="form-select">
              <el-option 
                v-for="item in campusList"
                :key="item.code"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="启用状态" prop="status">
            <el-switch 
              v-model="inputForm.status" 
              active-text="开" 
              inactive-text="关"
              active-value="1"
              inactive-value="0"
            >
            </el-switch>
          </el-form-item>
          <el-form-item v-if="actionType === 2" label="成员列表" prop="member">
            <el-input type="textarea" v-model="inputForm.expand.fdPNames"></el-input>
          </el-form-item>
          <el-form-item v-if="actionType === 2" label="修改时间" prop="updateDate">
            <el-input v-model="inputForm.updateDate"></el-input>
          </el-form-item>
          <el-form-item v-if="actionType === 2" label="修改人" prop="updateBy">
            <el-input v-model="inputForm.updateBy"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input type="textarea" v-model="inputForm.remarks"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <template v-if="actionType === 2">
            <el-button
              type="primary"
              @click="formDialogVisible = false"
              size="small"
              >关闭</el-button
            >
          </template>
          <template v-else>
            <el-button @click="formDialogVisible = false" size="small"
              >取消</el-button
            >
            <el-button type="primary" @click="submitForm" size="small"
              >保存</el-button
            >
          </template>
        </span>
      </el-dialog>
      <!-- 关联人员dialog -->
      <el-dialog
        :visible.sync="dialogPersonVisible"
        width="60%"
        ref="personDialogRef"
        :close-on-click-modal="false"
        title="关联人员"
        @closed="dialogPersonClosed"
      >
        <el-table 
          :data="personTable" 
          border
          row-key="id" 
          style="margin: 0.75rem 0"
          :empty-text="personEmptyText"
          @selection-change="personReSelection"
          ref="personReTableRef">
        >
          <el-table-column
            type="selection"
            width="50"
            align="center"
            :reserve-selection="true">
          </el-table-column>
          <el-table-column
            type="index"
            label="序号"
            width="50"
            align="center"
            sortable
          ></el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="所属园区"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{scope.row.expand.siteName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="性别"
            align="center"
          >
          <!--  -->
            <template slot-scope="scope">
              <span v-if="scope.row.expand.fdpSex === '0'">男</span>
              <span v-else>女</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="phone"
            label="联系方式"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="remarks"
            label="说明"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="updateBy"
            label="修改人"
            align="center"
          >
          </el-table-column>
        </el-table>
        <Pagination
          :page="personPageInfo.page"
          :size="personPageInfo.size"
          :total="personPageInfo.total"
          :key="personPageKey"
          @pagination="personQueryByPage"
        ></Pagination>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogPersonVisible = false" size="small"
            >取消</el-button
          >
          <el-button type="primary" @click="submitPersonRe" size="small"
            >保存</el-button
          >
        </span>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";

import { sdcSiteAction} from "@/api/sdc/addressInfo";
import {  getFaceDataList, 
          addFaceData, 
          getListBySiteId, 
          editFaceData, 
          deleteFaceData, 
          getPersonReList,
          addPersonReLists,  } from '@/api/sdc/faceData'
import { getPersonBySiteId } from "@/api/sdc/personInfo"
import { modifyData } from "@/util/domainFilter";
import _ from 'lodash'

export default {
  components: {
    Pagination,
  },
  data() {
    return {
      // 人脸库搜索框相关
      campusList: [],
      campusId: null,
      // 人脸库分页相关
      fdPageInfo: {
        page: 1,
        size: 10,
        total: 0
      },
      fdPageKey: Math.random().toString(36).slice(-6),
      // 人脸库表格相关
      faceDataTable: [],
      faceDataEmptyText: '数据加载中...',
      fdSelections: [],
      // 新增、查看、编辑对话框相关
      formDialogVisible: false,
      dialogTitle: '',
      actionType: null,
      // 新增、查看、编辑表单相关
      inputForm: {},
      inputFormRules: {
        name: [
          {required: true, message: '请输入人脸库名称', trigger: 'blur' }
        ],
        siteId: [
          {required: true, message: '请选择所属园区'}
        ],
        status: [
          {required: true}
        ]
      },
      inputFormKey: Math.random().toString(36).slice(-6),
      isdisabled: true,
      // 人脸库删除相关
      deleteId: '',
      // 人员信息对话框相关
      dialogPersonVisible: false,
      // 人员信息搜索相关
      personCampusId: null,
      // 人员信息表相关
      libId: '',
      reSiteId: '',
      personReList: [],
      personSelections: [],
      personTable: [],
      personEmptyText: '加载中...',
      // 人员信息表分页相关
      personPageKey: Math.random().toString(36).slice(-6),
      personPageInfo: {
        page: 1,
        size: 10,
        total: 0 
      },
    };
  },
  created() {
    this.init()
    this._getFaceDataList(this.fdPageInfo.page, this.fdPageInfo.size)
  },
  computed: {
    // 删除按钮禁用标志
    removeFlag() {
      return this.fdSelections.length === 0
    }
  },
  methods: {
    /**
     * 网络请求
     */
    async init() {
      // 获取初始区域查询条件数据
      let data = await sdcSiteAction('','/tree','get')
      this.campusList = modifyData(data.data.data)
    },
    // 获取人脸库列表数据
    _getFaceDataList(page, size) {
      getFaceDataList(page, size).then(res => {
        let data = res.data.data
        if (res.data.code === 0) {
          this.faceDataTable = data.records
          this.fdPageInfo.total = data.total
          if (this.faceDataTable.length === 0) {
            this.faceDataEmptyText = '暂无数据'
          }
        } else {
          return this.$message.error('获取人脸库数据出错，请重试')
        }
      })
      
    },
    // 根据园区id获取人脸库表
    _getListBySiteId(page, size, siteId) {
      getListBySiteId(page, size, siteId).then(res => {
        let data = res.data.data
        if (res.data.code === 0) {
          this.faceDataTable = data.records
          this.fdPageInfo.total = data.total
          if (this.faceDataTable.length === 0) {
            this.faceDataEmptyText = '暂无数据'
          }
        } else {
          return this.$message.error('获取人脸库数据出错，请重试')
        }
      })
    },
    // 获取已关联人员数据
    _getPersonReList(libId) {
      getPersonReList(libId).then(res => {
          if (res.data.code === 0) {
            let rdata = res.data.data
            this.personReList = rdata.records
            for (let person of this.personReList) {
              this.personTable.forEach(item => {
                if (person.personId === item.id) {
                  this.$refs.personReTableRef.toggleRowSelection(item, true)
                }
              })
            }
          }          
        })
    },
    // 根据园区id获取人员信息表
    _getPersonBySiteId(page, size, siteId) {
      getPersonBySiteId(page, size, siteId).then(res => {
        let data = res.data.data
        if (res.data.code === 0) {
          this.personTable = data.records
          this.personPageInfo.total = data.total
          if (this.personTable.length === 0) {
            this.personEmptyText = '暂无数据'
          }
        } else {
          return this.$message.error('获取人员信息出错，请重试')
        }
      })
    },
    

    /**
     *方法监听  
     */ 
    // 人脸库搜索框值变化
    changeCampus() {  
      this.fdPageInfo.page = 1  
      this._getListBySiteId(this.fdPageInfo.page, this.fdPageInfo.size, this.campusId)
    },
    // 分页变化
    queryfdByPage(pageInfo) {
      this.fdPageInfo.page = pageInfo.page
      this.fdPageInfo.size = pageInfo.size
      if (this.campusId === null) {
         this._getFaceDataList(this.fdPageInfo.page, this.fdPageInfo.size)
      } else {
        this._getListBySiteId(this.fdPageInfo.page, this.fdPageInfo.size, this.campusId)
      }
     
    },
    // 重置人脸库表
    resetfdTable() {
      this.campusId = null
      this._getFaceDataList(this.fdPageInfo.page, this.fdPageInfo.size)
    },
    // 新增人脸库
    handleAdd() {
      this.actionType = 1
      this.isdisabled = false
      this.dialogTitle = "新增"
      this.init()
      this.formDialogVisible = true
    },
    // 删除人脸库
    handleRemove() {
      this.$confirm('是否确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fdSelections.forEach(item => {
            deleteFaceData(item.id)
          })
          this.$message.success({message: '删除成功,请点击重置刷新列表', center: true})
          this._getFaceDataList(this.fdPageInfo.page, this.fdPageInfo.size)
        }).catch(() => {})   
    },
    // 人脸库表格选中
    fdSelectionChange(val) {
      this.fdSelections = val
    },
    // 表格项操作
    tableAction(data, type) {
      if (type === 2) {
        // 点击查看时
        this.actionType = 2
        this.dialogTitle = '查看'
        this.isdisabled = true
        let dataCD = _.cloneDeep(data)
        if (dataCD.expand.fdPNames !== null) {
          dataCD.expand.fdPNames = dataCD.expand.fdPNames.join(', ')
        }
        this.inputForm = dataCD
        this.formDialogVisible = true
      }
      if (type === 3) {
        // 点击修改时
        this.actionType = 3
        this.dialogTitle = '编辑'
        this.isdisabled = false
        this.init()
        let dataCD = _.cloneDeep(data)
        this.inputForm = dataCD
        this.formDialogVisible = true
      }
      if (type === 4) {
        // 点击删除时
        this.deleteId = data.id
         this.$confirm('是否确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteFaceData(this.deleteId).then(res => {
            if (res.data.code === 0) {
              this.$message.success({message: '删除成功', center: true})
              this._getFaceDataList(this.fdPageInfo.page, this.fdPageInfo.size)
            } else {
              return this.$message.error({message: '删除失败，请重试', center: true})
            }
          })
        }).catch(() => {})
        
      }
      if (type === 5) {
        // 点击关联人员时
        this.dialogPersonVisible = true
        this.libId = data.id
        this.reSiteId = data.siteId
        this._getPersonBySiteId(this.personPageInfo.page, this.personPageInfo.size, data.siteId)
        this._getPersonReList(this.libId)
      }
    },
    // 提交表单
    submitForm() {
      if (this.actionType === 1) {
        // 提交新增        
        this.$refs.inputFormRef.validate(valid => {
          if (valid) {
            let siteId = this.inputForm.siteId
            addFaceData(this.inputForm.name, this.inputForm.status, siteId, this.inputForm.remarks).then(res => {
              if (res.data.code === 0) {
                this.$message.success({message: '添加成功', center: true})
                this._getFaceDataList(this.fdPageInfo.page, this.fdPageInfo.size)
                this.formDialogVisible = false
              } else {
                return this.$message.error({message: '添加人脸库出错，请重试', center: true})
              }
            })           
          }
        })      
      } 
      if (this.actionType === 3) {
        // 提交修改
        this.$refs.inputFormRef.validate(valid => {
          if (valid) {
            editFaceData(this.inputForm.id, this.inputForm.name, this.inputForm.status, this.inputForm.siteId, this.inputForm.remarks).then(res => {
              if (res.data.code === 0) {
                this.$message.success({message: '修改成功', center: true})
                this._getFaceDataList(this.fdPageInfo.page, this.fdPageInfo.size)
                this.formDialogVisible = false
              } else {
                return this.$message.error({message: '添加人脸库出错，请重试', center: true})
              }
            })           
          }
        }) 
      }
    },
    // 关闭对话框重置表单内容
    refreshData() {
      this.$refs.inputFormRef.resetFields()
      this.inputForm.name = null
      this.inputForm.siteId = null
      this.inputForm.status = '0'
      this.inputForm.remarks = null     
    },
    // 关联人员对话框关闭
    dialogPersonClosed() {
      this.personCampusId = null
      this.personPageInfo.page = 1
      this.personPageInfo.size = 10
      this.$refs.personReTableRef.clearSelection()
    },
    // 人员表项选中
    personReSelection(val) {
      this.personSelections = val
    },
    // 人员表分页事件
    personQueryByPage(pageInfo) {
      this.personPageInfo.page = pageInfo.page
      this.personPageInfo.size = pageInfo.size
       this._getPersonBySiteId(this.personPageInfo.page, this.personPageInfo.size, this.reSiteId)     
    },
    // 保存关联
    submitPersonRe() {
      let pIds = this.personSelections.map(item => item.id)
      let dataObj = {libId: this.libId, personIds: pIds}
      addPersonReLists(dataObj).then(res => {
        if (res.data.code === 0) {
          this.$message.success({message: '修改关联人员成功', center: true})
          this._getFaceDataList(this.fdPageInfo.page, this.fdPageInfo.size)
        } else {
          return this.$message.error({message: '修改关联人员出错，请重试', center: true})
        }
      }) 
      this.dialogPersonVisible = false
    }
  },
};
</script>

<style lang="scss" scoped>
.refresh-btn {
  margin-left: 15px;
}
.form-select {
  width: 100%;
}
/deep/ .el-input.is-disabled .el-input__inner {
    color: #333;
  }
/deep/ .el-textarea.is-disabled .el-textarea__inner {
    color: #333;
  }
</style>