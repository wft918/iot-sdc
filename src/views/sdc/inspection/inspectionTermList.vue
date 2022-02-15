<template>
<basic-container>
  <div style="width: 100%;height: 800px;display: flex;justify-content: space-between;">
    <!-- 左边 -->
    <div style="width: 22%;height: 100%;">
      <div style="width: 100%;height: 35px;;line-height: 35px;"><span style="margin-left: 5px;">风险点列表 <el-button style="margin-top: 5px;margin-left:10px;" @click='add()' type="primary" size="mini" icon="el-icon-plus" circle></el-button></span></div>
      <div style="width: 100%;height:calc(100% - 35px);overflow-y: auto;overflow-x: hidden">
        <!-- <el-tag
            closable
            size="small"
            style="margin-bottom:5px;margin-left: 10px;"
            v-if="treeName"
            :disable-transitions="false"
            @close="handleNodeClose">
            {{treeName}}
          </el-tag> -->
        <!-- <el-row :gutter="10" style="margin-left: 3px;">
          <el-col :span="20">
            <el-input
              style="margin-top: 5px;"
              placeholder="输入关键字进行过滤"
              size="small"
              v-model="filterText">
            </el-input>
          </el-col> -->
          <!-- <el-col :span="3">
            <el-button style="margin-top: 5px;" @click='handleNodeClose' type="primary" size="small" icon="el-icon-refresh" circle></el-button>
          </el-col> -->
          <!-- <el-col :span="4">
            <el-button style="margin-top: 5px;" @click='add()' type="primary" size="small" icon="el-icon-plus" circle></el-button>
          </el-col>
        </el-row> -->
        <el-tree style="margin-top: 10px;" v-loading="loading" :data="treedataList" :indent="2" :highlight-current='true' default-expand-all :props="defaultProps" ref='treedata' :filter-node-method="filterNode" :expand-on-click-node="false" @node-click="handleNodeClick">
          <span class="custom-tree-node" slot-scope="{ node, data}">
            <el-tooltip class="item" effect="dark" :open-delay='1000' :content="node.label" placement="top-start">
              <span class="el-tree-label">{{ node.label }}</span>
            </el-tooltip>
            <span v-if="data.name !=='全部'">
               <el-button type="text" icon="el-icon-edit" class="tree-item-button" @click="() => edit(data)">
               </el-button>
                <el-button type="text" icon="el-icon-delete" class="tree-item-button" @click="() => del(data)">
               </el-button>
              <el-button v-if="data.type == '1'" type="text" icon="el-icon-plus" class="tree-item-button" @click="() => addSpot(data)">
               </el-button>
              <el-button v-if="data.type == '2'" type="text" icon="el-icon-plus" class="tree-item-button" @click="() => addSource(data)">
               </el-button>
              <el-button v-if="data.type == '3'" type="text" icon="el-icon-plus" class="tree-item-button" @click="() => addTerm(data)">
               </el-button>
            </span>
          </span>
        </el-tree>
      </div>
    </div>
    <!-- 右边 -->
    <div style="width: 76%;height: 100%;">
      <div style="width: 100%;height: 35px;line-height: 35px;"><span style="margin-left: 5px;">检查项列表</span></div>
      <div style="width: 100%;height:calc(100% - 35px);overflow: auto;">
        <el-form :inline="true" class="query-form" ref="searchForm" :model="searchForm" @submit.native.prevent>
          <!-- 搜索框-->
          <el-form-item prop="checkName" label="检查项">
            <el-input size="small" v-model="searchForm.checkName" placeholder="" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="gettreePageList" type="primary" size="small">查询</el-button>
            <el-button @click="resetList" size="small">重置</el-button>
            <el-button @click="del1()" size="small" :disabled="delDisabled">删除</el-button>
          </el-form-item>
          <el-form-item style="float:right">
            <el-tooltip effect="dark" content="显隐" placement="top">
              <el-button circle="" @click="chooseColumn" size="small" icon="el-icon-menu"></el-button>
            </el-tooltip>
          </el-form-item>
        </el-form>
        <!-- 循环渲染 -->
        <el-table
          :data="dataList"
          size="medium"
          @selection-change="selectionChangeHandle"
          v-loading="loading1"
          class="table">
          <el-table-column
            type="selection"
            header-align="center"
            align="center"
            width="50">
          </el-table-column>
          <el-table-column
            v-if="columnList[0].show"
            prop="checkName"
            width="320"
            show-overflow-tooltip
            label="检查项">
            <template slot-scope="scope">
              <el-link :underline="false" type="primary" @click="mainPropClick(scope.row)">{{scope.row.checkName}}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            v-if="columnList[1].show"
            prop="typeName"
            show-overflow-tooltip
            label="类型">
          </el-table-column>
          <el-table-column
            v-if="columnList[2].show"
            prop="pointName"
            show-overflow-tooltip
            label="风险点">
          </el-table-column>
          <el-table-column
            v-if="columnList[3].show"
            prop="sourceName"
            show-overflow-tooltip
            label="风险源">
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            width="140"
            label="操作">
            <template  slot-scope="scope">
                <!-- <el-button type="text" icon="el-icon-view" size="small" @click="view1(scope.row)">详情</el-button>
                <el-button type="text" icon="el-icon-edit" size="small" @click="edit1(scope.row)">修改</el-button> -->
              <el-button type="text"  icon="el-icon-delete" size="small" @click="del1(scope.row.checkId)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="margin-top:15px;"
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageNo"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="total"
          background
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </div>
    <!-- 风险类型 -->
    <inspectionaddForm ref="inspectionaddForm" @refreshList="refreshList"></inspectionaddForm>
    <!-- 风险点 -->
    <inspectionaddSpotForm ref="inspectionaddSpotForm" @refreshList="refreshList"></inspectionaddSpotForm>
    <!-- 风险源 -->
    <inspectionaddSourceForm ref="inspectionaddSourceForm" @refreshList="refreshList"></inspectionaddSourceForm>
    <!-- 检查项 -->
    <inspectionaddTermForm ref="inspectionaddTermForm" @refreshList="refreshList"></inspectionaddTermForm>
    <el-dialog
        :visible.sync="dialogColumnVisible"
        title="请选择要显示的列"
        :close-on-click-modal="false"
        width="35%"
        v-dialogDrag
      >
        <el-checkbox v-for="item in columnList" v-model="item.show" :key="item.prop">{{item.label}}</el-checkbox>
      </el-dialog>
  </div>
