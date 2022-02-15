<template>
  <div>
    <basic-container>
      <el-row :gutter="15" style="margin-bottom:20px">
        <el-col :span="5">
          <span>园区：</span>
          <el-select v-model="campusNow" placeholder="请选择" @change="changeCampus">
            <el-option style="width:80%" 
              v-for="item in campusList"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <span>机房：</span>
          <el-cascader 
            ref="siteChoose"
            :options="condition" 
            style="width:80%" 
            v-model="address"
            filterable 
            @change="changeAddress"
            :props="{value: 'code', label: 'name', children: 'children'}"
          >
          </el-cascader>
        </el-col>
        <!-- <el-col :span="6">
          <span>区域：</span>
          <el-cascader 
            ref="siteChoose"
            :options="condition" 
            style="width:80%" 
            v-model="address"
            filterable 
            @change="changeAddress"
            :props="{value: 'code', label: 'name', children: 'children'}"
          >
          </el-cascader>
        </el-col> -->
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-refresh" size="small" @click="refreshData">刷新</el-button>
          <el-button v-show="showAllDeviceMsg!=''" type="primary" icon="el-icon-view" size="small" @click="showDeviceChange">{{ showAllDeviceMsg }}</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="15" style="height:730px;">
        <iframe id="iframe3DDevice" ref="iframe3DDevice" name="iframe3DDevice" :src="url3D" style="width:100%;height:100%;" frameborder="0"></iframe>
      </el-row>
    </basic-container>
  </div>
</template>

<script>
import deviceImg from "@/components/DrawCanvas/deviceImg";
import { sdcSiteAction} from "@/api/sdc/addressInfo";
import { modifyData } from "@/util/domainFilter";
import { getSdcDeviceList,sdcDeviceAction } from "@/api/sdc/deviceInfo";
import { getSystemList } from "@/api/sdc/deviceType"

