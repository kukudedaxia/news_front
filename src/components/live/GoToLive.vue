<template>
  <div class="goto_live">
    <div class="item-box flex title_img">
      <div class="upload-box">
        <el-upload
          class="avatar-uploader"
          action="#"
          ref="upload"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :disabled="liveState == 1"
        >
          <img
            v-if="imgPids"
            :src="`${uploadUrl}/orj1080/${imgPids}.jpg`"
            onerror="this.onerror=null;this.src='https://img.bee-cdn.com/images/default_w_orj1080.gif#110'"
            class="avatar"
          />
          <img
            src="@/assets/images/live/icon_addcover@3x.png"
            class="avatar-uploader-icon"
            v-else
          />
          <div class="upload-loading" v-show="uploadLoading">
            <img
              src="@/assets/images/live/compose_icon_cover_uploading@3x.gif"
              class="loading-icon"
            />
          </div>

          <!-- <img
            src="@/assets/images/live/compose_icon_uploadagain@3x.png"
            class="refresh-icon"
            v-if="imgPids"
          /> -->
        </el-upload>
        <div class="upload-tips flex-align" v-if="!imgPids">
          <span>{{ $t('live.addCover') }}</span>
        </div>
      </div>
      <div class="title-box text-right">
        <p class="title">{{ $t('live.title') }}</p>
        <el-input
          v-model="titles"
          maxlength="100"
          :disabled="liveState == 1"
          :placeholder="$t('live.titleP', [user.nickname])"
          class="item-input"
          style="margin-bottom:20px"
        ></el-input>
        <p class="title">{{ $t('live.blogTitle') }}</p>
        <el-input
          v-model="blobTexts"
          :placeholder="$t('live.blogP')"
          :disabled="liveState == 1"
          class="item-input"
        ></el-input>
      </div>
    </div>
    <div class="item-box text-right">
      <div class="flex">
        <img :src="step1Image" class="title-tips" />
        <p class="title">{{ $t('live.serverURL') }}</p>
      </div>
      <div class="flex input-box flip-over">
        <el-input
          v-model="pushUrls"
          :disabled="liveState == 1"
          class="item-input input-right flip-over"
        ></el-input>
        <el-button
          type="primary"
          class="item-btn flex-align flip-over"
          size="small"
          :disabled="startSource === 0"
          v-clipboard:copy="pushUrls"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
          >{{ $t('live.copy') }}</el-button
        >
      </div>
      <span class="desc">{{ $t('live.msg1') }} </span>
    </div>
    <div class="item-box text-right">
      <div class="flex">
        <img :src="step2Image" class="title-tips" />
        <p class="title">{{ $t('live.streamKey') }}</p>
      </div>
      <div class="flex input-box flip-over">
        <el-input
          v-model="streamKeys"
          :disabled="liveState == 1"
          class="item-input input-right flip-over"
        ></el-input>
        <el-button
          type="primary"
          class="item-btn flex-align flip-over"
          size="small"
          :disabled="startSource === 0"
          v-clipboard:copy="streamKeys"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
          >{{ $t('live.copy') }}</el-button
        >
      </div>
      <span class="desc">{{ $t('live.msg2') }} </span>
    </div>
    <div class="item-box text-right flex bottom-btn">
      <div class="flex">
        <img :src="step3Image" class="title-tips" />
        <p class="title">{{ $t('live.msg3') }}</p>
      </div>
      <el-button
        type="primary"
        :loading="btnLoading"
        :disabled="btnDisabled"
        class="item-btn flex-align"
        @click="onLiveClick"
        >{{ btnText }}
      </el-button>
    </div>
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
    // 直播来源 0 app  1 web
    startSource: {
      type: Number,
      default: 1,
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
        this.titles &&
        this.blobTexts &&
        this.pushUrls &&
        this.streamKeys &&
        this.imgPids &&
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
    user() {
      return this.$store.state.userInfo;
    },
    lang() {
      return this.$store.state.language;
    },
    step1Image() {
      return this.lang === 'en'
        ? require('@/assets/images/live/icon_step1@3x.png')
        : require('@/assets/images/live/icon_step1_Arabic@3x.png');
    },
    step2Image() {
      return this.lang === 'en'
        ? require('@/assets/images/live/icon_step2@3x.png')
        : require('@/assets/images/live/icon_step2_Arabic@3x.png');
    },
    step3Image() {
      return this.lang === 'en'
        ? require('@/assets/images/live/icon_step3@3x.png')
        : require('@/assets/images/live/icon_step3_Arabic@3x.png');
    },
    uploadUrl() {
      return process.env.VUE_APP_UPLOAD_URL;
    },
  },
  watch: {
    title: {
      handler(newV) {
        if (newV === '') {
          this.titles = this.$t('live.titleP', [this.user.nickname]);
          return;
        }
        this.titles = newV;
      },
      immediate: true,
    },
    blobText(newV) {
      this.blobTexts = newV;
    },
    pushUrl(newV) {
      this.pushUrls = newV;
    },
    streamKey(newV) {
      this.streamKeys = newV;
    },
  },
  data() {
    return {
      // imgPids: '3b9b31d1lz1gsqq1m7ddjj20n00n0k57',
      imgPids: '',
      file: '',
      uploadLoading: false,
      titles: this.title,
      blobTexts: this.blobText,
      pushUrls: this.pushUrl,
      streamKeys: this.streamKey,
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
              url: `/upload.json?file_source=1&cs=${cs}&ent=alpha&appid=339644097&uid=${this.user.id}&raw_md5=${md5}`,
          async: true,
          contentType: 'application/x-www-form-urlencoded',
          processData: false,
          headers: {
            Accept: 'application/json',
          },
          success: res => {
            this.uploadLoading = false;
            if (res.ret) {
              this.imgPids = res.pic.pid;
            } else {
              this.$message.error(this.$t('live.uploadErr'));
            }
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
        title: this.titles,
        cover_img: this.imgPids,
        blobText: this.blobTexts,
      };
      this.$emit('liveState', param);
    },
    // 清空数据
    onClearData() {
      this.titles = this.$t('live.titleP', [this.user.nickname]);
      this.pushUrls = '';
      this.streamKeys = '';
      this.imgPids = '';
      this.blobTexts = '';
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
  padding: 15px 20px;
  .item-box {
    text-align: left;
    margin-bottom: 20px;
    .input-box {
      position: relative;
      .item-btn {
        position: absolute;
        position: absolute;
        top: calc(50% - 14px);
        right: 6px;
        padding: 7px 9px;
      }
    }
    .title {
      font-family: SFUIText-Semibold;
      font-size: 14px;
      color: #dddddd;
      margin-bottom: 8px;
    }
    .desc {
      display: block;
      margin-top: 10px;
      font-family: SFUIText-Regular;
      font-size: 12px;
      color: #666666;
      letter-spacing: 0;
      transform: scale(0.83);
      transform-origin: left;
      white-space: nowrap;
    }
    .item-btn {
      margin-left: 10px;
      border-radius: 21px;
      font-family: SFUIText-Medium;
      font-size: 12px;
      height: 28px;
      color: #dddddd;
      padding: 7px 15px;
    }
  }
  .title_img {
    .title-box {
      flex: 1;
      margin-left: 10px;
      text-align: left;
    }
  }
  .title-tips {
    width: 44px;
    height: 19px;
    margin-right: 4px;
  }
  .bottom-btn {
    align-items: center;
    justify-content: space-between;
  }
  .upload-box {
    position: relative;
    height: 130px;
    width: 100px;
    overflow: hidden;
    border-radius: 5px;
    .upload-tips {
      display: block;
      height: 30px;
      font-family: SFUIText-Regular;
      color: #dddddd;
      text-align: center;
      background: #202022;
      line-height: 30px;
      position: absolute;
      bottom: 1px;
      left: 1px;
      right: 1px;
      border-radius: 0 0 5px 5px;
      span {
        display: block;
        font-size: 12px;
        transform: scale(0.83);
      }
    }
    .avatar {
      width: 100px;
      height: 130px;
      display: block;
      object-fit: cover;
    }
    .avatar-uploader-icon {
      width: 26px;
      height: 26px;
    }
    .refresh-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 30px;
      height: 30px;
    }
    .upload-loading {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.3);
      .loading-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 24px;
        height: 24px;
      }
    }
  }
}
.flex {
  display: flex;
}
.flex-align {
  display: flex;
  align-items: center;
}
html[lang='ar'] {
  .title-box,
  .item-btn {
    margin-right: 10px;
    margin-left: 0 !important;
  }
  .title-tips {
    margin-left: 4px;
    width: 78px;
  }
}
</style>
<style lang="less">
.avatar-uploader {
  height: 100%;
  overflow: hidden;
  .el-upload {
    cursor: pointer;
    position: relative;
    overflow: hidden;
    background: #2e2f32;
    border: 1px solid rgba(255, 255, 255, 0.03);
    border-radius: 5px;
    width: 100%;
    height: 100%;
    font-size: 28px;
    color: #8c939d;
    line-height: 100px;
    text-align: center;
  }
  .el-upload:hover {
    border-color: #ff536c;
  }
}

.item-input {
  input {
    background: #000000 !important;
    border: 1px solid rgba(255, 255, 255, 0.03);
    border-radius: 20px;
    font-family: SFUIText-Regular;
    font-size: 14px;
    color: #dddddd;
    &::placeholder {
      font-family: SFUIText-Regular;
      font-size: 14px;
      color: #666666;
    }
  }
}
.input-right {
  input {
    padding-right: 75px;
  }
}

html[lang='ar'] {
  .input-right input {
    padding-right: 15px;
    padding-left: 75px;
  }
}

.goto_live {
  .el-input.is-disabled .el-input__inner {
    border-color: transparent;
  }
}
</style>
