<template>
  <div ref="deviceImg">
    <div class="dev-img">
      <img
        ref="plate"
        :src="testImg"
        :style="{ transform: 'rotateZ(' + deg + 'deg)' }"
        alt=""
        @click="showInfo"
      />
    </div>
    <div ref="devText" >
      <span >
        车位：{{deviceData.name}}
      </span>
    </div>
  </div>
</template>

<script>
import carImg from "../../assets/img/plate01.png";

export default {
  props: [
    "deviceData",
    "width",
    "height",
    "id",
    "isShow",
    "isDraggable",
    "plateWidth",
    "plateHeight",
  ],
  data() {
    return {
      textShow: false,
      deg: 0,
      testImg: carImg,
      rotateNum: 0,
      devWidth: 16,
      devHeight: 24,
      basicWidth: null,
      basicHeight: null,
      pointX: null,
      pointY: null,
      top: 0,
      left: 0,
      devInfo: null
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$refs.plate.onload = () => {
      }
      this.devInfo = this.deviceData
      
      this.deviceData.width !== 0 
      ? this.basicWidth = this.$refs.plate.width = this.deviceData.width 
      : this.basicWidth = this.$refs.plate.width

      this.deviceData.height !== 0 
      ? this.basicHeight = this.$refs.plate.height = this.deviceData.height 
      : this.basicHeight = this.$refs.plate.height

      this.devWidth = this.basicWidth;
      this.devHeight = this.basicHeight;

      this.textShow = this.isShow;
      this.rotateNum = this.deg = this.deviceData.deg;
      this.$refs.devText.className = "dev-hidden";
      if (this.textShow) {
        this.$refs.devText.className = "dev-show";
        this.$refs.deviceImg.style.width = this.width + "px";
        this.$refs.deviceImg.style.height = this.height + "px";
      } else {
        this.$refs.deviceImg.style.width = this.deviceData.width + "px";
        this.$refs.deviceImg.style.height = this.deviceData.height + "px";
      }

      this.$refs.deviceImg.id = this.id;
      this.$refs.deviceImg.style.top = this.deviceData.y + "px";
      this.$refs.deviceImg.style.left = this.deviceData.x + "px";
      
      this.$refs.deviceImg.style.position = "absolute";

    },
    showInfo() {
      this.textShow = !this.textShow;

      if (this.textShow) {
        this.$refs.devText.className = "dev-show";
        this.$refs.deviceImg.style.width = this.width + "px";
        this.$refs.deviceImg.style.height = this.height + "px";
        this.$refs.deviceImg.style.zIndex = 1000;
      } else {
        this.$refs.deviceImg.style.zIndex = 1;
        this.$refs.devText.className = "dev-hidden";
        this.$refs.deviceImg.style.width = this.deviceData.width + "px";
        this.$refs.deviceImg.style.height = this.deviceData.height + "px";
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.dev-info {
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

.dev-img {
  // text-align: center;
  // margin-top: 20%;
  margin-right: 5px;
  float: left;
}

.dev-input {
  text-align: center;
  width: 60px;
}

.tooltip-1 {
  top: 40px;
  left: 0;
  position: relative;
  // font-size: 24px;
  // color: #3a8ee6;
  display: inline;
}

.tooltip-2 {
  top: 0;
  left: 20px;
  position: relative;
  display: inline;
}

.tooltip-3 {
  top: 40px;
  left: 25px;
  position: relative;
  font-size: 24px;
  color: #3a8ee6;
  display: inline;
}

.tooltip-4 {
  top: 0px;
  left: 0;
  position: relative;
  font-size: 24px;
  color: #3a8ee6;
  display: inline;
}

.tooltip-5 {
  top: 40px;
  left: 0px;
  position: relative;
  display: inline;
}

.tooltip-6 {
  top: 0px;
  left: 0px;
  position: relative;
  font-size: 24px;
  color: #3a8ee6;
  display: inline;
}
</style>
