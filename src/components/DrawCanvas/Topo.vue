<template >
  <div>
    <div ref="deviceImg" >
    <div ref="devText" class="dev-info">
      {{devname}}
      <template v-if="deviceData.teleData" >
        <div v-for="item in deviceData.teleData" :key="item.id">
          <template v-if="item.propType === '0'">
            <div>{{item.param}}： {{item.value || '--'}} {{item.unit}}</div>
          </template>
        </div>
      </template>
    </div>
    <div class="dev-img">
      <img
        ref="plate"
        :src="testImg"
        alt=""
        @click="showDetail"
      />
    </div>

    
  </div>
  <el-dialog
      title="设备信息"
      :visible.sync="dialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-row :gutter="15" class="dev-row" style="height:300px">
          <el-col :span="24">
            <el-tabs v-model="radioBtn" @tab-click="changeComponent">
              <el-tab-pane label="设备信息" name="1">
                <DeviceInfo :devData="deviceData.devData" ></DeviceInfo>
              </el-tab-pane>
              <el-tab-pane label="历史事件" name="2">
                <EventHistory
                  :eventLogInfo="eventLogInfo"
                ></EventHistory>
              </el-tab-pane>
              <el-tab-pane label="告警历史" name="3">
                <AlarmHistory
                  :oneAlarmInfo="oneAlarmInfo"
                ></AlarmHistory>
              </el-tab-pane>
            </el-tabs>
          </el-col>
          <el-col :span="24"></el-col>
        </el-row>
        <el-row :gutter="15" style="height:300px">
          <el-col :span="24">
            <el-tabs v-model="teleRadioBtn">
              <el-tab-pane label="遥测信息" name="1">
                <TmyInfo
                  :teleData="teleData"
                  :deviceName="deviceData.name"
                ></TmyInfo>
              </el-tab-pane>
              <el-tab-pane label="遥信信息" name="2">
                <TsgInfo :tsgData="tsgData"></TsgInfo>
              </el-tab-pane>
              <el-tab-pane label="遥控操作" name="3">
                <RTO :rtoData="rtoData"></RTO>
              </el-tab-pane>
              <el-tab-pane label="遥调操作" name="4">
                <RCO :rcoData="rcoData"></RCO>
              </el-tab-pane>
            </el-tabs>
          </el-col>
          <el-col :span="24"></el-col>
        </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false"
          >关 闭</el-button
        >
      </span>
    </el-dialog>
  </div>
  
</template>

<script>
import DeviceInfo from "@/views/sdc/realTimeMonitor/monitorDomain/DeviceInfo.vue";
import EventHistory from "@/views/sdc/realTimeMonitor/monitorDomain/EventHistory";
import AlarmHistory from "@/views/sdc/realTimeMonitor/monitorDomain/AlarmHistory";
import TmyInfo from "@/views/sdc/realTimeMonitor/monitorDomain/TmyInfo"; //遥测信息
import TsgInfo from "@/views/sdc/realTimeMonitor/monitorDomain/TsgInfo"; //遥信信息
import RTO from "@/views/sdc/realTimeMonitor/monitorDomain/RTO"; //遥调操作
import RCO from "@/views/sdc/realTimeMonitor/monitorDomain/RCO"; //遥控操作

import { getDeviceEventLog,getAlarmLog } from "@/api/sdc/deviceInfo";
import eventBus from "@/util/eventBus";


export default {
  props: [
    "deviceData",
    "width",
    "height",
    "isDraggable",
  ],
  components: {
    DeviceInfo,
    EventHistory,
    AlarmHistory,
    TmyInfo,
    TsgInfo,
    RTO,
    RCO
  },
  data() {
    return {
      textShow: false,
      deg: 0,
      testImg: null,
      rotateNum: 0,
      devWidth: 16,
      devHeight: 24,
      basicWidth: null,
      basicHeight: null,
      pointX: null,
      pointY: null,
      top: 0,
      left: 0,
      devInfo: null,
      devname: null,
      dialogVisible: false,
      oneAlarmPage: 1,
      oneAlarmSize: 5,
      oneAlarmTatal: 0,
      oneAlarmKey: Math.random().toString(36).slice(-6),
      oneAlarmInfo: null,
      allAlarmPage: 1,
      allAlarmSize: 5,
      allAlarmTatal: 0,
      allAlarmKey: Math.random().toString(36).slice(-6),
      allAlarmInfo: null,
      eventLogPage: 1,
      eventLogTatal: 0,
      eventLogSize: 5,
      eventLogKey: Math.random().toString(36).slice(-6),
      eventLogInfo: null,
      radioBtn: "1",
      teleRadioBtn: "1",
    };
  },
  created() {
    this.testImg = this.deviceData.url
    this.devname = this.deviceData.name
    this.eventLogInfo = this.deviceData.eventLogInfo
    this.oneAlarmInfo = this.deviceData.oneAlarmInfo
    this.teleData = this.deviceData.teleData
    this.tsgData = this.deviceData.tsgData
    this.rtoData = this.deviceData.rtoData
    this.rcoData = this.deviceData.rcoData
  },
  mounted() {
    this.init();
    eventBus.$on("queryAlarmByPage", (res) => {
      this.oneAlarmPage = res.page;
      this.oneAlarmSize = res.size;
      // this.queryAlarmLog();
      this.queryAlarmLog(res.id);
    });
    eventBus.$on("queryLogByPage", (res) => {
      this.eventLogPage = res.page;
      this.eventLogSize = res.size;
      this.queryDeviceEventLog(res.id);
    });
  },
  methods: {
    init() {
      this.$refs.plate.onload = () => {
      }

      this.devWidth = this.basicWidth;
      this.devHeight = this.basicHeight;

      this.$refs.deviceImg.id = this.id;
      this.$refs.deviceImg.style.top = this.deviceData.y + "px";
      this.$refs.deviceImg.style.left = this.deviceData.x + "px";
      
      this.$refs.deviceImg.style.position = "absolute";
      this.$refs.deviceImg.style.opacity = 0.8;

    },
    showInfo() {
      console.log(this.deviceData.path);
      this.$router.push({
        name: this.deviceData.path,
        params: {
          siteId: '7cbaf9703df64f77abc24795dd316792',
          siteImg: '/admin/sys-file/planplat/94e48c4ee4d8404c9efe212ced0a8d62.png',
          siteName: '汇聚机房',
          addressId: [
            "2e7eb06f46a2419c82523358ed53081b", 
            "d4e85c840b884a2c8714f6f83aba1d48", 
            "78913cb2f1b646e09e3ceb6fbe16a8fe", 
            "7cbaf9703df64f77abc24795dd316792"
          ],
          typeId: [],
          currentComponent: 'RoomList',

        }
      });
    },
    showDetail() {
      this.dialogVisible = true
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
        });
        console.log(queryAllData,'queryAllData');
        this.allAlarmInfo = queryAllData.data.data.records;
        this.allAlarmKey = new Date().toString();
        this.setpage(queryAllData.data.data);
      }
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
  },
};
</script>

<style lang="scss" scoped>
.dev-img {
  // text-align: center;
  // margin-top: 20%;
  margin-right: 5px;
  float: left;
}

.dev-name {
  position: absolute;
  top: 30%;
  left: 10%;
  font-size: 14px;
  color: #fff;
}

.dev-info {
  background: #409EFF;
  color: #ffffff;
  border-radius: 5px;
  text-align: center;
  padding: 5px;
  margin-bottom: 2px;
}
.dev-row {
  min-height: 350px;
}
</style>
