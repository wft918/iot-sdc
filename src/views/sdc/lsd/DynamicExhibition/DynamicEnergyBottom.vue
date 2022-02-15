<template>
  <div style="width: 100%; height: 100%">
    <div
      style="
        width: 100%;
        height: 40px;
        border-bottom: 1px solid #103665;
        border-top: 1px solid #103665;
        display: flex;
        align-items: center;
      "
    >
      <div class="titleStyle"></div>
      <div class="fontStyle">能耗趋势图</div>
      <div class="endStyle" style="margin-left: 84%"></div>
      <div class="endStyle" style="margin-left: 1%"></div>
    </div>
    <div style="width:100%;height:calc(100% - 40px);display: flex;flex-direction:column;justify-content:space-around;">
     
      <div style="width:100%;height:100%">
        <div style="width:100%;height:30px;display:flex;justify-content:flex-end;align-items:center">
          <el-button-group class="button-group">
            <el-button
              label="1"
              @click="changeTimeType('1')"
              size="mini"
              :class="timeBtn1"
            >
              今日
            </el-button>
            <el-button
              label="2"
              @click="changeTimeType('2')"
              size="mini"
              :class="timeBtn2"
            >
              近一周
            </el-button>
          </el-button-group>
        </div>
        <div style="width:100%;height:calc(100% - 40px);">
          <div ref="emgCountChart" class="emgCountChart"></div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
