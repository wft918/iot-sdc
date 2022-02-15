<template>
  <div>
    <basic-container>
      <el-row :gutter="15">
        <el-col :span="6">
          <span>区域：</span>
          <el-cascader
            ref="areaMsg"
            :options="condition"
            style="width: 80%"
            v-model="address"
            :props="{
              checkStrictly: true,
              value: 'id',
              label: 'name',
              children: 'children',
            }"
            clearable
            filterable
            @change="changeAddress"
          ></el-cascader>
        </el-col>
        <el-col :span="5">
          <span>时间：</span>
          <el-date-picker v-model="month" type="month" placeholder="选择月">
          </el-date-picker>
        </el-col>
        <el-col :span="3">
          <el-button type="primary">查询</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableInfo">
        <el-table-column
          type="index"
          label="序号"
          align="center"
          sortable
        ></el-table-column>
        <el-table-column
          prop="siteName"
          align="center"
          label="所属园区"
        ></el-table-column>
        <el-table-column
          prop="buildName"
          align="center"
          label="楼栋"
        ></el-table-column>
        <el-table-column
          prop="floor"
          align="center"
          label="楼层"
        ></el-table-column>
        <el-table-column
          prop="room"
          align="center"
          label="机房"
        ></el-table-column>
        <el-table-column
          prop="luminance"
          align="center"
          label="健康度得分"
        ></el-table-column>
        <el-table-column
          prop="date"
          align="center"
          label="月份"
        ></el-table-column>
      </el-table>
      <Pagination
        :page="page"
        :size="size"
        :total="total"
        :key="pageKey"
        @pagination="queryByPage"
      ></Pagination>
    </basic-container>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { sdcSiteAction } from "@/api/sdc/addressInfo";
import { modifyData } from "@/util/domainFilter";
import moment from "moment";

export default {
  components: {
    Pagination,
  },
  data() {
    return {
      address: null,
      condition: [],
      parkingName: "",
      parkingMap: [],
      page: 1,
      size: 10,
      total: 0,
      pageKey: Math.random().toString(36).slice(-6),
      tableInfo: [
        {
          siteName:'北京移动研究院',
          buildName:'一栋',
          floor:'一层',
          room:'机房001',
          luminance:'100',
          date:'2021-06-08'
        },
        {
          siteName:'北京移动研究院',
          buildName:'二栋',
          floor:'一层',
          room:'机房011',
          luminance:'100',
          date:'2021-06-08'
        },
        {
          siteName:'北京移动研究院',
          buildName:'一栋',
          floor:'一层',
          room:'机房001',
          luminance:'90',
          date:'2021-06-08'
        },
        {
          siteName:'北京移动研究院',
          buildName:'A栋',
          floor:'一层',
          room:'机房009',
          luminance:'80',
          date:'2021-06-08'
        },
        {
          siteName:'北京移动研究院',
          buildName:'一栋',
          floor:'二层',
          room:'机房021',
          luminance:'100',
          date:'2021-06-08'
        },
        {
          siteName:'北京移动研究院',
          buildName:'一栋',
          floor:'三层',
          room:'机房011',
          luminance:'100',
          date:'2021-06-08'
        },
        {
          siteName:'北京移动研究院',
          buildName:'B栋',
          floor:'一层',
          room:'机房002',
          luminance:'100',
          date:'2021-06-08'
        }
      ],
      month: moment().format("YYYY-MM")
    };
  },
  created() {
    this.init()
  },
  methods: {
    //初始化获取数据
    async init() {
      //获取区域数据
      let data = await sdcSiteAction('','/tree','get')
      this.condition = modifyData(data.data.data)
    },
    queryByPage(){},
    changeAddress(){}
  },
};
</script>

<style>
</style>
