<template>
  <div style="width:100%;height:100%;display: flex;align-items: flex-end;">
    <div ref="bottomChart1" class="emgCountChart"></div>
  </div>
</template>

<script>
import { sdcSiteAction } from "@/api/sdc/addressInfo";
import { modifyData } from "@/util/domainFilter";
import { getBeforeDate } from "@/util/getBeforeDate"
import { getDeviceAlarmNumRank } from "@/api/sdc/lsd";

export default {
  name: "EmgCount",
  props: ['siteId'],
  data() {
    return {
        deviceNums: [],
        deviceNames: [],
        rankData: [],
        startTime: '',
        yLabel: ''
    };
  },
  created() {
		this.startTime = getBeforeDate(30)
	},
  watch: {
    siteId(newVal, oldVal) {
      if (newVal) {
				this.queryPageData()
      }
    }
  },
  mounted() {
    if (this.siteId) {
      this.queryPageData()
    }
    // this.init()
  },
  methods: {
      async queryPageData() {
      //获取初始区域查询条件数据
      let data = await getDeviceAlarmNumRank({siteId: this.siteId, startTime: this.startTime})
      this.rankData = data.data.data
      this.init()
    },
    
    init() {
      this.deviceNums = []
      this.deviceNames = []
      this.rankData.forEach(item => {
        this.deviceNums.push(item.value)
        this.deviceNames.push(item.label)
      })
      
      console.log(this.deviceNums);
      let option = {
          grid: {
            top: '8%',
            left: '8%',
            right: '20%',
            bottom: '10%',
              // containLabel: true
          },
          tooltip: {
            show: true,
            axisPointer: {
              show: true,
              trigger: 'axis',
              label: {
                show: true,
                width: 50,
                overflow: 'break'
              }
            }
          },
          xAxis: {
            axisLine: {
              lineStyle: {
                color: '#AAA'
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
              data: this.deviceNames,
              axisTick: {
                  show: false
              },
              axisLine: {
                  show: false
              },
              axisLabel: {
                  show: true,
                  color: '#DDD',
                  fontSize: 14,
                  fontWeight: 'bold',
                  formatter: function (name) {
                                return (name.length > 4 ? (name.slice(0,5)+"...") : name );
                              },
              },
              position: 'right'
          },
          series: [
              {
                  type: 'bar',
                  barMaxWidth: '15',
                  itemStyle: {
                      normal: {
                        color: function (value, index) {
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
                              return '#9BC7CD';
                          }
                          return '#9BC7CD'
                        }
                      }
                  },
                  label: {
                      normal: {
                          position: 'insideRight',
                          show: true,
                          color: '#FFF',
                          formatter: '{c}'
                      }
                  },
                  data: this.deviceNums
              }]
      }
      let bottomChart1 = this.$echarts.init(this.$refs.bottomChart1);
      

      // bottomChart1.on('mouseover', (params) => {
      //   console.log(params);
      //   if (params.contentType === 'yAxis') {
      //     yLabel = params.value
      //     let offsetX = params.event.offsetX + 10
      //     let offsetY = params.event.offsetY + 10
      //     bottomChart1.setOption({toolTip: {
      //       formatter: formatToolTip,
      //       alwaysShowContent: true
      //     }})
      //     bottomChart1.dispatchAction({
      //       type: 'showTip',
      //       seriesIndex: 0,
      //       dataIndex: 0,
      //       position: [offsetX,offsetY]
      //     })
      //   } else if (params.contentType === 'series') {
      //     bottomChart1.setOption({toolTip: {
      //       formatter: formatToolTip,
      //       alwaysShowContent: true
      //     }})
      //      bottomChart1.dispatchAction({
      //       type: 'showTip',
      //       seriesIndex: params.seriesIndex,
      //       dataIndex: params.dataIndex
      //     })
      //   }
      // })
      // bottomChart1.on('mouseout', (params) => {
      //   bottomChart1.setOption({toolTip: {
      //     alwaysShowContent: false
      //   }})
      //   if (params.contentType === 'yAxis') {
      //     this.yLabel = ''
      //   }
      // })
      // this.formatToolTip()
      bottomChart1.setOption(option)
    },
    // formatToolTip(params) {
    //     return this.yLabel
    //   }
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