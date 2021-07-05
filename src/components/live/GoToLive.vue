<template>
  <div class="goto_live">
    <div class="item-box flex title_img">
      <div class="upliad">
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
      <div class="title-box">
        <p class="title">Beeto Live Title</p>
        <el-input v-model="title" placeholder="Gigi`s Live"></el-input>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="item-box">
      <p class="title">Server URL</p>
      <div class="flex">
        <el-input v-model="url"></el-input>
        <el-button type="primary" style="margin-left:10px">Copy</el-button>
      </div>
      <span class="desc">
        1. This may be referred to as "URL" or "Address" in your streaming software
      </span>
    </div>
    <el-divider></el-divider>
    <div class="item-box">
      <p class="title">Stream Key</p>
      <div class="flex">
        <el-input v-model="key"></el-input>
        <el-button type="primary" style="margin-left:10px">Copy</el-button>
      </div>
      <span class="desc">
        2. This stream key is valid until you log out of Beeto
      </span>
      <span class="desc">
        3. Link source
      </span>
    </div>
    <el-button type="primary" style="width: 200px">Start Live</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      url: '',
      key: '',
      imageUrl:
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202106%2F08%2F20210608103243_1e19d.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1627729841&t=981c92fd4308f515b003935cc114a26c',
    };
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
  },
};
</script>

<style lang="less" scoped>
.goto_live {
  .item-box {
    text-align: left;
    margin: 20px 0;
    .title {
      font-weight: bold;
      margin-block: 8px;
    }
    .desc {
      display: block;
      font-size: 14px;
      margin-top: 10px;
    }
  }
  .title_img {
    .title-box {
      flex: 1;
      margin-left: 10px;
      text-align: left;
    }
  }
}
.flex {
  display: flex;
}
</style>
<style lang="less">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
  object-fit: cover;
}
</style>