import { getBeforeDate } from "@/util/getBeforeDate"
import { getPowerTrend } from "@/api/sdc/lsd";
import eventBus from "@/util/eventBus";
export default {
  name: "EmgCount",
  // props: ['planId'],
  data() {
    return {
      startTime: '',
      chartData: {},
      xAxisData: [],
      yAxisData: [],
      itData: [],
      otherData: [],
      timeBtn1: "el-button-2",
      timeBtn2: "el-button-1",
      planId: ''
    };
  },
  watch: {
    planId(newVal, oldVal) {
      if (newVal) {
        this.queryPageData()
      }
    }
  },
  created() {
    this.startTime = getBeforeDate(0)
  },
  mounted() {
    eventBus.$on('lsdencplanChange',(res) => {
      this.planId = res
    })
    // this.init();
    // this.queryPageData()
  },
  methods: {
    async queryPageData() {
      getPowerTrend({ planId: this.planId, startTime: this.startTime }).then((res) => {
        if (res.data.code === 0) {
          this.chartData = res.data.data
          this.xAxisData = this.chartData.xaxis
          this.yAxisData = this.chartData.series
          this.yAxisData.forEach(item => {
            if (item.id === 0) {
              this.itData = item.data
            }
            if (item.id === 1) {
              this.otherData = item.data
            }
          })
          this.$nextTick(() => {
            this.init();
          });
        }
      });
    },
    init() {
        let that = this
        let color = [
            "#FF6A0A",
            "#32E5EB",
            "#FFC005",
            "#FF515A",
            "#8B5CFF",
            "#00CA69"
        ];
        const hexToRgba = (hex, opacity) => {
            let rgbaColor = "";
            let reg = /^#[\da-f]{6}$/i;
            if (reg.test(hex)) {
                rgbaColor = `rgba(${parseInt("0x" + hex.slice(1, 3))},${parseInt(
            "0x" + hex.slice(3, 5)
            )},${parseInt("0x" + hex.slice(5, 7))},${opacity})`;
            }
            return rgbaColor;
        }

        let option = {
            backgroundColor: '',
            color: color,
            legend: {
                left: '5%',
                top: 0,
                textStyle: {
                    color: '#fff'
                }
            },
            tooltip: {
                trigger: "axis",
                formatter: function(params) {
                    let html = `<span style="margin-left:10px;font-size:16px;">${params[0].axisValue}</span><br/>`;;
                    params.forEach(v => {
                        // console.log(v)
                        html += `<div style="color: #666;font-size: 14px;line-height: 24px">
                        <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${color[v.componentIndex]};"></span>
                        ${v.seriesName}:
                        <span style="color:${color[v.componentIndex]};font-weight:700;font-size: 18px">${v.value} kWh</span>`;
                    })
                    return html
                },
                extraCssText: 'background: #fff; border-radius: 0;box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);color: #333;',
                axisPointer: {
                    type: 'line'
                }
            },
            grid: {
                top: '20%',
                left: '5%',
                right: '5%',
                bottom: '10%',
                // containLabel: true
            },
            xAxis: [{
                type: "category",
                boundaryGap: false,
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        color: "#EEE"
                    }
                },
                axisTick: {
                  show: false
                },
                axisLine: {
                    lineStyle: {
                        color: "#CCC"
                    }
                },
                splitLine: {
                    show:true,
                    lineStyle: {
                        type: "solid",
                        color: "#666"
                    }
                },
                inverse: true,
                data: this.xAxisData
            }],
            yAxis: [{
                type: "value",
                name: '',
                axisLabel: {
                    textStyle: {
                        color: "#EEE"
                    }
                },
                nameTextStyle: {
                    color: "#EEE",
                    fontSize: 12,
                    lineHeight: 40
                },
                splitLine: {
                    show:true,
                    lineStyle: {
                        type: "solid",
                        color: "#666"
                    }
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                }
            }],
            series: [{
                name: "IT设备",
                type: "line",
                // smooth: true,
                showSymbol: false,
                symbolSize: 8,
                zlevel: 3,
                lineStyle: {
                    normal: {
                        color: color[0],
                        shadowBlur: 3,
                        shadowColor: hexToRgba(color[0], 0.5),
                        shadowOffsetY: 8
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0,
                            0,
                            0,
                            1,
                            [{
                                    offset: 0,
                                    color: hexToRgba(color[0], 0.3)
                                },
                                {
                                    offset: 1,
                                    color: hexToRgba(color[0], 0.1)
                                }
                            ],
                            false
                        ),
                        shadowColor: hexToRgba(color[0], 0.1),
                        shadowBlur: 10
                    }
                },
                data: this.itData
            }, {
                name: "非IT设备",
                type: "line",
                // smooth: true,
                showSymbol: false,
                symbolSize: 8,
                zlevel: 3,
                lineStyle: {
                    normal: {
                        color: color[1],
                        shadowBlur: 3,
                        shadowColor: hexToRgba(color[1], 0.5),
                        shadowOffsetY: 8
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0,
                            0,
                            0,
                            1,
                            [{
                                    offset: 0,
                                    color: hexToRgba(color[1], 0.3)
                                },
                                {
                                    offset: 1,
                                    color: hexToRgba(color[1], 0.1)
                                }
                            ],
                            false
                        ),
                        shadowColor: hexToRgba(color[1], 0.1),
                        shadowBlur: 10
                    }
                },
                data: this.otherData
            }]
        };
        this.xAxisData.length > 24 ? option.dataZoom = [{
              type: 'inside',
              xAxisIndex: [0],
              start: 0,
              end: 70
            }] : ''
        let emgCountChart = this.$echarts.init(this.$refs.emgCountChart);
        emgCountChart.setOption(option);
    },
    changeTimeType(val) {
      if (val === '1') {
        this.startTime = getBeforeDate(0)
        this.timeBtn1 = "el-button-2";
        this.timeBtn2 = "el-button-1";
        this.queryPageData()
      }
      if (val === '2') {
        this.startTime = getBeforeDate(7)
        this.timeBtn1 = "el-button-1";
        this.timeBtn2 = "el-button-2";
        this.queryPageData()
      }
    },
  },
 
};
</script>

<style lang="scss" scoped>
.emgCountChart {
  width: 100%;
  height: 100%;
  //padding: 0 0 1rem 1rem;
  position: relative;
  //top: 20px;
  color: #ffffff;
}
.button-group {
  display: inline;
  position: absolute;
  margin-right: 5%;
  margin-top: 20px;
}

.el-button-1{
  background: rgba(0,0,0,0.4);
  color: white;
  opacity: 1;
}
.el-button-2{
  background: #2B9FFF;
  color: white;
  opacity: 1;
}
.el-button:focus, .el-button:hover{
    background: #2B9FFF;
    color: #ffffff;
    opacity: 1;
}
</style>