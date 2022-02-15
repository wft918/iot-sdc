<template>
  <div style="width:100%;height:100%;">
    <div ref="round8" class="emgCountChart"></div>
  </div>
</template>

<script>
import echarts from "echarts/lib/echarts"
import 'echarts-liquidfill'
import { getPueAndConsume } from "@/api/sdc/lsd";
export default {
  name: "EmgCount",
  props: ['planId'],
  data() {
    return {
        pacData: {},
        itPower: null,
        otherPower: null,
    };
  },
  watch: {
    planId(newValue, oldValue) {
      if(newValue) {
        this.queryPageData()
      }
    }
  },
  mounted() {
    // this.queryPageData()
  },
  methods: {
    async queryPageData() {
      getPueAndConsume(this.planId).then(res => {
        if (res.data.code === 0) {
          this.pacData = res.data.data
          console.log(this.pacData, 'this.pacData..............');
          this.itPower = this.pacData.it
          this.otherPower = this.pacData.other
          this.$nextTick(() => {
            this.init()
          })
        }
      })
    },
    init() {
        let option = {
          tooltip: {
            trigger: 'item',
            formatter: function(params) {
                    let html = '';
                        // console.log(v)
                        html += `<div style="color: #666;font-size: 14px;line-height: 24px">
                        <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.name === 'IT设备能耗' ? '#C49AFF' : '#009FDE'};"></span>
                        ${params.name}:
                        <span style="color:${params.name === 'IT设备能耗' ? '#C49AFF' : '#009FDE'};font-weight:700;font-size: 16px">${params.value} kWh</span>`
                    return html
                },
                extraCssText: 'background: #fff; border-radius: 0;box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);color: #333;',
          },
          legend: {
            right: 10,
            top: 20,
            // bottom: 20,
            orient: 'vertical',
            itemWidth: 14,
            textStyle: {
              fontSize: '14',
              color: '#CCC'
            }
          },
          series: [
            {
              name: '能耗',
              type: 'pie',
              radius: ['48%', '60%'],
              center: ['40%', '50%'],
              avoidLabelOverlap: false,
              label: {
                show: true,
                // position: 'inside',
                fontSize: 12,
                color: '#FFF',
                formatter:'{d}%'
              },
              labelLine: {
                show: false,
                length: 0
              },
              color: [
                  new echarts.graphic.LinearGradient(1,1,0,0,[{
                  offset: 0,
                  color: '#C49AFF'
                  },
                  {
                    
                    offset: 0.8,
                    color: '#E3D3FA'
                  }
                ]),
                new echarts.graphic.LinearGradient(1,1,0,0,[{
                    offset: 0,
                    color: '#009FDE'
                  },
                  {
                    
                    offset: 0.8,
                    color: '#00D8EA'
                  }
                ])
              ],
              data: [
                { value: this.itPower, name: 'IT设备能耗' },
                { value: this.otherPower, name: '非IT设备能耗' }
              ]
            }
          ]
        };
        let round8 = this.$echarts.init(this.$refs.round8);
        round8.setOption(option);
    }
  }
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