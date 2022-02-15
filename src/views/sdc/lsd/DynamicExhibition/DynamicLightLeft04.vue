<template>
  <div style="width:100%;height:100%;display: flex;align-items: center;">
    <div ref="dynamicLightLeft04" class="emgCountChart"></div>
  </div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
export default {
  name: "EmgCount",
  props:['stateInfo'],
  data() {
    return {
        stateChartData: []
    };
  },
  mounted() {
    this.setChartData()
  },
  methods: {
    setChartData() {
        this.stateChartData = []
        this.stateChartData.push(this.stateInfo.powerConsumMonth)
        this.stateChartData.push(this.stateInfo.powerConsumWeek)
        this.stateChartData.push(this.stateInfo.powerConsumDaily)
        this.$nextTick(() => {
          this.init();
      })
    },
    init() {
        let that = this
        let option = {
            backgroundColor: '',
            grid: {
                left: '5%',
                top: '18%',
                bottom: '12%',
                right: '5%'
            },
            xAxis: {
                data: [ '月耗电量', '周耗电量', '日耗电量' ],
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255, 129, 109,.1)',
                        width: 1 //这里是为了突出显示加上的
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#fff',
                        fontSize: 12
                    }
                }
            },
            yAxis: [{
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                         show:false,
                        lineStyle: {
                            color: 'rgba(255, 129, 109, 0.1)',
                            width: 1 //这里是为了突出显示加上的
                        }
                    },
                    axisLabel: {
                        show:false,
                        textStyle: {
                            color: '#999'
                        }
                    },
                    splitArea: {
                        areaStyle: {
                            color: 'rgba(255,255,255,.5)'
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: 'rgba(255, 129, 109, 0.1)',
                            width: 0.5,
                            type: 'dashed'
                        }
                    }
                }
            ],
            series: [{
                type: 'pictorialBar',
                barCategoryGap: '0%',
                symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
                label: {
                    show: true,
                    position: 'top',
                    distance: 15,
                    color: '#08DFFE',
                    fontWeight: 'bolder',
                    fontSize: 15,
                },
                itemStyle: {
                    normal: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                    offset: 0,
                                    color:'#9A11FF'
                                },
                                {
                                    offset: 1,
                                    color:'#08DFFE'
                                }
                            ],
                            global: false //  缺省为  false
                        }
                    },
                    emphasis: {
                        opacity: 1
                    }
                },
                data: this.stateChartData
            }]
        };
        let dynamicLightLeft04 = this.$echarts.init(this.$refs.dynamicLightLeft04);
        dynamicLightLeft04.setOption(option);
    }
  }
};
</script>

<style lang="scss" scoped>
.emgCountChart {
  width: 100%;
  height: 175px;
  //padding: 0 0 1rem 1rem;
  position: relative;
  //top: 20px;
  color: #ffffff;
}

</style>