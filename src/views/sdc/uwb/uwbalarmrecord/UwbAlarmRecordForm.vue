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
            <el-form-item label="围栏名称" prop="fenceName"
                :rules="[
                 ]">
              <el-input v-model="inputForm.fenceName" placeholder=""     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="管控规则" prop="ruleType"
                :rules="[
                 ]">
            <el-select v-model="inputForm.ruleType" placeholder=""  style="width: 100%;" >
              <el-option
                v-for="item in $dictUtils.getDictList('rule_type')" 
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="告警区域" prop="areaName"
                :rules="[
                 ]">
              <el-input v-model="inputForm.areaName" placeholder=""     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="告警标签" prop="tagName"
                :rules="[
                 ]">
              <el-input v-model="inputForm.tagName" placeholder=""     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="告警对象名称" prop="objName"
                :rules="[
                 ]">
              <el-input v-model="inputForm.objName" placeholder=""     ></el-input>
           </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
            <el-form-item label="备注信息" prop="remarks"
                :rules="[
                 ]">
          <el-input type="textarea" v-model="inputForm.remarks" placeholder=""     ></el-input>
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
          fenceId: '',
          fenceName: '',
          ruleType: '',
          areaId: '',
          tagId: '',
          objName: '',
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
          this.title = `新建告警信息`
        } else if (method === 'edit') {
          this.title = '修改告警信息'
        } else if (method === 'view') {
          this.title = '查看告警信息'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/uwb/ips/uwbalarmrecord/uwbAlarmRecord/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.uwbAlarmRecord)
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
              url: `/uwb/ips/uwbalarmrecord/uwbAlarmRecord/save`,
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