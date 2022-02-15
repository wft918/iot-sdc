<template>
    <div style="width: 100%;height: 100%;">
      <div style="width:100%;height:40px;border-bottom: 1px solid #103665;border-top: 1px solid #103665;display: flex;align-items: center;">
        <div class="titleStyle"></div>
        <div class="fontStyle">机房告警数量排行</div>
        <div class="endStyle" style="margin-left: 45%;"></div>
        <div class="endStyle" style="margin-left: 3%;"></div>
      </div>
      <div style="width:100%;height:20%;">
        <div style="width:100%;height:100%;">
        <div style="width:100%;height:15%;">
          <div style="width:100%;height:40px;display:flex;justify-content:flex-end;align-items:center">
            <el-button-group class="button-group">
              <el-button
                label="1"
                @click="changeRoomRank('1')"
                size="mini"
                :class="btn1"
                style="margin-right:8px;"
              >
                近一周
              </el-button>
              <el-button
                label="2"
                @click="changeRoomRank('2')"
                size="mini"
                :class="btn2"
              >
                近一月
              </el-button>
            </el-button-group>
          </div>
        </div>
        <div style="width:100%;height:85%;">
          <DynamicPowerRight01 :roomCountRank="roomCountRank" :siteId="siteId"></DynamicPowerRight01>
        </div>
      </div>
      </div>
      <div style="width:100%;height:40px;border-bottom: 1px solid #103665;border-top: 1px solid #103665;display: flex;align-items: center;">
        <div class="titleStyle"></div>
        <div class="fontStyle">机房告警数量趋势</div>
        <div class="endStyle" style="margin-left: 46%;"></div>
        <div class="endStyle" style="margin-left: 3%;"></div>
      </div>
      <div style="width:100%;height:25%;">
        <div style="width:100%;height:100%;">
        <div style="width:100%;height:15%;">
          <div style="width:100%;height:40px;display:flex;justify-content:space-around;align-items:center">
            <div style="width:50%;margin-top:5px;" class="room-select">
              <el-select v-model="siteIdOne" placeholder="请选择" style="width:70%;margin:5px;" @change="roomOneChange">
                <el-option
                  v-for="item in roomList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
            <el-button-group style="width:50%;display:flex;justify-content:flex-end;margin-right:16px;" >
              <el-button
                label="1"
                @click="changeCountTrend('1')"
                size="mini"
                :class="btn3"
                style="margin-right:8px;"
              >
                近一周
              </el-button>
              <el-button
                label="2"
                @click="changeCountTrend('2')"
                size="mini"
                :class="btn4"
              >
                近一月
              </el-button>
            </el-button-group>
          </div>
        </div>
        <div style="width:100%;height:85%;">
          <DynamicPowerRight02 :roomCountTrend="roomCountTrend" :siteId="siteId" :siteIdOne="siteIdOne" :siteNameOne="siteNameOne"></DynamicPowerRight02>
        </div>
      </div>
      </div>
      <div style="width:100%;height:40px;border-bottom: 1px solid #103665;border-top: 1px solid #103665;display: flex;align-items: center;">
        <div class="titleStyle"></div>
        <div class="fontStyle">告警设备数量排行</div>
        <div class="endStyle" style="margin-left: 46%;"></div>
        <div class="endStyle" style="margin-left: 3%;"></div>
      </div>
      <div style="width:100%;height:20%;">
        <div style="width:100%;height:100%;">
        <div style="width:100%;height:15%;">
          <div style="width:100%;height:40px;display:flex;justify-content:flex-end;align-items:center">
            <el-button-group class="button-group">
              <el-button
                label="1"
                @click="changeAlarmRank('1')"
                size="mini"
                :class="btn5"
                style="margin-right:8px;"
              >
                近一周
              </el-button>
              <el-button
                label="2"
                @click="changeAlarmRank('2')"
                size="mini"
                :class="btn6"
              >
                近一月
              </el-button>
            </el-button-group>
          </div>
        </div>
        <div style="width:100%;height:85%;">
          <DynamicPowerRight03 :alarmCountRank="alarmCountRank" :siteId="siteId"></DynamicPowerRight03>
        </div>
      </div>
      </div>
      <div style="width:100%;height:40px;border-bottom: 1px solid #103665;border-top: 1px solid #103665;display: flex;align-items: center;">
        <div class="titleStyle"></div>
        <div class="fontStyle">告警设备时长排行(分钟)</div>
        <div class="endStyle" style="margin-left: 34%;"></div>
        <div class="endStyle" style="margin-left: 3%;"></div>
      </div>
      <div style="width:100%;height:calc(35% - 160px);display: flex;">
        <div style="width:100%;height:100%;">
          <div style="width:100%;height:15%;">
            <div style="width:100%;height:40px;display:flex;justify-content:flex-end;align-items:center">
              <el-button-group class="button-group">
                <el-button
                  label="1"
                  @click="changeDurationRank('1')"
                  size="mini"
                  :class="btn7"
                  style="margin-right:8px;"
                >
                  近一周
                </el-button>
                <el-button
                  label="2"
                  @click="changeDurationRank('2')"
                  size="mini"
                  :class="btn8"
                >
                  近一月
                </el-button>
              </el-button-group>
            </div>
          </div>
          <div style="width:100%;height:85%;">
            <DynamicPowerRight04 :alarmDurationRank="alarmDurationRank" :siteId="siteId"></DynamicPowerRight04>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import DynamicCarRight01 from "./DynamicCarRight01";
