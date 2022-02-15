<template>
  <el-row :gutter="15">
        <el-col :span="6">
          <span>区域：</span>
          <el-cascader 
            ref="areaMsg"
            :options="condition" 
            style="width:75%" 
            v-model="address"
            :props="{ value: 'id', label: 'name', children: 'children' }"
            clearable
            filterable 
            @change="changeAddress"
          ></el-cascader>
        </el-col>
        <el-col :span="6">
          <span>停车场名称：</span>
          <!-- @change="getInfo" -->
          <el-select v-model="parkId" style="width:60%" :disabled="parkDisabled" >
            <el-option
              v-for="item in parkingMap"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <span>车位号：</span>
          <el-input v-model="parkPlaceCode" style="width:60%"></el-input>
          <!-- <el-select v-model="parkPlaceCode" style="width:70%">
              <el-option
                v-for="item in parkPlaceCodeMap"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select> -->
        </el-col>
        <el-col :span="6">
          <span>车位状态：</span>
          <el-select v-model="status" style="width:60%">
            <el-option
              v-for="item in this.$dictUtils.getDictList('park_space_type')"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <!-- <el-col :span="7">
          <span>到期日期：</span>
          <el-date-picker
            v-model="dueDate"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            style="width:80%"
          >
          </el-date-picker>
        </el-col> -->
        <el-col>
          <el-button type="primary" @click="addInfo" >
            <i class="el-icon-plus"></i> 新增
          </el-button>
          <div class="query-btn-group">
            <el-button type="primary" @click="queryInfoClick" v-if="parkId">
              <i class="el-icon-search"></i> 查询
            </el-button>
            <el-button type="primary" @click="queryInfoClick" v-else disabled>
              <i class="el-icon-search"></i> 查询
            </el-button>
            <el-button type="primary" @click="clearCondition">
              <i class="el-icon-delete"></i> 清空
            </el-button>
          </div>
        </el-col>
        <el-col :span="9" style="margin-top:20px">
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
              <!-- <el-table-column 
                prop="code"
                label="编号"
                align="center"
              ></el-table-column> -->
              <el-table-column 
                prop="name"
                label="车位号"
                align="center"
                sortable
              ></el-table-column>
              <el-table-column 
                prop="parkId"
                label="停车场名称"
                align="center"
                :formatter="setParkName"
              ></el-table-column>
              <!-- <el-table-column 
                prop="siteId"
                label="所属园区"
                align="center"
              ></el-table-column> -->
              <!-- <el-table-column 
                prop="area"
                label="面积"
                align="center"
              ></el-table-column> -->
              <!-- <el-table-column 
                prop="expiryEnd"
                label="到期时间"
                align="center"
                :formatter="setExpiryEnd"
              ></el-table-column> -->
              <el-table-column 
                prop="status"
                label="状态"
                align="center"
                :formatter="setStatus"
              ></el-table-column>
              <!-- <el-table-column 
                prop="createDate"
                label="创建时间"
                align="center"
              ></el-table-column> -->
              <el-table-column 
                label="操作"
                width="150px"
              >
                <template slot-scope="scope">
                  <span class="table-action" @click="tableAction(scope.row, 2)">编辑</span>
                  <span class="table-action" @click="tableAction(scope.row, 3)">查看</span>
                  <span class="table-action" @click="tableAction(scope.row, 4)">删除</span>
                </template>
              </el-table-column>
            </el-table>
            <Pagination :page="page" :size="size" :total="total" :key="pageKey" @pagination="queryByPage"></Pagination>
          </el-col>
          <el-col :span="15">
            <span>停车场车位总览</span>
            <el-row :gutter="15">
              <el-col :span="5">
                宽：<el-input-number v-model="plateWidth" @change="handleWidthChange" :step="10" class="dev-input" style="width:70%"></el-input-number>
              </el-col>
              <el-col :span="5">
                高：<el-input-number v-model="plateHeight" @change="handleHeightChange" :step="10" class="dev-input" style="width:70%"></el-input-number>
              </el-col>
              <el-col :span="5">
                旋转：<el-input-number v-model="plateDeg" @change="handleDegChange" :step="10" class="dev-input" style="width:65%"></el-input-number>
              </el-col>
              <el-col :span="9">
                车位编号：<el-input v-model="plateStart" class="dev-input" style="width:35%"></el-input> - <el-input v-model="plateEnd" class="dev-input" style="width:35%"></el-input>
              </el-col>
              <el-col :span="4">
                坐标X：<el-input v-model="plateX" class="dev-input" style="width:60%"></el-input>
              </el-col>
              <el-col :span="4">
                坐标Y：<el-input v-model="plateY" class="dev-input" style="width:60%"></el-input>
              </el-col>
              <el-col :span="4">
                <el-button type="primary" @click="getSdcParkPlace">创建</el-button>
                <el-button type="primary" @click="updateSdcParkPlace">保存</el-button>
              </el-col>
            </el-row>
            <!-- <el-select v-model="parkPlateId" style="width:60%" @change="getInfo">
              <el-option
                v-for="item in parkingNameMap"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select> -->
            <template v-if="showFlag">
              <div id="canvas" style="position:relative">
              <img ref="roomImg" :src="plateImg" style="width: 1008px; height: 744px" v-if="plateImg"/>
              <img
                ref="plate"
                :src="testImg"
                :style="{ transform: 'rotateZ(' + plateDeg + 'deg)' }"
                :draggable="true"
                style="position:absolute;top:5px;left:5px"
              />
              <template v-for="(item,index) in deviceInfo">
                <parkplace 
                  :key="deviceKey+index" 
                  :deviceData="item" 
                  :width="210" 
                  :height="80" 
                  :id="index"
                  :isShow="textShow"
                  :isDraggable="isDraggable"
                  :type="'dev'"
                ></parkplace>
              </template>
              <template v-for="(item,index) in newPlateInfo">
                <parkImg 
                  :key="index" 
                  :deviceData="item" 
                  :width="210" 
                  :height="80" 
                  :id="index"
                  :isShow="textShow"
                  :isDraggable="isDraggable"
                  :type="'dev'"
                  @updatePlatePointMsg="updateInfo"
                ></parkImg>
              </template>
            </div>
            </template>
            
          </el-col>
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
      </el-row>
      
