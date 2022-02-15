<template>
  <div class="container-body">
    <!-- 动态组件及组件传参 -->
    <component
      ref="child"
      v-bind:is="currentDevComponent"
      :key="lsdkey"
    ></component>
  </div>
</template>

<script>
import DynamicExhibition from "../../DynamicExhibition/DynamicExhibition";
export default {
  name: 'AppMain',
  components: {
    DynamicExhibition
  },
  data() {
    return {
      lsdkey: (new Date()).toString(),
      currentDevComponent: 'dynamic-exhibition'
    }
  },
  computed: {
    key() {
      return this.$route.path;
    },
  }
}
</script>

<style>

</style>