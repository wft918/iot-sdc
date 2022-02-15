<template>
  <div>
    <basic-container>
      <el-row :gutter="15">
        <el-col :span="6">
          <span>收费规则名称：</span>
          <el-select v-model="chargeRulesName" style="width:70%">
            <el-option
              v-for="item in chargeRulesNameMap"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <span>状态：</span>
          <el-select v-model="crStatus" style="width:70%">
            <el-option
              v-for="item in this.$dictUtils.getDictList('bill_status_type')"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="15">
          <div>
            <el-button type="primary" @click="queryInfoClick">
              <i class="el-icon-search"></i> 查询
            </el-button>
            <el-button type="primary" @click="clearCondition">
              <i class="el-icon-delete"></i> 清空
            </el-button>
          </div>
        </el-col>
        <el-col>
          <el-button type="primary" @click="addInfo">
            <i class="el-icon-plus"></i> 新增
          </el-button>
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
                prop="code"
                label="规则编号"
                align="center"
                sortable
              ></el-table-column>
              <el-table-column 
                prop="name"
                label="规则名称"
                align="center"
              ></el-table-column>
              <el-table-column 
                prop="parkId"
                label="停车场名称"
                align="center"
                :formatter="setParkName"
              ></el-table-column>
              <el-table-column 
                prop="carType"
                label="车辆类型"
                align="center"
                :formatter="setCarType"
              ></el-table-column>
              <el-table-column 
                prop="billType"
                label="计费规则"
                align="center"
                :formatter="setBillType"
              ></el-table-column>
              <el-table-column 
                prop="beginTime"
                label="有效期开始时间"
                align="center"
              ></el-table-column>
              <el-table-column 
                prop="status"
                label="状态"
                align="center"
                :formatter="setStatus"
              ></el-table-column>
              <el-table-column 
                prop="createDate"
                label="创建时间"
                align="center"
              ></el-table-column>
              <el-table-column 
                label="操作"
              >
                <template slot-scope="scope">
                  <span class="table-action" @click="tableAction(scope.row, 2)">编辑</span>
                  <span class="table-action" @click="tableAction(scope.row, 3)">查看</span>
                  <span class="table-action" @click="tableAction(scope.row, 4)">删除</span>
                  
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
          ref="chargeRulesForm"
          :key="dialogKey"
          :disabled="isdisabled"
        >
          <el-form-item label="规则编号" prop="code" >
            <el-input v-model="inputForm.code" ></el-input>
          </el-form-item>
          <el-form-item label="规则名称" prop="name" >
            <el-input v-model="inputForm.name" ></el-input>
          </el-form-item>
          <el-form-item label="停车场名称" prop="parkId">
            <el-select v-model="inputForm.parkId" style="width:50%" @change="selectParkInfo">
              <el-option
                v-for="item in parkingNameMap"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车辆类型" prop="carType" >
            <el-select v-model="inputForm.carType" style="width:70%">
              <el-option
                v-for="item in this.$dictUtils.getDictList('car_type')"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="计费类型" prop="billType">
            <el-select v-model="inputForm.billType" style="width:70%">
              <el-option
                v-for="item in this.$dictUtils.getDictList('bill_rules_type')"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="规则内容" prop="ruleContent" v-if=" inputForm.billType === '0' || inputForm.billType === '3' || inputForm.billType === '1' || inputForm.billType === '4' ">
            <template v-if="inputForm.billType === '1' || inputForm.billType === '4' ">
              包月收费 <el-input v-model="inputForm.ruleContent" type="text" style="width:100px"></el-input> 元
            </template>
            <template v-if="inputForm.billType === '0' || inputForm.billType === '3' ">
              <template slot v-if="inputForm.parkId">
                <div>{{parkInfo.freeTime}} 分钟之内免费；</div>
                <div>
                  之后每 {{parkInfo.unitDuration}} 分钟收费
                  <el-input v-model="inputForm.ruleContent" type="text" style="width:100px"></el-input> 元
                </div>
                <div>全天24小时 {{parkInfo.feeUpperLimit}} 元封顶</div>
              </template>
              <template v-else>请选择停车场</template>
            </template>
          </el-form-item>
          <el-form-item label="状态" prop="status" >
            <el-select v-model="inputForm.status" style="width:70%">
              <el-option
                v-for="item in this.$dictUtils.getDictList('bill_status_type')"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="有效期开始时间" prop="beginTime">
            <el-date-picker
              v-model="inputForm.beginTime"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="备注：" prop="remarks">
            <el-input type="textarea" rows="2" v-model="inputForm.remarks" ></el-input>
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

