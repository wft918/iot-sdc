<template>
  <div>
    <basic-container>
      <el-row :gutter="15" style="margin-top: 20px">
        <el-col :span="18">
          <span>名称：</span>
          <el-input style="width:30%;margin-right:15px" v-model="searchName" clearable></el-input>
          <el-button type="primary" @click="queryInfoClick">
            <i class="el-icon-search"></i> 查询
          </el-button>
          <el-button type="primary" @click="clearCondition">
            <i class="el-icon-refresh"></i> 重置
          </el-button>
        </el-col>
        <el-col :span="23">
          <el-button type="primary" @click="addInfo" style="margin-top:20px;">
            <i class="el-icon-plus"></i> 新增
          </el-button>
        </el-col>
        <el-col :span="1" style="margin-top:20px;">
          <el-tooltip effect="dark" content="显隐" placement="top">
            <el-button circle="" @click="chooseColumn" size="small" icon="el-icon-menu"></el-button>
          </el-tooltip>
        </el-col>
        <el-col :span="24">
          <el-table :data="tableInfo" border style="margin: 0.75rem 0">
            <el-table-column
              type="index"
              label="序号"
              align="center"
              width="80"
              sortable
            ></el-table-column>
            <el-table-column
              v-if="columnList[0].show"
              prop="name"
              label="名称"
              align="center"
            >
              <template slot-scope="scope">
                <el-link :underline="false" type="primary" @click="mainPropClick(scope.row)">{{scope.row.name}}</el-link>
              </template>
            </el-table-column>
            <el-table-column
              v-if="columnList[1].show"
              prop="type"
              label="所属系统"
              align="center"
              :formatter="setSystem"
            ></el-table-column>
            <el-table-column
              v-if="columnList[2].show"
              label="图片"
              align="center"
            >
              <template slot-scope="scope">
                <img :src="scope.row.url" alt="" style="width:50px;height:50px;">
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="120">
              <template slot-scope="scope">
                <!-- <span class="table-action" @click="tableAction(scope.row, 2)"
                  >编辑</span
                >
                <span class="table-action" @click="tableAction(scope.row, 3)"
                  >查看</span
                > -->
                <span class="table-action" @click="tableAction(scope.row, 4)"
                  >删除</span
                >
              </template>
            </el-table-column>
          </el-table>
          <Pagination
            :page="page"
            :size="size"
            :total="total"
            :key="pageKey"
            @pagination="queryByPage"
          ></Pagination>
        </el-col>
      </el-row>
      <el-dialog
        :visible.sync="dialogFormVisible"
        width="35%"
        ref="emgDialog"
        :close-on-click-modal="false"
        @close="refreshData"
        :title="dialogTitle"
        v-dialogDrag
      >
        <el-form
          :model="inputForm"
          label-width="120px"
          :rules="rules"
          ref="topoForm"
          :key="dialogKey"
          :disabled="isdisabled"
        >
          <el-form-item label="名称" prop="name">
            <el-input style="width:80%" v-model="inputForm.name"></el-input>
          </el-form-item>
          <el-form-item label="所属系统" prop="type">
            <el-select v-model="inputForm.type" width="100%">
                  <el-option
                    v-for="item in this.$dictUtils.getDictList('sys_type')"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
          </el-form-item>
          <el-form-item label="导入设备图片">
            <el-upload
              class="avatar-uploader"
              action="/topo-sdc/sdc-topofile/upload"
              :headers="headers"
              :show-file-list="false"
              :on-success="handleDeviceAvatarSuccess"
              :key="devImgKey"
            >
              <img
                v-if="inputForm.url"
                :src="deviceImgURL"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <template v-if="actionType === 3">
            <el-button
              @click="dialogFormVisible = false"
              size="small"
              >关闭</el-button
            >
            <el-button v-if="btnType === 1" type="primary" @click="enableEdit" size="small"
            >编辑</el-button>
            <el-button v-if="btnType === 2" type="primary" @click="submitForm" size="small"
            >保存</el-button>
          </template>
          <template v-else>
            <el-button @click="dialogFormVisible = false" size="small"
              >取消</el-button
            >
            <el-button type="primary" @click="submitForm" size="small"
              >保存</el-button
            >
          </template>
        </span>
      </el-dialog>

      <el-dialog
        title="数据删除提醒"
        :visible.sync="dialogVisible"
        width="30%"
        :close-on-click-modal="false"
      >
        <span>是否确定删除当前数据！</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="deleteData">确 定</el-button>
          <el-button @click="dialogVisible = false"
            >取 消</el-button
          >
        </span>
      </el-dialog>
      <el-dialog
        :visible.sync="dialogColumnVisible"
        title="请选择要显示的列"
        :close-on-click-modal="false"
        width="35%"
        v-dialogDrag
      >
        <el-checkbox v-for="item in columnList" v-model="item.show" :key="item.prop">{{item.label}}</el-checkbox>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import store from "@/store";

