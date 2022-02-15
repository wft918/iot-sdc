<template>
  <div >
    <el-table
      :data="tsgData"
      border
      height="350"
    >
      <!-- <el-table-column 
        label="设备"
        align="center"
      >
        <template slot-scope="">
          {{deviceName}}
        </template>
      </el-table-column> -->
      <el-table-column 
        prop="param"
        label="遥信名称"
        align="center"
        sortable
      ></el-table-column>
      <el-table-column 
        prop="value"
        label="状态"
        align="center"
        :formatter="typeTranslate"
      >
      </el-table-column>
      <!-- <el-table-column 
        label="单位"
        align="center"
      >
        <template slot-scope="scope">{{scope.row.unit || '--'}}</template>
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
export default {
  props:['tsgData'],
  created() {
  },
  methods: {
    typeTranslate(row) {
      let plateColorMap = this.$dictUtils.getDictList('telemsg_status')
      let rowText
      for(let i = 0; i < plateColorMap.length; i++) {
        let el = plateColorMap[i]
        if(el.value === row.value) {
          rowText = el.label
          break
        }
      }
      return rowText
    }
  }
}
</script>

<style>

</style>