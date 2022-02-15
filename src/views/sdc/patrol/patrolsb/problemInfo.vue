<template>
  <div>
    <basic-container>
      <el-row :gutter="15">
        <el-col :span="4"> 
          <span>项目：</span>
          <el-input style="width:70%"></el-input>
        </el-col>
        <el-col :span="5"> 
          <span>项目地点：</span>
          <el-input style="width:70%"></el-input>
        </el-col>
        <el-col :span="8">
          <span>发现时间：</span>
          <el-date-picker
            v-model="dueDate"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            style="width: 80%"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="5">
          <span>整改人：</span>
          <el-select style="width: 70%">
            <el-option></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <span>是否逾期：</span>
          <el-select style="width: 70%">
            <el-option></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <span>问题状态：</span>
          <el-select style="width: 70%">
            <el-option></el-option>
          </el-select>
        </el-col>
        <el-col :span="8"></el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addInfo">
            <i class="el-icon-plus"></i> 新增
          </el-button>
          <el-button type="primary" @click="queryInfo">
            <i class="el-icon-search"></i> 查询
          </el-button>
          <el-button type="primary" @click="clearCondition">
            <i class="el-icon-delete"></i> 清空
          </el-button>
        </el-col>
        <el-col :span="16" style="margin-top: 20px">
          <el-table :data="tableInfo" border style="margin: 0.75rem 0">
            <el-table-column
              prop="name"
              label="巡检项目"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="address"
              label="巡检地点"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="problem"
              label="问题描述"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="patroler"
              label="创建人"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="patrolStartTime"
              label="创建时间"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="handler"
              label="指派给"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="patrolEndTime"
              label="解决时间"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="outTime"
              label="逾期日期"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="status"
              label="问题状态"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="isOutTime"
              label="逾期"
              align="center"
            ></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <span class="table-action" @click="tableAction(scope.row, 2)"
                  >详情</span
                >
              </template>
            </el-table-column>
          </el-table>
          <Pagination
            :page="page"
            :size="size"
            :total="total"
            :key="pageKey"
            @pagination="queryByPage"
          ></Pagination>
        </el-col>
        <el-col :span="8" style="margin-top: 20px">
          <el-row :gutter="15">
            <el-col :span="24">
              <el-button-group class="button-group">
                <el-button @click="changePatrolData('1')" size="mini" :class="btn1">
                  日
                </el-button>
                <el-button @click="changePatrolData('2')" size="mini" :class="btn2">
                  周
                </el-button>
                <el-button @click="changePatrolData('3')" size="mini" :class="btn3">
                  月
                </el-button>
                <el-button @click="changePatrolData('4')" size="mini" :class="btn4">
                  年
                </el-button>
              </el-button-group>
              <div ref="patrolEchart" id="patrolEchart"></div>
            </el-col>
            <el-col :span="24">d
              <el-button-group class="button-group">
                <el-button @click="changePlanData('1')" size="mini" :class="btn1">
                  日
                </el-button>
                <el-button @click="changePlanData('2')" size="mini" :class="btn2">
                  周
                </el-button>
                <el-button @click="changePlanData('3')" size="mini" :class="btn3">
                  月
                </el-button>
                <el-button @click="changePlanData('4')" size="mini" :class="btn4">
                  年
                </el-button>
              </el-button-group>
              <div ref="planEchart" id="planEchart"></div>
            </el-col>
            <el-col :span="24">
              <el-button-group class="button-group">
                <el-button @click="changeData('1')" size="mini" :class="btn1">
                  日
                </el-button>
                <el-button @click="changeData('2')" size="mini" :class="btn2">
                  周
                </el-button>
                <el-button @click="changeData('3')" size="mini" :class="btn3">
                  月
                </el-button>
                <el-button @click="changeData('4')" size="mini" :class="btn4">
                  年
                </el-button>
              </el-button-group>
              <div ref="pTypeEchart" id="pTypeEchart"></div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </basic-container>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";

