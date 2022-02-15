<template>
  <section class="main" >
    <iframe id="iframe3D" ref="iframe3D" name="iframe3D" :src="url3D" style="width:100%;height:100%;" frameborder="0"></iframe>
    <!-- 综合态势 -->
    <div v-if="currentPage=='all'" class="main-left" style="position: absolute;height: calc(90% - 10px);background: rgba(3, 19, 60,0.5);">
      <DynamicExhibitionLeft ref="DynamicExhibitionLeft" :siteId="siteId"></DynamicExhibitionLeft>
    </div>
    <div v-if="currentPage=='all'" class="main-middle"  style="position: absolute;margin-left: calc(20% + 20px);height: 25%;margin-top: 36%;background: rgba(3, 19, 60,0.5);">
      <DynamicExhibitionCenter ref="DynamicExhibitionCenter"></DynamicExhibitionCenter>
    </div>
    <div v-if="currentPage=='all'" class="main-right"  style="position: absolute;margin-left: calc(80% - 10px);height: calc(90% - 10px);background: rgba(3, 19, 60,0.5);">
      <DynamicExhibitionRight ref="DynamicExhibitionRight" :siteId="siteId"></DynamicExhibitionRight>
    </div>
    <!-- 照明系统 -->
    <div  v-if="currentPage=='light'" class="main-left" style="position: absolute;height: calc(90% - 10px);background: rgba(3, 19, 60,0.5);">
      <DynamicLightLeft ref="DynamicLightLeft"></DynamicLightLeft>
    </div>
    <div v-if="currentPage=='light'" class="main-top"  style="position: absolute;height: 10%;background: rgba(3, 19, 60,0.5);display: flex;align-items: center;flex-direction: row;">
      <div style="width:25%;height:100%;display: flex;align-items: center;">
        <div style="width:45%;height:100%;display: flex;justify-content: center;align-items: center;">
          <img src="../../../../../public/img/zhfx/light01.png" style="width:65px;">
        </div>
        <div style="width:55%;height:100%;">
          <div style="display: flex;align-items: flex-end;justify-content: center;width:100%;height:50%;opacity: 0.9;font-size: 18px;font-family: Source Han Sans CN Bold, Source Han Sans CN Bold-Bold;font-weight: 700;text-align: left;color: #d5e4f9;">照明设备总数</div>
          <div style="width:100%;height:50%;display: flex;justify-content: center;">
            <div style="font-size: 32px;font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;font-weight: bold;text-align: left;color: #48ece7;">{{lightInfo.lightingTotal || 24}}</div>
            <div style="margin-top: 20px;margin-left: 10px;color: #dcdcdc;">个</div>
          </div>
        </div>
      </div>
      <div style="width:25%;height:100%;display: flex;align-items: center;">
        <div style="width:45%;height:100%;display: flex;justify-content: center;align-items: center;">
          <img src="../../../../../public/img/zhfx/running.png" style="width:65px;">
        </div>
        <div style="width:55%;height:100%;">
          <div style="display: flex;align-items: flex-end;justify-content: center;width:100%;height:50%;opacity: 0.9;font-size: 18px;font-family: Source Han Sans CN Bold, Source Han Sans CN Bold-Bold;font-weight: 700;text-align: left;color: #d5e4f9;">运行中</div>
          <div style="width:100%;height:50%;display: flex;justify-content: center;">
            <div style="font-size: 32px;font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;font-weight: bold;text-align: left;color: #ffd452;">{{lightInfo.lightingRunning || 24}}</div>
            <div style="margin-top: 20px;margin-left: 10px;color: #dcdcdc;">个</div>
          </div>
        </div>
      </div>
      <div style="width:25%;height:100%;display: flex;align-items: center;">
        <div style="width:45%;height:100%;display: flex;justify-content: center;align-items: center;">
          <img src="../../../../../public/img/zhfx/shiyong.png" style="width:65px;">
        </div>
        <div style="width:55%;height:100%;">
          <div style="display: flex;align-items: flex-end;justify-content: center;width:100%;height:50%;opacity: 0.9;font-size: 18px;font-family: Source Han Sans CN Bold, Source Han Sans CN Bold-Bold;font-weight: 700;text-align: left;color: #d5e4f9;">使用中</div>
          <div style="width:100%;height:50%;display: flex;justify-content: center;">
            <div style="font-size: 32px;font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;font-weight: bold;text-align: left;color: #47a2ff;">{{lightInfo.lightingUsing || 24}}</div>
            <div style="margin-top: 20px;margin-left: 10px;color: #dcdcdc;">%</div>
          </div>
        </div>
      </div>
      <div style="width:25%;height:100%;display: flex;align-items: center;">
        <div style="width:45%;height:100%;display: flex;justify-content: center;align-items: center;">
          <img src="../../../../../public/img/zhfx/ele.png" style="width:65px;">
        </div>
        <div style="width:55%;height:100%;">
          <div style="display: flex;align-items: flex-end;justify-content: center;width:100%;height:50%;opacity: 0.9;font-size: 18px;font-family: Source Han Sans CN Bold, Source Han Sans CN Bold-Bold;font-weight: 700;text-align: left;color: #d5e4f9;">当日耗电量</div>
          <div style="width:100%;height:50%;display: flex;justify-content: center;">
            <div style="font-size: 32px;font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;font-weight: bold;text-align: left;color: #47ff88;">{{lightInfo.powerDayConsum || 24}}</div>
            <div style="margin-top: 20px;margin-left: 10px;color: #dcdcdc;">kw</div>
          </div>
        </div>
      </div>
      <!-- <DynamicLightBottom ref="DynamicLightBottom"></DynamicLightBottom> -->
    </div>
    <div v-if="currentPage=='light'" class="main-bottom"  style="position: absolute;height: 25%;margin-top: 36%;background: rgba(3, 19, 60,0.5);">
      <DynamicLightBottom ref="DynamicLightBottom"></DynamicLightBottom>
    </div>
    <div v-if="currentPage=='light'" class="main-right01"  style="position: absolute;height: calc(64% - 10px);margin-left: calc(80% - 10px);background: rgba(3, 19, 60,0.5);">
      <DynamicLightRight ref="DynamicLightRight"></DynamicLightRight>
    </div>
    <!-- 停车系统 -->
    <div v-if="currentPage=='car'" class="main-left"  style="position: absolute;height: calc(90% - 10px);background: rgba(3, 19, 60,0.5);">
      <DynamicCarLeft ref="DynamicCarLeft"></DynamicCarLeft>
    </div>
    <div v-if="currentPage=='car'" class="main-top"  style="position: absolute;height: 10%;background: rgba(3, 19, 60,0.5);display: flex;align-items: center;flex-direction: row;">
      <div style="width:25%;height:100%;display: flex;align-items: center;">
        <div style="width:45%;height:100%;display: flex;justify-content: flex-end;align-items: center;">
          <img src="../../../../../public/img/zhfx/cart01.png" style="width:73px;">
        </div>
        <div style="width:55%;height:100%;">
          <div style="display: flex;align-items: flex-end;justify-content: center;width:100%;height:50%;opacity: 0.9;font-size: 18px;font-family: Source Han Sans CN Bold, Source Han Sans CN Bold-Bold;font-weight: 400;text-align: left;color: #d5e4f9;">总车位数</div>
          <div style="width:100%;height:50%;display: flex;justify-content: center;">
            <div style="font-size: 32px;font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;font-weight: bold;text-align: left;color: #29d2fd;">{{parkInfo.parkSpaceTotal || 540}}</div>
          </div>
        </div>
      </div>
      <div style="width:25%;height:100%;display: flex;align-items: center;">
        <div style="width:45%;height:100%;display: flex;justify-content: flex-end;align-items: center;">
          <img src="../../../../../public/img/zhfx/cart02.png" style="width:73px;">
        </div>
        <div style="width:55%;height:100%;">
          <div style="display: flex;align-items: flex-end;justify-content: center;width:100%;height:50%;opacity: 0.9;font-size: 18px;font-family: Source Han Sans CN Bold, Source Han Sans CN Bold-Bold;font-weight: 400;text-align: left;color: #d5e4f9;">已用车位</div>
          <div style="width:100%;height:50%;display: flex;justify-content: center;">
            <div style="font-size: 32px;font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;font-weight: bold;text-align: left;color: #29d2fd;">{{parkInfo.parkSpaceUsed || 240}}</div>
          </div>
        </div>
      </div>
      <div style="width:25%;height:100%;display: flex;align-items: center;">
        <div style="width:45%;height:100%;display: flex;justify-content: flex-end;align-items: center;">
          <img src="../../../../../public/img/zhfx/cart03.png" style="width:73px;">
        </div>
        <div style="width:55%;height:100%;">
          <div style="display: flex;align-items: flex-end;justify-content: center;width:100%;height:50%;opacity: 0.9;font-size: 18px;font-family: Source Han Sans CN Bold, Source Han Sans CN Bold-Bold;font-weight: 400;text-align: left;color: #d5e4f9;">剩余车位</div>
          <div style="width:100%;height:50%;display: flex;justify-content: center;">
            <div style="font-size: 32px;font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;font-weight: bold;text-align: left;color: #29d2fd;">{{parkInfo.parkSpaceSpare || 300}}</div>
          </div>
        </div>
      </div>
      <div style="width:25%;height:100%;display: flex;align-items: center;">
        <div style="width:45%;height:100%;display: flex;justify-content: flex-end;align-items: center;">
          <img src="../../../../../public/img/zhfx/cart04.png" style="width:73px;">
        </div>
        <div style="width:55%;height:100%;">
          <div style="display: flex;align-items: flex-end;justify-content: center;width:100%;height:50%;opacity: 0.9;font-size: 18px;font-family: Source Han Sans CN Bold, Source Han Sans CN Bold-Bold;font-weight: 400;text-align: left;color: #d5e4f9;">当日收费</div>
          <div style="width:100%;height:50%;display: flex;justify-content: center;">
            <div style="font-size: 32px;font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;font-weight: bold;text-align: left;color: #29d2fd;">{{parkInfo.dayCharge || 540}}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="currentPage=='car'" class="main-middle"  style="position: absolute;margin-left: calc(20% + 20px);height: 25%;margin-top: 36%;background: rgba(3, 19, 60,0.5);">
      <DynamicCarBottom ref="DynamicCarBottom"></DynamicCarBottom>
    </div>
    <div v-if="currentPage=='car'" class="main-right"  style="position: absolute;margin-left: calc(80% - 10px);height: calc(90% - 10px);background: rgba(3, 19, 60,0.5);">
      <DynamicCarRight ref="DynamicCarRight"></DynamicCarRight>
    </div>
    <!-- 安防监控 -->
    <div v-if="currentPage=='anfang'" class="main-left"  style="position: absolute;height: calc(90% - 10px);background: rgba(3, 19, 60,0.5);">
      <DynamicAnFangLeft ref="DynamicAnFangLeft"></DynamicAnFangLeft>
    </div>
    <div v-if="currentPage=='anfang'" class="main-top"  style="position: absolute;height: 10%;background: rgba(3, 19, 60,0.5);display: flex;align-items: center;flex-direction: row;">
      <div style="width:25%;height:100%;display: flex;align-items: center;">
        <div style="width:45%;height:100%;display: flex;justify-content: flex-end;align-items: center;">
          <img src="../../../../../public/img/zhfx/anfang01.png" style="width:73px;">
        </div>
        <div style="width:55%;height:100%;">
          <div style="display: flex;align-items: flex-end;justify-content: center;width:100%;height:50%;opacity: 0.9;font-size: 18px;font-family: Source Han Sans CN Bold, Source Han Sans CN Bold-Bold;font-weight: 400;text-align: left;color: #d5e4f9;">安保人员</div>
          <div style="width:100%;height:50%;display: flex;justify-content: center;">
            <div style="font-size: 32px;font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;font-weight: bold;text-align: left;color: #29d2fd;">{{securityInfo.securityPersonnel || 24}}</div>
          </div>
        </div>
      </div>
      <div style="width:25%;height:100%;display: flex;align-items: center;">
        <div style="width:45%;height:100%;display: flex;justify-content: flex-end;align-items: center;">
          <img src="../../../../../public/img/zhfx/anfang02.png" style="width:73px;">
        </div>
        <div style="width:55%;height:100%;">
          <div style="display: flex;align-items: flex-end;justify-content: center;width:100%;height:50%;opacity: 0.9;font-size: 18px;font-family: Source Han Sans CN Bold, Source Han Sans CN Bold-Bold;font-weight: 400;text-align: left;color: #d5e4f9;">运行中设备</div>
          <div style="width:100%;height:50%;display: flex;justify-content: center;">
            <div style="font-size: 32px;font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;font-weight: bold;text-align: left;color: #29d2fd;">{{securityInfo.runningDevice || 178}}</div>
          </div>
        </div>
      </div>
      <div style="width:25%;height:100%;display: flex;align-items: center;">
        <div style="width:45%;height:100%;display: flex;justify-content: flex-end;align-items: center;">
          <img src="../../../../../public/img/zhfx/anfang03.png" style="width:73px;">
        </div>
        <div style="width:55%;height:100%;">
          <div style="display: flex;align-items: flex-end;justify-content: center;width:100%;height:50%;opacity: 0.9;font-size: 18px;font-family: Source Han Sans CN Bold, Source Han Sans CN Bold-Bold;font-weight: 400;text-align: left;color: #d5e4f9;">当日进入</div>
          <div style="width:100%;height:50%;display: flex;justify-content: center;">
            <div style="font-size: 32px;font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;font-weight: bold;text-align: left;color: #29d2fd;">{{securityInfo.inputPeople || 188}}</div>
          </div>
        </div>
      </div>
      <div style="width:25%;height:100%;display: flex;align-items: center;">
        <div style="width:45%;height:100%;display: flex;justify-content: flex-end;align-items: center;">
          <img src="../../../../../public/img/zhfx/anfang04.png" style="width:73px;">
        </div>
        <div style="width:55%;height:100%;">
          <div style="display: flex;align-items: flex-end;justify-content: center;width:100%;height:50%;opacity: 0.9;font-size: 18px;font-family: Source Han Sans CN Bold, Source Han Sans CN Bold-Bold;font-weight: 400;text-align: left;color: #d5e4f9;">在园人数</div>
          <div style="width:100%;height:50%;display: flex;justify-content: center;">
            <div style="font-size: 32px;font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;font-weight: bold;text-align: left;color: #29d2fd;">{{securityInfo.beingPeople || 56}}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="currentPage=='anfang'" class="main-middle"  style="position: absolute;margin-left: calc(20% + 20px);height: 25%;margin-top: 36%;background: rgba(3, 19, 60,0.5);">
      <DynamicAnFangBottom ref="DynamicAnFangBottom"></DynamicAnFangBottom>
    </div>
    <div v-if="currentPage=='anfang'" class="main-right"  style="position: absolute;margin-left: calc(80% - 10px);height: calc(90% - 10px);background: rgba(3, 19, 60,0.5);">
      <DynamicAnFangRight ref="DynamicAnFangRight"></DynamicAnFangRight>
    </div>
    <!-- 动环监控 -->
    <div v-if="currentPage=='power'" class="main-left"  style="position: absolute;height: calc(90% - 10px);background: rgba(3, 19, 60,0.5);">
      <DynamicPowerLeft ref="DynamicPowerLeft" :siteId="siteId"></DynamicPowerLeft>
    </div>
    <div v-if="currentPage=='power'" class="main-top"  style="position: absolute;height: 10%;background: rgba(3, 19, 60,0.5);display: flex;align-items: center;flex-direction: row;">
      <div class="topClass">
        <div style="width:37%;margin-left: 8%;height:100%;display: flex;justify-content: center;align-items: center;">
          <img src="../../../../../public/img/zhfx/tem01.png" style="width:41px;">
        </div>
        <div style="width:39%;height:100%;">
          <div style="display: flex;align-items: flex-end;justify-content: center;width:100%;height:50%;opacity: 0.9;font-size: 18px;font-family: Source Han Sans CN Bold, Source Han Sans CN Bold-Bold;font-weight: 400;text-align: left;color: #d5e4f9;">机房温度</div>
          <div style="width:100%;height:50%;display: flex;justify-content: center;">
            <div style="font-size: 28px;font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;font-weight: bold;text-align: left;color: #29d2fd;">{{powerInfo.temperature ? powerInfo.temperature.avg.toFixed(2): ''}}</div>
            <div style="margin-top: 20px;margin-left: 10px;color: #dcdcdc;">℃</div>
          </div>
        </div>
      </div>
      <div class="topClass">
        <div style="width:37%;margin-left: 8%;height:100%;display: flex;justify-content: center;align-items: center;">
          <img src="../../../../../public/img/zhfx/hum01.png" style="width:41px;">
        </div>
        <div style="width:39%;height:100%;">
          <div style="display: flex;align-items: flex-end;justify-content: center;width:100%;height:50%;opacity: 0.9;font-size: 18px;font-family: Source Han Sans CN Bold, Source Han Sans CN Bold-Bold;font-weight: 400;text-align: left;color: #d5e4f9;">机房湿度</div>
          <div style="width:100%;height:50%;display: flex;justify-content: center;">
            <div style="font-size: 28px;font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;font-weight: bold;text-align: left;color: #29d2fd;">{{powerInfo.hunidity ? powerInfo.hunidity.avg.toFixed(2) : ''}}</div>
            <div style="margin-top: 20px;margin-left: 10px;color: #dcdcdc;">%</div>
          </div>
        </div>
      </div>
      <div class="topClass">
        <div style="width:37%;margin-left: 8%;height:100%;display: flex;justify-content: center;align-items: center;">
          <img src="../../../../../public/img/zhfx/device01.png" style="width:41px;">
        </div>
        <div style="width:39%;height:100%;">
          <div style="display: flex;align-items: flex-end;justify-content: center;width:100%;height:50%;opacity: 0.9;font-size: 18px;font-family: Source Han Sans CN Bold, Source Han Sans CN Bold-Bold;font-weight: 400;text-align: left;color: #d5e4f9;">设备总数</div>
          <div style="width:100%;height:50%;display: flex;justify-content: center;">
            <div style="font-size: 28px;font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;font-weight: bold;text-align: left;color: #29d2fd;">{{deviceTotal || 20}}</div>
          </div>
        </div>
      </div>
      <!-- <div class="topClass">
        <div style="width:37%;margin-left: 8%;height:100%;display: flex;justify-content: center;align-items: center;">
          <img src="../../../../../public/img/zhfx/video01.png" style="width:41px;">
        </div>
        <div style="width:39%;height:100%;">
          <div style="display: flex;align-items: flex-end;justify-content: center;width:100%;height:50%;opacity: 0.9;font-size: 18px;font-family: Source Han Sans CN Bold, Source Han Sans CN Bold-Bold;font-weight: 400;text-align: left;color: #d5e4f9;">监控派单</div>
          <div style="width:100%;height:50%;display: flex;justify-content: center;">
            <div style="font-size: 28px;font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;font-weight: bold;text-align: left;color: #29d2fd;">{{powerInfo.monitorOrders || 20}}</div>
          </div>
        </div>
      </div> -->
    </div>
    <!-- <div v-if="currentPage=='power'" class="powerClass">
      <div style="width: 100%;height: 30px;color: rgb(200, 219, 244);display: flex;align-items: center;margin-left: 64px;font-size: 15px;font-weight: 800;">安全运行</div>
      <div style="width:100%;height:70px;display: flex;align-items: center;">
        <div style="width: 80%;height: 100%;display: flex;align-items: center;color: rgb(81, 209, 245);font-weight: 400;justify-content: center;font-size: 50px;">{{powerInfo.safeDays || 20}}</div>
        <div style="width: 20%;height: 100%;display: flex;align-items: center;font-size: 12px;color: rgb(200, 219, 244);">天</div>
      </div>
    </div> -->
    <div class="powerClass1">
      <div style="width:100%;display: flex;">
        <el-select v-model="campusNow" placeholder="请选择" @change="changeCampus">
          <el-option style="width:80%" 
            v-for="item in campusList"
            :key="item.code"
            :label="item.name"
            :value="item.code">
          </el-option>
        </el-select>
      </div>
      <!-- <el-cascader 
        ref="siteChoose"
        :options="condition" 
        style="width:80%" 
        v-model="address"
        filterable 
        @change="changeAddress"
        :props="{value: 'code', label: 'name', children: 'children'}"
      >
      </el-cascader> -->
    </div>
    <!-- <div class="powerClass1" style="margin-left: calc(20% + 270px)" v-if="currentPage=='energy'" >
      <el-select v-model="planId" placeholder="" @change="changePlan">
        <el-option style="width:80%" 
          v-for="item in planOption"
          :key="item.id"
          :label="item.planName"
          :value="item.id">
        </el-option>
      </el-select>
    </div> -->
    <div class="powerClass1" style="margin-left: calc(20% + 270px)" v-if="currentPage=='power'" >
      <el-cascader 
        ref="siteChoose"
        :options="condition" 
        style="width:80%" 
        v-model="address"
        filterable 
        @change="changeAddress"
        :props="{value: 'code', label: 'name', children: 'children'}"
      >
      </el-cascader>
    </div>
    <div v-if="currentPage=='power'" class="main-middle"  style="position: absolute;margin-left: calc(20% + 20px);height: 25%;margin-top: 36%;background: rgba(3, 19, 60,0.5);">
      <DynamicPowerBottom ref="DynamicPowerBottom" :siteId="siteId"></DynamicPowerBottom>
    </div>
    <div v-if="currentPage=='power'" class="main-right"  style="position: absolute;margin-left: calc(80% - 10px);height: calc(90% - 10px);background: rgba(3, 19, 60,0.5);">
      <DynamicPowerRight ref="DynamicPowerRight" :siteId="siteId" :siteData="campusList"></DynamicPowerRight>
    </div>
    <!-- 能耗监控 -->
    <div v-if="currentPage=='energy'" class="main-left"  style="position: absolute;height: calc(90% - 10px);background: rgba(3, 19, 60,0.5);">
      <DynamicEnergyLeft ref="DynamicEnergyLeft" :siteId="siteId"></DynamicEnergyLeft>
    </div>
    <!-- <div v-if="currentPage=='energy'" class="main-top"  style="position: absolute;height: 10%;background: rgba(3, 19, 60,0.5);display: flex;align-items: center;flex-direction: row;">
      <div class="energyTopClass">
        <div style="width:24%;margin-left: 8%;height:100%;display: flex;justify-content: center;align-items: center;">
        </div>
        <div style="width:39%;height:100%;">
          <div style="display: flex;align-items: flex-end;justify-content: center;width:100%;height:35%;opacity: 0.9;font-size: 14px;font-family: Source Han Sans CN Bold, Source Han Sans CN Bold-Bold;font-weight: 400;text-align: left;color: #d5e4f9;">当日用电</div>
          <div style="display: flex;width:100%;height:15%;opacity: 0.9;"></div>
          <div style="width:100%;height:50%;display: flex;justify-content: center;">
            <div style="font-size: 20px;margin: 5px 0 0 5px;font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;font-weight: bold;text-align: left;color: #24d356;">{{energyInfo.dayElectConsume || 1750}}</div>
            <div style="font-size: 17px;margin-top: 10px;margin-left: 10px;font-weight: 700;color: #24d356;">kw</div>
          </div>
        </div>
      </div>
      <div class="energyTopClass">
        <div style="width:24%;margin-left: 8%;height:100%;display: flex;justify-content: center;align-items: center;">
        </div>
        <div style="width:39%;height:100%;">
          <div style="display: flex;align-items: flex-end;justify-content: center;width:100%;height:35%;opacity: 0.9;font-size: 14px;font-family: Source Han Sans CN Bold, Source Han Sans CN Bold-Bold;font-weight: 400;text-align: left;color: #d5e4f9;">当日制冷</div>
          <div style="display: flex;width:100%;height:15%;opacity: 0.9;"></div>
          <div style="width:100%;height:50%;display: flex;justify-content: center;">
            <div style="font-size: 20px;margin: 5px 0 0 5px;font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;font-weight: bold;text-align: left;color: #24d356;">{{energyInfo.dayRefrigeration || 258}}</div>
            <div style="font-size: 17px;margin-top: 10px;margin-left: 10px;font-weight: 700;color: #24d356;">kw</div>
          </div>
        </div>
      </div>
      <div class="energyTopClass">
        <div style="width:24%;margin-left: 8%;height:100%;display: flex;justify-content: center;align-items: center;">
        </div>
        <div style="width:39%;height:100%;">
          <div style="display: flex;align-items: flex-end;justify-content: center;width:100%;height:35%;opacity: 0.9;font-size: 14px;font-family: Source Han Sans CN Bold, Source Han Sans CN Bold-Bold;font-weight: 400;text-align: left;color: #d5e4f9;">运行设备</div>
          <div style="display: flex;width:100%;height:15%;opacity: 0.9;"></div>
          <div style="width:100%;height:50%;display: flex;justify-content: center;">
            <div style="font-size: 20px;margin: 5px 0 0 5px;font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;font-weight: bold;text-align: left;color: #24d356;">{{energyInfo.runningDeviceConsume || 456}}</div>
            <div style="font-size: 17px;margin-top: 10px;margin-left: 10px;font-weight: 700;color: #24d356;">kw</div>
          </div>
        </div>
      </div>
      <div class="energyTopClass">
        <div style="width:24%;margin-left: 8%;height:100%;display: flex;justify-content: center;align-items: center;">
        </div>
        <div style="width:39%;height:100%;">
          <div style="display: flex;align-items: flex-end;justify-content: center;width:100%;height:35%;opacity: 0.9;font-size: 14px;font-family: Source Han Sans CN Bold, Source Han Sans CN Bold-Bold;font-weight: 400;text-align: left;color: #d5e4f9;">监控派单</div>
          <div style="display: flex;width:100%;height:15%;opacity: 0.9;"></div>
          <div style="width:100%;height:50%;display: flex;justify-content: center;">
            <div style="font-size: 20px;margin: 5px 0 0 5px;font-family: Source Han Sans CN Regular, Source Han Sans CN Regular-Regular;font-weight: bold;text-align: left;color: #24d356;">{{energyInfo.monitorDispatchOrder || 3}}</div>
          </div>
        </div>
      </div>
    </div> -->
    <div v-if="currentPage=='energy'" class="main-middle"  style="position: absolute;margin-left: calc(20% + 20px);height: 25%;margin-top: 36%;background: rgba(3, 19, 60,0.5);">
      <DynamicEnergyBottom ref="DynamicPowerBottom" :planId="planId"></DynamicEnergyBottom>
    </div>
    <div v-if="currentPage=='energy'" class="main-right"  style="position: absolute;margin-left: calc(80% - 10px);height: calc(90% - 10px);background: rgba(3, 19, 60,0.5);">
      <DynamicEnergyRight ref="DynamicEnergyRight" :planId="planId" :siteId="siteId"></DynamicEnergyRight>
    </div>
    <!-- 路灯详情 -->
    <div v-if="lightName!=''" style="width:30%;height:488px;position: absolute;z-index:1000;background: rgba(3, 19, 60,0.9);border-radius: 10px;margin-left: 59%;margin-top: 13px;display: flex;align-items: center;">
      <img src="../../../../../public/img/zhfx/source54.png"  style="position: absolute;margin-left: 70%;margin-top: -369px;width: 200px;">
      <img src="../../../../../public/img/zhfx/source58.png"  style="position: absolute;margin-left: -19px;margin-top: 309px;width: 200px;">
      <div style="position: absolute;margin-top: -436px;margin-left: 20px;cursor: pointer;" @click="lightName=''">
        <i class="el-icon-circle-close"></i>
      </div>
      <div style="width:50%;height:100%;">
        <div style="width:100%;height:100%;">
          <img src="@/assets/img/streetLight.png" style="width: 116px;margin-top: 24px;margin-left: 71px;">
        </div>
      </div>
      <div style="width:68%;height:100%;">
        <div style="width:100%;height:100px;margin-top: 20px;display: flex;align-items: center;justify-content: center;">
          <img src="../../../../../public/img/zhfx/source167.png"  style="height: 84px;width: 53%;position: absolute;">
          <div style="font-size: 29px;color: #0ad5fc;font-weight: 700;"> {{lightName}} </div>
        </div>
        <div style="width:100%;height:calc(100% - 110px);margin-top: 14px;">
          <div class="lightBtn">
            <div class="loginBtnStyle" style="width: 48%;text-align: center;margin-left: 23px;height: 48px;display: flex;align-items: center;justify-content: center;">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              照明监控
            </div>
            <div class="fontStyle">开启 50%</div>
          </div>
          <div class="lightBtn">
            <div class="loginBtnStyle" style="width: 48%;text-align: center;margin-left: 23px;height: 48px;display: flex;align-items: center;justify-content: center;">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              视频监控
            </div>
            <div class="fontStyle">开启</div>
          </div>
          <div class="lightBtn">
             <div class="loginBtnStyle" style="width: 48%;text-align: center;margin-left: 23px;height: 48px;display: flex;align-items: center;justify-content: center;">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              紧急求助状态
            </div>
            <div class="fontStyle">开启</div>
          </div>
          <div class="lightBtn">
            <div class="loginBtnStyle" style="width: 48%;text-align: center;margin-left: 23px;height: 48px;display: flex;align-items: center;justify-content: center;">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              广播监控
            </div>
            <div class="fontStyle">开启</div>
          </div>
          <div class="lightBtn">
            <div class="loginBtnStyle" style="width: 48%;text-align: center;margin-left: 23px;height: 48px;display: flex;align-items: center;justify-content: center;">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              大屏展示
            </div>
            <div class="fontStyle">开启 园区介绍</div>
          </div>
           <div class="lightBtn">
            <div class="loginBtnStyle" style="width: 48%;text-align: center;margin-left: 23px;height: 48px;display: flex;align-items: center;justify-content: center;" @click="openLight">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              {{showLight?'关闭灯光':'开启灯光'}}
            </div>
            <div class="fontStyle"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- 停车详情 -->
    <div v-if="parkName!=''" class="parkClass">
      <div style="position: absolute;margin-top: 54px;margin-left: 263px;cursor: pointer;" @click="parkName=''">
        <i class="el-icon-circle-close"></i>
      </div>
      <div style="width: 100%;height: 10%;"></div>
      <div style="width: 100%;height: 30%;display: flex;align-items: center;color: rgb(27, 182, 210);font-weight: 600;justify-content: center;font-size: 37px;">
        {{parkName}}
      </div>
      <div style="width:100%;height:60%;margin-top: 20px;">
        <div style="width:70%;height:20%;display: flex;align-items: center;margin-left: 35%;">
          <div style="color: rgb(255, 189, 10);font-weight: 600;font-size: 20px;">面积</div>
          <div style="color: rgb(255, 255, 255);font-weight: 600;font-size: 19px;margin-left: 20px;margin-top: 4px;">{{parkArea}}</div>
          <div style="color: rgb(255, 189, 10);font-weight: 600;font-size: 20px;margin-left: 51px;">状态</div>
          <div style="color: rgb(255, 255, 255);font-weight: 600;font-size: 19px;margin-left: 20px;margin-top: 4px;">{{parkstate=='0'?'空闲':'占用'}}</div>
        </div>
        <!-- <div style="width:70%;height:20%;display: flex;align-items: center;margin-left: 30%;">
          <div style="color: rgb(255, 189, 10);font-weight: 600;font-size: 20px;">车辆类型</div>
          <div style="color: rgb(255, 255, 255);font-weight: 600;font-size: 19px;margin-left: 20px;margin-top: 4px;">包月车</div>
        </div> -->
      </div>
    </div>
    <div v-if="cameraName!=''" style="width:37%;height:400px;position: absolute;z-index:1000;background: rgba(3, 19, 60,0.9);border-radius: 10px;margin-left: 52%;margin-top: 73px;display: flex;align-items: center;">
      <img src="../../../../../public/img/zhfx/source54.png"  style="position: absolute;margin-left: 74%;margin-top: -278px;width: 200px;">
      <img src="../../../../../public/img/zhfx/source58.png"  style="position: absolute;margin-left: -26px;margin-top: 226px;width: 200px;">
      <div style="position: absolute;margin-top: -360px;margin-left: 10px;cursor: pointer;" @click="cameraName=''">
        <i class="el-icon-circle-close"></i>
      </div>
      <div style="width: 90%;height: 90%;margin-left: 5%;">
        <!-- <LivePlayer :videoUrl="videoUrl" fluent autoplay live stretch></LivePlayer> -->
        <LivePlayer :autoplay="true" :video-url="videoUrl" :live="true" :muted="true"></LivePlayer>
        <!-- <iframe src="http://192.168.67.13:18080/#/play/wasm/ws%3A%2F%2F192.168.67.13%3A8080%2Frtp%2F44010200491180000001_34020000001320000016.flv"></iframe> -->
      </div>
    </div>
    <div v-if="floorContent" class="powerClass2">
      <div style="width:100%;height:50%;display: flex;">
        <div style="width: 50px;color:white;">烟感:</div>
        <el-switch @change="changeSmoke"
          v-model="smokeShow"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
      </div>
      <div style="width:100%;height:50%;display: flex;">
        <div style="width: 50px;color:white;">温度:</div>
        <el-switch @change="changeTemHum"
          v-model="tenHumShow"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
      </div>
      <div style="width:100%;height:50%;display: flex;">
        <div style="width: 50px;color:white;">摄像头:</div>
        <el-switch @change="changeCamera"
          v-model="cameraShow"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
      </div>
      <div style="width:100%;height:50%;display: flex;">
        <div style="width: 50px;color:white;">异常:</div>
        <el-switch @change="changeErrorShow"
          v-model="errorDeviceShow"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
      </div>
      <div style="width:100%;height:50%;display: flex;" v-show="heatMapShowDiv">
        <div style="width: 50px;color:white;">热力图:</div>
        <el-switch @change="changeHeatmap"
          v-model="heatMapShow"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
      </div>
    </div>
    <!-- 设备详情 -->
    <div v-if="deviceName!=''" class="buildingClass">
      <!-- margin-left: 570px -->
      <div style="position: absolute;margin-top: 15px;margin-left: 327px;cursor: pointer;width: 37px;height: 37px;" @click="detailClose()">
      </div>
      <div style="width: 100%;height: 10%;display: flex;align-items: center;color: rgb(27, 182, 210);font-weight: 600;justify-content: center;font-size: 23px;">
        {{deviceName}}
      </div>
      <div style="width:100%;height:82%;">
        <div class="intervalClass">
          <div class="fontstyle1">设备类型：</div>
          <div class="fontstyle2">{{deveiDetail.typeName}}</div>
        </div>
        <div class="intervalClass">
          <div class="fontstyle1">品牌型号：</div>
          <div class="fontstyle2">{{deveiDetail.modelName}}</div>
        </div>
        <!-- <div class="intervalClass">
          <div class="fontstyle1">设备编号：</div>
          <div class="fontstyle2">{{deveiDetail.code}}</div>
        </div> -->
        <div class="intervalClass">
          <div class="fontstyle1">设备位置：</div>
          <div class="fontstyle2">{{deveiDetail.siteName}}</div>
        </div>
        <el-tabs v-model="activeName" type="card" size="small" class="tabMyself">
          <el-tab-pane label="遥测信息" name="first">
            <div class="deviceTable">
              <el-table  border
                :data="teleData"
                height="350"
                style="width: 100%">
                <el-table-column
                  prop="param"
                  label="参数"
                  width="160">
                </el-table-column>
                <el-table-column
                  prop="value"
                  label="参数值"
                  >
                  <template slot-scope="scope">
                    {{scope.row.value}}{{scope.row.unit}}
                  </template>
                </el-table-column>
                <!-- <el-table-column
                  prop="unit"
                  label="单位">
                </el-table-column> -->
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="遥信信息" name="second">
            <div class="deviceTable">
              <TsgInfo :tsgData="tsgData"></TsgInfo>
            </div>
          </el-tab-pane>
          <!-- <el-tab-pane label="遥控信息" name="third">
            <div class="deviceTable">
              <RTO :rtoData="rtoData"></RTO>
            </div>
          </el-tab-pane>
          <el-tab-pane label="遥调信息" name="fourth">
            <div class="deviceTable">
              <RCO :rcoData="rcoData" :key="rcoKey"></RCO>
            </div>
          </el-tab-pane> -->
        </el-tabs>
      </div>
    </div>
  </section>
