<template>
  <section class="dev-type">
    <div class="text-title">
      <div class="text-header">
        <span>设备类型</span>
      </div>
      <div class="text-body">
        <div class="text-colum1">
          <span class="text-row1"> 动力设备 </span>
          <span class="text-row2" style="color: #50e1c7">
            <img src="../../../../assets/img/power.png" /> {{ power }}
          </span>
        </div>
        <div class="text-colum1">
          <span class="text-row1"> 空调 </span>
          <span class="text-row2" style="color: #50e1c7">
            <img src="../../../../assets/img/air-conditioner.png" />
            {{ airConditioner }}</span
          >
        </div>
        <div class="text-colum1">
          <div class="text-row1">照明设备</div>
          <span class="text-row2" style="color: #50e1c7">
            <img
              src="../../../../assets/img/lighting.png"
              style="height: 19px"
            />
            {{ lighting }}</span
          >
        </div>
        <div class="text-colum1">
          <span class="text-row1"> 摄像头 </span>
          <span class="text-row2" style="color: #50e1c7">
            <img src="../../../../assets/img/camera.png" /> {{ camera }}</span
          >
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "DeviceTypeAnalysis",
  data() {
    return {
      power: 32,
      airConditioner: 123,
      lighting: 32,
      camera: 334,
    };
  },
};
</script>

<style lang="scss" scoped>
.dev-type {
  width: 100%;
  height: 20%;
}
.text-body {
  top: 2rem;
}

.text-colum1 {
  text-align: center;
}
</style>