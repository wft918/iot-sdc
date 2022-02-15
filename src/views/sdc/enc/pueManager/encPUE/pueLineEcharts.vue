<template>
  <div>
    <div ref="lineEchart" id="lineEchart"></div>
  </div>
</template>

<script>
import { getPueCurve } from "@/api/sdc/energy";

export default {
  name: "EncLineEcharts",
  props: ['planId'],
  data() {
    return {
      dateList: [],
      pueDataList: []
    };
  },
  watch: {
    planId(newValue,oldValue) {
      if (newValue) {
        this.queryPageData()
      }
    }
  },
  created() {},
  mounted() {
    this.init()
    // this.queryPageData()
  },
  methods: {
    async queryPageData() {
      //获取初始区域查询条件数据
      getPueCurve(this.planId).then((res) => {
          if (res.data.code === 0) {
            if (res.data.data) {
              this.dateList = res.data.data.date
              this.pueDataList = res.data.data.value
            } else {
              this.dateList = []
              this.pueDataList = []
            }
            this.$nextTick(() => {
              this.init();
            });
          }
        });
    },
    init() {
      //注：需要挂载后，this.$refs.lineEchart才能获取
      let lineEcharts = this.$echarts.init(this.$refs.lineEchart)
      lineEcharts.setOption({
        title: {  //设置标题
          text: '',
          textStyle: {
            fontSize: 14,
            fontWeight: 400
          }
        },
        legend: {  //设置图样
          data: ['PUE'],
          icon: 'circle',
          right: 30
        },
        tooltip: {
          trigger: "axis"
        },
        grid: {
          top: '20%',
          left: '10%',
          bottom: '10%',
          right: '3%',
          containlabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisLabel: {  //设置X轴文字间隔
              interval: 2
          },
          data: this.dateList
        },
        yAxis: {
          type: "value",
          splitLine:{
            show:false
          }
        },
        series: [
          {
            name: "PUE",
            symbol: 'none', //去点
            smooth: true, //曲线平滑
            itemStyle: {
              normal: {
                areaStyle: { type: "default" },
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#3FF2F7" },
                  { offset: 1, color: "#ffffff" }
                ]),
                borderColor: "#71df6f", //拐点边框颜色
                borderWidth: 2 //拐点边框大小
              }
            },
            data: this.pueDataList,
            type: "line",
            areaStyle: {}
          }
        ]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#lineEchart {
  width: 100%;
  height: 100%;
  min-height: 205px;
}
</style>