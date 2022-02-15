<template>
  <div>
    <basic-container>
      <el-row :gutter="15" style="margin-bottom:20px">
        <el-col :span="6">
          <span>区域：</span>
          <el-cascader 
            ref="siteChoose"
            :options="condition" 
            style="width:80%" 
            v-model="address"
            clearable
            filterable 
            @change="changeAddress"
            :props="{checkStrictly: true, expandTrigger: 'hover', value: 'id', label: 'name', children: 'children'}"
          >
          </el-cascader>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="15">
          <el-row :gutter="15" style="margin-bottom:20px">
            <el-col :span="24">
              <!-- 园区01/A栋/一楼/201房间 -->
              <el-button type="primary" size="small" style="margin-left:20px" @click="chooseDevice('0')">全部</el-button>
              <template v-for="item in sysTypeMap">
                <el-button size="small" :key="item.value" @click="chooseDevice(item.value)">{{item.label}} </el-button>
              </template>
              <el-button type="primary" size="small" @click="chooseDevice('9')">重置</el-button>
            </el-col>
          </el-row>
          <div id="canvas" style="position:relative">
            <img ref="roomImg" :src="img" style="width: 100%;" v-if="img"/>
            <template v-for="(item,index) in deviceData">
              <deviceImg 
                :key="deviceKey+index" 
                :deviceData="item" 
                :width="80" 
                :height="80" 
                :id="index" 
                :imgurl="item.devImg" 
                :roomLeft="roomLeft"
                :roomTop="roomTop"
                :isDraggable="isDraggable"
                @changePos="changePos"
              ></deviceImg>
            </template>
          </div>
        </el-col>
        <el-col :span="9">
          <el-row :gutter="15" style="margin-bottom:20px">
            设备列表
          </el-row>
          <el-table 
            :data="deviceData" 
            style="width: 100%;margin: 20px 0;"
            border
          >
            <el-table-column
              type="index"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="name"
              label="设备名称"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="code"
              label="设备序列号"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="typeName"
              label="产品类型"
              align="center"
            ></el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </basic-container>
  </div>
</template>

<script>
import deviceImg from "@/components/DrawCanvas/deviceImg";
import { sdcSiteAction} from "@/api/sdc/addressInfo";
import { modifyData } from "@/util/domainFilter";
import { getSdcDeviceList,sdcDeviceAction,getSdcTableBy } from "@/api/sdc/deviceInfo";
import { getSystemList } from "@/api/sdc/deviceType"

export default {
  name: "RoomList",
  components: {
    deviceImg
  },
  data() {
    return {
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
    };
  },
  created() {
    this.getSystemList()
    this.init()
  },
  methods: { 
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
      this.condition = modifyData(data.data.data) 
      // let positionInfo = this.$refs.roomImg.getBoundingClientRect()
      // console.log(positionInfo);
      // this.roomLeft = positionInfo.left
      // this.roomTop =positionInfo.top
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
      console.log(val,'val');
      //清空界面
      if(val.length === 0) {
        this.deviceData = this.deviceInfo = []
        this.img = null
        this.address = null 
      } else {
        if(val.length === 1) {
          let devData = await getSdcTableBy({
            current: 1,
            size: 200,
            topTypeCode: "light",
          })
          this.deviceInfo = this.deviceData = devData.data.data.records
        }
        else {
          //获取房间设备信息
          let queryData = await getSdcDeviceList(1,10000,val[val.length - 1])
          //deviceInfo作为缓存比对数据
          this.deviceInfo = this.deviceData = queryData.data.data.records
        }
        //获取房间图片信息
        let siteData = await sdcSiteAction('','/'+ val[val.length - 1],'get')
        this.img = siteData.data.data.siteImg
        
      }
      this.deviceKey = new Date().toString()
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