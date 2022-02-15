<template>
  <div>
    <basic-container>
      <el-row :gutter="15">
        <el-col :span="8">
          <span>巡检时间：</span>
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
          <span>巡检人：</span>
          <el-select style="width: 70%">
            <el-option></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <span>巡检类型：</span>
          <el-select style="width: 70%">
            <el-option></el-option>
          </el-select>
        </el-col>
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
              label="巡检任务"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="type"
              label="巡检类型"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="patroler"
              label="巡检员"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="patrolDetail"
              label="巡检概况"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="patrolStartTime"
              label="巡检开始时间"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="patrolEndTime"
              label="巡检结束时间"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="status"
              label="巡检状态"
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
        <el-col :span="8">
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

      <el-dialog
        :visible.sync="dialogPersonVisible"
        width="35%"
        ref="emgDialog"
        :close-on-click-modal="false"
        @close="refreshData"
        :title="dialogTitle"
      >
            <el-table :data="whiteInfo" border style="margin: 0.75rem 0">
              <el-table-column
                type="index"
                label="序号"
                align="center"
                sortable
              ></el-table-column>
              <el-table-column
                prop=""
                label="姓名"
                align="center"
              ></el-table-column>
              <el-table-column
                prop=""
                label="性别"
                align="center"
              ></el-table-column>
              <el-table-column
                prop=""
                label="身份证号"
                align="center"
              ></el-table-column>
              <el-table-column
                prop=""
                label="所属部门"
                align="center"
              ></el-table-column>
              <el-table-column
                prop=""
                label="联系方式"
                align="center"
              ></el-table-column>
            </el-table>
            <Pagination
              :page="page"
              :size="size"
              :total="total"
              :key="pageKey"
              @pagination="queryByPage"
            ></Pagination>
          
        <span slot="footer" class="dialog-footer">
          <template v-if="inputForm.actionType === 3">
            <el-button
              type="primary"
              @click="dialogPersonVisible = false"
              size="small"
              >关闭</el-button
            >
          </template>
          <template v-else>
            <el-button @click="dialogPersonVisible = false" size="small"
              >取消</el-button
            >
            <el-button type="primary" @click="submitForm" size="small"
              >保存</el-button
            >
          </template>
        </span>
      </el-dialog>

      <el-dialog
        title="数据删除提醒"
        :visible.sync="dialogVisible"
        width="30%"
        :close-on-click-modal="false"
      >
        <span>是否确定删除当前数据！</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteData">确 定</el-button>
          <el-button type="primary" @click="dialogVisible = false"
            >取 消</el-button
          >
        </span>
      </el-dialog>
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
          name: "巡检项目：宜家花园二期",
          type: "线下巡检",
          patroler: "张诗雨",
          patrolDetail: "共检查55项 共发现3个问题",
          patrolStartTime: "2021-07-21 09:55:55",
          patrolEndTime: "2021-08-21 09:55:55",
          status: "已完成",
        },
        {
          name: "巡检线路：巡检线路1",
          type: "线上巡检",
          patroler: "王雨诗",
          patrolDetail: "巡检逾期 共发现3个问题",
          patrolStartTime: "2021-07-21 09:55:55",
          patrolEndTime: "2021-08-21 09:55:55",
          status: "已完成",
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
          currentComponent: 'patrolDetail'
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