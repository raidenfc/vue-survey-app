<template>
<div id="setup">
	<div class="setup-inner">

		<div class="setup-box voting-rules">
			<div class="tit">规则设置</div>
			<div class="con">
				<div class="bl">
					<span class="ui-switch" v-on:click="updataSetupKey((surveySetup.article_overt === 0 ? 1 : 0),'article_overt')" v-bind:class="{ off : surveySetup.article_overt === 1 }">
						<span class="sw"></span>
					</span>
					<span class="tx">所有人可参与该调查<cite>（如果关闭，则只有登录环球网通行证才可参与）</cite></span>
				</div>
				
				<div class="bl">
					<span class="ui-switch" v-on:click="updataSetupKey((surveySetup.artilce_limit_type === 0 ? 1 : 0),'artilce_limit_type')" v-bind:class="{ off : surveySetup.artilce_limit_type != 0 }">
						<span class="sw"></span>
					</span>
					<span class="tx">每个IP仅限填写一次</span>
				</div>

				<div class="bl" v-show="surveySetup.artilce_limit_type != 0 && surveyData.type == 4">
					<select v-on:input="updataSetupKey(parseInt($event.target.value),'artilce_limit_type')" class="ui-select">
						<option value="1" v-bind:selected="surveySetup.artilce_limit_type === 1 ? 'selected' : ''">每道题</option>
						<option value="2" v-bind:selected="surveySetup.artilce_limit_type === 2 ? 'selected' : ''">每个选项</option>
						<option value="3" v-bind:selected="surveySetup.artilce_limit_type === 3 ? 'selected' : ''">整体</option>
					</select>

					<select v-on:input="updataSetupKey(parseInt($event.target.value),'article_limit_type_time')" class="ui-select">
						<option value="0" v-bind:selected="surveySetup.article_limit_type_time === 0 ? 'selected' : ''">每天</option>
						<option value="1" v-bind:selected="surveySetup.article_limit_type_time === 1 ? 'selected' : ''">每小时</option>
					</select>

					<span class="tx">可投</span>

					<select v-on:input="updataSetupKey(parseInt($event.target.value),'article_limit_type_count')" class="ui-select">
						<option value="1" v-bind:selected="surveySetup.article_limit_type_count === 1 ? 'selected' : ''">1</option>
						<option value="5" v-bind:selected="surveySetup.article_limit_type_count === 5 ? 'selected' : ''">5</option>
						<option value="10" v-bind:selected="surveySetup.article_limit_type_count === 10 ? 'selected' : ''">10</option>
					</select>

					<span class="tx">次</span>
				</div>
				
			</div>
		</div>

		<div class="setup-box after-submission">
			<div class="tit">其他设置</div>
			<div class="con">
				
				<div class="bl" v-show="surveyData.type == 4">
					<span class="ui-switch" v-on:click="updataSetupKey((surveySetup.article_show_report === 0 ? 1 : 0),'article_show_report')" v-bind:class="{ off : surveySetup.article_show_report === 0 }">
						<span class="sw"></span>
					</span>
					<span class="tx">提交后显示投票结果</span>
				</div>

				<div class="bl">
					<span class="ui-switch" v-on:click="updataSetupKey((surveySetup.article_dumpurl === '' ? 'http://' : ''),'article_dumpurl')" v-bind:class="{ off : !urlShow }">
						<span class="sw"></span>
					</span>
					<span class="tx">提交{{ surveyData.type == 4 ? '投票' : '问卷' }}后跳转网址</span>
				</div>

				<span v-show="urlShow" class="ui-tit-input">
					<input type="text" placeholder="http://" v-bind:value="surveySetup.article_dumpurl" v-on:blur="updataSetupKey($event.target.value,'article_dumpurl')">
				</span>
			</div>
		</div>

		<div class="setup-box question-time">
			<div class="tit">时间设置</div>
			<div class="con">
				<div class="bl">
					<span class="ui-radio" v-on:click="clearTime" v-bind:class="{ select : surveySetup.article_time_begin === '未设置' && surveySetup.article_time_end === '未设置' }"><span class="icon"><s></s></span>暂不发布</span> 
				</div>

				<div class="bl">
					<span class="ui-radio" v-on:click="setupTime" v-bind:class="{ select : surveySetup.article_time_begin != '未设置' && surveySetup.article_time_end != '未设置' }"><span class="icon"><s></s></span>发布时间</span> 
				</div>

				<div v-show="surveySetup.article_time_begin != '未设置' && surveySetup.article_time_end != '未设置'" class="bl">

					<span class="begin">
						<el-date-picker v-on:change="updataSetupKey(returnDate(bTimeVal), 'article_time_begin')" v-model="bTimeVal" type="datetime" placeholder="选择开始时间"></el-date-picker>
						<!-- <span class="t">开始时间</span> -->
						<!-- <span class="icon"></span> -->
					</span>

					<span class="end">
						<el-date-picker v-on:change="updataSetupKey(returnDate(eTimeVal), 'article_time_end')" v-model="eTimeVal" type="datetime" placeholder="选择结束时间"></el-date-picker>
						<!-- <span class="t">结束时间</span> -->
						<!-- <span class="icon"></span> -->
					</span>
				</div>

			</div>
		</div>

		<div class="btn-box">
			<a href="#/skin" class="ui-btn cancel">上一步</a>
      <a v-on:click="saveSetup" href="javascript:void(0);" class="ui-btn save">保存</a>
		</div>

	</div>
