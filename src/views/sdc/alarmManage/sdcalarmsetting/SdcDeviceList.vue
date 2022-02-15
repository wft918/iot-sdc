<template>
  <div>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
     v-dialogDrag
     append-to-body
     width="65%"
    :visible.sync="visible">
    <el-form :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
         <el-form-item>
         <el-form-item label="所处位置" prop="siteId">
            <el-cascader
              ref="siteChoose"
              :options="siteData"
              v-model="searchForm.siteId"
              clearable
              @change="changeAddress"
              :props="{ value: 'id', label: 'name', children: 'children' }"
            >
            </el-cascader>
          </el-form-item>   
            <el-button type="primary" @click="refreshList()" size="small">查询</el-button>
            <el-button @click="resetSearch()" size="small">重置</el-button>
          </el-form-item>
      </el-form>
    <el-tabs >
    <el-tab-pane label="未选择设备列表">
      <el-row>
        <el-button-group class="pull-right">
            <el-button
              type="default"
              size="small"
              icon="el-icon-refresh"
              @click="refreshUnSelectList">
            </el-button>
        </el-button-group>
      </el-row>
      <el-table
      :data="unSelectDataList"
      border
      @selection-change="selectionChangeUnSelectHandle"
      @sort-change="sortChangeUnSelectHandle"
      v-loading="loading"
      size="medium"
      height="436px"
      class="table"> 
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="sdcDevice.name"  
        show-overflow-tooltip
        label="设备名称"
        sortable
        width="180"
      >
      </el-table-column>
      <el-table-column prop="sdcDevice.code" show-overflow-tooltip label="设备序列号" width="180">
      </el-table-column>
      <el-table-column prop="sdcDevice.typeName" show-overflow-tooltip label="产品类型"> </el-table-column>
      <el-table-column prop="sdcDevice.siteName" show-overflow-tooltip label="所处位置">
      </el-table-column>
      <el-table-column
        prop="sdcDevice.deviceStatus" show-overflow-tooltip
        label="设备状态"
      >
        <template slot-scope="scope">
            {{ $dictUtils.getDictLabel("device_status", scope.row.sdcDevice.deviceStatus, '-') }}
        </template>
      </el-table-column>
      <el-table-column prop="sdcDevice.beginRunTime" show-overflow-tooltip label="投入运行时间">
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeUnSelectHandle"
      @current-change="currentChangeUnSelectHandle"
      :current-page="unSelectPageNo"
      :page-sizes="[1,10, 20, 50, 100]"
      :page-size="unSelectPageSize"
      :total="unSelectTotal"
      background
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
      <el-row class="pull-right">
          <el-button :disabled="unSelectDataListSelections.length <= 0"
            type="primary"
            @click="doSelect()"
            v-noMoreClick
            >选择</el-button
          >
        </el-row >
    </el-tab-pane>
      <el-tab-pane label="已选择设备列表">
        <el-row>
          <el-button-group class="pull-right">
            <el-button
                type="default"
                size="small"
                icon="el-icon-refresh"
                @click="refreshSelectList">
              </el-button>
          </el-button-group>
        </el-row>
        <el-table
        :data="selectDataList"
        border
        @selection-change="selectionChangeSelectHandle"
        @sort-change="sortChangeSelectHandle"
        v-loading="loading"
        size="medium"
        height="436px"
        class="table"> 
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          prop="sdcDevice.name"  
          show-overflow-tooltip
          label="设备名称"
          sortable
          width="180"
        >
        </el-table-column>
        <el-table-column prop="sdcDevice.code" show-overflow-tooltip label="设备序列号" width="180">
        </el-table-column>
        <el-table-column prop="sdcDevice.typeName" show-overflow-tooltip label="产品类型"> </el-table-column>
        <el-table-column prop="sdcDevice.siteName" show-overflow-tooltip label="所处位置">
        </el-table-column>
        <el-table-column
          prop="sdcDevice.deviceStatus" show-overflow-tooltip
          label="设备状态"
        >
          <template slot-scope="scope">
              {{ $dictUtils.getDictLabel("device_status", scope.row.sdcDevice.deviceStatus, '-') }}
          </template>
        </el-table-column>
        <el-table-column prop="sdcDevice.beginRunTime" show-overflow-tooltip label="投入运行时间">
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="sizeChangeSelectHandle"
        @current-change="currentChangeSelectHandle"
        :current-page="selectPageNo"
        :page-sizes="[1,10, 20, 50, 100]"
        :page-size="selectPageSize"
        :total="selectTotal"
        background
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
      <el-row class="pull-right">
          <el-button
            type="primary"
            @click="doCancelSelect()"
            v-noMoreClick :disabled="selectDataListSelections.length <= 0"
            >取消选择</el-button
          >
        </el-row>
      </el-tab-pane>
    </el-tabs>
        <template slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
      </template>
  </el-dialog>
  </div>
</template>

