<template>
    <div style="width: 100%;height: 100%;">
      <div style="width:100%;height:40px;border-bottom: 1px solid #103665;border-top: 1px solid #103665;display: flex;align-items: center;">
        <div class="titleStyle"></div>
        <div class="fontStyle">环境信息</div>
        <div class="endStyle" style="margin-left: 62%;"></div>
        <div class="endStyle" style="margin-left: 3%;"></div>
      </div>
      <div style="width:100%;height:32%;">
        <div style="width:100%;height:10%;display: flex;"></div>
        <div style="width:100%;height:calc(40% - 0px);display: flex;">
          <div class="temBg">
            <img src="../../../../../public/img/zhfxnew/tem.png" style="width:60px;">
          </div>
          <div style="width:70%;height:100%;margin-left: 38px;display:flex;justify-content:space-between;align-items:center;">
            <!-- <div id="tem1" class="fontStyle2">
              当前机房温度峰值：<div style="color: #ffc02a;">{{environmentInfo.envirTempInnerNow}}℃</div>
            </div>
            <div id="tem2" class="fontStyle1">
              当前室外温度：<div style="color: #54d5b8;">{{environmentInfo.envirTempOutNow}}℃</div>
            </div> -->
            <div id="tem3" class="fontStyle1" style="width:100%;height:100%;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;">
              <div style="color: #e66142;font-size:24px;">{{environmentInfo.temperature ? environmentInfo.temperature.max : ''}} <span style="font-size:16px">℃</span></div>
              <div style="font-size:14px;margin-top:5px;">机房最高温度</div>
            </div>
            <div id="tem3" class="fontStyle1" style="width:100%;height:100%;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;">
              <div style="color: #2a8eff;font-size:24px;">{{environmentInfo.temperature ? environmentInfo.temperature.min : ''}} <span style="font-size:16px">℃</span></div>
              <div style="font-size:14px;margin-top:5px;">机房最低温度</div>
            </div>
          </div>
        </div>
        <div style="width:100%;height:calc(40% - 0px);display: flex;">
          <div class="temBg">
            <img src="../../../../../public/img/zhfxnew/hum.png" style="width:60px;">
          </div>
          <div style="width:70%;height:100%;margin-left: 38px;display:flex;justify-content:space-between;align-items:center;">
            <!-- <div id="tem1" class="fontStyle2">
              当前机房温度峰值：<div style="color: #ffc02a;">{{environmentInfo.envirTempInnerNow}}℃</div>
            </div>
            <div id="tem2" class="fontStyle1">
              当前室外温度：<div style="color: #54d5b8;">{{environmentInfo.envirTempOutNow}}℃</div>
            </div> -->
            <div id="tem3" class="fontStyle1" style="width:100%;height:100%;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;">
              <div style="color: #e66142;font-size:24px;">{{environmentInfo.hunidity ? environmentInfo.hunidity.max : ''}} <span style="font-size:16px">%</span></div>
              <div style="font-size:14px;margin-top:5px;">机房最高湿度</div>
            </div>
            <div id="tem3" class="fontStyle1" style="width:100%;height:100%;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;">
              <div style="color: #2a8eff;font-size:24px;">{{environmentInfo.hunidity ? environmentInfo.hunidity.min : ''}} <span style="font-size:16px">%</span></div>
              <div style="font-size:14px;margin-top:5px;">机房最低湿度</div>
            </div>
          </div>
        </div>
        <div style="width:100%;height:10%;display: flex;"></div>
      </div>
      <div style="width:100%;height:40px;border-bottom: 1px solid #103665;border-top: 1px solid #103665;display: flex;align-items: center;">
        <div class="titleStyle"></div>
        <div class="fontStyle">主要污染物</div>
        <div class="endStyle" style="margin-left: 58%;"></div>
        <div class="endStyle" style="margin-left: 3%;"></div>
      </div>
      <!-- <div style="width:100%;height:22%;" >
      <div style="width:100%;height:100%;">
        <div style="width:100%;height:15%;">
          <div style="width:100%;height:40px;display:flex;justify-content:flex-end;align-items:center">
            <el-button-group class="button-group">
              <el-button
                label="1"
                @click="changePollutantType('1')"
                size="mini"
                :class="pltBtn1"
                style="margin-right:8px;"
              >
                分布
              </el-button>
              <el-button
                label="2"
                @click="changePollutantType('2')"
                size="mini"
                :class="pltBtn2"
              >
                检测
              </el-button>
            </el-button-group>
          </div>
        </div>
        <div style="width:100%;height:85%;" v-if="pltType === '1'">
          <round9 ref="round9" :pltData="pltData"></round9>
        </div>
        <div style="width:100%;height:85%;" v-if="pltType === '2'">
          <right04 ref="right04"></right04>
        </div>
      </div>
      </div> -->
      <div style="width:100%;height:28%;display: flex;">
        <div style="width:45%;height:100%;">
          <div id="gavinPlay" style="width:100%;height:100%;">
            <round5 ref="round5"></round5>
          </div>
          <div style="color: white; font-size: 18px; margin-top: -145px; margin-left: 40px;">污染物分布</div>
        </div>
        <div style="width:55%;height:100%;">
          <right01 ref="right01"></right01>
        </div>
      </div>
      <div style="width:100%;height:40px;border-bottom: 1px solid #103665;border-top: 1px solid #103665;display: flex;align-items: center;">
        <div class="titleStyle"></div>
        <div class="fontStyle">告警设备数量排行</div>
        <div class="endStyle" style="margin-left: 45%;"></div>
        <div class="endStyle" style="margin-left: 3%;"></div>
      </div>
      <div style="width:100%;height:calc(40% - 120px);display: flex;">
        <div style="width:100%;height:100%;">
          <bottom1 ref="bottom1" :siteId="siteId"></bottom1>
        </div>
      </div>
    </div>
