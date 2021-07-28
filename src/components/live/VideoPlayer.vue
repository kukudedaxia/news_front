<template>
  <div
    class="video_player"
    v-loading="loading"
    element-loading-text="Loading"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.1)"
  >
    <span class="video_msg">
      <!-- 连接超时 -->
      <div class="timeout" v-if="timeout">
        <p>{{ $t('live.timeOut') }}</p>
        <el-button type="primary" round size="small">{{ $t('live.reload') }}</el-button>
      </div>
      <!-- 未连接 -->
      <div class="no_connect" v-if="liveState === 0">
        <p>
          {{ $t('live.connect') }}
        </p>
      </div>
      <!-- 直播结束 -->
      <div class="finished" v-if="liveState === 2">
        <p>
          {{ $t('live.endMsg1') }}
        </p>
        <el-button
          type="primary"
          round
          size="small"
          class="btn"
          :disabled="saveReplay"
          @click="onSaveReplay"
        >
          {{ $t('live.replaying') }}
        </el-button>
        <el-button plain round class="btn" size="small" @click="onRefresh">
          {{ $t('live.refresh') }}</el-button
        >
      </div>
    </span>
    <video id="videoNode" class="video" v-show="liveState === 1"></video>
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
    lid: Number, // 直播间id
    uid: Number, // 登录用户uid
  },
  data() {
    return {
      timeout: false,
      loading: false,
      noConnect: false,
      saveReplay: false, // 是否缓存直播视频
    };
  },
  methods: {
    // 缓存本次直播视频
    onSaveReplay() {
      this.$store.dispatch('ajax', {
        req: {
          method: 'post',
          url: '/multimedia/2/video/pc/replay.json',
          params: {
            uid: this.uid,
            lid: this.lid,
            replay: 1,
          },
        },
        onSuccess: () => {
          this.$message({
            message: this.$t('live.success'),
            type: 'success',
          });
          this.saveReplay = true;
        },
        onFail: ({ error }) => {
          this.$message.error(error);
        },
      });
    },
    // 重置信息
    onRefresh() {
      this.$emit('refresh');
    },
  },
};
</script>

<style lang="less" scoped>
.video_player {
  display: flex;
  justify-content: center;
  align-items: center;
  // background-color: #535c63;
  // height: 500px;
  height: 100%;
  width: 100%;
  color: #ffffff;
  position: relative;
  .video {
    position: absolute;
    left: calc(50% - 154px);
    top: 0px;
    width: 308px;
    height: 100%;
  }
  .video_msg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #666666;
    text-align: center;
    .timeout {
      p {
        margin-bottom: 10px;
      }
    }
    .no_connect {
    }
    .finished {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-family: PingFangSC-Medium;
      font-size: 24px;
      color: #dddddd;
      p {
        font-size: 24px;
        margin-bottom: 20px;
      }
      .btn {
        width: 250px;
        margin-top: 20px;
        margin-left: 0;
      }
    }
  }
}
</style>
