<template>
  <div
    style="
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      flex-direction: row;
    "
  >
    <div style="width: 50%; height: 100%; display: flex; align-items: center">
      <div ref="EnergyConsumePie" class="emgCountChart"></div>
    </div>
    <div
      v-if="pueData.length > 0"
      style="
        width: 50%;
        height: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
      "
    >
      <div
        style="
          width: 100%;
          height: 12%;
          display: flex;
          align-items: center;
          flex-direction: row;
        "
      ></div>
      <div
        v-if="pueData.length > 0"
        style="
          width: 100%;
          height: 15%;
          display: flex;
          align-items: center;
          flex-direction: row;
        "
      >
        <div
          style="width: 10%; height: 100%; display: flex; align-items: center"
        >
          <img src="../../../../../public/img/zhfx/sort1.png" alt="" />
        </div>
        <div
          style="width: 10%; height: 100%; display: flex; align-items: center"
        >
          <!-- <img src="../../../../../public/img/zhfx/car1.png" alt=""> -->
        </div>
        <div
          style="
            width: 60%;
            height: 100%;
            display: flex;
            align-items: center;
            font-size: 14px;
            font-weight: bold;
            color: #ffffff;
          "
        >
          {{pueData.length > 0 ? pueData[0].label : ''}}
        </div>
        <div
          style="
            width: 20%;
            height: 100%;
            display: flex;
            align-items: center;
            font-size: 16px;
            font-weight: normal;
            color: #359cfb;
          "
        >
          {{pueData.length > 0 ? pueData[0].value : ''}}
        </div>
      </div>
      <div
        v-if="pueData.length > 1"
        style="
          width: 100%;
          height: 15%;
          display: flex;
          align-items: center;
          flex-direction: row;
        "
      >
        <div
          style="width: 10%; height: 100%; display: flex; align-items: center"
        >
          <img src="../../../../../public/img/zhfx/sort2.png" alt="" />
        </div>
        <div
          style="width: 10%; height: 100%; display: flex; align-items: center"
        >
          <!-- <img src="../../../../../public/img/zhfx/car1.png" alt=""> -->
        </div>
        <div
          style="
            width: 60%;
            height: 100%;
            display: flex;
            align-items: center;
            font-size: 14px;
            font-weight: bold;
            color: #ffffff;
          "
        >
          {{pueData.length > 1 ? pueData[1].label : ''}}
        </div>
        <div
          style="
            width: 20%;
            height: 100%;
            display: flex;
            align-items: center;
            font-size: 16px;
            font-weight: normal;
            color: #359cfb;
          "
        >
          {{pueData.length > 1 ? pueData[1].value : ''}}
        </div>
      </div>
      <div
        v-if="pueData.length > 2"
        style="
          width: 100%;
          height: 15%;
          display: flex;
          align-items: center;
          flex-direction: row;
        "
      >
        <div
          style="width: 10%; height: 100%; display: flex; align-items: center"
        >
          <img src="../../../../../public/img/zhfx/sort3.png" alt="" />
        </div>
        <div
          style="width: 10%; height: 100%; display: flex; align-items: center"
        >
          <!-- <img src="../../../../../public/img/zhfx/car1.png" alt=""> -->
        </div>
        <div
          style="
            width: 60%;
            height: 100%;
            display: flex;
            align-items: center;
            font-size: 14px;
            font-weight: bold;
            color: #ffffff;
          "
        >
          {{pueData.length > 2 ? pueData[2].label : ''}}
        </div>
        <div
          style="
            width: 20%;
            height: 100%;
            display: flex;
            align-items: center;
            font-size: 14px;
            font-weight: normal;
            color: #359cfb;
          "
        >
          {{pueData.length > 2 ? pueData[2].value : ''}}
        </div>
      </div>
      <div
        v-if="pueData.length > 3"
        style="
          width: 100%;
          height: 15%;
          display: flex;
          align-items: center;
          flex-direction: row;
        "
      >
        <div
          style="width: 10%; height: 100%; display: flex; align-items: center"
        >
          <img src="../../../../../public/img/zhfx/sort4.png" alt="" />
        </div>
        <div
          style="width: 10%; height: 100%; display: flex; align-items: center"
        >
          <!-- <img src="../../../../../public/img/zhfx/car1.png" alt=""> -->
        </div>
        <div
          style="
            width: 60%;
            height: 100%;
            display: flex;
            align-items: center;
            font-size: 14px;
            font-weight: bold;
            color: #ffffff;
          "
        >
          {{pueData.length > 3 ? pueData[3].label : ''}}
        </div>
        <div
          style="
            width: 20%;
            height: 100%;
            display: flex;
            align-items: center;
            font-size: 16px;
            font-weight: normal;
            color: #359cfb;
          "
        >
          {{pueData.length > 3 ? pueData[3].value : ''}}
        </div>
      </div>
      <div
        v-if="pueData.length > 4"
        style="
          width: 100%;
          height: 15%;
          display: flex;
          align-items: center;
          flex-direction: row;
        "
      >
        <div
          style="width: 10%; height: 100%; display: flex; align-items: center"
        >
          <img src="../../../../../public/img/zhfx/sort5.png" alt="" />
        </div>
        <div
          style="width: 10%; height: 100%; display: flex; align-items: center"
        >
          <!-- <img src="../../../../../public/img/zhfx/car1.png" alt=""> -->
        </div>
        <div
          style="
            width: 60%;
            height: 100%;
            display: flex;
            align-items: center;
            font-size: 14px;
            font-weight: bold;
            color: #ffffff;
          "
        >
         {{pueData.length > 4 ? pueData[4].label : ''}}
        </div>
        <div
          style="
            width: 20%;
            height: 100%;
            display: flex;
            align-items: center;
            font-size: 16px;
            font-weight: normal;
            color: #359cfb;
          "
        >
          {{pueData.length > 4 ? pueData[4].value : ''}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts/lib/echarts";
import { getPlanPueRank } from "@/api/sdc/lsd";
export default {
  data() {
    return {
      timerId: null,
      pueData: [],
    };
  },
  props: ['siteId'],
  beforeDestroy() {
    clearInterval(this.timerId);
  },
  mounted() {
    this.queryPageData();
  },
  watch: {
    siteId(newVal, oldVal) {
      if (newVal) {
        this.queryPageData()
      }
    }
  },
  methods: {
    async queryPageData() {
      getPlanPueRank({ siteId: this.siteId }).then((res) => {
        if (res.data.code === 0) {
          this.pueData = res.data.data
          this.$nextTick(() => {
            this.init();
          });
        }
      });
    },
    init() {
      let that = this;

      let num = 0;
      let angle = 0; //角度，用来做简单的动画效果的

      let option = {
        backgroundColor: "#111",
        title: [
          {
            text: "机房最高PUE",
            x: "center",
            top: "62%",
            textStyle: {
              color: "#ffffff",
              fontSize: 9,
              fontWeight: "100",
            },
          },
          {
            text: this.pueData ? this.pueData[0].value : '',
            x: "center",
            top: "36%",
            textStyle: {
              fontSize: "36",
              color: "#ffffff",
              fontFamily: "Lato",
              foontWeight: "700",
            },
          },
        ],
        polar: {
          radius: ["58%", "64%"],
          center: ["50%", "50%"],
        },
        angleAxis: {
          max: 100,
          show: false,
        },
        radiusAxis: {
          type: "category",
          show: true,
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        series: [
          // 紫色
          {
            name: "ring5",
            type: "custom",
            coordinateSystem: "none",
            renderItem: function (params, api) {
              return {
                type: "arc",
                shape: {
                  cx: api.getWidth() / 2,
                  cy: api.getHeight() / 2,
                  r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.9,
                  startAngle: ((0 + angle) * Math.PI) / 180,
                  endAngle: ((90 + angle) * Math.PI) / 180,
                },
                style: {
                  stroke: "#8383FA",
                  fill: "transparent",
                  lineWidth: 1.5,
                },
                silent: true,
              };
            },
            data: [0],
          },
          // 蓝色

          {
            name: "ring5",
            type: "custom",
            coordinateSystem: "none",
            renderItem: function (params, api) {
              return {
                type: "arc",
                shape: {
                  cx: api.getWidth() / 2,
                  cy: api.getHeight() / 2,
                  r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.9,
                  startAngle: ((180 + angle) * Math.PI) / 180,
                  endAngle: ((270 + angle) * Math.PI) / 180,
                },
                style: {
                  stroke: "#4386FA",
                  fill: "transparent",
                  lineWidth: 1.5,
                },
                silent: true,
              };
            },
            data: [0],
          },

          {
            name: "ring5",
            type: "custom",
            coordinateSystem: "none",
            renderItem: function (params, api) {
              return {
                type: "arc",
                shape: {
                  cx: api.getWidth() / 2,
                  cy: api.getHeight() / 2,
                  r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.95,
                  startAngle: ((270 + -angle) * Math.PI) / 180,
                  endAngle: ((40 + -angle) * Math.PI) / 180,
                },
                style: {
                  stroke: "#0CD3DB",
                  fill: "transparent",
                  lineWidth: 1.5,
                },
                silent: true,
              };
            },
            data: [0],
          },
          // 橘色

          {
            name: "ring5",
            type: "custom",
            coordinateSystem: "none",
            renderItem: function (params, api) {
              return {
                type: "arc",
                shape: {
                  cx: api.getWidth() / 2,
                  cy: api.getHeight() / 2,
                  r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.95,
                  startAngle: ((90 + -angle) * Math.PI) / 180,
                  endAngle: ((220 + -angle) * Math.PI) / 180,
                },
                style: {
                  stroke: "#FF8E89",
                  fill: "transparent",
                  lineWidth: 1.5,
                },
                silent: true,
              };
            },
            data: [0],
          },
          {
            name: "",
            type: "bar",
            roundCap: true,
            barWidth: 60,
            showBackground: true,
            backgroundStyle: {
              color: "rgba(66, 66, 66, 0)",
            },
            data: [35],
            coordinateSystem: "polar",

            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: "#0EFCF9",
                  },
                  {
                    offset: 1,
                    color: "#06AFFC",
                  },
                ]),
              },
            },
          },
          {
            type: "gauge",
            name: "",
            radius: "80%",
            startAngle: "-269.99",
            endAngle: "90",
            splitNumber: "40",
            center: ["50%", "50%"],
            pointer: {
              show: false,
            },
            title: {
              show: false,
            },
            detail: {
              show: false,
            },
            data: [
              {
                value: 95,
                name: "",
              },
            ],
            axisLine: {
              lineStyle: {
                width: 10,
                opacity: 0,
              },
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: true,
              length: 8,
              lineStyle: {
                color: {
                  type: "linear",
                  x: 1,
                  y: 0,
                  x2: 0,
                  y2: 0,
                  colorStops: [
                    {
                      offset: 0,
                      color: "#111",
                    },
                    {
                      offset: 0.5,
                      color: "rgba(66, 66, 66, 1)",
                    },
                    {
                      offset: 1,
                      color: "#111",
                    },
                  ],
                  globalCoord: false,
                },
                width: 2,
                type: "solid",
              },
            },
            axisLabel: {
              show: false,
            },
          },
        ],
      };
      let draw = () => {
        angle = angle + 3;
        let EnergyConsumePie = this.$echarts.init(this.$refs.EnergyConsumePie);
        EnergyConsumePie.setOption(option, true);
        //window.requestAnimationFrame(draw);
      };
      if (!this.timerId) {
        this.timerId = setInterval(function () {
          //用setInterval做动画
          draw();
        }, 100);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.emgCountChart {
  width: 100%;
  height: 167px;
  //padding: 0 0 1rem 1rem;
  position: relative;
  //top: 20px;
  color: #ffffff;
}
</style>