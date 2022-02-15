<template>
  <div v-if="rtoData">
    <el-table
      :data="rtoData"
      border
      max-height="400"
      :default-sort="{prop: 'param', order: 'ascending'}"
    >
      <!-- <el-table-column 
        label="设备"
        align="center"
      >
        <template slot-scope="">
          {{deviceName}}
        </template>
      </el-table-column> -->
      <el-table-column 
        prop="param"
        label="遥控指令"
        align="center"
        sortable
      ></el-table-column>
      <!-- <el-table-column 
        label="参数值"
        align="center"
        :formatter="setValue"
      > -->
      <!-- </el-table-column> -->
      <el-table-column 
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <span class="table-action" @click="deviceAction(scope.row)">下发指令</span>
        </template>
      </el-table-column>
      <el-dialog
        :visible.sync="dialogFormVisible"
        width="30%"
        ref="propertyDialog"
        :key="dialogKey"
        :close-on-click-modal="false"
        append-to-body
        title="遥控操作"
      >
        <el-form
          :model="teleInputForm"
          label-width="100px"
          :rules="rules"
          ref="propertyForm"
          :key="dialogKey"
        >
              <el-form-item label="状态" prop="value">
                <el-select v-model="teleInputForm.value" width="100%">
                  <el-option
                    v-for="item in propertyTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <template>
            <el-button @click="dialogFormVisible = false" size="small"
              >取消</el-button
            >
            <el-button type="primary" @click="submitForm" size="small"
              >确认</el-button
            >
          </template>
        </span>
      </el-dialog>
    </el-table>
  </div>
</template>

<script>
import { clone } from "@/util/domainFun";
import { sdcDeviceIndicatorAction } from "@/api/sdc/deviceInfo";
import eventBus from "@/util/eventBus";


export default {
  props:['rtoData'],
  data() {
    return {
      teleInputForm: {
        type:null
      },
      propertyTypeList:[
        {
          value: '0',
          label: '开机'
        },
        {
          value: '1',
          label: '关机'
        }
      ],
      rules: {},
      dialogFormVisible: false,
      dialogKey: Math.random().toString(36).slice(-6),
    }
  },
  created() {
  },
  methods: {
    deviceAction(val) {
      this.teleInputForm = clone(val)
      this.teleInputForm.value = '1'
      // this.dialogFormVisible = true
      sdcDeviceIndicatorAction(this.teleInputForm).then(res => {
        if(res.data.code === 0) {
          eventBus.$emit('updateTeleData',{
            id: this.teleInputForm.deviceId,
          })
          this.$notify({
            title: '成功',
            message: '指令下发成功',
            type: 'success',
            duration: 5000
          })
        } else {
          this.$notify({
            title: '失败',
            message: '指令下发失败',
            type: 'error',
            duration: 5000
          })
        }
        
      })
    },
    submitForm() {
      sdcDeviceIndicatorAction(this.teleInputForm).then(res => {
        this.dialogFormVisible = false
        eventBus.$emit('updateTeleData',{
          id: this.teleInputForm.deviceId,
        })
      })
    },
    setValue(val) {
      let text = '--'
      if(val.value === '0') {
        text = '开机'
      } else if(val.value === '1') {
        text = '关机'
      }
      return text
    }
  }

}
</script>

<style>

</style>