<template>
  <div style="width:100%;height:100%;display: flex;align-items: flex-end;">
    <div ref="right02" class="emgCountChart"></div>
  </div>
</template>

<script>
import echarts from 'echarts/lib/echarts'

import { sdcSiteAction } from "@/api/sdc/addressInfo";
import { modifyData } from "@/util/domainFilter";

import { getAlarmStatusStatistics } from "@/api/sdc/lsd";

export default {
  name: "EmgCount",
  data() {
    return {
        alarmStatusInfo: []
    };
  },
  mounted() {
    this.queryPageData();
  },
  methods: {
      async queryPageData() {
      //获取初始区域查询条件数据
      let data = await sdcSiteAction("", "/tree", "get");
      let condition = modifyData(data.data.data);
      let siteId = condition[0].id;
      getAlarmStatusStatistics({ siteId: siteId }).then((res) => {
        if (res.data.code === 0) {
          this.alarmStatusInfo.push(res.data.data.alarmOther) ;
          this.alarmStatusInfo.push(res.data.data.alarmPower) ;
          this.alarmStatusInfo.push(res.data.data.alarmLighting) ;
          this.alarmStatusInfo.push(res.data.data.alarmSecurity) ;
          this.alarmStatusInfo.push(res.data.data.alarmAirconditioner) ;
          this.alarmStatusInfo.push(res.data.data.alarmCabinet) ;
          console.log(this.alarmStatusInfo, "alarmStatusInfo");
          this.$nextTick(() => {
            this.init();
          });
        }
      });
    },
    init() {
        let that = this
        let option = {
            grid: {
                //left: '5%',
                right: '5%',
                bottom: '5%',
                top: '5%',
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
                        params[0].seriesName + ' : ' + Number(params[0].value) + ' <br/>'
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
                data: ['其它', '动力', '照明', '安防', '空调', '机柜']
            }, {
                type: 'category',
                inverse: true,
                axisTick: 'none',
                axisLine: 'none',
                show: true,
                axisLabel: {
                    textStyle: {
                        color: '#ffffff',
                        fontSize: '12'
                    },
                    formatter: function(value) {
                        if (value >= 10000) {
                            return (value / 10000).toLocaleString();
                        } else {
                            return value.toLocaleString();
                        }
                    },
                },
                data: this.alarmStatusInfo
            }],
            series: [{
                    name: '个数',
                    type: 'bar',
                    zlevel: 1,
                    itemStyle: {
                        normal: {
                            barBorderRadius: 30,
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                offset: 0,
                                color: 'rgb(57,89,255,1)'
                            }, {
                                offset: 1,
                                color: 'rgb(46,200,207,1)'
                            }]),
                        },
                    },
                    barWidth: 20,
                    data: this.alarmStatusInfo
                },
                {
                    name: '背景',
                    type: 'bar',
                    barWidth: 20,
                    barGap: '-100%',
                    data: this.alarmStatusInfo,
                    itemStyle: {
                        normal: {
                            color: 'rgba(24,31,68,1)',
                            barBorderRadius: 30,
                        }
                    },
                },
            ]
        };
       
      
      let right02 = this.$echarts.init(this.$refs.right02);
      right02.setOption(option);
    }
  },
 
};
</script>

<style lang="scss" scoped>
.emgCountChart {
  width: 100%;
  height: 250px;
  //padding: 0 0 1rem 1rem;
  position: relative;
  //top: 20px;
  color: #ffffff;
}

</style>