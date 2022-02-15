<template>
  <div>
    <div ref="ItDeviceLineCharts" id="ItDeviceLineCharts"></div>
  </div>
</template>

<script>
import { getItDevEnergyConsum } from "@/api/sdc/energy";

export default {
  name: "ItDeviceLineCharts",
  props: ['planId'],
  data() {
    return {
      dateList: [],
      pueDataList: []
    };
  },
  created() {},
  mounted() {
    // this.init()
    // this.queryPageData()
  },
  watch: {
    planId(newValue,oldValue) {
      if (newValue) {
        this.queryPageData()
      }
    }
  },
  methods: {
    async queryPageData() {
      getItDevEnergyConsum(this.planId).then((res) => {
        if (res.data.code === 0) {
          if (res.data.data) {
            this.dateList = res.data.data.date
            this.pueDataList = res.data.data.value
          } else {
            this.dateList = []
            this.pueDataList = []
          }
          this.$nextTick(() => {
            this.init();
          });
        }
      });
    },
    init() {
      //注：需要挂载后，this.$refs.coldSourceEchart才能获取
      let coldSourceEcharts = this.$echarts.init(this.$refs.ItDeviceLineCharts)
      coldSourceEcharts.setOption({
        title: {  //设置标题
          text: '',
          textStyle: {
            fontSize: 14,
            fontWeight: 400
          }
        },
        legend: {  //设置图样
          data: ['PUE'],
          icon: 'circle',
          right: 30
        },
        tooltip: {
          trigger: "axis",
          formatter: function(params) {
            console.log(params);
                    let html = '';
                    params.forEach(v => {
                        // console.log(v)
                        html += `<div style="color: #666;font-size: 14px;line-height: 24px">
                        <span style="margin-left:10px">${v.axisValue}</span><br/>
                        <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#3FF2F7;"></span>
                        ${v.seriesName}:
                        <span style="color:#3FF2F7;font-weight:700;font-size: 16px">${v.value} kWh</span>`;
                    })
                    return html
                },
            extraCssText: 'background: #fff; border-radius: 0;box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);color: #333;',
        },
        grid: {
          top: '20%',
          left: '10%',
          bottom: '10%',
          right: '3%',
          containlabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisLabel: {  //设置X轴文字间隔
              interval: 1
          },
          data: this.dateList
        },
        yAxis: {
          type: "value",
            splitLine:{
                show:false
            }
        },
        series: [
          {
            name: "能耗",
            symbol: 'none', //去点
            smooth: true, //曲线平滑
            itemStyle: {
              normal: {
                areaStyle: { type: "default" },
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#3FF2F7" },
                  { offset: 1, color: "#ffffff" }
                ]),
                borderColor: "#71df6f", //拐点边框颜色
                borderWidth: 2 //拐点边框大小
              }
            },
            data: this.pueDataList,
            type: "line",
            areaStyle: {}
          }
        ]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#ItDeviceLineCharts {
  width: 100%;
  height: 100%;
  min-height: 205px;
}
</style>