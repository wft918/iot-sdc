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
    <el-row v-if="typeCode === '01701'" style="margin-top:15px;">
      <el-col :span="10" v-for="item in tphase" :key="item.name" style="margin-bottom:15px;">
        <span>{{item.name}}</span>
        <span style="margin-left:10px;margin-bottom:20px;color:#409EFF;">{{item.value + item.unit}}</span>
      </el-col>
    </el-row>
    <el-row v-else style="margin-top:15px;">
      <el-col :span="10" v-for="item in hphase" :key="item.name" style="margin-bottom:15px;">
        <span>{{item.name}}</span>
        <span style="margin-left:10px;margin-bottom:20px;color:#409EFF;">{{item.value + item.unit}}</span>
      </el-col>
    </el-row>
    <!-- <el-row style="margin-top:20px;">
      <div class="group-indicator-title">近24小时{{typeCode === '01701' ? '温度' : '湿度'}}</div>
    </el-row> -->
  </div>
</template>

<script>
export default {
  props: ['devIndicators','deviceId','typeCode'],
  data() {
    return {
      updateDate: '',
      activeName: '1',
      tphase: [],
      hphase: []
    }
  },
  created() {
    console.log(11111111);
    this.init()
  },
  destroyed() {
  },
  methods: {
    init() {
      if (this.devIndicators.length > 0) {
        this.updateDate = this.devIndicators[0].updateDate
      }
      this.tphase = []
      this.hphase = []
      console.log(this.typeCode,'typeCode');
      this.devIndicators.forEach(item => {
        // 温度
        if (this.typeCode === '01701' && item.paramId === '017301') {
          console.log(item,'温度');
          this.tphase.push({name: item.param, value: item.value, unit: item.unit});
        } else if (this.typeCode === '01702' && item.paramId === '017302') {
          // 湿度
          console.log(item,'湿度');
          this.hphase.push({name: item.param, value: item.value, unit: item.unit});
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