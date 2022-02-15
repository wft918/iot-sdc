<template>
  <div>
    <basic-container>
      <el-tabs v-model="activePane">
        <el-tab-pane label="列表展示" name="1">          
          <el-row :gutter="15" class="search-area">
            <el-col :span="10" :offset="1">
              <span>所属园区：</span>
              <el-select v-model="campusId" placeholder="请选择" @change="changeCampus">
                <el-option style="width:100%" 
                  v-for="item in campusList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-button type="primary" @click="resetTable" class="search-btn" size="small">
                <i class="el-icon-refresh"></i> 重置
              </el-button>
            </el-col>
            <el-col :span="10" :offset="3">
              <el-button type="primary" @click="addInfo" size="small">
                <i class="el-icon-plus"></i> 新增
              </el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="small"
                @click="removePerson"
                :disabled="removeFlag"
                >删除</el-button
              >
              <el-button size="small">导入</el-button>
              <el-button size="small">导出</el-button>
            </el-col>
            <el-col :span="24">
              <el-table 
                :data="personTable" 
                border 
                row-key="id"
                style="margin: 0.75rem 0"
                :empty-text="personEmptyText"
                @selection-change="tableSelectionChange"
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
                  width="50"
                  align="center"
                  sortable
                ></el-table-column>
                <el-table-column
                  prop="name"
                  label="姓名"
                  align="center"
                ></el-table-column>
                <el-table-column
                  label="所属园区"
                  align="center"
                  width="120"
                >
                  <template slot-scope="scope">
                    <span>{{scope.row.expand.siteName}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="性别"
                  align="center"
                  width="60"
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.sex === '0'">男</span>
                    <span v-else>女</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="phone"
                  label="联系方式"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="remarks"
                  label="说明"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="updateDate"
                  label="修改时间"
                  align="center"
                  width="160"
                ></el-table-column>
                <el-table-column
                  prop="updateBy"
                  label="修改人"
                  align="center"
                ></el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  label="人脸图片"
                  align="center">
                  <template slot-scope="scope" v-if="scope.row.imgPath">
                    <el-popover
                      class="table-face-pic"
                      placement="right"
                      trigger="hover">
                    <el-image :src="scope.row.imgPath" fit="contain" class="pop-pic"></el-image>
                    <img slot="reference" :src="scope.row.imgPath" class="table-face-pic">
                </el-popover>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="180">
                    <template slot-scope="scope">
                      <span class="table-action" @click="tableAction(scope.row, 2)"
                        >编辑</span
                      >
                      <span class="table-action" @click="tableAction(scope.row, 3)"
                        >查看</span
                      >
                      <span class="table-action" @click="tableAction(scope.row, 4)"
                        >删除</span
                      >
                    </template>
                </el-table-column>
              </el-table>
              <Pagination
                :page="pageInfo.page"
                :size="pageInfo.size"
                :total="pageInfo.total"
                :key="pageKey"
                @pagination="queryByPage"
              ></Pagination>
            </el-col>
          </el-row>
          <el-dialog
            :visible.sync="formDialogVisible"
            width="35%"
            ref="formDialogRef"
            :close-on-click-modal="false"
            :title="dialogTitle"
            @closed="inputFormClosed"
          >
            <el-form
              :model="inputForm"
              label-width="120px"
              ref="inputFormRef"
              :key="inputFormKey"
              :disabled="isdisabled"
              :rules="inputFormRules"
            >
              <el-form-item label="姓名" prop="name">
                <el-input v-model="inputForm.name"></el-input>
              </el-form-item>
              <el-form-item label="所属园区" prop="siteId">
                <el-select v-model="inputForm.siteId" placeholder="请选择">
                  <el-option style="width:100%" 
                    v-for="item in campusList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="性别" prop="sex">
                  <el-radio v-model="inputForm.sex" label="0">男</el-radio>
                  <el-radio v-model="inputForm.sex" label="1">女</el-radio>
              </el-form-item>
              <el-form-item label="身份证号" prop="cardNo">
                <el-input v-model="inputForm.cardNo"></el-input>
              </el-form-item>
              <el-form-item label="联系方式" prop="phone">
                <el-input v-model="inputForm.phone"></el-input>
              </el-form-item>
              <el-form-item label="说明" prop="remarks">
                <el-input v-model="inputForm.remarks"></el-input>
              </el-form-item>
              <el-form-item label="人脸图片" prop="imgPath">
                <div v-if="actionType === 3">
                  <el-image
                    style="width: 200px; height: 200px"
                    :src="inputForm.imgPath"
                    :preview-src-list="[inputForm.imgPath]"
                    fit="fill"></el-image>
                </div>
                <div v-else-if="actionType === 2">
                  <el-row class="editForm-btn"> 
                    <el-button :type="!isEditUpload ? 'primary' : 'success'" size="mini" @click="editUploadClick" class="upload-btn">{{!isEditUpload ? '修改图片' : '完成'}}</el-button>               
                  </el-row>             
                  <el-image
                    v-if="!isEditUpload"
                    class="editFormImg"
                    :src="inputForm.imgPath"
                    fit="fill"></el-image>
                  <el-upload
                    v-else
                    action="/facedetect-sdc/sdc-fdfile/upload"
                    :headers="headers"
                    :multiple="false"
                    :limit="1"
                    list-type="picture-card"
                    ref="editUploadRef"
                    :before-upload="beforeAvatarUpload"
                    :on-success="handleAvatarSuccess" 
                  >
                    <i class="el-icon-plus"></i>
                  </el-upload>
                </div> 
                      
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <template v-if="actionType === 3">
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
          <!-- 添加人员对话框 -->
          <el-dialog
            :visible.sync="addDialogVisible"
            width="35%"
            ref="addDialogRef"
            :close-on-click-modal="false"
            @closed="refreshAddFormData"
            title="新增"
          >
            <el-form
              :model="addForm"
              label-width="120px"
              ref="addFormRef"
              :key="addFormKey"
              :rules="inputFormRules"
            >
              <el-form-item label="姓名" prop="name">
                <el-input v-model="addForm.name"></el-input>
              </el-form-item>
              <el-form-item label="所属园区" prop="siteId">
                <el-select v-model="addForm.siteId" placeholder="请选择">
                  <el-option style="width:100%" 
                    v-for="item in campusList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="性别" prop="sex">
                  <el-radio v-model="addForm.sex" label="0">男</el-radio>
                  <el-radio v-model="addForm.sex" label="1">女</el-radio>
              </el-form-item>
              <el-form-item label="身份证号" prop="cardNo">
                <el-input v-model="addForm.cardNo"></el-input>
              </el-form-item>
              <el-form-item label="联系方式" prop="phone">
                <el-input v-model="addForm.phone"></el-input>
              </el-form-item>
              <el-form-item label="说明" prop="remarks">
                <el-input v-model="addForm.remarks"></el-input>
              </el-form-item>
              <el-form-item label="人脸图片" prop="imgPath">             
                  <el-upload
                    action="/facedetect-sdc/sdc-fdfile/upload"
                    :headers="headers"
                    :multiple="false"
                    :limit="1"
                    list-type="picture-card"
                    ref="uploadRef"
                    :before-upload="beforeAvatarUpload"
                    :on-success="handleAddAvatarSuccess"
                    :on-exceed="handleExceed"
                  >
                    <i class="el-icon-plus"></i>
                  </el-upload>              
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">        
              <template>
                <el-button @click="addDialogVisible = false" size="small"
                  >取消</el-button
                >
                <el-button type="primary" @click="submitAddForm" size="small"
                  >保存</el-button
                >
              </template>
            </span>
          </el-dialog>
        </el-tab-pane>
        <el-tab-pane label="卡片展示" name="2">
          <el-row :gutter="15" class="search-area">
            <el-col :span="24" :offset="1">
              <span>所属园区：</span>
              <el-select v-model="cardCampusId" placeholder="请选择" @change="cardChangeCampus">
                <el-option style="width:100%" 
                  v-for="item in campusList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-button type="primary" @click="resetCards" class="search-btn" size="small">
                <i class="el-icon-refresh"></i> 重置
              </el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4" v-for="item in personCards" :key="item.id" class="card-item">
              <el-card :body-style="{ padding: '0px' }">
                <el-image :src="item.imgPath" class="card-item-image"></el-image>
                <div style="padding: 14px;">
                  <span>{{item.name}}</span>
                  <span class="center-text">{{item.sex === 0 ? '男' : '女'}}</span>
                  <span>{{item.expand.siteName}}</span>
                  <div class="bottom clearfix">
                    <span v-if="item.phone">{{item.phone}}</span>
                    <span v-else>未上传联系方式</span>
                    <el-button type="text" class="card-item-button" @click="detailInfo(item)">详情>></el-button>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <Pagination
            :page="cardPage.page"
            :size="cardPage.size"
            :total="cardPage.total"
            :key="cardPageKey"
            @pagination="CardQueryByPage"
          ></Pagination>
          <!-- 详情 -->
          <el-dialog
            :visible.sync="detailDialogVisible"
            width="35%"
            ref="detailDialogRef"
            :close-on-click-modal="false"
            title="详情"
            @closed="detailDialogClosed"
          >
            <el-form
              :model="detailForm"
              label-width="120px"
              ref="detailFormRef"
              :key="detailFormKey"
              disabled
            >
              <el-form-item label="姓名" prop="name">
                <el-input v-model="detailForm.name"></el-input>
              </el-form-item>
              <el-form-item label="所属园区" prop="siteId">
                <el-select v-model="detailForm.siteId" placeholder="请选择">
                  <el-option style="width:100%" 
                    v-for="item in campusList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="性别" prop="sex">
                  <el-radio v-model="detailForm.sex" label="0">男</el-radio>
                  <el-radio v-model="detailForm.sex" label="1">女</el-radio>
              </el-form-item>
              <el-form-item label="身份证号" prop="cardNo">
                <el-input v-model="detailForm.cardNo"></el-input>
              </el-form-item>
              <el-form-item label="联系方式" prop="phone">
                <el-input v-model="detailForm.phone"></el-input>
              </el-form-item>
              <el-form-item label="说明" prop="remarks">
                <el-input v-model="detailForm.remarks"></el-input>
              </el-form-item>
              <el-form-item label="人脸图片" prop="imgPath">
                  <el-image
                    style="width: 200px; height: 200px"
                    :src="detailForm.imgPath"
                    :preview-src-list="[detailForm.imgPath]"
                    fit="fill"></el-image>                      
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <template>
                <el-button
                  type="primary"
                  @click="detailDialogVisible = false"
                  size="small"
                  >关闭</el-button
                >
              </template>
            </span>
          </el-dialog>
        </el-tab-pane>
      </el-tabs>
    </basic-container>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";

import { sdcSiteAction} from "@/api/sdc/addressInfo";
import { getPersonList, addPerson, editPerson, deletePerson, getPersonBySiteId } from "@/api/sdc/personInfo"
import { modifyData } from "@/util/domainFilter";
import _ from 'lodash'
import store from '@/store'
import validators from "@/utils/validator"

export default {
  components: {
    Pagination,
  },
  data() {
    return {
      activePane: '1',
      personTable: [],
      personCards: [],
      tableSelections: [],
      formDialogVisible: false,
      dialogTitle: null,
      // 分页信息
      // 表格
      pageInfo: {
        page: 1,
        size: 10,
        total: 0,
      },
      // 卡片
      cardPage: {
        page: 1,
        size: 10,
        total: 0,
      },
      pageKey: Math.random().toString(36).slice(-6),
      cardPageKey: Math.random().toString(36).slice(-6),
      // 编辑或查看表单
      inputForm: {},
      inputFormRules: {
        name: [
          {required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        siteId: [
          {required: true, message: '请选择所属园区'}
        ],
        sex: [
          {required: true, message: '请选择性别'}
        ],
        cardNo: [
          {validator: validators.isCardId, trigger: 'blur'}
        ],
        phone: [
          {validator: validators.isMobile, trigger: 'blur'}
        ],
        remarks: [
           {required: true, message: '请输入说明', trigger: 'blur'}
        ],
        imgPath: [
          {required: true, message: '请上传人脸图片'}
        ]
      },
      inputFormKey: Math.random().toString(36).slice(-6),
      // 添加人员表单
      addForm: {},
      addDialogVisible: false,
      addFormKey: Math.random().toString(36).slice(-6),
      isdisabled: false,
      // 按园区查询参数
      campusId: null,
      cardCampusId: null,
      campusList: [],
      // // 对话框类型,1为新增，2为修改，3为查看
      actionType: null,
      // 图片预览
      picPreviewVisible: false,
      dialogImageUrl: '',
      personEmptyText: '数据加载中...',
      // 文件上传请求头
      headers: {
        Authorization: "Bearer " + store.getters.access_token
      },
      uploadImgUrl: '',
      isEditUpload: false,
      // 卡片详情
      detailDialogVisible: false,
      detailForm: {},
      detailFormKey: Math.random().toString(36).slice(-6),


    };
  },
  computed: {
    removeFlag() {
      return this.tableSelections.length === 0
    }
  },
  created() {
    this.init()
    this._getPersonList(this.pageInfo.page, this.pageInfo.size)
    this._getListForCard(this.cardPage.page, this.cardPage.size)
  },
  methods: {
    async init() {
      //获取初始区域查询条件数据
      let data = await sdcSiteAction('','/tree','get')
      this.campusList = modifyData(data.data.data)
    },
    _getPersonList(current, size) {
      getPersonList(current, size).then(res => {
        let data = res.data.data
        if (res.data.code === 0) {
          this.personTable = data.records
          this.pageInfo.total = data.total
          if (this.personTable.length === 0) {
            this.personEmptyText = '暂无数据'
          }
        }
      })
    },
    // 给卡片列表赋值
    _getListForCard(current, size) {
      getPersonList(current, size).then(res => {
        let data = res.data.data
        if (res.data.code === 0) {
          this.personCards = data.records
          this.cardPage.total = data.total
        }
      })
    },
    // 根据园区id获取人员列表
    _getPersonBySiteId(page, size, siteId) {
      getPersonBySiteId(page, size, siteId).then(res => {
          if (res.data.code === 0) {
            let data = res.data.data
            this.personTable = data.records
            this.pageInfo.total = data.total
            if (this.personTable.length === 0) {
              this.personEmptyText = '暂无数据'
            }
          } else {
            return this.$message.error({message: '查询出错，请重试', center: true})
          }
        })
    },
    // 根据园区id获取卡片列表
    _getCardListBySiteId(page, size, siteId) {
      getPersonBySiteId(page, size, siteId).then(res => {
          if (res.data.code === 0) {
            let data = res.data.data
            this.personCards = data.records
            this.cardPage.total = data.total
          } else {
            return this.$message.error({message: '查询出错，请重试', center: true})
          }
        })
    },
    // 点击tab栏
    // handleTabClick(tab, event) {
    //   if (tab.index === '1') {
    //     this._getPersonList(this.pageInfo.page, this.pageInfo.size)
    //   } else {
    //     this._getListForCard(this.cardPage.page, this.cardPage.size)
    //   }
    // },
    // 园区选择变化
    changeCampus() {
      this.pageInfo.page = 1
      this._getPersonBySiteId(this.pageInfo.page, this.pageInfo.size, this.campusId)
    },
    cardChangeCampus() {
      this.cardPage.page  = 1
      this._getCardListBySiteId(this.cardPage.page, this.cardPage.size, this.cardCampusId)
    },
    // 点击新增
    addInfo() {
      this.init()
      this.addDialogVisible = true
    },
    
    // 点击重置
    resetTable() {
      this.campusId = null
      this._getPersonList(this.pageInfo.page, this.pageInfo.size)
    },
    resetCards() {
      this.cardCampusId = null
      this._getListForCard(this.cardPage.page, this.cardPage.size)
    },
    // 点击删除
    removePerson() {
       this.$confirm('是否确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tableSelections.forEach(item => {
            deletePerson(item.id)
          })
          this.$message.success({message: '删除成功,请点击重置刷新列表', center: true})
          this._getPersonList(this.pageInfo.page, this.pageInfo.size)
        }).catch(() => {})
    },
    // 表格项选中
    tableSelectionChange(val) {
      this.tableSelections = val
    },
    tableAction(data, flag) {
      if (flag === 2) {
        // 点击编辑时
        this.actionType = 2
        this.dialogTitle = '编辑'
        this.isdisabled = false
        let dataCD = _.cloneDeep(data)
        this.inputForm = dataCD
        this.formDialogVisible = true
      }
      if (flag === 3) {
        // 点击查看时
        this.actionType = 3
        this.dialogTitle = '查看'
        this.isdisabled = true
        let dataCD = _.cloneDeep(data)
        this.inputForm = dataCD
        this.formDialogVisible = true
      }
      if (flag === 4) {
        // 点击删除时
        this.deleteId = data.id
        this.deleteDialogVisible = true
        this.$confirm('是否确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deletePerson(this.deleteId).then(res => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            this._getPersonList(this.pageInfo.page, this.pageInfo.size)  
            } else {
              return this.$message.error('删除数据时出错，请重试')
            }
          })          
        }).catch(() => {});
      }
    },
    // 分页器事件
    // 表格
    queryByPage(pageInfo) {
      this.pageInfo.page = pageInfo.page
      this.pageInfo.size = pageInfo.size
      if (this.campusId === null) {
        this._getPersonList(this.pageInfo.page, this.pageInfo.size)
      } else {
        this._getPersonBySiteId(this.pageInfo.page, this.pageInfo.size, this.campusId)
      }      
    },
    // 卡片
    CardQueryByPage(pageInfo) {
      this.cardPage.page = pageInfo.page
      this.cardPage.size = pageInfo.size
      if (this.cardCampusId === null) {
        this._getListForCard(this.cardPage.page, this.cardPage.size)
      } else {
        this._getCardListBySiteId(this.cardPage.page, this.cardPage.size, this.cardCampusId)
      }
    },
    // 关闭对话框后重置表单
    inputFormClosed() {
      this.$refs.inputFormRef.resetFields()
    },
    refreshAddFormData() {
      this.$refs.addFormRef.resetFields()
      this.$refs.uploadRef.clearFiles()
    },  
    // 点击保存
    submitAddForm() {
        // 添加
        this.$refs.addFormRef.validate(valid => {
          if (valid) {
            addPerson(this.addForm).then(res => {
              if (res.data.code === 0) {
                this.$message.success({message: '添加成功', center: true})
                this._getPersonList(this.pageInfo.page, this.pageInfo.size)
                this.addDialogVisible = false
              }
            })
          }
        })
    },
    submitForm() {
      
      if (this.actionType === 2) {
        // 编辑
        this.$refs.inputFormRef.validate(valid => {
          if (valid) {
            let siteId = null
            if ((typeof this.inputForm.siteId)=== 'string') {
              siteId = this.inputForm.siteId
            } else {
              siteId = this.inputForm.siteId[this.inputForm.siteId.length - 1]
            }
            let editForm = {}
            editForm.id = this.inputForm.id
            editForm.name = this.inputForm.name
            editForm.siteId = siteId
            editForm.sex = this.inputForm.sex
            editForm.cardNo = this.inputForm.cardNo
            editForm.phone = this.inputForm.phone
            editForm.remarks = this.inputForm.remarks
            editForm.imgPath = this.inputForm.imgPath
            editPerson(editForm).then(res => {
              if (res.data.code === 0) {
                this.$message.success({message: '操作成功', center: true})
                this._getPersonList(this.pageInfo.page, this.pageInfo.size)
                this.formDialogVisible = false
              } else {
                return this.$message.error({message: '操作失败，请重试', center: true})
              }
            })
              }
            })
      }
    },
    // 图片上传事件
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt1M = file.size / 1024 / 1024 <= 1;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt1M) {
        this.$message.error('上传头像图片大小不能超过 1MB!');
      }
      const _this = this;
      const isSize = new Promise(function(resolve, reject) {
        let minWidth = 100,
            minHeight = 100,
            maxWidth = 1280,
            maxHeight = 720
        const img = new Image();
        const _URL = window.URL || window.webkitURl;
        img.onload = function() {
          const valid = (img.width >= minWidth && img.width <= maxWidth) && (img.height >= minHeight && img.height <= maxHeight);//上传图片尺寸判定
          valid ? resolve() : reject(new Error('error'));
        };
        img.src = _URL.createObjectURL(file);
      }).then(
        () => {return file;},
        () => {
            _this.$message.error('上传图片尺寸必须为100*100 ~ 1280*720');
            return Promise.reject(new Error('error'));
            }
        );
      return isJPG && isLt1M && isSize
    },
    // 点击修改图片
    editUploadClick() {
      this.isEditUpload = !this.isEditUpload
    },
    handleAvatarSuccess(res, file) {     
      this.inputForm.imgPath = res.data.url
    },
    handleAddAvatarSuccess(res) {
      this.addForm.imgPath = res.data.url
    },
    handleExceed() {
      this.$message.warning({message: '超过图片上传数量限制', center: true})
    },
    // 卡片详情
    detailInfo(item) {
      let itemCD = _.cloneDeep(item)
      this.detailForm = itemCD
      this.detailDialogVisible = true
    },
    detailDialogClosed() {
      this.$refs.detailFormRef.resetFields()
    }
  },
    
};
</script>

<style lang="scss" scoped>
.search-area {
  margin-top: 20px;
}
.search-btn {
  margin-left: 15px;
}
/deep/ .el-input.is-disabled .el-input__inner {
    color: #333;
  }
.upload-btn {
  margin-bottom: 15px;
}
.editFormImg {
  width: 148px;
  height: 148px;
}
.editForm-btn {
  margin-bottom: 15px;
}
.el-form .el-select {
  width: 100%;
}
.table-face-pic {
  height: 50px;
  width:50px;
}
.pop-pic {
  width: 350px;
  height: 350px;
}
.card-item {
  width: 220px;
  height: 320px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin: 20px 10px;
}
.center-text {
  margin-left: 8px;
  margin-right: 8px;
}
.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.card-item-button {
  padding: 0;
  float: right;
}

.card-item-image {
  width: 220px;
  height: 220px;
  display: block;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both
}
</style>