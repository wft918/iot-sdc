<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="35%"
      @closed="resetForm"
    >
      <el-form
        :model="inputForm"
        ref="inputForm"
        v-loading="loading"
        :class="method === 'view' ? 'readonly' : ''"
        :disabled="isDisabled"
        label-width="120px"
      >
        <el-row :gutter="15">
          <el-col :span="15">
            <el-form-item
              label="线路名称"
              prop="routeName"
              :rules="[
                { required: true, message: '名称不能为空', trigger: 'blur' },
              ]"
            >
              <el-input
                style="width: 100%;"
                v-model="inputForm.routeName"
                placeholder="请填写线路名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="15">
                <el-form-item label="位置" prop="sdcSiteId" :rules="[
                 {required: true, message:'位置不能为空', trigger:'blur'}
                  ]">
                  <SelectTree
                  ref="sdcsiteTree"
                  :props="{
                      value: 'id',             // ID字段名
                      label: 'name',         // 显示名称
                      children: 'children'    // 子级字段名
                    }"
                  v-if="true"
                  :url="'/site-sdc/sdcsite/tree'"
                  :value="inputForm.sdcSiteId"
                  :clearable="true" 
                  :accordion="true"
                  @getValue="changeArea"/>
                  <!-- <el-select style="width: 100%;" v-model="inputForm.projectId" placeholder="请选择">
                    <el-option v-for="item in projectList" :key="item.projectId" :label="item.projectName"
                      :value="item.projectId">
                    </el-option>
                  </el-select> -->
                </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item label="负责人" prop="chargeMan" :rules="[
              {required: true, message:'负责人不能为空', trigger:'blur'}
              ]">
              <el-select style="width: 100%;" v-model="inputForm.chargeMan" placeholder="请选择">
                <el-option
                  v-for="item in chargeManList"
                  :key="item.userId.toString()"
                  :label="item.username"
                  :value="item.userId.toString()">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否启用" prop="enable" :rules="[
              {required: true, message:'是否启用不能为空', trigger:'blur'}
              ]">
              <el-radio-group v-model="inputForm.enable">
                <el-radio v-for="item in enableList" :key="item.value" :label="item.value">{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <div style="width: 90%;height: 250px;margin: 0 auto;display: flex;justify-content: space-between;margin-bottom: 5%;">
              <div style="width: 14%;height: 100%;"><span style="float: right;font-weight: 600;">巡检点</span></div>
              <div style="width: 36%;height: 100%;">
                <div style="width: 100%;height: 30px;text-align: center;line-height: 30px;font-weight: 600">未选巡检点</div>
                <div style="width: 100%;height:calc(100% - 30px);display: flex;flex-direction: column;padding-left: 20%;padding-top: 5px;overflow-y: auto;">
                  <el-checkbox-group v-loading="loading1" @change="checkleftChange" v-model="leftcheckList">
                    <el-checkbox v-for="item in checkallList" :key="item.id" :label="item.id">{{item.siteName}}</el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
              <div style="width: 9%;height: 100%;display: flex;flex-direction: column;align-items: center;justify-content: center;">
                <el-button @click="addStaff" type="primary" :disabled="!staffData.length" icon="el-icon-arrow-right"
                  circle></el-button><br/>
                <el-button @click="removeStaff" type="primary" :disabled="!selectedStaffData.length" icon="el-icon-arrow-left"
                  circle style="margin-left: 0; margin-top: 10px"></el-button>
              </div>
              <div style="width: 36%;height: 100%;">
                <div style="width: 100%;height: 30px;text-align: center;line-height: 30px;font-weight: 600">已选巡检点</div>
                <div style="width: 100%;height:calc(100  - 30px);display: flex;flex-direction: column;padding-left: 20%;padding-top: 5px;overflow-y: auto;">
                  <el-checkbox-group v-if="selectcheckallList.length" @change="checkrightChange" v-model="rightcheckList">
                    <el-checkbox v-for="item in selectcheckallList" :key="item.id" :label="item.id">{{item.siteName}}</el-checkbox>
                  </el-checkbox-group>
                  <div style="width: 80%;text-align: center;color: #7d8391;margin-top: 15px;" v-if="!selectcheckallList.length">暂无数据</div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注信息" prop="remarks" :rules="[]">
              <el-input
                style="width: 100%;"
                type="textarea"
                v-model="inputForm.remarks"
                placeholder="请填写备注信息"
              ></el-input>
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
  </div>
</template>
<script>
  import SelectTree from "@/components/treeSelect/treeSelect.vue"
  export default {
    data() {
      return {
        title:"",
        dialogVisible:false,
        method:"",
        loading:false,
        loading1:false,
        chargeManList:[],//负责任人
        enableList:[
          {
            label:"是",
            value:"1"
          },
          {
            label:"否",
            value:"0"
          }
        ],
        staffData:[],//选中左边对象集合
        selectedStaffData:[],//选中右边对象集合
        leftcheckList:[],//选中左边id集合
        rightcheckList:[],//选中右边id集合
        checkallList:[],//左边数据
        selectcheckallList:[],//右边数据
        inputForm: {
          id:"",
          routeName:"",//名称
          sdcSiteId:"",//所属位置
          chargeMan:"",//负责人id
          enable:"",
          chargeManName:"",//负责人名称
          siteList:[],
          remarks:""
        },
        btnType: 1,
        isDisabled: false
      }
    },
    components: {
      SelectTree
    },
    methods: {
      enableEdit() {
        this.title = '编辑巡检点'
        this.isDisabled = false
        this.btnType = 2
      },
      init(method,id) {
        this.method = method
        this.inputForm.id = id
        if(method == 'add') {
          this.title = '新增巡检线路'
          this.isDisabled = false
        }else if(method == 'edit') {
          this.title = '编辑巡检线路'
          this.isDisabled = false
        }else if(method == 'view') {
          this.title = '查看巡检线路'
          this.isDisabled = true
          this.btnType = 1
        }
        this.checkallList = []
        this.selectcheckallList = []
        // this.getinspectRoutelist()// 获取未选检查点
        this.getuserList()//获取负责人列表
        this.dialogVisible = true
        this.loading = false
        this.$nextTick(() => {
          // this.$refs.inputForm.resetFields()
          this.initialization()
          if(method == 'edit' || method == 'view') {
            // 修改或查看
            this.loading = true
            this.$http({
              url:`/check/inspect/inspectRoute/queryById?id=${this.inputForm.id}`,
              method:"get"
            }).then(({data}) => {
              if(data && data.success) {
                this.inputForm = this.recover(this.inputForm, data.inspectRoute)
                this.selectcheckallList = this.inputForm.siteList
                this.getinspectRoutelist()
                this.loading = false
              }
            })
          }
        })
      },
            //改变区域
      changeArea(val) {
       this.inputForm.sdcSiteId=val
       this.getinspectRoutelist()// 获取未选检查点
      },
      // 获取未选检查点
      getinspectRoutelist() {
        this.loading1 = true
        this.$http({
          url:`/check/inspect/inspectRoute/list/site?routeId=${this.inputForm.id}&sdcSiteId=${this.inputForm.sdcSiteId}`,
          method:"get"
        }).then(({data}) => {
          if(data && data.success) {
            this.checkallList = data.data
            this.loading1 = false
          }
        })
      },
      // 获取负责人列表
      // getuserList() {
      //   this.$http({
      //     url:"/admin/user/page",
      //     method:"get"
      //   }).then(({data}) => {
      //     if(data && data.success) {
      //       this.chargeManList = data.page.list
      //     }
      //   })
      // },
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
            this.chargeManList = data.data.records
          }
        })
      },
      // 左边移到右边
      addStaff() {
        this.staffData.forEach(item => {
          this.selectcheckallList.push(item)
        })
        // this.checkallList.forEach((item,index) => {
        //   console.log(item.label,'name-->')
        //   this.staffData.forEach(arr => {
        //     if(item.id == arr.id) {
        //       // console.log(item.id,arr.id)
        //       this.checkallList.splice(index,1)
        //       // console.log('--------------------<>,')
        //     }
        //   })
        // })
        for(var i = 0;i < this.checkallList.length;i++) {
          for(var j = 0;j < this.staffData.length;j++) {
            if(this.checkallList[i].id == this.staffData[j].id) {
              this.checkallList.splice(i,1)
            }
          }
        }
        this.staffData = []
        this.leftcheckList = []
        this.rightcheckList = []
      },
      // 右边移到左边
      removeStaff() {
        this.selectedStaffData.forEach(item => {
          this.checkallList.push(item)
        })
        for(var i = 0;i < this.selectcheckallList.length;i++) {
          for(var j = 0;j < this.selectedStaffData.length;j++) {
            if(this.selectcheckallList[i].id == this.selectedStaffData[j].id) {
              this.selectcheckallList.splice(i,1)
            }
          }
        }
        this.selectedStaffData = []
        this.leftcheckList = []
        this.rightcheckList = []
      },
      // 左边复选框发生变化触发
      checkleftChange() {
        this.staffData = []
        this.checkallList.forEach(item => {
          this.leftcheckList.forEach(arr => {
            if(item.id == arr) {
              this.staffData.push(item)
            }
          })
        })
      },
      // 右边复选框发生变化触发
      checkrightChange() {
        this.selectedStaffData = []
        this.selectcheckallList.forEach(item => {
          this.rightcheckList.forEach(arr => {
            if(item.id == arr) {
              this.selectedStaffData.push(item)
            }
          })
        })
      },
      doSubmit() {
        if(this.selectcheckallList.length <= 0) {
          this.$message.warning('已选巡检点不能为空')
          return
        }
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.inputForm.siteList = this.selectcheckallList
            this.chargeManList.forEach(item => {
              if(item.id == this.inputForm.chargeMan) {
                this.inputForm.chargeManName = item.name
              }
            })
            this.loading = true
            this.$http({
              url: `/check/inspect/inspectRoute/save`,
              method: 'post',
              data: this.inputForm
            }).then(({data}) => {
              if (data && data.success) {
                this.dialogVisible = false
                this.$message.success(data.msg)
                this.$emit('refreshDataList')
              }
              this.loading = false
            })
          }
        })
      },
      // 初始化
      initialization() {
        this.inputForm.routeName = ''
        this.inputForm.sdcSiteId = ''
        this.inputForm.chargeMan = ''
        this.inputForm.chargeManName = ''
        this.inputForm.siteList = []
        this.remarks = ''
      },
      resetForm() {
        this.$refs.inputForm.resetFields()
        this.initialization()
      }
    },
  }
</script>