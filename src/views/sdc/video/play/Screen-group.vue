<template>
  <basic-container>
    <div style="width: 100%;height: 985px;">
      <div class="left" style="height:91%;width:79%;float:left;">
        <div class="row hidden-xs text-center" style="margin: 10px 0;">
        <el-button-group class="player-btn-group">
          <el-button
            type="primary"
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
        <!-- <div class="row visible-xs text-center" style="margin: 10px 0">
          <el-button-group class="player-btn-group">
            <el-button type="primary" size="mini" v-for="list in playerBtnGroup" :key="list.num" @click.prevent="setPlayerLength(list.num)" :class="{'active' : playerLength == list.num}">{{list.name}}</el-button>
            <el-button type="button" id="full-btn-mini" size="mini" style="border-left: 1px solid #fff;" @click.prevent="fullscreen" title="全屏显示"><i class="fa fa-arrows-alt"></i></el-button>
          </el-button-group>
        </div> -->
        <!-- <br><br class="hidden-xs"> -->
        <div class="view-list row" style="width: 100%;height:87%">
          <!-- col-md-offset-1 col-lg-offset-2 -->
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

                <!-- jessibuca播放器 -->
                <!-- <jessibuca ref="videoPlayer" :playerLength="playerLength"  :videoUrl="player.url" :error="videoError" :message="videoError" :height="false" :hasAudio="false" fluent autoplay live stretch></jessibuca> -->

                <!-- iframe方式 -->
                  <div ref="videoAreaRef" class="video-window">
                    <div style="color:#fff;margin:auto;">无信号</div>
                  </div>
                <div class="video-close" v-show="player.url && player.bCloseShow" v-on:click="closeVideo(index)">关闭</div>

                <!-- iframe本身无点击事件，添加透明层触发切换分屏事件 -->
                <div class="video-mask" @click="Liveplay(index)"></div>
              </div>
              <!-- <ScreenChannelListDlg ref="channelListDlg" @selected="play" :title="channelListDlgTitle" style="z-index:2001;"></ScreenChannelListDlg> -->
            </div>
          </div>
        </div>
      </div>
      <div class="right" style="height:91%;width:20%;float:right;margin-right:0.3%;margin-top:3%;">
          <!-- 云台操作 -->
        <div class="ptz-block" v-show="showPtzPanel">
          <div class="ptz-cell ptz-up" @mousedown.prevent="ptzControl(0, 2, 0, $event)" @mouseup="ptzStop(0, 0, 0)" title="上">
            <!-- <i class="fa fa-chevron-up"></i> -->
            <img src="@/assets/img/up.png" alt="">
          </div>

          <div class="ptz-cell ptz-left" @mousedown.prevent="ptzControl(2, 0, 0, $event)" @mouseup="ptzStop(0, 0, 0)" title="左">
            <!-- <i class="fa fa-chevron-left"></i> -->
            <img src="@/assets/img/left.png" alt="">
          </div>
          <div class="ptz-center" title="云台控制">
            <i class="fa fa-arrows"></i>
          </div>
          <div class="ptz-cell ptz-right" @mousedown.prevent="ptzControl(1, 0, 0, $event)" @mouseup="ptzStop(0, 0, 0)" title="右">
            <!-- <i class="fa fa-chevron-right"></i> -->
            <img src="@/assets/img/right.png" alt="">
          </div>

          <div class="ptz-cell ptz-down" @mousedown.prevent="ptzControl(0, 1, 0, $event)" @mouseup="ptzStop(0, 0, 0)" title="下">
            <!-- <i class="fa fa-chevron-down"></i> -->
            <img src="@/assets/img/down.png" alt="">
          </div>

          <div class="ptz-cell ptz-plus" @mousedown.prevent="ptzControl(0, 0, 1, $event)" @mouseup="ptzStop(0, 0, 0)" title="放">
            <i class="fa fa-plus-circle"></i>
          </div>
          <div class="ptz-cell ptz-talk" @mousedown.prevent="talkStart" v-if="showTalk">
            <i class="fa fa-microphone"></i>
          </div>
          <div class="ptz-cell ptz-minus" @mousedown.prevent="ptzControl(0, 0, 2, $event)" @mouseup="ptzStop(0, 0, 0)" title="缩">
            <i class="fa fa-minus-circle"></i>
          </div>
        </div>

        <div style="width: 100%;height: 40%;margin: 20px 0 40px 0;border-bottom:1px solid #D6E8FA;">
          <div class="titleClass" style="width: 100%;height: 35px;background-color: #ECF5FF;border: none;color: #3899F5;padding-left: 12px;padding-top: 6px;">
            <label class="leftTitle" for="">设备列表</label>
          </div>
          <div style="width:100%;height:calc(100% - 35px);">
            <el-tree style="height: 100%;overflow: auto;" node-key="id" :default-expanded-keys="expandedkeys" @node-click='handleNodeClick' :accordion='true' :data="treedata" :highlight-current='true' :props="defaultProps" empty-text="加载中">
              <!-- <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span>
                      <img v-if='!data.children' src="../../../../assets/img/camera.png" alt="">
                      {{ node.label }}
                  </span>              
              </span> -->
            </el-tree>
          </div>
        </div>

        <!-- 预置位/巡航 -->
        <div style="width: 100%;height: 49%;">
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="预置位" name="first" style="height:372px;overflow:auto;">
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
              <div  v-if="showList" style="height:372px;overflow:auto">
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
    </div>
  </basic-container>
