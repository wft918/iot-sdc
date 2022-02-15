<template>
  <div class="container">
    <el-row>
      <el-col>
        <span style="font-weight:700;">设备指标</span>
        <span>{{' ( ' + '数据采集时间：' + updateDate + ' ) '}}</span>
      </el-col>
    </el-row>
    <el-row style="margin-top:20px;">
      <div class="group-indicator-title">遥测指标</div>
    </el-row>
    <el-row style="margin-top:15px;">
      <el-col :span="10" v-for="item in phase" :key="item.name" style="margin-bottom:15px;">
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
  props: ['devIndicators','typeCode'],
  data() {
    return {
      updateDate: '',
      activeName: '1',
      workState: '0',
      outBreakerState: '0',
      sideWorkState: '0',
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
          /**
           * 遥测指标
           */
          // 正向有功电能
          case '002330':
            this.phase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 正向无功电能
          case '002331':
            this.phase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 反向有功电能
          case '002332':
            this.phase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 反向无功电能
          case '002333':
            this.phase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 总功率因数
          case '002324':
            this.phase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // // 电池组电流
          // case '008333':
          //   this.phase.push({name: item.param, value: item.value, unit: item.unit});
          //   break;
          // // 电池组电压
          // case '008334':
          //   this.phase.push({name: item.param, value: item.value, unit: item.unit});
          //   break;
          // // 主机温度
          // case '008346':
          //   this.phase.push({name: item.param, value: item.value, unit: item.unit});
          //   break;
          // // 整流器温度
          // case '008348':
          //   this.phase.push({name: item.param, value: item.value, unit: item.unit});
          //   break;
          /**
           * A相相关
          */ 
          // 线电压
          case '002301':
            this.aPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 相电流
          case '002302':
            this.aPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 相电压
          case '002303':
            this.aPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 功率因数
          case '002304':
            this.aPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 视在功率
          case '002305':
            this.aPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 无功功率
          case '002306':
            this.aPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 有功功率
          case '002307':
            this.aPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          /**
           * B相相关
           */
          // 线电压
          case '002308':
            this.bPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 相电流
          case '002309':
            this.bPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 相电压
          case '002310':
            this.bPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 功率因数
          case '002311':
            this.bPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 视在功率
          case '002312':
            this.bPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 无功功率
          case '002313':
            this.bPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 有功功率
          case '002314':
            this.bPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          /**
           * C相相关
           */
          // 线电压
          case '002315':
            this.cPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 相电流
          case '002316':
            this.cPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 相电压
          case '002317':
            this.cPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 功率因数
          case '002318':
            this.cPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 视在功率
          case '002319':
            this.cPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 无功功率
          case '002320':
            this.cPhase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 有功功率
          case '002321':
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