<template>
  <div>
    <basic-container>
      <el-row :gutter="15">
        <el-col :span="5" class="tree-container">
          <el-card shadow="never" class="tree-card">
            <!-- <el-input placeholder="输入关键字进行过滤" v-model="filterText">
            </el-input> -->
            <el-tree
              class="filter-tree"
              ref="brandTree"
              :data="condition"
              node-key="id"
              :indent="2"
              accordion
              :default-expanded-keys="expandKey"
              :expand-on-click-node="false"
              :props="defaultProps"
              :filter-node-method="filterNode"
              @node-click="querySiteInfo"
            >
              <div slot-scope="{ node }" class="node-container">
                <span>{{ node.label }}</span>
                <!-- <el-tooltip class="item" effect="dark" :content="node.label" placement="top">
                  <span>{{ node.label | ellipsis(6) }}</span>
                </el-tooltip>  -->
              <!-- <div
                  class="node-style"                 
                  @click="addBrand(node, data)"
                  v-if="data.type === '1' || data.id === 0"
                >
                  <i class="el-icon-circle-plus-outline"></i>
                </div>
                <div v-if="data.id !== 0" class="node-style" @click="editBrand(node, data)">
                  <i class="el-icon-edit-outline"></i>
                </div>
                <div v-if="data.id !== 0" class="node-style" @click="deleteBrand(data)">
                  <i class="el-icon-delete"></i>
                </div> -->
              </div>
            </el-tree>
          </el-card>
        </el-col>
        <el-col :span="19">
          <el-row :gutter="15" v-if="isAllBrand">
            <el-col :span="9">
              <span>名称：</span>
              <el-cascader
                ref="brandType"
                :options="brandCondition"
                style="width: 75%"
                v-model="brandType"
                :props="{
                  checkStrictly: true,
                  value: 'id',
                  label: 'name',
                  children: 'children',
                }"
                clearable
                filterable
              ></el-cascader>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" size="small" @click="queryBrandClick">
                <i class="el-icon-search"></i>
                查询
              </el-button>
              <el-button type="primary" size="small" @click="clearCondition">
                <i class="el-icon-delete"></i>
                清空
              </el-button>
            </el-col>
          </el-row>
          <el-row style="margin-top:15px;" v-if="isAllBrand">
            <el-col>
              <el-button type="primary" size="small" @click="addNewBrand">
                <i class="el-icon-plus"></i>
                新增品牌
              </el-button>
              <label class="import-btn" for="importDevcie">导入</label>
              <input type="file" ref="importDevcie" id="importDevcie" @change="deviceTypeImport($event)" style="display:none;" accept=".xls,.xlsx"/>
              <el-button type="primary" size="small" @click="deviceTypeExport">导出</el-button>
              <el-link icon="el-icon-download" type="primary" href="/admin/sys-file/planplat/template_sdc_device_model.xlsx" :underline="false" style="margin-left: 10px">
              下载导入模板
              </el-link>
              <div class="device-btnGroup">
                <el-button-group>
                  <el-tooltip effect="dark" content="显隐" placement="top">
                    <el-button circle="" @click="chooseColumn" size="small" icon="el-icon-menu"></el-button>
                  </el-tooltip>
                </el-button-group>
              </div>
            </el-col>
          </el-row>
          <el-row v-if="!isAllBrand">
              <el-col :span="12">
                <el-descriptions title="类型信息" style="font-size:16px;" :column="2" border>
                  <el-descriptions-item label="名称">{{selectNodeInfo.name}}</el-descriptions-item>
                  <el-descriptions-item label="类型">{{selectNodeInfo.typeName}}</el-descriptions-item>
              </el-descriptions>
              </el-col>
            </el-row>
          <el-row v-if="!isAllBrand">
            <el-col :span="6" style="font-size:16px;margin-top:12px;font-weight:700;">
                <div>子级列表</div>
              </el-col>
              <el-col :span="1" style="float:right;">
                <el-tooltip effect="dark" content="显隐" placement="top">
                  <el-button circle="" @click="chooseColumn" size="small" icon="el-icon-menu"></el-button>
                </el-tooltip>
              </el-col>
          </el-row>
          <div>
            <!-- <el-table
                  :data="brandData"
                  style="width: 100%;margin: 20px 0;"
                  row-key="code"
                  border
                  default-expand-all
                  :tree-props="{children: 'children', hasChildren: 'hasChildren'}"> -->
            <el-table
              :data="brandData"
              style="width: 100%; margin: 10px 0"
              border
              :key="brandKey"
            >
              <el-table-column type="index" label="序号" width="80" align="center">
              </el-table-column>
              <el-table-column v-if="columnList[0].show" prop="name" label="名称" sortable header-align="center">
                <template slot-scope="scope">
                  <el-link :underline="false" type="primary" @click="mainPropClick(scope.row)">{{scope.row.name}}</el-link>
                </template>
              </el-table-column>
              <!-- <el-table-column
                    prop="code"
                    label="编号"
                    sortable
                    width="180">
                  </el-table-column> -->
              <el-table-column
              v-if="columnList[1].show"
                prop="type"
                label="类型"
                :formatter="typeTranslate"
                header-align="center"
              >
              </el-table-column>
              <!-- <el-table-column prop="remarks" label="备注信息">
              </el-table-column> -->
              <el-table-column label="操作" align="center" width="160">
                <template slot-scope="scope">
                  <!-- <span class="table-action" @click="brandAction(scope.row, 3)"
                    >查看</span
                  >
                  <span class="table-action" @click="brandAction(scope.row, 2)"
                    >编辑</span
                  > -->
                  <span class="table-action" @click="brandAction(scope.row, 4)"
                    >删除</span
                  >
                  <span
                    class="table-action"
                    @click="brandAction(scope.row, 1)"
                    v-if="scope.row.type !== '2'"
                    >添加</span
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
          </div>
        </el-col>
      </el-row>
      <el-dialog
        :visible.sync="dialogFormVisible"
        width="60%"
        ref="emgDialog"
        :key="dialogKey"
        :close-on-click-modal="false"
        :title="dialogTitle"
        v-dialogDrag
      >
        <el-form
          :model="inputForm"
          label-width="100px"
          :rules="rules"
          ref="brandForm"
          :disabled="isdisabled"
          :key="dialogKey"
        >
          <el-row :gutter="15">
            <el-col :span="12">
              <el-form-item label="编号" prop="code">
                <el-input
                  v-model="inputForm.code"
                  :disabled="isFormDisabled"
                ></el-input>
              </el-form-item>
              <el-form-item label="名称" prop="name">
                <el-input
                  v-model="inputForm.name"
                  :disabled="isFormDisabled"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="上级类型"
                prop="parentName"
                v-if="inputForm.parentName !== null"
              >
                <el-input
                  v-model="inputForm.parentName"
                  :disabled="isFormDisabled"
                ></el-input>
              </el-form-item>
              <el-form-item label="类型" prop="type">
                <el-select v-model="inputForm.type" width="100%" disabled>
                  <el-option
                    v-for="item in brandTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="排序" prop="sort">
                <el-input
                  v-model="inputForm.sort"
                  style="texte-align: center"
                  type="number"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="备注" prop="remarks">
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
                  <span style="display: block">正常图片</span>
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
                  <span style="display: block">报警图片</span>
                </el-upload>
                <el-row>
                  <span class="img-tip">*状态图片仅支持png格式</span>
                </el-row>     
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <template v-if="inputForm.actionType === 3">
            <el-button @click="closeDialog" size="small"
            >关闭</el-button>
            <el-button v-if="btnType === 1" type="primary" @click="enableEdit" size="small"
            >编辑</el-button>
            <el-button v-if="btnType === 2" type="primary" @click="submitForm" size="small"
            >保存</el-button>
          </template>
          <template v-else>
            <el-button @click="closeDialog" size="small">取消</el-button>
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
        <span>是否确定删除当前数据！！！！</span>
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
      <!-- <brand :dialogData="dialogData"></brand> -->
    </basic-container>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import {
  sdcDeviceModeAction,
  getSdcDeviceModeTable,
  sdcBrandImport,
  sdcBrandExport
} from "@/api/sdc/brandInfo";
import store from "@/store";
import { getStore } from "@/util/store";
import { brandTypeMap, modifyData } from "@/util/domainFilter";
import { getFilterFlag } from "@/util/getFilterFlag";

