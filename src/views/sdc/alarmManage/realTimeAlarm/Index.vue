<template>
  <div ref="docWrapper">
    <basic-container>
      <el-row :gutter="10" class="fullscreen-wrapper">
        <el-col :span="24">
          <el-card shadow="never" :body-style="themeFlag ? {background: '#0E1224',padding: '10px'} : {padding: '10px'}">
            <el-row class="top-charts">
              <el-col :span="5" :offset="1" style="margin-top:20px">
                <div class="alarm-total"><div>报警数(个)</div><div class="alarm-total-number">{{totalAlarmNum}}</div></div>
              </el-col>
              <el-col :span="4" v-for="item in chartData" :key="item.level">
                <div class="level-chart">
                  <div class="level-progress">
                    <el-progress type="circle" :percentage="item.percent" :color="item.color" :stroke-width="4" :width="50"></el-progress>
                  </div>
                  <div class="level-text">
                    <div class="text-number">{{item.num}}</div>
                    <div class="text-name">{{item.levelDec}}</div>
                  </div>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-button-group class="pull-right">
                <el-tooltip placement="top" content="切换主题">
                  <el-button
                    v-if="themeFlag"
                    type="default"
                    size="small"
                    class="tool-box"
                    @click="toggleTheme">
                    <img class="btn-img" src="~@/assets/img/darktheme.png">
                  </el-button>
                  <el-button
                    v-else
                    type="default"
                    size="small"
                    class="tool-box"
                    @click="toggleTheme">
                    <img class="btn-img" src="~@/assets/img/lighttheme.png">
                  </el-button>
                </el-tooltip>
                <el-tooltip placement="top" content="筛选">
                  <el-button
                    v-if="themeFlag"
                    type="default"
                    size="small"
                    class="tool-box"
                    @click="openSearchDialog">
                    <img class="btn-img" src="~@/assets/img/darkfiltrate.png">
                  </el-button>
                  <el-button
                    v-else
                    type="default"
                    size="small"
                    class="tool-box"
                    @click="openSearchDialog">
                    <img class="btn-img" src="~@/assets/img/lightfiltrate.png">
                  </el-button>
                </el-tooltip>
                <el-tooltip placement="top" content="导出">
                  <el-button
                    v-if="themeFlag"
                    type="default"
                    size="small"
                    class="tool-box"
                    @click="alarmListExport"
                    :disabled="!exportDisable"
                  >
                    <img class="btn-img" src="~@/assets/img/darkexport.png">
                  </el-button>
                  <el-button
                    v-else
                    type="default"
                    size="small"
                    class="tool-box"
                    @click="alarmListExport"
                    :disabled="!exportDisable"
                  >
                    <img class="btn-img" src="~@/assets/img/lightexport.png">
                  </el-button>
                </el-tooltip>
                <el-tooltip placement="top" content="声音">
                  <el-button
                    v-if="themeFlag"
                    type="default"
                    size="small"
                    class="tool-box"
                    @click="toggleVoice">
                    <img v-if="hasVoice" class="btn-img" src="~@/assets/img/darkvoice.png">
                    <img v-else class="btn-img" src="~@/assets/img/darksilence.png">
                  </el-button>
                  <el-button
                    v-else
                    type="default"
                    size="small"
                    class="tool-box"
                    @click="toggleVoice">
                    <img v-if="hasVoice" class="btn-img" src="~@/assets/img/lightvoice.png">
                    <img v-else class="btn-img" src="~@/assets/img/lightsilence.png">
                  </el-button>
                </el-tooltip>
                <el-tooltip placement="top" content="最大化">
                  <el-button
                    v-if="themeFlag"
                    type="default"
                    size="small"
                    class="tool-box"
                    @click.prevent="toggle">
                    <img class="btn-img" src="~@/assets/img/darkmaximize.png">
                  </el-button>
                  <el-button
                    v-else
                    type="default"
                    size="small"
                    class="tool-box"
                    @click.prevent="toggle ">
                    <img class="btn-img" src="~@/assets/img/lightmaximize.png">
                  </el-button>
                </el-tooltip>
              </el-button-group>
            </el-row>
            <div class="alarm-table"> 
              <el-table
              class="table-dom"
              :data="dataList"
              size="medium"
              v-loading="loading"
              :height="tableHeight"
              :header-cell-style="themeFlag ? {borderColor:'#08304a'} : {}"
              :cell-style="themeFlag ? {borderColor:'#08304a'} : {}"
              @selection-change="selectChange"
              @cell-mouse-enter="cellMouseEnter">
              <el-table-column
                align="center"
                type="selection"
                width="55">
              </el-table-column>
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
                width="240"
                prop="siteName"
                align="center"
                show-overflow-tooltip
                label="所处位置">
              </el-table-column>
              <el-table-column 
                fixed="left"
                width="240"
                prop="deviceName"
                header-align="center"
                show-overflow-tooltip
                label="告警设备">
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
                align="center"
                prop="alarmCodeDesc"
                show-overflow-tooltip
                width="260"
                label="告警标准名称">
              </el-table-column>
              <el-table-column 
                align="center"
                prop="alarmRemark2"
                width="240"
                show-overflow-tooltip
                label="确认意见">
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
              <el-table-column 
                width="160"
                align="center"
                fixed="right"
                label="操作">
                <template  slot-scope="scope">
                  <el-button  type="text" icon="el-icon-view" size="small" @click="view(scope.row)">查看</el-button>
                  <el-button  v-if="scope.row.dealStatus === '0'" type="text" icon="el-icon-view" size="small" @click="deviceAction(scope.row, 1)">确认</el-button>
                </template>
              </el-table-column>
              </el-table>
              <el-pagination
                :key="paginationKey"
                @size-change="sizeChangeHandle"
                @current-change="currentChangeHandle"
                :current-page="current"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="size"
                :total="total"
                background
                style="margin-top: 15px"
                layout="total, sizes, prev, pager, next, jumper">
              </el-pagination>
            </div>
          </el-card>
        </el-col>
        <!-- 查看对话框 -->
        <el-dialog
          title="查看详情"
          :close-on-click-modal="false"
          v-dialogDrag
          :visible.sync="visible">
          <el-form 
            :model="viewForm" 
            ref="viewFormRef"
            :disabled="true"
            label-width="120px">
            <el-row :gutter="15">
              <!-- <el-col :span="12">
                <el-form-item label="告警ID" prop="serialNo">
                  <el-input v-model="viewForm.serialNo"></el-input>
                </el-form-item>
              </el-col> -->
              <el-col :span="12">
                <el-form-item label="设备编号" prop="deviceCode">
                  <el-input v-model="viewForm.deviceCode"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="告警设备" prop="deviceName">
                  <el-input v-model="viewForm.deviceName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属站点" prop="siteName">
                  <el-input v-model="viewForm.siteName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="告警等级" prop="alarmLevel">
                  <el-select v-model="viewForm.alarmLevel" style="width: 100%;">
                    <el-option
                      v-for="item in $dictUtils.getDictList('alarm_level')"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="状态" prop="dealStatus">
                  <el-select v-model="viewForm.dealStatus" style="width: 100%;">
                    <el-option
                      v-for="item in $dictUtils.getDictList('tele_alarm_deal_status')"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="告警分类" prop="alarmTypeDesc">
                  <el-input v-model="viewForm.alarmTypeDesc"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="告警标准名称" prop="alarmCodeDesc">
                  <el-input v-model="viewForm.alarmCodeDesc"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="告警时间" prop="alarmTime">
                  <el-date-picker
                    style="width: 100%;"
                    v-model="viewForm.alarmTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="告警值" prop="eventValue">
                  <el-input v-model="viewForm.eventValue"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">关闭</el-button>
          </span>
        </el-dialog>
        <!-- 筛选对话框 -->
        <el-dialog
          title="筛选"
          :close-on-click-modal="false"
          v-dialogDrag
          :visible.sync="searchDialogVisible"
          class="filter-dialog">
          <el-button @click="resetSearch" type="danger">清除</el-button>
            <el-card class="box-card" shadow="hover">
              <div slot="header" class="box-header">
                <span>条件</span>
              </div>
              <el-row :gutter="15">
                <el-col :span="12">
                  <span>告警设备：</span>
                  <el-input v-model="searchForm.deviceName" style="width:70%"></el-input>
                </el-col>
                <el-col :span="12">
                  <span>告警标准名称：</span>
                  <el-input v-model="searchForm.alarmCodeDesc" style="width:70%"></el-input>
                </el-col>
                <el-col :span="12">
                  <span>所处位置：</span>
                  <el-cascader
                      ref="siteChoose"
                      :options="siteData"
                      v-model="searchForm.deviceSiteId"
                      clearable
                      @change="changeAddress"
                      :append-to-body="isAppendToBody"
                      :key="siteKey"
                      :props="{ checkStrictly: false, value: 'id', label: 'name', children: 'children' }"
                    >
                  </el-cascader>
                </el-col>
                <el-col :span="12">
                  <span>告警日期区间：</span>
                  <el-date-picker
                    style="width:70%"
                    v-model="dateRange"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :append-to-body="isAppendToBody"
                    :key="dateKey"
                    @change="dateChange">
                  </el-date-picker>
                </el-col>
              </el-row>
            </el-card>
          <el-card class="box-card" shadow="hover">
            <div slot="header" class="box-header">
              <span>告警等级</span>
            </div>
            <el-radio-group v-model="searchForm.alarmLevel">
              <el-radio v-for="item in alarmLevelList" :key="item.value" :label="item.value">{{item.label}}</el-radio>
            </el-radio-group>
          </el-card>
          <el-card class="box-card" shadow="hover">
            <div slot="header" class="box-header">
              <span>处理状态</span>
            </div>
            <el-radio-group v-model="searchForm.dealStatus">
              <el-radio v-for="item in dealStatusList" :key="item.value" :label="item.value">{{item.label}}</el-radio>
            </el-radio-group>
          </el-card>
          <span slot="footer" class="dialog-footer">
            <el-button @click="searchDialogVisible = false">取 消</el-button>
            <el-button @click="searchList" type="primary">确 认</el-button>
          </span>
        </el-dialog>
        <!-- 填写意见对话框 -->
        <el-dialog
          title="填写意见备注"
          :close-on-click-modal="false"
          v-dialogDrag
          :visible.sync="remarkDialogVisible"
          width="30%"
          @close="resetRemark"
        >
          <div>
            <el-input v-model="confirmRemark" type="textarea"></el-input>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="remarkDialogVisible = false">取 消</el-button>
            <el-button @click="submitConfirm" type="primary">确 认</el-button>
          </span>
        </el-dialog>
      </el-row>
    </basic-container>
  </div>