import { getSdcParkingLotTable, sdcBillRulesAction, getSdcBillRulesTable} from "@/api/sdc/parkManage";
import { clone } from "@/util/domainFun";

import moment from "moment";

export default {
  components: {
    Pagination
  },
  data() {
    return {
      page:1,
      size: 10,
      total: 0,
      pageKey: Math.random().toString(36).slice(-6),
      chargeRulesName: null,
      chargeRulesNameMap: [],
      parkingNameMap: [],
      crStatus:'',
      tableInfo: [],
      dialogFormVisible: false,
      inputForm: {
        code: null,
        name: null,
        parkId: null,
        carType: null,
        billType: null,
        ruleContent: null,
        status: null,
        beginTime: null,
        remarks: null,
      },
      rules: {
        code: [
          { required: true, message: "请输入规则编号", trigger: "blur" },
        ],
        name: [
          { required: true, message: "请输入规则名称", trigger: "blur" },
        ],
        parkId: [{ required: true, message: "请输入停车场名称", trigger: "blur" }],
        carType: [{ required: true, message: "请输入车辆类型", trigger: "blur" }],
        billType: [
          { required: true, message: "请输入计费类型", trigger: "blur" },
        ],
        ruleContent: [
          { required: true, message: "请输入规则内容", trigger: "blur" },
        ],
        status: [{ required: true, message: "请输入状态", trigger: "blur" }],
        beginTime: [{ required: true, message: "请输入有效期开始时间", trigger: "blur" }],
      },
      dialogKey: Math.random().toString(36).slice(-6),
      isdisabled: false,
      dialogVisible: false,
      delId: null,
      dialogTitle: null,
      queryCondition: {},
      parkData: null,
      parkInfo: null
    }
  },
  created() {
    this.getParkInfo()
    this.getChargeRulesInfo()
    this.init()
  },
  methods: {
    async init() {
      //获取区域数据
      let data = await sdcSiteAction('','/tree','get')
      this.condition = modifyData(data.data.data)
      this.queryInfo()
    },
    //获取停车场信息
    async getParkInfo() {
      let tableData = await getSdcParkingLotTable({
        current: 1,
        size: 100
      })
      this.parkData = tableData.data.data.records
      this.parkData.forEach((el) => {
        this.parkingNameMap.push({
          value: el.id,
          label: el.name,
        });
      });
    },
    selectParkInfo() {
      for (let index = 0; index < this.parkData.length; index++) {
        const el = this.parkData[index];
        if(el.id === this.inputForm.parkId) {
          this.parkInfo = el
          break
        }
      }
      console.log(this.parkInfo,'this.parkInfo');
    },
    async getChargeRulesInfo() {
      let tableData = await getSdcBillRulesTable({
        current: 1,
        size: 100
      })
      this.chargeRulesNameMap = []
      tableData.data.data.records.forEach((el) => {
        this.chargeRulesNameMap.push({
          value: el.id,
          label: el.name,
        });
      });
    },
    async addInfo() { 
      this.dialogTitle = '新建计费规则信息'
      this.inputForm.actionType = 1
      this.dialogFormVisible = true
      this.dialogKey = new Date().toString()
    },
    setQueryCondition() {
      this.queryCondition = {
        current:this.page,
        size: this.size
      }
      
      this.chargeRulesName ? this.queryCondition.id = this.chargeRulesName : null
      this.crStatus ? this.queryCondition.status = this.crStatus : null
    },
    queryInfoClick() {
      this.setQueryCondition()
      this.queryCondition.current = 1
      this.queryInfo()
    },
    async queryInfo() {
      let tableData = await getSdcBillRulesTable(this.queryCondition)
      console.log(tableData,'tableData');
      this.tableInfo = tableData.data.data.records
      this.setpage(tableData.data.data);
    },
    clearCondition() {
      this.chargeRulesName = null
      this.crStatus = null
    },
    changeAddress() {

    },
    tableAction(row,flag) {
      console.log(row,'row');
      if(flag === 3) {
        this.dialogTitle = '查看计费规则信息'
        
        this.isdisabled = true
        this.inputForm = clone(row)
        this.inputForm.actionType = 3
        this.selectParkInfo()
        this.dialogFormVisible = true
      } else if( flag === 2) {
        this.dialogTitle = '编辑计费规则信息'
        this.inputForm = clone(row)
        this.inputForm.actionType = 2
        this.selectParkInfo()
        this.dialogFormVisible = true 
      } else if( flag === 4) {
        this.dialogVisible = true
        this.delId = row.id
      }
      this.dialogKey = new Date().toString()
    },
    async queryByPage(data) {
      this.page = data.page
      this.size = data.size
      this.queryCondition.current = this.page
      this.queryCondition.size = this.size
      this.queryInfo()
    },
    refreshData() {
      this.inputForm = {
        code: null,
        name: null,
        parkId: null,
        carType: null,
        billType: null,
        ruleContent: null,
        status: null,
        beginTime: null,
        remarks: null,
      }
      this.isdisabled = false
    },
    changeSite() {

    },
    submitForm() {
      this.$refs.chargeRulesForm.validate((valid) => {
        this.inputForm.beginTime = moment(this.inputForm.beginTime).format('YYYY-MM-DD HH:mm:ss')
        
        if (valid) {
          if(this.inputForm.actionType === 1) {
            this.inputForm.createDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            sdcBillRulesAction(this.inputForm, "", "post").then(() => {
              this.dialogFormVisible = false
              this.init()
              this.getChargeRulesInfo()
            })
          } else {
            this.inputForm.updateDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            sdcBillRulesAction(this.inputForm, "", "put").then(() => {
              this.dialogFormVisible = false
              this.init()
              this.getChargeRulesInfo()
            })
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    deleteData() {
      sdcBillRulesAction('', '/'+this.delId, "delete").then(() => {
        this.dialogVisible = false
        this.init()
      })
    },
    setParkName(val) {
      let text
      for (let index = 0; index < this.parkingNameMap.length; index++) {
        const el = this.parkingNameMap[index];
        if (el.value === val.parkId) {
          text = el.label
          break;
        }
      }
      return text
    },
    setBillType(val) {
      let billMap = this.$dictUtils.getDictList('bill_rules_type')
      let text
      for (let index = 0; index < billMap.length; index++) {
        const el = billMap[index];
        if (el.value === val.billType) {
          text = el.label
          break;
        }
      }
      return text
    },
    setStatus(val) {
      let statusMap = this.$dictUtils.getDictList('bill_status_type')
      let text
      for (let index = 0; index < statusMap.length; index++) {
        const el = statusMap[index];
        if (el.value === val.status) {
          text = el.label
          break;
        }
      }
      return text
    },
    setCarType(val) {
      let carTypeMap = this.$dictUtils.getDictList('car_type')
      let text
      for (let index = 0; index < carTypeMap.length; index++) {
        const el = carTypeMap[index];
        if (el.value === val.carType) {
          text = el.label
          break;
        }
      }
      return text
    },
    setpage(data) {
      this.page = data.current;
      this.size = data.size;
      this.total = data.total;
      this.pageKey = (new Date()).toString()
    },
  }
}
</script>

<style lang="scss" scoped>

</style>