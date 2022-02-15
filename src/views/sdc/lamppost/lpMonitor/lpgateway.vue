<template>
  <div>
    <basic-container>
      <el-row :gutter="15">
        <el-col :span="7">
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
        <el-col :span="11">
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
            <el-button type="primary" @click="sendCMD(1)">
              开机
            </el-button>
            <el-button type="primary" @click="sendCMD(2)">
              关机
            </el-button>
            <el-button type="primary" @click="sendCMD(3)">
              重启
            </el-button>
          </div>
        </el-col>
      </el-row>
      <el-table :data="tableInfo">
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" align="center" sortable></el-table-column>
        <el-table-column prop="lightDev.name" align="center" label="设备名称"></el-table-column>
        <el-table-column prop="lightDev.typeName" align="center" label="设备类型"></el-table-column>
        <el-table-column prop="lightDev.siteName" align="center" label="所属园区"></el-table-column>
        <el-table-column prop="netStatus" align="center" label="在线状态" :formatter="setNetStatus"></el-table-column>
        <el-table-column prop="deviceStatus" align="center" label="设备状态" :formatter="setDevStatus"></el-table-column>
        <el-table-column prop="latestRunTime" align="center" label="运行时间"></el-table-column>
        <el-table-column prop="updateDate" align="center" label="更新时间"></el-table-column>
      </el-table>
      <Pagination :page="page" :size="size" :total="total" :key="pageKey" @pagination="queryByPage"></Pagination>

    </basic-container>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { getSdcLightGateWaysTable } from "@/api/sdc/lpmonitor";
import { getSdcGateInfo } from "@/api/sdc/deviceInfo";

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
      tableInfo:[]
   }
 },
 created() {
   this.init()
 },
 methods: {
   init() {
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
        size: this.size,
        topTypeCode: "light_gateway",
      }
      // this.parkingName ? this.queryCondition.parkId = this.parkingName : null
    },
    async queryInfo() {
      this.setQueryCondition()
      // let tableData = await getSdcLightGateWaysTable(this.queryCondition)
      let tableData = await getSdcLightGateWaysTable(this.queryCondition)
      console.log(tableData,'tableData');
      const promise = tableData.data.data.records.map( el => {
          return new Promise((resolve,reject) => {
            getSdcGateInfo(el.id).then( res => {
                  el.lightDev = res.data.data
                  resolve(el)
            })
            .catch(err=>reject(err))
          })
        })
      this.tableInfo  = await Promise.all(promise)
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
    sendCMD(type) {
      switch (type) {
        case 1:
          this.$notify({
            title: '成功',
            message: '开机成功',
            type: 'success',
            duration: 5000
          })
          break;
        case 2:
          this.$notify({
            title: '成功',
            message: '关机成功',
            type: 'success',
            duration: 5000
          })
          break;
        case 3:
          this.$notify({
            title: '成功',
            message: '重启成功',
            type: 'success',
            duration: 5000
          })
          break;
      }
    }
 }
}
</script>

<style>

</style>
