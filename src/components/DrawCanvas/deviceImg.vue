<template>
  <div ref="deviceImg">
    <div ref="devText" style="margin: 0;box-sizing: border-box;">
      {{deviceData.name}}
      <!-- <div v-if="deviceData.teleData" >
        <div v-for="item in indicatorShowPart" :key="item.id">
          <template>
            <div>{{item.param}}： {{item.value || '--'}} {{item.unit}}</div>
          </template>
        </div>
      </div> -->
      <div>
        <el-tooltip placement="right-start">
          <div slot="content">
            <div>
              <div v-for="item in indicatorData" :key="item.id">
                {{item.param}}： {{item.value || '--'}} {{item.unit}}
              </div>
            </div>
          </div>
          <div>
            <div v-for="item in indicatorShowPart" :key="item.id">
              <div>{{item.param}}： {{item.value || '--'}} {{item.unit}}</div>
            </div>
          </div>
        </el-tooltip>
      </div>
    </div>
    <template v-if="deviceData.deviceStatus === '0'">
      <img :src="deviceData.typeNormalImg" alt="" @click="showInfo" v-if="deviceData.typeNormalImg" :draggable="isDraggable">
      <img :src="deviceData.modelNormalImg" alt="" @click="showInfo" v-else :draggable="isDraggable">
    </template>
    <template v-if="deviceData.deviceStatus === '1'">
      <img :src="deviceData.typeAbnormalImg" alt="" @click="showInfo" v-if="deviceData.typeAbnormalImg" :draggable="isDraggable">
      <img :src="deviceData.modelAbnormalImg" alt="" @click="showInfo" v-else :draggable="isDraggable">
    </template>
    <template v-if="deviceData.deviceStatus === '2'">
      <img :src="deviceData.typeAbnormalImg" alt="" @click="showInfo" v-if="deviceData.typeAbnormalImg" :draggable="isDraggable">
      <img :src="deviceData.modelAbnormalImg" alt="" @click="showInfo" v-else :draggable="isDraggable">
    </template>
    <template v-if="showIframe">
      <div ref="taskPlanTimeForm" style="z-index: 1000;position: absolute;">
        <div>
          <el-button type="primary" @click="closeIframe">关闭窗口</el-button>
        </div>
        <iframe :src="reportUrl" frameborder="0" style="width:800px;height:600px;" id="iframeBox"></iframe>
      </div>
    </template>
  </div>
</template>

<script>

import eventBus from "../../util/eventBus";

let startx = 0,startY = 0

