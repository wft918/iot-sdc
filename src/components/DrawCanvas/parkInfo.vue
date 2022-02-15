<template>
  <div ref="deviceImg" :draggable="isDraggable">
    <template v-if=" deviceData.type === 'dev' ">
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
        <img ref="device" :src="deviceData.data.typeNormalImg" alt=""  v-if="deviceData.data.typeNormalImg">
        <img ref="device" :src="deviceData.data.modelNormalImg" alt=""  v-else>
      </template>
      <template v-if="deviceData.data.deviceStatus === '1'">
        <img ref="device" :src="deviceData.data.typeAbnormalImg" alt=""  v-if="deviceData.data.typeAbnormalImg">
        <img ref="device" :src="deviceData.data.modelAbnormalImg" alt=""  v-else>
      </template>
      <template v-if="deviceData.data.deviceStatus === '2'">
        <img ref="device" :src="deviceData.data.typeAbnormalImg" alt=""  v-if="deviceData.data.typeAbnormalImg">
        <img ref="device" :src="deviceData.data.modelAbnormalImg" alt=""  v-else>
      </template>
    </template>
    <template v-else>
      <img
            ref="plate"
            :src="testImg"
            :style="{ transform: 'rotateZ(' + deg + 'deg)' }"
            style="float:left"
            @click="showInfo"
          />
      <div ref="devText" style="float: right;margin-left: 20px;z-index:1000;position: absolute;width: 100px;">
        <span >
          车位：{{deviceData.data.name}}
        </span>
      </div>
    </template>
  </div>
</template>

<script>

import eventBus from "../../util/eventBus";
import carImg from "../../assets/img/car.png";

export default {
  props: ['deviceData','width','height','id','isShow','isDraggable','type'],
  data() {
    return {
      textShow: false,
      deg: 0,
      testImg: carImg,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      
      this.$refs.devText.className = "dev-info dev-show"
      this.textShow = this.isShow;

      this.$refs.deviceImg.id = this.id
      
      if(this.deviceData.type === 'dev') {
        
        this.$refs.deviceImg.style.top = this.deviceData.data.y * (895/700) + 'px'
        this.$refs.deviceImg.style.left = this.deviceData.data.x * (1211/900) + 'px'
        this.$refs.device.onload = () => {
          this.$refs.device.style.width = this.$refs.device.width * (1.3) + 'px'
        }
      }else {
        this.$refs.deviceImg.style.top = this.deviceData.data.y * (895/744) + 'px'
        this.$refs.deviceImg.style.left = this.deviceData.data.x * (1211/1008) + 'px'
      }
      
      this.$refs.deviceImg.style.position = 'absolute'

      if(this.$refs.plate) {
        this.deviceData.data.width !== 0 
        ? this.$refs.plate.width = this.deviceData.data.width 
        : this.$refs.plate.width

        this.deviceData.data.height !== 0 
        ? this.$refs.plate.height = this.deviceData.data.height 
        : this.$refs.plate.height

        this.deg = this.deviceData.data.deg
      }
    },
    showInfo() {
      this.textShow = !this.textShow;

      if (this.textShow) {
        this.$refs.devText.className =
          "dev-info dev-show";
      } else {
        this.$refs.devText.className = "dev-hidden";
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.dev-info {
  background: #409EFF;
  color: #ffffff;
  border-radius: 5px;
  text-align: center;
  padding: 10px 5px;
  margin-bottom: 2px;
}
.dev-show {
  visibility: visible;
}

.dev-hidden {
  visibility: hidden;
}

</style>
