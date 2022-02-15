<template>
<div :class="['modal', {fade: fade}]" data-backdrop="static" data-disable="false" data-keyboard="true" tabindex="-1">
  <div :class="['modal-dialog', size]" style="width:70%">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true" style="color: black">&times;</span>
        </button>
        <h6 class="modal-title text-center text-primary"><span style="color:black;">点击表格行选择通道</span></h6>
      </div>
      <div class="modal-body">
        <!-- <form class="form-inline" autocomplete="off" spellcheck="false">
            <div class="form-group form-group-sm">
                <label>搜索</label>
                <input type="text" class="form-control" placeholder="关键字" v-model.trim="q" @keydown.enter.prevent ref="q">
            </div>
        </form> -->
        <br>
        <el-row :gutter="15">
          <el-col :span="5" style="overflow-y:auto;height:500px">
            <el-card  shadow="never" :body-style="contentViewHeight">
              <el-tag
                closable
                size="small" 
                style="margin-bottom:5px"
                v-if="selectName"
                :disable-transitions="false"
                @close="handleNodeClose">
                {{selectName}}
              </el-tag>
              <el-input
                placeholder="输入关键字进行过滤"
                size="small"
                v-model="filterText">
              </el-input> 
              <el-tree
                class="filter-tree"
                :data="siteData"
                :props="{
                      value: 'id',             // ID字段名
                      label: 'name',         // 显示名称
                      children: 'children'    // 子级字段名
                    }"
                default-expand-all
                :highlight-current="false"
                node-key="id"
                :filter-node-method="filterNode"
                :expand-on-click-node="false"
                @node-click="handleNodeClick"
                ref="leftTree">
              </el-tree>
            </el-card>
          </el-col>
          <el-col :span="19">
            <el-table :data="channels" border @sort-change="sortChange" @row-click="rowClick" :row-style="rowStyle"
                ref="channelTable" v-loading="loading" element-loading-text="加载中..." >
              <el-table-column
                type="index"
                label="序号"
                align="center">
              </el-table-column>
              <el-table-column
                prop="siteName"
                show-overflow-tooltip
                label="所属区域">
              </el-table-column>
              <el-table-column
                  prop="code"
                  show-overflow-tooltip
                  label="设备编码">
                </el-table-column>
              <el-table-column
                  prop="name"
                  show-overflow-tooltip
                  label="设备名称">
                </el-table-column>
                <el-table-column
                  prop="expand.appearanceType"
                  show-overflow-tooltip
                  label="摄像头类型">
                  <template slot-scope="scope">{{scope.row.expand.appearanceType == '0'?'枪机':scope.row.expand.appearanceType == '1'?'球机':''}}</template>
                </el-table-column>
                <el-table-column prop="devicechannel" label="设备国标编号" min-width="200" show-overflow-tooltip></el-table-column>
                <el-table-column prop="channel" label="通道国标编号" min-width="200" show-overflow-tooltip></el-table-column>
                <el-table-column
                  prop="ip"
                  show-overflow-tooltip
                  label="IP地址">
                </el-table-column>
                <!-- <el-table-column
                  prop="type"
                  show-overflow-tooltip
                  label="设备类型">
                  <template slot-scope="scope">
                        {{ $dictUtils.getDictLabel("device_type", scope.row.type, '-') }}
                  </template>
                </el-table-column> -->
                <!-- <el-table-column prop="Name" label="通道名称" min-width="120" :formatter="formatName" show-overflow-tooltip></el-table-column> -->
                <!-- <el-table-column prop="Status" label="在线状态" min-width="100">
                    <template slot-scope="props">
                    <span v-if="props.row.SubCount > 0">-</span>
                    <span v-else-if="props.row.Status == 'ON'" class="text-success">在线</span>
                    <span v-else>离线</span>
                    </template>
                </el-table-column> -->
                <!-- <el-table-column prop="SubCount" label="子节点数" min-width="100" sortable="custom"></el-table-column>
                <el-table-column prop="Manufacturer" label="厂家" min-width="120" :formatter="formatManufacturer" show-overflow-tooltip></el-table-column> -->
            </el-table>
            <el-pagination v-if="total > 0" layout="total,prev,pager,next" :pager-count="5" class="pull-right" :total="total" :page-size.sync="pageSize" :current-page.sync="currentPage"></el-pagination>
          </el-col>
        </el-row>
       
        <div class="clearfix"></div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
      </div>
    </div>
    <!-- /.modal-content -->
  </div>
  <!-- /.modal-dialog -->
</div>
</template>

