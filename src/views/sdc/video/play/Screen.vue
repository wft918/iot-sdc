<template>
<basic-container>
<div class="">
  <!-- <header class="main-header" v-if="!fullscreen">
    <nav class="navbar navbar-static-top" role="navigation">
      <div class="channel-title">{{title}}</div>
    </nav>
  </header> -->
  <div style="width:100%">
    <section :class="[{'content': !fullscreen}, {'no-padding': fullscreen}]" style="width:82%;float:left;margin-right:1%">
      <div class="player-wrapper col-xs-12 col-sm-12 col-md-10 col-lg-8" :style="{width: fullscreen ? '100%' : isMobile() ? '95%' : '100%' }">
        <!-- <div class="play-area"> -->
          <button v-on:click="selectChannel()" class="selectChannel">选择通道</button>
          <LivePlayer  ref="player" :muted="muted" :videoUrl="videoUrl" :aspect="aspect" live :poster="poster"
            v-loading="bLoading" :debug="debug" element-loading-text="加载中..." element-loading-background="#000" :loading.sync="bLoading" @message="$message"
            :fluent="fluent" :stretch="stretch" :autoplay="autoplay" :controls="controls"
            :style="aspect == 'fullscreen' ? 'width: 100% !important;height: 100% !important;position: fixed !important;':''"></LivePlayer>
            <!-- <video
              v-else
              src="../../../../assets/video/video2.mp4"
              width="100%"
              height="100%"
              controls
              muted
              autoplay="autoplay"
              loop="loop"
              style="object-fit: fill"
            ></video> -->
          <!-- <div class="video-close"  v-on:click="closeVideo(index)">关闭</div> -->
          <!-- <div class="video-close" :title="channelListDlgTitle" v-on:click="selectChannel(index)">选择通道</div> -->

        <!-- </div> -->
      </div>
    </section>

    <div style="padding-top:15px">
      <div class="ptz-block" v-show="showPtzPanel">
          <div class="ptz-cell ptz-up" @mousedown.prevent="ptzControl('up', $event)" title="上">
            <!-- <i class="fa fa-chevron-up"></i> -->
            <img src="@/assets/img/up.png" alt="">
          </div>
          <div class="ptz-cell ptz-upleft" @mousedown.prevent="ptzControl('upleft', $event)" title="左上">
            <!-- <i class="fa fa-chevron-upleft"></i> -->
            <img src="@/assets/img/upleft.png" alt="">
          </div>

          <div class="ptz-cell ptz-left" @mousedown.prevent="ptzControl('left', $event)" title="左">
            <!-- <i class="fa fa-chevron-left"></i> -->
            <img src="@/assets/img/left.png" alt="">
          </div>
          <div class="ptz-center" title="云台控制">
            <i class="fa fa-arrows"></i>
          </div>
          <div class="ptz-cell ptz-right" @mousedown.prevent="ptzControl('right', $event)" title="右">
            <!-- <i class="fa fa-chevron-right"></i> -->
            <img src="@/assets/img/right.png" alt="">
          </div>

          <div class="ptz-cell ptz-upright" @mousedown.prevent="ptzControl('upright', $event)" title="右上">
            <!-- <i class="fa fa-chevron-upright"></i> -->
            <img src="@/assets/img/upright.png" alt="">
          </div>

          <div class="ptz-cell ptz-down" @mousedown.prevent="ptzControl('down', $event)" title="下">
            <!-- <i class="fa fa-chevron-down"></i> -->
            <img src="@/assets/img/down.png" alt="">
          </div>

          <div class="ptz-cell ptz-downleft" @mousedown.prevent="ptzControl('downleft', $event)" title="左下">
            <!-- <i class="fa fa-chevron-downleft"></i> -->
            <img src="@/assets/img/downleft.png" alt="">
          </div>

          <div class="ptz-cell ptz-downright" @mousedown.prevent="ptzControl('downright', $event)" title="右下">
            <!-- <i class="fa fa-chevron-downright"></i> -->
            <img src="@/assets/img/downright.png" alt="">
          </div>

          <div class="ptz-cell ptz-plus" @mousedown.prevent="ptzControl('zoomin', $event)" title="放">
            <i class="fa fa-plus-circle"></i>
          </div>
          <div class="ptz-cell ptz-talk" @mousedown.prevent="talkStart" v-if="showTalk">
            <i class="fa fa-microphone"></i>
          </div>
          <div class="ptz-cell ptz-minus" @mousedown.prevent="ptzControl('zoomout', $event)" title="缩">
            <i class="fa fa-minus-circle"></i>
          </div>
        </div>

      <el-tabs v-model="activeName" type="card" @tab-click="handleClick" style="width:17%;float:left;">
        <el-tab-pane label="预置位" name="first" style="height:490px;overflow:auto;">
          <div v-for="item in 255" :key="item">
              <div class="setList bg" v-on:mouseenter="visible" @mouseleave="invisible">
                <span class="set">{{item}}</span><span class="setName">预置点{{item}}</span>
                <div style="float:right;margin-right:20px;">
                  <img src="../../../../assets/img/set.png" class="setimg setpreset" alt="" @click="controlPreset('set',item)" title="设置">
                  <img src="../../../../assets/img/gotopreset.png" class="setimg gotopreset" alt="" @click="controlPreset('goto',item)" title="调用">
                  <img src="../../../../assets/img/delete.png" class="setimg delpreset" alt="" @click="controlPreset('remove',item)" title="删除">
                </div>
              </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="巡航" name="second">
          <div  v-if="showList" style="height:490px;overflow:auto">
            <div v-for="item in 50" :key="item">
                <div class="setList bg" v-on:mouseenter="visible" @mouseleave="invisible">
                  <span class="set">{{item}}</span><span class="setName">巡航路径{{item}}</span>
                  <div style="float:right;margin-right:20px;">
                    <img src="../../../../assets/img/start.png" class="setimg gotopreset" alt="" @click="controlRoute('start',item)" title="开始">
                    <img src="../../../../assets/img/stop.png" class="setimg gotopreset" alt="" @click="controlRoute('stop',item)" title="停止">
                    <img src="../../../../assets/img/set.png" class="setimg setpreset" alt="" @click="setControl(item)" title="设置">
                    <img src="../../../../assets/img/delete.png" class="setimg delpreset" alt="" @click="delRoute(item)" title="删除">
                  </div>
                </div>
            </div>
          </div>
        </el-tab-pane>

        <div class="showSet" v-if="showSet">
          <div class="title">
            <span class="roundName">巡航路径 {{routeIndex}}</span>
            <img src="@/assets/img/add.png" title="添加" class="setimg" alt="" @click="addRoute">
            <img src="@/assets/img/cancel.png" title="返回" class="setimg" alt="" @click="cancel">
            <!-- <img src="../../../../assets/img/delete.png" class="setimg" alt="" @click="delPreset"> -->
          </div>
          <el-row style="padding:10px">
            <el-col :span="4" style="color:#fff;height:40px;line-height:40px">速度</el-col>
            <el-col :span="6"><el-input v-model="speed" placeholder="请输入1~4095之间的数字" @blur="speedBlur()"></el-input></el-col>
            <el-col :span="4" :offset="4" style="color:#fff;height:40px;line-height:40px">时间</el-col>
            <el-col :span="6"><el-input v-model="stay" placeholder="请输入1~4095之间的数字" @blur="stayBlur()"></el-input></el-col>
          </el-row>
          <div style="color:#fff;padding-left: 10px;">预置点</div>
          <!-- <div class="headtxt">
            <span class="col-sm-4">预置点</span>
            <span class="col-sm-4">速度</span>
            <span class="col-sm-4">时间 (s)</span>
          </div> -->
          <!-- <div style="height:450px;overflow:auto;"> -->
            <div v-for="(item, index ) in groupList" :key="index">
              <div class="addOptin" @click="clickoption(item.id)">
                <el-row style="padding:10px">
                  <el-col :span="14" style="color:#fff;height:40px;line-height:40px">
                    <el-select v-model="item.Preset" placeholder="请选择">
                      <el-option
                        v-for="value in 255"
                        :key="value"
                        :label="value"
                        :value="value">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="3" :offset="3"><img src="@/assets/img/submit.png" title="提交" alt="" @click="sure(item.Preset)" style="width:30px"></el-col>
                  <el-col :span="3" :offset="1"><img src="@/assets/img/delete.png" title="删除" alt="" @click="delPreset(item.Preset, index)" style="width:16px"></el-col>
              </el-row>
                <!-- <span class="">
                  <el-select v-model="item.Preset" placeholder="请选择">
                    <el-option
                      v-for="item in 255"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </span> -->
                <!-- <span><img src="@/assets/img/add.png" alt=""></span>
                <span><img src="@/assets/img/delete.png" alt=""></span> -->
              </div>
            </div>
          <!-- </div> -->
          <!-- <div class="btnClass">
            <el-button type="primary" @click="sure">确定</el-button>
            <el-button type="primary" @click="cancel">取消</el-button>
          </div> -->
        </div>

      </el-tabs>
    </div>
  </div>
  <ScreenChannelListDlg ref="channelListDlg" @selected="play" style="z-index:2001;"></ScreenChannelListDlg>

  <resize-observer @notify="handleResize"/>