</basic-container>
</template>
<script>
  import inspectionaddForm from './inspectionaddForm'
  import inspectionaddSpotForm from './inspectionaddSpotForm'
  import inspectionaddSourceForm from './inspectionaddSourceForm'
  import inspectionaddTermForm from './inspectionaddTermForm'
  export default {
    data() {
      return {
        filterText:"",
        treeName:"",
        loading:false,
        loading1:false,
        dataList:[],
        pageNo: 1,
        pageSize: 10,
        total: 0,
        dataListSelections: [],
        treedataList:[],//风险点列表
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        searchForm:{
          checkName:""
        },
        treeSarchForm:{
          typeId:"",
          pointId:"",
          sourceId:""
        },
        dialogColumnVisible: false,
        columnList: [
          {
            prop: 'checkName',
            label: '检查项',
            show: true
          },
          {
            prop: 'typeName',
            label: '类型',
            show: true
          },
          {
            prop: 'pointName',
            label: '风险点',
            show: true
          },
          {
            prop: 'sourceName',
            label: '风险源',
            show: true
          }
        ]
      }
    },
    components: {
      inspectionaddForm,
      inspectionaddSpotForm,
      inspectionaddSourceForm,
      inspectionaddTermForm
    },
    computed: {
      delDisabled() {
        return this.dataListSelections.length === 0
      }
    },
    watch: {
      filterText(val) {
        this.$refs.treedata.filter(val);
      }
    },
    created() {
      this.getriskTreelist()
      this.gettreePageList()
    },
    methods: {
      refreshList() {
        this.treeName = ''
        this.treeSarchForm = {
          typeId:"",
          pointId:"",
          sourceId:""
        }
        this.getriskTreelist()
        this.gettreePageList()
      },
      // 获取检查项列表
      gettreePageList() {
        this.loading1 = true
        this.$http({
          url:"/check/inspect/riskTree/treePage",
          method:"get",
          params:{
            pageNo:this.pageNo,
            pageSize:this.pageSize,
            ...this.searchForm,
            ...this.treeSarchForm
          }
        }).then(({data}) => {
          if(data && data.success) {
            this.dataList = data.data.list
            this.total = data.data.count
            this.loading1 = false
          }
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageNo = 1
        this.gettreePageList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageNo = val
        this.gettreePageList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      //重置
      resetList() {
        this.$refs.searchForm.resetFields();
        this.gettreePageList();
      },
      //过滤
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      //点击属性控件
      handleNodeClick(a,b,c) {
        this.treeName = a.name
        if(a.type == '1') {
          this.treeSarchForm = {
            typeId:a.id,
            pointId:"",
            sourceId:""
          }
        }else if(a.type == '2') {
          this.treeSarchForm = {
            typeId:"",
            pointId:a.id,
            sourceId:""
          }
        }else {
          this.treeSarchForm = {
            typeId:"",
            pointId:"",
            sourceId:a.id
          }
        }
        this.gettreePageList()
      },
      //关闭tag标签
      handleNodeClose() {
        this.treeName = '',
        this.treeSarchForm = {
          typeId:"",
          pointId:"",
          sourceId:""
        }
        this.gettreePageList()
      },
      //获取风险点列表
      getriskTreelist() {
        this.loading = true
        this.$http({
          url:"/check/inspect/riskTree/treeData",
          method:"get"
        }).then(({data}) => {
          if(data && data.success) {
            this.treedataList = data.treeData
            let all = {
              name: '全部',
              id: '',
            }
            this.treedataList.unshift(all)
            this.loading = false
          }
        })
      },
      // 控制列显隐
      chooseColumn() {
        this.dialogColumnVisible = true
      },
      // 新增风险类型
      add() {
        this.$refs.inspectionaddForm.init('add','')
      },
      // 添加风险点
      addSpot(data) {
        this.$refs.inspectionaddSpotForm.init('add','',data.id,data.name)
      },
      // 添加风险源
      addSource(data) {
        this.$refs.inspectionaddSourceForm.init('add','',data.id,data.name,data.parent.name)
      },
      // 添加检查项
      addTerm(data) {
        var tyName = ''
        this.treedataList.forEach(item => {
          if(data.parentIds.split(',')[1] == item.id) {
            tyName = item.name
          }
        })
        this.$refs.inspectionaddTermForm.init('add','',tyName,data.id,data.parent.name,data.name)
      },
      // 修改
      edit(data) {
        if(data.type == '1') {
          this.$refs.inspectionaddForm.init('edit',data.id)
        }else if(data.type == '2') {
          this.$refs.inspectionaddSpotForm.init('edit',data.id,data.parent.id,data.parent.name)
        }else if(data.type == '3') {
          var typName = '';
          this.treedataList.forEach(item => {
            if(data.parentIds.split(',')[1] == item.id) {
              typName = item.name
            }
          })
          this.$refs.inspectionaddSourceForm.init('edit',data.id,data.parent.id,data.parent.name,typName)
        }
      },
      // 删除
      del(data) {
        this.$confirm(`确定删除所选吗?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.loading = true;
          this.$http({
            url: `/check/inspect/riskTree/delete?id=${data.id}`,
            method: "delete"
          }).then(({ data }) => {
            if (data && data.success) {
              this.$message.success(data.msg);
              this.treeName = ''
              this.treeSarchForm = {
                typeId:"",
                pointId:"",
                sourceId:""
              }
              this.getriskTreelist();
              this.gettreePageList();
            }
            this.loading = false;
          });
        });
      },
      mainPropClick(row) {
        this.$refs.inspectionaddTermForm.init('view',row.checkId,row.typeName,row.sourceId,row.pointName,row.sourceName)
      },
      // 检查项详情
      view1(row) {
        this.$refs.inspectionaddTermForm.init('view',row.checkId,row.typeName,row.sourceId,row.pointName,row.sourceName)
      },
      // 修改检查项
      edit1(row) {
        console.info(row)
        this.$refs.inspectionaddTermForm.init('edit',row.checkId,row.typeName,row.sourceId,row.pointName,row.sourceName)
      },
      // 删除检查项
      del1(id) {
        let ids = id || this.dataListSelections.map(item => item.checkId).join(',')
        this.$confirm(`确定删除所选项吗?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.loading1 = true;
          this.$http({
            url: "/check/inspect/checkItem/delete",
            method: "delete",
            params: { ids: ids },
          }).then(({ data }) => {
            if (data && data.success) {
              this.$message.success(data.msg);
              this.gettreePageList();
            }
            this.loading1 = false;
          });
        });
      }
    },
  }
</script>
<style scoped>
  .query-form{
    padding-top: 15px!important;
    padding-left: 25px!important;
    margin-bottom: 10px!important;
  }
  .el-tree-node__content:hover .el-tree-label {
    display: inline-block;
    width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .el-tree-node__content .tree-item-button{
  display: none;
}
.el-tree-node__content:hover .tree-item-button{
  display: unset;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>