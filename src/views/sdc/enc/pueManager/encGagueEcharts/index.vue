<template>
  <div>
    <div ref="gagueEchart" id="gagueEchart"></div>
  </div>
</template>

<script>
export default {
  name: "EncGagueEcharts",
  data() {
    return {};
  },
  created() {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      //注：需要挂载后，this.$refs.gagueEchart才能获取
      let gagueEcharts = this.$echarts.init(this.$refs.gagueEchart);
      console.log(gagueEcharts);
      gagueEcharts.setOption({
        title: {
          text: ''
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
                value: 1.2
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
      // setTimeout(() =>{
      //   window.onresize = () => {
      //     gagueEcharts.resize()
      //   }
      // },200)
    }
  }
}
</script>

<style lang="scss">
#gagueEchart {
  width: 100%;
  height: 100%;
  min-height: 205px;
  
  
}
</style>