<doc>
  任务台账页面
</doc>

<template>
<basic-container>
  <div class="page">
    <!-- 左侧 -->
    <div class="left">
      <!-- 条件查询 -->
      <el-form :inline="true" ref="searchForm" :model="searchForm" class="demo-form-inline" size="small">
        <el-form-item label="巡检时间">
          <el-date-picker v-model="date" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="巡检人">
          <el-select v-model="searchForm.inspectMan" placeholder="请选择">
            <el-option v-for="item in peopleList" :key="item.userId" :label="item.username" :value="item.userId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="巡检类型">
          <el-select v-model="searchForm.inspectType" placeholder="请选择">
            <el-option v-for="item in inspectTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
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
        <el-table-column v-if="columnList[0].show" show-overflow-tooltip prop="taskName" label="巡检任务">
          <template slot-scope="scope">
            <el-link :underline="false" type="primary" @click="mainPropClick(scope.row)">{{scope.row.taskName}}</el-link>
          </template>
        </el-table-column>
        <el-table-column v-if="columnList[1].show" show-overflow-tooltip prop="inspectType" label="巡检类型">
          <template slot-scope="scope">
            {{scope.row.inspectType == '0'?'线下':scope.row.inspectType == '1'?'线上':''}}
          </template>
        </el-table-column>
        <el-table-column v-if="columnList[2].show" show-overflow-tooltip prop="inspectManName" label="巡检员">
        </el-table-column>
        <el-table-column v-if="columnList[3].show" show-overflow-tooltip prop="" label="巡检概况">
          <template slot-scope='scope'>
            <div v-if="scope.row.inspectType == '0'">共检查{{qualifiedSum(scope.row.qualifiedNum,scope.row.unqualifiedNum)}}项</div>
            <div v-if="scope.row.inspectType == '1'" :style="{'color':scope.row.startOverdue == '1'?'#ff0d0d':''}">{{scope.row.startOverdue == '1'?'巡检逾期':'巡检未逾期'}}</div>
            <div>共发现{{scope.row.problemNum?scope.row.problemNum:'0'}}个问题</div>
          </template>
        </el-table-column>
        <el-table-column v-if="columnList[4].show" show-overflow-tooltip prop="" label="巡检时间">
          <template slot-scope="scope">
            <div v-if="scope.row.inspectType == '0'">开始时间:{{scope.row.startTime}}</div>
            <div v-if="scope.row.inspectType == '0'">结束时间:{{scope.row.endTime}}</div>
            <div v-if="scope.row.inspectType == '1'">计划开始时间:{{scope.row.startTime}}</div>
            <div v-if="scope.row.inspectType == '1'">实际开始时间:{{scope.row.planStartTime}}</div>
          </template>
        </el-table-column>
        <el-table-column v-if="columnList[5].show" width="120px" prop="" label="巡检状态">
          <template slot-scope="scope">
            {{scope.row.inspectState == 1?'巡检中':scope.row.inspectState == 2?'已完成':scope.row.inspectState == 0?'未开始':scope.row.inspectState == 3?'已取消':''}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="view(scope.row)">详情</el-button>
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
      <div class="center">
        <el-radio-group @change="dataChange(2)" size="mini" v-model="radio2" style="position: absolute;top: 10px;right: 10px;z-index: 9;">
          <el-radio-button v-for="item in dateList" :key="item.value" :label="item.value">{{item.label}}</el-radio-button>
        </el-radio-group>
        <center-echarts :id="'centeroverdue'" :overdueXvalue="overdueXvalue" :overdueYvalue="overdueYvalue"></center-echarts>
      </div>
      <div class="bottom">
        <el-radio-group @change="dataChange(3)" size="mini" v-model="radio3" style="position: absolute;top: 10px;right: 10px;z-index: 9;">
          <el-radio-button v-for="item in dateList" :key="item.value" :label="item.value">{{item.label}}</el-radio-button>
        </el-radio-group>
        <bottom-echarts :id="'bottomriskType'" :riskTypeList="riskTypeList"></bottom-echarts>
      </div>
    </div>
    <!-- 弹窗 -->
    <inspectionView ref="inspectionView"></inspectionView>
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
</basic-container>
</template>
<script>
  import topEcharts from './model/topEcharts'
  import centerEcharts from './model/centerEcharts'
  import bottomEcharts from './model/bottomEcharts'
  import inspectionView from './inspectionView'
  export default {
    components: {
      topEcharts,
      centerEcharts,
      bottomEcharts,
      inspectionView
    },
    data() {
      return {
        radio1: '1',
        radio2: '1',
        radio3: '1',
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
        date:[],
        peopleList:[],//巡检人列表
        inspectTypeList:[
          {
            name:"线下",
            id:"0"
          },
          {
            name:"线上",
            id:"1"
          }
        ],//巡检类型列表
        loading:false,
        searchForm: {
          startTime:"",//开始时间
          endTime:"",//结束时间
          inspectMan: "",//巡检人
          inspectType: ""//巡检类型
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
        dialogColumnVisible: false,
        columnList: [
          {
            prop: 'taskName',
            label: '巡检任务',
            show: true
          },
          {
            prop: 'inspectType',
            label: '巡检类型',
            show: true
          },
          {
            prop: 'inspectManName',
            label: '巡检员',
            show: true
          },
          {
            prop: 'problemNum',
            label: '巡检概况',
            show: true
          },
          {
            prop: 'inspectTime',
            label: '巡检时间',
            show: true
          },
          {
            prop: 'inspectState',
            label: '巡检状态',
            show: true
          }
        ]
      }
    },
    created() {
      this.getUserlist()//获取巡检人列表
      this.refreshList()
      this.getcountInspect()//获取项目巡检情况
      this.getproblemOverdue()//获取整改任务逾期情况
      this.getcountRiskType()//获取问题类型分析
    },
    methods: {
      // 获取数据列表
      refreshList() {
        if(this.date != null && this.date != undefined && this.date.length > 0) {
          this.searchForm.startTime = this.date[0] + ' ' + '00:00:00'
          this.searchForm.endTime = this.date[1] + ' ' + '23:59:59'
        }else{
          this.searchForm.startTime = ''
          this.searchForm.endTime = ''
        }
        this.loading = true
        this.$http({
          url:"/check/inspect/inspectRecord/list",
          method:"get",
          params: {
            pageNo:this.pageNo,
            pageSize:this.pageSize,
            ...this.searchForm
          }
        }).then(({data}) => {
          if(data && data.success) {
            this.tableData = data.page.list
            console.log(this.tableData)
            this.total = data.page.count
            this.loading = false
          }
        })
      },
      // 线下共检查××项
      qualifiedSum(qualifiedNum,unqualifiedNum) {
        return qualifiedNum + unqualifiedNum
      },
      // 获取巡检人列表
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
            this.peopleList = data.data.records
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
          startTime:"",//开始时间
          endTime:"",//结束时间
          inspectMan: "",//巡检人
          inspectType: ""//巡检类型
        }
        this.date = []
        this.refreshList()
      },
      // 控制列显隐
      chooseColumn() {
        this.dialogColumnVisible = true
      },
      mainPropClick(row) {
        this.$refs.inspectionView.init(row.id,row.inspectType)
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
      view(row) {
        this.$refs.inspectionView.init(row.id,row.inspectType)
        // this.$router.push({
        //   path:"./inspectionView",
        //   query: {
        //     id:row.id,
        //     inspectType:row.inspectType
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
    /* background-color: rgba(208, 209, 212, 0.3); */
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