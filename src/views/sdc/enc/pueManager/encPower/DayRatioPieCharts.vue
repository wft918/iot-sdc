<template>
  <div>
    <div ref="pieCharts" id="pieCharts"></div>
  </div>
</template>

<script>
import { getDayDeviceEnergyConsum } from "@/api/sdc/energy";
export default {
  name: "WeekRatioPieCharts",
  props: ['planId'],
  data() {
    return {
      // address: null,
      // nameList: [],
      // dateList: [],
      // coldList: [],
      // itList: [],
      // lightList: [],
      itPercent: '',
      otherPercent: ''
    };
  },
  created() {},
  mounted() {
    // this.init()
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
      getDayDeviceEnergyConsum(this.planId).then((res) => {
        if (res.data.code === 0) {
          if (res.data.data) {
            this.itPercent = res.data.data.itPercent
            this.otherPercent = res.data.data.otherPercent
          } else {
            this.itPercent = ''
            this.otherPercent = ''
          }
          
          this.$nextTick(() => {
            this.init();
          });
        }
      });
    },
    init() {
      //注：需要挂载后，this.$refs.lineEchart才能获取
      let barEcharts = this.$echarts.init(this.$refs.pieCharts)
      barEcharts.setOption({
        title: {  //设置标题
          text: '',
          textStyle: {
            fontSize: 14,
            fontWeight: 400
          },
          left: 'center',
        },
        color: ['#5470C6', '#91CC75'],
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
                    let html = '';
                        // console.log(params)
                        html += `<div style="color: #666;font-size: 14px;line-height: 24px">
                        <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>
                        ${params.seriesName}:
                        <span style="color:${params.color};font-weight:700;font-size: 16px">${params.value}%</span>`
                    return html
                },
            extraCssText: 'background: #fff; border-radius: 0;box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);color: #333;',
        },
         legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: 'IT设备',
            type: 'pie',
            radius: '50%',
            data: [
              {value: this.itPercent, name: 'IT能耗'},
              {value: this.otherPercent, name: '其他'}
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
                focus: 'series'
            },
          }
        ]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#pieCharts {
  width: 100%;
  height: 100%;
  min-height: 205px;
}
</style>