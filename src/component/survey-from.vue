<template>
  <div id="fromInner">
    <div class="module-body">
      <div class="module-inner">

        <!-- 摘要 -->
        <surveySummary></surveySummary>

        <!-- 题型 -->
        <components v-bind:data="item" v-bind:index="index" v-bind:key="item.tempId" v-for="(item,index) in surveyData.questions" v-bind:is="reQuestionsTit(item.types)"></components>

      </div>
    </div>

    <div v-bind:class="{ 'bar-fixed' : barFixed }" class="module-select-bar">

      <div v-if="reSurveyTypeTit(surveyData.type - 1) === 'questionnaire'" class="module-list">
        <ul>
          <li v-on:click="addQuestion(0)" class="radio">
            <s></s>单选题
          </li>
          <li v-on:click="addQuestion(1)" class="checkbox">
            <s></s>多选题
          </li>
          <li v-on:click="addQuestion(2)" class="img-radio">
            <s></s>图片单选题
          </li>
          <li v-on:click="addQuestion(16)" class="img-radio">
            <s></s>图片多选题
          </li>
          <li v-on:click="addQuestion(8)" class="page">
            <s></s>分页
          </li>
        </ul>
      </div>

      <div v-else-if="reSurveyTypeTit(surveyData.type - 1) === 'vote'" class="module-list">
        <ul>
          <li v-on:click="addQuestion(0)" class="radio">
            <s></s>单选题
          </li>
          <li v-on:click="addQuestion(1)" class="checkbox">
            <s></s>多选题
          </li>
          <li v-on:click="addQuestion(2)" class="img-radio">
            <s></s>图片单选题
          </li>
          <li v-on:click="addQuestion(16)" class="img-radio">
            <s></s>图片多选题
          </li>
        </ul>
      </div>

      <div v-else-if="reSurveyTypeTit(surveyData.type - 1) === 'firstTopic'" class="module-list">
        <ul>
          <li class="select radio">
            <s></s>第一话题
          </li>
        </ul>
      </div>

      <a class="select-skin" v-on:click="goSkin">下一步</a>

    </div>
      
  </div>
</template>

<script>
import surveySummary from './../component/questions/summary.vue';
import radio from './../component/questions/radio.vue';
import topic from './../component/questions/topic.vue';
import checkbox from './../component/questions/checkbox.vue';
import imgchoice from './../component/questions/img-radio.vue';
import imgchoicebox from './../component/questions/img-checkbox.vue';
import pagination from './../component/questions/page.vue';

export default {
  data () {
    return {

      //获取问卷类型
      surveyType : this.$store.getters.getSurveyType,

      //获取题型id
      questionsTit : this.$store.getters.getQuestionsTit,

      //边栏fixed
      barFixed : false

    }
  },

  components : { 
    surveySummary, 
    radio,
    topic,
    checkbox, 
    imgchoicebox, 
    imgchoice, 
    pagination
  },

  computed : {

    //问卷数据
    surveyData : function(){
      return this.$store.getters.getSurveyData;
    },

    //添加序号并过滤掉 page
    questionsFilter: function(){
      return this.surveyData.questions.filter(function(item,index){  
        return (item.types != '8');
      })  
    },

    //id
    getId : function(){
      return parseInt(this.getUrlCs('id'));
    }

  },

  created : function() {
    

  },

  mounted : function() {

    //==================== 边栏fixed
    var t = this;
    window.onscroll = function(){ 
      document.body.scrollTop >= 80 ? t.barFixed = true : t.barFixed = false;
    }

  },

  methods : {

    //==================== 选择皮肤
    goSkin : function(){

      var query = this.surveyData.id ? { id: this.surveyData.id } : {};

      if(!query.id){
        this.$store.dispatch('updataPopupTips',{
          text : '请设置问卷标题',
          display : true
        });
      }
      else if(!this.$store.getters.getQuestionSw){
        this.$store.dispatch('updataPopupTips',{
          text : '请先保存题型',
          display : true
        });
      }
      else{
        this.$router.push({ name: 'skin', query: query });
      }
    },

    //==================== 获取问卷类型对应的名称
    reSurveyTypeTit : function(id){
      return this.surveyType[parseInt(id)]
    },

    //==================== 获取题型id对应的名称
    reQuestionsTit : function(id){
      return this.questionsTit[parseInt(id)]
    },

    //==================== 添加题型
    addQuestion : function(type){

      if(this.surveyData.title === ''){
        this.$store.dispatch('updataPopupTips',{
          text : '请先填写标题',
          display : true
        });
      }
      
      else if(!this.$store.getters.getQuestionSw){
        this.$store.dispatch('updataPopupTips',{
          text : '请先保存题型',
          display : true
        });
      }

      else{

        //添加题型数据
        var uid = new Date().valueOf();
        var questionsObj = {
          tempId : (++uid).toString(36),
          edit : true,
          id : '', //题型id
          qn : this.questionsFilter.length + 1, //排序
          title : '', //标题
          types : type, //类型
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
              desc : [{ val : '' }], //描述
              img : '', //图
              nextorder : '', //下一个
              add_count : '' //修改增加的数据
            }
          ]
        }

        this.$store.dispatch('addQuestions',questionsObj);
        this.$store.dispatch('updataQuestionSw', false);

        //页面滚动到新添加的题型
        setTimeout(function(){
          var $moduleQuestions = document.getElementsByClassName('module-questions');
          var lastQuestions = $moduleQuestions[$moduleQuestions.length - 1];
          var clientHeight = document.body.clientHeight;
          var scrollHeight = document.body.scrollHeight;
          var offsetTop = lastQuestions.offsetTop + 80;
          var top = (scrollHeight - clientHeight) < offsetTop ? (scrollHeight - clientHeight) : offsetTop
          var timer = setInterval(function(){
              document.body.scrollTop += 10;
              if(document.body.scrollTop >= top){
                  clearInterval(timer);
              }
          }, 1);
        },30);
      }
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

#fromInner {
  position: relative; padding-right: 160px; min-width: 840px; background: #f5f5f5;
}

