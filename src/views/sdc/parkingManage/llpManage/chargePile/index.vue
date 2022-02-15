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
            :props="{ checkStrictly: true, value: 'id', label: 'name', children: 'children' }"
            clearable
            filterable 
            @change="changeAddress"
          ></el-cascader>
        </el-col>
        <el-col :span="4">
          <span>停车场名称：</span>
          <el-select v-model="parkingName" style="width:55%">
            <el-option
              v-for="item in parkingNameMap"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <span>充电桩名称：</span>
          <el-input v-model="chargePileName" style="width:50%"></el-input>
        </el-col>
        <el-col :span="3">
          <span>状态：</span>
          <el-select v-model="cpStatus" style="width:70%">
            <el-option
              v-for="item in cpStatusMap"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <div>
            <el-button type="primary" @click="queryInfo">
              <i class="el-icon-search"></i> 查询
            </el-button>
            <el-button type="primary" @click="clearCondition">
              <i class="el-icon-delete"></i> 清空
            </el-button>
          </div>
        </el-col>
        <!-- <el-col>
          <el-button type="primary" @click="addInfo">
              <i class="el-icon-plus"></i> 新增
            </el-button>
        </el-col> -->
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
                prop="chargePileCode"
                label="充电桩编号"
                align="center"
                sortable
              ></el-table-column>
              <el-table-column 
                prop="chargePileName"
                label="充电桩名称"
                align="center"
              ></el-table-column>
              <el-table-column 
                prop="siteName"
                label="所属园区"
                align="center"
              ></el-table-column>
              <el-table-column 
                prop="parkingName"
                label="停车场名称"
                align="center"
              ></el-table-column>
              <el-table-column 
                prop="startUseDate"
                label="投入使用日期"
                align="center"
              ></el-table-column>
              <el-table-column 
                prop="status"
                label="状态"
                align="center"
              ></el-table-column>
              <el-table-column 
                prop="createUser"
                label="创建人"
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
                  <span class="table-action" @click="tableAction(scope.row, 4)">停止充电</span>
                  
                </template>
              </el-table-column>
            </el-table>
            <Pagination :page="page" :size="size" :total="total" @pagination="queryByPage"></Pagination>
        </el-col>
      </el-row>
      <el-dialog
        :visible.sync="dialogFormVisible"
        width="35%"
        ref="emgDialog"
        :close-on-click-modal="false"
        @close="refreshData"
        :title="dialogTitle"
      >
        <el-form
          :model="inputForm"
          label-width="120px"
          :rules="rules"
          ref="chargePileForm"
          :key="dialogKey"
          :disabled="isdisabled"
        >
          <el-form-item label="编号" prop="chargePileCode" >
            <el-input v-model="inputForm.chargePileCode" ></el-input>
          </el-form-item>
          <el-form-item label="充电桩名称" prop="chargePileName" >
            <el-input v-model="inputForm.chargePileName" ></el-input>
          </el-form-item>
          <el-form-item label="所属园区" prop="siteId">
            <el-cascader 
              ref="areaMsg"
              :options="condition" 
              style="width:80%" 
              v-model="inputForm.siteId"
              :props="{ checkStrictly: true, value: 'id', label: 'name', children: 'children' }"
              clearable
              filterable 
              @change="changeSite"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="停车场名称" prop="parkingName" >
            <el-input v-model="inputForm.parkingName" ></el-input>
          </el-form-item>
           <el-form-item label="投入使用日期" prop="startUseDate">
            <el-date-picker
              v-model="inputForm.startUseDate"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="状态" prop="status" >
            <el-select v-model="inputForm.status" style="width:70%">
              <el-option
                v-for="item in statusMap"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建人" prop="createUser">
            <el-input v-model="inputForm.createUser" ></el-input>
          </el-form-item>
          <el-form-item label="创建时间" prop="createDate">
            <el-date-picker
              v-model="inputForm.createDate"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <template v-if="inputForm.actionType === 3">
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
import { sdcSiteAction } from "@/api/sdc/addressInfo";
import { modifyData } from "@/util/domainFilter";
import Pagination from "@/components/Pagination";
import { clone } from "@/util/domainFun";

