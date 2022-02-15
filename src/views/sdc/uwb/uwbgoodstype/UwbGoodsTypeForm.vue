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
            <el-form-item label="类型名称" prop="typeName"
                :rules="[
                   {required: true, message:'类型名称不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.typeName" placeholder="请填写类型名称"     ></el-input>
           </el-form-item>
        </el-col>
         <el-col :span="24">
            <el-form-item label="类型图标" prop="typeIcon"
                :rules="[
                 ]">
                    <!-- :headers="{token: $cookie.get('token')}" -->
              <el-upload ref="typeIcon"
                    :headers="headers"
                    list-type="picture-card"
                    action="/admin/sys-file/upload"
                    accept="image/png,image/gif,image/jpg,image/jpeg"
                    :on-preview="(file, fileList) => {
                        $alert(`<img style='width:100%' src=' ${(file.response && file.response.date.url) || file.response.date.url}'/>`,  {
                          dangerouslyUseHTMLString: true,
                          showConfirmButton: false,
                          closeOnClickModal: true,
                          customClass: 'showPic'
                        });
                    }"
                    :on-success="(response, file,fileList) => {
                       inputForm.typeIcon = fileList.map(item => (item.response && item.response.data.url) || item.url).join('|')
                    }"
                    :before-upload="(file)=>{
                      if(!(file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/jpg' || file.type === 'image/jpeg')) {
                          $message.warning('请上传格式为image/png, image/gif, image/jpg, image/jpeg的图片')
                          return false
                        }
                    }"    
                    :on-remove="(file, fileList) => {  
                      if (file && file.status==='success') {
                          $http.post(`/admin/sys-file/removeByFileName/${(file.response && file.response.data.fileName) || file.name}`).then(({data}) => {
                            $message.success(data.msg)
                          })
                          inputForm.typeIcon = fileList.map(item => item.url).join('|')
                      }
                    }"
                    :before-remove="(file, fileList) => {
                      if (file && file.status==='success') {
                        return $confirm(`确定移除此文件？`)
                      }
                    }"
                    :limit="1"
                    :on-exceed="(files, fileList) =>{
                      $message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
                    }"
                    :file-list="typeIconArra">
                    <i class="el-icon-plus"></i>
                  </el-upload>
           </el-form-item>
        </el-col>
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
import store from '@/store'
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        typeIconArra: [],
        inputForm: {
          id: '',
          typeName: '',
          typeIcon: '',
          remarks: ''
        },
        headers: {
          'Authorization': 'Bearer ' + store.getters.access_token,
        }
      }
    },
    components: {
    },
    methods: {
      handleAvatarSuccess(res, file) {
      this.avatarUrl = URL.createObjectURL(file.raw)
      this.ruleForm2.avatar = res.data.url
      },
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建物资类型配置`
        } else if (method === 'edit') {
          this.title = '修改物资类型配置'
        } else if (method === 'view') {
          this.title = '查看物资类型配置'
        }
        this.typeIconArra = []
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/uwb/ips/uwbgoodstype/uwbGoodsType/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.uwbGoodsType)
              this.inputForm.typeIcon.split('|').forEach((item) => {
                if (item.trim().length > 0) {
                  this.typeIconArra.push({name: decodeURIComponent(item.substring(item.lastIndexOf('/') + 1)), url: item})
                }
              })
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
              url: `/uwb/ips/uwbgoodstype/uwbGoodsType/save`,
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