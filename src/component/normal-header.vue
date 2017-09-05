<template>
  <div id="header">
    <div class="logo">
      <a href="#/">
        <div class="img"></div>
        <div class="tit"></div>
      </a>
    </div>

    <div class="user">
      <dl>
        <dt><span>{{ userInfo ? userInfo.user_realname : '' }}</span></dt>
        <dd v-show="userInfo && userInfo.user_role === 1"><a href="#/userlist">账户管理</a></dd>
        <dd><a v-on:click="editUser" href="javascript:void(0);">设置</a></dd>
        <dd><a v-on:click="surveylogout" href="javascript:void(0);">注销</a></dd>
      </dl>
    </div>

    <div v-show="$route.name ==='list'" class="search">
      <input type="text" v-on:keyup.enter="searchTitle ? getArticleList(1,$event.target.value) : ''" class="search-val" v-model="searchTitle">
      <a v-on:click="emptySurveySearch" v-show="$route.query.k" href="javascript:void(0);" title="清空搜索" class="delete"></a>
      <a href="javascript:void(0);" class="search-btn"></a>
    </div>

    <div v-show="$route.name === 'userlist'" class="search">
      <input type="text" v-on:keyup.enter="searchTitle ? getUserList(1,$event.target.value) : ''" class="search-val" v-model="searchTitle">
      <a v-on:click="emptyUserSearch" v-show="$route.query.k" href="javascript:void(0);" title="清空搜索" class="delete"></a>
      <a href="javascript:void(0);" class="search-btn"></a>
    </div>

    <div class="new-survey">
      <div class="icon-btn new-hover">
        <div class="icon"></div>
        <span>新建</span>
      </div>

      <ul v-show="$route.name === 'userlist'" class="hidden-btn">
        <li class="new-questionnaire new-user">
          <a v-on:click="addUser" href="javascript:void(0);">
            <div class="icon-btn">
              <div class="icon"></div>
              <span>新建用户</span>
            </div>
          </a>
        </li>
      </ul>
      
      <ul v-show="$route.name ==='list'" class="hidden-btn">
        <li v-show="userInfo.user_role != 3" class="new-questionnaire">
          <a v-on:click="addSurvey(1)" href="javascript:void(0);" :to="{ name : 'new' , query : { type : 'questionnaire' } }">
            <div class="icon-btn">
              <div class="icon"></div>
              <span>创建问卷</span>
            </div>
          </a>
        </li>
        
        <li v-show="userInfo.user_role != 3" class="new-vote">
          <a v-on:click="addSurvey(4)" href="javascript:void(0);" :to="{ name : 'new' , query : { type : 'vote' } }">
            <div class="icon-btn">
              <div class="icon"></div>
              <span>创建投票</span>
            </div>
          </a>
        </li>

        <li v-show="userInfo.user_role != 2" class="first-vote">
          <a v-on:click="addSurvey(3)" href="javascript:void(0);" :to="{ name : 'new' , query : { type : 'firstTopic' } }">
            <div class="icon-btn">
              <span>第一话题</span>
            </div>
          </a>
        </li>
      </ul>

    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {

      //搜索标题
      searchTitle : this.getUrlCs('k') || ''

    }
  },

  computed : {

    //获取问卷列表数据
    pageListData : function(){
      return this.$store.getters.getPageList;
    },

    //获取用户信息
    userInfo : function(){
      return this.$store.getters.getUserInfo;
    }

  },

  methods : {

    //设置用户
    editUser : function(item, index){
      var obj = this.userInfo;
      obj.index = -1;
      this.$store.dispatch('updataPopupUserData',{
        data : obj,
        display : true
      });
    },

    //显示添加用户弹窗
    addUser : function(){
      this.$store.dispatch('updataPopupUserData',{
        data : '',
        display : true
      });
    },

    //注销
    surveylogout : function(){
      this.$http({
        method: 'get',
        url: this.$store.getters.getAjaxUrl + 'logout',
        data: {},
        headers: { 'token' : this.$store.getters.getToken },
        emulateJSON: true
      })
      .then(function(response) {
        if(response.data.code === 200){

          this.$store.dispatch('updataToken', '');

          this.$router.push({ name: 'login' })

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

    //还原问卷列表
    emptySurveySearch : function(){

      this.searchTitle = '';

      this.getArticleList(this.pageListData.page_current, this.searchTitle);
    },

    //还原用户列表
    emptyUserSearch : function(){

      this.searchTitle = '';

      this.getUserList(this.pageListData.page_current, this.searchTitle);
    },

    //获取问卷列表
    getArticleList : function(page,str){

        //时间排序
        var time = this.getUrlCs('time');

        //状态筛选
        var state = this.getUrlCs('state');

        this.$store.dispatch('getSurveyList', {
          page : page,
          str : str || '',
          state : state || '',
          time : time || ''
        });

        this.$router.push({ name: 'list', query : { k : str || '', state : state, time : time } });

    },

    //获取用户列表
    getUserList : function(page,str){
      this.$store.dispatch('getUserList', {
        page : page,
        str : str || ''
      });

      this.$router.push({ name: 'userlist', query : { k : str } });
    },

    //创建问卷
    addSurvey : function(type){
      var questionsData = [];

      //第一话题 默认添加数据
      if(type === 3){
        var uid = new Date().valueOf();
        questionsData = [{
          tempId : (++uid).toString(36),
          edit : true,
          id : '', //题型id
          qn : '', //排序
          title : '', //标题
          types : 15, //类型
          must : false,
          count : '0', //总次数
          img : '', //图
          info : '', //其他信息
          desc : '', //备注
          subtitle : '', //副标题
          answers : [
            {
              id : '', //选项id
              text : '', //内容
              count : '', //投票次数
              order : '', //排序
              url : '', //url
              title : '', //标题
              intro : '', //介绍
              desc : [
                {
                  val : ''
                }
              ], //描述
              img : '', //图
              nextorder : '', //下一个
              add_count : '' //修改增加的数据
            }
          ]
        }]
      }else{
        questionsData = [];
      }

      var obj = {
        id : '',
        title : '',
        desc : '',
        edit : false,
        type : type,
        questions : questionsData
      };

      //保存问卷数据
      this.$store.dispatch('surveyDataSync', obj);

      //路由跳转
      this.$router.push({ name: 'new' });
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

    .delete {
      position: absolute; right: 0; top: 0; width: 24px; height: 24px; .imagesIcon(-85px -11px); 
    }

    .search-btn {
      position: absolute; left: 0; top: 0; width: 31px; height: 24px; .imagesIcon(-27px -11px); 
    }
  }

  .new-survey {
    position: absolute; right: 20px; top: 0; height: 80px; overflow: hidden; .transitionDuration(.2s);

    a {

      &:hover {
        .opacity(100);

        .icon-btn {
          background: #72bd4c;
        }
      }
    }

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

    .first-vote {

      .icon-btn {
        height: 33px;
      }
    }

    &:hover {
      height: 285px; 

      .new-hover {
        background: #306bb5;
      }
    }
  }

  .nav {
    position: absolute; left: 50%; top: 0; margin-left: -275px;

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
    }
  }
}
</style>
