<template>
  <div>
    <div ref="pueAnalysisEchart" id="pueAnalysisEchart"></div>
  </div>
</template>

<script>
import { getTwoDaysPue } from "@/api/sdc/energy";

export default {
  name: "PueAnalysisEcharts",
  props: ['siteId','configFlag'],
  data() {
    return {
      address: null,
      nameList:[],
      yesterdayList:[],
      todayList:[]
    };
  },
  created() {},
  mounted() {
    // this.init()
    // this.queryPageData()
  },
  watch: {
    siteId(newValue,oldValue) {
      if (newValue) {
        this.queryPageData()
      }
    }
  },
  methods: {
    async queryPageData() {
      getTwoDaysPue(this.siteId).then((res) => {
        if (res.data.code === 0) {
          this.nameList = res.data.data.planX
          this.yesterdayList = res.data.data.yesterday
          this.todayList = res.data.data.today
          this.$nextTick(() => {
            this.init();
          });
        }
      });
    },
    init() {
      //注：需要挂载后，this.$refs.lineEchart才能获取
      let pueAnalysisEcharts = this.$echarts.init(this.$refs.pueAnalysisEchart)
      let color = ['#3f8ef7', '#FFCAC1']
      let option = {
        // title: {  //设置标题
        //   // text: '各项设备能耗',
        //   textStyle: {
        //     fontSize: 14,
        //     fontWeight: 400
        //   }
        // },
        color: ['#3f8ef7', '#FFCAC1'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function(params) {
                    let html = '';
                    params.forEach(v => {
                        // console.log(v)
                        html += `<div style="color: #666;font-size: 14px;line-height: 24px">
                        <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${v.color};"></span>
                        ${v.seriesName}:
                        <span style="color:${v.color};font-weight:700;font-size: 16px">${v.value}</span>`;
                    })
                    return html
                },
            extraCssText: 'background: #fff; border-radius: 0;box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);color: #333;',
        },
        legend: {
          // data: ['制冷', 'IT设备', '照明', '其他'],
          icon: 'circle',
          left: '50%',
          itemGap: 5,
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.nameList
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine:{
                show:false
            }
          }
        ],
        series: [
          {
            name: '当前PUE',
            type: 'bar',
            barGap: '-100%',         // 左移100%，stack不再与上面两个在一列
            barWidth: 15,
            stack: 'pue',
            data: this.todayList 
          },
          {
            name: '昨日PUE',
            type: 'bar',
            barGap: '-100%',         // 左移100%，stack不再与上面两个在一列
            barWidth: 15,
            stack: 'pue',
            data: this.yesterdayList
          }
        ]
      }
      this.nameList.length > 24 ? option.dataZoom = [{
              type: 'inside',
              xAxisIndex: [0],
              start: 0,
              end: 30
            }] : ''
      pueAnalysisEcharts.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
#pueAnalysisEchart {
  width: 100%;
  height: 100%;
  min-height: 248px;
}
</style>
