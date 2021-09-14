<!--
 * @Author: jianbang
 * @Description: 发布器-图片上传
-->
<template>
  <div class="com-publish-upload_image">
    <div class="top">
      <p>{{ `Upload image(${count}/18)` }}</p>
      <span>
        Format supports JPG / JPEG / PNG / tiff / webp / heic / gif
      </span>
    </div>
    <div class="icon-close" @click="onClose"></div>
    <div class="upload-img-box">
      <upload-img @onImgChange="onImgChange"></upload-img>
    </div>
  </div>
</template>

<script>
import UploadImg from '@/components/common/UploadImage';

export default {
  components: {
    'upload-img': UploadImg,
  },
  data() {
    return {
      count: 0,
    };
  },
  methods: {
    onImgChange(data) {
      this.count = data.length;
    },
    // 关闭图片上传功能
    onClose() {
      if (this.count > 0) {
        this.$confirm('Are you sure to give upload the image?', '', {
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel',
        })
          .then(() => {
            this.$emit('onCloseImgUpload');
          })
          .catch(() => {});
        return;
      }
      this.$emit('onCloseImgUpload');
    },
  },
};
</script>

<style lang="less" scoped>
.com-publish-upload_image {
  padding: 13px 20px;
  position: relative;
  .top {
    text-align: left;
    & > p,
    & > span {
      display: block;
    }
    & > p {
      font-family: SFUIText-Regular;
      font-size: 16px;
      color: #333333;
      letter-spacing: 0;
      margin-bottom: 8px;
    }
    & > span {
      font-family: SFUIText-Regular;
      font-size: 12px;
      color: #b9bdc7;
    }
  }
  .icon-close {
    position: absolute;
    top: 21px;
    right: 25px;
    width: 15px;
    height: 15px;
    cursor: pointer;
    background: url('../../assets/images/publisher/media_icon_close_normal@3x.png') no-repeat;
    background-size: 15px;
    transition: 0.3s;
    &:hover {
      background-image: url('../../assets/images/publisher/media_icon_close_click@3x.png');
    }
  }
  .upload-img-box {
  }
}
</style>