</div>
</template>

<script>

export default {
  data () {
    return {

    	eTimeVal : '',

    	bTimeVal : ''

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
    },

    //网址开关
    urlShow : function(){
    	return this.surveySetup.article_dumpurl === '' ? false : true;
    },

    //开始时间
    bTime : function(){
  		return this.surveySetup.article_time_begin;
    },

    //结束时间
    eTime : function(){
  		return this.surveySetup.article_time_end;
    }

  },

  created : function(){

  },

  mounted : function(){

  	//设置初始时间
  	var t = this;
  	setTimeout(function(){
  	  sessionStorage.setItem('bTimeVal', t.bTime === '未设置' ? '' : t.bTime);
	  	t.bTimeVal = sessionStorage.getItem('bTimeVal');

	  	sessionStorage.setItem('eTimeVal', t.eTime === '未设置' ? '' : t.eTime);
	  	t.eTimeVal = sessionStorage.getItem('eTimeVal');
  	}, 500);
  },

  methods : {

  	//设置时间
  	returnDate : function(e){
  		if(e != '' && e != '未设置'){
  			var date = new Date(e);
	  		var year = date.getFullYear();
	  		var month = date.getMonth() + 1;
	  		var day = date.getDate();
	  		var hour = date.getHours();
	  		var minutes = date.getMinutes();
	  		var seconds = date.getSeconds();

	  		return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;
  		}else{
  			return e;
  		}
  	},

  	//更新字段
  	updataSetupKey : function(val,key){
			this.$store.dispatch('updataSurveySetupKey',{
				key : key,
				val : val
			})
  	},

  	//清空时间
  	clearTime : function(){
  		this.$store.dispatch('updataSurveySetupKey',{
				key : 'article_time_begin',
				val : '未设置'
			})
  		this.$store.dispatch('updataSurveySetupKey',{
				key : 'article_time_end',
				val : '未设置'
			})
  	},

  	//设置时间
  	setupTime : function(){
  		this.$store.dispatch('updataSurveySetupKey',{
				key : 'article_time_begin',
				val : ''
			})
  		this.$store.dispatch('updataSurveySetupKey',{
				key : 'article_time_end',
				val : ''
			})
  	},

  	//保存设置
  	saveSetup : function(){

  		var Article = this.surveySetup;

  		this.$http.post(this.$store.getters.getAjaxUrl + 'article/create/',{ Article : Article },{
        headers : {
          'token' : this.$store.getters.getToken
        },
        emulateJSON : true
      })
      .then(function(response) {
        if(response.data.code === 200){

        	//路由跳转
      		this.$router.push({ name: 'publish' });

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


  }
}
</script>

<style lang="less">
@import './../base.less';

.setup-inner {
	padding: 40px 0; margin: auto; width: 600px;

	.setup-box {
		position: relative; padding: 30px 0 30px 75px; border-bottom: 1px dotted #b4bfc4;

		.tit {
			position: absolute; left: 0; top: 30px; width: 60px; font-size: 14px; color: #808080; text-align: right;
		}

		.con {

			.ui-switch {
				margin-right: 5px; vertical-align: middle;
			}

			.ui-select {
				margin-right: 3px;
			}

			.tx {
				margin-right: 3px; vertical-align: middle;

				cite {
					color: #b2b2b2;
				}
			}

			.bl {
				margin-bottom: 15px;
			}
		}
	}

  .btn-box {
  	padding-top: 26px; text-align: right;

	  .ui-btn {
	    .btn-style(80px,34px);

	    &.cancel {
	      .btn-style(80px,34px,#f7faf5,#808080); margin-right: 5px;
	    }
	  }
	}

	.begin,
	.end {
		display: block; margin-bottom: 15px;
	}
}


</style>
