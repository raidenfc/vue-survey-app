<template>
  <div v-bind:class="{ aw : pic }" class="upload" v-bind:style="'width: ' + width + 'px; height: ' + height + 'px;'">
    <a v-show="!swBg" href="javascript:void(0);" class="add-file"><s></s><input type="file" class="file-btn"></a>
    <div class="img">
      <div v-show="swBg" class="sw">
        <div class="text">上传中...</div>
        <div class="bg"></div>
      </div>
      <img class="img-base" v-bind:src="pic">
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {

      width : this.wh.split('*')[0],

      height : this.wh.split('*')[1],

      swBg : false,

      pic : this.img
      
    }
  },

  props : ['img','wh','temp'],

  mounted : function(){

    //==================== file 事件
    var t = this;
    this.$el.getElementsByClassName('file-btn')[0].onchange = function(e){
      t.readFile(e);
    }

  },

  methods : {

    //==================== 转换图片base64
    readFile : function(e){
      var file = e.target.files[0];
      var type = file.type.split('/')[1];

      if(file){
        var t = this;
        if(!/image\/\w+/.test(file.type)){ 
          alert("文件必须为图片"); 
          return false; 
        }

        if((file.size / 1024) > 2048){
          alert("文件最大不超过 2 MB"); 
          return false; 
        }

        t.swBg = true;

        //声明一个FileReader实例
        var reader = new FileReader(); 

        //调用readAsDataURL方法来读取选中的图像文件
        reader.readAsDataURL(file);

        reader.onload = function(e){

          var base64 = this.result;
          var blob = t.getBlob(base64, type);

          var sw = t.img === '' ? true : false;
          t.pic = base64;

          var oMyForm = new FormData();
          oMyForm.append("UploadForm[file_upload]", blob);

          t.$http.post(t.$store.getters.getAjaxUrl + 'article/upload/',oMyForm,{
            headers : {
              'token' : t.$store.getters.getToken
            },
            emulateJSON : true
          })
          .then(function(response) {
            if(response.data.code === 200){

              if(sw){
                //第一次上传完成
                t.$emit('uploadOne');
              }

              //上传完成，回调，参数为图片地址
              t.swBg = false;
              t.$emit('uploadDone', {
                img : response.data.data.imgurl,
                temp : t.temp
              });

            }else{
              t.$store.dispatch('updataPopupTips',{
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
    },

    //转换
    getBlob: function(data,ft){
      var b64 = data.replace('data:image/'+ft+';base64,',''), binary = atob(b64), array = [];
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return  new Blob([new Uint8Array(array)],{type: 'image/'+ft});
    }

  }
}
</script>

<style lang="less" scoped>
@import './../base.less';

.upload {
  position: relative;


  .add-file {
    position: absolute; left: 0; top: 0; z-index: 1; display: block; width: 100%; height: 100%; box-sizing: border-box; border: 1px dashed #777; .transitionDuration(.2s); border-radius: 5px; vertical-align: middle;

    s {
      position: absolute; left: 50%; top: 50%; display: block; margin: -20px 0 0 -20px; width: 40px; height: 40px; .imagesIcon(-316px -143px); .opacity(60);
    }

    &:hover {
      border-color: #2b70c5;
    }
    
    input[type='file'] {
      width: 100%; height: 100%; .opacity(0);
    }
  }

  .img {
    position: absolute; left: 0; top: 0; width: 100%; height: 100%;

    .img-base {
      display: none; width: 100%; height: 100%; border-radius: 5px;
    }

    .sw {

      .text {
        position: absolute; left: 0; top: 0; width: 100%; height: 100%; z-index: 1; background:transparent; text-align: center; font-size: 14px; color: #fff; line-height: 120px;
      }

      .bg {
        position: absolute; left: 0; top: 0; width: 100%; height: 100%; background: #000; opacity: .6; border-radius: 5px; 
      }
    }
  }

  &.aw {

    .img-base {
      display: block;
    }

    .add-file {
      border: 0;
    }
  }
}

</style>
