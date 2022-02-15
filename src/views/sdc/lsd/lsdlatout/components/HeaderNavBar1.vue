<template>
  <section class="container-header">
    <section class="leftmenu">
      <div class="menu-container">
        <div id="all" class="menu-body1" style="color:#49fff9"  @click="changePage('all')">综合态势</div>
        <div id="power" class="menu-body1" @click="changePage('power')">动环系统</div>
        <div id="energy" class="menu-body1" @click="changePage('energy')">能耗系统</div>
      </div>
    </section>
    <section class="center-title">
      <!-- <span class="title-theme">智慧园区统一运营平台</span> -->
    </section>
    <section class="rightmenu">
      <div class="menu-container" style="flex-direction: row-reverse;">
        <div @click="closeLsd" class="logout-btn"> 
          <el-tooltip class="item" effect="dark" content="退出" placement="bottom">
            <i class="el-icon-switch-button"></i>
          </el-tooltip>
        </div> 
        <!-- <div id="light" class="menu-body1" @click="changePage('light')">照明系统</div>
        <div id="car" class="menu-body1"  @click="changePage('car')">停车系统</div>
        <div id="anfang" class="menu-body1" @click="changePage('anfang')">安防系统</div> -->
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
      eventBus.$emit('clearListener')
      eventBus.$emit('closeLsd')
      eventBus.$emit('closeTimer')
      eventBus.$emit('closeOneSelf')
    },
    changePage(page){
      eventBus.$emit('changePage',page)
      //清除样式
      document.getElementById('all').style.color = '#49a3ff';
      document.getElementById('power').style.color = '#49a3ff';
      document.getElementById('energy').style.color = '#49a3ff';
      // document.getElementById('light').style.color = '#49a3ff';
      // document.getElementById('car').style.color = '#49a3ff';
      // document.getElementById('anfang').style.color = '#49a3ff';
      //修改样式
      document.getElementById(page).style.color = '#49fff9';

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
    height: 86%;
    display: flex;
    flex-direction: row;
    justify-items: center;
    align-items: center;

    .menu-body1 {
      // margin-right:3%;
      // width: 12rem;height:4rem;
      // margin-left: 3%;
      // font-size: 24px;
      // color: #a2b1db;
      // cursor: pointer;
      margin-right: 3%;
      width: 14%;
      height: 4rem;
      margin-left: 3%;
      font-size: 18px;
      font-family: Adobe Heiti Std R, Adobe Heiti Std R-R;
      font-weight: R;
      color: #49a3ff;
      cursor: pointer;
      display: flex;
      align-items: flex-end;
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
