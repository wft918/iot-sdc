<template>
  <div>
    <basic-container>
      <el-row :gutter="15">
        <el-col :span="8">
          <span>所属园区：</span>
          <el-cascader
            ref="areaMsg"
            :options="condition"
            style="width: 80%"
            v-model="address"
            :props="{ checkStrictly: true, value: 'id', label: 'name', children: 'children' }"
            clearable
            filterable
            @change="changeAddress"
          ></el-cascader>
        </el-col>
        <el-col :span="12">
          <span>灯杆：</span>
          <el-select v-model="parkingName" style="width: 25%" :disabled="lightDisabled">
            <el-option
              v-for="item in parkingMap"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <div class="query-btn-group">
            <el-button type="primary" @click="queryInfoClick">
              <i class="el-icon-search"></i> 查询
            </el-button>
            <el-button type="primary" @click="clearCondition">
              <i class="el-icon-delete"></i> 清空
            </el-button>
          </div>
        </el-col>
      </el-row>
      <el-table :data="deviceInfo" @row-click="showStateInfo" border >
        <!-- <el-table-column type="selection" width="55" /> -->
        <el-table-column
          type="index"
          label="序号"
          align="center"
          sortable
        ></el-table-column>
        <el-table-column
          prop="code"
          align="center"
          label="灯杆编号"
        ></el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="灯杆名称"
        ></el-table-column>
        <el-table-column
          prop="typeName"
          align="center"
          label="设备类型"
        ></el-table-column>
        <el-table-column
          prop="modelName"
          align="center"
          label="品牌型号"
        ></el-table-column>
        <el-table-column
          prop="siteName"
          align="center"
          label="所属园区"
        ></el-table-column>
        <el-table-column
          prop="lamp"
          align="center"
          label="照明设备"
          :formatter="setLamp"
        ></el-table-column>
        <el-table-column
          prop="led"
          align="center"
          label="LED设备"
          :formatter="setLED"
        ></el-table-column>
        <el-table-column
          prop="broadcast"
          align="center"
          label="视频设备"
          :formatter="setIpc"
        ></el-table-column>
        <el-table-column
          prop="expand.sensorIds"
          align="center"
          label="环监设备"
          :formatter="setSensor"
        ></el-table-column>
        <el-table-column
          prop="expand.broadcastIds"
          align="center"
          label="广播设备"
          :formatter="setBroadcast"
        ></el-table-column>
        <el-table-column
          prop="expand.intercomIds"
          align="center"
          label="对讲设备"
          :formatter="setIntercom"
        ></el-table-column>
        <el-table-column
          prop="expand.gatewayId"
          align="center"
          label="网关设备"
          :formatter="setGateWay"
        ></el-table-column>
      </el-table>
      <Pagination
        :page="page"
        :size="size"
        :total="total"
        :key="pageKey"
        @pagination="queryByPage"
      ></Pagination>
      <LpStateInfo :lightData="lightData" :key="lightKey" v-if="isShow" @closeLpInfo="closeLpInfo"></LpStateInfo>
      <!-- v-if="currentMarkInfo.setMarkerType === 'light'" -->
      <!-- :light-item-info="singleMarkInfo" -->
    </basic-container>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import LpStateInfo from "./LpStateInfo";
import { getSdcTableBy,getSdcGateInfo } from "@/api/sdc/deviceInfo";
import { getSdcLightGateWaysTable,getSdcLightLampsTable,getSdcLightBroadcastTable,getSdcLightLEDTable } from "@/api/sdc/lpmonitor";

