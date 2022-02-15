<template>
  <div>
    <div>
      <el-row :gutter="35" style="margin-bottom:10px;">
        <el-col :span="12">
          <span class="devinfo-label">设备名称：</span>
          <span>{{deviceInfo.name}}</span>
        </el-col>
        <el-col :span="12">
          <span class="devinfo-label">设备状态：</span>
          <el-tag type="danger" v-if="alarmStatus">告警</el-tag>
          <el-tag type="success" v-else>正常</el-tag>
        </el-col>
      </el-row>
      <el-row :gutter="35" style="margin-bottom:10px;">
        <el-col :span="12">
          <span class="devinfo-label">品牌型号：</span>
          <span>{{deviceInfo.modelName ? deviceInfo.modelName : '暂无品牌'}}</span>
        </el-col>
        <el-col :span="12">
          <span class="devinfo-label">设备类型：</span>
          <span>{{deviceInfo.typeName}}</span>
        </el-col>
      </el-row>
      <el-row v-if="alarmStatus" :gutter="35" style="margin-bottom:10px;">
        <el-col :span="12">
          <span class="devinfo-label">告警级别：</span>
          <span>{{ $dictUtils.getDictLabel("alarm_level", alarmInfo.alarmLevel, '-') }}</span>
        </el-col>
        <el-col :span="12">
          <span class="devinfo-label">当前活动告警：</span>
          <span>{{alarmInfo.alarmCodeDesc}}</span>
        </el-col>
      </el-row>
      <el-row :gutter="35" style="margin-bottom:10px;">
        <el-col :span="12" v-if="alarmStatus">
          <span class="devinfo-label">告警时间：</span>
          <span>{{alarmInfo.alarmTime}}</span>
        </el-col>
        <el-col v-if="deviceInfo.typeCode !== '07603'" :span="12">
          <span class="devinfo-label">所属FSU：</span>
          <el-link :underline="false" type="primary" style="font-size:16px;" @click="redirectToFsu">{{fsuInfo.name}}</el-link>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { getFsuByDevice } from "@/api/sdc/deviceInfo";
export default {
  name: "DeviceInfo",
  props: ['deviceInfo','alarmInfo','alarmStatus'],
  data() {
    return {
      fsuInfo: {}
    }
  },
  created() {
    this._getFsuByDevice()
  },
  methods: {
    _getFsuByDevice() {
      getFsuByDevice(this.deviceInfo.id).then(res => {
        if (res.data.code === 0) {
          let rdata = res.data.data
          if (rdata.length > 0) {
            this.fsuInfo = rdata[0]
          }
        }
      })
    },
    redirectToFsu() {
      this.$emit('redirectToFsu', this.fsuInfo.id)
    }
  }
}
</script>
<style lang="scss" scoped>
.devinfo-label {
  font-weight: 700;
}
</style>