<template>
  <div>
    <basic-container>
      <el-row :gutter="15">
        <el-col :span="6">
          <span>区域：</span>
          <el-cascader 
            ref="areaMsg"
            :options="condition" 
            style="width:80%" 
            v-model="address"
            :props="{ value: 'id', label: 'name', children: 'children' }"
            clearable 
            @change="changeAddress"
            filterable
          ></el-cascader>
        </el-col>
        <el-col :span="4">
          <span>停车场名称：</span>
          <el-select v-model="name" style="width:55%" :disabled="parkDisabled">
            <el-option
              v-for="item in parkingNameMap"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <span>状态：</span>
          <el-select v-model="plStatus" style="width:70%">
            <el-option
              v-for="item in this.$dictUtils.getDictList('parking_lot_type')"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <span>到期日期：</span>
          <el-date-picker
            v-model="dueDate"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            style="width:80%"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="3">
            <el-button type="primary" @click="queryInfoClick">
              <i class="el-icon-search"></i> 查询
            </el-button>
            <el-button type="primary" @click="clearCondition">
              <i class="el-icon-delete"></i> 清空
            </el-button>
        </el-col>
        <el-col>
          <el-button type="primary" @click="addInfo">
              <i class="el-icon-plus"></i> 新增
            </el-button>
          
        </el-col>
        <el-col :span="24" style="margin-top:20px">
            <el-table
              :data="tableInfo"
              border
              style="margin:0.75rem 0"
            >
              <el-table-column 
                type="index"
                label="序号"
                align="center"
                sortable
              ></el-table-column>
              <el-table-column 
                prop="code"
                label="停车场编号"
                align="center"
                sortable
              ></el-table-column>
              <el-table-column 
                prop="name"
                label="停车场名称"
                align="center"
              ></el-table-column>
              <el-table-column 
                prop="siteId"
                label="所属园区"
                align="center"
                :formatter="setSite"
              ></el-table-column>
              <el-table-column 
                prop="parkingSpaceNumber"
                label="总车位数"
                align="center"
              ></el-table-column>
              <el-table-column 
                prop="usedParkingSpaceNumber"
                label="已用车位"
                align="center"
              >
              </el-table-column>
              <el-table-column 
                prop="expiryEnd"
                label="到期时间"
                align="center"
                :formatter="setExpiryEnd"
              >
              </el-table-column>
              <!-- <el-table-column 
                prop="matureStatus"
                label="到期情况"
                align="center"
              ></el-table-column> -->
              <el-table-column 
                prop="status"
                label="状态"
                align="center"
                :formatter="setStatus"
              ></el-table-column>
              <el-table-column 
                prop="contactsName"
                label="联系人"
                align="center"
              ></el-table-column>
              <el-table-column 
                prop="contactsPhone"
                label="联系方式"
                align="center"
              ></el-table-column>
              <el-table-column 
                prop="createDate"
                label="创建时间"
                align="center"
              ></el-table-column>
              <el-table-column 
                label="操作"
              >
                <template slot-scope="scope">
                  <span class="table-action" @click="tableAction(scope.row, 2)">编辑</span>
                  <span class="table-action" @click="tableAction(scope.row, 3)">查看</span>
                  <span class="table-action" @click="tableAction(scope.row, 4)">删除</span>
                  <!-- <span class="table-action" @click="tableAction(scope.row, 5)">收款二维码</span> -->
                  <!-- <span class="table-action" @click="deviceAction(scope.row, 1)" v-if="scope.row.modelType !== '2'"
                    >添加</span
                  > -->
                </template>
              </el-table-column>
            </el-table>
            <Pagination :page="page" :size="size" :total="total" :key="pageKey" @pagination="queryByPage"></Pagination>
        </el-col>
      </el-row>
      <el-dialog
        :visible.sync="dialogFormVisible"
        width="35%"
        ref="parkinglotDialog"
        :close-on-click-modal="false"
        @close="refreshData"
        :title="dialogTitle"
      >
        <el-form
          :model="inputForm"
          label-width="175px"
          :rules="rules"
          ref="parkinglotForm"
          :key="dialogKey"
          :disabled="isdisabled"
        >
          <el-form-item label="编号：" prop="code" >
            <el-input v-model="inputForm.code" ></el-input>
          </el-form-item>
          <el-form-item label="停车场名称：" prop="name" >
            <el-input v-model="inputForm.name" ></el-input>
          </el-form-item>
          <!-- <el-form-item label="停车场类型（地上、地下）" prop="parkType" >
            <el-select v-model="inputForm.parkType" style="width:70%">
            <el-option
              v-for="item in parkTypeMap"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select> 
          </el-form-item> -->
          <!-- <el-form-item label="入口闸口1编号" prop="entranceGateCode">
            <el-input v-model="inputForm.entranceGateCode" ></el-input>
          </el-form-item>
          <el-form-item label="出口闸口1编号" prop="exitGateCode" >
            <el-input v-model="inputForm.exitGateCode" ></el-input>
          </el-form-item> -->
          <el-form-item label="所属园区：" prop="siteParkId">
            <el-cascader 
              ref="areaMsg"
              :options="condition" 
              style="width:80%" 
              v-model="inputForm.siteParkId"
              :props="{ value: 'id', label: 'name', children: 'children' }"
              clearable 
              @change="changeSite"
              filterable
            ></el-cascader>
          </el-form-item>
          <!-- <el-form-item label="地址" prop="place">
            <el-input v-model="inputForm.place" ></el-input>
          </el-form-item> -->
          <el-form-item label="总车位：" prop="parkingSpaceNumber">
            <el-input v-model="inputForm.parkingSpaceNumber" ></el-input>
          </el-form-item>
          <el-form-item label="到期时间：" prop="expiryEnd">
            <el-date-picker
              v-model="inputForm.expiryEnd"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="收款方式：" prop="payType">
            <el-select v-model="inputForm.payType" style="width:70%">
              <el-option
                v-for="item in this.$dictUtils.getDictList('pay_type')"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上传收款二维码：" prop="collectionQRCode" v-if="inputForm.payType === '4'">
            <el-upload
                  class="avatar-uploader"
                  action="/site-sdc/sdc-file/upload"
                  :headers="headers"
                  :show-file-list="false"
                  :on-success="handleDeviceAvatarSuccess"
                  :key="QRCodeKey"
                >
                  <img
                    v-if="inputForm.collectionQRCode"
                    :src="collectionQRCodeImgURL"
                    class="avatar"
                  />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
          </el-form-item>
          <el-form-item label="启用状态(启用、禁用)：" prop="status">
            <el-select v-model="inputForm.status" style="width:70%">
              <el-option
                v-for="item in this.$dictUtils.getDictList('parking_lot_type')"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="免费时长(分钟)：" prop="freeTime">
            <el-input v-model="inputForm.freeTime" ></el-input>
          </el-form-item>
          <el-form-item label="单日费用封顶：" prop="feeUpperLimit">
            <el-input v-model="inputForm.feeUpperLimit" ></el-input>
          </el-form-item>
          <el-form-item label="计费模式：" prop="billingMode">
            <el-select v-model="inputForm.billingMode" style="width:70%">
              <el-option
                v-for="item in this.$dictUtils.getDictList('billing_type')"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单位时长(分钟)：" prop="unitDuration">
            <el-input v-model="inputForm.unitDuration" ></el-input>
          </el-form-item>
          <el-form-item label="停车场联系人：" prop="contactsName">
            <el-input v-model="inputForm.contactsName" ></el-input>
          </el-form-item>
          <el-form-item label="联系电话：" prop="contactsPhone">
            <el-input v-model="inputForm.contactsPhone" ></el-input>
          </el-form-item>
          <el-form-item label="备注：" prop="remarks">
            <el-input type="textarea" rows="2" v-model="inputForm.remarks" ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <template v-if="inputForm.actionType == 3">
            <el-button
              type="primary"
              @click="dialogFormVisible = false"
              size="small"
              >关闭</el-button
            >
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
          <el-button @click="deleteData">确 定</el-button>
          <el-button type="primary" @click="dialogVisible = false"
            >取 消</el-button
          >
        </span>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import { modifyData } from "@/util/domainFilter";
