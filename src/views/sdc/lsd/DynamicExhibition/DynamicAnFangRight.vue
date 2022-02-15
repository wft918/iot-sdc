<template>
    <div style="width: 100%;height: 100%;">
      <div style="width:100%;height:40px;border-bottom: 1px solid #103665;border-top: 1px solid #103665;display: flex;align-items: center;">
        <div class="titleStyle"></div>
        <div class="fontStyle">实时监控</div>
        <div class="endStyle" style="margin-left: 61%;"></div>
        <div class="endStyle" style="margin-left: 3%;"></div>
      </div>
      <div style="width:100%;height:30%;">
        <div style="width:100%;height:100%;display: flex;align-items: center;margin-top: -11px;justify-content: center;">
         
      <div style="width:100%;height:100%;margin-top: 95px;">
        <el-select placeholder="选择通道" v-model="inIpcId" @change="playVideo" class="selectChannel" size="mini">
                    <el-option
                      v-for="item in inIPCMap"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
          <LivePlayer :videoUrl="videoUrl" fluent autoplay live stretch></LivePlayer>
            
      </div>
        </div>
      </div>
      <div style="width:100%;height:40px;border-bottom: 1px solid #103665;border-top: 1px solid #103665;display: flex;align-items: center;">
        <div class="titleStyle"></div>
        <div class="fontStyle">告警处理统计</div>
        <div class="endStyle" style="margin-left: 53%;"></div>
        <div class="endStyle" style="margin-left: 3%;"></div>
      </div>
      <div style="width:100%;height:18%;display: flex;">
        <DynamicAnFangRight01></DynamicAnFangRight01>
      </div>
      <div style="width:100%;height:40px;border-bottom: 1px solid #103665;border-top: 1px solid #103665;display: flex;align-items: center;">
        <div class="titleStyle"></div>
        <div class="fontStyle">安防事件数量趋势统计</div>
        <div class="endStyle" style="margin-left: 37%;"></div>
        <div class="endStyle" style="margin-left: 3%;"></div>
      </div>
      <div style="width:100%;height:calc(40% - 160px);display: flex;">
        <DynamicAnFangRight03></DynamicAnFangRight03>
      </div>
      <div style="width:100%;height:40px;border-bottom: 1px solid #103665;border-top: 1px solid #103665;display: flex;align-items: center;">
        <div class="titleStyle"></div>
        <div class="fontStyle">告警处理统计</div>
        <div class="endStyle" style="margin-left: 53%;"></div>
        <div class="endStyle" style="margin-left: 3%;"></div>
      </div>
      <div style="width:100%;height:12%;display: flex;">
        <DynamicAnFangRight02></DynamicAnFangRight02>
      </div>
    </div>
    
</template>

<script>
import DynamicAnFangRight03 from "./DynamicAnFangRight03";
import DynamicAnFangRight01 from "./DynamicAnFangRight01";
import DynamicAnFangRight02 from "./DynamicAnFangRight02";
import echarts from 'echarts/lib/echarts';
import LivePlayer from "@liveqing/liveplayer";
import $ from "jquery";


export default {
  name: "DynamicExhibition",
  components: {
    DynamicAnFangRight01,
    DynamicAnFangRight02,
    DynamicAnFangRight03,
    LivePlayer
  },
  data() {
    return {
      btn1: "el-button-2",
      btn2: "el-button-1",
      btn3: "el-button-1",
      videoUrl: null,
      muted: true,
      aspect: "",
      url : this.$dictUtils.getDictValue("vedio_param", "url_ip", ""),
      port: this.$dictUtils.getDictValue("vedio_param", "port", ""),
      bLoading: false,
      debug: false,
      channels: [],
      isShow: false,
      inIpcId: null,
      inIPCMap: [],
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
          this.play(this.inIPCMap[0])
        }
      })
    },
    // 选择通道
    playVideo(channel) {
      for (let index = 0; index < this.inIPCMap.length; index++) {
        
        const el = this.inIPCMap[index];
        console.log(el);
        if(el.value === channel) {
          this.play(el)
        }
      }
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
        case "3":
          this.btn3 = "el-button-2";
          this.btn1 = this.btn2 = "el-button-1";
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

.selectChannel {
  position: absolute;
  z-index: 1000;
  // width: 150px;
  // height: 20px;
  right: 10px;
  top: 45px;
  text-align: center;
  // font-size: 24px;
  // background: fade(#eee, 0%);
  background: rgba(128, 128, 128, 0.5);
  color: #fff;
  // border-radius: 16px;
  overflow: hidden;
  border: none;

  // &:hover {
  //   background: rgba(128, 128, 128, 0.5);
  //   color: #fff;
  // }
}
</style>