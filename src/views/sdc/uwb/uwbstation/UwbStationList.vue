<template>
<basic-container>
  <div class="mainClass">
    <div class="leftClass" :style="'width:'+showHeight+'px;'">
      <div class="topClass">
        <!-- <el-select size="small" v-model="valueMap" placeholder="请选择" @change="changeMap">
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
              :props="{ value: 'id', label: 'name', children: 'children' }"
            >
        </el-cascader>
        <el-button type="primary" icon="el-icon-plus" size="small" style="margin-left:10px;" @click="add()">添加基站</el-button>
        <el-button type="primary" icon="el-icon-check" size="small" style="margin-left:10px;" @click="save()">保存定位</el-button>
      </div>
      <div class="bottomClass" :style="'height:'+showHeight+'px;width:'+showHeight+'px;'">
        <div class="pictureClass" :style="mapStyle" id="tempDiv" >        
           <div v-for="(item, index) in dataList" :key="index" :id="'cover'+item.id" :class="item.onlineStatus=='1'?'nodeClassOffline':'nodeClass'" 
           :style="'left:'+(item.coordinateX*1000/mapValuetoData[valueMap].areaWidth*areaWidthPx)+'px;top:'+(item.coordinateY*1000/mapValuetoData[valueMap].areaLength*areaLengthPx)+'px;'">
             <div style="width: 100px; margin-left: -35px; margin-top: 32px; text-align: center;">{{item.stationName}}</div>
           </div>
        </div>
      </div>
    </div>
    <div class="rightClass" :style="'width:calc(100% - '+showHeight+'px);'">
        <el-table
        :data="dataList"
        border
        size="medium"
        @selection-change="selectionChangeHandle"
        @sort-change="sortChangeHandle"
        v-loading="loading"
        class="table" :style="'height:'+showHeight+'px;'"> >
        <!-- :height="showHeight" -->
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50">
        </el-table-column>
      <el-table-column
          prop="stationNo"
          show-overflow-tooltip
          sortable="custom"
          label="编号">
        </el-table-column>
      <el-table-column
          prop="stationName"
          show-overflow-tooltip
          sortable="custom"
          label="名称">
        </el-table-column>
      <!-- <el-table-column
          prop="mac"
          show-overflow-tooltip
          label="mac地址">
        </el-table-column> -->
        <el-table-column
          prop="onlineStatus"
          show-overflow-tooltip
          sortable="custom"
          label="在线状态">
          <template slot-scope="scope">
                {{ $dictUtils.getDictLabel("device_status", scope.row.onlineStatus, '-') }}
          </template>
        </el-table-column>
      <!-- <el-table-column
          prop="areaName"
          show-overflow-tooltip
          sortable="custom"
          label="所在区域">
        </el-table-column> -->
      <el-table-column
          prop="coordinateX"
          show-overflow-tooltip
          sortable="custom"
          label="坐标">
          <template slot-scope="scope">
            ({{ scope.row.coordinateX }},{{ scope.row.coordinateY }})
          </template>
        </el-table-column>
      <!-- <el-table-column
          prop="coordinateY"
          show-overflow-tooltip
          sortable="custom"
          label="y坐标">
        </el-table-column>
      <el-table-column
          prop="coordinateZ"
          show-overflow-tooltip
          sortable="custom"
          label="z坐标">
        </el-table-column> -->
      <!-- 
      <el-table-column
          prop="enableStatus"
          show-overflow-tooltip
          sortable="custom"
          label="启用状态">
          <template slot-scope="scope">
                {{ $dictUtils.getDictLabel("enable_status", scope.row.enableStatus, '-') }}
          </template>
        </el-table-column> 
      <el-table-column
          prop="remarks"
          show-overflow-tooltip
          sortable="custom"
          label="备注信息">
        </el-table-column>-->
        <el-table-column
          header-align="center"
          align="center"
          fixed="right"
          width="150"
          label="操作">
          <template  slot-scope="scope">
            <!-- <el-button v-if="hasPermission('ips:uwbstation:uwbStation:view')" type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button> -->
            <el-button  type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>
            <el-button  type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">解绑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageNo"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination> -->
    </div>
     <!-- 弹窗, 新增 / 修改 -->
    <UwbStationForm ref="uwbStationForm" @refreshDataList="refreshList"></UwbStationForm>
    <el-dialog title="添加基站" :visible.sync="addDialogTableVisible">
      <el-table :data="gridStationData" @selection-change="handleSelectionChangeStation">
         <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column property="stationNo" label="编号" width="150"></el-table-column>
        <el-table-column property="stationName" label="名称" width="200"></el-table-column>
        <el-table-column property="remarks" label="备注"></el-table-column>
      </el-table>
       <span slot="footer" class="dialog-footer">
      <el-button @click="addDialogTableVisible = false">取 消</el-button>
      <el-button type="primary" @click="addStationFun()">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</basic-container>
