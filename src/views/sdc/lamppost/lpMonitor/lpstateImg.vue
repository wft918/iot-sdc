<template>
  <div>
    <el-row :gutter="15">
        <el-col :span="8">
          <span>所属园区：</span>
          <el-cascader 
            ref="areaMsg"
            :options="condition" 
            style="width:80%" 
            v-model="address"
            :props="{ checkStrictly: true, value: 'id', label: 'name', children: 'children' }"
            clearable
            filterable
            @change="changeAddress"
          ></el-cascader>
        </el-col>
        <el-col :span="12">
          <!-- <span>灯杆编号：</span>
          <el-select v-model="parkingName" style="width:25%">
            <el-option
              v-for="item in parkingMap"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select> -->
        </el-col>
        <el-col :span="4">
            <div class="query-btn-group">
            <el-button type="primary" @click="queryInfo">
              <i class="el-icon-search"></i> 查询
            </el-button>
            <el-button type="primary" @click="clearCondition">
              <i class="el-icon-delete"></i> 清空
            </el-button>
          </div>
        </el-col>
        <el-col :span="24">
            <span>园区灯杆总览</span>
            <div id="canvas" style="position:relative">
              <img ref="roomImg" :src="plateImg" style="width: 100%;height:auto"/>
              <template v-for="(item,index) in deviceInfo">
                <lampPark 
                  :key="deviceKey+index" 
                  :deviceData="item" 
                  :width="120" 
                  :height="80" 
                  :id="index"
                  :isShow="textShow"
                  :isDraggable="isDraggable"
                  :type="'dev'"
                ></lampPark>
              </template>
            </div>
          </el-col>
      </el-row>
      
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";

import lampPark from "@/components/DrawCanvas/lampPark";

import moment from "moment";

import { getSdcTableBy } from "@/api/sdc/deviceInfo";
import { sdcSiteAction } from "@/api/sdc/addressInfo";

export default {
  props: ['parkPlaceCodeMap','parkingNameMap','normalParkId','pqCondition','siteId','siteImgInfo'],
  components: {
    Pagination,
    lampPark,
  },
  data() {
    return {
      page:1,
      size: 10,
      total: 0,
      pageKey: Math.random().toString(36).slice(-6),
      address: [],
      condition: [],
      status:'',
      parkingName: '',
      parkingMap: [],
      dialogKey: Math.random().toString(36).slice(-6),
      dialogVisible: false,
      queryCondition: {},
      plateImg: null,
      // plateImg: tsParkUrl,
      deviceInfo:[],
      deviceKey: Math.random().toString(36).slice(-6),
      textShow: false,
      isDraggable: true,
      parkPlateId:null,
      parkData: null,
    }
  },
  created() {
    this.init()
    // this.getLight()
  },
  activated() {
    this.init()
  },
  methods: {
    async init() {
       this.normalParkId ? this.parkId = this.normalParkId : null
       this.queryCondition = this.pqCondition

      //获取初始区域查询条件数据
      console.log(this.siteImgInfo,'this.siteImgInfo00000');
      this.condition = this.siteImgInfo

      if(this.parkId) {
        this.queryInfo()
      }
    },
    async getLight() {
      this.parkingMap = []
      let siteid = this.address.length !== 0 ? this.address[this.address.length - 1] : null
      let tableData = await getSdcTableBy({
        current: 1,
        size: 200,
        topTypeCode: "light",
        siteId: siteid
      })
      for (let index = 0; index < tableData.data.data.records.length; index++) {
        const el = tableData.data.data.records[index];
        this.parkingMap.push({
          value: el.id,
          label: el.name
        })
      }
    },
    setQueryCondition() {
      this.queryCondition = {
        current:this.page,
        size: this.size,
        topTypeCode: "light",
        siteId: this.address[this.address.length -1]
      }
    },
    async addInfo() { 
      this.changeComponent(false,false,'新建车位信息',1,null,this.queryCondition,this.address)
      this.dialogKey = new Date().toString()
    },
    changeComponent(psDisabled,isdisabled,title,actionType,inputFormData, queryCondition,siteId) {
      this.$emit('changeCurrentCompent',{
        currentCompent: 'parkPlacePoint',
        psDisabled,
        isdisabled,
        title,
        actionType,
        inputFormData,
        queryCondition,
        siteId
      })
    },
    async queryInfo() {
      console.log(this.address,'this.address');
      let siteData = await await sdcSiteAction('','/'+ this.address[this.address.length -1],'get')
      console.log(siteData,'siteData');
      this.plateImg = siteData.data.data.siteImg

      this.setQueryCondition()
      let tableData = await getSdcTableBy(this.queryCondition)
      console.log(tableData,'tableData');
      this.deviceInfo = tableData.data.data.records
      this.setpage(tableData.data.data);
    },
    clearCondition() {
      this.parkId = null
      this.parkPlaceCode = null
      this.status = null
      this.dueDate = null
      this.address = []
    },
    async changeAddress() {
      this.queryInfo()
    },
    async queryByPage(data) {
      this.page = data.page
      this.size = data.size
      this.queryInfo()
    },
    changeSite() {

    },
    setParkName(val) {
      let text
      for (let index = 0; index < this.parkingNameMap.length; index++) {
        const el = this.parkingNameMap[index];
        if (el.value === val.parkId) {
          text = el.label
          break;
        }
      }
      return text
    },
    setExpiryEnd(val) {
      return moment(val.expiryEnd).format('YYYY-MM-DD HH:mm:ss')
    },
    setStatus(val) {
      let statusMap = this.$dictUtils.getDictList('park_space_type')
      let text
      for (let index = 0; index < statusMap.length; index++) {
        const el = statusMap[index];
        if (el.value === val.status) {
          text = el.label
          break;
        }
      }
      return text
    },
    setpage(data) {
      this.page = data.current;
      this.size = data.size;
      this.total = data.total;
      this.pageKey = (new Date()).toString() + 1
    }
  }
}
</script>

<style>

</style>