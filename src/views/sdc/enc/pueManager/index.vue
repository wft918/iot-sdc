<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card>
          <el-row>
            <el-col :span="5">
              <span>园区：</span>
              <el-select v-model="siteId" placeholder="请选择" @change="changeSite">
                <el-option style="width:100%"
                  v-for="item in siteData"
                  :key="item.code"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <span>方案：</span>
              <el-select v-model="planId" placeholder="请选择" @change="changePlan" :disabled="!planDisabled">
                <el-option style="width:100%"
                  v-for="item in planData"
                  :key="item.id"
                  :label="item.planName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <!-- <el-cascader
              ref="siteChoose"
              :options="siteData"
              style="width:60%"
              v-model="siteId"
              filterable
              @change="changeSite"
              :props="{checkStrictly: true ,value: 'id', label: 'name', children: 'children'}"
            >
            </el-cascader> -->
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="15">
      <!-- 当前PUE -->
      <el-col :span="4">
        <el-card header="当前PUE">
          <EncGagueEcharts :planId="planId"></EncGagueEcharts>
        </el-card>
      </el-col>
      <!-- PUE曲线图 -->
      <el-col :span="8">
        <el-card header="PUE曲线图">
          <EncLineEcharts :planId="planId"></EncLineEcharts>
        </el-card>
      </el-col>
      <!-- 能耗占比(7日) -->
      <el-col :span="6">
        <el-card header="能耗占比">
          <!-- <EncBarEcharts></EncBarEcharts> -->
          <WeekRatioBarCharts :planId="planId"></WeekRatioBarCharts>
        </el-card>
      </el-col>
      <!-- 能耗占比(当日) -->
      <el-col :span="6">
        <el-card header="当日能耗占比">
          <!-- <PowerEcharts></PowerEcharts> -->
          <DayRatioPieCharts :planId="planId"></DayRatioPieCharts>
        </el-card>
      </el-col>
      <!-- it设备24小时能耗曲线 -->
      <el-col :span="24">
        <el-card header="IT设备24小时能耗曲线">
          <!-- <EncColdSourceEcharts></EncColdSourceEcharts> -->
          <ItDeviceLineCharts :planId="planId"></ItDeviceLineCharts>
        </el-card>
      </el-col>
      <!-- 机房it能耗排行 -->
      <!-- <el-col :span="6">
        <el-card header="机房IT能耗排行">

          <ItEncRank :planId="planId"></ItEncRank>
        </el-card>
      </el-col> -->
      <!-- it设备能耗明细 -->
      <el-col :span="24">
        <el-card header="IT设备能耗明细">
          <!-- <ColdSourceTable></ColdSourceTable> -->
          <ItEncTable :planId="planId"></ItEncTable>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import EncGagueEcharts from "./encPUE/pueGagueEcharts";
import EncLineEcharts from "./encPUE/pueLineEcharts";
import ItDeviceLineCharts from "./encPower/ItDeviceLineCharts"
import WeekRatioBarCharts from "./encPower/WeekRatioBarCharts"
import DayRatioPieCharts from "./encPower/DayRatioPieCharts"
// import ItEncRank from "./encPower/ItEncRank"
import ItEncTable from "./encPower/ItEncTable"

import { sdcSiteAction} from "@/api/sdc/addressInfo";
import { modifyData } from "@/util/domainFilter";
import { getFirstChild } from "@/util/getFirstChild";

import { getEnergyPlanList } from "@/api/sdc/energy"

export default {
  components: {
    EncGagueEcharts,
    EncLineEcharts,
    ItDeviceLineCharts,
    WeekRatioBarCharts,
    DayRatioPieCharts,
    // ItEncRank,
    ItEncTable
  },
  data() {
    return {
      encGagueData: 0,
      address: null,
      siteId: '',
      planData: [],
      planId: '',
      configFlag: 0,
      siteData: [],
      firstChild: [],
    };
  },
  computed: {
    planDisabled() {
      return this.planData.length > 0
    }
  },
  created() {
    this.init()
  },
  mounted() {
  },
  methods: {
    async init() {
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
      this.siteId = val
      this._getEnergyPlanList(this.siteId)
    },
    changePlan(val) {
      this.planId = val
    }
  }
};
</script>
