<template>
	<view class="content">
		<view class="title-padding"></view>
		<view class="header">

			<view class="main">
				<view class="div avatar">
					<image src="../../static/images/doctor_avatar.jpg" mode="widthFix"></image>
				</view>
				<view class="div info">
					<view class="li">
						<span class="username">杨光</span>
						<span class="tag">
							<image src="../../static/images/badge.png" mode="widthFix"></image>
						</span>
						<span class="score">5.0 ☆</span>
						<span class="ca">CA</span>
					</view>
					<view class="li">
						<span>今日患者: +2</span>
						<span>今日处方: +16</span>
					</view>
				</view>
				<view class="div button">
					<image src="../../static/images/scan.png" mode="widthFix"></image>
					<image src="../../static/images/qrcode.png" mode="widthFix"></image>
				</view>
			</view>

			<view class="receiveCard">
				<view class="line">
					<span>在线接诊</span>
					<span>0位等待</span>
				</view>
				<view class="line">
					<span>一语解千愁,一语降百忧,医者仁心</span>
					<span>去接诊</span>
					<image src="../../static/images/point_right.png" mode="widthFix">
				</view>
			</view>

		</view>

		<view class="body">
			<view class="row">

				<view class="uni-grid-body">
					<uni-grid :column="3" :show-border="false" :square="false">
						<uni-grid-item v-if="index < 3" v-for="(item ,index) in list" :index="index" :key="index">
							<view class="grid-item-box">
								<image class="image" :src="item.url" mode="aspectFill" />
								<text class="text">{{item.text}}</text>
								<view v-if="item.badge" class="grid-dot">
									<uni-badge :text="item.badge" :type="item.type" />
								</view>
							</view>
						</uni-grid-item>
					</uni-grid>
				</view>

			</view>

			<uni-section title="服务工具箱" type="line"></uni-section>

			<view class="row">

				<view class="uni-grid-body">
					<uni-grid :column="3" :show-border="false" :square="false">
						<uni-grid-item v-if="index > 2" v-for="(item ,index) in list" :index="index" :key="index">
							<view class="grid-item-box">
								<image class="image" :src="item.url" mode="aspectFill" />
								<text class="text">{{item.text}}</text>
								<view v-if="item.badge" class="grid-dot">
									<uni-badge :text="item.badge" :type="item.type" />
								</view>
							</view>
						</uni-grid-item>
					</uni-grid>
				</view>

			</view>

		</view>




	</view>
</template>

<script>
	 
	export default {
		data() {
			return {
				list: [{
						url: '../../static/images/open.png',
						text: '线上开单',
					},
					{
						url: '../../static/images/examine.png',
						text: '续方审核',
					},
					{
						url: '../../static/images/word.png',
						text: '药品清单',
					},
					{
						url: '../../static/images/message.png',
						text: '咨询服务',
					},
					{
						url: '../../static/images/evaluate.png',
						text: '服务评价'
					},
					{
						url: '../../static/images/autograph.png',
						text: '处方签名'
					},
					{
						url: '../../static/images/record.png',
						text: '开单记录'
					},
					{
						url: '../../static/images/method.png',
						text: '操作指南'
					},
					{
						url: '../../static/images/safe.png',
						text: '保健食品'
					},
					{
						url: '../../static/images/seal.png',
						text: '手写签章'
					},
					{
						url: '../../static/images/supplement.png',
						text: '补充就诊记录'
					},
					{
						url: '../../static/images/info.png',
						text: '一封信'
					}

				]
			}

		},
	 
		onShow() {
			 
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style lang="scss">
	@import "./index.scss";
</style>
