<template>
  <basic-container>
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
    <el-tab-pane label="U位空间容量" name="unit">
      <unit-capacity></unit-capacity>
    </el-tab-pane>
    <el-tab-pane label="机柜空间容量" name="rack">
      <rack-capacity></rack-capacity>
    </el-tab-pane>
    <el-tab-pane label="电力容量" name="power">
      <power-capacity></power-capacity>
    </el-tab-pane>
    <el-tab-pane label="制冷容量" name="refrigeration">
      <refrigerating-capacity></refrigerating-capacity>
    </el-tab-pane>
  </el-tabs>
  </basic-container>
</template>

<script>
import UnitCapacity from "./UnitCapacity.vue"
import RackCapacity from "./RackCapacity"
import PowerCapacity from "./PowerCapacity.vue"
import RefrigeratingCapacity from "./RefrigeratingCapacity.vue"
export default {
  data() {
    return {
      activeName: 'unit'
    }
  },
  components: {
    UnitCapacity,
    RackCapacity,
    PowerCapacity,
    RefrigeratingCapacity
  },
  methods: {
    handleTabClick(tab, event) {
      console.log(tab, event);
    }
  }
}
</script>

<style>

</style>