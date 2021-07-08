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
        <p>Signal connection timed out</p>
        <el-button type="primary" round size="small">Reload</el-button>
      </div>
      <!-- 未连接 -->
      <div class="no_connect" v-if="liveState === 0">
        <p>
          Connect strearming software to go live
        </p>
      </div>
      <!-- 直播结束 -->
      <div class="finished" v-if="liveState === 2">
        <p>
          Your Beeto live has ended
        </p>
        <el-button type="primary" class="btn" :disabled="saveReplay" @click="onSaveReplay">
          Allow Replay Live
        </el-button>
        <el-button plain class="btn" @click="onRefresh">Refresh And Start A New Live</el-button>
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
    lid: Number, // 直播id
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
          url: 'liveApi/2/video/live/replay.json',
          params: {
            lid: this.lid, // 直播id, sdk获取
            replay: 1,
          },
        },
        onSuccess: () => {
          this.$message({
            message: 'replay success!',
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
  background-color: #535c63;
  height: 500px;
  width: 100%;
  color: #ffffff;
  position: relative;
  .video {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
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
    .timeout {
      p {
        color: #ffffff;
        margin-bottom: 10px;
      }
    }
    .no_connect {
      color: #ffffff;
    }
    .finished {
      color: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      p {
        font-size: 24px;
        margin-bottom: 20px;
      }
      .btn {
        width: 250px;
        margin-top: 15px;
        margin-left: 0;
      }
    }
  }
}
</style>
