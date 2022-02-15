<template>
  <div>
    <el-row :gutter="15">
      <el-col :span="24">
        <span>{{ siteName }}设备总览</span>
        <!-- <el-button class="room-btn" type="primary">
            <i class="fa fa-refresh"></i>刷新
          </el-button> -->
        <el-button class="room-btn" type="primary" @click="backToUp">
          <i class="fa fa-mail-reply"></i>返回
        </el-button>
      </el-col>
    </el-row>
    <el-row :gutter="15">
      <el-col :span="18">
        <el-row :gutter="15">
          <el-col :span="6" class="tree-container">
            <el-card class="tree-card">
              <el-tree
                class="filter-tree"
                :data="condition"
                :indent="2"
                show-checkbox
                node-key="id"
                :default-expand-all="true"
                :default-checked-keys="checkedKey"
                :props="defaultProps"
                @check="nodeChecked"
                @node-click="nodeClicked"
                ref="devTreeRef"
                :key="treeKey"
              >
              </el-tree>
            </el-card>
          </el-col>
          <el-col :span="18">
            <div style="margin:0 0 30px 15px;">
              <el-button type="primary" icon="el-icon-refresh" @click="toggleIndicatorShow">切换指标显示</el-button>
            </div>
            <div id="canvas" style="position: relative" v-loading="deviceLoading">
              <img
                ref="roomImg"
                :src="siteImg"
                style="width: 100%;"
                v-if="siteImg"
              />
              <template v-for="(item, index) in deviceInfo">
                <deviceImg
                  :key="item.id"
                  :deviceData="item"
                  :width="120"
                  :height="80"
                  :id="index"
                  :isShow="textShow"
                  :isDraggable="isDraggable"
                  :indicatorShow="indicatorShow"
                  :clickDevId="clickDevId"
                ></deviceImg>
              </template>
            </div>
          </el-col>
          <el-col :span="24" style="margin-top: 20px">
            <el-table :data="allAlarmInfo" border :cell-class-name="cellClass" @row-click="alarmRowClick">
              <el-table-column
                prop="nmalarmId"
                label="告警ID"
                align="center"
                sortable
              ></el-table-column>
              <el-table-column
                prop="deviceCode"
                label="设备编号"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="deviceName"
                label="设备名称"
                align="center"
              ></el-table-column>
              <!-- <el-table-column
                prop="alarmCode"
                label="告警编码"
                align="center"
              ></el-table-column> -->
              <el-table-column
                prop="alarmLevel"
                label="告警等级"
                align="center"
                :formatter="setLevel"
              ></el-table-column>
              <el-table-column
                prop="dealStatus"
                label="告警状态"
                align="center"
                :formatter="setStatus"
              ></el-table-column>
              <!-- <el-table-column
                prop="reportStatus"
                label="上报状态"
                align="center"
              ></el-table-column>
               -->
              <el-table-column
                prop="alarmTypeDesc"
                label="告警分类"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="alarmCodeDesc"
                label="告警标准名称"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="alarmDesc"
                label="告警详情"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="alarmTime"
                label="告警上报时间"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="alarmEndTime"
                label="告警消除时间"
                align="center"
              ></el-table-column>
              <!-- <el-table-column
                prop="alarmFlag"
                label="告警标识"
                align="center"
              ></el-table-column> -->
              <!-- <el-table-column
                prop="dealStatus"
                label="是否处理"
                align="center"
                :formatter="setStatus"
              ></el-table-column> -->
              <!-- <el-table-column
                prop="paramsName"
                label="参数名称"
                align="center"
              ></el-table-column> -->
              <el-table-column
                prop="eventValue"
                label="参数值"
                align="center"
              ></el-table-column>
              <!-- <el-table-column
                prop="siteName"
                label="所属位置"
                align="center"
              ></el-table-column> -->
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <span
                    class="table-action"
                    @click="deviceAction(scope.row, 1)"
                    v-if="scope.row.dealStatus === '0'"
                    >确认</span
                  >
                  <!-- <span
                    class="table-action"
                    @click="deviceAction(scope.row,2)"
                    v-if="scope.row.dealStatus === '1'"
                    >消除</span
                  > -->
                </template>
              </el-table-column>
            </el-table>
            <Pagination
              :page="allAlarmPage"
              :size="allAlarmSize"
              :total="allAlarmTatal"
              @pagination="queryByPage"
            ></Pagination>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row :gutter="15" class="dev-row">
          <el-col :span="24">
            <el-tabs v-model="radioBtn" @tab-click="changeComponent">
              <el-tab-pane label="设备信息" name="1">
                <DeviceInfo :devData="devData" :key="childKey"></DeviceInfo>
              </el-tab-pane>
              <el-tab-pane label="历史事件" name="2">
                <EventHistory
                  :eventLogInfo="eventLogInfo"
                  :key="eventLogKey"
                ></EventHistory>
              </el-tab-pane>
              <el-tab-pane label="告警历史" name="3">
                <AlarmHistory
                  :oneAlarmInfo="oneAlarmInfo"
                  :key="oneAlarmKey"
                ></AlarmHistory>
              </el-tab-pane>
            </el-tabs>
          </el-col>
          <el-col :span="24"></el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="24">
            <el-tabs v-model="teleRadioBtn" @tab-click="changeTeleComponent">
              <el-tab-pane label="遥测信息" name="1">
                <TmyInfo
                  :teleData="teleData"
                  :deviceName="deviceName"
                ></TmyInfo>
              </el-tab-pane>
              <el-tab-pane label="遥信信息" name="2">
                <TsgInfo :tsgData="tsgData"></TsgInfo>
              </el-tab-pane>
              <el-tab-pane label="遥控操作" name="3">
                <RTO :rtoData="rtoData"></RTO>
              </el-tab-pane>
              <el-tab-pane label="遥调操作" name="4">
                <RCO :rcoData="rcoData" :key="rcoKey"></RCO>
              </el-tab-pane>
            </el-tabs>
          </el-col>
          <el-col :span="24"></el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-dialog
      title="视频监控信息"
      :visible.sync="dialogVisible"
      width="40%"
      :close-on-click-modal="false"
      @close="videoClose"
    >
      <!-- iframe方式 -->
      <LivePlayer :autoplay="true" :video-url="playerUrl" :live="true" :muted="true"></LivePlayer>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="videoClose"
          >关 闭</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import deviceImg from "@/components/DrawCanvas/deviceImg";
