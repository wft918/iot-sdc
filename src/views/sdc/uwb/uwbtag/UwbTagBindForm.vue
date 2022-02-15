<template>
<div>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
     v-dialogDrag
    :visible.sync="visible" width="450px">
    <el-form :model="inputForm" ref="inputForm" v-loading="loading" 
             label-width="120px">
      <el-row align="middle">
        <el-col>
            <el-form-item label="设备序列号" prop="tagSerial"
                :rules="[
                    {required: true, message:'设备序列号不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.tagSerial" placeholder="请填写设备序列号" style="width:250px"   :disabled=true ></el-input>
           </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="人员/设备" prop="bindType"
                :rules="[
                    {required: true, message:'请选择', trigger:'blur'}
                 ]">
            <el-radio-group v-model="inputForm.bindType">
              <el-radio label="0">人员</el-radio>
              <el-radio label="1">物资</el-radio>
              <el-radio label="2">访客</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="inputForm.bindType === '0'?true:false">
            <el-form-item label="人员" prop="userId"
                :rules="[
                  {required: true, message:'请选择', trigger:'blur'}
                 ]">
            <user-select :limit='1' :value="inputForm.userId" @getValue='(value) => {inputForm.userId=value}'></user-select>
          <!-- <GridSelect style="width:250px" 
            title="选择人员"
            labelName = 'name'
            labelValue = 'id'
            :value = "inputForm.userId"
            :limit="1"
            @getValue='(value) => {inputForm.userId=value}'
            :columns="[
            {
              prop: 'username',
              label: '用户名'
            },
            {
              prop: 'deptName',
              label: '归属公司'
            },
            {
              prop: 'phone',
              label: '联系方式'
            }
            ]"
            :searchs="[
            {
              prop: 'username',
              label: '姓名'
            }
            ]"
            dataListUrl="/admin/user/page"
            entityBeanName="user"
            queryEntityUrl="/admin/user/+${inputForm.userId}">
          </GridSelect> -->
           </el-form-item>
        </el-col>
        <el-col v-if="inputForm.bindType === '1'?true:false">
            <el-form-item label="物资" prop="goodsId"
                :rules="[
                  {required: true, message:'请选择', trigger:'blur'}
                 ]">
          <GridSelect style="width:250px"
            title="选择物资"
            labelName = 'goodsName'
            labelValue = 'id'
            :value = "inputForm.goodsId"
            :limit="1"
            @getValue='(value) => {inputForm.goodsId=value}'
            :columns="[
            {
              prop: 'goodsNo',
              label: '物资编号'
            },
            {
              prop: 'goodsName',
              label: '物资名称'
            },
            {
              prop: 'typeName',
              label: '物资类型'
            }
            ]"
            :searchs="[
            {
              prop: 'goodsName',
              label: '物资名称'
            }
            ]"
            dataListUrl="/uwb/ips/uwbgoods/uwbGoods/list"
            entityBeanName="uwbGoods"
            queryEntityUrl="/uwb/ips/uwbgoods/uwbGoods/queryById">
          </GridSelect>
           </el-form-item>
        </el-col>
        <el-col v-if="inputForm.bindType === '2'?true:false">
            <el-form-item label="访客名称" prop="bindTmpname"
                :rules="[
                    {required: true, message:'访客名称不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.bindTmpname" placeholder="请填写访客名称" style="width:250px" ></el-input>
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
  import GridSelect from '@/components/gridSelect'
  import UserSelect from "@/components/userSelect";
  export default {
    data () {
      return {
        title: '标签绑定',
        method: '',
        visible: false,
        loading: false,
        inputForm: {
          id: '',
          tagSerial: '',
          bindType: '0',
          inOrOut: '0',
          bindId: '',
          userId: '',
          goodsId: '',
          bindTmpname: ''
        }
      }
    },
    components: {
      GridSelect,
      UserSelect
    },
    methods: {
      init (id) {
        this.inputForm.id = id
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          //if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/uwb/ips/uwbtag/uwbTag/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm.id = data.uwbTag.id;
              this.inputForm.tagSerial = data.uwbTag.tagSerial;
              this.inputForm.bindType = data.uwbTag.bindType;
              if(this.inputForm.bindType === '0'){
                this.inputForm.userId = this.inputForm.bindId
              }else if (this.inputForm.bindType === '1'){
                this.inputForm.goodsId = this.inputForm.bindId
              }else if (this.inputForm.bindType === '2'){
                  this.inputForm.bindTmpname = data.uwbTag.bindName;
              }else{
                   this.inputForm.bindType = '0';
              }
              this.loading = false
            })
         // }
        })
      },
      // 表单提交
      doSubmit () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            if(this.inputForm.bindType === '0'){
              this.inputForm.bindId = this.inputForm.userId
            }else if (this.inputForm.bindType === '1'){
              this.inputForm.bindId = this.inputForm.goodsId
            }else if (this.inputForm.bindType === '2'){
                this.inputForm.bindId = ''
            }
            this.$http({
              url: `/uwb/ips/uwbtag/uwbTag/insertTagBindInfo`,
              method: 'post',
              params: {
                'bindId': this.inputForm.bindId,
                'bindType': this.inputForm.bindType,
                'tagId': this.inputForm.id,
                'bindTmpname': this.inputForm.bindTmpname
              }
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