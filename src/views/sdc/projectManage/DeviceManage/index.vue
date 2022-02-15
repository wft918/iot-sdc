<template>
  <div>
    <basic-container>
      <el-row :gutter="15">
        <el-col :span="5" class="tree-container">
        <el-card  shadow="never" class="tree-card">
          <!-- <el-tag
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
          </el-input> -->
          <el-tree
            class="filter-tree"
            :data="siteData"
            node-key="id"
            :indent="2"
            accordion
            :default-expanded-keys="expandKey"
            :props="{
                  value: 'id',             // ID字段名
                  label: 'name',         // 显示名称
                  children: 'children'    // 子级字段名
                }"
            :filter-node-method="filterNode"
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
            ref="leftTree">
          </el-tree>
      </el-card>
          <!-- <el-card>
            <el-input
              placeholder="输入关键字进行过滤"
              v-model="filterText">
            </el-input>
            <el-tree
              ref="deviceTree"
              :data="siteData"
              node-key="id"
              :default-expand-all="true"
              :expand-on-click-node="false"
              :default-checked-keys="checkedKey"
              :props="defaultProps"
              :filter-node-method="filterNode"
              @node-click="querySiteInfo"
              :key="devKey"
            >
            </el-tree>
          </el-card> -->
        </el-col>
        <el-col :span="19">
          <el-row :gutter="15">
            <!-- <el-col :span="4">
              <span>编号：</span>
              <el-input v-model="deviceCode" type="text" style="width:70%"></el-input>
            </el-col> -->
            <el-col :span="8">
              <span>设备类型：</span>
              <el-cascader
                ref="brandType"
                :options="deviceTypeInfo"
                style="width:75%"
                v-model="deviceType"
                :props="{ checkStrictly: true, value: 'id', label: 'name', children: 'children' }"
                clearable
                filterable
              ></el-cascader>
            </el-col>
            <!-- <el-col :span="7">
              <span>区域：</span>
              <el-cascader
                ref="brandType"
                :options="siteData"
                style="width:82%"
                v-model="deviceSiteId"
                :props="{value: 'id', label: 'name', children: 'children' }"
                clearable
                filterable
              ></el-cascader>
            </el-col> -->
            <el-col :span="6">
              <span>品牌型号：</span>
              <el-cascader
                ref="brandType"
                :options="brandList"
                style="width:70%"
                v-model="brandTypeName"
                :props="{ checkStrictly: true, value: 'id', label: 'name', children: 'children' }"
                clearable
                filterable
              ></el-cascader>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" size="small" @click="queryDeviceInfoClick">
                <i class="el-icon-search"></i>
                查询
              </el-button>
              <el-button type="primary" size="small" @click="clearCondition">
                <i class="el-icon-delete"></i>
                清空
              </el-button>
            </el-col>
          </el-row>
          <el-row style="margin-top:20px;">
            <el-col :span="23">
              <!-- <el-button type="primary" size="small" @click="setDevice">
                <i class="el-icon-plus"></i>
                新增
              </el-button> -->
              <el-dropdown
                :hide-on-click="false"
                trigger="click"
              >
                <el-button type="primary" size="small">
                  新增<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="addOther">
                    <i class="el-icon-plus"></i> DCIM设备
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="addNVR">
                    <i class="el-icon-plus"></i> 视频监控
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="addGate">
                    <i class="el-icon-plus"></i> 停车设备
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-dropdown
                      placement="right-start"
                      trigger="click"
                    >
                      <span style="color:#606266;font-size: 12px;">
                        <i class="el-icon-plus"></i> 灯杆设备
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="addLight(1)">
                          <i class="el-icon-plus"></i> 灯杆网关
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="addLight(2)">
                          <i class="el-icon-plus"></i> 杆体
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="addLight(3)">
                          <i class="el-icon-plus"></i> 照明设备
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="addLight(4)">
                          <i class="el-icon-plus"></i> 环监设备
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="addLight(5)">
                          <i class="el-icon-plus"></i> 对讲设备
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="addLight(6)">
                          <i class="el-icon-plus"></i> 广播设备
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="addLight(7)">
                          <i class="el-icon-plus"></i> LED设备
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>

                  </el-dropdown-item>

                </el-dropdown-menu>
              </el-dropdown>
              <label class="import-btn" for="importDevcie">导入</label>
              <input type="file" ref="importDevcie" id="importDevcie" @change="deviceTypeImport($event)" style="display:none;" accept=".xls,.xlsx"/>
              <el-button type="primary" size="small" @click="deviceTypeExport">导出</el-button>
              <el-link icon="el-icon-download" type="primary" href="/admin/sys-file/planplat/template_sdc_device.xlsx" :underline="false" style="margin-left: 10px">
                下载导入模板
              </el-link>
            </el-col>
            <el-col :span="1">
              <el-tooltip effect="dark" content="显隐" placement="top">
                <el-button circle="" @click="chooseColumn" size="small" icon="el-icon-menu"></el-button>
              </el-tooltip>
            </el-col>
          </el-row>
          <div>
            <el-table
              :data="deviceData"
              style="width: 100%; margin: 20px 0"
              border
              :key="devKey"
            >
              <el-table-column
              v-if="columnList[0].show"
                prop="name"
                label="设备名称"
                sortable
                width="300"
                show-overflow-tooltip
                header-align="center"
              >
                <template slot-scope="scope">
                  <el-link :underline="false" type="primary" @click="mainPropClick(scope.row)">{{scope.row.name}}</el-link>
                </template>
              </el-table-column>
              <!-- <el-table-column v-if="columnList[1].show" prop="code" label="设备编号" width="258" header-align="center">
              </el-table-column> -->
              <el-table-column v-if="columnList[1].show" prop="typeName" label="产品类型" width="140" show-overflow-tooltip header-align="center">
              </el-table-column>
              <el-table-column v-if="columnList[2].show" prop="modelName" label="品牌型号" width="170" show-overflow-tooltip header-align="center">
              </el-table-column>
              <el-table-column v-if="columnList[3].show" prop="siteName" label="所处位置" width="300" show-overflow-tooltip header-align="center">
              </el-table-column>
              <el-table-column
              v-if="columnList[4].show"
                prop="deviceStatus"
                label="设备状态"
                :formatter="typeTranslate"
                width="100"
                show-overflow-tooltip
                align="center"
              >
              </el-table-column>
              <el-table-column v-if="columnList[5].show" prop="beginRunTime" label="投入运行时间" width="180" show-overflow-tooltip align="center">
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <!-- <span class="table-action" @click="deviceAction(scope.row, 3)"
                    >查看</span
                  >
                  <span class="table-action" @click="deviceAction(scope.row, 2)"
                    >编辑</span
                  > -->
                  <span class="table-action" @click="deviceAction(scope.row, 4)"
                    >删除</span
                  >
                  <!-- <span class="table-action" @click="deviceAction(scope.row, 1)" v-if="scope.row.modelType !== '2'"
                    >添加</span
                  > -->
                </template>
              </el-table-column>
            </el-table>
            <Pagination :page="page" :size="size" :total="total" :key="pageKey" @pagination="queryByPage"></Pagination>
          </div>
        </el-col>
      </el-row>
      <el-dialog
        :visible.sync="dialogFormVisible"
        width="35%"
        ref="emgDialog"
        :close-on-click-modal="false"
        :title="devDialogTitle"
        @close="refreshData"
        v-dialogDrag
      >
        <el-form
          :model="inputForm"
          label-width="120px"
          :rules="rules"
          ref="devForm"
          :key="dialogKey"
          :disabled="isdisabled"
        >
          <el-form-item label="设备编号" prop="code" >
            <el-input v-model="inputForm.code" ></el-input>
          </el-form-item>
          <!-- <el-form-item label="设备序列号" prop="serialNo" >
            <el-input v-model="inputForm.serialNo" ></el-input>
          </el-form-item> -->
          <el-form-item label="设备名称" prop="name" >
            <el-input v-model="inputForm.name" ></el-input>
          </el-form-item>
          <el-form-item label="设备类型" prop="type" >
            <!-- <el-inp 0ut v-model="inputForm.typeName"></el-input> -->
            <el-cascader
              :options="devTypeList"
              style="width:80%"
              v-model="inputForm.type"
              :props="{ checkStrictly: true, value: 'id', label: 'name', children: 'children' }"
              filterable
              @change="changepType"
              :disabled="isFormDisabled"
              ref="typelist"
            ></el-cascader>
            <!-- <el-select
                  v-model="inputForm.type"
                  disabled
                  width="100%"
                >
                  <el-option
                    v-for="(item) in typeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select> -->
          </el-form-item>
          <el-form-item label="设备状态" prop="deviceStatus">
            <el-select v-model="inputForm.deviceStatus">
              <el-option
                v-for="item in devStatusMap"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="品牌型号" prop="mode" >
            <el-cascader
              v-model="inputForm.mode"
              :options="brandList"
              :props="{
                checkStrictly: true,
                value: 'id',
                label: 'name',
                children: 'children',
              }"
              clearable
              filterable
              @change="changeModel"
              :disabled="isFormDisabled"
            >
            </el-cascader>
          </el-form-item>
          <el-form-item label="所处位置" prop="siteId">
            <el-select v-if="isAddLight" v-model="inputForm.siteId" placeholder="请选择">
              <el-option
                v-for="item in siteData"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-cascader
              v-else
              ref="siteChoose"
              :options="siteData"
              style="width: 80%"
              v-model="inputForm.siteId"
              clearable
              filterable
              @change="changeAddress"
              :props="{ checkStrictly: true,value: 'id', label: 'name', children: 'children' }"
            >
            </el-cascader>
            <!-- <el-input v-model="inputForm.siteName" ></el-input> -->
          </el-form-item>
          <el-form-item prop="expand.unitNum" v-if="upTreeData.code == 'rack' || this.inputForm.typeCode === 'rack'" label="U位数量">
            <el-input v-model="inputForm.expand.unitNum"></el-input>
          </el-form-item>
          <el-form-item prop="expand.capacityPower" v-if="upTreeData.code == 'rack' || this.inputForm.typeCode === 'rack'" label="额定电力容量">
            <el-input v-model="inputForm.expand.capacityPower"></el-input>
          </el-form-item>
          <template v-if="lightFlag === 'lightGateWay'">
            <el-form-item prop="expand.host" label="网关IP">
              <el-input v-model="inputForm.expand.host"></el-input>
            </el-form-item>
            <el-form-item prop="expand.port" label="网关端口">
              <el-input v-model="inputForm.expand.port"></el-input>
            </el-form-item>
          </template>
          <template v-if="lightFlag === 'light'">
            <el-form-item prop="expand.gatewayId" label="所属网关">
              <el-select v-model="inputForm.expand.gatewayId">
                <el-option
                  v-for="item in gateWayList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </template>
          <template v-if="lightFlag === 'lightLamp'">
            <el-form-item prop="expand.lightId" label="所属杆体">
              <el-select v-model="inputForm.expand.lightId">
                <el-option
                  v-for="item in lightList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="expand.mac" label="MAC地址">
              <el-input v-model="inputForm.expand.mac"></el-input>
            </el-form-item>
          </template>
          <template v-if="lightFlag === 'lightSensor'">
            <el-form-item prop="expand.lightId" label="所属杆体">
              <el-select v-model="inputForm.expand.lightId">
                <el-option
                  v-for="item in lightList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="expand.mac" label="MAC地址">
              <el-input v-model="inputForm.expand.mac"></el-input>
            </el-form-item>
          </template>
          <template v-if="lightFlag === 'lightIntercom'">
            <el-form-item prop="expand.lightId" label="所属杆体">
              <el-select v-model="inputForm.expand.lightId">
                <el-option
                  v-for="item in lightList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="expand.mac" label="MAC地址">
              <el-input v-model="inputForm.expand.mac"></el-input>
            </el-form-item>
          </template>
          <template v-if="lightFlag === 'lightBroadcast'">
            <el-form-item prop="expand.lightId" label="所属杆体">
              <el-select v-model="inputForm.expand.lightId">
                <el-option
                  v-for="item in lightList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="expand.mac" label="MAC地址">
              <el-input v-model="inputForm.expand.mac"></el-input>
            </el-form-item>
            <!-- <el-form-item label="所属灯杆">
              <el-select>
                <el-option></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="广播设备IP">
              <el-input></el-input>
            </el-form-item>
            <el-form-item label="广播设备端口">
              <el-input></el-input>
            </el-form-item>
            <el-form-item label="广播发送传送方式">
              <el-select>
                <el-option></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="广播接收传送方式">
              <el-select>
                <el-option></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="广播输入音量">
              <el-input></el-input>
            </el-form-item>
            <el-form-item label="广播输出音量">
              <el-input></el-input>
            </el-form-item> -->
          </template>
          <template v-if="lightFlag === 'lightLED'">
            <el-form-item prop="expand.lightId" label="所属杆体">
              <el-select v-model="inputForm.expand.lightId">
                <el-option
                  v-for="item in lightList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="expand.mac" label="MAC地址">
              <el-input v-model="inputForm.expand.mac"></el-input>
            </el-form-item>
            <el-form-item prop="expand.height" label="高度">
              <el-input v-model="inputForm.expand.height"></el-input>
            </el-form-item>
            <el-form-item prop="expand.width" label="宽度">
              <el-input v-model="inputForm.expand.width"></el-input>
            </el-form-item>
          </template>
          <el-form-item label="投入运行时间" prop="beginRunTime">
            <el-date-picker
              v-model="inputForm.beginRunTime"
              type="datetime"
              placeholder="选择日期时间"
              align="right"
              @change="setDate"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="expand.ip" v-if="upTreeData.code == '07603' || inputForm.typeCode === '07603'" label="ip地址">
            <el-input v-model="inputForm.expand.ip"></el-input>
          </el-form-item>
          <template v-if="isGate">
            <el-form-item label="摄像头" prop="expand.ipcIds"  >
              <el-select
                  v-model="inputForm.expand.ipcIds"
                  multiple
                  :disabled="isIpcDisabled"
                >
                  <el-option
                    v-for="(item) in ipcList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="道闸方向" prop="expand.direction"  >
              <el-select
                  v-model="inputForm.expand.direction"
                  :disabled="isIpcDisabled"
                >
                  <el-option
                    v-for="(item) in this.$dictUtils.getDictList('gate_type')"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
              </el-select>
            </el-form-item>
          </template>
          <template v-if="inputForm.camera">
            <el-form-item label="网络视频录像机" prop="nvrId" v-if="inputForm.videoType === '1'">
              <el-select
                  v-model="inputForm.nvrId"
                  width="100%"
                >
                  <el-option
                    v-for="(item) in nvrInfo"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="摄像头类型" prop="expand.appearanceType" v-if="inputForm.videoType === '1'"
                  :rules="[
                    {required: true, message:'请选择摄像头类型', trigger:'blur'}
                  ]" >
              <el-radio-group v-model="inputForm.expand.appearanceType">
                <el-radio :label="'0'" >枪机</el-radio>
                <el-radio :label="'1'">球机</el-radio>
                <!-- <el-radio :label="'2'">转台</el-radio> -->
              </el-radio-group>
            </el-form-item>
            <el-form-item label="识别类型" prop="expand.features" v-if="inputForm.videoType === '1'">
              <el-checkbox-group v-model="inputForm.expand.features">
                <el-checkbox
                  v-for="number in featuresList"
                  :key="number.value"
                  :value="number.value"
                  :label="number.value"
                >{{number.label}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item prop="deviceParentIds" label="所属杆体" v-if="inputForm.videoType === '1'">
              <el-select v-model="inputForm.deviceParentIds">
                <el-option
                  v-for="item in lightInfo"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="IP地址" prop="ip" >
              <el-input v-model="inputForm.ip" ></el-input>
            </el-form-item>
            <el-form-item label="端口" prop="port" >
              <el-input v-model="inputForm.port" ></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="user" >
              <el-input v-model="inputForm.user" ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="passord" >
              <el-input v-model="inputForm.passord" ></el-input>
            </el-form-item>
            <el-form-item label="视频流类型" prop="passord" >
              <el-radio-group v-model="inputForm.videoSourceType">
                <el-radio v-for="item in videoSourceType" :key="item.id" :label="item.value">{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="inputForm.videoSourceType === '1'" label="通道国标编号" prop="channel" >
              <el-input v-model="inputForm.channel" ></el-input>
            </el-form-item>
            <el-form-item v-if="inputForm.videoSourceType === '1'" label="设备国标编号" prop="devicechannel" >
              <el-input v-model="inputForm.devicechannel" ></el-input>
            </el-form-item>
            <el-form-item v-if="inputForm.videoSourceType === '0'" label="流应用名" prop="streamApp" >
              <el-input v-model="inputForm.streamApp" ></el-input>
            </el-form-item>
            <el-form-item v-if="inputForm.videoSourceType === '0'" label="流ID" prop="streamId" >
              <el-input v-model="inputForm.streamId" ></el-input>
            </el-form-item>
            <!-- <el-form-item label="设备名称" prop="name" >
              <el-input v-model="inputForm.name" :disabled="isFormDisabled"></el-input>
            </el-form-item> -->
          </template>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <template v-if="inputForm.actionType === 3">
            <el-button @click="dialogFormVisible = false" size="small"
            >关闭</el-button>
            <el-button v-if="btnType === 1" type="primary" @click="enableEdit" size="small"
            >编辑</el-button>
            <el-button v-if="btnType === 2" type="primary" @click="submitForm" size="small"
            >保存</el-button>
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
          <el-button type="primary" @click="deleteData">确 定</el-button>
          <el-button @click="dialogVisible = false"
            >取 消</el-button
          >
        </span>
      </el-dialog>
      <el-dialog
        :visible.sync="dialogColumnVisible"
        title="请选择要显示的列"
        :close-on-click-modal="false"
        width="35%"
        v-dialogDrag
      >
        <el-checkbox v-for="item in columnList" v-model="item.show" :key="item.prop">{{item.label}}</el-checkbox>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";

import store from "@/store";
import { getStore } from "@/util/store";
import { getFilterFlag } from "@/util/getFilterFlag";

import {
  sdcDeviceAction,
  getSdcDeviceTable,
  getDevStatusList,
  getSdcDeviceByModel,
  getSdcDeviceByType,
  getSdcNVR,
  getSdcTableBy,
  sdcDeviceImport,
  sdcDeviceExport
} from "@/api/sdc/deviceInfo";
import { sdcDeviceModeAction } from "@/api/sdc/brandInfo";
import { modifyData, nvrTypeMap,modifySite } from "@/util/domainFilter";
import { sdcSiteAction } from "@/api/sdc/addressInfo";
import { sdcDeviceTypeAction,getSdcDeviceTypeTree } from "@/api/sdc/deviceType"
import { getFirstChild } from "@/util/getFirstChild";
import moment from "moment";

export default {
  components: {
    Pagination,
  },
  data() {
    return {
      page: 1,
      size: 10,
      total: 0,
      nodeData: null,
      dialogFormVisible: false,
      dialogVisible: false,
      dialogKey: Math.random().toString(36).slice(-6),
      devKey: Math.random().toString(36).slice(-6),
      pageKey: Math.random().toString(36).slice(-6),
      delId: null,
      queryId: null,
      brandList: [],
      devTypeList: [],
      isdisabled: false,
      isFormDisabled: false,
      devDialogTitle: '',
      siteData: [],
      // filterText: '',
      selectName: '',
      headers: {
        Authorization: "Bearer " + store.getters.access_token,
      },
      devStatusMap: [],
      dialogData: {
        actionType: null,
        editId: null,
        dialogFormVisible: false,
        parentDevice: null,
      },
      defaultProps: {
        children: "children",
        label: "name",
      },
      checkedKey: ["park01"],
      condition: [
        {
          code: "0",
          id: 0,
          name: "全部",
          parentId: "",
          remarks: "",
          sort: 0,
          type: "",
          children: [],
        },
      ],
      deviceData: [],
      videoSourceType: this.$dictUtils.getDictList('video_source_type'),
      inputForm: {
        id: null,
        code: null,
        // serialNo: null,
        name: null,
        parentDevice: null,
        type: null,
        sort: 1,
        deviceInfo: null,
        deviceImg: null,
        abnormalImg: null,
        normalImg: null,
        remarks: null,
        beginRunTime: null,
        mode: null,
        siteName: null,
        deviceStatus: null,
        siteId: null,
        camera: false,
        channel: null,
        devicechannel:null,
        videoType: null,
        nvrId: null,
        ip: null,
        port: null,
        user: null,
        passord: null,
        streamApp: null,
        streamId: null,
        videoSourceType: '0',
        expand: {
          ipcIds: [],
          direction: null,
          unitNum: null,
          capacityPower: null,
          features: [],
          ip: null
        },
        deviceParentIds: null
      },
      rules: {
          code: [
            { required: true, message: "请输入设备类型编号", trigger: "blur" },
          ],
          name: [
            { required: true, message: "请输入设备类型名称", trigger: "blur" },
          ],
          type: [{ required: true, message: "请选择产品类型", trigger: "change" }],
          mode: [{ required: true, message: "请选择品牌型号", trigger: "change" }],
          beginRunTime: [
            { required: true, message: "请选择运行时间", trigger: "change" },
          ],
          siteId: [
            { required: true, message: "请选择所处位置", trigger: "change" },
          ],
          deviceStatus: [
            { required: true, message: "请选择设备状态", trigger: "change" },
          ],
          channel: [
            { required: true, message: "请输入通道国标编号", trigger: "blur" },
          ],
          devicechannel: [
            { required: true, message: "请输入设备国标编号", trigger: "blur" },
          ],
          streamApp: [
            { required: true, message: "请输入流应用名", trigger: "blur" },
          ],
          streamId: [
            { required: true, message: "请输入流ID", trigger: "blur" },
          ],
          ip: [
            { required: true, message: "请输入IP地址", trigger: "blur" },
          ],
          port: [
            { required: true, message: "请输入端口号", trigger: "blur" },
          ],
          nvrId: [
            { required: true, message: "请选择网络视频录像机", trigger: "blur" },
          ],
          expand: {
            ip: [
              { required: true, message: "请输入ip地址", trigger: "blur" },
            ],
            unitNum: [
              { required: true, message: "请输入U位数量", trigger: "blur" }
            ],
            capacityPower: [
              { required: true, message: "请输入额定电力容量", trigger: "blur" }
            ],
            host: [
              { required: true, message: "请输入网关IP", trigger: "blur" },
            ],
            port: [
              { required: true, message: "请输入网关端口", trigger: "blur" },
            ],
            gatewayId: [
              { required: true, message: "请选择网关", trigger: "blur" },
            ],
            lightId: [
              { required: true, message: "请选择杆体", trigger: "blur" },
            ],
            mac: [
              { required: true, message: "请输入MAC地址", trigger: "blur" },
            ],
            height: [
              { required: true, message: "请输入高度", trigger: "blur" },
            ],
            width: [
              { required: true, message: "请输入宽度", trigger: "blur" },
            ],
          },
        },
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },
      upTreeData:{},
      nvrInfo: [],
      nvrList: nvrTypeMap,
      filterText: '',
      deviceType: [],
      deviceSiteId: [],
      brandTypeName: [],
      deviceCode: null,
      queryCondition: {},
      isGate: false,
      deviceTypeInfo: null,
      devTypeFlag: null,
      isIpcDisabled: true,
      ipcList: [],
      lightFlag: null,
      gateWayList: [],
      lightList: [],
      lightInfo: [],
      featuresList:[
        { label: '人脸识别', value: '0' },
        { label: '烟火识别', value: '1' },
        { label: '安全帽识别', value: '2' },
        { label: '车牌识别', value: '3' },
        { label: '移动侦测', value: '4' },
        { label: '越界识别', value: '5' },
      ],
      isAddLight: false,
      rootParentNodeId: '',
      columnList: [
        {
          prop: 'name',
          label: '设备名称',
          show: true
        },
        // {
        //   prop: 'code',
        //   label: '设备编号',
        //   show: true
        // },
        {
          prop: 'typeName',
          label: '产品类型',
          show: true
        },
        {
          prop: 'modelName',
          label: '品牌型号',
          show: true
        },
        {
          prop: 'siteName',
          label: '所处位置',
          show: true
        },
        {
          prop: 'deviceStatus',
          label: '设备状态',
          show: true
        },
        {
          prop: 'beginRunTime',
          label: '投入运行时间',
          show: true
        }
      ],
      dialogColumnVisible: false,
      btnType: 1,
      expandKey: []
    };
  },
  watch: {
      filterText(val) {
        this.$refs.leftTree.filter(val);
      }
    },
    computed: {
      contentViewHeight () {
        let height = this.$store.state.common.documentClientHeight - 122
        return {minHeight: height + 'px'}
      },
    },
  created() {
    this.getNVRInfo()
    this.getLightInfo()
    this.getDevStatusList();
    this.getBrandList();
    this.getSiteData();
    this.getDevTypeList()
    this.init();
    // console.log(this.videoSourceType);
  },
  methods: {
    async getNVRInfo() {
      this.nvrInfo = []
      let nvrInfo = await getSdcNVR(1,100,'0')
        nvrInfo.data.data.records.forEach(el => {
          this.nvrInfo.push({
            value: el.id,
            label: el.name
          })
        })
    },
    async getLightInfo() {
      this.lightInfo = []
      let lightInfo = await getSdcTableBy({
        current: 1,
        size: 200,
        topTypeCode: "light",
      })
        lightInfo.data.data.records.forEach(el => {
          this.lightInfo.push({
            value: el.id,
            label: el.name
          })
        })
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
    async getDevTypeList() {
      let devTypeData = await sdcDeviceTypeAction("", "/tree", "get")
      this.deviceTypeInfo = modifyData(devTypeData.data.data)
      console.log(this.deviceTypeInfo,'dev type info');
    },
    async getSiteData() {
      let data = await sdcSiteAction("", "/tree", "get");
      this.siteData = modifyData(data.data.data);
      let firstChild = []
      this.expandKey = []
      getFirstChild(this.siteData,firstChild, 'F00')
      this.expandKey.push(firstChild[0].id)
      console.log(this.expandKey,'this.expandKey');
    },
    //去掉空的children
    async getBrandList() {
      let data = await sdcDeviceModeAction("", "/tree", "get");
      this.brandList = modifyData(data.data.data);
    },
    //转换表格中siteType的显示
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
    //初始化获取数据
    async init() {
      this.condition[0].children = [];
      this.deviceData = [];
      this.expandKey = []
      let data = await sdcDeviceAction("", "/tree", "get");
      this.condition[0].children = data.data.data;
      this.queryDeviceInfo()
    },
    async queryByPage(data) {
      // this.queryCondition.deviceSiteId = this.queryId
      this.page = data.page
      this.size = data.size
      this.queryCondition.current = this.page
      this.queryCondition.size = this.size
      this.queryDeviceInfo()
    },
    // 控制列显隐
    chooseColumn() {
      this.dialogColumnVisible = true
    },
    async mainPropClick(data) {
      this.btnType = 1
      this.devTypeList = this.deviceTypeInfo
      switch (data.typeCode) {
        case 'light_gateway':
          this.lightFlag = 'lightGateWay'
          this.getLightList()
          break;
        case 'light':
          this.getGateWaysList()
          this.lightFlag = 'light'
          break;
        case 'light_lamp':
          this.lightFlag = 'lightLamp'
          this.getLightList()
          break;
        case 'light_sensor':
          this.lightFlag = 'lightSensor'
          this.getLightList()
          break;
        case 'ligth_inercom':
          this.lightFlag = 'lightIntercom'
          this.getLightList()
          break;
        case 'light_broadcast':
          this.lightFlag = 'lightBroadcast'
          this.getLightList()
          break;
        case 'light_led':
          this.lightFlag = 'lightLED'
          this.getLightList()
          break;
      }
      let queryData = await sdcDeviceAction("", "/" + data.id, "get");
      this.inputForm = queryData.data.data;
      this.inputForm.parentDevice = queryData.data.data.parentName;
      this.devDialogTitle = '查看设备信息';
      this.inputForm.mode = this.inputForm.model
      this.isdisabled = true;
      if(this.inputForm.typeCode.indexOf('ipc') != -1  || this.inputForm.typeCode.indexOf('nvr') != -1) {
        this.inputForm.camera = true
      }
      if(this.inputForm.topTypeCode === 'barrier') {
        this.isGate = true
        this.devTypeFlag = 2
        this.changeAddress([])
      }
      if(this.inputForm.expand === null) {
        this.inputForm.expand = {
          ipcIds: [],
          direction: null
        }
      }
      this.dialogFormVisible = true;
      this.inputForm.actionType = 3;
      this.dialogKey = new Date().toString();
    },
    enableEdit() {
      this.isdisabled = false
      this.btnType = 2
      this.devDialogTitle = '编辑设备信息'
      this.isFormDisabled = true
      !this.inputForm.expand ? this.inputForm.expand = {
            features: []
          } : ''
    },
    //删除数据
    deleteData() {
      this.dialogVisible = false;
      sdcDeviceAction("", "/" + this.delId, "delete").then((res) => {
        if (res.data.code === 0) {
          this.queryId = "";
          this.$message.success('删除成功')
          this.init();
        }
        
      });
    },
    async deviceAction(data, type) {
      this.devTypeList = this.deviceTypeInfo
      console.log(data,'data');
      // this.inputForm = {};

      switch (data.typeCode) {
        case 'light_gateway':
          this.lightFlag = 'lightGateWay'
          this.getLightList()
          break;
        case 'light':
          this.getGateWaysList()
          this.lightFlag = 'light'
          break;
        case 'light_lamp':
          this.lightFlag = 'lightLamp'
          this.getLightList()
          break;
        case 'light_sensor':
          this.lightFlag = 'lightSensor'
          this.getLightList()
          break;
        case 'ligth_inercom':
          this.lightFlag = 'lightIntercom'
          this.getLightList()
          break;
        case 'light_broadcast':
          this.lightFlag = 'lightBroadcast'
          this.getLightList()
          break;
        case 'light_led':
          this.lightFlag = 'lightLED'
          this.getLightList()
          break;
      }

      if (type === 4) {
        this.dialogVisible = true;
        this.delId = data.id;
        return;
      }
      let queryData = await sdcDeviceAction("", "/" + data.id, "get");
      console.log(queryData, "查询结构");
      switch (type) {
        case 2:
          this.inputForm = queryData.data.data;
          !this.inputForm.expand ? this.inputForm.expand = {
            features: []
          } : ''
          this.inputForm.parentDevice = queryData.data.data.parentName;
          this.inputForm.parentId = queryData.data.data.parentId;
          this.devDialogTitle = '编辑设备信息';
          this.inputForm.mode = this.inputForm.model
          this.isdisabled = false;
          this.isFormDisabled = true
          break;
        case 3:
          this.btnType = 1
          this.inputForm = queryData.data.data;
          this.inputForm.parentDevice = queryData.data.data.parentName;
          this.devDialogTitle = '查看设备信息';
          this.inputForm.mode = this.inputForm.model
          this.isdisabled = true;
          break;
      }
      if(this.inputForm.typeCode.indexOf('ipc') != -1  || this.inputForm.typeCode.indexOf('nvr') != -1) {
        this.inputForm.camera = true
      }
      if(this.inputForm.topTypeCode === 'barrier') {
        this.isGate = true
        this.devTypeFlag = 2
        this.changeAddress([])
      }
      if(this.inputForm.expand === null) {
        this.inputForm.expand = {
          ipcIds: [],
          direction: null
        }
      }
      this.dialogFormVisible = true;
      this.inputForm.actionType = type;
      console.log(this.inputForm, "inputForm data");
      this.dialogKey = new Date().toString();
    },
    async getLightList() {
      this.lightList = []
      let light
      for (let index = 0; index < this.deviceTypeInfo.length; index++) {
            const el = this.deviceTypeInfo[index];
            if(el.code === 'light' ) {
              light = el.id
            }
          }
      let queryLightData = await getSdcDeviceTable({type:light});
          for (let index = 0; index < queryLightData.data.data.records.length; index++) {
            const element = queryLightData.data.data.records[index];
            this.lightList.push({
              value: element.id,
              label: element.name
            })
          }
    },
    async getGateWaysList() {
      this.gateWayList = []
      let gateway = null
          for (let index = 0; index < this.deviceTypeInfo.length; index++) {
            const el = this.deviceTypeInfo[index];
            if(el.code === 'light_gateway' ) {
              gateway = el.id
            }
          }
      let queryTableData = await getSdcDeviceTable({type:gateway});
          for (let index = 0; index < queryTableData.data.data.records.length; index++) {
            const element = queryTableData.data.data.records[index];
            this.gateWayList.push({
              value: element.id,
              label: element.name
            })
          }
    },
    submitForm() {
      console.log(this.inputForm);
      this.$refs.devForm.validate((valid) => {
        if (valid) {
          console.log(this.inputForm,'inputForm');
          if(!this.inputForm.camera) {
            this.inputForm.videoSourceType = null
          }
          // this.inputForm.tenantId = getStore({ name: "tenantId" });
          this.inputForm.actionType === 1
            ? sdcDeviceAction(this.inputForm, "", "post").then((res) => {
              if (res.data.code === 0) {
                this.$message.success('添加成功')
                this.dialogFormVisible = false;
                this.init();
              }
            })
            : sdcDeviceAction(this.inputForm, "", "put").then((res) => {
              if (res.data.code === 0) {
                this.$message.success('编辑成功')
                this.dialogFormVisible = false;
                this.init();
              }
            })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    setpage(data) {
      console.log(data,'data');
      this.page = data.current;
      this.size = data.size;
      this.total = data.total;
      this.pageKey = (new Date()).toString() + 1
    },
    handleDeviceAvatarSuccess(val) {
      this.inputForm.deviceImg = val.data.url;
    },
    handleAlarmAvatarSuccess(val) {
      this.inputForm.abnormalImg = val.data.url;
    },
    handleNormolAvatarSuccess(val) {
      this.inputForm.normalImg = val.data.url;
    },
    //查询站点信息
    filterNode (value, data, node) {
        return getFilterFlag(value, data, node)
      },
      handleNodeClick (data,node) {
        console.log(node, '点击的节点');
        this.getRootParentNode(node)
        this.queryId = data.id === 0 ? "" : data.id;
        this.queryCondition.siteId = this.queryId
        // if(data.id !== '0'){
        //     this.queryCondition.siteId = data.id
        //   }else{
        //     this.queryCondition.siteId = ''
        //   }
          this.selectName = '已选区域: ' + data.name
          this.queryDeviceInfo()
      },
      // 获取当前节点的顶级父节点
      getRootParentNode(node) {
        if (node.data.type === 'P00') {
          this.rootParentNodeId = node.data.id
        } else {
          this.getRootParentNode(node.parent)
        }
      },
      handleNodeClose () {
        this.queryId = ""
        this.queryCondition.siteId = ""
        this.selectName = ''
        this.rootParentNodeId = ''
        this.page = 1
        this.setQueryCondition()
        this.queryDeviceInfo()
      },
    // async querySiteInfo(val) {
    //   console.log(val);
    //   this.queryId = val.id === 0 ? "" : val.id;
    //   this.queryCondition.siteId = this.queryId
    //   this.queryDeviceInfo()
    // },
    async changeAddress(val) {
      console.log(val,'val');
      this.ipcList = []
      if(val.length !== 0) {
        this.inputForm.siteId = val[val.length - 1];
      }
      if(this.devTypeFlag === 2) {
        this.isIpcDisabled = false
        let res = await getSdcDeviceTable({ videoType: '1',siteId: this.inputForm.siteId })
        res.data.data.records.forEach( el => {
            this.ipcList.push({
              value: el.id,
              label: el.name
            })
          })
      }
      console.log(this.inputForm, 'this.input');
    },
    changeModel(val) {
      this.inputForm.model = this.inputForm.mode = val[val.length - 1];
    },
    setDate() {
      this.inputForm.beginRunTime = moment(this.inputForm.beginRunTime).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      console.log(this.inputForm.beginRunTime);
    },
    async changepType(val) {
      this.inputForm.type = val[val.length - 1]
      this.findData(this.devTypeList,val[val.length - 1])
      console.log(this.upTreeData, 'upTreeData');
      if(this.upTreeData.code.indexOf('nvr') != -1) {
        this.inputForm.camera = true
        this.inputForm.videoType = '0'
        this.inputForm.nvrId = this.upTreeData.id
      }else if(this.upTreeData.code.indexOf('ipc') != -1) {
        this.inputForm.camera = true
        this.inputForm.videoType = '1'
        this.inputForm.nvrId = null
        this.getNVRInfo()
      }else {
        this.inputForm.camera = false
      }

    },
    //递归遍历数据
    findData(tableData, id) {
      for (let index = 0; index < tableData.length; index++) {
        const element = tableData[index];
        if(element.id === id) {
          this.upTreeData = null
          this.upTreeData = element
          return
        } else {
          if (element.children && element.children.length > 0) {
            this.findData(element.children, id)
          }
        }
      }
    },
    refreshData() {
      this.inputForm = {
        id: null,
        code: null,
        // serialNo: null,
        name: null,
        parentDevice: null,
        type: null,
        sort: 1,
        deviceInfo: null,
        deviceImg: null,
        abnormalImg: null,
        normalImg: null,
        remarks: null,
        beginRunTime: null,
        mode: null,
        siteName: null,
        deviceStatus: null,
        siteId: null,
        camera: false,
        channel: null,
        devicechannel:null,
        videoType: null,
        nvrId: null,
        ip: null,
        port: null,
        user: null,
        passord: null,
        streamApp: null,
        streamId: null,
        videoSourceType: '0',
        expand: {
          ipcIds: [],
          direction: null,
          unitNum: null,
          capacityPower: null,
          features: [],
          ip: null,
        }
      }
      this.isGate = false
      this.inputForm.camera = false
      this.upTreeData = {}
      this.isAddLight = false
      this.lightFlag = null
    },
    setQueryCondition() {
      this.queryCondition = {
        current: this.page,
        size: this.size
      }
      console.log(this.brandTypeName,'this.brandTypeName');
      if(this.brandTypeName.length !== 0) {
        this.queryCondition.model = this.brandTypeName[this.brandTypeName.length - 1]
      }
      this.queryId ? this.queryCondition.siteId = this.queryId : null
      this.deviceType.length !== 0 ? this.queryCondition.type = this.deviceType[this.deviceType.length - 1] : null
      // this.deviceSiteId ? this.queryCondition.siteId = this.deviceSiteId[this.deviceSiteId.length - 1] : null
      this.deviceCode ? this.queryCondition['expand[codeLike]'] = this.deviceCode : null
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
    clearCondition() {
      this.deviceType = []
      this.deviceSiteId = []
      this.brandTypeName = []
      this.deviceCode = null
      this.queryId = null
      this.handleNodeClose();
      this.queryDeviceInfo()
    },
    async addNVR() {
      this.getSiteData();
      this.lightFlag = null
      this.devTypeFlag = 1
      this.isdisabled = false
      // this.refreshData()
      this.inputForm.actionType = 1;
      this.inputForm.siteId = this.queryId
      this.inputForm.expand = {
        features: [],
        appearanceType: "0",
        gateway: null,
        netmask:"255.255.255.0"
      }
      this.dialogFormVisible = true;
      this.devDialogTitle = '新建设备信息';
      this.isFormDisabled = false
      this.inputForm.camera = true
      this.isGate = false
      this.devTypeList = []
      console.log(this.deviceTypeInfo,'this.deviceTypeInfo');
      this.deviceTypeInfo.forEach( el => {
        if(el.code.indexOf('nvr') != -1 || el.code.indexOf('ipc') != -1) {
          this.devTypeList.push(el)
        }
      })
      this.dialogKey = new Date().toString();
    },
    addGate() {
      this.getSiteData();
      this.lightFlag = null
      this.devTypeFlag = 2
      this.isdisabled = false
      // this.refreshData()
      this.inputForm.actionType = 1;
      this.inputForm.siteId = this.queryId
      this.dialogFormVisible = true;
      this.devDialogTitle = '新建设备信息';
      this.isFormDisabled = false
      this.isGate = true
      this.inputForm.camera = false
      this.isIpcDisabled = true
      this.devTypeList = []
      this.deviceTypeInfo.forEach( el => {
        if(el.code === 'barrier') {
          this.devTypeList.push(el)
        }
      })
      this.dialogKey = new Date().toString();
    },
    addOther() {
      this.getSiteData();
      this.lightFlag = null
      this.devTypeFlag = 3
      this.isdisabled = false
      // this.refreshData()
      this.inputForm.actionType = 1;
      this.inputForm.siteId = this.queryId
      this.dialogFormVisible = true;
      this.devDialogTitle = '新建设备信息';
      this.isFormDisabled = false
      this.isGate = false
      this.inputForm.camera = false
      this.devTypeList = []
      this.deviceTypeInfo.forEach( el => {
        if(el.code.indexOf('barrier') == -1 && el.code.indexOf('nvr') == -1 && el.code.indexOf('ipc') == -1 ) {
          this.devTypeList.push(el)
        }
      })
      this.dialogKey = new Date().toString();
      console.log(this.inputForm,'this.inputForm');
    },
    async addLight(val){
      console.log(val,'addLight');
      let data = await sdcSiteAction("", "/tree", "get");
      this.siteData = modifyData(data.data.data);
      this.isAddLight = true
      this.inputForm.siteId = this.rootParentNodeId
      this.devTypeList = []
      switch (val) {
        case 1:
          this.lightFlag = 'lightGateWay'
          for (let index = 0; index < this.deviceTypeInfo.length; index++) {
            const el = this.deviceTypeInfo[index];
            if(el.code === 'light_gateway' ) {
              this.devTypeList.push(el)
            }
          }
          break;
        case 2:
          this.gateWayList = []
          this.lightFlag = 'light'
          let gateway = null
          for (let index = 0; index < this.deviceTypeInfo.length; index++) {
            const el = this.deviceTypeInfo[index];
            if(el.code === 'light_gateway' ) {
              gateway = el.id
            }
            if(el.code === 'light' ) {
              this.devTypeList.push(el)
            }
          }
          let queryTableData = await getSdcDeviceTable({type:gateway});
          for (let index = 0; index < queryTableData.data.data.records.length; index++) {
            const element = queryTableData.data.data.records[index];
            this.gateWayList.push({
              value: element.id,
              label: element.name
            })
          }
          break;
        case 3:
          this.lightList = []
          this.lightFlag = 'lightLamp'
          let light
          for (let index = 0; index < this.deviceTypeInfo.length; index++) {
            const el = this.deviceTypeInfo[index];
            if(el.code === 'light' ) {
              light = el.id
            }
            if(el.code === 'light_lamp' ) {
              this.devTypeList.push(el)
            }
          }
          let queryLightData = await getSdcDeviceTable({type:light});
          for (let index = 0; index < queryLightData.data.data.records.length; index++) {
            const element = queryLightData.data.data.records[index];
            this.lightList.push({
              value: element.id,
              label: element.name
            })
          }
          break;
        case 4:
          this.lightList = []
          this.lightFlag = 'lightSensor'
          let sensor
          for (let index = 0; index < this.deviceTypeInfo.length; index++) {
            const el = this.deviceTypeInfo[index];
            if(el.code === 'light' ) {
              sensor = el.id
            }
            if(el.code === 'light_sensor' ) {
              this.devTypeList.push(el)
            }
          }
          let querySensorData = await getSdcDeviceTable({type:sensor});
          for (let index = 0; index < querySensorData.data.data.records.length; index++) {
            const element = querySensorData.data.data.records[index];
            this.lightList.push({
              value: element.id,
              label: element.name
            })
          }
          break;
        case 5:
          this.lightList = []
          this.lightFlag = 'lightIntercom'
          let inercom
          console.log(this.deviceTypeInfo,'this.deviceTypeInfo');
          for (let index = 0; index < this.deviceTypeInfo.length; index++) {
            const el = this.deviceTypeInfo[index];
            if(el.code === 'light' ) {
              inercom = el.id
            }
            if(el.code === 'light_inercom' ) {
              this.devTypeList.push(el)
            }
          }
          let queryinercomData = await getSdcDeviceTable({type:inercom});
          for (let index = 0; index < queryinercomData.data.data.records.length; index++) {
            const element = queryinercomData.data.data.records[index];
            this.lightList.push({
              value: element.id,
              label: element.name
            })
          }
          break;
        case 6:
          this.lightList = []
          this.lightFlag = 'lightBroadcast'
          let broadcast
          for (let index = 0; index < this.deviceTypeInfo.length; index++) {
            const el = this.deviceTypeInfo[index];
            if(el.code === 'light' ) {
              broadcast = el.id
            }
            if(el.code === 'light_broadcast' ) {
              this.devTypeList.push(el)
            }
          }
          let querybroadcastData = await getSdcDeviceTable({type:broadcast});
          for (let index = 0; index < querybroadcastData.data.data.records.length; index++) {
            const element = querybroadcastData.data.data.records[index];
            this.lightList.push({
              value: element.id,
              label: element.name
            })
          }
          break;
        case 7:
          this.lightList = []
          this.lightFlag = 'lightLED'
          let led
          for (let index = 0; index < this.deviceTypeInfo.length; index++) {
            const el = this.deviceTypeInfo[index];
            if(el.code === 'light' ) {
              led = el.id
            }
            if(el.code === 'light_led' ) {
              this.devTypeList.push(el)
            }
          }
          let queryledData = await getSdcDeviceTable({type:led});
          for (let index = 0; index < queryledData.data.data.records.length; index++) {
            const element = queryledData.data.data.records[index];
            this.lightList.push({
              value: element.id,
              label: element.name
            })
          }
          break;
      }
      this.isdisabled = false
      // this.refreshData()
      this.inputForm.actionType = 1;
      this.dialogFormVisible = true;
      console.log(this.isAddLight,'isAddLight');
      this.devDialogTitle = '新建设备信息';
      this.isFormDisabled = false
      this.isGate = false
      this.inputForm.camera = false
      this.dialogKey = new Date().toString();
    },
    async queryDeviceList() {

    },
    //导出物模型
    deviceTypeExport() {
      sdcDeviceExport().then( res => {
        let filename = res.headers['content-disposition'].split('=')[1]
        let bolb = new Blob([res.data], {type: "application/vnd.ms-excel;charset=utf-8"})
        if (window.navigator.msSaveOrOpenBlob) { //兼容IE10
            navigator.msSaveBlob(bolb, filename)
        } else {
            const href = URL.createObjectURL(bolb) //创建新的URL表示指定的blob对象
            const a = document.createElement('a') //创建a标签
            a.href = href // 指定下载链接
            a.download = filename //指定下载文件名
            a.click() //触发下载
            URL.revokeObjectURL(a.href) //释放URL对象
        }
      })
    },
    //导入物模型
    deviceTypeImport(e) {
      let formData = new FormData()
      formData.append('file',e.target.files[0])
      if (e.target.files[0]) {
        sdcDeviceImport(formData).then( res => {
          if(res.data.code === 0) {
            this.$notify({
              title: '成功',
              message: '导入成功',
              type: 'success',
              duration: 5000
            })
            this.init();
          }
        })
        e.target.value = ''
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.tree-container {
  height: 800px;
  .tree-card {
    overflow: auto;
    width: 300px;
    height: calc(100% - 45px);
    .filter-tree {
      min-width: 100%;
      margin-left: -30px;
      display: inline-block;
      overflow: auto;
      margin-top: 12px;
    }
  }
}
.node-container:hover .node-style {
  visibility: visible;
}
.node-style {
  visibility: hidden;
  display: inline;
  margin-left: 10px;
  z-index: 1000;
  color: #409eff;
}

.table-action {
  cursor: pointer;
  margin-left: 10px;
  color: #409eff;
}

.device-btnGroup {
  float: right;
  margin-bottom: 20px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px !important;
  height: 100px !important;
  line-height: 100px !important;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
.avatar-inline {
  display: inline;
  margin-right: 15px;
}

.import-btn {
    color: #FFF;
    background-color: #409EFF;
    border-color: #409EFF;
    font-size: 12px;
    border-radius: 3px;
    padding: 9px 15px;
    margin: 0 10px;
    cursor: pointer;
}
</style>
