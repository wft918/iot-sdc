<doc>
  问题详情
</doc>
<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="75%" :close-on-click-modal="false" v-dialogDrag>
  <div v-loading="loading" style="width: 100%;height: 900px;overflow-y: auto;">
    <!-- 返回 -->
    <div style="width: 100%;height: 30px;">
      <el-button style="float: right;" size="mini" type="primary" @click="retu">返回</el-button>
    </div>
    <!-- 问题概况 -->
    <el-divider content-position="left">问题概况</el-divider>
    <el-row style="color: #66a9d6;padding-left: 4%;">
      <el-col :span="5">
        <span>位置名称：</span>
        <span>{{inspectProblem.projectName}}</span>
      </el-col>
      <el-col :span="5">
        <span>巡检地点：</span>
        <span>{{inspectProblem.inspectLocation}}</span>
      </el-col>
      <el-col :span="5">
        <span>整改期限：</span>
        <span>{{inspectProblem.deadline}}</span>
      </el-col>
      <el-col :span="5">
        <span>{{inspectProblem.state == 1?'未整改':inspectProblem.state == 2?'整改中':inspectProblem.state == 3?'带验收':inspectProblem.state == 5?'验收未通过':inspectProblem.state == 6?'已验收':''}}</span>
      </el-col>
      <el-col :span="4">
        <span :style="{'color':inspectProblem.overdued == '1'?'#ec2f34':''}">{{inspectProblem.overdued == '1'?'逾期':inspectProblem.overdued == '2'?'未逾期':''}}</span>
      </el-col>
    </el-row>
    <!-- 问题类型 -->
    <el-divider content-position="left">问题类型</el-divider>
    <p style="color: #66a9d6;"><span style="margin-left: 30px;">风险类型：</span><span>{{inspectProblem.typeName}}</span></p>
    <p style="color: #66a9d6;"><span style="margin-left: 30px;">风险点：</span><span>{{inspectProblem.pointName}}</span></p>
    <p style="color: #66a9d6;"><span style="margin-left: 30px;">风险源：</span><span>{{inspectProblem.sourceName}}</span></p>
    <p style="color: #66a9d6;"><span style="margin-left: 30px;">检查项：</span><span>{{inspectProblem.itemName}}</span></p>
    
    <el-divider content-position="left">问题的一生</el-divider>
    <div style="width: 100%;height: 200px;">
      <el-table
        :data="recordList"
        size="mini"
        class="table">
        <el-table-column
          prop="handleType"
          show-overflow-tooltip
          label="操作类型">
          <template slot-scope="scope">
            {{scope.row.handleType == 1?'发现问题':scope.row.handleType == 2?'整改问题':scope.row.handleType == 3?'验收':''}}
          </template>
        </el-table-column>
        <el-table-column
          prop="handleManName"
          show-overflow-tooltip
          label="执行人">
        </el-table-column>
        <el-table-column
          prop="handleTime"
          show-overflow-tooltip
          label="执行时间">
        </el-table-column>
        <el-table-column
          prop="handleContent"
          show-overflow-tooltip
          label="描述">
        </el-table-column>
        <el-table-column
          prop=""
          show-overflow-tooltip
          label="图片">
          <template slot-scope="scope">
            <el-popover
              v-for="item in scope.row.photoPath.split(';')"
              placement="right"
              trigger="hover">
              <img :src="`${$http.BASE_URL}/images/` + item" style="height: 700px;">
              <img slot="reference" :src="`${$http.BASE_URL}/images/` + item" :alt="`${$http.BASE_URL}/images/` + item" style="width: 30px;height: 30px;">
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  </el-dialog>
</template>
<script>
  export default {
    data() {
      return {
        dialogVisible: false,
        title:"问题详情",
        id:"",
        loading:false,
        inspectProblem:"",//所有数据
        problemFinding:"",//问题发现
        problemphotoList:[],//问题发现URL
        rectificationList:[],//整改
        acceptanceList:[],//验收
        recordList:[]
      }
    },
    // activated() {
    //   this.id = this.$route.query.id
    //   this.getinspectProblem()
    // },
    methods: {
      init(id) {
          this.dialogVisible = true
          this.id = id
          this.getinspectProblem()
      },
      // 根据ID获取数据
      getinspectProblem() {
        this.loading = true
        this.$http({
          url:`/check/inspect/inspectProblem/queryById?id=${this.id}`,
          method:"get"
        }).then(({data}) => {
          if(data && data.success) {
            this.inspectProblem = data.inspectProblem
            this.recordList = data.inspectProblem.recordList
            // this.problemFinding = data.inspectProblem.recordList[data.inspectProblem.recordList.length - 1] //问题发现
            // this.problemphotoList = this.problemFinding.photoPath.split(';')//问题发现照片
            // this.rectificationList = []
            // this.acceptanceList = []
            // data.inspectProblem.recordList.forEach(item => {
            //   if(item.handleType == 2) {
            //     this.rectificationList.push(item)
            //   }else if(item.handleType == 3) {
            //     this.acceptanceList.push(item)
            //   }
            // })
            this.loading = false
          }
        })
      },
      // 返回上一页面
      retu() {
        this.dialogVisible = false
        // this.$router.go(-1)
      }
    },
  }
</script>
<style scoped>
  .el-divider__text.is-left {
    transform: translate(-17%,-50%);
    border-radius: 12px;
    width: 120px;
    text-align: center;
  }
  .el-divider{
    background-color: #21317e;
    width: 100%;
    float: right;
  }
</style>