</template>

<script>
import round9 from "./round9";
import round5 from "./round5";
import bottom1 from "./bottom1";
import right05 from "./right05";
import right01 from "./right01";
import right02 from "./right02";
import echarts from 'echarts/lib/echarts'

import { sdcSiteAction } from "@/api/sdc/addressInfo";
import { modifyData } from "@/util/domainFilter";

import { getEnvironmentalInfo } from "@/api/sdc/lsd";

export default {
  name: "DynamicExhibition",
  props: ['siteId'],
  components: {
    right01,
    right02,
    round9,
    right05,
    round5,
    bottom1
  },
  data() {
    return {
      pltBtn1: "el-button-2",
      pltBtn2: "el-button-1",
      pltType: '1',
      pltData: [],
      lastIndex:1,
      environmentInfo: {},
      // siteId: '27054f4903b14aedbcf9dc212c3734c3'
    }
  },
  watch: {
    siteId(newVal, oldVal) {
      if (newVal) {
        this.queryPageData()
      }
    }
  },
  created() {
    // 
  },
  mounted(){
    if (this.siteId) {
      this.queryPageData()
    }
  },
  methods:{
    async queryPageData() {
      //获取初始区域查询条件数据
      console.log('请求环境信息');
      getEnvironmentalInfo({siteId:this.siteId}).then( res => {
        if(res.data.code === 0) {
          this.environmentInfo = res.data.data
        }
        
      })
    },
    changePollutantType(val) {
      if (val === '1') {
        this.pltType = '1'
        // 请求设备能耗数据
        this.pltBtn1 = "el-button-2";
        this.pltBtn2 = "el-button-1";
      }
      if (val === '2') {
        this.pltType = '2'
        // 请求PUE数据
        this.pltBtn1 = "el-button-1";
        this.pltBtn2 = "el-button-2";
      }
    },
    changeClass(){
      if(document.getElementById('tem1')){
        if(this.lastIndex>3){
          this.lastIndex = 1
          //清除上一个选择
          document.getElementById('tem4').classList.remove("fontStyle2")//.removeClass('fontStyle2')
          document.getElementById('tem4').classList.add("fontStyle1") //.addClass('fontStyle1')
          //加上当前选中
          document.getElementById('tem1').classList.remove("fontStyle1")
          document.getElementById('tem1').classList.add("fontStyle2")
        }else{
          //清除上一个选择
          document.getElementById('tem'+this.lastIndex.toString()).classList.remove("fontStyle2")
          document.getElementById('tem'+this.lastIndex.toString()).classList.add("fontStyle1")
          //加上当前选中
          document.getElementById('tem'+(this.lastIndex+1).toString()).classList.remove("fontStyle1")
          document.getElementById('tem'+(this.lastIndex+1).toString()).classList.add("fontStyle2")

          this.lastIndex = this.lastIndex + 1
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.temBg{
  width:30%;height:100%;display: flex;align-items: center;justify-content: center;
  // background: url("../../../../../public/img/zhfx/source167.png") center no-repeat;
  background-size: 82%;
}

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
  margin-right: 5%;
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