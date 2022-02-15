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
         <el-col :span="4">
          <span>充电桩：</span>
          <el-select placeholder="请选择充电桩" v-model="chargePile" style="width:70%">
            <el-option
              v-for="item in chargePileMap"
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
          <span>缴费方式：</span>
          <el-select v-model="paymentMethods" style="width:55%">
            <el-option
              v-for="item in this.$dictUtils.getDictList('pay_type')"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <span>缴费时间：</span>
          <el-date-picker
            v-model="paymentDate"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            style="width:75%"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="3">
          <div>
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
                prop="orderId"
                label="充电单号"
                align="center"
              ></el-table-column>
              <el-table-column 
                prop="parkId"
                label="停车场名称"
                align="center"
                :formatter="setParkName"
              ></el-table-column>
              <!-- <el-table-column 
                prop="chargePileName"
                label="充电桩名称"
                align="center"
              ></el-table-column>
              <el-table-column 
                prop="siteName"
                label="所在位置"
                align="center"
                sortable
              ></el-table-column> -->
              <el-table-column 
                prop="plateNumber"
                label="车牌号"
                align="center"
              ></el-table-column>
              <el-table-column 
                prop="beginTime"
                label="开始充电时间"
                align="center"
              ></el-table-column>
              <!-- <el-table-column 
                prop="esEndDate"
                label="预计结束时间"
                align="center"
                sortable
              ></el-table-column> -->
              <!-- <el-table-column 
                prop="escDate"
                label="预计充电时长"
                align="center"
              ></el-table-column> -->
              <el-table-column 
                label="实际结束时间" 
                prop="endTime" 
                align="center"
              ></el-table-column>
              <el-table-column 
                prop="acDate"
                label="实际充电时长"
                align="center"
                :formatter="setParkTime"
              ></el-table-column>
              <el-table-column 
                label="应缴金额（元）"
                align="center"
              >
                <template slot-scope="scope">{{scope.row.amount || '--'}}</template>
              </el-table-column>
              <el-table-column 
                prop="payTime"
                label="缴费时间"
                align="center"
              ></el-table-column>
              <el-table-column 
                prop="payChannelId"
                label="缴费方式"
                align="center"
                :formatter="setPayType"
              ></el-table-column>
              <!-- <el-table-column 
                prop="ownerName"
                label="车主姓名"
                align="center"
              ></el-table-column>
              <el-table-column 
                prop="caretaker"
                label="值班人"
                align="center"
              ></el-table-column> -->
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

import {  getSdcChargeuselogTable } from "@/api/sdc/parkMonitor";
import { getSdcParkingLotTable } from "@/api/sdc/parkManage";
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
      chargePile:'',
      chargePileMap: [],
      paymentDate: null,
      paymentMethods: '',
      paymentMethodsMap: [],
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
      queryCondition: {}
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
    },
    queryInfoClick() {
      this.setQueryCondition()
      this.queryCondition.current = 1
      this.queryInfo()
    },
    async queryInfo() {
      let tableData = await getSdcChargeuselogTable(this.queryCondition)
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
      this.paymentMethods ? this.queryCondition.payChannelId = this.paymentMethods : null
      
      if(this.paymentDate) {
        this.queryCondition['expand.payTimeBegin'] = moment(this.paymentDate[0]).format('YYYY-MM-DD HH:mm:ss')
        this.queryCondition['expand.payTimeEnd'] = moment(this.paymentDate[1]).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    clearCondition() {
      this.parkingName = null
      this.chargePile = null
      this.carPlateCode = null
      this.paymentMethods = null
      this.paymentDate = null
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
    },
    setParkTime(val) {
      console.info(val)
      let text = ''
      if(val.beginTime) {
        let time = val.endTime 
        ? new Date(val.endTime).getTime() - new Date(val.beginTime).getTime()
        : new Date().getTime() - new Date(val.beginTime).getTime()
        let total = time/1000

        let day = parseInt(total / (24*60*60));//计算整数天数

        let afterHour = total - day*24*60*60;//取得算出天数后剩余的秒数

        let hour = parseInt(afterHour/(60*60));//计算整数小时数

        let afterMin = total - day*24*60*60 - hour*60*60;//取得算出小时数后剩余的秒数

        let min = parseInt(afterMin/60);//计算整数分

        let afterSeconds = parseInt(total - day*24*60*60 - hour*60*60 - min*60);//取得算出分后剩余的秒数
        
        if(day !== 0) {
          text += day + ' 天 '
        }
        if(hour !== 0) {
          text += hour + ' 小时 '
        }
        if(min !== 0) {
          text += min + ' 分 '
        }
        if(afterSeconds !== 0) {
          text += afterSeconds + ' 秒 '
        }
      }
      
      return text
    }
  }
}
</script>

<style lang="scss" scoped>

</style>