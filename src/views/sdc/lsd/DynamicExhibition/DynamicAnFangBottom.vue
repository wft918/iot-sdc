<template>
  <div style="width: 100%; height: 100%">
    <div
      style="
        width: 100%;
        height: 40px;
        border-bottom: 1px solid #103665;
        border-top: 1px solid #103665;
        display: flex;
        align-items: center;
      "
    >
      <div class="titleStyle"></div>
      <div class="fontStyle">告警列表</div>
      <div class="endStyle" style="margin-left: 86%"></div>
      <div class="endStyle" style="margin-left: 1%"></div>
    </div>
    <div class="abc" style="width: 100%; height: calc(100% - 40px)">
      <el-table :data="allAlarmInfo" :cell-class-name="cellClass" height="200">
        <el-table-column
          prop="nmalarmId"
          label="告警ID"
          align="center"
          sortable
        ></el-table-column>
        <el-table-column
          prop="deviceCode"
          label="设备编号"
          align="center"
          width="60px"
        ></el-table-column>
        <el-table-column
          prop="deviceName"
          label="设备名称"
          align="center"
          width="60px"
        ></el-table-column>
        <el-table-column
          prop="alarmLevel"
          label="告警等级"
          align="center"
          :formatter="setLevel"
        ></el-table-column>
        <el-table-column
          prop="dealStatus"
          label="告警状态"
          align="center"
          :formatter="setStatus"
        ></el-table-column>
        <el-table-column
          prop="alarmTypeDesc"
          label="告警分类"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="alarmCodeDesc"
          label="告警标准名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="alarmDesc"
          label="告警详情"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="alarmTime"
          label="告警上报时间"
          align="center"
          width="90px"
        ></el-table-column>
        <el-table-column
          prop="alarmEndTime"
          label="告警消除时间"
          align="center"
          width="90px"
        ></el-table-column>
        <el-table-column
          prop="eventValue"
          label="参数值"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="siteName"
          label="所属位置"
          align="center"
          width="150px"
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <span
              class="table-action"
              @click="deviceAction(scope.row, 1)"
              v-if="scope.row.dealStatus === '0'"
              >确认</span
            >
            <!-- <span
                    class="table-action"
                    @click="deviceAction(scope.row,2)"
                    v-if="scope.row.dealStatus === '1'"
                    >消除</span
                  > -->
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        :page="allAlarmPage"
        :size="allAlarmSize"
        :total="allAlarmTatal"
        @pagination="queryByPage"
        style="opacity: 0.5;"
      ></Pagination>
    </div>
  </div>
</template>

<script>
import echarts from "echarts/lib/echarts";
import { getAlarmLog, updateAlarmLog } from "@/api/sdc/deviceInfo";
import Pagination from "@/components/Pagination";
import moment from "moment";

