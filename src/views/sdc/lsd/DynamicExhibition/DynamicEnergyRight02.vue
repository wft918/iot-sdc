<template>
  <div style="width:100%;height:100%;display: flex;align-items: center;">
    <div ref="dynamicEnergyRight02" class="emgCountChart"></div>
  </div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
import { getPlanEncRank } from "@/api/sdc/lsd";
export default {
  name: "EmgCount",
  props: ['siteId'],
  data() {
    return {
        rankData: [],
        xAxisData: [],
        yAxisData: []
    };
  },
  mounted() {
    this.queryPageData()
  },
  watch: {
    siteId(newVal, oldVal) {
      if (newVal) {
        this.queryPageData()
      }
    }
  },
  methods: {
    async queryPageData() {
      getPlanEncRank({ siteId: this.siteId }).then((res) => {
        if (res.data.code === 0) {
          this.rankData = res.data.data
          this.xAxisData = []
          this.yAxisData = []
          this.rankData.forEach(item => {
            this.xAxisData.push(item.label)
            this.yAxisData.push(item.value)
          })
          this.$nextTick(() => {
            this.init();
          });
        }
      });
    },
    init() {
      let deviceNums = [25, 31, 33, 68, 45]
      this.deviceNums =  deviceNums.sort((a ,b) => b - a)
      
      console.log(this.deviceNums);
      let option = {
          grid: {
              left: '8%',
              right: '8%',
              bottom: '4%',
              top: 10,
              containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            formatter: function(params) {
              let html = '';
                    params.forEach(v => {
                        // console.log(v)
                        html += `<div style="color: #666;font-size: 14px;line-height: 24px">
                        <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${v.color};"></span>
                        ${v.name}:
                        <span style="color:${v.color};font-weight:700;font-size: 16px">${v.value} kWh</span>`;
                    })
                    return html
            },
            extraCssText: 'background: #fff; border-radius: 0;box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);color: #333;',
          },
          xAxis: {
            axisLine: {
              lineStyle: {
                color: '#CCC'
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: '#333'
              }
            }
          },
          yAxis: {
              type: 'category',
              inverse: true,
              //城市名称
              data: this.xAxisData,
              axisTick: {
                  show: false
              },
              axisLine: {
                  show: false
              },
              axisLabel: {
                  show: true,
                  color: '#B3E6F1',
                  fontSize: 14,
                  formatter: function (name) {
                                return (name.length > 5 ? (name.slice(0,5)+"...") : name );
                              },
              },
              position: 'left',
          },
          series: [
              {
                  type: 'bar',
                  stack: 'chart',
                  // z: 3,
                  barWidth: '15',
                  itemStyle: {
                      normal: {
                        color: function (value, index) {
                          console.log(value.dataIndex );
                          if(value.dataIndex === 0) {
                              return '#D84227'
                          }
                          if(value.dataIndex === 1) {
                              return '#DD6510';
                          }
                          if(value.dataIndex === 2) {
                              return '#E2AB00';
                          }
                          if(value.dataIndex === 3) {
                              return '#67B9D6';
                          }
                          if(value.dataIndex === 4) {
                              return '#9BC7CD';
                          }
                          return '#9BC7CD'
                        }
                      }
                  },
                  label: {
                      normal: {
                          position: 'right',
                          show: true,
                          color: '#FFF',
                          formatter: '{c}'
                      }
                  },
                  data: this.yAxisData
              }]
      }
      let dynamicEnergyRight02 = this.$echarts.init(this.$refs.dynamicEnergyRight02);
      dynamicEnergyRight02.setOption(option)
    }
  },
 
};
</script>

<style lang="scss" scoped>
.emgCountChart {
  width: 100%;
  height: 100%;
  //padding: 0 0 1rem 1rem;
  position: relative;
  //top: 20px;
  color: #ffffff;
}

</style>