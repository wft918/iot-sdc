<template>
  <div>
    <basic-container>
      <el-row :gutter="15">
        <el-col :span="4">
          <span>名称：</span>
          <el-input style="width:70%"></el-input>
        </el-col>
        <el-col :span="7">
          <span>所属项目：</span>
          <el-select  style="width:70%">
            <el-option
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="13">
          <el-button type="primary" @click="addInfo">
            <i class="el-icon-plus"></i> 新增
          </el-button>
          <el-button type="primary" @click="queryInfo">
            <i class="el-icon-search"></i> 查询
          </el-button>
          <el-button type="primary" @click="clearCondition">
            <i class="el-icon-delete"></i> 清空
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
                prop="name"
                label="巡检点名称"
                align="center"
              ></el-table-column>
              <el-table-column 
                prop="project"
                label="所属项目"
                align="center"
              ></el-table-column>
              <el-table-column 
                prop="status"
                label="定位启用状态"
                align="center"
              ></el-table-column>
              <el-table-column 
                prop="check"
                label="检查项"
                align="center"
              ></el-table-column>
              <el-table-column 
                prop="isuse"
                label="启用状态"
                align="center"
              ></el-table-column>
              <el-table-column 
                label="操作"
                align="center"
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
      </el-row>
      <el-dialog
        :visible.sync="dialogFormVisible"
        width="50%"
        ref="emgDialog"
        :close-on-click-modal="false"
        @close="refreshData"
        title="新增巡检点"
      >
        <el-form
          :model="inputForm"
          label-width="120px"
          :rules="rules"
          ref="carForm"
          :key="dialogKey"
          :disabled="isdisabled"
        >
          <el-form-item label="名称" prop="" >
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="所属项目" prop="" >
            <el-select  style="width:55%">
              <el-option
                v-for="item in this.$dictUtils.getDictList('plate_color_type')"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="风险点" prop="" >
            <el-transfer v-model="value" :data="data"></el-transfer>
          </el-form-item>
          <el-form-item label="是否启用" prop="" >
            <el-radio-group v-model="inputForm.chooseType">
              <el-radio :label="'1'">是</el-radio>
              <el-radio :label="'2'">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否启用定位" prop="" >
            <el-radio-group v-model="inputForm.location" @change="handleChange">
              <el-radio :label="'1'">是</el-radio>
              <el-radio :label="'2'">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if=" inputForm.location === '1' ">
            <el-form-item label="有效距离：" prop="" >
              <el-input></el-input>
            </el-form-item>
            <el-form-item label="参考位置：" prop="" >
              <div id="baidumap2" class="bmap2"></div>
            </el-form-item>
          </template>
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
import Pagination from "@/components/Pagination";

export default {
  components: {
    Pagination
  },
  data() {
    const generateData = _ => {
        const data = [];
        for (let i = 1; i <= 15; i++) {
          data.push({
            key: i,
            label: `备选项 ${ i }`,
            disabled: i % 4 === 0
          });
        }
        return data;
      };
    return {
      tableInfo: [
        {
          name: '7#楼配电箱',
          project: '宜家花园二期',
          isuse: '已启用',
          status: '已启用',
          check: '电气工程--> 配管、线槽、支架安装, 电气设备调试',
        }
      ],
      dialogFormVisible: false,
      dialogPersonVisible: false,
      dialogTitle: null,
      page: 0,
      size: 10,
      total: 0,
      pageKey: Math.random().toString(36).slice(-6),
      inputForm: {
        value1: null,
        value2: null,
        chooseType: '1',
        location:'2'
      },
      rules: {},
      dialogKey: Math.random().toString(36).slice(-6),
      isdisabled: true,
      dialogVisible: false,
      activeName: '1',
      data: generateData(),
      value: [1, 4]
    }
  },
  methods: {
    addInfo() {
      this.isdisabled = false
      this.dialogFormVisible = true
    },
    queryInfo() {

    },
    clearCondition() {

    },
    tableAction(data,flag) {
      if(flag === 5) {
        this.dialogPersonVisible = true
      }
    },
    queryByPage() {

    },
    refreshData() {

    },
    submitForm() {

    },
    deleteData() {

    },
    handleClick() {

    },
    handleChange() {
      console.log(11111111);
      this.$nextTick(() => {
        this.initBMap();
      })
    },
    initBMap() {
      let map;
      let zoom = 13;
      map = new T.Map("baidumap2", {
        projection: "EPSG:4326"
      })
      // if(this.mapFlag === 1) {
        map.centerAndZoom(new T.LngLat(116.385297,39.925338), zoom)
        // let cp = new T.CoordinatePickup(map, { callback: (lnglat) => {
        //     this.mapForm.longitude = lnglat.lng.toFixed(6)
        //     this.mapForm.latitude = lnglat.lat.toFixed(6)
        //   } 
        // })
        // cp.addEvent()
      // }else {
      //   //设置显示地图的中心点和级别
      //   map.centerAndZoom(new T.LngLat(this.inputForm.longitude, this.inputForm.latitude), zoom);

      //   //创建标注对象
      //   let marker = new T.Marker(new T.LngLat(this.inputForm.longitude, this.inputForm.latitude));
      //   //向地图上添加标注
      //   map.addOverLay(marker);
      // }
      
    },
  }
}
</script>

<style lang="scss" scoped>
  .demo .el-switch_label {
    position: absolute;
    display: none;
    color: #fff;
  }

  .demo .el-switch_label--right {
    z-index: 1;
    right: -3px;
  }

  .demo .el-switch_label--left {
    z-index: 1;
    left: 19px;
  }

  .demo .el-switch__label.is-active {
    display: block;
  }

  .demo.el-switch .el-switch__core,
  .el-switch .el-switch__label {
    width: 50px !important;
  }

  .bmap2 {
    min-height: 300px;
    height: 100%;
    width: 100%;
    z-index: 1000;
  }
</style>