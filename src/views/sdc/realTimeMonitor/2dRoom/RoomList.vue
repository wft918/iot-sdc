<template>
  <div class="fullscreen-wrapper">
    <el-row :gutter="15">
      <el-col :span="24">
        <span>{{ siteName }}设备总览</span>
        <el-button v-if="!isfullscreen" class="room-btn" size="small" @click="backToUp">
          <i class="el-icon-back"></i>返回
        </el-button>
        <el-button v-if="!isfullscreen" class="room-btn" size="small" @click="toggle">
          <i class="el-icon-full-screen"></i> 全屏
        </el-button>
        <el-button v-else class="room-btn" size="small" @click="toggle">
          <i class="el-icon-switch-button"></i> 退出
        </el-button>
      </el-col>
    </el-row>
    <el-row :gutter="15">
      <el-col :span="4">
        <el-card style="overflow-y: auto;width: 100%;height: 650px;margin-left:-10px;">
          <el-tag
            size="small" 
            style="margin-bottom:5px"
            v-if="selectName"
            :disable-transitions="false">
            {{selectName}}
          </el-tag>
          <el-tree
            :data="condition"
            :indent="1"
            node-key="id"
            :default-expand-all="false"
            :default-expanded-keys="expandKeys"
            :props="defaultProps"
            accordion
            @node-click="nodeClicked"
            ref="devTreeRef"
            :key="treeKey"
            style="margin-left:-30px;"
          >
            <span class="custom-tree-node" slot-scope="{ node }">
              <el-tooltip class="item" effect="dark" :open-delay='500' :content="node.label" placement="top-start">
                <span class="el-tree-label">{{ node.label }}</span>
              </el-tooltip>
            </span>
          </el-tree>
        </el-card>
      </el-col>

      <!-- svg -->
      <el-col :span="12">
        <div style="margin-bottom:10px;">
          <el-button id="reset" size="mini">
            <i class="el-icon-refresh-left"></i>
            重置</el-button>
          <!-- <el-button id="pos1" size="mini" type="primary">定位1</el-button>
          <el-button id="pos2" size="mini" type="primary">定位2</el-button> -->
        </div>
        <div id="svgTemplate" ref="svg"></div>
        <!-- 机柜信息 -->
        <div v-if="typeCode === 'rack'" style="margin-top:20px;">
          <el-row :gutter="35" style="margin-bottom:10px;">
            <el-col :span="12">
              <span class="devinfo-label">设备名称：</span>
              <span>{{deviceInfo.name}}</span>
            </el-col>
            <el-col :span="12">
              <span class="devinfo-label">U位使用情况：</span>
              <span>{{unitUsed + '/' + unitNum}}</span>
            </el-col>
          </el-row>
        </div>
        <!-- 非机柜设备信息 -->
        <div v-if="deviceInfo.id && typeCode !== 'rack'" style="margin-top:20px;">
          <device-info ref="devRef" :deviceInfo="deviceInfo" :alarmStatus="alarmStatus" :alarmInfo="alarmInfo" @redirectToFsu="redirectToFsu"></device-info>
        </div>
      </el-col>
      <!-- <el-col :span="8"> -->
        <!-- 电池组 -->
        <el-col :span="8" v-if="typeCode === '00701'" v-loading="indcpnLoading">
          <storage-battery ref="sbRef" :devIndicators="devIndicators"></storage-battery>
        </el-col>
        <!-- UPS -->
        <el-col :span="8" v-if="typeCode === '00802' || typeCode === '00803'" v-loading="indcpnLoading">
          <UPS ref="upsRef" :devIndicators="devIndicators" :typeCode="typeCode"></UPS>
        </el-col>
        <!-- 出线柜 -->
        <el-col :span="8" v-if="typeCode === '00204'" v-loading="indcpnLoading">
          <outgoing-cubicle ref="ocRef" :devIndicators="devIndicators"></outgoing-cubicle>
        </el-col>
        <!-- FSU -->
        <el-col :span="8" v-if="typeCode === '07603'" v-loading="indcpnLoading">
          <FSU ref="fsuRef" :devIndicators="devIndicators" :deviceCode="deviceInfo.code" :activeAlarmList="activeAlarmList"></FSU>
        </el-col>
        <!-- 温湿度 -->
        <el-col :span="8" v-if="typeCode === '01701' || typeCode === '01702'" v-loading="indcpnLoading">
          <tem-hum ref="thRef" :devIndicators="devIndicators" :typeCode="typeCode"></tem-hum>
        </el-col>
          <!-- 机柜 -->
        <el-col :span="8" v-if="typeCode === 'rack'" v-loading="indcpnLoading">
          <rack ref="thRef" :deviceId="deviceInfo.id" :unitList="unitList"></rack>
        </el-col>
        <!-- 列头柜 -->
        <el-col :span="8" v-if="typeCode === '00902'" v-loading="indcpnLoading">
          <array-cabinet ref="acRef" :devIndicators="devIndicators"></array-cabinet>
        </el-col>
        <!-- 空调 -->
        <el-col :span="8" v-if="typeCode === '01201'" v-loading="indcpnLoading">
          <air-conditioner ref="airRef" :devIndicators="devIndicators"></air-conditioner>
        </el-col>
      <!-- </el-col> -->
    </el-row>
    <el-row>
      <el-table
        :data="tableData"
        border
        size="medium"
        :height="alarmStatus ? 165: 200"
        class="table">
        <el-table-column
          fixed="left"
          type="index"
          label="序号"
          align="center"
          width="50"
          sortable
          ></el-table-column>
        <!-- <el-table-column 
          align="center"
          prop="serialNo"
          show-overflow-tooltip
          label="告警ID">
        </el-table-column> -->
        <!-- <el-table-column 
          align="left"
          header-align="center"
          prop="deviceCode"
          show-overflow-tooltip
          label="告警设备编号">
        </el-table-column> -->
        <el-table-column
          fixed="left"
          align="center"
          prop="alarmLevel"
          show-overflow-tooltip
          width="120"
          label="告警等级">
          <template slot-scope="scope">
            <img v-if="scope.row.alarmLevel === '1'" src="~@/assets/img/alarmLevel1.png">
            <img v-if="scope.row.alarmLevel === '2'" src="~@/assets/img/alarmLevel2.png">
            <img v-if="scope.row.alarmLevel === '3'" src="~@/assets/img/alarmLevel3.png">
            <img v-if="scope.row.alarmLevel === '4'" src="~@/assets/img/alarmLevel4.png">
            <span style="margin-left:10px;">{{ $dictUtils.getDictLabel("alarm_level", scope.row.alarmLevel, '-') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="left"
          prop="siteName"
          header-align="center"
          show-overflow-tooltip
          label="所处位置">
        </el-table-column>
        <el-table-column 
          fixed="left"
          prop="deviceName"
          header-align="center"
          show-overflow-tooltip
          label="告警设备">
          <template slot-scope="scope">
            <el-link :underline="false" type="primary" @click="tableAction(scope.row)">{{scope.row.deviceName}}</el-link>
          </template>
        </el-table-column>
        <el-table-column 
          align="center"
          width="100"
          prop="dealStatus"
          show-overflow-tooltip
          label="状态">
          <template slot-scope="scope">
            <img v-if="scope.row.dealStatus === '0'" src="~@/assets/img/unconfirmed.png">
            <img v-if="scope.row.dealStatus === '1'" src="~@/assets/img/confirmed.png">
            <img v-if="scope.row.dealStatus === '2'" src="~@/assets/img/eliminated.png">
            <span style="margin-left:10px;">{{ $dictUtils.getDictLabel("tele_alarm_deal_status", scope.row.dealStatus, '-') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180"
          prop="alarmTime"
          align="center"
          show-overflow-tooltip
          label="告警时间">
        </el-table-column>
        <!-- <el-table-column
          width="180"
          prop="alarmEndTime"
          align="center"
          show-overflow-tooltip
          label="告警消除时间">
        </el-table-column> -->
        <el-table-column 
          header-align="center"
          prop="alarmCodeDesc"
          show-overflow-tooltip
          label="告警标准名称">
        </el-table-column>
        <el-table-column 
          width="150"
          align="center"
          prop="alarmTypeDesc"
          show-overflow-tooltip
          label="告警分类">
        </el-table-column>
        <el-table-column 
          align="center"
          prop="mid"
          show-overflow-tooltip
          width="100"
          label="监测点">
        </el-table-column>
        <el-table-column 
          align="center"
          prop="eventValue"
          show-overflow-tooltip
          width="100"
          label="测点值">
        </el-table-column>
        <!-- <el-table-column 
          width="160"
          align="center"
          fixed="right"
          label="操作">
          <template  slot-scope="scope">
            <el-button  type="text" icon="el-icon-view" size="small" @click="view(scope.row)">查看</el-button>
            <el-button  v-if="scope.row.dealStatus === '0'" type="text" icon="el-icon-view" size="small" @click="deviceAction(scope.row, 1)">确认</el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </el-row>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="current"
      :page-sizes="[2, 5, 10, 20]"
      :page-size="size"
      :total="total"
      background
      style="margin-top: 15px"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>


<script>
import Vue from "vue/dist/vue.esm.js";
import * as d3 from "d3"; //在vue文件里面引入d3

import StorageBattery from "./indicatorTemplates/StorageBattery";
import UPS from "./indicatorTemplates/UPS";
import OutgoingCubicle from "./indicatorTemplates/OutgoingCubicle";
import FSU from "./indicatorTemplates/FSU";
import TemHum from "./indicatorTemplates/TemHum";
import Rack from "./indicatorTemplates/Rack";
import ArrayCabinet from "./indicatorTemplates/ArrayCabinet";
import AirConditioner from "./indicatorTemplates/AirConditioner";
import DeviceInfo from "./deviceInfo/DeviceInfo";

import {
  getDevTreeBySiteId,
  getTeleInfoByDevice,
  getAlarmLog,
  updateAlarmLog,
  getActiveAlarmList,
  getSdcNVRInfo
} from "@/api/sdc/deviceInfo";
import { getUnitList } from "@/api/sdc/capacityManage";

import moment from "moment";
import _ from "lodash"
export default {
  name: "RoomList",
  props: ["systemFlag", "siteId", "siteImg", "siteName", "addressId", "typeId", "isfullscreen"],
  components: {
    StorageBattery,
    DeviceInfo,
    UPS,
    OutgoingCubicle,
    FSU,
    TemHum,
    Rack,
    ArrayCabinet,
    AirConditioner
  },
  data () {
    return {
      /* 全局 */
      svgUrl: "", // svg的url
      svgDom: null, // 获取到的svg元素
      /* svg的变量 */
      photoResult: {
        resultVal: 0, // 测试结果 - 值
        resultMsg: "未检测", // 测试结果 - 字段
        resultColor: "#dcdee2" // 测试结果 - 字段背景色
      },
      // 以上是svg需要的
      treeKey: Math.random().toString(36).slice(-6),
      // teleData: [],
      // tsgData: [],
      // rtoData: [],
      // rcoData: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      selectName: '',
      condition: [],
      deviceInfo: [],
      alarmInfo: [], //告警详情信息
      // 视频数据
      // url: this.$dictUtils.getDictValue("vedio_param", "url_ip", ""),
      // port: this.$dictUtils.getDictValue("vedio_param", "port", ""),
      // ws_port: this.$dictUtils.getDictValue("vedio_param", "ws_port", ""),
      // allAlarmPage: 1,
      // allAlarmSize: 5,
      // allAlarmTatal: 0,
      // allAlarmKey: Math.random().toString(36).slice(-6),
      // allAlarmInfo: null,
      // teleId: null,
      // intervalTime: this.$dictUtils.getDictValue('monitor_interval_time', 'interval_time', ''),
      // playerUrl: '',

      typeCode: '',
      devIndicators: [],
      activeAlarmList: [],
      alarmStatus: false,
      alarmInfo: {},
      indcpnLoading: false,
      unitList: [],
      unitNum: null,
      unitUsed: null,
      queryCondition: {
        current: 1,
        size: 200
      },
      leafNodes: [],
      current: 1,
      size: 5,
      total: 0,
      alarmPageCondition: {
        current: 1,
        size: 5,
      },
      tableData: [],
      expandKeys: [],
      svgWidth: 670,
      svgHeight: 480,
      k: ''
    };
  },
  created () {
    this.init();
    this.getSvg();//svg
  },
  // svg添加
  watch: {
    photoResult: {
      handler (newVal, oldVal) {
        this.getSvg();
      },
      deep: true
    }
  },
  activated () {
  },
  deactivated () {
  },
  beforeDestroy () {

    this.svgDom = null;
  },
  // svg需要
  async mounted () {
    // 将takePhoto方法绑定到window下面，提供给外部调用
    window["handleClick"] = (e) => {
      console.log(e);
      let devId = ''
      e.path.forEach(item => {
        if (item.tagName === 'a') {
          devId = item.id
        }
      })
      this.takePhoto(devId);
      // this.zoomimg(e.x, e.y)
      // console.log('e', e.path[1].id)
    };
    window["zooming"] = (e) => {
      console.log(e);
      this.zoomimg()
    }
    //上面是svg调用

  },
  methods: {
    // 初始化svg
    getSvg () {
      /* 创建xhr对象 */
      const xhr = new XMLHttpRequest();
      // this.svgUrl = this.baseUrl + "svg/" + "1.svg";
      this.svgUrl = `/svg/${this.siteId}.svg`
      xhr.open("GET", this.svgUrl, true);
      xhr.send();

      /* 监听xhr对象 */
      xhr.addEventListener("load", () => {
        /* 1. 获取 dom */
        const resXML = xhr.responseXML;
        // const resXML = stringToXml(xhr.response)
        console.log(resXML, 'resXML')
        this.svgDom = resXML.documentElement.cloneNode(true);

        // let svgdom = this.svgDom.getElementById('svgcanvas');
        // console.log('svg', svgdom)

        /* 2.SVG对象添加click事件 */
        // let btnTakePhotoDom = this.svgDom.getElementById("7ad7b31ccaba41c2a62243a48443d11c");

        let btnTakePhotoDom = this.svgDom.getElementsByTagName('a');


        for (var i = 0; i < btnTakePhotoDom.length; i++) {
          console.log('id', btnTakePhotoDom[i].id)

          // btnTakePhotoDom[i].addEventListener('v-on:click', handleClick, false)
          // btnTakePhotoDom[i].addEventListener("click", this.changeColor, false);

          // btnTakePhotoDom[i].onclick = function takePhoto () {
          //   alert("嘎嘎" + this.id);
          // };

          btnTakePhotoDom[i].setAttribute("v-on:click", "this.handleClick($event)");


        }
        this.svgDom.style.width = '100%';
        this.svgDom.style.height = 540 + 'px';
        this.svgDom.style.border = '1px solid #eee'

        /* 3. 修改 dom */
        this.svgDom.setAttribute('v-on:mousewheel','this.zooming($event)')
        // this.svgDom.setAttribute('id','svgcanvas')
        let gtag = this.svgDom.getElementsByTagName('g')
        gtag[0].setAttribute('id','svgcanvas')
        console.log(this.svgDom,'this.svgDom');
        /* 4.将svgDom对象转换成vue的虚拟dom */
        var oSerializer = new XMLSerializer();
        var sXML = oSerializer.serializeToString(this.svgDom);
        var Profile = Vue.extend({
          template: "<div id='svgTemplate'>" + sXML + "</div>"
        });
        // 创建实例，并挂载到元素上
        new Profile().$mount("#svgTemplate");
        // this.takePhoto(this.leafNodes[0].id)
        // this.$nextTick(() => {
        //   if (this.leafNodes.length > 0) {
        //     this.takePhoto(this.leafNodes[0].id)
        //   }
        // })
        // this.zoomimg(this.svgWidth / 2, this.svgHeight / 2)
      });
    },
    // 事件
    async takePhoto (id) {
      this.leafNodes.forEach(item => {
        if (item.id === id) {
          this.selectName = '已选设备: ' + item.name
          const currentDom = document.getElementById(item.id)
          console.log(currentDom.childNodes[0].style);
          // currentDom.childNodes[0].style.fill = 'tomato'
          currentDom.childNodes[0].style.animation = '1.5s linear 1s reverse infinite fillFlash'
        } else {
          const otherDom = document.getElementById(item.id)
          // if (otherDom && (otherDom.childNodes[0].style.fill === 'tomato')) {
          //   otherDom.childNodes[0].style.fill = 'none'
          // }
          if (otherDom) {
            otherDom.childNodes[0].style.animation = 'none'
          }
        }
      })
      this.indcpnLoading = true
      this.alarmStatus = false
      this.alarmInfo = {}
      this.unitList = []
      this.unitNum = null,
      this.unitUsed = null
      // 获取设备信息
      let devData = await getSdcNVRInfo(id);
      this.deviceInfo = devData.data.data;
      // 查询设备是否在活动告警列表中
      this.activeAlarmList.forEach(item => {
        if (item.deviceId === this.deviceInfo.id) {
          this.alarmStatus = true
          this.alarmInfo = item
        }
      })

      this.typeCode = this.deviceInfo.typeCode
      if (this.typeCode === 'rack') {
        this.queryCondition.rackId = this.deviceInfo.id
        this._getUnitList(this.queryCondition)
      }
      // 获取指标信息
      let mydata = await getTeleInfoByDevice(id);
      this.devIndicators = mydata.data.data.records
      this.indcpnLoading = false
      // nextTick防止父子组件typeCode不一致
      this.$nextTick(() => {
        this.$refs.devRef._getFsuByDevice()
        if (this.typeCode === '00204' && this.$refs.ocRef) {
          this.$refs.ocRef.init()
        }
        if (this.typeCode === '00701' && this.$refs.sbRef) {
          this.$refs.sbRef.init()
        }
        if ((this.typeCode === '00802' || this.typeCode === '00803') && this.$refs.upsRef) {
          this.$refs.upsRef.init()
        }
        if (this.typeCode === '07603' && this.$refs.fsuRef) {
          this.$refs.fsuRef.init()
          this.$refs.fsuRef._getDeviceByFsu()
        }
        if ((this.typeCode === '01701' || this.typeCode === '01702') && this.$refs.thRef) {
          console.log(this.typeCode,'typeCode in RoomList');
          this.$refs.thRef.init()
        }
        if (this.typeCode === '00902' && this.$refs.acRef) {
          this.$refs.acRef.init()
        }
        if (this.typeCode === '01201' && this.$refs.airRef) {
          this.$refs.airRef.init()
        }
        
      })
      
      console.log(this.devIndicators,'指标信息');

    },
    zoomimg (x, y) {
      // 放大缩小
      // 缩放事件绑定给svg,缩放结果设置给svg内部的g标签
      if (!x) {
        x = 0
      }
      if (!y) {
        y = 0
      }
      const svg = d3.select('svg')
      const g = d3.select("#svgcanvas");
      //节点的缩放
      function zoomActions () {
        g.attr('transform', d3.event.transform)
      }
      let zoomHandler = d3.zoom()
        .on('zoom', zoomActions)
        .scaleExtent([0.5, 40])

      // zoomHandler(svg)
      svg.call(zoomHandler)
      svg.transition().duration(750).call(zoomHandler.transform, d3.zoomIdentity.translate(-x, -y).scale(2))
      // 点击按钮定位
      d3.select('#reset').on('click',function(){
        svg.transition().duration(750).call(zoomHandler.transform, d3.zoomIdentity);
      });
      // d3.select('#pos1').on('click',function(){
      //   svg.transition().duration(750).call(zoomHandler.transform, d3.zoomIdentity.translate(-10,-1500).scale(2));
      // });
      // d3.select('#pos2').on('click',function(){
      //   svg.transition().duration(750).call(zoomHandler.transform, d3.zoomIdentity.translate(-1200,-10).scale(2));
      // });
    },
    // 以上是svg的方法

    // 跳转到fsu信息
    redirectToFsu(id) {
      this.locateDevice(id)
      this.takePhoto(id)
    },
    //查询物模型属性
    // async queryTeleInfo () {
    //   let teleData = [],
    //     tsgData = [],
    //     rcoData = []
    //   let teleQueryMsg = await getTeleInfoByDevice(this.teleId);
    //   for (let j = 0; j < teleQueryMsg.data.data.records.length; j++) {
    //     const el = teleQueryMsg.data.data.records[j];
    //     if (el.type === "3") {
    //       teleData.push(el);
    //     } else if (el.type === "4") {
    //       tsgData.push(el);
    //     } else if (el.type === "1") {
    //       rcoData.push(el);
    //     }
    //   }
    //   this.teleData = teleData;
    //   this.tsgData = tsgData;
    //   this.rcoData = rcoData
    // },
    async init () {
      // 获取设备树
      let brandQueryInfo = await getDevTreeBySiteId(
        this.siteId
      );
      this.condition = brandQueryInfo.data.data;
      this.leafNodes = []
      this.getLeafNodes(this.condition)
      this.expandKeys.push(this.leafNodes[0].parentId)
      if (document.getElementById(this.leafNodes[0].id)) {
        this.takePhoto(this.leafNodes[0].id)
      }
      // 获取活动告警列表
      let params = {
        current: 1,
        size: 1000,
        siteId: this.siteId
      }
      this._getActiveAlarmList(params)
      this.alarmPageCondition.siteId = this.siteId
      this.getAlarmByPage(this.alarmPageCondition)
    },
    // 获取叶子节点
    getLeafNodes(treeData) {
      treeData.forEach(item => {
        if (item.children.length === 0) {
          this.leafNodes.push(item)
        } else {
          this.getLeafNodes(item.children)
        }
      })
    },
    // 查询机柜u位
    _getUnitList(condition) {
        getUnitList(condition).then(res => {
          console.log(res, 'unitList');
          if(res.data.code === 0) {
            let data = res.data.data.records
            this.unitList = data
            this.unitNum = this.unitList.length
            this.unitList.forEach(item => {
              if (item.state === '1') {
                this.unitUsed++
              }
            })
          } else {
            this.$message.error('获取数据出错，请刷新重试')
          }
        })
      },
    _getActiveAlarmList(params) {
      getActiveAlarmList(params).then(res => {
        if (res.data.code === 0) {
          this.activeAlarmList = res.data.data.records
        }
      })
    },
    getAlarmByPage(params) {
      getActiveAlarmList(params).then(res => {
        if (res.data.code === 0) {
          this.tableData = res.data.data.records
          this.total = res.data.data.total
        }
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.size = val
      this.current = 1
      this.alarmPageCondition.size = this.size
      this.alarmPageCondition.current = this.current
      this.getAlarmByPage(this.alarmPageCondition)
    },
    // 当前页
    currentChangeHandle (val) {
      this.current = val
      this.alarmPageCondition.size = this.size
      this.alarmPageCondition.current = this.current
      this.getAlarmByPage(this.alarmPageCondition)
    },
    // 点击树节点
    nodeClicked (data, node) {
      console.log(data)
      if (data.children.length === 0) {
        this.selectName = '已选设备: ' + node.data.name
        this.locateDevice(node.data.id)
      }
      // const dom = document.getElementById(node.data.id)
      // .childNodes[1].childNodes[0].getElementsByTagName('font')[0]
      // console.log('dom', dom)
      // dom.childNodes[0].style.fill = 'blue'
      // dom.childNodes[0].style.height = '200px'
      // dom.innerHTML = '<div style="color:red">这是新的内容，样式为红色</div>';

      // 以上是操作dom的内容

    },
    //返回上层
    backToUp () {
      this.$emit("changeComponent", {
        currentComponent: "RoomOverview",
        roomInfo: {},
        addressId: this.addressId,
        typeId: this.typeId,
      });
    },
    deviceAction (val, flag) {
      let data = val;
      data.dealStatus = flag === 1 ? "1" : "2";
      updateAlarmLog(data).then((res) => {
        this.queryAlarmLog();
      });
    },
    tableAction(data) {
      this.locateDevice(data.deviceId)
    },
    locateDevice(id) {
      this.leafNodes.forEach(item => {
        if (item.id === id) {
          const currentDom = document.getElementById(item.id)
          console.log(currentDom.childNodes[0].style);
          currentDom.childNodes[0].style.animation = '1.5s linear 1s reverse infinite fillFlash'
          this.takePhoto(item.id)
        } else {
          const otherDom = document.getElementById(item.id)
          if (otherDom && (otherDom.childNodes[0].style.animation)) {
            otherDom.childNodes[0].style.animation = 'none'
          }
        }
      })
    },
    // videoClose () {
    //   this.dialogVisible = false
    //   // this.$refs.videoAreaRef.innerHTML = `<div style="color:#fff;margin:auto;">无信号</div>`
    //   this.playerUrl = ''
    // },
    toggle() {
      this.$emit('toggle')
    }
  },
};
</script>

<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.el-tree-node__content:hover .el-tree-label {
    display: inline-block;
    width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
.el-tree-node__content .tree-item-button{
display: none;
}
.el-tree-node__content:hover .tree-item-button{
  display: unset;
}
.room-btn {
  float: right;
  margin: 10px;
}
.devinfo-label {
  font-weight: 700;
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
<style>
@keyframes fillFlash {
  from {
    stroke: red;
    stroke-width: 8;
  }
  to {
    stroke: red;
    stroke-width: 8;
  }
}
</style>
