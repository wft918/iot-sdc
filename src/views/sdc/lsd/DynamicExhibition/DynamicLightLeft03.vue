<template>
  <div style="width:100%;height:100%;display: flex;align-items: center;">
    <div ref="dynamicLightLeft03" class="emgCountChart"></div>
  </div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
import { getLightingClassifiInfo } from "@/api/sdc/lsd";
export default {
  name: "EmgCount",
  data() {
    return {
        address: null,
    };
  },
  mounted() {
    // this.address = this.siteId
    this.address = "cff1bf7b5dc745e2ac6f7e9afef531f7"
    this.init();
    this.queryPageData()
  },
  methods: {
    async queryPageData() {
      //车辆平均停留时长
      getLightingClassifiInfo({ siteId: this.address }).then((res) => {
        if (res.data.code === 0) {
          console.log(res);
        //   this.dateList = res.data.data.date
        //   this.dataList = res.data.data.value
          this.$nextTick(() => {
            this.init();
          });
        }
      });
    },
    init() {
        let that = this
        var option = {
            backgroundColor: '',
            grid: [
                {
                    //左侧的柱状图grid
                    width: "100%",
                    left: '1%',
                    top: '5%',
                    right: '0',
                    bottom: '0'
                }
            ],
            xAxis: [
                {
                    //左侧柱状图的X轴
                    gridIndex: 0,//x 轴所在的 grid 的索引
                    show: false
                }],
            yAxis: [
                {
                    //左侧柱状图的Y轴
                    gridIndex: 0,//y轴所在的 grid 的索引
                    splitLine: 'none',
                    axisTick: 'none',
                    axisLine: 'none',
                    axisLabel: {
                        verticalAlign: 'bottom',
                        align: 'left',
                        padding: [0, 0, 15, 15],
                        textStyle: {
                            color: '#FFFFFF',
                            fontSize: '12',
                        }
                    },
                    data: ['类型1', '类型2', '类型3', '类型4'],
                    inverse: true,
                },
            
            ],
            series: [{
                    name: '类型1',
                    type: 'bar',
                    xAxisIndex: 0,//使用的 x 轴的 index，在单个图表实例中存在多个 x 轴的时候有用。
                    yAxisIndex: 0,//使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用。
                    data: [555,,,],
                    barWidth: 10,
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                    'rgba(125, 227, 21, 0.2)', 'rgba(125, 227, 21, 1)'
                                ].map((color, offset) => ({
                                    color,
                                    offset
                                })))
                        },
                    },
                    z: 2
                },{
                    name: '类型2',
                    type: 'bar',
                    xAxisIndex: 0,//使用的 x 轴的 index，在单个图表实例中存在多个 x 轴的时候有用。
                    yAxisIndex: 0,//使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用。
                    data: [,444,,],
                    barWidth: 10,
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                    'rgba(2, 204, 156, 0.2)', 'rgba(2, 204, 156, 1)'
                                ].map((color, offset) => ({
                                    color,
                                    offset
                                })))
                        },
                    },
                    z: 2
                },{
                    name: '类型3',
                    type: 'bar',
                    xAxisIndex: 0,//使用的 x 轴的 index，在单个图表实例中存在多个 x 轴的时候有用。
                    yAxisIndex: 0,//使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用。
                    data: [,,333,],
                    barWidth: 10,
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                    'rgba(20, 160, 193, 0.2)', 'rgba(20, 160, 193, 1)'
                                ].map((color, offset) => ({
                                    color,
                                    offset
                                })))
                        },
                    },
                    z: 2
                },
                {
                    name: '类型4',
                    type: 'bar',
                    xAxisIndex: 0,//使用的 x 轴的 index，在单个图表实例中存在多个 x 轴的时候有用。
                    yAxisIndex: 0,//使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用。
                    data: [,,,222],
                    barWidth: 10,
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                    'rgba(81, 89, 172, 0.2)', 'rgba(81, 89, 172, 1)'
                                ].map((color, offset) => ({
                                    color,
                                    offset
                                })))
                        },
                    },
                    z: 2
                },
                {
                    name: '外框',
                    type: 'bar',
                    xAxisIndex: 0,//使用的 x 轴的 index，在单个图表实例中存在多个 x 轴的时候有用。
                    yAxisIndex: 0,//使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用。
                    barGap: '-100%',
                    data: [1554,1554 , 1554, 1554],
                    barWidth: 10,
                    itemStyle: {
                        normal: {
                            color: 'rgba(255, 255, 255, 0.15)',
                            barBorderRadius: 6,
                        }
                    },
                    z: 0
                }
            ]
        };
        let dynamicLightLeft03 = this.$echarts.init(this.$refs.dynamicLightLeft03);
        dynamicLightLeft03.setOption(option);
    }
  }
};
</script>

<style lang="scss" scoped>
.emgCountChart {
  width: 100%;
  height: 170px;
  //padding: 0 0 1rem 1rem;
  position: relative;
  //top: 20px;
  color: #ffffff;
}

</style>