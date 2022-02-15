<template>
  <div class="container">
    <el-row>
      <el-col>
        <span style="font-weight:700;">设备指标</span>
        <span>{{' ( ' + '数据采集时间：' + updateDate + ' ) '}}</span>
      </el-col>
    </el-row>
    <el-row style="margin-top:20px;">
      <div class="group-indicator-title">遥信指标</div>
    </el-row>
    <el-row style="margin-top:15px;">
      <el-col :span="8" v-for="item in remoteSignalling" :key="item.name" style="margin-bottom:15px;">
        <span>{{item.name}}</span>
        <span style="margin-left:10px;margin-bottom:20px;">
          <el-tag type="success" v-if="item.state === '0'">运行中</el-tag>
          <el-tag type="danger" v-else>已停止</el-tag>
        </span>
      </el-col>
    </el-row>
    <el-row style="margin-top:20px;">
      <div class="group-indicator-title">遥测指标</div>
    </el-row>
    <el-row style="margin-top:15px;">
      <el-col :span="10" v-for="item in telemetering" :key="item.name" style="margin-bottom:15px;">
        <span>{{item.name}}</span>
        <span style="margin-left:10px;margin-bottom:20px;color:#409EFF;">{{item.value + item.unit}}</span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: ['devIndicators','deviceId','typeCode'],
  data() {
    return {
      updateDate: '',
      telemetering: [],
      remoteSignalling: []
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
      this.telemetering = []
      this.remoteSignalling = []
      this.devIndicators.forEach(item => {
        switch(item.paramId) {
          /**
           * 遥信
           */
          // 工作状态
          case '012405':
            this.remoteSignalling.push({name: item.param, state: item.state})
            break;
          // 制冷状态
          case '012403':
            this.remoteSignalling.push({name: item.param, state: item.state})
            break;
          // 除湿状态
          case '012404': 
            this.remoteSignalling.push({name: item.param, state: item.state})
            break;
          /**
           * 遥测
           */
          // 回风温度
          case '012301':
            this.telemetering.push({name: item.param, value: item.value, unit: item.unit})
            break;
          // 回风湿度
          case '012302':
            this.telemetering.push({name: item.param, value: item.value, unit: item.unit})
            break;
        }
      })
      // 根据deviceId获取24小时数据
      
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

.group-indicator-title {
 font-weight: 700;
}
</style>