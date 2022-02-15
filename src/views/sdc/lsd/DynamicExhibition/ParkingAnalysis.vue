<template>
  <section class="parking-analysis">
    <div class="text-title">
      <div class="text-header">
        <span>停车位分析</span>
      </div>
      <div class="text-middle">
        <span>车位总数</span>
        <span class="span-text1">{{ sum }}</span>
      </div>
      <div class="text-body">
        <div class="text-colum1">
          <span class="text-row1">
            <img
              src="../../../../assets/img/car.png"
              v-for="index in 9"
              :key="index"
              style="margin-right: 4px"
            />
          </span>
          <div class="text-row2" style="color: #1569cb">
            {{ occupied }} <br />
            <span style="color: #ffffff">已占用</span>
          </div>
        </div>
        <div class="text-colum2">
          <span class="text-row1">
            <img
              src="../../../../assets/img/car2.png"
              v-for="index in 7"
              :key="index"
              style="margin-right: 4px"
            />
          </span>
          <div class="text-row2" style="color: #50e1c7">
            {{ unoccupied }} <br />
            <span style="color: #ffffff">可用</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "ParkingAnalysis",
  data() {
    return {
      sum: 340,
      occupied: 178,
      unoccupied: 162,
    };
  },
};
</script>

<style lang="scss" scoped>
.parking-analysis {
  width: 100%;
  height: 20%;
}
.text-body {
  top: 1.0rem;
  height: 50%;
}
.text-colum1 {
  width: auto;
}
.text-row1 {
  margin-right: 5px;
}
.text-row2 {
  height: 58%;
  width: 50%;
  font-size: 16px;
  display: block;
  margin-top: 16px;
}
.span-text1 {
  font-size: 1.875rem;
  padding-left: 0.625rem;
  color: #71caef;
}

.text-middle {
  position: relative;
  top: 1.5rem;
  text-align: left;
  color: #ffffff;
  margin-left: 1rem;
  margin-bottom: 2rem;
}
</style>