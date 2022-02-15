<template>
  <basic-container>
    <div style="width: 100%;height: 880px;">
      <div class="left" style="height:91%;width:79%;float:left;">
        <div class="row hidden-xs text-center" style="margin: 10px 0;">
        <el-button-group class="player-btn-group">
          <el-button
            type="primary"
            plain
            size="medium"
            v-for="list in playerBtnGroup"
            :key="list.num"
            @click.prevent="setPlayerLength(list.num)"
            :class="{ active: playerLength == list.num }"
            >{{ list.name }}</el-button
          >
          <el-button
            type="button"
            id="full-btn-medium"
            size="medium"
            @click.prevent="fullscreena"
            title="全屏显示"
            ><i class="fa fa-arrows-alt"></i
          ></el-button>
        </el-button-group>
        </div>
        <div class="row visible-xs text-center" style="margin: 10px 0">
          <el-button-group class="player-btn-group">
            <el-button
              type="primary"
              size="mini"
              v-for="list in playerBtnGroup"
              :key="list.num"
              @click.prevent="setPlayerLength(list.num)"
              :class="{ active: playerLength == list.num }"
              >{{ list.name }}</el-button
            >
            <el-button
              type="button"
              id="full-btn-mini"
              size="mini"
              @click.prevent="fullscreena"
              title="全屏显示"
              ><i class="fa fa-arrows-alt"></i
            ></el-button>
          </el-button-group>
        </div>
        <div class="view-list row" style="width: 100%;height:87%">
          <div class="video-show col-xs-12 col-sm-12 col-md-10 col-lg-8" style="width: 100%;height:100%;margin-left: 1%;">
            <div style="width:100%;height:100%;background:#000">
              <div 
                :id="active == index?'videoPlay':''" 
                @click="Liveplay(index)" 
                class="no-margin no-padding video padding-none" 
                v-for="(player,index) in players" 
                :key="index" 
                @mousemove="resetCloseTimer(player)" 
                @touchstart="resetCloseTimer(player)"
                :class="{'col-sm-12': playerLength == 1,'col-sm-6': playerLength == 4,'col-sm-4': playerLength == 9,'col-sm-3': playerLength == 16}">
                <!-- 播放器方式 -->
                <LivePlayer :autoplay="true" :v-loading="player.bLoading" :video-url="player.url" :live="true" :muted="true"></LivePlayer>
                <div class="video-close" v-show="player.url && player.bCloseShow" v-on:click="closeVideo(index)">关闭</div>
                <div class="device-name" v-show="player.url && player.bCloseShow">{{deviceNameList[index].name}}</div>
                <!-- iframe方式，多屏时cpu占用高 -->
                  <!-- <div ref="videoAreaRef" class="video-window">
                    <div style="color:#fff;margin:auto;">无信号</div>
                  </div>
                <div class="video-close" v-show="player.url && player.bCloseShow" v-on:click="closeVideo(index)">关闭</div>
                <div class="device-name" v-show="player.url && player.bCloseShow">{{deviceNameList[index].name}}</div> -->

                <!-- iframe本身无点击事件，添加透明层触发切换分屏事件 -->
                <!-- <div class="video-mask" @click="Liveplay(index)"></div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right" style="height:91%;width:20%;float:right;margin-right:0.3%;margin-top:3%;">
          <!-- 云台操作 -->
        <div class="ptz-block">
          <div class="ptz-cell ptz-up" @mousedown.prevent="ptzControl('up', $event)" @mouseup="ptzStop('stop')" title="上">
            <img src="@/assets/img/up.png" alt="">
          </div>

          <div class="ptz-cell ptz-left" @mousedown.prevent="ptzControl('left', $event)" @mouseup="ptzStop('stop')" title="左">
            <img src="@/assets/img/left.png" alt="">
          </div>
          <div class="ptz-center" title="云台控制">
            <i class="fa fa-arrows"></i>
          </div>
          <div class="ptz-cell ptz-right" @mousedown.prevent="ptzControl('right', $event)" @mouseup="ptzStop('stop')" title="右">
            <img src="@/assets/img/right.png" alt="">
          </div>

          <div class="ptz-cell ptz-down" @mousedown.prevent="ptzControl('down', $event)" @mouseup="ptzStop('stop')" title="下">
            <img src="@/assets/img/down.png" alt="">
          </div>

          <div class="ptz-cell ptz-plus" @mousedown.prevent="ptzControl('zoomin', $event)" @mouseup="ptzStop('stop')" title="放">
            <i class="fa fa-plus-circle"></i>
          </div>
          <div class="ptz-cell ptz-minus" @mousedown.prevent="ptzControl('zoomout', $event)" @mouseup="ptzStop('stop')" title="缩">
            <i class="fa fa-minus-circle"></i>
          </div>
          <div>
            <div class="speed-slider">
              <el-slider v-model="controlSpeed" :min="1" :max="255"></el-slider>
            </div>
          </div>
        </div>
        <!-- 设备列表 -->
        <div style="width: 100%;height: 490px;margin: 20px 0 40px 0;border-bottom:1px solid #D6E8FA;">
          <div class="titleClass" style="width: 100%;height: 35px;background-color: #ECF5FF;border: none;color: #3899F5;padding-left: 12px;padding-top: 6px;">
            <label class="leftTitle" for="">设备列表</label>
          </div>
          <div style="height:calc(100% - 35px);">
            <el-card shadow="never" style="overflow: auto;width: 324px;height: 100%">
              <el-tree :indent="2" style="min-width: 100%;overflow: auto;display: inline-block;margin-left:-30px;" node-key="id" default-expand-all @node-click='handleNodeClick' :accordion='true' :data="treedata" :highlight-current='true' :props="defaultProps" :empty-text="devEmptyText">
              </el-tree>
            </el-card>
            
          </div>
        </div>
      </div>
    </div>
  </basic-container>
