<template>
  <div id="login">
    <div class="header">
      <div class="top-bar">
        <div class="logo"></div>
      </div>
    </div>

    <div class="login-main">
      <div class="login-max"></div>

      <div class="from-style login-from">

        <div class="input-style account" v-bind:class="{ error : usernameYz }">
          <div class="title"><label for="username">用户名：</label></div>
          <div class="input-inner">
            <input v-on:keyup.enter="surveyLogin" v-on:blur="username === '' ? usernameYz = true : usernameYz = false" v-model="username" class="text-style" type="text" placeholder="请输入用户名">
            <span class="error-tips">请输入用户名</span>
          </div>
        </div>

        <div class="input-style password" v-bind:class="{ error : passwordYz }">
          <div class="title"><label for="password">密&nbsp;&nbsp;&nbsp;码：</label></div>
          <div class="input-inner">
            <input v-on:keyup.enter="surveyLogin" v-on:blur="password === '' ? passwordYz = true : passwordYz = false" v-model="password" class="text-style" type="password" placeholder="请输入密码">
            <span class="error-tips">请输入密码</span>
          </div>
        </div>

<!--             <div class="input-style verification" v-bind:class="{ error : verificationYz }">
            <div class="title"><label for="verification">验证码：</label></div>
            <div class="input-inner">
                <input v-model="verification" id="" class="text-style" maxlength="4" type="text">
                <a class="verification-img" href="javascript:void(0);" title="切换验证码"><img src=""></a>
                <a class="switch-verification" href="javascript:void(0);">换一张</a>
                <span class="error-tips">请输入验证码</span>
            </div>
        </div> -->
<!-- 
        <div class="input-style">
            <div class="input-inner">
                <label for="auto-login">
                    <span class="auto-login-inner"><input type="checkbox" id="auto-login">自动登录</span>
                </label>
            </div>
        </div> -->

        <div class="input-style">
          <div class="input-inner">
            <a v-on:click="surveyLogin" class="btn-style login-btn" href="javascript:void(0);">登录</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {

      //用户名
      username : '',
      usernameYz : false,

      //密码
      password : '',
      passwordYz : false,

    }
  },

  computed : {
  
  },

  created : function() {

    this.$store.dispatch('updataUserInfo', '');

  },

  mounted : function() {

  },

  methods : {

    //登录
    surveyLogin : function(){

      if(this.username === ''){
        this.usernameYz = true;
      }

      if(this.password === ''){
        this.passwordYz = true;
      }

      if(this.username != '' && this.password != ''){
        var LoginForm = {
          username : this.username,
          password : this.password
        };

        this.$http.post(this.$store.getters.getAjaxUrl + 'login',{ LoginForm : LoginForm },{
          headers : {
          },
          emulateJSON : true
        })
        .then(function(response) {
          if(response.data.code === 200){

            this.$store.dispatch('updataUserInfo', response.data.data);

            this.$router.push({ name: 'list' })

          }else{
            this.$store.dispatch('updataPopupTips',{
              text : response.data.message,
              display : true
            });
          }
        }, 
        function(response) {
          alert('服务出错了，请联系管理员');
          console.log(response);
        });
      }
    }
  }
}
</script>

<style lang="less">
@import './../base.less';

.login-from {
  margin: auto;
  width: 300px
}

.from-style .input-style {
  position: relative;
  margin-bottom: 20px;
  min-height: 20px
}

.from-style .input-style .input-inner {
  position: absolute;
  left: 70px;
  top: 0
}

.from-style .input-style .title {
  width: auto;
  font-size: 16px;
  color: #76806c;
  line-height: 38px
}

.login-from .input-style .title {
  width: 70px;
  color: #41494c
}

.from-style .input-inner {
  position: relative
}

.from-style .input-inner .text-style {
  padding: 0 12px;
  width: 154px;
  height: 36px;
  background-color: #f7faf5;
  border: 1px solid #c5ccbe;
  border-radius: 4px;
  font-size: 14px;
  line-height: 34px;
  color: #76806c;
  outline: none
}

.from-style .input-inner .text-style:focus {
  border-color: #50b4e6
}

.from-style .input-inner .text-style::-webkit-input-placeholder {
  color: #c7ccc2
}

.from-style .verification .text-style {
  width: 44px;
  font-size: 16px
}

.from-style .verification .verification-img img {
  display: inline-block;
  margin: 0 8px;
  width: 90px;
  height: 32px;
  vertical-align: middle
}

.from-style .verification .switch-verification {
  font-size: 12px;
  color: #3ca3f7;
  text-decoration: underline
}

.from-style .auto-login-inner input {
  margin-right: 5px;
  vertical-align: middle
}

.from-style .auto-login-inner {
  color: #6c7980
}

.from-style .btn-style {
  display: inline-block;
  width: 180px;
  height: 34px;
  line-height: 34px;
  background-color: #277ce6;
  border: 1px solid #277ce6;
  border-radius: 4px;
  text-align: center;
  color: #fff;
  font-size: 16px
}

.from-style .btn-style:hover {
  text-decoration: none
}

.from-style .error-tips {
  display: none
}

.from-style .input-style.error .error-tips {
  display: inline-block;
  position: absolute;
  left: 189px;
  top: 0;
  line-height: 38px;
  font-size: 12px;
  color: #e66950;
  white-space: nowrap
}

.from-style .verification.error .error-tips {
  left: 235px
}

.from-style .input-style.error .text-style {
  border-color: #e66950;
  color: #e66950
}

.from-style .btn-disabled {
  background-color: #f2f0e9;
  border-color: #e0dbcb;
  color: #ccc;
  cursor: default
}

.from-style .data-error {
  display: none;
  margin: 0 0 26px 70px;
  width: 180px;
  height: 30px;
  background-color: #ea7a20;
  font-size: 12px;
  line-height: 30px;
  color: #fff;
  text-align: center
}

body {
  background: none
}

.top-bar {
  height: 50px;
  background-color: #1a61b9
}

.top-bar .logo {
  margin-left: 27px;
  width: 158px;
  height: 50px;
  background: url(http://himg2.huanqiu.com/survey/logo_top.png) no-repeat
}

.top-bar .logo a {
  display: block;
  width: 158px;
  height: 50px
}

.login-main .login-max {
  margin: 70px auto 45px auto;
  width: 185px;
  height: 229px;
  background: url(http://himg2.huanqiu.com/survey/logo_max.png) no-repeat
}
</style>
