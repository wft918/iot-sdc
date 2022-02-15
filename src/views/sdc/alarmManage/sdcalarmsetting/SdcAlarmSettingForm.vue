<template>
  <div>
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      v-dialogDrag
      append-to-body
      :visible.sync="visible"
      class="alarmSettingDialog"
    >
      <el-form
        :model="inputForm"
        ref="inputForm"
        :disabled="method === 'view'"
        label-width="120px"
      >
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item 
              label="告警名称"
              prop="alarmName"
              :rules="[
                {
                  required: true,
                  message: '告警名称不能为空',
                  trigger: 'blur',
                },
              ]"
            >
          <el-input  v-model="inputForm.alarmName" placeholder="请填写告警名称"     ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            
            <el-form-item label="设备类型" prop="devicetype" 
              :rules="[
                {
                  required: true,
                  message: '设备类型不能为空',
                  trigger: 'blur',
                },
              ]">
            <el-cascader 
            placeholder="请选择设备类型"
              :options="devTypeList" 
              style="width:90%"
              v-model="inputForm.devicetype"
              filterable
              :props="{ checkStrictly: true, value: 'id', label: 'name', children: 'children' }"
              @change="changeDevicetype"
              clearable 
              ref="typelist"
            ></el-cascader>
          </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="是否启用"
              prop="enableStatus"
              :rules="[
                {
                  required: true,
                  message: '是否启用不能为空',
                  trigger: 'blur',
                },
              ]"
            >
              <el-switch
                v-model="inputForm.enableStatus"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="0"
                inactive-value="1">
              >
              </el-switch>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6">
            <el-form-item
              label="是否处理"
              prop="needHandle"
              :rules="[
                {
                  required: true,
                  message: '是否处理不能为空',
                  trigger: 'blur',
                },
              ]"
            >
              <el-switch
                v-model="inputForm.needHandle"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="0"
                inactive-value="1">
              >
              </el-switch>
            </el-form-item>
          </el-col> -->

          <!-- 参数设置 -->
          <el-col :span="23" :offset="1" class="alarmfield">
            <fieldset>
              <legend>参数设置</legend>
              <div class="params-setting">
                <el-row class="params-row-setting"
                  v-for="(item, index) in sdcAlarmSettingRuleList"
                  :key="index"
                  :gutter="10"
                >
                  <el-col :span="6">
                    <template>
                    <el-select 
                      class="alarmformitem"
                      v-model="item.alarmLevel"
                      placeholder="请选择告警等级"
                      :rules="[
                        {
                          required: true,
                          message: '告警等级不能为空',
                          trigger: 'blur',
                        },
                      ]"
                    >
                      <el-option
                        v-for="item in alarmLevelDataList"
                        :key="item.id"
                        :label="item.alarmName"
                        :value="item.id">
                      </el-option>
                    </el-select>
                    </template>
                  </el-col>
                  <el-col :span="6">
                    <el-select
                      class="alarmformitem"
                      v-model="item.deviceStatus"
                      placeholder="请选择状态量"
                      style="width: 100%"
                      :rules="[
                        {
                          required: true,
                          message: '状态量不能为空',
                          trigger: 'blur',
                        },
                      ]"
                    >
                      <el-option
                        v-for="item in $dictUtils.getDictList('device_status')"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="2" v-if="method != 'view'">
                    <div class="alarm-btn">
                      <span @click="deleteSdcAlarmSettingListField(index)"
                        >删除</span
                      >
                    </div>
                  </el-col>
                  <el-col :span="24">
                    <el-row
                      v-for="(el, j) in item.sdcAlarmSettingFilterList"
                      :key="j"
                      :gutter="10"
                    >
                      <el-col :span="6">
                        <el-select
                          class="alarmformitem"
                          v-model="el.paramKey"
                          placeholder="请选择过滤指标"
                          :rules="[
                            {
                              required: true,
                              message: '过滤指标不能为空',
                              trigger: 'blur',
                            },
                          ]"
                        >
                          <el-option
                            v-for="item in alarmIndexDataList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                          </el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="7">
                        <el-select
                          class="alarmformitem"
                          v-model="el.operator"
                          placeholder="请选择操作符"
                          :rules="[
                            {
                              required: true,
                              message: '操作符不能为空',
                              trigger: 'blur',
                            },
                          ]"
                        >
                      <el-option
                        v-for="item in $dictUtils.getDictList('t_express')"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="6">
                        <el-input
                          class="alarmformitem"
                          v-model="el.filterValue"
                          placeholder="请填写过滤值"
                          :rules="[
                            {
                              required: true,
                              message: '过滤值不能为空',
                              trigger: 'blur',
                            },
                          ]"
                        ></el-input>
                      </el-col>
                      <el-col :span="2" v-if="method != 'view'">
                        <div class="alarm-btn">
                          <span @click="addSdcAlarmSettingListRow(index)"
                            >添加</span
                          >
                        </div>
                      </el-col>
                      <el-col :span="2" v-if="method != 'view'">
                        <div class="alarm-btn">
                          <span @click="delSdcAlarmSettingListRow(index, j)"
                            >删除</span
                          >
                        </div>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
                <div class="alarm-btn alarm-add-btn" v-if="method != 'view'">
                  <span @click="addSdcAlarmSettingListField">添加</span>
                </div>
              </div>
            </fieldset>
          </el-col>

          <!-- 模板选择 -->
          <el-col :span="23" :offset="1" class="alarmfield">
            <fieldset>
              <legend>模板选择</legend>
              <div class="params-setting">
                <el-row class="params-row-setting"
                  v-for="(item, index) in sdcAlarmSettingNoticeList"
                  :key="index"
                  :gutter="10"
                >
                  <el-col :span="7">
                    <el-select
                      class="alarmformitem"
                      v-model="item.sdcNoticeTemplate.conf.noticeType"
                      :rules="[
                        {
                          required: true,
                          message: '通知方式不能为空',
                          trigger: 'blur',
                        },
                      ]"
                      @change="changeNoticeType(index)"
                    >
                      <el-option
                        v-for="item in $dictUtils.getDictList('notice_type')"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="7">
                    <el-select
                      class="alarmformitem"
                      v-model="item.sdcNoticeTemplate.conf.id"
                      :rules="[
                        {
                          required: true,
                          message: '通知方式配置不能为空',
                          trigger: 'blur',
                        },
                      ]"
                      @change="changeNoticeConf(index)"
                    >
                      <el-option
                        v-for="item1 in item.noticeConfigList"
                        :key="item1.id"
                        :label="item1.configName"
                        :value="item1.id"
                      >
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="7">
                    <el-select
                      class="alarmformitem"
                      v-model="item.sdcNoticeTemplate.id"
                      :rules="[
                        {
                          required: true,
                          message: '通知模板不能为空',
                          trigger: 'blur',
                        },
                      ]"
                    >
                      <el-option
                        v-for="item2 in item.noticeTemplateList"
                        :key="item2.id"
                        :label="item2.templateName"
                        :value="item2.id"
                      >
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="2" v-if="method != 'view'" >
                    <div class="alarm-btn">
                      <span @click="deleteSdcAlarmSettingNoticeListField(index)"
                        >删除</span
                      >
                    </div>
                  </el-col>
                </el-row>
                <span v-if="method != 'view'"
                  class="alarm-btn"
                  @click="addSdcAlarmSettingNoticeListField"
                  >添加</span
                >
                <div class="alarm-notice">
                  <el-form-item label="通知人员" prop="noticeUserids"
                    :rules="[
                      {required: true, message:'通知人员不能为空', trigger:'blur'}
                  ]">
                    <user-select :limit='10' :value="inputForm.noticeUserids" @getValue='(value) => {inputForm.noticeUserids=value}'></user-select>
                  </el-form-item>
                </div>
              </div>
            </fieldset>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注信息" prop="remarks"
                :rules="[
                 ]">
              <el-input type="textarea" v-model="inputForm.remarks" placeholder="请填写备注信息"  ></el-input>
           </el-form-item>
        </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
        <el-button
          type="primary"
          v-if="method != 'view'"
          @click="doSubmit()"
          v-noMoreClick
          >确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import UserSelect from "@/components/userSelect";
