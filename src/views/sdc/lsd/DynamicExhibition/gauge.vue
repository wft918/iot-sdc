<template>
  <div style="width:100%;height:100%;">
    <div ref="gauge" class="emgCountChart"></div>
  </div>
</template>

<script>
import echarts from "echarts/lib/echarts"
import 'echarts-liquidfill'
export default {
  name: "EmgCount",
  props: ['gaugeData','center'],
  data() {
    return {
    };
  },
  watch: {
    gaugeData(newValue, oldValue) {
      if(newValue) {
        this.init()
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
        let option = {
          series: [
            {
              type: 'gauge',
              startAngle: 225,
              endAngle: -45,
              min: 0,
              max: 2.5,
              splitNumber: 5,
              axisLine: {
                lineStyle: {
                  width: 8,
                  color: [
                    [0.2, '#91C8AD'],
                    [0.4, '#63869F'],
                    [0.6, '#63869F'],
                    [0.8, '#63869F'],
                    [1.0, '#C2332B'],
                  ]
                }
              },
              // center: ['35%', '45%'],
              center: this.center,

              pointer: {
                length: '75%',
                width: 3,
                itemStyle: {
                  color: '#FF0000'
                }
              },
              axisTick: {
                show: false,
                distance: -30,
                length: 2,
                lineStyle: {
                  color: '#FFF'
                }
              },
              splitLine: {
                show: true,
                length: 8,
                lineStyle: {
                  color: '#000',
                  width: 2,
                  opacity: 0.6
                }
              },
              axisLabel: {
                color: '#FFF',
                fontSize: 14,
                distance: -30,
              },
              title: {
                offsetCenter: [0, '65%'],
                fontSize: 14,
                color: '#FFF'
              },
              detail: {
                fontSize: 14,
                offsetCenter: [0, '25%'],
                valueAnimation: true,
                color: '#FFF',
                valueAnimation: true
              },
              data: [
                {
                  value: this.gaugeData,
                  name: 'PUE'
                }
              ]
            }
          ]
        };
        let gauge = this.$echarts.init(this.$refs.gauge);
        gauge.setOption(option);
    }
  }
};
</script>

<style lang="scss" scoped>
.emgCountChart {
  width: 100%;
  height: 180px;
  position: relative;
  color: #ffffff;
}

</style>