</template>

<script>
import Vue from 'vue'
import LivePlayer from "@liveqing/liveplayer";
// import _ from 'lodash'
import { mapState } from "vuex";
import "@/assets/scss/layout.less"
import "font-awesome/css/font-awesome.css"
import "bootstrap/dist/css/bootstrap.css"
// import "admin-lte/dist/css/AdminLTE.css"
// import "admin-lte/dist/css/skins/_all-skins.css"
import 'vue-resize/dist/vue-resize.css'
import "bootstrap/dist/js/bootstrap.js"
import "admin-lte/dist/js/adminlte.js"
import "jquery-ui/ui/widgets/draggable"

import ElementUI from "element-ui"
Vue.use(ElementUI);

// import VueClipboards from "vue-clipboards"
// Vue.use(VueClipboards);

import VueResize from 'vue-resize'
Vue.use(VueResize);
Vue.prototype.isMobile = () => {
  return videojs.browser.IS_IOS || videojs.browser.IS_ANDROID;
}
Vue.prototype.isIE = () => {
  return !!videojs.browser.IE_VERSION;
}
import $ from "jquery"
import "@penggy/jquery.nicescroll"
$.ajaxSetup({ cache: false });

export default {
  components: {
    LivePlayer
  },
  data() {
    return {
      players: [],
      playerLength: 4,
      // channelListDlgTitle: "",
      protocol: "",
			url : this.$dictUtils.getDictValue("vedio_param", "url_ip", ""),
      port: this.$dictUtils.getDictValue("vedio_param", "port", ""),
      ws_port: this.$dictUtils.getDictValue("vedio_param", "ws_port", ""),
      // playPath: [process.env.VUE_APP_PLAYER_URL],
      // cameraIpcHistorieList:[],
      active:0,
      index:0,

      bLoading: false,
      // title: "",
      timer: 0,
      serialList: [
        {
          serial:''
        },
        {
          serial:''
        },
        {
          serial:''
        },
        {
          serial:''
        },
        {
          serial:''
        },
        {
          serial:''
        },
        {
          serial:''
        },
        {
          serial:''
        },
        {
          serial:''
        },
        {
          serial:''
        },
        {
          serial:''
        },
        {
          serial:''
        },
        {
          serial:''
        },
        {
          serial:''
        },
        {
          serial:''
        },
        {
          serial:''
        },
      ],
      codeList: [
        {
          code:''
        },
        {
          code:''
        },
        {
          code:''
        },
        {
          code:''
        },
        {
          code:''
        },
        {
          code:''
        },
        {
          code:''
        },
        {
          code:''
        },
        {
          code:''
        },
        {
          code:''
        },
        {
          code:''
        },
        {
          code:''
        },
        {
          code:''
        },
        {
          code:''
        },
        {
          code:''
        },
        {
          code:''
        },
      ],
      appearanceTypeList: [
        {
          appearanceType:''
        },
        {
          appearanceType:''
        },
        {
          appearanceType:''
        },
        {
          appearanceType:''
        },
        {
          appearanceType:''
        },
        {
          appearanceType:''
        },
        {
          appearanceType:''
        },
        {
          appearanceType:''
        },
        {
          appearanceType:''
        },
        {
          appearanceType:''
        },
        {
          appearanceType:''
        },
        {
          appearanceType:''
        },
        {
          appearanceType:''
        },
        {
          appearanceType:''
        },
        {
          appearanceType:''
        },
        {
          appearanceType:''
        },
      ],
      videoSourceTypeList: [
        {
          videoSourceType: ''
        },
        {
          videoSourceType: ''
        },
        {
          videoSourceType: ''
        },
        {
          videoSourceType: ''
        },
        {
          videoSourceType: ''
        },
        {
          videoSourceType: ''
        },
        {
          videoSourceType: ''
        },
        {
          videoSourceType: ''
        },
        {
          videoSourceType: ''
        },
        {
          videoSourceType: ''
        },
        {
          videoSourceType: ''
        },
        {
          videoSourceType: ''
        },
        {
          videoSourceType: ''
        },
        {
          videoSourceType: ''
        },
        {
          videoSourceType: ''
        },
        {
          videoSourceType: ''
        }
      ],
      deviceNameList: [
        {
          name:''
        },
        {
          name:''
        },
        {
          name:''
        },
        {
          name:''
        },
        {
          name:''
        },
        {
          name:''
        },
        {
          name:''
        },
        {
          name:''
        },
        {
          name:''
        },
        {
          name:''
        },
        {
          name:''
        },
        {
          name:''
        },
        {
          name:''
        },
        {
          name:''
        },
        {
          name:''
        },
        {
          name:''
        }
      ],
      // channel: "1",
      // type: "stream",
      // starttime: "",
      // endtime: "",
      // streamid: "",
      // shareUrl: "",
      // snapUrl: "",
      // ptz: true,
      // share: true,
      // fluent: true,
      // stretch: false,
      // autoplay: true,
      // controls: true,
      // aspect: "",
      // debug: false,
      // token: "",
      // muted: true,
      // talk: false,
      // otherParams: "",
      // sourceVideoCodecName: "",
      // sourceAudioCodecName: "",
      // recorder: null,
      // ws: null,
      // nice: null,
      // activeName: 'first',
      // background: '',
      // color: '',
      // routeIndex: '',
      // showList: true,
      // showSet: false,
      // presetList: [],
      // preset: '',
      // speed: '',
      // stay: '',
      // groupList: [],
      // ids: '',

      treedata:[],
      devEmptyText: '加载中',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // nodeObject:'',
      clic:'',
      // expandedkeys:[],//Tree默认展开数组
      controlSpeed: 30,
    };
  },
  computed: {
    playerBtnGroup() {
      var list = [
        {
          num: 1,
          name: "单屏",
        },
        {
          num: 4,
          name: "四分屏",
        },
        {
          num: 9,
          name: "九分屏",
        },
      ];
      if (!this.isIE()) {
        list.push({
          num: 16,
          name: "十六分屏",
        });
      }
      return list;
    },
    // ...mapState(["serverInfo", "userInfo"]),
  },
  async mounted() {
    this.setPlayerLength(this.playerLength);
  },
  activated() {
    this.clic = 4;//分屏按钮默认展示四分屏
    this.getChannels()
  },
  created() {
    this.getChannels()
    // this.aspect = this.getQueryString("aspect","").replace("x", ":");
    // this.autoplay = this.getQueryString("autoplay", "yes") == "yes";
    // this.controls = this.getQueryString("controls", "yes") == "yes";
    // this.ptz = this.getQueryString("ptz", "yes") == "yes";
    // this.share = this.getQueryString("share", "yes") == "yes";
    // this.fluent = this.getQueryString("fluent", "yes") == "yes";
    // this.stretch = this.getQueryString("stretch", "no") == "yes";
    // this.type = this.getQueryString("type", "stream");
    // this.starttime = this.getQueryString("starttime", "");
    // this.endtime = this.getQueryString("endtime", "");
    // this.serial = this.getQueryString("serial", "");
    // this.code = this.getQueryString("code", "");
    // this.channel = this.getQueryString("channel", "1");
    // this.protocol = this.getQueryString("protocol", "");
    // this.debug = this.getQueryString("debug") == "yes";
    // this.token = this.getQueryString("token", "");
    // this.muted = this.getQueryString("muted", "yes") == "yes";
    // this.talk = this.getQueryString("talk", "no") == "yes";
    // this.otherParams = this.getOtherParams(["aspect", "autoplay", "controls", "ptz", "share", "fluent", "stretch", "type", "starttime", "endtime", "serial", "code", "channel", "protocol", "muted", "talk", "debug"])
    // this.shareUrl = location.href;
  },
  methods: {

    getQueryString(name, defVal = "") {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) {
        return unescape(r[2]);
      }
      return defVal;
    },
    clearVideos() {
      for (var idx in this.players) {
        this.closeVideo(idx);
      }
    },
    setPlayerLength(playerNum,i) {
      this.clic = i
      if (playerNum == this.players.length) {
        return
      }
      this.clearVideos();
      this.players = []
      this.index = 0
      this.active = this.index
      this.playerLength = playerNum
      for (let index = 0; index < this.playerLength; index++) {
        this.players.push({
          url: "",
          bLoading: false,
          timer: 0,
          bCloseShow: false,
          closeTimer: 0
        })
      }
    },
    getChannels(){
      this.$http({
        url:`/site-sdc/sdcdevice/treeByTopType`,
        method:'get',
        params: {
          topTypeCode: 'ipc'
        }
      }).then((res)=>{
        if(res.data.msg == '操作成功'){
          this.treedata = res.data.data
          // this.expandedkeys.push(res.data.data[0].id)
          if (this.treedata.length === 0) {
            this.devEmptyText = '暂无数据'
          }
        } else {
          this.devEmptyText = '加载数据失败'
        }
      })
    },
    // 获取
    // 点击树形控件节点触发
    handleNodeClick(a,b,c){
      if (a.type === 'ipc') {
        this.$http({
          url:`/site-sdc/sdcdevice/page`,
          method:'get',
          params: {
            id: a.id
          }
        }).then(res => {
          if (res.data.code === 0) {
            let deviceInfo = res.data.data.records[0]
            this.serialList[this.index].serial = deviceInfo.devicechannel // 设备编号
            this.codeList[this.index].code = deviceInfo.channel // 通道编号
            this.appearanceTypeList[this.index].appearanceType = deviceInfo.expand.appearanceType
            this.videoSourceTypeList[this.index].videoSourceType = deviceInfo.videoSourceType
            this.deviceNameList[this.index].name = deviceInfo.name
            this.play(this.index,deviceInfo)
          }
        })
      }
       
    },
    // 点击要播放的视频区域
    Liveplay(index){
      this.index = index
      this.active = index
    },
    play(index, channel) {
      var i = 0;
      var player = null;
      for (var _player of this.players) {
        if (index == i) {
          player = _player;
          break;
        }
        i++
      }
      if (!player) {
        this.$message({
          type: "error",
          message: "当前播放窗口已被占满！"
        });
        return;
      }
      player.bLoading = true;
      if (this.videoSourceTypeList[index].videoSourceType === '1') {
        // 国标摄像头
        $.get('http://' + this.url + ':' + this.port + '/api/play/start/' + channel.devicechannel + '/' + channel.channel).then(stream => {
          console.log(stream);
          this.players[index].url = stream.data.fmp4
          this.resetCloseTimer(player);
          // iframe方式，多屏时CPU占用很高
          // this.$nextTick(() => {
          //   this.players[index].url = 'ws://' + this.url +':' + this.port + channel.devicechannel + '_' + channel.channel + '.flv'
          //   let iframelink = '<iframe src="' + 'http://'+ this.url + ':'  + this.port + '/#/play/wasm/' + encodeURIComponent('ws://' + this.url + ':' + this.ws_port + '/rtp/' + channel.devicechannel + '_' + channel.channel + '.flv') + '" scrolling="no" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" width="100%" height="100%" frameborder="0" marginheight="0"></iframe>'
          //   this.$refs.videoAreaRef[index].innerHTML = iframelink
          // })
          // this.resetCloseTimer(player);
        }).fail(() => {
          player.bLoading = false;
          this.$message.error('获取视频出错，请重试')
        });
      } else {
        // 拉流摄像头
        this.players[index].url = 'http://' + this.url +':' + this.ws_port + '/' + channel.streamApp + '/' + channel.streamId + '.live.mp4'
        // iframe方式，多屏时CPU占用很高
        // let iframelink = '<iframe src="' + 'http://'+ this.url + ':'  + this.port + '/#/play/wasm/' + encodeURIComponent('ws://' + this.url + ':' + this.ws_port + '/' + channel.streamApp + '/' + channel.streamId + '.flv') + '" scrolling="no" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" width="100%" height="100%" frameborder="0"></iframe>'
        // this.$refs.videoAreaRef[index].innerHTML = iframelink
        player.bLoading = false;
        this.resetCloseTimer(player);
      }
      
    },
    fullscreena() {
      if (this.isMobile()) {
        this.$message({
          type: "error",
          message: "请在电脑浏览器上使用该功能"
        });
        return;
      }
      this.$fullscreen.enter(this.$el.querySelector(`.video-show > div`), {
        wrap: false
      });
    },
    // getOtherParams(without) {
    //   var url = location.search;
    //   var theRequest = "";
    //   if (url.indexOf("?") != -1) {
    //     var str = url.substr(1);
    //     var strs = str.split("&");
    //     for (var i = 0; i < strs.length; i++) {
    //       if (without.indexOf(strs[i].split("=")[0]) == -1) {
    //         if (theRequest == "") {
    //           theRequest = strs[i]
    //         } else {
    //           theRequest += "&" + strs[i]
    //         }
    //       }
    //     }
    //   }
    //   return theRequest;
    // },
    ptzControl(command, event) {
      // 云台控制
      if (this.codeList[this.index].code && this.serialList[this.index].serial) {
        if(this.appearanceTypeList[this.index].appearanceType != "1"){
          this.$message.warning("只有球机可使用云台控制，请确认摄像头类型！")
          return
        }
      $.ajax({
        url: 'http://' + this.url + ':' + this.port + '/api/ptz/control/' + this.serialList[this.index].serial + '/' + this.codeList[this.index].code + '?command=' + command + '&horizonSpeed=' + this.controlSpeed + '&verticalSpeed=' + this.controlSpeed + '&zoomSpeed=' + this.controlSpeed,
        type: 'post'
      })
      $(event.target).closest('.ptz-cell').addClass("active");
      } else {
        if (this.videoSourceTypeList[this.index].videoSourceType === '0') {
          this.$message.warning('此类摄像头不支持云台控制！')
          return
        }
        this.$message({
          type: 'error',
          message: "请先选择一个摄像头"
        })
      }
    },
    ptzStop(command) {
      if ($(this.$el).find(".ptz-cell.active").length > 0) {
        $.ajax({
          url: 'http://' + this.url + ':' + this.port + '/api/ptz/control/' + this.serialList[this.index].serial + '/' + this.codeList[this.index].code + '?command=' + command + '&horizonSpeed=' + this.controlSpeed + '&verticalSpeed=' + this.controlSpeed + '&zoomSpeed=' + this.controlSpeed,
          type: 'post'
        });
        $(this.$el).find(".ptz-cell.active").removeClass("active");
      }
    },
    ctrlStop() {
      this.ptzStop();
    },
    handleResize() {
      this.nice && this.nice.resize();
    },
    closeVideo: function (idx) {
      this.appearanceTypeList[idx].appearanceType = ''
      this.deviceNameList[idx].name = ''
      this.videoSourceTypeList[idx].videoSourceType = ''
      // this.$refs.videoAreaRef[idx].innerHTML = '<div style="color:#fff;margin:auto;">无信号</div>'
      var player = this.players[idx];
      if (!player) {
        return;
      }
      if (player.closeTimer) {
        clearTimeout(player.closeTimer);
        player.closeTimer = 0;
      }
      player.bCloseShow = false;
      player.bloading = false;
      player.url = "";
    },
    fullscreen() {
      if (this.isMobile()) {
        this.$message({
          type: "error",
          message: "请在电脑浏览器上使用该功能"
        });
        return;
      }
      this.$fullscreen.enter(this.$el.querySelector(`.video-show > .div`), {
        wrap: false
      });
    },
    videoError: function (e) {
    },
    resetCloseTimer(player) {
      player.bCloseShow = true;
      if (player.closeTimer) {
        clearTimeout(player.closeTimer)
      }
      player.closeTimer = setTimeout(() => {
        player.bCloseShow = false;
      }, 2000);
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.protocol = vm.getQueryString("protocol", "");
    });
  },
  beforeRouteUpdate(to, from, next) {
    this.clearVideos();
    this.protocol = this.getQueryString("protocol", "");
    next();
  },
  beforeDestroy() {
    this.clearVideos();
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = 0;
    }
    this.videoUrl = "";
    this.ctrlStop();
    $(document).off("mouseup touchend", this.ctrlStop);
  },
  beforeRouteLeave(to, from, next) {
    this.clearVideos();
    next();
  }
};
</script>

