<template>
  <div style="width:100%;height:100%;">
    <div ref="round8" class="emgCountChart"></div>
  </div>
</template>

<script>
import echarts from "echarts/lib/echarts"
import 'echarts-liquidfill'
import { getVehicleCategoryStatistics } from "@/api/sdc/lsd";
export default {
  name: "EmgCount",
  data() {
    return {
        address: null,
        echartData: []
    };
  },
  mounted() {
    // this.address = this.siteId
    this.address = "cff1bf7b5dc745e2ac6f7e9afef531f7"
    this.queryPageData()
  },
  methods: {
    async queryPageData() {
      this.$nextTick(() => {
        this.init()
      })
      
    },
    init() {
        let option = {
          backgroundColor: "rgba(3, 19, 60, 0.3)",
          tooltip: {
            trigger: 'item'
          },
          legend: {
            right: 35,
            top: 40,
            bottom: 20,
            orient: 'vertical',
            itemWidth: 14,
            icon: 'diamond',
            textStyle: {
              fontSize: '14',
              color: '#CCC'
            }
          },
          series: [
            {
              name: '污染物',
              type: 'pie',
              radius: ['68%', '80%'],
              center: ['30%', '50%'],
              avoidLabelOverlap: false,
              color: ['#2B9FFF','#84F872','#F06BFF','#FD4F4B', '#7B13FF', '#FEBF00'],
              label: {
                show: false,
                // position: 'inside',
                fontSize: 12,
                color: '#fff',
                formatter:'{d}%'
              },
              itemStyle: {
                borderRadius: 10,
                borderColor: 'rgba(3, 19, 60, 0.3)',
                borderWidth: 6
              },
              labelLine: {
                show: false
              },
              data: [
                { value: 648, name: 'O3' },
                { value: 135, name: 'CO' },
                { value: 380, name: 'pm10' },
                { value: 184, name: 'NO2' },
                { value: 300, name: 'pm26' },
                { value: 200, name: 'SO2' }
              ]
            }
          ]
        };
        let round8 = this.$echarts.init(this.$refs.round8);
        round8.setOption(option);
    }
  }
};
</script>

<style lang="scss" scoped>
.emgCountChart {
  width: 100%;
  height: 100%;
  //padding: 0 0 1rem 1rem;
  position: relative;
  //top: 20px;
  color: #ffffff;
}

</style>