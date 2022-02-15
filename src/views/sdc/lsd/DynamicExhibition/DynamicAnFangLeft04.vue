<template>
  <div style="width:100%;height:100%;display: flex;align-items: center;">
    <div ref="dynamicAnFangLeft04" class="emgCountChart"></div>
  </div>
</template>

<script>
import echarts from "echarts/lib/echarts"
import 'echarts-liquidfill'
import { getSecurityDeviceTypeStatistics } from "@/api/sdc/lsd";
export default {
  name: "EmgCount",
  data() {
    return {
        xData: [],
        line:[]
    };
  },
  mounted() {
    // this.address = this.siteId
    this.address = "cff1bf7b5dc745e2ac6f7e9afef531f7"
    console.log(this.address,'this.address');
    // this.init();
    this.queryPageData()
  },
  methods: {
    async queryPageData() {
      //获取初始区域查询条件数据
      getSecurityDeviceTypeStatistics({ siteId: this.address }).then((res) => {
        if (res.data.code === 0) {
          console.log(res);
          this.xData = []
          this.line = []
          for (let index = 0; index < res.data.data.paramname.length; index++) {
              const el = res.data.data.paramname[index];
              this.xData.push(el)
              this.line.push(res.data.data.value[index])
          }
          this.$nextTick(() => {
            this.init();
          });
        }
      });
    },
    init() {
        let that = this
        var option = {
            backgroundColor: '',
            grid: {
                top: '15%',
                left: '10%',
                right: '5%',
                bottom: '15%',
                // containLabel: true
            },
            xAxis: {
                data: this.xData,
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
                        color: '#e2e9ff',
                        fontSize: 12
                    }
                }
            },
            yAxis: [{
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(255, 129, 109, 0.1)',
                            width: 1 //这里是为了突出显示加上的
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#e2e9ff'
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
                data: this.line
            }]
        };
        let dynamicAnFangLeft04 = this.$echarts.init(this.$refs.dynamicAnFangLeft04);
        dynamicAnFangLeft04.setOption(option);
    }
  }
};
</script>

<style lang="scss" scoped>
.emgCountChart {
  width: 100%;
  height: 300px;
  //padding: 0 0 1rem 1rem;
  position: relative;
  //top: 20px;
  color: #ffffff;
}

</style>