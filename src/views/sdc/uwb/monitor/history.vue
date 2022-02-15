<template>
<div class="erweiClass" style="height:100%;">
   <!-- 日期过滤 -->
  <div class="dateStyle" :style="'width:'+dateWidth+'%;'">
    <!-- <el-select size="mini" v-model="valueMap" placeholder="请选择区域" @change="changeMap">
      <el-option
        v-for="item in optionsMap" 
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select> -->
        <el-cascader size="mini"
              placeholder="请选择区域"
              ref="siteChoose"
              :options="optionsMap"
              v-model="valueMap"
              clearable
              filterable
              @change="changeMap"
              :props="{ value: 'id', label: 'name', children: 'children' }"
            >
        </el-cascader>
    <el-select size="mini" v-model="valueLable" placeholder="请选择标签" style="margin-left: 10px;" >
      <el-option
        v-for="item in optionsLable" 
        :key="item.tagSerial"
        :label="item.tagName"
        :value="item.tagSerial">
      </el-option>
    </el-select>
    <el-date-picker size="mini" style="margin-left:10px;"
      v-model="dateValue"
      :clearable="false"
      type="datetimerange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
    <el-button size="mini" type="primary" style="margin-left: 10px;" @click="getHistoryData()">确定</el-button>
  </div>
  <!-- 二维三维显示位置 -->
  <div style="height:90%;background-color:#ffffff;padding:10px;">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="2D" name="first">
        <div class="map-chart1" :style="'height:'+showHeight+'px;'">
          <div class="pictureClass"  :style="mapStyle">
            <canvas id="mycanvasPolygon" style="position: absolute;" :width="areaWidthPx" :height="areaLengthPx">
            </canvas>
            <canvas id="mycanvas" :width="areaWidthPx" :height="areaLengthPx">
            </canvas>
          </div>
           <div class="pictureClass"  :style="mapStyleTop">
             <div v-for="(item, index) in stationList" :key="index" :id="'cover'+item.id" :class="item.onlineStatus=='1'?'nodeClassOffline':'nodeClass'" 
              :style="'width:'+iconWidth+'px;left:'+(item.coordinateX*1000/mapValuetoData[valueMap].areaWidth*areaWidthPx)+'px;top:'+(item.coordinateY*1000/mapValuetoData[valueMap].areaLength*areaLengthPx)+'px;'">
                <div style="width: 100px; margin-left: -35px; margin-top: 32px; text-align: center;">{{item.stationName}}</div>
            </div> 
           </div>
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane label="3D" name="second">
        <div ref="threeworld" class="map-chart" :style="'height:'+(parseInt(showHeight)+20)+'px;'">
           <iframe id="mainIframe" ref="mainIframe" name="mainIframe" src="/WebGLProjs/examples/exam3D.html" style="width:100%;height:100%;" frameborder="0"></iframe> -->
          <!-- <div ref="threeworld" id="threeworld" :style="'height:'+showHeight+'px;'"></div> -->
        <!-- </div>
      </el-tab-pane> -->
    </el-tabs>
    <!-- 进度条 -->
    <div style="width:100%;height:4px;justify-content: center;display:flex;margin-top:14px;background: rgba(61,129,253,0.11);">
      <el-slider v-if="showSlider" @change='changeSliderData' style="width:98%"  :min=0 :max='maxTime' v-model="per" :format-tooltip='formatData'></el-slider>
    </div>
    <!-- 暂停、倍速 -->
    <div class="toolClass" :style="showSlider?'cursor:pointer;':'cursor:no-drop;'">
      <div v-if="per==maxTime" class="toolone" style="width:41px;margin-left:20px;"  @click="resetStart" >
        <img src="../../../../assets/img/reset.png" style="width:15px;">
      </div>
      <div v-else class="toolone" style="width:41px;margin-left:20px;"  @click="changeStatus"  >
        <img v-if="isStart" src="../../../../assets/img/start.png" style="width:15px;">
        <img v-else src="../../../../assets/img/end.png" style="width:15px;">
      </div>
      <div class="toolone" @click="changeSpeed">
        {{speedText}}
      </div>
    </div>
  </div>
  <!-- 标签 -->
  <div class="bottomClass">
      <div class="one">
        <img src="../../../../assets/img/node.png" style="width:30px;"><div class="myFont">基站</div>
      </div>
      <div class="one">
        <img src="../../../../assets/img/title1.png" style="width:30px;"><div class="myFont">标签</div>
      </div>
      <div class="oneRight">
        <img src="../../../../assets/img/location.png" style="width:30px;"><div class="myFont">办公区</div>
      </div>
  </div>
</div>
</template>