export default {
  components: {
    Pagination
  },
  data() {
    return {
      page:1,
      size: 10,
      total: 0,
      address: null,
      condition: [],
      cpStatus:'',
      cpStatusMap: [],
      parkingName: '',
      parkingNameMap: [],
      chargePileName: null,
      statusMap: [],
      tableInfo: [
        {
          id: 1,
          chargePileCode: 'S001',
          chargePileName: 'DQ-1-1-3',
          parkingName: 'A栋地下一层停车场',
          siteName: '科技园01',
          startUseDate: '2021-04-25',
          status: '启用',
          createUser: '庄明',
          createDate: '2021-04-25 11:25:55'
        },
        {
          id: 1,
          chargePileCode: 'S001',
          chargePileName: 'DQ-1-1-3',
          parkingName: 'A栋地下一层停车场',
          siteName: '科技园01',
          startUseDate: '2021-04-25',
          status: '启用',
          createUser: '庄明',
          createDate: '2021-04-25 11:25:55'
        },
        {
          id: 1,
          chargePileCode: 'S001',
          chargePileName: 'DQ-1-1-3',
          parkingName: 'A栋地下一层停车场',
          siteName: '科技园01',
          startUseDate: '2021-04-25',
          status: '启用',
          createUser: '庄明',
          createDate: '2021-04-25 11:25:55'
        },
        {
          id: 1,
          chargePileCode: 'S001',
          chargePileName: 'DQ-1-1-3',
          parkingName: 'A栋地下一层停车场',
          siteName: '科技园01',
          startUseDate: '2021-04-25',
          status: '启用',
          createUser: '庄明',
          createDate: '2021-04-25 11:25:55'
        },
        {
          id: 1,
          chargePileCode: 'S001',
          chargePileName: 'DQ-1-1-3',
          parkingName: 'A栋地下一层停车场',
          siteName: '科技园01',
          startUseDate: '2021-04-25',
          status: '启用',
          createUser: '庄明',
          createDate: '2021-04-25 11:25:55'
        },
      ],
      dialogFormVisible: false,
      inputForm: {
        chargePileCode: null,
        chargePileName: null,
        parkingName: null,
        siteId: null,
        startUseDate: null,
        status: null,
        createUser: null,
        createDate: null,
      },
      rules: {
        chargePileCode: [
          { required: true, message: "请输入设备类型编号", trigger: "blur" },
        ],
        parkingName: [
          { required: true, message: "请输入设备类型名称", trigger: "blur" },
        ],
        chargePileName: [{ required: true, message: "请输入上级类型", trigger: "blur" }],
        startUseDate: [{ required: true, message: "请输入序号", trigger: "blur" }],
        siteId: [
          { required: true, message: "请输入设备类型名称", trigger: "blur" }],
        status: [{ required: true, message: "请输入上级类型", trigger: "blur" }],
        createUser: [
          { required: true, message: "请输入设备类型名称", trigger: "blur" },
        ],
        createDate: [{ required: true, message: "请输入上级类型", trigger: "blur" }],
      },
      dialogKey: Math.random().toString(36).slice(-6),
      isdisabled: false,
      parkTypeMap: [],
      dialogVisible: false,
      delId: null,
      dialogTitle: null
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      //获取区域数据
      let data = await sdcSiteAction('','/tree','get')
      this.condition = modifyData(data.data.data)
    },
    // async addInfo() { 
    //   this.dialogTitle = '新建充电桩信息'
    //   this.inputForm.actionType = 1
    //   this.dialogFormVisible = true
    //   this.dialogKey = new Date().toString()
    // },
    async queryInfo() {

    },
    clearCondition() {

    },
    changeAddress() {

    },
    tableAction(row,flag) {

    },
    async queryByPage(data) {
      
    },
    refreshData() {

    },
    changeSite() {

    },
    submitForm() {

    },
    deleteData() {

    }
  }
}
</script>

<style lang="scss" scoped>

</style>