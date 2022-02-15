<template>
  <div v-if="devData" class="dev-msg">
    <div>
      <span>设备名称：</span>
      <span>{{devData.name}}</span>
    </div>
    <div>
      <span>设备编码：</span>
      <span>{{devData.code}}</span>
    </div>
    <div>
      <span>设备类型：</span>
      <span>{{devData.typeName}}</span>
    </div>
    <div>
      <span>站点名称：</span>
      <span>{{devData.siteName}}</span>
    </div>
    <!-- <div>
      <span>机房名称：</span>
      <span>{{devData.siteName}}</span>
    </div> -->
    <div>
      <span>系统名称：</span>
      <span>{{devData.systemFlag}}</span>
    </div>
    <div>
      <span>品牌名称：</span>
      <span>{{devData.modelName}}</span>
    </div>
    <!-- <div>
      <span>型号名称：</span>
      <span>{{devData.modelName}}</span>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'DeviceInfo',
  props:['devData'],
  data() {
    return {
      sysTypeMap: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {}  
  }
}
</script>

<style lang="scss" scoped>
.dev-msg {
  margin-top: 20px;
  div {
    margin-top: 10px;
  }
}
</style>
