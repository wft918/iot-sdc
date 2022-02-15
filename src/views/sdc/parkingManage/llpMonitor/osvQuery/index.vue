<template>
  <div>
    <basic-container>
      <el-row :gutter="15">
        <el-col :span="4">
          <span>停车场：</span>
          <el-select placeholder="请选择停车场" v-model="parkingName" style="width:70%">
            <el-option
              v-for="item in parkingNameMap"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <span>车牌号：</span>
          <el-input v-model="carPlateCode" style="width:60%"></el-input>
        </el-col>
        <el-col :span="4">
          <span>车牌颜色：</span>
          <el-select v-model="carPlatesColor" style="width:60%">
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
          <el-select v-model="carType" style="width:60%">
            <el-option
              v-for="item in this.$dictUtils.getDictList('car_type')"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <span>入场时间：</span>
          <el-date-picker
            v-model="admissionDate"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            style="width:70%"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="3">
          <div>
            <el-button type="primary" size="small" @click="queryInfoClick">
              <i class="el-icon-search"></i> 查询
            </el-button>
            <el-button type="primary" size="small" @click="clearCondition">
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
                prop="parkId"
                label="停车场名称"
                align="center"
                :formatter="setParkName"
              ></el-table-column>
              <el-table-column 
                prop="plateNumber"
                label="车牌号"
                align="center"
              ></el-table-column>
              <el-table-column 
                prop="carPlatesColor"
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
                prop="inTime"
                label="入场时间"
                align="center"
              ></el-table-column>
              <el-table-column 
                label="入场道闸" 
                prop="expand.inBarrierName" 
                align="center"
              ></el-table-column>
              <el-table-column 
                prop="contactsName"
                label="车主姓名"
                align="center"
              ></el-table-column>
              <el-table-column 
                prop="contactsPhone"
                label="车主电话"
                align="center"
              ></el-table-column>
            </el-table>
            <Pagination :page="page" :size="size" :total="total" :key="pageKey" @pagination="queryByPage"></Pagination>
          </el-col>
      </el-row>
    </basic-container>
    
  </div>
</template>

<script>
import { sdcSiteAction } from "@/api/sdc/addressInfo";
import { modifyData } from "@/util/domainFilter";
import Pagination from "@/components/Pagination";

import {  getSdcChargeuselogInternalTable } from "@/api/sdc/parkMonitor";
import { getSdcParkingLotTable } from "@/api/sdc/parkManage";
import { getSdcTableBy } from "@/api/sdc/deviceInfo";
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
      parkingName: null,
      parkingNameMap: [],
      carPlateCode:'',
      carPlatesColor:'',
      carPlatesColorMap: [],
      carType: '',
      carTypeMap: [],
      admissionDate: null,
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
      pageKey:Math.random().toString(36).slice(-6),
      queryCondition: {},
      barrierList: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      this.getParkInfo()
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

      // let barrierData = await getSdcTableBy({
      //   current: 1,
      //   size: 100,
      //   topTypeCode: 'barrier'
      // })
      // barrierData.data.data.records.forEach((el) => {
      //   this.barrierList.push({
      //     value: el.id,
      //     label: el.name,
      //   });
      // });


    },
    queryInfoClick() {
      this.setQueryCondition()
      this.queryCondition.current = 1
      this.queryInfo()
    },
    async queryInfo() {
      let tableData = await getSdcChargeuselogInternalTable(this.queryCondition)
      console.log(tableData,'tableData');
      this.tableInfo = tableData.data.data.records
      this.setpage(tableData.data.data);
    },
    setQueryCondition() {
      this.queryCondition = {
        current:this.page,
        size: this.size
      }
      this.parkingName ? this.queryCondition.parkId = this.parkingName : null
      this.carPlateCode ? this.queryCondition.plateNumber = this.carPlateCode : null
      this.carPlatesColor ? this.queryCondition.plateColor = this.carPlatesColor : null
      this.carType ? this.queryCondition.carType = this.carType : null
      
      if(this.admissionDate) {
        this.queryCondition['expand.inTimeBegin']= moment(this.admissionDate[0]).format('YYYY-MM-DD HH:mm:ss')
        this.queryCondition['expand.inTimeEnd'] = moment(this.admissionDate[1]).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    clearCondition() {
      this.parkingName = null
      this.carPlateCode = null
      this.carPlatesColor = null
      this.carType = null
      this.admissionDate = null
    },
    async queryByPage(data) {
      this.page = data.page
      this.size = data.size
      this.queryCondition.current = this.page
      this.queryCondition.size = this.size
      this.queryInfo()
    },
    setpage(data) {
      this.page = data.current;
      this.size = data.size;
      this.total = data.total;
      this.pageKey = (new Date()).toString() + 1
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
    setInBarrierId(val) {
      let text
      for (let index = 0; index < this.barrierList.length; index++) {
        const el = this.barrierList[index];
        if (el.value === val.inBarrierId) {
          text = el.label
          break;
        }
      }
      return text
    },
    setPayType(val) {
      let plateColorMap = this.$dictUtils.getDictList('pay_type')
      let text
      for (let index = 0; index < plateColorMap.length; index++) {
        const el = plateColorMap[index];
        if (el.value === val.payChannelId) {
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

</style>