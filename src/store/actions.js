import Vue from 'vue'

export default {

  //问卷题型排序
  moveQuestions : function(store,obj){
    var questions = store.getters.getSurveyData.questions;
    var indexQuestions = questions[obj.index];
    var acQuestions;
    var acIndex;
    var questionId = [];

    if(obj.type === 'up'){
      acQuestions = questions[obj.index - 1];
      acIndex = obj.index - 1;
    }

    if(obj.type === 'down'){
      acQuestions = questions[obj.index + 1];
      acIndex = obj.index + 1;
    }

    store.commit('SAVE_QUESTIONS', {
      index : obj.index,
      data : acQuestions
    });

    store.commit('SAVE_QUESTIONS', {
      index : acIndex,
      data : indexQuestions
    });

    store.getters.getSurveyData.questions.forEach(function(item, i){
      questionId.push(item.id);
    })

    Vue.http.post(store.getters.getAjaxUrl + 'question/sort_question/',{ question_id : questionId },{
      headers : {
        'token' : store.getters.getToken
      },
      emulateJSON : true
    })
    .then(function(response) {
      if(response.data.code === 200){
        
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

  //更新添加用户弹窗数据
  updataPopupUserData : function(store,data){
    store.commit('UPDATA_POPUP_USER_DATA', data);
  },

  //更新题型编辑状态
  updataQuestionSw : function(store,data){
    store.commit('UPDATA_QUESTION_SW', data);
  },

  //更新用户信息
  updataUserInfo : function(store,data){
    store.commit('USER_INFO', data);
  },

  //删除翻页数据
  deletePageList : function(store,index){
    store.commit('DELETE_PAGE_LIST', index);
  },

  //添加一条翻页数据
  addPageList : function(store,data){
    store.commit('ADD_PAGE_LIST', data);
  },

  //更新一条翻页数据
  updataPageIndex : function(store,obj){
    store.commit('UPDATA_PAGE_INDEX', obj);
  },

  //更新翻页数据
  updataPageList : function(store,data){
    store.commit('UPDATA_PAGE_LIST', data);
  },

  //弹窗确认回调
  definePopupConfirm : function(store){
    store.commit('DEFINE_POPUP_CONFIRM');
  },

  //更新描述
  updataSurveyDesc : function(store,val){
    if(store.state.surveyData.id != ''){
      var Article = {
        'article_id' : store.state.surveyData.id,
        'article_intro' : val
      };

      Vue.http.post(store.getters.getAjaxUrl + 'article/create/',{ Article : Article },{
        headers : {
          'token' : store.getters.getToken
        },
        emulateJSON : true
      })
      .then(function(response) {
        if(response.data.code === 200){

          store.commit('UPDATA_SURVEY_KEY', {
            key : 'desc',
            val : val
          });

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
    }else{
      store.commit('UPDATA_SURVEY_KEY', {
        key : 'desc',
        val : val
      });
    }
  },

  //更新标题 id
  updataSurveyTit : function(store,obj){

    //创建或更新问卷
    var Article = {
      'article_id' : store.state.surveyData.id || '',
      'article_type' : store.state.surveyData.type,
      'article_title' : obj.title,
      'article_intro' : obj.desc
    };

    Vue.http.post(store.getters.getAjaxUrl + 'article/create/',{ Article : Article },{
      headers : {
        'token' : store.getters.getToken
      },
      emulateJSON : true
    })
    .then(function(response) {
      if(response.data.code === 200){

        //更新摘要
        store.commit('UPDATA_SURVEY_KEY', {
          key : 'title',
          val : obj.title
        });

        store.commit('UPDATA_SURVEY_KEY', {
          key : 'desc',
          val : obj.desc
        });

        //新创建的保存后url显示id
        if(store.state.surveyData.id === ''){
          window.history.pushState({},0,window.location.href + '?id=' + response.data.data.article_id);
        }

        //更新问卷id  
        store.commit('UPDATA_SURVEY_KEY', {
          key : 'id',
          val : response.data.data.article_id
        });

        //更新设置 
        store.commit('UPDATA_SURVEY_SETUP', response.data.data);

        //重置
        store.commit('UPDATA_QUESTION_SW', true);

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

  //更新弹窗确认 数据
  updataPopupConfirm : function(store,obj){
    store.commit('UPDATA_POPUP_CONFIRM', obj);
  },

  //更新弹窗提示 数据
  updataPopupTips : function(store,obj){

    store.commit('UPDATA_POPUP_TIPS', obj);

    if(obj.display = true){
      setTimeout(function(){
        var text = obj.text;
        store.commit('UPDATA_POPUP_TIPS', {
          display : false,
          text : text
        });
      },2000);
    }
  },

  //更新问卷设置
  updataSurveySetup : function(store,obj){
    store.commit('UPDATA_SURVEY_SETUP', obj);
  },

  //更新问卷设置字段
  updataSurveySetupKey : function(store,obj){
    store.commit('UPDATA_SURVEY_SETUP_KEY', obj);
  },

  //ajax更新问卷设置字段
  updataSurveySetupKeyAjax : function(store,obj){

    var Article = {
      article_id : store.getters.getSurveySetup.article_id,
      article_templates : obj.val
    };

    Vue.http.post(store.getters.getAjaxUrl + 'article/create/',{ Article : Article },{
      headers : {
        'token' : store.getters.getToken
      },
      emulateJSON : true
    })
    .then(function(response) {
      if(response.data.code === 200){

        store.commit('UPDATA_SURVEY_SETUP_KEY', obj);

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

  //保存题型详细数据
  saveQuestions : function(store,data){

    //创建选项
    var question = data;
    question.article_id = store.state.surveyData.id;
    question.must = question.must ? 1 : 0;

    Vue.http.post(store.getters.getAjaxUrl + 'question/create/',{ questions : question, answers : data.answers },{
      headers : {
        'token' : store.getters.getToken
      },
      emulateJSON : true
    })
    .then(function(response) {
      if(response.data.code === 200){

        //保存到state
        store.state.surveyData.questions.forEach(function(item,i){
          if(item.tempId === data.tempId){

            var newData = response.data.data;
            newData.tempId = item.tempId;

            store.commit('SAVE_QUESTIONS', {
              index: i,
              data: newData
            });

            localStorage.setItem(data.tempId, JSON.stringify(newData));

          }
        })

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

  //添加问卷题型
  addQuestions : function(store,data){
    store.commit('ADD_QUESTIONS', data);
  },

  //同步问卷题型结构
  surveyDataSync : function(store,data){
    store.commit('SURVEY_DATA_SYNC', data);
  },

  //清空问卷
  surveyDataEmpty : function(store){
    store.commit('SURVEY_DATA_EMPTY');
  },

  //删除真实问卷题型
  delRealQuestions : function(store,id){
    Vue.http({
      method: 'get',
      url: store.getters.getAjaxUrl + 'question/delete/' + id,
      data: {},
      headers: { 'token' : store.getters.getToken },
      emulateJSON: true
    })
    .then(function(response) {
      if(response.data.code === 200){

        store.state.surveyData.questions.forEach(function(item,i){
          if(item.id === id){
            store.commit('DEL_QUESTIONS', i);
          }
        });

        store.dispatch('updataPopupConfirm',{
          text : '',
          display : false,
          callback : false
        });

      }else{
        store.dispatch('updataPopupTips',{
          text : response.data.message,
          display : true
        });
      }
    }, 
    function(response) {
      alert('服务出错了，请联系管理员');
      console.log(response);
    });
  },

  //删除未保存问卷题型
  delQuestions : function(store,tempId){
    store.state.surveyData.questions.forEach(function(item,i){
      if(item.tempId === tempId){
        store.commit('DEL_QUESTIONS', i);
      }
    })
  },

  //获取问卷列表
  getSurveyList : function(store,obj){
    Vue.http({
      method: 'get',
      url: store.getters.getAjaxUrl + 'article/index/?page=' + (obj.page || 1) + '&Article[article_title]=' + (obj.str || '') + '&Article[article_state]=' + (obj.state|| '') + '&Article[article_type]=' + (obj.type|| '') + '&sort=' + (obj.time || ''),
      data: {},
      headers: { 'token' : store.getters.getToken },
      emulateJSON: true
    })
    .then(function(response) {
      if(response.data.code === 200){

        //列表数据
        store.dispatch('updataPageList', response.data.data);
     
      }
      else{
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

  //获取用户列表
  getUserList : function(store,obj){
    Vue.http({
      method: 'get',
      url: store.getters.getAjaxUrl + 'user/index/?page=' + obj.page + '&User[user_name]=' + obj.str,
      data: {},
      headers: { 'token' : store.getters.getToken },
      emulateJSON: true
    })
    .then(function(response) {
      if(response.data.code === 200){

        //列表数据
        store.dispatch('updataPageList', response.data.data);
     
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
  }

}
