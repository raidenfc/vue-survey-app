<template>
  <div class="module-operation-bar">
    <ul>
      <li><a v-on:click="delQuestion" title="删除" href="javascript:void(0);" class="delete"></a></li>
      <li><a v-bind:class="{ die : index <= 0 }" v-on:click="upQuestion" title="上移" href="javascript:void(0);" class="up"></a></li>
      <li><a v-bind:class="{ die : index >= (surveyData.questions.length - 1) }" v-on:click="downQuestion" title="下移" href="javascript:void(0);" class="down"></a></li>
      <li><a v-on:click="editQuestion" title="编辑" href="javascript:void(0);" class="edit"></a></li>
    </ul>
  </div>
</template>

<script>

export default {
  data () {
    return {

      sw : false

    }
  },

  props : ['tempId','id','index'],

  watch : {

    // 触发弹窗确定
    popupCallback : function(){
      if(this.popupCallback && this.sw){
        this.defineDelQuestion();
      }
    }

  },

  computed : {

    //问卷数据
    surveyData : function(){
      return this.$store.getters.getSurveyData;
    },

    //是否触发弹窗确定
    popupCallback : function(){
      return this.$store.getters.getPopupConfirmData.callback;
    }
  
  },

  created : function() {

  },

  mounted : function() {

  },

  methods : {

    //==================== 删除题型
    delQuestion : function(){
      if(this.$store.getters.getQuestionSw){
        this.sw = true;
        this.$store.dispatch('updataPopupConfirm',{
          text : '确认删除？',
          display : true,
          callback : false
        });
      }else{
        this.$store.dispatch('updataPopupTips',{
          text : '请先保存题型',
          display : true
        });
      }
    },

    //==================== 删除题型
    defineDelQuestion : function(){
      this.$store.dispatch('delRealQuestions',this.id);
      this.sw = false;
    },

    //==================== 编辑题型
    editQuestion : function(){
      if(this.$store.getters.getQuestionSw){
        this.$store.dispatch('updataQuestionSw', false);
        this.$emit('editTrue');
      }else{
        this.$store.dispatch('updataPopupTips',{
          text : '请先保存题型',
          display : true
        });
      }
    },
    
    //==================== 题型上移
    upQuestion : function(){
      if(this.index > 0){
        if(this.$store.getters.getQuestionSw){
          this.$store.dispatch('moveQuestions',{
            type : 'up',
            index : this.index
          });
        }else{
          this.$store.dispatch('updataPopupTips',{
            text : '请先保存题型',
            display : true
          });
        }
      }
    },

    //==================== 题型下移
    downQuestion : function(){
      if(this.index < this.surveyData.questions.length - 1){
        if(this.$store.getters.getQuestionSw){
          this.$store.dispatch('moveQuestions',{
            type : 'down',
            index : this.index
          });
        }else{
          this.$store.dispatch('updataPopupTips',{
            text : '请先保存题型',
            display : true
          });
        }
      }
    }

  }
}
</script>

<style lang="less" scoped>

.module-questions .inner .module-operation-bar li a.die {
  cursor: not-allowed;

  &:hover {
    background-color: #f7faf5;
  }
}

</style>
