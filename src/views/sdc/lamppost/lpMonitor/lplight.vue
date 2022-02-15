<template>
  <div>
    <basic-container>
      <el-row :gutter="15">
        <el-col :span="8">
          <!-- <span>所属园区：</span>
          <el-cascader 
            ref="areaMsg"
            :options="condition" 
            style="width:80%" 
            v-model="address"
            :props="{ value: 'id', label: 'name', children: 'children' }"
            clearable
            filterable
            @change="changeAddress"
          ></el-cascader> -->
        </el-col>
        <el-col :span="10">
          <!-- <span>灯杆编号：</span>
          <el-select v-model="parkingName" style="width:25%">
            <el-option
              v-for="item in parkingMap"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select> -->
        </el-col>
        <el-col :span="6">
          <div class="query-btn-group">
            <el-button type="primary" @click="sendCMD(1)" :disabled="lightDisabled"> 开灯 </el-button>
            <el-button type="primary" @click="sendCMD(2)" :disabled="lightDisabled"> 关灯 </el-button>
            <el-slider
              v-model="luminanceVal"
              style="width:80px;display: inline-block;vertical-align: middle;margin-left:10px;"
            />
            <el-button type="primary" @click="sendCMD(3)" :disabled="lightDisabled"> 调光 </el-button>
          </div>
        </el-col>
      </el-row>
      <el-table :data="tableInfo" @selection-change="handleSelectionChangeDevice">
        <el-table-column type="selection" width="55" />
        <el-table-column
          type="index"
          label="序号"
          align="center"
          sortable
        ></el-table-column>
        <el-table-column
          prop="lightDev.name"
          align="center"
          label="灯具名称"
        ></el-table-column>
        <el-table-column
          prop="lightDev.typeName"
          align="center"
          label="设备类型"
        ></el-table-column>
        <el-table-column
          prop="lightDev.siteName"
          align="center"
          label="所属园区"
        ></el-table-column>
        <el-table-column
          prop="light.name"
          align="center"
          label="所属灯杆"
        ></el-table-column>
        <el-table-column
          prop="netStatus"
          align="center"
          :formatter="setNetStatus"
          label="在线状态"
        ></el-table-column>
        <el-table-column
          prop="deviceStatus"
          align="center"
          :formatter="setDevStatus"
          label="设备状态"
        ></el-table-column>
        <el-table-column
          prop="luminance"
          align="center"
          label="亮度"
        ></el-table-column>
        <el-table-column
          prop="voltage"
          align="center"
          label="电压"
        ></el-table-column>
        <el-table-column
          prop="powerCurrent"
          align="center"
          label="电流"
        ></el-table-column>
        <el-table-column
          prop="activePowerEfficiency"
          align="center"
          label="有功功率"
        ></el-table-column>
        <el-table-column
          prop="reactivePowerEfficiency"
          align="center"
          label="无功功率"
        ></el-table-column>
        <el-table-column
          prop="powerFactor"
          align="center"
          label="功率因素"
        ></el-table-column>
        <el-table-column
          prop="activePower"
          align="center"
          label="有功电能"
        ></el-table-column>
        <el-table-column
          prop="reactivePower"
          align="center"
          label="无功电能"
        ></el-table-column>
        <el-table-column
          prop="apparentPower"
          align="center"
          label="视在电能"
        ></el-table-column>
        <el-table-column
          prop="latestRunTime"
          align="center"
          label="运行时间"
        ></el-table-column>
        <el-table-column
          prop="updateDate"
          align="center"
          label="更新时间"
        ></el-table-column>
        <el-table-column
          prop="frequency"
          align="center"
          label="频率（Hz）"
        ></el-table-column>
        <el-table-column
          prop="temperature"
          align="center"
          label="温度（℃）"
        ></el-table-column>
        <!-- <el-table-column
          prop="name"
          align="center"
          label="能耗趋势"
        ></el-table-column> -->
      </el-table>
      <Pagination
        :page="page"
        :size="size"
        :total="total"
        :key="pageKey"
        @pagination="queryByPage"
      ></Pagination>
    </basic-container>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { getSdcTableBy,getSdcGateInfo } from "@/api/sdc/deviceInfo";
