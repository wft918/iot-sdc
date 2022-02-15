<template>
  <div>
    <basic-container>
      <el-row :gutter="15">
        <el-col :span="4">
          <span>车牌号：</span>
          <el-input v-model="plateNumber" style="width:70%"></el-input>
        </el-col>
        <el-col :span="6">
          <span>区域：</span>
          <el-cascader 
            ref="areaMsg"
            :options="condition" 
            style="width:80%" 
            v-model="address"
            :props="{ value: 'id', label: 'name', children: 'children' }"
            clearable
            filterable
            @change="changeAddress"
          ></el-cascader>
        </el-col>
        <el-col :span="5">
          <span>停车场名称：</span>
          <el-select v-model="parkingName" style="width:70%" :disabled="parkDisabled">
            <el-option
              v-for="item in parkingMap"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <span>车位号：</span>
          <el-input v-model="parkPlaceCode" style="width:70%"></el-input>
          <!-- <el-select v-model="parkPlaceCode" style="width:70%">
              <el-option
                v-for="item in parkPlaceCodeMap"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select> -->
        </el-col>
        <el-col :span="5">
          <span>车牌颜色：</span>
          <el-select v-model="plateColor" style="width:70%">
            <el-option
              v-for="item in this.$dictUtils.getDictList('plate_color_type')"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <span>车辆类型：</span>
          <el-select v-model="carType" style="width:63%">
            <el-option
              v-for="item in this.$dictUtils.getDictList('car_type')"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <span>到期日期：</span>
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
                prop="plateNumber"
                label="车牌号"
                align="center"
              ></el-table-column>
              <el-table-column 
                prop="plateColor"
                label="车牌颜色"
                align="center"
                :formatter="setPlateColorType"
              ></el-table-column>
              <el-table-column 
                prop="carType"
                label="车辆类型"
                align="center"
                :formatter="setCarType"
              ></el-table-column>
              <el-table-column 
                prop="parkingSpaceId"
                label="车位号"
                align="center"
                :formatter="setParkingSpaceId"
              ></el-table-column>
              <!-- <el-table-column 
                prop="siteName"
                label="所属园区"
                align="center"
              ></el-table-column> -->
              <el-table-column 
                prop="parkId"
                label="停车场名称"
                align="center"
                :formatter="setParkName"
              ></el-table-column>
              <el-table-column 
                prop="expiryBegin"
                label="有效期开始时间"
                align="center"
              ></el-table-column>
              <el-table-column 
                prop="expiryEnd"
                label="有效期截止时间"
                align="center"
              ></el-table-column>
              <el-table-column  label="联系人：" prop="contactsName" align="center">
              </el-table-column >
              <el-table-column  label="联系电话：" prop="contactsPhone" align="center">
              </el-table-column >
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
          ref="carForm"
          :key="dialogKey"
          :disabled="isdisabled"
        >
          <el-form-item label="车牌号" prop="plateNumber" >
            <el-input v-model="inputForm.plateNumber" ></el-input>
          </el-form-item>
          <el-form-item label="车牌颜色" prop="plateColor" >
            <el-select v-model="inputForm.plateColor" style="width:55%">
              <el-option
                v-for="item in this.$dictUtils.getDictList('plate_color_type')"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车辆类型" prop="carType" >
            <el-select v-model="inputForm.carType" style="width:55%">
              <el-option
                v-for="item in this.$dictUtils.getDictList('car_type')"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="停车场名称" prop="parkId">
            <el-select v-model="inputForm.parkId" style="width:50%" @change="queryParkPlace">
              <el-option
                v-for="item in parkingNameMap"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车位号" prop="parkingSpaceId">
            <!-- <el-select v-model="parkPlaceCode" style="width:70%">
              <el-option
                v-for="item in parkPlaceCodeMap"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select> -->
            <el-select v-model="inputForm.parkingSpaceId" style="width:55%">
              <el-option
                v-for="item in parkPlaceCodeMap"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="有效期开始时间" prop="expiryBegin">
            <el-date-picker
              v-model="inputForm.expiryBegin"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="有效期截止时间" prop="expiryEnd">
            <el-date-picker
              v-model="inputForm.expiryEnd"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="联系人：" prop="contactsName">
            <el-input v-model="inputForm.contactsName" ></el-input>
          </el-form-item>
          <el-form-item label="联系电话：" prop="contactsPhone">
            <el-input v-model="inputForm.contactsPhone" ></el-input>
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

