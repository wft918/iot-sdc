<template>
  <div>
    <basic-container>
      <el-row>
        <el-col>
          <el-tabs v-model="radioBtn" @tab-click="handleTabChange($event)">
            <el-tab-pane :label="el.name" :name="el.id" v-for="(el,index) in topoInfo.records" :key="index">
              <div id="canvas" style="position:relative">
                <img :src="el.url" alt="" style="width:100%">
                <template v-for="(item,index) in deviceInfo">
                    <Topo 
                      :key="index" 
                      :deviceData="item" 
                      :width="120" 
                      :height="80" 
                      :id="index"
                      :type="'dev'"
                    ></Topo>
                  </template>
              </div>
            </el-tab-pane>
            <!-- <el-tab-pane label="北京移动研究院二号楼" name="2">
              <img :src="B1baUrl" alt="" style="width:100%">
            </el-tab-pane> -->
          </el-tabs>
        </el-col>
      </el-row>
      
      <!-- <component 
        v-bind:is="currentComponent" 
        :systemFlag="systemFlag" 
        :siteId="siteId"
        :siteImg="siteImg"
        :siteName="siteName"
        :addressId="addressId"
        :typeId="typeId"
        @changeComponent="changeComponent"
      ></component> -->
    </basic-container>
    
  </div>
</template>

<script>
import RoomOverview from "../monitorDomain/RoomOverview";
import RoomList from "../monitorDomain/RoomList";
import A1ba from "@/assets/img/A1ba.jpg";
import B1ba from "@/assets/img/B1ba.jpg";

import Topo from "@/components/DrawCanvas/Topo.vue"; 

import topo01 from "@/assets/img/topo01.jpg";
import topo02 from "@/assets/img/topo02.jpg";
import topo03 from "@/assets/img/topo03.png";
import topo04 from "@/assets/img/topo04.png";
import topo05 from "@/assets/img/topo05.png";
import topo06 from "@/assets/img/topo06.png";

import { getSdcTopoTable,getSdcTopoDevTable,querySdcTopoComponent  } from "@/api/sdc/topoInfo";
import {  getTeleInfoByDevice,getSdcNVRInfo,getDeviceEventLog,getAlarmLog } from "@/api/sdc/deviceInfo";


export default {
  components: {
    RoomOverview,
    RoomList,
    Topo
  },
  data() {
    return {
      A1baUrl: A1ba,
      B1baUrl: B1ba,
      radioBtn: '0',
      currentComponent: 'RoomOverview',
      systemFlag: '1',
      siteId: null,
      siteImg: null,
      siteName: null,
      addressId: null,
      typeId: null,
      deviceInfo: [],
      topoInfo: []
    }
  },
  created() {
    this.init()
  },
  destroyed() {
    this.currentComponent = 'RoomOverview'
  },
  methods: {
    init() {
      this.queryTopo()
    },
    queryTopo() {
      getSdcTopoTable({
        current: 1,
        size: 200,
      }).then((res) => {
        if (res.data.code == 0) {
          this.topoInfo = res.data.data;
          this.radioBtn = this.topoInfo.records[0].id
          this.handleTabChange(this.topoInfo.records[0])
        }
      });
    },
    async handleTabChange(val) {
      this.deviceInfo = []
      //获取拓扑图组件内容
      let componentData = await getSdcTopoDevTable({
        current: 1,
        size: 200,
        topoId: val.id ? val.id : val.name
      });
      console.log();
      for (
        let index = 0;
        index < componentData.data.data.records.length;
        index++
      ) {
        const el = componentData.data.data.records[index];
        Promise.all([
          querySdcTopoComponent(el.componentId),
          getTeleInfoByDevice(el.deviceId),
          getSdcNVRInfo(el.deviceId),
          getDeviceEventLog({
            current: 1,
            size: 5,
            deviceId: el.deviceId,
            descs: 'update_date'
          }),
          getAlarmLog({
            current: 1,
            size: 5,
            id: el.deviceId
          })
        ]).then( res => {
          
          if(res[0].data.data !== null) {
            console.log(res, 999999999);
            let teleData = [],
                tsgData = [],
                rtoData = [],
                rcoData = [];
            for (let index = 0; index < res[1].data.data.records.length; index++) {
              const elem = res[1].data.data.records[index];
              if (elem.type === "3") {
                teleData.push(elem);
              } else if (elem.type === "4") {
                tsgData.push(elem);
              } else if (elem.type === "2") {
                rtoData.push(elem);
              } else if (elem.type === "1") {
                rcoData.push(elem);
              }
            }
            
            this.deviceInfo.push({
              id: el.id,
              topoId: el.topoId,
              componentId: el.componentId,
              x: el.componnetX,
              y: el.componnetY,
              url: res[0].data.data.url,
              name: res[2].data.data.name,
              deviceId: el.deviceId,
              teleData: teleData,
              tsgData: tsgData,
              rtoData: rtoData,
              rcoData: rcoData,
              devData: res[2].data.data,
              eventLogInfo: res[3].data.data,
              oneAlarmInfo: res[4].data.data,
            });
          }
        })
      }
    }
  }
}
</script>

<style>

</style>