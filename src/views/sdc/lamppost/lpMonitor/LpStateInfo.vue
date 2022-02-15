<template>
  <div>
    <div class="infoWindowBox">
      <div class="infoWindowGroup">
        <div class="infoTitleBox">
          <el-button type="primary" size="mini" @click="closeLpInfo">关闭</el-button>
          <div
            class="infoTitle"
            style="text-align:center;fontSize:16px;"
          >
            设备名称：{{ currentLightItemInfo.name }}
          </div>
        </div>
        <div class="infoWindowContent">
          <img class="lightTree" src="@/assets/img/streetLight.png" alt />
          <!-- 图片 -->
          <!-- 照明图片 -->
          <img
            v-if="lightShow"
            class="lamp"
            src="@/assets/img/lamp.png"
            alt
            @click="getLightList"
          />
          <!-- 视频图片 -->
          <img
            class="video"
            src="@/assets/img/video.png"
            v-if="videoShow"
            @click="getVideoList"
          />
          <!-- 环境图片 -->
          <img
            class="seasor"
            src="@/assets/img/seasor.png"
            v-if="sensorShow"
            alt
            @click="getSensorList"
          />
          <!-- 广播图片 -->
          <img
            class="broadCast"
            src="@/assets/img/broadcast.png"
            v-if="broadCastShow"
            alt
            @click="getBroadCastList"
          />
          <!-- led显示屏图片 -->
          <img
            class="led"
            src="@/assets/img/led.png"
            v-if="LedShow"
            alt
            @click="getLedList"
          />
          <!-- 线 -->
          <!-- 照明线 -->
          <div v-if="lightShow" class="lampLine" />
          <!-- 视频线 -->
          <div v-if="videoShow" class="videoLine" />
          <!-- 环境线 -->
          <div v-if="sensorShow" class="seasorLine" />
          <!-- led线 -->
          <div v-if="LedShow" class="ledLine" />
          <!-- 广播线 -->
          <div v-if="broadCastShow" class="broadCastLine" />
          -->
          <!-- 文字-->
          <div v-if="lightShow" class="lampTitle">照明</div>
          <div v-if="videoShow" class="videoTitle">视频</div>
          <div v-if="sensorShow" class="seasorTitle">环境</div>
          <div v-if="LedShow" class="ledTitle">信息屏</div>
          <div v-if="broadCastShow" class="broadCastTitle">广播</div>
        </div>
      </div>
    </div>
    <!-- 视频弹框 -->
    <div v-if="isVideoShow" class="modalBox" @click="playVideo()" />
    <div v-show="isVideoShow" class="videoMonitorInfo">
      <div class="infoWindowGroup">
        <div class="infoTitleBox">
          <div class="infoTitle" style="margin-left:20px;">
            <!-- {{ currentLightItemInfo.lampName }} ({{
              currentLightItemInfo.name
            }})--视频监控 -->
          </div>
        </div>
        <div class="infoWindowContentvideo">
          <div class="videoBox" style="width:530px;height:308px;margin:20px;">
            <LivePlayer :videoUrl="videoUrl2" fluent autoplay live stretch></LivePlayer>
            
          </div>
          <!-- <div class="controlBox">
            <div class="controlList">
              <table class="controlDirection">
                <tr>
                  <td title="左上" @click="videoControl('左上')">
                    <svg-icon style="font-size:14px;" icon-class="top_left" />
                  </td>
                  <td title="上" @click="videoControl('上')">
                    <svg-icon style="font-size:16px;" icon-class="top" />
                  </td>
                  <td title="右上" @click="videoControl('右上')">
                    <svg-icon style="font-size:14px;" icon-class="top_right" />
                  </td>
                </tr>
                <tr>
                  <td title="左" @click="videoControl('左')">
                    <svg-icon style="font-size:16px;" icon-class="left" />
                  </td>
                  <td title="重启" @click="videoControl('重启')">
                    <svg-icon style="font-size:16px;" icon-class="refresh" />
                  </td>
                  <td title="右" @click="videoControl('右')">
                    <svg-icon style="font-size:16px;" icon-class="right" />
                  </td>
                </tr>
                <tr>
                  <td title="左下" @click="videoControl('右')">
                    <svg-icon style="font-size:14px;" icon-class="down_left" />
                  </td>
                  <td title="下" @click="videoControl('下')">
                    <svg-icon style="font-size:16px;" icon-class="down" />
                  </td>
                  <td title="右下" @click="videoControl('右下')">
                    <svg-icon style="font-size:14px;" icon-class="down_right" />
                  </td>
                </tr>
              </table>

              <table class="smallOrBig">
                <tr>
                  <td @click="videoControl('调焦-')">
                    <svg-icon icon-class="zoom_out" />
                  </td>
                  <td title="调焦" style="font-size:12px;vertical-align:center">
                    调焦
                  </td>
                  <td @click="videoControl('调焦+')">
                    <svg-icon icon-class="zoom" />
                  </td>
                </tr>
                <tr>
                  <td @click="videoControl('聚焦-')">
                    <svg-icon icon-class="zoom_out" />
                  </td>
                  <td title="聚焦" style="font-size:12px;">聚焦</td>
                  <td @click="videoControl('聚焦+')">
                    <svg-icon icon-class="zoom" />
                  </td>
                </tr>
                <tr>
                  <td @click="videoControl('光圈-')">
                    <svg-icon icon-class="zoom_out" />
                  </td>
                  <td title="光圈" style="font-size:12px;">光圈</td>
                  <td @click="videoControl('光圈+')">
                    <svg-icon icon-class="zoom" />
                  </td>
                </tr>
              </table>
            </div>
          </div> -->
        </div>
        <div class="infoCloseIcon" @click="isVideoShow = false">
          <i class="el-icon-close" />
        </div>
      </div>
    </div>
    <!-- 传感器弹框 -->
    <div v-if="isSensorShow" class="modalBox" @click="isSensorShow = false" />
    <div v-if="isSensorShow" class="monitorInfo">
      <div class="infoWindowGroup">
        <div class="infoTitleBox">
          <div class="infoTitle">
            <!-- 传感器名称({{ currentLightItemInfo.lampName }}) -->
          </div>
        </div>
        <div class="infoWindowContent" style="display:flex">
          <!-- <el-select
            v-if="sensorIsNotSingle"
            v-model="currentSensor"
            style="width:120px;"
            size="small"
            placeholder="请选择"
            @change="sensorSelectChange"
          >
            <el-option
              v-for="item in sensorNameList"
              :key="item.sensorId"
              :label="item.sensorName"
              :value="item.sensorId"
            />
          </el-select>-->
          <el-table
            :data="sensorList"
            border
            fit
            highlight-current-row
            style="width: 100%;margin-top:15px;"
          >
            <el-table-column
              prop="expand.deviceName"
              align="center"
              label="传感器名称"
              show-overflow-tooltip
              width="120"
            />
            <el-table-column align="center" label="风向">
              <template slot-scope="scope">
                <span v-if="scope.row.windDirection">{{
                  scope.row.windDirection
                }}</span>
                <span v-if="!scope.row.windDirection">- -</span>
              </template>
            </el-table-column>
            <el-table-column
              property="humidity"
              align="center"
              label="湿度(%)"
            />
            <el-table-column
              property="noise"
              align="center"
              width="120"
              label="噪声(dB)"
            />
            <el-table-column
              property="temperature"
              align="center"
              label="温度(℃)"
            />
            <el-table-column
              property="windSpeed"
              align="center"
              width="120"
              label="风速(m/s)"
            />
            <el-table-column
              property="pm25"
              align="center"
              label="PM2.5(μg/m3)"
              width="120"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.pm25">{{ scope.row.pm25 }}</span>
                <span v-if="!scope.row.pm25">- -</span>
              </template>
            </el-table-column>
            <el-table-column
              property="pm10"
              align="center"
              label="PM10(μg/m3)"
              width="120"
            />
            <el-table-column
              property="updateDate"
              align="center"
              width="160"
              label="上报时间"
            />
          </el-table>
          <!-- <el-table
            :data="sensorList"
            border
            fit
            highlight-current-row
            style="width: 100%;border-top:none;"
          >
          </el-table>-->
        </div>
        <div class="infoCloseIcon" @click="isSensorShow = false">
          <i class="el-icon-close" />
        </div>
      </div>
    </div>

    <div
      v-if="isBroadCastShow"
      class="modalBox"
      @click="isBroadCastShow = false"
    />
    <!-- 广播弹框 -->
    <div v-if="isBroadCastShow" class="monitorInfo">
      <div class="infoWindowGroup">
        <div class="infoTitleBox">
          <div class="infoTitle">
            <!-- 广播名称({{ currentLightItemInfo.lampName }}) -->
          </div>
        </div>

        <div
          v-if="sonBroadCastShow1"
          style="width: 758px;height: 400px;"
        >
          <div
            style="margin-top:10px;display:flex; justify-content:space-between;"
          >
            <div style="height:36px;line-height:36px;">
              <p>播放当前节目名称</p>
            </div>
            <div style="display:flex">
              <p
                style="margin-left:10px;width:68px;height: 36px;background: linear-gradient(0deg, #143A5A 0%, #488FB0 100%);box-shadow: 1px 3px 5px 0px rgba(4, 0, 0, 0.1);text-align:center;line-height:36px;"
              >
                暂停
              </p>
              <p
                style="margin-left:10px;width:68px;height: 36px;background: linear-gradient(0deg, #143A5A 0%, #488FB0 100%);box-shadow: 1px 3px 5px 0px rgba(4, 0, 0, 0.1);text-align:center;line-height:36px;"
              >
                开启
              </p>
              <p
                @click="handleBroadCast()"
                style="margin-left:10px;width:68px;height: 36px;background: linear-gradient(0deg, #143A5A 0%, #488FB0 100%);box-shadow: 1px 3px 5px 0px rgba(4, 0, 0, 0.1);text-align:center;line-height:36px;"
              >
                节目
              </p>
            </div>
          </div>
          <el-table
            v-loading="listLoading"
            :data="boardList"
            border
            highlight-current-row
            class="tableBorder"
            @selection-change="handleSelectionChange"
          >
            <el-table-column property="name" align="center" label="节目" />
            <el-table-column
              property="cronTime"
              align="center"
              label="开始日期"
            />
            <el-table-column property="week" align="center" label="结束日期" />
            <el-table-column
              property="startTime"
              align="center"
              label="开始时间"
            />
            <el-table-column
              property="endTime"
              align="center"
              label="播放时长"
            />
            <el-table-column
              property="endTime"
              align="center"
              label="执行模式"
            />
          </el-table>
        </div>
        <div
          v-if="sonBroadCastShow2"
          style="width: 758px;height: 400px;"
        >
          <p
            @click="handleBroadCast()"
            style="margin:20px 10px 0  0;right:20px;width:68px;height: 36px;background: linear-gradient(0deg, #143A5A 0%, #488FB0 100%);box-shadow: 1px 3px 5px 0px rgba(4, 0, 0, 0.1);text-align:center;line-height:36px;"
          >
            节目
          </p>
          <div
            style="margin-top:18px;height:268px;width:748px;border: 1px solid #FFFFFF;text-align:center;line-height:268px;"
          >
            <span>无节目，空闲状态</span>
          </div>
        </div>
        <div
          v-if="sonBroadCastShow3"
          @click="handleBroadCastBack()"
          style="width: 758px;height: 400px;"
        >
          <el-table
            :data="broadCastList"
            border
            highlight-current-row
            class="tableBorder"
            @selection-change="handleSelectionChange"
            style="margin-top:20px;"
          >
            <!-- <el-table-column property="name" align="center" label="节目" /> -->
            <el-table-column property="broadcastDev.name" align="center" label="设备名称" />
            <el-table-column property="deviceStatus" align="center" label="设备状态" :formatter="setTaskStatus"/>
            <el-table-column
              property="createDate"
              align="center"
              label="开始日期"
            />
            <el-table-column property="latestRunTime" align="center" label="结束日期" />
            <el-table-column property="mediaType" align="center" label="媒体类型" />
            <el-table-column property="mediaFile" align="center" label="媒体文件" />
            <!-- <el-table-column
              property="startTime"
              align="center"
              label="开始时间"
            /> -->
            <!-- <el-table-column
              property="endTime"
              align="center"
              label="播放时长"
            />
            <el-table-column
              property="endTime"
              align="center"
              label="执行模式"
            /> -->
          </el-table>
        </div>
        <div class="infoCloseIcon" @click="isBroadCastShow = false">
          <i class="el-icon-close" />
        </div>
      </div>
    </div>
    <!-- 信息屏-->
    <div v-if="isLedShow" class="modalBox" @click="isLedShow = false" />
    <div v-if="isLedShow" class="monitorInfo" style="height:400px;width:758px;">
      <div class="infoWindowGroup">
        <div class="infoTitleBox" style="height:36px;width:758px;">
          <div class="infoTitle" style="height:36px;line-height:36px;">
            <!-- {{ currentLightItemInfo.lampName }} ({{
              currentLightItemInfo.name
            }})--信息屏 -->
          </div>
        </div>
        <div v-if="sonLedShow1">
          <div
            style="margin-top:10px;display:flex; justify-content:space-between;"
          >
            <div style="height:36px;line-height:36px;">
              <p>节目名称</p>
            </div>
            <div style="display:flex">
              <p
                @click="handleChangeItem()"
                style="margin-left:10px;width:68px;height: 36px;background: linear-gradient(0deg, #143A5A 0%, #488FB0 100%);box-shadow: 1px 3px 5px 0px rgba(4, 0, 0, 0.1);text-align:center;line-height:36px;"
              >
                节目
              </p>
            </div>
          </div>
          <div
            style="width: 708px;height: 257px;border: 1px solid #FFFFFF;margin-top:10px;padding:10px"
          >
            <el-tabs v-model="activePreviewName">
              <el-tab-pane label="文字" name="multfun" style="color:#fff">
                <p
                  v-if="multfunPreview === ''"
                  style="margin: 10px;font-size: 16px;"
                >
                  无配置文字内容
                </p>
                <p
                  v-for="(item, index) in multfunPreview"
                  v-else
                  :key="index"
                  style="margin: 10px;font-size: 32px;"
                >
                  {{ index + 1 + "." + item }}
                </p>
              </el-tab-pane>
              <el-tab-pane label="图片" name="bmp" style="color:#fff">
                <p
                  v-if="bmpPreview === ''"
                  style="margin: 10px;font-size: 16px;"
                >
                  无上传图片内容
                </p>
                <el-carousel
                  v-else
                  trigger="click"
                  :autoplay="false"
                  indicator-position="outside"
                >
                  <el-carousel-item
                    v-for="(item, index) in bmpPreview"
                    :key="index"
                    style="display:flex;justify-content:center;align-item:center;"
                  >
                    <el-image :src="item" style="height:180px;width:200px">
                      <div slot="placeholder" class="image-slot">
                        加载中
                        <span class="dot">...</span>
                      </div>
                    </el-image>
                  </el-carousel-item>
                </el-carousel>
              </el-tab-pane>
              <el-tab-pane label="视频" name="video" style="color:#fff">
                <p
                  v-if="videoPreview === ''"
                  style="margin: 10px;font-size: 16px;"
                >
                  无上传视频内容
                </p>
                <el-carousel
                  v-else
                  trigger="click"
                  :autoplay="false"
                  indicator-position="outside"
                >
                  <el-carousel-item
                    v-for="(item, index) in videoPreview"
                    :key="index"
                    style="display:flex;justify-content:center;align-item:center"
                  >
                    <video
                      id="myVideo"
                      class="video-js vjs-default-skin vjs-big-play-centered"
                      controls
                      preload="auto"
                      style="height:180px;"
                    >
                      <source :src="item" type="video/mp4" />
                    </video>
                  </el-carousel-item>
                </el-carousel>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <div v-if="sonLedShow2">
          <p
            @click="handleChangeItem()"
            style="margin-left:10px;width:68px;height: 36px;background: linear-gradient(0deg, #143A5A 0%, #488FB0 100%);box-shadow: 1px 3px 5px 0px rgba(4, 0, 0, 0.1);text-align:center;line-height:36px;"
          >
            节目
          </p>
          <div
            style="margin-top:18px;height:268px;width:708px;border: 1px solid #FFFFFF;text-align:center;line-height:268px;"
          >
            <span>无节目，空闲状态</span>
          </div>
        </div>
        <div v-if="sonLedShow3">
          <!-- <div style="display:flex;height:36px;line-height:36px;">
            <p>控制Led屏</p>
          </div> -->
          <div style="margin-top:20px">
            <el-table
              :data="ledList"
              border
              highlight-current-row
              class="tableBorder"
              @selection-change="handleSelectionChange"
            >
              <el-table-column property="LEDDev.name" align="center" label="设备名称" />
              <el-table-column property="LEDDev.typeName" align="center" label="设备类型" />
              <el-table-column property="netStatus" align="center" label="在线状态" :formatter="setNetStatus" />
              <!-- <el-table-column property="taskStatus" align="center" label="屏幕状态" /> -->
              <!-- <el-table-column property="taskName" align="center" label="当前节目" /> -->
              <el-table-column property="mediaType" align="center" label="媒体类型" />
              <el-table-column property="mediaFile" align="center" label="媒体文件" />
              <el-table-column property="latestRunTime" align="center" label="运行时间" />
              <el-table-column property="updateDate" align="center" label="更新时间" />
              <!-- <el-table-column
                property="name"
                align="center"
                label="节目名称"
              />
              <el-table-column label="操作" width="240" align="center">
                <template slot-scope="scope">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="预览"
                    placement="top"
                  ></el-tooltip>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="发布节目"
                    placement="top"
                  >
                    <span class="btnCancel" @click="releaseData(scope)">
                      <svg-icon icon-class="fabu" />
                    </span>
                  </el-tooltip>
                </template>
              </el-table-column> -->
            </el-table>
          </div>
        </div>
        <div class="infoCloseIcon" @click="isLedShow = false">
          <i class="el-icon-close" />
        </div>
      </div>
    </div>
    <!-- 照明-->
    <div v-if="isLampShow" class="modalBox" @click="isLampShow = false" />
    <div v-if="isLampShow" class="monitorInfo">
      <div class="infoWindowGroup">
        <div class="infoTitleBox">
          <div class="infoTitle">
            <!-- 灯具名称{{ currentLightItemInfo.lampPostName }} -->
          </div>
        </div>
        <div class="infoWindowContent">
          <el-button
            type="primary"
            size="small"
            @click="lightSendCMD(1)"
            :disabled="lightDisabled"
          >
            {{ openLampBtn }}
          </el-button>
          <el-button
            type="primary"
            size="small"
            :disabled="lightDisabled"
            @click="lightSendCMD(0)"
          >
            {{ closeLampBtn }}
          </el-button>
          <el-slider
            v-model="cmdList.code"
            style="width:80px;display: inline-block;vertical-align: middle;margin-left:10px;"
          />
          <el-button
            type="primary"
            size="small"
            style="margin-left:10px;"
            :disabled="lightDisabled"
            @click="dimmingSendCMD"
          >
            {{ dimmingBtn }}
          </el-button>
          <el-table
            :data="lightList"
            border
            fit
            highlight-current-row
            style="width: 100%;margin-top:15px;"
            @selection-change="handleSelectionChangeDevice"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column
              property="lightDev.name"
              align="center"
              label="设备名称"
              show-overflow-tooltip
            />
            <el-table-column
              property="deviceStatus"
              align="center"
              label="设备状态"
              show-overflow-tooltip
              :formatter="setDevStatus"
            />
            <el-table-column
              property="luminance"
              align="center"
              label="亮度"
              show-overflow-tooltip
            />
            <el-table-column
              property="lightDev.typeName"
              align="center"
              label="设备类型"
              show-overflow-tooltip
            />
            <el-table-column property="voltage" align="center" label="电压(V)">
              <template slot-scope="scope">
                <span v-if="scope.row.voltage">{{ scope.row.voltage }}</span>
                <span v-if="!scope.row.voltage">- -</span>
              </template>
            </el-table-column>
            <el-table-column
              property="apparentPower"
              width="140px;"
              align="center"
              label="视在功率(W)"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.sEnergy">{{ scope.row.sEnergy }}</span>
                <span v-if="!scope.row.sEnergy">- -</span>
              </template>
            </el-table-column>
            <el-table-column
              property="reactivePower"
              align="center"
              label="无功功率(W)"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.reactivePower">{{
                  scope.row.reactivePower
                }}</span>
                <span v-if="!scope.row.reactivePower">- -</span>
              </template>
            </el-table-column>
            <el-table-column
              property="activePower"
              align="center"
              label="有用功率(W)"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.activePower">{{
                  scope.row.activePower
                }}</span>
                <span v-if="!scope.row.activePower">- -</span>
              </template>
            </el-table-column>
            <el-table-column
              property="temperature"
              align="center"
              label="温度(℃)"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.temperature">{{
                  scope.row.temperature
                }}</span>
                <span v-if="!scope.row.temperature">- -</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="灯状态" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.open == 1" style="color:#19B019;"
                  >开</span
                >
                <span v-if="scope.row.open == 0" style="color:#E84335;"
                  >关</span
                >
              </template>
            </el-table-column>
            <el-table-column property="bri" align="center" label="亮度" />
            <el-table-column
              label="灯控器类型"
              align="center"
              property="subTypeId"
            /> -->
          </el-table>
          <!-- <el-table
            :data="lightList"
            border
            fit
            highlight-current-row
            style="width: 100%;border-top:none;"
          >
            
            <el-table-column
              property="modifyDate"
              align="center"
              width="160"
              label="上报时间"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.modifyDate">{{
                  scope.row.modifyDate
                }}</span>
                <span v-if="!scope.row.modifyDate">- -</span>
              </template>
            </el-table-column>
          </el-table> -->
        </div>
        <div class="infoCloseIcon" @click="isLampShow = false">
          <i class="el-icon-close" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getSdcGateInfo, getSdcDeviceTable } from "@/api/sdc/deviceInfo";
