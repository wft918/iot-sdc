<template>
  <div  style="width: 100%;height: 100%;">
    <div style="width:100%;height:40px;border-bottom: 1px solid #103665;border-top: 1px solid #103665;display: flex;align-items: center;">
      <div class="titleStyle"></div>
      <div class="fontStyle">月度人流量统计</div>
      <div class="endStyle" style="margin-left: 48%;"></div>
      <div class="endStyle" style="margin-left: 3%;"></div>
    </div>
    <div style="width:100%;height:22%;">
      <DynamicAnFangLeft01></DynamicAnFangLeft01>
    </div>
    <div style="width:100%;height:40px;border-bottom: 1px solid #103665;border-top: 1px solid #103665;display: flex;align-items: center;">
      <div class="titleStyle"></div>
      <div class="fontStyle">设备运行状态</div>
      <div class="endStyle" style="margin-left: 53%;"></div>
      <div class="endStyle" style="margin-left: 3%;"></div>
    </div>
    <div style="width:100%;height:35%;">
      <div style="width:100%;height:35%;">
        <DynamicAnFangLeft02></DynamicAnFangLeft02>
      </div>
      <div style="width:100%;height:65%;">
        <DynamicAnFangLeft03></DynamicAnFangLeft03>
      </div>
    </div>
    <div style="width:100%;height:40px;border-bottom: 1px solid #103665;border-top: 1px solid #103665;display: flex;align-items: center;">
      <div class="titleStyle"></div>
      <div class="fontStyle">安防设备类型统计</div>
      <div class="endStyle" style="margin-left: 45%;"></div>
      <div class="endStyle" style="margin-left: 3%;"></div>
    </div>
    <div style="width:100%;height:calc(43% - 120px);">
      <DynamicAnFangLeft04></DynamicAnFangLeft04>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
import DynamicAnFangLeft01 from "./DynamicAnFangLeft01";
import DynamicAnFangLeft02 from "./DynamicAnFangLeft02";
import DynamicAnFangLeft03 from "./DynamicAnFangLeft03";
import DynamicAnFangLeft04 from "./DynamicAnFangLeft04";
export default {
  name: "DynamicExhibition",
  components: {
    DynamicAnFangLeft01,DynamicAnFangLeft02,DynamicAnFangLeft03,DynamicAnFangLeft04
  },
  data() {
    return {
      btn1: "el-button-2",
      btn2: "el-button-1",
      btn3: "el-button-1",
      data: [12, 5, 5, 40,20,7,6],
    }
  },
  mounted(){
    let that = this
    // this.$nextTick(function(){
    //   that.init()
    // })
  },
  methods:{
    changeData(val) {
      switch (val) {
        case "1":
          this.data = [12, 5, 5, 40,20,7,6];
          this.btn1 = "el-button-2";
          this.btn2 = this.btn3 = "el-button-1";
          break;
        case "2":
          this.data = [22, 15, 1, 20,10,17,36];
          this.btn2 = "el-button-2";
          this.btn1 = this.btn3 = "el-button-1";
          break;
        case "3":
          this.data = [2, 35, 21, 40,30,7,6];
          this.btn3 = "el-button-2";
          this.btn2 = this.btn1 = "el-button-1";
          break;
      }
    }
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