<template>
  <div v-show="data.display" class="popup ui_animated" v-bind:class="{ ui_fadeInUp : data.display , ui_fadeOutDown : !data.display }">
    <div class="popup-tips"></div>
    <div class="popup-text">{{ data.text }}</div>
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
  		return this.$store.getters.getPopupTipsData
  	}
  
  },

  created : function() {

  },

  mounted : function() {

  },

  methods : {

  }
}
</script>

<style lang="less" scoped>
@import './../base.less';

.popup {
  position: fixed; top: 50%; left: 50%; z-index: 201; margin: -50px 0 0 -150px; width: 300px; height: 100px;

  &.none {
    .opacity(0);
  }

  &.ui_animated {
    -webkit-animation-fill-mode: both; -moz-animation-fill-mode: both; -o-animation-fill-mode: both; animation-fill-mode: both; -webkit-animation-duration: 0.4s; -moz-animation-duration: 0.4s; -o-animation-duration: 0.4s; animation-duration: 0.4s; 
  }

  &.ui_fadeInUp { 
    -webkit-animation-name: fadeInUp; -moz-animation-name: fadeInUp; -o-animation-name: fadeInUp;  animation-name: fadeInUp; 
  }

  &.ui_fadeOutDown {  
    -webkit-animation-name: fadeOutDown;  -moz-animation-name: fadeOutDown;  -o-animation-name: fadeOutDown; animation-name: fadeOutDown;
  }
}

.popup-tips,
.popup-text {
  position: absolute; top: 0; left: 0; width: 300px; height: 100px; border-radius: 6px; 
}

.popup-tips {
  background-color: #333;
}

.popup-text {
  font-size: 16px; color: #fff; line-height: 100px; text-align: center;
}

@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: .7; transform: translateY(0); }
}
@keyframes fadeOutDown {
  0% { opacity: .7; }
  100% { opacity: 0; }
}

</style>
