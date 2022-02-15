<template>
  <div>
    <basic-container>
      <el-row :gutter="15">
        <el-col :span="7">
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
        <el-col :span="11">
          <span>日期：</span>
          <el-date-picker
            v-model="dueDate"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            style="width:80%"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          
          <div class="query-btn-group">
            <el-button type="primary" @click="queryInfo">
              <i class="el-icon-search"></i> 查询
            </el-button>
            <el-button type="primary" @click="clearCondition">
              <i class="el-icon-delete"></i> 清空
            </el-button>
            <!-- <el-button type="primary" @click="addInfo">
              导出数据
            </el-button> -->
          </div>
        </el-col>
        <el-col :span="24">
          <!-- <el-button-group class="button-group">
            <el-button type="primary" @click="changeData('1')" size="mini" :class="btn1">
              近一周
            </el-button>
            <el-button type="primary" @click="changeData('2')" size="mini" :class="btn2">
              近15天
            </el-button>
            <el-button type="primary" @click="changeData('3')" size="mini" :class="btn3">
              近一月
            </el-button>
          </el-button-group> -->
          <lampParkEnergyChart :parkEnergyData="parkEnergyData" :key="parkEnergyKey"></lampParkEnergyChart>
        </el-col>
        <el-col :span="24">
          <!-- <el-button-group class="button-group">
            <el-button type="primary" @click="changeLampData('1')" size="mini" :class="lampbtn1">
              近一周
            </el-button>
            <el-button type="primary" @click="changeLampData('2')" size="mini" :class="lampbtn2">
              近15天
            </el-button>
            <el-button type="primary" @click="changeLampData('3')" size="mini" :class="lampbtn3">
              近一月
            </el-button>
          </el-button-group> -->
          <lampEnergyChart :allLampEnergyData="allLampEnergyData" :key="allLampEnergyKey"></lampEnergyChart>
        </el-col>
        <el-col :span="24">
          <div class="button-group">
            <span>灯杆编号：</span>
            <el-select v-model="lightId" placeholder="请选择" >
                <el-option
                  v-for="item in lightList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            <!-- <el-button-group style="margin-left:20px">
              <el-button type="primary" @click="changeOneLampData('1')" size="mini" :class="lamponebtn1">
                近一周
              </el-button>
              <el-button type="primary" @click="changeOneLampData('2')" size="mini" :class="lamponebtn2">
                近15天
              </el-button>
              <el-button type="primary" @click="changeOneLampData('3')" size="mini" :class="lamponebtn3">
                近一月
              </el-button>
            </el-button-group> -->
          </div>
          <oneLampEnergyChart :oneLampEnergyData="oneLampEnergyData" :key="oneLampEnergyKey"></oneLampEnergyChart>
        </el-col>
      </el-row>
    </basic-container>
    
  </div>
</template>

<script>
import moment from "moment"; //导入文件
import { getSdcLightLampTotalLog,getSdcLightLampLog,getSdcLightLampOneLog } from "@/api/sdc/lpmanage";
import { sdcSiteAction } from "@/api/sdc/addressInfo";
import { modifyData } from "@/util/domainFilter";
import { getSdcTableBy } from "@/api/sdc/deviceInfo";
import lampEnergyChart from "./lampEnergyChart";
import lampParkEnergyChart from "./lampParkEnergyChart";
import oneLampEnergyChart from "./oneLampEnergyChart";

