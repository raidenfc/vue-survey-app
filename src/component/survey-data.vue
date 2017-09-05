<template>
<div id="data">

	<div id="header">
    <div class="logo">
      <router-link to="/">
        <div class="tit"></div>
      </router-link>
    </div>
    <div class="nav">
      <ul class="clearfix">
        <li class="survey-data">
        	<a href="javascript:void(0);">
        		<div class="con">
	            <span class="icon"></span>
	            <span class="text">修改数据</span>
	          </div>
	          <s></s>
        	</a>
        </li>
      </ul>
    </div>  
  </div>
	
	<div class="skin-main">

		<div class="skin-show" v-bind:id="surveyData.type == 4 ? 'vote' : ''">

			<div class="skin-body">

				<div class="skin-inner">

					<div class="temp-inner">

						<div class="form-header">
							<strong>{{ surveyData.title }}</strong>
							<cite v-show="surveyData.desc">{{ surveyData.desc }}<s class="l"></s><s class="r"></s></cite>

				<!-- 			<span class="vote-data">
								<span class="vote-real">真实总票数：232</span>
								<input class="vote-add" type="number" maxlength="30" placeholder="添加">
							</span> -->
						</div>

						<div v-for="(item, index) in surveyData.questions" v-bind:class="{ 'form-box' : item.types != 8 }">
							
							<div v-show="item.types != 8" class="tit">
								<span class="no">{{ index + 1 }}</span>
								<span v-bind:title="item.title" class="title">{{ item.title }}</span>
								<span class="must" v-show="item.must">必填</span>
							</div>

							<div v-show="item.subtitle" class="subtitle">{{ item.subtitle }}</div>

							<!-- 单选题 -->
							<div v-if="item.types == 0 || item.types === '15'" class="value">
								<div class="form-radio">
									<div v-for="answer in item.answers" class="ui-radio">
										<span class="icon"></span>
										<span class="title">{{ answer.title }}</span>

										<span class="vote-data">
											<span class="vote-real">真实票数：{{ answer.count - answer.add_count }}</span>
											<span class="vote-updata">修改票数：{{ answer.add_count }}</span>
											<input class="vote-add" v-on:blur="updataVote($event, answer.id)" type="number" maxlength="30" placeholder="修改">
										</span>
									</div>
								</div>
							</div>

							<!-- 多选题 -->
							<div v-else-if="item.types == 1" class="value">
								<div class="form-checkbox">
									<div v-for="answer in item.answers" class="ui-checkbox">
										<span class="icon"></span>
										<span class="title">{{ answer.title }}</span>
										
										<span class="vote-data">
											<span class="vote-real">真实票数：{{ answer.count - answer.add_count }}</span>
											<span class="vote-updata">修改票数：{{ answer.add_count }}</span>
											<input class="vote-add" v-on:blur="updataVote($event, answer.id)" type="number" maxlength="30" placeholder="修改">
										</span>
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
										</div>

										<div class="options-info">
											<div v-bind:title="answer.title" class="title">{{ answer.title }}</div>
											
											<span class="vote-data">
												<span class="vote-real">真实票数：{{ answer.count - answer.add_count }}</span>
												<span class="vote-updata">修改票数：{{ answer.add_count }}</span>
												<input class="vote-add" v-on:blur="updataVote($event, answer.id)" type="number" maxlength="30" placeholder="修改">
											</span>
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
										</div>

										<div class="options-info">
											<div v-bind:title="answer.title" class="title">{{ answer.title }}</div>
											
											<span class="vote-data">
												<span class="vote-real">真实票数：{{ answer.count - answer.add_count }}</span>
												<span class="vote-updata">修改票数：{{ answer.add_count }}</span>
												<input class="vote-add" v-on:blur="updataVote($event, answer.id)" type="number" maxlength="30" placeholder="修改">
											</span>
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

						<!-- 版权所有 -->
						<div class="hq-b">© 环球网  版权所有</div>
					</div>

				</div>

			</div>

		</div>
	</div>
</div>
</template>

<script>