</div>
</basic-container>
</template>

<script>
import "@/assets/scss/layout.less"
import "font-awesome/css/font-awesome.css"
import "bootstrap/dist/css/bootstrap.css"
// import "admin-lte/dist/css/AdminLTE.css"
import "admin-lte/dist/css/skins/_all-skins.css"
// import "@/assets/styles/custom.less"
import 'vue-resize/dist/vue-resize.css'

import "bootstrap/dist/js/bootstrap.js"
import "admin-lte/dist/js/adminlte.js"

import "jquery-ui/ui/widgets/draggable"

import {
  mapState,
  mapActions
} from "vuex"
import Vue from "vue"
import moment from "moment"

import ElementUI from "element-ui"
// import "@/assets/styles/element-custom.scss"
Vue.use(ElementUI);

import VueClipboards from "vue-clipboards"
Vue.use(VueClipboards);

import VueResize from 'vue-resize'
Vue.use(VueResize);

Vue.prototype.$updateQueryString = (uri, key, value) => {
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf('?') !== -1 ? "&" : "?";
  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + "=" + value + '$2');
  } else {
    return uri + separator + key + "=" + value;
  }
}
Vue.prototype.$iframe = (link, w, h) => {
  var _link = Vue.prototype.$updateQueryString(link, "aspect", "fullscreen")
  return `<iframe src="${_link}" width="${w}" height="${h}" allowfullscreen allow="autoplay; fullscreen"></iframe>`
}
Vue.prototype.isMobile = () => {
  return videojs.browser.IS_IOS || videojs.browser.IS_ANDROID;
}
Vue.prototype.isIE = () => {
  return !!videojs.browser.IE_VERSION;
}
Vue.prototype.flvSupported = () => {
  return videojs.browser.IE_VERSION || (flvjs.getFeatureList() && flvjs.getFeatureList().mseLiveFlvPlayback);
}
Vue.prototype.canTalk = () => {
  return location.protocol.indexOf("https") == 0 || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
}
Vue.prototype.hasAnyRole = (serverInfo, userInfo, ...roles) => {
    if (!userInfo) {
        return true;
    }
    var userRoles = [];
    if (userInfo) {
        userRoles = userInfo.Roles || [];
    }
    var checked = false;
    for(var role of (roles||[])) {
        if (!role || userRoles.some(ur => (ur == role || ur == '超级管理员'))) {
            checked = true;
            break;
        }
    }
    return checked;
}
Vue.prototype.isDemoUser = (serverInfo, userInfo) => {
  if (serverInfo && userInfo && serverInfo.IsDemo && userInfo.Name == serverInfo.DemoUser) return true;
  return false;
}

