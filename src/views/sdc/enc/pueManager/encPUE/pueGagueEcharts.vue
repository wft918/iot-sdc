<template>
  <div>
    <div ref="gagueEchart" id="gagueEchart"></div>
  </div>
</template>

<script>
import { getCurrentPueValue } from "@/api/sdc/energy";
export default {
  name: "EncGagueEcharts",
  props: ['planId'],
  data() {
    return {
      chart: null,
      encGagueData: 0,
    };
  },
  created() {
    // this.queryPageData()
  },
  mounted() {
    this.init();
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
      //获取初始区域查询条件数据
      getCurrentPueValue(this.planId).then((res) => {
        if (res.data.code === 0) {
          if (res.data.data) {
            this.encGagueData = res.data.data.value[0]
          } else {
            this.encGagueData = 0
          }
          this.$nextTick(() => {
            this.init();
          });
        }
      });
    },
    init() {
      //注：需要挂载后，this.$refs.gagueEchart才能获取
      let gagueEcharts = this.$echarts.init(this.$refs.gagueEchart);
      // this.chart = this.$echarts.init(this.$refs.gagueEchart);
      // this.chart.setOption({
      gagueEcharts.setOption({
        title: {
          text: '',
          textStyle: {
            fontSize: 14,
            fontWeight: 400
          }
        },
        series: [
          {
            name: "gague 0",
            type: "gauge",
            startAngle: 45,
            endAngle: -45,
            radius: "100%",
            center: ["50%", "65%"],
            axisLine: {
              //底圈样式
              lineStyle: {
                // color: '#ffffff',
                width: 10,
                color: [[1, "#FFA500"]],
              },
            },
            axisTick: {
              //具体细小刻度显示样式
              show: false,
            },
            splitLine: {
              //刻度线长度
              show: false,
            },
            axisLabel: {
              //设置均分刻度
              show: false,
            },
            detail: {
              show: false
            },
            anchor: {}
          },
          {
            min: 0.5,
            max: 2,
            splitNumber: 3,
            startAngle: 180,
            endAngle: 45,
            name: "gague 1",
            type: "gauge",
            radius: "100%",
            center: ["50%", "65%"],
            axisLine: {
              //底圈样式
              lineStyle: {
                width: 10,
                color: [[1, "#3f8ef7"]]
              }
            },
            splitLine: {
              //刻度线长度
              length: 15,
              lineStyle: {
                width: 2,
                color: "#3f8ef7"
              }
            },
            axisLabel: {
              //设置均分刻度
              distance: 2, //距离
              color: "#3f8ef7",
              fontSize: 10
            },
            axisTick: {
              //具体细小刻度显示样式
              show: false
            },
            anchor: {
              //设置指针样式
              show: true,
              showAbove: true,
              size: 15, //设置中心样式大小
              itemStyle: {
                borderWidth: 20 //设置中心边框宽度
              }
            },
            detail: {
              //设置当前数据显示样式
              valueAnimation: true,
              fontSize: 20, //字体大小
              offsetCenter: [0, "50%"] //位置
            },
            data: [
              {
                value: this.encGagueData
              }
            ]
          },
          {
            name: "gague 2",
            type: "gauge",
            startAngle: 225,
            endAngle: 45,
            radius: "100%",
            center: ["50%", "65%"],
            axisLine: {
              //底圈样式
              lineStyle: {
                width: 10,
                color: [[1, "#3f8ef7"]],
              },
            },
            axisTick: {
              //具体细小刻度显示样式
              show: false,
            },
            splitLine: {
              //刻度线长度
              show: false,
            },
            axisLabel: {
              //设置均分刻度
              show: false,
            },
            detail: {
              show: false
            },
            anchor: {}
          }
        ]
      })
      // gagueEcharts.resize()
    },
    resize() {
      // console.log(this.chart,666666);
      // this.chart.resize()
    }
  }
}
</script>

<style lang="scss" scoped>
#gagueEchart {
  width: 100%;
  height: auto;
  min-height: 205px;
  
  // :nth-child(1) {
  //   width: 100%;
  //   height: 205px;
  // }
}
</style>