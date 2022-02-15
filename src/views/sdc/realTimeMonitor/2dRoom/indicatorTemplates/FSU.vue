<template>
  <div class="container">
    <el-row>
      <el-col>
        <span style="font-weight:700;">设备指标</span>
        <span>{{' ( ' + '数据采集时间：' + updateDate + ' ) '}}</span>
      </el-col>
    </el-row>
    <el-row style="margin-top:30px;">
      <div class="group-indicator-title">遥测指标</div>
    </el-row>
    <el-row style="margin-top:15px;">
      <el-col :span="10" v-for="item in phase" :key="item.name" style="margin-bottom:15px;">
        <span>{{item.name}}</span>
        <span style="margin-left:10px;margin-bottom:20px;color:#409EFF;">{{item.value + item.unit}}</span>
      </el-col>
    </el-row>
    <el-row style="margin-top:30px;">
      <div class="group-indicator-title">关联设备状态</div>
    </el-row>
    <el-row style="margin-top:20px;">
      <el-col style="height:450px;overflow-y:auto;">
        <el-descriptions :column="2" border>
          <el-descriptions-item v-for="item in devData" :key="item.id" :label="item.name" labelStyle="background:#FFF;color:#666;">
            <el-tag v-if="item.isAlarm" size="small" type="danger">告警</el-tag>
            <el-tag v-else size="small" type="success">正常</el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getDeviceByFsu } from "@/api/sdc/deviceInfo";
export default {
  props: ['devIndicators','deviceCode','activeAlarmList'],
  data() {
    return {
      updateDate: '',
      activeName: '1',
      phase: [],
      devData: []
    }
  },
  created() {
    this.init()
    this._getDeviceByFsu()
  },
  destroyed() {
  },
  methods: {
    init() {
      if (this.devIndicators.length > 0) {
        this.updateDate = this.devIndicators[0].updateDate
      }
      this.phase = []
      this.devIndicators.forEach(item => {
        switch(item.paramId) {
          /**
           * 遥测指标
           */
          // FSU硬盘占用率
          case '076301':
            this.phase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // 内存占用率
          case '076302':
            this.phase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          // CPU使用率
          case '076303':
            this.phase.push({name: item.param, value: item.value, unit: item.unit});
            break;
          default: 
           break;
          
        }
      })
    },
    // 根据deviceCode获取fsu关联的设备
    _getDeviceByFsu() {
      getDeviceByFsu(this.deviceCode).then(res => {
        if (res.data.code === 0) {
          let rdata = res.data.data
          if (rdata.length > 0 && this.activeAlarmList.length === 0) {
            rdata.forEach(item => {
              item.isAlarm = false
            })
            this.devData = rdata
          } else if (rdata.length > 0 && this.activeAlarmList.length > 0) {
            rdata.forEach(item => {
              item.isAlarm = false
              this.activeAlarmList.find(ele => {
                if (ele.deviceId === item.id) {
                  item.isAlarm = true
                }
              })
            })
            this.devData = rdata
          }
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
.group-indicator-title {
 font-weight: 700;
}
</style>