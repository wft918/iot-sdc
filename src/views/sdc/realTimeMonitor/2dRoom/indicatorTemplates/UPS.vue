<template>
  <div class="container">
    <el-row>
      <el-col>
        <span style="font-weight:700;">设备指标</span>
        <span>{{' ( ' + '数据采集时间：' + updateDate + ' ) '}}</span>
      </el-col>
    </el-row>
    <el-row style="margin-top:20px;">
      <div class="yx-indicator-title">遥信指标</div>
    </el-row>
    <el-row v-if="typeCode === '00803'" style="margin-top:5px;" :gutter="25">
      <el-col :span="9">
        <div class="yx-indicator">
          <div class="yx-indicator-label">正常工作状态</div>
          <div v-if="workState === '0'" class="yx-indicator-value">正常</div>
          <div v-else class="yx-indicator-value abnormal-color">异常</div>
        </div>
      </el-col>
      <el-col :span="9">
        <div class="yx-indicator">
          <div class="yx-indicator-label">输出断路器关闭状态</div>
          <div v-if="outBreakerState === '0'" class="yx-indicator-value">正常</div>
          <div v-else class="yx-indicator-value abnormal-color">异常</div>
        </div>
      </el-col>
    </el-row>
    <el-row v-if="typeCode === '00802'" style="margin-top:5px;" :gutter="25">
      <el-col>
        <div class="yx-indicator">
          <div class="yx-indicator-label">工作状态：</div>
          <div v-if="workState === '0'" class="yx-indicator-value">主路</div>
          <div v-else-if="sideWorkState === '0'" class="yx-indicator-value">旁路</div>
          <div v-else class="yx-indicator-value">电池组</div>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-top:20px;">
      <div class="group-indicator-title">遥测指标</div>
    </el-row>
    <el-row style="margin-top:15px;">
      <el-col :span="8" v-for="item in phase" :key="item.name" style="margin-bottom:15px;">
        <span>{{item.name}}</span>
        <span style="margin-left:10px;margin-bottom:20px;color:#409EFF;">{{item.value + item.unit}}</span>
      </el-col>
    </el-row>
    <el-row style="margin-top:20px;">
      <div class="group-indicator-title">遥测-分组指标</div>
    </el-row>
    <el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="A相" name="1">
          <el-row>
            <el-col :span="12" v-for="item in aPhase" :key="item.name" style="margin-bottom:15px;">
              <span>{{item.name}}</span>
              <span style="margin-left:10px;margin-bottom:20px;color:#409EFF;">{{item.value + item.unit}}</span>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="B相" name="2">
          <el-row>
            <el-col :span="12" v-for="item in bPhase" :key="item.name" style="margin-bottom:15px;">
              <span>{{item.name}}</span>
              <span style="margin-left:10px;margin-bottom:20px;color:#409EFF;">{{item.value + item.unit}}</span>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="C相" name="3">
          <el-row>
            <el-col :span="12" v-for="item in cPhase" :key="item.name" style="margin-bottom:15px;">
              <span>{{item.name}}</span>
              <span style="margin-left:10px;margin-bottom:20px;color:#409EFF;">{{item.value + item.unit}}</span>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script>
export default {
  props: ['devIndicators','typeCode','deviceId'],
  data() {
    return {
      updateDate: '',
      activeName: '1',
      workState: '0',
      outBreakerState: '0',
      sideWorkState: '0',
      batteryWorkState: '0',
      phase: [],
      aPhase: [],
      bPhase: [],
      cPhase: []
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
      console.log(this.updateDate,'this.updateDate');
      this.aPhase = []
      this.bPhase = []
      this.cPhase = []
      this.phase = []
      this.devIndicators.forEach(item => {
        switch(item.paramId) {
          // 旁路方式工作状态
          case '008407':
            this.sideWorkState = item.state
          // 正常工作状态
          case '008406': 
            this.workState = item.state;
            break;
          // 电池方式工作状态
          case '008408': 
            this.batteryWorkState = item.state;
            break;
          // 输出断路器关闭状态
          case '008402':
            this.outBreakerState = item.state;
            break;
          /**
           * 遥测指标
           */
          // 输入频率
          case '008310':
            this.phase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 输入功率因数
          case '008311':
            this.phase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 输出频率
          case '008321':
            this.phase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 输出功率因数
          case '008322':
            this.phase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 旁路频率
          case '008332':
            this.phase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 电池组电流
          case '008333':
            this.phase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 电池组电压
          case '008334':
            this.phase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 主机温度
          case '008346':
            this.phase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 整流器温度
          case '008348':
            this.phase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          /**
           * A相相关
          */ 
          // 输入线电压
          case '008301':
            this.aPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 输入相电压
          case '008304':
            this.aPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 输入相电流
          case '008307':
            this.aPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 输出线电压
          case '008312':
            this.aPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 输出相电压
          case '008315':
            this.aPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 输出相电流
          case '008318':
            this.aPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 旁路线电压
          case '008323':
            this.aPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
            // 旁路相电压
          case '008326':
            this.aPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 旁路相电流
          case '008329':
            this.aPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 输出视在功率Sa
          case '008335':
            this.aPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 输出有功功率Pa
          case '008338':
            this.aPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 负载率A
          case '008349':
            this.aPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          /**
           * B相相关
           */
          // 输入线电压
          case '008302':
            this.bPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 输入相电压
          case '008305':
            this.bPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 输入相电流
          case '008308':
            this.bPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 输出线电压
          case '008313':
            this.bPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 输出相电压
          case '008316':
            this.bPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 输出相电流
          case '008319':
            this.bPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 旁路线电压
          case '008324':
            this.bPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
            // 旁路相电压
          case '008327':
            this.bPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 旁路相电流
          case '008330':
            this.bPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 输出视在功率Sa
          case '008336':
            this.bPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 输出有功功率Pa
          case '008339':
            this.bPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 负载率A
          case '008350':
            this.bPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          /**
           * C相相关
           */
          // 输入线电压
          case '008303':
            this.cPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 输入相电压
          case '008306':
            this.cPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 输入相电流
          case '008309':
            this.cPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 输出线电压
          case '008314':
            this.cPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 输出相电压
          case '008317':
            this.cPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 输出相电流
          case '008320':
            this.cPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 旁路线电压
          case '008325':
            this.cPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
            // 旁路相电压
          case '008328':
            this.cPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 旁路相电流
          case '008331':
            this.cPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 输出视在功率Sa
          case '008337':
            this.cPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 输出有功功率Pa
          case '008340':
            this.cPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 负载率A
          case '008351':
            this.cPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
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
.yx-indicator-title {
    width: 80px;
    height: 35px;
    line-height: 35px;
    font-weight: 700;
}
.yx-indicator {
  display: flex;
  width: 100%;
  height: 30px;
  justify-content: flex-start;
  align-items: center;
  .yx-indicator-value {
    margin-left: 20px;
    width: 60px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #fff;
    background-color: #46C21B;
  }
  .abnormal-color {
    background-color: #FC0B0B;
  }
}
.group-indicator-title {
 font-weight: 700;
}
.tab-content {
  width:60px;
  height:70px;
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
</style>