</template>

<script>
import RCO from "../../realTimeMonitor/monitorDomain/RCO.vue"; //遥控操作
import RTO from "../../realTimeMonitor/monitorDomain/RTO.vue"; //遥调操作
import TsgInfo from "../../realTimeMonitor/monitorDomain/TsgInfo.vue"; //遥信信息
import echarts from 'echarts/lib/echarts'
import eventBus from "@/util/eventBus";
import DynamicLightLeft from "./DynamicLightLeft";
import DynamicExhibitionLeft from "./DynamicExhibitionLeft";
import DynamicExhibitionCenter from "./DynamicExhibitionCenter";
import DynamicExhibitionRight from "./DynamicExhibitionRight";
import DynamicLightBottom from "./DynamicLightBottom";
import DynamicLightRight from "./DynamicLightRight";
import DynamicCarLeft from "./DynamicCarLeft";
import DynamicCarBottom from "./DynamicCarBottom";
import DynamicCarRight from "./DynamicCarRight";
import DynamicAnFangLeft from "./DynamicAnFangLeft";
import DynamicAnFangBottom from "./DynamicAnFangBottom";
import DynamicAnFangRight from "./DynamicAnFangRight";
import DynamicPowerLeft from "./DynamicPowerLeft";
import DynamicPowerBottom from "./DynamicPowerBottom";
import DynamicPowerRight from "./DynamicPowerRight";
import DynamicEnergyLeft from "./DynamicEnergyLeft";
import DynamicEnergyRight from "./DynamicEnergyRight";
import DynamicEnergyBottom from "./DynamicEnergyBottom";
import LivePlayer from "@liveqing/liveplayer";
import { getSdcDeviceTable } from "@/api/sdc/deviceInfo";
import { sdcSiteAction} from "@/api/sdc/addressInfo";
import { modifyData } from "@/util/domainFilter";
import { sdcDeviceAction,getTeleInfoByDevice } from "@/api/sdc/deviceInfo";

