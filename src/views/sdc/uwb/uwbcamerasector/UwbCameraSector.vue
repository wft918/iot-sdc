<template>
<basic-container>
<div class="UwbCameraSectorClass" style="height:100%;">
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="防区配置" name="first">
       <!-- 日期过滤 -->
      <div class="dateStyle">
        <div class="fontStyle">区域：</div>
        <!-- <el-select size="mini" v-model="valueMap" placeholder="请选择区域" @change="changeMap">
          <el-option
            v-for="item in optionsMap" 
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select> -->
          <el-cascader
              placeholder="请选择区域"
              ref="siteChoose"
              :options="optionsMap"
              v-model="valueMap"
              clearable
              filterable
              @change="changeMap"
              :props="{ value: 'id', label: 'name', children: 'children' }">
        </el-cascader>
        <!-- <div class="fontStyle" style="margin-left:37px;">类型：</div>
        <el-select size="mini" v-model="typeData" placeholder="请选择区域" @change="refreshList">
          <el-option
            v-for="item in typeList" 
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select> -->
        <el-button type="primary" size="mini" :icon="icon"  style="margin-left:37px;height:30px;" @click="addFence">{{ fontValue }}</el-button>
      </div>
      <div style="height:calc(100% - 43px);background-color:#f1f9fb;padding-top: 5px;padding-bottom: 5px;">
        <div class="map-chart" :style="'height:'+showHeight+'px;'">
          <div class="pictureClass"  :style="mapStyle">
            <canvas id="mycanvas" :width="areaWidthPx" :height="areaLengthPx">
            </canvas>
          </div>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="防区列表" name="second">
      <UwbCameraSectorList  ref="UwbCameraSectorList" ></UwbCameraSectorList>
    </el-tab-pane>
  </el-tabs>
  <UwbCameraSectorForm  ref="UwbCameraSectorForm" @refreshList='refreshList'></UwbCameraSectorForm>
</div>
</basic-container>
</template>

