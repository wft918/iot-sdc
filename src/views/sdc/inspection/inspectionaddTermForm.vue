<!-- 添加检查项 -->
<template>
  <div>
    <el-dialog :title="title" width="48%" top="5vh" :visible.sync="dialogVisible" :close-on-click-modal="false" v-dialogDrag @closed="dialogClosed">
      <div style="width:100%;height:70vh;overflow:auto;">
        <el-form :model="inputForm" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="isDisabled"
          label-width="120px">
          <el-row  :gutter="15">
            <el-col :span="12">
              <div style="margin-left: 20.5%;margin-bottom: 5%;font-weight: 600;">
                <span>类型：</span>
                <span style="margin-left: 10px;">{{inputForm.typeName}}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div style="margin-left: 8.5%;margin-bottom: 5%;font-weight: 600;">
                <span>风险点：</span>
                <span style="margin-left: 10px;">{{inputForm.pointName}}</span>
              </div>
            </el-col>
            <el-col :span="24">
              <div style="margin-left: 8.5%;margin-bottom: 3%;font-weight: 600;">
                <span>风险源：</span>
                <span style="margin-left: 10px;">{{inputForm.sourceName}}</span>
              </div>
            </el-col>
            <el-col :span="24">
              <el-form-item label="检查项" prop="itemName" :rules="[{required: true, message:'检查项不能为空', trigger:'blur'}]">
                <el-input maxlength="300" type="textarea" v-model="inputForm.itemName" placeholder="请填写检查项" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item  label="是否必填" prop="required" :rules="[{required: true, message:'是否不能为空', trigger:'blur'}]">
                <el-radio-group v-model="inputForm.required">
                  <el-radio v-for="item in requiredList" :key="item.value" :label="item.value">{{item.label}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item  label="顺序" prop="sort" :rules="[{required: true, message:'顺序不能为空', trigger:'blur'}]">
                <el-input-number v-model="inputForm.sort" :step="1" controls-position="left" :min="0" label="顺序"></el-input-number>
              </el-form-item>
            </el-col>
            <!-- 备注 -->
            <el-col :span="24">
              <el-form-item label="备注信息" prop="remarks" :rules="[]">
                <el-input
                  type="textarea"
                  v-model="inputForm.remarks"
                  placeholder="请填写备注信息"
                  
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" :offset="2" v-if="method !== 'view'"><span style="font-weight:700;">* 请选择其中一项</span></el-col>
            <el-col :span="24" style="margin-top:5px">
              <el-tabs v-model="inputForm.itemType" @tab-click="handleClick" type="border-card" style="margin: 0px 50px;">
                <el-tab-pane label="选择项" name="1" :disabled="method === 'view' && inputForm.itemType !== '1'">
                  <el-col :span="24" v-if="inputForm.itemType == '1'">
                    <el-form-item  label="选项类型" prop="optionType" :rules="inputForm.itemType == '1'?[{required: true, message:'选项类型不能为空', trigger:'blur'}]:[]">
                      <el-radio-group v-model="inputForm.optionType">
                        <el-radio v-for="item in optionTypeList" :key="item.value" :label="item.value">{{item.label}}</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24" v-if="inputForm.itemType == '1'&&inputForm.optionType == '1'">
                    <el-form-item  label="选项关系" prop="optionRelation" :rules="inputForm.itemType == '1'&&inputForm.optionType == '1'?[{required: true, message:'选项类型不能为空', trigger:'blur'}]:[]">
                      <el-select style="width: 100%;" v-model="inputForm.optionRelation" placeholder="选项是否合格">
                        <el-option
                          v-for="item in optionRelationList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24" v-if="inputForm.itemType == '1'&&(inputForm.optionType == '0' || inputForm.optionType == '1')">
                    <!-- <div style="width: 8%;float: left;height: 50px;line-height: 40px;font-weight: 600;"><span style="margin-left: 30px;">选项</span></div> -->
                    <div v-for="(item,index) in inputForm.optionItemList" :key="index" :style="{'margin-left':index>0?'8%':''}" style="width: 100%;height: 50px;float: right;position: relative;">
                      <el-row>
                        <el-col :span="24">
                          <el-form-item :label="'选项' + (index+1)" :required="inputForm.itemType == '1'?true:false">
                            <el-row>
                              <el-col :span="5">
                                <el-form-item style="float: left" :prop="'optionItemList.' + index + '.optionName'" :rules="inputForm.itemType == '1'&&(inputForm.optionType == '0' || inputForm.optionType == '1')?[{required: true, message:'选项名称不能为空', trigger:'blur'},{validator: validatorxps.stringCheck, trigger:'blur'}]:[]">
                                  <el-input style="width: 100%;" v-model="item.optionName" placeholder="选项名称" ></el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :span="5">
                                <el-form-item style="float: left;margin-left: 10px;" label="" :prop="'optionItemList.' + index + '.qualified'" :rules="inputForm.itemType == '1'&&(inputForm.optionType == '0' || inputForm.optionType == '1')?[{required: true, message:'选项是否合格不能为空', trigger:'blur'}]:[]">
                                  <el-select clearable style="width: 100%;" v-model="item.qualified" placeholder="选项是否合格">
                                    <el-option
                                      v-for="item in qualifiedList"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                    </el-option>
                                  </el-select>
                                </el-form-item>
                              </el-col>
                              <el-col :span="5">
                                <el-form-item style="float: left;margin-left: 10px;" label="" :prop="'optionItemList.' + index + '.selected'" :rules="inputForm.itemType == '1'&&(inputForm.optionType == '0' || inputForm.optionType == '1')?[{required: true, message:'选项是否默认选中不能为空', trigger:'blur'}]:[]">
                                  <el-select clearable style="width: 100%;" v-model="item.selected" placeholder="是否默认选中">
                                    <el-option
                                      v-for="item in selectedList"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                    </el-option>
                                  </el-select>
                                </el-form-item>
                              </el-col>
                              <el-col :span="6">
                                <el-form-item style="float: left;margin-left: 10px;" label="" :prop="'optionItemList.' + index + '.sort'" :rules="inputForm.itemType == '1'&&(inputForm.optionType == '0' || inputForm.optionType == '1')?[{required: true, message:'排序号不能为空', trigger:'blur'}]:[]">
                                  <el-input-number style="width: 100%;" v-model="item.sort" :min="0" label=""></el-input-number>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-button v-if="index == 0 && method != 'view'" @click="addoption()" style="position: absolute;top: 3px;right: 0px;" size="mini" type="primary" icon="el-icon-plus"></el-button>
                      <el-button v-if="index > 0 && method != 'view'" @click="deloption(index)" style="position: absolute;top: 3px;right: 0px;" size="mini" type="primary" icon="el-icon-minus"></el-button>
                    </div>
                  </el-col>
                </el-tab-pane>
                <el-tab-pane label="数字项" name="2" :disabled="method === 'view' && inputForm.itemType !== '2'">
                  <el-col :span="12" v-if="inputForm.itemType == 2">
                    <el-form-item label="小数点后位数" prop="numberItem.decimalNum" :rules="inputForm.itemType == '2'?[{required: true, message:'小数点后位数不能为空', trigger:'blur'},{validator: validatorxps.isIntGteZero, trigger:'blur'}]:[]">
                      <el-input-number @change="keepDecimals" style="width: 100%;" v-model="inputForm.numberItem.decimalNum" :step="1" controls-position="left" :min="0" label="小数点后位数"></el-input-number>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" v-if="inputForm.itemType == 2">
                    <el-form-item label="默认输入值" prop="numberItem.defaultValue" :rules="inputForm.itemType == '2'?[{required: true, message:'默认输入值不能为空', trigger:'blur'},{validator: validatorxps.isNumber, trigger:'blur'}]:[]">
                      <el-input @blur="keepDecimals" v-model="inputForm.numberItem.defaultValue" placeholder="请填写默认输入值" ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" v-if="inputForm.itemType == 2">
                    <el-form-item label="合格值上限" prop="numberItem.upperLimit" :rules="[]">
                      <el-input v-model="inputForm.numberItem.upperLimit" placeholder="请填写合格值上限" ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" v-if="inputForm.itemType == 2">
                    <el-form-item label="合格值下限" prop="numberItem.lowerLimit" :rules="[]">
                      <el-input v-model="inputForm.numberItem.lowerLimit" placeholder="请填写合格值下限" ></el-input>
                    </el-form-item>
                  </el-col>
                </el-tab-pane>
                <el-tab-pane label="文本项" name="3" :disabled="method === 'view' && inputForm.itemType !== '3'">
                  <el-col :span="24" v-if="inputForm.itemType == '3'">
                    <el-form-item  label="是否允许多行" prop="textItem.multipleLines" :rules="inputForm.itemType == '3'?[{required: true, message:'是否允许多行不能为空', trigger:'blur'}]:[]">
                      <el-radio-group v-model="inputForm.textItem.multipleLines">
                        <el-radio v-for="item in multipleLinesList" :key="item.value" :label="item.value">{{item.label}}</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24" v-if="inputForm.itemType == '3'">
                    <el-form-item label="默认输入值" prop="textItem.defaultValue" :rules="inputForm.itemType == '3'?[{required: true, message:'默认输入值不能为空', trigger:'blur'}]:[]">
                      <el-input type="textarea" v-model="inputForm.textItem.defaultValue" placeholder="默认输入值"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" v-if="inputForm.itemType == '3'">
                    <el-form-item label="合格选项名称" prop="textItem.qualifiedName" :rules="inputForm.itemType == '3'?[{required: true, message:'合格选项不能为空', trigger:'blur'}]:[]">
                      <el-input v-model="inputForm.textItem.qualifiedName" placeholder="请填写合格选项名称" ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" v-if="inputForm.itemType == '3'">
                    <el-form-item label="不合格选项名称" prop="textItem.unqualifiedName" :rules="inputForm.itemType == '3'?[{required: true, message:'不合格选项不能为空', trigger:'blur'}]:[]">
                      <el-input v-model="inputForm.textItem.unqualifiedName" placeholder="请填写不合格选项名称" ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24" v-if="inputForm.itemType == '3'">
                    <el-form-item  label="默认选择" prop="textItem.selected" :rules="inputForm.itemType == '3'?[{required: true, message:'默认选择不能为空', trigger:'blur'}]:[]">
                      <el-radio-group v-model="inputForm.textItem.selected">
                        <el-radio v-for="item in selecteddataList" :key="item.value" :label="item.value">{{item.label}}</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-tab-pane>
                <el-tab-pane label="拍照项" name="4" :disabled="method === 'view' && inputForm.itemType !== '4'">
                  <el-col :span="24" v-if="inputForm.itemType == '4'">
                    <!-- <div style="width: 10%;float: left;height: 50px;line-height: 40px;font-weight: 600;"><span>拍照点配置</span></div> -->
                    <div v-for="(item,index) in inputForm.photoItemList" :key="index" :style="{'margin-left':index>0?'8%':''}" style="width: 100%;height: 50px;float: right;position: relative;">
                      <el-row>
                        <el-col :span="24">
                          <el-form-item :label="'拍照点配置' + (index + 1)" :required="inputForm.itemType == '4'?true:false">
                            <el-form-item style="float: left;margin-left: 10px;" :prop="'photoItemList.' + index + '.placeName'" :rules="inputForm.itemType == '4'?[{required: true, message:'拍照点名称不能为空', trigger:'blur'}]:[]">
                              <el-input style="width: 150px;" v-model="item.placeName" placeholder="拍照点名称" ></el-input>
                            </el-form-item>
                            <el-form-item style="float: left;margin-left: 10px;" label="" :prop="'photoItemList.' + index + '.mustPhoto'" :rules="inputForm.itemType == '4'?[{required: true, message:'是否必须拍照不能为空', trigger:'blur'}]:[]">
                              <el-select style="width: 150px;" v-model="item.mustPhoto" placeholder="是否必须拍照">
                                <el-option
                                  v-for="item in mustPhotoList"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                            </el-form-item>
                            <el-form-item style="float: left;margin-left: 10px;" label="" :prop="'photoItemList.' + index + '.num'" :rules="inputForm.itemType == '4'?[{required: true, message:'拍照张数不能为空', trigger:'blur'},{validator: validatorxps.isIntGtZero, trigger:'blur'}]:[]">
                              <el-input style="width: 150px;" v-model="item.num" placeholder="拍照张数" ></el-input>
                            </el-form-item>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-button v-if="index == 0 && method != 'view'" @click="addphoto()" style="position: absolute;top: 3px;right: 0px;" size="mini" type="primary" icon="el-icon-plus"></el-button>
                      <el-button v-if="index > 0 && method != 'view'" @click="delphoto(index)" style="position: absolute;top: 3px;right: 0px;" size="mini" type="primary" icon="el-icon-minus"></el-button>
                    </div>
                  </el-col>
                  <el-col :span="12" v-if="inputForm.itemType == '4'">
                    <el-form-item label="合格选项名称" prop="photoQualifiedName" :rules="inputForm.itemType == '4'?[{required: true, message:'合格选项名称不能为空', trigger:'blur'}]:[]">
                      <el-input v-model="inputForm.photoQualifiedName" placeholder="请填写合格选项名称" ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" v-if="inputForm.itemType == '4'">
                    <el-form-item label="不合格选项名称" prop="photoUnqualifiedName" :rules="inputForm.itemType == '4'?[{required: true, message:'不合格选项不能为空', trigger:'blur'}]:[]">
                      <el-input v-model="inputForm.photoUnqualifiedName" placeholder="请填写不合格选项名称" ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24" v-if="inputForm.itemType == '4'">
                    <el-form-item  label="默认选择" prop="photoSelected" :rules="inputForm.itemType == '4'?[{required: true, message:'默认选择不能为空', trigger:'blur'}]:[]">
                      <el-radio-group v-model="inputForm.photoSelected">
                        <el-radio v-for="item in selecteddataList" :key="item.value" :label="item.value">{{item.label}}</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-tab-pane>
                <el-tab-pane label="设备指标" name="5" :disabled="method === 'view' && inputForm.itemType !== '5'">
                  <el-col :span="24" v-if="inputForm.itemType == 5">
                    <el-form-item label="选择监测的设备" prop="deviceItem.deviceId" :rules="inputForm.itemType == '5'?[{required: true, message:'请选择设备'}]:[]">
                      <el-input @focus="openDeviceDialog" style="width: 100%;" v-model="inputForm.deviceItem.deviceName"></el-input>
                      <el-input v-show="false" v-model="inputForm.deviceItem.deviceId"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" v-if="inputForm.itemType == 5">
                    <el-form-item label="选择检测点" prop="deviceItem.paramId" :rules="inputForm.itemType == '5'?[{required: true, message:'请选择检测点', trigger:'blur'}]:[]">
                      <!-- <el-input v-if="method === 'view'" v-model="inputForm.deviceItem.param"></el-input> -->
                      <el-select :disabled="paramsDisabled" v-model="inputForm.deviceItem.paramId" placeholder="请选择" @change="paramChange">
                        <el-option style="width:100%" 
                          v-for="item in paramList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>  
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" v-if="inputForm.itemType == 5">
                    <el-form-item label="默认值" prop="deviceItem.defaultValue" :rules="[]">
                      <el-input v-model="inputForm.deviceItem.defaultValue" placeholder="请填写默认值" ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" v-if="inputForm.itemType == 5">
                    <el-form-item label="合格值上限" prop="deviceItem.upperLimit" :rules="[]">
                      <el-input v-model="inputForm.deviceItem.upperLimit" placeholder="请填写合格值下限" ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" v-if="inputForm.itemType == 5">
                    <el-form-item label="合格值下限" prop="deviceItem.lowerLimit" :rules="[]">
                      <el-input v-model="inputForm.deviceItem.lowerLimit" placeholder="请填写合格值下限" ></el-input>
                    </el-form-item>
                  </el-col>
                </el-tab-pane>
              </el-tabs>
            </el-col>
          </el-row>
          </el-form>
      </div>
      <span slot="footer" class="dialog-footer" v-if="method === 'view'">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button v-if="btnType === 1" type="primary" @click="enableEdit">编 辑</el-button>
        <el-button v-if="btnType === 2" type="primary" @click="doSubmit()">确 定</el-button>
      </span>
      <span slot="footer" class="dialog-footer" v-else>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doSubmit()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 设备列表对话框 -->
    <el-dialog title="点击表格行选择设备" :visible.sync="deviceDialogVisible" width="60%" v-dialogDrag>
      <el-row :gutter="15">
        <el-col :span="5" style="overflow-y:auto;height:600px">
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
              :indent="2"
              :props="{
                    value: 'id',             // ID字段名
                    label: 'name',         // 显示名称
                    children: 'children'    // 子级字段名
                  }"
              default-expand-all
              :filter-node-method="filterNode"
              :expand-on-click-node="false"
              @node-click="handleNodeClick"
              ref="leftTree">
            </el-tree>
          </el-card>
        </el-col>
        <el-col :span="19">
          <el-row :gutter="15">
            <el-col :span="4">
              <span>编号：</span>
              <el-input v-model="deviceCode" type="text" style="width:60%"></el-input>
            </el-col>
            <el-col :span="8">
              <span>设备类型：</span>
              <el-cascader 
                ref="brandType"
                :options="deviceTypeInfo" 
                style="width:60%" 
                v-model="deviceType"
                :props="{ checkStrictly: true, value: 'id', label: 'name', children: 'children' }"
                clearable
                filterable 
              ></el-cascader>
            </el-col>
            <el-col :span="6">
              <span>品牌型号：</span>
              <el-cascader 
                ref="brandType"
                :options="brandList" 
                style="width:60%" 
                v-model="brandTypeName"
                :props="{ checkStrictly: true, value: 'id', label: 'name', children: 'children' }"
                clearable
                filterable 
              ></el-cascader>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" size="small" @click="queryDeviceInfoClick">
                  <i class="el-icon-search"></i>
                  查询
                </el-button>
                <el-button type="primary" size="small" @click="clearCondition">
                  <i class="el-icon-delete"></i>
                  重置
                </el-button>
            </el-col>
          </el-row>
          <!-- <el-row>
            <el-col>
              <div class="query-btn-group">
                <el-button type="primary" size="small" @click="queryDeviceInfoClick">
                  <i class="el-icon-search"></i>
                  查询
                </el-button>
                <el-button type="primary" size="small" @click="clearCondition">
                  <i class="el-icon-delete"></i>
                  重置
                </el-button>
              </div>
            </el-col>
          </el-row> -->
          <div>
            <el-table
              :data="deviceData"
              style="width: 100%; margin: 20px 0"
              border
              highlight-current-row
              @current-change="selectDevice"
              :key="devKey"
            >
              <el-table-column
                prop="name"
                label="设备名称"
                show-overflow-tooltip
                sortable
                width="180"
              >
              </el-table-column>
              <el-table-column prop="code" label="设备编号" show-overflow-tooltip width="180">
              </el-table-column>
              <el-table-column prop="typeName" label="产品类型" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="modelName" label="品牌型号" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="siteName" label="所处位置" show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="deviceStatus"
                label="设备状态"
                show-overflow-tooltip
                :formatter="typeTranslate"
              >
              </el-table-column>
              <el-table-column prop="beginRunTime" label="投入运行时间" show-overflow-tooltip>
              </el-table-column>
            </el-table>
            <Pagination :page="page" :size="size" :total="total" :key="pageKey" @pagination="queryByPage"></Pagination>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deviceDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveDeviceInfo()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getFilterFlag } from "@/util/getFilterFlag";
