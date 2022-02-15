<template>
  <div style="width:100%;height:100%;display: flex;align-items: flex-end;">
    <div ref="right05" class="emgCountChart"></div>
  </div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
import { getBeforeDate } from "@/util/getBeforeDate"
import { getPueTrend } from "@/api/sdc/lsd";

export default {
  name: "right05",
  props: ['planId'],
  data() {
    return {
      pueTrendData: {},
			startTime: '',
    };
  },
	watch: {
    planId(newValue, oldValue) {
      if(newValue) {
        this.queryPageData()
      }
    }
	},
  created() {
    this.startTime = getBeforeDate(7)
  },
  mounted() {
    // this.init();
    // this.queryPageData()
  },
  methods: {
    async queryPageData() {
      getPueTrend({planId: this.planId, startTime: this.startTime}).then((res) => {
        if (res.data.code === 0) {
          this.pueTrendData = res.data.data
          this.$nextTick(() => {
            this.init();
          });
        }
      });
    },
    init() {
        let that = this
        let color = [
            "#0099FF",
            "#FC8F60",
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
            //     right: 10,
            //     top: 20,
            //     textStyle: {
            //         color: '#fff'
            //     },
            //     selectedMode: 'single',
            //     formatter(name) {
            //       if (name === 'week') {
            //         return '近一周'
            //       }
            //       if (name === 'month') {
            //         return '近一月'
            //       }
            //     },
            // },
            tooltip: {
                trigger: "axis",
                // formatter: function(params) {
                //     let html = '';
                //     params.forEach(v => {
                //         // console.log(v)
                //         html += `<div style="color: #666;font-size: 14px;line-height: 24px">
                //         <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${color[v.componentIndex]};"></span>
                //         PUE:
                //         <span style="color:${color[v.componentIndex]};font-weight:700;font-size: 18px">${v.value}</span>`;
                //     })
                    
            

                //     return html
                // },
                extraCssText: 'background: #fff; border-radius: 0;box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);color: #333;',
                axisPointer: {
                    type: 'line'
                }
            },
            grid: {
                top: '25%',
                left: '15%',
                right: '10%',
                bottom: '8%',
                // containLabel: true
            },
            xAxis: [{
                type: "category",
                boundaryGap: false,
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        color: "#CCC"
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
                inverse: true,
                data: this.pueTrendData.date
            }],
            yAxis: [{
                type: "value",
                name: '',
                axisLabel: {
                    textStyle: {
                        color: "#CCC"
                    }
                },
                nameTextStyle: {
                    color: "#CCC",
                    fontSize: 12,
                    lineHeight: 40
                },
                splitLine: {
                    show:false,
                    lineStyle: {
                        type: "dashed",
                        color: "#CCC"
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
                name: "PUE",
                type: "line",
                smooth: true,
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
                data: this.pueTrendData.value
            }]
        };
        this.pueTrendData.date.length > 12 ? option.dataZoom = [{
              type: 'inside',
              xAxisIndex: [0],
              start: 0,
              end: 70
            }] : ''
        let right05 = this.$echarts.init(this.$refs.right05);
        right05.setOption(option);
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