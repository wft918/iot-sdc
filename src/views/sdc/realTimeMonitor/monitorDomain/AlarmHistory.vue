<template>
  <div>
    <el-table
      :data="oneAlarmInfo.records"
      :cell-class-name="cellClass"
    >
      <el-table-column 
        prop="alarmLevel"
        label="告警等级"
        align="center"
        sortable
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
        prop="alarmTime"
        label="告警上报时间"
        align="center"
      ></el-table-column>
      <el-table-column 
        prop="alarmEndTime"
        label="告警消除时间"
        align="center"
      ></el-table-column>
    </el-table>
    <HistoryPagination
      :page="oneAlarmInfo.current"
      :size="oneAlarmInfo.size"
      :total="oneAlarmInfo.total"
      @pagination="queryByPage"
    ></HistoryPagination>
  </div>
</template>

<script>
import eventBus from "@/util/eventBus";
import moment from "moment";
import HistoryPagination from "@/components/HistoryPagination";

export default {
  name: 'AlarmHistory',
  props:['oneAlarmInfo'],
  components: {
    HistoryPagination,
  },
  data() {
    return {
    }
  },
  methods: {
    queryByPage(data) {
      if(this.oneAlarmInfo.records.length !== 0) {
        eventBus.$emit('queryAlarmByPage',{
          id: this.oneAlarmInfo.records[0].deviceCode,
          page: data.page,
          size: data.size,
        })
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
    //表格栏位颜色
    cellClass({ row, column, rowIndex, columnIndex }) {
      let alarmTime = moment(row.alarmTime)
      let now = moment()
      if (columnIndex === 0) {
        if (row.alarmLevel === "1") {
          if (now.diff(alarmTime, "seconds") < 30 && row.dealStatus === '0') {
            return "new-alarm";
          } else {
            return "alarm1";
          }
        } else if (row.alarmLevel === "2") {
          if (now.diff(alarmTime, "seconds") < 30 && row.dealStatus === '0') {
            return "new-alarm";
          } else {
            return "alarm2";
          }
        } else if (row.alarmLevel === "3") {
          if (now.diff(alarmTime, "seconds") < 30 && row.dealStatus === '0') {
            return "new-alarm";
          } else {
            return "alarm3";
          }
        } else if (row.alarmLevel === "4") {
          if (now.diff(alarmTime, "seconds") < 30 && row.dealStatus === '0') {
            return "new-alarm";
          } else {
            return "alarm4";
          }
        }
      }
    },
  }
}
</script>

<style>
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
</style>