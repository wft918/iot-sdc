<doc>
  新增巡检计划
</doc>
<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="45%" :close-on-click-modal="false" v-dialogDrag>
    <el-form ref="inputForm" :class="method==='view'?'readonly':''" :disabled="isDisabled" :model="inputForm" v-loading="loading" class="demo-form-inline" label-width="120px">
      <el-row>
        <el-col :span="24">
          <el-form-item prop="planName" label="计划名称" :rules="[
          { required: true, message: '计划名称不能为空', trigger: 'blur' },
        ]">
            <el-input style="width: 100%;" v-model="inputForm.planName" placeholder="计划名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="planType" label="计划类型" :rules="[
          { required: true, message: '计划类型不能为空', trigger: 'blur' },
        ]">
            <el-select style="width: 100%;" v-model="inputForm.planType" placeholder="类型">
              <el-option v-for="item in planTypeList" :key="item.id" :label="item.label" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="executionInterval" label="执行间隔" :rules="[
          { required: true, message: '执行间隔不能为空', trigger: 'blur' },
        ]">
            <el-input-number style="width: 100%;" v-model="inputForm.executionInterval" :min="1" label="执行间隔"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="startDate" label="计划开始日期" :rules="[
          { required: true, message: '开始日期不能为空', trigger: 'blur' },
        ]">
            <el-date-picker value-format="yyyy-MM-dd" style="width: 100%;" v-model="inputForm.startDate" type="date" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="endDate" label="结束日期" :rules="[
          { required: true, message: '结束日期不能为空', trigger: 'blur' },
        ]">
            <el-date-picker value-format="yyyy-MM-dd" style="width: 100%;" v-model="inputForm.endDate" type="date" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="executionDate" label="首次执行日期" :rules="[
          { required: true, message: '执行日期不能为空', trigger: 'blur' },
        ]">
            <el-date-picker value-format="yyyy-MM-dd" style="width: 100%;" v-model="inputForm.executionDate" type="date" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="executionTime" label="执行时间" :rules="[
          { required: true, message: '执行时间不能为空', trigger: 'blur' },
        ]">
            <el-time-picker value-format="HH:mm:ss" style="width: 100%;" v-model="inputForm.executionTime" placeholder="任意时间点">
            </el-time-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" v-if="inputForm.planType === 5">
          <el-form-item prop="startTime" label="执行开始时间" :rules="[
          { required: true, message: '执行开始时间不能为空', trigger: 'blur' },
        ]">
            <el-time-picker value-format="HH:mm:ss" style="width: 100%;" v-model="inputForm.startTime" placeholder="任意时间点">
            </el-time-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="inputForm.planType === 5">
          <el-form-item prop="endTime" label="执行结束时间" :rules="[
          { required: true, message: '执行结束时间不能为空', trigger: 'blur' },
        ]">
            <el-time-picker value-format="HH:mm:ss" style="width: 100%;" v-model="inputForm.endTime" placeholder="任意时间点">
            </el-time-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="executionDuration" label="执行时长(分钟)" :rules="[
          { required: true, message: '执行时长不能为空', trigger: 'blur' },
        ]">
            <el-input-number style="width: 100%;" v-model="inputForm.executionDuration" :min="1" label="执行间隔"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="routeId" label="巡检路线" :rules="[
          { required: true, message: '巡检路线不能为空', trigger: 'blur' },
        ]">
            <el-select style="width: 100%;" v-model="inputForm.routeId" placeholder="请选择">
              <el-option
                v-for="item in routeList"
                :key="item.id"
                :label="item.routeName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="inspectorId" label="巡检人员" :rules="[
          { required: true, message: '巡检人员不能为空', trigger: 'blur' },
        ]">
            <el-select style="width: 100%;" v-model="inputForm.inspectorId" placeholder="请选择">
              <el-option
                v-for="item in inspectorList"
                :key="item.userId"
                :label="item.username"
                :value="item.userId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="enable" label="是否启用" :rules="[
          { required: true, message: '是否启用不能为空', trigger: 'blur' },
        ]">
            <el-select style="width: 100%;" v-model="inputForm.enable" placeholder="是否启用">
              <el-option v-for="item in ynEnableList" :label="item.label" :value="item.value" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer" v-if="method === 'view'">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button v-if="btnType === 1" type="primary" @click="enableEdit">编 辑</el-button>
        <el-button v-if="btnType === 2" type="primary" @click="doSubmit()">确 定</el-button>
      </span>
      <span slot="footer" class="dialog-footer" v-else>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doSubmit()">确 定</el-button>
      </span>
  </el-dialog>