<style lang="less" scoped>
.view-list {
  .video-show {
    width: 80%;
    .video {
      border: 1px solid #fff;
    }
    .col-sm-12 {
      height: 100%;
      &:nth-child(1) {
        border: 0;
        padding-left: 0px;
        padding-right: 0px;
      }
    }

    .col-sm-6 {
      height: 50%;
      &:nth-child(1),
      &:nth-child(2) {
        border-top-color: transparent;
        padding-left: 0px;
        padding-right: 0px;
      }

      &:nth-child(2),
      &:nth-child(4) {
        border-right-color: transparent;
        padding-left: 0px;
        padding-right: 0px;
      }

      &:nth-child(1),
      &:nth-child(3) {
        border-left-color: transparent;
        padding-left: 0px;
        padding-right: 0px;
      }

      &:nth-child(3),
      &:nth-child(4) {
        border-bottom-color: transparent;
        padding-left: 0px;
        padding-right: 0px;
      }
    }

    .col-sm-4 {
      height: 33%;
      &:nth-child(1),
      &:nth-child(2),
      &:nth-child(3) {
        border-top-color: transparent;
        padding-left: 0px;
        padding-right: 0px;
      }

      &:nth-child(3),
      &:nth-child(6),
      &:nth-child(9) {
        border-right-color: transparent;
        padding-left: 0px;
        padding-right: 0px;
      }

      &:nth-child(7),
      &:nth-child(8),
      &:nth-child(9) {
        border-bottom-color: transparent;
        padding-left: 0px;
        padding-right: 0px;
      }

      &:nth-child(1),
      &:nth-child(4),
      &:nth-child(7) {
        border-left-color: transparent;
        padding-left: 0px;
        padding-right: 0px;
      }

      &:nth-child(5) {
        padding-left: 0px;
        padding-right: 0px;
      }
    }

    .col-sm-3 {
      height: 25%;
      &:nth-child(1),
      &:nth-child(2),
      &:nth-child(3),
      &:nth-child(4) {
        border-top-color: transparent;
        padding-left: 0px;
        padding-right: 0px;
      }

      &:nth-child(4),
      &:nth-child(8),
      &:nth-child(12),
      &:nth-child(16) {
        border-right-color: transparent;
        padding-left: 0px;
        padding-right: 0px;
      }

      &:nth-child(13),
      &:nth-child(14),
      &:nth-child(15),
      &:nth-child(16) {
        border-bottom-color: transparent;
        padding-left: 0px;
        padding-right: 0px;
      }

      &:nth-child(1),
      &:nth-child(5),
      &:nth-child(9),
      &:nth-child(13) {
        border-left-color: transparent;
        padding-left: 0px;
        padding-right: 0px;
      }

      &:nth-child(6),
      &:nth-child(7),
      &:nth-child(10),
      &:nth-child(11) {
        padding-left: 0px;
        padding-right: 0px;
      }
    }
    .video-window {
      width: 100%;
      height: 100%;
      background: #000;
      display:flex;
      justify-content:center;
      align-items:center
    }
  }
}