import { getSdcTopoComponentTable,addSdcTopoComponent,sdcTopoComponentAction } from "../../../api/sdc/topoInfo";
import _ from "lodash"
export default {
  components: {
    Pagination
  },
  data() {
    return {
      tableInfo: [],
      searchName: '',
      queryCondition: {
        current: 1,
        size: 10
      },
      page: 1,
      size: 10,
      total: 0,
      pageKey: Math.random().toString(36).slice(-6),
      dialogKey: Math.random().toString(36).slice(-6),
      dialogFormVisible: false,
      isdisabled: true,
      dialogTitle: null,
      actionType: 1,
      inputForm: {
        name: null,
        type: null,
        url: null,
        
      },
      rules: {
        type: [
          { required: true, message: "请选择所属系统", trigger: "change" },
        ],
        name: [
          { required: true, message: "请输入组件名称", trigger: "blur" },
        ],
        // url: [{ required: true, message: "请上传图片", trigger: "change" }],
       
      },
      headers: {
        Authorization: "Bearer " + store.getters.access_token,
      },
      devImgKey: Math.random().toString(36).slice(-6),
      deviceImgURL: null,
      dialogVisible: false,
      delId: null,
      dialogColumnVisible: false,
      columnList: [
        {
          prop: 'name',
          label: '名称',
          show: true
        },
        {
          prop: 'type',
          label: '所属系统',
          show: true
        },
        {
          prop: 'image',
          label: '图片',
          show: true
        }
      ],
      btnType: 1
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.queryInfo()
    },
    addInfo() {
      this.actionType = 1
      this.dialogTitle = '新增设备图片'
      this.isdisabled = false
      this.dialogFormVisible = true
    },
    queryInfoClick() {
      this.setQueryCondition()
      this.queryCondition.current = 1
      this.queryInfo()
    },
    queryInfo() {
      getSdcTopoComponentTable(this.queryCondition).then(res => {
        console.log(res,'2222');
        if(res.data.code === 0) {
          this.tableInfo = res.data.data.records
          this.total = res.data.data.total
          this.page = res.data.data.current
        }
      })
    },
    setQueryCondition() {
      this.queryCondition = {
        current: this.page,
        size: this.size,
      };
      this.searchName ? this.queryCondition.name = this.searchName : ''
    },
    clearCondition() {
      this.searchName = ''
      this.queryCondition = {
        current: 1,
        size: this.size,
      }
      this.queryInfo()
    },
    mainPropClick(row) {
      this.btnType = 1
      this.inputForm = _.cloneDeep(row)
      this.deviceImgURL = row.url
      this.isdisabled = true
      this.actionType = 3
      this.dialogTitle = '查看'
      this.dialogFormVisible = true
    },
    enableEdit() {
      this.isdisabled = false
      this.btnType = 2
      this.dialogTitle = '编辑'
    },
    // 控制列显隐
    chooseColumn() {
      this.dialogColumnVisible = true
    },
    tableAction(row,flag) {
      if(flag === 2) {
        this.dialogTitle = '编辑'
        this.inputForm = _.cloneDeep(row)
        this.isdisabled = false
        this.deviceImgURL = row.url
        this.actionType = 2
        this.dialogFormVisible = true
      } else if (flag === 3) {
        this.dialogTitle = '查看'
        this.btnType = 1
        this.inputForm = _.cloneDeep(row)
        this.deviceImgURL = row.url
        this.isdisabled = true
        this.actionType = 3
        this.dialogFormVisible = true
      } else if (flag === 4) {
        this.delId = row.id
        this.actionType = 3
        this.dialogVisible = true
      }
    },
    queryByPage(data) {
      this.page = data.page
      this.size = data.size
      this.queryCondition.current = this.page
      this.queryCondition.size = this.size
      this.queryInfo()
    },
    refreshData() {
      this.inputForm = {
        name: null,
        type: null,
        url: null,
      }
      this.$refs.topoForm.resetFields()
    },
    handleDeviceAvatarSuccess(res,file) {
      console.log(res,file);
      this.deviceImgURL = URL.createObjectURL(file.raw)
      this.inputForm.url = res.data.url;
      this.devImgKey = new Date().toString()
    },
    setSystem(val) {
      let statusMap = this.$dictUtils.getDictList('sys_type')
      let text
      for (let index = 0; index < statusMap.length; index++) {
        const el = statusMap[index];
        if (el.value === val.type) {
          text = el.label
          break;
        }
      }
      return text
    },
    deleteData() {
      sdcTopoComponentAction('', "/"+this.delId, "delete").then((res) => {
        if(res.data.code === 0) {
          this.dialogVisible = false
          this.init()
        }
      })
    },
    submitForm() {
      this.$refs.topoForm.validate((valid) => {
        if (valid) {
          if(this.actionType === 1) {
            addSdcTopoComponent(this.inputForm).then((res) => {
              if (res.data.code === 0) {
                this.dialogFormVisible = false
                this.$message.success("新增成功")
                this.init()
              }
            })
          } else {
            sdcTopoComponentAction(this.inputForm, "", "put").then((res) => {
              if (res.data.code === 0) {
                this.dialogFormVisible = false
                this.$message.success("编辑成功")
                this.init()
              }
            })
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      
    }
  }
}
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
</style>