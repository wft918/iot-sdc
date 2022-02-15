<template>
  <basic-container>
    <el-row :gutter="15">   
      <!-- 表格 -->
      <el-row>
        <el-col :span="9" :offset="1">
          <span>所处位置：</span>
          <el-cascader 
            ref="siteChoose"
            :options="siteData" 
            style="width:70%" 
            v-model="querySiteId"
            @change="changeSite"
            :props="{value: 'id', label: 'name', children: 'children'}"
          >
          </el-cascader>
        </el-col>
        <el-col :span="13">
          <span>日期：</span>
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="dateChange">
          </el-date-picker>
        </el-col>
        <el-col :span="1">
          <el-tooltip effect="dark" content="显隐" placement="top">
            <el-button circle="" @click="chooseColumn" size="small" icon="el-icon-menu"></el-button>
          </el-tooltip>
        </el-col>
      </el-row>
      <el-table
        :data="recordTable" 
        border 
        row-key="id"
        style="margin: 0.75rem 0"
      >
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column
          v-if="columnList[0].show"
          prop="expand.siteName"
          label="名称"
          align="center"
        ></el-table-column>
        <el-table-column
          v-if="columnList[1].show"
          label="所处位置"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.expand">{{scope.row.expand.siteNames.join('/')}}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="columnList[2].show"
          prop="capacityRackPercent"
          label="机柜空间容量(%)"
          align="center"
        ></el-table-column>
        <el-table-column
          v-if="columnList[3].show"
          prop="capacityUnitPercent"
          label="U位空间容量(%)"
          align="center"
        >
        </el-table-column>
        <el-table-column
          v-if="columnList[4].show"
          prop="capacityPowerPercent"
          label="电力容量(%)"
          align="center"
        >
        </el-table-column>
        <el-table-column
          v-if="columnList[5].show"
          prop="capacityCoolPercent"
          label="制冷容量(%)"
          align="center"
        >
        </el-table-column>
        <el-table-column
          v-if="columnList[6].show"
          prop="dataDate"
          label="日期"
          align="center"
        ></el-table-column>
      </el-table>
      <Pagination
        :page="PageInfo.page"
        :size="PageInfo.size"
        :total="PageInfo.total"
        :key="PageKey"
        @pagination="queryByPage"
      ></Pagination>
    </el-row>
    <el-row>
      <div id="lineDom" ref="lineDomRef"></div>
    </el-row>
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
</template>

