<template>
  <div class="module-radio-img module-questions bg-fadeInUp" v-bind:data-tempId="questions.tempId">
    <div class="no">Q{{ index + 1 }}</div>

    <div v-show="questions.edit" class="inner edit">
      <div class="questions-setup">
        <div v-bind:class="{ error : titleError }" class="ui-input-tit">
          <span class="title">题目</span>
          <span class="con">
            <span class="ui-text">
            <input class="questions-title" v-on:blur="questions.title === '' ? titleError = true : titleError = false" type="text" v-model="questions.title">
              <cite class="error-tips">题目不能为空</cite>
            </span>
          </span>
        </div>
        
        <div class="ui-input-tit">
          <span class="title">备注</span>
          <span class="con">
            <span class="ui-text">
              <input type="text" v-model="questions.subtitle">
            </span>
          </span>
        </div>

        <div class="setup-select">
          <label class="not-required">
            <input type="checkbox" v-model="questions.must">
            <span>非必填</span>
          </label>

          <label class="add-description">
            <input type="checkbox" v-model="isDescription">
            <span>添加描述</span>
          </label>
        </div>
      </div>

      <div v-bind:class="{ 'add-description' : isDescription }" class="questions-options-list">

        <!-- 选项 -->
        <div v-for="(optionsItem,optionsIndex) in questions.answers" v-bind:key="optionsItem.tempId || optionsItem.id" v-bind:data-id="optionsItem.id" class="questions-options clearfix">
          <div class="options-img">
            <upload v-bind:img="optionsItem.img" v-bind:wh="'120*120'" v-bind:temp="optionsIndex" v-on:uploadDone="addImg"></upload>
            <a v-show="questions.answers.length > 1" v-on:click="deleteOptions(optionsIndex,optionsItem.id)" href="javascript:void(0);" title="删除图片" class="delete"><s></s></a>
          </div>

          <!-- 描述 -->
          <div v-show="isDescription" class="options-description-list">
            
            <div class="description-link">
              <input v-model="optionsItem.title" type="text" placeholder="标题">
            </div>

            <div class="description-link">
              <input v-model="optionsItem.url" type="text" placeholder="链接 http://">
            </div>

            <div v-for="(descItem,descIndex) in optionsItem.desc" class="options-description">
              <div class="description-val">
                <input type="text" placeholder="描述" v-model="descItem.val">
                <a v-on:click="deleteDescription(optionsIndex,descIndex)" href="javascript:void(0);" class="delete"></a>
              </div>
            </div>

            <a v-on:click="addDescription(optionsIndex)" href="javascript:void(0);" class="add-description">添加描述</a>
          </div>
        </div>

        <a v-on:click="addOptions" title="新建选项" href="javascript:void(0);" class="add-options"><s></s></a>
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

      <div v-bind:class="{ 'add-description' : isDescription && isDescClass }" class="questions-options-list">
        <div v-for="(optionsItem,optionsIndex) in questions.answers" class="questions-options clearfix">
          <div class="options-img">
            <!-- <a v-bind:href="optionsItem.url"> -->
              <img v-bind:src="optionsItem.img">
            <!-- </a> -->
            <div class="sel"><div class="icon checkbox"></div></div>
          </div>
          <dl>
            <dt>{{ optionsItem.title }}</dt>
            <dd v-for="(descItem,descIndex) in optionsItem.desc">{{ descItem.val }}</dd>
          </dl>
        </div>
      </div>

      <questionsBar v-bind:temp-id="data.tempId" v-bind:id="data.id" v-bind:index="index" v-on:editTrue="editQuestion"></questionsBar>

    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {

      //描述、标题长度添加class
      isDescClass : false,

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

    //描述、标题长度添加class
    this.descClass();
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

        if(this.questions.answers[i].title != ''){
          sw = true;
          break;
        }

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

    //==================== 描述、标题长度添加class
    descClass : function(){
      var sw = false;
      for(var i=0;i<this.questions.answers.length;i++){

        if(this.questions.answers[i].title.length > 5){
          sw = true;
          break;
        }

        for(var j=0;j<this.questions.answers[i].desc.length;j++){
          if(this.questions.answers[i].desc[j].val.length > 5){
            sw = true;
            break;
          }
        }

        if(sw){
          break;
        }
      }

      sw ? this.isDescClass = true : this.isDescClass = false;
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

    //==================== 添加选项的img
    addImg : function(v){
      this.questions.answers[v.temp].img = v.img;
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

        //描述、标题长度添加class
        this.descClass();

        //保存时，没选描述，则不保存描述
        if(!this.isDescription){
          this.questions.answers.forEach(function(item,i){
            item.url = '';
            item.title = '';
            item.desc = [{ val : '' }];
          })
        }

        //过滤为空的选项和描述
        var firQuestion = JSON.parse(JSON.stringify(this.questions));
        for(var i=(firQuestion.answers.length - 1);i>=0;i--){
          if(firQuestion.answers[i].title === '' && firQuestion.answers[i].img === ''){
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
      var uid = new Date().valueOf();
      var optionsObj = {
        id : '',
        tempId : (++uid).toString(36),
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

.module-radio-img {

  .edit {

    .questions-options-list {
      width: auto;

      // 选项
      .questions-options {
        display: inline-block; margin: 0 15px 15px 0; vertical-align: middle; .transitionDuration(.2s); 

        .options-img {
          position: relative; width: 120px; height: 120px; overflow: hidden;

          .delete {
            position: absolute; left: 0; bottom: -20px; z-index: 2; width: 100%; height: 20px; background-color: #f7faf5; .transitionDuration(.2s); .opacity(80);
            
            s {
              display: block; margin: 5px auto; width: 10px; height: 10px; .imagesIcon(-92px -19px); 
            }

            &:hover {
              .opacity(100);
            }
          }

          &:hover {

            .delete {
              bottom: 0;
            }
          }
        }

        .options-description-list {
          display: none; padding-left: 10px; overflow: hidden;

          .description-val,
          .description-link {

            input[type='text'] {
              border: 1px solid #e6e6e6;

              &:hover {
                border: 1px solid #8cd5ff;
              }

              &:focus {
                border: 1px solid #00a2ff;
              }
            }
          }
        }
      }

      .add-options {
        position: relative; display: inline-block; margin: 0 15px 15px 0; width: 118px; height: 118px; border: 1px dashed #fff; .transitionDuration(.2s); vertical-align: middle;

        s {
          position: absolute; left: 50%; top: 50%; display: block; margin: -20px 0 0 -20px; width: 40px; height: 40px; .imagesIcon(-316px -143px); 
        }

        &:hover {
          border-color: #fff;
        }
      }

      &.add-description {

        .questions-options {
          display: block; margin: 0 0 20px 0;

          .options-img {
            float: left; 
          }

          .options-description-list {
            display: block;
          }
        }
      }
    }
  }

  .view {

    .questions-options-list {
      padding: 0; overflow: hidden;

      .questions-options {
        float: left; position: relative; display: inline-block; margin: 0 15px 0 0;

        .options-img {
          position: relative; width: 120px; 

          img {
            display: block; width: 120px; height: 120px;
          }

          .sel {
            margin-bottom: 10px; height: 25px; background-color: #eff1f2; text-align: center;

            .icon {
              display: inline-block; width: 16px; height: 16px; background: url(http://himg2.huanqiu.com/survey/skin_default_icon.png) no-repeat -17px 0; vertical-align: middle;
            
              &.checkbox {
                background: url(http://himg2.huanqiu.com/survey/skin_default_icon.png) no-repeat -17px -16px;
              }
            }
          }
        }

        dl {
          width: 120px; overflow: hidden;

          dt {
            margin-bottom: 15px; font-size: 14px; color: #4c4c4c;
          }

          dd {
            margin-bottom: 15px; font-size: 12px; color: #808080; 
          }
        }
      }

      &.add-description {

        .questions-options {
          float: inherit; display: block; margin: 0 0 30px 0;

          dl {
            padding-left: 20px; width: auto;
          }

          .options-img {
            float: left; 
          }

          dl {
            display: block;
          }
        }
      }
    }
  }
}

</style>