import { modifyData } from "@/util/domainFilter";
import { sdcDeviceModeAction } from "@/api/sdc/brandInfo";
import { sdcSiteAction } from "@/api/sdc/addressInfo";
import { sdcDeviceTypeAction, getDeviceTypeById } from "@/api/sdc/deviceType"
import { sdcDeviceAction, getSdcDeviceTable, getDevStatusList} from "@/api/sdc/deviceInfo";

import Pagination from "@/components/Pagination";

  export default {
    components: {
      Pagination,
    },
    data() {
      return {
        title:"",
        dialogVisible:false,
        loading:false,
        method:"",
        name:"",//类型名称
        spot:"",//风险点
        source:"",//风险源
        requiredList:[
          {
            label:'是',
            value:1
          },
          {
            label:"否",
            value:0
          }
        ],
        itemTypeList:[
          {
            label:"选择项",
            value:1
          },
          {
            label:"数字项",
            value:2
          },
          {
            label:"文本项",
            value:3
          },
          {
            label:"拍照项",
            value:4
          }
        ],
        optionTypeList:[
          {
            label:"单选",
            value:0
          },
          {
            label:"多选",
            value:1
          }
        ],
        // 是否合格
        qualifiedList:[
          {
            label:"是",
            value:1
          },
          {
            label:"否",
            value:0
          }
        ],
        // 是否合格
        selectedList:[
          {
            label:"是",
            value:1
          },
          {
            label:"否",
            value:0
          }
        ],
        optionRelationList:[
          {
            label:"全为合格项才算合格",
            value:0
          },
          {
            label:"只要包含合格项即为合格",
            value:1
          }
        ],
        multipleLinesList:[
          {
            label:"是",
            value:1
          },
          {
            label:"否",
            value:0
          }
        ],
        selecteddataList:[
          {
            label:"合格选项",
            value:0
          },
          {
            label:"不合格选项",
            value:1
          }
        ],
        // 是否必须拍照
        mustPhotoList:[
          {
            label:"是",
            value:1
          },
          {
            label:"否",
            value:0
          }
        ],
        inputForm: {
          treeId:"",
          parentId:"",
          typeName:"", //风险类型名称
          pointName:"",  //风险点名称
          sourceName:"", //风险源名称
          itemName:"",
          required:"",
          sort:"",
          itemType:"1",
          optionType:"",//选项类型
          optionRelation:"",// 选项关系 0-全合格才合格；1-只要包含合格项就合格
          photoQualifiedName:"",//合格项名称
          photoUnqualifiedName:"",//不合格项名称
          photoSelected:"",//默认选择
          optionItemList:[
            {
              optionName:"",
              qualified:"",
              selected:"",
              checkId:"",
              sort:0
            }
          ],
          numberItem:{
            decimalNum:"",// 小数点后位数
            defaultValue:"", // 默认输入值
            upperLimit:"",// 合格值上限
            lowerLimit:"",// 合格值下限
            checkId:""
          },
          textItem:{
            multipleLines:"",
            defaultValue:"",
            qualifiedName:"",
            unqualifiedName:"",
            selected:"",
            checkId:""
          },
          photoItemList:[
            {
              checkId:"",//拍照项表id
              placeName:"",
              mustPhoto:"",
              num:""
            }
          ],
        deviceItem: {
          deviceId: "",
          deviceName: '',
          siteId:"",
          param: '',
          paramId: '', //监测点
          defaultValue:"", // 默认输入值
          upperLimit:"",// 合格值上限
          lowerLimit:"",// 合格值下限
          checkId:""
        },
          remarks:""
        },
        timeout:null,
        // 选择设备相关
        devicePosition: '',
        paramList: [],
        deviceDialogVisible: false,
        selectName: '',
        filterText: '',
        siteData: [],
        deviceCode: null,
        deviceTypeInfo: null,
        devStatusMap: [],
        deviceType: [],
        brandList: [],
        brandTypeName: [],
        deviceData: [],
        devKey: Math.random().toString(36).slice(-6),
        page: 1,
        size: 5,
        total: 0,
        pageKey: Math.random().toString(36).slice(-6),
        queryCondition: {
          current: 1,
          size: 5
        },
        deviceRowInfo: {},
        btnType: 1,
        isDisabled: false
      }
    },
    watch: {
      'inputForm.numberItem.upperLimit':{
        handler() {
          if(this.inputForm.numberItem.lowerLimit != '') {
            if(Number(this.inputForm.numberItem.upperLimit) <= Number(this.inputForm.numberItem.lowerLimit)) {
              this.$message.warning('合格值上限值需大于合格值下限值')
              this.inputForm.numberItem.upperLimit = ''
            }
          }
        },
        deep:true
      },
      'inputForm.numberItem.lowerLimit':{
        handler() {
          if(this.inputForm.numberItem.upperLimit != '') {
            if(Number(this.inputForm.numberItem.upperLimit) <= Number(this.inputForm.numberItem.lowerLimit)) {
              this.$message.warning('合格值下限值需小于合格值上限值')
              this.inputForm.numberItem.lowerLimit = ''
            }
          }
        },
        deep:true
      },
      'inputForm.deviceItem.upperLimit':{
        handler() {
          if(this.inputForm.deviceItem.lowerLimit != '') {
            if(Number(this.inputForm.deviceItem.upperLimit) <= Number(this.inputForm.deviceItem.lowerLimit)) {
              this.$message.warning('合格值上限值需大于合格值下限值')
              this.inputForm.deviceItem.upperLimit = ''
            }
          }
        },
        deep:true
      },
      'inputForm.deviceItem.lowerLimit':{
        handler() {
          if(this.inputForm.deviceItem.upperLimit != '') {
            if(Number(this.inputForm.deviceItem.upperLimit) <= Number(this.inputForm.deviceItem.lowerLimit)) {
              this.$message.warning('合格值下限值需小于合格值上限值')
              this.inputForm.deviceItem.lowerLimit = ''
            }
          }
        },
        deep:true
      },
      filterText(val) {
        this.$refs.leftTree.filter(val);
      }
    },
    computed: {
      contentViewHeight () {
        let height = this.$store.state.common.documentClientHeight - 122
        return {minHeight: height + 'px'}
      },
      paramsDisabled() {
        return this.inputForm.deviceItem.siteId ? false : true
      }
    },
    created() {
      this.getDevStatusList()
      this.getBrandList()
      this.getSiteData()
      this.getDevTypeList()
      this.queryDeviceInfo()
    },
    methods: {
      // tab 切换
      handleClick(tab, event) {
        console.log(tab, event);
      },
      // 保留小数位数
      keepDecimals() {
        if(this.inputForm.numberItem.defaultValue===''||this.inputForm.numberItem.decimalNum===''){
          return
        }
        this.inputForm.numberItem.defaultValue = parseFloat(this.inputForm.numberItem.defaultValue).toFixed(this.inputForm.numberItem.decimalNum)
      },
      enableEdit() {
        this.title = '编辑检查项'
        this.isDisabled = false
        this.method = 'edit'
        this.btnType = 2
      },
      init(method,id,...param) {
        this.method = method
        this.inputForm.treeId = id
        if(method == 'add') {
          this.title = '添加检查项'
          this.isDisabled = false
          this.inputForm.parentId = param[1]
          this.inputForm.typeName = param[0]
          this.inputForm.pointName = param[2]
          this.inputForm.sourceName = param[3]
          if(this.inputForm.id) {
            this.inputForm.id = ''
          }
        }else if(method == 'edit') {
          this.title = '编辑检查项'
          this.isDisabled = false
        }else if(method == 'view') {
          this.title = '检查项详情'
          this.isDisabled = true
          this.btnType = 1
        }
        this.dialogVisible = true
        this.loading = false
        this.$nextTick(() => {
          this.initialization()//初始化
          if(method == 'edit' || method == 'view') {
            // 修改或查看
            this.loading = true
            this.$http({
              url:`/check/inspect/checkItem/queryByTreeid?treeId=${this.inputForm.treeId}`,
              method:"get",
            }).then(({data}) => {
              if(data && data.success) {
                if (data.checkItem.deviceItem) {
                  getSdcDeviceTable({id: data.checkItem.deviceItem.deviceId}).then(res => {
                    if (res.data.code === 0) {
                      getDeviceTypeById(res.data.data.records[0].type).then(res => {
                        if (res.data.code === 0) {
                          let metadata = JSON.parse(res.data.data.metadata)
                          this.paramList = metadata.properties
                          this.loading = false
                        }
                      })
                    }
                  })
                }
                this.inputForm = this.recover(this.inputForm, data.checkItem)
                // console.log('inputForm---> ', this.inputForm.numberItem.defaultValue)
                // console.log('data.checkItem---> ', data.checkItem.numberItem.defaultValue)
                // this.inputForm = Object.assign(this.inputForm,data.checkItem)
                this.inputForm.itemType = this.inputForm.itemType +''
                if(this.inputForm.itemType != 1){
                    this.inputForm.optionItemList = [
                        {
                          optionName:"",
                          qualified:"",
                          selected:"",
                          checkId:"",
                          sort:0
                        }
                      ]
                }
                if(this.inputForm.itemType != 2){
                  this.inputForm.numberItem={
                              decimalNum:"",// 小数点后位数
                              defaultValue:"", // 默认输入值
                              upperLimit:"",// 合格值上限
                              lowerLimit:"",// 合格值下限
                              checkId:""
                            }
                }
                if(this.inputForm.itemType != 3){
                  this.inputForm.textItem = {
                            multipleLines:"",
                            defaultValue:"",
                            qualifiedName:"",
                            unqualifiedName:"",
                            selected:"",
                            checkId:""
                          }
                }
                if(this.inputForm.itemType != 4){
                  this.inputForm.photoItemList=[
                      {
                        checkId:"",//拍照项表id
                        placeName:"",
                        mustPhoto:"",
                        num:""
                      }
                    ]
                }
                if(this.inputForm.itemType != 5){
                  this.inputForm.deviceItem=
                      {
                        deviceId: "",
                        deviceName: '',
                        siteId:"",
                        param: '',
                        paramId: '', //监测点
                        defaultValue:"", // 默认输入值
                        upperLimit:"",// 合格值上限
                        lowerLimit:"",// 合格值下限
                        checkId:""
                      }
                }
              }
              this.inputForm.parentId = param[1]
              this.inputForm.typeName = param[0]
              this.inputForm.pointName = param[2]
              this.inputForm.sourceName = param[3]
              this.loading = false
              console.info(this.inputForm)
            })
          }
        })
      },
      // 添加选项
      addoption() {
        this.inputForm.optionItemList.push({
          optionName:"",
          qualified:"",
          selected:"",
          checkId:"",
          sort:""
        })
      },
      // 移除选型
      deloption(index) {
        this.inputForm.optionItemList.splice(index,1)
      },
      // 添加拍照点
      addphoto() {
        this.inputForm.photoItemList.push(
          {
            checkId:"",
            placeName:"",
            mustPhoto:"",
            num:""
          }
        )
      },
      // 移除拍照点
      delphoto(index) {
        this.inputForm.photoItemList.splice(index,1)
      },
      doSubmit() {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.keepDecimals()
            this.loading = true
            this.$http({
              url:"/check/inspect/checkItem/save",
              method:"post",
              data:this.inputForm
            }).then(({data}) => {
              if(data && data.success) {
                this.dialogVisible = false;
                this.$message.success(data.msg)
                this.$emit('refreshList')
              }
              this.loading = false
            })
          }
        })
      },
      initialization() {
        this.inputForm.itemName="",
        this.inputForm.required="",
        this.inputForm.sort="",
        this.inputForm.itemType="1",
        this.inputForm.optionType="",//选项类型
        this.inputForm.optionRelation="",// 选项关系 0-全合格才合格；1-只要包含合格项就合格
        this.inputForm.photoQualifiedName="",//合格项名称
        this.inputForm.photoUnqualifiedName="",//不合格项名称
        this.inputForm.photoSelected="",//默认选择
        this.inputForm.optionItemList = [
          {
            optionName:"",
            qualified:"",
            selected:"",
            checkId:"",
            sort:0
          }
        ],
        this.inputForm.numberItem = {
          decimalNum:"",// 小数点后位数
          defaultValue:"", // 默认输入值
          upperLimit:"",// 合格值上限
          lowerLimit:"",// 合格值下限
          checkId:""
        },
        this.inputForm.textItem={
          multipleLines:"",
          defaultValue:"",
          qualifiedName:"",
          unqualifiedName:"",
          selected:"",
          checkId:""
        },
        this.inputForm.photoItemList=[
          {
            checkId:"",//拍照项表id
            placeName:"",
            mustPhoto:"",
            num:""
          }
        ],
        this.inputForm.remarks = ""
      },
      dialogClosed() {
        this.$refs.inputForm.resetFields()
        this.devicePosition = ''
        this.paramList = []
        this.inputForm =   {
          treeId:"",
          parentId:"",
          typeName:"", //风险类型名称
          pointName:"",  //风险点名称
          sourceName:"", //风险源名称
          itemName:"",
          required:"",
          sort:"",
          itemType:"1",
          optionType:"",//选项类型
          optionRelation:"",// 选项关系 0-全合格才合格；1-只要包含合格项就合格
          photoQualifiedName:"",//合格项名称
          photoUnqualifiedName:"",//不合格项名称
          photoSelected:"",//默认选择
          optionItemList:[
            {
              optionName:"",
              qualified:"",
              selected:"",
              checkId:"",
              sort:0
            }
          ],
          numberItem:{
            decimalNum:"",// 小数点后位数
            defaultValue:"", // 默认输入值
            upperLimit:"",// 合格值上限
            lowerLimit:"",// 合格值下限
            checkId:""
          },
          textItem:{
            multipleLines:"",
            defaultValue:"",
            qualifiedName:"",
            unqualifiedName:"",
            selected:"",
            checkId:""
          },
          photoItemList:[
            {
              checkId:"",//拍照项表id
              placeName:"",
              mustPhoto:"",
              num:""
            }
          ],
        deviceItem: {
          deviceId: "",
          deviceName: '',
          siteId:"",
          param: '',
          paramId: '', //监测点
          defaultValue:"", // 默认输入值
          upperLimit:"",// 合格值上限
          lowerLimit:"",// 合格值下限
          checkId:""
        },
          remarks:""
        }
      },
      /**
       * 设备相关
       */
      async getSiteData() {
        let data = await sdcSiteAction("", "/tree", "get");
        this.siteData = modifyData(data.data.data);
      },
      async getBrandList() {
        let data = await sdcDeviceModeAction("", "/tree", "get");
        this.brandList = modifyData(data.data.data);
      },
      async getDevTypeList() {
        let devTypeData = await sdcDeviceTypeAction("", "/tree", "get")
        this.deviceTypeInfo = modifyData(devTypeData.data.data)
        console.log(this.deviceTypeInfo,'dev type info');
      },
      async getDevStatusList() {
        this.devStatusMap = [];
        let devStatusList = await getDevStatusList();
        devStatusList.data.data.forEach((el) => {
          this.devStatusMap.push({
            value: el.value.toString(),
            label: el.description,
          });
        });
      },
      // 选择设备输入框获取焦点后打开选择设备对话框
      openDeviceDialog() {
        this.deviceDialogVisible = true
      },
      queryDeviceInfoClick() {
        this.setQueryCondition()
        this.queryCondition.current = 1
        this.queryDeviceInfo()
      },
      async queryDeviceInfo() {
        this.deviceData = []
        let queryTableData = await getSdcDeviceTable(this.queryCondition);
        this.deviceData = queryTableData.data.data.records;
        this.setpage(queryTableData.data.data);
        this.devKey = new Date().toString();
      },
      setpage(data) {
        this.page = data.current;
        this.size = data.size;
        this.total = data.total;
        this.pageKey = (new Date()).toString() + 1
      },
      // 关闭tag
      handleNodeClose() {
        this.queryId = ""
        this.queryCondition.siteId = ""
        this.selectName = ''
        this.queryDeviceInfoClick()
      },
      filterNode (value, data, node) {
        return getFilterFlag(value, data, node)
      },
      handleNodeClick (data) {
        this.queryId = data.id === 0 ? "" : data.id;
        this.queryCondition.siteId = this.queryId
        this.selectName = '已选区域: ' + data.name
        this.queryDeviceInfo()
      },
      queryDeviceInfoClick() {
        this.setQueryCondition()
        this.queryCondition.current = 1
        this.queryDeviceInfo()
      },
      clearCondition() {
        this.deviceType = []
        this.deviceSiteId = []
        this.brandTypeName = []
        this.deviceCode = null
        this.queryId = null
        this.handleNodeClose()
      },
      async queryByPage(data) {
        this.page = data.page
        this.size = data.size
        this.queryCondition.current = this.page
        this.queryCondition.size = this.size
        this.queryDeviceInfo()
      },
      setQueryCondition() {
        this.queryCondition = {
          current: this.page,
          size: this.size
        }
        if(this.brandTypeName.length !== 0) {
          this.queryCondition.model = this.brandTypeName[this.brandTypeName.length - 1]
        }
        this.queryId ? this.queryCondition.siteId = this.queryId : null
        this.deviceType.length !== 0 ? this.queryCondition.type = this.deviceType[this.deviceType.length - 1] : null
        this.deviceCode ? this.queryCondition['expand[codeLike]'] = this.deviceCode : null
      },
      selectDevice(row) {
        this.deviceRowInfo = row
      },
      saveDeviceInfo() {
        this.inputForm.deviceItem.siteId = this.deviceRowInfo.siteId
        this.inputForm.deviceItem.deviceName = this.deviceRowInfo.name
        this.inputForm.deviceItem.deviceId = this.deviceRowInfo.id
        this._getDeviceTypeById(this.deviceRowInfo.type)
      },
      paramChange(val) {
        this.paramList.forEach(item => {
          if (val === item.id) {
            this.inputForm.deviceItem.param = item.name
          }
        })
      },
      // 获取deviceType信息
      _getDeviceTypeById(id) {
        getDeviceTypeById(id).then(res => {
          if (res.data.code === 0) {
            let metadata = JSON.parse(res.data.data.metadata)
            this.paramList = metadata.properties
            this.deviceDialogVisible = false
          }
        })
      },
      typeTranslate(row, column) {
        let rowText;
        for (let i = 0; i < this.devStatusMap.length; i++) {
          let el = this.devStatusMap[i];
          if (el.value === row.deviceStatus) {
            rowText = el.label;
            break;
          }
        }
        return rowText;
      },
    },
  }
</script>
<style scoped>
 .el-input-number__decrease, .el-input-number__increase{
    background: none!important;
  }
  
 /* tab页签头部 */
 .el-tabs--border-card>.el-tabs__header{
  background-color: #042963!important;
  border-bottom: none!important;
  margin: 0!important;
}
 .el-tabs--border-card {
  background: rgba(1, 51, 102, 0.3)!important;
  border:none!important;
}
</style>