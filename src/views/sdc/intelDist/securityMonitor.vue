<template>
  <div>
    <basic-container>
      <el-row :gutter="15">
        <el-col :span="7">
          <span>区域：</span>
          <el-cascader
            ref="siteChoose"
            :options="condition"
            style="width: 80%"
            v-model="address"
            clearable
            filterable
            @change="changeAddress"
            :props="{
              checkStrictly: true,
              value: 'id',
              label: 'name',
              children: 'children',
            }"
          >
          </el-cascader>
        </el-col>
        <el-col :span="5">
          <el-radio-group
            v-model="radioBtn"
            class="dev-radio"
            @change="changeComponent"
          >
            <el-radio-button label="1"> 全部 </el-radio-button>
            <el-radio-button label="2"> 越界识别 </el-radio-button>
            <el-radio-button label="3"> 烟火识别 </el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col :span="6">
          <span>时间范围：</span>
          <el-date-picker
            v-model="dueDate"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            style="width: 70%"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="queryInfo">
            <i class="el-icon-search"></i> 查询
          </el-button>
          <el-button type="primary" @click="clearCondition">
            <i class="el-icon-delete"></i> 清空
          </el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col> 安全监控 </el-col>
        <el-col
          :span="6"
          v-for="(item, index) in tableData"
          :key="index"
        >
          <el-card shadow="always">
            <div>
              <div style="display: inline;">{{item.comparisonTime}}</div>
              <div style="display: inline;margin-left: 25px;">
                <!-- <el-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start">
                  <el-button>上左</el-button>
                </el-tooltip> -->
                <el-button type="primary" icon="el-icon-bell" circle></el-button>
                <el-button type="primary" icon="el-icon-full-screen" circle></el-button>
                <el-button type="primary" icon="el-icon-setting" circle></el-button>
                <el-button type="primary" icon="el-icon-notebook-2" circle></el-button>
              </div>
            </div>
            <div style="margin-top:10px">
              <LivePlayer
                :videoUrl="item.videoUrl"
                fluent
                autoplay
                live
                stretch
              ></LivePlayer>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <Pagination
        :page="page"
        :size="size"
        :total="total"
        :key="pageKey"
        @pagination="queryByPage"
      ></Pagination>
    </basic-container>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import LivePlayer from "@liveqing/liveplayer";
import { getSdcNVRInfo } from "@/api/sdc/deviceInfo";

import air01 from "../../../assets/img/air01.png";

import { sdcSiteAction } from "@/api/sdc/addressInfo";
import { modifyData } from "@/util/domainFilter";
import { getSdcPRTable } from "@/api/sdc/deployrule";

export default {
  components: {
    LivePlayer,
    Pagination,
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      dueDate: "",
      videoUrl: null,
      url: this.$dictUtils.getDictValue("vedio_param", "url_ip", ""),
      port: this.$dictUtils.getDictValue("vedio_param", "port", ""),
      imgArray: [
        [air01, air01, air01, air01, air01, air01, air01, air01, air01, air01],
        [air01, air01, air01, air01, air01, air01, air01, air01, air01, air01],
        [air01, air01, air01, air01, air01, air01, air01, air01, air01, air01],
      ],
      imginfo: [],
      imgflag: 0,
      value: [10, 12],
      vlprInfo: [
        {
          url1: air01,
          url2: air01,
          name: "张正己",
          type: "白名单",
          class: "部门1",
          base: "人脸库2",
          per: "99%",
        },
        {
          url1: air01,
          url2: air01,
          name: "陈坤",
          type: "黑名单",
          class: "部门2",
          base: "人脸库1",
          per: "99%",
        },
        {
          url1: air01,
          url2: air01,
          name: "张济",
          type: "白名单",
          class: "部门3",
          base: "人脸库2",
          per: "99%",
        },
        {
          url1: air01,
          url2: air01,
          name: "张济",
          type: "白名单",
          class: "部门3",
          base: "人脸库2",
          per: "99%",
        },
        {
          url1: air01,
          url2: air01,
          name: "张济",
          type: "白名单",
          class: "部门3",
          base: "人脸库2",
          per: "99%",
        },
        {
          url1: air01,
          url2: air01,
          name: "张济",
          type: "白名单",
          class: "部门3",
          base: "人脸库2",
          per: "99%",
        },
        {
          url1: air01,
          url2: air01,
          name: "张济",
          type: "白名单",
          class: "部门3",
          base: "人脸库2",
          per: "99%",
        },
      ],
      plateInfo: [
        {
          url1: air01,
          url2: air01,
          name: "张正己",
          type: "月租车",
          number: "京BDG828",
          per: "99%",
        },
        {
          url1: air01,
          url2: air01,
          name: "陈坤",
          type: "月租车",
          number: "京BDG628",
          per: "99%",
        },
        {
          url1: air01,
          url2: air01,
          name: "张济",
          type: "月租车",
          number: "京BD6F28",
          per: "99%",
        },
      ],
      activeName: "1",
      type: "1",
      faces: [],
      facesList: [
        { label: "5251", value: "0" },
        { label: "6452", value: "1" },
        { label: "3321", value: "2" },
      ],
      detailVisible: false,
      resultImg: air01,

      address: null,
      condition: [],
      radioBtn: 1,
      page: 0,
      size: 10,
      total: 0,
      pageKey: Math.random().toString(36).slice(-6),
      queryCondition: {},
      tableData: null
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      //获取初始区域查询条件数据
      let data = await sdcSiteAction("", "/tree", "get");
      this.condition = modifyData(data.data.data);
      this.queryInfo();
      

      
      this.imginfo = this.imgArray[this.imgflag];
    },
    preImg() {
      if (this.imgflag > 0) {
        console.log(22222222222);
        this.imgflag -= 1;
        this.imginfo = this.imgArray[this.imgflag];
      }
    },
    nextImg() {
      if (this.imgflag < this.imgArray.length) {
        console.log(11111111111);
        this.imgflag += 1;
        this.imginfo = this.imgArray[this.imgflag];
      }
    },
    async queryInfo() {
      this.setQueryCondition();
      let data = await getSdcPRTable(this.queryCondition);
      this.tableData = data.data.data.records;
      for (let index = 0; index < this.tableData.length; index++) {
        const el = this.tableData[index];
        getSdcNVRInfo(el.nvrId).then((res) => {
          console.log(res);
          $.get("http://" + this.url + ":" + this.port + "/api/v1/stream/start", {
            serial: res.data.data.devicechannel,
            code: res.data.data.channel,
          }).then((data) => {
            this.videoUrl = data.WS_FLV;
            // for (let index = 0; index < this.vlprInfo.length; index++) {
              // const el = this.vlprInfo[index];
              el.videoUrl = this.videoUrl
            // }
          });
        });
      }
      console.log(data);
    },
    setQueryCondition() {
      this.queryCondition = {
        current: this.page,
        size: this.size,
      };
    },
    clearCondition() {},
    showDetail() {
      this.detailVisible = true;
    },
    async changeAddress(val) {},
    changeComponent() {},
    queryByPage() {

    }
  },
};
</script>

<style lang="scss">

.message {
  margin-left: 20px;
}
</style>