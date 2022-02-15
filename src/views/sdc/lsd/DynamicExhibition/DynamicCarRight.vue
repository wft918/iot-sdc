<template>
    <div style="width: 100%;height: 100%;">
      <div style="width:100%;height:40px;border-bottom: 1px solid #103665;border-top: 1px solid #103665;display: flex;align-items: center;">
        <div class="titleStyle"></div>
        <div class="fontStyle">实时进场信息</div>
        <div class="endStyle" style="margin-left: 53%;"></div>
        <div class="endStyle" style="margin-left: 3%;"></div>
      </div>
      <div style="width:100%;height:30%;">
        <div style="width: 100%;height: 60px;display: flex;align-items: center;justify-content: flex-end;padding-right: 10px;">
          <el-button-group class="button-group">
            <el-button
              label="1"
              @click="changeData('1')"
              size="mini"
              :class="btn1"
            >
              进场
            </el-button>
            <el-button
              label="2"
              @click="changeData('2')"
              size="mini"
              :class="btn2"
            >
              出场
            </el-button>
          </el-button-group>
        </div>
        <div style="width:100%;height:calc(100% - 60px);display: flex;align-items: center;margin-top: -11px;">
          <div style="width:42%;height:100%">
            <div style="width:100%;height:41%;display: flex;align-items: flex-end;justify-content: center;">
              <img src="../../../../../public/img/zhfx/car1.png" style="width: 123px;">
              <div style="width:100px;height:44px;position: absolute;margin-left: 86px;">
                <div style="width:100%;height:50%;color: #f9fafa;font-weight: bold;font-size: 9px;">车牌号</div>
                <div style="width:100%;height:50%;color: #00b0ff;font-weight: bold;font-size: 16px;">京H0455</div>
              </div>
            </div>
            <div style="width:100%;height:50%;display: flex;align-items: center;justify-content: center;">
              <img src="../../../../../public/img/zhfx/car2.png" style="width: 123px;">
              <div style="width:100px;height:44px;position: absolute;margin-left: 86px;">
                <div style="width:100%;height:50%;color: #f9fafa;font-weight: bold;font-size: 9px;">位置</div>
                <div style="width:100%;height:50%;color: #ffc600;font-weight: bold;font-size: 16px;">1号门</div>
              </div>
            </div>
          </div>
          <div style="width:58%;height:100%;display: flex;align-items: center;justify-content: center;">
            <!-- <img src="../../../../../public/img/zhfx/temp.jpg" style="width: 211px;"> -->
            <div style="width:100%;height:100%;margin-top: 95px;">
              <LivePlayer :videoUrl="videoUrl" fluent autoplay live stretch></LivePlayer>
            </div>
          </div>
        </div>
      </div>
      <div style="width:100%;height:40px;border-bottom: 1px solid #103665;border-top: 1px solid #103665;display: flex;align-items: center;">
        <div class="titleStyle"></div>
        <div class="fontStyle">车辆平均停留时长统计</div>
        <div class="endStyle" style="margin-left: 37%;"></div>
        <div class="endStyle" style="margin-left: 3%;"></div>
      </div>
      <div style="width:100%;height:30%;display: flex;">
        <DynamicCarRight01></DynamicCarRight01>
      </div>
      <div style="width:100%;height:40px;border-bottom: 1px solid #103665;border-top: 1px solid #103665;display: flex;align-items: center;">
        <div class="titleStyle"></div>
        <div class="fontStyle">车辆类别统计</div>
        <div class="endStyle" style="margin-left: 53%;"></div>
        <div class="endStyle" style="margin-left: 3%;"></div>
      </div>
      <div style="width:100%;height:calc(40% - 120px);display: flex;">
        <div style="width:40%;height:100%;">
          <DynamicCarRight02></DynamicCarRight02>
        </div>
        <div style="width:calc(60% - 16px);height:100%;margin-left:16px">
          <div style="width:100%;height:15%;"></div>
          <div style="width:100%;height:25%;display: flex;align-items: center;">
            <img src="../../../../../public/img/zhfx/car3.png" style="width: 50px;">
            <div style="color: #ffffff;font-weight: 400;font-size: 17px;">内部车辆</div>
            <div style="color: #ffffff;font-weight: 700;font-size: 28px;margin-left: 20px;">50</div>
          </div>
          <div style="width:100%;height:25%;display: flex;align-items: center;">
            <img src="../../../../../public/img/zhfx/car4.png" style="width: 50px;">
            <div style="color: #ffffff;font-weight: 400;font-size: 17px;">包月车</div>
            <div style="color: #ffffff;font-weight: 700;font-size: 28px;margin-left: 20px;">100</div>
          </div>
          <div style="width:100%;height:25%;display: flex;align-items: center;">
            <img src="../../../../../public/img/zhfx/car5.png" style="width: 50px;">
            <div style="color: #ffffff;font-weight: 400;font-size: 17px;">临停车</div>
            <div style="color: #ffffff;font-weight: 700;font-size: 28px;margin-left: 20px;">50</div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import DynamicCarRight01 from "./DynamicCarRight01";
import right01 from "./right01";
import DynamicCarRight02 from "./DynamicCarRight02";
import echarts from 'echarts/lib/echarts'
import LivePlayer from '@liveqing/liveplayer'
import $ from "jquery";
export default {
  name: "DynamicExhibition",
  components: {
    right01,
    DynamicCarRight02,
    DynamicCarRight01,
    LivePlayer,
  },
  data() {
    return {
      btn1: "el-button-2",
      btn2: "el-button-1",
      videoUrl: null,
      inIpcId: null,
      inIPCMap: [],
      url : this.$dictUtils.getDictValue("vedio_param", "url_ip", ""),
      port: this.$dictUtils.getDictValue("vedio_param", "port", ""),
    }
  },
  created() {
    this.getChannels()
  },
  mounted(){
  },
  methods:{
    // 获取数据列表
    getChannels () {
      this.$http({
        url: '/site-sdc/sdcdevice/page',
        method: 'get',
        params: {
          'videoType': '1'
        }
      }).then(({data}) => {
        if (data && data.code == 0) {
          this.inIPCMap = []
          console.log(data.data.records,'data.data.records');
          for (let index = 0; index < data.data.records.length; index++) {
            const element = data.data.records[index];
            this.inIPCMap.push({
              label: element.name,
              value: element.id,
              devicechannel: element.devicechannel,
              channel: element.channel,
            })
          }
          this.inIpcId = this.inIPCMap[0].value
          this.play(data.data.records[0])
        }
      })
    },
    play(channelInfo) {
      console.log(channelInfo,'channelInfo');
      $.get('http://' + this.url + ':' + this.port + '/api/v1/stream/start', {
            serial: channelInfo.devicechannel,
            code: channelInfo.channel,
          }).then(stream => {
            this.videoUrl = stream.WS_FLV;
          })
    },
    changeData(val) {
      switch (val) {
        case "1":
          this.btn1 = "el-button-2";
          this.btn2 = this.btn3 = "el-button-1";
          break;
        case "2":
          this.btn2 = "el-button-2";
          this.btn1 = this.btn3 = "el-button-1";
          break;
      }
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