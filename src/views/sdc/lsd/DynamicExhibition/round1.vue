<template>
  <div style="width:100%;height:100%;display: flex;align-items: flex-end;">
    <div ref="round1" class="emgCountChart"></div>
  </div>
</template>

<script>
export default {
  name: "EmgCount",
  data() {
    return {
        tempId2:null
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      let num = 0;
      let value = 13782;
      let option =  {
        backgroundColor: '',
        title: {
            text: value,
            textStyle: {
                color: "#6effe5",
                fontSize: 20,
                fontWeight: '400',
                rich: {
                    a: {
                        fontSize: 48,
                        color: '#29EEF3'
                    },

                    c: {
                        fontSize: 40,
                        lineHeight: 75,
                        color: '#ffffff',
                        // padding: [5,0]
                    }
                }
            },
            x: "center",
            y: "center"
        },
        series: [{
                type: 'pie',
                zlevel: 1,
                silent: true,
                /*
                radius
                饼图的半径。可以为如下类型：
                number：直接指定外半径值。
                string：例如，'20%'，表示外半径为可视区尺寸（容器高宽中较小一项）的 20% 长度。
                Array.<number|string>：数组的第一项是内半径，第二项是外半径。每一项遵从上述 number string 的描述。
                */
                radius: ['97%', '98%'],
                hoverAnimation: false,
                //color: "rgba(88,142,197,0.5)",
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0,
                        color: '#6effe5' // 0% 处的颜色
                    }, {
                        offset: 1,
                        color: '#6effe5' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                },
                // animation:false,    //charts3 no
                label: {
                    normal: {
                        show: false
                    },
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: [1]
            },
            {
                type: 'pie',
                zlevel: 2,
                silent: true,
                radius: ['90%', '91%'],
                startAngle: 90,
                hoverAnimation: false,
                // animation:false,    //charts3 no
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0,
                        color: '#6effe5' // 0% 处的颜色
                    }, {
                        offset: 1,
                        color: '#6effe5' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                },
                label: {
                    normal: {
                        show: false
                    },
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: this._pie2()
            },
            {
                type: 'pie',
                zlevel: 3,
                silent: true,
                radius: ['83%', '84%'],
                label: {
                    normal: {
                        show: false
                    },
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: this._pie3()
            },
            
          
        ]
      };
      let round1 = this.$echarts.init(this.$refs.round1);
      round1.setOption(option);
        let that = this
      setTimeout(function(){
        that.tempId2 = setInterval(function(){
          option.series[1].startAngle = option.series[1].startAngle - 1;
          //option.series[2].startAngle = option.series[2].startAngle - 1;
          //option.series[6].data[0].value = option.series[6].data[0].value + 1;
          round1.setOption(option);
        }, 100);
      }, 500);
    },
    _pie2() {
        let dataArr = [];
        let _color = {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
                offset: 0,
                color: '#9933FF' // 0% 处的颜色
            }, {
                offset: 1,
                color: '#00CCFF' // 100% 处的颜色
            }],
            global: false // 缺省为 false
        }
        for (var i = 0; i < 16; i++) {
            if (i % 4 === 0) {
                dataArr.push({
                    name: (i + 1).toString(),
                    value: 50,
                    itemStyle: {
                        normal: {
                            //color: "rgba(88,142,197,0.5)",
                            borderWidth: 0,
                            borderColor: "rgba(0,0,0,0)"
                        }
                    }
                })
            } else if (i % 4 === 1) {
                dataArr.push({
                    name: (i + 1).toString(),
                    value: 2,
                    itemStyle: {
                        normal: {
                            color: "rgba(88,142,197,0)",
                            borderWidth: 0,
                            borderColor: "rgba(0,0,0,0)"
                        }
                    }
                })
            } else if (i % 4 === 2) {
                dataArr.push({
                    name: (i + 1).toString(),
                    value: 20,
                    itemStyle: {
                        normal: {
                            //color: "rgba(88,142,197,0.2)",
                            borderWidth: 0,
                            borderColor: "rgba(0,0,0,0)"
                        }
                    }
                })
            } else {
                dataArr.push({
                    name: (i + 1).toString(),
                    value: 2,
                    itemStyle: {
                        normal: {
                            //color: "rgba(0,0,0,0)",
                            color: "rgba(88,142,197,0)",
                            borderWidth: 0,
                            borderColor: "rgba(0,0,0,0)"
                        }
                    }
                })
            }

        }
        return dataArr

    },
    _pie3() {
        let dataArr = [];
        for (var i = 0; i < 100; i++) {
            if (i % 2 === 0) {
                dataArr.push({
                    name: (i + 1).toString(),
                    value: 25,
                    itemStyle: {
                        normal: {
                            color: "rgb(126,190,255)",
                            borderWidth: 0,
                            borderColor: "rgba(0,0,0,0)"
                        }
                    }
                })
            } else {
                dataArr.push({
                    name: (i + 1).toString(),
                    value: 20,
                    itemStyle: {
                        normal: {
                            color: "rgba(0,0,0,0)",
                            borderWidth: 0,
                            borderColor: "rgba(0,0,0,0)"
                        }
                    }
                })
            }

        }
        return dataArr

    }
  },
  beforeDestroy(){
      clearInterval(this.tempId2)
  }
};
</script>

<style lang="scss" scoped>
.emgCountChart {
  width: 100%;
  height: 90px;
  //padding: 0 0 1rem 1rem;
  position: relative;
  //top: 20px;
  color: #ffffff;
}

</style>