.fullscreen {
  width: 100% !important;
}

#videoPlay{
  box-sizing: border-box;
  border: 1px solid #fe0000;
}

.fullscreen {
  width: 100% !important;
}

.video-close {
  position: absolute;
  top: 5px;
  right: 5px;
  color: white;
  font-size: 12px;
  background-color: fade(gray, 50%);
  padding: 2px 5px;
  cursor: pointer;
  border-radius: 2px;
  max-width: 120px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  z-index: 5;
}
.device-name {
  position: absolute;
  top: 3px;
  left: 5px;
  color: white;
  font-size: 20px;
  background-color: fade(rgb(63, 62, 62), 70%);
  padding: 2px 5px;
  cursor: default;
  max-width: 320px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  z-index: 5;
}
.video-mask {
  width:100%;
  height: 90%;
  position: absolute;
  top: 0;
  right: 0;
  background: transparent;
}
.player-btn-group {
  margin: 5px 0;
//   .el-button:hover {
//     color: #FFF;
//     border-color: #44c3f5;
//     background-color: #44c3f5;
// }
  .active {
    background: #409EFF;
    border-color: #409EFF;
    color: #FFF;
  }
}

.main-header .navbar {
  /* Fix for IE */
  -webkit-transition: none;
  -o-transition: none;
  transition: none;
}

