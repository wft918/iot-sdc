<doc>
  问题台账页面
</doc>

<template>
  <div class="page">
    <!-- 左侧 -->
    <div class="left">
      <!-- 条件查询 -->
      <el-form :inline="true" ref="searchForm" :model="searchForm" class="demo-form-inline" size="small">
        <el-form-item label="位置">
          <el-input size="small" v-model="searchForm.projectName" placeholder="" clearable></el-input>
        </el-form-item>
        <el-form-item label="位置地点">
          <el-input size="small" v-model="searchForm.inspectLocation" placeholder="" clearable></el-input>
        </el-form-item>
        <el-form-item label="发现时间">
          <el-date-picker v-model="date" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="整改人">
          <el-select v-model="searchForm.solveMan" placeholder="请选择">
            <el-option v-for="item in personList" :key="item.userId" :label="item.username" :value="item.userId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否逾期">
          <el-select v-model="searchForm.overdued" placeholder="请选择">
            <el-option v-for="item in overdueList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题状态">
          <el-select v-model="searchForm.state" placeholder="请选择">
            <el-option v-for="item in problemStatusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="refreshList()" size="small">查询</el-button>
          <el-button @click="resetSearch()" size="small">重置</el-button>
        </el-form-item>
        <el-form-item style="float:right;">
          <el-tooltip effect="dark" content="显隐" placement="top">
            <el-button circle="" @click="chooseColumn" size="small" icon="el-icon-menu"></el-button>
          </el-tooltip>
        </el-form-item>
      </el-form>

      <!-- 列表区域 -->
      <el-table size="medium" v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column v-if="columnList[0].show" show-overflow-tooltip prop="siteName" label="巡检位置">
          <template slot-scope="scope">
            <el-link :underline="false" type="primary" @click="mainPropClick(scope.row)">{{scope.row.siteName}}</el-link>
          </template>
        </el-table-column>
        <el-table-column v-if="columnList[1].show" show-overflow-tooltip prop="inspectLocation" label="巡检地点">
        </el-table-column>
        <el-table-column v-if="columnList[2].show" show-overflow-tooltip prop="content" label="问题描述">
        </el-table-column>
        <el-table-column v-if="columnList[3].show" show-overflow-tooltip prop="reportManName" label="创建人">
        </el-table-column>
        <el-table-column v-if="columnList[4].show" show-overflow-tooltip prop="reportTime" label="创建时间">
        </el-table-column>
        <el-table-column v-if="columnList[5].show" show-overflow-tooltip prop="solveManName" label="指派给">
          <template slot-scope="scope">
            {{scope.row.state == 1?scope.row.solveManName:scope.row.acceptManName}}
          </template>
        </el-table-column>
        <el-table-column v-if="columnList[6].show" show-overflow-tooltip prop="solveTime" label="解决时间">
          <template slot-scope="scope">
            {{scope.row.state == 6?scope.row.solveTime:''}}
          </template>
        </el-table-column>
        <el-table-column v-if="columnList[7].show" show-overflow-tooltip prop="deadline" label="逾期日期">
        </el-table-column>
        <el-table-column v-if="columnList[8].show" show-overflow-tooltip prop="state" label="问题状态">
          <template slot-scope="scope">
            {{scope.row.state == '1'?'待整改':scope.row.state == '3'?'待验收':scope.row.state == '6'?'已验收':''}}
          </template>
        </el-table-column>
        <el-table-column v-if="columnList[9].show" show-overflow-tooltip prop="overdued" label="是否逾期">
          <template slot-scope="scope">
            {{scope.row.overdued == 0?'否':scope.row.overdued == 1?'是':''}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="view(scope.row.id)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageNo"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
    <!-- 右侧 -->
    <div class="right">
      <!-- 项目巡检情况 -->
      <div class="top">
        <el-radio-group @change="dataChange(1)" size="mini" v-model="radio1" style="position: absolute;top: 10px;right: 10px;z-index: 9;">
          <el-radio-button v-for="item in dateList" :key="item.value" :label="item.value">{{item.label}}</el-radio-button>
        </el-radio-group>
        <top-echarts :id="'topinspect'" :inspectXvalue="inspectXvalue" :inspectYvalue="inspectYvalue"></top-echarts>
      </div>
      <!-- 整改任务逾期情况 -->
      <div class="center">
        <el-radio-group @change="dataChange(2)" size="mini" v-model="radio2" style="position: absolute;top: 10px;right: 10px;z-index: 9;">
          <el-radio-button v-for="item in dateList" :key="item.value" :label="item.value">{{item.label}}</el-radio-button>
        </el-radio-group>
        <center-echarts :id="'centeroverdue'" :overdueXvalue="overdueXvalue" :overdueYvalue="overdueYvalue"></center-echarts>
      </div>
      <!-- 问题类型分析 -->
      <div class="bottom">
        <el-radio-group @change="dataChange(3)" size="mini" v-model="radio3" style="position: absolute;top: 10px;right: 10px;z-index: 9;">
          <el-radio-button v-for="item in dateList" :key="item.value" :label="item.value">{{item.label}}</el-radio-button>
        </el-radio-group>
        <bottom-echarts :id="'bottomriskType'" :riskTypeList="riskTypeList"></bottom-echarts>
      </div>
    </div>
    <!-- 弹窗 -->
    <problemView ref="problemView"></problemView>
    <el-dialog
      :visible.sync="dialogColumnVisible"
      title="请选择要显示的列"
      :close-on-click-modal="false"
      width="35%"
      v-dialogDrag
    >
      <el-checkbox v-for="item in columnList" v-model="item.show" :key="item.prop">{{item.label}}</el-checkbox>
    </el-dialog>
  </div>
</template>
<script>
  import topEcharts from './model/topEcharts'
  import centerEcharts from './model/centerEcharts'
  import bottomEcharts from './model/bottomEcharts'
  import problemView from './problemView'
  export default {
    components: {
      topEcharts,
      centerEcharts,
      bottomEcharts,
      problemView
    },
    data() {
      return {
        radio1: '1',
        radio2: '1',
        radio3: '1',
        date:[],
        dateList:[
          {
            label:"日",
            value:"1"
          },
          {
            label:"周",
            value:"2"
          },
          {
            label:"月",
            value:"3"
          },
          {
            label:"年",
            value:"4"
          }
        ],
        personList:[],//整改人
        overdueList:[
          {
            label:"是",
            value:"1"
          },
          {
            label:"否",
            value:"0"
          }
        ],
        problemStatusList:[
          {
            label:"待整改",
            value:"1"
          },
          {
            label:"待验收",
            value:"3"
          },
          {
            label:"已验收",
            value:"6"
          },
        ],
        searchForm: {
          projectName:"",    //项目
          inspectLocation:"",    //项目地点
          reportStartTime:"",    //开始时间
          reportEndTime:"",    //结束时间
          solveMan: "",    //整改人
          overdued:"",    //是否逾期
          state:""    //问题状态
        },
        tableData: [],
        inspectXvalue:[],//项目巡检情况X
        inspectYvalue:[],//项目巡检情况Y
        overdueXvalue:[],//整改任务逾期情况X
        overdueYvalue:[],//整改任务逾期情况Y
        riskTypeList:[],//问题类型分析
        pageNo: 1,
        pageSize: 10,
        total: 0,
        loading:false,
        dialogColumnVisible: false,
        columnList: [
          {
            prop: 'siteName',
            label: '巡检位置',
            show: true
          },
          {
            prop: 'inspectLocation',
            label: '巡检地点',
            show: true
          },
          {
            prop: 'content',
            label: '问题描述',
            show: true
          },
          {
            prop: 'reportManName',
            label: '创建人',
            show: true
          },
          {
            prop: 'reportTime',
            label: '创建时间',
            show: true
          },
          {
            prop: 'solveManName',
            label: '指派给',
            show: true
          },
          {
            prop: 'solveTime',
            label: '解决时间',
            show: true
          },
          {
            prop: 'deadline',
            label: '逾期日期',
            show: true
          },
          {
            prop: 'state',
            label: '问题状态',
            show: true
          },
          {
            prop: 'overdued',
            label: '是否逾期',
            show: true
          }
        ]
      }
    },
    created() {
      this.refreshList()//获取列表数据
      this.getUserlist()//获取整改人列表
      this.getcountInspect()//获取项目巡检情况
      this.getproblemOverdue()//获取整改任务逾期情况
      this.getcountRiskType()//获取问题类型分析
    },
    methods: {
      // 获取数据列表
      refreshList() {
        if(this.date != null && this.date != undefined && this.date.length>0) {
          this.searchForm.reportStartTime = this.date[0] + ' ' + '00:00:00'
          this.searchForm.reportEndTime = this.date[1] + ' ' + '23:59:59'
        }else {
          this.searchForm.reportStartTime = ''
          this.searchForm.reportEndTime = ''
        }
        this.loading = true
        this.$http({
          url:"/check/inspect/inspectProblem/list",
          methof:"get",
          params: {
            pageNo:this.pageNo,
            pageSize:this.pageSize,
            stateStr:'1,3,6',
            ...this.searchForm
          }
        }).then(({data}) => {
          if(data && data.success) {
            this.tableData = data.page.list
            this.total = data.page.count
            this.loading = false
          }
        })
      },
      // 获取整改人列表
      getUserlist() {
        this.$http({
          url:"/admin/user/page",
          method:"get",
          params: {
            pageNo:1,
            pageSize:-1
          }
        }).then(({data}) => {
          if(data && data.code == '0') {
            this.personList = data.data.records
          }
        })
      },
      // 获取项目巡检情况
      getcountInspect() {
        this.$http({
          url:"/check/inspect/inspectProblem/count/inspect",
          method:"get",
          params: {
            type:this.radio1
          }
        }).then(({data}) => {
          if(data && data.success) {
            this.inspectXvalue = []
            this.inspectYvalue = []
            this.inspectYvalue[0] = []
            this.inspectYvalue[1] = []
            if(data.rs.length > 0) {
              data.rs.forEach(item => {
                this.inspectXvalue.push(item.projectName)
                this.inspectYvalue[0].push(item.cishu)
                this.inspectYvalue[1].push(item.yichang)
              })
            }
          }
        })
      },
      // 获取任务逾期情况
      getproblemOverdue() {
        this.$http({
          url:"/check/inspect/inspectProblem/count/problem/overdue",
          method:"get",
          params: {
            type:this.radio2
          }
        }).then(({data}) => {
          if(data && data.success) {
            this.overdueXvalue = []
            this.overdueYvalue = []
            this.overdueYvalue[0] = []
            this.overdueYvalue[1] = []
            if(data.rs.length > 0) {
              data.rs.forEach(item => {
                this.overdueXvalue.push(item.projectName)
                this.overdueYvalue[0].push(item.zongshu)
                this.overdueYvalue[1].push(item.yuqi)
              })
            }
          }
        })
      },
      // 获取问题分析类型
      getcountRiskType() {
        this.$http({
          url:"/check/inspect/inspectProblem/count/riskType",
          method:"get",
          params: {
            type:this.radio3
          }
        }).then(({data}) => {
          if(data && data.success) {
            this.riskTypeList = []
            if(data.rs.length > 0) {
              data.rs.forEach(item => {
                this.riskTypeList.push({
                  value:item.num,
                  name:item.typeName
                })
              })
            }
          }
        })
      },
      // 重置
      resetSearch() {
        // this.$refs.searchForm.resetFields()
        this.searchForm = {
          projectName:"",    //项目
          inspectLocation:"",    //项目地点
          reportStartTime:"",    //开始时间
          reportEndTime:"",    //结束时间
          solveMan: "",    //整改人
          overdued:"",    //是否逾期
          state:""    //问题状态
        },
        this.date = []
        this.refreshList()
      },
      // 控制列显隐
      chooseColumn() {
        this.dialogColumnVisible = true
      },
      mainPropClick(row) {
        this.$refs.problemView.init(row.id)
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageNo = 1
        this.refreshList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageNo = val
        this.refreshList()
      },
      // 详情
      view(id) {
        this.$refs.problemView.init(id)
        // this.$router.push({
        //   path:"/check/iot/standingBook/problemView",
        //   query: {
        //     id:id
        //   }
        // })
      },
      // 日/周/月/年变化
      dataChange(flag) {
        if(flag == 1) {
          this.getcountInspect();
        }else if(flag == 2) {
          this.getproblemOverdue()
        }else if(flag == 3) {
          this.getcountRiskType()
        }
      }
    }
  }
</script>
<style scoped>
  .page {
    display: flex;
    height: 850px;
  }

  .left {
    width: 70%;
    padding: 20px;
    /* background-color: rgba(29, 55, 125, 0.3); */
    border: 0.5px solid #183075;
    overflow-y: scroll;
  }

  .right {
    width: 30%;
    padding: 0 0 0 10px;
    display: flex;
    flex-wrap: wrap;
  }

  .top {
    width: 100%;
    height: 33%;
    margin: 0 0 0.3% 0;
    padding: 5px;
    /* background-color: rgba(29, 55, 125, 0.3); */
    border: 0.5px solid #183075;
    position: relative;
  }

  .center {
    width: 100%;
    height: 33%;
    margin: 0.3% 0;
    padding: 5px;
    /* background-color: rgba(29, 55, 125, 0.3); */
    border: 0.5px solid #183075;
    position: relative;
  }

  .bottom {
    width: 100%;
    height: 33.2%;
    margin: 0.3% 0;
    padding: 5px;
    /* background-color: rgba(29, 55, 125, 0.3); */
    border: 0.5px solid #183075;
    position: relative;
  }
</style>