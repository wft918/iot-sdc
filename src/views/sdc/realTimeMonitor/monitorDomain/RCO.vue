<template>
  <div v-if="rcoData">
    <el-table
      :data="rcoData"
      border
      max-height="400"
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
        label="参数"
        align="center"
      ></el-table-column>
      <el-table-column 
        prop="value"
        label="参数值"
        align="center"
      >
      </el-table-column>
      <el-table-column 
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <span class="table-action" @click="deviceAction(scope.row)">编辑</span>
        </template>
      </el-table-column>
      <el-dialog
        :visible.sync="dialogFormVisible"
        width="30%"
        ref="propertyDialog"
        :key="dialogKey"
        :close-on-click-modal="false"
        append-to-body
        title="遥调操作"
      >
        <el-form
          :model="teleInputForm"
          label-width="100px"
          :rules="rules"
          ref="propertyForm"
          :key="dialogKey"
        >
              <el-form-item :label="teleInputForm.param + '：'" prop="type">
                {{teleInputForm.value}} <i class="el-icon-right"></i>  <el-input v-model="teleValue" style="width:200px"></el-input> {{teleInputForm.unit}}
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
import { sdcDeviceIndicatorAction } from "@/api/sdc/deviceInfo";
import { clone } from "@/util/domainFun";
import eventBus from "@/util/eventBus";


export default {
  props:['rcoData'],
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
      teleValue: null
    }
  },
  created() {
  },
  methods: {
    deviceAction(val) {
      console.log(val);
      this.teleInputForm = clone(val)
      this.dialogFormVisible = true
    },
    submitForm() {
      this.teleInputForm.value = this.teleValue
      sdcDeviceIndicatorAction(this.teleInputForm).then(res => {
        if(res.data.code === 0) {
          console.log(this.teleInputForm.deviceId,'this.teleInputForm.deviceId');
          this.dialogFormVisible = false
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
    setValue(val) {
      let text = '--'
      if(val.value) {
        text = val.value + val.unit
      } 
      return text
    }
  }

}
</script>

<style>

</style>