export default {
  props:["siteinfo"],
  components: {
    Pagination,
    LpStateInfo,
  },
  data() {
    return {
      address: [],
      condition: [],
      parkingName: null,
      parkingMap: [],
      page: 1,
      size: 10,
      total: 0,
      pageKey: Math.random().toString(36).slice(-6),
      tableKey: Math.random().toString(36).slice(-6),
      isShow: false,
      deviceInfo: [],
      gateWaysInfo: [],
      lampsInfo: [],
      broadcastInfo: [],
      LEDInfo: [],
      lightData: null,
      lightKey: Math.random().toString(36).slice(-6),
      lightDisabled: true,
      queryCondition: {
        current: 1,
        size: 10,
        topTypeCode: "light"
      }
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      //获取初始区域查询条件数据
      this.condition = this.siteinfo

      this.getLight()
      this.getGateWays()
      this.getLightLamps()
      this.getLightBroadcast()
      this.getLightLED()
      this.queryInfo();
    },
    async getGateWays() {
      let gateWaysData = await getSdcLightGateWaysTable({
        current: 1,
        size: 200
      })
      this.gateWaysInfo = gateWaysData.data.data.records
    },
    async getLightLamps() {
      let lampsData = await getSdcLightLampsTable({
        current: 1,
        size: 200
      })
      this.lampsInfo = lampsData.data.data.records
    },
    async getLightBroadcast() {
      let broadcastData = await getSdcLightBroadcastTable({
        current: 1,
        size: 200
      })
      this.broadcastInfo = broadcastData.data.data.records
    },
    async getLightLED() {
      let LEDData = await getSdcLightLEDTable({
        current: 1,
        size: 200
      })
      this.LEDInfo = LEDData.data.data.records
    },
    async getLight() {
      this.parkingMap = []
      let siteid = this.address.length !== 0 ? this.address[this.address.length - 1] : null
      let tableData = await getSdcTableBy({
        current: 1,
        size: 200,
        topTypeCode: "light",
        siteId: siteid
      })
      for (let index = 0; index < tableData.data.data.records.length; index++) {
        const el = tableData.data.data.records[index];
        this.parkingMap.push({
          value: el.id,
          label: el.name
        })
      }
    },
    async changeAddress() {
      if(this.address.length !== 0) {
        this.lightDisabled = false
      } else {
        this.lightDisabled = true
        this.parkingName = null
      }
      this.getLight()
    },
    setQueryCondition() {
      this.queryCondition = {
        current: this.page,
        size: this.size,
        topTypeCode: "light",
      };
      this.address.length !== 0 ? this.queryCondition.siteId = this.address[this.address.length - 1] : null
      this.parkingName ? this.queryCondition.id = this.parkingName : null
    },
    queryInfoClick() {
      this.setQueryCondition();
      this.queryCondition.current = 1
      this.queryInfo()
    },
    async queryInfo() {
      let tableData
      if(this.queryCondition.id) {
        this.deviceInfo = []
        tableData = await getSdcGateInfo(this.queryCondition.id)
        this.deviceInfo.push(tableData.data.data) ;
        if (tableData.data.data) {
          this.page = 1
          this.total = 1
        }       
      } else {
        tableData = await getSdcTableBy(this.queryCondition);
        this.deviceInfo = tableData.data.data.records;
        this.setpage(tableData.data.data);
      }
      console.log(this.deviceInfo,'this.deviceInfo');
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
      this.queryCondition.current = this.page
      this.queryCondition.size = this.size    
      this.queryInfo();
    },
    showStateInfo(val) {
      console.log(val,'val');
      this.lightData = val.expand
      this.lightKey = new Date().toString()
      this.isShow = true;
    },
    closeLpInfo() {
      this.isShow = false;
    },
    setLamp(val) {
      let text = ''
      
      if(val.expand.lampIds.length !== 0) {
        for (let index = 0; index < this.lampsInfo.length; index++) {
          const el = this.lampsInfo[index];
          if(val.expand.lampIds[0] === el.id) {
            text = el.netStatus
            if(text === '0') {
              text = '开启'
            }else {
              text = '关闭'
            }
            break
          }
        }
      }
      return text
    },
    setIpc(val) {
      let text = ''
      if(val.expand.lampIds.length !== 0) {
        for (let index = 0; index < this.lampsInfo.length; index++) {
          const el = this.lampsInfo[index];
          if(val.expand.lampIds[0] === el.id) {
            text = el.netStatus
            if(text === '0') {
              text = '开启'
            }else {
              text = '关闭'
            }
            break
          }
        }
      }
      return text
    },
    setLED(val) {
      let text = ''
      if(val.expand.ledIds.length !== 0) {
        for (let index = 0; index < this.LEDInfo.length; index++) {
          const el = this.LEDInfo[index];
          if(val.expand.ledIds[0] === el.id) {
            text = el.netStatus
            if(text === '0') {
              text = '开启'
            }else {
              text = '关闭'
            }
            break
          }
        }
      }
      return text
    },
    setSensor(val) {
      let text = ''
      if(val.expand.sensorIds.length !== 0) {
        for (let index = 0; index < this.LEDInfo.length; index++) {
          const el = this.LEDInfo[index];
          if(val.expand.ledIds[0] === el.id) {
            text = el.netStatus
            if(text === '0') {
              text = '开启'
            }else {
              text = '关闭'
            }
            break
          }
        }
      }
      return text
    },
    setBroadcast(val) {
      let text = ''
      if(val.expand.broadcastIds.length !== 0) {
        for (let index = 0; index < this.broadcastInfo.length; index++) {
          const el = this.broadcastInfo[index];
          if(val.expand.broadcastIds[0] === el.id) {
            text = el.netStatus
            if(text === '0') {
              text = '开启'
            }else {
              text = '关闭'
            }
            break
          }
        }
      }
      return text
    },
    setIntercom(val) {
      let text = '在线'
      // if(val.expand.intercomIds.length !== 0) {
      //   for (let index = 0; index < this.LEDInfo.length; index++) {
      //     const el = this.LEDInfo[index];
      //     if(val.expand.ledIds[0] === el.id) {
      //       text = el.netStatus
      //       if(text === '0') {
      //         text = '开启'
      //       }else {
      //         text = '关闭'
      //       }
      //       break
      //     }
      //   }
      // }
      return text
    },
    setGateWay(val) {
      let text = '开启'
      if(val.expand.gatewayId !== null) {
        for (let index = 0; index < this.gateWaysInfo.length; index++) {
          const el = this.gateWaysInfo[index];
          if(val.expand.gatewayId === el.id) {
            text = el.netStatus
            if(text === '0') {
              text = '开启'
            }else {
              text = '关闭'
            }
            break
          }
        }
      }
      return text
    },
  },
};
</script>

<style>
</style>
