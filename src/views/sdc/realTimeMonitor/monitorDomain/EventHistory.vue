<template>
  <div>
    <el-table :data="eventLogInfo.records" :default-sort="{prop: 'updateDate', order: 'descending'}">
      <el-table-column
        prop="updateDate"
        label="时间"
        align="center"
        sortable
      ></el-table-column>
      <el-table-column
        prop="param"
        label="类型"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="content"
        label="内容"
        align="center"
      ></el-table-column>
      <!-- <el-table-column
        prop="remarks"
        label="事件说明"
        align="center"
      ></el-table-column> -->
      <el-table-column
        prop="updateBy"
        label="操作人"
        align="center"
      ></el-table-column>
    </el-table>
    <HistoryPagination
      :page="eventLogInfo.current"
      :size="eventLogInfo.size"
      :total="eventLogInfo.total"
      @pagination="queryByPage"
      style="overflow:auto;"
    ></HistoryPagination>
  </div>
</template>

<script>
import eventBus from "@/util/eventBus";
import HistoryPagination from "@/components/HistoryPagination";

export default {
  name: "EventHistory",
  props: ["eventLogInfo"],
  components: {
    HistoryPagination,
  },
  data() {
    return {
    };
  },
  created() {
  },
  methods: {
    queryByPage(data) {
      console.log(this.eventLogInfo,'eventLogInfo');
      if(this.eventLogInfo.records.length !== 0) {
        eventBus.$emit('queryLogByPage',{
          id: this.eventLogInfo.records[0].deviceId,
          page: data.page,
          size: data.size,
        })
      }
      
    }
  },
};
</script>

<style>
</style>