import Pagination from "@/components/Pagination";
import store from "@/store";

import { sdcParkingLotAction,getSdcParkingLotTable,getSdcParkingLotBySiteId,getSdcParkingLotSiteTree } from "@/api/sdc/parkManage";
import { clone } from "@/util/domainFun";

import moment from "moment";

export default {
  components: {
    Pagination
  },
  data() {
    return {
      page:1,
      size: 10,
      total: 0,
      parkDisabled: true,
      pageKey: Math.random().toString(36).slice(-6),
      address: null,
      condition: [],
      dueDate: null,
      plStatus: null,
      plStatusMap: [],
      matureStatus:'',
      name: '',
      parkingNameMap: [],
      matureStatusMap: [],
      payTypeMap: [],  //收款方式
      billingModeMap:[], //计费模式
      pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
      },
      tableInfo: [],
      dialogFormVisible: false,
      inputForm: {
        code: null,  //停车场编号
        name: null,  //停车场名称
        siteId: null,  //站点ID
        siteParkId: null,  //所属位置ID
        parkingSpaceNumber:null, //总车位数
        expiryEnd: null,  //到期日期
        payType: '3',  //付款方式
        freeTime: null, //免费时长
        feeUpperLimit: null,  //单日费用封顶
        billingMode: null,  //收费模式
        collectionQRCode: null,  //二维码
        status: null,  //启用状态
        unitDuration: null, //单位时长
        contactsName: null, //联系人
        contactsPhone:null,  //联系电话
        remarks: null,  //备注
      },
      rules: {
        code: [
          { required: true, message: "请输入停车场编号", trigger: "blur" },
        ],
        name: [
          { required: true, message: "请输入停车场名称", trigger: "blur" },
        ],
        siteParkId: [{ required: true, message: "请输入所属位置", trigger: "change" }],
        parkingSpaceNumber: [
          { required: true, message: "请输入总车位数", trigger: "blur" },
        ],
        expiryEnd: [{ required: true, message: "请输入到期日期", trigger: "blur" }],
        payType: [
          { required: true, message: "请选择收款方式", trigger: "blur" },
        ],
        freeTime: [
          { required: true, message: "请设置免费时长", trigger: "blur" },
        ],
        feeUpperLimit: [{ required: true, message: "请设置单日费用封顶", trigger: "blur" }],
        billingMode: [{ required: true, message: "请选择收费模式", trigger: "blur" }],
        collectionQRCode: [
          { required: true, message: "请上传收款二维码", trigger: "blur" },
        ],
        status: [{ required: true, message: "请输入启用状态", trigger: "blur" }],
        unitDuration: [
          { required: true, message: "请设置单位时长", trigger: "blur" },
        ],
        contactsName: [{ required: true, message: "请输入联系人", trigger: "blur" }],
        contactsPhone: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
        ],
      },
      dialogKey: Math.random().toString(36).slice(-6),
      isdisabled: false,
      parkTypeMap: [],
      dialogVisible: false,
      delId: null,
      dialogTitle: null,
      queryCondition: {},
      siteInfo: null,
      collectionQRCodeImgURL: null,
      QRCodeKey: Math.random().toString(36).slice(-6),
      headers: {
        Authorization: "Bearer " + store.getters.access_token,
      },
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      //获取区域数据
      let data = await getSdcParkingLotSiteTree()
      console.log(data,'data');
      // debugger
      this.siteInfo = data.data.data
      this.condition = modifyData(data.data.data)
      console.log(this.condition);
      this.queryInfo()
    },
    setQueryCondition() {
      this.queryCondition = {
        current:this.page,
        size: this.size
      }
      this.address ? this.queryCondition.siteId = this.address[this.address.length - 1] : null
      this.name ? this.queryCondition.id = this.name : null
      this.plStatus ? this.queryCondition.status = this.plStatus : null
      if(this.dueDate) {
        this.queryCondition['expand.expiryEndBegin'] = moment(this.dueDate[0]).format('YYYY-MM-DD HH:mm:ss')
        this.queryCondition['expand.expiryEndEnd'] = moment(this.dueDate[1]).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    async addInfo() { 
      this.dialogTitle = '新建停车场信息'
      this.inputForm.actionType = 1
      this.dialogFormVisible = true
      this.dialogKey = new Date().toString()
    },
    queryInfoClick() {
      this.setQueryCondition()
      this.queryCondition.current = 1
      this.queryInfo()
    },
    async queryInfo() {
      let tableData = await getSdcParkingLotTable(this.queryCondition)
      console.log(tableData,'tableData');
      this.tableInfo = tableData.data.data.records
      this.setpage(tableData.data.data);
    },
    clearCondition() {
      this.address = []
      this.name = null
      this.plStatus = null
      this.dueDate = null
      this.changeAddress()
    },
    async changeAddress() {
      if(this.address.length !== 0) {
        this.parkDisabled = false
        let tableData = await getSdcParkingLotBySiteId(this.address[this.address.length - 1])
        tableData.data.data.forEach((el) => {
          this.parkingNameMap.push({
            value: el.id,
            label: el.name,
          });
        });
      }else {
        this.parkDisabled = true
        this.parkingNameMap = []
      }
    },
    tableAction(row,flag) {
      if(flag === 3) {
        this.dialogTitle = '查看停车场信息'
        this.isdisabled = true
        this.inputForm = clone(row)
        this.inputForm.actionType = 3
        this.inputForm.payType = '3'
        this.dialogFormVisible = true
      } else if( flag === 2) {
        this.dialogTitle = '编辑停车场信息'
        this.inputForm = clone(row)
        this.inputForm.payType = '3'
        this.inputForm.actionType = 2
        this.dialogFormVisible = true
      } else if( flag === 4) {
        this.dialogVisible = true
        this.delId = row.id
      }
      this.dialogKey = new Date().toString()
    },
    async queryByPage(data) {
      this.page = data.page
      this.size = data.size
      this.queryCondition.current = this.page
      this.queryCondition.size = this.size
      this.queryInfo()
    },
    refreshData() {
      this.inputForm = {
        code: null,  //停车场编号
        name: null,  //停车场名称
        siteId: null,  //站点ID
        siteParkId: null,  //所属位置ID
        parkingSpaceNumber:null, //总车位数
        expiryEnd: null,  //到期日期
        payType: '3',  //付款方式
        freeTime: null, //免费时长
        feeUpperLimit: null,  //单日费用封顶
        billingMode: null,  //收费模式
        collectionQRCode: null,  //二维码
        status: null,  //启用状态
        unitDuration: null, //单位时长
        contactsName: null, //联系人
        contactsPhone:null,  //联系电话
        remarks: null,  //备注
      }
      this.isdisabled = false
    },
    changeSite(val) {
      console.log(val,'val');
      this.inputForm.siteId = this.inputForm.siteParkId = val[val.length - 1]
    },
    async submitForm() {
      this.$refs.parkinglotForm.validate((valid) => {
        if (valid) {
          this.inputForm.expiryEnd = moment(this.inputForm.expiryEnd).format('YYYY-MM-DD HH:mm:ss')
          if(this.inputForm.actionType === 1) {
            this.inputForm.createDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            sdcParkingLotAction(this.inputForm, "", "post").then(() => {
              this.dialogFormVisible = false
              this.init()
            })
          } else {
            this.inputForm.updateDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            sdcParkingLotAction(this.inputForm, "", "put").then(() => {
              this.dialogFormVisible = false
              this.init()
            })
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      
    },
    deleteData() {
      sdcParkingLotAction('', '/'+this.delId, "delete").then(() => {
        this.dialogVisible = false
        this.init()
      })
    },
    setExpiryEnd(val) {
      console.log(val);
      return moment(val.expiryEnd).format('YYYY-MM-DD HH:mm:ss')
    },
    setStatus(val) {
      let statusMap = this.$dictUtils.getDictList('parking_lot_type')
      let text
      for (let index = 0; index < statusMap.length; index++) {
        const el = statusMap[index];
        if (el.value === val.status) {
          text = el.label
          break;
        }
      }
      return text
    },
    setpage(data) {
      this.page = data.current;
      this.size = data.size;
      this.total = data.total;
      this.pageKey = (new Date()).toString() + 1
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
    handleDeviceAvatarSuccess(res,file) {
      this.collectionQRCodeImgURL = URL.createObjectURL(file.raw)
      this.inputForm.collectionQRCode = res.data.url;
      this.QRCodeKey = new Date().toString()
    },
  }
}
</script>

<style lang="scss" scoped>
.avatar-inline {
  display: inline;
  margin-right: 15px;
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
  height: auto;
  display: block;
}
</style>