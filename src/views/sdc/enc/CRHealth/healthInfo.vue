<template>
  <div class="healthMain">
    <el-row :gutter="15">
      <!-- <el-col :span="6">
        <span>区域：</span>
        <el-cascader
          ref="areaMsg"
          :options="condition"
          style="width: 80%"
          v-model="address"
          :props="{
            checkStrictly: true,
            value: 'id',
            label: 'name',
            children: 'children',
          }"
          clearable
          filterable
          @change="changeAddress"
        ></el-cascader>
      </el-col> -->
      <el-col :span="5">
        <span>时间：</span>
        <el-date-picker v-model="month" type="month" placeholder="选择月">
        </el-date-picker>
      </el-col>
      <el-col :span="3">
        <el-button type="primary">查询</el-button>
      </el-col>
      <el-col :span="13"></el-col>
      <el-col :span="3">
        <el-button type="primary" @click="backUp">返回</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="50">
      <el-col :span="8" v-for="(el, index) in displayData" :key="index">
        <div
          @click="showDetail(el)"
          style="margin-bottom: 20px; box-shadow: 10px 10px 5px #888888"
        >
          <el-card class="power-card">
            <div slot="header" style="position: relative">
              <div class="card-title">{{ el.roomBFName }}</div>
              <div class="site-percent">{{ el.percentage }}</div>
            </div>
            <div class="dev-address">
              <el-row :gutter="15">
                <el-col :span="24"> 百分比： {{ el.percentage }} </el-col>
                <el-col :span="24"> 得分： {{ el.score }} </el-col>
                <el-col :span="24"> 电压低告警时长： {{ el.time }} </el-col>
                <el-col :span="24">
                  {{ el.devTypeName }}： {{ el.score }}
                </el-col>
              </el-row>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      :visible.sync="dialogVisible"
      width="70%"
      :close-on-click-modal="false"
    >
      <span slot="title" class="dialog-title" style="font-size:24px">{{ dialogInfo.roomBFName }}
      </span>
      <div>
        <el-row :gutter="15" style="font-size:20px">
          <el-col :span="24"
            >直流系统可用度 =
            1-开关电源蓄电池组总电压低告警时长/开关电源蓄电池组数×24小时×30天×60分钟</el-col
          >
          <el-col :span="6"> 百分比： {{ dialogInfo.percentage }} </el-col>
          <el-col :span="6"> 得分： {{ dialogInfo.score }} </el-col>
          <el-col :span="6"> 电压低告警时长： {{ dialogInfo.time }} </el-col>
          <el-col :span="6"> {{ dialogInfo.devTypeName }}： {{ dialogInfo.score }} </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-table :data="devInfo" style="font-size:16px">
          <el-table-column
            type="index"
            label="序号"
            align="center"
            sortable
          ></el-table-column>
          <el-table-column
            prop="siteName"
            align="center"
            label="所属园区"
          ></el-table-column>
          <el-table-column
            prop="buildName"
            align="center"
            label="楼栋"
          ></el-table-column>
          <el-table-column
            prop="floor"
            align="center"
            label="楼层"
          ></el-table-column>
          <el-table-column
            prop="room"
            align="center"
            label="机房"
          ></el-table-column>
          <el-table-column
            prop="devType"
            align="center"
            label="设备类型"
          ></el-table-column>
          <el-table-column
            prop="devName"
            align="center"
            label="设备名称"
          ></el-table-column>
          <el-table-column
            prop="code"
            align="center"
            label="设备编号"
          ></el-table-column>
          <el-table-column
            prop="time"
            align="center"
            label="电压低告警时长（分钟）"
          ></el-table-column>
        </el-table>
        <Pagination
          :page="page"
          :size="size"
          :total="total"
          :key="pageKey"
          @pagination="queryByPage"
        ></Pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false"
          >关 闭</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { sdcSiteAction } from "@/api/sdc/addressInfo";
