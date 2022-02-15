<template>
  <div>
    <basic-container>
      <!-- 搜索区 -->
      <el-row :gutter="20" class="search-area">
        <el-col :span="8" :offset="1">
          <span>所属园区：</span>
          <el-select v-model="siteId" placeholder="请选择" @change="changeSite">
            <el-option style="width:100%" 
              v-for="item in siteData"
              :key="item.code"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
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
        </el-col>
        <el-col :span="1">
          <el-tooltip effect="dark" content="显隐" placement="top">
            <el-button circle="" @click="chooseColumn" size="small" icon="el-icon-menu"></el-button>
          </el-tooltip>
        </el-col>
      </el-row>
      <!-- 列表 -->
      <el-table 
        :data="tableData" 
        border 
        row-key="id"
        style="margin: 0.75rem 0"
        @selection-change="selectionChange"
        :empty-text="emptyText"
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
          v-if="columnList[0].show"
          prop="name"
          label="规则名称"
          header-align="center"
          width="300"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-link :underline="false" type="primary" @click="mainPropClick(scope.row)">{{scope.row.name}}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          v-if="columnList[1].show"
          prop="expand.siteName"
          label="所属园区"
          align="center"
          width="160"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          v-if="columnList[2].show"
          label="启用状态"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            <el-switch
              :value="scope.row.status"
              @change="statusChange(scope.row.status,scope.row)"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          v-if="columnList[3].show"
          :formatter="setCapacityType"
          label="容量类型"
          align="center"
          width="160"
          show-overflow-tooltip
        >
          <template></template>
        </el-table-column>
        <el-table-column
          v-if="columnList[4].show"
          label="目标区域"
          header-align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-if="scope.row.expand.capacityRuleTargets">{{scope.row.expand.capacityRuleTargets | targetNamesFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="columnList[5].show"
          prop="updateDate"
          label="修改时间"
          align="center"
          width="180"
        ></el-table-column>
        <el-table-column
          v-if="columnList[6].show"
          prop="updateBy"
          label="修改人"
          align="center"
          width="120"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" align="center" width="140">
          <template slot-scope="scope">
            <!-- <span class="table-action" @click="tableAction(scope.row, 2)"
              >查看</span
            >
            <span class="table-action" @click="tableAction(scope.row, 3)"
              >编辑</span
            > -->
            <!-- <span class="table-action" @click="tableAction(scope.row, 4)"
              >删除</span
            > -->
            <span class="table-action" @click="tableAction(scope.row, 4)"
              >关联目标</span
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
      <!-- 表单dialog -->
      <el-dialog
        :visible.sync="formDialogVisible"
        width="40%"
        ref="formDialogRef"
        :close-on-click-modal="false"
        @closed="refreshData"
        :title="dialogTitle"
        v-dialogDrag
      >
        <el-form
          :model="inputForm"
          label-width="120px"
          :rules="inputFormRules"
          ref="inputFormRef"
          :key="inputFormKey"
          :disabled="isdisabled"
        >
          <el-form-item label="规则名称" prop="name">
            <el-input v-model="inputForm.name"></el-input>
          </el-form-item>
          <el-form-item label="规则类别" prop="type">
            <el-radio-group v-model="inputForm.type">
              <el-radio v-for="item in capacityType" :key="item.value" :label="item.value">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
            <!-- <el-form-item prop="threshold"> -->
              <!-- 一级警告 -->
          <el-form-item>
            <el-row :gutter="15" class="warn-level">
              <el-col :span="8">
                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-form-item>
                      <el-switch
                        v-model="inputForm.thresholdOneStatus"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        active-value="1"
                        inactive-value="0">
                      </el-switch>
                    </el-form-item>                   
                  </el-col>
                  <el-col :span="8">
                    <span>一级门限</span>
                  </el-col>
                  <el-col :span="8" class="warn-level1">
                    <span>一级警告</span>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="16">
                <el-row>
                  <el-col :span="9">                      
                    <el-form-item prop="thresholdOneLower">
                      <span>下限&gt;=</span>
                      <el-input style="width: 60%" v-model="inputForm.thresholdOneLower"></el-input>
                    </el-form-item>                                
                  </el-col>
                  <el-col :span="5" style="text-align: center;">
                    <el-form-item>
                      <el-select v-model="inputForm.thresholdOneOperator">
                      <el-option label="并且" value="0"></el-option>
                      <el-option label="或者" value="1"></el-option>
                    </el-select>
                  </el-form-item>                  
                  </el-col>
                  <el-col :span="9">
                    <el-form-item prop="thresholdOneHigher">
                      <span>上限&lt;=</span>                 
                      <el-input style="width: 60%" v-model="inputForm.thresholdOneHigher"></el-input>
                    </el-form-item>                   
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-form-item>
          <!-- 二级警告 -->
          <el-form-item>
            <el-row :gutter="15" class="warn-level">
              <el-col :span="8">
                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-form-item>
                      <el-switch
                        v-model="inputForm.thresholdTwoStatus"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        active-value="1"
                        inactive-value="0">
                      </el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <span>二级门限</span>
                  </el-col>
                  <el-col :span="8" class="warn-level2">
                    <span>二级警告</span>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="16">
                <el-row>
                  <el-col :span="9">
                    <el-form-item prop="thresholdTwoLower">
                      <span>下限&gt;=</span>                 
                      <el-input style="width: 60%" v-model="inputForm.thresholdTwoLower"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5" style="text-align: center;">
                    <el-form-item>
                      <el-select v-model="inputForm.thresholdTwoOperator">
                        <el-option label="并且" value="0"></el-option>
                        <el-option label="或者" value="1"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item prop="thresholdTwoHigher">
                      <span>上限&lt;=</span>                 
                      <el-input style="width: 60%" v-model="inputForm.thresholdTwoHigher"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-form-item>
          <!-- 三级警告 -->
          <el-form-item prop="thresholdThree">
            <el-row :gutter="15" class="warn-level">
              <el-col :span="8">
                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-form-item>
                      <el-switch
                        v-model="inputForm.thresholdThreeStatus"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        active-value="1"
                        inactive-value="0">
                      </el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <span>三级门限</span>
                  </el-col>
                  <el-col :span="8" class="warn-level3">
                    <span>三级警告</span>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="16">
                <el-row>
                  <el-col :span="9">
                    <el-form-item prop="thresholdThreeLower">
                      <span>下限&gt;=</span>                 
                      <el-input style="width: 60%" v-model="inputForm.thresholdThreeLower"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5" style="text-align: center;">
                    <el-form-item>
                      <el-select v-model="inputForm.thresholdThreeOperator">
                        <el-option label="并且" value="0"></el-option>
                        <el-option label="或者" value="1"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item prop="thresholdThreeHigher">
                      <span>上限&lt;=</span>                 
                      <el-input style="width: 60%" v-model="inputForm.thresholdThreeHigher"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-form-item>
          <!-- 四级警告 -->
          <el-form-item prop="thresholdFour">
            <el-row :gutter="15" class="warn-level">
              <el-col :span="8">
                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-form-item>
                      <el-switch
                        v-model="inputForm.thresholdFourStatus"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        active-value="1"
                        inactive-value="0">
                      </el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <span>四级门限</span>
                  </el-col>
                  <el-col :span="8" class="warn-level4">
                    <span>四级警告</span>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="16">
                <el-row>
                  <el-col :span="9">
                    <el-form-item prop="thresholdFourLower">
                      <span>下限&gt;=</span>                 
                      <el-input style="width: 60%" v-model="inputForm.thresholdFourLower"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5" style="text-align: center;">
                    <el-form-item>
                      <el-select v-model="inputForm.thresholdThreeOperator">
                        <el-option label="并且" value="0"></el-option>
                        <el-option label="或者" value="1"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item prop="thresholdFourHigher">
                      <span>上限&lt;=</span>                 
                      <el-input style="width: 60%" v-model="inputForm.thresholdFourHigher"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-form-item>
          <!-- </el-form-item> -->
          <el-form-item label="备注" prop="remarks">
            <el-input type="textarea" v-model="inputForm.remarks"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <template v-if="actionType === 2">
            <el-button
              @click="formDialogVisible = false"
              size="small"
              >关闭</el-button
            >
            <el-button v-if="btnType === 1" type="primary" @click="enableEdit" size="small"
            >编辑</el-button>
            <el-button v-if="btnType === 2" type="primary" @click="submitForm" size="small"
            >保存</el-button>
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
      <!-- 关联dialog -->
      <el-dialog
        :visible.sync="reDialogVisible"
        width="40%"
        ref="targetDialogRef"
        :close-on-click-modal="false"
        title="选择此预警规则生效的区域范围"
        @closed="reDialogClosed"
        v-dialogDrag
      >
        <el-form
          :model="targetForm"
          label-width="120px"
          :rules="targetFormRules"
          ref="targetFormRef"
          :key="targetFormKey"
        >
          <el-form-item label="生效范围" prop="targetId">
            <el-cascader
              ref="effect"
              :options="targetSite"
              style="width: 80%"
              v-model="targetForm.targetId"
              clearable
              filterable
              @change="selectAddress"
              :props="{
                checkStrictly: false,
                value: 'id',
                label: 'name',
                children: 'children',
                multiple: true,
              }"
            >
            </el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="reDialogVisible = false" size="small"
            >取消</el-button
          >
          <el-button type="primary" @click="submitReInfo" size="small"
            >保存</el-button
          >
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
import { getRuleList, addRule, editRule, removeRule, switchStatus, reTarget } from "@/api/sdc/capacityManage"
import { sdcSiteAction} from "@/api/sdc/addressInfo";
import { modifyData } from "@/util/domainFilter";
import { getFirstChild } from "@/util/getFirstChild";
import _ from 'lodash'

export default {
  components: {
    Pagination,
  },
  data() {
    return {
      // 搜索框相关
      siteData: [],
      siteId: null,
      firstChild: [],
      // 分页相关
      pageInfo: {
        page: 1,
        size: 10,
        total: 0
      },
      pageKey: Math.random().toString(36).slice(-6),
      queryCondition: {
        current: 1,
        size: 10
      },
      // 表格相关
      tableData: [],
      emptyText: '数据加载中...',
      selections: [],
      // 新增、查看、编辑对话框相关
      formDialogVisible: false,
      dialogTitle: '',
      actionType: null,
      // 新增、查看、编辑表单相关
      capacityType: this.$dictUtils.getDictList('capacity_type'),      
      inputForm: {
        thresholdOneStatus: '1',
        thresholdTwoStatus: '1',
        thresholdThreeStatus: '1',
        thresholdFourStatus: '1',
        thresholdOneOperator: '0',
        thresholdTwoOperator: '0',
        thresholdThreeOperator: '0',
        thresholdFourOperator: '0',
        type: '1',
        status: '0'
      },
      inputFormRules: {
        name: [
          {required: true, message: '请输入规则名称', trigger: 'blur' }
        ],
        type: [
          {required: true}
        ],
        thresholdOneLower: [
          {required: true, message: '请输入下限值', trigger: 'blur'}
        ],
        thresholdOneHigher: [
          {required: true, message: '请输入上限值', trigger: 'blur'}
        ],
        thresholdTwoLower: [
          {required: true, message: '请输入下限值', trigger: 'blur'}
        ],
        thresholdTwoHigher: [
          {required: true, message: '请输入上限值', trigger: 'blur'}
        ],
        thresholdThreeLower: [
          {required: true, message: '请输入下限值', trigger: 'blur'}
        ],
        thresholdThreeHigher: [
          {required: true, message: '请输入上限值', trigger: 'blur'}
        ],
        thresholdFourLower: [
          {required: true, message: '请输入下限值', trigger: 'blur'}
        ],
        thresholdFourHigher: [
          {required: true, message: '请输入上限值', trigger: 'blur'}
        ],
      },
      inputFormKey: Math.random().toString(36).slice(-6),
      isdisabled: true,
      // 关联相关
      reDialogVisible: false,
      targetForm: {
        targetId: ''
      },
      targetFormRules: {
        targetId: [
          { required: true, message: "请选择生效范围", trigger: "change" },
        ],
      },
      targetFormKey: Math.random().toString(36).slice(-6),
      targetSite: [],
      siteInfo: [],
      ruleId: '',
      // 删除相关
      deleteId: '',
      dialogColumnVisible: false,
      columnList: [
        {
          prop: 'name',
          label: '规则名称',
          show: true
        },
        {
          prop: 'siteName',
          label: '所属园区',
          show: true
        },
        {
          prop: 'status',
          label: '启用状态',
          show: true
        },
        {
          prop: 'capacityType',
          label: '容量类型',
          show: true
        },
        {
          prop: 'capacityRuleTargets',
          label: '目标区域',
          show: true
        },
        {
          prop: 'updateDate',
          label: '修改时间',
          show: true
        },
        {
          prop: 'updateBy',
          label: '修改人',
          show: true
        }
      ],
      btnType: 1
    };
  },
  created() {
    this.init()
  },
  computed: {
    // 删除按钮禁用标志
    removeFlag() {
      return this.selections.length === 0
    }
  },
  filters: {
    targetNamesFilter(value) {
      let arr = []
      let str = ''
      if (value.length > 0) {
        value.forEach(item => {
          arr.push(item.targetName)
        })
        str = arr.join('，')
      }
      return str
    }
  },
  methods: {
    /**
     * 网络请求
     */
    async init() {
      // 获取初始区域查询条件数据
      let data = await sdcSiteAction('','/tree','get')
      this.siteData = modifyData(data.data.data)
      getFirstChild(this.siteData, this.firstChild, 'P00')
      this.siteId = this.firstChild[0].id
      this.setQueryCondition()
      this._getRuleList(this.queryCondition)
    },
    _getRuleList(params) {
      getRuleList(params).then(res => {
        if (res.data.code === 0) {
          let data = res.data.data
        this.tableData = data.records
        this.pageInfo.total = data.total
        this.pageInfo.current = data.current
        if (this.tableData.length === 0) {
          this.emptyText = '暂无数据'
        }
        }      
      })
    },
    /**
     *方法监听  
     */ 
    setDisable (data) {
      data.forEach(item => {
        if (item.type !== 'R00' && !item.children) {
          item.disabled = true
        } else {
          if (item.children && item.children.length) {
            this.setDisable(item.children)
          }
        }
      })
      return data
    },
    // 搜索框值变化
    changeSite(id) {  
      this.setQueryCondition()
      this._getRuleList(this.queryCondition)
    },
    // 分页变化
    queryByPage(pageInfo) {
      this.PageInfo.page = pageInfo.page
      this.PageInfo.size = pageInfo.size
      this.setQueryCondition()
      this.queryCondition.current = pageInfo.page
      this.queryCondition.size = pageInfo.size
      this._getRuleList(this.queryCondition)
    },
    // 重置列表
    resetTable() {
      this.siteId = ''
      this.setQueryCondition()
      this._getRuleList(this.queryCondition)
    },
    // 控制列显隐
    chooseColumn() {
      this.dialogColumnVisible = true
    },
    mainPropClick(data) {
      this.btnType = 1
      this.actionType = 2
      this.dialogTitle = '查看'
      this.isdisabled = true
      this.inputForm = _.cloneDeep(data)
      this.formDialogVisible = true
    },
    enableEdit() {
      this.isdisabled = false
      this.btnType = 2
      this.dialogTitle = '编辑'
    },
    statusChange(value, row) {
      if (value === '0') {
        if (row.expand.capacityRuleTargets.length > 0) {
          switchStatus({
            id: row.id,
            status: '1'
          }).then(res => {
            if (res.data.code === 0) {
              this._getRuleList(this.queryCondition)
              this.$message.success('已启用')
            }
          })
        } else {
          return this.$message.warning('请先关联区域后再启用')
        }
      } else {
        switchStatus({
            id: row.id,
            status: '0'
          }).then(res => {
            if (res.data.code === 0) {
              this._getRuleList(this.queryCondition)
              this.$message.success('已停用')
            }
          })
      }
    },
    // 新增
    handleAdd() {
      this.actionType = 1
      this.isdisabled = false
      this.dialogTitle = "新增"
      this.formDialogVisible = true
    },
    handleRemove() {
      this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let removeArr = []
          this.selections.forEach(item => {
            removeArr.push(removeRule(item.id))
          })
          Promise.all(removeArr).then(res => {
            let successArr = []
            res.forEach(ele => {
              if (ele.data.code === 0) {
                successArr.push('成功')
              }
            })
            if (successArr.length === res.length) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.selections = []
            } else {
                this.$message({
                  message: '删除时出错，请刷新页面后重试',
                  type: 'error'
                })
              }
            this._getRuleList(this.queryCondition)
          })
        }).catch(() => {});    
    },
    // 表格行选中
    selectionChange(val) {
      this.selections = val
    },
    // 表格项操作
    tableAction(data, type) {
      if (type === 2) {
        // 点击查看时
        this.btnType = 1
        this.actionType = 2
        this.dialogTitle = '查看'
        this.isdisabled = true
        this.inputForm = _.cloneDeep(data)
        this.formDialogVisible = true
      }
      if (type === 3) {
        // 点击修改时
        this.actionType = 3
        this.dialogTitle = '编辑'
        this.isdisabled = false
        this.inputForm = _.cloneDeep(data)
        this.formDialogVisible = true
      }
      if (type === 4) {
        // 点击关联时
        let targetSite = this.setDisable(_.cloneDeep(this.siteData))
        // 去除非当前园区站点
        targetSite.some(item => {
          if (item.id === this.siteId) {
            this.targetSite = item
          }         
        })
        this.targetSite = [this.targetSite]
        this.targetForm.targetId = []
        this.ruleId = data.id;
        // this.targetForm.targetId = data.expand.siteIds
        for (let index = 0; index < data.expand.capacityRuleTargets.length; index++) {
          this.siteInfo = [];
          const el = data.expand.capacityRuleTargets[index].targetId;
          this.findParentId(this.targetSite, el);
          this.targetForm.targetId.splice(index,0,this.siteInfo);
        }
        this.selectAddress(this.targetForm.targetId)
        console.log(this.targetForm.targetId, '关联区域id')
        this.reDialogVisible = true 
      }
    },
    findParentId(data, id) {
      for (let index = 0; index < data.length; index++) {
        const el = data[index];
        if (el.id === id) {
          this.siteInfo.splice(0, 0, id);
          if (el.parentId !== undefined && el.parentId !== "") {
            this.findParentId(this.siteData, el.parentId);
          }
          return;
        } else {
          if (el.children !== undefined) {
            this.findParentId(el.children, id);
          }
        }
      }
    },
    // 去掉非当前园区站点
    // getCurrentSite(siteId, siteData) {
    //   let currentSite =  siteData.filter((item, index) => {
    //     item.id === siteId
    //   })
    //   return currentSite
    // },
    // 提交表单
    submitForm() {
      this.$refs.inputFormRef.validate(valid => {
        if (valid) {
          if (this.inputForm.thresholdOneStatus === '1' || this.inputForm.thresholdTwoStatus === '1' || this.inputForm.thresholdThreeStatus === '1' || this.inputForm.thresholdFourStatus === '1') {
            this.inputForm.siteId = this.siteId
            if (this.actionType === 1) {
              // 新增
              addRule(this.inputForm).then(res => {
                if (res.data.code === 0) {
                  this.$message.success('新增规则成功')
                  this.formDialogVisible = false
                  this._getRuleList(this.queryCondition)
                }
              })
            } else {
              // 编辑
              editRule(this.inputForm).then(res => {
                if (res.data.code === 0) {
                  this.$message.success('编辑规则成功')
                  this.formDialogVisible = false
                  this._getRuleList(this.queryCondition)
                }
              })
            }  
          } else {
            return this.$message.warning('请至少启用一个警告等级')
          }
               
        }
      })
    },
    // 关闭对话框重置表单内容
    refreshData() {
      this.$refs.inputFormRef.resetFields()
      this.inputForm = {
        thresholdOneStatus: '0',
        thresholdTwoStatus: '0',
        thresholdThreeStatus: '0',
        thresholdFourStatus: '0',
        thresholdOneOperator: '0',
        thresholdTwoOperator: '0',
        thresholdThreeOperator: '0',
        thresholdFourOperator: '0',
        type: '1',
        status: '0'
      }   
    },
    setQueryCondition() {
      this.queryCondition = {
        current: 1,
        size: 10
      }
      this.siteId ? this.queryCondition.siteId = this.siteId : ''
    },
    selectAddress(val) {
      // this.targetIdsArr = val
      console.log(val, 'siteId');
      this.siteIds = [];
      for (let index = 0; index < val.length; index++) {
        const el = val[index];
        this.siteIds.push(el[el.length - 1]);
      }
    },
    submitReInfo() {
      this.$refs.targetFormRef.validate((valid) => {
        if (valid) {
          reTarget({
            ruleId: this.ruleId,
            siteIds: this.siteIds
          }).then(res => {
          if (res.data.code === 0) {
            this.$message.success('关联成功')
            this.reDialogVisible = false
            this._getRuleList(this.queryCondition)
          }
        })
        }
      })
      
    },
    reDialogClosed() {
      this.targetForm = {
        targetId: []
      }
      this.$refs.targetFormRef.resetFields()
    },
    // 获取数据词典值
    setCapacityType(val) {
      let capatypeMap = this.$dictUtils.getDictList('capacity_type'),
          text = ''
      for (let index = 0; index < capatypeMap.length; index++) {
        const el = capatypeMap[index];
        if (el.value === val.type) {
          text = el.label
          break;
        }
      }
      return text
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
/deep/.warn-level {
  .el-col {
    text-align: center;
  }
  .el-form-item__error {
    left: 50px;
  }
}
.warn-level1 {
  background: #D9001B;
  color: #fff;
}
.warn-level2 {
  background: #F59A23;
  color: #fff;
}
.warn-level3 {
  background: #AD9119;
  color: #fff;
}
.warn-level4 {
  background: #0000FF;
  color: #fff;
}
</style>