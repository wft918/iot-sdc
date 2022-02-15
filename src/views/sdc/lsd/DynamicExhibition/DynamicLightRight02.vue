<template>
  <div style="width:100%;height:100%;display: flex;align-items: flex-end;">
    <div ref="dynamicLightRight02" class="emgCountChart"></div>
  </div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
import { getLightingDeviceAlarmStatus } from "@/api/sdc/lsd";
export default {
  name: "EmgCount",
  data() {
    return {
        address: null,
        completedList: [],
        pendingList: [],
        processingList: [],
    };
  },
  mounted() {
    // this.address = this.siteId
    this.address = "cff1bf7b5dc745e2ac6f7e9afef531f7"
    this.queryPageData()
  },
  methods: {
    async queryPageData() {
      //照明设备告警状态统计
      getLightingDeviceAlarmStatus({ siteId: this.address }).then((res) => {
        if (res.data.code === 0) {
            for (let index = 0; index < res.data.data.length; index++) {
                const el = res.data.data[index];
                for (let j = 0; j < el.paramname.length; j++) {
                    const elem = el.paramname[j];
                    if(elem === '已完成') {
                        this.completedList.push(el.value[j])
                    }
                    if(elem === '待处理') {
                        this.pendingList.push(el.value[j])
                    }
                    if(elem === '处理中') {
                        this.processingList.push(el.value[j])
                    }
                }
            }
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
                        color: 'rgba(0, 255, 233,0)',
                    },
                },
            },
            color: ['#22c6fc', '#fdc81e', '#27e6ab'],
            legend: {
                top: '18%',
                data: ['已完成', '待处理', '处理中'],
                textStyle: {
                        color: '#ffffff',
                        fontSize: '12'
                    }
            },
            grid: {
                left: '3%',
                right: '5%',
                bottom: '10%',
                top: '35%',
                containLabel: true
            },
            xAxis: {
                show: false,
                type: 'value',
                axisTick: {
                    show: false,
                },
                axisLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'category',
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                data: ["紧急", "一般"],
                axisLabel: {
                    textStyle: {
                        color: '#ffffff',
                        fontSize: '12'
                    }
                }
            },
            series: [{
                    name: '已完成',
                    type: 'bar',
                    stack: 'Tik Tok',
                    barWidth: 20,
                    itemStyle: {
                        shadowColor: 'rgba(0, 0, 0, .3)',
                        shadowBlur: 1,
                        shadowOffsetY: 1,
                        shadowOffsetX: 0,
                        emphasis: {
                            borderWidth:'10',
                            borderColor:'#de0b1a',
                            color:'#de0b1a',
                            opacity:1,
                            shadowColor: '#de0b1a',
                            shadowBlur: 0,
                            shadowOffsetY: 0,
                            shadowOffsetX: 0,
                        },
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'inside',
                            formatter: '{c}%',
                            textStyle: {
                                align: 'center',
                                baseline: 'middle',
                                fontSize: 14,
                                fontWeight: '400',
                            }
                        },
                    },
                    data: this.completedList
                },
                {
                    name: '待处理',
                    type: 'bar',
                    stack: 'Tik Tok',
                    barWidth: 25,
                    itemStyle: {
                        shadowColor: 'rgba(0, 0, 0, .3)',
                        shadowBlur: 1,
                        shadowOffsetY: 1,
                        shadowOffsetX: 0,
                        emphasis: {
                            borderWidth:'10',
                            borderColor:'#d6d6d6',
                            color:'#d6d6d6',
                            opacity:1,
                            shadowColor: '#d6d6d6',
                            shadowBlur: 0,
                            shadowOffsetY: 0,
                            shadowOffsetX: 0,
                        },
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'inside',
                            formatter: '{c}%',
                            textStyle: {
                                align: 'center',
                                baseline: 'middle',
                                fontSize: 14,
                                fontWeight: '400',
                                color:'#7c7c7c'
                            }
                        },
                    },
                    data: this.pendingList
                },
                {
                    name: '处理中',
                    type: 'bar',
                    stack: 'Tik Tok',
                    barWidth: 25,
                    itemStyle: {
                        shadowColor: 'rgba(0, 0, 0, .3)',
                        shadowBlur: 1,
                        shadowOffsetY: 1,
                        shadowOffsetX: 0,
                        emphasis: {
                            borderWidth:'10',
                            borderColor:'#00c1c1',
                            color:'#00c1c1',
                            opacity:1,
                            shadowColor: '#00c1c1',
                            shadowBlur: 0,
                            shadowOffsetY: 0,
                            shadowOffsetX: 0,
                        },
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'inside',
                            formatter: '{c}%',
                            textStyle: {
                                align: 'center',
                                baseline: 'middle',
                                fontSize: 14,
                                fontWeight: '400',
                            }
                        },
                    },
                    data: this.processingList
                },
            ]
        };
        let dynamicLightRight02 = this.$echarts.init(this.$refs.dynamicLightRight02);
        dynamicLightRight02.setOption(option);
    }
  },
 
};
</script>

<style lang="scss" scoped>
.emgCountChart {
  width: 100%;
  height: 158px;
  //padding: 0 0 1rem 1rem;
  position: relative;
  //top: 20px;
  color: #ffffff;
}

</style>