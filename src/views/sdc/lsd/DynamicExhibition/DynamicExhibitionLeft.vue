<template>
  <div  style="width: 100%;height: 100%;">
    <div style="width:100%;height:40px;border-bottom: 1px solid #103665;border-top: 1px solid #103665;display: flex;align-items: center;">
      <div class="titleStyle"></div>
      <div class="fontStyle">运行状态分析</div>
      <div class="endStyle" style="margin-left: 53%;"></div>
      <div class="endStyle" style="margin-left: 3%;"></div>
    </div>
    <div style="width:100%;height:18%;">
      <div style="width:100%;height:50%;display: flex;">
        <div style="width:33%;height:100%;">
          <div class="fontStyle1">机房面积 (㎡)</div>
          <div class="contentStyle">
            <img src="../../../../../public/img/zhfxnew/area.png" style="width:15px;">
            <div class="fontStyle2">{{runStatusInfo.siteArea}}</div>
          </div>
        </div>
        <div style="width:33%;height:100%;">
          <div class="fontStyle1">车位数量 (个)</div>
          <div class="contentStyle">
            <img src="../../../../../public/img/zhfx/car.png" style="width:15px;">
            <div class="fontStyle2">{{runStatusInfo.parkSpaces}}</div>
          </div>
        </div>
        <div style="width:33%;height:100%;">
          <div class="fontStyle1">机柜设备 (个)</div>
          <div class="contentStyle">
            <img src="../../../../../public/img/zhfxnew/rack.png" style="width:15px;">
            <div class="fontStyle2">{{runStatusInfo.rackNum}}</div>
          </div>
        </div>
        <!-- <div style="width:25%;height:100%;">
          <div class="fontStyle1">车位总数</div>
          <div class="contentStyle">
            <img src="../../../../../public/img/zhfx/car.png" style="width:15px;">
            <div class="fontStyle2">{{runStatusInfo.parkingSpaces}}</div>
          </div>
        </div> -->
      </div>
      <div style="width:100%;height:50%;display: flex;">
        <div style="width:33%;height:100%;">
          <div class="fontStyle1">动力设备 (个)</div>
          <div class="contentStyle">
            <img src="../../../../../public/img/zhfxnew/power.png" style="width:15px;">
            <div class="fontStyle2" style="color: #f76587;">{{runStatusInfo.powerNum}}</div>
          </div>
        </div>
        <div style="width:33%;height:100%;">
          <div class="fontStyle1">环境设备 (个)</div>
          <div class="contentStyle">
            <img src="../../../../../public/img/zhfxnew/environment.png" style="width:15px;">
            <div class="fontStyle2" style="color: #f76587;">{{runStatusInfo.envNum}}</div>
          </div>
        </div>
        <div style="width:33%;height:100%;">
          <div class="fontStyle1">其他设备 (个)</div>
          <div class="contentStyle">
            <img src="../../../../../public/img/zhfxnew/other.png" style="width:15px;">
            <div class="fontStyle2" style="color: #f76587;">{{runStatusInfo.otherNum}}</div>
          </div>
        </div>
        <!-- <div style="width:25%;height:100%;">
          <div class="fontStyle1">摄像头</div>
          <div class="contentStyle">
            <img src="../../../../../public/img/zhfx/camera.png" style="width:15px;">
            <div class="fontStyle2"  style="color: #76d3f9;">{{runStatusInfo.ipcs}}</div>
          </div>
        </div> -->
      </div>
    </div>
    <div style="width:100%;height:40px;border-bottom: 1px solid #103665;border-top: 1px solid #103665;display: flex;align-items: center;">
      <div class="titleStyle"></div>
      <div class="fontStyle">设备概况</div>
      <div class="endStyle" style="margin-left: 61%;"></div>
      <div class="endStyle" style="margin-left: 3%;"></div>
    </div>
    <div style="width:100%;height:17%;display: flex;align-items: center;justify-content: center;">
      <div style="width:33%;height:100%;">
        <div class="roundOut">
          <div class="round1">
            {{devProfile.all}}
          </div>
        </div>
        <div class="underRound" style="color: #6ec0ff;">总数</div>
      </div>
      <div style="width:33%;height:100%;">
        <div class="roundOut">
          <div class="round2">
            {{devProfile.online}}
          </div>
        </div>
        <div class="underRound" style="color: #6effe5;">在线</div>
      </div>
      <!-- <div style="width:33%;height:100%;">
        <div class="roundOut">
          <div class="round3">
            {{devProfile.deviceOffline}}
          </div>
        </div>
        <div class="underRound" style="color: #cfe2f1;">离线</div>
      </div> -->
      <div style="width:33%;height:100%;">
          <div class="roundOut">
          <div class="round4">
            {{devProfile.alarm}}
          </div>
        </div>
        <div class="underRound" style="color: #ff7272;">告警</div>
      </div>
    </div>
    <div style="width:100%;height:40px;border-bottom: 1px solid #103665;border-top: 1px solid #103665;display: flex;align-items: center;">
      <div class="titleStyle"></div>
      <div class="fontStyle">今日容量分析</div>
      <div class="endStyle" style="margin-left: 53%;"></div>
      <div class="endStyle" style="margin-left: 3%;"></div>
    </div>
    <div style="width:100%;height:22%;">
      <div style="width:100%;height:calc(100% - 40px)">
        <div ref="emgCountChart" class="emgCountChart"></div>
      </div>
    </div>
    <div style="width:100%;height:40px;border-bottom: 1px solid #103665;border-top: 1px solid #103665;display: flex;align-items: center;">
      <div class="titleStyle"></div>
      <div class="fontStyle">今日能耗分析</div>
      <div class="endStyle" style="margin-left: 53%;"></div>
      <div class="endStyle" style="margin-left: 3%;"></div>
    </div>
    <div style="width:100%;height:calc(43% - 160px);">
      <div style="width:100%;height:100%;">
        <div style="width:100%;height:15%;display:flex;justify-content:space-between;">
          <div class="selectClass" style="width:50%;height:40px;display:flex;justify-content:flex-start;align-items:center" >
             <el-select v-model="planId" placeholder="" @change="changePlan">
              <el-option style="width:80%" 
                v-for="item in planOption"
                :key="item.id"
                :label="item.planName"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div style="width:50%;height:40px;display:flex;justify-content:flex-end;align-items:center;margin-top:5px;">
            <el-button-group class="button-group">
              <el-button
                label="1"
                @click="changeEnergyType('1')"
                size="mini"
                :class="encBtn1"
                style="margin-right:8px;"
              >
                设备
              </el-button>
              <el-button
                label="2"
                @click="changeEnergyType('2')"
                size="mini"
                :class="encBtn2"
              >
                PUE
              </el-button>
            </el-button-group>
          </div>
          <!-- <div style="width:100%;height:20%;color:white;font-size: 15px;font-weight: 600;">总车位：{{parkingSpace.parkingSpaceTotal}}</div>
          <div style="width:100%;height:20%;color:#C49BFF;font-size: 15px;font-weight: 600;">占用车位：{{parkingSpace.parkingSpaceOccupied}}</div>
          <div style="width:100%;height:20%;color:#6DFFE5;font-size: 15px;font-weight: 600;">空闲车位：{{parkingSpace.parkingSpaceFree}}</div> -->
        </div>
        <div style="width:100%;height:85%;" v-if="encType === '1'">
          <round8 ref="round8" :planId="planId"></round8>
        </div>
        <div style="width:100%;height:85%;" v-if="encType === '2'">
          <LeftGauge ref="LeftGauge" :planId="planId" :center="['45%', '55%']"></LeftGauge>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
