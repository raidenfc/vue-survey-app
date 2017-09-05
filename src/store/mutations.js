export default {
  //更新题型编辑状态
  UPDATA_QUESTION_SW : function(state,data){
    state.questionSw = data;
  },

  //更新添加用户弹窗数据
  UPDATA_POPUP_USER_DATA : function(state,data){
    state.popupUserData = data;
  },

  //更新token
  USER_INFO : function(state,data){
    state.userInfo = data;
    sessionStorage.setItem('surveyUser', JSON.stringify(data));
  },

  //弹窗确认回调
  DEFINE_POPUP_CONFIRM : function(state){
    state.popupConfirmData.callback = true;
  },

  //更新弹窗确认 数据
  UPDATA_POPUP_CONFIRM : function(state,obj){
    state.popupConfirmData = obj;
  },

  //更新问卷设置
  UPDATA_SURVEY_SETUP : function(state,obj){
    state.surveySetup = obj;
  },

  //更新问卷设置字段
  UPDATA_SURVEY_SETUP_KEY : function(state,obj){
    state.surveySetup[obj.key] = obj.val;
  },

  //更新弹窗提示 数据
  UPDATA_POPUP_TIPS : function(state,obj){
    state.popupTipsData = obj;
    if(obj.se === 401){
      setTimeout(function(){
        window.location.href = '#/login';
      },2000);
    }
  },

  //保存题型详细数据
  SAVE_QUESTIONS : function(state,obj){
    state.surveyData.questions.splice(obj.index, 1, obj.data);
  },

  //添加问卷题型
  ADD_QUESTIONS : function(state,add){
    state.surveyData.questions.push(add);
  },

  //同步问卷题型结构
  SURVEY_DATA_SYNC : function(state,data){
    state.surveyData = data;
  },

  //清空问卷
  SURVEY_DATA_EMPTY : function(state){
    state.surveyData = {
      id : '',
      title : '',
      desc : '',
      type : '',
      edit : false,
      questions : []
    };
  },

  //删除问卷题型
  DEL_QUESTIONS : function(state,index){
    state.surveyData.questions.splice(index, 1);
  },

  //更新问卷数据键值
  UPDATA_SURVEY_KEY : function(state,obj){
    state.surveyData[obj.key] = obj.val;
  },

  //删除翻页数据
  DELETE_PAGE_LIST : function(state,index){
    state.pageList.page_data.splice(index, 1);
  },

  //添加一条翻页数据
  ADD_PAGE_LIST : function(state,data){
    state.pageList.page_data.unshift(data);
  },

  //更新一条翻页数据
  UPDATA_PAGE_INDEX : function(state,obj){
    state.pageList.page_data.splice(obj.index, 1, obj.data);
  },

  //更新问卷列表
  UPDATA_PAGE_LIST : function(state,obj){
    state.pageList = obj;
  }
}
