<template>
  <div style="width:100%;height:100%;display: flex;align-items: center;">
    <div ref="dynamicAnFangLeft01" class="emgCountChart"></div>
  </div>
</template>

<script>
import echarts from "echarts/lib/echarts"
import 'echarts-liquidfill'

import { getMonthlyTrafficStatistics } from "@/api/sdc/lsd";

export default {
  name: "EmgCount",
  data() {
    return {
    };
  },
  mounted() {
    // this.address = this.siteId
    this.address = "cff1bf7b5dc745e2ac6f7e9afef531f7"
    console.log(this.address,'this.address');
    this.init();
    this.queryPageData()
  },
  methods: {
    async queryPageData() {
      //获取初始区域查询条件数据
      getMonthlyTrafficStatistics({ siteId: this.address }).then((res) => {
        if (res.data.code === 0) {
          console.log(res);
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
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                top: '15%',
                left: '10%',
                right: '5%',
                bottom: '15%',
                // containLabel: true
            },
            xAxis: [{
                type: 'category',
                data: ['1', '2', '3', '4', '5', '6','7', '8', '9', '10', '11', '12','13', '14', '15', '16', '17', '18','19', '20', '21', '22', '23', '24','25', '26', '27', '28', '29', '30'],
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,0.12)'
                    }
                },
                axisLabel: {
                    margin: 10,
                    color: '#e2e9ff',
                    textStyle: {
                        fontSize: 8
                    },
                },
            }],
            yAxis: [{
                name: '',
                axisLabel: {
                    formatter: '{value}',
                    color: '#e2e9ff',
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: 'rgba(255,255,255,1)'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,0.12)'
                    }
                }
            }],
            series: [{
                type: 'bar',
                data: [500, 260, 130, 130, 325, 150,500, 260, 130, 130, 125, 150,600, 200, 100, 130, 180, 150,500, 200, 360, 130, 420, 150,500, 200, 300, 130, 450, 100],
                barWidth: '3px',
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#F1C32A' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: '#9D4F06' // 100% 处的颜色
                        }], false),
                        barBorderRadius: [30, 30, 30, 30],
                        shadowColor: 'rgba(0,160,221,1)',
                        shadowBlur: 4,
                    }
                },
                label: {
                    normal: {
                        show: false,
                        lineHeight: 30,
                        width: 80,
                        height: 30,
                        backgroundColor: 'rgba(0,160,221,0.1)',
                        borderRadius: 200,
                        position: ['-8', '-60'],
                        distance: 1,
                        formatter: [
                            '    {d|●}',
                            ' {a|{c}}     \n',
                            '    {b|}'
                        ].join(','),
                        rich: {
                            d: {
                                color: '#F1C32A',
                            },
                            a: {
                                color: '#fff',
                                align: 'center',
                            },
                            b: {
                                width: 1,
                                height: 10,
                                borderWidth: 1,
                                borderColor: '#234e6c',
                                align: 'left'
                            },
                        }
                    }
                }
            }]
        };
        let dynamicAnFangLeft01 = this.$echarts.init(this.$refs.dynamicAnFangLeft01);
        dynamicAnFangLeft01.setOption(option);
    }
  }
};
</script>

<style lang="scss" scoped>
.emgCountChart {
  width: 100%;
  height: 180px;
  //padding: 0 0 1rem 1rem;
  position: relative;
  //top: 20px;
  color: #ffffff;
}

</style>