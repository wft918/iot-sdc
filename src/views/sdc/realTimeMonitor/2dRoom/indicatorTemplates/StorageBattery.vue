<template>
  <div class="container">
    <el-row>
      <el-col>
        <span style="font-weight:700;">设备指标</span>
        <span>{{' ( ' + '数据采集时间：' + updateDate + ' ) '}}</span>
      </el-col>
    </el-row>
    <el-row style="margin-top:15px;">
      <div class="total-indicator-title">遥测指标</div>
    </el-row>
    <el-row style="margin-top:15px;" :gutter="25">
      <el-col :span="9">
        <span>电池组总电压</span>
        <span class="total-indicator-value">{{voltage + 'V'}}</span>
      </el-col>
      <el-col :span="7">
        <span>充电电流</span>
        <span class="total-indicator-value">{{chargeCurrent + 'A'}}</span>
      </el-col>
      <el-col :span="8">
        <span>放电电流</span>
        <span class="total-indicator-value">{{dischargeCurrent + 'A'}}</span>
      </el-col>
    </el-row>
    <el-row style="margin-top:15px;">
      <div class="battery-indicator-title">遥测-电池组指标</div>
    </el-row>
    <el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="volWarning ? '电压(V) ⚠' : '电压(V)'" name="1">
          <el-row>
            <el-card shadow="always">
              <el-col v-for="item in voltageLsit" :key="item.name"  :span="3">
                <div class="tab-content" :class="{'has-warning': item.state !== '0'}">
                  <div>{{'(' + item.name + ')'}}</div>
                  <div>{{item.value}}</div>
                </div>
              </el-col>
            </el-card>
          </el-row>
        </el-tab-pane>
        <el-tab-pane :label="temWarning ? '电阻(mΩ) ⚠': '电阻(mΩ)'" name="2">
          <el-row>
            <el-card shadow="always">
              <el-col v-for="item in resistorList" :key="item.name"  :span="3">
                <div class="tab-content" :class="{'has-warning': item.state !== '0'}">
                  <div>{{'(' + item.name + ')'}}</div>
                  <div>{{item.value}}</div>
                </div>
              </el-col>
            </el-card>
          </el-row>
        </el-tab-pane>
        <el-tab-pane :label="resWarning ? '温度(℃) ⚠' : '温度(℃)'" name="3">
          <el-row>
            <el-card shadow="always">
              <el-col v-for="item in temperatureLsit" :key="item.name"  :span="3">
                <div class="tab-content" :class="{'has-warning': item.state !== '0'}">
                  <div>{{'(' + item.name + ')'}}</div>
                  <div>{{item.value}}</div>
                </div>
              </el-col>
            </el-card>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script>
export default {
  props: ['devIndicators'],
  data() {
    return {
      voltage: '',
      dischargeCurrent: '',
      chargeCurrent: '',
      updateDate: '',
      activeName: '1',
      voltageLsit: [],
      resistorList: [],
      temperatureLsit: [],
      volWarning: false,
      temWarning: false,
      resWarning: false,
    }
  },
  created() {
    this.init()
  },
  destroyed() {
  },
  methods: {
    init() {
      if (this.devIndicators.length > 0) {
        this.updateDate = this.devIndicators[0].updateDate
      }
      this.voltageLsit = []
      this.resistorList = []
      this.temperatureLsit = []
      this.volWarning = false
      this.temWarning = false
      this.resWarning = false
      this.devIndicators.forEach(item => {
        if (item.paramId === '007302') {
          // 总电压
          this.voltage = item.value
        } else if (item.paramId === '007307') {
          // 充电电流
          this.chargeCurrent = item.value
        } else if (item.paramId === '007308') {
          // 放电电流
          this.dischargeCurrent = item.value
        } else if (item.paramId === '007303') {
          // 电池电压
          this.voltageLsit.push({name: item.signalNumber, value:item.value, state:item.state})
        } else if (item.paramId === '007304') {
          this.temperatureLsit.push({name: item.signalNumber, value: item.value, state:item.state})
        } else if (item.paramId === '007305') {
          this.resistorList.push({name: item.signalNumber, value: item.value, state:item.state})
        }
      })
      this.voltageLsit.some(item => {
        if (item.state !== '0') {
          this.volWarning = true
        }
      })
      this.temperatureLsit.some(item => {
        if (item.state !== '0') {
          this.temWarning = true
        }
      })
      this.resistorList.some(item => {
        if (item.state !== '0') {
          this.resWarning = true
        }
      })
    },
    handleClick() {
      console.log(this.activeName);
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  margin-left: 20px;
}
.total-indicator-title {
    width: 80px;
    height: 35px;
    line-height: 35px;
    text-align: center;
    background-color: #409EFF;
    color: #fff;
}
.total-indicator-value {
  margin-left: 20px;
  font-size: 18px;
  color: #409EFF;
}
.battery-indicator-title {
  width: 140px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  background-color: #409EFF;
  color: #fff;
}
.tab-content {
  width:50px;
  height:60px;
  background:#9FCEFF;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.el-card.is-always-shadow {
  -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0 , 0, 0.1)!important;
  box-shadow: 0 2px 12px 0 rgba(0, 0 , 0, 0.1)!important;
}
.has-warning {
  background: #F12323;
}
</style>