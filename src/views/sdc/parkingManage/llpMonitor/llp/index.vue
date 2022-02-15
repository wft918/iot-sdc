<template>
  <div>
    <basic-container>
      <el-row :gutter="15"> 
        <el-col :span="18">
          <el-row :gutter="15">
            <el-col :span="12">
              <el-row :gutter="15">
                <el-col :span="6">
                  <el-select placeholder="请选择停车场" v-model="parkingName" @change="selectParkInfo" >
                    <el-option
                      v-for="item in parkingNameMap"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-col>
                <el-col :span="6">
                  <el-select placeholder="入场道闸名称" v-model="entranceGateCode" :disabled="isGateDisabled" @change="setCodeName">
                    <el-option
                      v-for="item in entranceGateCodeMap"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-col>
                <el-col :span="6">
                  <el-select placeholder="摄像头" v-model="inIpcId" @change="getInIPC">
                    <el-option
                      v-for="item in inIPCMap"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-col>
                <el-col :span="24">
                  <div class="monitor-info">
                    <span>入口道闸编号：{{entranceGateCodeName}} {{currentDate}}</span>
                  </div>
                </el-col>
                <el-col :span="24">
                  <LivePlayer :videoUrl="videoUrl" fluent autoplay live stretch></LivePlayer>
                </el-col>
                <el-col :span="24">
                  <div class="monitor-info">
                    <span style="margin-right:10px">车牌号：{{carPlateCode}} </span>
                    <span style="margin-right:10px">车辆类型：{{carType}} </span>
                    <span style="margin-right:15px">入场时间：{{admissionDate}}</span>
                    <el-button type="primary" @click="inAction">放行</el-button>
                  </div>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="12">
               <el-row :gutter="15">
                <el-col :span="10">
                  <el-select placeholder="出场道闸名称" v-model="exitGateCode" :disabled="isGateDisabled" @change="setExitCodeName">
                    <el-option
                      v-for="item in exitGateCodeMap"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-col>
                <el-col :span="6">
                  <el-select placeholder="摄像头" v-model="outIpcId" @change="getOutIPC">
                    <el-option
                      v-for="item in outIPCMap"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-col>
                <el-col :span="24">
                  <div class="monitor-info">
                    <span>出口道闸编号：{{exitGateCodeName}} {{currentDate}}</span>
                  </div>
                </el-col>
                <el-col :span="24">
                  <LivePlayer :videoUrl="videoUrl2" fluent autoplay live stretch></LivePlayer>
                </el-col>
                <el-col :span="24">
                  <div class="monitor-info">
                    <span style="margin-right:10px">车牌号：{{carPlateCode2}} </span>
                    <span style="margin-right:10px">车辆类型：{{carType2}} </span>
                    <span style="margin-right:15px">出场时间：{{admissionDate2}}</span>
                    <el-button type="primary" @click="outAction">放行</el-button>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row :gutter="15">
            <div class="model-btn">
              <el-button type="primary" size="small">3D</el-button>
              <el-button type="primary" size="small">2D</el-button>
            </div>
            <el-col :span="24">
              <div id="canvas" style="position:relative">
                <img ref="roomImg" id="roomImg" :src="plateImg" style="width: 1211px; height: 895px"/>
                <template v-for="(item,index) in deviceInfo">
                  <parkInfo 
                    :key="deviceKey+index" 
                    :deviceData="item" 
                    :width="120" 
                    :height="80" 
                    :id="index"
                    :isShow="textShow"
                    :isDraggable="isDraggable"
                    :type="'dev'"
                  ></parkInfo>
                </template>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6" style="font-size: 13px">
          <el-row :gutter="15" style="margin-left:10px">
            <el-card shadow="always" header="停车场信息">
              <el-row :gutter="10">
                <el-col :span="6">停车场名称：</el-col>
                <el-col :span="16">{{parkInfo.name}}</el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="6">停车场编号：</el-col>
                <el-col :span="16">{{parkInfo.code}}</el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="6">车位数：</el-col>
                <el-col :span="16">{{parkInfo.parkingSpaceNumber}}</el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="6">空位数：</el-col>
                <el-col :span="16">{{parkInfo.parkingSpaceNumber - parkInfo.usedParkingSpaceNumber || ''}}</el-col>
              </el-row>
            </el-card>
          </el-row>
          <el-row :gutter="15" style="margin-left:10px">
            <el-card shadow="always" header="分时进出统计">
              <div ref="archart" id="archart" style="width:100%;height:300px"></div>
            </el-card>
          </el-row>
          <el-row :gutter="15" style="margin-left:10px">
            <el-card shadow="always" header="收费统计">
              <el-row>
                <el-col :span="6" class="pay-count">
                  <div style="margin: 40px 0 20px 0">共收金额：</div>
                  <div>366</div>
                </el-col>
                <el-col :span="18">
                  <div ref="payEchart" id="payEchart" style="width:100%;height:180px"></div>
                </el-col>
              </el-row>
            </el-card>
          </el-row>
          <el-row :gutter="15" style="margin-left:10px">
            <el-card shadow="always" header="本次计费信息">
              <template v-if="chargeInfo !== null">
                <el-row :gutter="10">
                  <el-col :span="6">车牌号：</el-col>
                  <el-col :span="16">{{chargeInfo.plateNumber}}</el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="6">道闸编号：</el-col>
                  <el-col :span="16">{{gateCode}}</el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="6">入场时间：</el-col>
                  <el-col :span="16">{{chargeInfo.inTime}}</el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="6">出场时间：</el-col>
                  <el-col :span="16">{{chargeInfo.outTime}}</el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="6">停车时长：</el-col>
                  <el-col :span="16">{{chargeInfo.plateNumber}}</el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="6">车辆类型：</el-col>
                  <el-col :span="16">{{chargeInfo.carType}}</el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="6">停车费用：</el-col>
                  <el-col :span="16">{{chargeInfo.amount}}元</el-col>
                </el-row>
              </template>
              <!-- <div style="font-size: 20px;text-align:center">
                <div style="margin:20px 0;color:#409EFF">收费{{parkingPay}}元</div>
                <el-button type="primary" style="font-size: 20px;">放行</el-button>
              </div> -->
            </el-card>
          </el-row>
        </el-col>
      </el-row>
      <el-row :gutter="15" style="margin:0.75rem 0">
            <div class="table-title">今日出入场记录</div>
            <el-table
              :data="tableInfo"
              border
              style="margin:0.75rem 0"
            >
              <el-table-column 
                type="index"
                label="序号"
                align="center"
                sortable
              ></el-table-column>
              <el-table-column 
                prop="parkId"
                label="停车场名称"
                align="center"
                :formatter="setParkName"
              ></el-table-column>
              <el-table-column 
                prop="plateNumber"
                label="车牌号"
                align="center"
              ></el-table-column>
              <el-table-column 
                prop="plateColor"
                label="车牌颜色"
                align="center"
                :formatter="setPlateColorType"
              ></el-table-column>
              <el-table-column 
                prop="carType"
                label="车辆类型"
                align="center"
                :formatter="setCarType"
              ></el-table-column>
              <el-table-column 
                prop="inTime"
                label="入场时间"
                align="center"
              ></el-table-column>
              <el-table-column 
                label="入场道闸" 
                prop="expand.inBarrierName" 
                align="center"
              ></el-table-column>
              <el-table-column 
                label="出场时间"
                align="center"
              >
                <template slot-scope="scope">{{scope.row.outTime || '--'}}</template>
              </el-table-column>
              <el-table-column 
                label="出场道闸" 
                prop="expand.outBarrierName"
                align="center"
              >
              </el-table-column>
              <el-table-column 
                prop="parkingTime"
                label="停车时长"
                align="center"
                :formatter="setParkTime"
              ></el-table-column>
              <el-table-column
                label="缴费金额"
                align="center"
              >
                <template slot-scope="scope">{{scope.row.amount || '--'}}</template>
              </el-table-column>
              <el-table-column 
                prop="payChannelId"
                label="支付方式"
                align="center"
                :formatter="setPayType"
              ></el-table-column>
              <el-table-column 
                prop="contactsName"
                label="值班人"
                align="center"
              ></el-table-column>
            </el-table>
            <Pagination :page="page" :size="size" :total="total" @pagination="queryByPage"></Pagination>
          </el-row>
    </basic-container>
  </div>
