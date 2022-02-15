<doc>
  中部柱形图 页面
</doc>
<template>
  <div :id="id" style="width: 100%;height:100%;"></div>
</template>
<script>
  import echarts from 'echarts'
  export default {
    name: '',
    props: ['id','overdueXvalue','overdueYvalue'],
    data() {
      return {
        charts: '',
      }
    },
    watch: {
      overdueYvalue() {
        this.$nextTick(function () {
          this.drawMap()
        })
      }
    },
    created() {
      this.$nextTick(function () {
        this.drawMap()
      })
    },
    methods: {
      drawMap() {
        this.charts = echarts.init(document.getElementById(this.id))
        let option = {
          color: ['#3aa1ff', '#4cca73'],
          tooltip: {
            show: true    // 显示提示框
          },
          title: {
            text: "整改任务逾期情况",   // 设置主标题文本
            show: true,               // 显示标题组件
            textStyle: {                  // 设置主标题样式
              color: '#ccc'
            },
          },
          // grid: {
          //   show: true,  // 显示直角坐标系网格
          //   left: "0%", // 组件离容器左侧的距离
          //   top: '0%',     // 组件离容器上侧的距离
          //   right: "20%",// 组件离容器右侧的距离
          //   bottom: "0%",// 组件离容器右侧的距离
          // },
          legend: {
            show: true,   // 显示图例
            bottom: 10,
            textStyle: {                        // 图例文本样式
              color: "#ccc",                    // 文本颜色
            }
          },
          xAxis: {
            type: 'category',
            data: this.overdueXvalue,
            axisLine: {       // 坐标轴轴线设置
              show: true,     // 显示坐标轴轴线
              lineStyle: {    // 轴线样式设置
                color: "#cccccc",   // 轴线颜色
                width: 1,    // 轴线宽度
                opacity: 0.8   // 轴线透明度0.8
              },
            },
            axisTick: {             // 坐标轴刻度线设置
              show: true,           // 显示刻度线
            },
            splitLine: {    // 分割线设置
              show: false,   // 显示分割线
            }
          },
          yAxis: {
            type: 'value',
            axisLine: {       // 坐标轴轴线设置
              show: true,     // 显示坐标轴轴线
              lineStyle: {
                color:"#007acc"
              }
            },
            axisTick: {             // 坐标轴刻度线设置
              show: false,           // 显示刻度线
            },
            splitLine: {    // 分割线设置
              show: true,   // 显示分割线
              lineStyle: {
                color:"#096685",
                type:"dashed"
              }
            },
            axisLabel: {                    // 轴标签设置
              show: true,                   // 显示轴标签
              color: "#ccc",                // 轴标签字体颜色
            },
          },
          series: [{
            data: this.overdueYvalue[0],
            name: '总数',
            type: 'bar'
          }, {
            data: this.overdueYvalue[1],
            name: '逾期',
            type: 'bar'
          }]
        };
        this.charts.clear()
        this.charts.setOption(option, true)
        window.addEventListener("resize", () => {
          this.charts.resize();
        });
      }
    },
    // 销毁
    destroyed() {
      // 销毁echarts图表
      if (this.charts !== undefined) {
        this.charts.dispose()
      }
    }
  }
</script>
<style scoped>

</style>