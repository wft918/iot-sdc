<template>
  <basic-container>
    <el-row :gutter="15">    
      <!-- 左侧表格 -->
      <el-col :span="12">
        <el-row>
          <el-col :span="22" :offset="1">
            <span>所处位置：</span>
            <el-cascader 
              ref="siteChoose"
              :options="siteData" 
              style="width:50%" 
              v-model="querySiteId"
              @change="changeSite"
              :props="{checkStrictly: true,value: 'id', label: 'name', children: 'children'}"
            >
            </el-cascader>
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
          :empty-text="recordEmptyText"
          highlight-current-row
          @current-change="handleCurrentChange"
          ref="tableRef"
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
          <!-- <el-table-column
            prop=""
            label="所处位置"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{scope.row.expand.siteNames.join('/')}}</span>
            </template>
          </el-table-column> -->
          <el-table-column
            v-if="columnList[1].show"
            prop="area"
            label="面积(㎡)"
            align="center"
            width="80"
          ></el-table-column>
          <el-table-column
            v-if="columnList[2].show"
            label="机柜空间容量"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{scope.row.capacityRackPercent + '%' + '(' + scope.row.capacityRackUsed + '/' + scope.row.capacityRack + ')'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="columnList[3].show"
            label="U位空间容量"
            align="center"
            width="110"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{scope.row.capacityUnitPercent + '%' +'(' + scope.row.capacityUnitUsed + '/' + scope.row.capacityUnit + ')' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="columnList[4].show"
            label="电力容量"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{scope.row.capacityPowerPercent + '%' +'(' + scope.row.capacityPowerUsed + '/' + scope.row.capacityPower + ')' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="columnList[5].show"
            label="制冷容量"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{scope.row.capacityCoolPercent + '%' +'(' + scope.row.capacityCoolUsed + '/' + scope.row.capacityCool + ')' }}</span>
            </template>
          </el-table-column>
        </el-table>
        <Pagination
          :page="PageInfo.page"
          :size="PageInfo.size"
          :total="PageInfo.total"
          :key="PageKey"
          @pagination="queryByPage"
        ></Pagination>
      </el-col>
      <el-col :span="12">
        <el-row class="pieChart">
          <el-row :gutter="30" style="margin-bottom: 15px;">
            <el-col :span="12">
              <span>机房：</span>
              <el-input v-model="selectedRoom" :disabled="true" style="width: 80%"></el-input>
            </el-col>
            <el-col :span="12">
              <span>类型：</span>
              <el-select v-model="capacityValue" placeholder="请选择" style="width: 80%" @change="capacityTypeChange">
                <el-option
                  v-for="item in capacityOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <div id="pieDom" ref="pieDomRef"></div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <div id="barDom" ref="barDomRef"></div>
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

import { sdcSiteAction } from "@/api/sdc/addressInfo";
import { getRealTimeCapacity, getClientRank } from "@/api/sdc/capacityManage";

import { modifyData} from "@/util/domainFilter";
import { getFirstChild } from "@/util/getFirstChild"
import _ from 'lodash'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      siteData: [],
      firstFloor: [],
      // 左侧表格相关
      querySiteId: null,
      recordTable: [],
      recordEmptyText: '数据加载中',
      // 分页器
      PageInfo: {
        page: 1,
        size: 10,
        total: 0
      },
      PageKey: Math.random().toString(36).slice(-6),
      // 饼状图相关
      pieOption: {
        title: {
          // text: '机房u位使用率',
          textStyle: {
            fontSize: 14
          }
        },
        legend: {
          right: '0%'
        },
        tooltip: {
          trigger: 'item'
        },
        color: ['#43A2FF', '#DADADA'],
        series: [
          {
            type: 'pie',
            data: [
              {
                name: '已使用',
                value: null
              },
              {
                name: '空闲',
                value: null
              }
            ],
            label: {
              color: '#000',
              position: 'inside',
              formatter: '{d}%'
            }
          }
        ]
      },
      barOption: {
        title: {
          text: '客户使用排行',
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {           
              type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value',
          scale: true
        },
        series:[
          {
            name: '已使用',
            type: 'bar',
            stack: 'capa',
            data: [],
            label: {
              show: true,
              color: '#000',
              position: 'inside'
            },
            itemStyle: {
              color: '#43A2FF'
            }
          },
          {
              name: '空闲',
              type: 'bar',
              stack: 'capa',
              data: [],
              label: {
                show: true,
                color: '#000',
                position: 'inside'
              },
              itemStyle: {
                color: '#DADADA'
              }
            },
        ] 
      },
      selectedRoom: '',
      capacityValue: '0',
      capacityOption: this.$dictUtils.getDictList('capacity_type'),
      queryCondition: {
        current: 1,
        size: 10
      },
      rowData: {},
      columnList: [
        {
          prop: 'siteName',
          label: '名称',
          show: true
        },
        {
          prop: 'siteArea',
          label: '面积(㎡)',
          show: true
        },
        {
          prop: 'capacityRackPercent',
          label: '机柜空间容量',
          show: true
        },
        {
          prop: 'capacityUnitPercent',
          label: 'U位空间容量',
          show: true
        },
        {
          prop: 'capacityPowerPercent',
          label: '电力容量',
          show: true
        },
        {
          prop: 'capacityCoolPercent',
          label: '制冷容量',
          show: true
        }
      ],
      dialogColumnVisible: false
    }
  },
  computed: {
    },
    watch: {},
    created() {
      this.getSiteData()
    },
    mounted() {
    },
    methods: {
      /**
       * 网络请求
       */
      _getRealTimeCapacity(params) {
        getRealTimeCapacity(params).then(res => {
          if (res.data.code === 0) {
            console.log(res,'_getRealTimeCapacity');
            let data = res.data.data
            this.recordTable = data.records
            this.PageInfo.total = data.total
            this.PageInfo.current = data.current
            if (this.recordTable.length === 0) {
              this.recordEmptyText = '暂无数据'
            } else {
              this.$refs.tableRef.setCurrentRow(this.recordTable[0])             
            }
          } else {
            return this.$message.error('获取数据出错，请刷新重试')
          }
        })
      },
      // 获取树形目录数据
      async getSiteData() {
        let data = await sdcSiteAction("", "/tree", "get");
        let moData = modifyData(data.data.data);
        getFirstChild(moData, this.firstFloor, 'F00')
        this.siteData = this.setDisable(_.cloneDeep(moData))
        this.querySiteId = this.firstFloor[0].id
        this.setQueryCondition()
        this._getRealTimeCapacity(this.queryCondition)
      },

      /**
       * 事件监听
       */
      setDisable (data) {
        data.forEach(item => {
          if (item.type === 'R00' || item.type === 'T00' ) {
            item.disabled = true
          } else {
            if (item.children && item.children.length) {
              this.setDisable(item.children)
            }
          }
        })
        return data
      },
      // 查询列表数据
      changeSite(data) {
        console.log(data);
        this.querySiteId = data[data.length - 1]
        this.setQueryCondition()
        this._getRealTimeCapacity(this.queryCondition)
      },
      // 饼状图选择容量类型
      capacityTypeChange(data) {
        this.setPieOption(data)
      },
      setPieOption(capacityValue) {
        switch(capacityValue) {
          case '0': 
            this.pieOption.series[0].data[0].value = this.rowData.capacityRackUsed
            this.pieOption.series[0].data[1].value = (this.rowData.capacityRack -  this.rowData.capacityRackUsed).toFixed(2)
            break;
          case '3':
            this.pieOption.series[0].data[0].value = this.rowData.capacityUnitUsed
            this.pieOption.series[0].data[1].value = (this.rowData.capacityUnit -  this.rowData.capacityUnitUsed).toFixed(2)
            break;
          case '1':
            this.pieOption.series[0].data[0].value = this.rowData.capacityPowerUsed
            this.pieOption.series[0].data[1].value = (this.rowData.capacityPower -  this.rowData.capacityPowerUsed).toFixed(2)
            break;
          case '2':
            this.pieOption.series[0].data[0].value = this.rowData.capacityCoolUsed
            this.pieOption.series[0].data[1].value = (this.rowData.capacityCool -  this.rowData.capacityCoolUsed).toFixed(2)
            break;
          default: 
            break;
        }
        // this.pieOption.title.text = this.rowData.expand.siteName
        let pieChart = this.$echarts.init(this.$refs.pieDomRef)
        pieChart.setOption(this.pieOption)
      },
      // 查询图表数据
      handleCurrentChange(row) {
        this.rowData = row
        this.selectedRoom = row.expand.siteName
        this.setPieOption(this.capacityValue)
        this.barOption.xAxis.data = ['机柜空间容量', 'U位空间容量', '电力容量', '制冷容量']
        this.barOption.series[0].data = [row.capacityRackUsed, row.capacityUnitUsed, row.capacityPowerUsed, row.capacityCoolUsed]
        this.barOption.series[1].data = [(row.capacityRack -  row.capacityRackUsed).toFixed(2), (row.capacityUnit -  row.capacityUnitUsed).toFixed(2), (row.capacityPower -  row.capacityPowerUsed).toFixed(2), (row.capacityCool -  row.capacityCoolUsed).toFixed(2)]
        console.log(this.barOption.series[0].data, 'this.barOption.series[0].data')        
        let barChart = this.$echarts.init(this.$refs.barDomRef)
        this.barOption.title.text = row.expand.siteName + '容量信息'
        barChart.setOption(this.barOption)
        // getClientRank(row.siteId).then(res => {
        //     console.log(res);
        //     if (res.data.code === 0) {
        //       let rdata = res.data.data
        //       let data = res.data.data.data
        //       let x = res.data.data.x
        //       this.barOption.xAxis.data = x
        //       this.barOption.series[0].data = data           
        //       let barChart = this.$echarts.init(this.$refs.barDomRef)
        //       this.barOption.title.text = row.siteName + '客户使用占比'
        //       barChart.setOption(this.barOption)
        //       let name = rdata.pdata
        //       let value = rdata.px
        //       this.pieOption.series[0].data.forEach((item, index) => {
        //         item.name = name[index]
        //         item.value = value[index]
        //       })
        //       // this.pieOption.title.text = row.siteName + 'U位使用率'
        //       let pieChart = this.$echarts.init(this.$refs.pieDomRef)
        //       pieChart.setOption(this.pieOption)
        //     } 
            
        //   })
      },
      chooseColumn() {
        this.dialogColumnVisible = true
      },
      // 分页器事件
      queryByPage(info) {
        this.PageInfo.page = info.page
        this.PageInfo.size = info.size
        this.setQueryCondition()
        this.queryCondition.current = info.page
        this.queryCondition.size = info.size
        this._getRealTimeCapacity(this.queryCondition)
      },
      setQueryCondition() {
        this.queryCondition = {
          current: 1,
          size: 10
        }
        this.querySiteId ? this.queryCondition.siteId = this.querySiteId : ''
      }
    }
}
</script>

<style lang="scss" scoped>
.tree-area {
  overflow-y:auto;
  height:800px
}
.refresh-btn {
  margin-left: 20px;
}
.pieChart {
  margin: 20px 100px;
}
#pieDom {
  width: 400px;
  height: 400px;
}
.capacity-cate-select {
  margin-left: 10px;
}
#barDom {
  width: 800px;
  height: 600px;
  margin: 0 auto;
  margin-top: 20px;
}
/deep/.el-table__body tr.current-row>td {
  background: #CDE4FE!important;
}
</style>