export default {
  components: {
    Pagination,
  },
  data() {
    return {
      tableInfo: [
        {
          name: "宜家花园二期",
          address: "8#l楼配电箱",
          problem: '私拉电线',
          patroler: "张诗雨",
          patrolStartTime: "2021-07-21 09:55:55",
          handler: '王慧慧',
          patrolEndTime: "2021-08-21 09:55:55",
          outTime: '2021-08-21 09:55:55',
          status: "已验收",
          isOutTime: '否'
        },
        {
          name: "宜家花园二期",
          address: "7#l楼塔吊",
          problem: '堆放不整理',
          patroler: "李霄云",
          patrolStartTime: "2021-07-21 09:55:55",
          handler: '赵明高',
          patrolEndTime: "2021-08-21 09:55:55",
          outTime: '2021-08-21 09:55:55',
          status: "整改中",
          isOutTime: '否'
        },
        {
          name: "宜家花园二期",
          address: "8#l楼钢筋加工点",
          problem: '超重',
          patroler: "乾豪",
          patrolStartTime: "2021-07-21 09:55:55",
          handler: '郑吉凯',
          patrolEndTime: "2021-08-21 09:55:55",
          outTime: '2021-08-21 09:55:55',
          status: "待整改",
          isOutTime: '是'
        },
      ],
      dialogFormVisible: false,
      dialogPersonVisible: false,
      dialogTitle: null,
      page: 0,
      size: 10,
      total: 0,
      pageKey: Math.random().toString(36).slice(-6),
      inputForm: {
        value1: null,
        value2: null,
      },
      rules: {},
      dialogKey: Math.random().toString(36).slice(-6),
      isdisabled: true,
      dialogVisible: false,
      activeName: "1",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      dueDate: "",
      btn1: "el-button-2",
      btn2: "el-button-1",
      btn3: "el-button-1",
      btn4: "el-button-1",
      data: [
              { value: 35.0, name: "电器工程" },
              { value: 80.0, name: "钢筋" },
              { value: 84.0, name: "砌体工程" }
            ],
      pueConsume: [20, 12, 11, 24, 20],
      ITConsume: [10, 6, 5, 14, 10]
    };
  },
  mounted() {
    this.createPTypeEchart()
    this.createPatrolEchart()
    this.createPlanEchart()
  },
  methods: {
    addInfo() {
      this.isdisabled = false;
      this.dialogFormVisible = true;
    },
    queryInfo() {},
    clearCondition() {},
    tableAction(data, flag) {
      console.log(data,'data');
      if (flag === 2) {
        this.$emit('changeComponent',{
          patrolData: data,
          currentComponent: 'patrolProblemDetail'
        })
      }
    },
    queryByPage() {},
    refreshData() {},
    submitForm() {},
    deleteData() {},
    handleClick() {},
    createPatrolEchart() {
      //注：需要挂载后，this.$refs.lineEchart才能获取
      let patrolEchart = this.$echarts.init(this.$refs.patrolEchart)
      patrolEchart.setOption({
        title: {  //设置标题
          text: '项目巡检情况',
          textStyle: {
            fontSize: 14,
            fontWeight: 400
          }
        },
        color: ['#3f8ef7', '#FFCAC1'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['次数', '异常'],
          icon: 'circle',
          left: '30%',
          itemGap: 5,
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['项目1', '项目2', '项目3', '项目4', '项目5']
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine:{
                show:false
            }
          }
        ],
        series: [
          {
            name: '次数',
            type: 'bar',
            emphasis: {
                focus: 'series'
            },
            data: this.pueConsume
          },
          {
            name: '异常',
            type: 'bar',
            emphasis: {
                focus: 'series'
            },
            data: this.ITConsume
          }
        ]
      })
    },
    changePatrolData(val) {
      switch (val) {
        case "1":
          this.data = [
              { value: 35.0, name: "电器工程" },
              { value: 80.0, name: "钢筋" },
              { value: 84.0, name: "砌体工程" }
            ]
          this.btn1 = "el-button-2";
          this.btn2 = this.btn3 = this.btn4 = "el-button-1";
          this.createPTypeEchart();
          break;
        case "2":
          this.data = [
              { value: 35.0, name: "电器工程" },
              { value: 80.0, name: "钢筋" },
              { value: 84.0, name: "砌体工程2" }
            ]
          this.btn2 = "el-button-2";
          this.btn1 = this.btn3 = this.btn4 = "el-button-1";
          this.createPTypeEchart();
          break;
        case "3":
          this.data = [
              { value: 35.0, name: "电器工程" },
              { value: 80.0, name: "钢筋" },
              { value: 84.0, name: "工程1" }
            ]
          this.btn3 = "el-button-2";
          this.btn1 = this.btn2 = this.btn4 = "el-button-1";
          this.createPTypeEchart();
          break;
        case "4":
          this.data = [
              { value: 35.0, name: "电器工程" },
              { value: 80.0, name: "钢筋" },
              { value: 84.0, name: "砌体工程3" }
            ]
          this.btn4 = "el-button-2";
          this.btn1 = this.btn3 = this.btn2 = "el-button-1";
          this.createPTypeEchart();
          break;
      }
    },
    createPlanEchart() {
      //注：需要挂载后，this.$refs.lineEchart才能获取
      let planEchart = this.$echarts.init(this.$refs.planEchart)
      planEchart.setOption({
        title: {  //设置标题
          text: '整改任务逾期情况',
          textStyle: {
            fontSize: 14,
            fontWeight: 400
          }
        },
        color: ['#3f8ef7', '#FFCAC1'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['总数', '预期'],
          icon: 'circle',
          left: '30%',
          itemGap: 5,
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['项目1', '项目2', '项目3', '项目4', '项目5']
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine:{
                show:false
            }
          }
        ],
        series: [
          {
            name: '总数',
            type: 'bar',
            emphasis: {
                focus: 'series'
            },
            data: this.pueConsume
          },
          {
            name: '预期',
            type: 'bar',
            emphasis: {
                focus: 'series'
            },
            data: this.ITConsume
          }
        ]
      })
    },
    changePlanData(val) {
      switch (val) {
        case "1":
          this.data = [
              { value: 35.0, name: "电器工程" },
              { value: 80.0, name: "钢筋" },
              { value: 84.0, name: "砌体工程" }
            ]
          this.btn1 = "el-button-2";
          this.btn2 = this.btn3 = this.btn4 = "el-button-1";
          this.createPTypeEchart();
          break;
        case "2":
          this.data = [
              { value: 35.0, name: "电器工程" },
              { value: 80.0, name: "钢筋" },
              { value: 84.0, name: "砌体工程2" }
            ]
          this.btn2 = "el-button-2";
          this.btn1 = this.btn3 = this.btn4 = "el-button-1";
          this.createPTypeEchart();
          break;
        case "3":
          this.data = [
              { value: 35.0, name: "电器工程" },
              { value: 80.0, name: "钢筋" },
              { value: 84.0, name: "工程1" }
            ]
          this.btn3 = "el-button-2";
          this.btn1 = this.btn2 = this.btn4 = "el-button-1";
          this.createPTypeEchart();
          break;
        case "4":
          this.data = [
              { value: 35.0, name: "电器工程" },
              { value: 80.0, name: "钢筋" },
              { value: 84.0, name: "砌体工程3" }
            ]
          this.btn4 = "el-button-2";
          this.btn1 = this.btn3 = this.btn2 = "el-button-1";
          this.createPTypeEchart();
          break;
      }
    },
    createPTypeEchart() {
      //注：需要挂载后，this.$refs.lineEchart才能获取
      let pTypeEchart = this.$echarts.init(this.$refs.pTypeEchart);
      pTypeEchart.setOption({
        title: {
          text: "问题类型分析",
          textStyle: {
            fontSize: 14,
            fontWeight: 400
          }
        },
        color: ["#3f8ef7", "#3FF2F7", "#FFA500"],
        tooltip: {
          trigger: "item",
          formatter: '{b} <br/> {d}%'
        },
        legend: {
          top: "30%",
          left: '60%',
          icon: "circle",
        },
        series: [
          {
            type: "pie",
            radius: ["40%", "50%"],
            center: ["30%", "50%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "16",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: this.data
          },
        ],
      })
    },
    changeData(val) {
      switch (val) {
        case "1":
          this.data = [
              { value: 35.0, name: "电器工程" },
              { value: 80.0, name: "钢筋" },
              { value: 84.0, name: "砌体工程" }
            ]
          this.btn1 = "el-button-2";
          this.btn2 = this.btn3 = this.btn4 = "el-button-1";
          this.createPTypeEchart();
          break;
        case "2":
          this.data = [
              { value: 35.0, name: "电器工程" },
              { value: 80.0, name: "钢筋" },
              { value: 84.0, name: "砌体工程2" }
            ]
          this.btn2 = "el-button-2";
          this.btn1 = this.btn3 = this.btn4 = "el-button-1";
          this.createPTypeEchart();
          break;
        case "3":
          this.data = [
              { value: 35.0, name: "电器工程" },
              { value: 80.0, name: "钢筋" },
              { value: 84.0, name: "工程1" }
            ]
          this.btn3 = "el-button-2";
          this.btn1 = this.btn2 = this.btn4 = "el-button-1";
          this.createPTypeEchart();
          break;
        case "4":
          this.data = [
              { value: 35.0, name: "电器工程" },
              { value: 80.0, name: "钢筋" },
              { value: 84.0, name: "砌体工程3" }
            ]
          this.btn4 = "el-button-2";
          this.btn1 = this.btn3 = this.btn2 = "el-button-1";
          this.createPTypeEchart();
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.demo .el-switch_label {
  position: absolute;
  display: none;
  color: #fff;
}

.demo .el-switch_label--right {
  z-index: 1;
  right: -3px;
}

.demo .el-switch_label--left {
  z-index: 1;
  left: 19px;
}

.demo .el-switch__label.is-active {
  display: block;
}

.demo.el-switch .el-switch__core,
.el-switch .el-switch__label {
  width: 50px !important;
}

#pTypeEchart {
  width: 100%;
  height: 100%;
  min-height: 205px;
}

#patrolEchart {
  width: 100%;
  height: 100%;
  min-height: 205px;
}

#planEchart {
  width: 100%;
  height: 100%;
  min-height: 205px;
}

.button-group {
  display: inline;
  position: absolute;
  margin-left: 60%;
  z-index: 100;
}
</style>