export default {
  components: {
    Pagination,
  },
  data() {
    return {
      page: 1,
      size: 10,
      total: 0,
      pageKey: Math.random().toString(36).slice(-6),
      dialogTitle: "",
      devImgKey: Math.random().toString(36).slice(-6),
      abnormalImgKey: Math.random().toString(36).slice(-6),
      normalImgKey: Math.random().toString(36).slice(-6),
      deviceImgURL: null,
      abnormalImgURL: null,
      normalImgURL: null,
      nodeData: null,
      brandTypeList: brandTypeMap,
      queryId: null,
      dialogFormVisible: false,
      dialogVisible: false,
      delId: null,
      brandKey: Math.random().toString(36).slice(-6),
      dialogKey: Math.random().toString(36).slice(-6),
      imgKey: Math.random().toString(36).slice(-6),
      isdisabled: false,
      isFormDisabled: false,
      headers: {
        Authorization: "Bearer " + store.getters.access_token,
      },
      dialogData: {
        actionType: null,
        editId: null,
        parentBrand: null,
      },
      defaultProps: {
        children: "children",
        label: "name",
      },
      checkedKey: ["park01"],
      condition: [
        {
          code: "0",
          id: 0,
          name: "全部",
          parentId: "",
          remarks: "postman添加",
          sort: 30,
          type: "",
          children: [],
        },
      ],
      brandData: [],
      inputForm: {
        code: null,
        name: null,
        parentBrand: null,
        type: null,
        sort: 1,
        remarks: null,
        deviceImg: null,
        abnormalImg: null,
        normalImg: null,
        parentName: null,
        parentId: null,
      },
      rules: {
        code: [
          { required: true, message: "请输入设备类型编号", trigger: "blur" },
        ],
        name: [
          { required: true, message: "请输入设备类型名称", trigger: "blur" },
        ],
        type: [{ required: true, message: "请输入上级类型", trigger: "blur" }],
        sort: [{ required: true, message: "请输入序号", trigger: "blur" }],
      },
      filterText: "",
      brandType: [],
      brandCondition: null,
      queryCondition: {},
      btnType: 1,
      dialogColumnVisible: false,
      columnList: [
        {
          prop: 'name',
          label: '名称',
          show: true
        },
        {
          prop: 'type',
          label: '类型',
          show: true
        }
      ],
      expandKey: [0],
      isAllBrand: true,
      selectNodeInfo: {}
    };
  },
  watch: {
    filterText(val) {
      this.$refs.brandTree.filter(val);
    },
  },
  created() {
    this.init();
  },
  methods: {
    //初始化获取数据
    async init() {
      this.condition[0].children = [];
      this.brandData = [];
      let data = await sdcDeviceModeAction("", "/tree", "get");
      this.condition[0].children = data.data.data;
      this.brandCondition = modifyData(data.data.data);
      this.queryBrand();
    },
    addNewBrand() {
      this.inputForm = {
        code: null,
        name: null,
        parentBrand: null,
        type: "1",
        sort: 1,
        remarks: null,
        deviceImg: null,
        abnormalImg: null,
        normalImg: null,
        parentName: null,
        parentId: null,
      };
      this.inputForm.actionType = 1;
      this.isdisabled = false;
      this.isFormDisabled = false
      this.dialogFormVisible = true;
      this.dialogTitle = "新建品牌类型";
      this.dialogKey = new Date().toString();
    },
    addBrand(node, data) {
      this.inputForm = {
        code: null,
        name: null,
        parentBrand: null,
        type: null,
        sort: 1,
        remarks: null,
        deviceImg: null,
        abnormalImg: null,
        normalImg: null,
        parentName: null,
        parentId: null,
      };
      this.inputForm.type = data.type === "1" ? "2" : "1";
      this.inputForm.actionType = 1;
      this.dialogTitle = "新建品牌类型";
      this.setDialogData(node, data);
      this.inputForm.parentId = data.id;
      this.inputForm.parentName = data.name;
      this.isFormDisabled = false;
    },
    async editBrand(node, data) {
      let queryData = await sdcDeviceModeAction("", "/" + data.id, "get");
      this.isdisabled = false;
      this.inputForm = queryData.data.data;
      this.inputForm.actionType = 2;
      console.log(this.inputForm,'this.inputForm');
      this.isFormDisabled = true;
      this.dialogTitle = "编辑品牌类型";
      this.deviceImgURL = queryData.data.data.deviceImg;
      this.normalImgURL = queryData.data.data.normalImg;
      this.abnormalImgURL = queryData.data.data.abnormalImg;
      this.setDialogData(node, data);
    },
    // 控制列显隐
    chooseColumn() {
      this.dialogColumnVisible = true
    },
    async mainPropClick(row) {
      this.btnType = 1
      let queryData = await sdcDeviceModeAction("", "/" + row.id, "get");
      this.inputForm = queryData.data.data;
      this.inputForm.parentName = queryData.data.data.parentName;
      this.isdisabled = true;
      this.dialogTitle = "查看品牌类型";
      this.deviceImgURL = queryData.data.data.deviceImg;
      this.normalImgURL = queryData.data.data.normalImg;
      this.abnormalImgURL = queryData.data.data.abnormalImg;
      this.dialogFormVisible = true;
      this.inputForm.actionType = 3
      this.dialogKey = new Date().toString();
    },
    enableEdit() {
      this.isdisabled = false
      this.isFormDisabled = true
      this.btnType = 2
      this.dialogTitle = '编辑品牌类型'
    },
    setDialogData(node, data) {
      console.log(data);
      
      this.inputForm.addType = data.type;
      if (this.inputForm.addType !== 1) {
        this.inputForm.parentbrand = node.parent.label;
      }
      
      this.dialogKey = new Date().toString();
      this.dialogFormVisible = true;
    },
    deleteBrand(data) {
      this.dialogVisible = true;
      this.delId = data.id;
    },
    //删除数据
    deleteData() {
      this.dialogVisible = false;
      sdcDeviceModeAction("", "/" + this.delId, "delete").then((res) => {
        this.queryId = "";
        this.init();
      });
    },
    async brandAction(data, type) {
      console.log(data);
      this.inputForm = {};

      if (type === 4) {
        this.dialogVisible = true;
        this.delId = data.id;
        return;
      }
      let queryData = await sdcDeviceModeAction("", "/" + data.id, "get");
      console.log(queryData, "查询结构");
      switch (type) {
        case 1:
          // this.dialogFormVisible = true
          this.inputForm.type = data.type === "1" ? "2" : "1";
          this.inputForm.parentName = data.name;
          this.inputForm.parentId = data.id;
          this.dialogTitle = "新建品牌类型";
          this.isdisabled = false;
          this.isFormDisabled = false;
          break;
        case 2:
          this.inputForm = queryData.data.data;
          console.log(this.inputForm);
          this.inputForm.parentName = queryData.data.data.parentName;
          this.inputForm.parentId = queryData.data.data.parentId;
          this.isdisabled = false;
          this.dialogTitle = "编辑品牌类型";
          this.deviceImgURL = queryData.data.data.deviceImg;
          this.normalImgURL = queryData.data.data.normalImg;
          this.abnormalImgURL = queryData.data.data.abnormalImg;
          // this.$refs.deviceImg.onload = () => {};
          // this.$refs.normalImg.onload = () => {};
          // this.$refs.abnormalImg.onload = () => {};
          this.isFormDisabled = true;
          break;
        case 3:
          this.btnType = 1
          this.inputForm = queryData.data.data;
          this.inputForm.parentName = queryData.data.data.parentName;
          this.isdisabled = true;
          this.dialogTitle = "查看品牌类型";
          this.deviceImgURL = queryData.data.data.deviceImg;
          this.normalImgURL = queryData.data.data.normalImg;
          this.abnormalImgURL = queryData.data.data.abnormalImg;
          // this.$refs.deviceImg.onload = () => {};
          // this.$refs.normalImg.onload = () => {};
          // this.$refs.abnormalImg.onload = () => {};
          break;
      }
      this.dialogFormVisible = true;
      this.inputForm.actionType = type;
      this.dialogKey = new Date().toString();
    },
    setpage(data) {
      this.page = data.current;
      this.size = data.size;
      this.total = data.total;
      this.pageKey = new Date().toString() + 1;
    },
    beforeAvatarUpload(file) {
      const isPNG = file.type === 'image/png';
      if (!isPNG) {
        this.$message.error('上传图片只能是 PNG 格式!');
        return isPNG
      }
    },
    handleDeviceAvatarSuccess(res, file) {
      this.deviceImgURL = URL.createObjectURL(file.raw);
      this.inputForm.deviceImg = res.data.url;
      this.devImgKey = new Date().toString();
    },
    handleAlarmAvatarSuccess(res, file) {
      
      this.abnormalImgURL = URL.createObjectURL(file.raw);
      this.inputForm.abnormalImg = res.data.url;
      this.abnormalImgKey = new Date().toString();
    },
    handleNormolAvatarSuccess(res, file) {
      this.normalImgURL = URL.createObjectURL(file.raw);
      this.inputForm.normalImg = res.data.url;
      this.normalImgKey = new Date().toString();
    },
    submitForm() {
      this.$refs.brandForm.validate((valid) => {
        if (valid) {
          // this.inputForm.tenantId = getStore({ name: "tenantId" });
          if (this.inputForm.parentId === 0) {
            this.inputForm.parentId = null;
          }
          if (this.inputForm.actionType === 1) {
            sdcDeviceModeAction(this.inputForm, "", "post").then((res) => {
              if (res.data.code === 0) {
                this.dialogFormVisible = false;
                this.init();
                this.$message.success('新增成功')
              }
            });
          } else
            sdcDeviceModeAction(this.inputForm, "", "put").then((res) => {
              if (res.data.code === 0) {
                this.dialogFormVisible = false;
                this.init();
                this.$message.success('编辑成功')
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //查询站点信息
    async querySiteInfo(val) {
      console.log(val);
      if (val.id === 0) {
        this.isAllBrand = true
      } else {
        this.isAllBrand = false
        sdcDeviceModeAction("", "/" + val.id, "get").then(res => {
          if (res.data.code === 0) {
            this.selectNodeInfo = res.data.data
            this.brandTypeList.forEach(item => {
              if (this.selectNodeInfo.type === item.value) {
                this.selectNodeInfo.typeName = item.label
              }
            })
          }
        })
      }
      this.queryId = val.id === 0 ? "" : val.id;
      this.queryCondition.id = this.queryId;
      this.queryBrand();
    },
    //转换表格中siteType的显示
    typeTranslate(row, column) {
      let rowText;
      for (let i = 0; i < this.brandTypeList.length; i++) {
        let el = this.brandTypeList[i];
        if (el.value === row.type) {
          rowText = el.label;
          break;
        }
      }
      return rowText;
    },
    closeDialog() {
      this.dialogFormVisible = false;
      // this.init();
    },
    async queryByPage(data) {
      // this.queryCondition.id = this.queryId;
      this.page = data.page;
      this.size = data.size;
      this.queryCondition.current = this.page
      this.queryCondition.size = this.size
      this.queryBrand();
    },
    filterNode(value, data, node) {
      return getFilterFlag(value, data, node)
    },
    setQueryCondition() {
      this.queryCondition = {
        current: this.page,
        size: this.size,
      };
      if (this.brandType.length !== 0) {
        this.queryId = this.brandType[this.brandType.length - 1];
      }
      this.queryId ? (this.queryCondition.id = this.queryId) : null;
    },
    queryBrandClick() {
      this.setQueryCondition();
      this.queryCondition.current = 1
      this.queryBrand()
    },
    async queryBrand() {
      this.brandData = [];
      let queryTableData = await getSdcDeviceModeTable(this.queryCondition);
      this.brandData = queryTableData.data.data.records;

      this.setpage(queryTableData.data.data);

      this.brandKey = new Date().toString();
    },
    clearCondition() {
      this.brandType = [];
      this.queryId = null;
    },
    //导出物模型
    deviceTypeExport() {
      sdcBrandExport().then( res => {
        let filename = res.headers['content-disposition'].split('=')[1]
        let bolb = new Blob([res.data], {type: "application/vnd.ms-excel;charset=utf-8"})
        if (window.navigator.msSaveOrOpenBlob) { //兼容IE10
            navigator.msSaveBlob(bolb, filename)
        } else {
            const href = URL.createObjectURL(bolb) //创建新的URL表示指定的blob对象
            const a = document.createElement('a') //创建a标签
            a.href = href // 指定下载链接
            a.download = filename //指定下载文件名
            a.click() //触发下载
            URL.revokeObjectURL(a.href) //释放URL对象
        }
      })
    },
    //导入物模型
    deviceTypeImport(e) {
      let formData = new FormData()
      formData.append('file',e.target.files[0])
      if (e.target.files[0]) {
        sdcBrandImport(formData).then( res => {
          console.log(res);
          if(res.data.code === 0) {
            this.$notify({
              title: '成功',
              message: '导入成功',
              type: 'success',
              duration: 5000
            })
            this.init()
          } 
        })
        e.target.value = ''
      }      
    }
  },
};
</script>

<style lang="scss" scoped>
.tree-container {
  height: 800px;
  .tree-card {
    overflow: auto;
    width: 300px;
    height: calc(100% - 45px);
    .filter-tree {
      min-width: 100%;
      margin-left: -30px;
      display: inline-block;
      overflow: auto;
      margin-top: 12px;
    }
  }
}
.node-container:hover .node-style {
  visibility: visible;
}
.node-style {
  visibility: hidden;
  display: inline;
  margin-left: 5px;
  z-index: 1000;
  color: #409eff;
}

.table-action {
  cursor: pointer;
  margin-left: 10px;
  color: #409eff;
}

.brand-btnGroup {
  float: right;
  margin-bottom: 20px;
}
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
.device-btnGroup {
  float: right;
  // margin-bottom: 20px;
}
.import-btn {
    color: #FFF;
    background-color: #409EFF;
    border-color: #409EFF;
    font-size: 12px;
    border-radius: 3px;
    padding: 9px 15px;
    margin: 0 10px;
    cursor: pointer;
}
.img-tip {
  color: red;
  font-size: 12px;
  margin-top: 5px
}
</style>
