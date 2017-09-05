<template>
<div id="skin" v-bind:class="{ 'skin-full-screen' : fullScreenSw }">
	
	<div class="skin-main" v-bind:id="'sk_' + surveySetup.article_templates">
		
		<div v-bind:class="{ 'bar-fixed' : barFixed }" class="top-bar">
			<a class="pc show-btn select" title="电脑模式" href="javascript:void(0);"><s></s>PC</a>
			<!-- <a class="phone show-btn" title="手机模式" href="javascript:void(0);"><s></s>Phone</a> -->
			<a v-on:click="fullScreenSw = true" v-show="!fullScreenSw" class="full-screen f-btn" title="全屏" href="javascript:void(0);"></a>
			<a v-on:click="fullScreenSw = false" v-show="fullScreenSw" class="no-full-screen f-btn" title="非全屏" href="javascript:void(0);"></a>
		</div>

		<div class="skin-show" v-bind:id="surveyData.type == 4 ? 'vote' : ''">

			<div class="skin-body" v-bind:style="surveySetup.article_templates === -1 ? 'background:url(' + surveySetup.article_background + ') no-repeat top center; background-color: #' + surveySetup.article_background_color + ';' : ''">

				<div v-show="surveySetup.article_templates === -1" class="form-header-bg" v-bind:style="'height: ' + surveySetup.article_header_hight + 'px; background:url(' + surveySetup.article_header_img + ') no-repeat top center;'"></div>

				<div class="skin-inner">

					<div class="temp-inner">

						<div v-show="surveySetup.article_templates > -1" class="form-header">
							<strong>{{ surveyData.title }}</strong>
							<cite v-show="surveyData.desc">{{ surveyData.desc }}<s class="l"></s><s class="r"></s></cite>
						</div>

						<div v-for="(item, index) in surveyData.questions" v-bind:class="{ 'form-box' : item.types != 8 }">
							
							<div v-show="item.types != 8" class="tit">
								<span v-show="surveySetup.article_show_number" class="no">{{ index + 1 }}</span>
								<span v-bind:title="item.title" class="title">{{ item.title }}</span>
								<span class="must" v-show="item.must">必填</span>
							</div>

							<div v-show="item.subtitle" class="subtitle">{{ item.subtitle }}</div>

							<!-- 单选题 -->
							<div v-if="item.types == 0 || item.types === '15'" class="value">
								<div class="form-radio">
									<div v-bind:title="answer.title" v-for="answer in item.answers" class="ui-radio">
										<span class="icon"></span>
										<span class="title">{{ answer.title }}</span>
										<span class="desc">
											<span v-for="desc in answer.desc">{{ desc.val }}</span>
										</span>
										<span v-show="surveySetup.article_show_ballot" class="vote-num">{{ answer.count || '0' }} 票</span>

										<a v-show="surveySetup.article_show_button" href="javascript:void(0);" class="btn-vote">投票</a>
									</div>
								</div>
							</div>

							<!-- 多选题 -->
							<div v-else-if="item.types == 1" class="value">
								<div class="form-checkbox">
									<div v-bind:title="answer.title" v-for="answer in item.answers" class="ui-checkbox">
										<span class="icon"></span>
										<span class="title">{{ answer.title }}</span>
										<span class="desc">
											<span v-for="desc in answer.desc">{{ desc.val }}</span>
										</span>
										<span v-show="surveySetup.article_show_ballot" class="vote-num">{{ answer.count || '0' }} 票</span>

										<a v-show="surveySetup.article_show_button" href="javascript:void(0);" class="btn-vote">投票</a>
									</div>
								</div>
							</div>

							<!-- 图片单选题 add-description -->
							<div v-else-if="item.types == 2" class="value">
								<div class="form-img-radio">
									<div v-for="answer in item.answers" class="ui-img-radio">
										<div class="options-img">
											<a v-bind:href="answer.url" target="_blank">
												<img v-bind:src="answer.img">
											</a>
											<div class="sel"><div class="icon"></div></div>
											<a v-show="surveySetup.article_show_button" href="javascript:void(0);" class="btn-vote">投票</a>
										</div>

										<div class="options-info">
											<div v-bind:title="answer.title" class="title">{{ answer.title }}</div>
											<div v-bind:title="answer.desc[0].val" v-for="desc in answer.desc" class="desc">{{ answer.desc[0].val }}</div>
											<div v-show="surveySetup.article_show_ballot" class="vote-num">{{ answer.count || '0' }} 票</div>
										</div>
									</div>
								</div>
							</div>

							<!-- 图片多选题 add-description -->
							<div v-else-if="item.types == 16" class="value">
								<div class="form-img-checkbox">
									<div v-for="answer in item.answers" class="ui-img-checkbox">
										<div class="options-img">
											<a v-bind:href="answer.url" target="_blank">
												<img v-bind:src="answer.img">
											</a>
											<div class="sel"><div class="icon checkbox"></div></div>
											<a v-show="surveySetup.article_show_button" href="javascript:void(0);" class="btn-vote">投票</a>
										</div>

										<div class="options-info">
											<div v-bind:title="answer.title" class="title">{{ answer.title }}</div>
											<div v-bind:title="answer.desc[0].val" v-for="desc in answer.desc" class="desc">{{ answer.desc[0].val }}</div>
											<div v-show="surveySetup.article_show_ballot" class="vote-num">{{ answer.count || '0' }} 票</div>
										</div>
									</div>
								</div>
							</div>

							<!-- 翻页 -->
							<div v-else-if="item.types == 8" class="form-page">
								<a class="disabled" href="javascript:void(0);">上一页</a>
								<a href="javascript:void(0);">下一页</a>
							</div>

						</div>

						<!-- 投票提交按钮 -->
						<div v-show="surveyData.type == 4" class="survey-post">
							<a class="post-btn" href="javascript:void(0);">提交</a>
							<a class="disabled cancel-btn" href="javascript:void(0);">取消</a>
						</div>

						<div class="end-text">
			        <p class="en">The End</p>
			        <p class="cn">问卷到此结束，感谢您的参与！</p>
			        <div class="border"></div>
			      </div>

						<!-- 版权所有 -->
						<div class="hq-b">© 环球网  版权所有</div>
					</div>

				</div>

			</div>

		</div>
	</div>

	<div v-bind:class="{ 'bar-fixed' : barFixed }" class="skin-setup">
		<div class="setup-nav">
			<ul>
				<li v-on:click="skinNavSetup = true" v-bind:class="{ select : skinNavSetup }">选择皮肤</li>
				<li v-on:click="skinNavSetup = false" v-bind:class="{ select : !skinNavSetup }">自定义</li>
			</ul>
		</div>

		<div v-show="skinNavSetup" class="setup-main select-skin">
			<div class="setup-checkbox">
				<span v-show="surveyData.type == 4" v-bind:class="{ select : surveySetup.article_show_ballot }" v-on:click="otherSetup('article_show_ballot')" class="ui-checkbox"><span class="icon"><s></s></span>投票前显示票数</span>
				<span v-bind:class="{ select : surveySetup.article_show_number }" v-on:click="otherSetup('article_show_number')" class="ui-checkbox"><span class="icon"><s></s></span>显示题目编号</span>
				<span v-show="surveyData.type == 4" v-bind:class="{ select : surveySetup.article_show_button }" v-on:click="otherSetup('article_show_button')" class="ui-checkbox"><span class="icon"><s></s></span>显示投票按钮</span>	
			</div>

			<div class="select-skin">
				<ul>
					<li v-on:click="changeSkin(0)" v-bind:class="{ select : surveySetup.article_templates === 0 }">
						<div class="skin-img">
							<img src="http://himg2.huanqiu.com/survey/skin_1.jpg">
							<s></s>
						</div>
					</li>
					
					<li v-on:click="changeSkin(1)" v-bind:class="{ select : surveySetup.article_templates === 1 }">
						<div class="skin-img">
							<img src="http://himg2.huanqiu.com/survey/skin_2.jpg">
							<s></s>
						</div>
					</li>
					
					<li v-on:click="changeSkin(2)" v-bind:class="{ select : surveySetup.article_templates === 2 }">
						<div class="skin-img">
							<img src="http://himg2.huanqiu.com/survey/skin_3.jpg">
							<s></s>
						</div>
					</li>

					<li v-show="surveySetup.article_header_img || surveySetup.article_background" v-on:click="changeSkin(-1)" v-bind:class="{ select : surveySetup.article_templates === -1 }">
						<div class="skin-img">
							<img v-bind:src="surveySetup.article_header_img || surveySetup.article_background">
							<s></s>
						</div>
					</li>

				</ul>
			</div>
		</div>

		<div v-show="!skinNavSetup" class="setup-main diy-skin">
			<div class="diy-box">
				<div class="tit"><span>设置头图</span><s></s></div>
				<div class="con">
					<upload v-bind:img="surveySetup.article_header_img" v-bind:wh="'122*80'" v-bind:temp="''" v-on:uploadDone="headerImg"></upload>
					<cite>高度250-300px为宜</cite>
					<cite>宽度1920px为宜</cite>
				</div>
			</div>

			<div class="diy-box">
				<div class="tit"><span>设置头图高度</span><s></s></div>
				<div class="con">
					<div class="head-img-h">
						<input v-on:blur="updataSetupKey($event.target.value, 'article_header_hight')" type="text" maxlength="5" v-bind:value="surveySetup.article_header_hight">
						<span>px</span>
					</div>
					<cite>与头图高度相同即可</cite>
				</div>
			</div>

			<div class="diy-box">
				<div class="tit"><span>设置背景图</span><s></s></div>
				<div class="con">
					<upload v-bind:img="surveySetup.article_background" v-bind:wh="'122*80'" v-bind:temp="''" v-on:uploadDone="bgImg"></upload>
				</div>
			</div>

			<div class="diy-box">
				<div class="tit"><span>设置背景色</span><s></s></div>
				<div class="con">
					<div class="head-img-bg">
						<input v-on:blur="updataSetupKey($event.target.value, 'article_background_color')" type="text" maxlength="6" v-bind:value="surveySetup.article_background_color">
						<span>#</span>
					</div>
				</div>
			</div>
		</div>

		<div class="setup-btn">
			<a v-on:click="goNav('new')" href="javascript:void(0);" class="ui-btn">编辑{{ surveyData.type == 4 ? '投票' : '问卷' }}</a>
			<a v-on:click="goNav('setup')" href="javascript:void(0);" class="ui-btn">下一步</a>
		</div>

	</div>
