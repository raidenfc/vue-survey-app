export default {
    
  //获取题型编辑状态
  getQuestionSw : function(state){
    return state.questionSw;
  },

  //获取AJAX
  getAjaxUrl : function(state){
    return state.ajaxUrl;
  },

  //获取翻页列表
  getPageList : function(state){
    return state.pageList;
  },

  //获取问卷类型
  getSurveyType : function(state){
    return state.surveyType;
  },

  //获取问卷设置
  getSurveySetup : function(state){
    return state.surveySetup;
  },

  //获取题型类型
  getQuestionsTit : function(state){
    return state.questionsId;
  },

  //获取token
  getToken : function(state){
    return state.userInfo.token;
  },

  //获取用户信息
  getUserInfo : function(state){
    return state.userInfo.user_info;
  },

  //获取问卷结构
  getSurveyData : function(state){
    return state.surveyData;
  },

  //获取弹窗确认 数据
  getPopupConfirmData : function(state){
    return state.popupConfirmData;
  },

  //获取弹窗提示 数据
  getPopupTipsData : function(state){
    return state.popupTipsData;
  },

  //获取添加用户弹窗 数据
  getPopupUserData : function(state){
    return state.popupUserData;
  }
}