export default {
  components: {
    lampParkEnergyChart,
    lampEnergyChart,
    oneLampEnergyChart
  },
  data() {
    return {
      totalBeginDate: moment().format("YYYY-MM-DD"),
      totalEndDate: moment().subtract(7, "d").format("YYYY-MM-DD"),
      lampBeginData: moment().format("YYYY-MM-DD"),
      lampEndData: moment().subtract(7, "d").format("YYYY-MM-DD"),
      lampOneBeginData: moment().format("YYYY-MM-DD"),
      lampOneEndData: moment().subtract(7, "d").format("YYYY-MM-DD"),
      totalData: null,
      totalTime: null,
      lampData: null,
      lampTime: null,
      lampOneData: null,
      lampOneTime: null,
      condition: null,
      address: [],
      siteId: null,
      dueDate:['2021-05-01','2021-05-31'],
      pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近15天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }]
      },
      btn1: "el-button-2",
      btn2: "el-button-1",
      btn3: "el-button-1",
      lampbtn1: "el-button-2",
      lampbtn2: "el-button-1",
      lampbtn3: "el-button-1",
      lamponebtn1: "el-button-2",
      lamponebtn2: "el-button-1",
      lamponebtn3: "el-button-1",
      lightId: null,
      lightList: [],
      parkEnergyData: [],
      allLampEnergyData: [],
      oneLampEnergyData: [],
      allLampEnergyKey: Math.random().toString(36).slice(-6),
      parkEnergyKey: Math.random().toString(36).slice(-6),
      oneLampEnergyKey: Math.random().toString(36).slice(-6),
    };
  },
  created() {
    this.getSite()
  },
  methods: {
    queryInfo() {
      this.getAllLampEnergyInfo()
      this.getParkEnergyInfo()
      this.getOneLampEnergyInfo()
    },
    clearCondition() {
      this.address = []
      this.changeAddress()
    },
    async getSite() {
      //获取初始区域查询条件数据
      let data = await sdcSiteAction('','/tree','get')
      this.siteInfo = data.data.data
      this.condition = modifyData(data.data.data)
      this.address.push(this.condition[0].id)
      this.siteId = this.condition[0].id
      
      this.getLight()
      this.getAllLampEnergyInfo()
      this.getParkEnergyInfo()
    },
    async getLight() {
      this.lightList = []
      //杆体数据
      let queryData = await getSdcTableBy({
        current:1,
        size:200,
        topTypeCode:'light'
      })
      this.lightId = queryData.data.data.records[0].id
      console.log(this.lightId,'this.lightId');
      console.log(queryData.data,'queryData.data');
      for (let index = 0; index < queryData.data.data.records.length; index++) {
        const el = queryData.data.data.records[index];
        this.lightList.push({
          value: el.id,
          label: el.name
        })
      }
      this.getOneLampEnergyInfo()
      console.log(this.lightList,'this.lightList');
    },
    async getAllLampEnergyInfo() {
      let queryData = {}
      if(this.dueDate) {
        this.lampBeginData = moment(this.dueDate[0]).format("YYYY-MM-DD")
        this.lampEndData = moment(this.dueDate[1]).format("YYYY-MM-DD")
        queryData = await getSdcLightLampLog ({
          siteId: this.siteId,
          beginDate: this.lampBeginData,
          endDate: this.lampEndData
        })
      } else {
        queryData = await getSdcLightLampLog ({
          siteId: this.siteId
        })
      }      
      this.allLampEnergyData = queryData.data.data
      this.allLampEnergyKey = new Date().toString()
    },
    async getParkEnergyInfo() {
      let queryData = {}
      if(this.dueDate) {
        this.totalBeginDate = moment(this.dueDate[0]).format("YYYY-MM-DD") 
        this.totalEndDate = moment(this.dueDate[1]).format("YYYY-MM-DD")
        queryData = await getSdcLightLampTotalLog({
          siteId: this.siteId,
          beginDate: this.totalBeginDate,
          endDate: this.totalEndDate
        })
      } else {
        queryData = await getSdcLightLampTotalLog({
          siteId: this.siteId
        })
      }       
      this.parkEnergyData = queryData.data.data
      this.parkEnergyKey = new Date().toString()
    },
    async getOneLampEnergyInfo() {
      let queryData = {}
      if(this.dueDate) {
        this.lampOneBeginData = moment(this.dueDate[0]).format("YYYY-MM-DD")
        this.lampOneEndData = moment(this.dueDate[1]).format("YYYY-MM-DD")
        queryData = await getSdcLightLampOneLog ({
          siteId: this.siteId,
          beginDate: this.lampOneBeginData,
          endDate: this.lampOneEndData,
          deviceId: this.lightId,
        })
      } else {
        queryData = await getSdcLightLampOneLog ({
          siteId: this.siteId,
          deviceId: this.lightId
        })
      }     
      this.oneLampEnergyData = queryData.data.data
      this.oneLampEnergyKey = new Date().toString()

    },
    changeAddress() {
      this.siteId = this.address[this.address.length - 1]
    },
    changeData(val) {
      this.dueDate = []
      switch (val) {
        case '1':
          this.totalBeginDate = moment().format("YYYY-MM-DD ")
          this.totalEndDate= moment().subtract(7, "d").format("YYYY-MM-DD")
          this.btn1 = "el-button-2";
          this.btn2 = this.btn3 = "el-button-1";
          break;
        case '2':
          this.totalBeginDate= moment().format("YYYY-MM-DD ")
          this.totalEndDate= moment().subtract(7, "d").format("YYYY-MM-DD")
          this.btn2 = "el-button-2";
          this.btn1 = this.btn3 = "el-button-1";
          break;
        case '3':
          this.totalBeginDate= moment().format("YYYY-MM-DD ")
          this.totalEndDate= moment().subtract(7, "d").format("YYYY-MM-DD")
          this.btn3 = "el-button-2";
          this.btn2 = this.btn1 = "el-button-1";
          break;
      }
      this.areaChartInit()
    },
    changeLampData(val) {
      this.dueDate = []
      switch (val) {
        case '1':
          this.lampBeginData = moment().format("YYYY-MM-DD ")
          this.lampEndData= moment().subtract(7, "d").format("YYYY-MM-DD")
          this.lampbtn1 = "el-button-2";
          this.lampbtn2 = this.lampbtn3 = "el-button-1";
          break;
        case '2':
          this.lampBeginData= moment().format("YYYY-MM-DD ")
          this.lampEndData= moment().subtract(15, "d").format("YYYY-MM-DD")
          this.lampbtn2 = "el-button-2";
          this.lampbtn1 = this.lampbtn3 = "el-button-1";
          break;
        case '3':
          this.lampBeginData= moment().format("YYYY-MM-DD ")
          this.lampEndData= moment().subtract(30, "d").format("YYYY-MM-DD")
          this.lampbtn3 = "el-button-2";
          this.lampbtn2 = this.lampbtn1 = "el-button-1";
          break;
      }
      this.getOneLampEnergyInfo()
      this.lampChartInit()
    },
    changeOneLampData(val) {
      this.dueDate = []
      switch (val) {
        case '1':
          this.lampOneBeginData = moment().format("YYYY-MM-DD")
          this.lampEndData= moment().subtract(7, "d").format("YYYY-MM-DD")
          this.lamponebtn1 = "el-button-2";
          this.lamponebtn2 = this.lamponebtn3 = "el-button-1";
          break;
        case '2':
          this.lampOneBeginData= moment().format("YYYY-MM-DD")
          this.lampEndData= moment().subtract(7, "d").format("YYYY-MM-DD")
          this.lamponebtn2 = "el-button-2";
          this.lamponebtn1 = this.lamponebtn3 = "el-button-1";
          break;
        case '3':
          this.lampOneBeginData= moment().format("YYYY-MM-DD")
          this.lampEndData= moment().subtract(7, "d").format("YYYY-MM-DD")
          this.lamponebtn3 = "el-button-2";
          this.lamponebtn2 = this.lamponebtn1 = "el-button-1";
          break;
      }
      this.oneLampChartInit()
    },
  }
}
</script>

<style lang="scss" scoped>
#areaEchart {
  width: 100%;
  height: 100%;
  min-height: 305px;
}
#lampEchart {
  width: 100%;
  height: 100%;
  min-height: 305px;
}
#oneLampChart {
  width: 100%;
  height: 100%;
  min-height: 305px;
}
.button-group {
  display: inline;
  position: absolute;
  margin-left: 20%;
  z-index: 1000;
}
</style>