</template>

<script>
import { updateAlarmLog, getAlarmStatistics, AlarmExport } from "@/api/sdc/deviceInfo";
import { sdcSiteAction } from "@/api/sdc/addressInfo";
import { sdcDeviceTypeAction, } from "@/api/sdc/deviceType"
import { modifyData } from "@/util/domainFilter";
import _ from "lodash"
import {getStore} from '@/util/store.js'
import Stomp from 'stompjs'
  // socket功能
import SockJS from 'sockjs-client'
import store from '@/store'
import moment from "moment";
import { fullscreenToggel} from '@/util/util'
  export default {
    data () {
      return {
        queryCondition: {},
        // activeName: 'third',
        dataList: [],
        current: 1,
        size: 50,
        total: 0,
        // orderBy: '',
        filterText: '',
        selectName: '',
        leftTreeData: [],
        siteData: [],
        // devTypeList: [],
        // dataListSelections: [],
        isSearchCollapse: true,
        isImportCollapse: false,
        loading: false,
        viewForm: {},
        visible: false,
        searchDialogVisible: false,
        searchForm: {
          deviceName: null,
          alarmCodeDesc: null,
          alarmLevel: null,
          dealStatus: null,
          deviceSiteId: null
        },
        alarmLevelList: this.$dictUtils.getDictList('alarm_level'),
        dealStatusList: [
          {
            label: '未确认',
            value: '0'
          },
          {
            label: '已确认',
            value: '1'
          }
        ],
        colorList:['#FF5F4E','#FD7512','#ECE90B','#45A1FF'],
        isfullscreen: false,
        synth: window.speechSynthesis,
        msg: new SpeechSynthesisUtterance(),
        chartData: [],
        totalAlarmNum: '',
        selections: [],
        hasVoice: true,
        dateRange: null,
        siteKey: Math.random().toString(36).slice(-6),
        dateKey: Math.random().toString(36).slice(-6),
        paginationKey: Math.random().toString(36).slice(-6),
        themeFlag: true,
        confirmRemark: '',
        remarkDialogVisible: false,
        confirmData: {},
        loadingInstance: null
      }
    },
    components: {
      // SdcAlarmRecordForm
    },
    activated () {
      this.initWebSocket()
      // this.refreshTree()
    },
    created () {
      this.refreshList()
      // this.refreshTree()
      this.getSiteData();
      // this.getDevTypeList()
      this._getAlarmStatistics()
      
    },
    mounted() {
      this.initWebSocket()
      this.$refs.docWrapper.classList.add('theme-dark')
    },
    beforeDestroy() {
      clearInterval(this.$store.state.user.alarmRealTimer)
      this.disconnect()
    },
    deactivated() {
      clearInterval(this.$store.state.user.alarmRealTimer)
      this.disconnect()
    },
    watch: {
      filterText (val) {
        this.$refs.leftTree.filter(val)
      }
    },
    computed: {
      contentViewHeight () {
        let height = this.$store.state.common.documentClientHeight - 122
        return {minHeight: height + 'px'}
      },
      tableHeight() {
        return this.isfullscreen ? '930' : '580'
      },
      exportDisable() {
        return this.selections.length > 0
      },
      isAppendToBody() {
        return !this.isfullscreen
      }
    },
    methods: {
      async getSiteData() {
        let data = await sdcSiteAction("", "/tree", "get");
        this.siteData = modifyData(data.data.data);
      },
      _getAlarmStatistics() {
        getAlarmStatistics().then(res => {
          if (res.data.code === 0) {
            let chartData = res.data.data
            let totalNum = 0
            chartData.forEach((item, index) => {
              item.color = this.colorList[index]
              item.percent = Number(item.percent)
              totalNum += item.num
            })
            this.totalAlarmNum = totalNum
            this.chartData = chartData
          }
        })
      },
      /**
       * websocket
       */
      // 初始化websocket
    initWebSocket() {
      this.connection()
      const self = this
      // 断开重连机制,尝试发送消息,捕获异常发生时重连
      if (this.$store.state.user.alarmRealTimer) {
        clearInterval(this.$store.state.user.alarmRealTimer)
      }
      this.$store.state.user.alarmRealTimer = setInterval(() => {
        try {
          self.stompClient.send('test')
        } catch (err) {
          console.log('断线了: ' + err)
          self.connection()
        }
      }, 5000)
    },
    // ws连接
    connection() {
      const token = store.getters.access_token
      const TENANT_ID = getStore({name: 'tenantId'}) ? getStore({name: 'tenantId'}) : '1'
      const headers = {
        'Authorization': 'Bearer ' + token
      }
      // 建立连接对象
        let _this = this
      this.socket = new SockJS('api-sdc/ws',null, { timeout: 15000})// 连接服务端提供的通信接口，连接以后才可以订阅广播消息和个人消息
      // 获取STOMP子协议的客户端对象
      this.stompClient = Stomp.over(this.socket)
      this.stompClient.debug = null
      // 向服务器发起websocket连接
      this.stompClient.connect(headers, () => {

        console.log(TENANT_ID, '订阅','/notice/' + TENANT_ID + '/queue');
        this.stompClient.subscribe('/alarm/' + TENANT_ID + '/queue', function(message) { // 订阅服务端提供的某个topic;
          if (message) {
            let newMsg = JSON.parse(message.body)
            console.log(newMsg);
            if (_this.hasVoice) {
              _this.handleSpeak(newMsg.alarmLevel + '级告警,' + newMsg.alarmCodeDesc)
            }
            _this.setQueryCondition()
            _this.refreshList()
            _this._getAlarmStatistics()
          }
        })
      }, (err) => {
        console.log(err, '=======================ws err');
      })
    },
    disconnect() {
      if (this.stompClient != null) {
        this.stompClient.disconnect()
        console.log('Disconnected')
      }
    },
    changeAddress(val) {
      if (val.length === 0) {
        this.searchForm.deviceSiteId = ''
      } else {
        this.searchForm.deviceSiteId = val[val.length - 1];
      }
    },
    dateChange(val) {
    },
      // 设置查询条件
      setQueryCondition() {
        this.queryCondition = {
          current: this.current,
          size: this.size
        }
        this.searchForm.dealStatus ? this.queryCondition.dealStatus = this.searchForm.dealStatus : ''
        this.searchForm.deviceName ? this.queryCondition.deviceName = this.searchForm.deviceName : ''
        this.searchForm.alarmLevel ? this.queryCondition.alarmLevel = this.searchForm.alarmLevel : ''
        this.searchForm.alarmCodeDesc ? this.queryCondition.alarmCodeDesc = this.searchForm.alarmCodeDesc : ''
        this.searchForm.deviceSiteId ? this.queryCondition.siteId = this.searchForm.deviceSiteId : ''
        this.dateRange ? (
        this.queryCondition.startTime = moment(this.dateRange[0]).format('YYYY-MM-DD'),
        this.queryCondition.endTime = moment(this.dateRange[1]).format('YYYY-MM-DD')      
        ) : ''
      },
      deviceAction(val, flag) {
        let data = _.cloneDeep(val);
        data.dealStatus = flag === 1 ? "1" : "2";
        this.confirmData = data
        this.remarkDialogVisible = true
     },
     submitConfirm() {
       this.confirmData.alarmRemark2 = this.confirmRemark
       updateAlarmLog(this.confirmData).then(res => {
         if (res.data.code === 0) {
            this.$message.success("已确认")
            this.confirmData = {}
            this.remarkDialogVisible = false
            this.refreshList();
         }
       })
     },
      resetRemark() {
        this.confirmRemark = ''
      },
      // 获取数据列表
      refreshList () {
        // this.loading = true
        // 以服务方式调用loading
        if (this.themeFlag) {
          this.$nextTick(() => {
            // refreshList在created中调用，此时拿不到el-table
            this.loadingInstance = this.$loading({
              target: '.el-table',
              text: '加载中',
              background: 'rgba(0, 0, 0, 0.8)'
            })
          })
        } else {
          this.$nextTick(() => {
            this.loadingInstance = this.$loading({
              target: '.el-table',
              text: '加载中',
              background: 'rgba(255, 255, 255, 0.8)'
            })
          })
        }
        this.setQueryCondition()
        this.request({
          url: '/api-sdc/sdcsimulatoralarm/realTime/page/',
          method: 'get',
          params: this.queryCondition
        }).then(({data}) => {
          if (data.code === 0) {
            console.log(data);
            this.dataList = data.data.records
            this.total = data.data.total
            // this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
            //   this.loadingInstance.close();
            // });
            this.loadingInstance.close();

          }
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.size = val
        this.current = 1
        this.refreshList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.current = val
        this.refreshList()
      },
      // 查看
      view (row) {
        // this.$refs.sdcAlarmRecordForm.init('view', id)
        this.viewForm = _.cloneDeep(row)
        this.visible  = true
      },
      // 下载模板
      // downloadTpl () {
      //   this.$utils.download('/alarm/sdc/sdcalarmrecord/sdcAlarmRecord/import/template')
      // },
      // exportExcel () {
      //   let params = {
      //     ...this.searchForm
      //   }
      //   this.$utils.download('/alarm/sdc/sdcalarmrecord/sdcAlarmRecord/export', params)
      // },
      openSearchDialog() {
        this.searchDialogVisible = true
      },
      searchList() {
        this.current = 1
        this.setQueryCondition()
        this.refreshList()
        this.searchDialogVisible = false
      },
      // 清除筛选条件
      resetSearch () {
        this.searchForm = {
          deviceName: null,
          alarmCodeDesc: null,
          alarmLevel: null,
          dealStatus: null,
          deviceSiteId: null
        }
        this.dateRange = null
      },
      selectChange(selection) {
        this.selections = []
        selection.forEach(item => {
          this.selections.push(item.id)
        })
      },
      // 导出
      alarmListExport() {
        if (this.selections.length > 0) {
          AlarmExport(this.selections).then( res => {
            let filename = res.headers['content-disposition'].split('=')[1]
            let bolb = new Blob([res.data], {type: "application/vnd.ms-excel;charset=utf-8"})
            if (window.navigator.msSaveOrOpenBlob) { //兼容IE10
                navigator.msSaveBlob(bolb, filename)
            } else {
                const href = URL.createObjectURL(bolb) //创建新的URL表示指定的blob对象
                const a = document.createElement('a') //创建a标签
                a.href = href // 指定下载链接
                a.download = filename //指定下载文件名
                a.click() //触发下载
                URL.revokeObjectURL(a.href) //释放URL对象
            }
          })
        }
      },
      // 全屏切换
      async toggle() {
        await this.$fullscreen.toggle(this.$el.querySelector('.fullscreen-wrapper'), {
          teleport: false,
          callback: (isFullscreen) => {
            this.isfullscreen = this.$fullscreen.isFullscreen
            this.siteKey = Math.random().toString(36).slice(-6)
            this.dateKey = Math.random().toString(36).slice(-6)
            this.paginationKey = Math.random().toString(36).slice(-6)
          },
        })
        document.documentElement.requestFullScreen()
        // 唤起全屏的动作是异步的,在调用方法后无法立即获取预期的结果
        // this.isfullscreen = this.$fullscreen.isFullscreen
      },
      // 是否开启声音
      toggleVoice() {
        this.hasVoice = !this.hasVoice
      },
      handleSpeak(text) {
        this.msg.text = text;     // 文字内容
        this.msg.lang = "zh-CN";  // 使用的语言:中文
        this.msg.volume = 1;      // 声音音量：1
        this.msg.rate = 1;        // 语速：1
        this.msg.pitch = 0.5;       // 音高：1
        this.synth.speak(this.msg);    // 播放
      },
      cellMouseEnter(row, column, cell, event) {
        // console.log(row, column, cell, event);
      },
      toggleTheme() {
        this.themeFlag = !this.themeFlag
        if (this.themeFlag) {
          this.$refs.docWrapper.classList.remove('theme-light')
          this.$refs.docWrapper.classList.add('theme-dark')
        } else {
          this.$refs.docWrapper.classList.remove('theme-dark')
          this.$refs.docWrapper.classList.add('theme-light')
        }
      }
    }
  }
</script>
<style scoped lang="scss">
 @import "@/assets/scss/xps.scss";
 @import "@/styles/alarmTheme/dark.scss";
 @import "@/styles/alarmTheme/light.scss";
</style>