</template>

<script>
import moment from "moment";
import LivePlayer from '@liveqing/liveplayer'

import plateUrl from "@/assets/img/plate.png";

import Pagination from "@/components/Pagination";
import parkInfo from "@/components/DrawCanvas/parkInfo";

import $ from "jquery";

import {  getSdcParkuselogTable,getSdcCountInOut,getSdcVideoInfo } from "@/api/sdc/parkMonitor";

import { getSdcParkingLotTable,getSdcParkPlaceTable } from "@/api/sdc/parkManage";
import { getSdcDeviceTableBy,getSdcTableBy,getSdcGateInfo,getSdcDeviceTable } from "@/api/sdc/deviceInfo";
import { sdcSiteAction } from "@/api/sdc/addressInfo";

import parkImgUrl from "../../../../../assets/img/park.jpg";

export default {
  components: {
    LivePlayer,
    Pagination,
    parkInfo
  },
  data() {
    return {
      // plateImg: parkImgUrl,
      url : this.$dictUtils.getDictValue("vedio_param", "url_ip", ""),
      port: this.$dictUtils.getDictValue("vedio_param", "port", ""),
      plateImg: null,
      videoUrl: null,
      videoUrl2: null,
      parkingName: null,
      parkingNameMap: [],
      entranceGateCode: '',
      entranceGateCodeMap: [],
      currentDate: new Date(),
      carPlateCode: '京A•K954A',
      carType: '特权车',
      admissionDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      exitGateCode: '',
      exitGateCodeMap: [],
      carPlateCode2: '京A•K980B',
      carType2: '月租车',
      admissionDate2: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      tableInfo: [],
      page: 1,
      size: 5,
      total: 0,
      parkingCode: null,
      parkNums: 200,
      emptyNums: 80,
      temporaryCarNumms: 50,
      normalCarNums: 100,
      manager: '李时明',
      loginDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      temporaryCarPay: 15.00,
      normalCarPay: 12.00,
      freeCarNums: 5,
      manualReleaseNums: 9,
      onlinePay: 300,
      cashPay: 60,
      gateCode: 'SD-1-8-01',
      appearanceDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      parkingTime: '3小时15分',
      discountTime: '30分',
      chargeTime: '2小时45分',
      parkingPay: 30,
      parkInfo: {
        name: null,
        code: null,
        parkingSpaceNumber: null,
        usedParkingSpaceNumber: null,
      },
      parkData: null,
      deviceInfo: [],
      plateInfo: [],
      deviceKey: Math.random().toString(36).slice(-6),
      textShow: true,
      isDraggable: false,
      pageKey:Math.random().toString(36).slice(-6),
      queryCondition: {},
      isGateDisabled: true,
      chargeInfo: null,
      entranceGateCodeName: null,
      exitGateCodeName: null,
      inIPCMap: [],
      IPCData: [],
      inIpcId: null,
      outIPCMap: [],
      outIpcId: null
    }
  },
  created() {
    this.getCurrentDate()
    this.getIPCInfo()
    this.init()
  },
  mounted() {
    this.payChartsInit()
    this.arChartsInit()
  },
  computed: {
    plateImgInfo() {
      console.log(document.getElementById('roomImg'),'this.$refs.roomImg');
      return this.$refs
    }
  },
  watch: {
    plateImgInfo: {
      handler: function(val) {
        for (const key in val) {
          if (Object.hasOwnProperty.call(val, key)) {
            const element = val[key];
            console.log(element,'element');
          }
        }
        console.log(val,'val888888');
      },
      immediate: true
    }
  },
  methods: {
    async init() {
      this.getParkInfo()
      this.queryInfo()
    },
    async getIPCInfo() {
      getSdcDeviceTable({ videoType: '1' }).then( res => {
        this.IPCData = res.data.data.records
      })
    },
    async arChartsInit() {
      let data = await getSdcCountInOut(this.parkingName)
      console.log(data,'data');
      let chartData = data.data.data
      let categoryArray = chartData.categories.length !== 0 
        ? chartData.categories : []
      let inData = [],outData = []
      if(chartData.series[0].name === '入场') {
        inData = chartData.series[0].data
        outData = chartData.series[1].data
      } else {
        inData = chartData.series[1].data
        outData = chartData.series[0].data
      }
      //注：需要挂载后，this.$refs.lineEchart才能获取
      let archart = this.$echarts.init(this.$refs.archart)
      archart.setOption({
        color: ['#3f8ef7', '#76EE00'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['入场', '出场'],
          icon: 'circle',
          left: '50%',
          itemGap: 5,
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: categoryArray
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine:{
                show:false
            }
          }
        ],
        series: [
          {
            name: '入场',
            type: 'bar',
            emphasis: {
                focus: 'series'
            },
            data: inData
          },
          {
            name: '出场',
            type: 'bar',
            emphasis: {
                focus: 'series'
            },
            data: outData
          }
        ]
      })
    },
    async payChartsInit() {
      //注：需要挂载后，this.$refs.lineEchart才能获取
      let powerEcharts = this.$echarts.init(this.$refs.payEchart);
      powerEcharts.setOption({
        color: ["#3f8ef7", "#FFCAC1", "#3FF2F7"],
        tooltip: {
          trigger: "item",
          formatter: '{b} <br/>   {c} 元'
        },
        legend: {
          top: '85%',
          left: 'center',
          icon: "circle",
        },
        series: [
          {
            type: "pie",
            radius: '50%',
            data: [
              { value: 135.0, name: "支付宝" },
              { value: 180.0, name: "微信" },
              { value: 84.0, name: "现金" },
            ],
          },
        ],
      })
    },
    //获取停车场信息
    async getParkInfo() {
      let tableData = await getSdcParkingLotTable({
        current: 1,
        size: 100
      })
      this.parkData = tableData.data.data.records
      for (let index = 0; index < tableData.data.data.records.length; index++) {
        const el = tableData.data.data.records[index];
        this.parkingNameMap.push({
          value: el.id,
          label: el.name,
        });
      }
      this.parkingName = this.parkingNameMap[0].value
      this.selectParkInfo()
    },
    async selectParkInfo() {
      this.isGateDisabled = false
      this.deviceInfo = []
      this.entranceGateCodeMap = []
      this.exitGateCodeMap = []
      let siteId
      for (let index = 0; index < this.parkData.length; index++) {
        const el = this.parkData[index];
        if(el.id === this.parkingName) {
          this.parkInfo = el
          siteId = el.siteId
          break;
        }
      }
      
      Promise.all([
        sdcSiteAction('','/'+ siteId,'get'),
        getSdcDeviceTableBy(1,100,'',siteId,'6'),
        getSdcParkPlaceTable({ current:1,size:200,parkId: this.parkingName }),
        getSdcParkuselogTable({
          current:1,
          size:1,
          descs:'pay_time'
        }),
        getSdcTableBy({
          current: 1,
          size: 100,
          siteId: siteId,
          topTypeCode: 'barrier'
        })
      ]).then( res => {
        console.log(res, 'all data res');
        //停车场地图信息
        this.plateImg = res[0].data.data.siteImg
        //停车场最新计费信息
        this.chargeInfo = res[3].data.data.records[0]
        //停车场设备信息
        for (let index = 0; index < res[1].data.data.records.length; index++) {
          const el = res[1].data.data.records[index];
          this.deviceInfo.push({
            type:'dev',
            data: el
          })
        }
        //停车场车位信息
        for (let index = 0; index < res[2].data.data.records.length; index++) {
          const el = res[2].data.data.records[index];
          this.deviceInfo.push({
            type:'plate',
            data: el
          })
        }

        console.log(this.deviceInfo,'this.deviceInfo');
        //停车场道闸信息
        for (let index = 0; index < res[4].data.data.records.length; index++) {
          const element = res[4].data.data.records[index];
          if (element.expand.direction ==='1') {
            this.entranceGateCodeMap.push({
              value: element.id,
              label: element.name,
              expand: element.expand
            })
          } else if (element.expand.direction ==='0') {
            this.exitGateCodeMap.push({
              value: element.id,
              label: element.name,
              expand: element.expand
            })
          } else {
            this.entranceGateCodeMap.push({
              value: element.id,
              label: element.name,
              expand: element.expand
            })
            this.exitGateCodeMap.push({
              value: element.id,
              label: element.name,
              expand: element.expand
            })
          }
        }
        

        if(this.entranceGateCodeMap.length !== 0) {
          this.entranceGateCode = this.entranceGateCodeMap[0].value 
        }
        
        this.setCodeName()

        if(this.exitGateCodeMap.length !== 0) {
          this.exitGateCode = this.exitGateCodeMap[0].value
          
        }
        
        this.setExitCodeName()

        this.deviceKey = new Date().toString()
        //设置柱状图
        this.arChartsInit()
      })
    },
    setInIPCName() {

    },
    getCurrentDate() {
      setInterval(() => {
        this.currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      },1000)
    },
    async queryInfo() {
      this.setQueryCondition()
      let tableData = await getSdcParkuselogTable(this.queryCondition)
      console.log(tableData,'tableData');
      this.tableInfo = tableData.data.data.records
      this.setpage(tableData.data.data);
    },
    setQueryCondition() {
      this.queryCondition = {
        current:this.page,
        size: this.size
      }
    },
    setpage(data) {
      this.page = data.current;
      this.size = data.size;
      this.total = data.total;
      this.pageKey = (new Date()).toString() + 1
    },
    async queryByPage(data) {
      this.page = data.page
      this.size = data.size
      this.queryInfo()
    },
    setParkName(val) {
      let text
      for (let index = 0; index < this.parkingNameMap.length; index++) {
        const el = this.parkingNameMap[index];
        if (el.value === val.parkId) {
          text = el.label
          break;
        }
      }
      return text
    },
    setCarType(val) {
      let carTypeMap = this.$dictUtils.getDictList('car_type')
      let text
      for (let index = 0; index < carTypeMap.length; index++) {
        const el = carTypeMap[index];
        if (el.value === val.carType) {
          text = el.label
          break;
        }
      }
      return text
    },
    setPlateColorType(val) {
      let plateColorMap = this.$dictUtils.getDictList('plate_color_type')
      let text
      for (let index = 0; index < plateColorMap.length; index++) {
        const el = plateColorMap[index];
        if (el.value === val.plateColor) {
          text = el.label
          break;
        }
      }
      return text
    },
    setPayType(val) {
      let plateColorMap = this.$dictUtils.getDictList('pay_type')
      let text
      for (let index = 0; index < plateColorMap.length; index++) {
        const el = plateColorMap[index];
        if (el.value === val.payChannelId) {
          text = el.label
          break;
        }
      }
      return text
    },
    async setInGateCode(val) {
      let inGateInfo = await getSdcGateInfo(val.inBarrierId)
      return inGateInfo.data.data.name
    },
    async setExitGateCode(val) {
      let text
      if(val.outBarrierId) {
        let outGateInfo = await getSdcGateInfo(val.outBarrierId)
        text = outGateInfo.data.data.name
      } else {
        text = '--'
      }
      
      return text
    },
    setParkTime(val) {
      let time = val.outTime 
      ? new Date(val.outTime).getTime() - new Date(val.inTime).getTime()
      : new Date().getTime() - new Date(val.inTime).getTime()
      let total = time/1000

      let day = parseInt(total / (24*60*60));//计算整数天数

      let afterHour = total - day*24*60*60;//取得算出天数后剩余的秒数

      let hour = parseInt(afterHour/(60*60));//计算整数小时数

      let afterMin = total - day*24*60*60 - hour*60*60;//取得算出小时数后剩余的秒数

      let min = parseInt(afterMin/60);//计算整数分

      let afterSeconds = parseInt(total - day*24*60*60 - hour*60*60 - min*60);//取得算出分后剩余的秒数
      
      let text = ''
      if(day !== 0) {
        text += day + ' 天 '
      }
      if(hour !== 0) {
        text += hour + ' 小时 '
      }
      if(min !== 0) {
        text += min + ' 分 '
      }
      if(afterSeconds !== 0) {
        text += afterSeconds + ' 秒 '
      }
      return text
    },
    setCodeName() {
      console.log(1111);
      this.inIPCMap = []
      for (let index = 0; index < this.entranceGateCodeMap.length; index++) {
        const el = this.entranceGateCodeMap[index];
        if(el.value === this.entranceGateCode) {
          this.entranceGateCodeName = el.label
          let ipcIds = this.entranceGateCodeMap[0].expand.ipcIds
          for (let index = 0; index < this.IPCData.length; index++) {
            const el = this.IPCData[index];
            for (let j = 0; j < ipcIds.length; j++) {
              const element = ipcIds[j];
              if(el.id === element) {
                this.inIPCMap.push(el)
              }
            }
          }
          break
        }
      }
      this.inIpcId = this.inIPCMap[0]

      this.getInIPC()
    },
    async getInIPC() {
      getSdcDeviceTable({ id: this.inIpcId}).then( res => {
        console.log(res,'IPC log');
      })
      getSdcDeviceTable({ videoType: '1' }).then( res => {
        $.get('http://' + this.url + ':' + this.port + '/api/v1/stream/start', {
          serial: res.data.data.records[0].devicechannel,
          code: res.data.data.records[0].channel,
        }).then(data => {
          this.videoUrl = data.WS_FLV;
        })
      })
    },
    setExitCodeName() {
      console.log(222222);
      this.outIPCMap = []
      for (let index = 0; index < this.exitGateCodeMap.length; index++) {
        const el = this.exitGateCodeMap[index];
        if(el.value === this.exitGateCode) {
          this.exitGateCodeName = el.label
          let ipcIds = this.exitGateCodeMap[0].expand.ipcIds
          for (let index = 0; index < this.IPCData.length; index++) {
            const el = this.IPCData[index];
            for (let j = 0; j < ipcIds.length; j++) {
              const element = ipcIds[j];
              if(el.id === element) {
                this.outIPCMap.push(el)
              }
            }
          }
          break
        }
      }
      this.outIpcId = this.outIPCMap[0]
      this.getOutIPC()
    },
    async getOutIPC() {
      getSdcDeviceTable({ id: this.outIpcId}).then( res => {
        
        console.log(res,'IPC log');
      })

      getSdcDeviceTable({ videoType: '1' }).then( res => {
        $.get('http://' + this.url + ':' + this.port + '/api/v1/stream/start', {
          serial: res.data.data.records[0].devicechannel,
          code: res.data.data.records[0].channel,
        }).then(data => {
          this.videoUrl2 = data.WS_FLV;
        })
      })
    },
    inAction() {
      this.$notify({
          title: '成功',
          message: '车辆入场放行成功',
          type: 'success',
          duration: 5000
        })
    },
    outAction() {
      this.$notify({
          title: '成功',
          message: '车辆出场放行成功',
          type: 'success',
          duration: 5000
        })
    }
  }
}
</script>

<style>
.monitor-info {
  font-size: 13px;
  margin-top: 8px;
  color: #409EFF;
}

.model-btn {
  /* float: right; */
  margin-bottom: 0.75rem;
}

.table-title {
  margin: 8px 0 15px 0; 
  color: #409EFF;
  font-size: 16px;
}

.pay-count {
  font-size:16px;
  color:#409EFF;
  text-align:center
}
</style>