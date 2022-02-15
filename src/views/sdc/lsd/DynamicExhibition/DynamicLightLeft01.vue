<template>
  <div style="width:100%;height:100%;display: flex;align-items: center;">
    <div ref="dynamicLightLeft01" class="emgCountChart"></div>
  </div>
</template>

<script>
import { getParkEnviroMonitorInfo } from "@/api/sdc/lsd";
export default {
  name: "EmgCount",
  data() {
    return {
      address: null,
      chartData: []
    };
  },
  mounted() {
    // this.address = this.siteId
    this.address = "cff1bf7b5dc745e2ac6f7e9afef531f7"
    console.log(this.address,'this.address');
    // this.init();
    this.queryPageData()
  },
  methods: {
    async queryPageData() {
      //园区环境监控
      getParkEnviroMonitorInfo({ siteId: this.address }).then((res) => {
        if (res.data.code === 0) {
          console.log(res);
          this.chartData = []
          this.chartData.push(res.data.data.envirTemp)
          this.chartData.push(res.data.data.envirHumidity)
          this.chartData.push(res.data.data.envirPressure)
          this.chartData.push(res.data.data.envirWindDire)
          this.chartData.push(res.data.data.envirPm25)
          this.chartData.push(res.data.data.envirTemp)
          this.$nextTick(() => {
            this.init();
          });
        }
      });
    },
    init() {
        let that = this
        let dataMax = 60;
        const source = {
            data: this.chartData,
            indicator: [
            { name: '温度', max: dataMax},
            { name: '湿度', max: dataMax},
            { name: '气压', max: dataMax},
            { name: '风向', max: dataMax},
            { name: 'pm2.5', max: dataMax},
            { name: 'pm10', max: dataMax},
            ]
        }
        const buildSeries = function(data){
            const helper = data.map((item, index) => {
            const arr = new Array(data.length);
            arr.splice(index, 1, item);
            return arr;
            })

            return [data, ...helper].map((item, index) => {
            return {
                type: 'radar',
                itemStyle: {
                color: '#31e586'
                },
                lineStyle: {
                color: index === 0 ? '#31e586' : 'transparent'
                },
                areaStyle: {
                color: index === 0 ? '#31e586' : 'transparent',
                opacity: 0.3
                },
                tooltip: {
                show: index === 0 ? false : true,
                formatter: function() {
                    return source.indicator[index - 1].name;
                }
                },
                z: index === 0 ? 1 : 2,
                data: [item]
            }
            })
        }
        let option = {
            backgroundColor: '',
            tooltip: {},
            radar: {
            // shape: 'circle',
            name: {
                textStyle: {
                fontSize: 12,
                color: ['#d1dbf2'],
                padding: [3, 5]
                }
            },
            splitNumber: 4,
            splitArea: {
                show: true,
                areaStyle: {
                color: ['rgba(12,62,129,0)','rgba(12,62,129,0.3)','rgba(12,62,129,0)','rgba(12,62,129,0)']
                }
            },
            splitLine: {
                lineStyle: {
                color: '#0c3e81'
                }
            },
            axisLine: {
                lineStyle: {
                color: '#0c3e81'
                }
            },
            indicator: source.indicator
            },
            series: buildSeries(source.data)
        };
        let dynamicLightLeft01 = this.$echarts.init(this.$refs.dynamicLightLeft01);
        dynamicLightLeft01.setOption(option);
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