<script>
import Pagination from "@/components/Pagination";
import _ from "lodash"
import { sdcSiteAction } from "@/api/sdc/addressInfo";
import { getCapacityTrend, getTrendList } from "@/api/sdc/capacityManage"
import { modifyData} from "@/util/domainFilter";
import { getFirstChild } from "@/util/getFirstChild";
import moment from "moment";
export default {
  components: {
    Pagination
  },
  data() {
    return {
      siteData: [],
      firstChild: [],
      dateRange: [new Date(new Date().toLocaleDateString()).getTime() - (3600 * 1000 * 24 * 7), new Date(new Date().toLocaleDateString()).getTime()],
      listCondition: {
        current: 1,
        size: 10
      },
      chartCondition: {},
      // 表格相关
      querySiteId: null,
      recordTable: [],
      // 分页器
      PageInfo: {
        page: 1,
        size: 10,
        total: 0
      },
      PageKey: Math.random().toString(36).slice(-6),
      // 折线图相关
      lineOption: {
        legend: {
          right: '0%'
        },
        tooltip : {
          trigger: 'axis',
          axisPointer: {
              type: 'line',
              label: {
                  backgroundColor: '#6a7985'
              }
          }
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value',
          scale: true
        },
        series: [
          {
            type: 'line',
            name: 'U位空间容量'
          },
          {
            type: 'line',
            name: '机柜空间容量'
          },
          {
            type: 'line',
            name: '电力容量'
          },
          {
            type: 'line',
            name: '制冷容量'
          }
        ]
      },
      columnList: [
        {
          prop: 'siteName',
          label: '名称',
          show: true
        },
        {
          prop: 'siteNames',
          label: '名称',
          show: false
        },
        {
          prop: 'capacityRackPercent',
          label: '机柜空间容量(%)',
          show: true
        },
        {
          prop: 'capacityUnitPercent',
          label: 'U位空间容量(%)',
          show: true
        },
        {
          prop: 'capacityPowerPercent',
          label: '电力容量(%)',
          show: true
        },
        {
          prop: 'capacityCoolPercent',
          label: '制冷容量(%)',
          show: true
        },
        {
          prop: 'dataDate',
          label: '日期',
          show: true
        }
      ],
      dialogColumnVisible: false
    }
  },
  created() {
    this.getSiteData()
  },
  methods: {
    /**
     * 网络请求
     */
    // 获取树形目录数据
    async getSiteData() {
      let data = await sdcSiteAction("", "/tree", "get");
      let mData = modifyData(data.data.data);
      this.siteData = this.setDisable(mData)
      getFirstChild(this.siteData, this.firstChild, 'R00')
      this.querySiteId= this.firstChild[0].id
      console.log(this.querySiteId, 'this.querySiteId');
      this.setListCondition()
      this.setChartCondition()
      this._getTrendList(this.listCondition)
      this._getCapacityTrend(this.chartCondition)
    },
    // 获取列表数据
    _getTrendList(params) {
      getTrendList(params).then(res => {
        if (res.data.code === 0) {
          console.log(res, 'list');
          let data = res.data.data
          this.recordTable = data.records
          this.PageInfo.total = data.total
          this.PageInfo.current = data.current        
        } else {
          this.$message.error('获取列表数据出错，请刷新重试')
        }
      })
    },
    // 获取图表数据
    _getCapacityTrend(params) {
      getCapacityTrend(params).then(res => {
        let data = res.data.data
        if (data.length !== 0) {
          let unitYdata = data.unitYdata,
              rackYdata = data.rackYdata,
              powerYdata = data.powerYdata,
              coolYdata = data.coolYdata
          this.lineOption.xAxis.data = data.date
          this.lineOption.series[0].data = unitYdata
          this.lineOption.series[1].data = rackYdata
          this.lineOption.series[2].data = powerYdata
          this.lineOption.series[3].data = coolYdata
          let lineChart = this.$echarts.init(this.$refs.lineDomRef)
          lineChart.setOption(this.lineOption)
        }         
      })
    },

    /**
     * 事件监听
     */
    setDisable (data) {
      data.forEach(item => {
        if (item.type !== 'R00' && !item.children) {
          item.disabled = true
        } else {
          if (item.children && item.children.length) {
            this.setDisable(item.children)
          }
        }
      })
      return data
    },
    chooseColumn() {
      this.dialogColumnVisible = true
    },
    changeSite() {
      this.setListCondition()
      this.setChartCondition()
      this._getTrendList(this.listCondition)
      this._getCapacityTrend(this.chartCondition)
    },
    dateChange() {
      this.setListCondition()
      this.setChartCondition()
      this._getTrendList(this.listCondition)
      this._getCapacityTrend(this.chartCondition)
    },
    // 分页器事件
    queryByPage(info) {
      this.PageInfo.page = info.page
      this.PageInfo.size = info.sizethis.setListCondition()
      this.listCondition.current = info.page
      this.listCondition.size = info.size
      this._getTrendList(this.listCondition)
    },
    setListCondition() {
      this.listCondition = {
        current: 1,
        size: 10
      }
      if (this.querySiteId) {
        if (Array.isArray(this.querySiteId)) {
          this.listCondition.siteId = this.querySiteId[this.querySiteId.length - 1]
        } else {
          this.listCondition.siteId = this.querySiteId
        }
      }     
      this.dateRange ? (
        this.listCondition.startTime = moment(this.dateRange[0]).format('YYYY-MM-DD'),
        this.listCondition.endTime = moment(this.dateRange[1]).format('YYYY-MM-DD')      
        ) : ''
    },
    setChartCondition() {
      if (this.querySiteId) {
        if (Array.isArray(this.querySiteId)) {
          this.chartCondition.siteId = this.querySiteId[this.querySiteId.length - 1]
        } else {
          this.chartCondition.siteId = this.querySiteId
        }
      } 
      this.dateRange ? (
        this.chartCondition.startTime = moment(this.dateRange[0]).format('YYYY-MM-DD'),
        this.chartCondition.endTime = moment(this.dateRange[1]).format('YYYY-MM-DD')      
        ) : ''
    }
  }
}
</script>

<style lang="scss" scoped>
.refresh-btn {
  margin-left: 20px;
}
#lineDom {
  width: 1000px;
  height: 600px;
  margin: 0 auto;
  margin-top: 20px;
}
</style>