<template>
  <div v-show="data.display" class="popup">
    <div class="popup-inner ui_animated ui_fadeInUp">
      <div class="top-line"></div>
      <div class="text">{{ data.text }}</div>
      <a v-on:click="closePopup" class="close" title="关闭" href="javascript:void(0);"></a>
      <div class="btn">
        <a v-on:click="closePopup" class="cancel" href="javascript:void(0);">取消</a>
        <a v-on:click="define" class="define" href="javascript:void(0);">确定</a>
      </div>
    </div>
    <div v-on:click="closePopup" class="bg"></div>
  </div>
</template>

<script>

export default {
  data () {
    return {

    }
  },

  computed : {

  	data : function(){
  		return this.$store.getters.getPopupConfirmData
  	}
  
  },

  created : function() {

  },

  mounted : function() {

  },

  methods : {

  	//关闭弹窗
  	closePopup : function(){
  		this.$store.dispatch('updataPopupConfirm',{
        text : '',
        display : false,
        callback : ''
      });
  	},

  	//确定
  	define : function(){
  		this.$store.dispatch('definePopupConfirm');
  	}

  }
}
</script>

<style lang="less" scoped>
@import './../base.less';

</style>