</div>
</template>

<script>

export default {
  data () {
    return {

    	//是否添加描述
      isDescription : false,

      //边栏fixed
      barFixed : false,

      //全屏
    	fullScreenSw : false,

      //切换皮肤设置
    	skinNavSetup : true

    }
  },

  computed : {

  	//问卷数据
    surveyData : function(){
      return this.$store.getters.getSurveyData
    },

    //问卷设置 
  	surveySetup : function(){
      return this.$store.getters.getSurveySetup;
    }

  },

	created : function(){

  },

  mounted : function() {

    //==================== 边栏fixed
    var t = this;
    window.onscroll = function(){ 
      document.body.scrollTop >= 80 ? t.barFixed = true : t.barFixed = false;
    }

  },

  methods : {

  	//==================== 跳转
  	goNav : function(name){
  		var query = this.surveyData.id ? { id: this.surveyData.id } : {};
  		this.$router.push({ name: name, query: query });
  	},

  	//==================== 投票前显示票数、投票按钮、题型编号
  	otherSetup : function(key){
  		var vg;
  		this.surveySetup[key] ? vg = 0 : vg = 1;
  		this.updataSetupKey(vg, key);
  	},

  	//==================== 上传头图
  	headerImg : function(v){
  		this.changeSkin(-1);
  		this.updataSetupKey(v.img, 'article_header_img');
  	},

  	//==================== 上传背景
  	bgImg : function(v){
  		this.changeSkin(-1);
  		this.updataSetupKey(v.img, 'article_background');
  	},

  	//==================== 更新字段
  	updataSetupKey : function(val,key){

  		var Article = {
  			article_id : this.surveySetup.article_id,
  		};

      Article[key] = val;

  		this.$http.post(this.$store.getters.getAjaxUrl + 'article/create/',{ Article : Article },{
        headers : {
          'token' : this.$store.getters.getToken
        },
        emulateJSON : true
      })
      .then(function(response) {
        if(response.data.code === 200){

          this.$store.dispatch('updataSurveySetupKey',{
						key : key,
						val : val
					});

        }else{
          this.$store.dispatch('updataPopupTips',{
            text : response.data.message,
            display : true,
            se : response.data.code
          });
        }
      }, 
      function(response) {
        alert('服务出错了，请联系管理员');
        console.log(response);
      });
  	},

  	//==================== 切换皮肤
  	changeSkin : function(id){
  		this.$store.dispatch('updataSurveySetupKeyAjax',{
  			key : 'article_templates',
  			val : id
  		})
  	}

  }
}
</script>

