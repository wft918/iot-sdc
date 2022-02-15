<template>
  <div>
    <basic-container>
      <el-row :gutter="15">
        <el-col :span="6">
          <span>标题：</span>
          <el-input placeholder="请输入标题" v-model="searchTitle" clearable style="width: 80%"></el-input>
        </el-col>
        <el-col :span="4">
          <span>发布人：</span>
          <el-input placeholder="请输入发布人" v-model="searchSender" clearable style="width: 70%"></el-input>
        </el-col>
        <el-col :span="8">
          <span>发布时间：</span>
          <el-date-picker
            v-model="dueDate"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            style="width:80%"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="queryInfoClick">
            <i class="el-icon-search"></i> 查询
          </el-button>
          <el-button type="primary" @click="clearCondition">
            <i class="el-icon-delete"></i> 重置
          </el-button>
        </el-col>
      </el-row>
      <el-row style="margin-top:20px;">
        <el-col :span="23">
          <el-button type="primary" @click="addInfo">
            <i class="el-icon-plus"></i> 新增公告
          </el-button>
        </el-col>
        <el-col :span="1">
          <el-tooltip effect="dark" content="显隐" placement="top">
            <el-button circle="" @click="chooseColumn" size="small" icon="el-icon-menu"></el-button>
          </el-tooltip>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table
            :data="tableInfo"
            border
            style="margin:0.75rem 0"
          >
            <el-table-column 
              type="index"
              label="序号"
              align="center"
              width="80"
            ></el-table-column>
            <el-table-column 
              v-if="columnList[0].show"
              label="公告标题"
              header-align="center"
              show-overflow-tooltip
              width="360"
            >
              <template slot-scope="scope">
                <el-link :underline="false" type="primary" @click="mainPropClick(scope.row)">{{scope.row.title}}</el-link>
              </template>
            </el-table-column>
            <el-table-column
              v-if="columnList[1].show"
              prop="sender"
              label="发布人"
              align="center"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              v-if="columnList[2].show"
              prop="sendTime"
              label="发布时间"
              align="center"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              v-if="columnList[3].show"
              label="发布对象"
              align="center"
              show-overflow-tooltip
              :formatter="setMsgType"
            >
            </el-table-column>
            <el-table-column
              v-if="columnList[4].show"
              label="有效期"
              align="center"
              show-overflow-tooltip
              width="350"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.startTime && scope.row.endTime">{{scope.row.startTime + ' 至 ' + scope.row.endTime}}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="columnList[5].show"
              prop="sendStatus"
              label="状态"
              align="center"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.sendStatus === '0'">未发布</span>
                <span v-else-if="scope.row.sendStatus === '1'">已发布</span>
                <span v-else>已撤销</span>
              </template>
            </el-table-column>
            <el-table-column 
              label="操作"
              align="center"
            >
              <template slot-scope="scope">
                <span class="table-action" @click="tableAction(scope.row, 2)">查看</span>
                <el-dropdown trigger="click" class="table-action" placement="bottom">
                  <span class="el-dropdown-link">
                    更多<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-if="scope.row.sendStatus === '0'" >
                      <span class="table-action" @click="tableAction(scope.row, 3)">编辑</span>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.sendStatus === '0'" >
                      <span class="table-action" @click="tableAction(scope.row, 4)">发布</span>
                    </el-dropdown-item>
                    <el-dropdown-item v-else-if="scope.row.sendStatus === '1'"> 
                      <span class="table-action" @click="tableAction(scope.row, 5)">撤销</span>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <span class="table-action" @click="tableAction(scope.row, 6)">删除</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
          <Pagination :page="page" :size="size" :total="total" :key="pageKey" @pagination="queryByPage"></Pagination>
        </el-col>
      </el-row>
      <!-- 表单对话框 -->
      <el-dialog
        :visible.sync="dialogFormVisible"
        width="50%"
        ref="parkinglotDialog"
        :close-on-click-modal="false"
        @closed="refreshData"
        :title="dialogTitle"
        v-dialogDrag
        top="5vh"
      >
        <el-form
          :model="inputForm"
          label-width="175px"
          :rules="rules"
          ref="inputFormRef"
          :key="dialogKey"
          :disabled="isdisabled"
        >
          <el-form-item label="标题：" prop="title" >
            <el-input v-model="inputForm.title" style="width:60%"></el-input>
          </el-form-item>
          <el-form-item v-show="false" label="公告分类：" prop="msgCategory">
            <el-select v-model="inputForm.msgCategory" style="width:60%" :disabled="true">
              <el-option
                v-for="item in this.$dictUtils.getDictList('ann_msg_category')"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="通知类型：" prop="msgType" >
            <el-select v-model="inputForm.msgType" style="width:60%">
              <el-option
                v-for="item in this.$dictUtils.getDictList('ann_msg_type')"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="inputForm.msgType === '2'" label="接收对象：" prop="userNames" >
            <el-input 
              v-model="inputForm.userNames" 
              :readonly="true"
              clearable 
              @clear="clearUser" 
              style="width:60%"
              placeholder="点击右边按钮选择用户"
            >
              <el-button slot="append" icon="el-icon-search" :disabled="isdisabled" @click="selectUser"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="有效期：" prop="inputDueDate" >
            <el-date-picker
              v-model="inputForm.inputDueDate"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width:60%"
            >
            </el-date-picker>
          </el-form-item> 
          <el-form-item  label="公告内容：" prop="msgContent" class="msgcontent-formitem">
            <quill-editor 
              v-model="inputForm.msgContent"
              ref="msgQuillEditor"
              :options="editorOption"
              @focus="editorFocus">
           </quill-editor>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <template v-if="actionType == 2">
            <el-button
              @click="dialogFormVisible = false"
              size="small"
              >关闭</el-button
            >
            <el-button v-if="btnType === 1 && inputForm.sendStatus === '0'" type="primary" @click="enableEdit" size="small"
            >编辑</el-button>
            <el-button v-if="btnType === 2 && inputForm.sendStatus === '0'" type="primary" @click="submitForm" size="small"
            >保存</el-button>
          </template>
          <template v-else>
            <el-button @click="dialogFormVisible = false" size="small"
              >取消</el-button
            >
            <el-button type="primary" @click="submitForm" size="small"
              >保存</el-button
            >
          </template>
        </span>
      </el-dialog>
      <!-- 选择接收对象对话框 -->
      <el-dialog
        title="选择接收用户"
        :visible.sync="selectUserDialogVisible"
        width="60%"
        @closed="userDialogClosed"
        v-dialogDrag
      >
        <el-row :gutter="15">
          <!-- 左侧树形菜单 -->
          <el-col :span="5" class="tree-area">
            <el-card shadow="never" :body-style="contentViewHeight">
              <el-tree
                class="filter-tree"
                :data="deptData"
                :indent="2"
                :props="{
                          value: 'id',
                          label: 'name',
                          children: 'children'
                        }"
                node-key="id"
                show-checkbox
                check-strictly
                default-expand-all
                :expand-on-click-node="false"
                @check-change="handleCheckChange"
                ref="leftTree">
              </el-tree>
            </el-card>
          </el-col>
          <!-- 右侧表格 -->
          <el-col :span="19">
            <!-- <el-row>
              <el-col :span="12" :offset="1">
                <span>用户名：</span>
                <el-input v-model="searchUserName" style="width: 80%"></el-input>
              </el-col>
              <el-col :span="11">
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  size="small"
                  class="refresh-btn"
                  @click="searchUserTable"
                  >查询</el-button
                >
                <el-button
                  type="primary"
                  icon="el-icon-refresh"
                  size="small"
                  class="refresh-btn"
                  @click="resetUserTable"
                  >重置</el-button
                ></el-col>
            </el-row> -->
            <el-table
              :data="userTable" 
              border 
              row-key="id"
              style="margin: 0.75rem 0"
              :empty-text="userTableEmptyText"
               @selection-change="selectUserChange"
               ref="userTableRef"
            >
              <el-table-column
                type="selection"
                width="55"
                align="center"
              >
              </el-table-column>
              <el-table-column
                type="index"
                label="序号"
                align="center"
                width="50"
              ></el-table-column>
              <el-table-column
                prop="username"
                label="用户名"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="phone"
                label="联系方式"
                align="center"
              ></el-table-column>
            </el-table>
            <Pagination
              :page="userPageInfo.current"
              :size="userPageInfo.size"
              :total="userTotal"
              :key="userPageKey"
              @pagination="queryByUserPage"
            ></Pagination>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="selectUserDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmSelectUsers">确 定</el-button>
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
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import store from "@/store";
import moment from "moment";
import _ from "lodash"
import { modifyData } from "@/util/domainFilter";
import { getAnnouncementList, getAnnouncementById, editAnnouncementById, removeAnnouncementById, getUsersByDeptIds, addAnnouncement, publishAnnouncement, rollbackAnnouncement } from "@/api/sdc/announcementManage";
import{ fetchTree } from "@/api/admin/dept"

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
export default {
  components: {
    Pagination,
    quillEditor
  },
  data() {
    return {
      // 分页相关
      pageKey: Math.random().toString(36).slice(-6),
      page:1,
      size: 10,
      total: 0,
      // 查询条件
      searchTitle: '',
      searchSender: '',
      dueDate: '',
      queryCondition: {
        current: 1,
        size: 10,
        msgCategory: '1',
        descs: 'create_date'
      },
      pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
      },
      tableInfo: [],
      // 表单对话框表单相关
      dialogTitle: '',
      dialogFormVisible: false,
      inputForm: {
        title: '',
        msgCategory: '1',
        msgType: '',
        deptId: '',
        userNames: '',
        userIds: [],
        inputDueDate: '',
        msgContent: ''
      },
      editId: '',
      rules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" }
        ],
        msgCategory: [
          { required: true, message: "请选择公告分类"}
        ],
        msgType: [
          { required: true, message: "请选择通知类型", trigger: "blur" }
        ],
        userNames: [
          { required: true, message: "请选择接收用户", trigger: "change"}
        ],
        inputDueDate: [
          { required: true, message: "请选择有效期", trigger: "blur" }
        ],
        msgContent: [
          { required: true, message: "请输入公告内容", trigger: "blur" }
        ]
      },
      deptData: [],
      deptId: '',
      dialogKey: Math.random().toString(36).slice(-6),
      isdisabled: false,
      actionType: 1,
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction
            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['clean'],
            ['image']      
          ]
        },
        placeholder:'请输入内容'
      },
      // 公告内容对话框相关
      contentDialogVisible: false,
      anntDetail: {},
      // 选择用户对话框相关
      selectUserDialogVisible: false,
      searchUserName: '',
      userTable: [],
      userTableEmptyText: '加载中',
      userPageInfo: {
        current: 1,
        size: 5
      },
      userTotal: 0,
      userPageKey: Math.random().toString(36).slice(-6),
      firstDeptId: '',
      // 选择的部门id
      checkedDeptIds: [],
      selectedUsers: [],
      selectedUserIds: [],
      confirmDeptIds: [],
      btnType: 1,
       dialogColumnVisible: false,
      columnList: [
        {
          prop: 'title',
          label: '公告标题',
          show: true
        },
        {
          prop: 'sender',
          label: '发布人',
          show: true
        },
        {
          prop: 'sendTime',
          label: '发布时间',
          show: true
        },
        {
          prop: 'msgType',
          label: '发布对象',
          show: true
        },
        {
          prop: 'duration',
          label: '有效期',
          show: true
        },
        {
          prop: 'sendStatus',
          label: '状态',
          show: true
        }
      ]
    }
  },
  created() {
    this._getAnnouncementList(this.queryCondition)
  },
  computed: {
      contentViewHeight () {
        let height = this.$store.state.common.documentClientHeight - 122
        return {minHeight: height + 'px'}
      }
    },
  methods: {
    /**
     * 网络请求
     */
    _getAnnouncementList(condition) {
      getAnnouncementList(condition).then(res => {
        let data = res.data.data
        if (res.data.code === 0) {
          this.tableInfo = data.records
          this.total = data.total
          this.page = data.current
        }
      })
    },
   
    _getDeptList() {
      fetchTree().then(res => {
        if (res.data.code === 0) {
          this.deptData = modifyData(res.data.data)
          this.firstDeptId = this.deptData[0].id
          if (this.confirmDeptIds.length === 0) {
            this.$refs.leftTree.setCheckedKeys([this.firstDeptId])
            this.checkedDeptIds = [this.firstDeptId]
            this._getUsersByDeptIds(this.userPageInfo, this.checkedDeptIds)           
          } else {
            this.$refs.leftTree.setCheckedKeys(this.confirmDeptIds)
            this.checkedDeptIds = this.confirmDeptIds
            this._getUsersByDeptIds(this.userPageInfo, this.checkedDeptIds)
          }
        }
      })
    },
    _getUsersByDeptIds(params, data) {
      getUsersByDeptIds(params, data).then(res => {
        if (res.data.code === 0) {
          this.userTable = res.data.data.records
          this.userTotal = res.data.data.total
          if (this.userTable.length === 0) {
            this.userTableEmptyText = '暂无数据'
          }
          if (this.selectedUserIds.length > 0) {
            for (let k of this.userTable) {
              this.selectedUserIds.forEach(item => {
                if (k.userId == item) {
                  this.$nextTick(() => {
                    this.$refs.userTableRef.toggleRowSelection(k, true)
                  })
                  
                }
              })
            }
          }         
        }
      })
    },
    /**
     * 方法
     */ 
    setQueryCondition() {
      this.queryCondition = {
        current: 1,
        size: this.size,
        msgCategory: '1',
        descs: 'create_date'
      }
      this.searchTitle ? this.queryCondition.title = this.searchTitle : null
      this.searchSender ? this.queryCondition.sender = this.searchSender : null
      if(this.dueDate) {
        this.queryCondition['expand.sendTimeBegin'] = moment(this.dueDate[0]).format('YYYY-MM-DD HH:mm:ss')
        this.queryCondition['expand.sendTimeEnd'] = moment(this.dueDate[1]).format('YYYY-MM-DD HH:mm:ss')
      }
    },   
    queryInfoClick() {
      this.setQueryCondition()
      this._getAnnouncementList(this.queryCondition)
    },
    queryByPage(data) {
      this.page = data.page
      this.size = data.size
      this.queryCondition.current = this.page
      this.queryCondition.size = this.size
      this._getAnnouncementList(this.queryCondition)
    },
    clearCondition() {
      this.searchSender = ''
      this.searchTitle = ''
      this.dueDate = ''
      this.setQueryCondition()
      this._getAnnouncementList(this.queryCondition)
    },
    // 新增公告
    addInfo() {
      this.btnType = 2
      this.actionType = 1
      this.dialogFormVisible = true
      this.selectUserDisabled = true
      this.isdisabled = false
      this.dialogTitle = '新增公告'
    },
    chooseColumn() {
      this.dialogColumnVisible = true
    },
    mainPropClick(row) {
      this.actionType = 2
      this.btnType = 1
      this.isdisabled = true
      this.dialogTitle = '查看'
      getAnnouncementById(row.id).then(res => {
        if (res.data.code === 0) {
          let anntDetail = res.data.data[0]
          this.editId = row.id
          this.inputForm.title = anntDetail.title
          this.inputForm.msgCategory = anntDetail.msgCategory    
          this.inputForm.msgType = anntDetail.msgType    
          this.inputForm.userIds = anntDetail.userIds    
          this.inputForm.userNames = anntDetail.expand.userNames.join(',')
          this.inputForm.inputDueDate = [anntDetail.startTime, anntDetail.endTime]
          this.inputForm.msgContent = anntDetail.msgContent
          this.inputForm.sendStatus = anntDetail.sendStatus
          this.dialogFormVisible = true
        }
      }) 
    },
    enableEdit() {
      this.isdisabled = false
      this.btnType = 2
      this.dialogTitle = '编辑'
    },
    changeDept(val) {
      if(val.length > 0) {
        this.selectUserDisabled = false
      }
    },

    /**
     * 选择用户相关
     */
    selectUser() {
      if (this.btnType === 2 && this.actionType !== 1) {
        if (this.inputForm.userIds) {
          this.selectedUserIds = this.inputForm.userIds.split(',')
        }      
      }
      this._getDeptList()
      this.selectUserDialogVisible = true
    },
    handleCheckChange(data) {
      this.userPageInfo.current = 1
      this.checkedDeptIds = this.$refs.leftTree.getCheckedKeys()
      if (this.checkedDeptIds.length === 0) {
        this.userTable = []
        this.userTotal = 0
        this.userTableEmptyText = '暂无数据'
        return this.$message.warning('请至少选择一个部门')
      }
      this._getUsersByDeptIds(this.userPageInfo, this.checkedDeptIds)
    },
    selectUserChange(val) {
      this.selectedUsers = val
    },
    confirmSelectUsers() {
      if (this.selectedUsers.length === 0) {
        return this.$message.error('请至少选择一个用户')
      }
      let userNames = this.selectedUsers.map(item => item.username)
      this.selectedUserIds = this.selectedUsers.map(item => item.userId)
      this.inputForm.userIds = this.selectedUsers.map(item => item.userId).join(',')
      this.confirmDeptIds = this.checkedDeptIds
      this.inputForm.userNames = userNames.join(',')
      this.selectUserDialogVisible = false
    },
    // searchUserTable() {},  
    queryByUserPage(data) {
      this.userPageInfo.current = data.page
      this.userPageInfo.size = data.size
      this._getUsersByDeptIds(this.userPageInfo, this.checkedDeptIds)
    },
    userDialogClosed() {
      this.$refs.userTableRef.clearSelection()
    },
    clearUser() {},

    // 富文本获得焦点
    editorFocus(event) {
      if (this.btnType === 2) {
        event.enable(true)
      } else {
        event.enable(false)
      }
    },
    tableAction(row,flag) {
      if(flag === 2) {
        // 查看
        this.actionType = 2
        this.btnType = 1
        this.isdisabled = true
        this.dialogTitle = '查看'
        getAnnouncementById(row.id).then(res => {
          if (res.data.code === 0) {
            let anntDetail = res.data.data[0]
            this.inputForm.title = anntDetail.title
            this.inputForm.msgCategory = anntDetail.msgCategory    
            this.inputForm.msgType = anntDetail.msgType    
            this.inputForm.userIds = anntDetail.userIds    
            this.inputForm.userNames = anntDetail.expand.userNames.join(',')
            this.inputForm.inputDueDate = [anntDetail.startTime, anntDetail.endTime]
            this.inputForm.msgContent = anntDetail.msgContent
            this.inputForm.sendStatus = anntDetail.sendStatus
            this.dialogFormVisible = true
          }
        })           
      }
      if(flag === 3) {
        // 编辑        
        this.actionType = 3
        this.btnType = 2
        this.isdisabled = false
        this.dialogTitle = '编辑'
        this.editId = row.id
        getAnnouncementById(row.id).then(res => {
          if (res.data.code === 0) {
            let anntDetail = res.data.data[0]
            this.inputForm.title = anntDetail.title
            this.inputForm.msgCategory = anntDetail.msgCategory    
            this.inputForm.msgType = anntDetail.msgType    
            this.inputForm.userIds = anntDetail.userIds    
            this.inputForm.userNames = anntDetail.expand.userNames.join(',')
            this.inputForm.inputDueDate = [anntDetail.startTime, anntDetail.endTime]
            this.inputForm.msgContent = anntDetail.msgContent
            this.dialogFormVisible = true
          }
        })    
      }
      if(flag === 4) {
        // 发布
        let publishObj = {}
        publishObj.id = row.id
        publishAnnouncement(publishObj).then(res => {
          if (res.data.code === 0) {
            this.$message.success('发布成功')
            this._getAnnouncementList(this.queryCondition)
          }
        })
      }
      if(flag === 5) {
        // 撤销
        let dataObj = {}
        dataObj.id = row.id
        rollbackAnnouncement(dataObj).then(res => {
          if (res.data.code === 0) {
            this.$message.success('撤销成功')
            this._getAnnouncementList(this.queryCondition)
          }
        })
      }
      if (flag === 6) {
        // 删除
        this.$confirm('确定删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeAnnouncementById(row.id).then(res => {
            if (res.data.code === 0) {
              this.$message.success('删除成功')
              this._getAnnouncementList(this.queryCondition)
            }
          })
        }).catch(() => {})
      }
    },
    submitForm() {
      this.$refs.inputFormRef.validate((valid) => {
        if (valid) {
          let submitData = {}
          submitData.title = this.inputForm.title
          submitData.msgCategory = this.inputForm.msgCategory
          submitData.msgType = this.inputForm.msgType         
          
          submitData.startTime = moment(this.inputForm.inputDueDate[0]).format('YYYY-MM-DD HH:mm:ss')
          submitData.endTime = moment(this.inputForm.inputDueDate[1]).format('YYYY-MM-DD HH:mm:ss')
          submitData.msgContent = this.inputForm.msgContent
          this.selectUserDialogVisible = false
          if (this.actionType === 1) {
            // 新增
            submitData.userIds = this.selectedUserIds.join(',') 
            addAnnouncement(submitData).then(res => {
              if (res.data.code === 0) {
                this.$message.success('添加成功')
                this.dialogFormVisible = false
                this._getAnnouncementList(this.queryCondition)
              }
            })
          } else {
            submitData.userIds = this.selectedUserIds.length > 0 ? this.selectedUserIds.join(',') : this.inputForm.userIds
            submitData.id = this.editId
            editAnnouncementById(submitData).then(res => {
              if (res.data.code === 0) {
                this.$message.success('编辑成功')
                this.dialogFormVisible = false
                this._getAnnouncementList(this.queryCondition)
              }
            })
          }
        }
      })
    },
    refreshData() {
      this.$refs.inputFormRef.resetFields()
      this.inputForm.title = ''
      this.inputForm.msgCategory = '1'
      this.inputForm.msgType = ''
      this.inputForm.deptId = ''
      this.inputForm.userNames = ''
      this.inputForm.userIds = []
      this.inputForm.inputDueDate = ''
      this.inputForm.msgContent = ''
      this.inputForm.sendTime = ''
      this.inputForm.cancelTime = ''
      this.inputForm.inputDueDate  = ''
      this.selectedUserIds = []
    },
    // 获取数据词典值
    setMsgType(val) {
      let msgTypeMap = this.$dictUtils.getDictList('ann_msg_type'),
          text = ''
      for (let index = 0; index < msgTypeMap.length; index++) {
        const el = msgTypeMap[index];
        if (el.value === val.msgType) {
          text = el.label
          break;
        }
      }
      return text
    }
  }
}
</script>

<style lang="scss" scoped>
.add-btn {
  margin-top: 20px;
}
.box-card {
  .header-title {
    margin: 10px;
    font-size: 18px;
  }
  .header-info {
    margin-left: 10px;
    span {
      margin-right: 5px;
    }
  }
  .ad-msgContent {
    margin-left: 10px;
    font-size: 16px;
  }
}
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
.el-dropdown-menu__item {
  font-size: 14px !important;
  line-height: 28px !important;
}
.msgcontent-formitem {
  height: 400px;
  .quill-editor {
    height: 300px;
    // overflow: hidden;
  }
}
</style>