<template>
  <div>
    <el-row :gutter="15">
      <el-col :span="6">
        <el-select v-model="address" @change="changeAddress">
          <el-option
            v-for="item in condition"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row class="b-list">
      <el-col>
        <el-radio-group v-model="bId" @change="changeBuilding">
          <el-radio-button v-for="item in buildings" :key="item.id" :label="item.id">{{item.name}}</el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>
    <el-row class="f-list">
      <el-col>
        <el-radio-group v-model="fId" @change="changeFloor">
          <el-radio-button v-for="item in floors" :key="item.id" :label="item.id">{{item.name}}</el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>
    <el-row class="fd-list">
      <el-col :span="24">
        <div class="fd-title">机房</div>
      </el-col>
      <el-col :span="24">
        <el-row :gutter="15" v-loading="isLoading">
          <el-col :span="4" v-for="item in fdRooms" :key="item.id">
            <div @click="changeComponent(item)" class="card-container">
              <el-card shadow="always">
                <div class="room-detail">
                  <div class="room-abbrev">{{item.name.slice(3, 8).replace('FD', '') + '机房'}}</div>
                  <div class="room-name">{{item.name}}</div>
                  <div class="dev-info">
                    <div class="dev-num">
                      <span style="margin-right:15px;">设备数量</span>
                      <span>{{item.deviceNums}}</span>
                    </div>
                    <div class="warn-num">
                      <span style="margin-right:15px;">告警数量</span>
                      <span class="nums">{{item.warnNums}}</span>
                    </div>
                  </div>
                </div>
              </el-card>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row class="fp-list">
      <el-col :span="24">
        <div class="fp-title">电力室 / 配电机房</div>
      </el-col>
      <el-col :span="24">
        <el-row :gutter="15" v-loading="isLoading">
          <el-col :span="4" v-for="item in fpRooms" :key="item.id">
            <div @click="changeComponent(item)" class="card-container">
              <el-card shadow="always">
                <div class="room-detail">
                  <div class="room-abbrev">{{item.name.slice(3, 8).replace('FP', '') + '电力室'}}</div>
                  <div class="room-name">{{item.name}}</div>
                  <div class="dev-info">
                    <div class="dev-num">
                      <span style="margin-right:15px;">设备数量</span>
                      <span>{{item.deviceNums}}</span>
                    </div>
                    <div class="warn-num">
                      <span style="margin-right:15px;">告警数量</span>
                      <span class="nums">{{item.warnNums}}</span>
                    </div>
                  </div>
              </div>
            </el-card>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import { sdcSiteAction } from "@/api/sdc/addressInfo";
import { sdcDeviceTypeAction,getSdcDeviceTypeTree } from "@/api/sdc/deviceType"
import { modifyData } from "@/util/domainFilter";
import { getDevInfoBySiteIdAndSys } from "@/api/sdc/deviceInfo";

export default {
  name: 'RoomOverview',
  props: ['addressId'],
  data() {
    return {
      condition: [],
      address: [],
      buildings: [],
      bId: '',
      floors: [],
      fId: '',
      roomInfos: [],
      isLoading: true,
      fdRooms: [],
      fpRooms: []
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
      if (this.condition.length > 0) {
        // 设置默认选中
        this.address = this.condition[0].id
        this.buildings = this.condition[0].children
        this.bId = this.buildings[0].id
        this.floors = this.buildings[0].children
        this.fId = this.floors[0].id
        this.getRoomDev(this.fId)
      }
    },
    // 获取房间以及设备信息
    getRoomDev(id) {
      this.fdRooms = []
      this.fpRooms = []
      getDevInfoBySiteIdAndSys(id).then(res => {
        if (res.data.code === 0) {
          let roomInfos = res.data.data[0].roomInfos
          // this.fdRooms = res.data.data[0].roomInfos
          // this.fpRooms = res.data.data[0].roomInfos
          roomInfos.forEach(item => {
            if (item.name.indexOf('FD') !== -1) {
              this.fdRooms.push(item)
            } else if (item.name.indexOf('FP') !== -1) {
              this.fpRooms.push(item)
            }
          })
          this.isLoading = false
        }
      })
    },
    // 切换园区
    changeAddress(val) {
      this.isLoading = true
      this.condition.forEach(item => {
        if (val === item.id) {
          this.buildings = item.children
          if (this.buildings && this.buildings.length > 0) {
             this.bId = this.buildings[0].id
             if (this.buildings[0].children && this.buildings[0].children.length > 0) {
                this.floors = this.buildings[0].children
                this.fId = this.floors[0].id
                this.getRoomDev(this.fId)
             } else {
               console.log('no floor');
                this.floors = []
                this.fId = ''
                this.isLoading = false
                this.roomInfos = []
             }
          } else {
            console.log('no building');
            this.bId = ''
            this.floors = []
            this.fId = ''
            this.roomInfos = []
            this.isLoading = false
          }
        }
      })
    },
    // 切换楼栋
    changeBuilding(val) {
      this.condition.forEach(pitem => {
        if (pitem.id === this.address) {
          let buildings = pitem.children
          buildings.forEach(bitem => {
            if (bitem.id === val) {
              this.floors = bitem.children
              if (this.floors && this.floors.length > 0) {
                this.fId = this.floors[0].id
                this.getRoomDev(this.fId)
              } else {
                this.fId = ''
                this.roomInfos = []
                this.isLoading = false
              }
            }
          })
        }
      })
    },
    // 切换楼层
    changeFloor(val) {
      this.getRoomDev(val)
    },
    changeComponent(val) {
      this.$emit('changeComponent',{
        currentComponent: 'RoomList',
        roomInfo: val,
        addressId: this.address,
        typeId: null
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.b-list {
  margin-top: 20px;
}
.f-list {
  margin-top: 10px;
}
.card-container {
  cursor: pointer;
}
.fd-list {
  margin-top: 20px;
  .fd-title {
    width: 80px;
    height: 35px;
    line-height: 35px;
    font-size: 16px;
    text-align: center;
    background-color: #409EFF;
    color: #fff;
    margin-bottom: 10px;
  }
}
.fp-list {
  margin-top: 20px;
  .fp-title {
    width: 150px;
    height: 35px;
    line-height: 35px;
    font-size: 16px;
    text-align: center;
    background-color: #409EFF;
    color: #fff;
    margin-bottom: 10px;
  }
}
.room-detail {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  .room-abbrev {
    font-weight: 700;
    font-size: 20px;
    margin-bottom: 10px;
  }
  .room-name {
    margin-bottom: 15px;
  }
  .dev-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    .dev-num {
      margin-bottom: 10px;
    }
    .warn-num {
      .nums {
        color: #6DBF69;
      }
    }
  }
}
.el-card.is-always-shadow {
  -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0 , 0, 0.1);
  box-shadow: 0 2px 12px 0 rgba(0, 0 , 0, 0.1);
}

</style>