export default {
  name: "DynamicExhibition",
  components: {
    Pagination,
  },
  data() {
    return {
      allAlarmPage: 1,
      allAlarmSize: 2,
      allAlarmTatal: 0,
      allAlarmKey: Math.random().toString(36).slice(-6),
      allAlarmInfo: null,
    };
  },
  created() {
    this.queryAlarmLog();
    this.getAllInfo();
  },
  destroyed() {
    clearInterval(this.$store.state.user.lsdRealTimer);
  },
  mounted() {
    let that = this;
  },
  methods: {
    getAllInfo() {
      this.$store.state.user.lsdRealTimer = setInterval(async () => {
        this.queryAlarmLog();
      }, 5000);
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
    async queryAlarmLog() {
      let queryAllData = await getAlarmLog({
        current: this.allAlarmPage,
        size: this.allAlarmSize,
      });
      this.allAlarmInfo = queryAllData.data.data.records;
      this.allAlarmKey = new Date().toString();
      this.setpage(queryAllData.data.data);
    },
    queryByPage(data) {
      this.allAlarmPage = data.page;
      this.allAlarmSize = data.size;
      this.queryAlarmLog();
    },
    setpage(data) {
      this.allAlarmPage = data.current;
      this.allAlarmSize = data.size;
      this.allAlarmTatal = data.total;
    },
    //表格栏位颜色
    cellClass({ row, column, rowIndex, columnIndex }) {
      let alarmTime = moment(row.alarmTime);
      let now = moment();
      if (columnIndex === 3) {
        if (row.alarmLevel === "1") {
          if (now.diff(alarmTime, "seconds") < 30 && row.dealStatus === "0") {
            return "new-alarm";
          } else {
            return "alarm1";
          }
        } else if (row.alarmLevel === "2") {
          if (now.diff(alarmTime, "seconds") < 30 && row.dealStatus === "0") {
            return "new-alarm";
          } else {
            return "alarm2";
          }
        } else if (row.alarmLevel === "3") {
          if (now.diff(alarmTime, "seconds") < 30 && row.dealStatus === "0") {
            return "new-alarm";
          } else {
            return "alarm3";
          }
        } else if (row.alarmLevel === "4") {
          if (now.diff(alarmTime, "seconds") < 30 && row.dealStatus === "0") {
            return "new-alarm";
          } else {
            return "alarm4";
          }
        }
      }
    },
    setLevel(row) {
      let plateColorMap = this.$dictUtils.getDictList("alarm_level");
      let rowText;
      for (let i = 0; i < plateColorMap.length; i++) {
        let el = plateColorMap[i];
        if (el.value === row.alarmLevel) {
          rowText = el.label;
          break;
        }
      }
      return rowText;
    },
    setStatus(row) {
      let plateColorMap = this.$dictUtils.getDictList("tele_alarm_deal_status");
      let rowText;
      for (let i = 0; i < plateColorMap.length; i++) {
        let el = plateColorMap[i];
        if (el.value === row.dealStatus) {
          rowText = el.label;
          break;
        }
      }
      return rowText;
    },
    deviceAction(val, flag) {
      let data = val;
      data.dealStatus = flag === 1 ? "1" : "2";
      updateAlarmLog(data).then((res) => {
        this.queryAlarmLog();
      });
    },
  },
};
</script>
<style  lang="scss">
.el-table .alarm1 {
  color: #990000;
}
.el-table .alarm2 {
  color: #bb0000;
}
.el-table .alarm3 {
  /* background-color: #cc0000; */
  color: #cc0033;
}
.el-table .alarm4 {
  /* background-color: #dd0000; */
  color: #ff0066;
}

.el-table .new-alarm {
  /* background-color: #cc0000; */
  background: #aa0000;
  animation: mymove 3s infinite;
  /*Safari 和 Chrome:*/
  -webkit-animation: mymove 3s infinite;
  color: #ffffff;
}

/* Chrome, Safari, Opera */
@-webkit-keyframes mymove {
  50% {
    background-color: #ff0033;
  }
}

/* Standard syntax */
@keyframes mymove {
  50% {
    background-color: #ff0033;
  }
}

.abc {
  // .el-table .warning-row {
  // background: oldlace;
  // }

  // .abc.el-table .success-row {
  //   background: #f0f9eb;
  // }

  .el-table thead {
    color: white;
  }

  .el-table {
    color: white;
  }

  .el-table th,
  .el-table tr {
    background-color: transparent;
  }

  .el-table,
  .el-table__expanded-cell {
    background-color: transparent;
  }

  //   .el-table--enable-row-hover .el-table__body tr:hover>td{
  //     background-color: red !important;
  //   }

  //   .el-table__body tr:hover>td{
  //   background-color: red !important;
  // }

  // .el-table__body tr.current-row>td{
  //   background-color: red !important;
  // }
  .el-table tbody tr:hover > td {
    background-color: rgba(255, 255, 255, 0.1) !important;
  }

  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .el-table th > .cell {
    color: #48ece7;
    font-weight: 400;
  }

  /*
*改变浏览器默认的滚动条样式
*/
  .el-table__body-wrapper::-webkit-scrollbar-track-piece {
    background-color: rgba(3, 19, 60, 1);
  }
  .el-table__body-wrapper::-webkit-scrollbar {
    width: 6px;
  }
  .el-table__body-wrapper::-webkit-scrollbar-thumb {
    background-color: #dddddd;
    border-radius: 100px;
  }
  .el-table__body-wrapper::-webkit-scrollbar-thumb:hover {
    background-color: #bbb;
  }
}
.abc ::v-deep .el-table__body tr:hover > td {
  background-color: transparent !important;
}
</style>
<style lang="scss" scoped>
//   .tableTransparent /deep/  .el-table, .el-table__expanded-cell {
//     background-color: transparent;
// }

// .tableTransparent /deep/ .el-table tr {
//     background-color: rgba(255, 255, 255, 0.1 ) !important;
// }
// .tableTransparent >>> .el-table th{
//     background-color: rgba(245,247,250, 0.5 ) !important;
// }
// .tableTransparent >>> .el-table tr:hover {
//     background: rgba(245,247,250, 0.1 ) !important;
// }

// .el-table--enable-row-hover .el-table__body tr:hover>td{
//     background-color: red !important;
//   }

//   .el-table__body tr:hover>td{
//   background-color: red !important;
// }

// .el-table__body tr.current-row>td{
//   background-color: red !important;
// }

//   .el-table tbody tr:hover>td {
//     background-color:red !important
// }

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

.el-button-1 {
  background: rgba(0, 0, 0, 0.4);
  color: white;
  opacity: 1;
}

.el-button:focus,
.el-button:hover {
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

.bgClassT {
  background: url("../../../../../public/img/zhfx/border16.png") center
    no-repeat;
  background-size: 100% 80%;
}
</style>