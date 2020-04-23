<template>
	<view>



		<view class="cu-chat" id="chatlist" ref="messagesContainer">
			<view class="cu-item" :class="item.flow=='out'?'self':''" v-for="(item,index) in msgList" :key="index" :id="item.ID">
				<block v-if="item.flow=='out'">
					<view class="main">
						<view class="content bg-green shadow" v-if="item.payload.text.indexOf('f_d_1_text') >= 0">
							<text>{{ParsingText(item.payload.text)}}</text>
						</view>
						 
						 
						
						<view class="content bg-green shadow voice-button" v-else-if="item.payload.text.indexOf('f_d_2_voice') >= 0" @click="playVoice(item.payload.text,item.ID)">
							<text :style="'margin-left: '+ (ParsingVoice(item.payload.text) <= 10 ? (ParsingVoice(item.payload.text)*5) : (10*5 + (ParsingVoice(item.payload.text)-10)*2)) +'px;'">{{ParsingVoice(item.payload.text)}}"</text>
							<image src="../../static/images/voice-left.png" class="content-voice" mode="widthFix" :class="ComputedClassContentVoice(item.ID)"></image>
						</view>
						
						
						<view class="content bg-green shadow" v-else>
							<text>{{ParsingText(item.payload.text)}}</text>
						</view>
						
					</view>
					<view class="cu-avatar round" :style="'background-image:url('+userInfo.img+');'"></view>
					<view class="date">{{timeFliter(item.time)}}</view>
				</block>


				<block class="" v-else>
					<view class="cu-avatar radius" :style="'background-image:url('+toUserInfo.img+');'"></view>
					<view class="main">
						
						<view class="content shadow" v-if="item.payload.text.indexOf('f_d_1_text') >= 0">
							<text>{{ParsingText(item.payload.text)}}</text>
						</view>
						
						<view class="content shadow voice-button" v-else-if="item.payload.text.indexOf('f_d_2_voice') >= 0" @click="playVoice(item.payload.text,item.ID)">
							<image src="../../static/images/voice-right.png" class="content-voice" mode="widthFix" :class="ComputedClassContentVoice(item.ID)"></image>
							<text :style="'margin-right: '+ (ParsingVoice(item.payload.text) <= 10 ? (ParsingVoice(item.payload.text)*5) : (10*5 + (ParsingVoice(item.payload.text)-10)*2)) +'px;'">{{ParsingVoice(item.payload.text)}}"</text>
						</view>
						
						<view class="content shadow" v-else>
							<text>{{ParsingText(item.payload.text)}}</text>
						</view>
						
					</view>
					<view class="date ">{{timeFliter(item.time)}}</view>
				</block>

			</view>


		</view>

		<view class="cu-bar foot input input-box" v-bind:class="popupLayerClass" @touchmove.stop.prevent="discard" v-if="!isVoice">
			<view class="action">
				<text class="text-grey" :class="isVoice?'cuIcon-keyboard':'cuIcon-sound'" @tap="switchVoice"></text>
			</view>
			
			<view class="textarea-box">
				<textarea :fixed="true" maxlength="1000" :disable-default-padding="true" :auto-height="true" class="" v-model="textMsg" @focus="textareaFocus" />
				 
			</view>
			
			 
			 <view class="sendButton">
			 	<button class="cu-btn bg-green shadow" @tap="sendText">发送</button>
			 </view>
			
			<!-- <input auto-height="true" class="solid-bottom" maxlength="300" v-model="textMsg" @focus="textareaFocus"></input> -->
			<!-- <view class="action">
				<text class="cuIcon-emojifill text-grey"></text>
			</view> -->
			
			

		</view>

		<view class="cu-bar foot input input-box" v-bind:class="popupLayerClass" @touchmove.stop.prevent="discard" v-else>
			<view class="action">
				<text class="text-grey" :class="isVoice?'cuIcon-keyboard':'cuIcon-sound'" @tap="switchVoice"></text>
			</view>

			<view class="textbox">
				<view class="voice-mode" :class="[isVoice?'':'hidden',recording?'recording':'']" @touchstart="voiceBegin"
				 @touchmove.stop.prevent="voiceIng" @touchend="voiceEnd" @touchcancel="voiceCancel">{{voiceTis}}</view>

			</view>
 

		</view>

		<!-- 录音UI效果 -->
		<view class="record" :class="recording?'':'hidden'">
			<view class="ing" :class="willStop?'hidden':''">
				<view class="icon luyin2"></view>
			</view>
			<view class="cancel" :class="willStop?'':'hidden'">
				<view class="icon chehui"></view>
			</view>
			<view class="tis" :class="willStop?'change':''">{{recordTis}}</view>
		</view>



	</view>



