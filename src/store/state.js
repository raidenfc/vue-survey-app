export default {

    //ajax
    ajaxUrl : 'http://surveyx.huanqiu.com/v2/',    
    // ajaxUrl : 'http://www.hqsurvey.com/',    

    //问卷题型结构
    surveyData : {
      id : '',
      title : '',
      desc : '',
      type : '',
      edit : false,
      questions : []
    },

    //问卷设置信息
    surveySetup : {
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
    },

    //问卷类型对应ID 普通问卷、逻辑问卷、第一话题、投票类
    surveyType : ['questionnaire', 'logicalQuestionnaires', 'firstTopic', 'vote'],

    //题型对应ID
    questionsId : ['radio', 'checkbox', 'imgchoice', 'graded', 'tableradio', 'tablecheckboxes', 'supply', 'describe', 'pagination', '', '', '', '', '', '', 'topic', 'imgchoicebox'],

    //用户信息
    userInfo : sessionStorage.getItem('surveyUser') ? JSON.parse(sessionStorage.getItem('surveyUser')) : '',

    //弹窗确认 数据
    popupConfirmData : {
      display : false,
      text : '',
      callback : false
    },

    //弹窗提示 数据
    popupTipsData : {
      display : false,
      text : '',
      se : false
    },

    //添加用户弹窗 数据
    popupUserData : {
      display : false,
      data : ''
    },

    //翻页列表
    pageList : [],

    //题型编辑状态
    questionSw : true
}
