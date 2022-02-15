<template>
  <div style="width:100%;height:100%;display: flex;align-items: center;">
    <div ref="dynamicCarRight01" class="emgCountChart"></div>
  </div>
</template>

<script>
import echarts from "echarts/lib/echarts"
import 'echarts-liquidfill'
import { getAverageVehicleDwellTime } from "@/api/sdc/lsd";
export default {
  name: "EmgCount",
  data() {
    return {
        address: null,
        dateList: [],
        dataList: []
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
      //车辆平均停留时长
      getAverageVehicleDwellTime({ siteId: this.address }).then((res) => {
        if (res.data.code === 0) {
          console.log(res);
          this.dateList = res.data.data.date
          this.dataList = res.data.data.value
          this.$nextTick(() => {
            this.init();
          });
        }
      });
    },
    init() {
        let that = this
        let option = {
            backgroundColor: '',
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0,
                                color: 'rgba(0, 255, 233,0)'
                            }, {
                                offset: 0.5,
                                color: 'rgba(255, 255, 255,1)',
                            }, {
                                offset: 1,
                                color: 'rgba(0, 255, 233,0)'
                            }],
                            global: false
                        }
                    },
                },
            },
            grid: {
                top: '15%',
                left: '5%',
                right: '5%',
                bottom: '15%',
                // containLabel: true
            },
            xAxis: [{
                type: 'category',
                axisLine: {
                    show: true
                },
                splitArea: {
                    // show: true,
                    color: '#f00',
                    lineStyle: {
                        color: '#f00'
                    },
                },
                axisLabel: {
                    color: '#fff'
                },
                splitLine: {
                    show: false
                },
                boundaryGap: false,
                data: this.dateList,

            }],

            yAxis: [{
                type: 'value',
                min: 0,
                // max: 140,
                splitNumber: 4,
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(255,255,255,0.1)'
                    }
                },
                axisLine: {
                    show: false,
                },
                axisLabel: {
                    show: false,
                    margin: 20,
                    textStyle: {
                        color: '#d1e6eb',

                    },
                },
                axisTick: {
                    show: false,
                },
            }],
            series: [{
                    name: '注册总量',
                    type: 'line',
                    smooth: true, //是否平滑
                    showAllSymbol: true,
                    // symbol: 'image://./static/images/guang-circle.png',
                    symbol: 'circle',
                    symbolSize: 15,
                    lineStyle: {
                        normal: {
                            color: "#00b3f4",
                            shadowColor: 'rgba(0, 0, 0, .3)',
                            shadowBlur: 0,
                            shadowOffsetY: 5,
                            shadowOffsetX: 5,
                        },
                    },
                    label: {
                        show: true,
                        position: 'top',
                        "formatter": "{c}min",
                        textStyle: {
                            color: '#00b3f4',
                        }
                    },
                    itemStyle: {
                        color: "#00b3f4",
                        borderColor: "#fff",
                        borderWidth: 3,
                        shadowColor: 'rgba(0, 0, 0, .3)',
                        shadowBlur: 0,
                        shadowOffsetY: 2,
                        shadowOffsetX: 2,
                    },
                    tooltip: {
                        show: false
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgba(0,179,244,0.3)'
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(0,179,244,0)'
                                }
                            ], false),
                            shadowColor: 'rgba(0,179,244, 0.9)',
                            shadowBlur: 20
                        }
                    },
                    data: this.dataList
                }
            ]
        };
        let dynamicCarRight01 = this.$echarts.init(this.$refs.dynamicCarRight01);
        dynamicCarRight01.setOption(option);
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