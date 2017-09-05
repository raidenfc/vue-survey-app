<template>
<div id="listInner">
  <div class="page-list paginator-data">
    <table class="ui-table">

      <tr>
        <th class="user-name">账号</th>
        <th class="real-name">用户名</th>
        <th class="role">权限</th>
        <th class="time">添加时间</th>
        <th class="operation">操作</th>
      </tr>

      <tr v-for="(item, index) in pageListData.page_data">
        <td>
          <span class="user-name">
            <span class="t-b"></span>
            {{ item.user_name }}
          </span>
        </td>
        <td><span class="real-name">{{ item.user_realname }}</span></td>
        <td><span v-bind:class="userRole[item.user_role].class">{{ userRole[item.user_role].text }}</span></td>
        <td><span class="time">{{ item.user_time_create }}</span></td>
        <td>
          <span class="btn-inner">

            <span class="btn edit">
              <a v-on:click="editUser(item, index)" href="javascript:void(0);"><span class="icon"></span></a>
              <cite>编辑</cite>
            </span>

            <span class="btn delete">
              <a v-on:click="delUser(item.user_id, index)" href="javascript:void(0);"><span class="icon"></span></a>
              <cite>删除</cite>
            </span>
          </span>
        </td>
      </tr>

    </table>
  </div>

  <paginator v-bind:page-list-data="pageListData" v-on:changePage="getUserList"></paginator>

</div>
</template>

<script>
export default {
  data () {
    return {

      //用户权限
      userRole : [
        {
          text : '-',
          class : ''
        },
        {
          text : '全部',
          class : 'not-started'
        },
        {
          text : '问卷&投票',
          class : 'not-started'
        },
        {
          text : '第一话题',
          class : 'in-progress'
        }
      ]

    }
  },

   watch : {

    // 触发弹窗确定
    popupCallback : function(){
      if(this.popupCallback){
        this.popupDefine()
      }
    }

  },
  
  computed : {

    //获取用户列表数据
    pageListData : function(){
      return this.$store.getters.getPageList;
    },

    //是否触发弹窗确定
    popupCallback : function(){
      return this.$store.getters.getPopupConfirmData.callback
    }
 
  },

  created : function() {

  },

  mounted: function() {

    //获取用户列表
    this.getUserList(1);

  },

  methods : {

    //编辑用户
    editUser : function(item, index){
      var obj = item;
      obj.index = index;
      obj.password = '';
      this.$store.dispatch('updataPopupUserData',{
        data : obj,
        display : true
      });
    },

    //删除用户
    delUser : function(id,index){
      this.$store.dispatch('updataPopupConfirm',{
        text : '确定删除？',
        display : true,
        callback : false,
        index : index,
        id : id
      });
    },

    //==================== 触发弹窗 确定删除问卷
    popupDefine : function(){

      var data = this.$store.getters.getPopupConfirmData;

      this.$http({
        method: 'get',
        url: this.$store.getters.getAjaxUrl + 'user/delete/' + data.id,
        data: {},
        headers: { 'token' : this.$store.getters.getToken },
        emulateJSON: true
      })
      .then(function(response) {
        if(response.data.code === 200){

          this.$store.dispatch('deletePageList', data.index);

          this.$store.dispatch('updataPopupConfirm',{
            text : '',
            display : false,
            callback : false
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
    },

    //获取问卷列表
    getUserList : function(page,str){
      this.$store.dispatch('getUserList', {
        page : page,
        str : str || ''
      });
    }

  }
}
</script>

<style lang="less">
@import './../base.less';

#listInner {
  position: relative; padding: 50px 60px; background: #fff;

  .ui-table {
    min-width: 1000px;

    th.user-name {
      padding-left: 30px; width: 45%;
    }

    th.operation {
      width: 200px; text-align: center;
    }

    td {

      .user-name {
        vertical-align: middle; color: #000; font-weight: bold; font-size: 14px; .omit();

        .t-b {
          display: inline-block; margin: 0 5px 0 10px; width: 8px; height: 17px; .imagesIcon(-14px -15px); vertical-align: middle;
        }
      }

      .time {
        font-size: 12px;
      }

      .in-progress {
        color: #68c000;
      }

      .not-started {
        color: #0096ff;
      }
    }
  }

  .btn-inner {
    display: block; padding-right: 0; height: 50px; text-align: center;

    .btn {
      position: relative; display: inline-block; width: 40px; height: 50px; vertical-align: middle;

      .icon {
        position: absolute; top: 16px; left: 10px; display: inline-block; width: 20px; height: 20px;
      }

      a {
        display: block; width: 40px; height: 50px;

        &:hover {
          .opacity(100);
        }
      }

      cite {
        position: absolute; top: 51px; left: 0; display: inline-block; width: 40px; height: 0; overflow: hidden; background: #387fd8; line-height: 30px; text-align: center; color: #fff; .transitionDuration(.2s);
      }

      &:hover {
        z-index: 1; background: #387fd8;

        cite {
          height: 30px;
        }
      }

      &.begin {

        .icon {
          .imagesIcon(-11px -118px);
        }

        &:hover {

          .icon {
            .imagesIcon(-11px -154px);
          }
        }
      }

      &.edit {

        .icon {
          .imagesIcon(-42px -118px);
        }

        &:hover {

          .icon {
            .imagesIcon(-42px -154px);
          }
        }
      }

      &.sort {

        .icon {
          .imagesIcon(-76px -118px);
        }

        &:hover {

          .icon {
            .imagesIcon(-76px -154px);
          }
        }
      }

      &.statistics {

        .icon {
          .imagesIcon(-112px -118px);
        }

        &:hover {

          .icon {
            .imagesIcon(-112px -154px);
          }
        }
      }

      &.delete {

        .icon {
          .imagesIcon(-147px -118px);
        }

        &:hover {

          .icon {
            .imagesIcon(-147px -154px);
          }
        }
      }
    }
  }
}

</style>
