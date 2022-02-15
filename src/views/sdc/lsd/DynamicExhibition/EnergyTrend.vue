<template>
  <section class="energy-trend">
    <div class="text-title">
      <div class="text-header">
        <div style="display: inline">数据中心能效走势</div>
      </div>
      <div class="text-body">
        <el-button-group class="button-group">
          <el-button @click="changeData('1')" size="mini" :class="btn1">
            近一周
          </el-button>
          <el-button @click="changeData('2')" size="mini" :class="btn2">
            近一月
          </el-button>
        </el-button-group>
        <div
          ref="energyChart"
          class="energyChart"
          style="margin-top: 20px"
        ></div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "EnergyTrend",
  data() {
    return {
      time: ["03-15", "03-16", "03-17", "03-18", "03-19", "03-20", "03-21"],
      data: [1.2, 0.9, 1.0, 1.1, 1.5, 1.4, 1.3],
      btn1: "el-button-2",
      btn2: "el-button-1",
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    changeData(val) {
      switch (val) {
        case "1":
          this.time = [
            "03-15",
            "03-16",
            "03-17",
            "03-18",
            "03-19",
            "03-20",
            "03-21",
          ];
          this.data = [1.2, 0.9, 1.0, 1.1, 1.5, 1.4, 1.3];
          this.btn1 = "el-button-2";
          this.btn2 = this.btn3 = "el-button-1";
          this.init();
          break;
        case "2":
          this.time = [
            "03-01",
            "03-02",
            "03-03",
            "03-04",
            "03-05",
            "03-06",
            "03-07",
            "03-08",
            "03-09",
            "03-10",
            "03-11",
            "03-12",
            "03-13",
            "03-14",
            "03-15",
            "03-16",
            "03-17",
            "03-18",
            "03-19",
            "03-20",
            "03-21",
            "03-22",
            "03-23",
            "03-24",
            "03-25",
            "03-26",
            "03-27",
            "03-28",
            "03-29",
            "03-30",
            "03-31",
          ];
          this.data = [
            1.2,
            0.9,
            1.0,
            1.1,
            1.5,
            1.4,
            1.3,
            1.2,
            0.9,
            1.0,
            1.1,
            1.5,
            1.4,
            1.3,
            1.2,
            0.9,
            1.0,
            1.1,
            1.5,
            1.4,
            1.3,
            1.2,
            0.9,
            1.0,
            1.1,
            1.5,
            1.4,
            1.3,
            1.2,
            0.9,
            1.1,
          ];
          this.btn2 = "el-button-2";
          this.btn1 = "el-button-1";
          this.init();
          break;
      }
    },
    init() {
      let energyChart = this.$echarts.init(this.$refs.energyChart);
      energyChart.setOption({
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.time,
          //网格样式
          splitLine: {
            show: true,
            lineStyle: {
              color: ["#0e2037"],
              width: 1,
              type: "solid",
            },
          },
          //设置坐标轴字体颜色和宽度
          axisLine: {
            //这是x轴文字颜色
            lineStyle: {
              color: "#fff",
            },
          },
        },
        yAxis: {
          type: "value",
          //网格样式
          splitLine: {
            show: true,
            lineStyle: {
              color: ["#0e2037"],
              width: 1,
              type: "solid",
            },
          },
          //设置坐标轴字体颜色和宽度
          axisLine: {
            //这是x轴文字颜色
            lineStyle: {
              color: "#fff",
            },
          },
        },
        grid: {
          left: "5%",
          right: "10%",
          bottom: "5%",
          height: "90%",
          width: "90%",
          containLabel: true,
        },
        series: [
          {
            name: "能效",
            data: this.data,
            type: "line",
            // smooth: true, //曲线平滑
            itemStyle: {
              normal: {
                areaStyle: { type: "default" },
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "rgb(58,165,233,0.35)" },
                  { offset: 1, color: "rgb(0,255,255,0.35)" },
                ]),
                borderColor: "#71df6f", //拐点边框颜色
                borderWidth: 2, //拐点边框大小
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
.energyChart {
  width: 100%;
  height: 200px;
  padding: 0 0 1rem 1rem;
  position: relative;
  top: 1rem;
  color: #ffffff;
}

.energy-trend {
  width: 100%;
  height: 25%;
}
.text-body {
  top: 1.5rem;
  height: 80%;
}
.button-group {
  display: inline;
  position: absolute;
  margin-left: 60%;
}

.el-button-1{
  background: rgba(0,0,0,0.4);
  color: white;
  opacity: 1;
}
</style>
