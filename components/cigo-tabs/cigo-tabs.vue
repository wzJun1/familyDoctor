<template>
	 
		<!-- <view class="" style="height: 30px;background-color: #f8f8f8;">
			
		</view> -->
		<view id="cigoTabs" ref="cigoTabs" class="cigo-tabs" v-if="tabs.length > 0" :style="tabsStyle">
			 
		    <scroll-view class="" scroll-x="true" scroll-left="0">
		        <view id="cigo-tabs-list" ref="cigo-tabs-list" class="cigo-tabs-list">
		            <view
		                class="cigo-tabs-title"
		                v-for="(item, index) in tabs"
		                :key="index"
		                :id="'cigo-tabs-title-' + index"
		                ref="cigo-tabs-title"
		                :style="[{ width: tabItemWidth }, tabItemStyle]"
		                @click.stop="changeTab(item, index)"
		            >
		                <text class="cigo-tabs-title-txt" :style="[{ color: currTabIndex === index ? currTabColor : commonColor }, titleStyle]">{{ item.title }}</text>
		            </view>
		        </view>
		        <view id="cigo-tabs-indicator" ref="cigo-tabs-indicator" class="cigo-tabs-indicator" :style="[{ backgroundColor: currTabColor }, tabLineStyle, lineStyle]"></view>
		    </scroll-view>
		</view>
	 
     
</template>

<script>
var pageContext;
export default {
    props: {
        value: {
            type: Number,
            default: 0
        },
        tabWidthMode: {
            type: String,
            default: 'equal' //equal;auto
        },
        tabs: {
            type: Array,
            default: () => {
                return [];
            }
        },
        currTabColor: {
            type: String,
            default: '#0084CD'
        },
        commonColor: {
            type: String,
            default: '#333'
        },
        tabsStyle: {
            type: Object,
            default: () => {
                return {
                    // #ifdef APP-VUE
                    borderColor: '#ccc',
                    borderStyle: 'solid',
                    borderBottomWidth: '1rpx',
					 
                    // #endif

                    // #ifndef APP-VUE
                    borderBottom: '1rpx solid #ccc',
					 
                    // #endif
				 
				 
                };
            }
        },
        tabItemStyle: {
            type: Object,
            default: () => {
                return {
                    paddingBottom: '20rpx'
                };
            }
        },
        titleStyle: {
            type: Object,
            default: () => {
                return {
                    fontSize: '36rpx',
                    fontWeight: 500
                };
            }
        },
        lineStyle: {
            type: Object,
            default: () => {
                return {
                    width: '40rpx',
                    height: '4rpx'
                };
            }
        }
    },
    data() {
        return {
            currTabIndex: 0,
            tabItemWidth: 'auto',
            tabLineWidth: 0,
            tabLineStyle: {}
        };
    },
    watch: {
        value() {
            this.currTabIndex = this.value;
            this.refreshTabList();
        }
    },
    mounted() {
        pageContext = this;
        //初始化tabs
        pageContext.initTabs();
    },
    methods: {
        getNodeInfo(nodeFlag, nodeRef, callFun) {
            uni.getSystemInfo({
                success(res) {
                    // #ifdef APP-NVUE
                    weex.requireModule('dom').getComponentRect(nodeRef, nodeData => {
                        callFun(nodeData.size, res);
                    });
                    // #endif

                    // #ifdef APP-VUE
                    uni.createSelectorQuery()
                        .select(nodeFlag)
                        .boundingClientRect(nodeData => {
                            callFun(nodeData, res);
                        })
                        .exec();
                    // #endif
                }
            });
        },
        initTabs() {
            //初始化tab项宽度
            pageContext.getNodeInfo('#cigoTabs', pageContext.$refs.cigoTabs, function(tabData, res) {
                if (pageContext.tabWidthMode === 'equal') {
                    let width = ((tabData.width / pageContext.tabs.length) * 2 * 375) / res.screenWidth;

                    //**********************************************************
                    //TODO 偶尔会出现异常，先临时延时处理，待修复
                    if (width <= 0) {
                        setTimeout(function() {
                            //初始化tabs
                            pageContext.initTabs();
                        }, 500);
                        return;
                    }
                    //**********************************************************
                    pageContext.tabItemWidth = width + 'rpx';
                }
                //初始化tab横线
                pageContext.getNodeInfo('#cigo-tabs-indicator', pageContext.$refs['cigo-tabs-indicator'], function(lineData, res) {
                    pageContext.tabLineWidth = lineData.width;
                    pageContext.currTabIndex = pageContext.value;
                    pageContext.refreshTabList();
                });
            });
        },
        refreshTabList() {
            pageContext.$nextTick(() => {
                if (pageContext.tabs.length > 0) {
                    pageContext.getNodeInfo('#cigo-tabs-title-' + pageContext.currTabIndex, pageContext.$refs['cigo-tabs-title'][pageContext.currTabIndex], function(data, res) {
                        let tabLineLeft = ((data.left * 2 + data.width - pageContext.tabLineWidth) * 375) / res.screenWidth;
                        
                        //**********************************************************
                        //TODO 此处依然存在获取尺寸异常的情况，待修复
                        console.log(tabLineLeft, data.left, data.width, pageContext.tabLineWidth);
                        //**********************************************************
                        
                        /* #ifndef APP-NVUE */
                        pageContext.tabLineStyle = {
                            transform: 'translateY(-40rpx) translateX(' + tabLineLeft + 'rpx) rotate(' + 360 * pageContext.currTabIndex + 'deg) translateY(+40rpx)',
                            transitionDuration: '500ms'
                        };
                        /* #endif */
                        /* #ifdef APP-NVUE */
                        pageContext.tabLineStyle = {
                            left: tabLineLeft + 'rpx'
                        };
                        /* #endif */
                    });
                }
            });
        },
        changeTab(item, index) {
            pageContext.$emit('input', index);
        }
    }
};
</script>

<style lang="scss" scoped>
.page{
	  width: 100%;
}
.cigo-tabs {
    width: 100%;
}
.cigo-tabs-list {
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: row;
}
.cigo-tabs-title {
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */

    flex-direction: row;
    justify-content: center;
    align-items: center;
}
.cigo-tabs-indicator {
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */

    position: absolute;
    bottom: 0rpx;
    height: 4rpx;
    background-color: red;
}
</style>
