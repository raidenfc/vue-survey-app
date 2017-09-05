<template>
  <div v-show="userData.display" class="popup">
    <div class="popup-new-user ui_animated ui_fadeInUp">
      <div class="tit">
        <span>{{ userData.data ? '修改' : '添加' }}帐号</span>
        <a v-on:click="closePopup" class="close" title="关闭" href="javascript:void(0);"></a>
      </div>

      <div class="inner">
        <div class="ui-input-tit">
          <span class="title">帐号：</span>
          <span class="con"><input v-on:blur="userName = $event.target.value" v-bind:value="userData.data.user_name" type="text" maxlength="20" placeholder="至少4位"></span>
        </div>

        <div class="ui-input-tit">
          <span class="title">用户名：</span>
          <span class="con"><input v-on:blur="realName = $event.target.value" v-bind:value="userData.data.user_realname" type="text" maxlength="20" placeholder="至少2位"></span>
        </div>

        <div class="ui-input-tit">
          <span class="title">密码：</span>
          <span class="con"><input v-on:blur="password = $event.target.value" v-bind:value="userData.data.password" type="password" maxlength="20" placeholder="至少6位"></span>
        </div>

        <div class="ui-input-tit">
          <span class="title">权限：</span>
          <span class="con">
            <select v-on:input="role = parseInt($event.target.value)" class="ui-select">
              <option value="2" v-bind:selected="userData.data.user_role === 2 ? 'selected' : ''">问卷&#38;投票</option>
              <option value="3" v-bind:selected="userData.data.user_role === 3 ? 'selected' : ''">第一话题</option>
              <option value="1" v-bind:selected="userData.data.user_role === 1 ? 'selected' : ''">全部</option>
            </select>
          </span>
        </div>

        <a v-on:click="define" class="add-user" href="javascript:void(0);">{{ userData.data ? '修改' : '添加' }}</a>

      </div>
    </div>
    <div v-on:click="closePopup" class="bg"></div>
  </div>
</template>

<script>

export default {
  data () {
    return {

      //用户名
      userName : '',

      //真实姓名
      realName : '',

      //密码
      password : '',

      //权限
      role : ''

    }
  },

  computed : {

    //获取添加用户数据
  	userData : function(){
  		return this.$store.getters.getPopupUserData;
  	}
  
  },

  created : function() {

  },

  mounted : function() {

  },

  methods : {

  	//关闭弹窗
  	closePopup : function(){
  		this.$store.dispatch('updataPopupUserData',{
        data : '',
        display : false
      });
  	},

  	//确定
  	define : function(){

      var User = {
        user_id : this.userData.data.user_id || '',
        user_role : !this.userData.data ? (this.role || 2) : (this.role || this.userData.data.user_role),
        user_name : this.userName || this.userData.data.user_name,
        user_realname : this.realName || this.userData.data.user_realname,
        user_password : this.password
      };

      if(User.user_name === ''){
        this.$store.dispatch('updataPopupTips',{
          text : '帐号不能为空',
          display : true
        });
      }

      if(User.user_name.length < 4){
        this.$store.dispatch('updataPopupTips',{
          text : '帐号至少4位',
          display : true
        });
      }

      else if(User.user_password === '' && !this.userData.data){
        this.$store.dispatch('updataPopupTips',{
          text : '密码不能为空',
          display : true
        });
      }

      else if(User.user_password.length < 6 && !this.userData.data){
        this.$store.dispatch('updataPopupTips',{
          text : '密码至少6位',
          display : true
        });
      }

      else if(User.user_realname === ''){
        this.$store.dispatch('updataPopupTips',{
          text : '用户名不能为空',
          display : true
        });
      }

      else if(User.user_realname.length < 2){
        this.$store.dispatch('updataPopupTips',{
          text : '用户名至少2位',
          display : true
        });
      }

      else {
        this.$http.post(this.$store.getters.getAjaxUrl + 'user/create/',{ User : User },{
          headers : {
            'token' : this.$store.getters.getToken
          },
          emulateJSON : true
        })
        .then(function(response) {
          if(response.data.code === 200){

            //用户名
            this.userName = '';

            //真实姓名
            this.realName = '';

            //密码
            this.password = '';

            //权限
            this.role = '';

            //提示成功
            var tx = this.userData.data ? '修改用户成功' : '添加用户成功';
            this.$store.dispatch('updataPopupTips',{
              text : tx,
              display : true
            });

            //添加用户
            if(!this.userData.data){
              this.$store.dispatch('addPageList', response.data.data);
            }

            //修改用户
            else{
              if(this.userData.data.index != -1){
                this.$store.dispatch('updataPageIndex', {
                  index : this.userData.data.index,
                  data : response.data.data
                });
              }else{
                //修改自己 重新保存用户信息
                this.$store.dispatch('updataUserInfo',{
                  token : this.$store.getters.getToken,
                  user_info : response.data.data
                });
              }
            }

            //隐藏弹窗
            this.$store.dispatch('updataPopupUserData',{
              data : '',
              display : false,
            });

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
      }
  	}

  }
}
</script>

<style lang="less" scoped>
@import './../base.less';


.popup {
  position: relative;

  .popup-new-user {
      position: fixed; top: 50%; left: 50%; z-index: 101; margin: -210px 0 0 -190px; width: 380px; background-color: #fff; border: 1px solid #c0c0c0; 
  
      .close {
        position: absolute; right: 10px; top: 15px; display: block; width: 11px; height: 11px; cursor: pointer; .imagesIcon(-66px -18px);
      }

      .tit {
        margin-right: 210px; padding-left: 50px; height: 60px; border-bottom: 2px solid #ed791d; color: #3f423c; line-height: 80px; font-size: 24px; font-weight: normal;
      }

      .inner {
        padding: 40px 50px;

        .ui-input-tit {
          margin-bottom: 25px;

          .title {
            width: 80px; padding-right: 10px; font-size: 16px; color: #76806c; line-height: 30px; text-align: right; 
          }

          .con  {
            
            input {
              padding: 0 10px; width: 160px; line-height: 30px; height: 30px; font-size: 14px; background-color: #f7faf5; border: 1px solid #c5ccbe; border-radius: 4px;
            }

            select {
              width: 182px; background-color: #f7faf5; height: 32px;
            }
          }
        }
      }

      .add-user {
        position: relative; margin-top: 10px; text-align: center; .btn-style(100%,36px,#277ce6,#fff);
      }

      // 弹窗动画
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

  .bg {
    position: fixed; top: 0; left: 0; z-index: 100; width: 100%; height: 100%; background: #fff; opacity: .4; filter: alpha(opacity=40); 
  }
}
</style>
