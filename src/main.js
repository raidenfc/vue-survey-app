import Vue from 'vue';
import { DatePicker } from 'element-ui';
import App from './App.vue';

Vue.use(DatePicker);

//开启debug模式
Vue.config.debug = true;

//======================= vue-resource
import VueResource from 'vue-resource';
Vue.use(VueResource);

//======================= 全局组件 
//登录
import login from './component/login.vue';
Vue.component('login',login);

//默认头部
import normalHeader from './component/normal-header.vue';
Vue.component('normalHeader',normalHeader);

//调查头部
import surveyHeader from './component/survey-header.vue';
Vue.component('surveyHeader',surveyHeader);

//调查列表
import surveyList from './component/survey-list.vue';
Vue.component('surveyList',surveyList);

//调查from
import surveyFrom from './component/survey-from.vue';
Vue.component('surveyFrom',surveyFrom);

//调查皮肤
import surveySkin from './component/survey-skin.vue';
Vue.component('surveySkin',surveySkin);

//调查设置
import surveySetup from './component/survey-setup.vue';
Vue.component('surveySetup',surveySetup);

//调查发布
import surveyPublish from './component/survey-publish.vue';
Vue.component('surveyPublish',surveyPublish);

//弹窗确认
import surveyConfirm from './component/survey-confirm.vue';
Vue.component('surveyConfirm',surveyConfirm);

//弹窗提示
import surveyTips from './component/survey-tips.vue';
Vue.component('surveyTips',surveyTips);

//题型控制器
import questionsBar from './component/questions-bar.vue';
Vue.component('questionsBar',questionsBar);

//翻页
import paginator from './component/paginator.vue';
Vue.component('paginator',paginator);

//上传图片
import upload from './component/upload.vue';
Vue.component('upload',upload);

//用户列表
import userList from './component/user-list.vue';
Vue.component('userList',userList);

//添加用户弹窗
import addUserPopup from './component/add-user-popup.vue';
Vue.component('addUserPopup',addUserPopup);

//问卷数据修改
import surveyData from './component/survey-data.vue';
Vue.component('surveyData',surveyData);


//======================= 路由
import vueRouter from "vue-router";
Vue.use(vueRouter);

const routerObj = {
  routes: [

  //登录
  {
    path : '/login',
    name : 'login',
    components : {
      body : login
    }
  },

  //问卷列表
  {
    path : '/',
    name : 'list',
    components : {
      head : normalHeader,
      body : surveyList
    }
  },

  //创建问卷
  {
    path : '/new',
    name : 'new',
    components : {
      head : surveyHeader,
      body : surveyFrom
    }
  },

  //选择皮肤
  {
    path : '/skin',
    name : 'skin',
    components : {
      head : surveyHeader,
      body : surveySkin
    }
  },

  //问卷设置
  {
    path : '/setup',
    name : 'setup',
    components : {
      head : surveyHeader,
      body : surveySetup
    }
  },

  //发布
  {
    path : '/publish',
    name : 'publish',
    components : {
      head : surveyHeader,
      body : surveyPublish
    }
  },

  //用户列表
  {
    path : '/userlist',
    name : 'userlist',
    components : {
      head : normalHeader,
      body : userList
    }
  },

  //问卷数据修改
  {
    path : '/data',
    name : 'data',
    components : {
      body : surveyData
    }
  }

]};

const router = new vueRouter(routerObj);

//======================= vuex
import store from './store/index.js'

//======================= vue 实例
const app = new Vue({
  store: store,
  router: router,
  render: h => h(App)
}).$mount('#app');

localStorage.clear();