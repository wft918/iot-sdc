<template>
  <div>
    <el-table
      :data="teleData"
      border
      max-height="400"
    >
      <el-table-column 
        label="设备"
        align="center"
      >
        <template slot-scope="">
          {{deviceName}}
        </template>
      </el-table-column>
      <el-table-column 
        prop="param"
        label="参数"
        align="center"
      ></el-table-column>
      <el-table-column 
        label="参数值"
        align="center"
      >
        <template slot-scope="scope">{{scope.row.value || '--'}}</template>
      </el-table-column>
      <el-table-column 
        label="单位"
        align="center"
      >
        <template slot-scope="scope">{{scope.row.unit || '--'}}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props:['teleData','deviceName'],
  created() {
  }
}
</script>

<style>

</style>