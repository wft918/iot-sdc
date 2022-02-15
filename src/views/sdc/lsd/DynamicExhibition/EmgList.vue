<template>
  <section class="content-table">
    <div class="text-title">
      <!-- <dv-border-box-13 class="body-left"> -->
      <!-- <div class="body-left"> -->
      <div class="text-header">
        <span>告警统计</span>
      </div>
      <div class="text-body">
        <table style="width: 100%">
          <thead>
            <tr style="color: #43dcff;text-align: center;">
              <th class="emg-td1">序号</th>
              <th class="emg-td2">类别</th>
              <th class="emg-td3">时间</th>
              <th class="emg-td4">地点</th>
              <th class="emg-td5">级别</th>
              <th class="emg-td6">内容</th>
              <th class="emg-td7">处理状态</th>
            </tr>
          </thead>
          <!-- </table> -->
          <!-- <vue-seamless-scroll
              :data="emgCountTableData"
              :class-option="classOption"
              class="seamless-warp"
            >
            <ul> -->
          <!-- <li v-for="(item, index) in emgCountTableData" :key="index"> -->
          <!-- <table style="width: 100%"> -->
          <tr v-for="(item, index) in emgCountTableData" :key="index">
            <td class="emg-td1">{{ index + 1 }}</td>
            <td class="emg-td2">{{ item.type }}</td>
            <td class="emg-td3">{{ item.time }}</td>
            <td class="emg-td4">{{ item.place }}</td>
            <td class="emg-td5">{{ item.level | levelFilter}}</td>
            <td class="emg-td6">{{ item.content }}</td>
            <td class="emg-td7">{{ item.handleStatus | handleStatusFilter }}</td>
          </tr>
        </table>
        <!-- </li> -->
        <!-- </ul> -->
        <!-- </vue-seamless-scroll> -->
      </div>
      <!-- </dv-border-box-13> -->
      <!-- </div> -->
      <!-- <dv-border-box-13 class="body-right"> -->
    </div>
  </section>
</template>

<script>
import { levelFilter,handleStatusFilter } from "@/util/domainFilter";
export default {
  name: "EmgList",
  filters: {
    levelFilter,
    handleStatusFilter
  },
  data() {
    return {
      loading: false,
      emgCountTableData: [
        {
          type: "停车告警",
          time: "2021-03-15 14:22:55",
          place: "A区地面",
          level: "1",
          content: "禁停区域停放机动车",
          handleStatus: "1",
        },
        {
          type: "停车告警",
          time: "2021-03-15 14:23:05",
          place: "A区地面",
          level: "2",
          content: "禁停区域停放机动车",
          handleStatus: "2",
        },
        {
          type: "停车告警",
          time: "2021-03-15 14:23:25",
          place: "A区地面",
          level: "1",
          content: "禁停区域停放机动车",
          handleStatus: "2",
        },
        {
          type: "停车告警",
          time: "2021-03-15 14:23:55",
          place: "A区地面",
          level: "2",
          content: "禁停区域停放机动车",
          handleStatus: "1",
        },
        {
          type: "停车告警",
          time: "2021-03-15 14:24:55",
          place: "A区地面",
          level: "1",
          content: "禁停区域停放机动车",
          handleStatus: "1",
        },
        // {
        //   type: "停车告警",
        //   time: "2021-03-15 14:25:55",
        //   place: "A区地面",
        //   level: "1",
        //   content: "禁停区域停放机动车",
        //   handleStatus: "2",
        // },
        // {
        //   type: "停车告警",
        //   time: "2021-03-15 14:26:55",
        //   place: "A区地面",
        //   level: "2",
        //   content: "禁停区域停放机动车",
        //   handleStatus: "1",
        // },
      ],
    };
  },
  computed: {
    classOption() {
      return {
        // 数值越大速度滚动越快
        step: 0.8,
        // 开始无缝滚动的数据量
        // limitMoveNum: this.emgCountTableData.length,
        limitMoveNum: 6,
        // 是否开启鼠标悬停
        hoverStop: true,
        // 0向下 1向上 2向左 3向右
        direction: 1,
        // 开启数据实时监控刷新dom
        openWatch: true,
        // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleHeight: 0,
        // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        singleWidth: 0,
        // 单步运动停止的时间(默认值1000ms)
        waitTime: 1000,
      };
    },
  },
  mounted() {},
  methods: {
  },
};
</script>

<style lang="scss" scoped>
.content-table {
  width: 100%;
  height: 100%;
  margin-left: 1.5rem;
}
// .text-title {
//   width: 100%;
//   height: 100%;
//   display: flex;
//   flex-direction: row;

//   .text-header {
//     text-align: left;
//     padding: 0 0 0 1rem;
//     position: relative;
//     top: 1rem;
//     color: #ffffff;
//     width: 100%;
//     height: 20%;
//     font-size: 1rem;
//     background-image: url('../assets/title.png');
//   }
.text-body {
  position: relative;
  top: 1.5rem;
  width: 100%;
  height: 80%;
  display: flex;
  flex-direction: row;
  color: #ffffff;

  tr {
    width: 100%;
    height: 39px;
    font-size: 12px;
    text-align: center;

    th {
      text-align: center;
    }
  }
  tr:nth-child(even) {
    text-align: center;
    background: rgba(0,0,0,0.3);//#151928;
  }
  .emg-td1 {
    width: 5%;
  }
  .emg-td2 {
    width: 15%;
  }
  .emg-td3 {
    width: 20%;
  }
  .emg-td4 {
    width: 15%;
  }
  .emg-td5 {
    width: 10%;
  }
  .emg-td6 {
    width: 20%;
  }
  .emg-td7 {
    width: 15%;
  }
}
// }
.seamless-warp {
  width: 1030px;
  overflow: hidden;
}

.button-group {
  display: inline;
  position: absolute;
  margin-left: 9rem;
}
</style>