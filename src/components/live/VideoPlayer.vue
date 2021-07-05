<template>
  <div
    class="video_player"
    v-loading="loading"
    element-loading-text="Loading"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.1)"
  >
    <p>Video</p>
    <!-- 连接超时 -->
    <div class="timeout" v-if="timeout">
      <p>Signal connection timed out</p>
      <el-button type="primary" round size="small">Reload</el-button>
    </div>
    <!-- 未连接 -->
    <div class="no_connect" v-if="noConnect">
      <p>
        Connect strearming software to go live
      </p>
    </div>
    <!-- 直播结束 -->
    <div class="finished" v-if="finished">
      <p>
        Your Beeto live has ended
      </p>
      <el-button type="primary" class="btn">
        Allow Replay Live
      </el-button>
      <el-button plain class="btn">Refresh And Start A New Live</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timeout: false,
      loading: false,
      noConnect: false,
      finished: false,
    };
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
</style>
