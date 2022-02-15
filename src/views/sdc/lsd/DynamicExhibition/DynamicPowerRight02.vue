<template>
  <div style="width:100%;height:100%;display: flex;align-items: flex-end;">
    <div ref="dynamicPowerRight02" class="emgCountChart"></div>
  </div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
import { getBeforeDate } from "@/util/getBeforeDate"
import { getRoomAlarmNumTrend } from "@/api/sdc/lsd";

export default {
  name: "EmgCount",
	props: ['roomCountTrend', 'siteId', 'siteIdOne', 'siteIdTwo', 'siteNameOne', 'siteNameTwo'],
  data() {
    return {
			startTime: '',
			trendData1: [],
			trendData2: [],
            xAxisData: [],
            yAxisData: [],
            yAxisData1: [],
            yAxisData2: []
    };
  },
	watch: {
		roomCountTrend(newValue, oldValue) {
			if (newValue === '1') {
				this.startTime = getBeforeDate(7)
				this.queryPageData()
			} 
			if (newValue === '2') {
				this.startTime = getBeforeDate(30)
				this.queryPageData()
			}
		},
    siteId(newVal, oldVal) {
      if (newVal) {
        this.queryPageData()
      }
    },
    siteIdOne(newVal) {
      if (newVal) {
        this.changeData()
      }
    }
	},
	created() {
		this.startTime = getBeforeDate(7)
	},
  mounted() {
    this.queryPageData()
  },
  methods: {
    async queryPageData() {
      //获取初始区域查询条件数据
      getRoomAlarmNumTrend({ siteId: this.siteId, startTime: this.startTime }).then((res) => {
        if (res.data.code === 0) {
          this.trendData = res.data.data
          if (this.trendData) {
            this.xAxisData = this.trendData.xDate
            this.yAxisData = this.trendData.series
            this.changeData()
          } else {
            this.xAxisData = []
            this.yAxisData1 = []
            this.yAxisData2 = []
            this.$nextTick(() => {
              this.init();
            });
          }
          console.log(this.trendData, 'this.trendData====+++++');
          
        }
      })
    },
    changeData() {
      let ydata1 = this.yAxisData.filter(item => item.label === this.siteIdOne)
      ydata1.length > 0 ? this.yAxisData1 = ydata1[0].value : this.yAxisData1 = []
      if (ydata1.length === 0) {
        this.xAxisData = []
      } else {
        this.xAxisData = this.trendData.xDate
      }
      // this.yAxisData1 = ydata1[0].value
      // this.yAxisData2 = ydata2[0].value
      // console.log(this.yAxisData1, 'yAxisData11111111111111');
      this.$nextTick(() => {
        this.init();
      })
    },
    init() {
        let that = this
        let color = [
            "#0090FF",
            "#36CE9E",
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
            // legend: {
            //     left: 10,
            //     top: 0,
            //     textStyle: {
            //         color: '#fff'
            //     }
            // },
            tooltip: {
                trigger: "axis",
                formatter: function(params) {
                    let html = '';
                    params.forEach(v => {
                        console.log(v)
                        html += `<div style="color: #666;font-size: 14px;line-height: 24px">
                        <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${color[v.componentIndex]};"></span>
                        ${v.seriesName}<br/>${v.name}：
                        <span style="color:${color[v.componentIndex]};font-weight:700;font-size: 18px">${v.value}</span>`;
                    })
                    return html
                },
                extraCssText: 'background: #fff; border-radius: 0;box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);color: #333;',
                axisPointer: {
                    type: 'line'
                }
            },
            grid: {
                top: '15%',
                left: '15%',
                right: '10%',
                bottom: '15%',
                // containLabel: true
            },
            xAxis: [{
                type: "category",
                boundaryGap: false,
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        color: "#fff"
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: "#fff"
                    }
                },
                data: this.xAxisData
            }],
            yAxis: [{
                type: "value",
                name: '',
                axisLabel: {
                    textStyle: {
                        color: "#fff"
                    }
                },
                nameTextStyle: {
                    color: "#fff",
                    fontSize: 12,
                    lineHeight: 40
                },
                splitLine: {
                    show:false,
                    lineStyle: {
                        type: "dashed",
                        color: "#fff"
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
                name: this.siteNameOne,
                type: "line",
                smooth: true,
                // showSymbol: false,/
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
                data: this.yAxisData1
            }
          ]
        };
        this.xAxisData.length > 10 ? option.dataZoom = [{
              type: 'inside',
              xAxisIndex: [0],
              start: 0,
              end: 70
            }] : ''
        let dynamicPowerRight02 = this.$echarts.init(this.$refs.dynamicPowerRight02);
        dynamicPowerRight02.setOption(option);
    }
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

</style>