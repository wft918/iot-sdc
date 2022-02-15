<template>
  <section class="environment">
      <div class="text-title">
        <div class="text-header" >
          <span>环境信息</span>
        </div>
        <div class="text-body">
          <div class="body-up component-off">
            <div class="text-colum2" style="margin:0">
              <span class="text-row2" style="color:#ffc02a;">
                <img src="../../../../assets/img/temperature.png" /> 
                <span style="font-size:35px"> {{ engnieRoomPeakTemp }} </span>
                <span style="font-size:14px">&#8451</span>
              </span>
              <span class="text-row1" style="color: #50e1c7;" >
                当前机房温度峰值
              </span>
            </div>
            <div class="text-colum1">
              <span class="text-row2" style="color:#54d5b8;">
                <span>{{ outsideTemp }} </span> 
                <span style="font-size:14px">&#8451</span>
                </span
              >
              <span class="text-row1">
                当前室外温度
              </span>
            </div>
            <div class="text-colum1">
              <span class="text-row2" style="color:#e66142;">
                <span>
                {{ engnieRoomMaxTemp }} </span>
                <span style="font-size:14px">&#8451</span>
                </span
              >
              <span class="text-row1">
                机房最高温度
              </span>
            </div>
            <div class="text-colum1">
              <span class="text-row2" style="color:#2a8eff;">
                <span >
                {{ engnieRoomMinTemp }} </span>
                <span style="font-size:14px">&#8451</span>
                </span
              >
              <span class="text-row1" >
                机房最低温度
              </span>
            </div>
          </div>
          <div class="body-down">
            <div class="text-colum2" style="margin:0">
              <span class="text-row2" style="color:#ffc02a;">
                <span style="font-size:35px">
                  <img src="../../../../assets/img/humidity.png" />
                  {{ engnieRoomPeakHumid }} 
                </span> 
                <span style="font-size:14px">%</span>
              </span>
              <span class="text-row1">
                当前机房湿度峰值
              </span>
            </div>
            <div class="text-colum1">
              <span class="text-row2" style="color:#54d5b8;">
                <span >
                {{ outsideHumid }} </span> 
                <span style="font-size:14px">%</span>
                </span
              >
              <span class="text-row1" >
                当前室外湿度
              </span>
            </div>
            <div class="text-colum1">
              <span class="text-row2" style="color:#e66142;">
                <span >
                {{ engnieRoomMaxHumid }} </span> 
                <span style="font-size:14px">%</span>
                </span
              >
              <span class="text-row1">
                机房最高湿度
              </span>
            </div>
            <div class="text-colum1">
              <span class="text-row2" style="color:#2a8eff;">
                <span >
                {{ engnieRoomMinHumid }} </span> 
                <span style="font-size:14px">%</span>
              </span>
              <span class="text-row1" >
                机房最低湿度
              </span>
            </div>
          </div>
        </div>
      </div>
  </section>
</template>

<script>
export default {
  name: "Environment",
  data() {
    return {
      engnieRoomPeakTemp: 23,
      outsideTemp: 18,
      engnieRoomMaxTemp: 23,
      engnieRoomMinTemp: 16,
      engnieRoomPeakHumid: 45,
      outsideHumid: 55,
      engnieRoomMaxHumid: 45,
      engnieRoomMinHumid: 41,
    };
  },
};
</script>

<style lang="scss" scoped>
.environment {
  width: 100%;
  height: 25%;
}
.text-body {
  top: 1rem;
  flex-direction: column;
}
.body-up {
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: row;
}

.body-down {
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: row;
}

.text-colum1 {
  width: 23%;
  margin-left: 5px;
}
.text-colum2 {
  width: 31%;
  margin-left: 5px;
}

.text-row1 {
  font-size: 14px;
}
.text-row2 {
  font-size: 30px;
}
.component-off {
  margin-bottom: 1rem;
}
</style>