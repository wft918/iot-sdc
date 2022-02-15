<template>
  <div style="width:100%;height:100%;display: flex;align-items: center;">
    <div ref="dynamicCarLeft02" class="emgCountChart"></div>
  </div>
</template>

<script>
import echarts from "echarts/lib/echarts"
import 'echarts-liquidfill'
import { getVehicleChargeStatistics } from "@/api/sdc/lsd";
export default {
  name: "EmgCount",
  data() {
    return {
        address: null,
        xData: [],
        line: [],
    };
  },
  mounted() {
    // this.address = this.siteId
    this.address = "cff1bf7b5dc745e2ac6f7e9afef531f7"
    // this.init();
    this.queryPageData()
  },
  methods: {
    async queryPageData() {
      //车辆收费
      getVehicleChargeStatistics({ siteId: this.address }).then((res) => {
        if (res.data.code === 0) {
          console.log(res);
            this.xData = []
            this.line = []
          for (let index = 0; index < res.data.data.length; index++) {
              const el = res.data.data[index];
            //   this.dateList.push(el.date)
              this.xData.push(el.value[0])
              if(el.value.length < 2) {
                  this.line.push(10)
              } else {
                  this.line.push(el.value[1])
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
        var xData = ["10", "20", "20", "14", "21", "18"]
        var line = ["130", "205", "84","168","189","87"];
        var attr ={
            'name':'月平均单价',
            'unit':'元/单'
        }
        var colors = []
        var option = {
            tooltip: {
                trigger: 'item',
                padding: 1,
                formatter: function(param) {
                    var resultTooltip =
                        "<div style='background:rgba(13,5,30,.6);border:1px solid rgba(255,255,255,.2);padding:5px;border-radius:3px;'>" +
                        "<div style='text-align:center;'>" +  param.name + "</div>" +
                        "<div style='padding-top:5px;'>"+
                        "<span style=''> " +attr.name + ": </span>" +
                        "<span style=''>" + param.value + "</span><span>" + attr.unit + "</span>"+
                        "</div>" +
                        "</div>";
                    return param.value //resultTooltip
                    }
                },
            grid: {
                left: '5%',
                top: '10%',
                right: '5%',
                bottom: '10%',
            },
            legend: {
                show: true,
                icon: 'circle',
                orient: 'horizontal',
                top: '90.5%',
                right: 'center',
                itemWidth: 16.5,
                itemHeight: 6,
                // itemGap: 30,
                textStyle: {
                    // color: '#FFFFFF'
                    color: '#C9C8CD',
                    fontSize: 14
                }
            },
            xAxis: [{
                data: this.xData,
                axisLabel: {
                    textStyle: {
                        color: '#fff',
                        fontSize:14
                    },
                    //margin: 30, //刻度标签与轴线之间的距离。
                },

                axisLine: {
                    show: false //不显示x轴
                },
                axisTick: {
                    show: false //不显示刻度
                },
                boundaryGap: true,
                splitLine: {
                    show: false,
                    width: 0.08,
                    lineStyle: {
                        type: "solid",
                        color: "#03202E"
                    }
                }
            }],
            yAxis: [{
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: '#eee',
                        type: 'solid'
                    }
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    show:false,
                    textStyle: {
                        color: '#888'
                    },
                }
            }],
            series: [
                {//柱底圆片
                    name: "",
                    type: "pictorialBar",
                    symbolSize: [20, 12],//调整截面形状
                    symbolOffset: [0, 5],
                    z: 12,
                    itemStyle: {
                            "normal": {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: "rgba(89,211,255,1)"
                                    },
                                    {
                                        offset: 1,
                                        color: "rgba(23,237,194,1)"
                                    }
                                ])
                            }
                        },
                    data: this.line
                }, 
                
                //柱体
                {
                    name: '',
                    type: 'bar',
                    barWidth: 20,
                    barGap: '0%',
                    itemStyle: {
                            "normal": {
                                "color": {
                                    "x": 0,
                                    "y": 0,
                                    "x2": 0,
                                    "y2": 1,
                                    "type": "linear",
                                    "global": false,
                                    "colorStops": [{//第一节下面
                                        "offset": 0,
                                        "color": "rgba(0,255,245,0.5)"
                                    }, {
                                        "offset": 1,
                                        "color": "#43bafe"
                                    }]
                                }
                            }
                        },
                
                    data: this.line
                }, 
                
                //柱顶圆片
                {
                    name: "",
                    type: "pictorialBar",
                    symbolSize: [20, 12],//调整截面形状
                    symbolOffset: [0, -5],
                    z: 12,
                    symbolPosition: "end",
                        "itemStyle": {
                            "normal": {
                                color: new echarts.graphic.LinearGradient(0,0,0,1,
                                    [{
                                            offset: 0,
                                            color: "rgba(89,211,255,1)"
                                        },
                                        {
                                            offset: 1,
                                            color: "rgba(23,237,194,1)"
                                        }
                                    ],
                                    false
                                ),
                            }
                        },
                    data: this.line
                }
            ]
        };
        let dynamicCarLeft02 = this.$echarts.init(this.$refs.dynamicCarLeft02);
        dynamicCarLeft02.setOption(option);
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