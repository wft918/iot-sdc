<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="75%" :close-on-click-modal="false" v-dialogDrag>
  <div v-loading="loading" style="width: 100%;height: 850px;overflow-y: auto;">
    <div style="width: 100%;height: 35px;line-height: 35px;font-weight: 600;font-size: 15px;"><span style="margin-left: 5px;">线下巡检</span></div>
    <div style="width: 100%;height: calc(100% - 40px);padding: 10px;position: relative;">
      <div style="width: 100%;">
        <span style="font-size: 22px;">{{record.projectName}}</span>
        <span style="margin-left: 30px;">{{record.inspectState == 1?'巡检中':record.inspectState == 0?'未开始':record.inspectState == 3?'已取消':record.inspectState == 2?'已完成':''}}</span>
        <span v-if="inspectType == '1'" style="margin-left: 30px;" :style="{'color':record.overdued == '1'?'#ec2f34':''}">{{record.overdued == '1'?'逾期':record.overdued == '0'?'未逾期':''}}</span>
        <span style="margin-left: 30px;font-size: 14px;"><span style="color: #4579a1;">共发现</span><span style="color: #ec2f34;">{{record.problemNum}}</span><span style="color: #4579a1;">个问题</span></span>
        <el-button style="float: right;" size="mini" type="primary" @click="retu">返回</el-button>
        <el-button style="float: right;transform: translateX(-10px);" type="primary" @click="downloadTpl()" size="mini">导出</el-button>
      </div>
      <!-- 巡检概况 -->
      <el-divider content-position="left">巡检概况</el-divider>
      <el-row style="color: #66a9d6;padding-left: 4%;">
        <el-col :span="6">
          <span>巡检类型：</span>
          <span>{{inspectType == '0'?'线下巡检':inspectType == '1'?'线上巡检':''}}</span>
        </el-col>
        <el-col :span="6">
          <span>巡检员：</span>
          <span>{{record.inspectManName}}</span>
        </el-col>
        <el-col :span="6" v-if="inspectType == '1'">
          <span>计划巡检时间：</span>
          <span>{{record.startTime}}</span>
        </el-col>
        <el-col :span="6" v-if="inspectType == '1'">
          <span>实际巡检时间：</span>
          <span>{{record.planStartTime}}</span>
        </el-col>
        <el-col :span="6" v-if="inspectType == '0'">
          <span>开始巡检时间：</span>
          <span>{{record.startTime}}</span>
        </el-col>
        <el-col :span="6" v-if="inspectType == '0'">
          <span>结束巡检时间：</span>
          <span>{{record.endTime}}</span>
        </el-col>
      </el-row>
      <!-- 巡检点 -->
      <div style="width: 100%;" v-for="(item,index) in infoList" :key="index">
        <el-divider content-position="left">{{item.siteName}}</el-divider>
        <el-table
          :data="item.paramList"
          size="mini"
          class="table">
          <el-table-column
            prop="typeName"
            show-overflow-tooltip
            label="风险类型">
          </el-table-column>
          <el-table-column
            prop="pointName"
            show-overflow-tooltip
            label="风险点">
          </el-table-column>
          <el-table-column
            prop="sourceName"
            show-overflow-tooltip
            label="风险源">
          </el-table-column>
          <el-table-column
            prop="checkName"
            show-overflow-tooltip
            label="检查项">
          </el-table-column>
          <el-table-column
            prop="type"
            show-overflow-tooltip
            label="检查结果">
            <template slot-scope="scope">
              {{scope.row.inspectResult.type == '1'?scope.row.inspectResult.optionValue:scope.row.inspectResult.type == '2'?scope.row.inspectResult.numberValue:scope.row.inspectResult.type == '3'?scope.row.inspectResult.textValue:scope.row.inspectResult.type == '4'?'':''}}
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            show-overflow-tooltip
            label="问题信息">
            <template slot-scope="scope">
              <!-- <el-popover
                v-for="item in scope.row.photoPath.split(';')"
                placement="right"
                trigger="hover">
                <img :src="`${$http.BASE_URL}/images/` + item">
                <img slot="reference" :src="`${$http.BASE_URL}/images/` + item" :alt="`${$http.BASE_URL}/images/` + item" style="width: 30px;height: 30px;">
              </el-popover> -->
              <div v-for="item in scope.row.problemList" :key="item.id">
                <img style="width: 80px;height: 80px;float: left;" v-for="arr in item.photoPath.split(';')" :src="`${$http.BASE_URL}/images/` + arr" alt="">
                <div style="float: left;width: 100px;height: 80px;margin-left: 5px;">
                  <span>整改人：</span><span>{{item.solveManName}}</span><br>
                  <span>整改期限：</span><span>{{item.deadline}}</span><br>
                  <span>{{item.content}}</span>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
  </el-dialog>
</template>
<script>
  export default {
    data() {
      return {
        dialogVisible: false,
        title:"巡检详情",
        id:"",
        inspectType:"",
        record:"",//巡检概况数据
        infoList:[],//巡检点数据
        loading:false,
      }
    },
    // activated() {
    //   this.id = this.$route.query.id
    //   this.inspectType = this.$route.query.inspectType
    //   this.getrecordinfoList()
    // },
    methods: {
     init(id,inspectType) {
      this.dialogVisible = true
      this.id = id
      this.inspectType = inspectType
      this.getrecordinfoList()
      },
      // 根据ID拿数据
      getrecordinfoList() {
        this.loading = true
        this.$http({
          url:"/check/inspect/inspectRecord/record/info",
          method:"get",
          params:{
            recordId:this.id
          }
        }).then(({data}) => {
          if(data && data.success) {
            this.record = data.record
            this.infoList = data.info
            this.loading = false
          }
        })
      },
      // 返回上一页面
      retu() {
        this.dialogVisible = false
        // this.$router.go(-1)
      },
      // 导出
      downloadTpl () {
        this.$utils.download(`/check/inspect/inspectRecord/export/record/info?recordId=${this.id}`)
      },
    },
  }
</script>
<style scoped>
  .el-divider__text.is-left {
    /* transform: translate(-24%,-50%); */
    /* float: left!important; */
    border-radius: 12px;
    position: absolute;
    left: 0;
  }
  .el-divider{
    background-color: #21317e;
  }
</style>