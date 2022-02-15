<template>
  <section class="park-profile">
    <div class="text-title">
      <div class="text-header">
        <span>设备概况</span>
      </div>
      <div class="text-body">
        <div class="text-colum1" style="color: #6ec0ff">
          <div class="text-row2">
            <span style="width: 100%; text-align: center">
              {{ deviceNum }}</span
            >
          </div>
          <span class="text-row1">总数</span>
        </div>
        <div class="text-colum1" style="color: #6effe5">
          <div class="text-row2" style="border-color: #6effe5">
            <span style="width: 100%; text-align: center"> {{ oline }}</span>
          </div>
          <span class="text-row1">在线</span>
        </div>
        <div class="text-colum1" style="color: #cfe2f1">
          <div class="text-row2" style="border-color: #cfe2f1">
            <span style="width: 100%; text-align: center"> {{ off }}</span>
          </div>
          <span class="text-row1">离线</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "DevieProfile",
  data() {
    return {
      deviceNum: 14083,
      oline: 13782,
      off: 301,
    };
  },
};
</script>

<style lang="scss" scoped>
.park-profile {
  width: 100%;
  height: 25%;
}

.text-body {
  height: 70%;
}
.text-row2 {
      height: 79px;
      width: 79px;
      font-size: 20px;
      display: flex;
      justify-items: center;
      align-items: center;
      border: 6px solid #6ec0ff;
      color: #6ec0ff;
      border-radius: 50%;
    }
</style>