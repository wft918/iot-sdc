<template>
  <div>
    <basic-container>
      <el-row :gutter="15">
        <el-col :span="24">
          <el-row>
            <el-col :span="22">
              <div style="font-size:24px">问题详情</div>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" @click="changeComponent">返回</el-button>
            </el-col>
            <el-col :span="24">
              <el-divider content-position="left">
                <span style="font-size: 20px">问题概况</span>
              </el-divider>
              <el-row :gutter="15">
                <el-col :span="4">
                  项目名称：{{patrolData.name}}
                </el-col>
                <el-col :span="3">
                  巡检地点：{{patrolData.address}}
                </el-col>
                <el-col :span="2">
                  已验收
                </el-col>
                <el-col :span="4">
                  未逾期
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="24">
              <el-divider content-position="left">
                <span style="font-size: 20px">问题类型</span>
              </el-divider>
              <el-row :gutter="15">
                <el-col :span="24">
                  风险类型：配电箱
                </el-col>
                <el-col :span="24">
                  风险点： 配管、线槽、支架安装
                </el-col>
                <el-col :span="24">
                  风险源： 高处作业抛掷工具、材料
                </el-col>
                <el-col :span="24">
                  检查项：程技术措施：高处作业应使用工具袋，小型物品及工器具放入工具袋中。
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="24">
              <el-divider content-position="left">
                <span style="font-size: 20px">问题发现</span>
              </el-divider>
              <el-row :gutter="15">
                <el-col :span="4">
                  <img :src="problemImg" alt="" style="width:100%">
                </el-col>
                <el-col :span="20">
                  <el-row :gutter="15">
                    <el-col :span="3">
                      创建人：{{patrolData.patroler}}
                    </el-col>
                    <el-col :span="6">
                      创建时间：{{patrolData.patrolStartTime}}
                    </el-col>
                    <el-col :span="6">
                      整改期限：2021-08-21 09:55:55
                    </el-col>
                    <el-col :span="4">
                      问题描述： 具体问题描述
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="24">
              <el-divider content-position="left">
                <span style="font-size: 20px">整改</span>
              </el-divider>
              <el-row :gutter="15">
                <el-col :span="4">
                  <img :src="problemImg" alt="" style="width:100%">
                </el-col>
                <el-col :span="20">
                  <el-row :gutter="15">
                    <el-col :span="3">
                      整改人：{{patrolData.patroler}}
                    </el-col>
                    <el-col :span="6">
                      整改时间：{{patrolData.patrolStartTime}}
                    </el-col>
                    <el-col :span="4">
                      整改描述： 具体整改描述
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="24">
              <el-divider content-position="left">
                <span style="font-size: 20px">验收</span>
              </el-divider>
              <el-row :gutter="15">
                <el-col :span="4">
                  <img :src="problemImg" alt="" style="width:100%">
                </el-col>
                <el-col :span="20">
                  <el-row :gutter="15">
                    <el-col :span="3">
                      验收人：{{patrolData.patroler}}
                    </el-col>
                    <el-col :span="3">
                      验收结果：通过
                    </el-col>
                    <el-col :span="6">
                      验收时间：{{patrolData.patrolStartTime}}
                    </el-col>
                    <el-col :span="4">
                      验收描述： 验收问题描述
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </basic-container>
  </div>
</template>

<script>
import lsdbg1 from "@/assets/img/lsdbg.jpg";
import lsdbg2 from "@/assets/img/lsdbg.jpg";
import lsdbg3 from "@/assets/img/lsdbg.jpg";

export default {
  props: ['patrolData'],
  components: {
    
  },
  data() {
    return {
      problemImg: lsdbg1,
      modifyImg: lsdbg1,
      resultImg: lsdbg1,
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
        currentComponent: 'problemInfo'
      })
    },
    queryByPage() {

    }
  },
};
</script>

<style>
</style>