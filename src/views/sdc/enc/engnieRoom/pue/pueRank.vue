<template>
  <div class="pue-rank">
    <div v-for="item in rankData" :key="item.id" >
      <span>{{item.label}}</span>
      <el-progress :percentage="item.value/maxValue*100" :format="format"></el-progress>
    </div>
  </div>
</template>

<script>
import { getPueRank } from "@/api/sdc/energy";
export default {
  name: 'ItEncRank',
  props: ['siteId'],
  data() {
    return {
      rankData: [],
      maxValue: 0,
    }
  },
  created() {},
  watch: {
    siteId(newValue,oldValue) {
      if (newValue) {
        this.queryPageData()
      }
    }
  },
  methods: {
    queryPageData() {
      getPueRank(this.siteId).then(res => {
        if (res.data.code === 0) {;
          this.rankData = res.data.data
          if (this.rankData.length > 5) {
            this.rankData = this.rankData.slice(0, 5)
          }
          this.rankData.forEach(item => {
            item.value = Number(item.value)
          })
          for(let i = 0;i < this.rankData.length;i++) {
            if (this.rankData[i].value > this.maxValue) {
              this.maxValue = this.rankData[i].value
            }
          }
        }
      })
    },
    format(percentage) {
      return (percentage/100*this.maxValue).toFixed(2)
    }
  }

}
</script>

<style>
.pue-rank {
  min-height: 248px;
}
</style>