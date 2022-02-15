<template>
  <div ref="deviceImg" :draggable="isDraggable">
    <div class="dev-img">
      <img
        ref="plate"
        :src="testImg"
        :style="{ transform: 'rotateZ(' + deg + 'deg)' }"
        alt=""
        @click="showInfo"
        v-if="isDraggable"
      />
      <img
        ref="plate"
        :src="testImg"
        :style="{ transform: 'rotateZ(' + deg + 'deg)' }"
        v-else
      />
    </div>
    <!-- <div ref="devText" style="float: right;margin-left: 20px;z-index:1000;position: absolute;width: 100px;">
        <span >
          车位：{{deviceData.data.name}}
        </span>
      </div> -->
    <div ref="devText" >
      <span >
        车位：{{deviceData.name}}
      </span>
      
      
    </div>

    <div ref="devSize">
      宽：<el-input v-model="devWidth" class="dev-input" @input="setWidthValue">
      </el-input>
      高：<el-input
        v-model="devHeight"
        class="dev-input"
        @input="setHeightValue"
      >
      </el-input>
      <div style="margin: 8px 0">
        <el-tooltip class="item" effect="dark" content="放大" placement="top"
          >
          <el-button
            type="primary"
            icon="el-icon-zoom-in"
            @click.stop="enlargeSize"
            circle
          >
          </el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="缩小" placement="top">
          <el-button
            type="primary"
            icon="el-icon-zoom-out"
            @click.stop="reduceSize"
            circle
          >
          </el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="保存" placement="top">
          <el-button
            type="primary"
            icon="el-icon-check"
            @click.stop="saveMsg"
            circle
          >
          </el-button>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import eventBus from "../../util/eventBus";
import carImg from "../../assets/img/plate01.png";
import { sdcParkPlaceAction } from "@/api/sdc/parkManage";

let startx = 0,
  startY = 0;

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
      this.$refs.devSize.className = this.$refs.devText.className =
        "dev-hidden";
      if (this.textShow) {
        this.$refs.devSize.className = this.$refs.devText.className =
          "dev-show";
        this.$refs.deviceImg.style.minwidth = this.width + "px";
        this.$refs.deviceImg.style.height = this.height + "px";
      } else {
        this.$refs.deviceImg.style.width = this.deviceData.width + "px";
        this.$refs.deviceImg.style.height = this.deviceData.height + "px";
      }

      this.$refs.deviceImg.id = this.id;
      this.$refs.deviceImg.style.top = this.deviceData.y + "px";
      this.$refs.deviceImg.style.left = this.deviceData.x + "px";
      
      this.$refs.deviceImg.style.position = "absolute";

      if (this.isDraggable) {
        this.$refs.deviceImg.ondragenter = (e) => {
          e.preventDefault();
        };

        // this.$refs.deviceImg.ondragover = (e) => {
        //   e.preventDefault()
        // }

        this.$refs.deviceImg.ondragstart = (e) => {
          startx = e.clientX;
          startY = e.clientY;

          this.$refs.deviceImg.ondrag = (e) => {
            let lengthX = e.clientX - startx;
            let lengthY = e.clientY - startY;
            this.$refs.deviceImg.style.top = this.deviceData.y + lengthY + "px";
            this.$refs.deviceImg.style.left =
              this.deviceData.x + lengthX + "px";
          };

          this.$refs.deviceImg.ondragend = (e) => {
            this.$refs.deviceImg.ondrag = this.$refs.deviceImg.ondragend = null;
            let lengthX = e.clientX - startx;
            let lengthY = e.clientY - startY;
            this.$refs.deviceImg.style.top = this.deviceData.y + lengthY + "px";
            this.$refs.deviceImg.style.left =
              this.deviceData.x + lengthX + "px";
            this.pointX = lengthX;
            this.pointY = lengthY;
            startx = 0;
            startY = 0;
          };
        };
      }
    },
    showInfo() {
      this.textShow = !this.textShow;

      if (this.textShow) {
        this.$refs.devSize.className = this.$refs.devText.className = "dev-show";
        this.$refs.deviceImg.style.width = this.width + "px";
        this.$refs.deviceImg.style.height = this.height + "px";
        this.$refs.deviceImg.style.zIndex = 1000;
      } else {
        this.$refs.deviceImg.style.zIndex = 1;
        this.$refs.devSize.className = this.$refs.devText.className = "dev-hidden";
        this.$refs.deviceImg.style.width = this.deviceData.width + "px";
        this.$refs.deviceImg.style.height = this.deviceData.height + "px";
      }
    },
    setRotateValue() {
      this.deg = this.rotateNum;
    },
    setWidthValue() {
      this.devHeight =
        this.basicHeight * (this.devWidth / this.basicWidth).toFixed(2);
      this.$refs.plate.style.width = this.devWidth + "px";
      this.$refs.plate.style.height = this.devHeight + "px";
    },
    setHeightValue() {
      this.devWidth =
        this.basicWidth * (this.devHeight / this.basicHeight).toFixed(2);
      this.$refs.plate.style.width = this.devWidth + "px";
      this.$refs.plate.style.height = this.devHeight + "px";
    },
    fan() {
      this.rotateNum -= 10;
      if (this.rotateNum <= -360) {
        this.rotateNum = 0;
      }
      this.setRotateValue();
    },
    zheng() {
      this.rotateNum += 10;
      if (this.rotateNum >= 360) {
        this.rotateNum = 0;
      }
      this.setRotateValue();
    },
    enlargeSize() {
      this.devWidth += 10;
      this.setWidthValue();
    },
    reduceSize() {
      this.devWidth -= 10;
      this.setWidthValue();
    },
    saveMsg() {
      this.devInfo.x += this.pointX + this.left
      this.devInfo.y += this.pointY + this.top
      this.devInfo.width = this.devWidth
      this.devInfo.height = this.devHeight
      this.devInfo.deg = this.deg
      // sdcParkPlaceAction(this.devInfo, "", "put")
      this.$emit("updatePlatePointMsg", {
        id: this.devInfo.id,
        x: this.devInfo.x,
        y: this.devInfo.y,
        width: this.devWidth,
        height: this.devHeight,
      });
    },
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
