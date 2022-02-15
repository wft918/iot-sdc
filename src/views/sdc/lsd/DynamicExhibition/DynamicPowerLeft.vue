<template>
  <div  style="width: 100%;height: 100%;">
    <div style="width:100%;height:40px;border-bottom: 1px solid #103665;border-top: 1px solid #103665;display: flex;align-items: center;">
      <div class="titleStyle"></div>
      <div class="fontStyle">设备类型统计 </div>
      <div class="endStyle" style="margin-left: 53%;"></div>
      <div class="endStyle" style="margin-left: 3%;"></div>
    </div>
    <div style="width:100%;height:22%;">
      <DynamicPowerLeft01 :siteId="siteId"></DynamicPowerLeft01>
    </div>
    <div style="width:100%;height:40px;border-bottom: 1px solid #103665;border-top: 1px solid #103665;display: flex;align-items: center;">
      <div class="titleStyle"></div>
      <div class="fontStyle">资产运行状态</div>
      <div class="endStyle" style="margin-left: 53%;"></div>
      <div class="endStyle" style="margin-left: 3%;"></div>
    </div>
    <div style="width:100%;height:30%;">
      <div style="width:100%;height:25%;display: flex;align-items: center;margin-top:50px">
        <div style="width:0.5%;height:100%;"></div>
        <div style="width:33%;height:100%;">
          <div style="width:100%;height:60%;display: flex;align-items: center;color: #36a0e4;font-weight: 400;font-size: 40px;justify-content: center;font-family: Agency FB Regular, Agency FB Regular-Regular;">{{deviceStatus.all}}</div>
          <div style="width:100%;height:40%;display: flex;align-items: center;color: #dae7f8;font-weight: 500;font-size: 15px;justify-content: center;">总数</div>
        </div>
        <div style="width:33%;height:100%;">
          <div style="width:100%;height:60%;display: flex;align-items: center;color: #6EFFE5;font-weight: 400;font-size: 40px;justify-content: center;font-family: Agency FB Regular, Agency FB Regular-Regular;">{{deviceStatus.online}}</div>
          <div style="width:100%;height:40%;display: flex;align-items: center;color: #dae7f8;font-weight: 500;font-size: 15px;justify-content: center;">在线</div>
        </div>
        <div style="width:33%;height:100%;">
          <div style="width:100%;height:60%;display: flex;align-items: center;color: #f55353;font-weight: 400;font-size: 40px;justify-content: center;font-family: Agency FB Regular, Agency FB Regular-Regular;">{{deviceStatus.alarm}}</div>
          <div style="width:100%;height:40%;display: flex;align-items: center;color: #dae7f8;font-weight: 500;font-size: 15px;justify-content: center;">告警</div>
        </div>
        <div style="width:0.5%;height:100%;"></div>
      </div>
      <div style="width:100%;height:75%">
        <DynamicPowerLeft03 :deviceStatus="deviceStatus"></DynamicPowerLeft03>
      </div>
    </div>
    <div style="width:100%;height:40px;border-bottom: 1px solid #103665;border-top: 1px solid #103665;display: flex;align-items: center;">
      <div class="titleStyle"></div>
      <div class="fontStyle">告警数量趋势</div>
      <div class="endStyle" style="margin-left: 53%;"></div>
      <div class="endStyle" style="margin-left: 3%;"></div>
    </div>
    <div style="width:100%;height:calc(48% - 120px);">
      <div style="width:100%;height:100%;">
        <div style="width:100%;height:15%;">
          <div style="width:100%;height:40px;display:flex;justify-content:flex-end;align-items:center">
            <el-button-group class="button-group">
              <el-button
                label="1"
                @click="changeCharts('1')"
                size="mini"
                :class="btn1"
                style="margin-right:8px;"
              >
                近一周
              </el-button>
              <el-button
                label="2"
                @click="changeCharts('2')"
                size="mini"
                :class="btn2"
              >
                近一月
              </el-button>
            </el-button-group>
          </div>
          <!-- <div style="width:100%;height:20%;color:white;font-size: 15px;font-weight: 600;">总车位：{{parkingSpace.parkingSpaceTotal}}</div>
          <div style="width:100%;height:20%;color:#C49BFF;font-size: 15px;font-weight: 600;">占用车位：{{parkingSpace.parkingSpaceOccupied}}</div>
          <div style="width:100%;height:20%;color:#6DFFE5;font-size: 15px;font-weight: 600;">空闲车位：{{parkingSpace.parkingSpaceFree}}</div> -->
        </div>
        <div style="width:100%;height:85%;">
          <DynamicPowerLeft02 :chartsType="chartsType" :siteId="siteId"></DynamicPowerLeft02>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
import DynamicPowerLeft01 from "./DynamicPowerLeft01";
import DynamicPowerLeft02 from "./DynamicPowerLeft02";
import DynamicPowerLeft03 from "./DynamicPowerLeft03";
import { getDeviceInfo } from "@/api/sdc/lsd";
import eventBus from '../../../../util/eventBus';
export default {
  name: "DynamicExhibition",
  props: ['siteId'],
  components: {
    DynamicPowerLeft01,DynamicPowerLeft02,DynamicPowerLeft03
  },
  data() {
    return {
      btn1: "el-button-2",
      btn2: "el-button-1",
      chartsType: '1',
      // siteId: '27054f4903b14aedbcf9dc212c3734c3',
      deviceStatus: {}
    }
  },
  watch: {
    siteId(newVal) {
      if (newVal) {
        this.queryPageData()
      }
    }
  },
  created() {
    this.queryPageData()
    this.setTimer()
  },
  beforeDestroy() {
    clearInterval(this.$store.state.user.PowerRealTimer)
  },
  mounted(){
    let that = this
    // this.$nextTick(function(){
    //   that.init()
    // })
  },
  methods:{
    queryPageData() {
      getDeviceInfo(this.siteId).then(res => {
        if (res.data.code === 0) {
          this.deviceStatus = res.data.data
          if (this.deviceStatus) {
            eventBus.$emit('deviceTotal', this.deviceStatus.all)
          }
        }
      })
    },
    setTimer() {
      if (this.$store.state.user.PowerRealTimer) {
        clearInterval(this.$store.state.user.PowerRealTimer)
      }
      this.$store.state.user.PowerRealTimer = setInterval(() => {
        this.queryPageData(this.siteId);
      }, 5000);
    },
    changeCharts(val) {
      if (val === '1') {
        this.chartsType = '1'
        // 请求设备能耗数据
        this.btn1 = "el-button-2";
        this.btn2 = "el-button-1";
      }
      if (val === '2') {
        this.chartsType = '2'
        // 请求PUE数据
        this.btn1 = "el-button-1";
        this.btn2 = "el-button-2";
      }
  }
  }
}
</script>

<style lang="scss" scoped>
.xunClass{
  background-image: linear-gradient(to right, #0d2143, rgba(13,33,67,0) 25%, rgba(213,33,67,0) 75%, #0d2143 100%);text-align: center;

  .fontStyle{
    color: #a9bae6;font-weight: 400;font-size: 14px;width: 25%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 11px;
    cursor: pointer;
  }

  .fontStyleChoose{
    color: #00D9FF;
    font-weight: 400;
    font-size: 14px;
    width: 25%;
    background: url(../../../../../public/img/zhfxnew/tabbg.png) center no-repeat;
    background-size: 100% 70%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 11px;
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

.bg1Class{
    background: url("../../../../../public/img/zhfx/bg1.png") center no-repeat;
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
}

.bgClassT{
  background: url("../../../../../public/img/zhfx/border16.png") center no-repeat;
  background-size:100% 80%;
}
</style>