<template>
<div id="publish">
	<div class="publish-box">
		<strong>嵌入网站</strong>
		<cite>复制下边的代码，粘贴到你网页中的任意位置,问卷将出现在你的网页中。如果你的网站使用了模板，你也可以粘帖代码到模板中。</cite>
		<span class="ui-textarea">
			<textarea v-bind:id="sid" class="code-s">{{ 'http://' + host + '/v2/hqSurveyMain.js?id=' + surveyData.id }}</textarea>
		</span>
		<a class="copy-code-s ui-btn" v-on:click="copy(sid)" href="javascript:void(0);">复制代码</a>	
	</div>

	<div class="publish-box">
		<strong>访问地址</strong>
		<span class="ui-text">
			<input v-bind:id="cid" class="code-y" type="text" v-bind:value="surveyData.type == 3 ? 'http://' + host + '/v2/survey/survey_hq/' + surveyData.id : 'http://' + host + '/v2/hqSurvey.html?id=' + surveyData.id">
		</span>
		<a class="copy-code-y ui-btn" v-on:click="copy(cid)" href="javascript:void(0);">复制</a>	
	</div>

<!-- 	<div class="publish-box">
		<strong>用手机微信扫一扫二维码分享给你的朋友</strong>
		<div class="ewm">
			<img src="http://himg2.huanqiu.com/attachment2010/2017/0601/14/22/20170601022237820.jpg">
		</div>
	</div> -->

</div>
</template>

<script>

export default {
  data () {
    return {

    	host : window.location.host,

    	sid : 'cJs',

    	cid : 'cHtml'

    }
  },

  computed : {

  	//问卷数据
    surveyData : function(){
      return this.$store.getters.getSurveyData;
    },

    //问卷设置 
  	surveySetup : function(){
      return this.$store.getters.getSurveySetup;
    }

  },

	created : function(){


  },

  methods : {

  	//复制
  	copy : function(e){
  		var $dom = document.getElementById(e);
  		$dom.select();
  		document.execCommand("Copy");
  		this.$store.dispatch('updataPopupTips',{
        text : '复制成功',
        display : true
      });
  	}
    
  }
}
</script>

<style lang="less">
@import './../base.less';

#publish {
	margin: 60px auto; width: 600px;

	.publish-box {
		position: relative; margin-bottom: 20px; padding-bottom: 30px; border-bottom: 1px dotted #b4bfc4;

		strong {
			display: block; margin-bottom: 10px; font-size: 24px; color: #4c4c4c; font-weight: normal;
		}

		cite {
			display: block; margin-bottom: 10px; width: 450px; color: #808080; line-height: 22px;
		}

		.ui-textarea {
			width: 100%;
		}

		.code-s {
			padding: 10px; height: 110px; font-size: 12px; line-height: 20px;
		}

		.code-y {
			padding: 10px; width: 380px; height: 32px; line-height: 32px; font-size: 12px;
		}

		.copy-code-s {
			position: absolute; right: 0; top: 55px; .btn-style(100px,33px,#90cd66,#fff);
		}

		.copy-code-y {
			position: absolute; left: 379px; top: 46px; .btn-style(80px,32px,#90cd66,#fff); border-radius: 0 3px 3px 0;
		}

		.ewm {
			padding: 10px; width: 128px; height: 128px; border: 1px solid #ccc;

			img {
				display: block; width: 128px; height: 128px;
			}
		}

		&:nth-child(3){
			border: 0;
		}
	}
}

</style>
