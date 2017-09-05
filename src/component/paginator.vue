<template>
  <div class="paginator-control">
    <div class="paginator-data">当前页<var>{{ pageListData.page_rows }}</var>条记录，共计有调查问卷<var>{{ pageListData.page_total_count }}</var>条调查问卷</div>
    <div v-show="pageListData.page_count > 1" class="paginator-inner">
        <a v-on:click="pageListData.page_current != 1 ? changePage(pageListData.page_current - 1) : false" v-bind:class="{ disabled : pageListData.page_current === 1 }" href="javascript:void('prev');" class="prev">« 上一页</a>
        <span class="pages">
            <a v-on:click="changePage(index + 1)" v-for="(item, index) in pageListData.page_count" v-bind:href="'javascript:void(' + (index + 1) + ');'" v-bind:title="index + 1" v-bind:class="{ current : pageListData.page_current === (index + 1) }">{{ index + 1 }}</a>
        </span>
        <a v-on:click="pageListData.page_current != pageListData.page_count ? changePage(pageListData.page_current + 1) : false" v-bind:class="{ disabled : pageListData.page_current === pageListData.page_count }" href="javascript:void('next');" class="next">下一页 »</a>
        <span class="total-pages">共 {{ pageListData.page_count }} 页</span>
        <span class="go-to">到第 <input v-on:keyup.enter="changePage($event.target.value)" v-bind:value="pageListData.page_current" maxlength="3" type="text"> 页</span>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {

    }
  },

  props : ['pageListData'],

  computed : {
  
  },

  created : function() {

  },

  mounted : function() {

  },

  methods : {

    changePage : function(page){
      this.$emit('changePage',page);
    }

  }
}
</script>

<style lang="less" scoped>
@import './../base.less';
</style>
