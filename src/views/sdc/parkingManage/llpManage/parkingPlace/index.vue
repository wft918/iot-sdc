<template>
  <div>
    <basic-container>
      <!-- 动态组件及组件传参 -->
        <component
          ref="deviceTypeInfo"
          v-bind:is="currentCompent"
          :parkingNameMap="parkingNameMap"
          :parkPlaceCodeMap="parkPlaceCodeMap"
          :psDisabled="psDisabled"
          :isdisabled="isdisabled"
          :title="title"
          :actionType="actionType"
          :inputFormData="inputFormData"
          :parkingLotData="parkingLotData"
          :normalParkId="normalParkId"
          :siteId="siteId"
          :pqCondition="queryCondition"
          @changeCurrentCompent="changeCurrentCompent"
        ></component>
    </basic-container>
    
  </div>
</template>

<script>
import { sdcSiteAction } from "@/api/sdc/addressInfo";

import parkPlacePoint from "./parkPlacePoint";
import parkpPlace from "./parkpPlace";
import { getSdcParkPlaceTable,getSdcParkingLotTable } from "@/api/sdc/parkManage";

export default {
  components: {
    parkPlacePoint,
    parkpPlace
  },
  data() {
    return {
      parkPlaceCodeMap: [],
      parkingNameMap: [],
      // currentCompent: 'parkPlacePoint',
      currentCompent: 'parkpPlace',
      psDisabled: false,
      isdisabled: false,
      title: '',
      actionType: 1,
      inputFormData: null,
      parkingLotData: null,
      normalParkId: null,
      siteId: [],
      queryCondition: {}
    }
  },
  created() {
    this.getParkInfo()
    this.getParkSpaceInfo()
  },
  methods: {
    //获取停车场信息
    async getParkInfo() {
      let tableData = await getSdcParkingLotTable({
        current: 1,
        size: 100
      })
      this.parkingLotData = tableData.data.data.records
      tableData.data.data.records.forEach((el) => {
        this.parkingNameMap.push({
          value: el.id,
          label: el.name,
        });
      });
    },
    async getParkSpaceInfo() {
      let tableData = await getSdcParkPlaceTable({
        current: 1,
        size: 100
      })
      tableData.data.data.records.forEach((el) => {
        this.parkPlaceCodeMap.push({
          value: el.id,
          label: el.name,
        });
      });
    },
    changeCurrentCompent(data) {
      this.currentCompent = data.currentCompent
      this.psDisabled = data.psDisabled
      this.isdisabled = data.isdisabled
      this.title = data.title
      this.actionType = data.actionType
      this.inputFormData = data.inputFormData
      // this.normalParkId = data.parkId
      data.normalParkId ? this.normalParkId = data.normalParkId : null
      data.siteId ? this.siteId = data.siteId : null
      data.queryCondition ? this.queryCondition = data.queryCondition : null
    }
  }
}
</script>

<style lang="scss" scoped>

</style>