import 'babel-polyfill'
import 'classlist-polyfill'
import Vue from 'vue'
import axios from './router/axios'
import VueAxios from 'vue-axios'
import App from './App'
import './permission' // 权限
import './error' // 日志
import router from './router/router'
import store from './store'
import { loadStyle } from './util/util'
import * as urls from '@/config/env'
import { iconfontUrl, iconfontVersion } from '@/config/env'
import * as filters from './filters' // 全局filter
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/common.scss'
import avueFormDesign from 'avue-plugin-formdesign'
import basicContainer from './components/basic-container/main'
import Treetable from 'jeeplus-treetable'

import dictUtils from '@/util/dictUtils'
import './directive'
import lodash from 'lodash/object'
import utils from '@/utils/index'
import request from '@/router/axios'
import moment from "moment";
import echarts from 'echarts'
import vcolorpicker from "vcolorpicker";
import validatorxps from '@/utils/validator'
import * as d3 from "d3";
import fullscreen from 'vue-fullscreen'
import directive from '@/util/dialogDrag'

Vue.prototype.$dictUtils = dictUtils
Vue.prototype.$moment = moment
Vue.prototype.$utils = utils
Vue.prototype.lodash = lodash
Vue.prototype.recover = utils.recover
Vue.prototype.recoverNotNull = utils.recoverNotNull
Vue.prototype.request = request // ajax请求方法
Vue.prototype.$echarts = echarts
Vue.prototype.$d3 = d3
Vue.prototype.validatorxps = validatorxps

// 插件 json 展示
Vue.use(router)

Vue.use(avueFormDesign);

Vue.use(VueAxios, axios)

Vue.use(vcolorpicker)
Vue.use(ElementUI, {
  size: 'medium',
  menuType: 'text'
})

Vue.use(window.AVUE, {
  size: 'medium',
  menuType: 'text'
})
Vue.use(fullscreen)
Vue.use(directive)
// 注册全局容器
Vue.component('basicContainer', basicContainer)

// 加载相关url地址
Object.keys(urls).forEach(key => {
  Vue.prototype[key] = urls[key]
})

// 加载过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 动态加载阿里云字体库
iconfontVersion.forEach(ele => {
  loadStyle(iconfontUrl.replace('$key', ele))
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

Vue.use(Treetable)
