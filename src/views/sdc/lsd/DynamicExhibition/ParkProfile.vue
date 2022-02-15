<template>
  <section class="park-profile">
      <div class="text-title">
        <div class="text-header">
          <div>园区概况</div>
        </div>
        <div class="text-body">
          <div class="text-colum1">
            <span class="text-row1">
              <img src="../../../../assets/img/area.png" />
              用地面积
            </span>
            <div class="text-row2" style="color:#50e1c7"> 
              {{ land }} 
              <span style="font-size:16px">m<sup>2</sup></span>
            </div>
          </div>
          <div class="text-colum1">
            <span class="text-row1">
              <img src="../../../../assets/img/building.png" />
              楼栋数量
            </span>
            <div class="text-row2" style="color:#50e1c7"> {{ buiiding }}</div>
          </div>
          <div class="text-colum1">
            <span class="text-row1">
              <img src="../../../../assets/img/people.png" />
              入园人数
            </span>
            <div class="text-row2" style="color:#50e1c7"> {{ poepleNum }}</div>
          </div>
        </div>
      </div>
  </section>
</template>

<script>
export default {
  name: "ParkProfile",
  data() {
    return {
      land: 56849,
      buiiding: 12,
      poepleNum: 651,
    };
  },
};
</script>

<style lang="scss" scoped>
.park-profile {
  width: 100%;
  height: 25%;
  }
</style>