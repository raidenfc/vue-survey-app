<template>
<div class="module-radio module-questions bg-fadeInUp" v-bind:data-tempId="questions.tempId">
  <div class="no">Q{{ index + 1 }}</div>
  
  <div v-show="questions.edit" class="inner edit">
    <div class="questions-setup">
      <div v-bind:class="{ error : titleError }" class="ui-input-tit">
        <span class="title">相关阅读 - 标题</span>
        <span class="con">
          <span class="ui-text">
            <input class="questions-title" v-on:blur="questions.title === '' ? titleError = true : titleError = false" type="text" v-model="questions.title">
            <cite class="error-tips">标题不能为空</cite>
          </span>
        </span>
      </div>
      
      <div class="ui-input-tit">
        <span class="title">相关阅读 - 链接</span>
        <span class="con">
          <span class="ui-text">
            <input type="text" v-model="questions.subtitle">
          </span>
        </span>
      </div>

<!--       <div class="setup-select">
        <label class="not-required">
          <input type="checkbox" v-model="questions.must">
          <span>非必填</span>
        </label>
        
        <label class="add-description">
          <input type="checkbox" v-model="isDescription">
          <span>添加描述</span>
        </label>
      </div> -->
    </div>

    <div class="questions-options-list">

      <!-- 选项 -->
      <div v-for="(optionsItem,optionsIndex) in questions.answers" v-bind:data-id="optionsItem.id" class="questions-options">
        <div class="options-val ui-text">
          <input type="text" placeholder="选项" v-model="optionsItem.title">
          <a v-show="questions.answers.length > 1" v-on:click="deleteOptions(optionsIndex,optionsItem.id)" title="删除选项" href="javascript:void(0);" class="delete"></a>
          <s></s>
        </div>

        <!-- 描述 -->
        <div v-show="isDescription" class="options-description-list">
          <div v-for="(descItem,descIndex) in optionsItem.desc" class="options-description">
            <div class="description-val">
              <input type="text" placeholder="描述" v-model="descItem.val">
              <a v-on:click="deleteDescription(optionsIndex,descIndex)" title="删除描述" href="javascript:void(0);" class="delete"></a>
              <s></s>
            </div>
          </div>
          <a v-on:click="addDescription(optionsIndex)" href="javascript:void(0);" class="add-description">添加描述</a>
        </div>
      </div>

      <a v-on:click="addOptions" href="javascript:void(0);" class="add-options">新建选项</a>
    </div>

    <div class="questions-btn">
      <a v-on:click="cancelSave" href="javascript:void(0);" class="ui-btn cancel">取消</a>
      <a v-on:click="questionsSave" href="javascript:void(0);" class="ui-btn save">保存</a>
    </div>

  </div>

  <div v-show="!questions.edit" class="inner view">
    <div class="questions-setup">
      <strong>{{ questions.title }}</strong>
      <cite>{{ questions.subtitle }}</cite>
    </div>

    <div class="questions-options-list">
      <div v-for="(optionsItem,optionsIndex) in questions.answers" class="questions-options">
        <div class="icon"></div>
        <dl v-bind:class="{ dc : optionsItem.desc && descLength(optionsItem.desc) }">
          <dt>{{ optionsItem.title }}</dt>
          <dd v-for="(descItem,descIndex) in optionsItem.desc">{{ descItem.val }}</dd>
        </dl>
      </div>
    </div>

    <div class="module-operation-bar">
      <ul>
        <li><a v-on:click="editQuestion" title="编辑" href="javascript:void(0);" class="edit"></a></li>
      </ul>
    </div>

  </div>

</div>
</template>

