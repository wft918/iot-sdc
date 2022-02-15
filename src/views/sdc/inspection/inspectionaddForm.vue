<!-- 新增风险类型 -->
<template>
  <div>
    <el-dialog :title="title" width="30%" :visible.sync="dialogVisible" :close-on-click-modal="false" v-dialogDrag>
      <el-form :model="inputForm" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="method==='view'"
             label-width="100px">
      <el-row  :gutter="15">
        <el-col :span="24">
          <el-form-item label="类型名称" prop="name" :rules="[{required: true, message:'类型名称不能为空', trigger:'blur'}]">
            <el-input maxlength="15" v-model="inputForm.name" placeholder="请填写类型名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item  label="顺序" prop="sort" :rules="[{required: true, message:'顺序不能为空', trigger:'blur'}]">
            <el-input-number v-model="inputForm.sort" :step="1" controls-position="right" :min="0" label="顺序"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button v-if="method != 'view'" type="primary" @click="doSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        title:"",
        dialogVisible:false,
        loading:false,
        method:"",
        inputForm: {
          id:"",
          type:'1',
          name:"",
          sort:""
        }
      }
    },
    methods: {
      init(method,id) {
        this.method = method
        this.inputForm.id = id
        if(method == 'add') {
          this.title = '新增风险类型'
        }else if(method == 'edit') {
          this.title = '修改风险类型'
        }
        this.dialogVisible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields();
          if(method == 'edit') {
            // 修改
            this.loading = true
            this.$http({
              url:`/check/inspect/riskTree/queryById?id=${this.inputForm.id}`,
              method:"get",
            }).then(({data}) => {
              if(data && data.success) {
                this.inputForm = this.recover(this.inputForm, data.riskTree);
                this.loading = false;
              }
            })
          }
        })
      },
      doSubmit() {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url:"/check/inspect/riskTree/save",
              method:"post",
              data:this.inputForm
            }).then(({data}) => {
              if(data && data.success) {
                this.dialogVisible = false;
                this.$message.success(data.msg)
                this.$emit('refreshList')
              }
              this.loading = false
            })
          }
        })
      }
    },
  }
</script>