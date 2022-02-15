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
        <el-col :span="12" v-show="method === 'add'?false:true">
            <el-form-item label="物资编号" prop="goodsNo"
                :rules="[
                 ]">
              <el-input v-model="inputForm.goodsNo"   :disabled="true"  ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="物资名称" prop="goodsName"
                :rules="[
                    {required: true, message:'物资名称不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.goodsName" placeholder="请填写物资名称"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="物资类型" prop="goodType"
                :rules="[
                    {required: true, message:'物资类型不能为空', trigger:'blur'}
                 ]">
              <el-select v-model="inputForm.goodType" placeholder="请选择"  style="width: 100%;">
                        <el-option
                          v-for="item in goodTypeList"
                          :key="item.id"
                          :label="item.typeName"
                          :value="item.id">
                        </el-option>
              </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="12" >
          <el-form-item label="所处位置" prop="areaId">
            <el-cascader
              ref="siteChoose"
              :options="siteData"
              style="width: 100%"
              v-model="inputForm.areaId"
              clearable
              filterable
              @change="changeAddress"
              :props="{ value: 'id', label: 'name', children: 'children' }"
            >
            </el-cascader>
           </el-form-item>
        </el-col>
         <!-- <el-col :span="12" v-show="method === 'view'?true:false">
            <el-form-item label="X坐标" prop="coordinateX"
                :rules="[
                 ]">
              <el-input v-model="inputForm.coordinateX"  ></el-input>
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
import { modifyData } from "@/util/domainFilter";
import { sdcSiteAction } from "@/api/sdc/addressInfo";
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        goodTypeList: [],
        siteData: [],
        inputForm: {
          id: '',
          goodsNo: '',
          goodsName: '',
          goodType: '',
          areaId: '',
          coordinateX: '',
          coordinateY: '',
          coordinateZ: '',
          remarks: ''
        }
      }
    },
    components: {
    },
    created() {  
      this.getSiteData();
    },
    methods: {
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        this.$http({
              url: `/uwb/ips/uwbgoodstype/uwbGoodsType/list?pageSize=10000`,
              method: 'get'
            }).then(({data}) => {
              this.goodTypeList = data.page.list
            })
        if (method === 'add') {
          this.title = `新建物资信息`
        } else if (method === 'edit') {
          this.title = '修改物资信息'
        } else if (method === 'view') {
          this.title = '查看物资信息'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/uwb/ips/uwbgoods/uwbGoods/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.uwbGoods)
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
              url: `/uwb/ips/uwbgoods/uwbGoods/save`,
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
    async getSiteData() {
      let data = await sdcSiteAction("", "/tree", "get");
      this.siteData = modifyData(data.data.data);
    },
    changeAddress(val) {
      this.inputForm.areaId = val[val.length - 1];
    },
    }
  }
</script>