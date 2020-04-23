<template>
	<view>
		<view class="user-box">
			<view class="nav-tab">

				<view class="">

					<image src="../../static/images/system.png" mode="widthFix"></image>

					<span>系统消息</span>

				</view>

				<view class="">
					<image src="../../static/images/chat_message.png" mode="widthFix"></image>
					<span>咨询消息</span>
					<uni-badge text="12" type="error" size="small"></uni-badge>

				</view>

			</view>
		</view>

		<view class="list">
			<view class="flex_col" v-for="(item,index) in userAddConversationList"
			 :key="index" :data-index="index" @click="toRoom(item)">
			 
				 
				  <min-badge :count="item.conversation.unreadCount" :maxCount="9" v-if="item.conversation.unreadCount">
				       <image :src="item.user.img" mode="aspectFill"></image>
				  </min-badge>
				  <image v-else :src="item.user.img" mode="aspectFill"></image>
				<view class="flex_grow" style="margin-left: 30rpx;">
					<view class="flex_col">
						<view class="flex_grow" style="margin-bottom: 20rpx;">{{item.user.user}}</view>
						<view class="time">{{timeFliter(item.conversation.lastMessage.lastTime,1)}}</view>
					</view>
					<view class="info">{{Parsing(item.conversation.lastMessage.messageForShow)}}</view>
				</view>
			</view>
		</view>


		<!-- 聊天记录 会话列表 -->
		<!-- <view class="conversition-box" v-if="isActive ==0">
			<view class="list-box" v-if="userAddConversationList.length>0">
				<view class="item-box" v-for="(item,index) in userAddConversationList" :key="index" @click="toRoom(item)">
					<view class="item-img">
						<img :src="item.user.img" alt="">
					</view>
					<view class="item-text">
						<view class="item-user">
							{{item.user.user}}
						</view>
						<view class="item-text-info">
							<rich-text :nodes="nodesFliter(item.conversation.lastMessage.messageForShow)"></rich-text>

						</view>
					</view>
					<view class="item-msg">
						<view class="item-msg-icon" v-if="item.conversation.unreadCount">{{item.conversation.unreadCount}}</view>
					</view>
				</view>
			</view>
			<view class="list-box" v-else>
				<span class="msg-box">暂无聊天记录，请选择好友进行聊天</span>
			</view>
		</view> -->
		<!-- 好友列表 -->
		<view class="user-box" v-if="isActive ==1">
			<view class="list-box">
				<view class="user-item-box" v-for="(item,index) in friendList" :key="index" @click="checkUserToRoom(item)">
					<view class="user-img">
						<image :src="item.img" alt=""></image>
					</view>
					<view class="user-name">
						{{item.user}}
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import userList from '../../commen/tim/user.js'

	import {
		mapState
	} from "vuex";


	export default {
		name: 'record',
		data() {
			return {
				// conversationList: [],
				userList: userList,
				friendList: [],
				isActive: 0, //默认聊天记录
				userAddConversationList: []
			}
		},
		computed: {
			...mapState({
				isLogin: state => state.isLogin,
				isSDKReady: state => state.isSDKReady,
				conversationList: state => state.conversationList,
			})
		},
		watch: {
			isSDKReady(val) {
				//isSDKReady == true 请求会话列表
				if (val) {
					this.getConversationList()
				}
			},
			conversationList(val) {
				this.getUserInfo(val)
			}

		},
		methods: {
			Parsing:function(value){
				try{
					let Json = JSON.parse(value);
					let type = Json.type;
					let content = Json.content;
					
					if(type == "f_d_2_voice"){
						return "[语音消息]";
					}else{
						return content;
					}
					
					
					 
					
				}catch(err){
					console.log(err)
					return "";
				}
			},
			//注销登录
			outLoginBtn() {
				let promise = this.tim.logout();
				promise.then(res => {
					this.$store.commit('reset')
					uni.reLaunch({
						url: '../index/index'
					})
				}).catch(err => {
					console.log('退出失败')
				});
			},
			//聊天的节点加上外层的div
			nodesFliter(str) {
				let nodeStr = '<div style="align-items: center;word-wrap:break-word;">' + str + '</div>'
				return nodeStr
			},
			//切换tab
			changeTabBtn(_index) {
				this.isActive = _index
				if (this.isSDKReady) {
					this.getConversationList()
				}
			},
			//获取消息列表
			getConversationList() {
				// 拉取会话列表
				let promise = this.tim.getConversationList();
				promise.then((res) => {
					let conversationList = res.data.conversationList; // 会话列表，用该列表覆盖原有的会话列表
					if (conversationList.length) {
						//将返回的会话列表拼接上 用户的基本资料  
						//说明：如果已经将用户信息 提交到tim服务端了 就不需要再次拼接
						this.$store.commit("updateConversationList", conversationList);
					}

				}).catch((err) => {
					console.warn('getConversationList error:', err); // 获取会话列表失败的相关信息
				});
			},
			//根据消息列表请求聊天对象的用户信息 并完成数据拼接
			getUserInfo(conversationList) {
				this.userAddConversationList = []
				conversationList.forEach(item => {
					let obj = {}
					obj.conversation = item
					userList.forEach(item1 => {
						if (item.toAccount == item1.userId) {
							obj.user = item1
						}
					})
					this.userAddConversationList.push(JSON.parse(JSON.stringify(obj)))
				})
				console.log(this.userAddConversationList)
			},
			toRoom(item) {
				this.$store.commit('updateConversationActive', item)
				uni.navigateTo({
					url: './window'
				})
			},
			//选择用户聊天
			checkUserToRoom(toUserInfo) {
				this.$store.commit('createConversationActive', toUserInfo.userId)
				uni.navigateTo({
					url: './window'
				})
			},
			timeFliter(timer,part = 0){
				let timeData = new Date(timer*1000)
				let str = this.$commen.dateTimeFliter(timeData,part)		 
				return str
			},

		},
		onShow() {
			if (this.isSDKReady) {

				this.getConversationList()
			} else {
				console.log('333333')
			}
		},
		onLoad() {

			this.$store.commit('reset')
			//#ifdef APP-PLUS
			var user = "我的手机";
			//#endif
			//#ifdef H5
			var user = "蓝色的天";
			//#endif
			let userInfo = null
			userList.forEach((item) => {
				if (item.user == user) {
					userInfo = item
				}
			})
			if (userInfo) { //根据返回的userID 以及 userSig 登录tim
				let promise = this.tim.login({
					userID: userInfo.userId,
					userSig: userInfo.userSig
				});
				promise.then((res) => {
					//登录成功后 更新登录状态
					this.$store.commit("toggleIsLogin", true);
					//自己平台的用户基础信息
					uni.setStorageSync('userInfo', JSON.stringify(userInfo))
					//tim 返回的用户信息
					uni.setStorageSync('userTIMInfo', JSON.stringify(res.data))

				}).catch((err) => {
					console.warn('login error:', err); // 登录失败的相关信息
				});
			} else {
				uni.showToast({
					icon: 'none',
					title: '用户不存在',
					duration: 1500
				});
			}

			//let userInfo = JSON.parse(uni.getStorageSync('userInfo'))
			this.friendList = []
			userList.forEach(item => {
				if (item.userId != userInfo.userId) {
					console.log(item)
					this.friendList.push(item)
				}
			})

		}
	}
