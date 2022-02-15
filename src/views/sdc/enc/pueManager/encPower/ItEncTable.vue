<template>
  <div>
    <el-table
    :data="tableBody"
    style="width: 100%"
    border
    :loading="loading"
  >
    <el-table-column
      prop="date"
      label="时间"
      align="center"
    ></el-table-column>
    <el-table-column
      prop="itPower"
      label="IT耗电量(Kwh)"
      align="center"
    >
    </el-table-column>
    <el-table-column
      prop="totalPower"
      label="总耗电量(Kwh)"
      align="center"
    >
    </el-table-column>
    <el-table-column
      prop="pue"
      label="PUE"
      align="center"
    >
    </el-table-column>
  </el-table>
  <el-pagination
      style="margin-top:15px"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageNo"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="total"
      background
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
import { getItDevEnergyDetail } from "@/api/sdc/energy";
export default {
  props: ['planId'],
  name: 'ItEncTable',
  data() {
    return {
      tableBody: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      loading: false
    }
  },
  created() {
    // this.queryPageData()
  },
  watch: {
    planId(newValue,oldValue) {
      if (newValue) {
        this.queryPageData()
      }
    }
  },
  methods: {
    async queryPageData() {
      getItDevEnergyDetail(this.planId, this.pageNo, this.pageSize).then((res) => {
        console.log(res);
        if (res.data.code === 0) {
          this.tableBody = res.data.data.records
          this.total = res.data.data.total
        }
      });
    },
    // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageNo = 1
        this.queryPageData()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageNo = val
        this.queryPageData()
      },
  }
}
</script>

<style lang="scss" scoped>

</style>