<template>
  <div style="width:100%;height:100%;display: flex;align-items: flex-end;">
    <div ref="dynamicLightRight01" class="emgCountChart"></div>
  </div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
import { getLightingAlarmsProcessedNumber } from "@/api/sdc/lsd";
export default {
  name: "EmgCount",
  data() {
    return {
        address: null,
        nameList: [],
        chartList: []
    };
  },
  mounted() {
    // this.address = this.siteId
    this.address = "cff1bf7b5dc745e2ac6f7e9afef531f7"
    this.queryPageData()
  },
  methods: {
    async queryPageData() {
      //今日告警处理数
      getLightingAlarmsProcessedNumber({ siteId: this.address }).then((res) => {
        if (res.data.code === 0) {
          console.log(res);
          this.chartList = []
          this.chartList.push(res.data.data.abnormalEnergyConsum)
          this.chartList.push(res.data.data.intrusionPrevention)
          this.chartList.push(res.data.data.faultLightingComui)
          this.chartList.push(res.data.data.faultLightingControl)
          this.chartList.push(res.data.data.faultLightingPower)
          this.$nextTick(() => {
            this.init();
          });
        }
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
                        color: '#fff'
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
                data: ['能耗异常', '入侵防盗', '照明通信故障', '照明控制故障', '照明动力故障']
            }, {
                type: 'category',
                inverse: true,
                axisTick: 'none',
                axisLine: 'none',
                show: true,
                axisLabel: {
                    textStyle: {
                        color: '#ffffff',
                        fontSize: '12'
                    },
                    formatter: function(value) {
                        if (value >= 10000) {
                            return (value / 10000).toLocaleString();
                        } else {
                            return value.toLocaleString();
                        }
                    },
                },
                data: this.chartList
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
                    barWidth: 20,
                    data: this.chartList
                },
                {
                    name: '背景',
                    type: 'bar',
                    barWidth: 20,
                    barGap: '-100%',
                    data: this.chartList,
                    itemStyle: {
                        normal: {
                            color: 'rgba(24,31,68,1)',
                            barBorderRadius: 30,
                        }
                    },
                },
            ]
        };
       
      
      let dynamicLightRight01 = this.$echarts.init(this.$refs.dynamicLightRight01);
      dynamicLightRight01.setOption(option);
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