<script>
import Vue from 'vue'
// import * as THREE from 'three'
// import { OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
// import { OBJLoader } from 'three-obj-mtl-loader';
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import slider from '../monitor/slider'
// const ThreeBSP = require('three-js-csg')(THREE)
import { modifyData } from "@/util/domainFilter";
import { sdcSiteAction } from "@/api/sdc/addressInfo";
export default Vue.extend({
  data () {
    return {
      pos: [],
      activeName: 'first',
      showHeight:626,
      speedText:'倍速',
      // 暂停结束标志
      isStart:true,
      publicPath: process.env.BASE_URL,
      firstLoading:true,
      per:0,
      dateValue: '',
      maxTime:100,
      //地图数据
      optionsMap: [],
      valueMap: '',
      mapValuetoData:new Array(),
      areaWidthPx:0,
      areaLengthPx:0,
      mapStyle:'',
      mapStyleTop:'',
      //基站数据
      stationList:[],
      iconWidth:30,
      dateWidth:53,
      fabricObj: null,
      fenceList:[],
      //标签集合
      optionsLable:[],
      valueLable:'',
      sliderTimer:null,
      sliderTimerIntrval:500,
      positionTimeList:[],//location {startTime,endTime}
      titleIdtoName:new Array(),
      last_i:0,//记录上次节点，方便下次循环查找
      // 记录上次节点位置，以便清除
      lastX:50,
      lastY:50,
      showSlider:false,
      ifame3D:null,
    }
  },
  components: {slider},
  computed: {},
  created(){
  },
  mounted () {
    this.getAreaList()
    this.getLableDatas()

    //二维
    this.context
    this.img

    // this.ifame3D = this.$refs['mainIframe'].contentWindow;
    // window.addEventListener('message', (e)=>{
    //   //console.log(e)
    //   if(e.data.type=='getBmfData'){
    //     that.getBmfData(e.data.id[0])
    //   }
    //   if(e.data.type=='colorTable'){
    //     that.volumeColorDatasShow = []
    //     that.volumeColorDatasShow = e.data.data
    //   }
    //   if(e.data.type=='volumeDatas'){
    //     that.volumeDatas = e.data.volumeDatas
    //     that.volumeDatasValue = that.volumeDatas[0];
    //   }
    // })
    // this.$nextTick(() => {
    //       console.log('height',this.showHeight,'width',this.$refs.threeworld.clientWidth)
    //       this.ifame3D.postMessage(
    //       {
    //         type:'iniSize',
    //         data:{'height':this.showHeight,'width':this.$refs.threeworld.clientWidth},
    //       },'*')
    //     })
   

    

   

    //三维
    // this.camera = null
    // this.renderer = null
    // this.mesh = null
    // this.textureLoader = null
    // this.mixer = null;
    // this.clock = new THREE.Clock();
    // this._pointsBuf = []
    // this.timer = null;
    // this.groupBox = new THREE.Group();
    // this.groupBox1 = new THREE.Group();
    // this.scene = new THREE.Scene();

    //1600*900    ----150%  
    if(window.screen.height<=600){
        //1440 900 ----150%
        if(window.screen.width==960){
          this.showHeight = 150;
          this.iconWidth = 10;
          this.dateWidth = 83;
        }else{
          this.showHeight = 150;
          this.iconWidth = 10;
          this.dateWidth = 73;
        }
        return;
      }
      //1360/1366   -----125%
      if(window.screen.height<=615){
        this.showHeight = 180;
        this.iconWidth = 13;
        this.dateWidth = 73;
        return;
      }
      //1600*1024    ----150%   
      if(window.screen.height<=683){
        this.showHeight = 230;
        this.iconWidth = 15;
        this.dateWidth = 73;
        return;
      }
      //1680*1050    ----150%  
      if(window.screen.height<=700){
        this.showHeight = 250;
        this.iconWidth = 15;
        this.dateWidth = 68;
        return;
      }
      //1920   ----150%    1600*900    ----125%  
      if(window.screen.height<=720){
        //1440 900  ----125%  
        if(window.screen.width==1152){
          this.showHeight = 270;
          this.iconWidth = 15;
          this.dateWidth = 67;
        }else{
          this.showHeight = 270;
          this.iconWidth = 15;
          this.dateWidth = 58;
        }
        return;
      }
      //1360   -----100% 1366 -----100%
      if(window.screen.height<=768){
        this.showHeight = 319;
        this.iconWidth = 18;
        this.dateWidth = 54;
        return;
      }
      //1600*1024    ----125%   
      if(window.screen.height<=820){
        this.showHeight = 369;
        this.iconWidth = 20;
        this.dateWidth = 59;
        return;
      }
      // 1680*1050     ----125%   
      if(window.screen.height<=840){
        this.showHeight = 389;
        this.iconWidth = 20;
        this.dateWidth = 55;
        return;
      }
      //1920  ---125%
      if(window.screen.height<=864){
        this.showHeight = 410;
        this.iconWidth = 20;
        this.dateWidth = 47;
        return;
      }
      // 1600*900    ----100%   
      if(window.screen.height<=900){
        // 1440*900    ----100%   
        if(window.screen.width==1440){
          this.showHeight = 450;
          this.iconWidth = 24;
          this.dateWidth = 50;
        }else{
          this.showHeight = 450;
          this.iconWidth = 24;
          this.dateWidth = 44;
        }
        return;
      }
      // 1600*1024    ----100%   
      if(window.screen.height<=1024){
        this.showHeight = 570;
        this.iconWidth = 26;
        this.dateWidth = 44;
        return;
      }
      // 1680*1050    ----100%   
      if(window.screen.height<=1050){
        this.showHeight = 600;
        this.iconWidth = 26;
        this.dateWidth = 42;
        return;
      }
      //1920     ----100%
      if(window.screen.height<=1080){
        return;
      }
    
  },
  activated () {
    this.getAreaList()
    this.getLableDatas()
  },
  methods: {
    //获取标签数据
    getLableDatas(){
      this.$http({
        url: '/uwb/ips/uwbtag/uwbTag/list',
        method: 'get',
        params: {
          'pageNo': 1,
          'pageSize': 50000,
          'orderBy': '',
        }
      }).then(({data}) => {
        if (data && data.success) {
          this.optionsLable = data.page.list
          if(this.optionsLable){
            this.valueLable = this.optionsLable[0].tagSerial
          }
          data.page.list.forEach(item=>{
            this.titleIdtoName[item.tagSerial] = item.tagName
          })
        }
      })
    },
    //获取历史轨迹数据
    getHistoryData(){
      //进度条展示
      this.showSlider = true

      //清空定时器
      if(this.sliderTimer){
        clearInterval(this.sliderTimer);
      }
      //清空绘制的轨迹线及标签
      var canvas = document.getElementById("mycanvas")
      this.context = canvas.getContext('2d')
      canvas.height=canvas.height;  

      let d = this.dateValue[0];
      var startTimeTo =d.getFullYear() + '-' + ((d.getMonth() + 1)<10?('0' + (d.getMonth() + 1)):(d.getMonth() + 1)) + '-' + (d.getDate()<10?('0' + d.getDate()): d.getDate())
       + ' ' + (d.getHours()<10?('0'+d.getHours()):d.getHours()) + ':' + (d.getMinutes()<10?('0'+d.getMinutes()):d.getMinutes()) + ':' + (d.getSeconds()<10?('0'+d.getSeconds()):d.getSeconds());
      let d1 = this.dateValue[1];
      var endTimeTo =d1.getFullYear() + '-' + ((d1.getMonth() + 1)<10?('0' + (d1.getMonth() + 1)):(d1.getMonth() + 1)) + '-' + (d1.getDate()<10?('0' + d1.getDate()): d1.getDate())
       + ' ' + (d1.getHours()<10?('0'+d1.getHours()):d1.getHours()) + ':' + (d1.getMinutes()<10?('0'+d1.getMinutes()):d1.getMinutes()) + ':' + (d1.getSeconds()<10?('0'+d1.getSeconds()):d1.getSeconds());
      this.positionTimeList = []
      this.$http({
        url: '/uwb/ips/uwbtag/taglocation/getTagLocationList',
        method: 'get',
        params: {
          'endTime': endTimeTo,//'2021-02-01 18:05:00',//endTimeTo
          'startTime': startTimeTo,//'2021-02-01 18:00:00',//startTimeTo
          'tagno':this.valueLable//'49ae'//this.valueLable
        }
      }).then(({data}) => {
        console.log('历史轨迹数据',data.localtionList)
        if(data.localtionList){
          if(data.localtionList.length==0){
            this.$message({
              showClose: true,
              message: '该时间段暂无轨迹数据',
              type: 'warning'
            });
            return
          }
          //let mapData = this.mapValuetoData[this.valueMap]
          data.localtionList.forEach(item=>{
            // let x = item.location_x*1000*this.areaWidthPx/mapData.areaWidth - 7.5
            // let y = item.location_y*1000*this.areaWidthPx/mapData.areaWidth  - 7.5
            // let location = [x,y]
            this.positionTimeList.push(item)
          })
          let x = data.localtionList[0].location_x*1000*this.areaWidthPx/this.mapValuetoData[this.valueMap].areaWidth - 7.5
          let y = data.localtionList[0].location_y*1000*this.areaWidthPx/this.mapValuetoData[this.valueMap].areaWidth  - 7.5
          //绘制初始轨迹
          this.doDraw(x,y)
        }
        
        //倍速初始化
        this.speedText = '倍速'
        this.sliderTimerIntrval = 100
        //暂停
        this.isStart = true
        //初始化
        this.per = 0
        //进度条最大值为时间秒差 设置起始时间
        this.maxTime = (this.dateValue[1].getTime() - this.dateValue[0].getTime());
      })
    },
    //绘制初始轨迹点
    doDraw(x,y){
      let that = this
      that.img = new Image()
      that.img.src = require('../../../../assets/img/title1.png')
      var canvas =document.getElementById("mycanvas")
      that.context = canvas.getContext('2d')
      that.lastX = x
      that.lastY = y
      that.img.onload = function(){
        if(that.img.complete){
          // that.context.font = 'bold 18px';
          // that.context.textAlign = 'center';
          // that.context.fillStyle = '#ccc';
          // that.context.strokeText(that.titleIdtoName[that.valueLable], x, y,20);
          that.context.drawImage(that.img,x,y,20,20)
        }
      }
    },
    //进度条日期转换
    formatData(value){
      if(this.dateValue[0]){
        let d = new Date(this.dateValue[0].getTime()+value)
        var datetime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        return datetime
      }
      // this.timeData = [new Date(2016, 9, 10,parseInt(startTime[0]),parseInt(startTime[1]),parseInt(startTime[2])),
      //   new Date(2016, 9, 10,parseInt(endTime[0]),parseInt(endTime[1]),parseInt(endTime[2]))]
      return 0
    },
    //修改开始暂停状态
    changeStatus(){
      if(!this.showSlider)return
      if(this.per == this.maxTime){
        return
      }
      this.isStart = !this.isStart
      //开始
      if(!this.isStart){
        this.sliderTimerFun()
      }else{
        clearInterval(this.sliderTimer);
      }
    },
    //重新开始
    resetStart(){
      if(!this.showSlider)return
      //清空定时器
      if(this.sliderTimer){
        clearInterval(this.sliderTimer);
      }
      //清空绘制的轨迹线及标签
      var canvas = document.getElementById("mycanvas")
      this.context = canvas.getContext('2d')
      canvas.height=canvas.height;  
      //开始
      this.per = 0
      this.changeStatus()
    },
    //拖动进度条
    changeSliderData(){
      console.log('changeSliderData',this.per)
      let that = this
      //清空定时器
      if(this.sliderTimer){
        clearInterval(this.sliderTimer);
      }
      //清空绘制的轨迹线及标签
      var canvas = document.getElementById("mycanvas")
      that.context = canvas.getContext('2d')
      canvas.height=canvas.height;  
      //加载指定拖拽点前所有轨迹点，并绘制
      let positionDataX = []
      let positionDataY = []
      for(var i=0;i<this.positionTimeList.length;i++){
        let d = new Date(this.dateValue[0].getTime()+this.per)
        if(d>=new Date(this.positionTimeList[i].startTime)&&d<=new Date(this.positionTimeList[i].endTime)){
          this.last_i = i
          break;
        }else{
          let x = this.positionTimeList[i].location_x*1000*this.areaWidthPx/this.mapValuetoData[this.valueMap].areaWidth - 7.5
          let y = this.positionTimeList[i].location_y*1000*this.areaWidthPx/this.mapValuetoData[this.valueMap].areaWidth  - 7.5
          positionDataX.push(x)
          positionDataY.push(y)
        }
      }
      for(var i=0;i<positionDataX.length;i++){
        this.context.lineTo(positionDataX[i]+5, positionDataY[i]+7.5)
        this.context.strokeStyle = "blue"
        this.context.lineWidth = 3
        this.context.stroke()
      }
      let xNow = positionDataX[positionDataX.length-1]
      let yNow = positionDataY[positionDataY.length-1]
      this.context.drawImage(this.img,xNow,yNow,20,20)
      this.lastX = xNow
      this.lastY = yNow
      this.isStart = false
      //开启定时器
      this.sliderTimerFun()
    },
    sliderTimerFun(){
      this.sliderTimer = setInterval(()=>{
        let nextTime = this.per + 100
        //console.log('nextTime',nextTime)
        if(nextTime<this.maxTime){
          this.per = nextTime
          
          let d = new Date(this.dateValue[0].getTime()+this.per)
          
          //根据时间找到下一个点并连接绘制
          for(var i=this.last_i;i<this.positionTimeList.length;i++){
            if(d>=new Date(this.positionTimeList[i].startTime)&&d<=new Date(this.positionTimeList[i].endTime)){
              this.last_i = i
              let x = this.positionTimeList[i].location_x*1000*this.areaWidthPx/this.mapValuetoData[this.valueMap].areaWidth - 7.5
              let y = this.positionTimeList[i].location_y*1000*this.areaWidthPx/this.mapValuetoData[this.valueMap].areaWidth  - 7.5
              if(x==this.lastX&&y==this.lastY)break//还在同一个位置将不进行绘制
              console.log('新位置',x,y)

              // this.context.clearRect(this.lastX-20,this.lastY-20,55,55)
              // this.context.font = 'bold 18px';
              // this.context.textAlign = 'center';
              // this.context.fillStyle = '#ccc';
              // this.context.strokeText(that.titleIdtoName[that.valueLable], x, y,20);
              this.context.clearRect(this.lastX,this.lastY,20,20)
              //先绘制线
              this.context.lineTo(x+5, y+7.5)
              this.context.strokeStyle = "blue"
              this.context.lineWidth = 3;
              this.context.stroke()
              //绘制图标
              this.context.drawImage(this.img,x,y,20,20)

              

              this.lastX = x;
              this.lastY = y;
              break; 
            }
          }
        }else{
          this.per = this.maxTime
          //let d = new Date(this.dateValue[0].getTime()+this.per)
          //console.log(d)
          this.isStart = true
          this.last_i = 0
          clearInterval(this.sliderTimer);
          return;
        }
      }, this.sliderTimerIntrval);
    },
    //二维三维切换
    handleClick(tab, event) {
      // if(this.firstLoading&&tab.label=='3D'){
      //   this.firstLoading = false
      //   this.$nextTick(() => {
      //     console.log('height',this.showHeight,'width',this.$refs.threeworld.clientWidth)
      //     this.ifame3D.postMessage(
      //     {
      //       type:'iniSize',
      //       data:{'height':this.showHeight,'width':this.$refs.threeworld.clientWidth},
      //     },'*')
      //   })
      // }
    },
    //获取区域数据
         async getAreaList(){
        // let that = this    
        let treedata = await sdcSiteAction("", "/tree", "get");
        this.optionsMap = modifyData(treedata.data.data);
        this.request({
          url: '/site-sdc/sdcsite/listAllSite',
          method: 'get',
          params: {}
        }).then(({data}) => {
          // this.optionsMap = []
          this.mapValuetoData = new Array()
          if (data && data.code == '0'){
            if(data.data){
              console.info(data.data)     
              data.data.forEach(element => {
                let temp={
                  value: element.id,
                  label: element.name,
                  map2d:element.siteImg,
                  areaLength:element.areaLength,//实际长度
                  areaWidth:element.areaWidth,//实际宽度
                  pixelLength:element.pixelLength,//像素长度（px）
                  pixelWidth:element.pixelWidth//像素宽度（px）
                }
                // that.optionsMap.push(temp)
                this.mapValuetoData[element.id] = temp
              });
              console.info(this.mapValuetoData)      
              // this.valueMap = this.optionsMap[0].value
              // this.changeMap()
            }
          }else{
             this.$message({
              showClose: true,
              message: '获取区域数据失败',
              type: 'error'
            });
          }
        })
      },
    // getAreaList(){
    //   let that = this
    //   this.$http({
    //     url: '/ips/uwbarea/uwbArea/list',
    //     method: 'get',
    //     params: {
    //       'pageNo': 1,
    //       'pageSize': 50000,
    //     }
    //   }).then(({data}) => {
    //     that.optionsMap = []
    //     that.mapValuetoData = new Array()
    //     if (data && data.success){
    //       if(data.page.list){
    //         data.page.list.forEach(element => {
    //           let temp={
    //             value: element.id,
    //             label: element.areaName,
    //             map2d:element.map2d,
    //             areaLength:element.areaLength,//实际长度
    //             areaWidth:element.areaWidth,//实际宽度
    //             pixelLength:element.pixelLength,//像素长度（px）
    //             pixelWidth:element.pixelWidth//像素宽度（px）
    //           }
    //           that.optionsMap.push(temp)
    //           that.mapValuetoData[element.id] = temp
    //         });
    //         that.valueMap = that.optionsMap[0].value
    //         that.changeMap()
    //       }
    //     }else{
    //         that.$message({
    //         showClose: true,
    //         message: '获取区域数据失败',
    //         type: 'error'
    //       });
    //     }
    //   })
    // },
    //修改地图，初始化下面地图
    changeMap(val){
      this.valueMap = val[val.length - 1];
      let mapData = this.mapValuetoData[this.valueMap]       
      if(mapData.pixelLength == null || mapData.pixelLength == 0 || mapData.pixelWidth == null || mapData.pixelWidth == 0){
          this.$message("请通过【工程管理】对此位置设置正确得平面图像素！")
          return;
        }
        if(mapData.map2d == null || mapData.map2d == ""){
          this.$message("请通过【工程管理】上传平面图！")
          return;
        }
      let scale = this.showHeight/mapData.pixelLength
      let width = scale*mapData.pixelWidth
      this.areaWidthPx = width
      this.areaLengthPx = this.showHeight
      //高度大于宽度
      if(mapData.pixelLength>=mapData.pixelWidth){
        this.mapStyle=`background-image:url(${mapData.map2d});
        background-repeat:no-repeat;
        background-size:auto 100%;width:${width}px;height:${this.showHeight}px;`
      }else{
        this.mapStyle=`background-image:url(${mapData.map2d});
        background-repeat:no-repeat;
        background-size:100% auto;width:${width}px;height:${this.showHeight}px;`
      }
      this.mapStyleTop=`width:${width}px;height:${this.showHeight}px;`

      //切换地图-重新初始化绘制图层大小
      // if(this.fabricObj){
      //   this.fabricObj.setHeight(this.areaLengthPx);
      //   this.fabricObj.setWidth(this.areaWidthPx);
      // }
      //获取基站信息
      this.getStations()
      //获取电子围栏信息
      this.getFenceList()
    },
    //获取基站数据
    getStations(){
      let mapId = this.valueMap;
      this.$http({
        url: '/uwb/ips/uwbstation/uwbStation/list',
        method: 'get',
        params: {
          'pageNo': 1,
          'pageSize': 50000,
          'orderBy': '',
          'areaId':mapId,
        }
      }).then(({data}) => {
        if (data && data.success) {
          //初始化基站位置
          //console.log('stationList',data.page.list)
          this.stationList = data.page.list
        }else{
          this.$message({
            showClose: true,
            message: '获取基站数据失败',
            type: 'error'
          });
        }
      })

    },
    //获取电子围栏信息
    getFenceList(){
      // if(!this.fabricObj){
      //   this.$nextTick(() => {
      //     this.fabricObj = new fabric.Canvas("mycanvas");
      //   });
      // }else{
      //   this.fenceList.forEach(item => {
      //     this.fabricObj.remove(item)
      //   })
      //   this.fabricObj.renderAll();
      // }
      this.fenceList = []
      this.$http({
        url: '/uwb/ips/uwbelectronicfence/uwbElectronicFence/list',
        method: 'get',
        params: {
          'pageNo': 1,
          'pageSize': 50000,
          'orderBy': '',
          'areaId':this.valueMap,
          'fenceType':''
        }
      }).then(({data}) => {
        //console.log('fencePinitList',data.page.list)
        if (data && data.success) {
          // data.page.list.forEach(item=>{
          //   let points = this.getShowPoints(item.coordinateXlist,item.coordinateYlist)
          //   var polygon = new fabric.Polygon(points, {
          //     fill: 'rgba(1,1,1,0)',
          //     strokeWidth: 2,
          //     stroke: 'red',
          //     scaleX: 1,
          //     scaleY: 1,
          //     objectCaching: false,
          //     transparentCorners: true,
          //     cornerColor: 'rgba(0,0,255,0.3)',
          //   });
          //   polygon.selection = false
          //   polygon.hasControls = polygon.hasBorders = false 
          //   polygon.lockMovementX = true; // 不允许横向拖拽 
          //   polygon.lockMovementY  = true; // 不允许纵向拖拽 
          //   this.fabricObj.add(polygon)
          //   this.fenceList.push(polygon)// 用于初始化删除
          // })
          // this.fabricObj.renderAll();
          var canvas =document.getElementById("mycanvasPolygon")
          let context = canvas.getContext('2d')
          context.beginPath();
          context.strokeStyle="red";
          context.lineWidth = 2
          data.page.list.forEach(item=>{
            let points = this.getShowPoints(item.coordinateXlist,item.coordinateYlist)
            for(var i=0;i<points.length;i++){
              if(i==0){
                context.moveTo(points[i].x,points[i].y);
              }else{
                context.lineTo(points[i].x,points[i].y);
              }
            }
            context.closePath();
            context.stroke();
          })
        }
      })
    },
    //转换显示多边形坐标
    getShowPoints(coordinateXlist,coordinateYlist){
      let xList = coordinateXlist.split(',')
      let yList = coordinateYlist.split(',')
      if(xList.length!=yList.length){
        this.$message({
          showClose: true,
          message: '电子围栏坐标数据异常',
          type: 'warning'
        });
        return null
      }else{
        let mapData = this.mapValuetoData[this.valueMap]
        let points = []
        for(var i=0;i<xList.length;i++){
          let x = xList[i]*1000*this.areaWidthPx/mapData.areaWidth
          let y = yList[i]*1000*this.areaLengthPx/mapData.areaLength
          let tempPoint = {
            'x':x,
            'y':y
          }
          points.push(tempPoint)
        }
        return points
      }
    },
    //修改倍速
    changeSpeed(){
      if(!this.showSlider)return
      //应该变快，间隙变短
      switch(this.speedText){
        case '倍速':
          this.speedText = '1.5倍速'
          this.sliderTimerIntrval = this.sliderTimerIntrval - 20
          break;
        case '1.5倍速':
          this.speedText = '2.0倍速'
          this.sliderTimerIntrval = this.sliderTimerIntrval - 20
          break;
        case '2.0倍速':
          this.speedText = '2.5倍速'
          this.sliderTimerIntrval = this.sliderTimerIntrval - 20
          break;
        case '2.5倍速':
          this.speedText = '3.0倍速'
          this.sliderTimerIntrval = this.sliderTimerIntrval - 20
          break;
        case '3.0倍速':
          this.speedText = '倍速'
          this.sliderTimerIntrval = 100
          break;
        default:
          // this.speedText = '倍速'
          // this.sliderTimerIntrval = 1000
          break;
      }
      clearInterval(this.sliderTimer);
      this.sliderTimerFun()
      console.log('sliderTimerIntrval',this.sliderTimerIntrval)
    },
    //绘制轨迹点
      // doDraw(imageUrl){
      //   let that = this
      //   //  获取canvas
      //   var canvas = document.getElementById("mycanvas")
      //   //  由于弹窗，确保已获取到
      //   var a = setInterval(() =>{
      //       //  重复获取
      //       canvas = document.getElementById("mycanvas")
      //       if(!canvas){
      //         return false
      //       } else {
      //           clearInterval(a)
      //           //  可以理解为一个画笔，可画路径、矩形、文字、图像
      //           that.context = canvas.getContext('2d')
      //           that.context.moveTo(50,50) 

      //           that.img = new Image()
      //           that.img.src = imageUrl
      //           //  加载图片
      //           that.img.onload = function(){
      //               if(that.img.complete){
      //                   //  根据图像重新设定了canvas的长宽
      //                   // canvas.setAttribute("width",img.width)
      //                   // canvas.setAttribute("height",img.height)
      //                   //  绘制图片
      //                   that.context.drawImage(that.img,10,10,15,15)
      //               }
      //           }

      //           //that.handleInputTwo()
      //       }
      //   },1)
      // },
    handleInputTwo (e) {
      var _this = this
      _this.pos = []

      // 当用户按下鼠标按钮执行
      document.onmousedown = function (e) {
        if(e.offsetX){
           _this.pos.push({ x: e.offsetX, y: e.offsetY })
          // _this.pos.push({x:e.clientX, y:e.clientY});
          // 在鼠标指针移到指定的元素后执行
          document.onmousemove = function (e) {
            _this.pos.push({ x: e.offsetX - 7.5, y: e.offsetY - 7.5 })
            // _this.pos.push({x:e.clientX,y:e.clientY});
            return false
          }
        }
        return false
      }
      // 在用户鼠标按键被松开时执行
      document.onmouseup = function () {
        //console.log('this.pos', _this.pos)
         _this.context.clearRect(10,10,15,15)
        let lastx = 50;
        let lasty = 50;
        var timer = setInterval(function () {
          if(_this.pos.length == 0){
            clearInterval(timer);
            return;
          }
          _this.context.clearRect(lastx,lasty,15,15)
          _this.context.drawImage(_this.img,_this.pos[0].x, _this.pos[0].y,15,15)

          _this.context.lineTo(_this.pos[0].x+5, _this.pos[0].y+7.5)
          _this.context.strokeStyle = "blue"
          _this.context.lineWidth = 3;
          _this.context.stroke()

          lastx = _this.pos[0].x;
          lasty = _this.pos[0].y;
          _this.pos.shift()
        },70)
      }
    },
    //三维-----------------------
  //   init(){
  //       // 1.2 相机
  //       this.camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 1000)
  //       // 1.3 渲染器
  //       this.renderer = new THREE.WebGLRenderer({antialias: true})

  //       // 创建纹理加载器
  //       this.textureLoader = new THREE.TextureLoader()

  //       // 设置相机
  //       // 设置摄像机位置,相机方向逆X轴方向，倾斜向下看
  //       this.camera.position.set(0, 360 ,360)
  //       //this.camera.position.set(-20, 40 ,30)
  //       // 指向场景中心
  //       this.camera.lookAt(this.scene.position)
  //       // 添加坐标轴，辅助判断位置
  //       let axes = new THREE.AxesHelper(1000)
  //       this.scene.add(axes);

  //       // 设置环境
  //       this.renderer.setClearColor(new THREE.Color('#f1f9fb'))
  //       // 设置场景大小
  //       this.renderer.setSize(
  //           this.$refs.threeworld.clientWidth,
  //           this.$refs.threeworld.clientHeight)
  //       // 渲染器开启阴影效果
  //       this.renderer.shadowMap.enabled = true

  //       // 点光源
  //       let point = new THREE.PointLight(0xffffff)
  //       point.position.set(500, 300, 400) // 点光源位置
  //       this.scene.add(point) // 点光源添加到场景中
  //       // 环境光
  //       let ambient = new THREE.AmbientLight(0x999999)
  //       this.scene.add(ambient)

  //        // 渲染div到canvas
  //       this.$refs.threeworld.appendChild(this.renderer.domElement)

  //       // 鼠标键盘控制
  //       let controls = new OrbitControls(this.camera, this.renderer.domElement) // 创建控件对象  相机对象camera作为参数   控件可以监听鼠标的变化，改变相机对象的属性
  //       // 动态阻尼系数 就是鼠标拖拽旋转灵敏度，阻尼越小越灵敏
  //       controls.dampingFactor = 0.5
  //       // 是否可以缩放
  //       controls.enableZoom = true
  //       // 是否自动旋转
  //       controls.autoRotate = false
  //       // 设置相机距离原点的最近距离
  //       controls.minDistance = 20
  //       // 设置相机距离原点的最远距离
  //       controls.maxDistance = 1000
  //       // 是否开启右键拖拽
  //       controls.enablePan = true
  //       // 上下翻转的最大角度
  //       controls.maxPolarAngle = 1.5
  //       // 上下翻转的最小角度
  //       controls.minPolarAngle = 0.0
  //       // 是否可以旋转
  //       this.enableRotate = true

  //       controls.addEventListener('change', this.render)


  //       this.addGeoBox()
  //       this.createWall()
  //       this.createPartition()
  //       this.loadTable()
  //       // this.createConferenceTable()
  //       // this.createCabinet()
  //       // this.createChair()
  //       // this.loadObj()
        
  //       this.render()
  //   },
  //   render() {
  //       requestAnimationFrame(this.render); //请求再次执行渲染函数render
  //       if(this.renderer){
  //         this.renderer.render(this.scene,this.camera);//执行渲染操作
  //       }
  //       var time = this.clock.getDelta();
  //       if (this.mixer) {
  //         this.mixer.update(time);
  //       }
  //   },
  //   //地板
  //   addGeoBox(){
  //     //创建材质并贴上纹理
  //     let floorTexture = this.textureLoader.load(require('../../../../assets/img/floor.jpg'));
  //     let boxTextureMaterial = new THREE.MeshStandardMaterial({
  //           map:floorTexture,
  //           metalness: 0.2,
  //           roughness: 0.07,
  //           side: THREE.DoubleSide,
  //       });
  //     //墙宽2
  //     let boxGeo = new THREE.BoxBufferGeometry(439+2+2,2, 376.5+2+2);
  //     let boxMesh = new THREE.Mesh(boxGeo, boxTextureMaterial);
  //     boxMesh.position.set(0, 0, 0);
  //     this.scene.add(boxMesh);
  //   },
  //   //四周墙
  //   createWall(){
  //     //外墙
  //     let wallMaterial = new THREE.MeshLambertMaterial({color: 0x00FFFF});
  //     let wallGeo = new THREE.BoxGeometry(439+2+2, 120, 376.5+2+2);
  //     let wallMesh = new THREE.Mesh(wallGeo, wallMaterial);
  //     wallMesh.position.set(0, 60, 0);//(0, 60, -14.95);
  //     //内墙
  //     let wallInnerMaterial = new THREE.MeshLambertMaterial({color: 0x2D1BFF});
  //     let wallInnerGeo = new THREE.BoxGeometry(439, 120, 376.5);//(270, 120, 390);
  //     let wallInnerMesh = new THREE.Mesh(wallInnerGeo, wallInnerMaterial);
  //     wallInnerMesh.position.set(0, 60, 0);//(0, 60, -14.95);
      
  //     //门
  //     let doorTexture = this.textureLoader.load(require('../../../../assets/img/door_left.png'));
  //     let boxTextureMaterial = new THREE.MeshStandardMaterial({
  //         map:doorTexture,
  //         metalness: 0.2,
  //         roughness: 0.07,
  //         side: THREE.DoubleSide,
  //     });
  //     //let doorInnerMaterial = new THREE.MeshLambertMaterial({color: 0x2D1BFF});
  //     let doorGeo = new THREE.BoxGeometry(2, 80, 74.5);
  //     let doorMesh = new THREE.Mesh(doorGeo, boxTextureMaterial);
  //     doorMesh.position.set(-220.5, 40, 0);
  //     //this.scene.add(doorMesh);

  //     //转BSP
  //     let wallBSP = new ThreeBSP(wallMesh);
  //     let wallInnerBSP = new ThreeBSP(wallInnerMesh);
  //      let doorBSP = new ThreeBSP(doorMesh);
  //     // let window1BSP = new ThreeBSP(this.createWindowRight());
  //     //let window2BSP = new ThreeBSP(this.createWindowRight());// createWindowLeft
  //     let wallResultBSP = wallBSP.subtract(wallInnerBSP);
  //      wallResultBSP = wallResultBSP.subtract(doorBSP);
  //     // wallResultBSP = wallResultBSP.subtract(window1BSP);
  //     //wallResultBSP = wallResultBSP.subtract(window2BSP);
  //     let wallResultMesh = wallResultBSP.toMesh();

  //     //转换后的Mesh配置属性
  //     let wallTexture = this.textureLoader.load(require('../../../../assets/img/wall.jpg'));
  //     let wallTextureMaterial = new THREE.MeshStandardMaterial({
  //         map:wallTexture,
  //         metalness: 0.2,
  //         roughness: 0.07,
  //         side: THREE.DoubleSide
  //     });
  //     let wallInnerTexture = this.textureLoader.load(require('../../../../assets/img/wall.jpg'));
  //     let wallInnerTextureMaterial = new THREE.MeshStandardMaterial({
  //         map:wallInnerTexture,
  //         metalness: 0.2,
  //         roughness: 0.07,
  //         side: THREE.DoubleSide
  //     });
  //     let wallResultMeshMaterial = [];
  //     wallResultMeshMaterial.push(wallTextureMaterial);
  //     wallResultMeshMaterial.push(wallInnerTextureMaterial);
  //     //wallResultMeshMaterial.push(boxTextureMaterial);
  //     wallResultMesh.material = wallResultMeshMaterial;

  //     // console.log(wallResultMesh.geometry.faces, 112233);
  //     wallResultMesh.geometry.faces.forEach((item, i) => {
  //         if(i<160){
  //             item.materialIndex = 0;
  //         } else {
  //             item.materialIndex = 1;
  //         }
  //     })

  //     wallResultMesh.geometry.computeFaceNormals();
  //     wallResultMesh.geometry.computeVertexNormals();
  //     //添加结果到场景中
  //     this.scene.add(wallResultMesh);
  //   },
  //   //屋内隔断
  //   createPartition(){
  //     //隔断1
  //     let partitionMaterial = new THREE.MeshLambertMaterial({color: 0x2D1BFF});
  //     let partitionGeo = new THREE.BoxGeometry(330, 120, 2);
  //     let partitionMesh = new THREE.Mesh(partitionGeo, partitionMaterial);
  //     partitionMesh.position.set(54.5, 60, -47.6);
  //     //this.scene.add(partitionMesh);

  //     //门1

  //     let doorTexture = this.textureLoader.load(require('../../../../assets/img/door_left.png'));
  //     let boxTextureMaterial = new THREE.MeshStandardMaterial({
  //         map:doorTexture,
  //         metalness: 0.2,
  //         roughness: 0.07,
  //         side: THREE.DoubleSide,
  //     });

  //     //let doorInnerMaterial = new THREE.MeshLambertMaterial({color: 0x2D1BFF});
  //     let doorGeo = new THREE.BoxGeometry(45, 80, 2);
  //     let doorMesh = new THREE.Mesh(doorGeo, boxTextureMaterial);
  //     doorMesh.position.set(-36, 40, -47.6);
  //     //this.scene.add(doorMesh);

  //     //门2
  //     //let doorInnerMaterial2 = new THREE.MeshLambertMaterial({color: 0x2D1BFF});
  //     let doorGeo2 = new THREE.BoxGeometry(45, 80, 2);
  //     let doorMesh2 = new THREE.Mesh(doorGeo2, boxTextureMaterial);
  //     doorMesh2.position.set(14.5, 40, -47.6);
  //     //this.scene.add(doorMesh2);

  //     //转BSP
  //     let partitionBSP = new ThreeBSP(partitionMesh);
  //     let doorBSP = new ThreeBSP(doorMesh);
  //     let doorBSP2 = new ThreeBSP(doorMesh2);
  //     let partitionResultBSP = partitionBSP.subtract(doorBSP);
  //     partitionResultBSP = partitionResultBSP.subtract(doorBSP2);
  //     let partitionResultMesh = partitionResultBSP.toMesh();

  //     let partitionture1 = this.textureLoader.load(require('../../../../assets/img/wall.jpg'));
  //     let partitionMaterial1 = new THREE.MeshStandardMaterial({
  //         map:partitionture1,
  //         metalness: 0.2,
  //         roughness: 0.07,
  //         side: THREE.DoubleSide
  //     });

  //     let partitionResultMeshMaterial = [];
  //     partitionResultMeshMaterial.push(partitionMaterial1);
  //     partitionResultMesh.material = partitionResultMeshMaterial;


  //     partitionResultMesh.geometry.faces.forEach((item, i) => {
  //         if(i<160){
  //             item.materialIndex = 0;
  //         } else {
  //             item.materialIndex = 1;
  //         }
  //     })

  //     partitionResultMesh.geometry.computeFaceNormals();
  //     partitionResultMesh.geometry.computeVertexNormals();
  //     //添加结果到场景中
  //     this.scene.add(partitionResultMesh);

  //     //隔断2
  //     let partitionGeo2 = new THREE.BoxGeometry(2, 120, 140.65);
  //     let partitionMesh2 = new THREE.Mesh(partitionGeo2, partitionMaterial1);
  //     partitionMesh2.position.set(-10.5, 60, -117.925);
  //     this.scene.add(partitionMesh2);

  //     //隔断3
  //     let partitionGeo3 = new THREE.BoxGeometry(2, 120, 140.65);
  //     let partitionMesh3 = new THREE.Mesh(partitionGeo3, partitionMaterial1);
  //     partitionMesh3.position.set(-110.5, 60, -117.925);
  //     this.scene.add(partitionMesh3);
  //   },
  //   //加载桌子模型
  //   loadTable(){
  //     //包含材质
  //     let _this = this;
      
  //     new MTLLoader().load(`${_this.publicPath}models/table/desk1000.mtl`, materials => {
  //       //console.log("materials", materials);
  //       materials.preload();
  //       new OBJLoader().setMaterials(materials).load(`${_this.publicPath}models/table/desk1000.obj`, obj => {
  //         obj.scale.set(0.05, 0.05, 0.05);
  //         obj.position.set(-160.5, 0, 190.25);
  //         obj.rotateY(Math.PI/2);
  //         _this.groupBox.add(obj);

  //         _this.cloneModel(obj,-160.5, 0, 140.25,0)
  //         _this.cloneModel(obj,-150.5, 0, 83.25,-Math.PI)
  //         _this.cloneModel(obj,-150.5, 0, 133.25,-Math.PI)
  //         _this.cloneModel(obj,-34, 0, 191.25,0)
  //         _this.cloneModel(obj,-34, 0, 141.25,0)
  //         _this.cloneModel(obj,85.5, 0, 73.25,0)
  //         _this.cloneModel(obj,-30.5, 0, 15.25,-Math.PI)
  //         _this.cloneModel(obj,205.5, 0, 73.25,0)
  //         _this.cloneModel(obj,90.5, 0, 15.25,-Math.PI)
  //       });
  //       this.scene.add( _this.groupBox);
  //     });
  //     new MTLLoader().load(`${_this.publicPath}models/table/desk1200.mtl`, materials => {
  //       materials.preload();
  //       new OBJLoader().setMaterials(materials).load(`${_this.publicPath}models/table/desk1200.obj`, obj => {
  //         obj.scale.set(0.05, 0.05, 0.05);
  //         obj.position.set(85.5, 0, 190.25);
  //         obj.rotateY(Math.PI/2);
  //         _this.groupBox1.add(obj);

  //         _this.cloneModel(obj,85.5, 0, 130.25,0)
  //         _this.cloneModel(obj,-30.5, 0, 66.25,-Math.PI)
  //         _this.cloneModel(obj,-30.5, 0, 126.25,-Math.PI)
  //         _this.cloneModel(obj,205.5, 0, 190.25,0)
  //         _this.cloneModel(obj,205.5, 0, 130.25,0)
  //         _this.cloneModel(obj,90.5, 0, 66.25,-Math.PI)
  //         _this.cloneModel(obj,90.5, 0, 126.25,-Math.PI)
  //         //财务室
  //         _this.cloneModel(obj,-110, 0, -64,-Math.PI/2)
  //         _this.cloneModel(obj,-46, 0, -180,Math.PI/2)
  //       });
  //       this.scene.add( _this.groupBox1);
  //     });
  //     new MTLLoader().load(`${_this.publicPath}models/table/meeting.mtl`, materials => {
  //       materials.preload();
  //       new OBJLoader().setMaterials(materials).load(`${_this.publicPath}models/table/meeting.obj`, obj => {
  //         obj.scale.set(0.05, 0.05, 0.05);
  //         obj.position.set(20, 0, -80);
  //         //obj.rotateY(Math.PI/2);
  //         this.scene.add(obj);
  //       });
  //     });

  //   },
  //   //复制模型
  //   cloneModel(obj, x, y, z, route) { //params: 模型， 坐标xyz，自定义数据
  //     const cloneObj = obj.clone();
  //     // cloneObj.$data = {
  //     //   name: '亚托克斯 ' + num + '号'
  //     // }
  //     cloneObj.position.set(x, y, z);
  //     if(route!=0){
  //       cloneObj.rotateY(route)
  //     }
  //     this.groupBox.add(cloneObj);
  //     /**增加文字标签 */
  //     // const sprite = this.createSprite(cloneObj.$data); //前面文章有讲,createSprite函数是自定义的，用于给模型增加文字标签
  //     // sprite.position.set(x, y + 2, z);
  //     // this.this.scene.add(sprite);
  //   },
  //   loadObj() {
  //     let self = this;
  //     let loader = new GLTFLoader();
  //     loader.load(`${self.publicPath}models/Soldier/Soldier.glb`, function(gltf) {
  //       self.mesh = gltf.scene.children[0];
  //       self.mesh.scale.set(0.3, 0.3, 0.3);
  //       self.mesh.position.set(-90.5, 0, 127.5);
  //       self.scene.add(self.mesh); // 将模型引入three

  //       self.mixer = new THREE.AnimationMixer(self.mesh);
  //       var action = self.mixer.clipAction(gltf.animations[3]);
  //       action.stop().setDuration(4).play();
  //     });
  //     self.scene.add(loader);

  //     this.walk()
  //   },
  //   walk(){
  //     //绘制曲线
  //     var curve = new THREE.CatmullRomCurve3([
  //       //new THREE.Vector3(-105.5, 0, 127.5),
  //       new THREE.Vector3(-200.5, 0, -151),
  //       new THREE.Vector3(-200.5, 0, 0),
  //       new THREE.Vector3(0,0, 0)
  //     ], false/*是否闭合*/);

  //     var points = curve.getPoints(50);
      
  //     let _i = 0;
  //     let _this = this;
  //     this.timer = setInterval(() => {
  //       if(_this.mesh){
  //           _this.mesh.position.set(points[_i].x, points[_i].y, points[_i].z);
  //           _this.mesh.lookAt(points[_i+1].x, points[_i+1].y, points[_i+1].z)
  //           // _this.mesh.lookAt(0, 0, 0)
  //           _this.mesh.rotateZ(Math.PI)
  //           _this.mesh.rotateX(Math.PI/2)
  //           _i++;
  //           if(_i>50-1) _i=0
  //       }
  //     }, 500);
  //   }
  },
  deactivated () {
    if(this.sliderTimer){
      clearInterval(this.sliderTimer)
    }
  },
  beforeDestroy () {
    clearInterval(this.sliderTimer)
    clearInterval(this.timer)
    this.renderer = null
    //this.scene.dispose()
    this.scene = null
    this.camera = null
    this.controls = null
    this.mesh = null
    this.textureLoader = null
    this.mixer = null;
    this._pointsBuf = []
    this.groupBox = null
    this.groupBox1 = null
  }
})
</script>


