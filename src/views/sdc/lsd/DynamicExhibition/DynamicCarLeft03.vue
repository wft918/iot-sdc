<template>
  <div style="width:100%;height:100%;display: flex;align-items: center;">
    <div ref="dynamicCarLeft03" class="emgCountChart"></div>
  </div>
</template>

<script>
import echarts from "echarts/lib/echarts"
import 'echarts-liquidfill'

import { getParkingLotZoningStatistics } from "@/api/sdc/lsd";

export default {
  name: "EmgCount",
  data() {
    return {
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
      //获取初始区域查询条件数据
      getParkingLotZoningStatistics({ siteId: this.address }).then((res) => {
        if (res.data.code === 0) {
          console.log(res);
          this.$nextTick(() => {
            this.init();
          });
        }
      });
    },
    init() {
        let that = this
        var option = {
            backgroundColor: '',
            series: [{
                    type: 'liquidFill',
                    radius: '50%',
                    color: ['#195ba6'],
                    center: ['18%', '50%'],
                    data: [0.45, 0.45, 0.45, 0.45, 0.45],
                    backgroundStyle: {
                        borderWidth: 2,
                        borderColor: '#1789fb',
                        color: '#1c233f',
                    },
                    outline: {
                        itemStyle: {
                            borderWidth: 5,
                            borderColor: '#1789fb',
                            borderType: 'dashed',
                        }
                    },
                    label: {
                        normal: { //此处没有生效，本地生效
                            textStyle: {
                                fontSize: 20,
                                color: '#e6e6e6',
                            },
                        },
                    },
                },
                {

                    type: 'liquidFill',
                    radius: '50%',
                    color: ['#884046'],
                    center: ['50%', '50%'],
                    data: [0.6, 0.6, 0.6, 0.6, 0.6],
                    backgroundStyle: {
                        borderWidth: 2,
                        borderColor: '#eb5c4d',
                        color: '#1c233f',
                    },
                    outline: {
                        itemStyle: {
                            borderWidth: 5,
                            borderColor: '#eb5c4d',
                            borderType: 'dashed',
                        }
                    },
                    label: {
                        normal: { // 同上
                            textStyle: {
                                fontSize: 20,
                                color: '#e6e6e6',
                            },
                        },
                    },

                },
                {

                    type: 'liquidFill',
                    radius: '50%',
                    color: ['#8a7e4e'],
                    center: ['82%', '50%'],
                    data: [0.3, 0.3, 0.3, 0.3, 0.3],
                    backgroundStyle: {
                        borderWidth: 2,
                        borderColor: '#f0d25c',
                        color: '#1c233f',
                    },
                    outline: {
                        itemStyle: {
                            borderWidth: 5,
                            borderColor: '#f0d25c',
                            borderType: 'dashed',
                        }
                    },
                    label: {
                        normal: { // 同上
                            textStyle: {
                                fontSize: 20,
                                color: '#e6e6e6',
                            },
                        },
                    },

                }
            ]
        };
        let dynamicCarLeft03 = this.$echarts.init(this.$refs.dynamicCarLeft03);
        dynamicCarLeft03.setOption(option);
    }
  }
};
</script>

<style lang="scss" scoped>
.emgCountChart {
  width: 100%;
  height: 200px;
  //padding: 0 0 1rem 1rem;
  position: relative;
  //top: 20px;
  color: #ffffff;
}

</style>