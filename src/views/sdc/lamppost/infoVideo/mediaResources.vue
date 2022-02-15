 <!--广播 媒体资源 -->
<template>
  <div >
    <basic-container>
      <div>
    <el-row :gutter="15">
        <el-col :span="7">
          <span>所属园区：</span>
          <el-cascader 
            ref="areaMsg"
            :options="condition" 
            style="width:80%" 
            v-model="address"
            :props="{ checkStrictly: true, value: 'id', label: 'name', children: 'children' }"
            clearable
            filterable
            @change="changeAddress"
          ></el-cascader>
        </el-col>
        <el-col :span="15">
          <el-button @click="queryInfoClick" type="primary">
            <el-tooltip class="item" effect="dark" content="搜索" placement="top">
              <i class="el-icon-search"></i>
            </el-tooltip>
          </el-button>

          <el-button type="primary" @click="clearCondition">
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <i class="el-icon-delete"></i>
            </el-tooltip>
          </el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="handleCreate">
            <i class="el-icon-plus"></i> 新增
          </el-button>
        </el-col>
      </el-row>

    <el-table
      :data="tableInfo"
      border
      highlight-current-row
      class="tableBorder"
    >
      <!-- <el-table-column type="selection" width="55" /> -->
      <el-table-column property="name" align="center" label="文件名称"  />
      <!-- <el-table-column property="media_size" align="center" label="文件大小" sortable /> -->
      <el-table-column label="播放时长" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.playDuration }} 秒</span>
        </template>
      </el-table-column>
      <el-table-column property="siteId" align="center" label="所属园区" :formatter="setSite" />
      <!-- <el-table-column label="操作">
        <template slot-scope="scope">
          <span class="table-action" @click="tableAction(scope.row, 2)">删除</span>
        </template>
      </el-table-column> -->
    </el-table>
    <Pagination :page="page" :size="size" :total="total" :key="pageKey" @pagination="queryByPage"></Pagination>

    <el-dialog
        title="数据删除提醒"
        :visible.sync="dialogVisible"
        width="30%"
        :close-on-click-modal="false"
      >
        <span>是否确定删除当前数据！</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteData">确 定</el-button>
          <el-button type="primary" @click="dialogVisible = false"
            >取 消</el-button
          >
        </span>
      </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      title="新增"
      :visible.sync="addDialog"
      class="fixed-el-dialog"
    >
      <el-form
        ref="mediaForm"
        status-icon
        :model="inputForm"
        label-width="150px"
        label-position="right"
        size="medium"
        :inline="true"
        class="demo-form-inline"
        style="text-align: center;"
        :rules="rules"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="文件名称" prop="name">
              <el-input v-model="inputForm.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属园区" prop="siteId">
              <el-cascader 
                ref="areaMsg"
                :options="condition" 
                style="width:80%" 
                v-model="siteName"
                :props="{ checkStrictly: true, value: 'id', label: 'name', children: 'children' }"
                clearable
                filterable
                @change="changeSite"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文件类型" prop="type">
              <el-select
                  v-model="inputForm.type"
                  disabled
                >
                  <el-option
                    v-for="item in this.$dictUtils.getDictList('media_type')"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="播放时长" prop="playDuration">
              <el-input v-model="inputForm.playDuration" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文件上传" prop="fileUrl">
              <el-upload
                ref="upload"
                class="upload-demo"
                :headers="headers"
                :multiple="false"
                :limit="1"
                action="/site-sdc/sdc-file/upload"
                :on-success="handleFileSuccess"
                :key="devImgKey"
                :file-list="fileList"
                :show-file-list="true"
              >
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <div slot="tip" class="el-upload__tip">只能上传mp3文件，且不超过20MB</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitForm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
    </basic-container>
  </div>
  
</template>
<style>
</style>
<script>
import {  getSdcLightFileTable,sdcLightFileAction } from "@/api/sdc/lpmanage";
import { sdcSiteAction } from "@/api/sdc/addressInfo";
import { modifyData } from "@/util/domainFilter";
import store from "@/store";

import Pagination from '@/components/Pagination'

