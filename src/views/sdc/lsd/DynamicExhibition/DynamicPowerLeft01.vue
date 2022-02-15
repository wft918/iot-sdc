<template>
  <div style="width: 100%; height: 100%; display: flex; align-items: center">
    <div ref="dynamicPowerLeft01" class="emgCountChart"></div>
  </div>
</template>

<script>
import echarts from "echarts/lib/echarts";
import "echarts-liquidfill";

import { sdcSiteAction } from "@/api/sdc/addressInfo";
import { modifyData } from "@/util/domainFilter";

import { getDeviceTypeStatistics } from "@/api/sdc/lsd";

export default {
  name: "EmgCount",
  props: ['siteId'],
  data() {
    return {
      deviceTypeData: [],
      chartData1: [],
      chartData2: [],
      systemTypeList: this.$dictUtils.getDictList('sys_type')
    };
  },
  watch: {
    siteId(newVal) {
      if (newVal) {
        this.queryPageData()
      }
    }
  },
  mounted() {
    this.queryPageData();
    this.init()
  },
  methods: {
    async queryPageData() {
      this.legendData = []
      this.valueData = []
      getDeviceTypeStatistics(this.siteId).then((res) => {
        if (res.data.code === 0) {
          this.deviceTypeData = res.data.data
          this.chartData1 = []
          this.chartData2 = []
          this.deviceTypeData.forEach(item => {
            if (item.value === '1' || item.value === '2' || item.value === '3'|| item.value === '4' || item.value === '5') {
              this.chartData1.push({
                name: '',
                value: item.num
              })
              this.chartData2.push({
                name: item.label.replace(/系统/,'设备'),
                value: item.num
              })
            }
          })
          console.log(this.legendData, this.valueData);
          this.$nextTick(() => {
            this.init();
          });
        }
      });
    },
    init() {
      let that = this;
      let option = {
        backgroundColor: "",
        title: [
          {
            text: "",
            textAlign: "center",
            x: "34%",
            y: "48%",
            textStyle: {
              color: "#8c949a",
              fontSize: 20,
              fontWeight: "normal",
            },
          },
        ],
        tooltip: {
          trigger: "item",
          backgroundColor: "rgba(0,0,0,0.9)",
          formatter: function (params) {
            console.log(params, 'tooltip');
            return (
              params.seriesName +
              "<br/>" +
              params.marker +
              '<span style="color:' +
              params.color +
              '">' +
              params.data["name"] +
              "\n" +
              params.data["value"] +
              "</span>"
            );
          },
        },
        legend: [
          {
            show: true,
            orient: 'vertical',
            // x: "70%",
            // y: "15%",
            top: 5,
            right: 5,
            itemWidth: 10,
            itemHeight: 10,
            // align: "left",
            itemGap: 20,
            textStyle: {
              fontSize: 14,
              color: "#C8DBF5",
            },
            data: this.chartData2.name,
          }
        ],
        series: [
          {
            name: "",
            type: "pie",
            hoverAnimation: false,
            legendHoverLink: false,
            radius: ["57%", "70%"],
            center: ["40%", "52%"],
            color: [
              "rgba(64,175,245, 0.3)",
              "rgba(255,255,53, 0.3)",
              // "rgba(159,244,255, 0.3)",
              "rgba(255,164,0, 0.3)",
              "rgba(48,255,174, 0.3)",
              "rgba(255,84,77, 0.3)",
            ],
            label: {
              normal: {
                show: false,
                position: "inner",
              },
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
                borderColor: "#0a1a2a",
                // borderWidth:'10',
              },
            },
            tooltip: {
              show: false,
            },
            data: this.chartData1,
          },
          {
            name: "设备",
            type: "pie",
            radius: ["65%", "75%"],
            center: ["40%", "52%"],
            color: [
              "rgba(64,175,245, 1)",
              "rgba(255,255,55, 1)",
              // "rgba(159,244,255, 1)",
              "rgba(255,164,0, 1)",
              "rgba(48,255,174, 1)",
              "rgba(255,84,77, 1)",
            ],
            label: {
              normal: {
                show: true,
                // position: "inside",
                formatter: "{d}%",
                textStyle: {
                  align: "center",
                  baseline: "middle",
                  fontSize: 16,
                  fontWeight: "100",
                },
              },
            },
            labelLine: {
              normal: {
                smooth: true,
                length: 5,
                lineStyle: {
                  width: 1.5,
                },
              },
            },
            itemStyle: {
              normal: {
                shadowBlur: 15,
                shadowColor: "rgba(0, 0, 0, 0.5)",
                borderColor: "#0a1a2a",
                // borderWidth:'5',
              },
            },
            data: this.chartData2,
          },
        ],
      };
      let dynamicPowerLeft01 = this.$echarts.init(
        this.$refs.dynamicPowerLeft01
      );
      dynamicPowerLeft01.setOption(option);
    },
  },
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