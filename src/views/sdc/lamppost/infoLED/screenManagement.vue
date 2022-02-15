<!-- LED 节目管理 -->
<template>
  <div>
    <basic-container>
      <el-table :data="tableInfo" border="">
        <!-- <el-table-column type="selection" width="55" /> -->
        <el-table-column property="lightDev.name" align="center" label="LED终端名称" />
        <el-table-column
          property="lightDev.typeName"
          align="center"
          label="设备类型"
        />
        <el-table-column
          property="lightDev.siteName"
          align="center"
          label="所属园区"
        />
        <el-table-column property="light.name" align="center" label="所属灯杆" />
        <el-table-column
          property="netStatus"
          align="center"
          label="在线状态"
          :formatter="setNetStatus"
        />
        <el-table-column
          property="taskStatus"
          align="center"
          label="屏幕状态"
          :formatter="setDevStatus"
        />
        <el-table-column property="taskName" align="center" label="当前节目" />
        <el-table-column property="mediaType" align="center" label="媒体类型" />
        <el-table-column property="mediaFile" align="center" label="媒体文件" />
        <el-table-column
          property="latestRunTime"
          align="center"
          label="运行时间"
        />
        <el-table-column property="updateDate" align="center" label="更新时间" />
      </el-table>
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
<style>
</style>
<script>
import Pagination from "@/components/Pagination";
import { getSdcLightLEDTable } from "@/api/sdc/lpmonitor";
import { getSdcGateInfo } from "@/api/sdc/deviceInfo";

export default {
  name: "ProgramManagement",
  components: { Pagination },
  data() {
    return {
      address: null,
      condition: [],
      parkingName: "",
      parkingMap: [],
      page: 1,
      size: 10,
      total: 0,
      pageKey: Math.random().toString(36).slice(-6),
      tableInfo: [],
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.queryInfo();
    },
    async changeAddress() {
      if (this.address.length !== 0) {
        this.parkDisabled = false;
        // let tableData = await getSdcParkingLotBySiteId(this.address[this.address.length - 1])
        // tableData.data.data.forEach((el) => {
        //   this.parkingMap.push({
        //     value: el.id,
        //     label: el.name,
        //   });
        // });
      } else {
        this.parkDisabled = true;
        this.parkingMap = [];
      }
    },
    setQueryCondition() {
      this.queryCondition = {
        current: this.page,
        size: this.size,
      };
      // this.parkingName ? this.queryCondition.parkId = this.parkingName : null
    },
    async queryInfo() {
      this.setQueryCondition();
      // let tableData = await getSdcLightGateWaysTable(this.queryCondition)
      let tableData = await getSdcLightLEDTable(this.queryCondition);
      const promise = tableData.data.data.records.map((el) => {
        return new Promise((resolve, reject) => {
          getSdcGateInfo(el.id)
            .then((res) => {
              getSdcGateInfo(el.lightId).then((rl) => {
                el.lightDev = res.data.data;
                el.light = rl.data.data;
                resolve(el);
              });
            })
            .catch((err) => reject(err));
        });
      });
      this.tableInfo = await Promise.all(promise);
      this.setpage(tableData.data.data);
    },
    clearCondition() {
      this.parkingName = null;
      this.address = [];
      this.changeAddress();
    },
    setpage(data) {
      this.page = data.current;
      this.size = data.size;
      this.total = data.total;
      this.pageKey = new Date().toString() + 1;
    },
    async queryByPage(data) {
      this.page = data.page;
      this.size = data.size;
      this.queryInfo();
    },
    setNetStatus(val) {
      let plateColorMap = this.$dictUtils.getDictList('light_net_status')
      let text
      for (let index = 0; index < plateColorMap.length; index++) {
        const el = plateColorMap[index];
        if (el.value === val.netStatus) {
          text = el.label
          break;
        }
      }
      return text
    },
    setDevStatus(val) {
      let plateColorMap = this.$dictUtils.getDictList('light_dev_status')
      let text
      for (let index = 0; index < plateColorMap.length; index++) {
        const el = plateColorMap[index];
        if (el.value === val.taskStatus) {
          text = el.label
          break;
        }
      }
      return text
    },
  },
};
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
</style>
