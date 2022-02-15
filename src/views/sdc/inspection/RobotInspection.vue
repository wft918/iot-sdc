<template>
  <basic-container>
    <el-row :gutter="15">
      <el-col :span="7">
        <div class="left">
          <el-row :gutter="15">
            <div class="left-title">           
              <el-col :span="8">
                <span>实时巡检视频</span>
              </el-col>
              <!-- <el-col :span="5">
                <el-button @click="openLiveVideo" :disabled="btnDisabled">开始</el-button>
              </el-col>
              <el-col :span="5">
                <el-button @click="closeLiveVideo" :disabled="!btnDisabled">关闭</el-button>
              </el-col>                               -->
            </div>
          </el-row> 
          <el-row>
            <el-col :span="24">
              <div class="live-player1">
                <div class="player-title">头部相机</div>
                <div ref="headVideoRef" style="width:100%;height:260px;background:#000;display:flex;justify-content:center;align-items:center">
                  <div  style="color:#fff;margin:auto;">无信号</div>
                </div>
              </div>
            </el-col>
            
          </el-row>
          <el-row>
            <div class="live-player2">
              <div class="player-title">手部相机</div>
              <div ref="handVideoRef" style="width:100%;height:260px;background:#000;display:flex;justify-content:center;align-items:center">
                <div style="color:#fff;margin:auto;">无信号</div>
              </div>
            </div>
          </el-row> 
        </div>
      </el-col>
      <el-col :span="12">
        <div class="center">
          <el-row>
            <span class="center-top-text">实时监测信息</span>
          </el-row>
          <el-row  class="center-position">
            <span>位置：{{'A栋/一层/数据机房'}}</span>
          </el-row>
          <!-- 机柜容量以及机房环境 -->
          <el-row>
            <el-descriptions class="margin-top" :column="3" size="medium" border :labelStyle="{background:'#F4F9FE',color:'#333'}">
              <el-descriptions-item>
                <template slot="label">
                  机架U位占位
                </template>
                {{rackData.usedLayerCount}}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  机架U位空余
                </template>
                {{rackData.unusedLayer}}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  空余位置
                </template>
                {{rackData.unusedLayerCount}}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  PM10
                </template>
                <span v-if="sensorData.pm10">{{sensorData.pm10 + ' ug/㎡'}}</span>
                <span></span>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  PM2.5
                </template>
                <span v-if="sensorData.pm25">{{sensorData.pm25 + ' ug/㎡'}}</span>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  MQ138
                </template>
                <span v-if="sensorData.mq138">{{sensorData.mq138 + ' ppm'}}</span>               
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  二氧化硫
                </template>
                <span v-if="sensorData.so2">{{sensorData.so2 + ' ppm'}}</span>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  温度
                </template>
                <span v-if="sensorData.temp">{{sensorData.temp + ' ℃'}}</span>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  湿度
                </template>
                <span v-if="sensorData.hum">{{sensorData.hum + ' %'}}</span>
              </el-descriptions-item>
            </el-descriptions>
          </el-row>
          <!-- 机柜表面红外温度 -->
          <el-row class="infrared-temperature">
            <div class="infrared-title">
              <span class="infrared-title">机器人红外线扫描温度</span>
            </div>   
            <el-row class="infrared-table">
              <!-- <el-row v-if="infraredDatas.length > 6">
                <el-col :span="4" v-for="item in 6" :key="item + 24">
                  <el-descriptions class="margin-top" :column="1" size="medium" border :labelStyle="{width:'66.38px',background:'#177DD8',color:'#fff'}" :contentStyle="{background:'#1592FF',color:'#fff'}">
                    <el-descriptions-item>
                      <template slot="label">
                        编号
                      </template>
                      温度℃
                    </el-descriptions-item>           
                  </el-descriptions>
                </el-col> 
              </el-row>               -->
              <el-row>
                <el-col :span="4" v-for="item in 6" :key="item + 24">
                  <el-descriptions class="margin-top" :column="1" size="medium" border :labelStyle="{width:'66.38px',background:'#177DD8',color:'#fff'}" :contentStyle="{background:'#1592FF',color:'#fff'}">
                    <el-descriptions-item>
                      <template slot="label">
                        编号
                      </template>
                      温度℃
                    </el-descriptions-item>           
                  </el-descriptions>
                </el-col> 
              </el-row>     
              <el-col :span="4" v-for="item in infraredDatas" :key="item.id">
                <el-descriptions class="margin-top" :column="1" size="medium" border :labelStyle="{width:'66.38px',background:'#F4F9FE',color:'#333'}">
                  <el-descriptions-item>
                    <template slot="label">
                      {{item.uindex + 'u'}}
                    </template>
                    {{item.value + item.unit}}
                  </el-descriptions-item>           
                </el-descriptions>
              </el-col> 
            </el-row>     
          </el-row>         
        </div>
      </el-col>
      <!-- 右边图片 -->
      <el-col :span="5">
        <div class="right">
          <el-row :gutter="30" class="img-container">
            <el-col :span="10">
              <el-image v-if="imageVisable" :src="imageVisable.fileHttpUrl" :preview-src-list="[imageVisable.fileHttpUrl]"></el-image>
              <img v-else src="">
              <div class="mask">机柜照片</div>
            </el-col>
            <el-col :span="10">
              <el-image v-if="imageInfrared" :src="imageInfrared.fileHttpUrl" :preview-src-list="[imageInfrared.fileHttpUrl]"></el-image>
              <img v-else src="">
              <div class="mask">红外照片</div>
            </el-col>
          </el-row>
          <el-row>
            <el-table
              :data="deviceDatas" 
              border 
              style="margin: 0.75rem 0"
              :empty-text="ditEmptyText"
            >
               <el-table-column
                type="index"
                label="序号"
                align="center"
                width="50"
              ></el-table-column>
              <el-table-column
                prop="deviceName"
                label="设备名称"
                align="center"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column
                prop="propertyName"
                label="设备属性名"
                align="center"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column
                prop="info"
                label="状态"
                align="center"
                :show-overflow-tooltip="true"
              >
                <!-- <template slot-scope="scope">
                  <span v-if="scope.row.info === '0'">正常</span>
                  <span v-else>异常</span>
                </template> -->
              </el-table-column>
            </el-table>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </basic-container>
