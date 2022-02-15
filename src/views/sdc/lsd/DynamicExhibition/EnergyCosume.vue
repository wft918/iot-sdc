<template>
  <section class="energy-consume">
    <div class="text-title">
      <div class="text-header">
        <span>能耗占比</span>
      </div>
      <div class="text-body">
        <div class="text-colum2">
          <div ref="EnergyConsumePie" class="EnergyConsume"></div>
        </div>
        <div class="text-colum1">
          <div ref="EnergyConsumeBar" class="EnergyConsume"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import * as d3 from "d3"
import { draw, transition } from "@/util/render3DCharts";

export default {
  name: "EnergyConsume",
  data() {
    return {
      salesData: [
        { label: '动力', color: '#e42af8' },
        { label: '照明', color: '#8649f8' },
        { label: '安防', color: '#6bcce7' },
        { label: '空调', color: '#1739f7' },
        { label: '机柜', color: '#3366CC' },
        { label: '其他', color: '#990099' }
      ],
      data: [156, 96, 136, 68, 64, 98]
    };
  },
  mounted() {
    this.create3DPie(this.$refs.EnergyConsumePie,false)
    this.init();
  },
  methods: {
    create3DPie(id, ischange) {
      (() => {
        d3.select(id)
          .selectAll('svg')
          .remove();
      })();

      const svg = d3
        .select(id)
        .append('svg')
        .attr('width', 300)
        .attr('height', 300);

      // svg.append('g').attr('id', 'salesDonut');
      svg.append('g').attr('id', 'quotesDonut');
      if (ischange) {
        this.changeData();
      }
      // draw('salesDonut', this.randomData(), 150, 150, 130, 100, 30, 0.4);
      draw('quotesDonut', this.randomData(), 90, 75, 75, 60, 20, 0);
    },
    changeData() {
      transition('salesDonut', this.randomData(), 130, 100, 30, 0.4);
      transition('quotesDonut', this.randomData(), 130, 100, 30, 0);
    },
    randomData() {
      return this.salesData.map((d,index) => {
        return { label: d.label, value: this.data[index], color: d.color };
      });
    },

    init() {
      // let EnergyConsumePie = this.$echarts.init(this.$refs.EnergyConsumePie);
      // EnergyConsumePie.setOption({
      //   color: ["#e42af8", "#8649f8", "#6bcce7", "#1739f7"],
      //   tooltip: {
      //     trigger: "item",
      //   },
      //   series: [
      //     {
      //       name: "能耗占比",
      //       type: "pie",
      //       radius: "100%",
      //       center: ["50%", "40%"],
      //       data: [
      //         { value: 64, name: "动力" },
      //         { value: 68, name: "照明" },
      //         { value: 136, name: "安防" },
      //         { value: 96, name: "空调" },
      //       ].sort(function (a, b) {
      //         return a.value - b.value;
      //       }),
      //       roseType: "radius",
      //       label: {
      //         //饼图图形上的文本标签
      //         normal: {
      //           show: true,
      //           position: "inner", //标签的位置
      //           textStyle: {
      //             color: "#ffffff",
      //             fontSize: 10, //文字的字体大小
      //           },
      //           formatter: "{d}%",
      //         },
      //       },
      //     },
      //   ],
      // });

      let EnergyConsumeBar = this.$echarts.init(this.$refs.EnergyConsumeBar);
      EnergyConsumeBar.setOption({
        title: {
          //设置标题
          textStyle: {
            fontSize: 14,
            fontWeight: 400,
          },
        },
        color: ["#3f8ef7"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        legend: {
          data: ["制冷", "IT设备", "照明", "其他"],
          icon: "circle",
          left: "50%",
          itemGap: 5,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "10%",
          top: "5%",
          height: "80%",
          width: "90%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "value",
            show: false,
            splitLine: {
              show: false,
            },
          },
        ],
        yAxis: [
          {
            type: "category",
            data: ["机柜", "空调", "安防", "照明", "动力", "其他"],
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              textStyle: {
                color: "#bff7ff",
              },
            },
          },
        ],
        series: [
          {
            name: "能耗占比",
            type: "bar",
            barGap: "-50%",
            barWidth: 11,
            data: this.data,
            itemStyle: {
              normal: {
                label: {
                  show: true, //开启显示
                  position: "right", //在上方显示
                  textStyle: {
                    //数值样式
                    color: "#00deff",
                  },
                },
                barBorderRadius: 5,
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#0ed7ee" },
                  { offset: 1, color: "#0076ff" },
                ]),
              },
            },
          },
        ],
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.energy-consume {
  width: 100%;
  height: 25%;
}
.text-body {
  top: 1.5rem;
  height: 80%;
  align-items: center;
  justify-items: center;
}
.text-colum1 {
  width: 50%;
}

.text-colum2 {
  width: 50%;
  margin-left: 3%;
}
.EnergyConsume {
  width: 100%;
  min-height: 230px;
  padding: 0 0 0.5rem 1rem;
  position: relative;
  top: 1rem;
  color: #ffffff;
}
</style>