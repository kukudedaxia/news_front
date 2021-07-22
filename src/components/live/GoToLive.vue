<template>
  <div class="goto_live">
    <div class="item-box flex title_img">
      <div class="upliad">
        <el-upload
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
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
import $ from 'jquery';
import { fileByBase64, base64ByBlob, getCrc32, getMd5 } from '@/utils/upload';

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
      file: '',
    };
  },
  methods: {
    async beforeAvatarUpload(file) {
      try {
        this.file = file;
        const base64 = await fileByBase64(file);
        const blob = await base64ByBlob(base64);
        const md5 = await getMd5(blob);
        const cs = await getCrc32(blob);
        const form = new FormData();
        form.append('file', blob);
        $.ajax({
          type: 'post',
          data: form.get('file'),
          // eslint-disable-next-line prettier/prettier
              url: `/sup/upload.json?file_source=1&cs=${cs}&ent=alpha&appid=339644097&uid=7268104713&raw_md5=${md5}`,
          async: false,
          contentType: 'application/x-www-form-urlencoded',
          processData: false,
          headers: {
            Accept: 'application/json',
          },
          success: res => {
            this.imgPid = res.pic.pid;
          },
          error: err => {
            console.log(err);
          },
        });
      } catch (error) {
        console.error(error);
      }
      return false;
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