import DeviceInfo from "./DeviceInfo";
import EventHistory from "./EventHistory";
import AlarmHistory from "./AlarmHistory";
import TmyInfo from "./TmyInfo"; //遥测信息
import TsgInfo from "./TsgInfo"; //遥信信息
import RTO from "./RTO"; //遥调操作
import RCO from "./RCO"; //遥控操作


import LivePlayer from "@liveqing/liveplayer";

import {
  sdcDeviceModeAction,
  getSdcDeviceModeTable,
} from "@/api/sdc/brandInfo";
import {
  getSdcDeviceTable,
  getDevTreeBySiteId,
  getTeleInfoByDevice,
  getSdcDeviceTableBy,
  getDeviceEventLog,
  getAlarmLog,
  updateAlarmLog,
  getAllDevInfoBySiteId,
  getAllIndicatorBySiteId,
  getAllInfoByDevIds,
  getSdcNVRInfo
} from "@/api/sdc/deviceInfo";
import eventBus from "@/util/eventBus";

import moment from "moment";
import { getSystemList } from "@/api/sdc/deviceType";

import video01 from "@/assets/video/video.mp4";

import Pagination from "@/components/Pagination";
import { index } from 'd3-array';
import _ from "lodash"
export default {
  name: "RoomList",
  props: ["systemFlag", "siteId", "siteImg", "siteName", "addressId", "typeId"],
  components: {
    deviceImg,
    DeviceInfo,
    EventHistory,
    AlarmHistory,
    TmyInfo,
    TsgInfo,
    RTO,
    RCO,
    LivePlayer,
    Pagination,
  },
  data() {
    return {
      isDraggable: false,
      videoUrl: null,
      dialogVisible: false,
      deviceKey: null,
      childKey: Math.random().toString(36).slice(-6),
      teleKey: Math.random().toString(36).slice(-6),
      treeKey: Math.random().toString(36).slice(-6),
      currentDevComponent: "DeviceInfo",
      radioBtn: "1",
      teleRadioBtn: "1",
      currentTeleComponent: "",
      teleData: [],
      tsgData: [],
      rtoData: [],
      rcoData: [],
      rcoKey: Math.random().toString(36).slice(-6),
      defaultProps: {
        children: "children",
        label: "name",
      },
      condition: [],
      checkedKey: [],
      devData: null,
      deviceInfo: [],
      alarmInfo: [], //告警详情信息
      sysTypeMap: [],
      deviceName: null,
      textShow: true,
      indicatorShow: true,
      // 视频数据
      url : this.$dictUtils.getDictValue("vedio_param", "url_ip", ""),
      port: this.$dictUtils.getDictValue("vedio_param", "port", ""),
      ws_port: this.$dictUtils.getDictValue("vedio_param", "ws_port", ""),
      eventLogPage: 1,
      eventLogSize: 5,
      eventLogInfo: null,
      eventLogKey: Math.random().toString(36).slice(-6),
      allAlarmPage: 1,
      allAlarmSize: 5,
      allAlarmTatal: 0,
      allAlarmKey: Math.random().toString(36).slice(-6),
      allAlarmInfo: null,
      oneAlarmPage: 1,
      oneAlarmSize: 5,
      oneAlarmTatal: 0,
      oneAlarmKey: Math.random().toString(36).slice(-6),
      oneAlarmInfo: null,
      teleId: null,
      queryConditionMap: [],
      clickDevId: '',
      intervalTime: this.$dictUtils.getDictValue('monitor_interval_time','interval_time', ''),
      allDevInfo: [],
      allIndicatorInfo: [],
      deviceLoading: true,
      playerUrl: ''
    };
  },
  created() {
    this.getSystemList();
    this.init();

  },
  activated() {
    // this.getAllInfo()
    this.eventBusOn()
  },
  deactivated() {
    eventBus.$off()
    clearInterval(this.$store.state.user.realTimer)
  },
  beforeDestroy() {
    eventBus.$off()
    clearInterval(this.$store.state.user.realTimer)
  },
  mounted() {
    // this.getAllInfo();
    this.eventBusOn()
  },
  methods: {
    eventBusOn() {
      eventBus.$on("queryAlarmByPage", (res) => {
        this.oneAlarmPage = res.page;
        this.oneAlarmSize = res.size;
        this.queryAlarmLog(res.id);
      });
      eventBus.$on("queryLogByPage", (res) => {
        this.eventLogPage = res.page;
        this.eventLogSize = res.size;
        this.queryDeviceEventLog(res.id);
      });
      eventBus.$on("updateTeleData", (result) => {
        //查询当前房间所有设备
        if (this.typeId) {
          getSdcDeviceTableBy(1, 1000, "", this.siteId, this.systemFlag, this.typeId[this.typeId.length - 1] )
            .then(res => {
              this.deviceInfo = res.data.data.records;
              this.findData(this.deviceInfo, result.id);
            })
        } else {
          getSdcDeviceTableBy(1, 1000, "", this.siteId, this.systemFlag, "" )
            .then(res => {
              this.deviceInfo = res.data.data.records;
              this.findData(this.deviceInfo, result.id);
            })
        }
        this.queryTeleMsg(res.id)
      });
      eventBus.$on("updateDevData", (res) => {
        if (res.system === "4" && (res.type === "0" || res.type === "1")) {
          getSdcDeviceTable({ videoType: "1", id: res.id }).then((videoRes) => {
            let devData = videoRes.data.data.records[0]
            let devChannel = devData.devicechannel
            let channel = devData.channel
            this.dialogVisible = true
            if (devData.videoSourceType === '1') {
              $.get('http://' + this.url + ':' + this.port + '/api/play/start/' + devChannel + '/' + channel).then(stream => {
                // iframe
                // this.$nextTick(() => {
                //   this.players[index].url = 'ws://' + this.url +':' + this.port + channel.devicechannel + '_' + channel.channel + '.flv'
                //   let iframelink = '<iframe src="' + 'http://'+ this.url + ':'  + this.port + '/#/play/wasm/' + encodeURIComponent('ws://' + this.url + ':' + this.ws_port + '/rtp/' + channel.devicechannel + '_' + channel.channel + '.flv') + '" scrolling="no" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" width="100%" height="100%" frameborder="0" marginheight="0"></iframe>'
                //   this.$refs.videoAreaRef[index].innerHTML = iframelink
                // })
                // this.resetCloseTimer(player);
              }).fail(() => {
                this.$message.error('获取视频出错，请重试')
              });
            } else {
              this.playerUrl = 'http://' + this.url +':' + this.ws_port + '/' + devData.streamApp + '/' + devData.streamId + '.live.mp4'
            }
          });
        }
        // eventBus.$emit('removeImgClass', res.id)
        this.clickDevId = res.id
        this.findData(this.deviceInfo, res.id);
        this.childKey = new Date().toString();
        this.deviceName = res.name;
        this.queryTeleMsg(res.id)
        this.getAllInfo(res.id);
      });
    },
    getAllInfo(id) {
      if (this.$store.state.user.realTimer) {
        clearInterval(this.$store.state.user.realTimer)
      }
      this.$store.state.user.realTimer = setInterval(() => {
        this.queryTeleMsg(id)
        this.queryAlarmLog();
      }, this.intervalTime);
    },
    //查询物模型属性
    async queryTeleInfo() {
      let teleData = [],
          tsgData = [],
          rcoData = []
        let teleQueryMsg = await getTeleInfoByDevice(this.teleId);
        for (let j = 0; j < teleQueryMsg.data.data.records.length; j++) {
          const el = teleQueryMsg.data.data.records[j];
          if (el.type === "3") {
            teleData.push(el);
          } else if (el.type === "4") {
            tsgData.push(el);
          } else if (el.type === "1") {
            rcoData.push(el);
          }
        }
        this.teleData = teleData;
        this.tsgData = tsgData;
        this.rcoData = rcoData
    },
    async init() {
      let brandQueryInfo = await getDevTreeBySiteId(
        this.siteId,
        this.systemFlag
      );
      this.condition = brandQueryInfo.data.data;
      //查询当前房间所有设备
      // let queryDevInfo = this.typeId
      //   ? await getSdcDeviceTableBy(
      //       1,
      //       1000,
      //       "",
      //       this.siteId,
      //       this.systemFlag,
      //       this.typeId[this.typeId.length - 1]
      //     )
      //   : await getSdcDeviceTableBy(
      //       1,
      //       1000,
      //       "",
      //       this.siteId,
      //       this.systemFlag,
      //       ""
      //     );
      // let deviceInfo = queryDevInfo.data.data.records;
      // //设置默认选择的设备及属性信息
      // for (let index = 0; index < deviceInfo.length; index++) {
      //   const element = deviceInfo[index];
      //   this.setCheckedTree(this.condition, element.id);
      // }
      
      // getAllDevInfoBySiteId(this.siteId, this.systemFlag).then(res => {
      //   if (res.data.code === 0) {
      //     this.deviceInfo = res.data.data
      //     this.deviceLoading = false
      //   }
      // })



      Promise.all([getAllDevInfoBySiteId(this.siteId, this.systemFlag), getAllIndicatorBySiteId(this.siteId, this.systemFlag)]).then(res => {
        this.allDevInfo = res[0].data.data
        this.allIndicatorInfo = res[1].data.data
        this.deviceLoading = false
        let deviceInfoTemp = []
        this.allDevInfo.forEach(item => {
          this.setCheckedTree(this.condition, item.key)
          this.allIndicatorInfo.forEach(ele => {
            if (item.key === ele.key) {
              item.values.teleData = ele.values
            }
          })
        })
        this.allDevInfo.forEach(item => {
          deviceInfoTemp.push(item.values)
        })
        this.deviceInfo = deviceInfoTemp
        this.deviceInfo[0].clickFlag = true
        this.clickDevId = this.deviceInfo[0].id
        this.devData = this.deviceInfo[0];
        this.deviceName = this.deviceInfo[0].name
        this.queryTeleMsg(this.deviceInfo[0].id)
        this.getAllInfo(this.deviceInfo[0].id)
        this.queryConditionMap = this.checkedKey
        this.treeKey = new Date().toString();
        this.deviceKey = new Date().toString();
        this.devData.systemFlag = this.typeTranslate(this.systemFlag);
        this.teleId = this.devData.id;
        this.queryDeviceEventLog(this.devData.id);
        this.queryAlarmLog(this.devData.code);
        this.queryAlarmLog();
      })
      
    },
    async queryDeviceEventLog(id) {
      let queryData = await getDeviceEventLog({
        current: this.eventLogPage,
        size: this.eventLogSize,
        deviceId: id,
        descs: 'update_date'
      });
      this.eventLogInfo = queryData.data.data;
      this.eventLogKey = new Date().toString();
    },
    async queryAlarmLog(id) {
      if (id) {
        let queryData = await getAlarmLog({
          current: this.oneAlarmPage,
          size: this.oneAlarmSize,
          deviceCode: id,
        });
        this.oneAlarmInfo = queryData.data.data;
        this.oneAlarmKey = new Date().toString();
      } else {
        let queryAllData = await getAlarmLog({
          current: this.allAlarmPage,
          size: this.allAlarmSize,
          siteId: this.siteId
        });
        this.allAlarmInfo = queryAllData.data.data.records;
        this.allAlarmKey = new Date().toString();
        this.setpage(queryAllData.data.data);
      }
    },
    setOnePage(data) {
      this.oneAlarmPage = data.current;
      this.oneAlarmSize = data.size;
      this.oneAlarmTatal = data.total;
    },
    setpage(data) {
      this.allAlarmPage = data.current;
      this.allAlarmSize = data.size;
      this.allAlarmTatal = data.total;
    },
    queryByPage(data) {
      this.allAlarmPage = data.page;
      this.allAlarmSize = data.size;
      this.queryAlarmLog();
    },
    setCheckedTree(tree, id) {
      for (let index = 0; index < tree.length; index++) {
        const el = tree[index];
        if (el.id === id) {
          this.checkedKey.push(id);
        } else {
          if (el.children.length !== 0) {
            this.setCheckedTree(el.children, id);
          }
        }
      }
    },
    //递归遍历数据
    findData(tableData, id) {
      for (let index = 0; index < tableData.length; index++) {
        const element = tableData[index];
        if (element.id === id) {
          this.teleId = id;
          this.devData = null;
          this.devData = element;
          this.devData.systemFlag = this.typeTranslate(this.systemFlag);
          this.queryDeviceEventLog(this.devData.id);
          this.queryAlarmLog(this.devData.code);
        }
      }
    },
    //转换表格中siteType的显示
    typeTranslate(type) {
      let rowText;
      for (let i = 0; i < this.sysTypeMap.length; i++) {
        let el = this.sysTypeMap[i];
        if (el.value === type) {
          rowText = el.label;
          break;
        }
      }
      return rowText;
    },
    async getSystemList() {
      let sysList = await getSystemList();
      for (let index = 0; index < sysList.data.data.length; index++) {
        const el = sysList.data.data[index];
        this.sysTypeMap.push({
          value: el.value,
          label: el.description,
        });
      }
    },
    //查询遥测信息
    async queryTeleMsg(id) {
      let teleData = [],
        tsgData = [],
        rtoData = [],
        rcoData = [];

      let teleQueryMsg = await getTeleInfoByDevice(id);
      for (let j = 0; j < teleQueryMsg.data.data.records.length; j++) {
        const el = teleQueryMsg.data.data.records[j];
        if (el.type === "3") {
          teleData.push(el);
        } else if (el.type === "4") {
          tsgData.push(el);
        } else if (el.type === "2") {
          rtoData.push(el);
        } else if (el.type === "1") {
          rcoData.push(el);
        }
      }
      this.teleData = teleData;
      this.tsgData = tsgData;
      this.rtoData = rtoData;
      this.rcoData = rcoData;
      let devInfo = _.cloneDeep(this.deviceInfo)
      for (let i = 0;i < devInfo.length;i++) {
        let ele = devInfo[i]
        if (ele.id === id) {
          ele.teleData = teleData
        }
      }
      this.deviceInfo = devInfo
      this.deviceInfo.forEach(item => {
        if (item.id === this.clickDevId) {
          item.clickFlag = true
        } else {
          item.clickFlag = false
        }
      })
      this.rcoKey = new Date().toString()
    },
    async nodeChecked(val, node) {
      //获取设备id
      let queryConditionMap = [];
      let checkedNodes = this.$refs.devTreeRef.getCheckedNodes(true)
      if (checkedNodes.length !== 0) {
        for (let index = 0; index < checkedNodes.length; index++) {
          const el = checkedNodes[index];
          if (el.type !== "1" && el.type !== "2") {
            queryConditionMap.push(el.id);
          }
        }
      }
      this.queryConditionMap = queryConditionMap
      let findRes = this.queryConditionMap.find(item => item === this.clickDevId)
      if(!findRes) {
        this.clickDevId = ''
      }
      this.getDevsByCheckedNode()
    },
    // 点击树节点
    nodeClicked(data, node) {
      if (data.noteType === 'device') {
        if (!node.checked) {
          this.$refs.devTreeRef.setChecked(data.id, true)
          let queryConditionMap = [];
          let checkedNodes = this.$refs.devTreeRef.getCheckedNodes(true)
          if (checkedNodes.length !== 0) {
            for (let index = 0; index < checkedNodes.length; index++) {
              const el = checkedNodes[index];
              if (el.type !== "1" && el.type !== "2") {
                queryConditionMap.push(el.id);
              }
            }
          }
          this.queryConditionMap = queryConditionMap
          getAllInfoByDevIds(this.queryConditionMap).then(res => {
            if (res.data.code === 0) {
              let indicator = res.data.data.indicator
              let device = res.data.data.device
              let deviceInfoTemp = []
              device.forEach(item => {
                indicator.forEach(ele => {
                  if (item.key === ele.key) {
                    item.values.teleData = ele.values
                  }
                })
              })
              device.forEach(item => {
                deviceInfoTemp.push(item.values)
              })
              this.deviceInfo = []
              this.deviceInfo.push(...deviceInfoTemp)
              this.deviceInfo.forEach(item => {
                if (item.id === data.id) {
                  item.clickFlag = true
                  this.devData = item;
                  this.devData.systemFlag = this.typeTranslate(this.systemFlag);
                  this.queryDeviceEventLog(item.id);
                  this.queryAlarmLog(this.devData.code);
                  this.deviceName = item.name;
                  this.queryTeleMsg(item.id)
                  this.getAllInfo(item.id)
                }
              })
              this.clickDevId = data.id
              getSdcNVRInfo(data.id).then(res => {
              if (res.data.code === 0) {
                let devdata = res.data.data
                if (devdata.sysCode === "4" && (devdata.videoType === "0" || devdata.videoType === "1")) {
                  getSdcDeviceTable({ videoType: "1", id: devdata.id }).then((videoRes) => {
                    let devChannel = videoRes.data.data.records[0].devicechannel
                    let channel = videoRes.data.data.records[0].channel
                    $.get('http://' + this.url + ':' + this.port + '/api/play/start/' + devChannel + '/' + channel).then(stream => {
                      this.dialogVisible = true
                      // iframe
                      this.$nextTick(() => {
                        let iframelink = '<iframe src="' + 'http://'+ this.url + ':'  + this.port + '/#/play/wasm/' + encodeURIComponent('ws://' + this.url + ':' + this.ws_port + '/rtp/' + devChannel + '_' + channel + '.flv') + '" scrolling="no" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" width="100%" height="100%" frameborder="0" marginheight="0"></iframe>'
                        this.$refs.videoAreaRef.innerHTML = iframelink
                      })
                    })
                  })
                }
              }
            })
              // this.clickDevId = data.id
              this.findData(this.deviceInfo, data.id);
              this.childKey = new Date().toString();
              this.deviceName = data.name;
              this.queryTeleMsg(data.id)
              this.getAllInfo(data.id);
            }
          })
        } else {
          getSdcNVRInfo(data.id).then(res => {
            if (res.data.code === 0) {
              let devdata = res.data.data
              if (devdata.sysCode === "4" && (devdata.videoType === "0" || devdata.videoType === "1")) {
                getSdcDeviceTable({ videoType: "1", id: devdata.id }).then((videoRes) => {
                  let devData = videoRes.data.data.records[0]
                  let devChannel = devData.devicechannel
                  let channel = devData.channel
                  this.dialogVisible = true
                  if (devData.videoSourceType === '1') {
                    $.get('http://' + this.url + ':' + this.port + '/api/play/start/' + devChannel + '/' + channel).then(stream => {
                      // iframe
                      // this.$nextTick(() => {
                      //   this.players[index].url = 'ws://' + this.url +':' + this.port + channel.devicechannel + '_' + channel.channel + '.flv'
                      //   let iframelink = '<iframe src="' + 'http://'+ this.url + ':'  + this.port + '/#/play/wasm/' + encodeURIComponent('ws://' + this.url + ':' + this.ws_port + '/rtp/' + channel.devicechannel + '_' + channel.channel + '.flv') + '" scrolling="no" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" width="100%" height="100%" frameborder="0" marginheight="0"></iframe>'
                      //   this.$refs.videoAreaRef[index].innerHTML = iframelink
                      // })
                      // this.resetCloseTimer(player);
                    }).fail(() => {
                      this.$message.error('获取视频出错，请重试')
                    });
                  } else {
                    this.playerUrl = 'http://' + this.url +':' + this.ws_port + '/' + devData.streamApp + '/' + devData.streamId + '.live.mp4'
                  }
                })
              }
            }
          })
            this.clickDevId = data.id
            this.findData(this.deviceInfo, data.id);
            this.childKey = new Date().toString();
            this.deviceName = data.name;
            this.queryTeleMsg(data.id)
            this.getAllInfo(data.id);
        } 
      }
    },
    // 根据设备树形结构选中的点并发查询设备数据
    async getDevsByCheckedNode() {
      if (this.queryConditionMap.length !== 0) {
        getAllInfoByDevIds(this.queryConditionMap).then(res => {
          if (res.data.code === 0) {
            let indicator = res.data.data.indicator
            let device = res.data.data.device
            let deviceInfoTemp = []
            device.forEach(item => {
              indicator.forEach(ele => {
                if (item.key === ele.key) {
                  item.values.teleData = ele.values
                }
              })
            })
            device.forEach(item => {
              deviceInfoTemp.push(item.values)
            })
            this.deviceInfo = []
            this.deviceInfo.push(...deviceInfoTemp) 
            if (this.clickDevId) {
              this.deviceInfo.forEach(item => {
                if (item.id === this.clickDevId) {
                  item.clickFlag = true
                  this.devData = item;
                  this.devData.systemFlag = this.typeTranslate(this.systemFlag);
                  this.queryDeviceEventLog(item.id);
                  this.queryAlarmLog(this.devData.code);
                  this.deviceName = item.name;
                  this.queryTeleMsg(item.id)
                  this.getAllInfo(item.id)
                }
              })
            } else {
              this.deviceInfo[0].clickFlag = true
              this.clickDevId = this.deviceInfo[0].id
              this.devData = this.deviceInfo[0];
              this.deviceName = this.deviceInfo[0].name;
              this.queryTeleMsg(this.deviceInfo[0].id)
              this.getAllInfo(this.deviceInfo[0].id)
              this.devData.systemFlag = this.typeTranslate(this.systemFlag);
              this.queryDeviceEventLog(this.deviceInfo[0].id);
              this.queryAlarmLog(this.devData.code);
            }
          }
        })
      } else {
        this.deviceInfo = [];
        this.devData = null;
        this.teleData = [];
        this.tsgData = [];
        this.rtoData = [];
        this.rcoData = [];
      }
      // this.deviceKey = new Date().toString();
    },
    changeComponent() {
      switch (this.radioBtn) {
        case "1":
          this.currentDevComponent = "DeviceInfo";
          break;
        case "2":
          this.currentDevComponent = "EventHistory";
          break;
        case "3":
          this.currentDevComponent = "AlarmHistory";
          break;
      }
    },
    //返回上层
    backToUp() {
      this.$emit("changeComponent", {
        currentComponent: "RoomOverview",
        roomInfo: {},
        addressId: this.addressId,
        typeId: this.typeId,
      });
    },
    changeTeleComponent() {},
    changePos() {},
    deviceAction(val, flag) {
      let data = val;
      data.dealStatus = flag === 1 ? "1" : "2";
      updateAlarmLog(data).then((res) => {
        this.queryAlarmLog();
      });
    },
    setLevel(row) {
      let plateColorMap = this.$dictUtils.getDictList("alarm_level");
      let rowText;
      for (let i = 0; i < plateColorMap.length; i++) {
        let el = plateColorMap[i];
        if (el.value === row.alarmLevel) {
          rowText = el.label;
          break;
        }
      }
      return rowText;
    },
    setStatus(row) {
      let plateColorMap = this.$dictUtils.getDictList("tele_alarm_deal_status");
      let rowText;
      for (let i = 0; i < plateColorMap.length; i++) {
        let el = plateColorMap[i];
        if (el.value === row.dealStatus) {
          rowText = el.label;
          break;
        }
      }
      return rowText;
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.dealStatus === "0") {
        if (row.alarmLevel === "1") {
          return "alarm1";
        } else if (row.alarmLevel === "2") {
          return "alarm2";
        } else if (row.alarmLevel === "3") {
          return "alarm3";
        } else if (row.alarmLevel === "4") {
          return "alarm4";
        }
      }
      return "";
    },
    //表格栏位颜色
    cellClass({ row, column, rowIndex, columnIndex }) {
      let alarmTime = moment(row.createDate);
      let now = moment();
      if (columnIndex === 3) {
        if (row.alarmLevel === "1") {
          if (now.diff(alarmTime, "seconds") < 30 && row.dealStatus === "0") {
            return "new-alarm";
          } else {
            return "alarm1";
          }
        } else if (row.alarmLevel === "2") {
          if (now.diff(alarmTime, "seconds") < 30 && row.dealStatus === "0") {
            return "new-alarm";
          } else {
            return "alarm2";
          }
        } else if (row.alarmLevel === "3") {
          if (now.diff(alarmTime, "seconds") < 30 && row.dealStatus === "0") {
            return "new-alarm";
          } else {
            return "alarm3";
          }
        } else if (row.alarmLevel === "4") {
          if (now.diff(alarmTime, "seconds") < 30 && row.dealStatus === "0") {
            return "new-alarm";
          } else {
            return "alarm4";
          }
        }
      }
    },
    alarmRowClick(row) {
      // this.alarmRowDevId = row.deviceId
      this.deviceInfo.forEach(item => {
        if (item.id === row.deviceId) {
          this.clickDevId = row.deviceId
          // eventBus.$emit('alarmRowClick', row.deviceId)
          item.clickFlag = true
          this.findData(this.deviceInfo, item.id);
          this.deviceName = item.name;
          this.queryTeleMsg(item.id)
          this.getAllInfo(item.id);
        }
      })
      // this.deviceInfo.some(item => {
      //       if (item.id === row.deviceId) {
      //         item.clickFlag = true
      //         this.findData(this.deviceInfo, item.id);
      //         this.deviceName = item.name;
      //         this.queryTeleMsg(item.id)
      //         this.getAllInfo(item.id);
      //       }
      //     })
    },
    videoClose() {
      this.dialogVisible = false
      // this.$refs.videoAreaRef.innerHTML = `<div style="color:#fff;margin:auto;">无信号</div>`
      this.playerUrl = ''
    },
    toggleIndicatorShow() {
      this.indicatorShow = !this.indicatorShow
    }
  },
};
</script>