import { 
  getPowerRingSignInfo, 
  getSecuritySignInformation,
  getParkingSystemSignInformation,
  getLightingSystemSignInfo,
  getEnergySignInfo,
  getEnergyPlanList
} from "@/api/sdc/lsd";

export default {
  name: "DynamicExhibition",
  components: {
    DynamicLightLeft,DynamicExhibitionLeft,DynamicExhibitionCenter,DynamicExhibitionRight,DynamicLightBottom,DynamicLightRight,
    DynamicCarLeft,DynamicCarBottom,DynamicCarRight,DynamicAnFangLeft,DynamicAnFangBottom,DynamicAnFangRight,DynamicPowerLeft,
    DynamicPowerBottom,DynamicPowerRight,DynamicEnergyLeft,DynamicEnergyRight,DynamicEnergyBottom,LivePlayer,RTO,TsgInfo,RCO
  },
  data() {
    return {
      //三维场景地址
      url3D:'',
      //当前园区
      campusNow:'',
      campusList:[],
      tempList:[],
      activeName: 'first',
      iframe3D:null,
      currentPage:'all',
      // 路灯
      lightName:'',
      showLight:false,
      // 摄像头
      cameraName:'',
      // 停车位
      parkName:'',
      parkArea:'',
      parkstate:'',
      deviceName:'',
      timer:null,
      // 视频数据
      url: this.$dictUtils.getDictValue("vedio_param", "url_ip", ""),
      port: this.$dictUtils.getDictValue("vedio_param", "port", ""),
      videoUrl: null,
      // 热力图
      heatMapShowDiv:false,
      heatMapShow:false,
      // 烟感
      smokeShow:false,
      // 温湿度
      tenHumShow:false,
      //摄像头
      cameraShow:false,
      //异常
      errorDeviceShow:true,
      floorContent:false,
      // 机房树数据
      condition: [],
      address: null,
      deveiDetail:{
        beginRunTime: "",
        code: "",
        createBy: "",
        createDate: "",
        id: "",
        modelName: "",
        siteName: "",
        typeName: "",
        updateBy: "",
        updateDate: ""
      },
      teleData:[],
      tsgData:[],
      rtoData: [],
      rcoData: [],
      rcoKey: Math.random().toString(36).slice(-6),
      siteId: null,
      // {
      //   param:'',
      //   paramId:'',
      //   value:'',
      //   unit:''
      // }
      powerInfo: {},
      securityInfo: {},
      parkInfo: {},
      lightInfo: {},
      energyInfo: {},
      planOption: [],
      planId: '',
      deviceTotal: '',
    }
  },
  mounted(){
    //切换页面
    eventBus.$off("changePage")
    eventBus.$on('changePage',data =>{
      this.currentPage = data
      console.log(this.currentPage);
      if(this.currentPage === 'power' ) {
        this.getPowerRingSignInfo()
      }
      // if(this.currentPage === 'anfang' ) {
      //   this.getSecuritySignInformation()
      // }
      // if(this.currentPage === 'car' ) {
      //   this.getParkingSystemSignInformation()
      // }
      // if(this.currentPage === 'light' ) {
      //   this.getLightingSystemSignInfo()
      // }
      // if(this.currentPage === 'energy' ) {
      //   this.getEnergySignInfo()
      // }
      
      eventBus.$on('deviceTotal', data => {
        this.deviceTotal = data
      })
      if(this.iframe3D){
        this.iframe3D.postMessage(
        {
          type:'changeTarget',
          data:data,
          campus:this.campusNow
        },'*')
      }
    }) 
    //关闭定时器
    eventBus.$off("closeTimer")
    eventBus.$on('closeTimer',data =>{
      if(this.timer){
        clearInterval(this.timer)
      }
    }) 
    eventBus.$off("clearListener")
    eventBus.$on('clearListener',(res) => {
      window.removeEventListener('message',this.init3DListener)
    })

    // this.timer = setInterval(() => {
    //   this.autoLoadData()
    // }, 3000);
    this.init3D()
    this.init()
  },
  methods:{
    //3D点击设备查看详情关闭触发事件
    detailClose(){
      this.deviceName=''
      this.iframe3D.postMessage(
      {
        type:'detailClose'
      },'*')
    },
    init3D(){
      //访问三维场景地址读取
      let tempUrl = this.$dictUtils.getDictList('url_param_3D')
      let url_3D_List = tempUrl.filter(function(item,index,arr0){
          return item.label=="3D_url";
      });
      if(url_3D_List.length>0){
        this.url3D = url_3D_List[0].value
      }
      let server_3D_List = tempUrl.filter(function(item,index,arr0){
          return item.label=="server_url";
      });

      this.iframe3D = this.$refs['iframe3D'].contentWindow;
      //window.addEventListener('message', this.init3DListener)
      let tokenForm = sessionStorage.getItem('dcplat-access_token')
      let token = JSON.parse(tokenForm)
      let tempDicUrl = this.$dictUtils.getDictList('vedio_param')
      let url_ipList = tempDicUrl.filter(function(item,index,arr0){
          return item.label=="url_ip";
      });
      let portList = tempDicUrl.filter(function(item,index,arr0){
          return item.label=="port";
      });
      let ws_portList = tempDicUrl.filter(function(item,index,arr0){
          return item.label=="ws_port";
      });
      setTimeout(() => {
          this.iframe3D.postMessage(
          {
            type:'token',
            data:token.content,
            isAdd:false,
            url_ip:url_ipList[0].value,
            port:portList[0].value,
            ws_port:ws_portList[0].value,
            serverUrl:server_3D_List[0].value
          },'*')
          window.addEventListener('message', this.init3DListener)
          // //园区动态背景五秒后加载，为避免黑色空白，做次操作
          // setTimeout(() => {
          //     $("#tempBg").remove();
          // }, 5000)
      }, 5000)
    },
    //初始化获取数据
    async init() {
      //获取初始区域查询条件数据
      let data = await sdcSiteAction('','/tree','get')
      this.campusList = modifyData(data.data.data)
      this.campusNow = this.campusList[0].code
      this.iframe3D.postMessage(
      {
        type:'changeCampus',
        data:this.campusNow
      },'*')
      this.campusList.forEach(element => {
        if(element.code==this.campusNow){
          this.siteId = element.id
          this.condition = element.children
        }
      });
      
      this.tempList = []
      this.transList(this.condition)
      // 
    },
    //场景触发显示告警设备
    focusDeviceIn3DFun(roomId,deviceId){
      this.iframe3D.postMessage(
      {
        type:'errorDeviceFocus',
        roomId:roomId,//'room01_01_01_campus03',
        deviceId:deviceId//'23f4fb2b5edb459096b4fef41f50c0a5'
      },'*')
    },
    getPowerRingSignInfo() {
      getPowerRingSignInfo({ siteId: this.siteId }).then(res => {
        if (res.data.code === 0) {
          this.powerInfo = res.data.data
        }
      })
    },
    // getSecuritySignInformation() {
    //   getSecuritySignInformation({ siteId: this.siteId }).then(res => {
    //     if (res.data.code === 0) {
    //       this.securityInfo = res.data.data
    //     }
    //   })
    // },
    // getParkingSystemSignInformation() {
    //   getParkingSystemSignInformation({ siteId: this.siteId }).then(res => {
    //     if (res.data.code === 0) {
    //       this.parkInfo = res.data.data
    //     }
    //   })
    // },
    // getLightingSystemSignInfo() {
    //   getLightingSystemSignInfo({ siteId: this.siteId }).then(res => {
    //     if (res.data.code === 0) {
    //       this.lightInfo = res.data.data
    //     }
    //   })
    // },
    // getEnergySignInfo() {
    //   getEnergySignInfo({ siteId: this.siteId }).then(res => {
    //     if (res.data.code === 0) {
    //       this.energyInfo = res.data.data
    //     }
    //   })
    // },
    getEnergyPlanList() {
      getEnergyPlanList(this.siteId).then(res => {
        if (res.data.code === 0) {
          this.planOption = res.data.data
          if (this.planOption.length > 0) {
            this.planId = this.planOption[0].id
          } else {
            this.planId = ''
          }
          
        }
      })
    },
    //位置结构转换，由于区分当前选中位置是什么类型
    transList(inList){
      inList.forEach(item=>{
        this.tempList[item.code] = item
        if(item.children){
          this.transList(item.children)
        }
      })
    },
    //修改园区场景
    changeCampus(){
      //机房下拉框数据进行修改
      this.campusList.forEach(element => {
        if(element.code==this.campusNow){
          console.log(element);
          this.siteId = element.id

          this.condition = element.children
        }
      });
      this.tempList = []
      this.transList(this.condition)
      this.address = null
      //园区场景进行切换
      this.iframe3D.postMessage(
      {
        type:'changeCampus',
        data:this.campusNow
      },'*')
      if(this.currentPage === 'power' ) {
        this.getPowerRingSignInfo()
      }
      // if(this.currentPage === 'anfang' ) {
      //   this.getSecuritySignInformation()
      // }
      // if(this.currentPage === 'car' ) {
      //   this.getParkingSystemSignInformation()
      // }
      // if(this.currentPage === 'light' ) {
      //   this.getLightingSystemSignInfo()
      // }
      if(this.currentPage === 'energy' ) {
        // this.getEnergySignInfo()
        this.getEnergyPlanList()
      }
    },
    async changeAddress(val) {
      //清空界面
      if(val.length === 0) {
        this.deviceData = this.deviceInfo = []
        this.img = null
        this.address = null 
      } else {
        let roomId = val[val.length - 1]
        // this.siteId = this.tempList[roomId].id
        this.iframe3D.postMessage(
        {
          type:'changeLevel',
          data:roomId,
          positionType:this.tempList[roomId].type,
          id:this.tempList[roomId].id//停车场查车位需要
        },'*')
      }
      if(this.currentPage === 'power' ) {
        this.getPowerRingSignInfo()
      }
      // if(this.currentPage === 'anfang' ) {
      //   this.getSecuritySignInformation()
      // }
      // if(this.currentPage === 'car' ) {
      //   this.getParkingSystemSignInformation()
      // }
      // if(this.currentPage === 'light' ) {
      //   this.getLightingSystemSignInfo()
      // }
      // if(this.currentPage === 'energy' ) {
      //   this.getEnergySignInfo()
      // }
    },
    changePlan(val) {
      
    },
    typeTranslate(row) {
      let plateColorMap = this.$dictUtils.getDictList('telemsg_status')
      let rowText
      for(let i = 0; i < plateColorMap.length; i++) {
        let el = plateColorMap[i]
        if(el.value === row.value) {
          rowText = el.label
          break
        }
      }
      return rowText
    },
    //开灯
    openLight(){
      this.iframe3D.postMessage(
      {
        type:'light',
        data:this.lightName,
      },'*')
      this.showLight = !this.showLight
    },
    async init3DListener(e){
      if(e.data.type=='lightData'){
        this.lightName = e.data.id
        this.showLight = e.data.showLight
      }
      if(e.data.type=='parkData'){
        // this.parkName = e.data.id
        // var tempData = e.data.id.split('&')
        // var deviceCode = tempData[0]
        // var deviceType = tempData[1]
        // var deviceId = tempData[2]
        // console.log('e.data.data',e.data.data)
        this.parkName = e.data.data.name
        this.parkArea = e.data.data.area
        this.parkstate = e.data.data.state
      }
      if(e.data.type=='camera'){
        this.cameraName = e.data.name;
        console.log('视频路径：',e.data.url)
        this.videoUrl = e.data.url;//http://10.128.193.2:8080/10.128.192.38/10.128.192.38.live.mp4 'http://192.168.67.52:18080/test/test.flv';
        //e.data.id 摄像头id 为了演示暂用有视频的
        // getSdcDeviceTable({ videoType: "1", id: "369fd432fab24e72a754e5e17523d441" }).then((res) => {
        //   $.get(
        //     "http://" + this.url + ":" + this.port + "/api/v1/stream/start",
        //     {
        //       serial: res.data.data.records[0].devicechannel,
        //       code: res.data.data.records[0].channel,
        //     }
        //   ).then((data) => {
        //     this.videoUrl = data.WS_FLV;
        //     this.cameraName = e.data.id;
        //   });
        // });
      }
      if(e.data.type=='floorContent'){
        this.floorContent = e.data.show
        this.heatMapShowDiv = e.data.heatShow
        this.heatMapShow = false
      }
      //情况机房选择
      if(e.data.type=='clearChoose'){
        this.address = null
        this.heatMapShow = false
        this.smokeShow = false
        // 温湿度
        this.tenHumShow = false
        //摄像头
        this.cameraShow = false
        //异常
        this.errorDeviceShow = true
      }
      //查看机房设备详情
      if(e.data.type=='deviceDetail'){
        this.teleData = []
        this.teleData.length=0
        this.tsgData = []
        this.rtoData = []
        this.rcoData = []
        console.log('点击查看设备详情',e.data.idType)
        var tempData = e.data.idType.split('&')
        var deviceCode = tempData[0]
        var deviceType = tempData[1]
        var deviceId = tempData[2]
        console.log('设备ID',deviceId)
        let queryData = await sdcDeviceAction("", "/" + deviceId, "get");
        let deviceDetail = queryData.data.data
        this.deviceName = deviceDetail.name
        var siteNameTempList = deviceDetail.siteName.split('/')
        this.deveiDetail = {
          beginRunTime: deviceDetail.beginRunTime,
          code: deviceDetail.code,
          createBy: deviceDetail.createBy,
          createDate: deviceDetail.createDate,
          id: deviceDetail.id,
          modelName: deviceDetail.modelName,
          siteName: siteNameTempList.length==0?'未知':siteNameTempList[siteNameTempList.length-1],
          typeName: deviceDetail.typeName,
          updateBy: deviceDetail.updateBy,
          updateDate: deviceDetail.updateDate
        }
        console.log('设备信息',this.deviceName,this.deveiDetail)
// 遥测 0 ->3
// 遥信 1 ->4
// 遥控 2 ->2
// 遥调 3 ->1
        this.teleData = []
        this.teleData.length=0
        this.tsgData = []
        this.rtoData = []
        this.rcoData = []

        let teleQueryMsg = await getTeleInfoByDevice(deviceId);
        console.log('遥测遥控等信息',teleQueryMsg.data.data.records)
        for (let j = 0; j < teleQueryMsg.data.data.records.length; j++) {
          const el = teleQueryMsg.data.data.records[j];
          if (el.type === "3"){ //if (el.type === "0") {//遥测信息
            console.log('返回展示的遥测参数',el.param)
            this.teleData.push({
              param: el.param,
              paramId: el.paramId,
              value: el.value,
              unit:el.unit
            });
          } 
          else if (el.type === "4"){//else if (el.type === "1") {//遥信信息
            this.tsgData.push(el);
          } 
          else if (el.type === "2") {//遥控信息
            this.rtoData.push(el);
          } 
          else if (el.type === "1") {//else if (el.type === "3") {//遥调信息
            this.rcoData.push(el);
          }
        }
        //console.log('teleData',teleData)
        // console.log('tsgData',tsgData)
        // console.log('rcoData',rcoData)
      }
      if(e.data.type=='messageShow'){
        this.$message({
          showClose: true,
          message: e.data.content,
          type: e.data.contentType
        });
      }
      // if(e.data.type=='buildingData'){
      //   this.deviceName = e.data.id
      // }
    },
    autoLoadData(){
      if(this.$refs.DynamicExhibitionRight){
        this.$refs.DynamicExhibitionRight.changeClass();
      }
    },
    changeHeatmap(){
      this.iframe3D.postMessage(
      {
        type:'heatMap',
        data:this.heatMapShow,
      },'*')
    },
    changeSmoke(){
      this.iframe3D.postMessage(
      {
        type:'smoke',
        data:this.smokeShow,
      },'*')
    },
    changeTemHum(){
      this.iframe3D.postMessage(
      {
        type:'temHum',
        data:this.tenHumShow,
      },'*')
    },
    changeCamera(){
      this.iframe3D.postMessage(
      {
        type:'camera',
        data:this.cameraShow,
      },'*')
    },
    changeErrorShow(){
      this.iframe3D.postMessage(
      {
        type:'errorDeviceShow',
        data:this.errorDeviceShow,
      },'*')
    }
  },
  beforeDestroy(){
    window.removeEventListener('message',this.init3DListener)
    if(this.timer){
      clearInterval(this.timer)
    }
  },
  updateDestory(){
    window.removeEventListener('message',this.init3DListener)
  }
}
</script>
<style lang="scss">