<script>
import Vue from 'vue'
import { fabric } from "fabric";
import UwbCameraSectorForm from './UwbCameraSectorForm'
import UwbCameraSectorList from './UwbCameraSectorList'
import { modifyData } from "@/util/domainFilter";
import { sdcSiteAction } from "@/api/sdc/addressInfo";
export default Vue.extend({
  data () {
    return {
      activeName:'first',
      showHeight:678,
      // 暂停结束标志
      publicPath: process.env.BASE_URL,
      //地图数据
      optionsMap: [],
      valueMap: '',
      mapValuetoData:new Array(),
      areaWidthPx:0,
      areaLengthPx:0,
      mapStyle:'',
      //类型
      // typeList:[{value:0,label:'告警'},{value:1,label:'考勤'}],
      // typeData:0,
      //绘制多边形参数
      roof: null,
      roofPoints: [],
      lines: [],
      lineCounter: 0,
      drawingObject: {
        type: "",
        background: "",
        border: ""
      },
      fabricObj: null,
      mouseFrom: {},
      cameraSectorListtoDelete:[],
      cameraSectorListData:[],
      fontValue:'添加防区',
      icon:'el-icon-plus',
      deleteImg:null,
      updateImg:null,
      saveImg:null,
      cancleImg:null
    }
  },
  components: {UwbCameraSectorForm,UwbCameraSectorList},
  computed: {},
  created(){
  },
  mounted () {
    
    this.getAreaList()

    //1600*900    ----150%  
      if(window.screen.height<=600){
        //1440 900 ----150%
        if(window.screen.width==960){
          this.showHeight = 265;
        }else{
          this.showHeight = 265;
        }
        return;
      }
      //1360/1366   -----125%
      if(window.screen.height<=615){
        this.showHeight = 280;
        return;
      }
      //1600*1024    ----150%   
      if(window.screen.height<=683){
        this.showHeight = 333;
        return;
      }
      //1680*1050    ----150%  
      if(window.screen.height<=700){
        this.showHeight = 348;
        return;
      }
      //1920   ----150%    1600*900    ----125%  
      if(window.screen.height<=720){
        //1440 900  ----125%  
        if(window.screen.width==1152){
          this.showHeight = 366;
        }else{
          this.showHeight = 366;
        }
        return;
      }
      //1360   -----100% 1366 -----100%
      if(window.screen.height<=768){
        this.showHeight = 416;
        return;
      }
      //1600*1024    ----125%   
      if(window.screen.height<=820){
        this.showHeight = 467;
        return;
      }
      // 1680*1050     ----125%   
      if(window.screen.height<=840){
        this.showHeight = 487;
        return;
      }
      //1920  ---125%
      if(window.screen.height<=864){
        this.showHeight = 508;
        return;
      }
      // 1600*900    ----100%   
      if(window.screen.height<=900){
        // 1440*900    ----100%   
        if(window.screen.width==1440){
          this.showHeight = 545;
        }else{
          this.showHeight = 545;
        }
        return;
      }
      // 1600*1024    ----100%   
      if(window.screen.height<=1024){
        this.showHeight = 667;
        return;
      }
      // 1680*1050    ----100%   
      if(window.screen.height<=1050){
        this.showHeight = 694;
        return;
      }
      //1920     ----100%
      if(window.screen.height<=1080){
        return;
      }
    
  },
  activated () {
    this.getAreaList()
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab);
      if(tab.name=='second'){
        this.$refs.UwbCameraSectorList.refreshList()
      }else{
        this.getAreaList()
      }
    },
    //初始化防区多边形
    initPolygons(){
      this.cameraSectorListData.forEach(item=>{
        let points = this.getShowPoints(item.coordinateXlist,item.coordinateYlist)
        //let points = JSON.parse(item.polygonShowPoints)
        var polygon = new fabric.Polygon(points, {
          fill: 'rgba(1,1,1,0)',
          strokeWidth: 2,
          stroke: item.enableStatus=='0'?'red':'DimGray',
          scaleX: 1,
          scaleY: 1,
          objectCaching: false,
          transparentCorners: true,
          cornerColor: 'rgba(0,0,255,0.3)',
        });
        polygon.tempData = item
        //polygon.hasControls = polygon.hasBorders = false 
        let self = this
        // 删除按钮 (这么写用于去除默认的放大缩小和旋转)
        polygon.controls = polygon.points.reduce(function(acc, point, index) {
          acc['p' + index] =new fabric.Control({
            x: 0.5,
            y: -0.5,
            offsetY: -16,
            offsetX: -8,
            cursorStyle: 'pointer',
            mouseUpHandler: self.deleteObject,
            render: self.renderIcon(self.deleteImg),
            cornerSize: 28
          });
          return acc;
        }, { });
        // 编辑按钮
        polygon.controls.updateControl = new fabric.Control({
          x: 0.5,
          y: -0.5,
          offsetY: -16,
          offsetX: -40,
          cursorStyle: 'pointer',
          mouseUpHandler: this.updateObject,
          render: this.renderIcon(this.updateImg),
          cornerSize: 24
        });
        // polygon.selectable = false;// 禁止选中会造成所有按钮不显示，所以不可用
        // polygon.hasControls = polygon.hasBorders = false // 不允许放大缩小和旋转 会造成所有按钮不显示，所以不可用
        polygon.lockMovementX = true; // 不允许横向拖拽 
        polygon.lockMovementY  = true; // 不允许纵向拖拽 
        this.fabricObj.add(polygon)
        this.cameraSectorListtoDelete.push(polygon)// 用于初始化删除
        console.log('this.fabricObj',this.fabricObj)
      })
      this.fabricObj.renderAll();
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
    //加载电子围栏图标
    renderIcon(icon) {
      return function renderIcon(ctx, left, top, styleOverride, fabricObject) {
        var size = this.cornerSize;
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
        ctx.drawImage(icon, -size/2, -size/2, size, size);
        ctx.restore();
      }
    },
    //删除电子围栏
    deleteObject(eventData, target) {
      this.$confirm(`确定删除该防区吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: '/uwb/ips/uwbcamerasector/uwbCameraSector/delete',
          method: 'delete',
          params: {'ids': target.target.tempData.id}
        }).then(({data}) => {
          if (data && data.success) {
            this.$message.success(data.msg)
            this.refreshList()
          }
        })
      })
    },
    //保存拖拽电子围栏
    saveObject(saveObject, target) {
      let form = target.target.tempData;
      console.log('form',form)
      let mapData = this.mapValuetoData[this.valueMap]
      let xList = ''
      let yList = ''
      target.target.points.forEach(item=>{
        //按实际长宽比例存储坐标
        let x = this.updatePositionX(mapData.areaWidth,item.x)
        xList = xList==''?x:(xList+','+x)
        let y = this.updatePositionY(mapData.areaLength,item.y)
        yList = yList==''?y:(yList+','+y)
      })
      form.coordinateXlist = xList
      form.coordinateYlist = yList
      // form.polygonShowPoints = JSON.stringify(target.target.points) 暂时无用
      this.$http({
        url: `/uwb/ips/uwbcamerasector/uwbCameraSector/save`,
        method: 'post',
        data: form
      }).then(({data}) => {
        if (data && data.success) {
          this.$message.success(data.msg)
          this.refreshList()
        }
      })
    },
    //取消编辑电子围栏
    cancleObject(saveObject, target){
      this.refreshList()
    },
    //点击编辑电子围栏
    updateObject(eventData, target) {
      let self = this
      var poly = target.target;
      this.fabricObj.setActiveObject(poly);
      poly.edit = !poly.edit;
      if (poly.edit) {
        var lastControl = poly.points.length - 1;
        poly.cornerStyle = 'circle';
        poly.cornerColor = 'rgba(0,0,255,0.5)';
        poly.controls = poly.points.reduce(function(acc, point, index) {
          acc['p' + index] = new fabric.Control({
            positionHandler: self.polygonPositionHandler(),
            actionHandler: self.anchorWrapper(index > 0 ? index - 1 : lastControl, self.actionHandler),
            actionName: 'modifyPolygon',
            pointIndex: index
          });
          return acc;
        }, { });
        poly.controls.cancleControl = new fabric.Control({
          x: 0.5,
          y: -0.5,
          offsetY: -16,
          offsetX: -8,
          cursorStyle: 'pointer',
          mouseUpHandler: this.cancleObject,
          render: this.renderIcon(this.cancleImg),
          cornerSize: 28
        });
        poly.controls.saveControl = new fabric.Control({
          x: 0.5,
          y: -0.5,
          offsetY: -16,
          offsetX: -40,
          cursorStyle: 'pointer',
          mouseUpHandler: this.saveObject,
          render: this.renderIcon(this.saveImg),
          cornerSize: 27
        });
      } else {
        poly.cornerColor = 'blue';
        poly.cornerStyle = 'rect';
        poly.controls = fabric.Object.prototype.controls;
      }
      poly.hasBorders = !poly.edit;
      this.fabricObj.requestRenderAll();
    },
    //编辑多边形方法1
    polygonPositionHandler() {
      return function polygonPositionHandler(dim, finalMatrix, fabricObject)  {
        var x = (fabricObject.points[this.pointIndex].x - fabricObject.pathOffset.x),
            y = (fabricObject.points[this.pointIndex].y - fabricObject.pathOffset.y);
        return fabric.util.transformPoint(
          { x: x, y: y },
          fabric.util.multiplyTransformMatrices(
            fabricObject.canvas.viewportTransform,
            fabricObject.calcTransformMatrix()
          )
        );
      }
    },
    //编辑多边形方法2
    anchorWrapper(anchorIndex, fn) {
      return function(eventData, transform, x, y) {
        var fabricObject = transform.target,
            absolutePoint = fabric.util.transformPoint({
                x: (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x),
                y: (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y),
            }, fabricObject.calcTransformMatrix()),
            actionPerformed = fn(eventData, transform, x, y),
            newDim = fabricObject._setPositionDimensions({}),
            polygonBaseSize = fabricObject._getNonTransformedDimensions(),
            newX = (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) / polygonBaseSize.x,
            newY = (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) / polygonBaseSize.y;
        fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);
        return actionPerformed;
      }
    },
    //编辑多边形方法3
    actionHandler(eventData, transform, x, y) {
      var polygon = transform.target,
          currentControl = polygon.controls[polygon.__corner],
          mouseLocalPosition = polygon.toLocalPoint(new fabric.Point(x, y), 'center', 'center'),
          polygonBaseSize = polygon._getNonTransformedDimensions(),
          size = polygon._getTransformedDimensions(0, 0),
          finalPointPosition = {
            x: mouseLocalPosition.x * polygonBaseSize.x / size.x + polygon.pathOffset.x,
            y: mouseLocalPosition.y * polygonBaseSize.y / size.y + polygon.pathOffset.y
          };
      polygon.points[currentControl.pointIndex] = finalPointPosition;
      return true;
    },
    //刷新获取电子围栏数据并初始化所有多边形
    refreshList(){
      if(!this.deleteImg){
        this.deleteImg = document.createElement('img');
        this.deleteImg.src = require('@/assets/img/del.png')
      }
      if(!this.updateImg){
        this.updateImg = document.createElement('img');
        this.updateImg.src = require('@/assets/img/edit.png')
      }
      if(!this.saveImg){
        this.saveImg = document.createElement('img');
        this.saveImg.src = require('@/assets/img/done.png')
      }
      if(!this.cancleImg){
        this.cancleImg= document.createElement('img');
        this.cancleImg.src = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E"
      }
      
      if(!this.fabricObj){
        this.$nextTick(() => {
          this.fabricObj = new fabric.Canvas("mycanvas");
          this.fabricEvent();
        });
      }else{
        this.cameraSectorListtoDelete.forEach(item => {
          console.log('item',item)
          this.fabricObj.remove(item)
        })
        this.fabricObj.renderAll();
      }
      this.cameraSectorListtoDelete = []

      this.$http({
          url: '/uwb/ips/uwbcamerasector/uwbCameraSector/list',
          method: 'get',
          params: {
            'pageNo': 1,
            'pageSize': 50000,
            'orderBy': '',
            'areaId':this.valueMap,
          }
      }).then(({data}) => {
        console.log('uwbCameraSectorList',data.page.list)
        if (data && data.success) {
          this.cameraSectorListData = data.page.list
          this.initPolygons()
        }
      })
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
    //     url: '/uwb/ips/uwbarea/uwbArea/list',
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
      if(mapData.pixelLength>=mapData.pixelWidth){
        this.mapStyle=`background-image:url(${mapData.map2d});
        background-repeat:no-repeat;
        background-size:auto 100%;width:${width}px;height:${this.showHeight}px;`
      }else{
        this.mapStyle=`background-image:url(${mapData.map2d});
        background-repeat:no-repeat;
        background-size:100% auto;width:${width}px;height:${this.showHeight}px;`
      } 
      //切换地图-重新初始化绘制图层大小
      if(this.fabricObj){
        this.fabricObj.setHeight(this.areaLengthPx);
        this.fabricObj.setWidth(this.areaWidthPx);
      }
      //刷新数据
      this.refreshList()
    },
    //绘制多边形方法
    start() {
      if (this.drawingObject.type == "roof") {
        this.fontValue = '添加防区'
        this.icon = 'el-icon-plus'
        this.polygonEdit(true);
        this.drawingObject.type = "";
        this.lines.forEach(function(value, index, ar) {
          this.fabricObj.remove(value);
        });
        if(this.roofPoints.count!=0){
          this.makeRoof();
        }
        if(this.roof){
          this.fabricObj.add(this.roof);
          this.fabricObj.renderAll();
        }
      } else {
        this.fontValue = '绘制中……'
        this.icon = 'el-icon-edit'
        this.drawingObject.type = "roof"; // roof type
        //所有围栏停止编辑拖动
        this.polygonEdit(false);
      }
    },
    polygonEdit(flag){
      // let count = this.cameraSectorListData.count
      // for(var i=0;i<count;i++){
      //   console.log('polygonEdit',i,flag)
      //   this.fabricObj.item(i).selectable = flag;
      // }
    },
    fabricEvent() {
      this.fabricObj.on({
        "mouse:down": e => {
          if (this.drawingObject.type == "roof") {
            this.fabricObj.selection = false;
            this.mouseFrom.x = e.pointer.x;
            this.mouseFrom.y = e.pointer.y
            let a = {}
              a["x"] = this.mouseFrom.x;
              a["y"] = this.mouseFrom.y;
            this.roofPoints.push(a);
            var points = [a.x, a.y, a.x, a.y];
            this.lines.push(
              new fabric.Line(points, {
                strokeWidth: 3,
                selectable: false,
                stroke: "red"
              })
            );
            this.fabricObj.add(this.lines[this.lineCounter]);
            this.lineCounter++;
          }
        },
        "mouse:move": e => {
          if (
            this.lines[0] !== null &&
            this.lines[0] !== undefined &&
            this.drawingObject.type == "roof"
          ) {
            this.x = e.pointer.x;
            this.y = e.pointer.y;
            this.lines[this.lineCounter - 1].set({
              x2: this.x,
              y2: this.y
            });
            this.fabricObj.renderAll();
          }
        },
        "mouse:dblclick": e => {
          this.lines.forEach(item => this.fabricObj.remove(item));
          this.makeRoof();
          console.log('this.roof',this.roof)
          // console.log('this.roofPoints',this.roofPoints)
          // console.log('this.fabricObj',this.fabricObj)
          this.fabricObj.add(this.roof);
          this.fabricObj.renderAll();

          //console.log("double click");
          //clear arrays
          let mapData = this.mapValuetoData[this.valueMap]
          let xList = ''
          let yList = ''
          this.roofPoints.forEach(item=>{
            //按实际长宽比例存储坐标
            let x = this.updatePositionX(mapData.areaWidth,item.x)
            xList = xList==''?x:(xList+','+x)
            let y = this.updatePositionY(mapData.areaLength,item.y)
            yList = yList==''?y:(yList+','+y)
          })

          this.cameraSectorListtoDelete.push(this.roof)// 用于初始化删除

          //绘制完自动取消绘制
          this.$refs.UwbCameraSectorForm.initData(this.valueMap,xList,yList,this.roofPoints)

          this.roofPoints = [];
          this.lines = [];
          this.lineCounter = 0;

          this.start()
          

        }
      });
    },
    updatePositionX(areaWidth,x){
      let realX = x*areaWidth/this.areaWidthPx/1000
      return realX
    },
    updatePositionY(areaLength,y){
      let realY = y*areaLength/this.areaLengthPx/1000
      return realY
    },
    makeRoof() {
      let left = this.findLeftPaddingForRoof(this.roofPoints);
      let top = this.findTopPaddingForRoof(this.roofPoints);
      let a = {}

      a["x"] = this.roofPoints[0].x;
      a["y"] = this.roofPoints[0].y;
      this.roofPoints.push(a);
      this.roof = new fabric.Polyline(this.roofPoints, {
        fill: "rgba(0,0,0,0)",
        strokeWidth:2,
        stroke: "red",
        left:left,
        top:top
      });
       
    },
    findTopPaddingForRoof(roofPoints) {
      var result = 999999;
      for (var f = 0; f < this.lineCounter; f++) {
        if (roofPoints[f].y < result) {
          result = roofPoints[f].y;
        }
      }
      return Math.abs(result);
    },
    findLeftPaddingForRoof(roofPoints) {
      var result = 999999;
      for (var i = 0; i < this.lineCounter; i++) {
        if (roofPoints[i].x < result) {
          result = roofPoints[i].x;
        }
      }
      return Math.abs(result);
    },
    //添加防区
    addFence(){
      this.start()
    }
  },
  beforeDestroy () {
    
  }
})
</script>


<style lang="scss">
.UwbCameraSectorClass{
  // .el-tabs__content{
  //   //background:#f1f9fb;
  // }
  .el-tabs__nav{
    margin-left: 20px;
  }
}
</style>
<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';
.dateStyle{
  width: 100%;
  height: 43px;
  //border-bottom: 2px #e5e5e5 solid;
  display:flex;
  flex-direction: row;
}

.fontStyle{
  font-size: 14px;
  font-family: Microsoft YaHei Regular, Microsoft YaHei Regular-Regular;
  font-weight: 400;
  text-align: left;
  color: #666666;
  margin-top:5px;
}


.map-chart {
  text-align: center;
  margin-top:10px;
  margin-bottom: 10px;
  display:flex;
  justify-content: center;

  .pictureClass{
    height: 100%;
    margin:0 auto;
    position: absolute;
    //background: url(../../../../public/img/office.png) no-repeat;
    // background-size:auto 700px;
  }
}


</style>