<style lang="less">
@import './../base.less';

#skin {
  position: relative; padding-right: 160px; background: #f5f5f5;  overflow-x: hidden; .transitionDuration(.3s);

  .skin-main {
	  position: relative; min-height: 700px;

	  .top-bar {
	  	position: absolute; left: 0; top: 0; width: 100%; height: 50px; background-color: #fff;

	  	.show-btn {
	  		display: inline-block; margin-left: 50px; height: 50px; line-height: 50px; color: #b2b2b2; font-size: 14px; vertical-align: middle;

	  		s {
	  			display: inline-block; margin-right: 10px; height: 50px; vertical-align: middle;
	  		}

	  		&.pc{

	  			s {
	  				width: 37px; .imagesIcon(-211px -119px);
	  			}
	  		}

	  		&.pc.select,
	  		&.pc:hover {
	  			color: #1569ee; 

  				s {
  					.imagesIcon(-211px -172px);
  				}
	  		}

	  		&.phone {

	  			s {
	  				width: 19px; .imagesIcon(-266px -117px);
	  			}
	  		}

	  		&.phone.select,
	  		&.phone:hover {
	  			color: #1569ee; 

  				s {
  					.imagesIcon(-266px -170px);
  				}
	  		}
	  	}

	  	.f-btn {
	  		position: absolute; right: 0; top: 0; display: inline-block; width: 48px; height: 50px;

	  		&.full-screen {
	  			.imagesIcon(-162px 0); 
	  		}

	  		&.no-full-screen {
	  			.imagesIcon(-197px 0);
	  		}
	  	}

	  	&.bar-fixed {
	  		position: fixed; left: 0; top: 0; z-index: 1; width: 100%; padding-right: 160px; box-sizing: border-box;

	  		.f-btn {
	  			right: 160px;
	  		}
	  	}
	  }
	}

	.skin-setup {
		position: absolute; right: 0; top: 0; width: 160px; background: #f5f5f5; .transitionDuration(.3s);

		.setup-nav {
			height: 30px; 

			li {
				float: left; width: 50%; background-color: #fff; line-height: 30px; text-align: center; color: #808080; cursor: pointer;

				&.select {
					background-color: #f4f5f5; color: #4c4c4c; font-weight: bold;
				}
			}
		}

		.setup-main {

			&.select-skin {
				padding: 0 16px; 

				.setup-checkbox {
					padding: 20px 0;

					.ui-checkbox {
						margin-bottom: 8px; font-size: 12px; color: #808080;
					}
				}

				.select-skin {

					li {
						position: relative; margin-bottom: 10px; padding: 1px; border: 4px solid #f5f5f5; cursor: pointer; .transitionDuration(.2s);

						img {
							display: block; width: 120px; height: 90px;
						}

						&:hover {
							border-color: #ddd;
						}

						&.select {
							border-color: #f1b616; cursor: default;

							s {
								position: absolute; right: -1px; bottom: 0; display: block; width: 26px; height: 26px; .imagesIcon(-7px -388px); background-color: #f1b616;
							}
						}
					}
				}
			}

			&.diy-skin {

				.diy-box {
					margin-top: 35px;

					.tit {
						position: relative; line-height: 40px; text-align: center;

						span {
							position: relative; z-index: 1; display: inline-block; padding: 0 6px; background: #f5f5f5; font-size: 12px; color: #808080; 
						}

						s {
							position: absolute; left: 0; top: 20px; display: block; width: 100%; height: 1px; background: #ccc; overflow: hidden;
						}
					}

					.con {
						padding: 0 20px;

						cite {
							display: block; line-height: 20px; font-size: 12px; color: #808080; text-align: center;
						}

						input[type='text'] {
							width: 100%; height: 28px; border: 1px solid #ccc; border-radius: 3px; line-height: 28px; box-sizing: border-box; font-size: 12px;
						}

						.head-img-h {
							position: relative;

							input[type='text'] {
								margin-bottom: 10px; padding: 0 35px 0 10px; text-align: center;
							}

							span {
								position: absolute; right: 0; top: 0; display: block; width: 35px; line-height: 25px; text-align: center; font-size: 12px; color: #4c4c4c;
							}
						}

						.head-img-bg {
							position: relative;

							input[type='text'] {
								margin-bottom: 10px; padding: 0 10px 0 40px;
							}

							span {
								position: absolute; left: 0; top: 0; display: block; width: 25px; line-height: 28px; text-align: center; font-size: 12px; color: #4c4c4c;
							}
						}

						.add-img {
			        position: relative; display: inline-block; margin-bottom: 10px; width: 100%; height: 78px; border: 1px dashed #808080; border-radius: 3px; .transitionDuration(.2s); vertical-align: middle; cursor: pointer;

			        s {
			          position: absolute; left: 50%; top: 50%; display: block; margin: -13px 0 0 -13px; width: 26px; height: 26px; .imagesIcon(-323px -183px); 
			        }

			        &:hover {
			          border-color: #3ca3f7;
			        }
			      }
					}
				}	
			}
		}

		.setup-btn {
			padding-top: 30px;

			.ui-btn {
				margin: 0 auto 10px auto; .btn-style(120px,30px,#0c53ab,#fff); display: block; 
			}
		}

		&.bar-fixed {
			position: fixed; z-index: 1;
		}
	}

	&.skin-full-screen {
		padding-right: 0;

		.skin-main {

			.top-bar {

				.f-btn {
					right : 0;
				}
			}
		}

		.skin-setup {
			right: -160px; 
		}
	}
}