.tabMyself{
  margin-top: 17px; width: 86%; margin-left: 7%; 

  .el-tabs__item.is-active{
    color: rgb(27, 182, 210);
    font-weight: 600;
  }

  .el-tabs__item{
    color: rgba(255,255,255,0.7);
  }
}

.deviceTable{
  .el-table thead {
    color: white;
  }

  .el-table {
    color: white;
  }

  .el-table th,
  .el-table tr {
    background-color: transparent;
  }

  .el-table,
  .el-table__expanded-cell {
    background-color: transparent;
  }

   .el-table tbody tr:hover > td {
    background-color: rgba(255, 255, 255, 0.1) !important;
  }

  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  .el-table__body-wrapper::-webkit-scrollbar-track-piece {
    background-color: rgba(3, 19, 60, 1);
  }
  .el-table__body-wrapper::-webkit-scrollbar {
    width: 6px;
  }
  .el-table__body-wrapper::-webkit-scrollbar-thumb {
    background-color: #dddddd;
    border-radius: 100px;
  }
  .el-table__body-wrapper::-webkit-scrollbar-thumb:hover {
    background-color: #bbb;
  }
}

.deviceTable ::v-deep .el-table__body tr:hover > td {
  background-color: transparent !important;
}
  .loginBtnStyle{
    background: url("../../../../../public/img/zhfx/btn.png") center no-repeat;
    background-size:contain;
    position: relative;
    display: inline-block;
    /* padding: 10px 20px; */
    color:white;
    font-size: 15px;
    text-decoration: none;
    text-transform: uppercase;
    overflow: hidden;
    transition: .5s;
    /* //margin-top: 40px; */
    letter-spacing: 4px;
    cursor: pointer;
  }

  .loginBtnStyle:hover {
    background:#0167A4;
    color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 5px #0167A4,
              0 0 25px #0167A4,
              0 0 50px #0167A4,
              0 0 100px #0167A4;
}

