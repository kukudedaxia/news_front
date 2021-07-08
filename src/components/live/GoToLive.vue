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
          <img v-if="imgPid" :src="`https://img.bee-cdn.com/orj360/${imgPid}.jpg`" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
      <div class="title-box">
        <p class="title">Beeto Live Title</p>
        <el-input
          v-model="title"
          placeholder="Gigi`s Live"
          maxlength="50"
          :clearable="true"
        ></el-input>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="item-box">
      <p class="title">Server URL</p>
      <div class="flex">
        <el-input v-model="url"></el-input>
        <el-button
          type="primary"
          style="margin-left:10px"
          v-clipboard:copy="url"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
          >Copy</el-button
        >
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
        <el-button
          type="primary"
          style="margin-left:10px"
          v-clipboard:copy="key"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
          >Copy</el-button
        >
      </div>
      <span class="desc">
        2. This stream key is valid until you log out of Beeto
      </span>
      <span class="desc">
        3. Link source
      </span>
    </div>
    <el-button
      type="primary"
      style="width: 200px"
      :loading="btnLoading"
      :disabled="btnDisabled"
      @click="onLiveClick"
      >{{ btnTextObj[liveState] }}</el-button
    >
  </div>
</template>

<script>
export default {
  props: {
    // 直播状态：0 未直播 1 直播中 2 已结束
    liveState: {
      type: Number,
      default: 0,
    },
    btnLoading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    btnDisabled() {
      if (this.title && this.url && this.key && this.imgPid && this.liveState !== 2) {
        return false;
      }
      return true;
    },
  },
  data() {
    return {
      title: '',
      url: '',
      key: '',
      btnTextObj: {
        0: 'Start Live',
        1: 'End Live',
        2: 'Live Ended',
      },
      imgPid: '3ba012bblz1grwynbdh5cj20u015u42h',
    };
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imgPid = URL.createObjectURL(file.raw);
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
    onLiveClick() {
      const param = {
        live_type: 1, // 0:预约feed开播 1:直接开播
        title: this.title,
        cover_img: this.imgPid,
      };
      this.$emit('liveState', param);
    },
    onClearData() {
      this.title = '';
      this.url = '';
      this.key = '';
      this.imgPid = '';
    },
    // ----- copy ----- //
    onCopy(e) {
      this.$message({
        message: '复制成功！',
        type: 'success',
      });
    },
    onError(e) {
      // 复制失败
      this.$message({
        message: '复制失败！',
        type: 'error',
      });
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
      color: #909399;
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
