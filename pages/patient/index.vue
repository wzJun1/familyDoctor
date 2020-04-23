<template>
	<view class="content">

		<wuc-tab :tab-list="tabList" :tabCur.sync="TabCur" tab-class="text-center text-black bg-white" @change="tabChange"></wuc-tab>

		<view class="contacts" v-show="list.length">



			<view class="wrapper">
				
				
				 

				<scroll-view class="calendar-list" scroll-y="true" :scroll-into-view="scrollIntoId">
					<view class="form">
						
						<view class="input">
							<image src="../../static/images/find.png" mode="widthFix"></image>
							<input class="uni-input" placeholder-class="uni-input-placeholder" confirm-type="search" placeholder="请输入姓名或电话" />
						</view>
						<view class="tag">
							<image src="../../static/images/screen.png" mode="widthFix"></image>
							<span>标签筛选</span>
						</view>
					</view>
					

					<view style="background-color: rgb(248, 248, 248); font-size: 13px; padding: 5px 0 5px 0px; text-align: center; color: rgb(97, 97, 97);">
						共{{person.length}}名患者
					</view>

					<view v-for="(item, index) in list" :id="getId(index)" :key="getId(index)">
						<view class="letter-header" v-if="getId(index)">{{ getId(index) }}</view>


						<view class="" v-cloak>

							<uni-list>

								<uni-list-item title="" :showArrow="false" v-for="(u,uindex) in item" :key="u.id">
									<template>
										<view class="user-div" hover-stay-time="150" hover-class="user-div_hover">

											<view class="div avatar">
												<image :src="u.avatar" mode="widthFix" :lazy-load="true"></image>
												<span v-if="u.first_visit == 1">首诊</span>
											</view>
											<view class="div info">
												<view class="li">
													<span class="username" style="margin-right: 20rpx;">{{u.username}}</span>
													<uni-tag v-if="u.focus" inverted style="background-color: #FEBA4B; border-color: #FEBA4B;" circle text="特别关注"
													 type="" size="small"></uni-tag>
												</view>
												<view class="li">
													<span>{{u.sex}}</span>
													<span>{{u.age}}岁</span>
													<span>{{u.tel}}</span>
												</view>
											</view>
											<view class="div button" @click="showUserMenu(u.id)">
												<image src="../../static/images/three.png" mode="widthFix" :lazy-load="true"></image>
											</view>


										</view>

										<view class="user-menu" :class="ComputedClassShowMenu(u.id)">

											<view class="button" @click="showChangeTags(1)">
												<image src="../../static/images/tag.png" mode="widthFix"></image>
												<span>标签</span>
											</view>

											<view class="button">
												<image src="../../static/images/follow.png" mode="widthFix"></image>
												<span v-if="u.focus">取消关注</span>
												<span v-else>特别关注</span>
											</view>


											<view class="button">
												<image src="../../static/images/attach.png" mode="widthFix"></image>
												<span>备注</span>
											</view>
										</view>
									</template>


								</uni-list-item>



							</uni-list>



						</view>








					</view>

				</scroll-view>


				<view class="letters">

					<view class="letters-item" v-for="item in letter" :key="item" @click="scrollTo(item)">{{ item }}</view>
				</view>


				<view class="mask" v-if="showMask">
					<view class="mask-r">{{selectLetter}}</view>
				</view>
			</view>



		</view>


		<view class="" v-if="!list.length">
			<default-page :isShow="true" text="暂无相关数据" textColor="#777777"></default-page>
		</view>
		
		<uni-drawer :width="drawerWidth" :visible="drawer" mode="right" @close="showChangeTags(0)">
		    <view style="padding:0;">
		        
				
				
				
				<view class="user-div" hover-stay-time="150" hover-class="user-div_hover">
				
					<view class="div avatar">
						<image src="../../static/images/avatar_patient.png" mode="widthFix" :lazy-load="true"></image>
						 
					</view>
					<view class="div info" style="width: 100%;">
						<view class="li">
							<span class="username" style="margin-right: 20rpx;">李天翔</span>
							
						</view>
						<view class="li">
							<span>男</span>
							<span>35岁</span>
							<span>135****5896</span>
						</view>
					</view>
					  
				</view>
				
				
				<view class="selected-container">
					
					<view class="title">
						已选标签
						<span>({{SelectedLabels.length}}/7)</span>
					</view>
					
					
					<view class="detail">
						
						<view class="selected-tag" v-for="(item,index) in SelectedLabels" v-bind:key="index">
							 <view class="point" :style="'background-color:'+item.pointColor+' ;'"></view>
							 <view>{{item.label}}</view>
							 <view class="delete" @click="deleteSelectedLabel(item.label)">×</view>
						</view>
						  
					</view>
					
					
					
				</view>
				
				
				<view class="add-container">
					
					
					<view class="form">
						
						<view class="input">
							
							<input class="uni-input" placeholder-class="uni-input-placeholder" confirm-type="search" placeholder="请输入标签名" v-model="label" />
						</view>
						
						
					 
						 
					</view>
					
					<view class="color">
						 
						
					 
						<radio-group @change="radioEventHandle">
							<radio class="fa706d" value="#fa706d" />
							<radio class="feba4a" value="#feba4a" />
							<radio class="c1cdbb0" value="#1cdbb0" />
							<radio class="c6452f4" value="#6452f4" />
							<radio class="ea00ff" value="#ea00ff" />
							 
						</radio-group>
						<button class="color-add" @click="addLabel">添加</button>
						 
					</view>
					 
					
				</view>
				
				
				<view class="multiple-tags">
					<view class="title">
						可选标签
						
					</view>
					
					<view class="container">
						
						
						
						<view class="selected-tag" v-for="(item,index) in multipleTags" v-bind:key="index" @click="clickMultipleTag(item.label,item)">
							 <view class="point" :style="'background-color:'+item.pointColor+' ;'"></view>
							 <view>{{item.label}}</view>
							 <view class="selected" v-if="item.contain == 1"></view>
						</view>
						
						 
					</view>
					
				</view>
				
				
				<view class="drawer-button">
					<button class="close" @click="showChangeTags(0)">关闭</button>
					<button class="submit">确定</button>
				</view>
				
				
		    </view>
		</uni-drawer>

		<vus-layer></vus-layer>
	</view>
