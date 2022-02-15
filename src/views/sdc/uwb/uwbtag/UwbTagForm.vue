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
        <el-col :span="12"  v-show="method === 'view'?true:false">
            <el-form-item label="所属区域" prop="areaId"
                :rules="[
                 ]">
                <!-- <el-select v-model="inputForm.areaId" placeholder=""  style="width: 100%;">
                          <el-option
                            v-for="item in areaList"
                            :key="item.id"
                            :label="item.areaName"
                            :value="item.id">
                          </el-option>
                      </el-select> -->
                <SelectTree 
                  ref="parentTree"
                  :props="{
                      value: 'id',             // ID字段名
                      label: 'name',         // 显示名称
                      children: 'children'    // 子级字段名
                    }"
                  v-if="visible"
                  :url="`/site-sdc/sdcsite/tree`"
                  :value="inputForm.areaId"
                  :clearable="true" 
                  :accordion="true"
            @getValue="(value) => {inputForm.areaId=value}"/>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="设备序列号" prop="tagSerial"
                :rules="[
                    {required: true, message:'设备序列号不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.tagSerial" placeholder="请填写设备序列号"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="标签名称" prop="tagName"
                :rules="[
                    {required: true, message:'标签名称不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.tagName" placeholder="请填写标签名称"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="MAC地址" prop="mac"
                :rules="[
                 ]">
              <el-input v-model="inputForm.mac" placeholder="请填写MAC地址"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="标签类型" prop="tagType"
                :rules="[
                    {required: true, message:'标签类型不能为空', trigger:'blur'}
                 ]">
                <el-select v-model="inputForm.tagType" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in $dictUtils.getDictList('tag_type')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="12" v-show="method === 'view'?true:false">
            <el-form-item label="X坐标" prop="coordinateX"
                :rules="[
                 ]">
              <el-input v-model="inputForm.coordinateX"   ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12" v-show="method === 'view'?true:false">
            <el-form-item label="Y坐标" prop="coordinateY"
                :rules="[
                 ]">
              <el-input v-model="inputForm.coordinateY"  ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12" v-show="method === 'view'?true:false">
            <el-form-item label="Z坐标" prop="coordinateZ"
                :rules="[
                 ]">
              <el-input v-model="inputForm.coordinateZ"   ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12" v-show="method === 'view'?true:false">
            <el-form-item label="在线状态" prop="onlineStatus" 
                :rules="[
                 ]">
                <el-select :disabled="true" v-model="inputForm.onlineStatus" style="width: 100%;">
                          <el-option
                            v-for="item in $dictUtils.getDictList('online_status')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
           </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
            <el-form-item label="启用状态" prop="enableStatus"
                :rules="[
                 ]">
                <el-select v-model="inputForm.enableStatus" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in $dictUtils.getDictList('enable_status')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
           </el-form-item>
        </el-col> -->
        <el-col :span="12">
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
  import SelectTree from '@/components/treeSelect/treeSelect.vue'
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        areaList: [],
        inputForm: {
          id: '',
          tagSerial: '',
          tagName: '',
          mac: '',
          tagType: '',
          areaId: '',
          coordinateX: '',
          coordinateY: '',
          coordinateZ: '',
          onlineStatus: '',
          enableStatus: '',
          remarks: ''
        }
      }
    },
    components: {
      SelectTree
    },
    methods: {
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建标签基础信息`
        } else if (method === 'edit') {
          this.title = '修改标签基础信息'
        } else if (method === 'view') {
          this.title = '查看标签基础信息'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/uwb/ips/uwbtag/uwbTag/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.uwbTag)
              this.inputForm.areaId = String(this.inputForm.areaId);
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
              url: `/uwb/ips/uwbtag/uwbTag/save`,
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