<script>
import _ from 'lodash'
import $ from 'jquery'
import "jquery-ui/ui/widgets/draggable";
import { modifyData } from "@/util/domainFilter";
import { getFilterFlag } from "@/util/getFilterFlag";
import { sdcSiteAction } from "@/api/sdc/addressInfo";
export default {
  props: {
      title: {
          default: ''
      },
      size: {
          type: String,
          default: 'modal-lg'
      },
      fade: {
          type: Boolean,
          default: false
      }
  },
  data() {
    return {
      q: "",
      total: 0,
      pageNo: 1,
      pageSize: 10,
      orderBy: '',
      currentPage: 1,
      sort: "",
      order: "",
      loading: false,
      channels: [],
      index: 0,
      url : JSON.parse(localStorage.getItem('url_ip')),
      port: JSON.parse(localStorage.getItem('port')),
      siteData: [],
      selectName: '',
      filterText: '',
      queryCondition: {
        current: 1,
        size: 10,
        'videoType': '1'
      }
    };
  },
  computed: {
    contentViewHeight () {
      let height = this.$store.state.common.documentClientHeight - 122
      return {minHeight: height + 'px'}
    },
  },
  watch: {
    filterText(val) {
      this.$refs.leftTree.filter(val);
    },
    q: function(newVal, oldVal) {
        this.doDelaySearch();
    },
    currentPage: function(newVal, oldVal) {
        this.doSearch(newVal);
    },
    pageSize: function(newVal, oldVal) {
        this.doSearch();
    }
  },
  created() {
    this.getSiteData();
  },
  mounted() {
    $(this.$el).find('.modal-content').draggable({
        handle: '.modal-header',
        cancel: ".modal-title span",
        addClasses: false,
        containment: 'document',
        delay: 100,
        opacity: 0.5
    });
    $(this.$el).on("shown.bs.modal", () => {
        this.$emit("show");
    }).on("hidden.bs.modal", () => {
        // this.errors.clear();
        // this.reset();
        this.$emit("hide");
    })
  },
  methods: {
    // 左边树相关
    async getSiteData() {
      let data = await sdcSiteAction("", "/tree", "get");
      this.siteData = modifyData(data.data.data);
    },
    filterNode (value, data, node) {
        return getFilterFlag(value, data, node)
    },
    handleNodeClick (data) {
      this.queryCondition.siteId =  data.id
      this.queryCondition.current = 1
      this.selectName = '已选区域: ' + data.name
      this.doSearch()
    },
    handleNodeClose () {
      this.selectName = ''
      this.$refs.leftTree.setCurrentKey(null)
      this.queryCondition = {
        current: 1,
        size: 10,
        'videoType': '1'
      }
      this.doSearch()
    },
    sortChange(data) {
      this.sort = data.prop;
      this.order = data.order == "ascending" ? "asc" : "desc";
      // this.refreshList()
      this.getChannels();
    },
    doSearch(page = 1) {
        this.currentPage = page;
        this.queryCondition.current = page
        // this.refreshList()
        this.getChannels();
    },
    doDelaySearch: _.debounce(function() {
        this.doSearch();
    }, 500),
    formatName(row, col, cell) {
      return row.CustomName || row.Name || "-";
    },
    formatManufacturer(row, col, cell) {
      if (cell) return cell;
      return "-";
    },
    // 获取数据列表
    getChannels () {
      this.$http({
        url: '/site-sdc/sdcdevice/page',
        method: 'get',
        params: this.queryCondition
      }).then(({data}) => {
        if (data && data.code == 0) {
          this.channels = data.data.records || [];
          this.total = data.data.total
        }
      })
    },
    // getChannels() {
    //   console.log('url', this.url)
    //   console.log('port', this.port)
    //     this.loading = true;
    //     $.get('http://' + this.url + ':' + this.port + '/api/v1/device/channellist', {
    //         q: this.q,
    //         start: (this.currentPage -1) * this.pageSize,
    //         limit: this.pageSize,
    //         channel_type: "device",
    //         online: "true",
    //         sort: this.sort,
    //         order: this.order
    //     }).then(ret => {
    //         // this.total = ret.ChannelCount;
    //         // this.channels = ret.ChannelList || [];
    //     }).always(() => {
    //         this.loading = false;
    //     });
    // },
    rowClick(row, event, column) {
      // if(row.Status !== "ON") return;
      this.$emit("selected", this.index, row);
      this.hide();
    },
    rowStyle({row, rowIndex}) {
      if(row.Status === "ON") {
        return "cursor:pointer";
      }
      return "";
    },
    reset() {
      this.index = 0;
      this.channels = [];
      this.q = "";
      this.currentPage = 1;
      this.pageSize = 10;
    },
    show(index) {
      this.index = index;
      $(this.$el).modal("show");
      // this.refreshList()
      this.getChannels();
    },
    hide() {
      $(this.$el).modal("hide");
    },
  }
};
</script>

<style lang="less" scoped>
  label.el-switch {
      margin-bottom: -10px;
  }
  // .modal-content{
  //   background: #6da2e4;
  // }
  .modal-lg {
      max-width: 70%;
    }
</style>
