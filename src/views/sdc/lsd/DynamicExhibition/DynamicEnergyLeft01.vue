<template>
  <div style="width:100%;height:100%;display: flex;align-items: center;flex-direction: row;">
    <div style="width:50%;height:100%;display: flex;align-items: center;flex-direction: row;">
      <div class="itCount">
        <div style="height:55%;display: flex;align-items: flex-end;font-size:23px;font-weight:bold;color:#1BE1FB">542</div>
        <div style="height:10%;display: flex;align-items: center;font-size:11px;color:#ffffff">IT设备</div>
      </div>
      <div style="width:55%;height:100%;display: flex;flex-direction: column;">
        <div style="width:100%;height:35%;display: flex;flex-direction: row;">
          <div style="width:75%;height:100%;display: flex;align-items: flex-end;font-size:14px;font-weight:Regular;color:#ffffff;text-align:left">
            运行中
          </div>
          <div style="width:25%;height:100%;display: flex;align-items: flex-end;font-size:14px;font-weight:bold;color:#ffffff;text-align:center">
            {{ITInfo.running || 401}}
          </div>
        </div>
        <div style="width:100%;height:25%;display: flex;flex-direction: row;">
          <div style="width:75%;height:100%;display: flex;align-items: center;font-size:14px;font-weight:Regular;color:#ffffff;text-align:left">
            待机节能
          </div>
          <div style="width:25%;height:100%;display: flex;align-items: center;font-size:14px;font-weight:bold;color:#FDCA15;text-align:center">
            {{ITInfo.await || 51}}
          </div>
        </div>
        <div style="width:100%;height:35%;display: flex;flex-direction: row;">
          <div style="width:75%;height:100%;display: flex;align-items: flex-start;font-size:14px;font-weight:Regular;color:#ffffff;text-align:left">
            关闭
          </div>
          <div style="width:25%;height:100%;display: flex;align-items: flex-start;font-size:14px;font-weight:bold;color:#37F9B7;text-align:center">
            {{ITInfo.close || 305}}
          </div>
        </div>
      </div>
    </div>
    <div style="width:50%;height:100%;display: flex;align-items: center;flex-direction: row;">
      <div class="cloudCount">
        <div style="height:55%;display: flex;align-items: flex-end;font-size:23px;font-weight:bold;color:#FDCA15">542</div>
        <div style="height:10%;display: flex;align-items: center;font-size:11px;color:#ffffff">冷源设备</div>
      </div>
      <div style="width:55%;height:100%;display: flex;align-items: center;flex-direction: column;">
        <div style="width:100%;height:35%;display: flex;flex-direction: row;">
          <div style="width:75%;height:100%;display: flex;align-items: flex-end;font-size:14px;font-weight:Regular;color:#ffffff;text-align:left">
            运行中
          </div>
          <div style="width:25%;height:100%;display: flex;align-items: flex-end;font-size:14px;font-weight:bold;color:#ffffff;text-align:center">
            {{ITInfo.running || 401}}
          </div>
        </div>
        <div style="width:100%;height:25%;display: flex;flex-direction: row;">
          <div style="width:75%;height:100%;display: flex;align-items: center;font-size:14px;font-weight:Regular;color:#ffffff;text-align:left">
            待机节能
          </div>
          <div style="width:25%;height:100%;display: flex;align-items: center;font-size:14px;font-weight:bold;color:#FDCA15;text-align:center">
            {{ITInfo.await || 51}}
          </div>
        </div>
        <div style="width:100%;height:35%;display: flex;flex-direction: row;">
          <div style="width:75%;height:100%;display: flex;align-items: flex-start;font-size:14px;font-weight:Regular;color:#ffffff;text-align:left">
            关闭
          </div>
          <div style="width:25%;height:100%;display: flex;align-items: flex-start;font-size:14px;font-weight:bold;color:#37F9B7;text-align:center">
            {{ITInfo.close || 350}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts/lib/echarts"
import 'echarts-liquidfill'
import { getEnergyDeviceState } from "@/api/sdc/lsd";
export default {
  name: "EmgCount",
  data() {
    return {
        address: null,
        ITInfo: {},
        cloudInfo: {}
    };
  },
  mounted() {
    // this.address = this.siteId
    this.address = "cff1bf7b5dc745e2ac6f7e9afef531f7"
    this.queryPageData()
  },
  methods: {
    async queryPageData() {
      //设备运行状况
      getEnergyDeviceState({ siteId: this.address }).then((res) => {
        if (res.data.code === 0) {
          console.log(res);
          this.ITInfo = res.data.data.iTDevice
          this.cloudInfo = res.data.data.coodDevice
          
        }
      });
    },
    init() {
    }
  }
};
</script>

<style lang="scss" scoped>

.itCount {
  width:45%;
  height:100%;
  display: flex;
  align-items: center;
  flex-direction:column;
  background: url("../../../../../public/img/zhfx/it.png") center no-repeat;
  background-size: 100% auto;
  margin-left: 10px;
}

.cloudCount {
  width:45%;
  height:100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  background: url("../../../../../public/img/zhfx/cloud.png") center no-repeat;
  background-size: 100% auto;
}

</style>