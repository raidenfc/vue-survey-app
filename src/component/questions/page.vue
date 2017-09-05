<template>
  <div class="module-page module-questions bg-fadeInUp">
    <span>分页符</span>
    <a v-on:click="delQuestion" href="javascript:void(0);" title="删除" class="delete"></a>
  </div>
</template>

<script>
export default {
  data () {
    return {

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
      },

      sw : false

    }
  },

  props : ['data','index'],

  watch : {

    // 触发弹窗确定
    popupCallback : function(){
      if(this.popupCallback && this.sw){
        this.defineDelQuestion();
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

    //store 保存题型详细数据
    localStorage.setItem(this.questions.tempId, JSON.stringify(this.questions));
    this.$store.dispatch('saveQuestions', JSON.parse(localStorage.getItem(this.questions.tempId)));
    this.$store.dispatch('updataQuestionSw', true);
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

    //==================== 触发弹窗 确定
    defineDelQuestion : function(){
      this.$store.dispatch('delRealQuestions',this.data.id);
      this.sw = false;
    }

  }
}
</script>

<style lang="less">
@import './../../base.less';

.module-page {
	position: relative; padding: 20px; font-size: 24px; color: #c2c2c2;

	.delete {
		position: absolute; top: 50%; right: 30px; display: block; margin-top: -20px; width: 40px; height: 40px; .imagesIcon(-2px -184px); background-color: #f7faf5;
		
		&:hover {
      background-color: #eef4ea;
    }
	}
}

</style>