export default {
  data () {
    return {

    }
  },

  computed : {

  	//问卷数据
    surveyData : function(){
      return this.$store.getters.getSurveyData;
    },

    //id
    getId : function(){
      return parseInt(this.getUrlCs('id'));
    },

  },

	created : function(){

		//==================== 获取编辑问卷
    if(this.getId && this.surveyData.id === ''){
      this.$http({
        method: 'get',
        url: this.$store.getters.getAjaxUrl + 'info/' + this.getId,
        data: {},
        headers: { 'token' : this.$store.getters.getToken },
        emulateJSON: true
      })
      .then(function(response) {
        if(response.data.code === 200){

          //获取问卷数据
          var obj = {
            id : response.data.data.ID,
            title : response.data.data.title,
            desc : response.data.data.intro,
            edit : true,
            type : response.data.data.type,
            questions : response.data.data.questions
          };

          //设置 tempId、edit
          obj.questions.forEach(function(item, i){
            item.tempId = item.id;
            item.edit = false;
          });

          //保存问卷数据
          this.$store.dispatch('surveyDataSync', obj);
       
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
    }

  },

  mounted : function() {

  },

  methods : {

  	//修改投票数
  	updataVote : function(e, id){

  		var Answer = {
  			answer_add_count : e.target.value
  		}

  		this.$http.post(this.$store.getters.getAjaxUrl + 'answer/update/' + id,{ Answer : Answer },{
        headers : {
          'token' : this.$store.getters.getToken
        },
        emulateJSON : true
      })
      .then(function(response) {
        if(response.data.code === 200){

        	var $prev = e.target.previousSibling.previousSibling;
        	$prev.innerHTML = '修改票数：' + e.target.value;

        }else{
          store.dispatch('updataPopupTips',{
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

  	//url参数
    getUrlCs : function(e){
      var url = window.location.href;
      var val = "";
      if(url.indexOf("?") > -1){
          var en = url.split("?")[1];
          var wn = en.split("&");
          for(var i=0;i<wn.length;i++){
              if(wn[i].split("=")[0] === e){
                  val = wn[i].split("=")[1];
                  break;
              }
          }
      }
      return val;
    }

  }
}
</script>

<style lang="less">
@import './../base.less';

#header {
  position: relative; z-index: 1; padding-right: 20px; height: 80px; background: url(http://himg2.huanqiu.com/survey/top_bg.jpg) no-repeat top;

  .logo {
    position: absolute; left: 0; top: 0; padding-left: 25px; height: 80px;

    .img {
      display: inline-block; margin-left: -15px; width: 110px; height: 80px; background: url(http://himg2.huanqiu.com/survey/logo_img.png) no-repeat 0 -11px; 
    }

    .tit {
      display: inline-block; width: 116px; height: 80px; .imagesIcon(-204px -42px); 
    }
  }

  .nav {
    position: absolute; left: 50%; top: 0; margin-left: -55px;

    li {
      float: left; position: relative; width: 109px; height: 80px;

      a {
        display: block; width: 110px; height: 80px; text-align: center;

        .con {
          position: absolute; top: 20px; left: 0; width: 110px; height: 40px; border-left: 1px solid #1c60b9;

          .icon {
            position: absolute; top: -10px; left: 36px; display: block; width: 40px; height: 35px;
          }

          .text {
            position: absolute; top: 27px; left: 0; display: block; width: 110px; font-size: 14px; color: #5691e8;
          }
        }
      }

      &.select {

        .con {

          .text {
            color: #a7cbff; font-weight: bold;
          }
        }

        s {
           position: absolute; left: 44px; bottom: -10px; display: block; width: 20px; height: 10px; .imagesIcon(-244px -20px);
        }
      }

      &.survey-data {

        .icon {
          .imagesIcon(-328px -290px);
        }

        .con {
          border-right: 1px solid #1c60b9; border-left: 1px solid #1c60b9;
        }
      }
    }
  }
}

#data {
  position: relative; 

  .skin-main {
	  position: relative;
	}
}

.skin-body {
	
	.skin-inner {
		margin: auto; padding: 0 40px; width: 919px; background-color: #fff;

		.form-header {
			padding-top: 50px; margin: 20px 0 70px 0; color: #656c70;

			strong {
				display: block; margin-bottom: 20px; text-align: center; font-size: 30px;
			}

			cite {
				position: relative; display: block; font-size: 14px; line-height: 22px;
			}

			.vote-data {

				.vote-real {
					margin-right: 20px;
				}
			}
		}
	}
}

.vote-data {
	font-size: 14px;

	.vote-add {
		padding: 0 0 0 10px; width: 80px; height: 24px; line-height: 24px; border: 1px solid #ccc; border-radius: 3px; text-align: center; .transitionDuration(.2s);
	
		&:hover {
      border: 1px solid #8cd5ff;
    }

    &:focus {
      border: 1px solid #00a2ff; box-shadow: 0 0 6px 0 rgba(0, 162, 255, 0.4); 
    }
	}
}

.skin-show {
	
	.form-box {
		padding-top: 20px; margin-bottom: 30px;

		.tit {
			position: relative; padding: 0 50px 0 0; margin-bottom: 2px; height: 40px; line-height: 40px; background-color: #eff1f2; font-size: 16px; color: #706b65; font-weight: bold; .omit(); display: block;

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

					.vote-data {
						position: absolute; right: 0; top: 0; 

						.vote-add,
						.vote-updata {
							margin-left: 20px; 
						}
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

				.vote-data {

					.vote-real {
						margin: 15px 0; display: block;
					}

					.vote-updata {
						margin: 0 0 15px 0; display: block;
					}
				}

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

</style>
