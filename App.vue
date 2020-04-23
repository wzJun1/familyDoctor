<script>
	export default {
		mounted() {
			/**官网有很多关于关于sdk 其他的监听方法（比如：有新的消息，用户资料更新等等）
			 * 详情可对照： https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html
			 * 监听的含义：服务端发生了数据变更---前端全局可以接收到变更通知--前端就可以自动触发某个事件来更新相应数据
			 * */
			// 登录成功后会触发 SDK_READY 事件，该事件触发后，可正常使用 SDK 接口
			this.tim.on(this.$TIM.EVENT.SDK_READY, this.onReadyStateUpdate, this);
			// 收到新消息
			this.tim.on(this.$TIM.EVENT.MESSAGE_RECEIVED, this.onReceiveMessage);
			// 会话列表更新
			this.tim.on(this.$TIM.EVENT.CONVERSATION_LIST_UPDATED, event => {
				this.$store.commit("updateConversationList", event.data);
			});
		},
		methods: {
			onReadyStateUpdate({name}) {
				const isSDKReady = name === this.$TIM.EVENT.SDK_READY ? true : false;
				//自动监听并更新 sdk 的ready 状态 （未登录是 notReady  登录后是ready）
				this.$store.commit("toggleIsSDKReady", isSDKReady);
		        //sdk ready 后  肯定完成了登录操作    这里可以获取用户存储在im的基础信息/离线消息/黑名单列表
			},
			
			onReceiveMessage({data: messageList}) {
				// this.handleAt(messageList);
				this.$store.commit("pushCurrentMessageList", messageList);
			},
			//根据消息列表请求聊天对象的用户信息 并完成数据拼接
		
		},
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	page {
		background-color: $uni-bg-color-grey;
		
	}
	body{
		--red: #e54d42;
		--orange: #f37b1d;
		--yellow: #fbbd08;
		--olive: #8dc63f;
		--green: #39b54a;
		--cyan: #1cbbb4;
		--blue: #0081ff;
		--purple: #6739b6;
		--mauve: #9c26b0;
		--pink: #e03997;
		--brown: #a5673f;
		--grey: #8799a3;
		--black: #333333;
		--darkGray: #666666;
		--gray: #aaaaaa;
		--ghostWhite: #f1f1f1;
		--white: #ffffff;
		/* 浅色 */
		--redLight: #fadbd9;
		--orangeLight: #fde6d2;
		--yellowLight: #fef2ce;
		--oliveLight: #e8f4d9;
		--greenLight: #d7f0db;
		--cyanLight: #d2f1f0;
		--blueLight: #cce6ff;
		--purpleLight: #e1d7f0;
		--mauveLight: #ebd4ef;
		--pinkLight: #f9d7ea;
		--brownLight: #ede1d9;
		--greyLight: #e7ebed;
		/* 渐变色 */
		--gradualRed: linear-gradient(45deg, #f43f3b, #ec008c);
		--gradualOrange: linear-gradient(45deg, #ff9700, #ed1c24);
		--gradualGreen: linear-gradient(45deg, #39b54a, #8dc63f);
		--gradualPurple: linear-gradient(45deg, #9000ff, #5e00ff);
		--gradualPink: linear-gradient(45deg, #ec008c, #6739b6);
		--gradualBlue: linear-gradient(45deg, #0081ff, #1cbbb4);
		/* 阴影透明色 */
		--ShadowSize: 6upx 6upx 8upx;
		--redShadow: rgba(204, 69, 59, 0.2);
		--orangeShadow: rgba(217, 109, 26, 0.2);
		--yellowShadow: rgba(224, 170, 7, 0.2);
		--oliveShadow: rgba(124, 173, 55, 0.2);
		--greenShadow: rgba(48, 156, 63, 0.2);
		--cyanShadow: rgba(28, 187, 180, 0.2);
		--blueShadow: rgba(0, 102, 204, 0.2);
		--purpleShadow: rgba(88, 48, 156, 0.2);
		--mauveShadow: rgba(133, 33, 150, 0.2);
		--pinkShadow: rgba(199, 50, 134, 0.2);
		--brownShadow: rgba(140, 88, 53, 0.2);
		--greyShadow: rgba(114, 130, 138, 0.2);
		--grayShadow: rgba(114, 130, 138, 0.2);
		--blackShadow: rgba(26, 26, 26, 0.2);
			
		 
		 
		font-family: Helvetica Neue, Helvetica, sans-serif;
	}
	@import url("./pages/patient/index.scss");
	.uni-textarea-textarea{
		overflow-y: scroll !important;
	}
	textarea{
		overflow-y: scroll !important;
	}
</style>