import { sdcCarAction,getSdcCarTable,getSdcParkingLotTable,getSdcParkPlaceTable,getSdcParkingLotBySiteId,getSdcCarSiteTree } from "@/api/sdc/parkManage";
import { clone } from "@/util/domainFun";

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
      plateNumber: null,
      address: null,
      condition: [],
      dueDate: '',
      parkingName: '',
      parkingNameMap: [],
      parkingMap: [],
      plateColor: null,
      carPlatesColorMap: [],
      parkPlaceCode: null,
      parkPlaceCodeMap: [],
      carType: null,
      carTypeMap: [],
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
      inputForm: {
        plateNumber: null,
        plateColor: null,
        carType: null,
        siteId: null,
        parkId: null,
        parkingSpaceId:null,
        expiryBegin: null,
        expiryEnd: null,
        contactsName: null,
        contactsPhone: null,
      },
      rules: {
        plateNumber: [
          { required: true, message: "请输入车牌号", trigger: "blur" },
        ],
        plateColor: [{ required: true, message: "请输入车牌颜色", trigger: "blur" }],
        carType: [{ required: true, message: "请输入序号", trigger: "blur" }],
        // siteId: [
        //   { required: true, message: "请输入车辆类型", trigger: "blur" },
        // ],
        parkId: [{ required: true, message: "请输入停车场名称", trigger: "blur" }],
        // parkingSpaceId: [{ required: true, message: "请输入车位号", trigger: "blur" }],
        expiryEnd: [
          {required: true, validator: expiryEndValiate, trigger: "blur"},
        ],
        expiryBegin: [
          {required: true, validator: expiryBeginValiate, trigger: "blur" },
        ],
        contactsName: [{ required: true, message: "请输入联系人", trigger: "blur" }],
        contactsPhone: [{ required: true, message: "请输入联系电话", trigger: "blur" }],
      },
      dialogKey: Math.random().toString(36).slice(-6),
      isdisabled: false,
      parkTypeMap: [],
      dialogVisible: false,
      delId: null,
      dialogTitle: null,
      queryCondition: {},
      parkDisabled: true,
      psDisabled: true,
      parkPlaceMap: [],
    }
  },
  computed: {
     
  },
  created() {
    this.getParkSpaceInfo()
    this.getParkInfo()
    this.init()
  },
  methods: {
    async init() {
      //获取区域数据
      let data = await getSdcCarSiteTree()
      this.condition = modifyData(data.data.data.treeList)
      this.queryInfo()
    },
    //获取停车场信息
    async getParkInfo() {
      let tableData = await getSdcParkingLotTable({
        current: 1,
        size: 100
      })
      tableData.data.data.records.forEach((el) => {
        this.parkingNameMap.push({
          value: el.id,
          label: el.name,
        });
      });
    },
    async getParkSpaceInfo() {
      let tableData = await getSdcParkPlaceTable({
        current: 1,
        size: 100
      })
      tableData.data.data.records.forEach((el) => {
        this.parkPlaceCodeMap.push({
          value: el.id,
          label: el.name,
        });
      });
    },
    async addInfo() { 
      this.dialogTitle = '新建车辆信息'
      this.inputForm.actionType = 1
      this.dialogFormVisible = true
      this.psDisabled = true
      this.dialogKey = new Date().toString()
    },
    setQueryCondition() {
      this.queryCondition = {
        current:this.page,
        size: this.size
      }
      console.log(this.address,'asd');
      this.plateNumber ? this.queryCondition.plateNumber = this.plateNumber : null
      this.parkingName ? this.queryCondition.parkId = this.parkingName : null
      this.parkPlaceCode ? this.queryCondition.parkingSpaceId = this.parkPlaceCode : null
      this.plateColor ? this.queryCondition.plateColor = this.plateColor : null
      this.carType ? this.queryCondition.carType = this.carType : null
      if(this.dueDate) {
        this.queryCondition['expand.expiryEndBegin'] = moment(this.dueDate[0]).format('YYYY-MM-DD HH:mm:ss')
        this.queryCondition['expand.expiryEndEnd'] = moment(this.dueDate[1]).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    queryInfoClick() {
      this.setQueryCondition()
      this.queryCondition.current = 1
      this.queryInfo()
    },
    async queryInfo() {
      let tableData = await getSdcCarTable(this.queryCondition)
      console.log(tableData,'tableData');
      this.tableInfo = tableData.data.data.records
      this.setpage(tableData.data.data);
    },
    clearCondition() {
      this.plateNumber = null
      this.parkingName = null
      this.plateColor = null
      this.carType = null
      this.parkPlaceCode = null 
      this.dueDate = null
      this.address = []
      this.changeAddress()
    },
    async changeAddress() {
      if(this.address.length !== 0) {
        this.parkDisabled = false
        let tableData = await getSdcParkingLotBySiteId(this.address[this.address.length - 1])
        tableData.data.data.forEach((el) => {
          this.parkingMap.push({
            value: el.id,
            label: el.name,
          });
        });
      }else {
        this.parkDisabled = true
        this.parkingMap = []
      }
      
    },
    tableAction(row,flag) {
      if(flag === 3) {
        this.dialogTitle = '查看车辆信息'
        this.isdisabled = true
        this.inputForm = clone(row)
        this.inputForm.actionType = 3
        this.dialogFormVisible = true
      } else if( flag === 2) {
        this.dialogTitle = '编辑车辆信息'
        
        this.inputForm = clone(row)
        this.inputForm.actionType = 2
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
      this.inputForm =  {
        plateNumber: null,
        plateColor: null,
        carType: null,
        siteId: null,
        parkId: null,
        parkingSpaceId:null,
        expiryBegin: null,
        expiryEnd: null,
        contactsName: null,
        contactsPhone: null,
      }
      this.isdisabled = false
    },
    changeSite() {

    },
    submitForm() {
      this.$refs.carForm.validate((valid) => {
        this.inputForm.expiryBegin = moment(this.inputForm.expiryBegin).format('YYYY-MM-DD HH:mm:ss')
        this.inputForm.expiryEnd = moment(this.inputForm.expiryEnd).format('YYYY-MM-DD HH:mm:ss')
        if (valid) {
          if(this.inputForm.actionType === 1) {
            this.inputForm.createDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            sdcCarAction(this.inputForm, "", "post").then(() => {
              this.dialogFormVisible = false
              this.init()
            })
          } else {
            this.inputForm.updateDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            sdcCarAction(this.inputForm, "", "put").then(() => {
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
      sdcCarAction('', '/'+this.delId, "delete").then(() => {
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
    setParkingSpaceId(val) {
      let text
      for (let index = 0; index < this.parkPlaceCodeMap.length; index++) {
        const el = this.parkPlaceCodeMap[index];
        if (el.value === val.parkingSpaceId) {
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
    setPlateColorType(val) {
      let plateColorMap = this.$dictUtils.getDictList('plate_color_type')
      let text
      for (let index = 0; index < plateColorMap.length; index++) {
        const el = plateColorMap[index];
        if (el.value === val.plateColor) {
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
      this.pageKey = (new Date()).toString() + 1
    },
    /**
      * 比较两个日期 2020-02-20
      * @param start 起始日期
      * @param end   结束日期
      * @returns {boolean} true|false
    */
    compareDate (start, end) {
      console.log(start,end);
      return end > start
    },
    //根据停车场名称查询对应车位
    async queryParkPlace() {
      this.psDisabled = false
      this.parkPlaceMap = []
      let tableData = await getSdcParkPlaceTable({
        current: 1,
        size: 100,
        parkId: this.inputForm.parkId
      })
      tableData.data.data.records.forEach((el) => {
        this.parkPlaceMap.push({
          value: el.id,
          label: el.name,
        });
      });
    }
  }
}
</script>

<style lang="scss" scoped>

</style>