import ScreenChannelListDlg from "./ScreenChannelListDlg.vue";
import Qrcode from "@xkeshi/vue-qrcode"
import LivePlayer from "@liveqing/liveplayer"
import $ from "jquery"
import "@penggy/jquery.nicescroll"
$.ajaxSetup({ cache: false });
export default {
  components: {
    ScreenChannelListDlg,
    LivePlayer,
    Qrcode
  },
  data() {
    return {
      projectId:"",
      videoUrl: "",
      bLoading: false,
      url: "",
      title: "",
      timer: 0,
      serial: "",
      code: "",
      appearanceType: "",
      channel: "1",
      type: "stream",
      starttime: "",
      endtime: "",
      streamid: "",
      protocol: "",
      shareUrl: "",
      snapUrl: "",
      ptz: true,
      share: true,
      fluent: true,
      stretch: false,
      autoplay: true,
      controls: true,
      aspect: "",
      debug: false,
      token: "",
      muted: true,
      talk: false,
      otherParams: "",
      sourceVideoCodecName: "",
      sourceAudioCodecName: "",
      recorder: null,
      ws: null,
      nice: null,
      channelListDlgTitle: '',
      activeName: 'first',
      background: '',
      color: '',
      routeIndex: '',
      showList: true,
      showSet: false,
      presetList: [],
      preset: '',
      speed: '',
      stay: '',
      groupList: [],
      ids: '',
      url : this.$dictUtils.getDictValue("vedio_param", "url_ip", ""),
      port: this.$dictUtils.getDictValue("vedio_param", "port", "")
    };
  },
  // activated(){
  //   this.url = this.$dictUtils.getDictValue("vedio_param", "url_ip", "")
  //   this.port = this.$dictUtils.getDictValue("vedio_param", "port", "")
  // },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = 0;
    }
    this.videoUrl = "";
    this.ctrlStop();
    $(document).off("mouseup touchend", this.ctrlStop);
  },
  created() {
    this.aspect = this.getQueryString("aspect","").replace("x", ":");
    this.autoplay = this.getQueryString("autoplay", "yes") == "yes";
    this.controls = this.getQueryString("controls", "yes") == "yes";
    this.ptz = this.getQueryString("ptz", "yes") == "yes";
    this.share = this.getQueryString("share", "yes") == "yes";
    this.fluent = this.getQueryString("fluent", "yes") == "yes";
    this.stretch = this.getQueryString("stretch", "no") == "yes";
    this.type = this.getQueryString("type", "stream");
    this.starttime = this.getQueryString("starttime", "");
    this.endtime = this.getQueryString("endtime", "");
    this.serial = this.getQueryString("serial", "");
    this.code = this.getQueryString("code", "");
    this.channel = this.getQueryString("channel", "1");
    this.protocol = this.getQueryString("protocol", "");
    this.debug = this.getQueryString("debug") == "yes";
    this.token = this.getQueryString("token", "");
    this.muted = this.getQueryString("muted", "yes") == "yes";
    this.talk = this.getQueryString("talk", "no") == "yes";
    this.otherParams = this.getOtherParams(["aspect", "autoplay", "controls", "ptz", "share", "fluent", "stretch", "type", "starttime", "endtime", "serial", "code", "channel", "protocol", "muted", "talk", "debug"])
    this.shareUrl = location.href;
  },
  async mounted() {
    // await this.getServerInfo();
    // await this.getUserInfo();
    // document.title = this.serverInfo.LogoText || "LiveGBS";
    $(document).ajaxError((evt, xhr, opts, ex) => {
      if (xhr.status == 401) {
        if (this.serverInfo.IsDemo) {
          location.href = `/login.html?r=${encodeURIComponent(location.href)}`;
        } else {
          if (this.fullscreen) {
             console.log("登录认证过期");
          } else {
            this.$message({
              type: 'error',
              message: "登录认证过期"
            })
          }
        }
        return false;
      }
      let msg = xhr.responseText || "网络请求失败";
      if (xhr.status == 404) {
        msg = "请求服务不存在或已停止";
      } else if (xhr.status == 504) {
        msg = "Gateway Timeout";
      }
      try {
        msg = JSON.parse(msg)
      } catch (error) {}
      if (this.fullscreen) {
        console.log(msg);
      } else {
        this.$message({
          type: 'error',
          message: msg
        })
      }
    }).on("mouseup touchend", this.ctrlStop).ready(() => {
      this.$nextTick(() => {
        // $("body").layout("fix");
        // this.fixHover();
        // if(!this.isIE() && !this.isMobile()) {
        //   this.nice = $("body").niceScroll({
        //       zindex: 999999,
        //       cursorwidth: "10px",
        //       cursoropacitymax: 0.5,
        //       enablekeyboard: false,
        //   });
        // }
      })
    });
    // 控制云控制台可移动位置
    // $(".ptz-block").draggable({
    //   handle: '.ptz-center',
    //   cancel: ".ptz-cell",
    //   containment: 'document',
    //   delay: 100
    // });
    if (this.code && this.serial) {
      switch (this.type) {
        case "stream":
          this.bLoading = true;
          $.get(`/api/v1/stream/start`, {
            serial: this.serial,
            code: this.code,
            token: this.token,
          }).then(streamInfo => {
            if(!this.getQueryString("ptz", "") && streamInfo.ChannelPTZType == 3) { // 0 - 未知, 1 - 球机, 2 - 半球, 3 - 固定枪机, 4 - 遥控枪机
              this.ptz = false;
            }
            var _videoUrl = this.isMobile() ? streamInfo.HLS : streamInfo.RTMP;
            var _snapUrl = this.isMobile() ? streamInfo.SnapURL : "";
            if (this.flvSupported()) {
              if (streamInfo.WS_FLV && !this.isIE()) {
                _videoUrl = streamInfo.WS_FLV;
              } else if(streamInfo.FLV) {
                _videoUrl = streamInfo.FLV;
              }
              _snapUrl = streamInfo.SnapURL;
            }
            var _protocol = String(this.protocol).toUpperCase();
            switch (_protocol) {
              case "RTMP":
                _videoUrl = streamInfo.RTMP || "";
                break;
              case "HLS":
                _videoUrl = streamInfo.HLS || "";
                break;
              case "FLV":
                _videoUrl = streamInfo.FLV || "";
                break;
              case "WS_FLV":
                _videoUrl = streamInfo.WS_FLV || "";
                break;
              case "WS-FLV":
                _videoUrl = streamInfo.WS_FLV || "";
                break;
            }
            if (this.otherParams != "") {
              if (_videoUrl.indexOf("?") == -1) {
                _videoUrl += "?" + this.otherParams;
              } else {
                _videoUrl += "&" + this.otherParams;
              }
            }
            this.title = streamInfo.ChannelCustomName || streamInfo.ChannelName;
            this.sourceVideoCodecName = streamInfo.SourceVideoCodecName;
            this.sourceAudioCodecName = streamInfo.SourceAudioCodecName;
            this.snapUrl = _snapUrl||"";
            this.$nextTick(() => {
              this.videoUrl = _videoUrl;
            })
          }).fail(() => {
            this.bLoading = false;
          })
          break;
        case "playback":
          if(!this.getQueryString("ptz", "")) {
            this.ptz = false;
          }
          this.bLoading = true;
          $.get(`/api/v1/playback/start`, {
            serial: this.serial,
            code: this.code,
            starttime: this.starttime,
            endtime: this.endtime,
            token: this.token,
          }).then(streamInfo => {
            var _videoUrl = this.isMobile() ? streamInfo.HLS : streamInfo.RTMP;
            var _snapUrl = this.isMobile() ? streamInfo.SnapURL : "";
            if (this.flvSupported()) {
              if(streamInfo.WS_FLV && !this.isIE()) {
                _videoUrl = streamInfo.WS_FLV;
              } else if (streamInfo.FLV) {
                _videoUrl = streamInfo.FLV;
              }
              _snapUrl = streamInfo.SnapURL;
            }
            var _protocol = String(this.protocol).toUpperCase();
            switch (_protocol) {
              case "RTMP":
                _videoUrl = streamInfo.RTMP || "";
                break;
              case "HLS":
                _videoUrl = streamInfo.HLS || "";
                break;
              case "FLV":
                _videoUrl = streamInfo.FLV || "";
                break;
              case "WS_FLV":
                _videoUrl = streamInfo.WS_FLV || "";
                break;
              case "WS-FLV":
                _videoUrl = streamInfo.WS_FLV || "";
                break;
            }
            if (this.otherParams != "") {
              if (_videoUrl.indexOf("?") == -1) {
                _videoUrl += "?" + this.otherParams;
              } else {
                _videoUrl += "&" + this.otherParams;
              }
            }
            this.title = streamInfo.ChannelCustomName || streamInfo.ChannelName;
            this.sourceVideoCodecName = streamInfo.SourceVideoCodecName;
            this.sourceAudioCodecName = streamInfo.SourceAudioCodecName;
            this.snapUrl = _snapUrl||"";
            this.$nextTick(() => {
              this.videoUrl = _videoUrl;
            })
            this.streamid = streamInfo.StreamID || "";
          }).fail(() => {
            this.bLoading = false;
          })
          break;
      }
    }
  },
  computed: {
    ...mapState(["serverInfo", "userInfo"]),
    fullscreen() {
      return (this.aspect != "");
    },
    showTalk() {
      return this.talk && this.canTalk() && this.serverInfo.VersionType == '旗舰版';
    },
    showPtzPanel() {
      return (this.ptz || this.talk) && !this.isMobile() && this.hasAnyRole(this.serverInfo, this.userInfo, '管理员', '操作员');
    },
    showPtzTab() {
      return (this.ptz || this.talk) && this.isMobile() && this.hasAnyRole(this.serverInfo, this.userInfo, '管理员', '操作员');
    },
    poster() {
      var _protocol = String(this.protocol).toUpperCase();
      if(_protocol == "RTMP") {
        return "";
      }
      return this.snapUrl;
    }
  },
  methods: {
    // 点击选择通道
    selectChannel() {
      // this.$alert('反馈成功')
      console.log('url', this.url)
      console.log('port', this.port)
      this.channelListDlgTitle = `选择通道`;
      this.$refs["channelListDlg"].show();
    },
    // 选择通道
    play(index, channel) {
      console.log('channel', channel)
      console.log('http://' + this.url + ':' + this.port + '/api/v1/stream/start')
      $.get('http://' + this.url + ':' + this.port + '/api/v1/stream/start', {
        serial: channel.devicechannel,
        code: channel.channel,
      }).then(stream => {
        // this.videoUrl = this.isMobile() ? stream.HLS : stream.RTMP;
        // this.protocol = this.isMobile() ? "HLS" : "RTMP";
        this.serial = channel.devicechannel
        this.code = channel.channel
        this.appearanceType = channel.expand.appearanceType
        console.info(this.appearanceType)
        if(this.flvSupported()) {
          if(stream.WS_FLV && !this.isIE()) {
            this.videoUrl = stream.WS_FLV;
            this.protocol = "WS_FLV";
          } else if(stream.FLV) {
            this.videoUrl = stream.FLV;
            this.protocol = "FLV";
          }
        }
        if(this.isIE() && i > 0) {
          this.videoUrl = stream.HLS;
          this.protocol = "HLS";
        }
        var _protocol = String(this.protocol).toUpperCase();
        switch (_protocol) {
          case "RTMP":
            this.videoUrl = stream.RTMP || "";
            this.protocol = "RTMP";
            break;
          case "HLS":
            this.videoUrl = stream.HLS || "";
            this.protocol = "HLS";
            break;
          case "FLV":
            this.videoUrl = stream.FLV || "";
            this.protocol = "FLV";
            break;
          case "WS_FLV":
            this.videoUrl = stream.WS_FLV || "";
            this.protocol = "WS_FLV";
            break;
          case "WS-FLV":
            this.videoUrl = stream.WS_FLV || "";
            this.protocol = "WS_FLV";
            break;
        }
        // player.protocol = protocol;
        // player.poster = protocol == "RTMP" ? "" : stream.SnapURL;
        this.$nextTick(() => {
          // player.url = videoUrl;
        })
        // this.resetCloseTimer(player);
      }).fail(() => {
        // player.bLoading = false;
      });
    },
    // 关闭通道
    closeVideo: function (idx) {
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
      player.poster = "";
      player.url = "";
    },
    // 切换tab
    handleClick(tab, event) {
      // console.log(tab, event);
    },

    // 预置位滑动样式
    visible () {
      this.background = 'red'
      this.color = 'black'
    },
    invisible () {
      this.background = 'black'
      this.color = 'red'
    },

    // 预置位控制
    controlPreset(command, preset) {
      if(this.appearanceType != "1"){
        this.$message.warning("只有球机可控制预置位，请确认摄像头类型！")
        return
      }
      if (this.code && this.serial) {
        $.get('http://' + this.url + ':' + this.port + '/api/v1/control/preset', {
          serial: this.serial,
          channel: this.channel,
          code: this.code,
          command: command,
          preset: preset,
          name: ''
        }).then(data => {
            // alert(data)
          this.$message({
            type: 'success',
            message: "执行成功"
          }) 
        })
      } else {
        this.$message({
          type: 'error',
          message: "请先选择一个视频通道"
        })
      }
    },
    // 点击巡航设置按钮
    setControl(seq) {
      if (this.code && this.serial) {
        this.routeIndex = seq
        this.showList = false
        this.showSet = true
        $.get('http://' + this.url + ':' + this.port + '/api/v1/control/navigate', {
          serial: this.serial,
          channel: this.channel,
          code: this.code,
          command: 'query'
        }).then(data => {
          this.groupList = data.GroupList.find(item => item.GroupID === this.routeIndex)
          if(this.groupList == undefined) {
            this.groupList = []
            this.speed = 30
            this.stay = 120
          } else {
            this.speed = this.groupList.Speed
            this.stay = this.groupList.Stay
            this.groupList = this.groupList.Presets.split(',').map((item, index) => {
              return {
                id: index,
                Preset: item
              }
            })
          }
        })
      } else {
        this.$message({
          type: 'error',
          message: "请先选择一个视频通道"
        })
      }
    },
    // 点击巡航开始和停止按钮
    controlRoute(command, groupid) {
      if(this.appearanceType != "1"){
        this.$message.warning("只有球机可使用巡航，请确认摄像头类型！")
        return
      }
      if (this.code && this.serial) {
        $.get('http://' + this.url + ':' + this.port + '/api/v1/control/navigate', {
          serial: this.serial,
          channel: this.channel,
          code: this.code,
          command: command,
          groupid: groupid,
          preset: '',
          speed: '',
          stay: ''
        }).then(data => {
        })
      } else {
        this.$message({
          type: 'error',
          message: "请先选择一个视频通道"
        })
      }
    },
    // 点击巡航删除按钮
    delRoute(groupid) {
      if (this.code && this.serial) {
        $.get('http://' + this.url + ':' + this.port + '/api/v1/control/navigate', {
          serial: this.serial,
          channel: this.channel,
          code: this.code,
          command: 'remove',
          groupid: groupid,
          preset: 0
        }).then(data => {
          this.$message({
            type: 'success',
            message: "删除成功!"
          })
        })
      } else {
        this.$message({
          type: 'error',
          message: "请先选择一个视频通道"
        })
      }
    },
    // 点击某一行预置位
    clickoption(id) {
      console.log('id', id)
      this.ids = id
    },
    // 点击添加
    addRoute() {
      console.log(this.groupList)
      if(this.groupList.length == 0) {
        this.groupList.push({
          id: 1,
          Preset: 1
        })
      } else {
        this.groupList.push({
          id: this.groupList.slice(-1)[0].id+1,
          // GroupID: data.GroupList[0].GroupID,
          Preset: 1
        })
      }
    },
    // 点击删除对应预置位
    delPreset(preset, index) {
      console.log('this.groupList1',this.groupList)
      $.get('http://' + this.url + ':' + this.port + '/api/v1/control/navigate', {
        serial: this.serial,
        channel: this.channel,
        code: this.code,
        command: 'remove',
        groupid: this.routeIndex,
        preset: preset
      }).then(data => {
        console.log('data', data)
        console.log('this.groupList2',this.groupList)
        this.groupList.splice(index,1)
        this.$message({
          type: 'success',
          message: "删除成功!"
        })
      })
    },
     // 点击巡航路径内预置位对应的删除
    // delPreset() {
    //   console.log('ids', this.ids)
    //   if(this.ids === '') {
    //     this.groupList.pop()
    //   } else {
    //     this.groupList.splice(this.groupList.find(item => item.id === this.ids), 1)
    //     this.ids = ''
    //   }
    // },
    // 输入速度失去光标事件
    speedBlur() {
      // if(this.speed) {

      // }
    },
    // 输入时间失去光标事件
    stayBlur() {

    },
    // 点击确定添加
    sure(preset) {
      console.log('routeIndex', this.routeIndex)
      console.log('preset', preset)
      // 添加预置位
      $.get('http://' + this.url + ':' + this.port + '/api/v1/control/navigate', {
        serial: this.serial,
        channel: this.channel,
        code: this.code,
        command: 'add',
        groupid: this.routeIndex,
        preset: preset
      }).then(data => {
        this.$message({
          type: 'success',
          message: "添加成功!"
        })
      })

      // 设置速度
      $.get('http://' + this.url + ':' + this.port + '/api/v1/control/navigate', {
        serial: this.serial,
        channel: this.channel,
        code: this.code,
        command: 'setspeed',
        groupid: this.routeIndex,
        speed: this.speed
      }).then(data => {
        // this.$message({
        //   type: 'error',
        //   message: "添加成功!"
        // })
      })

      // 设置时间
      $.get('http://' + this.url + ':' + this.port + '/api/v1/control/navigate', {
        serial: this.serial,
        channel: this.channel,
        code: this.code,
        command: 'setstay',
        groupid: this.routeIndex,
        stay: this.stay
      }).then(data => {
        // this.$message({
        //   type: 'error',
        //   message: "添加成功!"
        // })
      })
    },
    // 点击取消
    cancel() {
      this.showList = true
      this.showSet = false
    },

    // 视频控制结束

    // ...mapActions(["getServerInfo", "getUserInfo"]),
    fixHover() {
      if (videojs.browser.IS_IOS || videojs.browser.IS_ANDROID) {
        for (var sheetI = document.styleSheets.length - 1; sheetI >= 0; sheetI--) {
          var sheet = document.styleSheets[sheetI];
          if (sheet.cssRules) {
            for (var ruleI = sheet.cssRules.length - 1; ruleI >= 0; ruleI--) {
              var rule = sheet.cssRules[ruleI];
              if (rule.selectorText) {
                rule.selectorText = rule.selectorText.replace(":hover", ":active");
                rule.selectorText = rule.selectorText.replace(":focus", ":active");
              }
            }
          }
        }
      }
    },
    touchStream() {
      switch (this.type) {
        case "stream":
          $.get('http://' + this.url + ':' + this.port + '/api/v1/stream/touch', {
            serial: this.serial,
            code: this.code,
            token: this.token,
          })
          break;
        case "playback":
          $.get('http://' + this.url + ':' + this.port + '/api/v1/playback/touch', {
            streamid: this.streamid,
            token: this.token
          })
          break;
      }
    },
    thisYear() {
      return moment().format("YYYY");
    },
    getQueryString(name, defVal = "") {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) {
        return unescape(r[2]);
      }
      return defVal;
    },
    getOtherParams(without) {
      var url = location.search;
      var theRequest = "";
      if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
          if (without.indexOf(strs[i].split("=")[0]) == -1) {
            if (theRequest == "") {
              theRequest = strs[i]
            } else {
              theRequest += "&" + strs[i]
            }
          }
        }
      }
      return theRequest;
    },
    ptzControl(cmd, event) {
      if(this.appearanceType != "1"){
        this.$message.warning("只有球机可使用云台控制，请确认摄像头类型！")
        return
      }
      if (this.code && this.serial) {
        $.get('http://' + this.url + ':' + this.port + '/api/v1/control/ptz', {
        serial: this.serial,
        code: this.code,
        command: cmd,
        token: this.token
      })
      $(event.target).closest('.ptz-cell').addClass("active");
      } else {
        this.$message({
          type: 'error',
          message: "请先选择一个视频通道"
        })
      }
    },
    ptzStop() {
      if ($(this.$el).find(".ptz-cell.active").length > 0) {
        $.get('http://' + this.url + ':' + this.port + '/api/v1/control/ptz', {
          serial: this.serial,
          code: this.code,
          command: "stop"
        });
        $(this.$el).find(".ptz-cell.active").removeClass("active");
      }
    },
    talkStart(e) {
      if(!this.ws) {
        var ws = new WebSocket(this.wsTalkURL());
        ws.onopen = evt => {
          console.log("ws talk open");
          this.ws = ws;
        }
        ws.onclose = evt => {
          console.log("ws talk close");
        }
        ws.onerror = evt => {
          console.log("ws talk error", evt);
        }
      }
      var $target = $(e.currentTarget);
      if(this.recorder) {
        $target.addClass("active");
        this.recorder.start();
        return;
      }
      LiveRecorder.get((rec, err) => {
        if(err) {
          alert(err);
          return
        }
        // this.$refs["player"].setMuted(true);
        $target.addClass("active");
        this.recorder = rec;
        this.recorder.start();
      }, {
        sampleBits: 16,
        sampleRate: 8000,
        pcmCallback: pcm => {
          // binary to base64 string
          var reader = new window.FileReader();
          reader.onloadend = () => {
            var base64 = reader.result;
            var base64 = base64.split(',')[1];
            if(this.ws) {
              this.ws.send(base64);
            }
          }
          reader.readAsDataURL(pcm);
        }
      })
    },
    talkStop() {
      if(this.recorder) {
        this.recorder.stop();
        // this.recorder = null;
        $(this.$el).find(".fa-microphone.active, .ptz-talk.active").removeClass("active");
        // this.$refs["player"].setMuted(false);
      }
      if(this.ws) {
        this.ws.close();
        this.ws = null;
      }
    },
    ctrlStop() {
      this.talkStop();
      this.ptzStop();
    },
    handleResize() {
      this.nice && this.nice.resize();
    },
    wsTalkURL() {
      var protocal = "ws:";
      if(location.protocol.startsWith("https")) {
        protocal = "wss:";
      }
      //url query param "format=pcm|g711"
      return `${protocal}//${location.host}/api/v1/control/ws-talk/${this.serial}/${this.code}?format=pcm`;
    },

  },
};
</script>

<style lang="less" scoped>
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

// .ptz-cell {
//   width: 50px;
//   height: 50px;
//   line-height: 50px;
//   position: absolute;
// }

// .ptz-cell.active {
//   color: #ccc;
//   font-size: 26px;
// }
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

.selectChannel {
  position: absolute;
  z-index: 1000;
  // width: 150px;
  // height: 20px;
  right: 20px;
  top: 20px;
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

.ptz-block {
  position: relative;
  // z-index: 99999;
  width: 17%;
  height: 160px;
  text-align: center;
  font-size: 24px;
  // background: fade(#eee, 0%);
  background: rgba(1, 51, 102, 0.4);
  border-radius: 10px;
  margin-bottom: 10px;
  overflow: hidden;

  &:hover {
    // background: fade(#eee, 60%);

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
    // display: none;
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
    // background: fade(#ccc, 20%);
    background: #00E5FF;
    // cursor: move;

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
}

</style>
<style lang='scss'>
.screen {
  width: 100%;
  // height: 685px;

  .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
    background: rgba(0, 229, 255, 0.28);
  }
}

</style>