import right01 from "./right01";
import DynamicPowerRight04 from "./DynamicPowerRight04";
import DynamicPowerRight01 from "./DynamicPowerRight01";
import DynamicPowerRight02 from "./DynamicPowerRight02";
import DynamicPowerRight03 from "./DynamicPowerRight03";
import echarts from 'echarts/lib/echarts'
export default {
  name: "DynamicExhibition",
  components: {
    right01,
    DynamicPowerRight04,
    DynamicCarRight01,
    DynamicPowerRight01,
    DynamicPowerRight02,
    DynamicPowerRight03
  },
  props:['siteId', 'siteData'],
  data() {
    return {
      btn1: "el-button-2",
      btn2: "el-button-1",
      btn3: "el-button-2",
      btn4: "el-button-1",
      btn5: "el-button-2",
      btn6: "el-button-1",
      btn7: "el-button-2",
      btn8: "el-button-1",
      roomCountRank: '1',
      roomCountTrend: '1',
      alarmCountRank: '1',
      alarmDurationRank: '1',
      parkData: {},
      roomList: [],
      siteIdOne: '',
      siteNameOne: ''
    }
  },
  mounted(){
    this.getParkData()
    this.getRoomList(this.parkData)
    if (this.roomList.length > 0) {
      this.siteIdOne = this.roomList[0].id
      this.siteNameOne = this.roomList[0].name
    }
  },
  watch: {
    siteId(newVal,oldVal) {
      if (newVal) {
        this.roomList = []
        this.getParkData()
        this.getRoomList(this.parkData)
        if (this.roomList.length > 0) {
          this.siteIdOne = this.roomList[0].id
          this.siteNameOne = this.roomList[0].name
        }
      }
    }
  },
  methods:{
    changeRoomRank(val) {
      this.roomCountRank = val
      switch (val) {
        case "1":
          // 请求近一周数据
          this.btn1 = "el-button-2";
          this.btn2 = "el-button-1";
          break;
        case "2":
          // 请求近一月
          this.btn1 = "el-button-1";
          this.btn2 = "el-button-2";
          break;
      }
    },
    changeCountTrend(val) {
      this.roomCountTrend = val
      switch (val) {
        case "1":
          // 请求近一周数据
          this.btn3 = "el-button-2";
          this.btn4 = "el-button-1";
          break;
        case "2":
          // 请求近一月
          this.btn3 = "el-button-1";
          this.btn4 = "el-button-2";
          break;
      }
    },
    changeAlarmRank(val) {
      this.alarmCountRank = val
      switch (val) {
        case "1":
          // 请求近一周数据
          this.btn5 = "el-button-2";
          this.btn6 = "el-button-1";
          break;
        case "2":
          // 请求近一月
          this.btn5 = "el-button-1";
          this.btn6 = "el-button-2";
          break;
      }
    },
    changeDurationRank(val) {
      this.alarmDurationRank = val
      switch (val) {
        case "1":
          // 请求近一周数据
          this.btn7 = "el-button-2";
          this.btn8 = "el-button-1";
          break;
        case "2":
          // 请求近一月
          this.btn7 = "el-button-1";
          this.btn8 = "el-button-2";
          break;
      }
    },
    getParkData() {
      this.siteData.forEach(item => {
        if (item.id === this.siteId) {
          this.parkData = item
        }
      })
    },
    getRoomList(data) {
      if (data.type === 'R00') {
        this.roomList.push(data)
      } else {
        if (data.children && data.children.length > 0) {
          data.children.forEach(item => {
            this.getRoomList(item)
          })
        }
      }
    },
    roomOneChange(data) {
      this.roomList.forEach(item => {
        if (item.id === data) {
          this.siteNameOne = item.name
        }
      })
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
/deep/.room-select .el-input__inner{
  background-color: transparent;
  border: 1px solid #409EFF;
  color:white;
  text-align: center;
}
</style>