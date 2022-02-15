<template>
  <div  style="width: 100%;height: 100%;">
    <div style="width:100%;height:40px;border-bottom: 1px solid #103665;border-top: 1px solid #103665;display: flex;align-items: center;">
      <div class="titleStyle"></div>
      <div class="fontStyle">能耗概况</div>
      <div class="endStyle" style="margin-left: 62%;"></div>
      <div class="endStyle" style="margin-left: 3%;"></div>
    </div>
    <div style="width:100%;height:25%;display:flex;align-items:center;">
      
      <div style="width:50%;height:100%;display:flex;flex-direction:column;justify-content:space-between;align-items:center;">
        <div style="width:100%;height:20%;margin:15px 0 0 30px;" class="encplan-select">
          <el-select v-model="planId" placeholder="" @change="changePlan" style="width:80%" >
            <el-option 
              v-for="item in planOption"
              :key="item.id"
              :label="item.planName"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div style="width:100%;height:80%;">
          <gauge ref="gauge" :planId="planId" :center="['48%', '55%']" :gaugeData="gaugeData"></gauge>
        </div>
        
      </div>
      <div style="width:50%;height:100%;font-size:16px;display:flex;flex-direction:column;justify-content:center;align-items:center;color:#CADDF7;">
        <div>总电度：{{totalPower}}kWh</div>
        <div style="margin-top: 10px;">IT设备总电度：{{itPower}}kWh</div>
        <div></div>
      </div>
    </div>
    <div style="width:100%;height:40px;border-bottom: 1px solid #103665;border-top: 1px solid #103665;display: flex;align-items: center;">
      <div class="titleStyle"></div>
      <div class="fontStyle">PUE趋势图</div>
      <div class="endStyle" style="margin-left: 58%;"></div>
      <div class="endStyle" style="margin-left: 3%;"></div>
    </div>
    <div style="width:100%;height:33%;display:flex;justify-content:center;align-items:center;">
      <DynamicEnergyLeft03 :planId="planId"></DynamicEnergyLeft03>
    </div>
    <div style="width:100%;height:40px;border-bottom: 1px solid #103665;border-top: 1px solid #103665;display: flex;align-items: center;">
      <div class="titleStyle"></div>
      <div class="fontStyle">当日设备能耗占比</div>
      <div class="endStyle" style="margin-left: 45%;"></div>
      <div class="endStyle" style="margin-left: 3%;"></div>
    </div>
    <div style="width:100%;height:32%;">
      <DynamicEnergyLeft04 :planId="planId"></DynamicEnergyLeft04>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
import DynamicEnergyLeft01 from "./DynamicEnergyLeft01";
import DynamicEnergyLeft04 from "./DynamicEnergyLeft04";
import DynamicEnergyLeft02 from "./DynamicEnergyLeft02";
import DynamicEnergyLeft03 from "./DynamicEnergyLeft03";
import gauge from './gauge.vue'
import eventBus from "@/util/eventBus";
import { getPueAndConsume, getEnergyPlanList } from "@/api/sdc/lsd"
export default {
  name: "DynamicExhibition",
  props: ['siteId'],
  components: {
    DynamicEnergyLeft01,DynamicEnergyLeft04,DynamicEnergyLeft02,DynamicEnergyLeft03,gauge
  },
  data() {
    return {
      pacData: {},
      gaugeData: 0,
      totalPower: null,
      itPower: null,
      otherPower: null,
      planOption: [],
      planId: ''
    }
  },
  watch: {
    siteId(newValue, oldValue) {
      if(newValue) {
        this.getEnergyPlanList()
        // this.queryPageData()
      }
    },
    planId(newVal,oldVal) {
      if (newVal) {
        this.queryPageData()
      }
    }
  },
  mounted(){
    this.getEnergyPlanList()
  },
  methods:{
    async queryPageData() {
      getPueAndConsume(this.planId).then(res => {
        if (res.data.code === 0) {
          this.pacData = res.data.data
          this.gaugeData = this.pacData.pue
          this.totalPower = this.pacData.total
          this.itPower = this.pacData.it
          this.otherPower = this.pacData.other
        }
      })
    },
    getEnergyPlanList() {
      getEnergyPlanList(this.siteId).then(res => {
        if (res.data.code === 0) {
          this.planOption = res.data.data
          if (this.planOption.length > 0) {
            this.planId = this.planOption[0].id
            eventBus.$emit('lsdencplanChange', this.planId)
          } else {
            this.planId = ''
            eventBus.$emit('lsdencplanChange', this.planId)
          }
        }
      })
    },
    changePlan(val) {
      if (val) {
        eventBus.$emit('lsdencplanChange', this.planId)
      }
    },
  }
}
</script>

<style lang="scss" scoped>
 /deep/.encplan-select .el-input__inner{
  background-color: transparent;
  border: 1px solid #409EFF;
  color:white;
  text-align: center;
}
</style>