export default {
  props: ['deviceData','width','height','id','isShow','isDraggable', 'indicatorShow', 'clickDevId'],
  data() {
    return {
      textShow: false,
      reportUrl: 'http://aaa.cdcttest.top:9009/g.html',
      showIframe: false,
      indicatorData: [],
      indicatorShowPart: []
    }
  },
  created() {
    // this.eventBusOn()
  },
  deactivated() {
    // eventBus.$off()
  },
  beforeDestroy() {
    // eventBus.$off('alarmRowClick')
    // eventBus.$off('removeImgClass')
    // eventBus.$off('showDevIndicator')
  },
  mounted() {
    this.init()
    if (this.deviceData.clickFlag) {
      this.$refs.devText.style.border = '3px solid #f00'
      this.$refs.devText.className = "dev-info dev-show"
      this.$refs.deviceImg.style.zIndex = 2
      this.$refs.deviceImg.style.top = this.deviceData.y - this.$refs.devText.offsetHeight + 'px'
    }
    // this.eventBusOn()
  },
  watch: {
    deviceData(newValue) {
      this.indicatorData = []
      this.indicatorShowPart = []
      if (newValue && newValue.teleData) {
        newValue.teleData.forEach(item => {
          if (item.propType === '0') {
            this.indicatorData.push(item)
          }
        })
        if (this.indicatorData.length > 2) {
          this.indicatorShowPart = this.indicatorData.slice(0, 2)
        } else {
          this.indicatorShowPart = this.indicatorData
        }
      }
      if (newValue.clickFlag) {
        this.$refs.devText.className = "dev-info dev-show"
        this.$refs.devText.style.border = '3px solid #f00'
        this.$refs.deviceImg.style.zIndex = 2
        this.$refs.deviceImg.style.top = this.deviceData.y - this.$refs.devText.offsetHeight + 'px'
      } else {
        this.$refs.devText.style.border = 'none'
        this.$refs.devText.className = "dev-info dev-hidden"
        this.$refs.deviceImg.style.zIndex = 1
        this.$refs.deviceImg.style.top = this.deviceData.y + 'px'
      }
    },
    indicatorShow(newVal) {
      if (newVal) {
        this.$refs.devText.className = "dev-info dev-show"
        this.$refs.deviceImg.style.zIndex = 2
        this.$refs.deviceImg.style.top = this.deviceData.y - this.$refs.devText.offsetHeight + 'px'
      } else {
        this.$refs.devText.className = "dev-info dev-hidden"
        this.$refs.deviceImg.style.zIndex = 1
        this.$refs.deviceImg.style.top = this.deviceData.y + 'px'
      }
    },
    clickDevId(newVal) {
      if (newVal === this.deviceData.id) {
        this.$refs.devText.className = "dev-info dev-show"
        this.$refs.devText.style.border = '3px solid #f00'
        this.$refs.deviceImg.style.zIndex = 2
        this.$refs.deviceImg.style.top = this.deviceData.y - this.$refs.devText.offsetHeight + 'px'
      } else {
        this.$refs.devText.style.border = 'none'
        this.$refs.devText.className = "dev-info dev-hidden"
        this.$refs.deviceImg.style.zIndex = 1
        this.$refs.deviceImg.style.top = this.deviceData.y + 'px'
      }
    }
  },
  methods: {
    // eventBusOn() {
    //   eventBus.$on('alarmRowClick', (id) => {
    //     if (this.deviceData.id === id) {
    //       this.$refs.devText.style.border = '3px solid #f00'
    //       this.$refs.devText.className = "dev-info dev-show"
    //       this.$refs.deviceImg.style.zIndex = 2
    //       this.$refs.deviceImg.style.top = this.deviceData.y - this.$refs.devText.offsetHeight + 'px'
    //     } else {
    //       this.$refs.devText.style.border = 'none'
    //       this.$refs.devText.className = "dev-info dev-hidden"
    //       this.$refs.deviceImg.style.zIndex = 1
    //       this.$refs.deviceImg.style.top = this.deviceData.y + 'px'
    //     }
    //   })
    //   eventBus.$on('removeImgClass', id => {
    //     console.log(this.deviceData.id, 'this.deviceData.id');
    //     if (this.deviceData.id !== id) {
    //       this.$refs.devText.style.border = 'none'
    //       this.$refs.devText.className = "dev-info dev-hidden"
    //       this.$refs.deviceImg.style.zIndex = 1
    //       this.$refs.deviceImg.style.top = this.deviceData.y + 'px'
    //     }
    //   }),
    //   eventBus.$on('showDevIndicator', id => {
    //     if (this.deviceData.id === id) {
    //       if(this.isShow) {
    //         // this.textShow = this.isShow
    //         this.$refs.devText.className = "dev-info dev-show"
    //         this.$refs.devText.style.border = '3px solid #f00'
    //         this.$refs.deviceImg.style.zIndex = 2
    //         this.$refs.deviceImg.style.top = this.deviceData.y - this.$refs.devText.offsetHeight + 'px'
    //       }
    //     }
    //   })
    // },
    init() {
      this.$refs.devText.className = "dev-info dev-hidden"
      this.$refs.deviceImg.id = this.id
      this.$refs.deviceImg.style.top = this.deviceData.y + 'px'
      this.$refs.deviceImg.style.left = this.deviceData.x + 'px'
      this.$refs.deviceImg.style.minwidth = this.width + 'px'
      this.$refs.deviceImg.style.height = this.height + 'px'
      this.$refs.deviceImg.style.position = 'absolute'
      // if(this.isShow) {
      //   this.textShow = this.isShow
      //   this.$refs.devText.className = "dev-info dev-show"
      //   this.$refs.deviceImg.style.top = this.deviceData.y - this.$refs.devText.offsetHeight + 'px'
      // }
      if(this.isDraggable) {
        this.$refs.deviceImg.ondragenter = (e) => {
          e.preventDefault()
        }

        // this.$refs.deviceImg.ondragover = (e) => {
        //   e.preventDefault()
        // }

        this.$refs.deviceImg.ondragstart =  (e) => {
          startx = e.clientX
          startY = e.clientY

          this.$refs.deviceImg.ondrag = (e) => {
            let lengthX = e.clientX - startx
            let lengthY = e.clientY - startY
            this.$refs.deviceImg.style.top = (this.deviceData.y + lengthY) + 'px'
            this.$refs.deviceImg.style.left = (this.deviceData.x + lengthX) + 'px'
          }

          this.$refs.deviceImg.ondragend =  (e) => {
            this.$refs.deviceImg.ondrag = this.$refs.deviceImg.ondragend = null
            let lengthX = e.clientX - startx
            let lengthY = e.clientY - startY
            this.$refs.deviceImg.style.top = (this.deviceData.y + lengthY) + 'px'
            this.$refs.deviceImg.style.left = (this.deviceData.x + lengthX) + 'px'
            this.$emit('changePos',{
              id: this.deviceData.id,
              x: lengthX,
              y: lengthY
            })
            startx = 0
            startY = 0
          }
        }
      }
    },
    showInfo() {
      this.showIframe = this.deviceData.code === '100003' ? true : false
      if(this.isShow) {
        // this.textShow = this.isShow
        this.$refs.devText.className = "dev-info dev-show"
        this.$refs.devText.style.border = '3px solid #f00'
        this.$refs.deviceImg.style.zIndex = 2
        this.$refs.deviceImg.style.top = this.deviceData.y - this.$refs.devText.offsetHeight + 'px'
      }else {
        this.textShow = !this.textShow
        this.$refs.devText.className = this.textShow ? "dev-info dev-show" : "dev-info dev-hidden"
        if (this.textShow) {
          this.$refs.deviceImg.style.top = this.deviceData.y - this.$refs.devText.offsetHeight + 'px'
        } else {
          this.$refs.deviceImg.style.top = this.deviceData.y + 'px'
        }
      }
      eventBus.$emit('updateDevData',{
        id: this.deviceData.id,
        name: this.deviceData.name,
        system: this.deviceData.sysCode,
        type: this.deviceData.videoType
      })
    },
    closeIframe() {
      this.showIframe = false
    }
  }
}
</script>

<style lang="scss" scoped>
.dev-info {
  background: rgba(64,158,255,0.7);
  color: #ffffff;
  border-radius: 5px;
  text-align: center;
  padding: 5px;
  margin-bottom: 2px;
  font-size: 14px;
}
img {
  width: 24px;
  height: 24px;
}
.dev-show {
  // visibility: visible;
  display: block;
}
.rmdev-hidden {
  visibility: hidden;
}
.dev-hidden {
  display: none;
}
@keyframes devImgFlash {
  0%   {background-color: #ffffff;}
  100% {background-color: #409EFF;}
}
.dev-text-ani {
  animation: devImgFlash 1s ease 0s infinite alternate;
}
.zindex {
  z-index: 0;
}
</style>