export default {
  name: 'MediaResourceLed',
  components: { Pagination },
  data () {
    return {
      address: null,
      condition: [],
      page:1,
      size: 10,
      total: 0,
      pageKey: Math.random().toString(36).slice(-6),
      devImgKey: Math.random().toString(36).slice(-6),
      tableInfo: [],
      delId: null,
      dialogVisible: false,
      addDialog: false,
      inputForm: {
        siteId: null,
        deviceTypeCode: "light_broadcast",
        name: null,
        type: '1',
        playDuration: '0',
        fileUrl: null
      },
      siteName:null,
      headers: {
        Authorization: "Bearer " + store.getters.access_token,
      },
      rules: {
        siteId: [
          { required: true, message: "请选择所属园区", trigger: "blur" },
        ],
        name: [
          { required: true, message: "请输入文件名称", trigger: "blur" },
        ],
        type: [{ required: true, message: "请选择文件类型", trigger: "change" }],
        fileUrl: [{ required: true, message: "请选择上传文件", trigger: "change" }],
        playDuration: [{ required: true, message: "请输入播放时长", trigger: "change" }],
      },
      siteInfo: null,
      fileList: [],
      queryCondition: {
        current: 1,
        size: 10,
        deviceTypeCode:"light_broadcast"
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    async init() {
      //获取初始区域查询条件数据
      let data = await sdcSiteAction('','/tree','get')
      this.siteInfo = data.data.data
      console.log(this.siteInfo);
      this.condition = modifyData(data.data.data)
      this.queryInfo()
    },
    setQueryCondition() {
      this.queryCondition = {
        current:this.page,
        size: this.size,
        deviceTypeCode:"light_broadcast"
      }
      console.log(this.address,'this.address');
      this.address
      ? this.queryCondition.siteId = this.address[this.address.length - 1]
      : null
    },
    queryInfoClick() {
      this.setQueryCondition()
      this.queryCondition.current = 1
      this.queryInfo()
    },
    async queryInfo() {
      let tableData = await getSdcLightFileTable(this.queryCondition)
      console.log(tableData,'tableData');
      this.tableInfo = tableData.data.data.records
      this.setpage(tableData.data.data);
    },
    clearCondition() {
      this.address = []
      this.changeAddress()
    },
    setpage(data) {
      this.page = data.current;
      this.size = data.size;
      this.total = data.total;
      this.pageKey = (new Date()).toString() + 1
    },
    async tableAction(data, type) {
      this.dialogVisible = true;
      this.delId = data.id;
    },
    //删除数据
    deleteData() {
      // this.dialogVisible = false;
      // sdcDeviceAction("", "/" + this.delId, "delete").then((res) => {
      //   this.queryId = "";
      //   this.init();
      // });
    },
    changeSite(val) {
      if(val.length !== 0) {
        this.inputForm.siteId = val[val.length - 1];
      }
    },
    submitForm() {
      this.$refs.mediaForm.validate((valid) => {
        if (valid) {
          // if(this.inputForm.actionType === 1) {
            // this.inputForm.createDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            sdcLightFileAction(this.inputForm, "post").then(() => {
              this.addDialog = false
              this.init()
            })
          // } else {
          //   // this.inputForm.updateDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
          //   sdcLightTaskAction(this.inputForm, "put").then(() => {
          //     this.dialogFormVisible = false
          //     this.init()
          //   })
          // }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    setSite(val) {
      let text 
      const getParent = (array,id) => {
        let parentData
        const findData = (array,id) => {
          for (let index = 0; index < array.length; index++) {
            const element = array[index];
            if(element.id === id) {
              parentData = element
            }else {
              if(element.children) {
                findData(element.children,id)
              }
            }
          }
        }
        findData(array,id)
        if(parentData.parentId && parentData.parentId !== '') {
          getParent(array,parentData.parentId)
        }else {
          text = parentData.name
        }
      }
      getParent(this.siteInfo,val.siteId)
      return text
    },
    async changeAddress() {
      
      
    },
    async queryByPage(data) {
      this.page = data.page
      this.size = data.size
      this.queryCondition.current = this.page
      this.queryCondition.size = this.size
      this.queryInfo()
    },
    
    handleFileSuccess (res,file,fileList) {
      this.fileList = fileList
      this.$notify({
          title: '成功',
          message: '上传成功',
          type: 'success',
          duration: 5000
        })
      // this.deviceImgURL = URL.createObjectURL(file.raw)
      // this.fileList = this.fileList.splice(-3)
      this.inputForm.fileUrl = res.data.url;
      this.devImgKey = new Date().toString()
    },
    handleCreate () {
      this.addDialog = true
      this.$nextTick(() => {
        this.$refs['mediaForm'].clearValidate()
      })
    },
    
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
</style>
