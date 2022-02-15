<template>
  <div style="width:100%;height:100%;display: flex;align-items: center;">
    <div ref="round7" class="emgCountChart"></div>
  </div>
</template>

<script>
import echarts from "echarts/lib/echarts"
import 'echarts-liquidfill'
export default {
  name: "EmgCount",
  props: ['percent'],
  data() {
    return {
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
        let that = this
        var option = {
            backgroundColor: '',
            series: [{
                    type: 'liquidFill',
                    radius: '75%',
                    center: ['50%', '50%'],
                    data: [0.5, 0.5, 0.5], // data个数代表波浪数
                    backgroundStyle: {
                        borderWidth: 1,
                        color: 'rgb(255,0,255,0.1)'
                    },
                    label: {
                        normal: {
                            formatter: this.percent,
                            textStyle: {
                                fontSize: 50
                            }
                        }
                    },
                    outline: {
                        show: false,
                    }
                },
                {
                    "type": "pie",
                    "center": ["50%", "50%"],
                    "radius": ["75%", "77%"],
                    "hoverAnimation": false,
                    "data": [{
                            "name": "",
                            "value": 500,
                            labelLine: {
                                show: false
                            },
                            itemStyle: {
                                color: '#5886f0'
                            },
                            emphasis: {
                                labelLine: {
                                    show: false
                                },
                                itemStyle: {
                                    color: '#5886f0'
                                },
                            }
                        },
                        { //画中间的图标
                            "name": "",
                            "value": 4,
                            labelLine: {
                                show: false
                            },
                            itemStyle: {
                                color: '#ffffff',
                                "normal": {
                                    "color": "#5886f0",
                                    "borderColor": "#5886f0",
                                    "borderWidth": 20,
                                    // borderRadius: '100%'
                                },
                            },
                            label: {
                                borderRadius: '100%'
                            },
                            emphasis: {
                                labelLine: {
                                    show: false
                                },
                                itemStyle: {
                                    color: '#5886f0'
                                },
                            }

                        },
                        { // 解决圆点过大后续部分显示明显的问题
                            "name": "",
                            "value": 4,
                            labelLine: {
                                show: false
                            },
                            itemStyle: {
                                color: '#5886f0'
                            },
                            emphasis: {
                                labelLine: {
                                    show: false
                                },
                                itemStyle: {
                                    color: '#5886f0'
                                },
                            }
                        },
                        { //画剩余的刻度圆环
                            "name": "",
                            "value": 88,
                            itemStyle: {
                                color: '#050038'
                            },
                            "label": {
                                show: false
                            },
                            labelLine: {
                                show: false
                            },
                            emphasis: {
                                labelLine: {
                                    show: false
                                },
                                itemStyle: {
                                    color: 'rgba(255,255,255,0)'
                                },
                            }
                        }
                    ]
                }

            ]
        } 
        let round7 = this.$echarts.init(this.$refs.round7);
        round7.setOption(option);
    }
  }
};
</script>

<style lang="scss" scoped>
.emgCountChart {
  width: 100%;
  height: 200px;
  //padding: 0 0 1rem 1rem;
  position: relative;
  //top: 20px;
  color: #ffffff;
}

</style>