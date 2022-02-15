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
        <!-- <el-col :span="12">
            <el-form-item label="租户id" prop="tenantId"
                :rules="[
                 ]">
              <el-input v-model="inputForm.tenantId" placeholder="请填写租户id"     ></el-input>
           </el-form-item>
        </el-col> -->
        <el-col :span="12">
            <el-form-item label="防区编号" prop="sectorNo"
                :rules="[
                    {required: true, message:'防区编号不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.sectorNo" placeholder="请填写防区编号"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="防区名称" prop="sectorName"
                :rules="[
                    {required: true, message:'防区名称不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.sectorName" placeholder="请填写防区名称"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="所属区域" prop="areaId"
                :rules="[
                    {required: true, message:'所属区域不能为空', trigger:'blur'}
                 ]">
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
                :disabled=ifAdd
                @getValue="changeArea"/>
                <!-- (value) => {inputForm.areaId=value} -->
              <!-- <el-select :disabled=ifAdd  v-model="inputForm.areaId" placeholder="请填写所属区域"  style="width: 100%;" @change="changeArea">
                        <el-option
                          v-for="item in areaList"
                          :key="item.id"
                          :label="item.areaName"
                          :value="item.id">
                        </el-option>
                </el-select> -->
           </el-form-item>    
        </el-col>
        <!-- <el-col :span="12">
            <el-form-item label="实际X坐标集合" prop="coordinateXlist"
                :rules="[
                 ]">
              <el-input v-model="inputForm.coordinateXlist" placeholder="请填写实际X坐标集合"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="实际Y坐标集合" prop="coordinateYlist"
                :rules="[
                 ]">
              <el-input v-model="inputForm.coordinateYlist" placeholder="请填写实际Y坐标集合"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="实际Z坐标集合" prop="coordinateZlist"
                :rules="[
                 ]">
              <el-input v-model="inputForm.coordinateZlist" placeholder="请填写实际Z坐标集合"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="几何坐标集合" prop="polygonShowPoints"
                :rules="[
                 ]">
              <el-input v-model="inputForm.polygonShowPoints" placeholder="请填写几何坐标几何"     ></el-input>
           </el-form-item>
        </el-col> -->
        <el-col :span="12">
            <el-form-item label="摄像头" prop="ipcId"
                :rules="[
                    {required: true, message:'摄像头不能为空', trigger:'blur'}
                 ]">
                <el-select v-model="inputForm.ipcId" placeholder="请选择摄像头"  style="width: 100%;" @change="changeIpc">
                          <el-option
                            v-for="item in ipcList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                          </el-option>
                      </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="预置位" prop="preset"
                :rules="[
                    {required: true, message:'预置位不能为空', trigger:'blur'}
                 ]">
                <el-select v-model="inputForm.preset" placeholder="请选择预置位"  style="width: 100%;">
                          <el-option
                            v-for="item in 255"
                            :key="item"
                            :label="'预置点'+item"
                            :value="item">
                          </el-option>
                      </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="启用状态" prop="enableStatus"
                :rules="[
                    {required: true, message:'启动状态不能为空', trigger:'blur'}
                 ]">
                <el-select v-model="inputForm.enableStatus" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in $dictUtils.getDictList('isopen')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
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
  import SelectTree from '@/components/treeSelect/treeSelect.vue'
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        // areaList: [],
        ipcList: [],
        presetList: [],
        inputForm: {
          id: '',
          tenantId: '',
          sectorNo: '',
          sectorName: '',
          areaId: '',
          coordinateXlist: '',
          coordinateYlist: '',
          coordinateZlist: '',
          polygonShowPoints: '',
          ipcId: '',
          preset: '',
          enableStatus: '',
          remarks: ''
        },
        roofPoints:[],
        ifAdd:false
      }
    },
    components: {
      SelectTree
    },
    methods: {
      initData(mapId,xList,yList,roofPoints){
        this.roofPoints = roofPoints
        this.inputForm.coordinateXlist = xList
        this.inputForm.coordinateYlist = yList
        this.inputForm.areaId = mapId
        this.visible = true
        this.ifAdd = true
        //this.initDefaultData()
        this.title = `新建防区配置`
        this.$http({
          url: '/site-sdc/sdcdevice/page',
          method: 'get',
          params: {
            'pageNo': 1,
            'pageSize': 50000,
            'orderBy': '',
            'siteId':mapId,
            'videoType': '1'
          }
        }).then(({ data }) => {
          if (data && data.code == 0) {
            this.ipcList = data.data.records
          }
        });
      },
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建防区配置`
        } else if (method === 'edit') {
          this.title = '修改防区配置'
        } else if (method === 'view') {
          this.title = '查看防区配置'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.ifAdd = false
            this.loading = true
            this.$http({
              url: `/uwb/ips/uwbcamerasector/uwbCameraSector/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.uwbCameraSector)
              this.$http({
                url: '/site-sdc/sdcdevice/page',
                method: 'get',
                params: {
                  'pageNo': 1,
                  'pageSize': 50000,
                  'orderBy': '',
                  'siteId':this.inputForm.areaId,
                  'videoType': '1'
                }
              }).then(({ data }) => {
                if (data && data.code == 0) {
                  this.ipcList = data.data.records
                }
              });
              this.loading = false
            })
          }
        })
      },  
      //改变区域
      changeArea(val) {
       this.inputForm.areaId=val
      //  this.inputForm.areaId = val[val.length - 1];
      //  this.inputForm.areaId = val
       this.inputForm.ipcId = ''
       this.inputForm.preset = ''
      //  this
        this.ipcList = ''
        //获取该区域下摄像头列表
        this.$http({
          url: `/site-sdc/sdcdevice/page`,
          method: "get",
          params: {
            'pageNo': 1,
            'pageSize': 50000,
            'orderBy': '',
            'siteId':val,
            'videoType': '1'
          }
        }).then(({ data }) => {
          if (data && data.code == 0) {
            this.ipcList = data.data.records
          }
        });
      },
      //改变摄像头
      changeIpc(val) {
        this.inputForm.ipcId = val
        this.inputForm.preset = ''
      },
      // 表单提交
      doSubmit () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: `/uwb/ips/uwbcamerasector/uwbCameraSector/save`,
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