/* .loginBtnStyle span {
  position: absolute;
  display: block;
}

.loginBtnStyle span:nth-child(1) {
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #03e9f4);
  animation: btn-anim1 1s linear infinite;
}

@keyframes btn-anim1 {
  0% {
    left: -100%;
  }
  50%,100% {
    left: 100%;
  }
}

.loginBtnStyle span:nth-child(2) {
  top: -100%;
  right: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, transparent, #03e9f4);
  animation: btn-anim2 1s linear infinite;
  animation-delay: .25s
}

@keyframes btn-anim2 {
  0% {
    top: -100%;
  }
  50%,100% {
    top: 100%;
  }
}

.loginBtnStyle span:nth-child(3) {
  bottom: 0;
  right: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(270deg, transparent, #03e9f4);
  animation: btn-anim3 1s linear infinite;
  animation-delay: .5s
}

@keyframes btn-anim3 {
  0% {
    right: -100%;
  }
  50%,100% {
    right: 100%;
  }
}

.loginBtnStyle span:nth-child(4) {
  bottom: -100%;
  left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(360deg, transparent, #03e9f4);
  animation: btn-anim4 1s linear infinite;
  animation-delay: .75s
}

@keyframes btn-anim4 {
  0% {
    bottom: -100%;
  }
  50%,100% {
    bottom: 100%;
  }
} */
 