export default {
  name: "RoomList",
  components: {
    deviceImg
  },
  data() {
    return {
      url3D:'',
      showAllDeviceMsg:'',
      img: null,
      roomLeft: null,
      roomTop: null,
      condition: [],
      deviceInfo: {},
      deviceData: [],
      deviceKey: (new Date()).toString(),
      address: null,
      sysTypeMap: [],
      isDraggable: true,
      ifame3D:null,
      roomId:0,
      //当前园区
      campusNow:'',
      campusList:[],
      tempList:[]
    };
  },
  created() {
    this.getSystemList()
    this.init()
  },
  mounted(){
    let tempUrl = this.$dictUtils.getDictList('url_param_3D')
    let url_3D_List = tempUrl.filter(function(item,index,arr0){
        return item.label=="3D_url";
    });
    if(url_3D_List.length>0){
      this.url3D = url_3D_List[0].value
    }

    this.ifame3D = this.$refs['iframe3DDevice'].contentWindow;
    console.log('this.url3D',this.url3D)
  },
  methods: { 
    //设备展示隐藏修改
    showDeviceChange(){
      if(this.showAllDeviceMsg == '仅显示未确定位置设备'){
        this.ifame3D.postMessage(
        {
          type:'showAllDevice',
          data:false,
        },'*')
        this.showAllDeviceMsg = '显示全部设备'
      }
      else{
        this.ifame3D.postMessage(
        {
          type:'showAllDevice',
          data:true,
        },'*')
        this.showAllDeviceMsg = '仅显示未确定位置设备'
      }
    },
    //刷新当前楼层数据
    refreshData(){
      this.showAllDeviceMsg = '仅显示未确定位置设备'
      if(this.roomId!=0){
        this.ifame3D.postMessage(
        {
          type:'changeLevel',
          data:this.roomId,
          positionType:this.tempList[this.roomId].type,
          id:this.tempList[this.roomId].id//停车场查车位需要
        },'*')
      }
    },
    postToken(){
      console.log('this.ifame3D',this.ifame3D,this.url3D)
      let tempUrl = this.$dictUtils.getDictList('url_param_3D')
      let server_3D_List = tempUrl.filter(function(item,index,arr0){
          return item.label=="server_url";
      });
      if(!this.url3D){
        let url_3D_List = tempUrl.filter(function(item,index,arr0){
            return item.label=="3D_url";
        });
        if(url_3D_List.length>0){
          this.url3D = url_3D_List[0].value
        }
      }
      console.log('server_3D_List',server_3D_List[0].value)
      let tokenForm = sessionStorage.getItem('dcplat-access_token')
      let token = JSON.parse(tokenForm)
      setTimeout(() => {
          this.ifame3D.postMessage(
          {
            type:'token',
            data:token.content,
            isAdd:true,
            serverUrl:server_3D_List[0].value
          },'*')
          window.addEventListener('message', this.init3DListenerDevice)
      }, 5000)
    },
    async init3DListenerDevice(e){
      if(e.data.type=='messageShow'){
        this.$message({
          showClose: true,
          message: e.data.content,
          type: e.data.contentType
        });
      }
    },
    async getSystemList() {
      let sysList = await getSystemList()
      sysList.data.data.forEach((el) => {
        this.sysTypeMap.push({
          value: (el.value).toString(),
          label: el.description,
        })
      })
    }, 
    //初始化获取数据
    async init() {
      //获取初始区域查询条件数据
      let data = await sdcSiteAction('','/tree','get')
      this.campusList = modifyData(data.data.data) 
      this.campusNow = this.campusList[0].code
      this.ifame3D.postMessage(
      {
        type:'changeCampus',
        data:this.campusNow
      },'*')
      this.campusList.forEach(element => {
        if(element.code==this.campusNow){
          this.condition = element.children
        }
      });
      this.tempList = []
      this.transList(this.condition)
    },
    //位置结构转换，由于区分当前选中位置是什么类型
    transList(inList){
      inList.forEach(item=>{
        this.tempList[item.code] = item
        if(item.children){
          this.transList(item.children)
        }
      })
    },
    //修改园区场景
    changeCampus(){
      //机房下拉框数据进行修改
      this.campusList.forEach(element => {
        if(element.code==this.campusNow){
          this.condition = element.children
        }
      });
      this.tempList = []
      this.transList(this.condition)
      this.address = null
      //园区场景进行切换
      this.ifame3D.postMessage(
      {
        type:'changeCampus',
        data:this.campusNow
      },'*')
    },
    chooseDevice(flag) {
      this.deviceData = []
      this.deviceKey = (new Date()).toString()
      
      if(flag === '0') {
        //显示全部
        this.deviceData = this.deviceInfo
      }else if(flag === '9') {
        //重置清空
        this.deviceData = this.deviceInfo = []
        this.img = null
        this.address = null 
      }else {
        //点击显示对应系统设备图标
        this.deviceInfo.forEach(el => {
          if(el.typeType === flag) {
            this.deviceData.push(el)
          }
        })
      }
    },
    changePos(data) {
      this.deviceData.forEach(el => {
        if(el.id === data.id){
          el.x += data.x
          el.y += data.y
          sdcDeviceAction(el, "", "put");
          return
        }
      })
    },
    async changeAddress(val) {
      //清空界面
      if(val.length === 0) {
        this.deviceData = this.deviceInfo = []
        this.img = null
        this.address = null 
      } else {
        this.roomId = val[val.length - 1]
        this.showAllDeviceMsg = '仅显示未确定位置设备'
        this.ifame3D.postMessage(
        {
          type:'changeLevel',
          data: this.roomId,
          positionType:this.tempList[this.roomId].type,
          id:this.tempList[this.roomId].id//停车场查车位需要
        },'*')

        // //获取房间图片信息
        // let siteData = await sdcSiteAction('','/'+ val[val.length - 1],'get')
        // this.img = siteData.data.data.siteImg
        // //获取房间设备信息
        // let queryData = await getSdcDeviceList(1,100,val[val.length - 1])
        // console.log(queryData)
        // //deviceInfo作为缓存比对数据
        // this.deviceInfo = this.deviceData = queryData.data.data.records
      }
     // this.deviceKey = new Date().toString()
    }
  },
};
</script>

<style>
.room-btn {
  float: right;
  margin: 10px;
}
</style>