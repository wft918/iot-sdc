<template>
    <div style="width:100%;height:100%;display: flex;align-items: center;flex-direction: row;">
      <div style="width:50%;height:100%;display: flex;align-items: center;">
       
          <div ref="EnergyConsumePie" class="emgCountChart"></div>
        
      </div>
      <div style="width:50%;height:100%;display: flex;align-items: center;">
          <div ref="EnergyConsumeBar" class="emgCountChart"></div>
      </div>
    </div>
</template>

<script>

import { draw, transition } from "@/util/render3DCharts";
// import * as d3 from "d3";
import echarts from 'echarts/lib/echarts'

export default {
  data() {
    return {
      salesData: [
        { label: '动力', color: '#e42af8' },
        { label: '照明', color: '#8649f8' },
        { label: '安防', color: '#6bcce7' },
        { label: '空调', color: '#1739f7' },
        { label: '机柜', color: '#3366CC' },
        { label: '其他', color: '#990099' }
      ],
      data: [156, 96, 136, 68, 64, 98]
    };
  },
  mounted() {
    this.create3DPie(this.$refs.EnergyConsumePie,false)
    this.init();
  },
  methods: {
    create3DPie(id, ischange) {
      (() => {
        this.$d3.select(id)
          .selectAll('svg')
          .remove();
      })();

      const svg = this.$d3
        .select(id)
        .append('svg')
        .attr('width', 300)
        .attr('height', 300);

      // svg.append('g').attr('id', 'salesDonut');
      svg.append('g').attr('id', 'quotesDonut');
      if (ischange) {
        this.changeData();
      }
      // draw('salesDonut', this.randomData(), 150, 150, 130, 100, 30, 0.4);
      draw('quotesDonut', this.randomData(), 90, 75, 75, 60, 20, 0);
    },
    changeData() {
      transition('salesDonut', this.randomData(), 130, 100, 30, 0.4);
      transition('quotesDonut', this.randomData(), 130, 100, 30, 0);
    },
    randomData() {
      return this.salesData.map((d,index) => {
        return { label: d.label, value: this.data[index], color: d.color };
      });
    },

    init() {
        let that = this
        let option = {
            grid: {
                //left: '5%',
                right: '5%',
                bottom: '1%',
                top: '5%',
                containLabel: true
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'none'
                },
                formatter: function(params) {
                    return params[0].name + '<br/>' +
                        "<span style='display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:rgba(36,207,233,0.9)'></span>" +
                        params[0].seriesName + ' : ' + Number(params[0].value) + ' <br/>'
                }
            },
            backgroundColor: '',
            xAxis: {
                show: false,
                type: 'value'
            },
            yAxis: [{
                type: 'category',
                inverse: true,
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#fff',
                        fontSize: '14'
                    },
                },
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                data: ['其他', '动力', '照明', '冷源', '空调', '机柜']
            }, {
                type: 'category',
                inverse: true,
                axisTick: 'none',
                axisLine: 'none',
                show: true,
                axisLabel: {
                    textStyle: {
                        color: '#ffffff',
                        fontSize: '14'
                    },
                    formatter: function(value) {
                        if (value >= 10000) {
                            return (value / 10000).toLocaleString();
                        } else {
                            return value.toLocaleString();
                        }
                    },
                },
                data: [98, 64, 68, 136, 96, 156]
            }],
            series: [{
                    name: '个数',
                    type: 'bar',
                    zlevel: 1,
                    itemStyle: {
                        normal: {
                            barBorderRadius: 30,
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                offset: 0,
                                color: 'rgb(57,89,255,1)'
                            }, {
                                offset: 1,
                                color: 'rgb(46,200,207,1)'
                            }]),
                        },
                    },
                    barWidth: 10,
                    data: [98, 64, 68, 136, 96, 156]
                },
                {
                    name: '背景',
                    type: 'bar',
                    barWidth: 20,
                    barGap: '-100%',
                    data: [98, 64, 68, 136, 96, 156],
                    itemStyle: {
                        normal: {
                            color: 'rgba(24,31,68,1)',
                            barBorderRadius: 30,
                        }
                    },
                },
            ]
        };
       
      
      let EnergyConsumeBar = this.$echarts.init(this.$refs.EnergyConsumeBar);
      EnergyConsumeBar.setOption(option);
    }
  },
};
</script>

<style lang="scss" scoped>
.emgCountChart {
  width: 100%;
  height: 187px;
  //padding: 0 0 1rem 1rem;
  position: relative;
  //top: 20px;
  color: #ffffff;
}
</style>