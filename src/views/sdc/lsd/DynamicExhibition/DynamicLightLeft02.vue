<template>
  <div style="width:100%;height:100%;display: flex;align-items: center;">
    <div ref="dynamicLightLeft02" class="emgCountChart"></div>
  </div>
</template>

<script>
import { getLightingOperStateAnalysis } from "@/api/sdc/lsd";
export default {
  name: "EmgCount",
  data() {
    return {
    };
  },
  mounted() {
    // this.address = this.siteId
    // this.address = "cff1bf7b5dc745e2ac6f7e9afef531f7"
    // console.log(this.address,'this.address');
    this.init();
    // this.queryPageData()
  },
  methods: {
    async queryPageData() {
      //车辆平均停留时长
      getAverageVehicleDwellTime({ siteId: this.address }).then((res) => {
        if (res.data.code === 0) {
          console.log(res);
          this.dateList = res.data.data.date
          this.dataList = res.data.data.value
          this.$nextTick(() => {
            this.init();
          });
        }
      });
    },
    init() {
        let that = this
        let option = {
          backgroundColor: '',
          title: [{
              text: '',
              textAlign: 'center',
              x: '50%',
              y: '50%',
              textStyle: {
                  color: '#8c949a',
                  fontSize: 20,
                  fontWeight: 'normal',
              }
          }],
          tooltip: {
              trigger: 'item',
              backgroundColor: 'rgba(0,0,0,0.9)',
              formatter: function(params) {
                  return params.seriesName + '<br/>' + params.marker + '<span style="color:' + params.color + '">' + params.data['name'] + '\n' + params.data['value'] + '</span>';
              }
          },
          series: [
              {
                  name: '',
                  type: 'pie',
                  hoverAnimation: false,
                  legendHoverLink: false,
                  radius: ['57%', '70%'],
                  center: ['50%', '50%'],
                  color: ['rgba(125, 227, 21,0.3)', 'rgba(2, 204, 156,0.3)', 'rgba(20, 160, 193,0.3)', 'rgba(81, 89, 172,0.3)', 'rgba(8, 144, 158,0.3)'],
                  label: {
                      normal: {
                          position: 'inner'
                      }
                  },
                  labelLine: {
                      normal: {
                          show: false,
                      },

                  },
                  itemStyle: {
                      normal: {
                          // shadowBlur: 15,
                          // shadowColor: 'rgba(0, 0, 0, 0.5)',
                          borderColor:'#0a1a2a',
                          // borderWidth:'10',
                      }
                  },
                  tooltip: {
                      show: false,

                  },
                  data: [{
                          value: 41,
                          name: ''
                      },
                      {
                          value: 20,
                          name: ''
                      },
                      {
                          value: 20,
                          name: ''
                      }, {
                          value: 20,
                          name: ''
                      }, {
                          value: 20,
                          name: ''
                      }
                  ]
              },
              {
                  name: 'title',
                  type: 'pie',
                  radius: ['65%', '70%'],
                  center: ['50%', '50%'],
                  color: ['rgba(125, 227, 21, 1)', 'rgba(2, 204, 156, 1)', 'rgba(20, 160, 193, 1)', 'rgba(81, 89, 172, 1)', 'rgba(8, 144, 158, 1)'],
                  label: {
                      normal: {
                          show: false,
                          position: 'inside',
                          formatter: '{d}%',
                          textStyle: {
                              align: 'center',
                              baseline: 'middle',
                              fontSize: 16,
                              fontWeight: '100',
                          }
                      },
                  },
                  labelLine: {
                      normal: {
                          smooth: true,
                          length: 10,
                          lineStyle: {
                              width: 1.5
                          }
                      }
                  },
                  itemStyle: {
                      normal: {
                          shadowBlur: 15,
                          shadowColor: 'rgba(0, 0, 0, 0.5)',
                          borderColor:'#0a1a2a',
                          // borderWidth:'5',
                      }
                  },
                  data: [{
                          value: 41,
                          name: 'A'
                      },
                      {
                          value: 20,
                          name: 'B'
                      },
                      {
                          value: 20,
                          name: 'C'
                      }, {
                          value: 20,
                          name: 'D'
                      }, {
                          value: 20,
                          name: 'E'
                      }
                  ]
              }
          ]
      };
        let dynamicLightLeft02 = this.$echarts.init(this.$refs.dynamicLightLeft02);
        dynamicLightLeft02.setOption(option);
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