</template>

<script>
	import person from '../../static/common/person.js';
	export default {
		data() {
			return {
				showMenuIndex: 9999999999999999999,
				showMenuOnOff: 0,
				TabCur: 0,
				tabList: [{
						name: '全部患者'
					},
					{
						name: '特别关注'
					},
					{
						name: '今日新增'
					},
				],
				showMask: false,
				letter: [],
				selectLetter: '',
				scrollIntoId: '',
				list: [],
				drawer:false,
				drawerWidth:0,
				label:'',
				pointColor:'',
				SelectedLabels:[
					{
						label:'高血压',
						pointColor:'#6452f4',
					}
				],
				multipleTags:[
					{
						label:'智力低下',
						pointColor:'#feba4a',
						contain:0
					},
					{
						label:'高血压',
						pointColor:'#6452f4',
						contain:1
					},
					{
						label:'肝癌',
						pointColor:'#ea00ff',
						contain:0
					},
					
				],
			}
		},
		onLoad() {
			 
			 
			try {
			    const res = uni.getSystemInfoSync();
				const windowWidth = res.windowWidth;
				this.drawerWidth = windowWidth - windowWidth * 0.3;
			} catch (e) {
			    
				this.drawerWidth = 220;
			}
			this.getUserList(0);
		},
		computed: {

			person() {
				return person.person;
			},

			ComputedClassShowMenu() {
				return function(index) {
					return this.showMenuIndex == index ? 'showMenu' : ''
				}
			}
		},

		methods: {

			tabChange: function() {

				if (this.TabCur == 1) {

					this.getUserList(1);


				} else if (this.TabCur == 2) {
					this.getUserList(2);
				} else {
					this.getUserList(0);
				}




			},
			getUserList(index) {
				var mu = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u',
					'v', 'w', 'x', 'y',
					'z'
				];
				var tmp = [];
				this.list = [];
				this.letter = [];
				for (var i = 0; i < mu.length; i++) {
					var item = mu[i];

					for (var j = 0; j < this.person.length; j++) {
						var py = this.person[j].py;

						if (py.substring(0, 1) == item) {

							if (index == 1 && this.person[j].focus == 1) {

								if (tmp.indexOf(item) == -1) {
									this.list[i] = [this.person[j]];
									tmp.push(item);
									this.letter.push(item.toUpperCase());
								} else {
									this.list[i].push(this.person[j]);
								}

							}

							if (index == 0) {

								if (tmp.indexOf(item) == -1) {
									this.list[i] = [this.person[j]];
									tmp.push(item);
									this.letter.push(item.toUpperCase());
								} else {
									this.list[i].push(this.person[j]);
								}

							}



						}
					}
				}
				/* var arr = [];
				for (var i = 0; i <= this.list.length; i++) {
					if (this.list[i] !== "" && this.list[i] != undefined) {
						arr.push(this.list[i]);
					}
				} */
				this.list = this.filterNull(this.list);
			},
			getId(index) {
				return this.letter[index];
			},
			filterNull:function(array){
				var arr = [];
				for (var i = 0; i <= array.length; i++) {
					if (array[i] !== "" && array[i] != undefined) {
						arr.push(array[i]);
					}
				}
				return arr;
			},
			scrollTo(letter) {
				this.showMask = true
				this.selectLetter = letter == 'hot' ? '最' : letter
				setTimeout(() => {
					this.showMask = false
				}, 300);
				this.scrollIntoId = letter;
			},
			query(source, text) {
				let res = [];
				var self = this;
				res = source.filter(item => {
					const arr = [];
					let isHave = false;
					Object.keys(item).forEach(prop => {
						const itemStr = item[prop];
						self.isString(itemStr) &&
							itemStr.split(',').forEach(val => {
								arr.push(val);
							});
					});
					arr.some(val => {
						isHave = new RegExp('^' + text).test(val);
						return isHave;
					});
					return isHave;
				});

				return res;
			},

			isString(obj) {
				return typeof obj === 'string';
			},
			showUserMenu: function(index) {

				if (this.showMenuIndex == index) {
					this.showMenuOnOff = 1;
				} else {
					this.showMenuOnOff = 0;
				}
				if (this.showMenuOnOff == 0) {
					this.showMenuIndex = index;
				} else {
					this.showMenuIndex = 9999999999999999999;
				}
			},
			showChangeTags:function(status){
				if(status){
					this.drawer = true;
					uni.hideTabBar({});
				}else{
					this.drawer = false;
					uni.showTabBar({});
				}
			 
			},
			radioEventHandle:function(e){
				var color = e.target.value;
				 
				this.pointColor = color;
			},
			addLabel:function(){
				if(this.SelectedLabels.length >= 7){
					uni.showToast({ title: '标签不能超过7个', duration: 2000,icon:'none' });
					return;
				}
				var SelectedLabels = this.SelectedLabels;
				var label ={
					label:this.label,
					pointColor:this.pointColor
				};
				 
				for(var i = 0;i<SelectedLabels.length;i++){
					if(SelectedLabels[i]['label'] == this.label){
						 
						uni.showToast({ title: '该标签已存在', duration: 2000,icon:'none' });
						return;
					}
				}
				this.$set(this.SelectedLabels,this.SelectedLabels.length,label)
			},
			deleteSelectedLabel:function(label){
				
				var SelectedLabels = this.SelectedLabels;
				var newArray = [];
				 
				for(var i = 0;i<SelectedLabels.length;i++){
					console.log(SelectedLabels[i]['label'])
					if(SelectedLabels[i]['label'] != label){
						newArray[i] = SelectedLabels[i];
					}
				}
			 
				this.SelectedLabels = this.filterNull(newArray);
				for(var i = 0;i<this.multipleTags.length;i++){
					if(this.multipleTags[i]['label'] == label){
						this.multipleTags[i]['contain'] = 0;
					}
					 
				}
			},
			clickMultipleTag:function(label,item){
				 
				var SelectedLabels = this.filterNull(this.SelectedLabels);
				var newChanelSelectedArray = [];
				var newSelectedArray = [];
				var contain = false;
				 
				for(var i = 0;i<SelectedLabels.length;i++){
					if(SelectedLabels[i]['label'] == label){
						contain = true;
					}
				}

				if(contain){
					this.deleteSelectedLabel(label);
					for(var i = 0;i<this.multipleTags.length;i++){
						if(this.multipleTags[i]['label'] == label){
							this.multipleTags[i]['contain'] = 0;
						}
					}
				}else{
					delete item.contain;
					this.$set(this.SelectedLabels,this.SelectedLabels.length,item);
					for(var i = 0;i<this.multipleTags.length;i++){
						if(this.multipleTags[i]['label'] == label){
							this.multipleTags[i]['contain'] = 1;
						}
						 
					}
				}
			 
				 
			},
		}
	}
</script>

<style lang="scss">
	@import './index.scss';
</style>
