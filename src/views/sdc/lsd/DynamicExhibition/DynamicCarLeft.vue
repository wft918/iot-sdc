<template>
  <div  style="width: 100%;height: 100%;">
    <div style="width:100%;height:40px;border-bottom: 1px solid #103665;border-top: 1px solid #103665;display: flex;align-items: center;">
      <div class="titleStyle"></div>
      <div class="fontStyle">停车场分区统计</div>
      <div class="endStyle" style="margin-left: 48%;"></div>
      <div class="endStyle" style="margin-left: 3%;"></div>
    </div>
    <div style="width:100%;height:22%;">
      <div style="width:100%;height:calc(100% - 70px);display: flex;align-items: center;">
        <DynamicCarLeft03></DynamicCarLeft03>
      </div>
      <div style="width:100%;height:35px;display: flex;margin-top: -10px;">
       
          <div style="width:33%;height:100%;display: flex;align-items: center;justify-content: center;color:white;font-size: 16px;" v-for="(item,index) in nameList" :key="index">{{item}}</div>

        <!-- <div style="width:33%;height:100%;display: flex;align-items: center;justify-content: center;color:white;font-size: 16px;">{{}}</div>
        <div style="width:33%;height:100%;display: flex;align-items: center;justify-content: center;color:white;font-size: 16px;">B1停车场</div>
        <div style="width:33%;height:100%;display: flex;align-items: center;justify-content: center;color:white;font-size: 16px;">B2停车场</div> -->
      </div>
      <div style="width:100%;height:35px;display: flex;">
        <div style="width:33%;height:100%;display: flex;align-items: center;justify-content: center;color:white;font-size: 16px;font-weight: 800;" v-for="(item,index) in dataList" :key="index">{{item}}</div>
        <!-- <div style="width:33%;height:100%;display: flex;align-items: center;justify-content: center;color:white;font-size: 16px;font-weight: 800;">60/100</div>
        <div style="width:33%;height:100%;display: flex;align-items: center;justify-content: center;color:white;font-size: 16px;font-weight: 800;">30/100</div> -->
      </div>
    </div>
    <div style="width:100%;height:40px;border-bottom: 1px solid #103665;border-top: 1px solid #103665;display: flex;align-items: center;">
      <div class="titleStyle"></div>
      <div class="fontStyle">停车位分析</div>
      <div class="endStyle" style="margin-left: 57%;"></div>
      <div class="endStyle" style="margin-left: 3%;"></div>
    </div>
    <div style="width:100%;height:35%;">
      <div style="width:100%;height:40px;display: flex;align-items: flex-end;">
        <img src="../../../../../public/img/zhfx/blue.png" style="width: 20px; height: 20px;margin-left: 17px;">
        <div style="color: #06a4f7;font-weight: 400;margin-left: 10px;">786</div>
        <img src="../../../../../public/img/zhfx/yellow.png" style="width: 20px; height: 20px;margin-left: 17px;">
        <div style="color: #eba80a;font-weight: 400;margin-left: 10px;">286</div>
      </div>
      <div style="width:100%;height:calc(100% - 40px);">
        <DynamicCarLeft01></DynamicCarLeft01>
      </div>
    </div>
    <div style="width:100%;height:40px;border-bottom: 1px solid #103665;border-top: 1px solid #103665;display: flex;align-items: center;">
      <div class="titleStyle"></div>
      <div class="fontStyle">车辆收费统计</div>
      <div class="endStyle" style="margin-left: 53%;"></div>
      <div class="endStyle" style="margin-left: 3%;"></div>
    </div>
    <div style="width:100%;height:calc(43% - 120px);">
      <div style="width:100%;height:40px;display: flex;align-items: flex-end;">
        <el-button-group class="button-group">
          <el-button
            label="1"
            @click="changeData('1')"
            size="mini"
            :class="btn1"
          >
            今日
          </el-button>
          <el-button
            label="2"
            @click="changeData('2')"
            size="mini"
            :class="btn2"
          >
            近一周
          </el-button>
          <el-button
            label="3"
            @click="changeData('3')"
            size="mini"
            :class="btn3"
          >
            近一月
          </el-button>
        </el-button-group>
      </div>
      <div style="width:100%;height:calc(100% - 40px)">
        <DynamicCarLeft02></DynamicCarLeft02>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
