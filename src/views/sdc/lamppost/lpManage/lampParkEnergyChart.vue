<template>
  <div>
    <div ref="areaEchart" id="areaEchart" ></div>  
  </div>
</template>

<script>

export default {
  props:['parkEnergyData'],
  data() {
    return {
    };
  },
  mounted() {
    this.areaChartInit()
  },
  methods: {
    areaChartInit() {
      console.log(this.parkEnergyData,'parkEnergyData');
      //注：需要挂载后，this.$refs.lineEchart才能获取
      let areaEchart = this.$echarts.init(this.$refs.areaEchart)
      areaEchart.setOption({
        title: {  //设置标题
          text: '园区总能耗',
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
          data: ['园区灯杆能耗'],
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
            data: this.parkEnergyData.dateList
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
            name: '园区灯杆能耗',
            type: 'bar',
            emphasis: {
                focus: 'series'
            },
            data: this.parkEnergyData.activePowerList
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