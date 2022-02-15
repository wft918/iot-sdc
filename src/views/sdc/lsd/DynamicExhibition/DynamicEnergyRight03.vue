<template>
  <div style="width:100%;height:100%">
    <div ref="emgCountChart" class="emgCountChart"></div>
  </div>
</template>

<script>
import { getConsumeInMonth } from "@/api/sdc/lsd";
import eventBus from "@/util/eventBus";
export default {
  // props: ["planId"],
  data() {
    return {
     chartData: {},
     planId: ''
    };
  },
  watch: {
    planId(newVal,oldVal) {
      if (newVal) {
        this.queryPageData()
      }
    }
  },
  mounted() {
    eventBus.$on('lsdencplanChange',(res) => {
      this.planId = res
    })
    // this.queryPageData()
    // this.init()
  },
  methods: {
    async queryPageData() {
      getConsumeInMonth({ planId: this.planId }).then((res) => {
        if (res.data.code === 0) {
          this.chartData = res.data.data
          this.$nextTick(() => {
            this.init();
          });
        }
      });
    },
    init() {
      let color = ['#FC8F60','#0099FF']
      let emgCountChart = this.$echarts.init(this.$refs.emgCountChart);
      emgCountChart.setOption({
        color: ['#FC8F60','#0099FF'],
        legend: {
          icon: 'rect',
          top: 8,
          right: 10,
          itemGap: 5,
          itemWidth: 8,
          itemHeight: 8,
          itemGap: 20,
          textStyle: {
            fontSize: 14,
            color: '#DDD'
          }
        },
        tooltip: {
                trigger: "axis",
                formatter: function(params) {
                    let html = '';
                    params.forEach(v => {
                        // console.log(v)
                        html += `<div style="color: #666;font-size: 14px;line-height: 24px">
                        <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${color[v.componentIndex]};"></span>
                        ${v.seriesName}:
                        <span style="color:${color[v.componentIndex]};font-weight:700;font-size: 16px">${v.value} kWh</span>`;
                    })
                    return html
                },
                extraCssText: 'background: #fff; border-radius: 0;box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);color: #333;',
                axisPointer: {
                    type: 'shadow',
                    shadowStyle: {
                        color: 'rgba(225,225,225,0.3)',
                        shadowColor: 'rgba(225,225,225,0.3)',
                        shadowBlur: 5
                    }
                }
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
            axisLine: {
              lineStyle: {
                color: '#CCC'
              }
            },
            axisTick: {
              show: false
            },
            data: this.chartData.xaxis
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              show: false,
              lineStyle: {
                color: '#CCC'
              }
            },
            axisTick: {
              show: false
            },
            splitLine:{
              show: true,
              lineStyle: {
                type: 'dashed',
                color: '#666'
              }
            }
          }
        ],
        series: [
          {
            name: 'IT设备',       
            type: 'bar',  
            // barGap: '-100%',         // 左移100%，stack不再与上面两个在一列
            barWidth: 40,
            stack: 'energy',
            data: this.chartData.series[0].data
          },
          {
            name: '非IT设备',       
            type: 'bar',  
            // barGap: '-100%',         // 左移100%，stack不再与上面两个在一列
            barWidth: 40,
            stack: 'energy',
            data: this.chartData.series[1].data
          }
        ]
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.emgCountChart {
  width: 100%;
  height: 100%;
  // padding: 0 0 1rem 1rem;
  position: relative;
}
</style>
