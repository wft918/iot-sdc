<template>
  <div>
    <div ref="oneLampChart" id="oneLampChart" ></div>
  </div>
</template>

<script>
import moment from "moment"; //导入文件
import { getSdcLightLampTotalLog,getSdcLightLampLog,getSdcLightLampOneLog } from "@/api/sdc/lpmanage";
import { sdcSiteAction } from "@/api/sdc/addressInfo";
import { modifyData } from "@/util/domainFilter";
import { getSdcTableBy } from "@/api/sdc/deviceInfo";

export default {
  props:['oneLampEnergyData'],
  data() {
    return {
    };
  },
  mounted() {
    this.oneLampChartInit()
  },
  methods: {
    oneLampChartInit() {
      console.log(this.oneLampEnergyData,'oneLampEnergyData');

      let oneLampChart = this.$echarts.init(this.$refs.oneLampChart);
      oneLampChart.setOption({
        title: {  //设置标题
          text: '灯杆能耗',
          textStyle: {
            fontSize: 14,
            fontWeight: 400
          }
        },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          splitLine:{show: false},//去除网格线
          type: 'category',
          data: this.oneLampEnergyData.dateList
        },
        yAxis: {
          splitLine:{show: false},//去除网格线
          type: 'value'
        },
        series: [{
          data: this.oneLampEnergyData.activePowerList,
          type: 'line',
          smooth: true
        }]
      });
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