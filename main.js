import Vue from 'vue'
import App from './App'


import tim from './commen/tim/tim.js'
import commen from './commen/commen.js'
import TIM from 'tim-js-sdk'
import store from './store/index.js'


Vue.config.productionTip = false
Vue.prototype.tim = tim.tim  			//tim sdk 引入后生成的tim服务
Vue.prototype.$TIM = TIM				//tim 的状态/事件 常量
Vue.prototype.$store = store
Vue.prototype.$commen = commen

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()


/* 

腾讯云IM 即时通讯云

SDKAppID：复制
1400354370
密钥：复制
4d4ca7c92cb7a15ee28e671a647617304e448be0fb3198bf70ef72a7c69f695d


 */