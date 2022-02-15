<template>
  <section class="main" >
    <iframe id="iframe3D" ref="iframe3D" name="iframe3D" src="http://114.242.26.182:21001/" style="width:100%;height:100%;" frameborder="0"></iframe>
      <div id="tempBg" class="main" style="position: absolute;">1</div>
      <div class="main-left" style="position: absolute;height: 87%">
        <ParkProfile class="component-off"></ParkProfile>
        <DevieProfile class="component-off"></DevieProfile>
        <ParkingAnalysis class="component-off"></ParkingAnalysis>
        <EmgCount class="component-off"></EmgCount>
      </div>
      <div class="main-middle"  style="position: absolute;margin-left: 19%;height: 25%;margin-top: 34%;">
          <!--   <div class="content-up">
              <DisplayOf3D class="component-off"></DisplayOf3D> 
              
            </div>  -->
            <div class="content-down">
              <EmgList></EmgList>
            </div>
          </div>
      <div class="main-right"  style="position: absolute;margin-left: 78%;height: 87%">
            <Environment class="component-off"></Environment>
            <DeviceTypeAnalysis class="component-off"></DeviceTypeAnalysis>
            <EnergyCosume class="component-off"></EnergyCosume>
            <EnergyTrend></EnergyTrend>
      </div>
  </section>
</template>

<script>
import ParkProfile from "./ParkProfile";
import DevieProfile from "./DeviceProfile";
import DeviceTypeAnalysis from "./DeviceTypeAnalysis";
import ParkingAnalysis from "./ParkingAnalysis";
import EmgCount from "./EmgCount";
import EmgList from "./EmgList";
import Environment from "./Environment";
import EnergyCosume from "./EnergyCosume";
import DisplayOf3D from "./DisplayOf3D";
import EnergyTrend from "./EnergyTrend";

export default {
  name: "DynamicExhibition",
  components: {
    ParkProfile,
    DevieProfile,
    DeviceTypeAnalysis,
    ParkingAnalysis,
    EmgCount,
    EmgList,
    Environment,
    EnergyCosume,
    DisplayOf3D,
    EnergyTrend
  },
  data() {
    return {
      iframe3D:null
    }
  },
  mounted(){
    this.iframe3D = this.$refs['iframe3D'].contentWindow;
    //window.addEventListener('message', this.init3DListener)
    let tokenForm = sessionStorage.getItem('dcplat-access_token')
    let token = JSON.parse(tokenForm)
    setTimeout(() => {
        this.iframe3D.postMessage(
        {
          type:'token',
          data:token.content,
          isAdd:false
        },'*')
        //园区动态背景五秒后加载，为避免黑色空白，做次操作
        setTimeout(() => {
            $("#tempBg").remove();
        }, 5000)
    }, 5000)
    
  },
  beforeDestroy(){
    //window.removeEventListener('message',this.init3DListener)
  }
}
</script>

<style>

</style>
