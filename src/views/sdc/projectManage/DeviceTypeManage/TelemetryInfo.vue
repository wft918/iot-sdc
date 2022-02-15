<template>
  <div style="margin-top:20px">
    <el-button type="primary" size="small" @click="addProperty" :disabled="formDisabled">添加</el-button>
    <el-table
      :data="devPropertyInfo.properties"
      style="width: 100%; margin: 20px 0"
      border
      :key="tableKey"
      align="center"
      
    >
      <el-table-column prop="id" label="属性标识">
      </el-table-column>
      <el-table-column prop="name" label="属性名称">
      </el-table-column>
      <el-table-column prop="valueType.type" label="数据类型" :formatter="typeTranslate">
      </el-table-column>
      <el-table-column label="操作" align="center" :disabled="formDisabled">
        <template slot-scope="scope">
          <el-button type="primary" size="small"  @click.prevent="propertyAction(scope.row, 1)" :disabled="formDisabled"
            >编辑</el-button
          >
          <el-button type="primary" size="small" @click="propertyAction(scope.row, 2)" :disabled="formDisabled"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
        :visible.sync="dialogFormVisible"
        width="30%"
        ref="propertyDialog"
        :key="dialogKey"
        :close-on-click-modal="false"
        append-to-body
        :title="teleDialogTitle"
        v-dialogDrag
      >
        <el-form
          :model="teleInputForm"
          label-width="100px"
          :rules="rules"
          ref="propertyForm"
          :disabled="formDisabled"
          :key="dialogKey"
        >
              <el-form-item label="信号类型" prop="expands.indicatorType">
                <el-select v-model="teleInputForm.expands.indicatorType" width="100%">
                  <el-option
                    v-for="item in this.$dictUtils.getDictList('tele_type')"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="属性标识" prop="id">
                <el-input v-model="teleInputForm.id"></el-input>
              </el-form-item>
              <el-form-item label="属性名称" prop="name">
                <el-input v-model="teleInputForm.name"></el-input>
              </el-form-item>
              <el-form-item label="单位" prop="valueType.unit" v-if="teleInputForm.expands.indicatorType !=='2' ">
                <el-input v-model="teleInputForm.valueType.unit"></el-input>
              </el-form-item>
              <el-form-item label="数据类型" prop="valueType.type" v-if="teleInputForm.expands.indicatorType !=='2' ">
                <el-select v-model="teleInputForm.valueType.type" width="100%">
                  <el-option
                    v-for="item in propertyTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="主属性" prop="expands.propType" v-if="teleInputForm.expands.indicatorType !=='2' ">
                <el-radio v-model="teleInputForm.expands.propType" label="0">是</el-radio>
                <el-radio v-model="teleInputForm.expands.propType" label="1">否</el-radio>
              </el-form-item>
              <!-- <el-form-item label="是否只读" prop="readOnly">
                <template>
                  <el-radio v-model="radio" label="true">是</el-radio>
                  <el-radio v-model="radio" label="false">否</el-radio>
                </template>
              </el-form-item> -->
              <!-- <el-form-item label="描述" prop="propertyDesc">
                <el-input
                  type="textarea"
                  :rows="3"
                  placeholder="请输入内容"
                  v-model="teleInputForm.propertyDesc"
                >
                </el-input>
              </el-form-item> -->
        </el-form>
        <span slot="footer" class="dialog-footer">
          <template v-if="teleInputForm.actionType === 3">
            <el-button
              type="primary"
              @click="closeLocalDialog"
              size="small"
              >关闭</el-button
            >
          </template>
          <template v-else>
            <el-button @click="closeLocalDialog" size="small"
              >取消</el-button
            >
            <el-button type="primary" @click="submitForm" size="small"
              >保存</el-button
            >
          </template>
        </span>
      </el-dialog>
      <el-dialog title="数据删除提醒" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false" append-to-body>
        <span>是否确定删除当前数据！！！！</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteData">确 定</el-button>
          <el-button type="primary" @click="dialogVisible = false"
            >取 消</el-button
          >
        </span>
      </el-dialog>
  </div>
</template>

<script>
import { dataTypeMap } from "@/util/domainFilter";
import { getStore } from "@/util/store";
import {
  sdcDeviceTypeAction,getDataTypeList
} from "@/api/sdc/deviceType";