.powerClass1 .el-input__inner{
  background-color: transparent;
  border: none;
  color:white;
  text-align: center;
}

</style>
<style lang="scss" scoped>
.topClass{
  width:33%;height:100%;display: flex;align-items: center;
  background: url("../../../../../public/img/zhfx/topbg.png") center no-repeat;
  background-size:contain;
}

.energyTopClass{
  width:25%;height:100%;display: flex;align-items: center;
  background: url("../../../../../public/img/zhfx/energybar.png") center no-repeat;
  background-size:contain;
}

.parkClass{
  width:40%;
  height:254px;
  position: absolute;
  z-index:1000;
  //background: rgba(3, 19, 60,0.9);
  border-radius: 10px;
  margin-left: 35%;
  margin-top: 85px;
  background: url("../../../../../public/img/zhfx/carbg.png") center no-repeat;
  background-size:contain;
}
.buildingClass{
  // width:33%;
  // height:662px;
  // position: absolute;
  // z-index:1000;
  // //background: rgba(3, 19, 60,0.9);
  // border-radius: 10px;
  // margin-left: 57%;
  // margin-top: 85px;
  // background: url("../../../../../public/img/zhfx/buildingbg.png") center no-repeat;
  // background-size:cover;
  width:20%;
  height:622px;
  position: absolute;
  z-index:1000;
  //background: rgba(3, 19, 60,0.9);
  border-radius: 10px;
  margin-left: 20%;
  background: url("../../../../../public/img/zhfx/lQLPDhsGt-3D6XPNAozNAYCwionKX8OcjgYB265E8ICnAA_384_652.png") center no-repeat;
  background-size:inherit;

  .intervalClass{
    width:100%;height:6.5%;display: flex;align-items: center;
  }

//   .fontstyle1{
//     font-weight: 400;font-size: 14px;margin-left: 7%;
// color: #ffffff;width:24%;
//   }
//   .fontstyle2{
//     font-size: 14px;margin-left: 20px;margin-top: 4px;font-weight: 400;
// text-align: left;
// color: #00e4ff;    width: 69%;
//   }

  .fontstyle1{
    font-weight: 400;font-size: 14px;margin-left: 7%;
color: #ffffff;width:19%;
  }
  .fontstyle2{
    font-size: 14px;margin-left: 3px;margin-top: 4px;font-weight: 400;
text-align: left;
color: #00e4ff;    width:calc(67% - 3px);
  }

}

