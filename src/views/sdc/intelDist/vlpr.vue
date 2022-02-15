<template>
  <div>
    <basic-container>
      <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="人脸识别结果查询" name="1"> -->
      <el-row :gutter="15">
        <el-col :span="6">
          <span>时 间：</span>
          <el-date-picker
            v-model="dueDate"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            style="width: 80%"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="5">
          <span>人脸库：</span>
          <el-select placeholder="请选择人脸库" v-model="faces">
            <el-option
              v-for="item in facesList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <span>证件号：</span>
          <el-input v-model="cardNo" style="width: 60%"></el-input>
        </el-col>
        <el-col :span="6">
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
        <el-col :span="3">
          <el-button type="primary" @click="queryInfo">
            <i class="el-icon-search"></i> 查询
          </el-button>
          <el-button type="primary" @click="clearCondition">
            <i class="el-icon-delete"></i> 清空
          </el-button>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px" :gutter="15">
        <el-col :span="8">
          <el-row style="height: 630px; overflow-y: auto; overflow-x: hidden">
            <el-col class="titles"> 查询结果 </el-col>
            <el-col
              :span="24"
              v-for="(item, index) in vlprInfo"
              :key="index"
              class="info"
            >
              <!-- <el-card> -->
              <el-row :gutter="15">
                <el-col :span="24">
                  {{item.comparisonTime}}
                </el-col>
                <el-col :span="14" style="display: flex;">
                  <template>
                    <el-image
                      :src="item.smallPic"
                      style="width: 100%"
                      v-if="item.smallPic"
                    ></el-image>
                    <el-image
                      :src="defaltImg"
                      style="width: 100%"
                      v-else
                    ></el-image>
                  </template>
                  <template >
                    <el-image
                      :src="item.personPic"
                      style="width: 100%;margin-left:10px"
                      v-if="item.personPic"
                    ></el-image>
                    <el-image
                      :src="defaltImg"
                      style="width: 100%;margin-left:10px"
                      v-else
                    ></el-image>
                  </template>
                </el-col>
                <!-- <el-col :span="7">
                  <el-image
                    :src="item.smallPic"
                    style="width: 100%"
                    v-if="item.smallPic"
                  ></el-image>
                  <el-image
                    :src="defaltImg"
                    style="width: 100%"
                    v-else
                  ></el-image>
                </el-col>
                <el-col :span="7">
                  <el-image
                    :src="item.personPic"
                    style="width: 100%"
                    v-if="item.personPic"
                  ></el-image>
                  <el-image
                    :src="defaltImg"
                    style="width: 100%"
                    v-else
                  ></el-image>
                </el-col> -->
                <el-col :span="10">
                  <div class="message">
                    <div>{{ item.personName || "未知" }} {{ item.type | faceTypeFilter }}</div>
                    <br />
                    <div>人脸库 : {{ item.fname || "未知" }}</div>
                    <br />
                    <div>相似度 : {{ item.similarity * 100 || "0" }}%</div>
                    <br />
                    <div
                      style="color: #3a8ee6; cursor: pointer"
                      @click="showDetail(item)"
                    >
                      详情 <i class="el-icon-d-arrow-right"></i>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <!-- </el-card> -->
            </el-col>
            <el-col :span="24">
                    <Pagination
                      :page="page"
                      :size="size"
                      :total="total"
                      :key="pageKey"
                      @pagination="queryByPage"
                    ></Pagination>
                  </el-col>
          </el-row>
        </el-col>
        <el-col :span="16" style="height: 630px; overflow-y: auto; overflow-x: hidden">
          <el-row :gutter="15">
            <el-col class="titles"> 视频回放 </el-col>
          </el-row>

          <LivePlayer
            :videoUrl="videoUrl"
            fluent
            autoplay
            live
            stretch
          ></LivePlayer>
          <div style="display: flex; align-items: center">
            <!-- <i
              class="el-icon-arrow-left"
              style="font-size: 40px; cursor: pointer"
              @click="preImg"
            ></i> -->
            <template v-for="(item, index) in imginfo">
              <img :src="item" alt="" :key="index" style="margin: 20px 10px 0 0" />
            </template>
            <!-- <i
              class="el-icon-arrow-right"
              style="font-size: 40px; cursor: pointer"
              @click="nextImg"
            ></i> -->
          </div>
          <div>
            <!-- <el-slider v-model="value" range :max="24"> </el-slider> -->
          </div>
        </el-col>
      </el-row>
      <el-dialog
        title="查询结果详情"
        :visible.sync="detailVisible"
        width="60%"
        :close-on-click-modal="false"
      >
        <el-row :gutter="15">
          <el-col :span="10">
            <el-row :gutter="15">
              <el-col :span="24"> 检索条件 </el-col>
              <el-col :span="24">
                <el-row :gutter="15">
                  <el-col :span="8">
                    <img
                      :src="detailInfo.smallPic"
                      alt="图片"
                      style="margin-top: 20px;width:100%"
                      v-if="detailInfo.smallPic"
                    />
                    <el-image :src="defaltImg" style="width:100%" v-else></el-image>
                  </el-col>
                  <el-col :span="8" style="margin-top: 10%">
                    相似度：{{ detailInfo.similarity * 100 }}%
                  </el-col>
                  <el-col :span="8">
                    <img
                      :src="detailInfo.personPic"
                      alt="图片"
                      style="margin-top: 20px;width:100%"
                      v-if="detailInfo.personPic"
                    />
                    <el-image :src="defaltImg" style="width:100%" v-else></el-image>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="24">
                <el-row :gutter="15">
                  <el-col :span="12">
                    姓名：{{ detailInfo.personName || "未知"}}
                  </el-col>
                  <!-- <el-col :span="12">
                      职位：保安
                    </el-col> -->
                  <el-col :span="12">
                    电话：{{ detailInfo.personPhone || "未知"}}
                  </el-col>
                  <el-col :span="12">
                    证件号：{{ detailInfo.personCardNo || "未知"}}
                  </el-col>
                  <el-col :span="12">
                    抓拍地：{{ detailInfo.siteName || "未知"}}
                  </el-col>
                  <el-col :span="12">
                    时间：{{ detailInfo.comparisonTime || "未知"}}
                  </el-col>
                  <el-col :span="24">
                    <div>抓拍照片</div>
                    <img
                      :src="detailInfo.bigPic"
                      alt=""
                      style="margin-top: 20px;width:100%"
                    />
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="14">
            <el-row :gutter="15">
              <el-col> 视频回放 </el-col>
            </el-row>

            <LivePlayer
              :videoUrl="videoUrl"
              fluent
              autoplay
              live
              stretch
            ></LivePlayer>
            <div style="margin-top:10px">
              <div>抓拍照片：</div>
              <img :src="detailInfo.bigPic" alt="" style="margin-top: 20px;width:100%" />
            </div>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <!-- <el-button @click="deleteData">确 定</el-button> -->
          <el-button type="primary" @click="detailVisible = false"
            >关 闭</el-button
          >
        </span>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import LivePlayer from "@liveqing/liveplayer";