import round8 from "./round8";
import LeftGauge from "./LeftGauge";

import { sdcSiteAction } from "@/api/sdc/addressInfo";
import { modifyData } from "@/util/domainFilter";
import eventBus from "@/util/eventBus";
import { getRunStatusInfo, getDeviceInfo, getCapacityAnalysis, getPSAnalysis, getLDDetail, getEnergyPlanList } from "@/api/sdc/lsd";

export default {
  name: "DynamicExhibition",
  props: ['siteId'],
  components: {
    round8,
    LeftGauge
  },
  watch: {
    siteId(newVal,oldVal) {
      if (newVal) {
        this.getEnergyPlanList()
        this.queryPageData()
      }
    }
  },
  data() {
    return {
      encBtn1: "el-button-2",
      encBtn2: "el-button-1",
      // btn3: "el-button-1",
      // data: [12, 5, 5, 40,20,7,6],
      encData: [],
      gagueData: 0,
      encType: '1',
      runStatusInfo: {},
      devProfile: {},
      capacityData: [],
      parkingSpace: {},
      ldDetail: null,
      percent: 0,
      planOption: [],
      // siteId: '27054f4903b14aedbcf9dc212c3734c3',
      planId: ''

    }
  },
  created() {
    this.getEnergyPlanList()
    this.setTimer()
  },
  beforeDestroy() {
    clearInterval(this.$store.state.user.exhibitionRealTimer)
  },
  mounted(){
    if (this.siteId) {
      this.queryPageData()
    }
    // this.init()
  },
  methods:{
    async queryPageData() {
      Promise.all([
        getRunStatusInfo(this.siteId),
        getDeviceInfo(this.siteId),
        getCapacityAnalysis(this.siteId),
        // getLDDetail({
        //   siteId:siteId,
        //   beginDate: '2021-08-04 00:00:00',
        //   endDate: '2021-08-05 00:00:00'
        // })
      ]).then( res => {
        if(res[0].data.code === 0) {
          this.runStatusInfo = res[0].data.data
        }
        if(res[1].data.code === 0) {
          this.devProfile = res[1].data.data
        }
        if(res[2].data.code === 0) {
          this.capacityData = res[2].data.data
           this.init()
        }
        // if(res[3].data.code === 0) {
        //   this.ldDetail = res[3].data.data[0]
         
        // }
        
      })
    },
    setTimer() {
      if (this.$store.state.user.exhibitionRealTimer) {
        clearInterval(this.$store.state.user.exhibitionRealTimer)
      }
      this.$store.state.user.exhibitionRealTimer = setInterval(() => {
        getDeviceInfo(this.siteId).then(res => {
          this.devProfile = res.data.data
        })
      }, 5000);
    },
    getEnergyPlanList() {
      getEnergyPlanList(this.siteId).then(res => {
        if (res.data.code === 0) {
          this.planOption = res.data.data
          if (this.planOption.length > 0) {
            this.planId = this.planOption[0].id
            eventBus.$emit('refreshEnergyData', this.planId)
          } else {
            this.planId = ''
            eventBus.$emit('refreshEnergyData', this.planId)
          }
        }
      })
    },
    changePlan(val) {
      if (val) {
        eventBus.$emit('refreshEnergyData', this.planId)
      }
    },
    changeEnergyType(val) {
      if (val === '1') {
        this.encType = '1'
        // 请求设备能耗数据
        this.encBtn1 = "el-button-2";
        this.encBtn2 = "el-button-1";
      }
      if (val === '2') {
        this.encType = '2'
        // 请求PUE数据
        this.encBtn1 = "el-button-1";
        this.encBtn2 = "el-button-2";
      }
    },
    init() {
      let emgCountChart = this.$echarts.init(this.$refs.emgCountChart);
      emgCountChart.setOption({
        color: ['#FC8F60','#0099FF'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
          // formatter: '移动{b}<br/> {a0} : {c0} <br/> {a1} : {c1}'
        },
        legend: {
          // data: ['制冷', 'IT设备', '照明', '其他'],
          icon: 'rect',
          top: -5,
          right: 10,
          itemGap: 5,
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 20,
          textStyle: {
            fontSize: 14,
            color: '#DDD'
          }
        },
        grid: {
          top: '15%',
          left: '3%',
          right: '4%',
          bottom: '0%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            axisLine: {
              lineStyle: {
                color: '#CCC'
              }
            },
            axisTick: {
              show: false
            },
            data: this.capacityData.xData
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              show: false,
              lineStyle: {
                color: '#CCC'
              }
            },
            axisTick: {
              show: false
            },
            splitLine:{
              show: true,
              lineStyle: {
                type: 'dashed',
                color: '#666'
              }
            }
          }
        ],
        series: [
          {
            name: '占用',       
            type: 'bar',  
            barGap: '-100%',         // 左移100%，stack不再与上面两个在一列
            barWidth: 15,
            stack: 'pue',
            data: this.capacityData.yUsed
          },
          {
            name: '剩余',       
            type: 'bar',  
            barGap: '-100%',         // 左移100%，stack不再与上面两个在一列
            barWidth: 15,
            stack: 'pue',
            data: this.capacityData.yFree
          }
        ]
      });
    },
    changeAddress() {}
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
.selectClass {
  margin: 8px;
}
.selectClass .el-select{
  width: 80%;
}
/deep/.selectClass .el-input__inner{
  background-color: transparent;
  border: 1px solid #409EFF;
  color:white;
  text-align: center;
}
</style>