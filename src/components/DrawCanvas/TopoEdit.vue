<template >
  <div>
    <div ref="deviceImg" :draggable="true" @dblclick="showDetail">
      <div class="dev-img">
        <img ref="plate" :src="testImg" alt="" @click="showInfo" />
        <span class="dev-name">{{ devname }}</span>
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogTableVisible"
      width="50%"
      ref="emgDialog"
      :close-on-click-modal="false"
      @close="refreshData"
      title="单击表格行关联设备"
    >
      <el-table
        :data="devInfo"
        border
        style="margin: 0.75rem 0"
        highlight-current-row
        @current-change="handleSelectionChange"
      >
        <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
        <el-table-column
          type="index"
          label="序号"
          align="center"
          sortable
        ></el-table-column>
        <el-table-column
          prop="name"
          label="设备名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="typeName"
          label="设备类型"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="code"
          label="设备编号"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="siteName"
          label="所属位置"
          align="center"
        ></el-table-column>
      </el-table>
      <Pagination
        :page="page"
        :size="size"
        :total="total"
        :key="pageKey"
        @pagination="queryByPage"
      ></Pagination>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false" size="small"
          >取消</el-button
        >
        <el-button type="primary" @click="submitForm" size="small"
          >保存</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogDevVisible"
      width="50%"
      ref="emgDialog"
      :close-on-click-modal="false"
      @close="refreshData"
      title="关联设备"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <span>设备名称：{{devMsg.name}}</span>
        </el-col>
        <el-col :span="12">
          <span>设备编号：{{devMsg.code}}</span>
        </el-col>
        <el-col :span="12">
          <span>设备类型：{{devMsg.typeName}}</span>
        </el-col>
        <el-col :span="12">
          <span>所属位置：{{devMsg.siteName}}</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="modifyInfo" size="small">修改</el-button>
        <el-button type="danger" @click="deleteInfo" size="small">删除</el-button>
        <el-button @click="dialogDevVisible = false" size="small"
          >关闭</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { getSdcDeviceTable,getSdcNVRInfo } from "@/api/sdc/deviceInfo";
import { addSdcTopoDev,querySdcTopoComponent,sdcTopoDevAction, deleteDevTopoRe } from "@/api/sdc/topoInfo";
import { sysTypeFilter } from "@/util/domainFilter";


let startx = 0,
  startY = 0;

