<template>
<div id="listInner">
  <div class="page-list paginator-data">
    <table class="ui-table">

      <tr>

        <th class="title">标题</th>

        <th v-show="userInfo.user_role === 1" class="c-name">创建人</th>

        <th class="type">
          <select v-on:input="typeSort($event.target.value)" class="ui-select">
            <option value="" v-bind:selected="type === '' ? 'selected' : ''">全部类型</option>
            <option value="1" v-bind:selected="type === '1' ? 'selected' : ''">问卷</option>
            <option value="4" v-bind:selected="type === '4' ? 'selected' : ''">投票</option>
            <option v-show="userInfo.user_role != 2" value="3" v-bind:selected="type === '3' ? 'selected' : ''">第一话题</option>
          </select>
        </th>

        <th class="time"><span v-on:click="timeSort" v-bind:class="{ a : timeCreate === '-artilce_time_create', b : timeCreate === 'artilce_time_create' }" class="sort">创建时间<s></s></span></th>
        
        <th class="state">
          <select v-on:input="stateSort($event.target.value)" class="ui-select">
            <option value="" v-bind:selected="state === '' ? 'selected' : ''">全部状态</option>
            <option value="1" v-bind:selected="state === '1' ? 'selected' : ''">进行中</option>
            <option value="0" v-bind:selected="state === '0' ? 'selected' : ''">未开始</option>
            <option value="2" v-bind:selected="state === '2' ? 'selected' : ''">已结束</option>
          </select>
        </th>

        <th class="operation">操作</th>

      </tr>

      <tr v-for="(item, index) in pageListData.page_data">
        <td>
          <span class="title">
            <span class="t-b"></span>
            <a v-bind:href="'#/publish?id=' + item.article_id">{{ item.article_title }}</a>
          </span>
        </td>
        <td v-show="userInfo.user_role === 1"><span class="c-name">{{ item.user_name || '--' }}</span></td>
        <td><span class="type">{{ item.article_type }}</span></td>
        <td><span class="time">{{ item.artilce_time_create }}</span></td>
        <td><span v-bind:class="articlesState[item.article_state].class">{{ articlesState[item.article_state].text }}</span></td>
        <td>
          <span class="btn-inner">
            <span v-show="item.article_state === 0 || item.article_state === 2" class="btn begin">
              <a v-on:click="changeStateTips(item.article_id, 1, index)" href="javascript:void(0);"><span class="icon"></span></a>
              <cite>开始</cite>
            </span>

            <span v-show="item.article_state === 1" class="btn stop">
              <a v-on:click="changeStateTips(item.article_id, 2, index)" href="javascript:void(0);"><span class="icon"></span></a>
              <cite>停止</cite>
            </span>

            <span class="btn edit">
              <a v-on:click="editSurvey(item.article_id)" href="javascript:void(0);"><span class="icon"></span></a>
              <cite>编辑</cite>
            </span>

            <span class="btn data">
              <!-- <a v-on:click="dataSurvey(item.article_id)" target="_blank" href="javascript:void(0);"><span class="icon"></span></a> -->
              <a target="_blank" v-bind:href="'#/data?id=' + item.article_id"><span class="icon"></span></a>
              <cite>数据</cite>
            </span>


<!--             <span class="btn statistics">
              <a href="#"><span class="icon"></span></a>
              <cite>统计</cite>
            </span> -->

            <span class="btn delete">
              <a v-on:click="delSurvey(item.article_id, index)" href="javascript:void(0);"><span class="icon"></span></a>
              <cite>删除</cite>
            </span>
          </span>
        </td>
      </tr>

    </table>
  </div>

  <paginator v-bind:page-list-data="pageListData" v-on:changePage="getArticleList"></paginator>

</div>
</template>

