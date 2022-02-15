<template>
  <div style="margin-top:20px">
    <el-form
      :model="inputForm"
      label-width="100px"
      :rules="rules"
      ref="devTypeForm"
      :disabled="formDisabled"
    >
      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item label="类型编号" prop="code">
            <el-input v-model="inputForm.code" :disabled="isDisable"></el-input>
          </el-form-item>
          <el-form-item label="类型名称" prop="name" >
            <el-input v-model="inputForm.name" :disabled="isDisable"></el-input>
          </el-form-item>
          <el-form-item
            label="上级类型"
            prop="parentName"
            v-if="inputForm.parentId !== null "
          >
            <el-cascader 
              :options="parentTypeData" 
              style="width:80%" 
              v-model="inputForm.parentId"
              :props="{ checkStrictly: true, value: 'id', label: 'name', children: 'children' }"
              clearable
              filterable 
              @change="changepType"
              :disabled="inputForm.isFormDisabled"
            ></el-cascader>
            <!-- <el-input v-model="inputForm.parentName"></el-input> -->
          </el-form-item>
          <el-form-item label="所属系统" prop="type" > 
            <el-select v-model="inputForm.type" @change="changeSys" :disabled="isSysDisabled">
              <el-option
                v-for="(item,index) in sysList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input v-model="inputForm.sort" type="number" style="texte-align: center" >
            </el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入内容"
              v-model="inputForm.remarks"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="设备图片">
            <el-upload
              class="avatar-uploader"
              action="/site-sdc/sdc-file/upload"
              :headers="headers"
              :show-file-list="false"
              :on-success="handleDeviceAvatarSuccess"
              :key="devImgKey"
            >
              <img
                v-if="inputForm.deviceImg"
                :src="deviceImgURL"
                class="avatar"
                
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态图片">
            <el-upload
              class="avatar-uploader avatar-inline"
              action="/site-sdc/sdc-file/upload"
              :headers="headers"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :on-success="handleNormolAvatarSuccess"
              :key="abnormalImgKey"
            >
              <img
                v-if="inputForm.normalImg"
                :src="normalImgURL"
                class="avatar"
                
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <span style="display: block;">正常图片</span>
            </el-upload>
            <el-upload
              class="avatar-uploader avatar-inline"
              action="/site-sdc/sdc-file/upload"
              :headers="headers"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :on-success="handleAlarmAvatarSuccess"
              :key="normalImgKey"
            >
              <img
                v-if="inputForm.abnormalImg"
                :src="abnormalImgURL"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <span style="display: block;">报警图片</span>
            </el-upload>
            <el-row>
              <span class="img-tip">*状态图片仅支持png格式</span>
            </el-row>           
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import store from "@/store";
import { getStore } from "@/util/store";
import {
  getSdcDeviceTypeTable,
  addSdcDeviceType,
  sdcDeviceTypeAction,
} from "@/api/sdc/deviceType";

export default {
  props: ["dialogData",'sysTypeMap','parentTypeData', 'formDisabled'],
  data() {
    return {
      isDisable: false,
      isSysDisabled: false,
      devImgKey: Math.random().toString(36).slice(-6),
      abnormalImgKey: Math.random().toString(36).slice(-6),
      normalImgKey: Math.random().toString(36).slice(-6),
      deviceImgURL: null,
      abnormalImgURL: null,
      normalImgURL: null,
      sysList: null,
      headers: {
        Authorization: "Bearer " + store.getters.access_token,
      },
      inputForm: {
        id: null,
        code: null,
        name: null,
        parentId: null,
        parentName: null,
        deviceType: null,
        sort: 1,
        remarks: null,
        deviceImg: null,
        abnormalImg: null,
        normalImg: null,
        type: null,
        metadata: {
          id:'',
          name: '',
          properties: []
        }
      },
      rules: {
        code: [
          { required: true, message: "请输入设备类型编号", trigger: "blur" },
        ],
        name: [
          { required: true, message: "请输入设备类型名称", trigger: "blur" },
        ],
        parentName: [
          { required: true, message: "请输入上级类型", trigger: "blur" },
        ],
        sort: [{ required: true, message: "请输入序号", trigger: "blur" }],
        type: [
          { required: true, message: "请输入所属系统", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.initDialog();
  },
  methods: {
    initDialog() {
      this.$nextTick(() => {
        this.sysList = this.sysTypeMap
        this.inputForm = this.dialogData;
        if(this.dialogData.actionType !== 1) {
          this.isDisable = true
          this.isSysDisabled = true
        }else {
          this.isSysDisabled = false
          this.isDisable = false
          this.inputForm.actionType = 1
        }
        if(this.inputForm.metadata === undefined) {
          this.inputForm.metadata = JSON.stringify({
            id:'',
            name: '',
            properties: []
          })
        }
        this.deviceImgURL = this.inputForm.deviceImg
        this.normalImgURL = this.inputForm.normalImg
        this.abnormalImgURL = this.inputForm.abnormalImg
      })
      
    },
    verifyParam(){
      this.$refs.devTypeForm.validate((valid) => {
        this.$emit('deviceTypeValid',valid)
      })
    },
    submitData() {
      this.$refs.devTypeForm.validate((valid) => {
        if (valid) {
          // this.inputForm.tenantId = getStore({ name: "tenantId" });
          if(this.inputForm.metadata === undefined) {
            this.inputForm.metadata =  JSON.stringify({
              id:'',
              name: '',
              properties: []
            })
          }
          if(this.inputForm.parentId === 0) {
            this.inputForm.parentId = null
          }
          
          this.inputForm.actionType === 1
            ? sdcDeviceTypeAction(this.inputForm, "", "post").then((res) => {
              if (res.data.code === 0) {
                this.closeDialog()
                this.$message.success('添加成功')
                this.$emit('refreshAfterAction')
              } else {
                this.$message.error('添加出错，请重试')
              }             
            })
            : sdcDeviceTypeAction(this.inputForm, "", "put").then((res) => {
              if (res.data.code === 0) {
                this.closeDialog()
                this.$message.success('编辑成功')
                this.$emit('refreshAfterAction')
              } else {
                this.$message.error('编辑出错，请重试')
              }
              
            })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    beforeAvatarUpload(file) {
      const isPNG = file.type === 'image/png';
      if (!isPNG) {
        this.$message.error('上传图片只能是 PNG 格式!');
        return isPNG
      }
    },
    handleDeviceAvatarSuccess(res,file) {
      this.deviceImgURL = URL.createObjectURL(file.raw)
      this.inputForm.deviceImg = res.data.url;
      this.devImgKey = (new Date()).toString()
    },
    handleAlarmAvatarSuccess(res,file) {
      this.abnormalImgURL = URL.createObjectURL(file.raw)
      this.inputForm.abnormalImg = res.data.url;
      this.abnormalImgKey = (new Date()).toString()
    },
    handleNormolAvatarSuccess(res,file) {
      this.normalImgURL = URL.createObjectURL(file.raw)
      this.inputForm.normalImg = res.data.url;
      this.normalImgKey = (new Date()).toString()
    },
    closeDialog(){
      this.isDisable = false
      this.$emit('closeDialog')
    },
    changeSys(val,label){
      // this.inputForm.system = val
    },
    getInputData() {
      return this.inputForm
    },
    changepType(val) {
      this.inputForm.parentId = val[val.length - 1]
    }
  },
};
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px !important;
  height: 100px !important;
  line-height: 100px !important;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
.avatar-inline {
  display: inline;
  margin-right: 15px;
}
.img-tip {
  color: red;
  font-size: 12px;
  margin-top: 5px
}
</style>