<style lang="scss">
.erweiClass{
  .el-tabs__content{
    background:#f1f9fb;
  }

  .el-tabs__nav{
    margin-left: 20px;
  }

  .el-slider__runway{
    margin: 0 0;
  }
}
</style>
<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';
.dateStyle{
  width: 36%;
  height: 100px;
 // background-color: red;
  position: absolute;
  z-index: 10;
  margin-top: 12px;
  right:0px;
}

.nodeClass{
  width:30px;
  //background:red;
  position:absolute;
  background: url(../../../../assets/img/node.png) no-repeat;
  background-size:100%;
  cursor: pointer;
  z-index: 1000;
}
//离线样式
.nodeClassOffline{
  width:30px;
  //background:red;
  position:absolute;
  background: url(../../../../assets/img/nodeOffLine.png) no-repeat;
  background-size:100%;
  cursor: pointer;
  z-index: 1000;
}
.toolClass{
  height:40px;
  background: rgba(61,129,253,0.11);
  flex-direction: row;  /* 子元素横向排列 */
  align-items: center; /*  子元素相对父元素垂直居中 */
  display:flex;
  cursor:pointer;

  .toolone{
    height:80%;
    width:69px;
    // border-right:3px #e7e7e7 solid;
    flex-direction: row;  /* 子元素横向排列 */
    justify-content: center; /* 相对父元素水平居中 */
    align-items: center; /*  子元素相对父元素垂直居中 */
    display:flex;

    font-size: 15px;
    font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;
    font-weight: 400;
    color: #383838;

  }

}

