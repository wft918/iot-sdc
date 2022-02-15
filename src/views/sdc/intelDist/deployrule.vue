<template>
  <div>
    <basic-container>
      <!-- 搜索区 -->
      <el-row :gutter="20" class="search-area">
        <el-col :span="8" :offset="1">
          <span>所属园区：</span>
          <el-select v-model="address" placeholder="请选择">
            <el-option style="width:100%" 
              v-for="item in condition"
              :key="item.code"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          
          <!-- <el-cascader
            ref="siteChoose"
            :options="condition"
            style="width: 40%"
            v-model="address"
            clearable
            filterable
            @change="changeAddress"
            :props="{
              checkStrictly: true,
              value: 'id',
              label: 'name',
              children: 'children',
            }"
          >
          </el-cascader> -->
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            style="margin-left: 15px"
            @click="queryInfoClick"
            >查询</el-button
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
          <el-button
            type="primary"
            icon="el-icon-refresh"
            size="small"
            @click="clearCondition"
            >清空</el-button
          >
          <!-- <el-button icon="el-icon-download" size="small">导入</el-button>
          <el-button icon="el-icon-upload2" size="small">导出</el-button> -->
        </el-col>
      </el-row>
      <!-- 列表区 -->
      <el-table
        ref="multipleTable"
        :data="rulesTable"
        tooltip-effect="dark"
        style="width: 100%"
        border
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>
        <el-table-column type="index" label="序号" width="50" align="center">
        </el-table-column>
        <el-table-column prop="name" label="规则名称" align="center">
        </el-table-column>
        <el-table-column prop="expand.siteName" label="所属园区" align="center">
        </el-table-column>
        <el-table-column label="启用状态" width="80" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status === '0'">未启用</span>
            <span v-else>启用</span>
          </template>
        </el-table-column>
        <el-table-column label="规则类别" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.type === '0'">人脸识别</span>
            <span v-else>烟火识别</span>
          </template>
        </el-table-column>
        <el-table-column label="关联目标" align="center"> 
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.expand.fdLibNames.join('、')" placement="top">
              <span>{{scope.row.expand.fdLibNames.join('、').slice(0, 15)}}</span>
            </el-tooltip>           
          </template>
        </el-table-column>
        <el-table-column label="关联区域" align="center"> 
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.expand.siteNames.join('、')" placement="top">
              <span>{{scope.row.expand.siteNames.join('、').slice(0, 15)}}</span>
            </el-tooltip>           
          </template>
        </el-table-column>
        <el-table-column label="布防时间" align="center" width="240">
          <template slot-scope="scope">
            <div>
              日期：星期一： {{ scope.row.startMonday }} -
              {{ scope.row.endMonday }} <br />
              日期：星期二： {{ scope.row.startTuesday }} -
              {{ scope.row.endTuesday }} <br />
              日期：星期三： {{ scope.row.startWednesday }} -
              {{ scope.row.endWednesday }} <br />
              日期：星期四： {{ scope.row.startThursday }} -
              {{ scope.row.endThursday }} <br />
              日期：星期五： {{ scope.row.startFriday }} -
              {{ scope.row.endFriday }} <br />
              日期：星期六： {{ scope.row.startSaturday }} -
              {{ scope.row.endSaturday }} <br />
              日期：星期天： {{ scope.row.startSunday }} -
              {{ scope.row.endSunday }} <br />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="updateDate"
          label="修改时间"
          align="center"
          width="100"
        >
        </el-table-column>
        <el-table-column prop="updateBy" label="修改人" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-view"
              size="mini"
              @click="showViewForm(scope.row, 1)"
              >查看</el-button
            >
            <el-button
              type="text"
              icon="el-icon-edit"
              size="mini"
              @click="showViewForm(scope.row, 2)"
              >修改</el-button
            >
            <el-button
              type="text"
              icon="el-icon-share"
              size="mini"
              @click="showRelevanceForm(scope.row)"
              >关联目标</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <Pagination
        :page="page"
        :size="size"
        :total="total"
        :key="pageKey"
        @pagination="queryByPage"
      ></Pagination>

      <!-- 添加布防规则 -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="addFormVisible"
        :close-on-click-modal="false"
        @close="addFormClose"
      >
        <el-form
          :model="addForm"
          class="add-form"
          ref="addFormRef"
          :rules="addFormRules"
          :disabled="dialogDisable"
        >
          <el-form-item label="布防规则名称" label-width="120px" prop="name">
            <el-input v-model="addForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="所属园区" label-width="120px" prop="siteId">
            <el-select v-model="addForm.siteId" placeholder="请选择">
              <el-option style="width:100%" 
                v-for="item in siteData"
                :key="item.code"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="启用状态" label-width="120px" prop="status">
            <el-select v-model="addForm.status">
              <el-option
                v-for="item in this.$dictUtils.getDictList('deploy_status')"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="规则类别" label-width="120px" prop="type">
            <el-select v-model="addForm.type">
              <el-option
                v-for="item in this.$dictUtils.getDictList('fd_rule_type')"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="布防时间"
            label-width="120px"
            class="deploy-time"
          >
            <div>
              <el-row>
                <el-col :span="3">
                  <span>星期一</span>
                </el-col>
                <el-col :span="21">
                  <el-slider
                    range
                    v-model="Monday"
                    :min="0"
                    :max="1440"
                    :step="1"
                    :format-tooltip="setTimeSlider"
                    :marks="marks"
                  >
                  </el-slider>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <span>星期二</span>
                </el-col>
                <el-col :span="21">
                  <el-slider
                    v-model="Tuesday"
                    range
                    :min="0"
                    :max="1440"
                    :step="1"
                    :format-tooltip="setTimeSlider"
                    :marks="marks"
                  >
                  </el-slider>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <span>星期三</span>
                </el-col>
                <el-col :span="21">
                  <el-slider
                    v-model="Wednesday"
                    range
                    :min="0"
                    :max="1440"
                    :step="1"
                    :format-tooltip="setTimeSlider"
                    :marks="marks"
                  >
                  </el-slider>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <span>星期四</span>
                </el-col>
                <el-col :span="21">
                  <el-slider
                    v-model="Thursday"
                    range
                    :min="0"
                    :max="1440"
                    :step="1"
                    :format-tooltip="setTimeSlider"
                    :marks="marks"
                  >
                  </el-slider>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <span>星期五</span>
                </el-col>
                <el-col :span="21">
                  <el-slider
                    v-model="Friday"
                    range
                    :min="0"
                    :max="1440"
                    :step="1"
                    :format-tooltip="setTimeSlider"
                    :marks="marks"
                  >
                  </el-slider>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <span>星期六</span>
                </el-col>
                <el-col :span="21">
                  <el-slider
                    v-model="Saturday"
                    range
                    :min="0"
                    :max="1440"
                    :step="1"
                    :format-tooltip="setTimeSlider"
                    :marks="marks"
                  >
                  </el-slider>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <span>星期日</span>
                </el-col>
                <el-col :span="21">
                  <el-slider
                    v-model="Sunday"
                    range
                    :min="0"
                    :max="1440"
                    :step="1"
                    :format-tooltip="setTimeSlider"
                    :marks="marks"
                  >
                  </el-slider>
                </el-col>
              </el-row>
            </div>
          </el-form-item>
          <el-form-item label="备注" label-width="120px" prop="postscript">
            <el-input
              type="textarea"
              v-model="addForm.postscript"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAddSubmit">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 布防删除 -->
      <el-dialog
        title="数据删除提醒"
        :visible.sync="dialogDeployVisible"
        width="30%"
        :close-on-click-modal="false"
      >
        <span>是否确定删除当前数据！</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteDeployData">确 定</el-button>
          <el-button type="primary" @click="dialogDeployVisible = false"
            >取 消</el-button
          >
        </span>
      </el-dialog>

      
      <!-- 关联目标删除 -->
      <el-dialog
        title="数据删除提醒"
        :visible.sync="dialogVisible"
        width="30%"
        :close-on-click-modal="false"
      >
        <span>是否确定删除当前数据！</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteData">确 定</el-button>
          <el-button type="primary" @click="dialogVisible = false"
            >取 消</el-button
          >
        </span>
      </el-dialog>

      <!-- 关联目标新增 -->
      <el-dialog
        title="新增关联目标"
        :visible.sync="targetDialogVisible"
        :close-on-click-modal="false"
        @closed="targetDialogClosed"
      >
        <el-form
          :model="targetForm"
          class="target-form"
          ref="targetFormRef"
          :rules="targetFormRules"
        >
          <div class="effect-area">
            <h3>选择此布防规则生效的区域范围</h3>
            <el-form-item label="生效范围" prop="targetId">
              <!-- <el-select multiple v-model="targetForm.targetId" @change="selectAddress" placeholder="请选择">
                <el-option style="width:100%" 
                  v-for="item in targetSite"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select> -->
              <el-cascader
                ref="effect"
                :options="targetSite"
                style="width: 60%"
                v-model="targetForm.targetId"
                clearable
                filterable
                @change="selectAddress"
                :props="{
                  checkStrictly: true,
                  value: 'id',
                  label: 'name',
                  children: 'children',
                  multiple: true,
                }"
              >
              </el-cascader>
            </el-form-item>
          </div>
        </el-form>
        <div class="face-database" v-if="targetRuleFlag">
          <h3>选择需要关联到此布防规则的人脸库</h3>
          <el-table
            :data="faceDatabaseTable"
            :row-key="getRowKey"
            tooltip-effect="dark"
            style="width: 100%"
            ref="fdTableRef"
            border
            stripe
            @selection-change="targetSelectionChange"
          >
            <el-table-column type="selection" width="55" align="center" :reserve-selection="true">
            </el-table-column>
            <el-table-column
              type="index"
              label="序号"
              width="50"
              align="center"
            >
            </el-table-column>
            <el-table-column prop="name" label="人脸库名称" align="center">
            </el-table-column>
            <el-table-column
              prop="expand.siteName"
              label="所属园区"
              align="center"
            >
            </el-table-column>
            <el-table-column label="启用状态" width="80" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.status === 0">是</span>
                <span v-else>否</span>
              </template>
            </el-table-column>
          </el-table>
          <Pagination
            :page="fdpage"
            :size="fdsize"
            :total="fdtotal"
            :key="fdpageKey"
            @pagination="queryFDByPage"
          ></Pagination>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="targetDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleTargetSubmit"
            >保 存</el-button
          >
        </div>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";