export default {
  props:['dialogData','formDisabled'],
  data() {
    return {
      actionFlag: 0,
      delid: null,
      dialogVisible: false,
      dialogFormVisible: false,
      tableKey: 0,
      dialogKey: new Date().toString(),
      propertyTypeList: [],
      devPropertyInfo: [],
      submitFormData: null,
      teleDialogTitle: '',
      teleInputForm: {
        id: null,
        name: null,
        valueType: {
          type: 'double',
          unit: '',
        },
        expands: {
          indicatorType: '3',
          propType: '1'
        }
      },
      rules: {
        id: [
          { required: true, message: "请输入属性标识", trigger: "blur" },
        ],
        name: [
          { required: true, message: "请输入属性名称", trigger: "blur" },
        ],
        'valueType.type': [{ required: true, message: "请选择数据类型", trigger: "blur" }],
        // 'valueType.propType': [{ required: true, message: "请选择数据类型", trigger: "change" }]
      },
      updateId: null,
    }
  },
  created() {
    this.getDataTypeList()
    this.init()
  },
  methods: {
    init() {
      // this.isdisabled = this.dialogData.actionType === 3 ? true : false
      console.log(this.dialogData);
      if(typeof this.dialogData.metadata === 'string') {
        this.devPropertyInfo = JSON.parse(this.dialogData.metadata)
        console.log(this.devPropertyInfo,'this.devPropertyInfo');
      } else {
        this.devPropertyInfo = this.dialogData.metadata
      }
      this.submitFormData = this.dialogData
    },
    submitForm() {
      console.log(this.teleInputForm);
      this.$refs.propertyForm.validate((valid) => {
        if (valid) {
          if(this.actionFlag === 1) {
            for (let index = 0; index < this.devPropertyInfo.properties.length; index++) {
              const el = this.devPropertyInfo.properties[index];
              if(el.id === this.updateId) {
                this.devPropertyInfo.properties.splice(index,1,this.teleInputForm)
                console.log(this.devPropertyInfo.properties);
                break
              }
            }
          }else {
            this.devPropertyInfo.properties.push(this.teleInputForm)
          }
          this.submitFormData.metadata = JSON.stringify(this.devPropertyInfo)
          this.tableKey = new Date().toString()
          this.dialogFormVisible = false
        } else {
          return false;
        }
      });
    },
    submitData() {
      // this.submitFormData.tenantId = getStore({ name: "tenantId" });
      if(this.submitFormData.actionType === 1) {
        sdcDeviceTypeAction(this.submitFormData, "", "post").then(() => {
          this.closeDialog();
        })
      } else {
        sdcDeviceTypeAction(this.submitFormData, "", "put").then(() => {
          this.closeDialog();
        })
      }
    },
    closeLocalDialog(){
      this.teleInputForm = {
        id: null,
        name: null,
        valueType: {
          type: 'double',
          unit: '',
        },
        expands: {
          indicatorType: '3',
          propType: '1'
        }
      }
      this.tableKey = new Date().toString()
      this.dialogFormVisible = false
    },
    closeDialog(){
      this.$emit('closeDialog')
    },
    propertyAction(row, flag){
      this.actionFlag = flag
      if(flag === 1) {  
        this.updateId = row.id
        // this.teleInputForm = row
        this.dialogFormVisible = true
        this.teleDialogTitle = '编辑遥测信号'
        this.teleInputForm = {
          id: row.id,
          name: row.name,
          valueType: {
            type: row.valueType.type,
            unit: row.valueType.unit,
          },
          expands: {
            indicatorType: row.expands.indicatorType || '3',
            propType: row.expands.propType || '1'
          }
        }
      }else {
        this.delid = row.id
        this.dialogVisible = true
      }
    },
    addProperty() {
      this.dialogFormVisible = true
      this.actionFlag = 0
      this.teleInputForm = {
        id: null,
        name: null,
        valueType: {
          type: 'double',
          unit: '',
        },
        expands: {
          indicatorType: '3',
          propType: '1'
        }
      }
      this.teleDialogTitle = '新建遥测信号'
      this.dialogKey = new Date().toString()
    },
    deleteData() {
      console.info(this.devPropertyInfo.properties)
      for (let index = 0; index < this.devPropertyInfo.properties.length; index++) {
        const el = this.devPropertyInfo.properties[index];
        if(el.id === this.delid) {
          this.devPropertyInfo.properties.splice(index,1)
          break
        }
      }
      this.submitFormData.metadata = JSON.stringify(this.devPropertyInfo)
      this.dialogVisible = false
      this.tableKey += 1
    },
    getInputData() {
      return this.submitFormData
    },
    getDataTypeList() {
      getDataTypeList().then( res => {
        res.data.data.forEach((el) => {
          this.propertyTypeList.push({
            value: el.value,
            label: el.label,
          })
        })
      }) 
    },
    //转换表格中siteType的显示
    typeTranslate(row) {
      let rowText
      for(let i = 0; i < this.propertyTypeList.length; i++) {
        let el = this.propertyTypeList[i]
        if(el.value === row.valueType.type) {
          rowText = el.label
          break
        }
      }
      return rowText
    },
    
  }
}
</script>

<style lang="scss" scoped>
.table-action {
  cursor: pointer;
  margin-left: 10px;
  color: #409eff;
}

</style>