<template>
  <div ref="deviceImg" :draggable="isDraggable">
    <!-- <template v-if=" deviceData.type === 'dev' ">
      <div ref="devText">
        {{deviceData.data.name}}
        <template v-if="deviceData.data.teleData" >
          <div v-for="item in deviceData.data.teleData" :key="item.id">
            <template v-if="item.propType === '0'">
              <div>{{item.param}}： {{item.value || '--'}} {{item.unit}}</div>
            </template>
          </div>
        </template>
      </div>
      <template v-if="deviceData.data.deviceStatus === '0'">
        <img :src="deviceData.data.typeNormalImg" alt=""  v-if="deviceData.data.typeNormalImg">
        <img :src="deviceData.data.modelNormalImg" alt=""  v-else>
      </template>
      <template v-if="deviceData.data.deviceStatus === '1'">
        <img :src="deviceData.data.typeAbnormalImg" alt=""  v-if="deviceData.data.typeAbnormalImg">
        <img :src="deviceData.data.modelAbnormalImg" alt=""  v-else>
      </template>
      <template v-if="deviceData.data.deviceStatus === '2'">
        <img :src="deviceData.data.typeAbnormalImg" alt=""  v-if="deviceData.data.typeAbnormalImg">
        <img :src="deviceData.data.modelAbnormalImg" alt=""  v-else>
      </template>
    </template> -->
    <template>
      <img
            ref="plate"
            :src="testImg"
            :style="{ transform: 'rotateZ(' + deg + 'deg)' }"
            style="float:left"
            @click="showInfo"
          />
      <!-- <div ref="devText" style="float: right;margin-left: 20px;z-index:1000;position: absolute;width: 100px;">
        <span >
          车位：{{deviceData.data.name}}
        </span>
      </div> -->
    </template>
    <LpStateInfo :lightData="lightData" v-if="isLampShow" @closeLpInfo="closeLpInfo"></LpStateInfo>
  </div>
</template>

<script>

import eventBus from "../../util/eventBus";
import lampLight from "../../assets/img/lightDevice.png";
import LpStateInfo from "@/views/sdc/lamppost/lpMonitor/LpStateInfo";

export default {
  props: ['deviceData','width','height','id','isShow','isDraggable','type'],
  components: {
    LpStateInfo
  },
  data() {
    return {
      textShow: false,
      deg: 0,
      testImg: lampLight,
      isLampShow: false,
      lightData:null
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      console.log(this.deviceData,'deviceData');
      this.lightData = this.deviceData.expand
      // this.$refs.devText.className = "dev-info dev-show"
      this.textShow = this.isShow;

      this.$refs.deviceImg.id = this.id
        // this.$refs.deviceImg.style.top = this.deviceData.y + 'px'
        // this.$refs.deviceImg.style.left = this.deviceData.x + 'px'
      
        this.$refs.deviceImg.style.top = (this.deviceData.y * 1.63) + 'px'
        this.$refs.deviceImg.style.left = (this.deviceData.x * 1.8) + 'px'
      
      this.$refs.deviceImg.style.minwidth = this.width + 'px'
      this.$refs.deviceImg.style.height = this.height + 'px'
      this.$refs.deviceImg.style.position = 'absolute'

      // if(this.$refs.plate) {
      //   console.log(11111111);
      //   this.$refs.plate.width = this.deviceData.data.width
      //   this.$refs.plate.height = this.deviceData.data.height
      //   this.deg = this.deviceData.data.deg
      // }
    },
    showInfo() {
      this.textShow = !this.textShow;
      this.isLampShow = true

      // if (this.textShow) {
      //   this.$refs.devText.className =
      //     "dev-info dev-show";
      // } else {
      //   this.$refs.devText.className = "dev-hidden";
      // }
    },
    closeLpInfo() {
      this.isLampShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
.dev-info {
  background: #409EFF;
  color: #ffffff;
  border-radius: 5px;
  text-align: center;
  padding: 5px;
  margin-bottom: 2px;
}
.dev-show {
  visibility: visible;
}

.dev-hidden {
  visibility: hidden;
}

</style>