.powerClass{
  width: 140px;
  height: 100px;
  position: absolute;
  z-index: 1000;
  border-radius: 10px;
  margin-left: calc(70% + 20px);
  margin-top: 108px;
}
.powerClass1{
  width: 244px;
  height: 44px;
  position: absolute;
  z-index: 1000;
  border-radius: 10px;
  margin-left: calc(20% + 20px);
  margin-top: 33%;
  background: url("../../../../../public/img/zhfx/roombg.png") center no-repeat;
  background-size:inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.8);
}


.powerClass2{
  width: 104px;
  height: 82px;
  position: absolute;
  z-index: 1000;
  border-radius: 10px;
  margin-left: 74%;
  margin-top: 26%;
  // background: url("../../../../../public/img/zhfx/roombg.png") center no-repeat;
  // background-size:contain;
  //display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.8);
}

.lightBtn{
  width:100%;
  height:14%;
  display: flex;align-items: center;
  // background: url("../../../../../public/img/zhfx/btn.png") center no-repeat;
  // background-size:contain;
  // /* 随便设置宽高值，测试 */
  // width:100%;
  // height:100%;

  .fontStyle{
    opacity: 1;
    font-size: 14px;
    font-family: Microsoft YaHei Regular, Microsoft YaHei Regular-Regular;
    font-weight: 400;
    text-align: left;
    color: #ffffff;
    letter-spacing: 1px;
  }
}