</template>

<script>
  import UwbStationForm from './UwbStationForm'
  import $ from 'jquery';
  import { modifyData } from "@/util/domainFilter";
  import { sdcSiteAction } from "@/api/sdc/addressInfo";
  export default {
    data () {
      return {
        //添加基站页面展示
        addDialogTableVisible:false,
        searchForm: {
          stationName: '',
          stationNo: ''
        },
        dataList: [],
        pageNo: 1,
        pageSize: 10,
        total: 0,
        orderBy: '',
        dataListSelections: [],
        isSearchCollapse: false,
        isImportCollapse: false,
        loading: false,
        optionsMap: [],
        valueMap: '',
        mapValuetoData:new Array(),
        showHeight:775,
        mapStyle:'',
        divStyle: '',
        idTomove:new Array(),
        areaWidthPx:0,
        areaLengthPx:0,
        //是否更改基站坐标
        changePosition:false,
        gridStationData: [],
        addStationData:[]
      }
    },
    components: {
      UwbStationForm
    },
    activated () {
      //this.refreshList()
    },
    mounted(){
      this.getAreaList()
      console.log('window.innerHeight',window.screen.height)
      console.log('window.width',window.screen.width)
      
          //1600*900    ----150%  
      if(window.screen.height<=600){
        //1440 900 ----150%
        if(window.screen.width==960){
          this.showHeight=325
        }else{
          this.showHeight=325
        }
        return;
      }
      //1360/1366   -----125%
      if(window.screen.height<=615){
        this.showHeight=315
        return;
      }
      //1600*1024    ----150%   
      if(window.screen.height<=683){
        this.showHeight=385
        return;
      }
      //1680*1050    ----150%  
      if(window.screen.height<=700){
        this.showHeight=405
        return;
      }
      //1920   ----150%    1600*900    ----125%  
      if(window.screen.height<=720){
        //1440 900  ----125%  
        if(window.screen.width==1152){
          this.showHeight=435
        }else{
          this.showHeight=435
        }
        return;
      }
      //1360   -----100% 1366 -----100%
      if(window.screen.height<=768){
        this.showHeight=465
        return;
      }
      //1600*1024    ----125%   
      if(window.screen.height<=820){
        this.showHeight=515
        return;
      }
      // 1680*1050     ----125%   
      if(window.screen.height<=840){
        this.showHeight=545
        return;
      }
      //1920  ---125%
      if(window.screen.height<=864){
        this.showHeight=575
        return;
      }
      // 1600*900    ----100%   
      if(window.screen.height<=900){
        // 1440*900    ----100%   
        if(window.screen.width==1440){
          this.showHeight=605
        }else{
          this.showHeight=605
        }
        return;
      }
      // 1600*1024    ----100%   
      if(window.screen.height<=1024){
        this.showHeight=735
        return;
      }
      // 1680*1050    ----100%   
      if(window.screen.height<=1050){
        this.showHeight=745
        return;
      }
      //1920     ----100%
      if(window.screen.height<=1080){
        return;
      }
    },
    methods: {
      //保存定位数据
      save(){
        //
        this.$http({
          url: '/uwb/ips/uwbstation/uwbStation/batchSave',
          method: 'post',
          data: {
            'uwbStationList': this.dataList,
          }
        }).then(({data}) => {
          if (data && data.success) {
            this.changePosition = false
            this.refreshList()
          } else {
            this.$message({
              showClose: true,
              message: '保存位置失败',
              type: 'error'
            });
          }
        })

      },
      initEvent(){
        let that = this
        //console.log('this.dataList',this.dataList)
        this.dataList.forEach(item=>{
          var divObj=document.getElementById('cover'+item.id);
          //console.log('divObj',divObj)
          that.idTomove[item.id] = false;
          divObj.onmousedown=function(e){
            that.idTomove[item.id]=true;
            var clickEvent=window.event||e;
            var mwidth=clickEvent.clientX-divObj.offsetLeft;
            var mheight=clickEvent.clientY-divObj.offsetTop;
            document.onmousemove=function(e){
                var moveEvent=window.event||e;
                if(that.idTomove[item.id]){
                    divObj.style.left=moveEvent.clientX-mwidth+"px";
                    divObj.style.top=moveEvent.clientY-mheight+"px";
                    //console.log(divObj.style.left,divObj.style.top)
                    divObj.onmouseup=function(){
                      that.idTomove[item.id]=false;
                      that.updatePosition(item.id,moveEvent.clientX-mwidth,moveEvent.clientY-mheight)
                    }
                }
            }
          };
        })
      },    
      //更改坐标位置
      updatePosition(id,x,y){
        this.changePosition = true
        let mapData = this.mapValuetoData[this.valueMap]
        //按实际长宽比例存储坐标
        let areaLength = mapData.areaLength//y
        let areaWidth = mapData.areaWidth//x
        let realX = x*areaWidth/this.areaWidthPx/1000
        let realY = y*areaLength/this.areaLengthPx/1000
        this.dataList.forEach(item=>{
          if(item.id ==id ){
            item.coordinateX = realX
            item.coordinateY = realY
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
      //修改地图，初始化下面地图
      changeMap(val){        
        this.valueMap = val[val.length - 1];    
        this.refreshList()
        let mapData = this.mapValuetoData[this.valueMap]
        //高度大于宽度
        if(mapData.pixelLength == null || mapData.pixelLength == 0 || mapData.pixelWidth == null || mapData.pixelWidth == 0){
          this.$message("请通过【工程管理】对此位置设置正确得平面图像素！")
          return;
        }
        if(mapData.map2d == null || mapData.map2d == ""){
          this.$message("请通过【工程管理】上传平面图！")
          return;
        }
        if(mapData.pixelLength<=mapData.pixelWidth){
          let scale = this.showHeight/mapData.pixelLength
          debugger
          let width = scale*mapData.pixelWidth
          this.areaWidthPx = width
          this.areaLengthPx = this.showHeight
          this.mapStyle=`background-image:url(${mapData.map2d});
          background-repeat:no-repeat;
          background-size:auto 100%;width:${width}px;height:${this.showHeight}px;`
        }else{
          let scale = this.showHeight/mapData.pixelWidth
          let height = scale*mapData.pixelLength
          this.areaWidthPx = this.showHeight
          this.areaLengthPx = height
          this.mapStyle=`background-image:url(${mapData.map2d});
          background-repeat:no-repeat;
          background-size:100% auto;width:${this.showHeight}px;height:${height}px;`
        }
        console.info(this.mapStyle)
      },
      // 获取基站数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/uwb/ips/uwbstation/uwbStation/list',
          method: 'get',
          params: {
            'pageNo': 1,//this.pageNo,
            'pageSize': 50000,//this.pageSize,
            'orderBy': this.orderBy,
            'areaId':this.valueMap,
            ...this.searchForm
          }
        }).then(({data}) => {
          if (data && data.success) {
            this.dataList = data.page.list
            this.total = data.page.count
            this.loading = false
            //初始化每个基站移动事件
            this.$nextTick(() => {
              this.initEvent()
            })
          }
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageNo = 1
        this.refreshList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageNo = val
        this.refreshList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },

      // 排序
      sortChangeHandle (obj) {
        if (obj.order === 'ascending') {
          this.orderBy = obj.prop + ' asc'
        } else if (obj.order === 'descending') {
          this.orderBy = obj.prop + ' desc'
        } else {
          this.orderBy = ''
        }
        this.refreshList()
      },
      // 新增
      add () {
        if(this.changePosition){
          this.$confirm('检测基站位置变更，是否保存位置信息的变更？', '确认信息', {
            distinguishCancelAndClose: true,
            confirmButtonText: '保存',
            cancelButtonText: '放弃修改'
          })
          .then(() => {
            this.save()
            this.addForm()
           // this.$refs.uwbStationForm.init('add', '')
          })
          .catch(action => {
            if(action === 'cancel'){
              //放弃保存
              this.changePosition = false
              this.refreshList()
              this.addForm()
              //this.$refs.uwbStationForm.init('add', '')
            }else{
              //关闭弹出窗
            }
          });
        }else{
          this.addForm()
          //this.$refs.uwbStationForm.init('add', '')
        }
      },
      //展示未绑定地图基站
      addForm(){
        this.addStationData = []
        this.addDialogTableVisible = true
        //获取没有绑定地图的基站列表数据
        let that = this
        this.$http({
          url: '/uwb/ips/uwbstation/uwbStation/findUnBindAreaList',
          method: 'get',
        }).then(({data}) => {
          //console.log('获取未绑定基站数据',data)
          if (data && data.success){
            if(data.unBindAreaList){
              that.gridStationData = data.unBindAreaList
            }
          }else{
             that.$message({
              showClose: true,
              message: '获取未绑定基站数据失败',
              type: 'error'
            });
          }
        })
      },
      //地图添加基站
      addStationFun(){
        this.addDialogTableVisible = false
        //this.addStationData
        let ids = this.addStationData.map(item => {
          return item.id
        }).join(',')
        this.request({
          url: '/uwb/ips/uwbstation/uwbStation/bindArea',
          method: 'post',
          params: {
            'areaId': this.valueMap,
            'ids':ids
          }
        }).then(({data}) => {
          if (data && data.success) {
            this.refreshList()
          } else {
            this.$message({
              showClose: true,
              message: '添加基站成功',
              type: 'error'
            });
          }
        })
      },
      handleSelectionChangeStation(val){
        this.addStationData = val;
      },
      // 修改
      edit (id) {
        if(this.changePosition){
          this.$confirm('检测基站位置变更，是否保存位置信息的变更？', '确认信息', {
            distinguishCancelAndClose: true,
            confirmButtonText: '保存',
            cancelButtonText: '放弃修改'
          })
          .then(() => {
            this.save()
            id = id || this.dataListSelections.map(item => {
              return item.id
            })[0]
            this.$refs.uwbStationForm.init('edit', id)
          })
          .catch(action => {
            if(action === 'cancel'){
              //放弃修改
              this.changePosition = false
              this.refreshList()

              id = id || this.dataListSelections.map(item => {
                return item.id
              })[0]
              this.$refs.uwbStationForm.init('edit', id)
            }else{
              //关闭弹出窗
            }
          });
        }else{
          id = id || this.dataListSelections.map(item => {
            return item.id
          })[0]
          this.$refs.uwbStationForm.init('edit', id)
        }
        
      },
      // 查看
      view (id) {
        this.$refs.uwbStationForm.init('view', id)
      },
      // 删除
      del(id){
        if(this.changePosition){
          this.$confirm('检测基站位置变更，是否保存位置信息的变更？', '确认信息', {
            distinguishCancelAndClose: true,
            confirmButtonText: '保存',
            cancelButtonText: '放弃修改'
          })
          .then(() => {
            this.save()
            this.delFun(id)
          })
          .catch(action => {
            if(action === 'cancel'){
              //放弃保存
              this.changePosition = false
              this.refreshList()
              this.delFun(id)
            }else{
              //关闭弹出窗
            }
          });
        }else{
          this.delFun(id)
        }
      },
      //基站解绑地图
      delFun (id) {
        let ids = id || this.dataListSelections.map(item => {
          return item.id
        }).join(',')
        this.$confirm(`确定解绑所选基站吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.$http({
            url: '/uwb/ips/uwbstation/uwbStation/unBindArea',
            method: 'post',
            params: {'id': ids}
          }).then(({data}) => {
            if (data && data.success) {
              this.$message.success(data.msg)
              this.refreshList()
            }
            this.loading = false
          })
        })
      },
      // 导入成功
      uploadSuccess (res, file) {
        if (res.success) {
          this.$message.success({dangerouslyUseHTMLString: true,
            message: res.msg})
        } else {
          this.$message.error(res.msg)
        }
      },
      // 下载模板
      downloadTpl () {
        this.$utils.download('/uwb/ips/uwbstation/uwbStation/import/template')
      },
      exportExcel () {
        let params = {
          ...this.searchForm
        }
        this.$utils.download('/uwb/ips/uwbstation/uwbStation/export', params)
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>
<style lang="scss" scoped>
.mainClass{
  height: 100%;
  width:100%;
  display:flex;
  flex-direction: row;
}
.fontClass{
  font-size: 16px;
  font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;
  font-weight: 200;
  color: #656565;
}
.leftClass{
  height:100%;
  //width:60%;
  //background-color: pink;

  .topClass{
    height: 10%;
    width: 100%;
    display:flex;
    flex-direction: row;
    align-items: center;
  }

  .bottomClass{
    height: 90%;
    width: 100%;
    display:flex;
    align-items: center;

    .pictureClass{
      height: 100%;
      margin:0 auto;
      border:1px red solid;
      position:absolute;
      //background: url(../../../../../public/img/office.png) no-repeat;
      // background-size:auto 700px;

      //在线样式
      .nodeClass{
        height:33px;
        width:33px;
        //background:red;
        position:absolute;
        background: url(~@/assets/img/node.png) no-repeat;
        background-size:auto 33px;
        cursor: pointer;
      }
      //离线样式
      .nodeClassOffline{
        height:33px;
        width:33px;
        //background:red;
        position:absolute;
        background: url(~@/assets/img/nodeOffLine.png) no-repeat;
        background-size:auto 33px;
        cursor: pointer;
      }
    }
  }
}
.rightClass{
  height:100%;
  //width:40%;
}
</style>