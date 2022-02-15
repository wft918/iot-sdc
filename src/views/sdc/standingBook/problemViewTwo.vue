<doc>
  问题详情
</doc>
<template>
  <div v-loading="loading" style="width: 100%;height: 900px;overflow-y: auto;">
    <!-- 返回 -->
    <div style="width: 100%;height: 30px;">
      <el-button style="float: right;" size="mini" type="primary" @click="retu">返回</el-button>
    </div>
    <!-- 问题概况 -->
    <el-divider content-position="left">问题概况</el-divider>
    <el-row style="color: #66a9d6;padding-left: 4%;">
      <el-col :span="6">
        <span>位置名称：</span>
        <span>{{inspectProblem.projectName}}</span>
      </el-col>
      <el-col :span="6">
        <span>巡检地点：</span>
        <span>{{inspectProblem.inspectLocation}}</span>
      </el-col>
      <el-col :span="6">
        <span>{{inspectProblem.state == 1?'未整改':inspectProblem.state == 2?'整改中':inspectProblem.state == 3?'带验收':inspectProblem.state == 5?'验收未通过':inspectProblem.state == 6?'已验收':''}}</span>
      </el-col>
      <el-col :span="6">
        <span :style="{'color':inspectProblem.overdued == '1'?'#ec2f34':''}">{{inspectProblem.overdued == '1'?'逾期':inspectProblem.overdued == '2'?'未逾期':''}}</span>
      </el-col>
    </el-row>
    <!-- 问题类型 -->
    <el-divider content-position="left">问题类型</el-divider>
    <p style="color: #66a9d6;"><span style="margin-left: 30px;">风险类型：</span><span>{{inspectProblem.typeName}}</span></p>
    <p style="color: #66a9d6;"><span style="margin-left: 30px;">风险点：</span><span>{{inspectProblem.pointName}}</span></p>
    <p style="color: #66a9d6;"><span style="margin-left: 30px;">风险源：</span><span>{{inspectProblem.sourceName}}</span></p>
    <p style="color: #66a9d6;"><span style="margin-left: 30px;">检查项：</span><span>{{inspectProblem.itemName}}</span></p>
    <!-- 问题发现 -->
    <el-divider content-position="left">问题发现</el-divider>
    <div style="width: 100%;height: 200px;overflow: auto;">
      <el-row style="color: #66a9d6;padding-left: 4%;">
        <el-col :span="6">
          <span>创建人：</span>
          <span>{{problemFinding.handleManName}}</span>
        </el-col>
        <el-col :span="6">
          <span>创建时间：</span>
          <span>{{problemFinding.handleTime}}</span>
        </el-col>
        <el-col :span="6">
          <span>整改期限：</span>
          <span>{{inspectProblem.deadline}}</span>
        </el-col>
        <el-col :span="6">
          <span>问题描述：</span>
          <span>{{problemFinding.handleContent}}</span>
        </el-col>
      </el-row>
      <!-- 照片 -->
      <div style="width: 100%;display: flex;flex-wrap: wrap;">
        <div v-for="item in problemphotoList" style="margin-left: 4%;margin-top: 5px;">
          <img style="width: 130px;height: 160px;" :src="`${$http.BASE_URL}/images/` + item" alt="">
        </div>
      </div>
    </div>
    <!-- 整改 -->
    <el-divider content-position="left">整改</el-divider>
    <div style="width: 100%;height: 200px;overflow: auto;">
      <el-table
        :data="rectificationList"
        size="mini"
        class="table">
        <el-table-column
          prop="handleManName"
          show-overflow-tooltip
          label="整改人">
        </el-table-column>
        <el-table-column
          prop="handleTime"
          show-overflow-tooltip
          label="整改时间">
        </el-table-column>
        <el-table-column
          prop="handleContent"
          show-overflow-tooltip
          label="整改描述">
        </el-table-column>
        <el-table-column
          prop=""
          show-overflow-tooltip
          label="预览">
          <template slot-scope="scope">
            <el-popover
              v-for="item in scope.row.photoPath.split(';')"
              placement="right"
              trigger="hover">
              <img :src="`${$http.BASE_URL}/images/` + item">
              <img slot="reference" :src="`${$http.BASE_URL}/images/` + item" :alt="`${$http.BASE_URL}/images/` + item" style="width: 30px;height: 30px;">
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 验收 -->
    <el-divider content-position="left">验收</el-divider>
    <div style="width: 100%;height: 200px;overflow: auto;">
      <el-table
        :data="acceptanceList"
        size="mini"
        class="table">
        <el-table-column
          prop="handleManName"
          show-overflow-tooltip
          label="验收人">
        </el-table-column>
        <el-table-column
          prop="handleState"
          show-overflow-tooltip
          label="验收结果">
          <template slot-scope="scope">
            {{scope.row.handleState == 0?'未通过':scope.row.handleState == 1?'通过':''}}
          </template>
        </el-table-column>
        <el-table-column
          prop="handleTime"
          show-overflow-tooltip
          label="验收时间">
        </el-table-column>
        <el-table-column
          prop="handleContent"
          show-overflow-tooltip
          label="验收描述">
        </el-table-column>
        <el-table-column
          prop=""
          show-overflow-tooltip
          label="预览">
          <template slot-scope="scope">
            <el-popover
              v-for="item in scope.row.photoPath.split(';')"
              placement="right"
              trigger="hover">
              <img :src="`${$http.BASE_URL}/images/` + item">
              <img slot="reference" :src="`${$http.BASE_URL}/images/` + item" :alt="`${$http.BASE_URL}/images/` + item" style="width: 30px;height: 30px;">
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        id:"",
        loading:false,
        inspectProblem:"",//所有数据
        problemFinding:"",//问题发现
        problemphotoList:[],//问题发现URL
        rectificationList:[],//整改
        acceptanceList:[],//验收
      }
    },
    activated() {
      this.id = this.$route.query.id
      this.getinspectProblem()
    },
    methods: {
      // 根据ID获取数据
      getinspectProblem() {
        this.loading = true
        this.$http({
          url:`/check/inspect/inspectProblem/queryById?id=${this.id}`,
          method:"get"
        }).then(({data}) => {
          if(data && data.success) {
            this.inspectProblem = data.inspectProblem
            this.problemFinding = data.inspectProblem.recordList[data.inspectProblem.recordList.length - 1] //问题发现
            this.problemphotoList = this.problemFinding.photoPath.split(';')//问题发现照片
            this.rectificationList = []
            this.acceptanceList = []
            data.inspectProblem.recordList.forEach(item => {
              if(item.handleType == 2) {
                this.rectificationList.push(item)
              }else if(item.handleType == 3) {
                this.acceptanceList.push(item)
              }
            })
            this.loading = false
          }
        })
      },
      // 返回上一页面
      retu() {
        this.$router.go(-1)
      }
    },
  }
</script>
<style scoped>
  .el-divider__text.is-left {
    transform: translate(-21%,-50%);
    border-radius: 12px;
    width: 96px;
    text-align: center;
  }
  .el-divider{
    background-color: #21317e;
    width: 100%;
    float: right;
  }
</style>