import { getSdcDeviceTable } from "@/api/sdc/deviceInfo";

import { getSdcPRTable } from "@/api/sdc/deployrule";
import { getFaceDataList } from "@/api/sdc/faceData";

import avatar01 from "../../../assets/img/avatar01.png";

import { sdcSiteAction } from "@/api/sdc/addressInfo";
import { modifyData,faceTypeFilter } from "@/util/domainFilter";

export default {
  components: {
    LivePlayer,
    Pagination,
  },
  filters: {
    faceTypeFilter
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
      imgArray: [],
      imginfo: [],
      imgflag: 0,
      value: [10, 12],
      vlprInfo: [],
      plateInfo: [],
      activeName: "1",
      type: "1",
      faces: [],
      facesList: [],
      detailVisible: false,
      queryCondition: {},
      page: 1,
      size: 10,
      total: 0,
      detailInfo: {
        bigPic: null,
        similarity: null,
        personPic: null,
        personName: null,
        personPhone: null,
        personCardNo: null,
        siteName: null,
        comparisonTime: null,
        smallPic: null,
      },
      pageKey: Math.random().toString(36).slice(-6),
      condition: [],
      address: [],
      defaltImg: avatar01,
      cardNo: null
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

      getSdcDeviceTable({ videoType: "1" }).then((res) => {
        $.get("http://" + this.url + ":" + this.port + "/api/v1/stream/start", {
          serial: res.data.data.records[0].devicechannel,
          code: res.data.data.records[0].channel,
        }).then((data) => {
          this.videoUrl = data.WS_FLV;
        });
      });
      //查询人脸库
      getFaceDataList(1, 200).then((res) => {
        let data = res.data.data;
        console.log(data);
        if (res.status === 200) {
          for (let index = 0; index < data.records.length; index++) {
            const el = data.records[index];
            this.facesList.push({
              value: el.id,
              label: el.name,
            });
          }
        } else {
          return this.$message.error("获取人脸库数据出错，请重试");
        }
      });

      this.queryInfo();
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
      this.vlprInfo = data.data.data.records;
      console.log(this.vlprInfo);
      this.total = data.data.data.total
      for (let index = 0; index < this.vlprInfo.length; index++) {
        const element = this.vlprInfo[index];
        console.log(element,'99999999999999999999999999',element.smallPic);
         element.smallPic !== null ?  this.imginfo[index] = element.smallPic : null
        
      }
      console.log(this.imginfo);
      console.log(data);
    },
    setQueryCondition() {
      this.queryCondition = {
        current: this.page,
        size: this.size,
      };
      this.faces ? this.queryCondition.fdLocalId = this.faces : null
      this.cardNo ? this.queryCondition.personCardNo = this.cardNo : null
      this.address.length !== 0 ? this.queryCondition.siteId = this.address[this.address.length - 1] : null
    },
    clearCondition() {
      this.queryCondition = {
        current: this.page,
        size: this.size,
      };
      this.faces = null
      this.cardNo = null
      this.address = []
    },
    showDetail(item) {
      console.log(item, "999999999");
      this.detailInfo = item;
      this.detailVisible = true;
    },
    setBigPic(val) {
      console.log(val, "222222222");
    },
    queryByPage(data) {
      this.page = data.page
      this.size = data.size
      this.queryInfo()
    },
    async changeAddress(val) {},
  },
};
</script>

<style lang="scss">
.info {
  .el-card__body {
    display: flex;
    align-items: center;
  }
}

.message {
  margin-left: 20px;
}

.titles {
  background-color: #409EFF;
  padding: 5px 10px;
  font-size: 24px;
  color: #ffffff;
  margin-bottom: 20px;
}
</style>