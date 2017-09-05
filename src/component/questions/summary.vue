<template>
  <div class="module-topic module-questions">
    <div class="inner">
      <span v-bind:class="{ error : surveyTitleError, border : !topic.title }" class="ui-text title">
        <input v-on:blur="saveTitle" v-bind:value="topic.title" class="val-title" type="text" placeholder="问卷标题">
      </span>
      
      <span v-bind:class="{ border : !topic.desc }" class="ui-textarea description">
        <textarea v-on:blur="saveDesc" v-bind:value="topic.desc" class="val-description" placeholder="问卷描述"></textarea>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {

      //标题提示不能为空
      surveyTitleError : false
      
    }
  },

  computed : {

    //获取摘要
    topic : function(){
      return {
        title : this.$store.getters.getSurveyData.title,
        desc : this.$store.getters.getSurveyData.desc
      }
    }

  },

  methods : {

    //保存标题
    saveTitle : function(e){
      var val = e.target.value;
      var description = this.$el.getElementsByClassName('val-description')[0].value;
      val === '' ? this.surveyTitleError = true : this.surveyTitleError = false;
      if(val != ''){
        this.$store.dispatch('updataSurveyTit',{
          title : val,
          desc : description
        });
      }
    },

    //保存描述
    saveDesc : function(e){
      var val = e.target.value;
      this.$store.dispatch('updataSurveyDesc', val);
    },

  }
}
</script>

<style lang="less" scoped>
@import './../../base.less';

.module-topic {

  .inner {
    
    .ui-text {
      display: block; margin-bottom: 20px;

      input {
        height: 58px; border-color: #fff; line-height: 58px; text-align: center; font-size: 32px; color: #4c4c4c;

        &:hover {
          border-color: #8cd5ff;
        }

        &:focus {
          border-color: #00a2ff;
        }
      } 

      &.error {

        input {
          border-color: #ff0000;
        }
      }
    }

    .ui-textarea {
      display: block;
      
      textarea {
        height: 90px; border-color: #fff;

        &:hover {
          border-color: #8cd5ff;
        }

        &:focus {
          border-color: #00a2ff;
        }
      }
    }

    .border {

      textarea,
      input {
        border-color: #ccc;
      }
    }
  }
}
</style>
