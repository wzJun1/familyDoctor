<template>
	<view class="content">
		<view class="title-padding"></view>
		
		<view class="doctor-card">
			
			<view class="system">
				<image src="../../static/images/user_system.png" mode="widthFix"></image>
			</view>
			
			<view class="qrcode">
				<image src="../../static/images/qrcode.png" mode="widthFix"></image>
			</view>
			
			<view class="avatar">
				<image src="../../static/images/doctor_avatar.jpg" mode="widthFix"></image>
			</view>
			
			<view class="info">
				
				<view class="username">杨光
				
				 
					<span>名医</span>
				</view>
				 
				<!-- <uni-tag inverted style="background-color: #FEBA4B; border-color: #FEBA4B;" circle text="特别关注"
				 type="" size="small"></uni-tag> -->
				<view class="type">内分泌科  |  主任医师</view>
				<view class="hospital">内蒙古自治区白求恩医院</view>
				
			</view>
			<view class="line">
				
			</view>
			<view class="col">
				
				<view class="col-1">
					<image src="../../static/images/introduce.png" mode="widthFix"></image>
					<span>个人介绍</span>
					
				</view>
				
				<view class="col-1">
					<image src="../../static/images/preview.png" mode="widthFix"></image>
					<span>主页预览</span>
				</view>
				
			</view>
			
			
			
		</view>
		
		
		<view class="status">
			
			<span>图文问诊服务状态</span>
			<view class="tags">
				
				<view class="tag-1">
					忙碌
				</view>
				
				<view class="tag-2">
					空闲
				</view>
				
			<!-- 	<uni-tag text="忙碌" type="warning" style="display: inline;" inverted :circle="true" size=""></uni-tag>
				<uni-tag text="空闲" type="primary" style="display: inline;" :circle="true" size=""></uni-tag>
			 -->
			</view>
			
		</view>
		
		<uni-section title="工作量统计" type="line"></uni-section>
		
		<view class="statistics">
			
			<view class="col">
				<view>98</view>
				<view>本月咨询服务</view>
				
			</view>
			
			<view class="col">
				<view>12</view>
				<view>本月处方开单</view>
			</view>
			
		</view>
		
		<uni-section title="服务管理" type="line"></uni-section>
		
		<view class="server">
			
			<view class="uni-grid-body">
				<uni-grid :column="4" :show-border="false" :square="false">
					<uni-grid-item>
						<view class="grid-item-box">
							<image class="image" src="../../static/images/certificate.png" mode="aspectFill" />
							<text class="text">证书管理</text>
							 
						</view> 
					</uni-grid-item>
					<uni-grid-item>
						<view class="grid-item-box">
							<image class="image" src="../../static/images/template.png" mode="aspectFill" />
							<text class="text">处方模板</text>
							 
						</view>
					</uni-grid-item>
				 
				</uni-grid>
			</view>
			
		</view>
		
		<uni-section title="其他服务" type="line"></uni-section>
		
		<view class="server">
			
			<view class="uni-grid-body">
				<uni-grid :column="4" :show-border="false" :square="false">
					<uni-grid-item>
						<view class="grid-item-box">
							<image class="image" src="../../static/images/cycle.png" mode="aspectFill" />
							<text class="text">协作门诊</text>
							 
						</view>
					</uni-grid-item>
					<uni-grid-item>
						<view class="grid-item-box">
							<image class="image" src="../../static/images/medicinebox.png" mode="aspectFill" />
							<text class="text">专病随访</text>
							 
						</view>
					</uni-grid-item>
				 
				</uni-grid>
			</view>
			
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	@import "./user.scss";
</style>

