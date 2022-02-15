<template>
  <section class="emg-count">
    <div class="text-title">
      <div class="text-header">
        <div>告警统计</div>
      </div>
      <div class="text-body">
        <el-button-group class="button-group">
          <el-button
            label="1"
            @click="changeData('1')"
            size="mini"
            :class="btn1"
          >
            今日
          </el-button>
          <el-button
            label="2"
            @click="changeData('2')"
            size="mini"
            :class="btn2"
          >
            近一周
          </el-button>
          <el-button
            label="3"
            @click="changeData('3')"
            size="mini"
            :class="btn3"
          >
            近一月
          </el-button>
        </el-button-group>
        <div ref="emgCountChart" class="emgCountChart"></div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "EmgCount",
  data() {
    return {
      radioBtn: "1",
      time: ["一区", "二区", "三区", "四区"],
      data: [12, 1, 5, 40],
      btn1: "el-button-2",
      btn2: "el-button-1",
      btn3: "el-button-1",
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    changeData(val) {
      switch (val) {
        case "1":
          this.data = [12, 1, 5, 40];
          this.btn1 = "el-button-2";
          this.btn2 = this.btn3 = "el-button-1";
          this.init();
          break;
        case "2":
          this.data = [70, 44, 58, 120];
          this.btn2 = "el-button-2";
          this.btn1 = this.btn3 = "el-button-1";
          this.init();
          break;
        case "3":
          this.data = [125, 144, 119, 211];
          this.btn3 = "el-button-2";
          this.btn2 = this.btn1 = "el-button-1";
          this.init();
          break;
      }
    },
    init() {
      let emgCountChart = this.$echarts.init(this.$refs.emgCountChart);
      emgCountChart.setOption({
        title: {
          textStyle: {
            color: "#ffffff",
            fontSize: 14,
            fontWeight: 400,
            top: 10,
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          left: "5%",
          right: "20%",
          bottom: "2%",
          top: "20%",
          height: "80%",
          width: "90%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            myTool1: {
              show: true,
              title: "每日",
              // icon: 'image://http://echarts.baidu.com/images/favicon.png',
              onclick: function () {
                alert("myToolHandler1");
              },
            },
            myTool2: {
              show: true,
              title: "每周",
              // icon: 'image://http://echarts.baidu.com/images/favicon.png',
              onclick: function () {
                alert("myToolHandler2");
              },
            },
            myTool3: {
              show: true,
              title: "每月",
              // icon: 'image://http://echarts.baidu.com/images/favicon.png',
              onclick: function () {
                alert("myToolHandler3");
              },
            },
          },
        },
        xAxis: [
          {
            type: "category",
            data: this.time,
            //设置坐标轴字体颜色和宽度
            axisLine: {
              //这是x轴文字颜色
              lineStyle: {
                color: "#fff",
              },
            },
          },
        ],
        yAxis: [
          {
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
        ],
        series: [
          {
            name: "设备数量",
            type: "bar",
            emphasis: {
              focus: "series",
            },
            barWidth: "30%",
            data: this.data,
            label: {
              normal: {
                show: true,
                position: "top",
                textStyle: {
                  color: "#ffffff",
                },
              },
            },
            itemStyle: {
              normal: {
                color: function (params) {
                  let colorList = ["#ff7b88", "#fca137", "#5295ff", "#44cbff"];
                  return colorList[params.dataIndex];
                },
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
.emg-count {
  width: 100%;
  height: 25%;
}
.text-body {
  top: 2rem;
  height: 80%;
}
.text-row2 {
  height: 58%;
  width: 50%;
  font-size: 1.125rem;
  display: flex;
  justify-items: center;
  align-items: center;
  border: 6px solid #6ec0ff;
  color: #6ec0ff;
  border-radius: 50%;
}
.emgCountChart {
  width: 100%;
  height: 200px;
  padding: 0 0 1rem 1rem;
  position: relative;
  top: 20px;
  color: #ffffff;
}
.button-group {
  display: inline;
  position: absolute;
  margin-left: 47%;
}

.el-button-1{
  background: rgba(0,0,0,0.4);
  color: white;
  opacity: 1;
}
</style>