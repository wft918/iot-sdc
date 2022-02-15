<template>
  <div style="width:100%;height:100%;display: flex;align-items: center;">
    <div ref="alarmTrendChart" id="alarmTrendChart" class="alarmTrendChart"></div>
  </div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
import { getAlarmNunsTrend } from "@/api/sdc/lsd";
import { getBeforeDate } from "@/util/getBeforeDate"
export default {
  props: ['chartsType','siteId'],
  data() {
    return {
			trendData: [],
			startTime: ''
    };
  },
	watch: {
		chartsType(newValue, oldValue) {
			if (newValue === '1') {
				this.startTime = getBeforeDate(7)
				this.queryPageData()
			} 
			if (newValue === '2') {
				this.startTime = getBeforeDate(30)
				this.queryPageData()
			}
		},
        siteId(newVal) {
            this.queryPageData()
        }
	},
	created() {
		this.startTime = getBeforeDate(7)
	},
  mounted() {
    this.queryPageData()
    this.init()
  },
  methods: {
    async queryPageData() {
      getAlarmNunsTrend({ siteId: this.siteId, startTime: this.startTime }).then((res) => {
        if (res.data.code === 0) {
          this.trendData = res.data.data
          this.$nextTick(() => {
            this.init();
          });
        }
      });
    },
    init(){
      let option = {
        backgroundColor:'',
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                lineStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0,
                            color: 'rgba(0, 255, 233,0)'
                        }, {
                            offset: 0.5,
                            color: 'rgba(255, 255, 255,1)',
                        }, {
                            offset: 1,
                            color: 'rgba(0, 255, 233,0)'
                        }],
                        global: false
                    }
                },
            },
        },
        grid: {
            top: '8%',
            left: '7%',
            right: '5%',
            bottom: '20%',
            // containLabel: true
        },
        xAxis: [{
            type: 'category',
            axisLine: {
                show: false,
                color:'#A582EA'
            },
            axisLabel: {
                color: '#EEE',
                width:100
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#00BFF3',
                    opacity:0.23
                }
            },
            boundaryGap: true,
            data: this.trendData.label

        }],

        yAxis: [{
            type: 'value',
            min: 0,
            // max: 140,
            splitNumber: 4,
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#00BFF3',
                    opacity:0.23
                }
            },
            axisLine: {
                show: false,
            },
            axisLabel: {
                show: true,
                margin: 5,
                textStyle: {
                    color: '#EEE',
                },
            },
            axisTick: {
                show: false,
            },
            nameGap: 0
        }],
        series: [
            {
                name:'告警数量',
                type: 'line',
                smooth: true,
                showAllSymbol: true,
                symbol: 'circle',
                symbolSize: 10,
                lineStyle: {
                    normal: {
                        color: "#2CABE3",
                    },
                },
                label: {
                    show: true,
                    position: 'top',
                    textStyle: {
                        color: '#2CABE3',
                    }
                },
                itemStyle: {
                    color: "#fff",
                    borderColor: "#2CABE3",
                    borderWidth: 2,
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: 'rgba(81,150,164,0.3)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(81,150,164,0)'
                            }
                        ], false),
                    }
                },
                data: this.trendData.value
            },
        ]
      };
      if (this.trendData.label) {
        this.trendData.label.length > 12 ? option.dataZoom = [{
            type: 'inside',
            xAxisIndex: [0],
            start: 0,
            end: 70
        }] : ''
      }
      let alarmTrendChart = this.$echarts.init(this.$refs.alarmTrendChart);
      alarmTrendChart.setOption(option)
    },
  }
}
</script>

<style lang="scss" scoped>
.alarmTrendChart {
  width: 100%;
  height: 100%;
  //padding: 0 0 1rem 1rem;
  position: relative;
  //top: 20px;
  color: #ffffff;
}
</style>