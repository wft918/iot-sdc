<template>
  <div style="width:100%;height:100%;display: flex;align-items: flex-end;">
    <div ref="right01" class="emgCountChart"></div>
  </div>
</template>

<script>
import { sdcSiteAction } from "@/api/sdc/addressInfo";
import { modifyData } from "@/util/domainFilter";

import { getMainPollutants } from "@/api/sdc/lsd";

export default {
  name: "EmgCount",
  data() {
    return {
			mainPollutantsInfo: {
				groupname: ['SO2', 'CO', 'NO2'],
				value: [10, 30, 50]
			}
    };
  },
  mounted() {
    // this.queryPageData()
		this.init()
  },
  methods: {
      async queryPageData() {
      //获取初始区域查询条件数据
      let data = await sdcSiteAction("", "/tree", "get");
      let condition = modifyData(data.data.data);
      let siteId = condition[0].id;
      getMainPollutants({ siteId: siteId }).then((res) => {
        if (res.data.code === 0) {
          this.mainPollutantsInfo = res.data.data;
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
            grid: {
                left: '12%',
                top: '15%',
                bottom: '12%',
                right: '8%'
            },
            xAxis: {
                data: this.mainPollutantsInfo.groupname,
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false,
                },
                // axisLine: {
                //     lineStyle: {
                //         color: 'rgba(255, 129, 109,.1)',
                //         width: 1 //这里是为了突出显示加上的
                //     }
                // },
                axisLabel: {
                    show: false,
                    textStyle: {
                        color: '#999',
                        fontSize: 12
                    }
                }
            },
            yAxis: [{
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: 'rgba(255, 129, 109, 0.1)',
                            width: 1 //这里是为了突出显示加上的
                        }
                    },
                    axisLabel: {
                        show: false,
                        textStyle: {
                            color: '#999'
                        }
                    },
                    splitArea: {
                        areaStyle: {
                            color: 'rgba(255,255,255,.5)'
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: 'rgba(255, 129, 109, 0.1)',
                            width: 0.5,
                            type: 'dashed'
                        }
                    }
                }
            ],
            series: [{
                type: 'pictorialBar',
                barCategoryGap: '0%',
                symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
                label: {
                    show: true,
                    position: 'top',
                    distance: 15,
                    color: '#08DFFE',
                    fontWeight: 'bolder',
                    fontSize: 15,
                },
                itemStyle: {
                    normal: {
                        color: function(params) {
                            let barTopColor = ["#008ed6", "#00fcf5", "#c79ffc", "#008ed6","#c79ffc","#008ed6","#00fcf5","#c79ffc"];
                            let barBottomColor = ["rgba(2,118,182,0.1)", "rgba(2,205,206,0.1)", "rgba(161,131,212,0.1)", "rgba(2,118,182,0.1)","rgba(161,131,212,0.1)","rgba(2,118,182,0.1)","rgba(2,205,206,0.1)","rgba(161,131,212,0.1)"];
                            return {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                        offset: 0,
                                        color:barTopColor[params.dataIndex]
                                    },
                                    {
                                        offset: 1,
                                        color:barBottomColor[params.dataIndex]
                                    }
                                ],
                                global: false //  缺省为  false
                            }
                        },
                        opacity: 1
                    },
                    emphasis: {
                        opacity: 1
                    }
                },
                data: this.mainPollutantsInfo.value
            }]
        };
        let right01 = this.$echarts.init(this.$refs.right01);
        right01.setOption(option);
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