<template>
  <div class="goto_live">
    <div class="item-box flex title_img">
      <div class="upliad">
        <el-upload
          class="avatar-uploader"
          action="#"
          ref="upload"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          v-loading="uploadLoading"
        >
          <img v-if="imgPid" :src="`https://img.bee-cdn.com/orj360/${imgPid}.jpg`" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
      <div class="title-box text-right">
        <p class="title">{{ $t('live.title') }}</p>
        <el-input v-model="title" maxlength="50" :clearable="true"></el-input>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="item-box text-right">
      <p class="title">{{ $t('live.blogTitle') }}</p>
      <div class="flex">
        <el-input v-model="blobText" type="textarea" :rows="2"></el-input>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="item-box text-right">
      <p class="title">{{ $t('live.serverURL') }}</p>
      <div class="flex">
        <el-input v-model="pushUrl"></el-input>
        <el-button
          type="primary"
          class="item-btn"
          v-clipboard:copy="pushUrl"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
          >{{ $t('live.copy') }}</el-button
        >
      </div>
      <span class="desc"> 1. {{ $t('live.msg1') }} </span>
    </div>
    <el-divider></el-divider>
    <div class="item-box text-right">
      <p class="title">{{ $t('live.streamKey') }}</p>
      <div class="flex">
        <el-input v-model="streamKey"></el-input>
        <el-button
          type="primary"
          class="item-btn"
          v-clipboard:copy="streamKey"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
          >{{ $t('live.copy') }}</el-button
        >
      </div>
      <span class="desc"> 2. {{ $t('live.msg2') }} </span>
      <span class="desc"> 3. {{ $t('live.msg3') }} </span>
    </div>
    <el-button
      type="primary"
      style="width: 200px"
      :loading="btnLoading"
      :disabled="btnDisabled"
      @click="onLiveClick"
      >{{ btnText }}</el-button
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
    streamKey: String,
    pushUrl: String,
    blobText: String,
    title: String,
  },
  computed: {
    btnDisabled() {
      if (
        this.title &&
        this.blobText &&
        this.pushUrl &&
        this.streamKey &&
        this.imgPid &&
        this.liveState !== 2
      ) {
        return false;
      }
      return true;
    },
    btnText() {
      const btnTextObj = {
        0: this.$t('live.startLive'),
        1: this.$t('live.endLive'),
        2: this.$t('live.liveEnded'),
      };
      return btnTextObj[this.liveState];
    },
  },
  data() {
    return {
      imgPid: '3ba012bblz1grwynbdh5cj20u015u42h',
      file: '',
      uploadLoading: false,
    };
  },
  created() {},
  methods: {
    // 图片上传前拦截函数
    beforeAvatarUpload(file) {
      this.uploadLoading = true;
      this.uploadImg(file);
      return false;
    },
    // 图片上传
    async uploadImg(file) {
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
              url: `/sup/upload.json?file_source=1&cs=${cs}&ent=alpha&appid=339644097&uid=1000005298&raw_md5=${md5}`,
          async: true,
          contentType: 'application/x-www-form-urlencoded',
          processData: false,
          headers: {
            Accept: 'application/json',
          },
          success: res => {
            this.uploadLoading = false;
            this.imgPid = res.pic.pid;
          },
          error: err => {
            this.uploadLoading = false;
            this.$message.error(err);
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
    // 按钮点击
    onLiveClick() {
      const param = {
        live_type: 1, // 0:预约feed开播 1:直接开播
        title: this.title,
        cover_img: this.imgPid,
        blobText: this.blobText,
      };
      this.$emit('liveState', param);
    },
    // 清空数据
    onClearData() {
      this.$emit('onClearData');
      this.title = '';
      this.pushUrl = '';
      this.streamKey = '';
      this.imgPid = '';
      this.blobText = '';
    },
    // ----- copy ----- //
    onCopy() {
      this.$message({
        message: this.$t('live.success'),
        type: 'success',
      });
    },
    onError() {
      // 复制失败
      this.$message({
        message: this.$t('live.failed'),
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
    .item-btn {
      margin-left: 10px;
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
html[lang='ar'] {
  .title-box,
  .item-btn {
    margin-right: 10px;
    margin-left: 0 !important;
  }
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