.channel-title {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  color: #fff;
  text-align: center;
  padding: 0 15px;
  font-size: 20px;
  line-height: 50px;
  font-weight: 700;
}

.ptz-block-tab {
  width: 150px;
  height: 180px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  font-size: 24px;
}
.fa-microphone.active {
  color: #FFF;
}

.ptz-center {
  top: 50px;
  left: 50px;
  border-radius: 25px;
  background-color: #ccc;
}

.ptz-up,
.ptz-left,
.ptz-right,
.ptz-down,
.ptz-zoomin,
.ptz-talk,
.ptz-upleft,
.ptz-upright,
.ptz-downleft,
.ptz-downright,
.ptz-zoomout {
  cursor: pointer;
}


.ptz-block {
  position: relative;
  height: 25%;
  text-align: center;
  font-size: 24px;
  background: rgba(134, 183, 241, 0.35);
  border-radius: 10px;
  margin-bottom: 10px;
  overflow: hidden;
  .speed-slider {
    position: absolute;
    width: 80%;
    bottom: 0px;
    left: 20px;
    /deep/ .el-slider__runway {
      background-color: #fff;
    }
  }
  &:hover {
    .ptz-cell {
      display: block;
    }
  }

  .ptz-cell {
    width: 50px;
    height: 50px;
    line-height: 50px;
    position: absolute;
    cursor: pointer;
    color: #00E5FF;
  }

  .ptz-cell.active {
    color: #ccc;
    font-size: 26px;
  }

  .ptz-center {
    top: 60px;
    left: 50px;
    width: 50px;
    height: 50px;
    line-height: 50px;
    position: absolute;
    border-radius: 25px;
    background: #00E5FF;
    i {
      color: fade(#000, 30%);
    }
  }

  .ptz-up {
    top: 10px;
    left: 50px;
  }

  .ptz-upleft {
    top: 30px;
    left: 20px;
  }

  .ptz-upright {
    top: 30px;
    left: 80px;
  }

  .ptz-downleft {
    top: 90px;
    left: 20px;
  }

  .ptz-downright {
    top: 90px;
    left: 80px;
  }

  .ptz-left {
    top: 60px;
    left: 0;
  }

  .ptz-right {
    top: 60px;
    left: 100px;
  }

  .ptz-down {
    top: 110px;
    left: 50px;
  }

  .ptz-plus {
    top: 10px;
    right: 25px;
  }

  .ptz-talk {
    top: 25px;
    left: 50px;
  }

  .ptz-minus {
    top: 100px;
    right: 25px;
  }
}
</style>
<style lang='scss'>
  .screen {
    width: 100%;
    .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
      background: rgba(0, 229, 255, 0.28);
    }
  }
  
  </style>