<script>
  import SelectTree from '@/components/treeSelect/treeSelect.vue'
  import { sdcSiteAction } from "@/api/sdc/addressInfo";
  import { modifyData } from "@/util/domainFilter";

  export default {
    data () {
      return {
        settingId: '',
        deviceType: '',
        title: '',  
        searchForm: {
          siteId: ''
        },   
        siteData: [],
        selectDataList: [],
        selectPageNo: 1,
        selectPageSize: 10,
        selectTotal: 0,
        selectOrderBy: '',
        selectDataListSelections: [],
        unSelectDataList: [],
        unSelectPageNo: 1,
        unSelectPageSize: 10,
        unSelectTotal: 0,
        unSelectOrderBy: '',
        unSelectDataListSelections: [],
        visible: false,
        loading: false
      }
    },
    components: {
      SelectTree,
    },
     watch: {
      filterText (val) {
        this.$refs.sdcDeviceTypeTree.filter(val)
      }
    },
    computed: {
      contentViewHeight () {
        let height = this.$store.state.common.documentClientHeight - 122
        return {minHeight: height + 'px'}
      }
    },
    methods: {
      init (settingId,deviceType) {
        this.settingId = settingId
        this.deviceType = deviceType
        this.visible = true
        this.title = "设备选择"
        this.searchForm.deviceType = deviceType
        this.getSiteData()
        this.refreshSelectList()
        this.refreshUnSelectList()
      },
      refreshList(){
        this.refreshSelectList()
        this.refreshUnSelectList()
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      },
      async getSiteData() {
        let data = await sdcSiteAction("", "/tree", "get");
        this.siteData = modifyData(data.data.data);
      },
      changeAddress(val) {
        this.searchForm.siteId = val[val.length - 1];
       },
      // 获取已选择设备数据列表
      refreshSelectList () {
        this.loading = true
        this.$http({
          url: '/alarm/sdc/sdcalarmsetting/sdcAlarmSettingDevice/list',
          method: 'get',
          params: {
            'pageNo': this.selectPageNo,
            'pageSize': this.selectPageSize,
            'orderBy': this.selectOrderBy,
            'settingId': this.settingId,
            'deviceType': this.deviceType,
            ...this.searchForm
          }
        }).then(({data}) => {
          if (data && data.success) {
            this.selectDataList = data.page.list
            this.selectTotal = data.page.count
            this.loading = false
          }
        })
      },
      // 每页数
      sizeChangeSelectHandle (val) {
        this.selectPageSize = val
        this.selectPageNo = 1
        this.refreshSelectList()
      },
      // 当前页
      currentChangeSelectHandle (val) {
        this.selectPageNo = val
        this.refreshSelectList()
      },
      // 多选
      selectionChangeSelectHandle (val) {
        this.selectDataListSelections = val
      },
      // 排序
        sortChangeSelectHandle (obj) {
          if (obj.selectOrderBy === 'ascending') {
            this.selectOrderBy = obj.prop + ' asc'
          } else if (obj.order === 'descending') {
            this.selectOrderBy = obj.prop + ' desc'
          } else {
            this.selectOrderBy = ''
          }
          this.refreshSelectList()
        },
     doCancelSelect(){
        this.loading = true
        let deviceIds = this.selectDataListSelections.map(item => {
          return item.sdcDevice.id
        }).join(',')
        this.$http({
              url: `/alarm/sdc/sdcalarmsetting/sdcAlarmSettingDevice/deleteByDeviceId`,
              method: 'delete',
              params: {'settingId': this.settingId,'deviceIds':deviceIds}
            }).then(({data}) => {
              this.loading = false
              if (data && data.success) {
                this.$message.success(data.msg)              
                this.refreshSelectList()
                this.refreshUnSelectList()
              }
                this.loading = false
            })
     },
    refreshUnSelectList () {
        this.loading = true
        this.$http({
          url: '/alarm/sdc/sdcalarmsetting/sdcAlarmSettingDevice/list',
          method: 'get',
          params: {
            'pageNo': this.unSelectPageNo,
            'pageSize': this.unSelectPageSize,
            'orderBy': this.unSelectOrderBy,
            'settingId': '',
            'deviceType': this.deviceType,
            ...this.searchForm
          }
        }).then(({data}) => {
          if (data && data.success) {
            this.unSelectDataList = data.page.list
            this.unSelectTotal = data.page.count
            this.loading = false
          }
        })
      },
      // 每页数
      sizeChangeUnSelectHandle (val) {
        this.unSelectPageSize = val
        this.unSelectPageNo = 1
        this.refreshUnSelectList()
      },
      // 当前页
      currentChangeUnSelectHandle (val) {
        this.unSelectPageNo = val
        this.refreshUnSelectList()
      },
      // 多选
      selectionChangeUnSelectHandle (val) {
        this.unSelectDataListSelections = val
      },
      // 排序
      sortChangeUnSelectHandle (obj) {
          if (obj.orderBy === 'ascending') {
            this.unselectOrderBy = obj.prop + ' asc'
          } else if (obj.orderBy === 'descending') {
            this.unselectOrderBy = obj.prop + ' desc'
          } else {
            this.unselectOrderBy = ''
          }
          this.refreshUnSelectList()
        },
      doSelect(){
        this.loading = true
        let deviceIds = this.unSelectDataListSelections.map(item => {
          return item.sdcDevice.id
        }).join(',')
        this.$http({
              url: `/alarm/sdc/sdcalarmsetting/sdcAlarmSettingDevice/batchRelated`,
              method: 'post',
              params: {'settingId': this.settingId,'deviceIds':deviceIds}
            }).then(({data}) => {
              if (data && data.success) {
                this.$message.success(data.msg)      
                this.refreshSelectList()
                this.refreshUnSelectList()
              }
              this.loading = false
            })
     },
    }
  }
</script>