.map-chart1 {
  position: relative;
  text-align: center;
  margin-top:10px;
  margin-bottom: 10px;
  display:flex;
  justify-content: center;

  .pictureClass{
    height: 100%;
    margin:0 auto;
    position: absolute;
    //background: url(../../../../assets/img/office.png) no-repeat;
    // background-size:auto 700px;
  }
}

.map-chart {
  position: relative;
  //height: 700px;
  text-align: center;
}

.bottomClass{
  height:59px;
  background-color:#ffffff;
  margin-top:12px;
  flex-direction: row;  /* 子元素横向排列 */
  align-items: center; /*  子元素相对父元素垂直居中 */
  display:flex;

  .one{
    height:80%;
    width:150px;
    border-right:3px #e7e7e7 solid;
    flex-direction: row;  /* 子元素横向排列 */
    justify-content: center; /* 相对父元素水平居中 */
    align-items: center; /*  子元素相对父元素垂直居中 */
    display:flex;
  }

  .oneRight{
    height:80%;
    width:150px;
    border-left:3px #e7e7e7 solid;
    flex-direction: row;  /* 子元素横向排列 */
    justify-content: center; /* 相对父元素水平居中 */
    align-items: center; /*  子元素相对父元素垂直居中 */
    display:flex;
    margin-left: auto;
  }

  .myFont{
    font-size: 16px;
    font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;
    font-weight: 400;
    text-align: left;
    color: #656565;
    line-height: 34px;
    margin-left:6px;
  }
}

.myDiv{
  position: absolute;
  width: 66px;
  height: 45px;
  
  top:0px;
  left: 0px;
}
.active1{
  background: url(../../../../assets/img/people.png) no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
}
.active2{
  background: url(../../../../assets/img/people.png) no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
}

</style>
