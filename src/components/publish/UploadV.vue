<template>
  <div class="wrap">
    <div class="top">
      <p>{{ `${$t('publisher.uploadVideo')}(${videos.count}/1)` }}</p>
      <span>
        {{ $t('publisher.suppotsVideo') }}
      </span>
    </div>
    <div class="icon-close-big" @click="onClose"></div>
    <div id="drop">
      <!-- <img id="video_button_upload" class="more" :src="require('../../assets/images/more.png')" /> -->
      <div id="video_button_upload" class="target" v-show="videos.status == 0">
        <div class="uploader-icon"></div>
      </div>

      <div class="icon-close" @click="deleteVideo" v-if="videos.status !== 0"></div>
      <div class="reset" v-if="videos.status == 2">
        <div class="icon-reset" @click="retry"></div>
        <p class="tips">{{ $t('uploadV.try') }}</p>
      </div>
      <div class="progress" v-if="videos.status == 1">
        <el-progress
          :percentage="progress"
          :stroke-width="4"
          color="#FF536C"
          status="exception"
          class="progress-bar"
          :show-text="false"
        ></el-progress>
        <p class="tips" v-if="quotaTime > 0">
          {{ $t('uploadV.expected') }} {{ transformVideoTime(quotaTime) }} ({{ speedk }})
        </p>
      </div>
      <span class="duration" v-if="videos.status == 3">{{
        transformVideoTime(videos.duration)
      }}</span>
      <div :class="['shot', { shot1: videos.status == 3 }]" v-if="videos.status != 0">
        <img
          :src="
            videos.status == 3 && videos.pid ? `${uploadImgUrl}/orj1080/${videos.pid}.jpg` : imgSrc
          "
          :onerror="
            `this.onerror=null;this.src='https://img.bee-cdn.com/images/default_w_orj1080.gif#110'`
          "
        />
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment';
import wbu from '@/utils/multi-uploader/uploader';
export default {
  name: 'UploadV',
  data() {
    return {
      wbUploader: {},
      progress: 0,
      speedk: '',
      imgSrc: '',
      quotaTime: 0,
      // count: 0,
      // status: 0, //0未上传 1上传中 2上传失败 3上传成功
      // duration: 0,
      // mediaId: '',
      // pid: '',
    };
  },
  computed: {
    videos() {
      return this.$store.state.video.attr;
    },
    user() {
      return this.$store.state.userInfo;
    },
    uploadImgUrl() {
      return process.env.VUE_APP_UPLOAD_IMG_URL;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      window.$CONFIG = window.$CONFIG || {};
      window.$CONFIG.uid = this.user.id;
      const wbUploader = new wbu({
        default: {
          source: 339644097,
          max_size: 4 * 1024 * 1024 * 1024, // 文件大小限制
          dispatchUrl: 'https://www.weibo.com/api/i/fileplatform/dispatch', // 调度
          batchScreenshotUrl: 'https://www.weibo.com/ajax/multimedia/output', // 后端截图
          batchDetailUrl: 'https://www.weibo.com/ajax/multimedia/batch', // 获取视频宽高
        },
        inputEle: {
          target: '#video_button_upload',
          accept: 'video/mp4,video/x-m4v,video/*,.mkv',
          area: '#drop',
        },
      });
      wbUploader.on('beforeInit', data => {
        //...
        console.log(data);
        if (this.videos.count == 1) {
          return false;
        }
        wbUploader.init();
      });
      wbUploader.on('beforeUpload', data => {
        console.log(data);
        //... to do在这里做一些视频大小，长度限制
        if (data.size > 1024 * 1024 * 1024 * 4) {
          this.$message.info(this.$t('uploadV.error1'));
          return;
        } else if (data.detail.duration > 60 * 60) {
          this.$message.error(this.$t('uploadV.error2'));
          return;
        } else if (data.detail.duration < 4) {
          this.$message.error(this.$t('uploadV.error3'));
          return;
        }
        wbUploader.upload();
        // this.status = 1;
        this.$store.commit('video/setData', {
          ...this.videos,
          status: 1,
        });
      });

      wbUploader.on('uploadStatus', data => {
        // this.status = 1;
        // this.$store.commit('video/setStatus', 1);
        this.progress = data.progress;
        this.speedk = data.speed.speedk;
        this.quotaTime = data.quotaTime;

        // this.$store.commit('video/setData', {
        //   ...this.videos,
        //   status: 1,
        // });

        //... 返回速度 百分比
      });

      wbUploader.on('success', ({ file }) => {
        console.log(file);
        // this.status = 3;
        // this.mediaId = '';
        // this.count = 1;
        this.$store.commit('video/setData', {
          ...this.videos,
          status: 3,
          media_id: file.initRes.media_id,
          count: 1,
          // duration: this.duration,
        });
        this.$emit('onUploadVideoSuccess');
        //...
      });

      wbUploader.on('screenshot', data => {
        console.log(data, 'screenshot');
        // this.duration = data.detail.duration;
        if (data.screenshot && data.screenshot.length > 0) {
          this.imgSrc = data.screenshot[0].url;
          // this.imgSrc = `http://img.whale.weibo.com/orj1080/${data.screenshot[0].pid}.jpg`;
        }

        this.$store.commit('video/setData', {
          ...this.videos,
          duration: data.detail.duration,
        });

        //... 返回截图数据
      });

      wbUploader.on('error', msg => {
        console.log(msg);
        if (!msg.includes('init')) {
          // this.status = 2;
          this.$store.commit('video/setData', {
            ...this.videos,
            status: 2,
          });
        }
        this.$message.error(msg);
      });

      wbUploader.on('uploadScreen', pid => {
        this.$store.commit('video/setData', {
          ...this.videos,
          pid: pid,
        });
      });

      this.wbUploader = wbUploader;
    },

    transformVideoTime(seconds) {
      const duration = Math.ceil(seconds);
      let m1 = moment.duration(duration, 'seconds');
      let hours = m1.get('hours');
      let mins = m1.get('minutes');
      let sec = m1.get('seconds');
      mins = mins > 9 ? mins : '0' + mins;
      sec = sec > 9 ? sec : '0' + sec;
      if (hours > 0) {
        return `${hours}:${mins}:${sec}`;
      } else {
        return `${mins}:${sec}`;
      }
    },

    retry() {
      this.wbUploader.reUpload();
    },

    deleteVideo() {
      if (this.status == 1) {
        this.wbUploader.cancel();
      } else {
        this.mediaId = '';
      }
      // this.status = 0;
      // this.count = 0;
      this.$store.commit('video/setData', {
        ...this.videos,
        status: 0,
        media_id: '',
        pid: '',
        duration: '',
        count: 0,
      });
    },

    onClose() {
      if (this.mediaId) {
        this.$confirm(this.$t('publisher.videoDialogTitle'), '', {
          confirmButtonText: this.$t('publisher.confirm'),
          cancelButtonText: this.$t('publisher.cancel'),
        })
          .then(() => {
            this.deleteVideo();
            this.$emit('onClose');
          })
          .catch(() => {});
        return;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.wrap {
  padding: 13px 20px;
  position: relative;
}
.target {
  width: 100%;
  height: 100%;
}
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
.icon-close-big {
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

#drop {
  width: 178px;
  height: 100px;
  border: 1px solid #b9bdc7;
  transition: 0.3s;
  border-radius: 6px;
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  .uploader-icon {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: url('../../assets/images/publisher/conmpose_icon_morepics@3x.png') no-repeat;
    background-size: 20px;
    transition: 0.3s;
  }
  &:hover {
    border-color: #ff536c;
    .uploader-icon {
      background-image: url('../../assets/images/publisher/conmpose_icon_morepics_red@3x.png');
    }
  }
}

.icon-close {
  width: 8px;
  height: 8px;
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
  background: url('../../assets/images/publisher/media_icon_close_small_normal@3x.png') no-repeat;
  background-size: 8px;
  z-index: 100;
  transition: 0.3s;
  &:hover {
    background-image: url('../../assets/images/publisher/media_icon_close_small_click@3x.png');
  }
}

.icon-reset {
  width: 30px;
  height: 30px;
  cursor: pointer;
  background: url('../../assets/images/publisher/media_icon_uploadagain@3x.png') no-repeat;
  background-size: 30px;
  transition: 0.3s;
  z-index: 100;
  &:hover {
    background-image: url('../../assets/images/publisher/media_icon_uploadagain_click@3x.png');
  }
}
.reset {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 100;
}
.progress {
  position: absolute;
  z-index: 100;
  width: 100%;
  .progress-bar {
    width: 78%;
    margin: 0 auto;
  }
}
.tips {
  font-size: 12px;
  color: #fff;
  margin-top: 6.5px;
  z-index: 100;
}
.duration {
  position: absolute;
  right: 12px;
  bottom: 8px;
  font-size: 14px;
  color: #fff;
  z-index: 100;
}
.shot {
  width: 100%;
  height: 100%;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
/deep/.el-progress-bar__outer {
  background: #fff;
  transform: scaleY(75%);
}
.shot::after {
  content: '';
  background: rgba(0, 0, 0, 0.4);
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.shot1::after {
  content: '';
  background: transparent;
}

html[lang='ar'] {
  .top {
    text-align: right;
  }
  .icon-close-big {
    right: auto;
    left: 25px;
  }
  .duration {
    right: auto;
    left: 12px;
  }
  .tips {
    direction: rtl;
  }
}
</style>
