<template>
  <div style="width:100%;height:100%;display: flex;align-items: center;">
    <div ref="dynamicCarLeft01" class="emgCountChart"></div>
  </div>
</template>

<script>
import echarts from "echarts/lib/echarts"
import 'echarts-liquidfill'
import { getParkingSpaceAnalysis } from "@/api/sdc/lsd";
export default {
  name: "EmgCount",
  data() {
    return {
        address: null,
        dateList: [],
        arr1:[],
        arr2: [],
    };
  },
  mounted() {
    // this.address = this.siteId
    this.address = "cff1bf7b5dc745e2ac6f7e9afef531f7"
    this.queryPageData()
  },
  methods: {
    async queryPageData() {
      //停车位分析数据
      getParkingSpaceAnalysis({ siteId: this.address }).then((res) => {
        if (res.data.code === 0) {
            this.arr1 = []
            this.dateList = []
            this.arr2 = []
          console.log(res);
          for (let index = 0; index < res.data.data.length; index++) {
              const el = res.data.data[index];
              this.dateList.push(el.date)
              this.arr1.push(el.value[0])
              if(el.value.length < 2) {
                  this.arr2.push(0)
              } else {
                  this.arr2.push(el.value[1])
              }
          }
          this.$nextTick(() => {
            this.init();
          });
        }
      });
    },
    init() {
        let that = this
        var option = {
            grid: {
                left: '5%',
                right: '5%',
                bottom: '5%',
                top: '10%',
                containLabel: true
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'none'
                },
                formatter: function(params) {
                    return params[0].name + '<br/>' +
                        "<span style='display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:rgba(36,207,233,0.9)'></span>" +
                        params[0].seriesName + ' : ' + params[0].value.toLocaleString() + '<br/>'
                }
            },
            backgroundColor: '',
            xAxis: {
                show: false,
                type: 'value'
            },
            yAxis: [{
                type: 'category',
                inverse: true,
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#fff'
                    },
                },
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                data: ['21:00', '20:00', '19:00', '18:00', '17:00', '16:00']
            }],
            series: [{
                    name: '数量1',
                    type: 'bar',
                    zlevel: 1,
                    itemStyle: {
                        normal: {
                            barBorderRadius: 30,
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                offset: 0,
                                color: '#03D5F0'
                            }, {
                                offset: 1,
                                color: '#0073FF'
                            }]),
                        },
                    },
                    barWidth: 10,
                    data: [38, 60, 80, 50, 100,78]
                },
                {
                    name: '数量2',
                    type: 'bar',
                    zlevel: 1,
                    itemStyle: {
                        normal: {
                            barBorderRadius: 30,
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                offset: 0,
                                color: '#FAC300'
                            }, {
                                offset: 1,
                                color: '#EB7C00'
                            }]),
                        },
                    },
                    barWidth: 10,
                    data: [80, 60, 27, 20, 70,50]
                }
            ]
        };
        let dynamicCarLeft01 = this.$echarts.init(this.$refs.dynamicCarLeft01);
        dynamicCarLeft01.setOption(option);
    }
  }
};
</script>

<style lang="scss" scoped>
.emgCountChart {
  width: 100%;
  height: 300px;
  //padding: 0 0 1rem 1rem;
  position: relative;
  //top: 20px;
  color: #ffffff;
}

</style>