<template>
  <div style="width: 100%;height: 100%;">
    <div style="width:100%;height:40px;border-bottom: 1px solid #103665;border-top: 1px solid #103665;display: flex;align-items: center;">
      <div class="titleStyle"></div>
      <div class="fontStyle">耗电量趋势</div>
      <div class="endStyle" style="margin-left: 89%;"></div>
      <div class="endStyle" style="margin-left: 10px;"></div>
    </div>
    <div style="width:100%;height:calc(100% - 40px);">
      <DynamicLightBottom01></DynamicLightBottom01>
    </div>
  </div>
</template>

<script>
import DynamicLightBottom01 from "./DynamicLightBottom01";
import echarts from 'echarts/lib/echarts'
export default {
  name: "DynamicExhibition",
  components: {
   DynamicLightBottom01
  },
  data() {
    return {
     
    }
  },
  mounted(){
    let that = this
    this.$nextTick(function(){
      // that.init()
      // that.initbottomChart()
    })
    
  },
  methods:{
   
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