<script>
export default {
  data () {
    return {

      //是否添加描述
      isDescription : false,

      //标题提示不能为空
      titleError : false,

      //接收的数据
      propsData : this.data,

      //题型
      questions : {
        tempId : '',
        type : '',
        edit : true,
        id : '', //题型id
        qn : '', //排序
        title : '', //标题
        types : '0', //类型
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
      }

    }
  },

  props : ['data','index'],

  watch : {

    // 触发弹窗确定
    popupCallback : function(){
      if(this.popupCallback && this.questions.edit){
        this.popupDefine();
      }
    }

  },
  
  computed : {

    //是否触发弹窗确定
    popupCallback : function(){
      return this.$store.getters.getPopupConfirmData.callback;
    }
 
  },

  created : function() {

    //存储数据
    localStorage.setItem(this.propsData.tempId, JSON.stringify(this.propsData));
    this.questions = JSON.parse(localStorage.getItem(this.propsData.tempId));

    //是否添加描述
    this.description();
    
  },

  mounted : function() {

    //==================== 标题焦点
    this.$el.getElementsByClassName('questions-title')[0].focus();

  },

  methods : {

    //==================== 是否添加描述
    description : function(){
      var sw = false;
      for(var i=0;i<this.questions.answers.length;i++){
        for(var j=0;j<this.questions.answers[i].desc.length;j++){
          if(this.questions.answers[i].desc[j].val != ''){
            sw = true;
            break;
          }
        }

        if(sw){
          break;
        }
      }
      
      sw ? this.isDescription = true : this.isDescription = false;
    },

    //==================== 编辑题型
    editQuestion : function(){
      //无选项、描述，默认加一条
      if(this.questions.answers.length === 0){
        this.questions.answers = [
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
        ];
      }
      else{
        this.questions.answers.forEach(function(item, i){
          if(item.desc.length === 0){
            item.desc = [{ val : '' }];
          }
        });
      }

      var tempId = this.propsData.tempId;
      this.questions = JSON.parse(localStorage.getItem(tempId));

      this.questions.edit = true;
    },

    //==================== 取消保存题型
    cancelSave : function(){
      var surveyData = this.$store.getters.getSurveyData.questions;
      var tempId = this.questions.tempId;
      var title;
      surveyData.forEach(function(item, i){
        if(item.tempId === tempId){
          title = item.title;
        }
      });

      //如果没保存过，则删除题型
      if(title === ''){
        this.$store.dispatch('updataPopupConfirm',{
          text : '未保存将删除，确认取消？',
          display : true,
          callback : false
        });
      }

      //获取之前的数据并覆盖
      else{
        this.questions = JSON.parse(localStorage.getItem(this.questions.tempId));
        this.$store.dispatch('updataQuestionSw', true);
      }
    },

    //==================== 触发弹窗 确定
    popupDefine : function(){
      this.$store.dispatch('delQuestions', this.questions.tempId);

      this.$store.dispatch('updataQuestionSw', true);

      this.$store.dispatch('updataPopupConfirm',{
        text : '',
        display : false,
        callback : false
      });
    },

    //==================== 保存题型
    questionsSave : function(){
      if(this.questions.title != ''){
        this.titleError = false;
        this.questions.edit = false;

        //保存时，没选描述，则不保存描述
        if(!this.isDescription){
          this.questions.answers.forEach(function(item,i){
            item.desc = [{ val : '' }];
          })
        }

        //过滤为空的选项和描述
        var firQuestion = JSON.parse(JSON.stringify(this.questions));
        for(var i=(firQuestion.answers.length - 1);i>=0;i--){
          if(firQuestion.answers[i].title === ''){
            this.questions.answers.splice(i, 1);
          }
          else{
            for(var j=(firQuestion.answers[i].desc.length - 1);j>=0;j--){
              if(firQuestion.answers[i].desc[j].val === ''){
                this.questions.answers[i].desc.splice(j, 1);
              }
            }
          }
        }

        //store 保存题型详细数据
        localStorage.setItem(this.questions.tempId, JSON.stringify(this.questions));
        this.$store.dispatch('saveQuestions', JSON.parse(localStorage.getItem(this.questions.tempId)));
        this.$store.dispatch('updataQuestionSw', true);
      }else{
        this.titleError = true;
      }
    },

    //==================== 判断描述长度
    descLength : function(descArr){
      var sw = false;

      for(var i=0;i<descArr.length;i++){
        if(descArr[i].val.length > 10){
          sw = true;
          break;
        }
      }

      return sw;
    },

    //==================== 删除选项
    deleteOptions : function(optionsIndex,id){
      if(id){
        this.$http.post(this.$store.getters.getAjaxUrl + 'answer/delete/' + id,{},{
          headers : {
            'token' : this.$store.getters.getToken
          },
          emulateJSON : true
        })
        .then(function(response) {
          if(response.data.code === 200){

            this.questions.answers.splice(optionsIndex,1);

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
      }else{
        this.questions.answers.splice(optionsIndex,1);
      }
    },

    //==================== 添加选项
    addOptions : function(){
      var optionsObj = {
        id : '',
        text : '',
        count : '',
        order : '',
        url : '',
        title : '',
        intro : '',
        desc : [
          {
            val : ''
          }
        ],
        img : '',
        nextorder : '',
        add_count : ''
      };

      this.questions.answers.push(optionsObj);
    },

    //==================== 添加选项描述
    addDescription : function(optionsIndex){
      var descriptionObj = {
         val : ''
      };

      this.questions.answers[optionsIndex].desc.push(descriptionObj);
    },

    //==================== 删除描述
    deleteDescription : function(optionsIndex,descIndex){
      this.questions.answers[optionsIndex].desc.splice(descIndex,1);
    }
    
  }
}
</script>

<style lang="less" scoped>
@import './../../base.less';

.module-radio {

  .edit {

    // 选项
    .questions-options {
      margin-bottom: 15px;

      .options-val {
        position: relative; margin-bottom: 5px;

        .delete {
          position: absolute; right: 0; top: 0; width: 30px; height: 34px; .imagesIcon(-80px -7px);
        }

        input[type='text'] {
          padding-right: 34px; width: 500px;
        }

        s {
          position: absolute; left: -14px; top: 0; display: block; width: 8px; height: 34px; .imagesIcon(-14px -7px);
        }
      }

      // 描述
      .options-description-list {
        padding-left: 10px;
      }
    }

    // 添加选项
    .add-options {
      display: inline-block; padding: 0 10px; width: 480px; border: 1px dashed #999; line-height: 32px; border-radius: 3px; color: #b2b2b2;
      
      &:hover {
        border-color: #3ca3f7; color: #3ca3f7;
      }
    }
  }

  .view {

    .questions-options-list {
      padding: 0 0 0 30px;

      .questions-options {
        position: relative; margin-bottom: 25px;

        .icon {
          position: absolute; left: -30px; top: -1px; display: block; width: 16px; height: 16px; .imagesIcon(-281px -16px);
        }

        dl {
          line-height: 14px; 

          dt {
            display: inline-block; padding-right: 8px; font-size: 14px; color: #4c4c4c; 
          }

          dd {
            display: inline-block; padding: 0 8px; border-left: 1px solid #f1f1f1; font-size: 12px; color: #808080; 
          }

          &.dc {

            dd {
              display: block; margin-top: 15px; padding: 0; border: 0; line-height: 20px; 
            }
          }
        }
      }
    }
  }
}

.ui-input-tit .title {
  width: 110px;
}

.module-questions .inner .questions-options-list {
  padding-left: 113px;
}
</style>
