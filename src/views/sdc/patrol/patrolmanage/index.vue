<template>
  <div>
    <basic-container>
      <el-row :gutter="15">
        <el-col :span="8" style="overflow-y: auto; height: 800px">
          <el-card>
            <el-input placeholder="输入关键字进行过滤" v-model="filterText">
            </el-input>
            <el-tree
              ref="addressTree"
              :data="condition"
              node-key="id"
              :default-expand-all="true"
              :expand-on-click-node="false"
              :default-checked-keys="checkedKey"
              :props="defaultProps"
              :filter-node-method="filterNode"
              @node-click="querySiteInfo"
            >
              <span slot-scope="{ node, data }" class="node-container">
                {{ node.label }}
                <span
                  class="node-style"
                  @click="addAddress(node, data)"
                  v-if="data.type !== 'R00' && data.id !== '0'"
                >
                  <i class="el-icon-circle-plus-outline"></i>
                </span>
                <span
                  class="node-style"
                  @click="editAddress(node, data)"
                  v-if="data.id !== '0'"
                >
                  <i class="el-icon-edit-outline"></i>
                </span>
                <span
                  class="node-style"
                  @click="deleteAddress(data)"
                  v-if="data.id !== '0'"
                >
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </el-tree>
          </el-card>
        </el-col>
        <el-col :span="16">
          <el-row :gutter="15">
            <el-col :span="5">
              <span>检查项：</span>
              <el-input style="width: 65%"></el-input>
            </el-col>
            <el-col :span="19">
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
            <el-col :span="24" style="margin-top: 20px">
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
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <span
                      class="table-action"
                      @click="tableAction(scope.row, 2)"
                      >编辑</span
                    >
                    <span
                      class="table-action"
                      @click="tableAction(scope.row, 3)"
                      >查看</span
                    >
                    <span
                      class="table-action"
                      @click="tableAction(scope.row, 4)"
                      >删除</span
                    >
                  </template>
                </el-table-column>
              </el-table>
              <Pagination
                :page="page"
                :size="size"
                :total="total"
                :key="pageKey"
                @pagination="queryByPage"
              ></Pagination>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-dialog
        :visible.sync="dialogFormVisible"
        width="35%"
        ref="emgDialog"
        :close-on-click-modal="false"
        @close="refreshData"
        title="新增风险类型"
      >
        <el-form
          :model="inputForm"
          label-width="120px"
          :rules="rules"
          ref="carForm"
          :key="dialogKey"
          :disabled="isdisabled"
        >
          <el-form-item label="类型名称" prop="">
            <el-input style="width: 65%"></el-input>
          </el-form-item>
          <el-form-item label="顺序：" prop="">
            <el-input style="width: 65%"></el-input>
          </el-form-item>
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

      <!-- 新增风险点 -->
      <el-dialog
        :visible.sync="dialogPointVisible"
        width="35%"
        ref="emgDialog"
        :close-on-click-modal="false"
        @close="refreshData"
        title="新增风险点"
      >
        <el-form
          :model="inputForm"
          label-width="120px"
          :rules="rules"
          ref="carForm"
          :key="dialogKey"
          :disabled="isdisabled"
        >
          <el-form-item label="类型" prop=""> 电器工程 </el-form-item>
          <el-form-item label="名称" prop="">
            <el-input style="width: 65%"></el-input>
          </el-form-item>
          <el-form-item label="顺序：" prop="">
            <el-input style="width: 65%"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <template v-if="inputForm.actionType === 3">
            <el-button
              type="primary"
              @click="dialogPointVisible = false"
              size="small"
              >关闭</el-button
            >
          </template>
          <template v-else>
            <el-button @click="dialogPointVisible = false" size="small"
              >取消</el-button
            >
            <el-button type="primary" @click="submitForm" size="small"
              >保存</el-button
            >
          </template>
        </span>
      </el-dialog>

      <!-- 新增风险源 -->
      <el-dialog
        :visible.sync="dialogSourceVisible"
        width="35%"
        ref="emgDialog"
        :close-on-click-modal="false"
        @close="refreshData"
        title="新增风险源"
      >
        <el-form
          :model="inputForm"
          label-width="120px"
          :rules="rules"
          ref="carForm"
          :key="dialogKey"
          :disabled="isdisabled"
        >
          <el-form-item label="类型" prop=""> 电器工程 </el-form-item>
          <el-form-item label="风险点" prop="">
            配管、线槽、支架安装
          </el-form-item>
          <el-form-item label="风险源" prop="">
            <el-input style="width: 65%"></el-input>
          </el-form-item>
          <el-form-item label="顺序：" prop="">
            <el-input style="width: 65%"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <template v-if="inputForm.actionType === 3">
            <el-button
              type="primary"
              @click="dialogSourceVisible = false"
              size="small"
              >关闭</el-button
            >
          </template>
          <template v-else>
            <el-button @click="dialogSourceVisible = false" size="small"
              >取消</el-button
            >
            <el-button type="primary" @click="submitForm" size="small"
              >保存</el-button
            >
          </template>
        </span>
      </el-dialog>

      <!-- 新增检查项 -->
      <el-dialog
        :visible.sync="dialogCheckVisible"
        width="50%"
        ref="emgDialog"
        :close-on-click-modal="false"
        @close="refreshData"
        title="新增检查项"
      >
        <el-form
          :model="checkInputForm"
          label-width="140px"
          :rules="rules"
          ref="carForm"
          :key="dialogKey"
          :disabled="isdisabled"
        >
          <el-form-item label="类型：" prop=""> 电器工程 </el-form-item>
          <el-form-item label="风险点：" prop="">
            配管、线槽、支架安装
          </el-form-item>
          <el-form-item label="风险源：" prop="">
            高处作业抛掷工具、材料
          </el-form-item>
          <el-form-item label="检查项：" prop="">
            <textarea rows="3"></textarea>
          </el-form-item>
          <el-form-item label="是否必填：" prop="">
            <el-radio-group v-model="checkInputForm.isrequire">
              <el-radio :label="'1'">是</el-radio>
              <el-radio :label="'2'">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="类型：" prop="">
            <el-radio-group v-model="checkInputForm.type">
              <el-radio :label="'1'">选择项</el-radio>
              <el-radio :label="'2'">数字项</el-radio>
              <el-radio :label="'3'">文本项</el-radio>
              <el-radio :label="'4'">拍照项</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="选项类型：" prop="">
            <el-radio-group v-model="checkInputForm.chooseType">
              <el-radio :label="'1'">单选</el-radio>
              <el-radio :label="'2'">多选</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="checkInputForm.type === '1'">
            <template v-if="checkInputForm.chooseType === '1'">
              <el-form-item label="选项：" prop="">
                <el-row
                  :gutter="5"
                  v-for="(item, index) in checkInputForm.choose"
                  :key="index"
                >
                  <el-col :span="6">
                    <el-input v-model="item.name"></el-input>
                  </el-col>
                  <el-col :span="6">
                    <el-select v-model="item.qualified">
                      <el-option value="1">是</el-option>
                      <el-option value="2">否</el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="6">
                    <el-select v-model="item.ischoose">
                      <el-option value="1">是</el-option>
                      <el-option value="2">否</el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="5">
                    <el-button type="primary" size="mini">
                      <i class="el-icon-plus"></i>
                    </el-button>
                    <el-button type="primary" size="mini">
                      <i class="el-icon-minus"></i>
                    </el-button>
                  </el-col>
                </el-row>
              </el-form-item>
            </template>
            <template v-else-if="checkInputForm.chooseType === '2'">
              <el-form-item label="选项关系" prop="">
                <el-select style="width: 55%">
                  <el-option
                    v-for="item in this.$dictUtils.getDictList(
                      'plate_color_type'
                    )"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="选项：" prop="">
                <el-row
                  :gutter="5"
                  v-for="(item, index) in checkInputForm.choose"
                  :key="index"
                >
                  <el-col :span="6">
                    <el-input v-model="item.name"></el-input>
                  </el-col>
                  <el-col :span="6">
                    <el-select v-model="item.qualified">
                      <el-option value="1">是</el-option>
                      <el-option value="2">否</el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="6">
                    <el-select v-model="item.ischoose">
                      <el-option value="1">是</el-option>
                      <el-option value="2">否</el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="5">
                    <el-button type="primary" size="mini">
                      <i class="el-icon-plus"></i>
                    </el-button>
                    <el-button type="primary" size="mini">
                      <i class="el-icon-minus"></i>
                    </el-button>
                  </el-col>
                </el-row>
              </el-form-item>
            </template>
          </template>

          <!-- 数字项 -->
          <template v-if="checkInputForm.type === '2'">
            <el-row :gutter="15">
              <el-col :span="12">
                <el-form-item label="小数点后位数：" prop="">
                  <el-input></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="默认输入值：" prop="">
                  <el-input></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="15">
              <el-col :span="12">
                <el-form-item label="合格值上限：" prop="">
                  <el-input></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="合格值下限：" prop="">
                  <el-input></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </template>

          <!-- 文本项 -->
          <template v-if="checkInputForm.type === '3'">
            <el-form-item label="是否允许多行：" prop="">
              <el-radio-group>
                <el-radio :label="'1'">是</el-radio>
                <el-radio :label="'2'">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="默认输入值：" prop="">
              <textarea rows="3"></textarea>
            </el-form-item>
            <el-row :gutter="15">
              <el-col :span="12">
                <el-form-item label="合格选项名称：" prop="">
                  <el-input></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="不合格选项名称：" prop="">
                  <el-input></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="默认选择：" prop="">
              <el-radio-group>
                <el-radio :label="'1'">合格选项</el-radio>
                <el-radio :label="'2'">不合格选项</el-radio>
              </el-radio-group>
            </el-form-item>
          </template>

          <!-- 拍照项 -->
          <template v-if="checkInputForm.type === '4'">
            <el-form-item label="拍照点配置：" prop="">
              <el-row
                  :gutter="5"
                  v-for="(item, index) in checkInputForm.choose"
                  :key="index"
                >
                  <el-col :span="6">
                    <el-input v-model="item.name"></el-input>
                  </el-col>
                  <el-col :span="6">
                    <el-select v-model="item.qualified">
                      <el-option value="1">是</el-option>
                      <el-option value="2">否</el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="6">
                    <el-select v-model="item.ischoose">
                      <el-option value="1">是</el-option>
                      <el-option value="2">否</el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="5">
                    <el-button type="primary" size="mini">
                      <i class="el-icon-plus"></i>
                    </el-button>
                    <el-button type="primary" size="mini">
                      <i class="el-icon-minus"></i>
                    </el-button>
                  </el-col>
                </el-row>
            </el-form-item>
            <el-row :gutter="15">
              <el-col :span="12">
                <el-form-item label="合格选项名称：" prop="">
                  <el-input></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="不合格选项名称：" prop="">
                  <el-input></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="默认选择：" prop="">
              <el-radio-group>
                <el-radio :label="'1'">合格选项</el-radio>
                <el-radio :label="'2'">不合格选项</el-radio>
              </el-radio-group>
            </el-form-item>
          </template>

          <el-form-item label="备注：" prop="">
            <el-input style="width: 65%"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <template v-if="inputForm.actionType === 3">
            <el-button
              type="primary"
              @click="dialogCheckVisible = false"
              size="small"
              >关闭</el-button
            >
          </template>
          <template v-else>
            <el-button @click="dialogCheckVisible = false" size="small"
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
    Pagination,
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
        },
        {
          name: "电气工程",
          isuse: "配管、线槽、支架安装",
          status: "高处作业操作平台不符合要求",
          checkNum:
            "工程技术措施：高处作业操作平台应符《建筑施工高处作业安全技术规范》JGJ80的要求",
        },
        {
          name: "电气工程",
          isuse: "配管、线槽、支架安装",
          status: "高处作业操作平台不符合要求",
          checkNum:
            "管理措施：1、在设有架空电缆处工作，做好安全措施，并设专人监护；2、梯上有人禁止移动；3、不得两人同时在梯子上作业",
        },
        {
          name: "电气工程",
          isuse: "配管、线槽、支架安装",
          status: "高处作业抛掷工具、材料",
          checkNum:
            "工程技术措施：高处作业应使用工具袋，小型物品及工器具放入工具袋中",
        },
        {
          name: "电气工程",
          isuse: "配管、线槽、支架安装",
          status: "高处作业抛掷工具、材料",
          checkNum:
            "管理措施：1、较大工具及物品应系上尾绳,栓在牢固的构件上；2、传递物品时，使用传递绳传递物品",
        },
        {
          name: "电气工程",
          isuse: "配管、线槽、支架安装",
          status: "高处作业抛掷工具、材料",
          checkNum: "个体防护措施：正确佩戴安全带、安全帽",
        },
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
      },
      rules: {},
      dialogKey: Math.random().toString(36).slice(-6),
      isdisabled: true,
      dialogVisible: false,
      activeName: "1",
      condition: [
        {
          value: "zhinan",
          label: "电气工程",
          type: "1",
          children: [
            {
              value: "shejiyuanze",
              label: "配管、线槽、支架安装",
              type: "2",
              children: [
                {
                  value: "yizhi",
                  label: "预埋铁件或膨胀螺栓安装不牢固",
                  type: "3",
                },
                {
                  value: "fankui",
                  label: "高处作业操作平台不符合要求。",
                  type: "3",
                },
                {
                  value: "xiaolv",
                  label: "高处作业抛掷工具、材料",
                  type: "3",
                },
              ],
            },
          ],
        },
        {
          value: "zujian",
          label: "钢筋",
          type: "1",
          children: [
            {
              value: "basic",
              label: "钢筋安装",
              type: "2",
              children: [
                {
                  value: "layout",
                  label: "底板钢筋绑扎未设置走道",
                  type: "3",
                },
                {
                  value: "color",
                  label: "未设立可靠的操作平台",
                  type: "3",
                },
                {
                  value: "typography",
                  label: "柱筋在4m以上时未设置临",
                  type: "3",
                },
                {
                  value: "icon",
                  label: "落梁速度过快导致支撑及",
                  type: "3",
                },
                {
                  value: "button",
                  label: "绑扎楼板钢筋未采取防倾",
                  type: "3",
                },
              ],
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },
      dialogPointVisible: false,
      dialogSourceVisible: false,
      dialogCheckVisible: false,
      requireList: [
        { label: "是", value: "1" },
        { label: "否", value: "2" },
      ],
      checkInputForm: {
        isrequire: "1",
        type: "1",
        chooseType: "1",
        choose: [
          {
            name: "落实",
            qualified: "1",
            ischoose: "1",
          },
          {
            name: "未落实",
            qualified: "2",
            ischoose: "2",
          },
          {
            name: null,
            qualified: null,
            ischoose: null,
          },
        ],
      },
    };
  },
  methods: {
    addInfo() {
      this.isdisabled = false;
      this.dialogFormVisible = true;
    },
    queryInfo() {},
    clearCondition() {},
    tableAction(data, flag) {
      if (flag === 5) {
        this.dialogPersonVisible = true;
      }
    },
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
    queryByPage() {},
    refreshData() {},
    submitForm() {},
    deleteData() {},
    handleClick() {},
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    //查询信息
    async querySiteInfo(val) {},
    addAddress(node, data) {
      console.log(node, "node, data", data);
      if (data.type === "1") {
        this.isdisabled = false;
        this.dialogPointVisible = true;
      }
      if (data.type === "2") {
        this.isdisabled = false;
        this.dialogSourceVisible = true;
      }
      if (data.type === "3") {
        this.isdisabled = false;
        this.dialogCheckVisible = true;
      }
    },
  },
};
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
</style>