import DynamicCarLeft03 from "./DynamicCarLeft03";
import DynamicCarLeft01 from "./DynamicCarLeft01";
import DynamicCarLeft02 from "./DynamicCarLeft02";
import { getParkingLotZoningStatistics } from "@/api/sdc/lsd";
export default {
  name: "DynamicExhibition",
  components: {
    DynamicCarLeft03,DynamicCarLeft01,DynamicCarLeft02
  },
  data() {
    return {
      btn1: "el-button-2",
      btn2: "el-button-1",
      btn3: "el-button-1",
      data: [12, 5, 5, 40,20,7,6],
      nameList: [],
      dataList: [],
      address: null
    }
  },
  created() {
    this.address = "cff1bf7b5dc745e2ac6f7e9afef531f7"
    this.queryPageData()
  },
  mounted() {
    // this.address = this.siteId
    // this.address = "cff1bf7b5dc745e2ac6f7e9afef531f7"
    // console.log(this.address,'this.address');
    // this.queryPageData()
  },
  methods: {
    async queryPageData() {
      //获取初始区域查询条件数据
      getParkingLotZoningStatistics({ siteId: this.address }).then((res) => {
        if (res.data.code === 0) {
          console.log(res);
          this.nameList = res.data.data.paramname
          this.dataList = res.data.data.value
        }
      });
    },
    changeData(val) {
      switch (val) {
        case "1":
          this.data = [12, 5, 5, 40,20,7,6];
          this.btn1 = "el-button-2";
          this.btn2 = this.btn3 = "el-button-1";
          break;
        case "2":
          this.data = [22, 15, 1, 20,10,17,36];
          this.btn2 = "el-button-2";
          this.btn1 = this.btn3 = "el-button-1";
          break;
        case "3":
          this.data = [2, 35, 21, 40,30,7,6];
          this.btn3 = "el-button-2";
          this.btn2 = this.btn1 = "el-button-1";
          break;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.emg-count {
  width: 100%;
  height: 25%;
}
.text-body {
  top: 2rem;
  height: 80%;
}
.text-row2 {
  height: 58%;
  width: 50%;
  font-size: 1.125rem;
  display: flex;
  justify-items: center;
  align-items: center;
  border: 6px solid #6ec0ff;
  color: #6ec0ff;
  border-radius: 50%;
}
.emgCountChart {
  width: 100%;
  height: 200px;
  padding: 0 0 1rem 1rem;
  position: relative;
  top: 20px;
  color: #ffffff;
}
.button-group {
  display: inline;
  position: absolute;
  margin-left: 47%;
}

.el-button-1{
  background: rgba(0,0,0,0.4);
  color: white;
  opacity: 1;
}

.el-button:focus, .el-button:hover{
    background: #59b6d9;
    color: #ffffff;
    opacity: 1;
}

.bottomChart {
  width: 100%;
  height: 220px;
  position: relative;
  top: 20px;
  color: #ffffff;
}

// .bg1Class{
//     background: url("../../../../../public/img/zhfx/bg1.png") center no-repeat;
//     background-size:contain;
//     /* 随便设置宽高值，测试 */
//     width:100%;
//     height:100%;
//     /* 设置默认样式，开启3d硬件加速 */
//     -webkit-transform:translate3d(0,0,0);
//     -moz-transform:translate3d(0,0,0);
//     transform:translate3d(0,0,0);
//     /* 设置动画，animation:动画名称 动画播放时长单位秒或微秒 动画播放的速度曲线linear为匀速 动画播放次数infinite为循环播放; */
//     -webkit-animation:play 13s linear infinite;
//     -moz-animation:play 13s linear infinite;
//     animation:play 13s linear infinite;
// }

.bgClassT{
  background: url("../../../../../public/img/zhfx/border16.png") center no-repeat;
  background-size:100% 80%;
}
</style>