</template>

<script>
import Vue from 'vue'
// import ScreenChannelListDlg from "./ScreenChannelListDlg.vue";
import LivePlayer from "@liveqing/liveplayer";
// import jessibuca from './jessibuca.vue'
import _ from 'lodash'
import { mapState } from "vuex";
import "@/assets/scss/layout.less"
import "font-awesome/css/font-awesome.css"
import "bootstrap/dist/css/bootstrap.css"
import "admin-lte/dist/css/AdminLTE.css"
import "admin-lte/dist/css/skins/_all-skins.css"
// import "@/assets/styles/custom.less"
import 'vue-resize/dist/vue-resize.css'

import "bootstrap/dist/js/bootstrap.js"
import "admin-lte/dist/js/adminlte.js"

import "jquery-ui/ui/widgets/draggable"
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

import Qrcode from "@xkeshi/vue-qrcode"
import $ from "jquery"
import "@penggy/jquery.nicescroll"
$.ajaxSetup({ cache: false });

export default {
  components: {
    LivePlayer,
    // jessibuca,
    // ScreenChannelListDlg
    Qrcode
  },
  data() {
    return {
      players: [],
      playerLength: 4,
      channelListDlgTitle: "",
      protocol: "",
      url_ip: '',
      port: '',
			url : this.$dictUtils.getDictValue("vedio_param", "url_ip", ""),
      port: this.$dictUtils.getDictValue("vedio_param", "port", ""),
      ws_port: this.$dictUtils.getDictValue("vedio_param", "ws_port", ""),
      playPath: [process.env.VUE_APP_PLAYER_URL],
      // inputForm:{
      //   ipcId:"",
      //   channel:"",
      //   deviceChannel:""
      // },
      cameraIpcHistorieList:[],
      active:0,
      index:0,

      bLoading: false,
      title: "",
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
      channel: "1",
      type: "stream",
      starttime: "",
      endtime: "",
      streamid: "",
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

      treedata:[],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      nodeObject:'',
      clic:'',
      expandedkeys:[],//Tree默认展开数组
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
    ...mapState(["serverInfo", "userInfo"]),
    // fullscreen() {
    //   return (this.aspect != "");
    // },
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
  async mounted() {
    this.setPlayerLength(this.playerLength);
    // this.protocol = this.getQueryString("protocol", "");
    // $(document).ajaxError((evt, xhr, opts, ex) => {
    //   if (xhr.status == 401) {
    //     if (this.serverInfo.IsDemo) {
    //       location.href = `/login.html?r=${encodeURIComponent(location.href)}`;
    //     } else {
    //       if (this.fullscreen) {
    //          console.log("登录认证过期");
    //       } else {
    //         this.$message({
    //           type: 'error',
    //           message: "登录认证过期"
    //         })
    //       }
    //     }
    //     return false;
    //   }
    //   let msg = xhr.responseText || "网络请求失败";
    //   if (xhr.status == 404) {
    //     msg = "请求服务不存在或已停止";
    //   } else if (xhr.status == 504) {
    //     msg = "Gateway Timeout";
    //   }
    //   try {
    //     msg = JSON.parse(msg)
    //   } catch (error) {}
    //   if (this.fullscreen) {
    //     console.log(msg);
    //   } else {
    //     // this.$message({
    //     //   type: 'error',
    //     //   message: msg
    //     // })
    //   }
    // }).on("mouseup touchend", this.ctrlStop).ready(() => {
    //   this.$nextTick(() => {
    //     $("body").layout("fix");
    //     this.fixHover();
    //     if(!this.isIE() && !this.isMobile()) {
    //       this.nice = $("body").niceScroll({
    //           zindex: 999999,
    //           cursorwidth: "10px",
    //           cursoropacitymax: 0.5,
    //           enablekeyboard: false,
    //       });
    //     }
    //   })
    // });
    // // 控制云控制台可移动位置
    // // $(".ptz-block").draggable({
    // //   handle: '.ptz-center',
    // //   cancel: ".ptz-cell",
    // //   containment: 'document',
    // //   delay: 100
    // // });
    // if (this.codeList[this.index].code && this.serialList[this.index].serial) {
    //   switch (this.type) {
    //     case "stream":
    //       this.bLoading = true;
    //       $.get(`/api/v1/stream/start`, {
    //         serial: this.serialList[this.index].serial,
    //         code: this.codeList[this.index].code,
    //         token: this.token,
    //       }).then(streamInfo => {
    //         if(!this.getQueryString("ptz", "") && streamInfo.ChannelPTZType == 3) { // 0 - 未知, 1 - 球机, 2 - 半球, 3 - 固定枪机, 4 - 遥控枪机
    //           this.ptz = false;
    //         }
    //         var _videoUrl = this.isMobile() ? streamInfo.HLS : streamInfo.RTMP;
    //         var _snapUrl = this.isMobile() ? streamInfo.SnapURL : "";
    //         if (this.flvSupported()) {
    //           if (streamInfo.WS_FLV && !this.isIE()) {
    //             _videoUrl = streamInfo.WS_FLV;
    //           } else if(streamInfo.FLV) {
    //             _videoUrl = streamInfo.FLV;
    //           }
    //           _snapUrl = streamInfo.SnapURL;
    //         }
    //         var _protocol = String(this.protocol).toUpperCase();
    //         switch (_protocol) {
    //           case "RTMP":
    //             _videoUrl = streamInfo.RTMP || "";
    //             break;
    //           case "HLS":
    //             _videoUrl = streamInfo.HLS || "";
    //             break;
    //           case "FLV":
    //             _videoUrl = streamInfo.FLV || "";
    //             break;
    //           case "WS_FLV":
    //             _videoUrl = streamInfo.WS_FLV || "";
    //             break;
    //           case "WS-FLV":
    //             _videoUrl = streamInfo.WS_FLV || "";
    //             break;
    //         }
    //         if (this.otherParams != "") {
    //           if (_videoUrl.indexOf("?") == -1) {
    //             _videoUrl += "?" + this.otherParams;
    //           } else {
    //             _videoUrl += "&" + this.otherParams;
    //           }
    //         }
    //         this.title = streamInfo.ChannelCustomName || streamInfo.ChannelName;
    //         this.sourceVideoCodecName = streamInfo.SourceVideoCodecName;
    //         this.sourceAudioCodecName = streamInfo.SourceAudioCodecName;
    //         this.snapUrl = _snapUrl||"";
    //         this.$nextTick(() => {
    //           this.videoUrl = _videoUrl;
    //         })
    //       }).fail(() => {
    //         this.bLoading = false;
    //       })
    //       break;
    //     case "playback":
    //       if(!this.getQueryString("ptz", "")) {
    //         this.ptz = false;
    //       }
    //       this.bLoading = true;
    //       $.get(`/api/v1/playback/start`, {
    //         serial: this.serialList[this.index].serial,
    //         code: this.codeList[this.index].code,
    //         starttime: this.starttime,
    //         endtime: this.endtime,
    //         token: this.token,
    //       }).then(streamInfo => {
    //         var _videoUrl = this.isMobile() ? streamInfo.HLS : streamInfo.RTMP;
    //         var _snapUrl = this.isMobile() ? streamInfo.SnapURL : "";
    //         if (this.flvSupported()) {
    //           if(streamInfo.WS_FLV && !this.isIE()) {
    //             _videoUrl = streamInfo.WS_FLV;
    //           } else if (streamInfo.FLV) {
    //             _videoUrl = streamInfo.FLV;
    //           }
    //           _snapUrl = streamInfo.SnapURL;
    //         }
    //         var _protocol = String(this.protocol).toUpperCase();
    //         switch (_protocol) {
    //           case "RTMP":
    //             _videoUrl = streamInfo.RTMP || "";
    //             break;
    //           case "HLS":
    //             _videoUrl = streamInfo.HLS || "";
    //             break;
    //           case "FLV":
    //             _videoUrl = streamInfo.FLV || "";
    //             break;
    //           case "WS_FLV":
    //             _videoUrl = streamInfo.WS_FLV || "";
    //             break;
    //           case "WS-FLV":
    //             _videoUrl = streamInfo.WS_FLV || "";
    //             break;
    //         }
    //         if (this.otherParams != "") {
    //           if (_videoUrl.indexOf("?") == -1) {
    //             _videoUrl += "?" + this.otherParams;
    //           } else {
    //             _videoUrl += "&" + this.otherParams;
    //           }
    //         }
    //         this.title = streamInfo.ChannelCustomName || streamInfo.ChannelName;
    //         this.sourceVideoCodecName = streamInfo.SourceVideoCodecName;
    //         this.sourceAudioCodecName = streamInfo.SourceAudioCodecName;
    //         this.snapUrl = _snapUrl||"";
    //         this.$nextTick(() => {
    //           this.videoUrl = _videoUrl;
    //         })
    //         this.streamid = streamInfo.StreamID || "";
    //       }).fail(() => {
    //         this.bLoading = false;
    //       })
    //       break;
    //   }
    // }
  },
  activated() {
    this.clic = 4;//分屏按钮默认展示四分屏
    // this.autoplayList();
    this.getChannels()
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
    console.log(decodeURIComponent('http://192.168.67.13:18080/#/play/wasm/ws%3A%2F%2F192.168.67.13%3A8080%2Frtp%2F44010200491180000001_34020000001320000016.flv'));
  },
  methods: {

    getQueryString(name, defVal = "") {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      // console.log(reg,'reg----->')
      // console.log(r,'r----------->')
      // return
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
    selectChannel(index) {
      this.channelListDlgTitle = `为第 ${index+1} 屏选择通道`;
      this.$refs["channelListDlg"].show(index);
    },
    setPlayerLength(playerNum,i) {
      this.clic = i
      if (playerNum == this.players.length) {
        return
      }
      this.clearVideos();
      this.players = []
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
      // 自动播放
      // var index = 0;
      // if(this.cameraIpcHistorieList.length>0){
      //   this.getautoplay(index)
      // }
    },
    // 点击要播放的视频区域
    Liveplay(index){
      this.index = index
      // console.log(this.index,'*--*-*-*-')
      this.active = index
    },
    // 获取右边树形数据列表
    getChannels(){
      this.$http({
        url:`/site-sdc/sdcdevice/treeByTopType`,
        method:'get',
        params: {
          topTypeCode: 'ipc'
        }
      }).then((res)=>{
        console.log(res);
        if(res.data.msg == '操作成功'){
          this.treedata = res.data.data
          this.expandedkeys.push(res.data.data[0].id)
        }
      })
    },
    // 点击树形控件节点触发
    handleNodeClick(a,b,c){
      console.log(a)
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
            console.log(deviceInfo, '摄像头信息');
            this.serialList[this.index].serial = deviceInfo.devicechannel // 设备编号
            this.codeList[this.index].code = deviceInfo.channel // 通道编号
            this.appearanceTypeList[this.index].appearanceType = deviceInfo.expand.appearanceType
            console.log(deviceInfo,'这是节点对象')
            this.play(this.index,deviceInfo)
          }
        })
      }
      
      
    },
    // 自动播放
    // autoplayList(){
    //     this.$http({
    //       url:"/monitor/iotCameraIpcHistory/historyList",
    //       method:"get",
    //     }).then(({data})=>{
    //       if(data && data.success){
    //         var index = 0;
    //         this.cameraIpcHistorieList = [];
    //         if(data.cameraIpcHistorieList.length>0){
    //           for(var i = 0;i < data.cameraIpcHistorieList.length;i++){
    //             this.serialList[i].serial = data.cameraIpcHistorieList[i].deviceChannel
    //             this.codeList[i].code = data.cameraIpcHistorieList[i].channel
    //             this.cameraIpcHistorieList.push({
    //               channel:data.cameraIpcHistorieList[i].channel,
    //               deviceChannel:data.cameraIpcHistorieList[i].deviceChannel
    //             })
    //           }
    //           // data.cameraIpcHistorieList.forEach((item) => {
    //           //   this.cameraIpcHistorieList.push({
    //           //     channel:item.channel,
    //           //     deviceChannel:item.deviceChannel
    //           //   })
    //           // })
    //           // console.log(this.cameraIpcHistorieList,'这是摄像数组')
    //           // console.log(this.serialList)
    //           // console.log(this.codeList)
    //           this.getautoplay(index);
    //         }
    //       }
    //     })
    //   },
    //   getautoplay(index){
    //     // console.log(index,'index')
    //     console.log(this.players,'players')
    //     console.log('uuu')
    //     $.get("http://" + this.url + ":" + this.port + "/api/v1/stream/start", {
    //       serial: this.cameraIpcHistorieList[index].deviceChannel,
    //       code: this.cameraIpcHistorieList[index].channel,
    //     })
    //       .then((stream) => {
    //         var videoUrl = this.isMobile() ? stream.HLS : stream.RTMP;
    //         var protocol = this.isMobile() ? "HLS" : "RTMP";
    //         if (this.flvSupported()) {
    //           if (stream.WS_FLV && !this.isIE()) {
    //             videoUrl = stream.WS_FLV;
    //             protocol = "WS_FLV";
    //           } else if (stream.FLV) {
    //             videoUrl = stream.FLV;
    //             protocol = "FLV";
    //           }
    //         }
    //         if (this.isIE() && i > 0) {
    //           videoUrl = stream.HLS;
    //           protocol = "HLS";
    //         }
    //         var _protocol = String(this.protocol).toUpperCase();
    //         switch (_protocol) {
    //           case "RTMP":
    //             videoUrl = stream.RTMP || "";
    //             protocol = "RTMP";
    //             break;
    //           case "HLS":
    //             videoUrl = stream.HLS || "";
    //             protocol = "HLS";
    //             break;
    //           case "FLV":
    //             videoUrl = stream.FLV || "";
    //             protocol = "FLV";
    //             break;
    //           case "WS_FLV":
    //             videoUrl = stream.WS_FLV || "";
    //             protocol = "WS_FLV";
    //             break;
    //           case "WS-FLV":
    //             videoUrl = stream.WS_FLV || "";
    //             protocol = "WS_FLV";
    //             break;
    //         }
    //         // player.protocol = protocol;
    //         // player.poster = protocol == "RTMP" ? "" : stream.SnapURL;
    //         this.$nextTick(() => {
    //           this.players[index].url = videoUrl;
    //           index++;
    //           if(this.players.length == 16){
    //             if(index < this.cameraIpcHistorieList.length){
    //               this.getautoplay(index)
    //             }
    //           }else if(this.players.length == 9) {
    //             if(this.cameraIpcHistorieList.length < 9){
    //               if(index < this.cameraIpcHistorieList.length){
    //                 this.getautoplay(index)
    //               }
    //             }else {
    //               if(index < 9){
    //                 this.getautoplay(index)
    //               }
    //             }
    //           }else if(this.players.length == 4){
    //             if(this.cameraIpcHistorieList.length < 4){
    //               if(index < this.cameraIpcHistorieList.length){
    //                 console.log(index,'---->>>>>')
    //                 this.getautoplay(index)
    //               }
    //             }else {
    //               if(index < 4){
    //                 this.getautoplay(index)
    //               }
    //             }
    //           }
    //         });
    //         // this.resetCloseTimer(player);
    //       })
    //       .fail(() => {
    //         // player.bLoading = false;
    //         index++;
    //           if(this.players.length == 16){
    //             if(index < this.cameraIpcHistorieList.length){
    //               this.getautoplay(index)
    //             }
    //           }else if(this.players.length == 9) {
    //             if(this.cameraIpcHistorieList.length < 9){
    //               if(index < this.cameraIpcHistorieList.length){
    //                 this.getautoplay(index)
    //               }
    //             }else {
    //               if(index < 9){
    //                 this.getautoplay(index)
    //               }
    //             }
    //           }else if(this.players.length == 4){
    //             if(this.cameraIpcHistorieList.length < 4){
    //               if(index < this.cameraIpcHistorieList.length){
    //                 console.log(index,'---->>>>>')
    //                 this.getautoplay(index)
    //               }
    //             }else {
    //               if(index < 4){
    //                 this.getautoplay(index)
    //               }
    //             }
    //           }
    //       });
    //   },
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
      
      
      $.get('http://' + this.url + ':' + this.port + '/api/play/start/' + channel.devicechannel + '/' + channel.channel).then(stream => {
        console.log(stream, '点播开始-------------');
        // var videoUrl = this.isMobile() ? stream.HLS : stream.RTMP;
        // var protocol = this.isMobile() ? "HLS" : "RTMP";
        // if(this.flvSupported()) {
        //   if(stream.WS_FLV && !this.isIE()) {
        //     videoUrl = stream.WS_FLV;
        //     protocol = "WS_FLV";
        //   } else if(stream.FLV) {
        //     videoUrl = stream.FLV;
        //     protocol = "FLV";
        //   }
        // }
        // if(this.isIE() && i > 0) {
        //   videoUrl = stream.HLS;
        //   protocol = "HLS";
        // }
        // var _protocol = String(this.protocol).toUpperCase();
        // switch (_protocol) {
        //   case "RTMP":
        //     videoUrl = stream.RTMP || "";
        //     protocol = "RTMP";
        //     break;
        //   case "HLS":
        //     videoUrl = stream.HLS || "";
        //     protocol = "HLS";
        //     break;
        //   case "FLV":
        //     videoUrl = stream.FLV || "";
        //     protocol = "FLV";
        //     break;
        //   case "WS_FLV":
        //     videoUrl = stream.WS_FLV || "";
        //     protocol = "WS_FLV";
        //     break;
        //   case "WS-FLV":
        //     videoUrl = stream.WS_FLV || "";
        //     protocol = "WS_FLV";
        //     break;
        // }
        // player.protocol = protocol;
        // player.poster = protocol == "RTMP" ? "" : stream.SnapURL;

        // jessibuca播放器
        // this.$nextTick(() => {
        //   // player.url = videoUrl;
        //   // console.log(videoUrl, 'videoUrl===========');
        //   console.log(stream, 'stream in nextTick');
        //   this.players[index].url = stream.data.ws_flv
        //   console.log(this.players, index, 'videoUrl----------');
        // })

        // iframe
        this.$nextTick(() => {
          // player.url = videoUrl;
          this.players[index].url = 'ws://' + this.url +':' + this.port + channel.devicechannel + '_' + channel.channel + '.flv'
          let iframelink = '<iframe src="' + 'http://'+ this.url + ':'  + this.port + '/#/play/wasm/' + encodeURIComponent('ws://' + this.url + ':' + this.ws_port + '/rtp/' + channel.devicechannel + '_' + channel.channel + '.flv') + '" scrolling="no" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" width="100%" height="100%" frameborder="0" marginheight="0"></iframe>'
          console.log(this.$refs.videoAreaRef);
          this.$refs.videoAreaRef[index].innerHTML = iframelink
        })
        this.resetCloseTimer(player);
      }).fail(() => {
        player.bLoading = false;
      });

      this.inputForm.ipcId = channel.id
      this.inputForm.channel = channel.channel
      this.inputForm.deviceChannel = channel.deviceChannel
      console.log(this.inputForm)
      this.$http({
        url:"/monitor/iotCameraIpcHistory/save",
        method:'post',
        data:this.inputForm
      }).then(({data})=>{})
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
      if (this.codeList[this.index].code && this.serialList[this.index].serial) {
        if(this.appearanceTypeList[this.index].appearanceType != "1"){
          this.$message.warning("只有球机可控制预置位，请确认摄像头类型！")
          return
        }
        $.get('http://' + this.url + ':' + this.port + '/api/v1/control/preset', {
          serial: this.serialList[this.index].serial,
          channel: this.channel,
          code: this.codeList[this.index].code,
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
      if (this.codeList[this.index].code && this.serialList[this.index].serial) {
        this.routeIndex = seq
        this.showList = false
        this.showSet = true
        $.get('http://' + this.url + ':' + this.port + '/api/v1/control/navigate', {
          serial: this.serialList[this.index].serial,
          channel: this.channel,
          code: this.codeList[this.index].code,
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
      if (this.codeList[this.index].code && this.serialList[this.index].serial) {
        if(this.appearanceTypeList[this.index].appearanceType != "1"){
          this.$message.warning("只有球机可使用巡航，请确认摄像头类型！")
          return
        }
        $.get('http://' + this.url + ':' + this.port + '/api/v1/control/navigate', {
          serial: this.serialList[this.index].serial,
          channel: this.channel,
          code: this.codeList[this.index].code,
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
      if (this.codeList[this.index].code && this.serialList[this.index].serial) {
        $.get('http://' + this.url + ':' + this.port + '/api/v1/control/navigate', {
          serial: this.serialList[this.index].serial,
          channel: this.channel,
          code: this.codeList[this.index].code,
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
        serial: this.serialList[this.index].serial,
        channel: this.channel,
        code: this.codeList[this.index].code,
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
        serial: this.serialList[this.index].serial,
        channel: this.channel,
        code: this.codeList[this.index].code,
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
        serial: this.serialList[this.index].serial,
        channel: this.channel,
        code: this.codeList[this.index].code,
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
        serial: this.serialList[this.index].serial,
        channel: this.channel,
        code: this.codeList[this.index].code,
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
            serial: this.serialList[this.index].serial,
            code: this.codeList[this.index].code,
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
    ptzControl(leftright, updown, zoom, event) {
      if (this.codeList[this.index].code && this.serialList[this.index].serial) {
        if(this.appearanceTypeList[this.index].appearanceType != "1"){
          this.$message.warning("只有球机可使用云台控制，请确认摄像头类型！")
          return
        }
      //   $.post('http://' + this.url + ':' + this.port + '/api/ptz/control/' + this.serialList[this.index].serial + '/' + this.codeList[this.index].code + '?command=' + cmd , {
      //   // serial: this.serialList[this.index].serial,
      //   // code: this.codeList[this.index].code,
      //   command: cmd,
      //   // token: this.token
      // })
      $.ajax({
        url: 'http://' + this.url + ':' + this.port + '/api/ptz/control/' + this.serialList[this.index].serial + '/' + this.codeList[this.index].code + '?cmdCode=' + (zoom * 16 + updown * 4 + leftright) + '&horizonSpeed=' + this.controlSpeed + '&verticalSpeed=' + this.controlSpeed + '&zoomSpeed=' + this.controlSpeed,
        type: 'post'
      })
      $(event.target).closest('.ptz-cell').addClass("active");
      } else {
        this.$message({
          type: 'error',
          message: "请先选择一个摄像头"
        })
      }
      // this.ptzStop()
    },
    ptzStop(leftright, updown, zoom) {
      if ($(this.$el).find(".ptz-cell.active").length > 0) {
        $.ajax({
          url: 'http://' + this.url + ':' + this.port + '/api/ptz/control/' + this.serialList[this.index].serial + '/' + this.codeList[this.index].code + '?cmdCode=' + (zoom * 16 + updown * 4 + leftright) + '&horizonSpeed=' + this.controlSpeed + '&verticalSpeed=' + this.controlSpeed + '&zoomSpeed=' + this.controlSpeed,
          type: 'post'
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
      return `${protocal}//${location.host}/api/v1/control/ws-talk/${this.serialList[this.index].serial}/${this.codeList[this.index].code}?format=pcm`;
    },
    closeVideo: function (idx) {
      this.appearanceTypeList[idx].appearanceType = ''
      this.$refs.videoAreaRef[idx].innerHTML = '<div style="color:#fff;margin:auto;">无信号</div>'
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
    fullscreen() {
      if (this.isMobile()) {
        this.$message({
          type: "error",
          message: "请在电脑浏览器上使用该功能"
        });
        return;
      }
      this.$fullscreen.enter(this.$el.querySelector(`.video-show > .video-window`), {
        wrap: false
      });
    },
    videoError: function (e) {
            console.log("播放器错误：" + JSON.stringify(e));
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
// @import url(~assets/styles/variables.less);

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
    // .one-window {
    //   height: 100%;
    // }
    // .four-window {
    //   height: 50%;
    // }
    // .nine-window {
    //   height: 33%;
    // }
    // .sixteen-window {
    //   height: 25%;
    // }
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

  // .el-button--primary {
  //   // color: @base;
  //   // background: #ffffff;
  //   // border: 1px solid #dcdfe6 !important;
  // }

  .active {
    // background-color: @base-active;
    background-color: #153B53;
    color: #00E5FF;
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
  z-index: 99999;
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
  /* width: 17%; */
  height: 20%;
  text-align: center;
  font-size: 24px;
  // background: fade(#eee, 0%);
  background: rgb(230,239,249);
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
