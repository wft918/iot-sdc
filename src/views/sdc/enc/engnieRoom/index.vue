<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card>
          <span>所属位置：</span>
          <el-select v-model="siteId" placeholder="请选择" @change="changeSite">
            <el-option style="width:100%" 
              v-for="item in siteData"
              :key="item.code"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-card>  
      </el-col>
    </el-row>
    <el-row :gutter="15">
      <el-col :span="6">
        <el-card header="PUE值排行">
          <pue-rank :siteId="siteId"></pue-rank>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card header="PUE值对比">
          <pue-analysis-echarts :siteId="siteId"></pue-analysis-echarts>
        </el-card>
      </el-col>
    </el-row>
    <el-row class="room-pue">
      <el-col :span="24">
        <el-card>
          <span>方案：</span>
          <el-select v-model="planId" placeholder="请选择" @change="changePlan" :disabled="!planDisabled">
            <el-option style="width:100%" 
              v-for="item in planData"
              :key="item.id"
              :label="item.planName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="15">
      <el-col :span="5">
        <!-- 当前PUE -->
        <el-card header="当前PUE"> 
          <enc-gague-echarts :planId="planId" ref="encgagueRef"></enc-gague-echarts>
        </el-card>
      </el-col>
      <el-col :span="14">
        <!-- PUE曲线图 -->
        <el-card header="IT设备能耗曲线">
          <ItDeviceLineCharts :planId="planId"></ItDeviceLineCharts>
        </el-card>
      </el-col>
      <el-col :span="5">
        <!-- 方案当日能耗占比 -->
        <el-card header="当日能耗占比">
          <DayRatioPieCharts :planId="planId"></DayRatioPieCharts>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card header="IT设备能耗明细">
          <ItEncTable :planId="planId"></ItEncTable>
        </el-card>
      </el-col>
    </el-row>
    
  </div>
</template>

<script>
import PueAnalysisEcharts from "./pue/pueAnalysis";
import PueRank from './pue/pueRank';
import EncGagueEcharts from "../pueManager/encPUE/pueGagueEcharts";
import ItDeviceLineCharts from "@/views/sdc/enc/pueManager/encPower/ItDeviceLineCharts";
import DayRatioPieCharts from "@/views/sdc/enc/pueManager/encPower/DayRatioPieCharts";
import ItEncTable from "@/views/sdc/enc/pueManager/encPower/ItEncTable";

import { sdcSiteAction} from "@/api/sdc/addressInfo";
import { modifyData } from "@/util/domainFilter";
import { getFirstChild } from "@/util/getFirstChild";
import { getEnergyPlanList } from "@/api/sdc/energy"
export default {
  components: {
    PueAnalysisEcharts,
    PueRank,
    EncGagueEcharts,
    ItDeviceLineCharts,
    DayRatioPieCharts,
    ItEncTable
  },
  data() {
    return {
      siteId: '',
      parkConfigFlag: 0,
      roomConfigFlag: 0,
      site: '',
      siteData: [],
      firstChild: [],
      planData: [],
      planId: '',
      itemKey: Math.random().toString(36).slice(-6),
    }
  },
  computed: {
    planDisabled() {
      return this.planData.length > 0
    }
  },
  created() {
    // this.init()
    this.getSiteData()
  },
  methods: {
    changeItem(val) {
      this.itemKey = new Date().toString()
    },
    async getSiteData() {
      // 获取初始区域查询条件数据
      let data = await sdcSiteAction('','/tree','get')
      this.siteData = modifyData(data.data.data)
      getFirstChild(this.siteData, this.firstChild, 'P00')
      this.siteId = this.firstChild[0].id
      this._getEnergyPlanList(this.siteId)
    },
    // 获取方案列表
    _getEnergyPlanList(siteId) {
      getEnergyPlanList(siteId).then(res => {
        if (res.data.code === 0) {
          this.planData = res.data.data
          if (this.planData.length > 0) {
            this.planId = this.planData[0].id
          } else {
            this.planId = ''
          }
        } 
      })
    },
    changeSite(val) {
      // this.siteId = val[val.length - 1]
      this.siteId = val
      this._getEnergyPlanList(this.siteId)
    },
    changePlan(val) {
      this.planId = val
    }
  }
}
</script>
<style lang="scss" scoped>
.room-pue {
  margin-top: 20px;
}
</style>