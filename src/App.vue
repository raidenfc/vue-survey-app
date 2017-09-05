<template>
<div id="app">
  <router-view name='head'></router-view>
  <router-view name='body'></router-view>
  <surveyConfirm></surveyConfirm>
  <surveyTips></surveyTips>
  <addUserPopup></addUserPopup>
</div>
</template>

<script>
export default {

  name: 'app',

  data () {
    return {
      
    }
  }
}
</script>

<style lang="less">
html,body,div,span,object,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,pre,a,abbr,address,cite,code,del,dfn,em,img,ins,kbd,q,samp,small,strong,sub,sup,var,b,i,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td{margin:0;padding:0;border:0;font-size:100%;vertical-align:baseline;font-style:normal;}
table{border-collapse:collapse;border-spacing:0}
fieldset,img{border:0}
h1,h2,h3,h4,h5,h6{font-size:100%; font-weight:normal;}
q:before,q:after{content:''}
input,textarea,select{font-family:inherit;font-size:inherit;font-weight:inherit}
input,textarea,select{*font-size:100%}
input[type=submit]{cursor:pointer}
input[type="text"]::-ms-clear{display:none;}
input[type="text"]::-ms-reveal{display:none;}
button{cursor:pointer}
ol,ul{list-style:none;}
a{text-decoration:none; cursor:pointer; color:#3ca3f7;}
a:hover,a:focus{outline:none; text-decoration:none; opacity:.8; filter:alpha(opacity=80); transition: .2s ease;}
.clearfix:after{content:"."; display:block; height:0; clear:both; visibility:hidden;}
.clearfix{display:inline-block;}
* html .clearfix{height:1%;}
.clearfix{display:block;}
input,button,select,textarea{outline:none;}
*:focus{outline:none;}
body{color:#4c4c4c; font:normal 14px/1.5 "Microsoft Yahei",Tahoma,Helvetica,Arial;}
body,html{height:100%;}
textarea{resize:none;}
.hidden{display:none !important;}
input::-webkit-input-placeholder{color:#999;}
input::-moz-placeholder{color:#999;}
input:-ms-input-placeholder{color:#999;}
</style>