import { getSdcLightLamp, getSdcLightPlays,getSdcLightSensorTable,updateSdcLightLamp } from "@/api/sdc/lpmonitor";
 import LivePlayer from '@liveqing/liveplayer'
import { clone } from "../../../../util/domainFun";

export default {
  components: { LivePlayer },
  // 使用prop接收父组件传递过来的数据
  // props: {
  //   // 灯杆对应的信息
  //   // lightItemInfo: {
  //   //   type: String,
  //   //   default: ""
  //   // }
  // },
  props: ['lightData'],
  data() {
    return {
      // 视频数据
      url : this.$dictUtils.getDictValue("vedio_param", "url_ip", ""),
      port: this.$dictUtils.getDictValue("vedio_param", "port", ""),
      videoUrl2: null,
      videoSrc: null,
      selectItem: null,
      controlLoad: false,
      timers: null,
      Ledlist: [],
      // 广播弹框 boolean 默认关闭
      sonBroadCastShow1: false,
      sonBroadCastShow2: false,
      sonBroadCastShow3: true,
      // led弹框 Boolean 默认关闭
      sonLedShow1: false,
      sonLedShow2: false,
      sonLedShow3: true,
      activeName: "second",
      // 视频
      videoShow: false,
      //环境 传感器
      sensorShow: false,
      // 照明
      lightShow: false,
      // led 显示屏
      LedShow: false,
      // 广播
      broadCastShow: false,
      // 选中当前的灯杆的信息
      currentLightItemInfo: "",
      // 视频预览
      videoPreview: "",
      // 图片预览
      bmpPreview: "",
      // 文字预览
      multfunPreview: "",
      // 预览默认选中：文字
      activePreviewName: "multfun",
      changeUid: "",
      source: "",
      isVideoShow: false, // 监控
      videoLiveShow: false, // 视频播放
      videoIsNotSingle: true,
      currentVideo: "",
      videoList: [],
      videoNameList: [],
      listQuery: {
        skip: 0,
        limit: 10,
        search: ""
      },
      listQueryLed: {
        skip: 1,
        limit: 10,
        search: ""
      },
      sensorIsNotSingle: false, // 传感器
      isSensorShow: false,
      currentSensor: "",
      sensorList: [],
      sensorsList: [],
      sensorNameList: [],
      isBroadCastShow: false,
      broadCastList: [],
      isLedShow: false,
      ledList: [],
      ledsList: [],
      broadlist: [],
      isLampShow: false, // 灯控
      isNotSingle: true,
      lightList: [],
      boardList: [],
      cmdList: {
        addrs: "",
        code: 50,
        flag: "1",
        uids: "",
        userName: window.localStorage.getItem("sitename2")
      },
      currentLamp: "",
      lampNameList: [],
      deviceWS: null,
      lookWsState: null,
      countInterval: null,
      timeLoading: false,
      openLampBtn: "开灯",
      closeLampBtn: "关灯",
      dimmingBtn: "调光",
      cycleBtn: "配置",
      onOff: {
        addrs: "",
        code: "",
        flag: "",
        uids: "",
        userName: window.localStorage.getItem("sitename2")
      },
      player: "",
      htmls: "",

      lightForm: [],
      lightDisabled: true,
      selectedForm: []
    };
  },

  computed: {},
  watch: {
    lightItemInfo(val) {
      const valueData = JSON.parse(val);
      this.currentLightItemInfo = valueData;

      if (this.countInterval) {
        // 不同灯杆取消操作限制
        this.openLampBtn = "开灯";
        this.closeLampBtn = "关灯";
        this.dimmingBtn = "调光";
        this.cycleBtn = "配置";
        this.timeLoading = false;
        clearInterval(this.countInterval);
      }

      this.videoShow = false; // 挂载设备初始化
      this.lightShow = false;
      if (this.lightShow === false) {
        this.lightList = [];
      }
      this.sensorShow = false;
      this.LedShow = false;
      if (this.LedShow === false) {
        this.ledList = [];
      }
      this.broadCastShow = false;
      if (this.broadCastShow === false) {
        this.broadCastList = [];
      }
      var self = this;
      // async function devListLength() {
      //   await self.checkLampLength();
      //   // await self.checkVideoLength()
      // }
      devListLength();
    }
  },
  created() {
    console.log(this.lightData,'this.lightData');
    // const valueData = JSON.parse(this.lightData);
    this.currentLightItemInfo = this.lightData;
    console.log(this.currentLightItemInfo,'this.currentLightItemInfo');
    this.checkLampLength();
    // this.fetchlampList();
    // this.getLists();
    // this.getBoardLists();
  },
  mounted() {
    this.checkLampLength();
  },
  updated() {
    console.log("lisquired", this.listQueryLed);
  },
  destroyed() {
    if (this.countInterval) {
      // 取消、清除计时器
      clearInterval(this.countInterval);
    }

    if (this.deviceWS) {
      this.deviceWS.close();
      clearInterval(this.lookWsState);
    }
  },
  methods: {
    setNetStatus(val) {
      let plateColorMap = this.$dictUtils.getDictList('light_net_status')
      let text
      for (let index = 0; index < plateColorMap.length; index++) {
        const el = plateColorMap[index];
        if (el.value === val.netStatus) {
          text = el.label
          break;
        }
      }
      return text
    },
    handleSelectionChangeDevice(val){
      if(val.length > 0) {
        this.lightDisabled = false
        // this.lightForm = clone(val[0])
        this.selectedForm = val
      } else {
        this.lightDisabled = true
      }
      
    },
    async getLists() {
      this.listLoading = true;
      // await listSensor(this.listQuery).then(res => {
      //   this.listLoading = false;
      //   this.sensorsList = res.data.rows;
      //   console.log("传感器数据", this.sensorsList);
      // });
      // led 环境
      const listLed = {
        skip: this.listQueryLed.skip,
        limit: this.listQueryLed.limit,
        search: this.listQueryLed.search
      };
      // await fetchList(this.listQueryLed).then(res => {
      //   if (res.data.program.length > 0) {
      //     this.sonLedShow1 = true;
      //     this.sonLedShow2 = false;
      //     this.sonLedShow3 = false;
      //     this.ledsList = res.data.program;
      //   }

      //   console.log("节目列表", res);
      // });
    },

    // 获取灯杆数据
    async fetchlampList() {
      // const { data } = await fetchLightlist();
      console.log("灯杆最新数据", data.records);
    },
    releaseData(scope) {
      var programId = scope.row.uid;
      // releaseSubmitApi(programId).then(res => {
      //   if (res.status === 200) {
      //     if (res.data.message === "error") {
      //       this.$notify({
      //         title: "失败",
      //         message: "发布失败",
      //         type: "error",
      //         duration: 5000
      //       });
      //     } else {
      //       this.$notify({
      //         title: "成功",
      //         message: "发布成功",
      //         type: "success",
      //         duration: 5000
      //       });
      //     }
      //     this.getLists();
      //   }
      // });
    },
    handleFilter() {
      // 搜索
      this.listQuery.skip = 1;
      this.getLists();
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleBroadCast() {
      this.sonBroadCastShow1 = false;
      this.sonBroadCastShow2 = false;
      this.sonBroadCastShow3 = true;
    },
    // 信息屏切换节目
    handleChangeItem() {
      this.sonLedShow3 = true;
      this.sonLedShow1 = false;
      this.sonLedShow2 = false;
    },
    // 开启节目
    TurnOnProgram() {},

    headClassName({ row, rowIndex }) {
      return "headName";
    },

    rowClassName({ row, rowIndex }) {
      if ((rowIndex + 1) % 2 !== 0) {
        return "headName";
      } else {
        return "headName";
      }
    },
    play() {
      console.log(111);
    },
    playVideo() {
      this.isVideoShow = false;
    },
    countdown(type) {
      this.timeLoading = true;
      let count = 9;
      this.countInterval = setInterval(() => {
        if (count > 0) {
          if (type === "open") {
            this.openLampBtn = count + " 秒";
          } else if (type === "close") {
            this.closeLampBtn = count + " 秒";
          } else if (type === "dimming") {
            this.dimmingBtn = count + " 秒";
          } else {
            this.cycleBtn = count + " 秒";
          }
        } else {
          this.openLampBtn = "开灯";
          this.closeLampBtn = "关灯";
          this.dimmingBtn = "调光";
          this.cycleBtn = "配置";
          this.timeLoading = false;
          clearInterval(this.countInterval);
        }
        count--;
      }, 1000);
    },
    //检查杆体上各类设备
    checkLampLength() {
      console.log(11111111111);
      if(this.lightData.broadcastIds.length !== 0) {
        console.log(222);
        this.broadCastShow = true
      }
      if(this.lightData.ledIds.length !== 0) {
        this.LedShow = true
      }
      if(this.lightData.ipcIds.length !== 0) {
        this.videoShow = true
      }
      // if(this.lightData.intercomIds.length !== 0) {
      //   this.broadCastShow = true
      // }
      if(this.lightData.lampIds.length !== 0) {
        this.lightShow = true
      }
      if(this.lightData.sensorIds.length !== 0) {
        this.sensorShow = true
      }
    },
    websocket(deviceImei, type) {
      const self = this;
      // self.deviceWS = new WebSocket(
      //   "ws://139.196.5.21:8967/websocket/" + deviceImei
      // );
      // console.log(self.deviceWS);
      // self.deviceWS.onopen = function() {
      //   console.log("建立连接");
      // };
      // self.deviceWS.onmessage = function(e) {
      //   console.log(e);
      //   var onMsgData = JSON.parse(e.data);
      //   if (type === "sensor") {
      //     onMsgData.sensorName = self.sensorList[0].sensorName;
      //     self.sensorList = [onMsgData];
      //   } else if (type === "lamp") {
      //     onMsgData.lightName = self.lightList[0].lightName;
      //     self.lightList = [onMsgData];
      //   }
      //   // self.currentMarkInfo = e
      // };
    },
    // 获取环境列表数据
    async getSensorList() {
      // this.isLampShow = false
      // this.isVideoShow = false
      this.sensorList = [];
      const promise = this.lightData.sensorIds.map( el => {
        console.log(el,'el');
          return new Promise((resolve,reject) => {
            getSdcLightSensorTable(el).then( res => {
                  resolve(res.data.data.records[0])
            })
            .catch(err=>reject(err))
          })
        })
        this.sensorList  = await Promise.all(promise)
        console.log(this.sensorList,'this.sensorList');
      this.isSensorShow = true;
    },
    // 获取照明数据
    async getLightList() {
      this.lightList = [];
      // this.checkLampLength();
      // this.isSensorShow = false
      // this.isVideoShow = false
      const promise = this.lightData.lampIds.map( el => {
        console.log(el,'el');
          return new Promise((resolve,reject) => {
            getSdcGateInfo(el).then( res => {
                getSdcLightLamp(el).then( result => {
                  let lightData = result.data.data[0]
                  lightData.lightDev = res.data.data
                  resolve(lightData)
                })
            })
            .catch(err=>reject(err))
          })
        })
        this.lightList  = await Promise.all(promise)
        console.log(this.lightList,'this.lightList');
      this.isLampShow = true;
      // if (this.deviceWS) {
      //   this.deviceWS.close();
      //   clearInterval(this.lookWsState);
      // }
      // this.websocket(this.lightList[0].imei, 'lamp')
    },
    // 获取广播数据
    async getBroadCastList() {
      this.broadCastList = [];
      const promise = this.lightData.broadcastIds.map( el => {
          return new Promise((resolve,reject) => {
            getSdcGateInfo(el).then( rl => {
              getSdcLightPlays(el).then( res => {
                let broadcastData = res.data.data[0]
                  broadcastData.broadcastDev = rl.data.data
                  resolve(broadcastData)
              })
            })
            .catch(err=>reject(err))
          })
        })
        this.broadCastList  = await Promise.all(promise)
        console.log(this.broadCastList,'this.broadCastList');
      this.isBroadCastShow = true;
    },
    // 获取led数据
    async getLedList() {
      // 预览
      this.activePreviewName = "multfun";
      const promise = this.lightData.ledIds.map( el => {
        return new Promise((resolve,reject) => {
            getSdcGateInfo(el).then( rl => {
              getSdcLightPlays(el).then( res => {
                let LEDData = res.data.data[0]
                  LEDData.LEDDev = rl.data.data
                  resolve(LEDData)
              })
            })
            .catch(err=>reject(err))
          })
        })
        this.ledList  = await Promise.all(promise)
        console.log(this.ledList,'this.LEDList');
      // const data = {
      //   // programId: this.changeUid
      //   programId: "5ef023d1d356456bd6a36368"
      // };
      // LEDContentList(data).then(res => {
      //   console.log("LEDContentList", res);
      //   if (res.status === 200) {
      //     const message = JSON.parse(res.data.message);
      //     this.dialogPreview = true;
      //     this.multfunPreview = "";
      //     this.bmpPreview = "";
      //     this.videoPreview = "";
      //     const indexText = [];
      //     const indexFile = [];
      //     const indexBmp = [];
      //     const indexVideo = [];
      //     // -----------------------------------------------------------------------------------
      //     // 文字
      //     if (message.texts.length !== 0) {
      //       for (let i = 0; i < message.texts.length; i++) {
      //         indexText.push(message.texts[i]);
      //       }
      //     }
      //     // 图片
      //     if (message.pictures.length !== 0) {
      //       for (let i = 0; i < message.pictures.length; i++) {
      //         indexBmp.push(message.pictures[i]);
      //       }
      //     }
      //     // 视频
      //     if (message.videos.length !== 0) {
      //       for (let i = 0; i < message.videos.length; i++) {
      //         indexFile.push(message.videos[i]);
      //       }
      //     }
      //     if (indexFile.length !== 0) {
      //       for (let i = 0; i < indexFile.length; i++) {
      //         const fileType = indexFile[i].split("?Expires")[0];
      //         const judgeType = fileType.substring(
      //           fileType.lastIndexOf(".") + 1,
      //           fileType.length
      //         );
      //         if (
      //           judgeType === "jpg" ||
      //           judgeType === "jpeg" ||
      //           judgeType === "png"
      //         ) {
      //           indexBmp.push(indexFile[i]);
      //         } else {
      //           indexVideo.push(indexFile[i]);
      //         }
      //         // if (judgeType === 'mp4') {
      //         //   indexVideo.push(indexFile[i])
      //         // } else {
      //         //   indexBmp.push(indexFile[i])
      //         // }
      //       }
      //     }
      //     // -----------------------------------------------------------------------------------

      //     if (indexText.length !== 0) {
      //       this.multfunPreview = indexText;
      //     }
      //     if (indexBmp.length !== 0) {
      //       this.bmpPreview = indexBmp;
      //     }
      //     if (indexVideo.length !== 0) {
      //       this.videoPreview = indexVideo;
      //     }
      //   }
      // });
      this.isLedShow = true;
    },
    //获取广播数据
    getBoardLists() {
      this.listLoading = true;
      let skip2 = 1;
      if (this.listQuery.skip === 1) {
        skip2 = 1;
      } else {
        skip2 = (this.listQuery.skip - 1) * this.listQuery.limit;
      }
      const list = {
        limit: this.listQuery.limit,
        search: this.listQuery.search,
        skip: skip2
      };
      // BroadfetchList(list).then(res => {
      //   console.log("广播数据列表222222", res.data);
      //   this.listLoading = false;
      //   this.boardList = res.data.rows;
      //   // if (res.data.rows.length > 0) {
      //   //   this.fixedInput.divisionName = res.data.rows[0].divisionName
      //   //   this.fixedInput.organizationName = res.data.rows[0].organizationName
      //   //   this.fixedInput.projectName = res.data.rows[0].projectName
      //   // } else {
      //   //   this.fixedInput.divisionName = '上海'
      //   //   this.fixedInput.organizationName = '智慧平台演示'
      //   //   this.fixedInput.projectName = '公司演示'
      //   // }
      //   this.total = res.data.total;
      // });
    },
    // 照明选择切换事件按钮
    lightSelectChange(val) {
      this.lampNameList.forEach(e => {
        if (e.lightId === val) {
          this.lightList = [e];

          if (this.countInterval) {
            // 不同灯具取消操作限制
            this.openLampBtn = "开灯";
            this.closeLampBtn = "关灯";
            this.dimmingBtn = "调光";
            this.cycleBtn = "配置";
            this.timeLoading = false;
            clearInterval(this.countInterval);
          }
          if (this.deviceWS) {
            // websocket重连
            this.deviceWS.close();
            clearInterval(this.lookWsState);
          }
          this.websocket(this.lightList[0].imei, "lamp");
        }
      });
    },
    // 环境切换事件按钮
    sensorSelectChange(val) {
      this.sensorNameList.forEach(e => {
        if (e.sensorId === val) {
          this.sensorList = [e];

          if (this.deviceWS) {
            this.deviceWS.close();
            clearInterval(this.lookWsState);
          }
          this.websocket(this.sensorList[0].imei, "sensor");
        }
      });
    },

    getVideoSrc(videoId) {
      // // 获取视频地址
      // steamVideoDevices({
      //   videoId: videoId
      // })
      //   .then(e => {
      //     this.videoSrc = e.data[0] && e.data[0].rtmpAddress;
      //   })
      //   .catch(() => {
      //     this.videoShow = false;
      //   });
    },
    //获取视频信息
    async getOutIPC() {
      console.log(this.lightData.ipcIds,'this.lightData.ipcIds');
      // getSdcDeviceTable({ videoType: '1' }).then( res => {
        
      //   console.log(res,'IPC log');
      // })

      getSdcDeviceTable({ 
        videoType: '1',
        id: this.lightData.ipcIds[0]
      }).then( res => {
        $.get('http://' + this.url + ':' + this.port + '/api/v1/stream/start', {
          serial: res.data.data.records[0].devicechannel,
          code: res.data.data.records[0].channel,
        }).then(data => {
          this.videoUrl2 = data.WS_FLV;
        })
      })
    },

    // 命令下发
    lightSendCMD(type) {
      this.selectedForm.forEach(item => {
        this.lightForm.push(clone(item))
      })
      console.log(this.lightForm, 'lf');
      let prosArr = []
      this.lightForm.forEach(item => {
        switch (type) {
        case 1:
          item.deviceStatus = '1'
          break;
        case 0:
          item.deviceStatus = '0'
          break;
        }
        prosArr.push(updateSdcLightLamp(item))
      })
      Promise.all(prosArr).then(res => {
        let successArr = []
        res.forEach(ele => {
          if (ele.data.code === 0) {
            successArr.push('成功')
          }
        })
        if (successArr.length === res.length) {
          this.$notify({
            title: '成功',
            message: '指令下发成功',
            type: 'success',
            duration: 5000
          })
        } else {
            this.$notify({
              title: '错误',
              message: '指令下发出错',
              type: 'error',
              duration: 5000
            })
          }
        this.getLightList()
        this.lightForm = []
      })
    },
    dimmingSendCMD() {
      // 调光
      this.selectedForm.forEach(item => {
        this.lightForm.push(clone(item))
      })
      let prosArr = []
      this.lightForm.forEach(item => {
      item.luminance = this.cmdList.code
        prosArr.push(updateSdcLightLamp(item))
      })
      Promise.all(prosArr).then(res => {
        let successArr = []
        res.forEach(ele => {
          if (ele.data.code === 0) {
            successArr.push('成功')
          }
        })
        if (successArr.length === res.length) {
          this.$notify({
            title: '成功',
            message: '指令下发成功',
            type: 'success',
            duration: 5000
          })
        } else {
            this.$notify({
              title: '错误',
              message: '指令下发出错',
              type: 'error',
              duration: 5000
            })
          }
        this.getLightList()
        this.lightForm = []
      })

      // updateSdcLightLamp(this.lightForm).then( res=> {
      //     if(res.data.code === 0) {
      //       this.$notify({
      //         title: '成功',
      //         message: '指令下发成功',
      //         type: 'success',
      //         duration: 5000
      //       })
      //       this.getLightList()
      //     } else {
      //       this.$notify({
      //         title: '失败',
      //         message: '指令下发失败',
      //         type: 'error',
      //         duration: 5000
      //       })
      //     }
      //   })
    },
    handleSelectionChange(val) {},
    cycleSendCMD() {
      // 数据上报
      if (this.cmdList.cycle !== "") {
        this.countdown("cycle");
        const sendData = {
          // 判断选择
          imeiTeam: this.lightList[0].imei,
          cmdType: 3,
          cycle: this.cmdList.cycle
        };
        // sendCMD(sendData)
        //   .then(response => {
        //     if (response.data.status === 200) {
        //       this.$notify({
        //         title: "成功",
        //         message: "数据上报周期命令下发成功",
        //         type: "success",
        //         duration: 3000
        //       });
        //     } else {
        //       this.$notify({
        //         title: "失败",
        //         message: response.data.message,
        //         type: "warning",
        //         duration: 3000
        //       });
        //     }
        //   })
        //   .catch(() => {
        //     this.$notify({
        //       title: "失败",
        //       message: "数据上报周期命令下发失败",
        //       type: "warning",
        //       duration: 3000
        //     });
        //   });
      } else {
        this.$notify({
          title: "提示",
          message: "请输入数据上报周期",
          type: "warning",
          duration: 3000
        });
      }
    },
    getVideoList() {
      this.getOutIPC()
      this.isVideoShow = true;
      this.videoLiveShow = true;
    },
    // 摄像头角度控制
    videoControl(type) {
      if (this.controlLoad) {
        this.$notify({
          title: "提示",
          message: "请勿连续点击",
          type: "warning",
          duration: 3000
        });
        return;
      }
      this.controlLoad = true;
      const listenQuery = {
        listenQuery: {
          channelId: this.selectItem.channelId,
          speed: 4,
          videoId: this.selectItem.videoId
        }
      };
      if (this.timers) {
        setInterval(this.timers);
      }
      switch (type) {
        // 左
        case "左":
          setLeft(listenQuery);
          break;
        // 下
        case "下":
          setDown(listenQuery);
          break;
        // 左下
        case "左下":
          setLeftDown(listenQuery);
          break;
        // 左上
        case "左上":
          setLeftUp(listenQuery);
          break;
        // 右
        case "右":
          setRight(listenQuery);
          break;
        // 右下
        case "右下":
          setRightDown(listenQuery);
          break;
        // 右上
        case "右上":
          setRightUp(listenQuery);
          break;
        // 上
        case "上":
          setUp(listenQuery);
          break;
        // 重启
        case "重启":
          // this.$confirm("此操作将导致监控点摄像头重启, 是否继续?", "提示", {
          //   confirmButtonText: "重启",
          //   cancelButtonText: "取消",
          //   type: "warning"
          // }).then(() => {
          //   rebootGateway({
          //     gatewayId: this.selectItem.gatewayId
          //   });
          // });
          break;
        // 光圈-
        case "光圈-":
          setAperture({
            op: 1,
            videoId: this.selectItem.videoId
          });
          break;
        // 光圈-
        case "光圈+":
          // setAperture({
          //   op: 2,
          //   videoId: this.selectItem.videoId
          // });
          break;
        // 调焦-
        case "调焦-":
          // setFocalize({
          //   op: 1,
          //   videoId: this.selectItem.videoId
          // });
          break;
        // 调焦+
        case "调焦+":
          // setFocalize({
          //   op: 2,
          //   videoId: this.selectItem.videoId
          // });
          break;
        // 光圈-
        case "聚焦-":
          // setFocusing({
          //   op: 1,
          //   videoId: this.selectItem.videoId
          // });
          break;
        // 光圈-
        case "聚焦+":
          // setFocusing({
          //   op: 2,
          //   videoId: this.selectItem.videoId
          // });
          break;
        default:
          break;
      }
      this.timers = setTimeout(() => {
        this.controlLoad = false;
      }, 1000);
    },
    closeLpInfo() {
      this.$emit('closeLpInfo')
    },
    setDevStatus(val) {
      console.log(val);
      let plateColorMap = this.$dictUtils.getDictList('light_dev_status')
      let text
      for (let index = 0; index < plateColorMap.length; index++) {
        const el = plateColorMap[index];
        if (el.value === val.deviceStatus) {
          text = el.label
          break;
        }
      }
      return text
    },
    setTaskStatus(val) {
      let plateColorMap = this.$dictUtils.getDictList('light_dev_status')
      let text
      for (let index = 0; index < plateColorMap.length; index++) {
        const el = plateColorMap[index];
        if (el.value === val.taskStatus) {
          text = el.label
          break;
        }
      }
      return text
    },
  }
};
</script>
<style lang="scss" scoped>
.modalBox {
  width: 100%;
  height: 100%;
  background-color: transparent;
  position: fixed;
  top: 0;
  left: 0;
  
}
.btnBox {
  float: right;
  padding-bottom: 10px;
}
.videoMonitorInfo {
  position: fixed;
  top: 160px;
  z-index: 1000;

  right: 8px;
  width: 778px;
  height: 380px;
  color: #fff;
  background: rgba(255, 255, 255, 1);
  padding: 14px 0 0 0;
  border-radius: 8px;
  box-sizing: border-box;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;
  .infoWindowGroup {
    // margin-left: 13px;
    .infoTitle {
      // padding-left: 26px;
      font-weight: 700;
      font-size: 16px;
      margin: 0;
    }
    .infoCloseIcon {
      position: absolute;
      top: 18px;
      right: 15px;
      cursor: pointer;
      color: #909399;
      font-size: 16px;
    }
    .infoWindowContentvideo {
      display: flex;
      .controlBox {
        margin-top: 20px;
        .controlList {
          height: 200px;
          width: 300px;
          table {
            tr {
              td {
                border-radius: 8px;
                width: 60px;
                height: 30px;
                margin-left: 20px;
                text-align: center;
                color: #f0f0f0;
                background: linear-gradient(
                  rgba(51, 51, 51, 0.4) 0%,
                  rgba(86, 86, 86, 0.4) 100%
                );
                cursor: pointer;
              }
            }
          }
          .smallOrBig {
            margin-top: 20px;
            tr {
              td {
                border-radius: 8px;
                width: 60px;
                height: 30px;
                margin-left: 20px;
                text-align: center;
                color: #f0f0f0;
                background: linear-gradient(
                  rgba(51, 51, 51, 0.4) 0%,
                  rgba(86, 86, 86, 0.4) 100%
                );
                cursor: pointer;
                svg {
                  width: 15px;
                  height: 15px;
                  color: #fff;
                }
              }
            }
          }
        }
      }
    }
    .infoWindowContent {
      height: 427px;
      font-size: 14px;
      line-height: 21px;
      margin: 16px 0 0;
      color: #606266;
      text-align: justify;
      background-color: #000;
      .selectDevType {
        background-color: #fff;
      }
    }
    .myPlayer {
      width: 100%;
    }
  }
}
.monitorInfo {
  position: fixed;
  top: 156px;
  right: 10px;
  z-index: 1000;
  // color: #fff;
  width: 800px;
  background: rgba(255, 255, 255, 1);
  padding: 14px 26px 24px 13px;
  border-radius: 8px;
  box-sizing: border-box;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;
  .infoWindowGroup {
    margin-left: 13px;
    .infoTitle {
      font-weight: 700;
      font-size: 16px;
      // color: #fff;
      margin: 0;
    }
    .infoCloseIcon {
      position: absolute;
      top: 18px;
      right: 15px;
      cursor: pointer;
      // color: #909399;
      font-size: 16px;
    }
    .infoWindowContent {
      font-size: 14px;
      line-height: 21px;
      margin: 16px 0 0;
      // color: #606266;
      text-align: justify;
    }
  }
}
.infoWindowBox {
  position: fixed;
  top: 160px;
  left: 250px;
  width: 400px;
  background: rgba(255, 255, 255, 0.9);
  padding: 14px 26px 0 13px;
  border-radius: 8px;
  box-sizing: border-box;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;
  z-index: 1000;
  //   transition: opacity 0.3s, transform 0.3s, left 0.3s, right 0.3s, top 0.4s, bottom 0.3s;
  .infoWindowGroup {
    margin-left: 13px;
    .infoTitle {
      font-weight: 700;
      font-size: 16px;
      color: #303133;
      margin: 0;
      //   svg {
      //     width: 30px;
      //     height: 30px;
      //   }
    }
    .infoCloseIcon {
      position: absolute;
      top: 18px;
      right: 15px;
      cursor: pointer;
      color: #909399;
      font-size: 16px;
    }
    // .infoWindowContent {
    //   font-size: 14px;
    //   line-height: 21px;
    //   margin: 6px 0 0;
    //   color: #606266;
    //   text-align: justify;
    // }
    .infoWindowContent {
      //   width: 100%;
      .lightTree {
        width: 150px;
        display: block;
        margin-left: 98px;
      }
      .lamp {
        width: 40px;
        height: 40px;
        position: absolute;
        top: 130px;
        left: 70px;
        cursor: pointer;
      }
      .video {
        width: 40px;
        height: 40px;
        position: absolute;
        top: 268px;
        left: 70px;
        cursor: pointer;
      }
      .seasor {
        width: 40px;
        height: 40px;
        position: absolute;
        top: 140px;
        right: 60px;
        cursor: pointer;
      }
      .led {
        width: 40px;
        height: 40px;
        position: absolute;
        top: 284px;
        right: 60px;
        cursor: pointer;
      }
      .broadCast {
        width: 40px;
        height: 40px;
        position: absolute;
        top: 380px;
        left: 70px;
        cursor: pointer;
      }
      .lampLine {
        position: absolute;
        top: 100px;
        left: 110px;
        width: 35px;
        height: 52px;
        border-right: 1px dashed #3bc899;
        border-bottom: 1px dashed #3bc899;
      }
      .videoLine {
        position: absolute;
        top: 268px;
        left: 110px;
        width: 76px;
        height: 20px;
        border-bottom: 1px dashed #ff00ff;
        // border-left: 4px dotted #1a83b7;
      }
      .seasorLine {
        position: absolute;
        top: 160px;
        right: 102px;
        width: 70px;
        height: 10px;
        border-top: 1px dashed #fac84a;
      }
      .ledLine {
        position: absolute;
        top: 304px;
        right: 100px;
        width: 60px;
        height: 10px;
        border-top: 1px dashed #ccdc16;
      }
      .broadCastLine {
        position: absolute;
        top: 360px;
        left: 90px;
        width: 110px;
        height: 21px;
        border-top: 1px dotted #00dcfe;
        border-left: 1px dotted #00dcfe;
      }
      .lampTitle {
        position: absolute;
        top: 180px;
        left: 78px;
        font-size: 14px;
      }
      .videoTitle {
        position: absolute;
        top: 318px;
        left: 76px;
        font-size: 14px;
      }
      .seasorTitle {
        position: absolute;
        top: 192px;
        right: 68px;
        font-size: 14px;
      }
      .ledTitle {
        position: absolute;
        top: 334px;
        right: 56px;
        font-size: 14px;
      }
      .broadCastTitle {
        position: absolute;
        top: 430px;
        left: 75px;
        font-size: 14px;
      }
    }
  }
}
</style>
