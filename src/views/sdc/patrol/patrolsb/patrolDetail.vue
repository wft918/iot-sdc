<template>
  <div>
    <basic-container>
      <el-row :gutter="15">
        <el-col :span="24">
          <el-row>
            <el-col :span="5">
              <div style="font-size:24px">巡检线路1</div>
            </el-col>
            <el-col :span="3">
              已完成
            </el-col>
            <el-col :span="14"></el-col>
            <el-col :span="2">
              <el-button type="primary" @click="changeComponent">返回</el-button>
            </el-col>
            <el-col :span="24">
              <el-divider content-position="left">
                <span style="font-size: 20px">巡检概况</span>
              </el-divider>
              <el-row :gutter="15">
                <el-col :span="4">
                  巡检类型：{{patrolData.type}}
                </el-col>
                <el-col :span="3">
                  巡检员：{{patrolData.patroler}}
                </el-col>
                <el-col :span="5">
                  计划巡检时间：{{patrolData.patrolStartTime}}
                </el-col>
                <el-col :span="5">
                  实际巡检时间：{{patrolData.patrolEndTime}}
                </el-col>
                <el-col :span="2">
                  逾期
                </el-col>
                <el-col :span="4">
                  共发现3个问题
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24">
          <el-divider content-position="left">
                <span style="font-size: 20px">巡检点1</span>
              </el-divider>
          <el-table
            :data="tableInfo"
            :span-method="objectSpanMethod"
            border
            style="margin: 0.75rem 0"
          >
            <el-table-column
              prop="name"
              label="类型"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="isuse"
              label="风险点"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="status"
              label="风险源"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="checkNum"
              label="检查项"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="caozuo"
              label="是否处理"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="details"
              label="具体描述"
              align="center"
            ></el-table-column>
          </el-table>
          <!-- <Pagination
            :page="page"
            :size="size"
            :total="total"
            :key="pageKey"
            @pagination="queryByPage"
          ></Pagination> -->
        </el-col>
      </el-row>
    </basic-container>
  </div>
</template>

<script>
export default {
  props: ['patrolData'],
  components: {

  },
  data() {
    return {
      tableInfo: [
        {
          name: "电气工程",
          isuse: "配管、线槽、支架安装",
          status: "预埋铁件或膨胀螺栓安装不牢固",
          checkNum:
            "管理措施：预埋铁件或膨胀螺栓安装完成后，应对其检查，合格后方可进行下道工序施工",
          caozuo: "落实",
          details: "整改人：李四 整改期限：2021-05-23 具体的问题描述",
        },
        {
          name: "电气工程",
          isuse: "配管、线槽、支架安装",
          status: "高处作业操作平台不符合要求",
          checkNum:
            "工程技术措施：高处作业操作平台应符《建筑施工高处作业安全技术规范》JGJ80的要求",
          caozuo: "落实",
          details: "整改人：李四 整改期限：2021-05-23 具体的问题描述",
        },
        {
          name: "电气工程",
          isuse: "配管、线槽、支架安装",
          status: "高处作业操作平台不符合要求",
          checkNum:
            "管理措施：1、在设有架空电缆处工作，做好安全措施，并设专人监护；2、梯上有人禁止移动；3、不得两人同时在梯子上作业",
          caozuo: "落实",
          details: "整改人：李四 整改期限：2021-05-23 具体的问题描述",
        },
        {
          name: "电气工程",
          isuse: "配管、线槽、支架安装",
          status: "高处作业抛掷工具、材料",
          checkNum:
            "工程技术措施：高处作业应使用工具袋，小型物品及工器具放入工具袋中",
          caozuo: "落实",
          details: "整改人：李四 整改期限：2021-05-23 具体的问题描述",
        },
        {
          name: "电气工程",
          isuse: "配管、线槽、支架安装",
          status: "高处作业抛掷工具、材料",
          checkNum:
            "管理措施：1、较大工具及物品应系上尾绳,栓在牢固的构件上；2、传递物品时，使用传递绳传递物品",
          caozuo: "落实",
          details: "整改人：李四 整改期限：2021-05-23 具体的问题描述",
        },
        {
          name: "电气工程",
          isuse: "配管、线槽、支架安装",
          status: "高处作业抛掷工具、材料",
          checkNum: "个体防护措施：正确佩戴安全带、安全帽",
          caozuo: "落实",
          details: "整改人：李四 整改期限：2021-05-23 具体的问题描述",
        },
      ],
    };
  },

  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      console.log(row, "row", rowIndex, columnIndex);
      if (columnIndex === 0) {
        if (rowIndex % 6 === 0) {
          return {
            rowspan: 6,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
      if (columnIndex === 1) {
        if (rowIndex % 6 === 0) {
          return {
            rowspan: 6,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
      if (columnIndex === 2) {
        if (rowIndex % 1 === 0) {
          return {
            rowspan: 1,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
    changeComponent() {
      this.$emit('changeComponent',{
        currentComponent: 'patrolInfo'
      })
    },
    queryByPage() {

    }
  },
};
</script>

<style>
</style>