</template>
<script>
	import userList from '../../commen/tim/user.js'
	import {
		mapState
	} from "vuex";
	var fs = require('fs');
	var COS = require('cos-wx-sdk-v5');
	export default {
		data() {
			return {
				//TIM变量
				conversationActive: null,
				toUserId: '',
				toUserInfo: null,
				userInfo: null,
				nextReqMessageID: '',
				count: 15,
				isCompleted: '',
				msgList: [],
				TIM: null,
				playVoiceAnimationIndex:'',
				onPlay:false,
				//文字消息
				textMsg: '',
				//消息列表
				isHistoryLoading: false,
				scrollAnimation: false,
				scrollTop: 0,
				scrollToView: '',

				msgImgList: [],
				myuid: 0,

				//录音相关参数
				// #ifndef H5
				//H5不能录音
				RECORDER: uni.getRecorderManager(),
				// #endif
				innerAudioContext: uni.createInnerAudioContext(),
				isVoice: false,
				voiceTis: '按住 说话',
				recordTis: "手指上滑 取消发送",
				recording: false,
				willStop: false,
				initPoint: {
					identifier: 0,
					Y: 0
				},
				recordTimer: null,
				recordLength: 0,

				
				playMsgid: null,
				VoiceTimer: null,
				// 抽屉参数
				popupLayerClass: '',
				// more参数
				hideMore: true,
				//表情定义
				hideEmoji: true,
				emojiList: this.$commen.emojiList,
				//表情图片图床名称 ，由于我上传的第三方图床名称会有改变，所以有此数据来做对应，您实际应用中应该不需要
				onlineEmoji: {
					"100.gif": "AbNQgA.gif",
					"101.gif": "AbN3ut.gif",
					"102.gif": "AbNM3d.gif",
					"103.gif": "AbN8DP.gif",
					"104.gif": "AbNljI.gif",
					"105.gif": "AbNtUS.gif",
					"106.gif": "AbNGHf.gif",
					"107.gif": "AbNYE8.gif",
					"108.gif": "AbNaCQ.gif",
					"109.gif": "AbNN4g.gif",
					"110.gif": "AbN0vn.gif",
					"111.gif": "AbNd3j.gif",
					"112.gif": "AbNsbV.gif",
					"113.gif": "AbNwgs.gif",
					"114.gif": "AbNrD0.gif",
					"115.gif": "AbNDuq.gif",
					"116.gif": "AbNg5F.gif",
					"117.gif": "AbN6ET.gif",
					"118.gif": "AbNcUU.gif",
					"119.gif": "AbNRC4.gif",
					"120.gif": "AbNhvR.gif",
					"121.gif": "AbNf29.gif",
					"122.gif": "AbNW8J.gif",
					"123.gif": "AbNob6.gif",
					"124.gif": "AbN5K1.gif",
					"125.gif": "AbNHUO.gif",
					"126.gif": "AbNIDx.gif",
					"127.gif": "AbN7VK.gif",
					"128.gif": "AbNb5D.gif",
					"129.gif": "AbNX2d.gif",
					"130.gif": "AbNLPe.gif",
					"131.gif": "AbNjxA.gif",
					"132.gif": "AbNO8H.gif",
					"133.gif": "AbNxKI.gif",
					"134.gif": "AbNzrt.gif",
					"135.gif": "AbU9Vf.gif",
					"136.gif": "AbUSqP.gif",
					"137.gif": "AbUCa8.gif",
					"138.gif": "AbUkGQ.gif",
					"139.gif": "AbUFPg.gif",
					"140.gif": "AbUPIS.gif",
					"141.gif": "AbUZMn.gif",
					"142.gif": "AbUExs.gif",
					"143.gif": "AbUA2j.gif",
					"144.gif": "AbUMIU.gif",
					"145.gif": "AbUerq.gif",
					"146.gif": "AbUKaT.gif",
					"147.gif": "AbUmq0.gif",
					"148.gif": "AbUuZV.gif",
					"149.gif": "AbUliF.gif",
					"150.gif": "AbU1G4.gif",
					"151.gif": "AbU8z9.gif",
					"152.gif": "AbU3RJ.gif",
					"153.gif": "AbUYs1.gif",
					"154.gif": "AbUJMR.gif",
					"155.gif": "AbUadK.gif",
					"156.gif": "AbUtqx.gif",
					"157.gif": "AbUUZ6.gif",
					"158.gif": "AbUBJe.gif",
					"159.gif": "AbUdIO.gif",
					"160.gif": "AbU0iD.gif",
					"161.gif": "AbUrzd.gif",
					"162.gif": "AbUDRH.gif",
					"163.gif": "AbUyQA.gif",
					"164.gif": "AbUWo8.gif",
					"165.gif": "AbU6sI.gif",
					"166.gif": "AbU2eP.gif",
					"167.gif": "AbUcLt.gif",
					"168.gif": "AbU4Jg.gif",
					"169.gif": "AbURdf.gif",
					"170.gif": "AbUhFS.gif",
					"171.gif": "AbU5WQ.gif",
					"172.gif": "AbULwV.gif",
					"173.gif": "AbUIzj.gif",
					"174.gif": "AbUTQs.gif",
					"175.gif": "AbU7yn.gif",
					"176.gif": "AbUqe0.gif",
					"177.gif": "AbUHLq.gif",
					"178.gif": "AbUOoT.gif",
					"179.gif": "AbUvYF.gif",
					"180.gif": "AbUjFU.gif",
					"181.gif": "AbaSSJ.gif",
					"182.gif": "AbUxW4.gif",
					"183.gif": "AbaCO1.gif",
					"184.gif": "Abapl9.gif",
					"185.gif": "Aba9yR.gif",
					"186.gif": "AbaFw6.gif",
					"187.gif": "Abaiex.gif",
					"188.gif": "AbakTK.gif",
					"189.gif": "AbaZfe.png",
					"190.gif": "AbaEFO.gif",
					"191.gif": "AbaVYD.gif",
					"192.gif": "AbamSH.gif",
					"193.gif": "AbaKOI.gif",
					"194.gif": "Abanld.gif",
					"195.gif": "Abau6A.gif",
					"196.gif": "AbaQmt.gif",
					"197.gif": "Abal0P.gif",
					"198.gif": "AbatpQ.gif",
					"199.gif": "Aba1Tf.gif",
					"200.png": "Aba8k8.png",
					"201.png": "AbaGtS.png",
					"202.png": "AbaJfg.png",
					"203.png": "AbaNlj.png",
					"204.png": "Abawmq.png",
					"205.png": "AbaU6s.png",
					"206.png": "AbaaXn.png",
					"207.png": "Aba000.png",
					"208.png": "AbarkT.png",
					"209.png": "AbastU.png",
					"210.png": "AbaB7V.png",
					"211.png": "Abafn1.png",
					"212.png": "Abacp4.png",
					"213.png": "AbayhF.png",
					"214.png": "Abag1J.png",
					"215.png": "Aba2c9.png",
					"216.png": "AbaRXR.png",
					"217.png": "Aba476.png",
					"218.png": "Abah0x.png",
					"219.png": "Abdg58.png"
				},
				//红包相关参数
				windowsState: '',
				redenvelopeData: {
					rid: null, //红包ID
					from: null,
					face: null,
					blessing: null,
					money: null
				}
			};
		},
		computed: {
			...mapState({
				currentMessageList: state => state.currentMessageList,
			}),
			ComputedClassContentVoice() {
				return function(index) {
					return this.playVoiceAnimationIndex == index ? 'onplay' : ''
				}
			}
			
		},
		mounted() {

		},
		watch: {
			currentMessageList(newVal, oldVal) {

				this.msgList = newVal
				this.screenMsg(newVal, oldVal)
			},
		},
		onLoad(option) {


			this.userInfo = JSON.parse(uni.getStorageSync('userInfo'))
			this.toUserId = this.$store.state.toUserId
			this.conversationActive = this.$store.state.conversationActive
			this.TIM = this.$TIM
			//获取聊天对象的用户信息
			userList.forEach(item => {
				if (this.toUserId == item.userId) {
					this.toUserInfo = item
				}
			})
			this.getMsgList();
			 
			// #ifndef H5
			//录音开始事件
			this.RECORDER.onStart((e) => {
				this.recordBegin(e);
			})
			//录音结束事件
			this.RECORDER.onStop((e) => {
				this.recordEnd(e);
			})
			// #endif
		},
		onShow() {
			this.scrollTop = 9999999;
		},
		onUnload() {
			//退出页面 将所有的会话内的消息设置为已读
			let promise = this.tim.setMessageRead({
				conversationID: this.conversationActive.conversationID
			});
			promise.then(function(imResponse) {
				console.log('全部已读')
				// 已读上报成功
			}).catch(function(imError) {
				// 已读上报失败
				console.warn('setMessageRead error:', imError);
			});
		},
		methods: {
			
			ParsingText:function(text){
				try{
					let Json = JSON.parse(text);
					let content = Json.content;
					 
				 
					return content;
					
				}catch(err){
					console.log(err)
					return "";
				}
			},
			//播放
			playVoice:function(value,id){
				this.playVoiceAnimationIndex = "";
				 
				try{
					var that = this;
					let Json = JSON.parse(value);
					let mp3Url = Json.content;
					
					if(that.onPlay && that.innerAudioContext.src == mp3Url){
						that.innerAudioContext.stop();
						that.onPlay = false;
						that.playVoiceAnimationIndex = "";
					}else{
						 
						that.innerAudioContext.src = mp3Url;
						that.innerAudioContext.play();
						that.innerAudioContext.onPlay(() => {
							console.log('开始播放');
							that.onPlay = true;
							that.playVoiceAnimationIndex = id;
						});
						that.innerAudioContext.onEnded(() => {
							console.log('自然播放结束');
							that.onPlay = false;
							that.playVoiceAnimationIndex = "";
						});
						 
						that.innerAudioContext.onError((res) => {
						  console.log(res.errMsg);
						  console.log(res.errCode);
						  that.onPlay = false;
						  that.playVoiceAnimationIndex = "";
						});
					}
					
					 
					
					 
				}catch(err){
					console.log(err)
					that.onPlay = false;
					that.playVoiceAnimationIndex = "";
				}
				
				
			},
			//解析音频
			
			ParsingVoice:function(value){
				
				try{
					let Json = JSON.parse(value);
					let mp3Url = Json.content;
					 
				/* 	this.innerAudioContext.src = mp3Url;
					console.log(this.innerAudioContext.duration) */
					return Json.duration/1000;
					
				}catch(err){
					console.log(err)
					return "";
				}
			},
			//音频上传发送

			uploadAndSendAudioMsg: function(params) {

				var cos = new COS({
					SecretId: '你自己的',
					SecretKey: '你自己的'
				});
				/* duration:this.recordLength*1000,
				tempFilePath:e.tempFilePath, */
				let filePath = params.tempFilePath;
				var that = this;
				cos.postObject({
					Bucket: 'test-familydoctor-1301909872',
					Region: 'ap-chengdu',
					Key: Number(Math.random().toString().substr(3, 13) + Date.now()).toString(36) + ".mp3",
					FilePath: filePath,
					FileSize: params.fileSize,
				}, function(err, data) {
					console.log(1111111111111111111111);
					console.log(err || data);
					if (data.statusCode == 200) {

						let content = {
							type: 'f_d_2_voice',
							content: data.Location,
							duration:params.duration
						};

						let message = that.tim.createTextMessage({
							to: that.toUserId,
							conversationType: 'C2C',
							payload: {
								text: JSON.stringify(content)
							}
						});
						that.$store.commit('pushCurrentMessageList', message)
						let pomise = that.tim.sendMessage(message)
						pomise.then(res => {
							uni.pageScrollTo({
								scrollTop: 9999,
								duration: 0
							});
						})

						console.log(data.Location);
					}
				});

				/* uni.getFileInfo({
					filePath:filePath,
					success: function (file) {
						 
					    cos.postObject({
					     	Bucket: 'test-familydoctor-1301909872',
					     	Region: 'ap-chengdu',
					     	Key: Number(Math.random().toString().substr(3,length) + Date.now()).toString(36) + ".aac",
					     	FilePath: filePath,
					    },	function (err, data) {
								console.log(1111111111111111111111);
								console.log(err || data);
								if(data.statusCode == 200){
									console.log(data.Location);
								}
						});
						 
					}
				}) */

			},



			//聊天的节点加上外层的div
			nodesFliter(str) {
				let nodeStr = '<div style="align-items: center;word-wrap:break-word;">' + str + '</div>'
				return nodeStr
			},
			//时间过滤
			timeFliter(timer) {
				let timeData = new Date(timer * 1000)
				let str = this.$commen.dateTimeFliter(timeData)
				return str
			},
			// 接受消息(定位消息)
			screenMsg(newVal, oldVal) {


				this.$nextTick(() => {
					uni.pageScrollTo({
						scrollTop: 99999,
						duration: 0
					});
				});
				/* this.$nextTick(()=> {this.scrollToView =newVal[newVal.length-1].ID});
				this.$forceUpdate() */
				/* try{
					if(newVal[0].ID && oldVal[0].ID){
						if(newVal[0].ID != oldVal[0].ID && newVal.length>=this.count ){
							this.$nextTick(()=> {this.scrollToView =oldVal[0].ID});
						}else{
							this.$nextTick(()=> {this.scrollToView =newVal[newVal.length-1].ID});
						}
					}else{
						this.$nextTick(()=> {this.scrollToView =newVal[newVal.length-1].ID});
					}
				}catch(e){
					
				} */

			},
			//触发滑动到顶部(加载历史信息记录)
			loadHistory(e) {
				// 更多消息列表
				let conversationID = this.conversationActive.conversationID
				let promise = this.tim.getMessageList({
					conversationID: conversationID,
					nextReqMessageID: this.nextReqMessageID,
					count: this.count
				});
				promise.then((res) => {
					this.$store.commit('unshiftCurrentMessageList', res.data.messageList)
					this.nextReqMessageID = res.data.nextReqMessageID // 用于续拉，分页续拉时需传入该字段。
					this.isCompleted = res.data.isCompleted

				});
				//这段代码很重要，不然每次加载历史数据都会跳到顶部
				this.$nextTick(function() {
					this.scrollToView = this.nextReqMessageID; //跳转上次的第一行信息位置
					this.$nextTick(function() {
						this.scrollAnimation = true; //恢复滚动动画
					});

				});
				this.isHistoryLoading = false;
			},
			// 加载初始页面消息
			getMsgList() {
				// 历史消息列表
				let conversationID = this.conversationActive.conversationID
				let promise = this.tim.getMessageList({
					conversationID: conversationID,
					count: this.count
				});
				promise.then((res) => {

					this.$store.commit('pushCurrentMessageList', res.data.messageList)
					this.nextReqMessageID = res.data.nextReqMessageID // 用于续拉，分页续拉时需传入该字段。
					this.isCompleted = res.data.isCompleted
					this.scrollToView = res.data.messageList[res.data.messageList.length - 1].ID

				});
				this.$nextTick(() => {
					uni.pageScrollTo({
						scrollTop: 99999,
						duration: 0
					});
				});
			},
			//处理图片尺寸，如果不处理宽高，新进入页面加载图片时候会闪
			setPicSize(content) {
				// 让图片最长边等于设置的最大长度，短边等比例缩小，图片控件真实改变，区别于aspectFit方式。
				let maxW = uni.upx2px(350); //350是定义消息图片最大宽度
				let maxH = uni.upx2px(350); //350是定义消息图片最大高度
				if (content.w > maxW || content.h > maxH) {
					let scale = content.w / content.h;
					content.w = scale > 1 ? maxW : maxH * scale;
					content.h = scale > 1 ? maxW / scale : maxH;
				}
				return content;
			},
			//更多功能(点击+弹出) 
			showMore() {
				this.isVoice = false;
				this.hideEmoji = true;
				if (this.hideMore) {
					this.hideMore = false;
					this.openDrawer();
				} else {
					this.hideDrawer();
				}
			},
			// 打开抽屉
			openDrawer() {
				this.popupLayerClass = 'showLayer';
			},
			// 隐藏抽屉
			hideDrawer() {
				this.popupLayerClass = '';
				setTimeout(() => {
					this.hideMore = true;
					this.hideEmoji = true;
				}, 150);
			},
			// 选择图片发送
			chooseImage() {
				this.getImage('album');
			},
			//拍照发送
			camera() {
				this.getImage('camera');
			},
			//发红包
			handRedEnvelopes() {
				uni.navigateTo({
					url: 'HM-hand/HM-hand'
				});
				this.hideDrawer();
			},
			//选照片 or 拍照
			getImage(type) {
				this.hideDrawer();
				uni.chooseImage({
					sourceType: [type],
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					success: (res) => {
						for (let i = 0; i < res.tempFilePaths.length; i++) {
							uni.getImageInfo({
								src: res.tempFilePaths[i],
								success: (image) => {
									console.log(image.width);
									console.log(image.height);
									let msg = {
										url: res.tempFilePaths[i],
										w: image.width,
										h: image.height
									};
									this.sendMsg(msg, 'img');
								}
							});
						}
					}
				});
			},
			// 选择表情
			chooseEmoji() {
				this.hideMore = true;
				if (this.hideEmoji) {
					this.hideEmoji = false;
					this.openDrawer();
				} else {
					this.hideDrawer();
				}
			},
			//添加表情
			addEmoji(em) {
				this.textMsg += em.alt;
			},

			//获取焦点，如果不是选表情ing,则关闭抽屉
			textareaFocus() {
				if (this.popupLayerClass == 'showLayer' && this.hideMore == false) {
					this.hideDrawer();
				}

			},
			// 发送文字消息
			sendText() {
				this.hideDrawer(); //隐藏抽屉
				if (!this.textMsg) {
					return;
				}
				let content = this.replaceEmoji(this.textMsg);
				let msg = {
					text: content
				}
				this.sendMsg(msg, 'text');
				this.textMsg = ''; //清空输入框
			},
			//替换表情符号为图片
			replaceEmoji(str) {
				let replacedStr = str.replace(/\[([^(\]|\[)]*)\]/g, (item, index) => {
					console.log("item: " + item);
					for (let i = 0; i < this.emojiList.length; i++) {
						let row = this.emojiList[i];
						for (let j = 0; j < row.length; j++) {
							let EM = row[j];
							if (EM.alt == item) {
								//在线表情路径，图文混排必须使用网络路径，请上传一份表情到你的服务器后再替换此路径 
								//比如你上传服务器后，你的100.gif路径为https://www.xxx.com/emoji/100.gif 则替换onlinePath填写为https://www.xxx.com/emoji/
								let onlinePath = 'https://s2.ax1x.com/2019/04/12/'
								let imgstr = '<img src="' + onlinePath + this.onlineEmoji[EM.url] + '">';
								console.log("imgstr: " + imgstr);
								return imgstr;
							}
						}
					}
				});
				return replacedStr;
			},

			// 发送消息
			sendMsg(content, type, v = null) {
				if (type == "voice") {
					this.uploadAndSendAudioMsg(content);
				} else {
					let msg = {
						type: 'f_d_1_text',
						content: content.text,
					};
					let message = this.tim.createTextMessage({
						to: this.toUserId,
						conversationType: 'C2C',
						payload: {
							text: JSON.stringify(msg)
						}
					});
					this.$store.commit('pushCurrentMessageList', message)
					let pomise = this.tim.sendMessage(message)
					pomise.then(res => {
						uni.pageScrollTo({
							scrollTop: 9999,
							duration: 0
						});
					})
				}

			},

			// 添加文字消息到列表
			addTextMsg(msg) {
				this.msgList.push(msg);
			},
			// 添加语音消息到列表
			addVoiceMsg(msg) {
				this.msgList.push(msg);
			},
			// 添加图片消息到列表
			addImgMsg(msg) {
				msg.msg.content = this.setPicSize(msg.msg.content);
				this.msgImgList.push(msg.msg.content.url);
				this.msgList.push(msg);
			},
			addRedEnvelopeMsg(msg) {
				this.msgList.push(msg);
			},
			// 添加系统文字消息到列表
			addSystemTextMsg(msg) {
				this.msgList.push(msg);
			},
			// 添加系统红包消息到列表
			addSystemRedEnvelopeMsg(msg) {
				this.msgList.push(msg);
			},
			// 打开红包
			openRedEnvelope(msg, index) {
				let rid = msg.content.rid;
				uni.showLoading({
					title: '加载中...'
				});
				console.log("index: " + index);
				//模拟请求服务器效果
				setTimeout(() => {
					//加载数据
					if (rid == 0) {
						this.redenvelopeData = {
							rid: 0, //红包ID
							from: "大黑哥",
							face: "/static/img/im/face/face.jpg",
							blessing: "恭喜发财，大吉大利",
							money: "已领完"
						}
					} else {
						this.redenvelopeData = {
							rid: 1, //红包ID
							from: "售后客服008",
							face: "/static/img/im/face/face_2.jpg",
							blessing: "恭喜发财",
							money: "0.01"
						}
						if (!msg.content.isReceived) {
							// {type:"system",msg:{id:8,type:"redEnvelope",content:{text:"你领取了售后客服008的红包"}}},
							this.sendSystemMsg({
								text: "你领取了" + (msg.userinfo.uid == this.myuid ? "自己" : msg.userinfo.username) + "的红包"
							}, 'redEnvelope');
							console.log("this.msgList[index]: " + JSON.stringify(this.msgList[index]));
							this.msgList[index].msg.content.isReceived = true;
						}
					}
					uni.hideLoading();
					this.windowsState = 'show';

				}, 200)
			},

			// 关闭红包弹窗
			closeRedEnvelope() {
				this.windowsState = 'hide';
				setTimeout(() => {
					this.windowsState = '';
				}, 200)
			},
			sendSystemMsg(content, type) {
				let lastid = this.msgList[this.msgList.length - 1].msg.id;
				lastid++;
				let row = {
					type: "system",
					msg: {
						id: lastid,
						type: type,
						content: content
					}
				};
				this.screenMsg(row)
			},
			//领取详情
			toDetails(rid) {
				uni.navigateTo({
					url: 'HM-details/HM-details?rid=' + rid
				})
			},
			// 预览图片
			showPic(msg) {
				uni.previewImage({
					indicator: "none",
					current: msg.content.url,
					urls: this.msgImgList
				});
			},
			// 播放语音
			/* playVoice(msg) {
				this.playMsgid = msg.id;
				this.AUDIO.src = msg.content.url;
				this.$nextTick(function() {
					this.AUDIO.play();
				});
			}, */
			// 录音开始
			voiceBegin(e) {
				if (e.touches.length > 1) {
					return;
				}
				this.initPoint.Y = e.touches[0].clientY;
				this.initPoint.identifier = e.touches[0].identifier;
				this.RECORDER.start({
					format: "mp3"
				}); //录音开始,
			},
			//录音开始UI效果
			recordBegin(e) {



				this.recording = true;
				this.voiceTis = '松开 结束';
				this.recordLength = 0;
				this.recordTimer = setInterval(() => {
					this.recordLength++;

				}, 1000)
			},
			// 录音被打断
			voiceCancel() {
				uni.hideLoading();

				this.recording = false;
				this.voiceTis = '按住 说话';
				this.recordTis = '手指上滑 取消发送'
				this.willStop = true; //不发送录音
				this.RECORDER.stop(); //录音结束
			},
			// 录音中(判断是否触发上滑取消发送)
			voiceIng(e) {
				if (!this.recording) {
					return;
				}
				let touche = e.touches[0];
				//上滑一个导航栏的高度触发上滑取消发送
				if (this.initPoint.Y - touche.clientY >= uni.upx2px(100)) {
					this.willStop = true;
					this.recordTis = '松开手指 取消发送'
				} else {
					this.willStop = false;
					this.recordTis = '手指上滑 取消发送'
				}
			},
			// 结束录音
			voiceEnd(e) {
				if (!this.recording) {
					return;
				}
				uni.hideLoading();
				this.recording = false;
				this.voiceTis = '按住 说话';
				this.recordTis = '手指上滑 取消发送'
				this.RECORDER.stop(); //录音结束
			},
			//录音结束(回调文件)
			recordEnd(e) {
				clearInterval(this.recordTimer);

				if (!this.willStop) {


					var that = this;
					uni.getFileInfo({
						filePath: e.tempFilePath,
						success: function(file) {
							let msg = {
								length: "0",
								duration: that.recordLength * 1000,
								tempFilePath: e.tempFilePath,
								fileSize: file.size
							}
							let min = parseInt(that.recordLength / 60);
							let sec = that.recordLength % 60;
							min = min < 10 ? '0' + min : min;
							sec = sec < 10 ? '0' + sec : sec;
							//msg.length = min+':'+sec;
							//const innerAudioContext = uni.createInnerAudioContext();
							//innerAudioContext.src = e.tempFilePath;
							//innerAudioContext.play();
							that.sendMsg(msg, 'voice');
						}
					})



				} else {
					console.log('取消发送录音', e);
				}
				this.willStop = false;
			},
			// 切换语音/文字输入
			switchVoice() {
				this.hideDrawer();
				this.isVoice = this.isVoice ? false : true;
			},
			discard() {
				return;
			}
		}
	}
