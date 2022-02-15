<template>
  <div class="container">
    <el-row>
      <el-col>
        <span style="font-weight:700;">设备指标</span>
        <span>{{' ( ' + '数据采集时间：' + updateDate + ' ) '}}</span>
      </el-col>
    </el-row>
    <el-row style="margin-top:15px;">
      <div class="total-indicator-title">遥测-分组指标</div>
    </el-row>
    <el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="分路功率因数" name="1">
          <el-row>
            <el-card shadow="always">
              <el-col v-for="item in powerFactor" :key="item.name"  :span="3">
                <div class="tab-content">
                  <div>{{'(' + item.name + ')'}}</div>
                  <div>{{item.value}}</div>
                </div>
              </el-col>
            </el-card>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="分路有功电能(kW)" name="2">
          <el-row>
            <el-card shadow="always">
              <el-col v-for="item in activeEnergy" :key="item.name"  :span="3">
                <div class="tab-content">
                  <div>{{'(' + item.name + ')'}}</div>
                  <div>{{item.value}}</div>
                </div>
              </el-col>
            </el-card>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-row>
    <el-row style="margin-top:15px;">
      <div class="battery-indicator-title">遥测-分相指标</div>
    </el-row>
    <el-row>
      <el-tabs v-model="activePhaseName" @tab-click="handlePhaseClick">
        <el-tab-pane label="A相" name="1">
          <el-tabs v-model="aPhaseActive">
            <el-tab-pane label="分路有功功率Pa(kW)" name="1">
               <el-row>
                <el-card shadow="always">
                  <el-col v-for="item in aPhaseAe" :key="item.name"  :span="3">
                    <div class="tab-content">
                      <div>{{'(' + item.name + ')'}}</div>
                      <div>{{item.value}}</div>
                    </div>
                  </el-col>
                </el-card>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="分路相电流Ia(A)" name="2">
              <el-row>
                <el-card shadow="always">
                  <el-col v-for="item in aCurrent" :key="item.name"  :span="3">
                    <div class="tab-content">
                      <div>{{'(' + item.name + ')'}}</div>
                      <div>{{item.value}}</div>
                    </div>
                  </el-col>
                </el-card>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
        <el-tab-pane label="B相" name="2">
           <el-tabs v-model="bPhaseActive">
            <el-tab-pane label="分路有功功率Pa(kW)" name="1">
               <el-row>
                <el-card shadow="always">
                  <el-col v-for="item in bPhaseAe" :key="item.name"  :span="3">
                    <div class="tab-content">
                      <div>{{'(' + item.name + ')'}}</div>
                      <div>{{item.value}}</div>
                    </div>
                  </el-col>
                </el-card>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="分路相电流Ia(A)" name="2">
              <el-row>
                <el-card shadow="always">
                  <el-col v-for="item in bCurrent" :key="item.name"  :span="3">
                    <div class="tab-content">
                      <div>{{'(' + item.name + ')'}}</div>
                      <div>{{item.value}}</div>
                    </div>
                  </el-col>
                </el-card>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
        <el-tab-pane label="C相" name="3">
           <el-tabs v-model="cPhaseActive">
            <el-tab-pane label="分路有功功率Pa(kW)" name="1">
               <el-row>
                <el-card shadow="always">
                  <el-col v-for="item in cPhaseAe" :key="item.name"  :span="3">
                    <div class="tab-content">
                      <div>{{'(' + item.name + ')'}}</div>
                      <div>{{item.value}}</div>
                    </div>
                  </el-col>
                </el-card>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="分路相电流Ia(A)" name="2">
              <el-row>
                <el-card shadow="always">
                  <el-col v-for="item in cCurrent" :key="item.name"  :span="3">
                    <div class="tab-content">
                      <div>{{'(' + item.name + ')'}}</div>
                      <div>{{item.value}}</div>
                    </div>
                  </el-col>
                </el-card>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script>
export default {
  props: ['devIndicators'],
  data() {
    return {
      updateDate: '',
      activeName: '1',
      activePhaseName: '1',
      aPhaseActive: '1',
      bPhaseActive: '1',
      cPhaseActive: '1',
      powerFactor: [],
      activeEnergy: [],
      aPhaseAe: [],
      bPhaseAe: [],
      cPhaseAe: [],
      aCurrent: [],
      bCurrent: [],
      cCurrent: []

    }
  },
  created() {
    this.init()
  },
  destroyed() {
  },
  methods: {
    init() {
      if (this.devIndicators.length > 0) {
        this.updateDate = this.devIndicators[0].updateDate
      }
      this.powerFactor = []
      this.activeEnergy = []
      this.aPhaseAe = [],
      this.bPhaseAe = [],
      this.cPhaseAe = [],
      this.aCurrent = [],
      this.bCurrent = [],
      this.cCurrent = []
      this.devIndicators.forEach(item => {
        if (item.paramId === '009310') {
          // 分路功率因数
          this.powerFactor.push({name: item.signalNumber, value: item.value})
        } else if (item.paramId === '009312') {
          // 分路有功电能
          this.activeEnergy.push({name: item.signalNumber, value: item.value})
        } else if (item.paramId === '009307') {
          // 分路1有功功率Pa
          this.aPhaseAe.push({name: item.signalNumber, value: item.value})
        } else if (item.paramId === '009308') {
          // 分路1有功功率Pb
          this.bPhaseAe.push({name: item.signalNumber, value: item.value})
        } else if (item.paramId === '009309') {
          // 分路1有功功率Pc
          this.cPhaseAe.push({name: item.signalNumber, value: item.value})
        } else if (item.paramId === '009301') {
          // 分路1相电流Ia
          this.aCurrent.push({name: item.signalNumber, value: item.value})
        } else if (item.paramId === '009302') {
          // 分路1相电流Ib
          this.bCurrent.push({name: item.signalNumber, value: item.value})
        } else if (item.paramId === '009303') {
          // 分路1相电流Ic
          this.cCurrent.push({name: item.signalNumber, value: item.value})
        }
      })
    },
    handleClick() {
      console.log(this.activeName);
    },
    handlePhaseClick() {}
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  margin-left: 20px;
}
.total-indicator-title {
    width: 140px;
    height: 35px;
    line-height: 35px;
    text-align: center;
    background-color: #409EFF;
    color: #fff;
}
.total-indicator-value {
  margin-left: 20px;
  font-size: 22px;
  color: #409EFF;
}
.battery-indicator-title {
  width: 140px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  background-color: #409EFF;
  color: #fff;
}
.tab-content {
  width:50px;
  height:60px;
  background:#9FCEFF;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.el-card.is-always-shadow {
  -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0 , 0, 0.1)!important;
  box-shadow: 0 2px 12px 0 rgba(0, 0 , 0, 0.1)!important;
}
</style>