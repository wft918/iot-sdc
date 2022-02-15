<template>
<div>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
     v-dialogDrag
    :visible.sync="visible">
    <el-form :model="inputForm" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="method==='view'"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="12">
            <el-form-item label="告警等级" prop="alarmLevel.alarmName"
                :rules="[
                 ]">
              <el-input v-model="inputForm.alarmLevel.alarmName" placeholder=""     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="告警详情" prop="alarmDesc"
                :rules="[
                 ]">
              <el-input v-model="inputForm.alarmDesc" placeholder=""     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="告警设备" prop="device.name"
                :rules="[
                 ]">
              <el-input v-model="inputForm.device.name" placeholder=""     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="设备类型" prop="device.typeName"
                :rules="[
                 ]">
              <el-input v-model="inputForm.device.typeName" placeholder=""     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="所属站点" prop="device.siteName"
                :rules="[
                 ]">
              <el-input v-model="inputForm.device.siteName" placeholder=""     ></el-input>
           </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
            <el-form-item label="所属机房" prop="device.roomName"
                :rules="[
                 ]">
              <el-input v-model="inputForm.device.roomName" placeholder=""     ></el-input>
           </el-form-item>
        </el-col> -->
        <el-col :span="12">
            <el-form-item label="告警时间" prop="alarmTime"
                :rules="[
                 ]">
                <el-date-picker
                      style="width: 100%;"
                      v-model="inputForm.alarmTime"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间">
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="确认时间" prop="confirmTime"
                :rules="[
                 ]">
                <el-date-picker
                      style="width: 100%;"
                      v-model="inputForm.confirmTime"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间">
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="解除时间" prop="clearTime"
                :rules="[
                 ]">
                <el-date-picker
                      style="width: 100%;"
                      v-model="inputForm.clearTime"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间">
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="状态" prop="status"
                :rules="[
                 ]">
                <el-select v-model="inputForm.status" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in $dictUtils.getDictList('alarm_deal_status')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="监测参数" prop="monitorParam"
                :rules="[
                 ]">
              <el-input v-model="inputForm.monitorParam" placeholder=""     ></el-input>
           </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
            <el-form-item label="标准值" prop="standardValue"
                :rules="[
                 ]">
              <el-input v-model="inputForm.standardValue" placeholder=""     ></el-input>
           </el-form-item>
        </el-col> -->
        <!-- <el-col :span="12">
            <el-form-item label="告警值" prop="alarmValue"
                :rules="[
                 ]">
              <el-input v-model="inputForm.alarmValue" placeholder=""     ></el-input>
           </el-form-item>
        </el-col> -->
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
          alarmLevel: {
            id: '',
            alarmName: '',
          },
          alarmDesc: '',
          device: {
            id: '',
            deviceName: '',
            deviceTypeName: '',
            siteName: '',
            roomName: '',
          },
          alarmTime: '',
          confirmTime: '',
          clearTime: '',
          status: '',
          monitorParam: '',
          standardValue: '',
          alarmValue: ''
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
          this.title = `新建告警历史`
        } else if (method === 'edit') {
          this.title = '修改告警历史'
        } else if (method === 'view') {
          this.title = '查看告警历史'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/alarm/sdc/sdcalarmrecord/sdcAlarmRecord/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.sdcAlarmRecord)
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
              url: `/alarm/sdc/sdcalarmrecord/sdcAlarmRecord/save`,
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