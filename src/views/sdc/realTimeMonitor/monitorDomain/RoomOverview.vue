<template>
  <div>
    <el-row :gutter="15">
      <el-col :span="6">
        <span>区域：</span>
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
      <el-col :span="8">
        <span>设备类型：</span>
        <el-cascader 
          :options="deviceType" 
          style="width:80%" 
          v-model="devType"
          :props="{ checkStrictly: true, value: 'id', label: 'name', children: 'children' }"
          clearable
          filterable 
          @change="changeDevType"
        ></el-cascader>
      </el-col>
    </el-row>
    <el-tabs v-model="radioBtn">
      <el-tab-pane label="卡片显示" name="1">
        <el-collapse v-model="activeName" accordion v-if="displayData">
          <template v-for="(item, index) in displayData">
            <el-collapse-item 
              :key="index" 
              :title="item.roomBFName"
              :name="index"
              v-if="item.roomInfos.length !== 0"
            >
              <el-row :gutter="15">
                <el-col 
                  :span="6"
                  v-for="(el) in item.roomInfos"
                  :key="el.id"
                >
                  <div @click="changeComponent(el)">
                    <el-card class="power-card" >
                      <div class="dev-info-parent" >
                        <img :src="el.siteImg" class="image"/>
                      </div>
                      <div class="dev-address">
                        <el-row :gutter="15">
                          <el-col :span="12" style="font-size: 24px"> {{ el.name }} </el-col>
                          <el-col :span="12">
                            <div style="padding:10px 0">{{el.roomBuildingName}}</div>
                          </el-col>
                        </el-row>
                      </div>
                      <div class="dev-address">
                        <el-row :gutter="15">
                          <el-col :span="11"> 
                            设备数量<br/>
                            {{ el.deviceNums }}
                          </el-col>
                          <el-col :span="2">|</el-col>
                          <el-col :span="11">
                            告警数量<br/>
                            {{ el.warnNums }}
                          </el-col>
                        </el-row>
                      </div>
                    </el-card>
                  </div>
                </el-col>
              </el-row>
            </el-collapse-item>
          </template>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane label="列表显示" name="2">
        <el-table
          :data="roomInfos"
          style="width: 100%; margin: 20px 0"
          border
          :key="devKey"
        >
          <el-table-column
            prop="name"
            label="机房名称"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="roomBuildingName" label="所处位置" align="center">
          </el-table-column>
          <el-table-column prop="deviceNums" label="设备数量" align="center"> </el-table-column>
          <el-table-column prop="warnNums" label="告警数量" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <span
                class="table-action"
                @click="changeComponent(scope.row)"
                >查看</span>
            </template>
          </el-table-column>
        </el-table>   
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import { sdcSiteAction } from "@/api/sdc/addressInfo";
import { sdcDeviceTypeAction,getSdcDeviceTypeTree } from "@/api/sdc/deviceType"
import { modifyData } from "@/util/domainFilter";
import { getDevInfoBySiteIdAndSys } from "@/api/sdc/deviceInfo";

export default {
  name: 'RoomOverview',
  props: ['systemFlag','addressId','typeId'],
  data() {
    return {
      condition: [],
      deviceType: [],
      displayData: null,
      address: [],
      devType: [],
      activeName: 0,
      parkName: '',
      radioBtn: '1',
      devKey: 1,
      roomInfos: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    //初始化获取数据
    async init() {
      //获取区域数据
      let data = await sdcSiteAction('','/tree','get')
      this.condition = modifyData(data.data.data)
      //获取设备类型数据
      let devTypeData = await getSdcDeviceTypeTree(this.systemFlag)
      //配置数据为符合组件的结构
      this.deviceType = modifyData(devTypeData.data.data)
      if(this.addressId || this.typeId) {
        let address = '',type = ''
        if(this.addressId) {
          this.address = this.addressId
          address = this.address[this.address.length - 1]
        }
        if(this.typeId) {
          this.devType = this.typeId
          type = this.devType[this.devType.length - 1]
        }
        this.queryDevInfo(address,type)
      } else {
        this.address = [this.condition[0].id]
        this.queryDevInfo(this.address, '')
      }
    },
    async changeAddress(val) {
      if(val.length !== 0) {
        this.devType.length !== 0 
        ? this.queryDevInfo(val[val.length - 1],this.devType[this.devType.length - 1]) 
        : this.queryDevInfo(val[val.length - 1],'')
      }else {
        this.devType.length !== 0 
        ? this.queryDevInfo('',this.devType[this.devType.length - 1]) 
        : this.displayData = this.roomInfos = []
      }
    },
    async changeDevType(val) { 
      if(val.length !== 0) {
        this.address.length !== 0 
        ? this.queryDevInfo(this.address[this.address.length - 1], val[val.length - 1]) 
        : this.queryDevInfo('', val[val.length - 1])
      }else {
        this.address.length !== 0 
        ? this.queryDevInfo(this.address[this.address.length - 1], '') 
        :  this.displayData = this.roomInfos = []
      }
      
    },
    async queryDevInfo(siteId,type) {
      this.roomInfos = []
      let devInfo = await getDevInfoBySiteIdAndSys(siteId,this.systemFlag,type)
      this.displayData = devInfo.data.data
      this.activeName = this.displayData.findIndex(item => item.roomInfos.length > 0)
      for (let index = 0; index < this.displayData.length; index++) {
        const element = this.displayData[index]; 
        if(element.roomInfos.length !== 0) {
          element.roomBFName = element.roomInfos[0].roomBuildingName
          for (let index = 0; index < element.roomInfos.length; index++) {
            const el = element.roomInfos[index];
            this.roomInfos.push(el)
          }
        }else {
          element.roomBFName = element.parentName + element.name
        }
        
      }
      // for (let index = 0; index < devInfo.data.data.length; index++) {
      //   const element = devInfo.data.data[index];
      //   if()
        
      // }
      //  = devInfo.data.data[0].roomInfos
    },
    changeComponent(val) {
      this.$emit('changeComponent',{
        currentComponent: 'RoomList',
        roomInfo: val,
        addressId: this.address,
        typeId: this.devType
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dev-info-parent {
  padding-left: 20px;
  min-height: 14px;
}

.dev-info1 {
  font-weight: 600;
  font-size: 20px;
  padding: 20px 0 5px 0px;
  text-align: left;
}

.dev-address {
  margin: 0.5rem 0 0.5rem;
  line-height: 2;
  padding-left: 20px;
  min-height: 14px;
  text-align: center;
}

.image {
  width: 100%;
  height: 100%;
  padding: 0;
  float: left;
}

.power-card {
  cursor: pointer;
}

.table-action {
  cursor: pointer;
  margin-left: 10px;
  color: #409eff;
}
</style>
