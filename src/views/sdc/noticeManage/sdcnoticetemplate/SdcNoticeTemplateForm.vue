<template>
<div>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    v-dialogDrag
    :visible.sync="visible" customClass="customWidth" >
    <el-form :model="inputForm" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="method==='view'"
             label-width="120px" >
      <el-row  :gutter="15">
        <el-col :span="15">
            <el-form-item label="模板名称" prop="templateName"
                :rules="[
                  {required: true, message:'模板名称不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.templateName" placeholder="请填写模板名称"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="15">
            <el-form-item label="通知配置" prop="conf"
                :rules="[
                  {required: true, message:'通知配置不能为空', trigger:'blur'}
                 ]">
                <el-select v-model="inputForm.conf" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in noticeConfigList"
                            :key="item.id"
                            :label="item.configName"
                            :value="item.id">
                          </el-option>
                      </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="22">
            <el-form-item label="模板内容" prop="templateContent" @blur="contentPreview()"
                :rules="[
                  {required: true, message:'模板内容不能为空', trigger:'blur'}
                 ]">
              <el-input type="textarea" v-model="inputForm.templateContent" placeholder="请填写模板内容"     ></el-input>
              <!-- <el-tag  v-show="method!='view'"
              style="cursor:pointer"
              :key="tag.value"
              v-for="tag in tagList"
              :disable-transitions="false"
              size="small"
              @click="tagClick(tag)">
              {{tag.label}}
            </el-tag> -->
           </el-form-item>
        </el-col>
        <el-col :span="15">
            <el-form-item label="启用状态" prop="enableStatus"
                :rules="[
                  {required: true, message:'启用状态不能为空', trigger:'blur'}
                 ]">
              <template>
                    <el-switch
                      v-model="inputForm.enableStatus"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      active-value="0"
                      inactive-value="1">
                    </el-switch>
                </template>
           </el-form-item>
        </el-col>
        <!-- <el-col :span="22">
            <el-form-item label="内容预览" prop="remarks"
                :rules="[
                 ]">
            <el-input type="textarea"  disabled="disabled" v-model="inputForm.remarks" placeholder="内容预览"     ></el-input>
            <el-button @click="contentPreview()" v-show="method!='view'" size="small">内容预览</el-button>
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
        noticeConfigList: [],
        content: '',
        tagList: [], 
        inputForm: {
          id: '',
          templateName: '',
          conf: '',
          templateContent: '',
          enableStatus: '0',
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
          this.title = `新建通知模板`
        } else if (method === 'edit') {
          this.title = '修改通知模板'
        } else if (method === 'view') {
          this.title = '查看通知模板'
        }
        this.visible = true
        this.loading = false
        this.getNoticeConfigList()
        this.tagList = this.$dictUtils.getDictList('notice_template_param')
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.request({
              url: `/notice/sdc/sdcnoticetemplate/sdcNoticeTemplate/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.sdcNoticeTemplate)
              this.loading = false
            })
          }
        })
      },
      tagClick (tag) {
        var tagVals =tag.value.split('@@'); 
        this.inputForm.templateContent = this.inputForm.templateContent + tagVals[0];
        // this.inputForm.remarks = this.inputForm.templateContent + tagVals[1];
      },
      getNoticeConfigList(){
        this.request({
          url: '/notice/sdc/sdcnoticeconfig/sdcNoticeConfig/list',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': 99999,
            'orderBy': this.orderBy,
            ...this.searchForm
          }
        }).then(({data}) => {
          if (data && data.success) {
            this.noticeConfigList = data.page.list
          }
        })
      },
      // 表单提交
      doSubmit () {
        this.contentPreview();
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.request({
              url: `/notice/sdc/sdcnoticetemplate/sdcNoticeTemplate/save`,
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
      },
      contentPreview(){
        var previewContent = this.inputForm.templateContent   
        this.tagList.forEach(element => {
          var value = element.value.split("@@")
          var value0 = value[0]
          var value1 = value[1]
          previewContent = previewContent.replace(value0,value1)
        });
        this.inputForm.remarks = previewContent;
    }
  }
  }
</script>
<style>
  .customWidth{
      width:700px;  
  }
</style>