export default {
  props: ["deviceData", "width", "height", "isDraggable", "id"],
  components: {
    Pagination,
  },
  filters: {
    sysTypeFilter
  },
  data() {
    return {
      textShow: false,
      deg: 0,
      testImg: null,
      rotateNum: 0,
      devWidth: 16,
      devHeight: 24,
      basicWidth: null,
      basicHeight: null,
      pointX: null,
      pointY: null,
      top: 0,
      left: 0,
      devMsg: {},
      devname: null,
      dialogTableVisible: false,
      dialogDevVisible: false,
      devInfo: [],
      page: 1,
      size: 5,
      total: 0,
      pageKey: 0,
      queryCondition: null,
      inputForm: null,
      editFlag: 1
    };
  },
  created() {
    this.testImg = this.deviceData.url;
    this.devname = this.deviceData.name;
    if (this.deviceData.type === "new") {
      this.queryDeviceInfo();
      this.editFlag = 1
      this.dialogTableVisible = true;
    }
  },
  mounted() {
    this.inputForm = this.deviceData;
    this.init();
  },
  methods: {
    init() {
      // this.$refs.plate.onload = () => {};

      // this.devWidth = this.basicWidth;
      // this.devHeight = this.basicHeight;

      this.$refs.deviceImg.id = this.id;
      this.$refs.deviceImg.style.top = this.deviceData.componnetY + "px";
      this.$refs.deviceImg.style.left = this.deviceData.componnetX + "px";

      this.$refs.deviceImg.style.position = "absolute";
      this.$refs.deviceImg.style.opacity = 0.8;

      this.$refs.deviceImg.ondragenter = (e) => {
        e.preventDefault();
      };

      // this.$refs.deviceImg.ondragover = (e) => {
      //   e.preventDefault()
      // }

      this.$refs.deviceImg.ondragstart = (e) => {
        startx = e.clientX;
        startY = e.clientY;
        this.$refs.deviceImg.ondrag = (e) => {
          let lengthX = e.clientX - startx;
          let lengthY = e.clientY - startY;
          this.$refs.deviceImg.style.top =
          this.deviceData.componnetY + lengthY + "px";
          this.$refs.deviceImg.style.left =
          this.deviceData.componnetX + lengthX + "px";
        };
        this.$refs.deviceImg.ondragend = (e) => {
          this.$refs.deviceImg.ondrag = this.$refs.deviceImg.ondragend = null;
          let lengthX = e.clientX - startx;
          let lengthY = e.clientY - startY;
          this.deviceData.componnetX += lengthX
          this.deviceData.componnetY += lengthY
          this.$refs.deviceImg.style.top =
          this.deviceData.componnetY
          this.$refs.deviceImg.style.left =
          this.deviceData.componnetX
          this.$emit('changePos',{
            id: this.deviceData.id,
            componnetX: this.deviceData.componnetX,
            componnetY: this.deviceData.componnetY
          })
          startx = 0;
          startY = 0;
        };
      };
    },
    setDevQueryCondition() {
      this.queryCondition = {
        current: this.page,
        size: this.size,
      };
      // console.log(this.brandTypeName,'this.brandTypeName');
      // if(this.brandTypeName.length !== 0) {
      //   this.queryCondition.model = this.brandTypeName[this.brandTypeName.length - 1]
      // }
      // this.queryId ? this.queryCondition.siteId = this.queryId : null
      // this.deviceType.length !== 0 ? this.queryCondition.type = this.deviceType[this.deviceType.length - 1] : null
      // // this.deviceSiteId ? this.queryCondition.siteId = this.deviceSiteId[this.deviceSiteId.length - 1] : null
      // this.deviceCode ? this.queryCondition['expand[codeLike]'] = this.deviceCode : null
    },
    async queryDeviceInfo() {
      this.setDevQueryCondition();
      let queryTableData = await getSdcDeviceTable(this.queryCondition);
      this.devInfo = queryTableData.data.data.records;
      this.total = queryTableData.data.data.total
      // this.setpage(queryTableData.data.data);
    },
    clearDevCondition() {
      // this.deviceType = []
      // this.deviceSiteId = []
      // this.brandTypeName = []
      // this.deviceCode = null
      // this.queryId = null
      // this.handleNodeClose();
      // this.queryDeviceInfo()
    },
    showInfo() {
      console.log(this.deviceData.path);
    },
    submitForm() {
      
      if(this.editFlag === 1) {
        addSdcTopoDev(this.inputForm).then((res) => {
          if (res.data.code === 0) {
            this.$emit('refreshTopo')
            this.$message.success('新增成功')
            this.dialogTableVisible = false;
          }
        });
      } else {
        sdcTopoDevAction(this.inputForm, "", "put").then((res) => {
              if (res.data.code === 0) {
                this.$emit('refreshTopo')
                this.$message.success('修改成功')
                this.dialogTableVisible = false;
              }
            });
      }
      
    },
    refreshData() {},
    queryByPage(data) {
      this.page = data.page
      this.size = data.size
      this.queryDeviceInfo()
    },
    handleSelectionChange(val) {
      console.log(val);
      this.inputForm.deviceId = val.id;
    },
    showDetail() {
      console.log(this.deviceData,1111);
      getSdcNVRInfo(this.deviceData.deviceId).then( res => {
          console.log(res.data.data,22222222222);
          this.devMsg = res.data.data
          this.dialogDevVisible = true;
        })
      
    },
    modifyInfo() {
      this.queryDeviceInfo();
      this.dialogDevVisible = false;
      this.editFlag = 2
      this.dialogTableVisible = true;
    },
    deleteInfo() {
      this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteDevTopoRe(this.deviceData.id).then(res => {
            if (res.data.code === 0) {
              this.$emit('refreshTopo')
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.dialogDevVisible = false;
            }
          })
        }).catch(() => {})
    }
  },
};
</script>

<style lang="scss" scoped>
.dev-img {
  // text-align: center;
  // margin-top: 20%;
  margin-right: 5px;
  float: left;
}

.dev-name {
  position: absolute;
  top: 30%;
  left: 10%;
  font-size: 14px;
  color: #fff;
}
</style>