<script>
export default {
  data () {
    return {

      //时间排序
      timeCreate : '',

      //状态筛选
      state : '',

      //类型筛选
      type : '',
     
      //问卷状态
      articlesState : [
        {
          text : '未开始',
          class : 'not-started'
        },
        {
          text : '进行中',
          class : 'in-progress'
        },
        {
          text : '已结束',
          class : 'end'
        }
      ]

    }
  },

   watch : {

    // 触发弹窗确定
    popupCallback : function(){

      //删除问卷
      if(this.popupCallback && this.$store.getters.getPopupConfirmData.type === 'delSurvey'){
        this.defineDelSurvey();
      }

      //改变问卷状态
      else if(this.popupCallback && this.$store.getters.getPopupConfirmData.type === 'changeState'){
        this.defineChangeState();
      }
    }

  },
  
  computed : {

    //获取问卷列表数据
    pageListData : function(){
      return this.$store.getters.getPageList;
    },

    //是否触发弹窗娶确定
    popupCallback : function(){
      return this.$store.getters.getPopupConfirmData.callback;
    },

    //获取用户信息
    userInfo : function(){
      return this.$store.getters.getUserInfo;
    }
 
  },

  created : function() {

    //无token 跳转到登录页面
    if(!sessionStorage.getItem('surveyUser')){
      this.$router.push({ name: 'login' });
    }

    //初始化问卷数据
    this.$store.dispatch('surveyDataSync', {
      id : '',
      title : '',
      desc : '',
      type : '',
      edit : false,
      questions : []
    });

    //初始化问卷设置
    this.$store.dispatch('updataSurveySetup', {
      "article_id":"",
      "user_id":"",
      "article_unique":"",
      "article_type":"",
      "article_title":"",
      "article_intro":"",
      "article_state":"",
      "article_dumpurl":"",
      "article_restrict_ip":0,
      "article_limit_count":0,
      "article_show_report":0,
      "article_templates":0,
      "artilce_time_create":"",
      "article_time_begin":"未设置",
      "article_time_end":"未设置",
      "article_people_count":0,
      "article_background":"",
      "artilce_limit_type":0,
      "article_limit_type_count":1,
      "article_limit_type_time":0,
      "article_ballot_count":0,
      "article_overt":0,
      "article_background_color":"",
      "article_header_img":"",
      "article_header_hight":0
    });

  },

  mounted: function() {

    //获取问卷列表
    if(sessionStorage.getItem('surveyUser')){
      this.getArticleList(1);
    }

  },

  methods : {

    //==================== 改变状态提示
    changeStateTips : function(id,s,index){
      var text = s === 1 ? '开始' : '结束';
      this.$store.dispatch('updataPopupConfirm',{
        text : '确定' + text +'？',
        display : true,
        callback : false,
        type : 'changeState',
        id : id,
        s : s,
        index : index
      });
    },

    //==================== 改变状态
    defineChangeState : function(){
      var data = this.$store.getters.getPopupConfirmData;

      this.$http.post(this.$store.getters.getAjaxUrl + 'article/change_state/',{ article_id : data.id, article_state : data.s },{
        headers : {
          'token' : this.$store.getters.getToken
        },
        emulateJSON : true
      })
      .then(function(response) {
        if(response.data.code === 200){

          this.$store.dispatch('updataPageIndex', {
            index : data.index,
            data : response.data.data
          });

          this.$store.dispatch('updataPopupConfirm',{
            text : '',
            display : false,
            callback : false
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

    //==================== 类型筛选
    typeSort : function(s){

      this.type = s;

      var k = this.getUrlCs('k') || '';

      this.$router.push({ name: 'list', query : { k : k || '', type : this.type, state : this.state, time : this.timeCreate } });

      this.getArticleList(this.pageListData.page_current, k);
    },

    //==================== 状态筛选
    stateSort : function(s){

      this.state = s;

      var k = this.getUrlCs('k') || '';

      this.$router.push({ name: 'list', query : { k : k || '', type : this.type, state : this.state, time : this.timeCreate } });

      this.getArticleList(this.pageListData.page_current, k);
    },

    //==================== 时间排序
    timeSort : function(){
      this.timeCreate === '-artilce_time_create' ? this.timeCreate = 'artilce_time_create' : this.timeCreate = '-artilce_time_create';
      var k = this.getUrlCs('k') || '';

      this.$router.push({ name: 'list', query : { k : k || '', type : this.type, state : this.state, time : this.timeCreate } });

      this.getArticleList(this.pageListData.page_current, k);
    },

    //==================== 删除问卷
    delSurvey : function(id,index){
      this.$store.dispatch('updataPopupConfirm',{
        text : '确定删除？',
        display : true,
        callback : false,
        type : 'delSurvey',
        index : index,
        id : id
      });
    },

    //==================== 触发弹窗 确定删除问卷
    defineDelSurvey : function(){

      var data = this.$store.getters.getPopupConfirmData;

      this.$http({
        method: 'get',
        url: this.$store.getters.getAjaxUrl + 'article/delete/' + data.id,
        data: {},
        headers: { 'token' : this.$store.getters.getToken },
        emulateJSON: true
      })
      .then(function(response) {
        if(response.data.code === 200){

          this.$store.dispatch('deletePageList', data.index);

          this.$store.dispatch('updataPopupConfirm',{
            text : '',
            display : false,
            callback : false
          });

        }
        else if(response.data.code === 401){
          this.$router.push({ name: 'login' });
        }
        else{
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

    //==================== 编辑问卷 路由跳转
    editSurvey : function(id){
      this.$router.push({ name: 'new', query: { id: id }})
    },

    //==================== 编辑数据 路由跳转
    dataSurvey : function(id){
      this.$router.push({ name: 'data', query: { id: id }})
    },

    //==================== 获取问卷列表
    getArticleList : function(page){
      
      //关键字
      var str = this.getUrlCs('k') || '';

      //时间排序
      var time = this.getUrlCs('time');
      time ? this.timeCreate = time : this.timeCreate = '-artilce_time_create';

      //状态筛选
      var state = this.getUrlCs('state');
      state ? this.state = state : this.state = '';

      //类型筛选
      var type = this.getUrlCs('type');
      type ? this.type = type : this.type = '';

      this.$store.dispatch('getSurveyList', {
        page : page,
        str : str || '',
        state : state || '',
        type : type || '',
        time : time || ''
      });
    },

    //==================== url参数
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

#listInner {
  position: relative; padding: 50px 60px; background: #fff;

  .ui-table {
    min-width: 1000px;

    th.title {
      padding-left: 30px; width: 48%;
    }

    th.state,
    th.c-name,
    th.type,
    th.time {
      width: 100px;
    }

    th.operation {
      width: 200px; text-align: center;
    }

    th.state,
    th.type {
      position: relative;

      .ui-select {
        padding: 0; border: 0; color: #b2b2b2; font-size: 12px; text-align: left; cursor: pointer;
      }
    }

    th.time {

      .sort {
        position: relative; display: inline-block; padding-right: 20px; cursor: pointer;

        s {
          position: absolute; right: 5px; top: 9px; display: block; width: 7px; height: 12px;
        }

        &.a {

          s {
            .imagesIcon(-42px -376px);
          }
        }

        &.b {

          s {
            .imagesIcon(-49px -376px);
          }
        }
      }
    }

    td {

      .title {
        max-width: 560px; vertical-align: middle; font-weight: bold; font-size: 14px; .omit();

        .t-b {
          display: inline-block; margin: 0 5px 0 10px; width: 8px; height: 17px; .imagesIcon(-14px -15px); vertical-align: middle;
        }

        a {
          color: #000; 
        }
      }

      .type {
        margin-left: 8px;
      }

      .time {
        font-size: 12px;
      }

      .end {
        padding-left: 8px; color: #999;
      }

      .in-progress {
        padding-left: 8px; color: #68c000;
      }

      .not-started {
        padding-left: 8px; color: #0096ff;
      }
    }
  }

  .btn-inner {
    display: block; min-width: 220px; height: 50px; text-align: center;

    .btn {
      position: relative; display: inline-block; width: 40px; height: 50px; vertical-align: middle;

      .icon {
        position: absolute; top: 16px; left: 10px; display: inline-block; width: 20px; height: 20px;
      }

      a {
        display: block; width: 40px; height: 50px;

        &:hover {
          .opacity(100);
        }
      }

      cite {
        position: absolute; top: 51px; left: 0; display: inline-block; width: 40px; height: 0; overflow: hidden; background: #387fd8; line-height: 30px; text-align: center; color: #fff; .transitionDuration(.2s);
      }

      &:hover {
        z-index: 1; background: #387fd8;

        cite {
          height: 30px;
        }
      }

      &.begin {

        .icon {
          .imagesIcon(-11px -118px);
        }

        &:hover {

          .icon {
            .imagesIcon(-11px -154px);
          }
        }
      }

      &.data {

        .icon {
          .imagesIcon(-180px -118px);
        }

        &:hover {

          .icon {
            .imagesIcon(-180px -154px);
          }
        }
      }

      &.edit {

        .icon {
          .imagesIcon(-42px -118px);
        }

        &:hover {

          .icon {
            .imagesIcon(-42px -154px);
          }
        }
      }

      &.stop {

        .icon {
          .imagesIcon(-76px -118px);
        }

        &:hover {

          .icon {
            .imagesIcon(-76px -154px);
          }
        }
      }

      &.statistics {

        .icon {
          .imagesIcon(-112px -118px);
        }

        &:hover {

          .icon {
            .imagesIcon(-112px -154px);
          }
        }
      }

      &.delete {

        .icon {
          .imagesIcon(-147px -118px);
        }

        &:hover {

          .icon {
            .imagesIcon(-147px -154px);
          }
        }
      }
    }
  }
}
</style>
