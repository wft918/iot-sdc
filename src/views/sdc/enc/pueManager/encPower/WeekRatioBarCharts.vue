<template>
  <div>
    <div ref="barEchart" id="barEchart"></div>
  </div>
</template>

<script>
import { getDeviceEnergyConsum } from "@/api/sdc/energy";
export default {
  name: "WeekRatioPieCharts",
  props: ['planId'],
  data() {
    return {
      // address: null,
      nameList: [],
      dateList: [],
      coldList: [],
      itList: [],
      lightList: [],
      itEnergyConsume: {},
      otherEnergyConsume: {}
    };
  },
  created() {},
  mounted() {
    // this.address = this.siteId
    // this.address = "cff1bf7b5dc745e2ac6f7e9afef531f7"
    // this.init();
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
      getDeviceEnergyConsum(this.planId).then((res) => {
        if (res.data.code === 0) {
          if (res.data.data) {
            this.itEnergyConsume = res.data.data.itEnergyConsume
            this.otherEnergyConsume = res.data.data.otherEnergyConsume
          } else {
            this.itEnergyConsume = {}
            this.otherEnergyConsume = {}
          }
          this.$nextTick(() => {
            this.init();
          });
        }
      });
    },
    init() {
      //注：需要挂载后，this.$refs.lineEchart才能获取
      let barEcharts = this.$echarts.init(this.$refs.barEchart)
      barEcharts.setOption({
        title: {  //设置标题
          text: '',
          textStyle: {
            fontSize: 14,
            fontWeight: 400
          }
        },
        color: ['#5470C6', '#91CC75'],
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
                    let html = `<span style="margin-left:10px">${params[0].axisValue}</span><br/>`;
                    params.forEach(v => {
                        // console.log(v)
                        html += `<div style="color: #666;font-size: 14px;line-height: 24px">
                        <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${v.color};"></span>
                        ${v.seriesName}:
                        <span style="color:${v.color};font-weight:700;font-size: 16px">${v.value} kWh</span>`;
                    })
                    return html
                },
            extraCssText: 'background: #fff; border-radius: 0;box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);color: #333;',
        },
        legend: {
          data: ['IT设备', '其他'],
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
        yAxis: [
          {
            type: 'category',
            data: this.itEnergyConsume.dateY
          }
        ],
        xAxis: [
          {
            type: 'value',
            splitLine:{
                show:false
            }
          }
        ],
        series: [
          // {
          //   name: '预警总数',
          //   type: 'bar',
          //   barGap: '-100%',         // 左移100%，stack不再与上面两个在一列
          //   barWidth: 15,
          //   itemStyle: {
          //       normal: {
          //           color: 'rgba(128, 128, 128, 0)'    // 仍为透明
          //       }
          //   },
          //   data: [22, 40, 72, 20, 20, 40, 10],
          // },
          // // {
          //   name: '制冷',
          //   type: 'bar',
          //   barWidth: 15,
          //   stack: '广告',
          //   emphasis: {
          //       focus: 'series'
          //   },
          //   data: [320, 332, 301, 334, 390, 330, 320]
          // },
          {
            name: 'IT设备',
            type: 'bar',
            stack: '广告',
            emphasis: {
                focus: 'series'
            },
            data: this.itEnergyConsume.valueX
          },
          // {
          //   name: '照明',
          //   type: 'bar',
          //   stack: '广告',
          //   emphasis: {
          //       focus: 'series'
          //   },
          //   data: [220, 182, 191, 234, 290, 330, 310]
          // },
          {
            name: '其他',
            type: 'bar',
            stack: '广告',
            emphasis: {
                focus: 'series'
            },
            data: this.otherEnergyConsume.valueX
          }
        ]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#barEchart {
  width: 100%;
  height: 100%;
  min-height: 205px;
}
</style>