import {
  sdcDeviceTypeAction,
  getSdcDeviceTypeTree,
} from "@/api/sdc/deviceType";
import { modifyData } from "@/util/domainFilter";
import { getDevInfoBySiteIdAndSys } from "@/api/sdc/deviceInfo";
import moment from "moment";
import Pagination from "@/components/Pagination";

export default {
  components: {
    Pagination,
  },
  data() {
    return {
      condition: [],
      displayData: [
        {
          roomBFName: "直流系统可用度",
          score: "100",
          percentage: "100%",
          type: "1",
          time: 10,
          devTypeName: "开关电源蓄电池组",
          number: 62,
        },
        {
          roomBFName: " 市电可用度",
          score: "90",
          percentage: "90%",
          type: "2",
          time: 10,
          devTypeName: "市电路数",
          number: 22,
        },
        {
          roomBFName: "交流不间断系统可用度",
          score: "95",
          percentage: "95%",
          type: "3",
          time: 10,
          devTypeName: "UPS蓄电池组",
          number: 82,
        },
        {
          roomBFName: "监控可用度",
          score: "95",
          percentage: "95%",
          type: "4",
          time: 10,
          devTypeName: "采集设备数量",
          number: 162,
        },
        {
          roomBFName: "温控系统可用度",
          score: "95",
          percentage: "95%",
          type: "5",
          time: 10,
          devTypeName: "机楼温度测点总数",
          number: 46,
        },
      ],
      address: [],
      month: moment().format("YYYY-MM"),
      dialogVisible: false,
      dialogInfo: {
        roomBFName: null,
          score: null,
          percentage: null,
          type: null,
          time:null ,
          devTypeName: null,
          number: null,
      },
      page: 1,
      size: 5,
      total: 0,
      pageKey: Math.random().toString(36).slice(-6),
      devInfo: [
        {
          siteName:'北京移动研究院',
          buildName:'一栋',
          floor:'一层',
          room:'机房001',
          devType:'基础电池',
          devName:'1#开关电源蓄电池',
          code:'070200001000001',
          time: 20,
        },
        {
          siteName:'北京移动研究院',
          buildName:'一栋',
          floor:'一层',
          room:'机房001',
          devType:'基础电池',
          devName:'2#开关电源蓄电池',
          code:'070200001000002',
          time: 10,
        },
        {
          siteName:'北京移动研究院',
          buildName:'一栋',
          floor:'一层',
          room:'机房001',
          devType:'基础电池',
          devName:'3#开关电源蓄电池',
          code:'070200001000003',
          time: 21,
        },
        {
          siteName:'北京移动研究院',
          buildName:'一栋',
          floor:'一层',
          room:'机房001',
          devType:'基础电池',
          devName:'4#开关电源蓄电池',
          code:'070200001000004',
          time: 2,
        },
        {
          siteName:'北京移动研究院',
          buildName:'一栋',
          floor:'一层',
          room:'机房001',
          devType:'基础电池',
          devName:'5#开关电源蓄电池',
          code:'070200001000005',
          time: 9,
        },
      ],
    };
  },
  created() {
    this.init();
  },
  methods: {
    //初始化获取数据
    async init() {
      //获取区域数据
      let data = await sdcSiteAction("", "/tree", "get");
      this.condition = modifyData(data.data.data);
    },
    async changeAddress(val) {},
    backUp(val) {
      this.$emit("changeComponent", {
        currentComponent: "buildHealth",
      });
    },
    showDetail(val) {
      if(val.type === '1') {
        this.dialogInfo = val;
        this.dialogVisible = true
      }
    },
    queryByPage(){},
  },
};
</script>

<style lang="scss" scoped>
.site-percent {
  position: absolute;
  background-color: #67c23a;
  font-size: 20px;
  text-align: center;
  padding: 5px 10px;
  color: #ffffff;
  right: 0px;
  opacity: 0.9;
  display: inline;
}

.card-title {
  display: inline;
  font-size: 20px;
  color: #ffffff;
}

.dev-info-parent {
  padding-left: 20px;
  min-height: 14px;
  position: relative;
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
  text-align: left;
  font-size: 20px;
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
