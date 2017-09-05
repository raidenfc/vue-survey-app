<template>
  <div id="header">
    <div class="logo">
      <router-link to="/">
        <div class="tit"></div>
      </router-link>
    </div>
    <div class="nav">
      <ul class="clearfix">

        <li v-bind:class="{ select : $route.name === 'new' }" class="survey-create">
          <a v-on:click="navGoto('new')">
            <div class="con">
              <span class="icon"></span>
              <span class="text">{{ surveyData.edit ? '编辑' : '创建' }}{{ surveyData.type == 4 ? '投票' : '问卷' }}</span>
            </div>
          </a>
          <s></s>
        </li>
        
        <li v-bind:class="{ select : $route.name === 'skin', disabled : !navSw }" class="survey-skin">
          <a v-on:click="navGoto('skin')">
            <div class="con">
              <span class="icon"></span>
              <span class="text">选择皮肤</span>
            </div>
          </a>
          <s></s>
        </li>

        <li v-bind:class="{ select : $route.name === 'setup', disabled : !navSw }" class="survey-setup">
          <a v-on:click="navGoto('setup')">
            <div class="con">
              <span class="icon"></span>
              <span class="text">{{ surveyData.type == 4 ? '投票' : '问卷' }}设置</span>
            </div>
          </a>
          <s></s>
        </li>

        <li v-bind:class="{ select : $route.name === 'publish', disabled : !navSw }" class="survey-publish">
          <a v-on:click="navGoto('publish')">
            <div class="con">
              <span class="icon"></span>
              <span class="text">发布</span>
            </div>
          </a>
          <s></s>
        </li>

      </ul>
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

    //问卷设置 
    surveySetup : function(){
      return this.$store.getters.getSurveySetup;
    },

    //id
    getId : function(){
      return parseInt(this.getUrlCs('id'));
    },

    //导航开关
    navSw : function(){
      return this.surveyData.id != '' ? true : false; 
    }

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
            item.must = !item.must;
            item.edit = false;
          });

          //保存问卷数据
          this.$store.dispatch('surveyDataSync', obj);

          this.$store.dispatch('updataQuestionSw', true);
       
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

    //==================== 获取编辑问卷的设置信息
    if(this.getId && this.surveySetup.article_id === ''){
      this.$http({
        method: 'get',
        url: this.$store.getters.getAjaxUrl + 'article/view/' + this.getId,
        data: {},
        headers: { 'token' : this.$store.getters.getToken },
        emulateJSON: true
      })
      .then(function(response) {
        if(response.data.code === 200){

          var type = response.data.data.article_type;
          var ar;
          if(type === '普通问卷'){
            ar = 1;
          }
          else if(type === '逻辑问卷'){
            ar = 2;
          }
          else if(type === '第一话题'){
            ar = 3;
          }
          else if(type === '投票类'){
            ar = 4;
          }

          response.data.data.article_type = ar;
          
          this.$store.dispatch('updataSurveySetup', response.data.data);

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

  methods : {

    //路由跳转
    navGoto : function(type){
      if(this.navSw){
        var query = this.surveyData.id ? { id: this.surveyData.id } : {};
        this.$router.push({ name: type, query: query });
      }
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

  .user {
    position: absolute; left: 280px; top: 0; width: 80px; text-align: center; color: #80ccff; font-size: 12px; 

    dt {
      position: relative; width: 80px; height: 80px; cursor: default;

      span {
        position: absolute; top: 29px; left: -13px; display: inline-block; width: 104px; border-left: 1px solid #1c60b9; text-align: center; line-height: 22px; 
      }
    }

    dd {
      height: 0; background: #0d57b3; .transitionDuration(.2s); overflow: hidden;

      a {
        display: block; color: #80ccff; line-height: 35px;

        &:hover {
          background: #2672d1; color: #fff;
        }
      }
    }

    &:hover {

      dt {
        background: #0d57b3; 
      }

      dd {
        height: 35px;
      }
    }
  }

  .search {
    position: absolute; right: 130px; top: 27px; padding: 0 10px 0 30px; border: 1px solid #267ae2; border-radius: 12px; height: 24px;

    .search-val {
      width: 75px; border-radius: 12px; border: 0; background: transparent; line-height: 24px; .transitionDuration(.3s); color: #fff; font-size: 12px;

      &:focus {
        width: 150px;
      }
    }

    .search-btn {
      position: absolute; left: 0; top: 0; width: 31px; height: 24px; .imagesIcon(-27px -11px); 
    }
  }

  .new-survey {
    position: absolute; right: 20px; top: 0; height: 80px; overflow: hidden; .transitionDuration(.2s);

    .icon-btn {
      position: relative; margin-bottom: 3px; width: 80px; height: 80px; background: #0d57b3; cursor: default;

      .icon {
        position: absolute; top: 15px; left: 20px; width: 40px; height: 34px; .imagesIcon(-5px -59px); 
      }

      span {
        position: absolute; bottom: 10px; left: 0; width: 80px; text-align: center; color: #80ccff; font-size: 12px;
      }
    }

    .hidden-btn {

      .icon-btn {
        border-radius: 4px; background: #92cf67; cursor: pointer;
      }

      span {
        color: #fff; font-size: 14px; bottom: 6px;
      }

      a {
        display: block;
      }
    }

    .new-questionnaire {

      .icon {
        .imagesIcon(-67px -59px);
      }
    }

    .new-vote {

      .icon {
        .imagesIcon(-135px -59px);
      }
    }

    &:hover {
      height: 250px; 

      .new-hover {
        background: #306bb5;
      }
    }
  }

  .nav {
    position: absolute; left: 50%; top: 0; margin-left: -220px;

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

      &.survey-create {

        .icon {
          .imagesIcon(-11px -240px);
        }

        &.select {
          .icon {
            .imagesIcon(-11px -290px);
          }
        }

        .con {
          border-left: 0;
        }
      }

      &.survey-skin {

        .icon {
          .imagesIcon(-76px -240px);
        }

        &.select {
          .icon {
            .imagesIcon(-76px -290px);
          }
        }
      }

      &.survey-setup {

        .icon {
          .imagesIcon(-138px -240px);
        }

        &.select {
          .icon {
            .imagesIcon(-138px -290px);
          }
        }
      }

      &.survey-publish {

        .icon {
          .imagesIcon(-201px -240px);
        }

        &.select {
          .icon {
            .imagesIcon(-201px -290px);
          }
        }
      }

      &.survey-preview {

        .icon {
          .imagesIcon(-264px -240px);
        }

        .con {
          border-right: 1px solid #1c60b9;
        }

        &.select {
          .icon {
            .imagesIcon(-264px -290px);
          }
        }
      }

      &.disabled {
        .opacity(50); 

        a {
          cursor: default;
        }
      }
    }
  }
}
</style>