</template>
<script>
  export default {
    data() {
      return {
        dialogVisible: false,
        method:"",
        title:"",
        loading:false,
        planTypeList:[
          {
            label:"时计划",
            id:5
          },
          {
            label:"日计划",
            id:1
          },
          {
            label:"周计划",
            id:2
          },
          {
            label:"月计划",
            id:3
          },
          {
            label:"年计划",
            id:4
          }        
        ],//计划类型
        ynEnableList:[
          {
            label:"是",
            value:"1"
          },
          {
            label:"否",
            value:"0"
          }
        ],
        routeList:[],//巡检路线列表
        inspectorList:[],//巡检人列表
        inputForm: {
          id:"",
          planName: '',
          planType:"",
          executionInterval:"",
          startDate:"",
          endDate:"",
          executionDate:"",
          executionTime:"",
          startTime: "",
          endTime: "",
          executionDuration:"",
          enable:"",
          routeId:"",
          routeName:"",
          inspectorId:"",
          inspectorName:"",
          btnType: 1,
          isDisabled: false
        }
      };
    },
    methods: {
      enableEdit() {
        this.title = '编辑巡检计划'
        this.isDisabled = false
        this.btnType = 2
      },
      init(method,id) {
        this.method = method
        this.inputForm.id = id
        if(method == 'add') {
          this.title = "新增巡检计划"
          this.isDisabled = false
        }else if(method == 'edit') {
          this.title = '编辑巡检计划'
          this.isDisabled = false
        }else if(method == 'view') {
          this.isDisabled = true
          this.btnType = 1
          this.title = '查看巡检计划'
        }
        this.getuserList()//获取巡检人列表
        this.getinspectRouteList()//获取巡检线路列表
        this.dialogVisible = true
        this.loading = false
        this.$nextTick(function() {
          this.$refs.inputForm.resetFields()
          if(method == 'edit' || method == 'view') {
            // 修改/查看
            this.loading = true
            this.$http({
              url:`/check/inspect/inspectPlan/queryById?id=${this.inputForm.id}`,
              method:"get"
            }).then(({data}) => {
              if(data && data.success) {
                this.inputForm = this.recover(this.inputForm, data.inspectPlan)
                this.loading = false
              }
            })
          }
        })
      },
      // 获取巡检人列表
      getuserList() {
        this.$http({
          url:"/admin/user/page",
          method:"get",
          params:{
            pageNo:1,
            size:-1
          }
        }).then(({data}) => {
          if(data && data.code == '0') {
            this.inspectorList = data.data.records
          }
        })
      },
      // 获取巡检线路列表
      getinspectRouteList() {
        this.$http({
          url:"/check/inspect/inspectRoute/list",
          method:"get",
          params: {
            enable:'1'
          }
        }).then(({data}) => {
          if(data && data.success) {
            this.routeList = data.page.list
          }
        })
      }, 
      doSubmit() {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.routeList.forEach(item => {
              if(item.id == this.inputForm.routeId) {
                this.inputForm.routeName = item.routeName
              }
            })
            this.inspectorList.forEach(item => {
              if(item.id == this.inputForm.inspectorId) {
                this.inputForm.inspectorName = item.name
              }
            })
            this.loading = true
            this.$http({
              url: `/check/inspect/inspectPlan/save`,
              method: 'post',
              data: this.inputForm
            }).then(({data}) => {
              if (data && data.success) {
                this.dialogVisible = false
                this.$message.success(data.msg)
                this.$emit('refreshDataList')
              }else{
                this.$message.warning(data.msg)
              }
              this.loading = false
            })
          }
        })
      }
    }
  };
</script>
<style>
  /* .el-row /deep/.el-form-item__content{
  width: calc(100% - 100px);
} */
[role=button]{
  border: none!important;
}
</style>