</script>

<style scoped lang="scss">
	/* 列式弹性盒子 */
	.flex_col {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: center;
		align-items: center;
		align-content: center;
	}

	/* 弹性盒子弹性容器 */
	.flex_col .flex_grow {
		width: 0;
		-webkit-box-flex: 1;
		-ms-flex-positive: 1;
		flex-grow: 1;
		font-size: 36rpx;
		 
	}
 
	.flex_row .flex_grow {
		-webkit-box-flex: 1;
		-ms-flex-positive: 1;
		flex-grow: 1;
	}

	/* 弹性盒子允许换行 */
	.flex_col.flex_wrap {
		-ms-flex-wrap: wrap;
		flex-wrap: wrap;
	}

	/* 列表 */
	.list {
		background-color: #fff;
		font-size: 28upx;
		color: #333;
		user-select: none;
		touch-callout: none;

		&>view {
			padding: 30upx 30upx;
			position: relative;

			&:active,
			&.active {
				background-color: #f3f3f3;
			}

			image {
				height: 100upx;
				width: 100upx;
				border-radius: 4px;
				 
			}

			&>view {
				line-height: 40upx;

				.time,
				.info {
					color: #999;
					font-size: 24upx;
				}

				.time {
					width: 150upx;
					text-align: right;
				}

				.info {
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}

		&>view:not(:first-child) {
			margin-top: 1px;

			&::after {
				content: '';
				display: block;
				height: 0;
				border-top: #CCC solid 1px;
				width: 620upx;
				position: absolute;
				top: -1px;
				right: 0;
				transform:scaleY(0.5);	/* 1px像素 */
			}
		}
	}

	/* 遮罩 */
	.shade {
		position: fixed;
		z-index: 100;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		-webkit-touch-callout: none;

		.pop {
			position: fixed;
			z-index: 101;
			width: 200upx;
			box-sizing: border-box;
			font-size: 28upx;
			text-align: left;
			color: #333;
			background-color: #fff;
			box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
			line-height: 80upx;
			transition: transform 0.15s ease-in-out 0s;
			user-select: none;
			-webkit-touch-callout: none;
			transform: scale(0, 0);

			&.show {
				transform: scale(1, 1);
			}

			&>view {
				padding: 0 20upx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				user-select: none;
				-webkit-touch-callout: none;

				&:active {
					background-color: #f3f3f3;
				}
			}
		}
	}
</style>

<style scoped lange="scss">
	.list-box {
		width: 94%;
		margin: 40rpx auto;
	}

	.item-box {
		width: auto;
		height: 130rpx;
		padding: 20rpx;
		overflow: hidden;
		border-bottom: 1px solid #eee;
	}

	.item-img {
		float: left;
		margin-top: 20rpx;
		width: 80rpx;
		height: 80rpx;
	}

	.item-img img {
		width: 80rpx;
		height: 80rpx;
	}

	.item-text {
		float: left;
		margin-left: 30rpx;
		width: 500rpx;
		height: 100rpx;
		color: #666;
		font-size: 28rpx;
	}

	.item-user {
		width: auto;
		height: 60rpx;
		line-height: 60rpx;
		color: 333;
		font-size: 32rpx;

	}

	.item-text-info {
		width: auto;
		height: 60rpx;
		line-height: 60rpx;
		color: #666;
		font-szie: 24rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.user-box {
		width: auto;
		height: 80rpx;
		margin-bottom: 30rpx;
	}

	.nav-tab {
		padding: 20rpx;
		background: #fff;

		margin-top: 10rpx;
		margin-bottom: 10rpx;
		display: flex;
		justify-content: center;
		align-items: center;

	}

	.nav-tab view {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 30rpx;
		/* font-weight: bold; */
	}

	.nav-tab image {
		width: 60rpx;
		margin-right: 10rpx;
	}
 
  

	.tab-item {
		float: left;
		height: 70rpx;
		padding: 0 20rpx;
		line-height: 70rpx;
		color: #666;
		font-size: 28rpx;
		border: 1px solid #F56C6C;
		border-top-left-radius: 25rpx;
		border-bottom-left-radius: 25rpx;
	}

	.tab-item1 {
		float: left;
		height: 70rpx;
		padding: 0 20rpx;
		line-height: 70rpx;
		color: #666;
		font-size: 28rpx;
		border: 1px solid #F56C6C;
		border-top-right-radius: 25rpx;
		border-bottom-right-radius: 25rpx;
	}

	.tab-item-active {
		color: #fff;
		background: #F56C6C;
	}

	.msg-box {
		line-height: 30rpx;
		font-size: 28rpx;
		color: #666;
	}

	.user-item-box {
		padding: 20rpx 0;
		width: auto;
		height: 70rpx;
		line-height: 70rpx;
		cursor: pointer;
		border-bottom: 1px solid #eee;
	}

	.user-img {
		float: left;
		width: 70rpx;
		height: 70rpx;
		border-radius: 50%;
		overflow: hidden;
	}

	.user-img image {
		width: 70rpx;
		height: 70rpx;
		border-radius: 50%;
	}

	.user-name {
		float: left;
		margin-left: 20rpx;
		width: 250rpx;
		height: 70rpx;
		line-height: 70rpx;
		color: #666;
		font-weight: 500;
	}

	.item-msg {
		float: left;
		width: 40rpx;
		height: 100rpx;
	}

	.item-msg-icon {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		background: #f06c7a;
		color: #fff;
		line-height: 40rpx;
		margin-top: 30rpx;
		text-align: center;
		font-size: 24rpx;
	}

	.clear-box {
		clear: both;
	}

	.out-login {
		float: right;
		margin-right: 20rpx;
		height: 70rpx;
		line-height: 70rpx;
		padding: 0 40rpx;
		border-radius: 25rpx;
		color: #fff;
		background: #F56C6C;
		font-size: 26rpx;
	}
</style>
