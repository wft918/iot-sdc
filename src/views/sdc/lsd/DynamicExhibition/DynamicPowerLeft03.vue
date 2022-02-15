<template>
  <div style="width:100%;height:100%;">
    <div ref="DynamicPowerLeft03" class="emgCountChart"></div>
  </div>
</template>

<script>
import echarts from "echarts/lib/echarts"
import 'echarts-liquidfill'
import { getVehicleCategoryStatistics } from "@/api/sdc/lsd";
export default {
  name: "DynamicPowerLeft03",
  props: ['deviceStatus'],
  data() {
    return {
        address: null,
        chartData: []
    };
  },
  mounted() {
    // this.address = this.siteId
    this.address = "cff1bf7b5dc745e2ac6f7e9afef531f7"
    this.queryPageData()
  },
  watch: {
    deviceStatus(newVal, oldVal) {
			if (newVal) {
				this.init()
			}
    }
  },
  methods: {
    async queryPageData() {
      this.$nextTick(() => {
        this.init()
      })
      
    },
    init() {
        console.log(this.deviceStatus,'deviceStatus========');
        this.chartData = [
            {
                name: '总数',
                value: this.deviceStatus.online + this.deviceStatus.offline + this.deviceStatus.alarm
            },
            {
                name: '在线',
                value: this.deviceStatus.online
            },
            {
                name: '告警',
                value: this.deviceStatus.alarm
            }
        ]
        let option = {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            show: false
          },
          series: [
            {
              name: '设备',
              type: 'pie',
              radius: ['50%', '70%'],
              center: ['50%', '50%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
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
                  color: '#36A0E4'
                  },
                  {
                    
                    offset: 0.9,
                    color: '#A7CEE5'
                  }
                ]),
                new echarts.graphic.LinearGradient(1,1,0,0,[{
                    offset: 0,
                    color: '#6EFFE5'
                  },
                  {
                    
                    offset: 0.9,
                    color: '#DEFAF5'
                  }
                ]),
                new echarts.graphic.LinearGradient(1,1,0,0,[{
                    offset: 0,
                    color: '#F55353'
                  },
                  {
                    
                    offset: 0.9,
                    color: '#F2B2B2'
                  }
                ])
              ],
              data: this.chartData
            }
          ]
        };
        let DynamicPowerLeft03 = this.$echarts.init(this.$refs.DynamicPowerLeft03);
        DynamicPowerLeft03.setOption(option);
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