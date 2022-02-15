<template>
  <div style="width:100%;height:100%;display: flex;align-items: center;">
    <div ref="dynamicCarRight02" class="emgCountChart"></div>
  </div>
</template>

<script>
import echarts from "echarts/lib/echarts"
import 'echarts-liquidfill'
import { getVehicleCategoryStatistics } from "@/api/sdc/lsd";
export default {
  name: "EmgCount",
  data() {
    return {
        address: null,
        echartData: []
    };
  },
  mounted() {
    // this.address = this.siteId
    this.address = "cff1bf7b5dc745e2ac6f7e9afef531f7"
    this.queryPageData()
  },
  methods: {
    async queryPageData() {
      //车辆类别统计
      getVehicleCategoryStatistics({ siteId: this.address }).then((res) => {
        if (res.data.code === 0) {
          console.log(res);
          this.echartData = []
          this.echartData.push({
              name: "1分",
              value: res.data.data.vehicleInternal
          })
          this.echartData.push({
              name: "2分",
              value: res.data.data.vehicleMonthly
          })
          this.echartData.push({
              name: "3分",
              value: res.data.data.vehicleTemporary
          })
          this.$nextTick(() => {
            this.init();
          });
        }
      });
    },
    init() {
        let that = this
        // 数据初始化
        let fontColor = '#fff'
        // let echartData = [{
        //         name: "1分",
        //         value: 50
        //     },
        //     {
        //         name: "2分",
        //         value: 100
        //     },
        //     {
        //         name: "3分",
        //         value: 50
        //     },
        // ];
        let option = {
            backgroundColor: '',
            color: ['#C69BFF', '#00D7EA', '#28DAFB'],
            tooltip: {
                trigger: "item",
                formatter: "{b}: {c} ({d}%)"
            },
            title: {
                text: '车辆类别',
                top: '45%',
                textAlign: "center",
                left: "50%",
                textStyle: {
                    color: fontColor,
                    fontSize: 20,
                    fontWeight: '400'
                }
            },
            toolbox: {
                show: false
            },
            series: [{
                name: "",
                type: "pie",
                radius: [0, 75],
                center: ["50%", "50%"],
                label: {
                    show: false
                },
                itemStyle: {
                    normal: {
                        color: 'rgba(24,219,159,0.1)'
                    },
                },
                hoverAnimation: false,
                data: [100]
            }, {
                name: "",
                type: "pie",
                radius: [70, 55],
                center: ["50%", "50%"],
                label: {
                    normal: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(24,219,159,0.6)',
                    }
                },
                hoverAnimation: false,
                hoverOffset: 5,
                data: this.echartData
            }]
        };
        let dynamicCarRight02 = this.$echarts.init(this.$refs.dynamicCarRight02);
        dynamicCarRight02.setOption(option);
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