<template>
<div>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
     v-dialogDrag
    :visible.sync="visible">
    <el-form :model="inputForm" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="method==='view'"
             label-width="140px"  style="height:302px">
      <el-row  :gutter="15">
        <el-col :span="12">
            <el-form-item label="告警等级名称"  prop="alarmName" 
                :rules="[
                  {required: true, message:'告警等级名称不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.alarmName" placeholder="请填写告警等级名称"  :disabled="inputForm.deletable==='0'"></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="4">
            <el-form-item label="颜色显示" prop="alarmColor"
                :rules="[
                  {required: true, message:'颜色显示不能为空', trigger:'blur'}
                 ]">
            <template>
                <colorPicker v-model="inputForm.alarmColor" :disabled="method==='view'"/>
            </template>
           </el-form-item>
        </el-col>
        <el-col :span="4">
            <el-form-item label="启用状态" prop="status"
                :rules="[
                  {required: true, message:'启用状态不能为空', trigger:'blur'}
                 ]">
            <template>
                <el-switch
                  v-model="inputForm.status"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-value="0"
                  inactive-value="1">
                </el-switch>
            </template>
                <!-- <el-select v-model="inputForm.status" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in $dictUtils.getDictList('enable_status')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select> -->
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="通知频率（分钟)" prop="noticeFreq"
                :rules="[
                  {validator: validatorxps.isIntGtZero, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.noticeFreq" placeholder="请填写通知频率（分钟)"     >
                </el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="通知上限（次）" prop="noticeUplimit"
                :rules="[
                  {validator: validatorxps.isIntGtZero, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.noticeUplimit" placeholder="请填写通知上限（次）"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="升级时间（分钟）" prop="upgradeTime"
                :rules="[
                  {validator: validatorxps.isIntGtZero, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.upgradeTime" placeholder="请填写升级时间（分钟）"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="处理时限（分钟）" prop="alarmDealline"
                :rules="[
                  {validator: validatorxps.isIntGtZero, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.alarmDealline" placeholder="请填写处理时限（分钟）"     ></el-input>
           </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
            <el-form-item label="是否可删除" prop="deletable"
                :rules="[
                  {required: true, message:'是否可删除不能为空', trigger:'blur'}
                 ]">
                <el-select v-model="inputForm.deletable" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in $dictUtils.getDictList('yes_no')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
           </el-form-item>
        </el-col> -->
        <el-col :span="24">
            <el-form-item label="备注信息" prop="remarks"
                :rules="[
                 ]">
          <el-input type="textarea" v-model="inputForm.remarks" placeholder="请填写备注信息"     ></el-input>
           </el-form-item>
        </el-col>
        </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
      <el-button type="primary" v-if="method != 'view'" @click="doSubmit()" v-noMoreClick>确定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        inputForm: {
          id: '',
          alarmName: '',
          alarmColor: '#ff0000',
          noticeFreq: '',
          noticeUplimit: '',
          upgradeTime: '',
          alarmDealline: '',
          status: '',
          deletable: '',
          remarks: ''
        }
      }
    },
    components: {
    },
    methods: {
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建告警等级`
        } else if (method === 'edit') {
          this.title = '修改告警等级'
        } else if (method === 'view') {
          this.title = '查看告警等级'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/alarm/sdc/scdalarmlevel/sdcAlarmLevel/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.sdcAlarmLevel)
              this.loading = false
            })
          }
        })
      },
      // 表单提交
      doSubmit () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: `/alarm/sdc/scdalarmlevel/sdcAlarmLevel/save`,
              method: 'post',
              data: this.inputForm
            }).then(({data}) => {
              this.loading = false
              if (data && data.success) {
                this.visible = false
                this.$message.success(data.msg)
                this.$emit('refreshDataList')
              }
            })
          }
        })
      }
    }
  }
</script>