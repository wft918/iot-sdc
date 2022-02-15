<template>
  <div style="width: 100%;height: 100%;">
    <div style="width:100%;height:40px;border-bottom: 1px solid #103665;border-top: 1px solid #103665;display: flex;align-items: center;">
      <div class="titleStyle"></div>
      <div class="fontStyle">今日告警处理统计</div>
      <div class="endStyle" style="margin-left: 45%;"></div>
      <div class="endStyle" style="margin-left: 10px;"></div>
    </div>
    <div style="width:100%;height:28%">
      <DynamicLightRight01></DynamicLightRight01>
    </div>
    <div style="width:100%;height:40px;border-bottom: 1px solid #103665;border-top: 1px solid #103665;display: flex;align-items: center;">
      <div class="titleStyle"></div>
      <div class="fontStyle">告警趋势</div>
      <div class="endStyle" style="margin-left: 62%;"></div>
      <div class="endStyle" style="margin-left: 10px;"></div>
    </div>
    <div style="width:100%;height:32%;">
      <div ref="dyndamicLightRight02" class="emgCountChart"></div>
    </div>
    <div style="width:100%;height:40px;border-bottom: 1px solid #103665;border-top: 1px solid #103665;display: flex;align-items: center;">
      <div class="titleStyle"></div>
      <div class="fontStyle">告警状态统计</div>
      <div class="endStyle" style="margin-left: 53%;"></div>
      <div class="endStyle" style="margin-left: 10px;"></div>
    </div>
    <div style="width:100%;height:calc(40% - 120px);">
      <DynamicLightRight02></DynamicLightRight02>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
import DynamicLightRight01 from "./DynamicLightRight01";
import DynamicLightRight02 from "./DynamicLightRight02";
import { getLightingAlarmTrend } from "@/api/sdc/lsd";
export default {
  name: "DynamicExhibition",
  components: {
   DynamicLightRight01,DynamicLightRight02
  },
  data() {
    return {
      btn2: "el-button-2",
      btn3: "el-button-1",
      data: [12, 5, 5, 40,20,7,6],
      address: null,
      chartDateList: [],
      chartList:[]
    }
  },
  mounted() {
    // this.address = this.siteId
    this.address = "cff1bf7b5dc745e2ac6f7e9afef531f7"
    this.queryPageData()
  },
  methods: {
    async queryPageData() {
      //照明设备告警趋势
      getLightingAlarmTrend({ siteId: this.address }).then((res) => {
        if (res.data.code === 0) {
          console.log(res);
          this.chartDateList = res.data.data.date
          this.chartList = res.data.data.value
          this.$nextTick(() => {
            this.init();
          });
        }
      });
    },
   changeData(val) {
      switch (val) {
        case "2":
          this.data = [22, 15, 1, 20,10,17,36];
          this.btn2 = "el-button-2";
          this.btn3 = "el-button-1";
          this.init();
          break;
        case "3":
          this.data = [2, 35, 21, 40,30,7,6];
          this.btn3 = "el-button-2";
          this.btn2 = "el-button-1";
          this.init();
          break;
      }
    },
    init(){
      // var O3_data = [281.55, 398.35, 214.02, 179.55, 289.57, 356.14, 422.0]
      // var date_list = ['10-01', '10-02', '10-03', '10-04', '10-05', '10-06','10-07']
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
              top: '5%',
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
              data: this.chartDateList,

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
          series: [
              {
                  name: 'O3',
                  type: 'line',
                  // smooth: true, //是否平滑
                  showAllSymbol: true,
                  // symbol: 'image://./static/images/guang-circle.png',
                  symbol: 'circle',
                  symbolSize: 10,
                  lineStyle: {
                      normal: {
                          color: "#00ca95",
                          shadowColor: 'rgba(0, 0, 0, .3)',
                          shadowBlur: 0,
                          shadowOffsetY: 5,
                          shadowOffsetX: 5,
                      },
                  },
                  label: {
                      show: true,
                      position: 'top',
                      textStyle: {
                          color: '#00ca95',
                      }
                  },

                  itemStyle: {
                      color: "#00ca95",
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
                                  color: 'rgba(0,202,149,0.3)'
                              },
                              {
                                  offset: 1,
                                  color: 'rgba(0,202,149,0)'
                              }
                          ], false),
                          shadowColor: 'rgba(0,202,149, 0.9)',
                          shadowBlur: 20
                      }
                  },
                  data: this.chartList,
              },
          ]
      };
      let dyndamicLightRight02 = this.$echarts.init(this.$refs.dyndamicLightRight02);
      dyndamicLightRight02.setOption(option);
    }
  }
}
</script>

<style lang="scss" scoped>
#gavinPlay{
    background: url("../../../../../public/img/zhfx/mapbg1.png") center no-repeat;
    background-size:contain;
    /* 随便设置宽高值，测试 */
    width:100%;
    height:100%;
    /* 设置默认样式，开启3d硬件加速 */
    -webkit-transform:translate3d(0,0,0);
    -moz-transform:translate3d(0,0,0);
    transform:translate3d(0,0,0);
    /* 设置动画，animation:动画名称 动画播放时长单位秒或微秒 动画播放的速度曲线linear为匀速 动画播放次数infinite为循环播放; */
    -webkit-animation:play 13s linear infinite;
    -moz-animation:play 13s linear infinite;
    animation:play 13s linear infinite;
    /* //margin-top: 5%; */
    /* margin-left: 5%; */
    /* margin-top: -5px; */
}

@-webkit-keyframes play{
    0%  {
        /*
        水平翻转
        -webkit-transform:rotateY(0deg);
        垂直翻转
        -webkit-transform:rotateX(0deg);
        顺时针旋转*/
        -webkit-transform:rotate(0deg);
         /*
        逆时针旋转
        -webkit-transform:rotate(0deg);
        */
    }
    100% {
        /* 水平翻转 
        -webkit-transform:rotateY(360deg);
        垂直翻转
        -webkit-transform:rotateX(360deg);
        顺时针旋转*/
        -webkit-transform:rotate(360deg);
        /* 逆时针旋转
        -webkit-transform:rotate(-360deg);
        */
    }
}
@-moz-keyframes play{
    0%  {
         /*-moz-transform:rotateY(0deg);
       
        -moz-transform:rotateX(0deg);*/
        -moz-transform:rotate(0deg);
         /*-moz-transform:rotate(0deg);
        */
    }
    100% {
         /*-moz-transform:rotateY(360deg);
       
        -moz-transform:rotateX(360deg);*/
        -moz-transform:rotate(360deg);
         /*-moz-transform:rotate(-360deg);
        */
    }
}
@keyframes play{
    0%  {
         /*transform:rotateY(0deg);
        
        transform:rotateX(0deg);*/
        transform:rotate(0deg);
        /*transform:rotate(0deg);*/
        
    }
    100% {
       /* transform:rotateY(360deg);
        
        transform:rotateX(360deg);*/
        transform:rotate(360deg);
        /*transform:rotate(-360deg);
        */
    }
}

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
  margin-left: 60%;
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

.bottomChart {
  width: 100%;
  height: 220px;
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