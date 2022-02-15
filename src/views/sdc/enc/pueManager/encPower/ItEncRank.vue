<template>
  <div class="enc-rank">
    <div v-for="item in encRankData" :key="item.id" >
      <span>{{item.label}}</span>
      <el-progress :percentage="item.value/maxValue*100" :format="format"></el-progress>
    </div>
  </div>
</template>

<script>
import { getItDevEncRank } from "@/api/sdc/energy";
export default {
  name: 'ItEncRank',
  props: ['siteId', 'configFlag'],
  data() {
    return {
      encRankData: [],
      maxValue: 0,
    }
  },
  created() {},
  // watch: {
  //   siteId(newValue,oldValue) {
  //     if (newValue) {
  //       this.queryPageData()
  //     }
  //   }
  // },
  methods: {
    // queryPageData() {
    //   if (this.configFlag === 1) {
    //     getItDevEncRank(this.siteId).then(res => {
    //       if (res.data.code === 0) {
    //         this.encRankData = res.data.data
    //         this.encRankData.forEach(item => {
    //           item.value = Number(item.value)
    //         })
    //         for(let i = 0;i < this.encRankData.length;i++) {
    //           if (this.encRankData[i].value > this.maxValue) {
    //             this.maxValue = this.encRankData[i].value
    //           }
    //         }
    //       }
    //     })
    //   } else {
    //     this.encRankData = []
    //     this.maxValue = 0
    //   }
    // },
    // format(percentage) {
    //   return (percentage/100*this.maxValue)
    // }
  }

}
</script>

<style>
.enc-rank {
  min-height: 205px;
}
</style>