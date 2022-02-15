<doc>
  底部柱形图 页面
</doc>
<template>
  <div :id="id" style="width: 100%;height:100%;"></div>
</template>
<script>
  import echarts from 'echarts'
  export default {
    name: '',
    props: ['id','riskTypeList'],
    data() {
      return {
        charts: '',
      }
    },
    watch: {
      riskTypeList() {
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
          color: ['#f2637b', '#45a2f7', '#36cbcb', '#6dd48c', '#fbd437'],
          tooltip: {
            show: true    // 显示提示框
          },
          title: {
            text: "问题类型分析",   // 设置主标题文本
            show: true,               // 显示标题组件
            textStyle: {                  // 设置主标题样式
              color: '#ccc'
            },
          },
          legend: {
            show: true,   // 显示图例
            bottom: 10,
            textStyle: {                        // 图例文本样式
              color: "#ccc",                    // 文本颜色
            }
          },
          series: [
            {
              // name: '访问来源',
              type: 'pie',
              radius: '50%',
              data: this.riskTypeList,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              itemStyle:{
                normal:{
                  label:{
                    show: true,
                    formatter: '{b} : {c} ({d}%)'
                  },
                  labelLine :{show:true}
                }
              }
            }
          ]
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