</template>

<script>
import {getStore} from '@/util/store.js'
import Stomp from 'stompjs'
  // socket功能
import SockJS from 'sockjs-client'
import store from '@/store'
import Pagination from "@/components/Pagination";
import LivePlayer from "@liveqing/liveplayer";
export default {
  components: {
    LivePlayer,
    Pagination,
  },
  data() {
    return {
      siteId: this.$dictUtils.getDictValue('fsu_param','robotSiteId', ''),
      headUrl: this.$dictUtils.getDictValue('sys_param','robotHeadWs', ''),
      handUrl: this.$dictUtils.getDictValue('sys_param','robotHandWs', ''),
      url : this.$dictUtils.getDictValue("vedio_param", "url_ip", ""),
      port: this.$dictUtils.getDictValue("vedio_param", "port", ""),
      ws_port: this.$dictUtils.getDictValue("vedio_param", "ws_port", ""),
      ditEmptyText: '数据加载中',
      sensorData: {},
      rackData: {},
      infraredDatas: [],
      deviceDatas: [],
      imageVisable: {},
      imageInfrared: {},
      timer: ''
    }
  },
  created() {
    this.getRobotindicator()
  },
  mounted() {
    this.initWebSocket()
    let headIframe = '<iframe src="' + 'http://'+ this.url + ':'  + this.port + '/#/play/wasm/' + encodeURIComponent(this.headUrl) + '" scrolling="no" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" width="100%" height="100%" frameborder="0"></iframe>',
        handIframe = '<iframe src="' + 'http://'+ this.url + ':'  + this.port + '/#/play/wasm/' + encodeURIComponent(this.handUrl) + '" scrolling="no" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" width="100%" height="100%" frameborder="0"></iframe>'
    this.$refs.headVideoRef.innerHTML = headIframe
    this.$refs.handVideoRef.innerHTML = handIframe
  },
  activated () {
    this.initWebSocket()
  },
  deactivated() {
    clearInterval(this.$store.state.user.robotRealTimer)
    this.disconnect()
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.disconnect()
  },
  methods: {
    // 请求机器人数据
    getRobotindicator() {
      this.loading = true
            this.$http({
              url:`/api-sdc/sdcrobotindicator/getBySiteId/${this.siteId}`,
              method:"get",
            }).then(res => {
              if (res.data.code === 0) {
                let data = res.data.data
                this.sensorData = data.sensor
                this.rackData = data.rack
                this.infraredDatas = data.infraredDatas
                this.deviceDatas = data.deviceDatas
                this.imageVisable = data.imageVisable
                this.imageInfrared = data.imageInfrared
                if (this.deviceDatas.length === 0) {
                  this.ditEmptyText = '暂无数据'
                }
              }
            })
    },
    // 初始化websocket
    initWebSocket() {
      this.connection()
      const self = this
      // 断开重连机制,尝试发送消息,捕获异常发生时重连
      if (this.$store.state.user.robotRealTimer) {
        clearInterval(this.$store.state.user.robotRealTimer)
      }
      this.$store.state.user.robotRealTimer = setInterval(() => {
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
        this.stompClient.subscribe('/api/queue', function(message) { // 订阅服务端提供的某个topic;
          if (message) {
            let newMsg = JSON.parse(message.body)
            console.log(newMsg);
            _this.sensorData = newMsg.sensor
            _this.rackData = newMsg.rack
            _this.infraredDatas = newMsg.infraredDatas
            _this.deviceDatas = newMsg.deviceDatas
            _this.imageVisable = newMsg.imageVisable
            _this.imageInfrared = newMsg.imageInfrared             
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
    }
  }
}
</script>

<style lang="scss" scoped>
.left {
  .left-title {
    span {
      font-size: 16px;
      font-weight: 700;
    }
  }
  .player-title {
    width: 100%;
    height: 40px;
    line-height: 40px;
    background: #333;
    color: #fff;
    text-align: center;
  }
  
  .live-player1 {
    margin-top: 20px;
  }
  .live-player2 {
    margin-top: 50px;
  }
}
.center {
  // height: 100vh;
  .center-top-text {
    font-size: 16px;
    font-weight: 700;
  }
  .center-position {
    margin: 20px 8px;
    span {
      font-size: 14px;
    }
  }
  .infrared-temperature {
    .el-col {
      margin: 0;
    }
    .infrared-title {
      margin: 20px 0 0 5px;
      font-size: 16px;
    }
    .infrared-table {
      margin-top: 10px;
    }
  }
}
.right {
  // height: 50vh;
  // background: crimson;
  .img-container .el-col{
    // width:50%;
    height: 480px;
    // border: 1px solid #FFCCCC;
    // float: left; 
    margin-top: 20px;
    margin-left: 20px;
    position:relative;
    img,
    .el-image {
      width:100%;
      height:450px;
    }
    .mask {
      width:100%;
      height: 40px; 
      line-height: 40px;
      background-color:#666;
      position: absolute;
      margin-top: -40px;
      left: 0;
      opacity: 0.6;
      color: #fff;
      text-align: center;
    }
  }
}
</style>