.module-body {
  box-shadow: 2px 0px 6px 0 #eaeaea;

  .module-inner {
    min-height: 575px;
  }
}

.module-questions {
  position: relative; margin-bottom: 10px; background: #fff; box-shadow: 0 2px 5px 0 #ececec;

  .inner {
    margin: auto; padding: 40px 0; width: 800px; min-height: 160px;

    // 题型设置
    .questions-setup {
      margin-bottom: 30px;

      .setup-select {
        margin-left: 40px;

        label {
          margin-right: 10px;

          span {
            margin-left: -2px;
          }
        }

        input[type='checkbox'] {
          vertical-align: middle;
        }
      }
    }

    // 题型按钮
    .questions-btn {
      position: absolute; right: 25px; bottom: 25px;

      .ui-btn {
        .btn-style(80px,34px);

        &.cancel {
          .btn-style(80px,34px,#f7faf5,#808080); margin-right: 5px;
        }
      }
    }

    // 描述
    .options-description-list {

      .options-description {
        margin-bottom: 5px; 
      }

      .description-val,
      .description-link {
        position: relative; margin-bottom: 5px;

        s {
          position: absolute; left: -9px; top: 9px; display: block; width: 10px; height: 10px; .imagesIcon(-145px -18px);
        }

        .delete {
          position: absolute; right: 0; top: 0; width: 24px; height: 24px; .imagesIcon(-85px -11px);
        }

        input[type='text'] {
          padding-left: 10px; width: 100%; height: 24px; line-height: 24px; border: 1px solid #fff; border-radius: 3px; border-bottom: 1px solid #e6e6e6; font-size: 12px; box-sizing: border-box; .transitionDuration(.2s);

          &:hover {
            border: 1px solid #8cd5ff;
          }

          &:focus {
            border: 1px solid #00a2ff; box-shadow: 0 0 6px 0 rgba(0, 162, 255, 0.4); 
          }
        }
      }

      .add-description,
      .add-link {
        font-size: 12px; margin-right: 10px;
      }
    }

    .questions-options-list {
      padding: 0 0 0 43px; width: 500px;
    }

    .module-operation-bar {
      position: absolute; right: 30px; top: 30px; width: 40px;

      li {
        margin-bottom: 5px;

        a {
          display: block; width: 40px; height: 40px; 

          &.delete {
            .imagesIcon(-2px -184px); background-color: #f7faf5;
          }

          &.up {
            .imagesIcon(-34px -182px); background-color: #f7faf5;
          }

          &.down {
            .imagesIcon(-66px -183px); background-color: #f7faf5;
          }

          &.edit {
            .imagesIcon(-103px -183px); background-color: #f7faf5;
          }

          &:hover {
            background-color: #eef4ea;
          }
        }
      }
    }

    &.view {

      .questions-setup {
        padding-bottom: 25px; border-bottom: 1px dotted #b4bfc4;

        strong {
          display: block; margin-bottom: 15px; font-size: 14px; color: #4c4c4c;
        }

        cite {
          font-size: 12px; color: #808080; line-height: 20px;
        }
      }

      .questions-options-list {
        width: auto;
      }
    }
  }

  .no {
    position: absolute; left: 15px; top: 10px; color: #f5f4ed; font-size: 40px; font-family: 'times new roman' , Arial;
  }
}

.module-select-bar {
  padding: 10px 0; position: absolute; right: 0; top: 0; width: 160px;

  .module-list {

    li {
      position: relative; padding-left: 65px; line-height: 40px; font-size: 12px; color: #808080; cursor: pointer; .transitionDuration(.1s);

      s {
        position: absolute; left: 40px; top: 11px; display: block; width: 16px; height: 16px;
      }

      &.radio {

        s {
          .imagesIcon(-12px -346px);
        }
      }

      &.checkbox {

        s {
          .imagesIcon(-40px -346px);
        }
      }

      &.img-radio {

        s {
          .imagesIcon(-69px -346px);
        }
      }

      &.page {

        s {
          .imagesIcon(-98px -346px);
        }
      }

      &.select,
      &:hover {
        background-color: #e7e7e7; 
      }
    }
  }

  .select-skin {
    margin: 100px auto 0 auto; .btn-style(120px,30px,#0c53ab,#fff); display: block; 
  }

  &.bar-fixed {
    position: fixed;
  }
}

.bg-fadeInUp {
  animation-name: bgfadeInUp; animation-duration: .7s;
}

@keyframes bgfadeInUp {
    0% { opacity: .4; background-color: #ececec; }
    100% { opacity: 1; background-color: #fff; }
}
</style>
