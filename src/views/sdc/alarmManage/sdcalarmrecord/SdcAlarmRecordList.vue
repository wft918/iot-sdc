<template>
  <div>
    <basic-container>
    <el-row :gutter="10">
    <el-col :span="24">
     <el-card  shadow="never" :body-style="contentViewHeight">
      <el-form :inline="true" v-show="isSearchCollapse" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
        <!-- 搜索框-->
        <!-- <el-form-item label="告警ID" prop="serialNo">
          <el-input v-model="searchForm.serialNo" placeholder="请输入告警ID"></el-input>
        </el-form-item> -->
        <el-form-item label="告警等级"  prop="alarmLevelId">
          <el-select v-model="searchForm.alarmLevelId" placeholder="请选择" size="small" style="width: 100%;">
            <el-option
              v-for="item in $dictUtils.getDictList('alarm_level')"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理状态"  prop="status">
          <el-select v-model="searchForm.status" placeholder="请选择" size="small" style="width: 100%;">
            <el-option
              v-for="item in $dictUtils.getDictList('tele_alarm_deal_status')"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所处位置" prop="deviceSiteId">
          <el-cascader
            ref="siteChoose"
            :options="siteData"
            v-model="searchForm.deviceSiteId"
            clearable
            @change="changeAddress"
            :props="{ checkStrictly: false, value: 'id', label: 'name', children: 'children' }"
          >
        </el-cascader>
        </el-form-item>
        <el-form-item label="告警时间" prop="">
          <el-date-picker
            v-model="alarmTimeRange"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right">
          </el-date-picker>
        </el-form-item>   
        <el-form-item label="告警标题" prop="alarmCodeDesc">
          <el-input v-model="searchForm.alarmCodeDesc" placeholder="请输入告警标题"></el-input>
        </el-form-item>
        <el-form-item label="设备类型" prop="deviceType" >
          <el-cascader 
            :options="devTypeList" 
            v-model="searchForm.deviceType"
            :props="{ checkStrictly: true, value: 'id', label: 'name', children: 'children' }"
            clearable 
            filterable
            @change="changepType"
            ref="typelist"
          ></el-cascader>
        </el-form-item>
          <el-button type="primary" @click="refreshList()" size="small">查询</el-button>
          <el-button @click="resetSearch()" size="small">重置</el-button>
      </el-form>
        <!-- 导入导出-->
      <!-- <el-form :inline="true" v-show="isImportCollapse"  class="query-form" ref="importForm">
         <el-form-item>
          <el-button type="default" @click="downloadTpl()" size="small">下载模板</el-button>
         </el-form-item>
         <el-form-item prop="loginName">
            <el-upload
              class="upload-demo"
              :action="`${this.$http.BASE_URL}/sdc/sdcalarmrecord/sdcAlarmRecord/import`"
              :on-success="uploadSuccess"
               :show-file-list="true">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只允许导入“xls”或“xlsx”格式文件！</div>
            </el-upload>
        </el-form-item>
      </el-form> -->
      <el-row>
        <!-- <el-button v-if="hasPermission('sdc:sdcalarmrecord:sdcAlarmRecord:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
        <el-button v-if="hasPermission('sdc:sdcalarmrecord:sdcAlarmRecord:edit')" type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
         :disabled="dataListSelections.length != 1" plain>修改</el-button>
        <el-button v-if="hasPermission('sdc:sdcalarmrecord:sdcAlarmRecord:del')" type="danger"   size="small" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0" plain>删除
        </el-button> -->
        <el-button-group class="pull-right">
            <el-button
              type="default"
              size="small"
              icon="el-icon-search"
              @click="isSearchCollapse = !isSearchCollapse, isImportCollapse=false">
            </el-button>
            <!-- <el-button v-if="hasPermission('sdc:sdcalarmrecord:sdcAlarmRecord:import')" type="default" size="small" icon="el-icon-upload2" title="导入" @click="isImportCollapse = !isImportCollapse, isSearchCollapse=false"></el-button> -->
            <el-button  type="default" size="small" icon="el-icon-download" title="导出" @click="exportExcel()" :disabled="!exportDisable"></el-button>
            <el-button
              type="default"
              size="small"
              icon="el-icon-refresh"
              @click="refreshList">
            </el-button>
        </el-button-group>
      </el-row>
    <el-table
      :data="dataList"
      border
      size="medium"
      v-loading="loading"
      :height="tableHeight"
      @selection-change="selectChange"
      class="table">
      <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        fixed="left"
        type="index"
        label="序号"
        align="center"
        width="50"
        sortable
        ></el-table-column>
      <!-- <el-table-column 
        align="center"
        prop="serialNo"
        show-overflow-tooltip
        label="告警ID">
      </el-table-column> -->
      <el-table-column
        fixed="left"
        align="center"
        prop="alarmLevel"
        show-overflow-tooltip
        width="120"
        label="告警等级">
        <template slot-scope="scope">
          <img v-if="scope.row.alarmLevel === '1'" src="~@/assets/img/alarmLevel1.png">
          <img v-if="scope.row.alarmLevel === '2'" src="~@/assets/img/alarmLevel2.png">
          <img v-if="scope.row.alarmLevel === '3'" src="~@/assets/img/alarmLevel3.png">
          <img v-if="scope.row.alarmLevel === '4'" src="~@/assets/img/alarmLevel4.png">
          <span style="margin-left:10px;">{{ $dictUtils.getDictLabel("alarm_level", scope.row.alarmLevel, '-') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="left"
        width="240"
        prop="siteName"
        header-align="center"
        show-overflow-tooltip
        label="所处位置">
      </el-table-column>
      <el-table-column 
        fixed="left"
        align="left"
        width="240"
        prop="deviceName"
        header-align="center"
        show-overflow-tooltip
        label="告警设备">
      </el-table-column>
      <el-table-column 
        align="center"
        width="100"
        prop="dealStatus"
        show-overflow-tooltip
        label="状态">
        <template slot-scope="scope">
          <img v-if="scope.row.dealStatus === '0'" src="~@/assets/img/unconfirmed.png">
          <img v-if="scope.row.dealStatus === '1'" src="~@/assets/img/confirmed.png">
          <img v-if="scope.row.dealStatus === '2'" src="~@/assets/img/eliminated.png">
          <span style="margin-left:10px;">{{ $dictUtils.getDictLabel("tele_alarm_deal_status", scope.row.dealStatus, '-') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="180"
        prop="alarmTime"
        align="center"
        show-overflow-tooltip
        label="告警时间">
      </el-table-column>
      <el-table-column
        width="180"
        prop="alarmEndTime"
        align="center"
        show-overflow-tooltip
        label="告警消除时间">
      </el-table-column>
      <el-table-column 
        header-align="center"
        prop="alarmCodeDesc"
        show-overflow-tooltip
        width="240"
        label="告警标准名称">
      </el-table-column>
      <el-table-column 
        align="center"
        prop="alarmRemark2"
        width="240"
        show-overflow-tooltip
        label="确认意见">
      </el-table-column>
      <el-table-column 
        width="150"
        align="center"
        prop="alarmTypeDesc"
        show-overflow-tooltip
        label="告警分类">
      </el-table-column>
      <el-table-column 
        align="center"
        prop="mid"
        show-overflow-tooltip
        width="100"
        label="监测点">
      </el-table-column>
      <el-table-column 
        align="center"
        prop="eventValue"
        show-overflow-tooltip
        width="100"
        label="测点值">
      </el-table-column>
      <el-table-column 
        align="center"
        label="操作"
        fixed="right"  
      >
        <template  slot-scope="scope">
          <el-button  type="text" icon="el-icon-view" size="small" @click="view(scope.row)">查看</el-button>
          <!-- <el-button  v-if="scope.row.dealStatus === '0'" type="text" icon="el-icon-view" size="small" @click="deviceAction(scope.row, 1)">确认</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="current"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="size"
      :total="total"
      background
      style="margin-top: 15px"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    </el-card>
    </el-col>
    </el-row>
    </basic-container>
        <!-- 弹窗, 新增 / 修改 -->
    <!-- <SdcAlarmRecordForm  ref="sdcAlarmRecordForm" @refreshDataList="refreshList"></SdcAlarmRecordForm> -->
    <!-- 查看对话框 -->
    <el-dialog
      title="查看记录"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="visible">
      <el-form 
        :model="viewForm" 
        ref="viewFormRef"
        :disabled="true"
        label-width="120px">
        <el-row :gutter="15">
          <!-- <el-col :span="12">
            <el-form-item label="告警ID" prop="serialNo">
              <el-input v-model="viewForm.serialNo"></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="设备编号" prop="deviceCode">
              <el-input v-model="viewForm.deviceCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="告警设备" prop="deviceName">
              <el-input v-model="viewForm.deviceName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属站点" prop="siteName">
              <el-input v-model="viewForm.siteName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="告警等级" prop="alarmLevel">
              <el-select v-model="viewForm.alarmLevel" style="width: 100%;">
                <el-option
                  v-for="item in $dictUtils.getDictList('alarm_level')"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="dealStatus">
              <el-select v-model="viewForm.dealStatus" style="width: 100%;">
                <el-option
                  v-for="item in $dictUtils.getDictList('tele_alarm_deal_status')"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="告警分类" prop="alarmTypeDesc">
              <el-input v-model="viewForm.alarmTypeDesc"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="告警标准名称" prop="alarmCodeDesc">
              <el-input v-model="viewForm.alarmCodeDesc"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="告警时间" prop="alarmTime">
              <el-date-picker
                style="width: 100%;"
                v-model="viewForm.alarmTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="告警值" prop="eventValue">
              <el-input v-model="viewForm.eventValue"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import SdcAlarmRecordForm from './SdcAlarmRecordForm'
  import { updateAlarmLog, AlarmExport } from "@/api/sdc/deviceInfo";
  import { sdcSiteAction } from "@/api/sdc/addressInfo";
  import { sdcDeviceTypeAction, } from "@/api/sdc/deviceType"
  import { modifyData } from "@/util/domainFilter";
  import _ from "lodash"
  import moment from "moment";
  export default {
    data () {
      return {
        searchForm: {
          alarmLevelId: '',
          deviceSiteId: '',
          deviceType: '',
          status: '',
          alarmTime: '',
          alarmCodeDesc: ''
        },
        queryCondition: {},
        // activeName: 'third',
        dataList: [],
        current: 1,
        size: 50,
        total: 0,
        // orderBy: '',
        filterText: '',
        selectName: '',
        leftTreeData: [],
        siteData: [],
        // devTypeList: [],
        // dataListSelections: [],
        isSearchCollapse: true,
        isImportCollapse: false,
        loading: false,
        viewForm: {},
        visible: false,
        alarmTimeRange: '',
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
        devTypeList: [],
        selections: []
      }
    },
    components: {
      // SdcAlarmRecordForm
    },
    activated () {
      this.refreshList()
      // this.refreshTree()
    },
    created () {
      this.refreshList()
      // this.refreshTree()
      this.getSiteData();
      this.getDevTypeList()
    },
    watch: {
      filterText (val) {
        this.$refs.leftTree.filter(val)
      }
    },
    computed: {
      contentViewHeight () {
        let height = this.$store.state.common.documentClientHeight - 122
        return {minHeight: height + 'px'}
      },
      tableHeight() {
        return this.isSearchCollapse ? '530' : '620'
      },
      exportDisable() {
        return this.selections.length > 0
      }
    },
    methods: {
      async getSiteData() {
        let data = await sdcSiteAction("", "/tree", "get");
        this.siteData = modifyData(data.data.data);
      },
      async getDevTypeList() {
        let devTypeData = await sdcDeviceTypeAction("", "/tree", "get")
        this.devTypeList = modifyData(devTypeData.data.data)
      },
      changeAddress(val) {
        if (val.length === 0) {
          this.searchForm.deviceSiteId = ''
        } else {
          this.searchForm.deviceSiteId = val[val.length - 1];
        }
       },
      // 设置查询条件
      setQueryCondition() {
        this.queryCondition = {
          current: 1,
          size: this.size
        }
        this.searchForm.status ? this.queryCondition.dealStatus = this.searchForm.status : ''
        this.searchForm.deviceSiteId ? this.queryCondition.siteId = this.searchForm.deviceSiteId : ''
        this.searchForm.alarmLevelId ? this.queryCondition.alarmLevel = this.searchForm.alarmLevelId : ''
        this.searchForm.alarmCodeDesc ? this.queryCondition.alarmCodeDesc = this.searchForm.alarmCodeDesc : ''
        this.searchForm.deviceType ? this.queryCondition.deviceType = this.searchForm.deviceType[this.searchForm.deviceType.length - 1] : ''
        this.alarmTimeRange ? (
          this.queryCondition.startTime = moment(this.alarmTimeRange[0]).format('YYYY-MM-DD'),
          this.queryCondition.endTime = moment(this.alarmTimeRange[1]).format('YYYY-MM-DD')      
          ) : ''
      },
      deviceAction(val, flag) {
        let data = val;
        data.dealStatus = flag === 1 ? "1" : "2";
        updateAlarmLog(data);
        this.refreshList();
     },

      // 获取数据列表
      refreshList () {
        this.loading = true
        this.setQueryCondition()
        this.request({
          url: '/api-sdc/sdcsimulatoralarm/page',
          method: 'get',
          params: {
            'current': this.current,
            'size': this.size,
            ...this.queryCondition
          }
        }).then(({data}) => {
          if (data.code === 0) {
            console.log(data);
            this.dataList = data.data.records
            this.total = data.data.total
            this.loading = false
          }
        })
      },
      // changeRowBgColor({ row, rowIndex }) {
      // let styleJson =  { "color":  row.alarmLevel.alarmColor };
      // return styleJson;
      // },
      // 每页数
      sizeChangeHandle (val) {
        this.size = val
        this.current = 1
        this.refreshList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.current = val
        this.refreshList()
      },
      // 查看
      view (row) {
        // this.$refs.sdcAlarmRecordForm.init('view', id)
        this.viewForm = _.cloneDeep(row)
        this.visible  = true
      },
      // 下载模板
      // downloadTpl () {
      //   this.$utils.download('/alarm/sdc/sdcalarmrecord/sdcAlarmRecord/import/template')
      // },
      // exportExcel () {
      //   let params = {
      //     ...this.searchForm
      //   }
      //   this.$utils.download('/alarm/sdc/sdcalarmrecord/sdcAlarmRecord/export', params)
      // },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.alarmTimeRange = ''
        this.searchForm = {
          alarmLevelId: '',
          deviceSiteId: '',
          deviceType: '',
          status: '',
          alarmTime: '',
          alarmCodeDesc: ''
        }
        this.current = 1
        this.refreshList()
      },
      changepType() {},
      selectChange(selection) {
        this.selections = []
        selection.forEach(item => {
          this.selections.push(item.id)
        })
      },
      exportExcel() {
        if (this.selections.length > 0) {
          AlarmExport(this.selections).then( res => {
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
        }
      },
    }
  }
</script>
<style lang="scss">
 @import "@/assets/scss/xps.scss";
</style>
