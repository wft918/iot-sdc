<template>
  <div>
    <basic-container>
      <el-table :data="tableInfo">
        <!-- <el-table-column type="selection" width="55" /> -->
        <el-table-column type="index" label="序号" align="center" sortable></el-table-column>
        <el-table-column prop="expand.deviceName" align="center" label="传感器名称"></el-table-column>
        <el-table-column prop="expand.typeName" align="center" label="设备类型"></el-table-column>
        <el-table-column prop="expand.siteName" align="center" label="所属园区"></el-table-column>
        <el-table-column prop="light.name" align="center" label="所属灯杆"></el-table-column>
        <el-table-column prop="netStatus" align="center" label="在线状态" :formatter="setNetStatus"></el-table-column>
        <el-table-column prop="deviceStatus" align="center" label="设备状态" :formatter="setDevStatus"></el-table-column>
        <el-table-column prop="humidity" align="center" label="湿度"></el-table-column>
        <!-- <el-table-column prop="netStatus" align="center" label="降雨量"></el-table-column> -->
        <el-table-column prop="pressure" align="center" label="气压"></el-table-column>
        <el-table-column prop="temperature" align="center" label="温度"></el-table-column>
        <el-table-column prop="windSpeed" align="center" label="风速"></el-table-column>
        <el-table-column prop="windDirection" align="center" label="风向"></el-table-column>
        <el-table-column prop="noise" align="center" label="噪声"></el-table-column>
        <el-table-column prop="pm25" align="center" label="PM2.5"></el-table-column>
        <el-table-column prop="pm10" align="center" label="PM10"></el-table-column>
        <el-table-column prop="rayRadiation" align="center" label="光辐射强度"></el-table-column>
        <el-table-column prop="uvi" align="center" label="紫外线强度"></el-table-column>
        <el-table-column prop="latestRunTime" align="center" label="运行时间"></el-table-column>
        <el-table-column prop="updateDate" align="center" label="更新时间"></el-table-column>
      </el-table>
      <Pagination :page="page" :size="size" :total="total" :key="pageKey" @pagination="queryByPage"></Pagination>

    </basic-container>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { getSdcTableBy,getSdcGateInfo } from "@/api/sdc/deviceInfo";
import { getSdcLightSensorTable } from "@/api/sdc/lpmonitor";


export default {
  components: {
    Pagination
  },
 data() {
   return {
     address: null,
    condition: [],
    parkingName: '',
    parkingMap: [],
    page:1,
      size: 10,
      total: 0,
      pageKey: Math.random().toString(36).slice(-6),
    lightInfo: [],
    tableInfo: [],
   }
 },
 created() {
    this.init()
  },
 methods: {
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
      if(this.address.length !== 0) {
        this.parkDisabled = false
        // let tableData = await getSdcParkingLotBySiteId(this.address[this.address.length - 1])
        // tableData.data.data.forEach((el) => {
        //   this.parkingMap.push({
        //     value: el.id,
        //     label: el.name,
        //   });
        // });
      }else {
        this.parkDisabled = true
        this.parkingMap = []
      }
      
    },
    setQueryCondition() {
      this.queryCondition = {
        current:this.page,
        size: this.size
      }
      // this.parkingName ? this.queryCondition.parkId = this.parkingName : null
    },
    async queryInfo() {
      this.setQueryCondition()
      let tableData = await getSdcLightSensorTable(this.queryCondition)
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
      this.tableInfo = await Promise.all(promise)
      console.log(this.tableInfo,'this.tableInfo');
      this.setpage(tableData.data.data);
    },
    clearCondition() {
      this.parkingName = null
      this.address = []
      this.changeAddress()
    },
    setpage(data) {
      this.page = data.current;
      this.size = data.size;
      this.total = data.total;
      this.pageKey = (new Date()).toString() + 1
    },
    async queryByPage(data) {
      this.page = data.page
      this.size = data.size
      this.queryInfo()
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
 }
}
</script>

<style>

</style>