// 皮肤
#sk_0 {

	.skin-body {
		background: #faf9f7 url(http://himg2.huanqiu.com/survey/sk_1.png) no-repeat center 100px; padding: 150px 0 0 0;

		.form-header {
			padding-top: 0;
		}
	}
}

#sk_1 {

	.skin-body {
		background: #5975c4 url(http://himg2.huanqiu.com/survey/sk_2.jpg) no-repeat center top; padding: 270px 0 0 0;
		
		.skin-inner {

			.form-header {
				padding-top: 0;

				cite {
					padding: 0 50px;

					.l,
					.r {
						position: absolute; top: 2px; display: block; width: 25px; height: 25px;
					}

					.l {
						left: 0; background: url(http://himg2.huanqiu.com/survey/skin_default_icon.png) no-repeat 0 -36px;
					}

					.r {
						right: 0; background: url(http://himg2.huanqiu.com/survey/skin_default_icon.png) no-repeat -26px -35px;
					}
				}
			}

			.form-box {

				.tit {
					background-color: #eff1f2;

					.no {
						background-color: #fabf1b; 
					}
				}
			}
		}
	}
}

#sk_2 {

	.skin-body {
		background: #fcf8d9 url(http://himg2.huanqiu.com/survey/sk_3.jpg) no-repeat center top; padding: 230px 0 0 0;
		
		.skin-inner {
			padding: 0 5px 5px 5px; width: 989px;

			.form-header {
				padding-top: 0;

				strong {
					color: #ba3030;
				}
				
				cite {
					padding: 0 50px;

					.l,
					.r {
						position: absolute; top: 2px; display: block; width: 25px; height: 25px;
					}

					.l {
						left: 0; background: url(http://himg2.huanqiu.com/survey/skin_default_icon.png) no-repeat 0 -36px;
					}

					.r {
						right: 0; background: url(http://himg2.huanqiu.com/survey/skin_default_icon.png) no-repeat -26px -35px;
					}
				}
			}

			.form-box {
				background-color: #fff;

				.tit {
					background-color: #f8f8f7;

					.no {
						background-color: #b42c2c; 
					}
				}
			}
		}

		.temp-inner {
			padding: 0 50px; border: 5px solid #faf8e8; border-top: 0;
		}
	}
}

.skin-body {
	background: #faf9f7; padding: 0;
	
	.skin-inner {
		margin: auto; padding: 0 40px; width: 919px; min-height: 1000px; background-color: #fff;

		.form-header {
			padding-top: 50px; margin: 20px 0 70px 0; color: #656c70;

			strong {
				display: block; margin-bottom: 20px; text-align: center; font-size: 30px;
			}

			cite {
				position: relative; display: block; font-size: 14px; line-height: 22px;
			}
		}
	}
}

.skin-show {
	padding-top: 50px;
	
	.form-box {
		padding-top: 20px; margin-bottom: 30px; background-color: #fafcfc;

		.tit {
			position: relative; padding: 0 50px 0 0; margin-bottom: 2px; height: 40px; line-height: 40px; background-color: #fafafa; font-size: 16px; color: #706b65; font-weight: bold; .omit(); display: block;

			.no {
				float: left; width: 40px; height: 40px; border-right: 2px solid #fff; background-color: #808080; line-height: 40px; text-align: center; color: #fff; font-size: 16px;
			}

			.title {
				float: left; padding-left: 15px; height: 40px; line-height: 40px; 
			}

			.must {
				margin-left: 20px; height: 40px; line-height: 40px; text-align: center; color: #d97023; font-size: 12px; font-weight: normal;
			}
		}

		.subtitle {
			padding: 12px 0; margin: 0 40px; border-bottom: 1px dotted #b4bfc4; font-size: 12px; color: #9ea4a6; line-height: 20px;
		}

		.value {
			padding: 25px 40px 20px 40px;

			.form-radio,
			.form-checkbox {

				.ui-radio,
				.ui-checkbox {
					position: relative; margin-bottom: 5px; padding: 0 10px; height: 35px; line-height: 35px; cursor: pointer; font-size: 14px; color: #656a70; .omit(); display: block; 

					.title {
						font-weight: bold; color: #656a70;
					}

					.desc span,	
					.vote-num {
						margin-left: 2px; padding: 0 8px; display: inline-block; border-left: 1px solid #dfe0e0; color: #9ea4a6; font-size: 14px; line-height: 14px;
					}

					.vote-num {
						color: #ff0000;
					}

					&:hover {
						background-color: #f4f4f4;
					}

					&.select {
						background-color: #f2f1ef; cursor: default;
					}
				}
			}

			.ui-radio {

			  .icon {
			     position: relative; display: inline-block; margin-right: 5px; width: 16px; height: 16px; background: url(http://himg2.huanqiu.com/survey/skin_default_icon.png) no-repeat -17px 0; border: 0; vertical-align: middle;
			  }

			  &.select {

			    .icon {
			      background: url(http://himg2.huanqiu.com/survey/skin_default_icon.png) no-repeat -1px 0;
			    }
			  }
			}

			.ui-checkbox {

			  .icon {
			     position: relative; display: inline-block; margin-right: 5px; width: 16px; height: 16px; background: url(http://himg2.huanqiu.com/survey/skin_default_icon.png) no-repeat -17px -16px; border: 0; vertical-align: middle;
			  }

			  &.select {

			    .icon {
			      background: url(http://himg2.huanqiu.com/survey/skin_default_icon.png) no-repeat -1px -16px;
			    }
			  }
			}

			.form-img-checkbox,
			.form-img-radio {
				margin-right: -20px; overflow: hidden;

				.ui-img-checkbox,
				.ui-img-radio {
					float: left; margin: 0 20px 20px 0; cursor: pointer;

					.options-img {
	          position: relative; width: 120px; overflow: hidden;

	          img {
	            display: block; width: 120px; height: 120px;
	          }

	          .sel {
	          	height: 25px; background-color: #eff1f2; text-align: center;

	          	.icon {
	          		display: inline-block; width: 16px; height: 16px; background: url(http://himg2.huanqiu.com/survey/skin_default_icon.png) no-repeat -17px 0; vertical-align: middle;
	          	
	          		&.checkbox {
	          			background: url(http://himg2.huanqiu.com/survey/skin_default_icon.png) no-repeat -17px -16px;
	          		}
	          	}
	          }

	          &:hover {

	          	.sel {
		          	background-color: #e8ebec;
		          }

	          }
	        }

	        .title,
	        .vote-num,
	        .desc {
	        	display: block; padding-top: 10px; width: 120px; text-align: left; font-size: 12px; color: #9ea4a6; 
	        }

	        .desc {
	        	word-wrap: break-word; 
	        }

	        .vote-num {
						color: #ff0000;
					}

	        .title {
	        	min-height: 18px; .omit(); display: block; font-size: 14px; font-weight: bold; color: #656a70;
	        }

	        &:hover {

	        	.options-img {
	        		border-color: #d4e0f3;
	        	}
	        }

	        &.select {
	        	cursor: default;

	        	.options-img {
	        		border-color: #cd744d;

	        		.sel {
	        			
	        			.icon {
	        				background: url(http://himg2.huanqiu.com/survey/skin_default_icon.png) no-repeat -1px 0;
	        			}
	        		}
	        	}
	        }
				}

				&.add-description {

					.ui-img-radio {
						display: block; margin: 0 0 20px 0; float: inherit; overflow: hidden;
					}

					.options-img {
            float: left; 
          }

          .options-info {
          	padding-left: 10px; overflow: hidden;

          	.title,
          	.desc {
          		padding: 0 0 10px 0; width: auto;
          	}
          }

				}
			}
		}
	}

	.form-page,
	.survey-post {
		margin-bottom: 30px; background-color: #fff; text-align: center;

		a {
			.btn-style(118px,38px,#f7f7f7,#706b65); margin-right: 20px; border-radius: 3px; cursor: pointer; border: 1px solid #e1deda; font-weight: bold;
		
			&.disabled {
				background-color: #fff; border-color: #f2f1ef; color: #c8c7c6; cursor: default;
			}	
		}
	}

	.survey-post {
		margin-top: 50px;
	}

	.hq-b {
		padding: 60px 0 30px 0; font-size: 12px; color: #4d4d4d;  text-align: center;
	}

	.btn-vote {
		display: none;
	}

	//投票
	&#vote {

		.btn-vote {
			.btn-style(78px,28px,#f7f7f7,#706b65); border-radius: 3px; cursor: pointer; border: 1px solid #e1deda;
		}

		.ui-radio .icon,
		.ui-checkbox .icon{
			background: url(http://himg2.huanqiu.com/survey/skin_default_icon.png) no-repeat -36px -1px;
		}

		.ui-radio,
		.ui-checkbox {

			.btn-vote {
				position: absolute; right: 2px; top: 3px; 
			}
		}

		.ui-img-radio {

			.sel {
				background-color: #fafcfc;

				.icon {
					display: none;
				}
			}

			.btn-vote {
				position: absolute; left: 20px; bottom: 10px; 
			}
		}


	}
}

.end-text {
  position: relative; padding: 30px 0; background-color: #fff; text-align: center; color: #4c4c4c;

  .en {
    position: relative; z-index: 1; display: inline-block; padding: 0 25px; background-color: #fff; font-family: 'times new roman', Arial; font-style: italic; font-size: 40px;
  }

  .cn {
    font-size: 24px;
  }

  .border {
    position: absolute; left: 50%; top: 60px; margin-left: -163px; width: 326px; height: 1px; background-color: #e5e5e5; overflow: hidden;
  }
}

</style>
