<template>
  <div>
    <div ref="lampEchart" id="lampEchart"></div>
  </div>
</template>

<script>
import moment from "moment"; //导入文件
import { getSdcLightLampTotalLog,getSdcLightLampLog,getSdcLightLampOneLog } from "@/api/sdc/lpmanage";
import { sdcSiteAction } from "@/api/sdc/addressInfo";
import { modifyData } from "@/util/domainFilter";
import { getSdcTableBy } from "@/api/sdc/deviceInfo";

export default {
  props:['allLampEnergyData'],
  data() {
    return {
    };
  },
  mounted() {
    this.lampChartInit()
  },
  methods: {
    lampChartInit() {
      console.log(this.allLampEnergyData,'allLampEnergyData');
      
      //注：需要挂载后，this.$refs.lineEchart才能获取
      let lampEchart = this.$echarts.init(this.$refs.lampEchart)
      lampEchart.setOption({
        title: {  //设置标题
          text: '灯杆能耗排行',
          textStyle: {
            fontSize: 14,
            fontWeight: 400
          }
        },
        color: ['#3f8ef7'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['能耗'],
          icon: 'circle',
          left: '50%',
          itemGap: 5,
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.allLampEnergyData.deviceList
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine:{
                show:false
            }
          }
        ],
        series: [
          {
            name: '能耗',
            type: 'bar',
            barMaxWidth: 50,
            emphasis: {
                focus: 'series'
            },
            data: this.allLampEnergyData.activePowerList
          },
        ]
      })
    },
  }
}
</script>

<style lang="scss" scoped>
#areaEchart {
  width: 100%;
  height: 100%;
  min-height: 305px;
}
#lampEchart {
  width: 100%;
  height: 100%;
  min-height: 305px;
}
#oneLampChart {
  width: 100%;
  height: 100%;
  min-height: 305px;
}
.button-group {
  display: inline;
  position: absolute;
  margin-left: 20%;
  z-index: 1000;
}
</style>