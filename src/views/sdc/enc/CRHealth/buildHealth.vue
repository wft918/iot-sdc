<template>
  <div>
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
    <el-row :gutter="15">
      <el-col :span="6" v-for="(el, index) in displayData" :key="index">
        <div @click="changeComponent(el)">
          <el-card class="power-card">
            <div class="dev-info-parent">
              <img :src="el.siteImg" class="image" />
              <div class="site-percent">{{el.percentage}}</div>
            </div>
            <div class="dev-address">
              <el-row :gutter="15">
                <el-col :span="24">
                  <div style="padding: 10px 0">{{ el.roomBFName }}</div>
                </el-col>
                <el-col :span="24" style="font-size: 24px">
                  总得分： {{ el.score }}
                </el-col>
                
              </el-row>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
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
import tspark from "../../../../assets/img/room.png";

export default {
  name: "RoomOverview",
  props: ["systemFlag", "addressId", "typeId"],
  data() {
    return {
      condition: [],
      displayData: [
        {
          roomBFName: "北京移动研究院-第一生产楼",
          siteImg: tspark,
          score: "100",
          percentage: "100%",
        },
        {
          roomBFName: "上海移动研究院-第二研发楼",
          siteImg: tspark,
          score: "90",
          percentage: "90%",
        },
        {
          roomBFName: "山东移动研究院-第一监控楼",
          siteImg: tspark,
          score: "95",
          percentage: "95%",
        },
      ],
      address: [],
      month: moment().format("YYYY-MM"),
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
    async changeAddress(val) {
    },
    changeComponent(val) {
      this.$emit("changeComponent", {
        currentComponent: "healthInfo",
        roomInfo: val,
        addressId: this.address,
      });
    },
    backUp(val) {
      this.$emit("changeComponent", {
        currentComponent: "parkHealth",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.site-percent{
  position: absolute;
    background-color: #409EFF;
    font-size: 20px;
    text-align: center;
    padding: 5px 10px;
    color: #ffffff;
    right: 0px;
    opacity: 0.9;
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
