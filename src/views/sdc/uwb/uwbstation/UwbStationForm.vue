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
            <el-form-item label="所属区域" prop="areaId"
                :rules="[
                    {required: true, message:'所属区域不能为空', trigger:'blur'}
                 ]">
                <!-- <el-select v-model="inputForm.areaId" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in areaList"
                            :key="item.id"
                            :label="item.areaName"
                            :value="item.id">
                          </el-option>
                      </el-select> -->
        <!-- <el-form-item label="上级区域" prop="parent.id"> -->
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
          <!-- </el-form-item>  -->
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="基站编号" prop="stationNo"
                :rules="[
                   {required: true, message:'基站编号不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.stationNo" placeholder="请填写基站编号" ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="基站名称" prop="stationName"
                :rules="[
                    {required: true, message:'基站名称不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.stationName" placeholder="请填写基站名称"     ></el-input>
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
            <el-form-item label="X坐标" prop="coordinateX"
                :rules="[
                    {required: true, message:'x坐标不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.coordinateX" placeholder="请填写X坐标"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="Y坐标" prop="coordinateY"
                :rules="[
                    {required: true, message:'Y坐标不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.coordinateY" placeholder="请填写Y坐标"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="Z坐标" prop="coordinateZ"
                :rules="[
                    {required: true, message:'Z坐标不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.coordinateZ" placeholder="请填写Z坐标"     ></el-input>
           </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
            <el-form-item label="在线状态" prop="onlineStatus"
                :rules="[
                 ]">
                <el-select v-model="inputForm.onlineStatus" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in $dictUtils.getDictList('online_status')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
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
          stationNo: '',
          stationName: '',
          mac: '',
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
        // this.$http({
        //       url: `/uwb/ips/uwbarea/uwbArea/list?pageSize=10000`,
        //       method: 'get'
        //     }).then(({data}) => {
        //       this.areaList = data.page.list
        //     })
        if (method === 'add') {
          this.title = `新建基站基础信息`
        } else if (method === 'edit') {
          this.title = '修改基站基础信息'
        } else if (method === 'view') {
          this.title = '查看基站基础信息'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/uwb/ips/uwbstation/uwbStation/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.uwbStation)
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
              url: `/uwb/ips/uwbstation/uwbStation/save`,
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