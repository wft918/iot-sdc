<template>
  <div>
    <basic-container>
      <el-tabs v-model="radioBtn" @tab-click="handleClick">
        <el-tab-pane label="列表显示" name="1">
          <lpstate :tableData="tableInfo" :siteinfo="siteinfo" :lazy="true" :key="siteKey"></lpstate>
        </el-tab-pane>
        <el-tab-pane label="地图显示" name="2">
          <lpstateImg :tableData="tableInfo" :siteImgInfo="siteImgInfo" :lazy="true" :key="siteImgKey"></lpstateImg>
        </el-tab-pane>
      </el-tabs>
      <!-- 动态组件及组件传参 -->
        <!-- <component
          ref="deviceTypeInfo"
          v-bind:is="currentCompent"
          @changeCurrentCompent="changeCurrentCompent"
        ></component> -->
    </basic-container>
    
  </div>
</template>

<script>
import { sdcSiteAction } from "@/api/sdc/addressInfo";

import lpstate from "./lpstate";
import lpstateImg from "./lpstateImg";
import { getSdcTableBy } from "@/api/sdc/deviceInfo";
import { modifyData } from "@/util/domainFilter";

export default {
  components: {
    lpstate,
    lpstateImg
  },
  data() {
    return {
      parkPlaceCodeMap: [],
      parkingNameMap: [],
      // currentCompent: 'parkPlacePoint',
      currentCompent: 'lpstate',
      psDisabled: false,
      isdisabled: false,
      title: '',
      actionType: 1,
      inputFormData: null,
      parkingLotData: null,
      normalParkId: null,
      siteId: [],
      queryCondition: {},
      radioBtn: '1',
      tableInfo: [],
      siteinfo: [],
      siteImgInfo:[],
      siteKey: Math.random().toString(36).slice(-6),
      siteImgKey: Math.random().toString(36).slice(-6),
    }
  },
  beforeCreate(){

  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      let lightTable = await getSdcTableBy({
          current: 1,
          size: 10,
          topTypeCode: 'light'
        })
      console.log(lightTable,'lightTable');
      this.tableInfo = lightTable.data.data.records
      //获取初始区域查询条件数据
      let siteData = await sdcSiteAction('','/tree','get')
      this.siteinfo = modifyData(siteData.data.data)
      this.siteKey = new Date().toString()
      this.siteImgInfo = modifyData(siteData.data.data)
      this.siteImgKey = new Date().toString()
    },
    changeCurrentCompent(data) {
      this.currentCompent = data.currentCompent
      this.psDisabled = data.psDisabled
      this.isdisabled = data.isdisabled
      this.title = data.title
      this.actionType = data.actionType
      this.inputFormData = data.inputFormData
      this.normalParkId = data.parkId
      data.siteId ? this.siteId = data.siteId : null
      data.queryCondition ? this.queryCondition = data.queryCondition : null
    },
    async handleClick(tab, event) {
      let siteData = await sdcSiteAction('','/tree','get')

      if (this.radioBtn === '1') {
        this.siteinfo = modifyData(siteData.data.data)
        this.siteKey = new Date().toString()
      }else {
        this.siteImgInfo = modifyData(siteData.data.data)
        this.siteImgKey = new Date().toString()
        console.log(this.siteImgInfo,'this.siteImgInfo');
      }
      
    }
  }
}
</script>

<style lang="scss" scoped>

</style>