import { sdcDeviceTypeAction } from "@/api/sdc/deviceType"
import { modifyData} from "@/util/domainFilter";
import Vue from 'vue'
import { Checkbox } from 'element-ui';
export default {
  data() {
    return {
      title: "",
      method: "",
      visible: false,
      loading: false,
      devTypeList: [],
      sdcAlarmSettingRuleList: [
        {
          alarmLevel: "",
          deviceStatus: "",
          sdcAlarmSettingFilterList: [
            {
              paramKey: "",
              operator: "",
              filterValue: "",
            },
          ],
        },
      ],
      sdcAlarmSettingNoticeList: [
          {
            noticeConfigList: [],
            noticeTemplateList: [],
            sdcNoticeTemplate: {
              id: "",
              conf : {
                id: "",
                noticeType: ""
              }
            }
          }
        ],
      inputForm: {
        id: "",
        remarks: '',
        devicetype: '',
        alarmName: "",
        alarmClearabel: "0",
        noticeUserids: "",
        enableStatus: "0",
        needHandle: '0',
        remarks: "",
        filterDataList: "",
        noticeDataList: ""
      },
      alarmLevelDataList: [],
      alarmIndexDataList: [],
      metadata: []
    };
  },
  components: {
    UserSelect,
  },
  created() {
    this.getDevTypeList()
    this.getAlarmLevelList()
  },
  methods: {
    init(method, id) {
      this.method = method;
      if (method === "add") {
        this.title = `新建告警设置`;
      } else if (method === "edit") {
        this.title = "修改告警设置";
      } else if (method === "view") {
        this.title = "查看告警设置";
      }
      this.visible = true;
      this.loading = false;
      this.$nextTick(() => {
        this.$refs.inputForm.resetFields();
        this.inputForm.id = id;
        this.defaultInit()
        if (method === "edit" || method === "view") {
          this.queryInit()
        }
      });
    },
    //初始化设备类型列表
    async getDevTypeList() {
      let devTypeData = await sdcDeviceTypeAction("", "/tree", "get")
      this.devTypeList = modifyData(devTypeData.data.data)
    },
    
    //初始化告警级别列表
    getAlarmLevelList() {
        this.$http({
          url: '/alarm/sdc/scdalarmlevel/sdcAlarmLevel/list',
          method: 'get',
          params: {
            'pageSize': 10000,
          }
        }).then(({data}) => {
          if (data && data.success) {
            this.alarmLevelDataList = data.page.list
          }
        })
    },
    //新增进入时默认一条数据
    defaultInit() {
      this.sdcAlarmSettingRuleList = [{
            alarmLevel: "",
            deviceStatus: "",
            sdcAlarmSettingFilterList: [
              {
                paramKey: "",
                operator: "",
                filterValue: "",
              },
            ],
          }];
      this.sdcAlarmSettingNoticeList = [
          {
            noticeConfigList: [],
            noticeTemplateList: [],
            sdcNoticeTemplate: {
              id: "",
              conf : {
                id: "",
                noticeType: ""
              }
            }
          }
        ]
      this.inputForm.noticeUserids = ""
    },
    //根据id查询数据
    queryInit() {
      // 修改或者查看
          this.loading = true;
          this.$http({
            url: `/alarm/sdc/sdcalarmsetting/sdcAlarmSetting/queryById?id=${this.inputForm.id}`,
            method: "get",
          }).then(({ data }) => {
            this.inputForm = this.recover(this.inputForm, data.sdcAlarmSetting);
            this.sdcAlarmSettingRuleList = JSON.parse(this.inputForm.filterDataList)
            this.sdcAlarmSettingNoticeList = JSON.parse(this.inputForm.noticeDataList)
            this.sdcAlarmSettingNoticeList.forEach((item, index) => {
              this.getNoticeConfigList(index)
              this.getNoticeTemplateList(index)
            });
            this.getMetaData(this.inputForm.devicetype)
            this.loading = false;
          });
    },
    // 设备类型变更时获取遥测指标
    changeDevicetype(val){
      let typeid = val[val.length-1]            
      this.inputForm.devicetype = typeid
      this.sdcAlarmSettingRuleList.forEach((item, index) => {
          item.sdcAlarmSettingFilterList.forEach((item,index)=>{
            item.paramKey = "";
          })
      });
      this.getMetaData(typeid)
    },
    getMetaData(typeid){
        sdcDeviceTypeAction("", "/" + typeid, "get").then(({data}) => {
            this.metadata = JSON.parse(data.data.metadata)
            if(this.metadata !=="undefined"){
               this.alarmIndexDataList = this.metadata.properties;
            }
        })
    },
    //添加告警设置行
    addSdcAlarmSettingListField() {
      this.sdcAlarmSettingRuleList.push({
        alarmLevel: "",
        deviceStatus: "",
        sdcAlarmSettingFilterList: [
          {
            paramKey: "",
            operator: "",
            filterValue: "",
          },
        ],
      });
    }, 
    //删除告警参数整个设置域
    deleteSdcAlarmSettingListField(index) {
      if(this.sdcAlarmSettingRuleList.length==1){
        this.$message.info("请保留至少一条数据");
        return;
      }
      this.sdcAlarmSettingRuleList.splice(index, 1);
    },
    //添加告警参数行
    addSdcAlarmSettingListRow(index) {
      this.sdcAlarmSettingRuleList[index].sdcAlarmSettingFilterList.push({
        paramKey: "",
        operator: "",
        filterValue: "",
      });
    },
    //添加通知模板选择整个设置域
    addSdcAlarmSettingNoticeListField() {
      this.sdcAlarmSettingNoticeList.push({
        noticeConfigList: [],
        noticeTemplateList: [],
        sdcNoticeTemplate: {
              id: "",
              conf : {
                id: "",
                noticeType: ""
              }
         },
      });
    },
    //删除模板选择整个设置域
    deleteSdcAlarmSettingNoticeListField(index) {
      if(this.sdcAlarmSettingNoticeList.length==1){
        this.$message.info("请保留至少一条数据");
        return;
      }
      this.sdcAlarmSettingNoticeList.splice(index, 1);
    },
    //删除告警参数行
    delSdcAlarmSettingListRow(index, j) {
      if(this.sdcAlarmSettingRuleList[index].sdcAlarmSettingFilterList.length == 1){
        this.$message.info("请保留至少一条数据");
        return;
      };
      this.sdcAlarmSettingRuleList[index].sdcAlarmSettingFilterList.splice(j, 1);
    },

    //告警类型变更
    changeNoticeType(index){  
      this.sdcAlarmSettingNoticeList[index].sdcNoticeTemplate.id = '';
      this.sdcAlarmSettingNoticeList[index].sdcNoticeTemplate.conf.id = '';
      this.sdcAlarmSettingNoticeList[index].noticeConfigList = [];
      this.sdcAlarmSettingNoticeList[index].noticeTemplateList = []; 
      this.getNoticeConfigList(index)
    },

    getNoticeConfigList(index){
      this.$http({
        url: '/notice/sdc/sdcnoticeconfig/sdcNoticeConfig/list',
        method: 'get',
        params: {
          'pageSize': 99999,
          noticeType: this.sdcAlarmSettingNoticeList[index].sdcNoticeTemplate.conf.noticeType
        }
      }).then(({data}) => {
        if (data && data.success) {
          Vue.set(this.sdcAlarmSettingNoticeList[index], "noticeConfigList", data.page.list)
          // this.sdcAlarmSettingNoticeList[index].noticeConfigList = data.page.list    
        }
      })
    },
    //告警配置变更
    changeNoticeConf(index){
      this.sdcAlarmSettingNoticeList[index].sdcNoticeTemplate.id = '';
      this.sdcAlarmSettingNoticeList[index].noticeTemplateList = [];
      this.getNoticeTemplateList(index)
    },
    getNoticeTemplateList(index){
     this.$http({
        url: '/notice/sdc/sdcnoticetemplate/sdcNoticeTemplate/list',
        method: 'get',
        params: {
          'pageNo': this.pageNo,
          'pageSize': 99999,
          'orderBy': this.orderBy,
          'conf': this.sdcAlarmSettingNoticeList[index].sdcNoticeTemplate.conf.id
        }
      }).then(({data}) => {
        if (data && data.success) {
          Vue.set(this.sdcAlarmSettingNoticeList[index], "noticeTemplateList", data.page.list)  
          // this.sdcAlarmSettingNoticeList[index].noticeTemplateList = data.page.list   
        }
      })
    },
    // 表单提交
    doSubmit() {
      let valueCheck = true
      this.sdcAlarmSettingRuleList.forEach((item, index) => {
        if(item.alarmLevel == ""){
          this.$message.error("请选择告警等级！")
          valueCheck = false
          return
        }
        if(item.deviceStatus == ""){
          this.$message.error("请选择状态量！")
          valueCheck = false
          return
        }
        item.sdcAlarmSettingFilterList.forEach((filterItem)=>{
          if(filterItem.paramKey == ""){
          this.$message.error("请选择过滤指标！")
          valueCheck = false
          return
          }
          if(filterItem.operator == ""){
          this.$message.error("请选择操作符！")
          valueCheck = false
          return
          }
          if(filterItem.filterValue == ""){
          this.$message.error("请填写过滤值！")
          valueCheck = false
          return
          }
        })
      });
      if(!valueCheck){
         return
      }
      this.$refs["inputForm"].validate((valid) => {
        this.inputForm.filterDataList = JSON.stringify(this.sdcAlarmSettingRuleList);
        this.sdcAlarmSettingNoticeList.forEach((item, index) => {
          delete item.noticeConfigList
          delete item.noticeTemplateList
        });
        this.inputForm.filterDataList = JSON.stringify(this.sdcAlarmSettingRuleList);
        this.inputForm.noticeDataList = JSON.stringify(this.sdcAlarmSettingNoticeList);
        if (valid) {
          this.loading = true;
          this.$http({
            url: `/alarm/sdc/sdcalarmsetting/sdcAlarmSetting/save`,
            method: "post",
            data: this.inputForm,
          }).then(({ data }) => {
            this.loading = false;
            if (data && data.success) {
              this.visible = false;
              this.$message.success(data.msg);
              this.$emit("refreshDataList");
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
fieldset {
  display: block;
  margin: 0 40px;
  margin-inline-start: 2px;
  margin-inline-end: 2px;
  padding-block-start: 0.35em;
  padding-inline-start: 0.75em;
  padding-inline-end: 0.75em;
  padding-block-end: 0.625em;
  min-inline-size: min-content;
  border-width: 2px;
  border-style: groove;
  border-color: threedface;
  border-image: initial;
  border-radius: 5px;
  font-size: 14px;
}

legend {
  display: block;
  padding-inline-start: 2px;
  padding-inline-end: 2px;
  border-width: initial;
  border-style: none;
  border-color: initial;
  border-image: initial;
  width: auto;
  font-size: 14px;
  margin-bottom: 2px;
}

.params-setting {
  .params-row-setting{
    background: rgb(248, 248, 248);
    margin: 10px;
  }
  .alarmformitem {
    margin: 10px;
  }

  .alarm-btn {
    color: #409eff;
    cursor: pointer;
    margin: 20px 0 2px 10px;
  }

  .alarm-add-btn {
    padding-bottom: 10px;
  }

  .el-input-group {
    width: 50%;
    margin: 10px;
    padding-bottom: 10px;
  }
}

.alarmSettingDialog {
  .el-dialog {
    width: 70%;
  }
}

.alarm-notice {
  margin: 0 0 2px 10px;
}

.alarmfield {
  margin-bottom: 20px;
}

.el-cascader-panel{
    height: 200px;
  }
</style>