<style lang="scss" scoped>
.tree-container {
  // border: 1px solid #eee;
  height:735px;
  .tree-card {
    overflow: auto;
    width: 300px;
    height: calc(100% - 45px);
    .filter-tree {
      min-width: 100%;
      margin-left: -30px;
      display: inline-block;
      overflow: auto;
      margin-top: 12px;
    }
  }
}
.room-btn {
  float: right;
  margin: 10px;
}
.dev-row {
  min-height: 350px;
}
.el-table .alarm1 {
  color: #990000;
}
.el-table .alarm2 {
  color: #bb0000;
}
.el-table .alarm3 {
  /* background-color: #cc0000; */
  color: #cc0033;
}
.el-table .alarm4 {
  /* background-color: #dd0000; */
  color: #ff0066;
}

.el-table .new-alarm {
  /* background-color: #cc0000; */
  background: #aa0000;
  animation: mymove 3s infinite;
  /*Safari 和 Chrome:*/
  -webkit-animation: mymove 3s infinite;
  color: #ffffff;
}

/* Chrome, Safari, Opera */
@-webkit-keyframes mymove {
  50% {
    background-color: #ff0033;
  }
}

/* Standard syntax */
@keyframes mymove {
  50% {
    background-color: #ff0033;
  }
}
</style>
