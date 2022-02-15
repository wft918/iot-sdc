<template>
  <div style="width:100%;height:100%;display: flex;align-items: flex-end;">
    <div ref="dynamicEnergyRight01" class="emgCountChart"></div>
  </div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
import { getRoomAlarmNumRank } from "@/api/sdc/lsd";
import { getBeforeDate } from "@/util/getBeforeDate"
export default {
  name: "EmgCount",
  props:['roomCountRank', 'siteId'],
  data() {
    return {
        startTime: '',
        rankData: [],
        roomName: [],
        alarmNums: []
    };
  },
  watch: {
    roomCountRank(newVal, oldVal) {
      if (newVal === '1') {
        this.startTime = getBeforeDate(7)
				this.queryPageData()
      }
      if (newVal === '2') {
        this.startTime = getBeforeDate(30)
				this.queryPageData()
      }
    },
    siteId(newVal) {
      if (newVal) {
        this.queryPageData()
      }
    },
  },
  created() {
		this.startTime = getBeforeDate(7)
	},
  mounted() {
    this.queryPageData()
  },
  methods: {
    async queryPageData() {
      //获取初始区域查询条件数据
      getRoomAlarmNumRank({ siteId: this.siteId, startTime: this.startTime }).then((res) => {
        // console.log(res, 'getRoomAlarmNumRank');
        if (res.data.code === 0) {
          this.rankData = res.data.data
          this.$nextTick(() => {
            this.init();
          });
        }
      });
    },
    init() {
      this.roomName = []
      this.alarmNums = []
      this.rankData.forEach(item => {
        this.roomName.push(item.label)
        this.alarmNums.push(item.value)
      })
      let option = {
          grid: {
              left: '8%',
              right: '8%',
              bottom: '0%',
              top: 10,
              containLabel: true
          },
          tooltip: {
            show: true,
            axisPointer: {
              show: true,
              trigger: 'axis',
              label: {
                show: true,
                width: 50,
                overflow: 'break'
              }
            }
          },
          xAxis: {
            show: false
          },
          yAxis: {
              type: 'category',
              inverse: true,
              //城市名称
              data: this.roomName,
              axisTick: {
                  show: false
              },
              axisLine: {
                  show: false
              },
              axisLabel: {
                  show: true,
                  color: '#A5D6DF',
                  fontSize: 15,
                  fontWeight: 'bold',
                  formatter: function (name) {
                                return (name.length > 5 ? (name.slice(0,5)+"...") : name );
                              },
              },
              position: 'left',
          },
          series: [
              {
                  type: 'bar',
                  stack: 'chart',
                  // z: 3,
                  barMaxWidth: '15',
                  itemStyle: {
                      normal: {
                        color: new echarts.graphic.LinearGradient(1, 1, 0, 0, [{
                                offset: 0,
                                color: "#0073FF"
                            }, {
                                offset: 1,
                                color: "#03D5F0" 
                            }], false),
                          barBorderRadius: 10
                      }
                  },
                  label: {
                      normal: {
                          position: 'right',
                          show: true,
                          color: '#FFF',
                          formatter: '{c}'
                      }
                  },
                  data: this.alarmNums
              }]
      }
      let dynamicEnergyRight01 = this.$echarts.init(this.$refs.dynamicEnergyRight01);
      dynamicEnergyRight01.setOption(option)
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