import { sdcSiteAction } from "@/api/sdc/addressInfo";
import { modifyData } from "@/util/domainFilter";

import {
  getSdcDeployRuleTable,
  addSdcDeployRule,
  sdcDeployRuleAction,
  getSdcDeployRuleTargetRelaTable,
  addSdcDeployRuleTargetRela,
  sdcDeployRuleTargetRelaAction,
  getSdcFDTable,
} from "@/api/sdc/deployrule";

import { formatTime } from "@/util/deployruleUtils";
import moment from "moment";
import _ from "lodash";
export default {
  components: {
    Pagination,
  },
  data() {
    return {
      // 搜索框绑定值
      parkName: undefined,
      // 布防规则表
      rulesTable: [],
      // 添加布防规则
      addFormVisible: false,
      addForm: {
        name: null,
        siteId: null,
        status: "0",
        type: "0",
        startMonday: null,
        endMonday: null,
        startTuesday: null,
        endTuesday: null,
        startWednesday: null,
        endWednesday: null,
        startThursday: null,
        endThursday: null,
        startFriday: null,
        endFriday: null,
        startSaturday: null,
        endSaturday: null,
        startSunday: null,
        endSunday: null,
        remarks: null,
        expand: {
          remarks: null,
        },
      },
      Monday: [0, 1440],
      Tuesday: [0, 1440],
      Wednesday: [0, 1440],
      Thursday: [0, 1440],
      Friday: [0, 1440],
      Saturday: [0, 1440],
      Sunday: [0, 1440],
      // 滑块marks
      marks: {
        0: "0",
        120: "2",
        240: "4",
        360: "6",
        480: "8",
        600: "10",
        720: "12",
        840: "14",
        960: "16",
        1080: "18",
        1200: "20",
        1320: "22",
        1440: "24",
      },
      // 添加表单预校验规则
      addFormRules: {
        name: [{ required: true, message: "请输入规则名称", trigger: "blur" }],
        siteId: [
          { required: true, message: "请选择所属园区", trigger: "change" },
        ],
        status: [
          { required: true, message: "请选择是否启用", trigger: "change" },
        ],
        type: [{ required: true, message: "请规则类别", trigger: "change" }],
      },
      actionFlag: 1,
      // 选中的表格列
      selectedColumns: [],
      // 生效范围
      effectArea: [],
      targetDialogVisible: false,
      targetForm: {
        targetId: [],
      },
      targetFormRules: {
        targetId: [
          { required: true, message: "请选择生效范围", trigger: "change" },
        ],
      },
      // 人脸库数据表
      faceDatabaseTable: [],
      address: null,
      condition: [],
      queryCondition: {
        current: 1,
        size: 10
      },
      page: 1,
      size: 10,
      total: 0,
      pageKey: Math.random().toString(36).slice(-6),
      dialogTitle: null,
      siteData: [],
      dialogDisable: true,
      targetRuleFlag: false,
      targetVisible: false,
      tartgetpage: 1,
      tartgetsize: 5,
      tartgettotal: 0,
      tartgetpageKey: Math.random().toString(36).slice(-6),
      ruleId: null,
      targetTable: [],
      fdpage: 1,
      fdsize: 5,
      fdtotal: 0,
      fdpageKey: Math.random().toString(36).slice(-6),
      dialogVisible: false,
      delId: null,
      fdArray: [],
      deployDelInfo: [],
      removeFlag: true,
      dialogDeployVisible: false,
      fdLibIds: [],
      siteIds: [],
      siteInfo: [],
      rowFdLib: [],
      targetSite: [],
      targetFDSiteId: null,
      selectedfd: []
    };
  },
  created() {
    this.init();
    this.queryInfo();
  },
  filters: {
    // 修改时间过滤器
    edittimeFilter(value) {
      return moment(value).format("YYYY-MM-DD hh:mm:ss");
    },
    // 布防时间-时间过滤器
    timedurationFilter(value) {
      return (
        formatTime(parseInt(value[0])) + "-" + formatTime(parseInt(value[1]))
      );
    },
  },
  methods: {
    async init() {
      //获取初始区域查询条件数据
      let data = await sdcSiteAction("", "/tree", "get");
      this.siteData = this.condition = modifyData(data.data.data);
    },
    //查询规则信息
    queryInfoClick() {
      this.setQueryCondition()
      this.queryCondition.current = 1
      this.queryInfo()
    },
    async queryInfo() {
      let data = await getSdcDeployRuleTable(this.queryCondition);
      console.log(data);
      this.rulesTable = data.data.data.records;
      this.total = data.data.data.total;
      console.log(this.rulesTable);
    },
    setQueryCondition() {
      this.queryCondition = {
        current: this.page,
        size: this.size,
      };
      this.address
        ? this.queryCondition.siteId = this.address
        : null;
    },
    async queryByPage(data) {
      this.page = data.page;
      this.size = data.size;
      this.queryCondition.current = this.page
      this.queryCondition.size = this.size
      this.queryInfo();
    },
    // 表格选择
    handleSelectionChange(value) {
      if (value.length > 0) {
        this.removeFlag = false;
      }
      this.deployDelInfo = value;
    },

    // 点击新增按钮
    handleAdd() {
      // console.log('新增规则');
      this.dialogTitle = "新增布防规则";
      this.dialogDisable = false;
      this.actionFlag = 3;
      this.addFormVisible = true;
    },
    // 删除规则
    handleRemove() {
      this.dialogDeployVisible = true;
    },
    deleteDeployData() {
      for (let index = 0; index < this.deployDelInfo.length; index++) {
        const el = this.deployDelInfo[index];
        console.log(el);
        sdcDeployRuleAction("", "/" + el.id, "delete").then((res) => {
          console.log(res);
          this.queryInfo();
        });
      }
      this.dialogDeployVisible = false;
    },
    // 提交添加规则
    handleAddSubmit() {
      // console.log(this.addForm)
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          this.addForm.startMonday = this.setTimeSlider(this.Monday[0]);
          this.addForm.endMonday = this.setTimeSlider(this.Monday[1]);

          this.addForm.startTuesday = this.setTimeSlider(this.Tuesday[0]);
          this.addForm.endTuesday = this.setTimeSlider(this.Tuesday[1]);

          this.addForm.startWednesday = this.setTimeSlider(this.Wednesday[0]);
          this.addForm.endWednesday = this.setTimeSlider(this.Wednesday[1]);

          this.addForm.startThursday = this.setTimeSlider(this.Thursday[0]);
          this.addForm.endThursday = this.setTimeSlider(this.Thursday[1]);

          this.addForm.startFriday = this.setTimeSlider(this.Friday[0]);
          this.addForm.endFriday = this.setTimeSlider(this.Friday[1]);

          this.addForm.startSaturday = this.setTimeSlider(this.Saturday[0]);
          this.addForm.endSaturday = this.setTimeSlider(this.Saturday[1]);

          this.addForm.startSunday = this.setTimeSlider(this.Sunday[0]);
          this.addForm.endSunday = this.setTimeSlider(this.Sunday[1]);

          if (this.actionFlag === 3) {
            addSdcDeployRule(this.addForm).then((res) => {
              if (res.data.code === 0) {
                this.addFormVisible = false;
                this.queryInfo();
              }
            });
          } else if (this.actionFlag === 2) {
            sdcDeployRuleAction(this.addForm, "", "put").then((res) => {
              if (res.data.code === 0) {
                this.addFormVisible = false;
                this.queryInfo();
              }
            });
          }
        }
      });
    },
    // 添加对话框关闭
    addFormClose() {
      this.$refs.addFormRef.resetFields();
      this.refreshForm();
    },
    // 查看规则
    showViewForm(row, flag) {
      this.addForm = row;
      if (flag === 1) {
        this.dialogTitle = "查看布防规则";
        this.dialogDisable = true;
        this.actionFlag = 1;
      } else {
        this.dialogTitle = "修改布防规则";
        this.dialogDisable = false;
        this.actionFlag = 2;
      }

      this.Monday = [
        this.setSliderStep(this.addForm.startMonday),
        this.setSliderStep(this.addForm.endMonday),
      ];

      this.Tuesday = [
        this.setSliderStep(this.addForm.startTuesday),
        this.setSliderStep(this.addForm.endTuesday),
      ];

      this.Wednesday = [
        this.setSliderStep(this.addForm.startWednesday),
        this.setSliderStep(this.addForm.endWednesday),
      ];

      this.Thursday = [
        this.setSliderStep(this.addForm.startThursday),
        this.setSliderStep(this.addForm.endThursday),
      ];

      this.Friday = [
        this.setSliderStep(this.addForm.startFriday),
        this.setSliderStep(this.addForm.endFriday),
      ];

      this.Saturday = [
        this.setSliderStep(this.addForm.startSaturday),
        this.setSliderStep(this.addForm.endSaturday),
      ];

      this.Sunday = [
        this.setSliderStep(this.addForm.startSunday),
        this.setSliderStep(this.addForm.endSunday),
      ];

      this.addFormVisible = true;
    },
    //重置初始化数据
    refreshForm() {
      this.addForm = {
        name: null,
        siteId: null,
        status: "0",
        type: "0",
        startMonday: null,
        endMonday: null,
        startTuesday: null,
        endTuesday: null,
        startWednesday: null,
        endWednesday: null,
        startThursday: null,
        endThursday: null,
        startFriday: null,
        endFriday: null,
        startSaturday: null,
        endSaturday: null,
        startSunday: null,
        endSunday: null,
        remarks: null,
        expand: {
          remarks: null,
        },
      };
      this.Monday = [0, 1440];
      this.Tuesday = [0, 1440];
      this.Wednesday = [0, 1440];
      this.Thursday = [0, 1440];
      this.Friday = [0, 1440];
      this.Saturday = [0, 1440];
      this.Sunday = [0, 1440];
    },

    // 关联目标
    async showRelevanceForm(row) {
      //获取初始区域查询条件数据
      this.targetFDSiteId = row.siteId
      let data = await sdcSiteAction("", "/tree/" + row.siteId, "get");
      this.targetSite = []
      this.targetSite = modifyData(data.data.data)

      this.targetForm.targetId = []
      this.rowFdLib = row.expand.fdLibs

      if (row.type === "0") {
        this.targetRuleFlag = true;
        this.queryFDTable();
      } else {
        this.targetRuleFlag = false;
      }
      this.ruleId = row.id;
      // this.targetForm.targetId = row.expand.siteIds
      for (let index = 0; index < row.expand.siteIds.length; index++) {
        this.siteInfo = [];
        const el = row.expand.siteIds[index];
        this.findParentId(this.targetSite, el);
        this.targetForm.targetId.splice(index,0,this.siteInfo);
      }
      this.selectAddress(this.targetForm.targetId)
      console.log(this.targetForm.targetId, '关联区域id');
      this.targetDialogVisible = true;
    },
    //查询父级Id
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
    //查询关联
    queryTargetTable() {
      getSdcDeployRuleTargetRelaTable({
        current: this.tartgetpage,
        size: this.tartgetsize,
        ruleId: this.ruleId,
      }).then((res) => {
        this.targetTable = res.data.data.records;
        if (res.data.code === 0) {
          for (let index = 0; index < res.data.data.records.length; index++) {
            this.siteInfo = [];
            const el = res.data.data.records[index];
            this.findParentId(this.siteData, el.targetId);
            this.targetForm.targetId.push(this.siteInfo);
          }
        }
      });
    },
    //分页
    queryTartgetByPage(data) {
      this.tartgetpage = data.page;
      this.tartgetsize = data.size;
      this.queryTargetTable();
    },
    
    //查询人脸库
    queryFDTable() {
      getSdcFDTable({
        current: this.fdpage,
        size: this.fdsize,
        siteId: this.targetFDSiteId
      }).then((res) => {
        console.log(res);
        if (res.data.code === 0) {
          this.faceDatabaseTable = res.data.data.records;
          this.fdtotal = res.data.data.total;
          //设置已关联的选项
          for (let index = 0; index < this.faceDatabaseTable.length; index++) {
            const el = this.faceDatabaseTable[index];
            for (let j = 0; j < this.rowFdLib.length; j++) {
              const elem = this.rowFdLib[j];
              if(el.id === elem){
                this.$refs.fdTableRef.toggleRowSelection(el,true)
              }
            }
          }
          
        }
      });
    },
    //分页
    queryFDByPage(data) {
      this.fdpage = data.page;
      this.fdsize = data.size;
      this.queryFDTable();
    },
    clearCondition() {
      this.address = null
    },
    // 提交关联
    handleTargetSubmit() {
      this.fdLibIds = this.selectedfd.map(item => item.id)
      this.$refs.targetFormRef.validate((valid) => {
        if(valid) {
          addSdcDeployRuleTargetRela({
            ruleId: this.ruleId,
            fdLibIds: this.fdLibIds,
            siteIds: this.siteIds,
          }).then((res) => {
            console.log(res);
            if (res.data.code === 0) {
              this.$message.success('关联成功')
              this.targetDialogVisible = false;
              this.queryInfo()
            }            
          });
        }          
      });
    },
    // 关联目标对话框关闭
    targetDialogClosed() {
      if(this.targetRuleFlag) {
        this.fdpage = 1
        this.fdsize = 5
        this.$refs.fdTableRef.clearSelection()
      }
      this.$refs.targetFormRef.resetFields()
    },
    //删除关联
    deleteTarget(row) {
      this.dialogVisible = true;
      this.delId = row.id;
    },
    deleteData() {
      sdcDeployRuleTargetRelaAction("", "/" + this.delId, "delete").then(
        (res) => {
          if (res.data.code === 0) {
            this.queryTargetTable();
            this.dialogVisible = false;
          }
        }
      );
    },
    // 关联人脸库表选中列
    targetSelectionChange(val) {
      console.log(val, "ren lian ku");
      this.selectedfd = val
    },
    getRowKey(row) {
      return row.id
    },
    setTimeSlider(val) {
      let hour = 0;
      let min = 0;
      hour = parseInt(val / 60);
      if (hour < 10) {
        hour = "0" + hour.toString();
      } else {
        hour = hour.toString();
      }
      min = val % 60;
      if (min < 10) {
        min = "0" + min.toString();
      } else {
        min = min.toString();
      }
      let time = hour + ":" + min;
      return time;
    },
    setSliderStep(val) {
      let stepArray = val.split(":");
      let hour = parseInt(stepArray[0]);
      let min = parseInt(stepArray[1]);
      return hour * 60 + min;
    },
    selectAddress(val) {
      console.log(val, '选择的siteId');
      this.siteIds = [];
      for (let index = 0; index < val.length; index++) {
        const el = val[index];
        this.siteIds.push(el[el.length - 1]);
      }
    },
  },
};
</script>

<style lang="scss">
.search-area {
  margin-bottom: 15px;
}
.el-table {
  margin-bottom: 15px;
}
.add-form {
  .el-input,
  .el-select {
    width: 60%;
  }
  .el-textarea {
    width: 90%;
  }
}
.view-form {
  .el-input,
  .el-select {
    width: 100%;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #333;
    margin-left: 15px;
  }
  .el-icon-arrow-down {
    font-size: 16px;
  }
}
.edit-form {
  .el-input,
  .el-select {
    width: 60%;
  }
}
.deploy-time {
  width: 95%;
}
.slider-container {
  padding: 10px;
  padding-right: 20px;
  background-color: #091f5f;
}
.el-slider {
  width: 100%;
}
.deploy-time .el-row {
  margin-left: 10px;
  margin-bottom: 20px;
  color: #4b81b4;
}
.target-form .el-select {
  width: 80%;
}
.effect-area {
  margin-bottom: 30px;
}
/deep/.effect-area .el-form-item__error {
  left: 78px;
}
/deep/ .el-input.is-disabled .el-input__inner {
  color: #333;
}

.el-slider__marks-text {
  width: 16px;
  text-align: center;
}
</style>