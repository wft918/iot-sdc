<template>
  <section class="container-header">
    <section class="leftmenu">
      <div class="menu-container">
        <div class="menu-body1" style="color:#ffffff">综合态势</div>
        <div class="menu-body1" >停车管理</div>
        <div class="menu-body1" >安防管理</div>
      </div>
    </section>
    <section class="center-title">
      <span class="title-theme">智慧园区统一运营平台</span>
    </section>
    <section class="rightmenu">
      <div class="menu-container" style="flex-direction: row-reverse;">
        <div @click="closeLsd" class="logout-btn"> 
          <el-tooltip class="item" effect="dark" content="退出" placement="bottom">
            <i class="el-icon-switch-button"></i>
          </el-tooltip>
        </div> 
        <div class="menu-body1" >照明管理</div>
        <div class="menu-body1" >动环监测</div>
        <div class="menu-body1" >能耗管理</div>
      </div>
    </section>
    
  </section>
</template>

<script>
import eventBus from "@/util/eventBus";

export default {
  name: 'HeaderNavBar',
  methods: {
    closeLsd() {
      eventBus.$emit('closeLsd')
      eventBus.$emit('closeOneSelf')
    }
  }
}
</script>

<style lang="scss" scoped>
.logout-btn {
  cursor: pointer;
  color: #a2b1db;
  font-size: 30px;
  font-weight: 600;
  margin-right:3%;
}

.center-title {
  width: 40%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  .title-theme {
    z-index: -100;
    opacity: 1;
    font-size: 36px;
    font-weight: 700;
    text-align: center;
    color: #fafeff;
    line-height: 24px;
    text-shadow: 2px 3px 0px 0px #3258a6;
  }
}
.leftmenu {
  width: 30%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
}
.decoration {
    width: 100%;
    height: 30%;
  }
  .menu-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-items: center;
    align-items: center;

    .menu-body1 {
      margin-right:3%;
      width: 12rem;height:4rem;
      margin-left: 3%;
      font-size: 24px;
      color: #a2b1db;
      cursor: pointer;
    }
    .menu-body2 {
      margin-left: 3%;
      width: 30%;
    }
    .menu-body3 {
      margin-left: 3%;
      width: 30%;
    }
  }
.rightmenu {
  width: 30%;
  height: 100%;
}
</style>