import {
  getSdcLightLampsTable,
  updateSdcLightLamp
} from "@/api/sdc/lpmonitor";

import { clone } from "../../../../util/domainFun";

export default {
  components: {
    Pagination,
  },
  data() {
    return {
      address: null,
      condition: [],
      parkingName: "",
      parkingMap: [],
      page: 1,
      size: 10,
      total: 0,
      pageKey: Math.random().toString(36).slice(-6),
      lightInfo: [],
      tableInfo: [],
      luminanceVal: 50,
      lightForm: [],
      lightDisabled: true,
      selectedForm: []
    };
  },
  created() {
    this.init()
  },
  methods: {
    handleSelectionChangeDevice(val){
      console.log(val);
      if(val.length > 0) {
        this.lightDisabled = false
        val.forEach(item => {
          if (item.netStatus === '0') {
            this.lightDisabled = true
          }
        })        
        // this.lightForm = clone(val[0])
        this.selectedForm = val
      } else {
        this.lightDisabled = true
      }
    },
    // 命令下发
    sendCMD(type) {  
      this.selectedForm.forEach(item => {
        this.lightForm.push(clone(item))
      })
      let prosArr = []
      this.lightForm.forEach(item => {
        switch (type) {
        case 1:
          item.deviceStatus = '1'
          break;
        case 2:
          item.deviceStatus = '0'
          break;
        case 3:
          item.luminance = this.luminanceVal
          break;
        }
        prosArr.push(updateSdcLightLamp(item))
      })
      Promise.all(prosArr).then(res => {
        let successArr = []
        res.forEach(ele => {
          if (ele.data.code === 0) {
            successArr.push('成功')
          }
        })
        if (successArr.length === res.length) {
          this.$notify({
            title: '成功',
            message: '指令下发成功',
            type: 'success',
            duration: 5000
          })
        } else {
            this.$notify({
              title: '错误',
              message: '指令下发出错',
              type: 'error',
              duration: 5000
            })
          }
        this.queryInfo()
        this.lightForm = []
      })
      
    },
    async init() {
      let lightData = await getSdcTableBy({
        current: 1,
        size: 200,
        topTypeCode: "light",
      });

      this.lightInfo = lightData.data.data.records;
      this.queryInfo()
    },
    async changeAddress() {
      if (this.address.length !== 0) {
        this.parkDisabled = false;
        // let tableData = await getSdcParkingLotBySiteId(this.address[this.address.length - 1])
        // tableData.data.data.forEach((el) => {
        //   this.parkingMap.push({
        //     value: el.id,
        //     label: el.name,
        //   });
        // });
      } else {
        this.parkDisabled = true;
        this.parkingMap = [];
      }
    },
    setQueryCondition() {
      this.queryCondition = {
        current: this.page,
        size: this.size,
      };
      // this.parkingName ? this.queryCondition.parkId = this.parkingName : null
    },
    async queryInfo() {
      this.setQueryCondition();
      let tableData = await getSdcLightLampsTable(this.queryCondition);
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
        this.tableInfo  = await Promise.all(promise)
        console.log(this.tableInfo,'this.tableInfo');
      this.setpage(tableData.data.data);
    },
    clearCondition() {
      this.parkingName = null;
      this.address = [];
      this.changeAddress();
    },
    setpage(data) {
      this.page = data.current;
      this.size = data.size;
      this.total = data.total;
      this.pageKey = new Date().toString() + 1;
    },
    async queryByPage(data) {
      this.page = data.page;
      this.size = data.size;
      this.queryInfo();
    },
    setNetStatus(val) {
      let plateColorMap = this.$dictUtils.getDictList('light_net_status')
      let text
      for (let index = 0; index < plateColorMap.length; index++) {
        const el = plateColorMap[index];
        if (el.value === val.netStatus) {
          text = el.label
          break;
        }
      }
      return text
    },
    setDevStatus(val) {
      let plateColorMap = this.$dictUtils.getDictList('light_dev_status')
      let text
      for (let index = 0; index < plateColorMap.length; index++) {
        const el = plateColorMap[index];
        if (el.value === val.deviceStatus) {
          text = el.label
          break;
        }
      }
      return text
    },
  },
};
</script>

<style>
</style>