</template>

<script>
import { modifyData } from "@/util/domainFilter";
import Pagination from "@/components/Pagination";
import parkImg from "@/components/DrawCanvas/parkImg";
import parkplace from "@/components/DrawCanvas/parkplace";

import { getSdcParkingLotTable,sdcParkPlaceAction,getSdcParkPlaceTable,getSdcParkPlaceSiteTree,getSdcParkingLotBySiteId,getSdcParkPlaceBy,batchUpdateSdcParkPlace } from "@/api/sdc/parkManage";
import { getParkDataBySiteId } from "@/api/sdc/deviceInfo";
import { clone } from "@/util/domainFun";

import moment from "moment";

import carImg from "@/assets/img/plate01.png";

let startx = 0, startY = 0;

export default {
  props: ['parkPlaceCodeMap','parkingNameMap','normalParkId','pqCondition','siteId'],
  components: {
    Pagination,
    parkImg,
    parkplace
  },
  data() {
    return {
      page:1,
      size: 10,
      total: 0,
      pageKey: Math.random().toString(36).slice(-6),
      address: [],
      condition: [],
      parkId: null,
      parkDisabled: true,
      status:'',
      parkPlaceSatusMap: [],
      dueDate: null,
      parkPlaceCode: '',
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
      parkingMap: [],
      dialogKey: Math.random().toString(36).slice(-6),
      parkTypeMap: [],
      dialogVisible: false,
      delId: null,
      queryCondition: {},
      plateImg: null,
      deviceInfo:[],
      deviceKey: Math.random().toString(36).slice(-6),
      textShow: false,
      isDraggable: true,
      parkPlateId:null,
      parkData: null,
      testImg: carImg,
      plateWidth: null,
      plateHeight: null,
      plateDeg: 0,
      plateStart: null,
      plateEnd: null,
      plateX: 5,
      plateY: 5,
      basicWidth: null,
      basicHeight: null,
      newPlateInfo: [],
      showFlag: false,
    }
  },
  created() {
    this.getParkInfo()
    this.init()
  },
  methods: {
    handleWidthChange() {
      this.plateHeight =
        this.basicHeight * (this.plateWidth / this.basicWidth).toFixed(2);
      this.$refs.plate.style.width = this.plateWidth + "px";
      this.$refs.plate.style.height = this.plateHeight + "px";
    },
    handleHeightChange() {
      this.plateWidth =
        this.basicWidth * (this.plateHeight / this.basicHeight).toFixed(2);
      this.$refs.plate.style.width = this.plateWidth + "px";
      this.$refs.plate.style.height = this.plateHeight + "px";
    },
    handleDegChange() {
      if (this.plateDeg <= -360) {
        this.plateDeg = 0;
      }
      if (this.plateDeg >= 360) {
        this.plateDeg = 0;
      }
    },
    async init() {
       this.normalParkId ? this.parkId = this.normalParkId : null
       if(this.siteId.length !== 0) {
         this.address = this.siteId
         this.changeAddress()
       }
       this.queryCondition = this.pqCondition
       this.page = this.queryCondition.current
       this.size = this.queryCondition.size
      //获取区域数据
      let data = await getSdcParkPlaceSiteTree()
      this.condition = modifyData(data.data.data.treeList)
      
      if(this.parkId) {
        this.queryInfo()
      }
      
      console.log(this.$refs,'this.$refs.plate');
      
    },
    initPlate() {
      this.$nextTick(() => {
        this.$refs.plate.onload = () => {
          this.plateWidth = this.basicWidth = this.$refs.plate.width
          this.plateHeight = this.basicHeight = this.$refs.plate.height
        }
        
      
      //拖拽图片
      this.$refs.plate.ondragenter = (e) => {
          e.preventDefault();
        };

        this.$refs.plate.ondragstart = (e) => {
          startx = e.clientX;
          startY = e.clientY;

          this.$refs.plate.ondrag = (e) => {
            let lengthX = e.clientX - startx;
            let lengthY = e.clientY - startY;
            this.$refs.plate.style.top = this.plateY + lengthY + "px";
            this.$refs.plate.style.left = this.plateX + lengthX + "px";
          };

          this.$refs.plate.ondragend = (e) => {
            this.$refs.plate.ondrag = this.$refs.plate.ondragend = null;
            let lengthX = e.clientX - startx;
            let lengthY = e.clientY - startY;
            this.$refs.plate.style.top = this.plateY + lengthY + "px";
            this.$refs.plate.style.left =
              this.plateX + lengthX + "px";
            this.plateX += lengthX;
            this.plateY += lengthY;
            startx = 0;
            startY = 0;
          };
        };
      })
    },
    //根据车位区间查询信息
    getSdcParkPlace() {
      getSdcParkPlaceBy(parseInt(this.plateStart),parseInt(this.plateEnd)).then(res => {
        let result = res.data.data
        for (let index = 0; index < result.length; index++) {
          const el = result[index];
          el.width = this.plateWidth
          el.height = this.plateHeight
          el.deg = this.plateDeg
          if( index === 0) {
            el.x = this.plateX
            el.y = this.plateY
          } else {
            if(this.plateDeg === 0) {
              el.x = this.plateX + index * (this.plateWidth + 10)
              el.y = this.plateY
            } else if (this.plateDeg === 90) {
              el.x = this.plateX 
              el.y = this.plateY + index * (this.plateWidth + 10)
            } else {
              el.x = this.plateX + index * (this.plateWidth + 10)
              el.y = this.plateY + index * (this.plateWidth + 10) * Math.tan(this.plateDeg * ( Math.PI/180))
            }
            
          }
        }
        this.newPlateInfo = result
        this.$refs.plate.style.top = 5 + "px";
        this.$refs.plate.style.left = 5 + "px";
      })
    },
    updateInfo(data) {
      console.log(data,'data 1111');
      for (let index = 0; index < this.newPlateInfo.length; index++) {
        const el = this.newPlateInfo[index];
        if(el.id === data.id) {
          el.x = data.x
          el.y = data.y
          el.width = data.width
          el.height = data.height
        }
      }
    },
    updateSdcParkPlace() {
      batchUpdateSdcParkPlace(this.newPlateInfo).then( res => {
        console.log(res,'res update 11111');
      })
    },
    setQueryCondition() {
      this.queryCondition = {
        current:this.page,
        size: this.size
      }
      this.parkId ? this.queryCondition.parkId = this.parkId : null
      this.parkPlaceCode ? this.queryCondition.name = this.parkPlaceCode : null
      this.status ? this.queryCondition.status = this.status : null
      if(this.dueDate) {
        this.queryCondition['expand.expiryEndBegin'] = moment(this.dueDate[0]).format('YYYY-MM-DD HH:mm:ss')
        this.queryCondition['expand.expiryEndEnd'] = moment(this.dueDate[1]).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    async addInfo() { 
      this.changeComponent(false,false,'新建车位信息',1,null,this.queryCondition,this.address,this.parkId)
      this.dialogKey = new Date().toString()
    },
    changeComponent(psDisabled,isdisabled,title,actionType,inputFormData, queryCondition,siteId,normalParkId) {
      this.$emit('changeCurrentCompent',{
        currentCompent: 'parkPlacePoint',
        psDisabled,
        isdisabled,
        title,
        actionType,
        inputFormData,
        queryCondition,
        siteId,
        normalParkId
      })
    },
    queryInfoClick() {
      this.setQueryCondition()
      this.queryCondition.current  = 1
      this.queryInfo()
    },
    async queryInfo() {
      if(!this.queryCondition.parkId) {
        this.$notify({
          title: '失败',
          message: '停车场名称必选',
          type: 'error',
          duration: 5000
        })
      } else {
        let tableData = await getSdcParkPlaceTable(this.queryCondition)
        this.tableInfo = tableData.data.data.records
        this.parkId ? null : this.parkId = this.tableInfo[0].parkId
        this.getInfo()
        this.setpage(tableData.data.data);
      }
      
    },
    clearCondition() {
      this.parkId = null
      this.parkPlaceCode = null
      this.status = null
      this.dueDate = null
      this.address = []
      // this.changeAddress()
      this.parkDisabled = true
    },
    async changeAddress(val) {
      if (val) {
        if (val.length === 0) {
          this.parkId = null
        }
      }     
      this.parkingMap = []
      console.log(this.address,'this.address');
      if(this.address.length !== 0) {
        this.parkDisabled = false
        let tableData = await getSdcParkingLotBySiteId(this.address[this.address.length - 1])
        tableData.data.data.forEach((el) => {
          this.parkingMap.push({
            value: el.id,
            label: el.name,
          });
        });
      }else {
        this.parkDisabled = true
      }
    },
    tableAction(row,flag) {
      if(flag === 3) {
        this.changeComponent(true,true,'查看车位信息',3,clone(row),this.queryCondition,this.address)
      } else if( flag === 2) {
        this.changeComponent(true,false,'编辑车位信息',2,clone(row),this.queryCondition,this.address)
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
        code: null,  //车位编号
        name: null,  //车位名称
        parkId: null,  //停车场名称
        area:null,
        expiryEnd: null,
        status: null,
        remarks:null
      }
      this.isdisabled = false
    },
    changeSite() {

    },
    deleteData() {
      sdcParkPlaceAction('', '/'+this.delId, "delete").then(() => {
        this.dialogVisible = false
        this.init()
      })
    },
    setParkName(val) {
      let text
      for (let index = 0; index < this.parkingNameMap.length; index++) {
        const el = this.parkingNameMap[index];
        if (el.value === val.parkId) {
          text = el.label
          break;
        }
      }
      return text
    },
    setExpiryEnd(val) {
      console.log(val);
      return moment(val.expiryEnd).format('YYYY-MM-DD HH:mm:ss')
    },
    setStatus(val) {
      let statusMap = this.$dictUtils.getDictList('park_space_type')
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
    async getParkInfo() {
      let tableData = await getSdcParkingLotTable({
        current: 1,
        size: 100
      })
      this.parkData = tableData.data.data.records
      // this.parkPlateId = this.parkData[0].id
      // this.getInfo()
    },
    async getInfo() {
      this.deviceInfo = []
      let siteId
      for (let index = 0; index < this.parkData.length; index++) {
        const el = this.parkData[index];
        if(el.id === this.parkId) {
          // this.parkInfo = el
          siteId = el.siteId
          break;
        }
      }

      let parkData = await getParkDataBySiteId(siteId)
      //停车场地图信息
      // this.plateImg = parkData.data.data[0].roomInfos[0].siteImg
      this.plateImg = parkData.data.data.siteImg
      let data = await getSdcParkPlaceTable({ current:1,size:200,parkId: this.parkId })
      //停车场车位信息
        for (let index = 0; index < data.data.data.records.length; index++) {
          const el = data.data.data.records[index];
          this.deviceInfo.push(el)
        }
        this.showFlag = true
        this.initPlate()
    }
  }
}
</script>

<style>

</style>