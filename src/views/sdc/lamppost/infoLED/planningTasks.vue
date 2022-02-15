<template>
  <div>
    <basic-container>
      <el-row :gutter="15">
        <el-col :span="7">
          <span>所属园区：</span>
          <el-cascader 
            ref="areaMsg"
            :options="condition" 
            style="width:80%" 
            v-model="address"
            :props="{ checkStrictly: true, value: 'id', label: 'name', children: 'children' }"
            clearable
            filterable
            @change="changeAddress"
          ></el-cascader>
        </el-col>
        <el-col>
          <el-button type="primary" @click="addInfo">
              <i class="el-icon-plus"></i> 新增
            </el-button>
            <div class="query-btn-group">
            <el-button type="primary" @click="queryInfoClick">
              <i class="el-icon-search"></i> 查询
            </el-button>
            <el-button type="primary" @click="clearCondition">
              <i class="el-icon-delete"></i> 清空
            </el-button>
            <!-- <el-button type="primary" @click="clearCondition">
              <i class="el-icon-delete"></i> 删除
            </el-button> -->
            <el-button type="primary" @click="clearCondition">
              导入
            </el-button>
            <el-button type="primary" @click="clearCondition">
              导出
            </el-button>
          </div>
        </el-col>
        <el-col :span="24" style="margin-top:20px">
            <el-table
              :data="tableInfo"
              border
              style="margin:0.75rem 0"
            >
              <el-table-column 
                type="index"
                label="序号"
                align="center"
                sortable
              ></el-table-column>
              <el-table-column 
                prop="name"
                label="策略名称"
                align="center"
              ></el-table-column>
              <el-table-column 
                prop="expand.siteName"
                label="所属园区"
                align="center"
              ></el-table-column>
              <el-table-column 
                prop="triggerTime"
                label="执行时间"
                align="center"
              ></el-table-column>
              <el-table-column 
                prop="triggerDays"
                label="星期"
                align="center"
              ></el-table-column>
              <el-table-column 
                prop="action"
                label="启动状态"
                align="center"
                :formatter="setAction"
              ></el-table-column>
              <el-table-column 
                prop="beginDate"
                label="生效时间"
                align="center"
              ></el-table-column>
              <el-table-column 
                prop="endDate"
                label="失效时间"
                align="center"
              ></el-table-column>
              <el-table-column 
                prop="expand.actionName"
                label="动作"
                align="center"
              ></el-table-column>
              <el-table-column  
                label="关联目标" 
                prop="expand.targetNames" 
                align="center"
                :formatter="setTargetNames"
              >
              </el-table-column >
              <el-table-column 
                label="操作"
              >
                <template slot-scope="scope">
                  <span class="table-action" @click="tableAction(scope.row, 2)">编辑</span>
                  <span class="table-action" @click="tableAction(scope.row, 3)">查看</span>
                  <span class="table-action" @click="tableAction(scope.row, 5)">删除</span>
                  <span class="table-action" @click="tableAction(scope.row, 4)">关联设备</span>
                  
                </template>
              </el-table-column>
            </el-table>
            <Pagination :page="page" :size="size" :total="total" :key="pageKey" @pagination="queryByPage"></Pagination>
          </el-col>
      </el-row>
      <el-dialog
        :visible.sync="dialogFormVisible"
        width="35%"
        ref="emgDialog"
        :close-on-click-modal="false"
        @close="refreshData"
        :title="dialogTitle"
      >
        <el-form
          :model="inputForm"
          label-width="120px"
          :rules="rules"
          ref="carForm"
          :key="dialogKey"
          :disabled="isdisabled"
        >
          <el-form-item label="策略名称" prop="name" >
            <el-input v-model="inputForm.name" ></el-input>
          </el-form-item>
          <el-form-item label="所属园区" prop="siteId" >
            <el-cascader 
              ref="areaMsg"
              :options="condition" 
              style="width:80%" 
              v-model="inputForm.siteId"
              :props="{ checkStrictly: true, value: 'id', label: 'name', children: 'children' }"
              clearable
              filterable
              @change="changeSite"
            ></el-cascader>
          </el-form-item>
          <!-- <el-form-item label="启用状态" prop="action" >
            <el-select v-model="inputForm.action" style="width:55%">
              <el-option
                v-for="item in this.$dictUtils.getDictList('car_type')"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item label="告警时间" prop="expiryBegin">
            <el-date-picker
              v-model="inputForm.expiryBegin"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item> -->
          <el-form-item label="生效-失效时间">
            <el-date-picker
              v-model="dueDate"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
              style="width:80%"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="动作" prop="action">
            <el-radio-group v-model="inputForm.action">
              <el-radio :label="'21'">开启LED</el-radio>
              <el-radio :label="'22'">关闭LED</el-radio>
              <el-radio :label="'23'">播放节目</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="执行时间" prop="triggerTime">
            <el-time-picker
                v-model="inputForm.triggerTime"
                value-format="HH:m:s"
                placeholder="请选择执行时间"
                @change="changeCronTime"
              />
          </el-form-item>
          <el-form-item  prop="triggerDays">
            <el-checkbox-group v-model="inputForm.triggerDays" >
              <el-checkbox
                v-for="number in weeksList"
                :key="number.value"
                :label="number.value"
              >{{number.label}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <template v-if="inputForm.actionType === 3">
            <el-button
              type="primary"
              @click="dialogFormVisible = false"
              size="small"
              >关闭</el-button
            >
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
      <el-dialog
        title="选择需要关联到此策略的设备"
        :visible.sync="relationDialogVisible"
        width="30%"
        :close-on-click-modal="false"
      >
        <el-table
              ref="deviceTable"
              :data="policyData"
              border
              @selection-change="handleSelectionChangeDevice"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column property="expand.deviceName" align="center" label="设备名称"  />
              <el-table-column property="expand.siteName" align="center" label="所属园区"  />
              <el-table-column property="expand.typeName" align="center" label="设备类型"  />
              <!-- <el-table-column property="height" align="center" label="高度" /> -->
            </el-table>
            <Pagination :page="policyPage" :size="policySize" :total="policyTotal" :key="policyPageKey" @pagination="queryPolicyByPage"></Pagination>
        <span slot="footer" class="dialog-footer">
          <el-button @click="saveTarget" :disabled="isDisabled">确 定</el-button>
          <el-button type="primary" @click="relationDialogVisible = false"
            >取 消</el-button
          >
        </span>
      </el-dialog>

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
    </basic-container>
    
  </div>
</template>

<script>
import { sdcSiteAction } from "@/api/sdc/addressInfo";
import { modifyData } from "@/util/domainFilter";
import Pagination from "@/components/Pagination";

import { getSdcLightTaskTable,sdcLightTaskAction,sdcLightTaskTargetAction,deleteSdcLightTask } from "@/api/sdc/lpmanage";
import { getSdcLightLEDTable } from "@/api/sdc/lpmonitor";
import { clone } from "@/util/domainFun";
import { getSdcGateInfo } from "@/api/sdc/deviceInfo";

import moment from "moment";

export default {
  components: {
    Pagination
  },
  data() {
    // 起始日期验证
    var expiryBeginValiate = (rule, value, callback) =>{
        if (!value) {
          callback(new Error('有效期开始时间不能为空！'));
        } else {
          // 如果有效期截止时间没选，cb
          if (!this.inputForm.expiryEnd) {
            callback()
          } else {
            // 有效期截止时间有，进行判断
            if (this.compareDate(value, this.inputForm.expiryEnd)) {
              // 如果起始在结束之前
              callback()
            } else {
              callback(new Error('有效期开始时间不能在有效期截止时间之后，请重新选择'))
            }
          }
        }
      
    };
    var expiryEndValiate = (rule, value, callback) => {
        if (!value) {
          callback(new Error('有效期截止时间不能为空！'));
        } else {
          if (!this.inputForm.expiryBegin) {
            callback()
          } else {
            // 起始日期有
            if (this.compareDate(this.inputForm.expiryBegin, value)) {
              callback()
            } else {
              callback(new Error('有效期截止时间不能在有效期开始时间之前，请重新选择'))
            }
          }
        }
    };
    return {
      page:1,
      size: 10,
      total: 0,
      pageKey: Math.random().toString(36).slice(-6),
      address: [],
      condition: [],
      dueDate: [],
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
      dialogFormVisible: false,
      actionFlag: null,
      inputForm: {
        name: null,
        siteId: null,
        deviceTypeCode: "light_led",
        action: null,
        param: null,
        beginDate: null,
        endDate: null,
        triggerTime: null,
        triggerDays: []
      },
      rules: {
        name: [
          { required: true, message: "请输入策略名称", trigger: "blur" },
        ],
        siteId: [{ required: true, message: "请选择所属园区", trigger: "change" }],
        action: [
          { required: true, message: "请选择执行动作", trigger: "change" },
        ],
        triggerTime: [{ required: true, message: "请选择执行时间", trigger: "change" }],
        triggerDays: [{ type: 'array', required: true, message: "请选择执行日期", trigger: "change" }],
      },
      dialogKey: Math.random().toString(36).slice(-6),
      isdisabled: false,
      parkTypeMap: [],
      dialogVisible: false,
      
      dialogTitle: null,
      queryCondition: {
        current: 1,
        size: 10,
        deviceTypeCode:"light_led"
      },

      checkedWeeks: [],
      weeksList: [
        { label: '星期一', value: '1' },
        { label: '星期二', value: '2' },
        { label: '星期三', value: '3' },
        { label: '星期四', value: '4' },
        { label: '星期五', value: '5' },
        { label: '星期六', value: '6' },
        { label: '星期日', value: '7' }
      ],
      relationDialogVisible: false,
      policyData: null,
      policyPage: 0,
      policySize: 5,
      policyTotal: 0,
      policyPageKey: Math.random().toString(36).slice(-6),
      deviceList:[],
      policyForm: {
        targetType: "device",
      },
      isDisabled: true,
      delId: null,
    }
  },
  computed: {
     
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      //获取初始区域查询条件数据
      let data = await sdcSiteAction('','/tree','get')
      this.condition = modifyData(data.data.data)
      this.queryInfo()
    },
    async addInfo() { 
      this.dialogTitle = '新建LED策略'
      this.inputForm.actionType = 1
      this.dialogFormVisible = true
      this.psDisabled = true
      console.log(this.inputForm,'this.inputForm');
      this.dialogKey = new Date().toString()
    },
    setQueryCondition() {
      this.queryCondition = {
        current:this.page,
        size: this.size,
        deviceTypeCode:"light_led"
      }
      this.address.length !== 0 ? this.queryCondition.siteId = this.address[this.address.length - 1] : null
    },
    queryInfoClick() {
      this.setQueryCondition()
      this.queryCondition.current = 1
      this.queryInfo()
    },
    async queryInfo() {
      let tableData = await getSdcLightTaskTable(this.queryCondition)
      console.log(tableData,'tableData');
      this.tableInfo = tableData.data.data.records
      this.setpage(tableData.data.data);
    },
    clearCondition() {
      this.address = []
      this.changeAddress()
    },
    async changeAddress() {
    },
    async tableAction(row,flag) {
      this.dueDate = []
      if(flag === 3) {
        this.dialogTitle = '查看LED策略'
        this.isdisabled = true
        this.inputForm = clone(row)
        this.inputForm.actionType = 3
        this.dueDate.push(this.inputForm.beginDate)
        this.dueDate.push(this.inputForm.endDate)
        this.inputForm.triggerDays = this.inputForm.triggerDays.split(',')
        this.dialogFormVisible = true
      } else if( flag === 2) {
        this.dialogTitle = '编辑LED策略'
        
        this.inputForm = clone(row)
        this.inputForm.actionType = 2
        this.dueDate.push(this.inputForm.beginDate)
        this.dueDate.push(this.inputForm.endDate)
        this.inputForm.triggerDays = this.inputForm.triggerDays.split(',')
        this.dialogFormVisible = true
      } else if( flag === 4) {
        this.policyForm.taskId = row.id
        let tableData = await getSdcLightLEDTable(this.queryPolicyCondition);
        const promise = tableData.data.data.records.map( el => {
            return new Promise((resolve,reject) => {
              getSdcGateInfo(el.id).then( res => {
                getSdcGateInfo(el.lightId).then( rl => {
                    el.lightDev = res.data.data
                    el.light = rl.data.data
                    resolve(el)
                })
              })
              .catch(err=>reject(err))
            })
          })
          this.policyData  = await Promise.all(promise)
          console.log(this.policyData,'this.policyData');
          this.setPolicyPage(tableData.data.data);
          this.relationDialogVisible = true
      } else if (flag === 5) {  //删除
        this.dialogVisible = true;
        this.delId = row.id;
        return;
      }
      this.dialogKey = new Date().toString()
    },
    setPolicyConditon() {
      this.queryPolicyCondition = {
        current: this.policyPage,
        size: this.policySize
      }
    },
    setPolicyPage(data) {
      this.policyPage = data.current;
      this.policySize = data.size;
      this.policyTotal = data.total;
      this.policyPageKey = (new Date()).toString() + 1
    },
    async queryByPage(data) {
      this.page = data.page
      this.size = data.size
      this.queryCondition.current = this.page
      this.queryCondition.size = this.size
      this.queryInfo()
    },
    refreshData() {
      this.inputForm =  {
        name: null,
        siteId: null,
        deviceTypeCode: "light_lamp",
        action: null,
        param: null,
        beginDate: null,
        endDate: null,
        triggerTime: null,
        triggerDays: []
      }
      this.isdisabled = false
    },
    changeCronTime() {

    },
    submitForm() {
      console.log(this.inputForm,'this.inputForm');
      this.$refs.carForm.validate((valid) => {
        this.inputForm.beginDate = moment(this.dueDate[0]).format('YYYY-MM-DD HH:mm:ss')
        this.inputForm.endDate = moment(this.dueDate[1]).format('YYYY-MM-DD HH:mm:ss')
        if (valid) {
          this.inputForm.triggerDays = this.inputForm.triggerDays.toString()
          if(this.inputForm.actionType === 1) {
            // this.inputForm.createDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            sdcLightTaskAction(this.inputForm, "post").then(() => {
              this.dialogFormVisible = false
              this.init()
            })
          } else {
            // this.inputForm.updateDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            sdcLightTaskAction(this.inputForm, "put").then(() => {
              this.dialogFormVisible = false
              this.init()
            })
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    deleteData() {
      deleteSdcLightTask(this.delId).then(() => {
        this.dialogVisible = false
        this.init()
      })
    },
    setAction(val) {
      let plateColorMap = this.$dictUtils.getDictList('light_action_type')
      let text
      for (let index = 0; index < plateColorMap.length; index++) {
        const el = plateColorMap[index];
        if (el.value === val.action) {
          text = el.label
          break;
        }
      }
      return text
    },
    setTargetNames(val) {
      let text = ''
      if(val.expand.targetNames) {
        for (let index = 0; index < val.expand.targetNames.length; index++) {
          const el = val.expand.targetNames[index];
          if(index === val.expand.targetNames.length - 1) {
            text += el
          }else {
            text += el + ','
          }
        }
      }
      return text
    },
    setpage(data) {
      this.page = data.current;
      this.size = data.size;
      this.total = data.total;
      this.pageKey = (new Date()).toString() + 1
    },
    queryPolicyByPage() {
      
    },
    handleSelectionChangeDevice(val){
      if(val.length > 0 ) {
        this.isDisabled = false
        this.policyForm.targetId = val[0].id
      } else {
        this.isDisabled = true
      }
    },
    saveTarget() {
      sdcLightTaskTargetAction(this.policyForm,'post').then(res => {
        this.relationDialogVisible = false
        this.queryInfo()
      })
    },
    changeSite(val) {
      if(val.length !== 0) {
        this.inputForm.siteId = val[val.length - 1];
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>