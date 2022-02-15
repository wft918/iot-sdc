<template>
  <div class="container">
    <el-row>
      <el-col>
        <span style="font-weight:700;">机柜详情</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-table
          :data="unitList"
          style="width: 100%;margin-top:15px;"
          :show-header="true"
          height="650"
        >
          <el-table-column
            prop="unitIndex"
            label="名称"
            sortable
            :sort-method="(a, b) => sortTable(a, b, 'unitIndex')"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{'U' + scope.row.unitIndex}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="state"
            label="状态"
            align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.state === '0'" style="color:#409EFF;">空闲</span>
              <span v-else style="color:#EC1B1B;">已出租</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="contract"
            align="center"
            label="客户">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getUnitList } from "@/api/sdc/capacityManage";
export default {
  props: ['deviceId','unitList'],
  data() {
    return {
      condition: {
        current: 1,
        size: 200
      },
      tableData: []
    }
  },
  created() {
    // this.init()
  },
  destroyed() {
  },
  methods: {
    init() {
      // 根据deviceId获取机柜详情
      this.condition.rackId = this.deviceId
      this._getUnitList(this.condition)

    },
    _getUnitList(condition) {
      getUnitList(condition).then(res => {
        console.log(res, 'unitList');
        if(res.data.code === 0) {
          let data = res.data.data.records
          this.tableData = data
          // this.PageInfo.total = res.data.data.total
          // this.PageInfo.page = res.data.data.current
          // if (this.tableData.length === 0) {
          //   this.recordEmptyText = '暂无数据'
          // }
        } else {
          this.$message.error('获取数据出错，请刷新重试')
        }
      })
    },
    sortTable(row1, row2, column) {
      // console.log(a, b);
      let a = row1[column]
      let b = row2[column]
      return a - b
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  margin-left: 20px;
}
</style>