#gavinPlayLight{
    background: url("../../../../../public/img/zhfx/source254.png") center no-repeat;
    background-size:contain;
    /* 随便设置宽高值，测试 */
    width:100%;
    height:100%;
    /* 设置默认样式，开启3d硬件加速 */
    -webkit-transform:translate3d(0,0,0);
    -moz-transform:translate3d(0,0,0);
    transform:translate3d(0,0,0);
    /* 设置动画，animation:动画名称 动画播放时长单位秒或微秒 动画播放的速度曲线linear为匀速 动画播放次数infinite为循环播放; */
    -webkit-animation:play 13s linear infinite;
    -moz-animation:play 13s linear infinite;
    animation:play 13s linear infinite;
    /* //margin-top: 5%; */
    /* margin-left: 5%; */
    /* margin-top: -5px; */
}

@-webkit-keyframes play{
    0%  {
        /*
        水平翻转
        -webkit-transform:rotateY(0deg);
        垂直翻转
        -webkit-transform:rotateX(0deg);
        顺时针旋转*/
        -webkit-transform:rotate(0deg);
         /*
        逆时针旋转
        -webkit-transform:rotate(0deg);
        */
    }
    100% {
        /* 水平翻转 
        -webkit-transform:rotateY(360deg);
        垂直翻转
        -webkit-transform:rotateX(360deg);
        顺时针旋转*/
        -webkit-transform:rotate(360deg);
        /* 逆时针旋转
        -webkit-transform:rotate(-360deg);
        */
    }
}
@-moz-keyframes play{
    0%  {
         /*-moz-transform:rotateY(0deg);
       
        -moz-transform:rotateX(0deg);*/
        -moz-transform:rotate(0deg);
         /*-moz-transform:rotate(0deg);
        */
    }
    100% {
         /*-moz-transform:rotateY(360deg);
       
        -moz-transform:rotateX(360deg);*/
        -moz-transform:rotate(360deg);
         /*-moz-transform:rotate(-360deg);
        */
    }
}
@keyframes play{
    0%  {
         /*transform:rotateY(0deg);
        
        transform:rotateX(0deg);*/
        transform:rotate(0deg);
        /*transform:rotate(0deg);*/
        
    }
    100% {
       /* transform:rotateY(360deg);
        
        transform:rotateX(360deg);*/
        transform:rotate(360deg);
        /*transform:rotate(-360deg);
        */
    }
}
.emg-count {
  width: 100%;
  height: 25%;
}
.text-body {
  top: 2rem;
  height: 80%;
}
.text-row2 {
  height: 58%;
  width: 50%;
  font-size: 1.125rem;
  display: flex;
  justify-items: center;
  align-items: center;
  border: 6px solid #6ec0ff;
  color: #6ec0ff;
  border-radius: 50%;
}
.emgCountChart {
  width: 100%;
  height: 200px;
  padding: 0 0 1rem 1rem;
  position: relative;
  top: 20px;
  color: #ffffff;
}
.button-group {
  display: inline;
  position: absolute;
  margin-left: 47%;
}

.el-button-1{
  background: rgba(0,0,0,0.4);
  color: white;
  opacity: 1;
}

.el-button:focus, .el-button:hover{
    background: #59b6d9;
    color: #ffffff;
    opacity: 1;
}

.bottomChart {
  width: 100%;
  height: 220px;
  position: relative;
  top: 20px;
  color: #ffffff;
}

// .bg1Class{
//     background: url("../../../../../public/img/zhfx/bg1.png") center no-repeat;
//     background-size:contain;
//     /* 随便设置宽高值，测试 */
//     width:100%;
//     height:100%;
//     /* 设置默认样式，开启3d硬件加速 */
//     -webkit-transform:translate3d(0,0,0);
//     -moz-transform:translate3d(0,0,0);
//     transform:translate3d(0,0,0);
//     /* 设置动画，animation:动画名称 动画播放时长单位秒或微秒 动画播放的速度曲线linear为匀速 动画播放次数infinite为循环播放; */
//     -webkit-animation:play 13s linear infinite;
//     -moz-animation:play 13s linear infinite;
//     animation:play 13s linear infinite;
// }

.bgClassT{
  background: url("../../../../../public/img/zhfx/border16.png") center no-repeat;
  background-size:100% 80%;
}
</style>