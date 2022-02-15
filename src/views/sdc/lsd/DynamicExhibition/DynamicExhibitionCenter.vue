<template>
  <div style="width: 100%;height: 100%;display:flex;justify-content:space-around;">
    <div style="width:45%;height:100%;">
      <div style="width:100%;height:40px;border-bottom: 1px solid #103665;border-top: 1px solid #103665;display: flex;align-items: center;">
        <div class="titleStyle"></div>
        <div class="fontStyle">近七日能耗趋势图</div>
        <div class="endStyle" style="margin-left: 58%;"></div>
        <div class="endStyle" style="margin-left: 1%;"></div>
      </div>
      <div style="width:100%;height:calc(100% - 40px);">
        <div style="width:100%;height:100%;">
          <div ref="bottomChart" class="bottomChart"></div>
        </div>
      </div>
    </div>
    <div style="width:45%;height:100%;">
      <div style="width:100%;height:40px;border-bottom: 1px solid #103665;border-top: 1px solid #103665;display: flex;align-items: center;">
        <div class="titleStyle"></div>
        <div class="fontStyle">PUE走势图</div>
        <div class="endStyle" style="margin-left: 68%;"></div>
        <div class="endStyle" style="margin-left: 1%;"></div>
      </div>
      <div style="width:100%;height:calc(100% - 40px);">
        <div style="width:100%;height:100%;">
          <right05 :planId="planId"></right05>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
import right05 from "./right05";
import { getPowerTrend } from "@/api/sdc/lsd";
import { getBeforeDate } from "@/util/getBeforeDate"
import eventBus from "@/util/eventBus";
export default {
  name: "DynamicExhibition",
  components: {
    right05
  },
  data() {
    return {
     encTrend: null,
     deviceNums: [],
     planId: '',
     startTime: ''
    }
  },
  watch: {
    planId(newVal,oldVal) {
      if (newVal) {
        this.queryData()
      }
    }
  },
  created() {
    this.startTime = getBeforeDate(7)
  },
  mounted(){
    eventBus.$on('refreshEnergyData',(res) => {
      this.planId = res
    })
    if (this.planId) {
      this.queryData()
    }
  },
  methods:{
    async queryData() {
      getPowerTrend({
        planId: this.planId,
        startTime: this.startTime
      }).then(res => {
          if (res.data.code === 0) {
          this.encTrend = res.data.data;
          this.$nextTick(() => {
            this.initbottomChart();
          });
        }
      })
    },
    initbottomChart(){
      let option = {
        backgroundColor:'',
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                    let html = '';
                    params.forEach(v => {
                        // console.log(v)
                        html += `<div style="color: #666;font-size: 14px;line-height: 24px">
                        <span style="margin-left:10px">${v.axisValue}</span><br/>
                        <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#0099FF;"></span>
                        ${v.seriesName}:
                        <span style="color:#0099FF;font-weight:700;font-size: 16px">${v.value} kWh</span>`;
                    })
                    return html
                },
            extraCssText: 'background: #fff; border-radius: 0;box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);color: #333;',
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
            top: '8%',
            left: '15%',
            right: '15%',
            bottom: '20%',
            // containLabel: true
        },
        xAxis: [{
            type: 'category',
            axisLine: {
                show: false,
                color:'#A582EA'
            },
        
            axisLabel: {
                color: 'white',
                width:100
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#00BFF3',
                    opacity:0.23
                }
            },
            inverse: true,
            boundaryGap: false,
            data: this.encTrend.xaxis//this.$moment(data.times).format("HH-mm") ,

        }],

        yAxis: [{
            type: 'value',
            min: 0,
            // max: 140,
            splitNumber: 4,
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#00BFF3',
                    opacity:0.23
                }
            },
            axisLine: {
                show: false,
            },
            axisLabel: {
                show: true,
                margin: 20,
                textStyle: {
                    color: '#fff',

                },
            },
            axisTick: {
                show: false,
            },
        }],
        series: [
            {
                name:'总能耗',
                type: 'line',
                smooth: true,
                showAllSymbol: true,
                symbol: 'circle',
                symbolSize: 10,
                lineStyle: {
                    normal: {
                        color: "#2CABE3",
                    },
                },
                label: {
                    show: true,
                    position: 'top',
                    textStyle: {
                        color: '#2CABE3',
                    }
                },
                itemStyle: {
                    color: "#fff",
                    borderColor: "#2CABE3",
                    borderWidth: 2,
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: 'rgba(81,150,164,0.3)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(81,150,164,0)'
                            }
                        ], false),
                    }
                },
                data: this.encTrend.series[2].data//data.values
            },
        ]
      };
      let bottomChart = this.$echarts.init(this.$refs.bottomChart);
      bottomChart.setOption(option)
    },
  }
}
</script>

<style lang="scss" scoped>

.emg-count {
  width: 100%;
  height: 25%;
}
.text-body {
  top: 2rem;
  height: 80%;
}
.text-row2 {
  height: 58%;
  width: 50%;
  font-size: 1.125rem;
  display: flex;
  justify-items: center;
  align-items: center;
  border: 6px solid #6ec0ff;
  color: #6ec0ff;
  border-radius: 50%;
}
.emgCountChart {
  width: 100%;
  height: 200px;
  padding: 0 0 1rem 1rem;
  position: relative;
  top: 20px;
  color: #ffffff;
}
.button-group {
  display: inline;
  position: absolute;
  margin-left: 47%;
}

.el-button-1{
  background: rgba(0,0,0,0.4);
  color: white;
  opacity: 1;
}

.el-button:focus, .el-button:hover{
    background: #59b6d9;
    color: #ffffff;
    opacity: 1;
}

.bottomChart,
.bottomChart1 {
  width: 100%;
  height: 100%;
  position: relative;
  top: 20px;
  color: #ffffff;
}

// .bg1Class{
//     background: url("../../../../../public/img/zhfx/bg1.png") center no-repeat;
//     background-size:contain;
//     /* 随便设置宽高值，测试 */
//     width:100%;
//     height:100%;
//     /* 设置默认样式，开启3d硬件加速 */
//     -webkit-transform:translate3d(0,0,0);
//     -moz-transform:translate3d(0,0,0);
//     transform:translate3d(0,0,0);
//     /* 设置动画，animation:动画名称 动画播放时长单位秒或微秒 动画播放的速度曲线linear为匀速 动画播放次数infinite为循环播放; */
//     -webkit-animation:play 13s linear infinite;
//     -moz-animation:play 13s linear infinite;
//     animation:play 13s linear infinite;
// }

.bgClassT{
  background: url("../../../../../public/img/zhfx/border16.png") center no-repeat;
  background-size:100% 80%;
}
</style>