</script>
<style lang="scss">
	/* @import "@/static/HM-chat/css/style.scss"; */
	@import "./main.css";
	@import "./icon.css";

	page {
		padding-bottom: 100rpx;
	}
	text{
		
		word-break: break-all;
	}
	textarea{
		max-width:100%;
		max-height: 400rpx;
		 
		word-break: break-all;
	}
	.uni-textarea-textarea{
		overflow-y: scroll !important;
	}
	.hidden {
		display: none !important;
	}

	.cu-bar.foot {
		transition: all .15s linear;
		display: flex;
		background-color: #f8f8f8;
	}

	.showLayer {
		transform: translate3d(0, -42vw, 0);
	}

	.textbox {
		width: 100%;
		min-height: 70rpx;
		
		flex: 1;
	}

	.textbox .voice-mode {
		width: calc(100% - 2rpx);
		height: 68rpx;
		border-radius: 70rpx;
		border: solid 1rpx #cdcdcd;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		background-color: #fff;
		color: #555;

		&.recording {
			background-color: #e5e5e5;
		}
	}


	.record {
		width: 40vw;
		height: 40vw;
		position: fixed;
		top: 55%;
		left: 30%;
		background-color: rgba(0, 0, 0, .6);
		border-radius: 20upx;

		.ing {
			width: 100%;
			height: 30vw;
			display: flex;
			justify-content: center;
			align-items: center;

			// 模拟录音音效动画
			@keyframes volatility {
				0% {
					background-position: 0% 130%;
				}

				20% {
					background-position: 0% 150%;
				}

				30% {
					background-position: 0% 155%;
				}

				40% {
					background-position: 0% 150%;
				}

				50% {
					background-position: 0% 145%;
				}

				70% {
					background-position: 0% 150%;
				}

				80% {
					background-position: 0% 155%;
				}

				90% {
					background-position: 0% 140%;
				}

				100% {
					background-position: 0% 135%;
				}
			}

			.icon {
				background-image: linear-gradient(to bottom, #f09b37, #fff 50%);
				background-size: 100% 200%;
				animation: volatility 1.5s ease-in-out -1.5s infinite alternate;
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
				font-size: 150upx;
				color: #f09b37;
			}
		}

		.cancel {
			width: 100%;
			height: 30vw;
			display: flex;
			justify-content: center;
			align-items: center;

			.icon {
				color: #fff;
				font-size: 150upx;
			}
		}

		.tis {
			width: 100%;
			height: 10vw;
			display: flex;
			justify-content: center;
			font-size: 28upx;
			color: #fff;

			&.change {
				color: #f09b37;
			}
		}
	}

	@font-face {
		font-family: "HMfont-home";
		src: url('data:application/x-font-woff2;charset=utf-8;base64,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') format('woff2');
	}

	.icon {
		font-family: "HMfont-home" !important;
		font-size: 56upx;
		font-style: normal;
		color: #333;

		&.biaoqing:before {
			content: "\e797";
		}

		&.jianpan:before {
			content: "\e7b2";
		}

		&.yuyin:before {
			content: "\e805";
		}

		&.tupian:before {
			content: "\e639";
		}

		&.chehui:before {
			content: "\e904";
		}

		&.luyin:before {
			content: "\e905";
		}

		&.luyin2:before {
			content: "\e677";
		}

		&.other-voice:before {
			content: "\e667";
		}

		&.my-voice:before {
			content: "\e906";
		}

		&.hongbao:before {
			content: "\e626";
		}

		&.tupian2:before {
			content: "\e674";
		}

		&.paizhao:before {
			content: "\e63e";
		}

		&.add:before {
			content: "\e655";
		}

		&.close:before {
			content: "\e607";
		}

		&.to:before {
			content: "\e675";
		}
	}
	.content-voice{
		width: 40rpx;
		height: 40rpx;
	}
	.voice-button:active{

		background-image: linear-gradient(bottom, #dcdcdc 0%, #dcdcdc 100%);
	}
	
	.onplay {
	 animation: hover 3s ease-in-out infinite; 
	}
	 
	@keyframes hover {
		0% {
			opacity: 0;
		}
		50% { 
			opacity: 1;
		} 
		100%{
			opacity: 0;
		}
	}
	.textarea-box{
		 
		
		overflow-y: scroll;
		padding: 20rpx;
		background-color: white;
		border-radius: 10rpx;
		margin: 10rpx;
		width: 70%;
	}
	.textarea-box textarea{
		overflow-y: scroll;
		word-break: break-all;
		 
	}
</style>
