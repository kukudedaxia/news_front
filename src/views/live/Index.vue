<template>
  <div class="live">
    <div class="operation">
      <el-tabs v-model="activeName" :stretch="true" style="width: 100%;">
        <el-tab-pane label="Go Live Now" name="1">
          <go-live :liveState="liveState" @liveState="onLiveClick" ref="goLiveRef"></go-live>
        </el-tab-pane>
        <el-tab-pane label="Scheduled Beeto Live" name="2" :disabled="liveState !== 0">
          <scheduled-live class="tab-content"></scheduled-live>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="player-content">
      <video-player ref="videoRef" :liveState="liveState" @refresh="onRefresh"></video-player>
    </div>
    <el-dialog :visible.sync="blobTextDialogShow" width="20%" :show-close="false" class="bolb-text">
      <p class="dialog-title">Edit live beeto,let more people see</p>
      <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="blobText"> </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="dialogVisible = false">Release</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import GoLive from '@/components/live/GoToLive.vue';
import ScheduledLive from '@/components/live/ScheduledLive.vue';
import VideoPlayer from '@/components/live/VideoPlayer.vue';

import {
  initMain,
  publish,
  unpublish,
  createCameraVideoTrack,
  createMicrophoneAndCameraTracks,
  joinLivingRoom,
  subscribe,
  unsubscribe,
  getAudienceClient,
} from '@/utils/live';

export default {
  components: {
    'go-live': GoLive,
    'scheduled-live': ScheduledLive,
    'video-player': VideoPlayer,
  },
  data() {
    return {
      activeName: '1',
      scheduledTabDisabled: false, // 预约开播tab是否可点击
      liveState: 0, // 0 未直播 1 直播中 2 已结束
      liveUrl: '', // 观众端订阅地址
      blobText: '', // 博文
      blobTextDialogShow: false, // 博文dialog显示
      // 直播参数
      room: null, // 房间实例
      audioTrack: null,
      videoTrack: null,
    };
  },
  mounted() {
    this.liveHandler();
  },
  methods: {
    liveHandler() {
      initMain();
    },
    async onLiveClick() {
      try {
        if (this.liveState === 0) {
          // 开播
          this.startLive();
        } else if (this.liveState === 1) {
          this.$confirm(
            'People are still watching your Beeto Live. Do you want to continue and end Beeto Live?',
            'End the Beeto live?',
            {
              confirmButtonText: 'End Beeto Live',
              cancelButtonText: 'Cancel',
            },
          )
            .then(() => {
              // 下播
              this.endLive();
            })
            .catch(() => {});
        }
      } catch (error) {
        console.error(error);
      }
    },
    // 开播
    async startLive() {
      const _this = this;
      const [audioTrack, videoTrack] = await createMicrophoneAndCameraTracks();
      this.audioTrack = audioTrack;
      this.videoTrack = videoTrack;
      // 获取roomId
      const { lid } = await this.preCheck();
      // 加入房间
      const room = (this.room = await joinLivingRoom(lid));
      // 设置音视频参数
      await createCameraVideoTrack();
      // 推流
      const liveUrl = await publish(room, audioTrack, videoTrack);
      // 获取观众实例
      const audience = (this.audience = getAudienceClient());
      // 订阅直播地址
      await subscribe(audience, liveUrl);

      // 注册流数据监听
      audience.registerTrackEventListener({
        /**
         * 订阅的音视频流通道已建立, track 已可以进行播放
         * @param track RCRemoteTrack 类实例
         */
        onTrackReady(track) {
          const videoNode = _this.$refs.videoRef.$el.querySelector('#videoNode');
          track.play(videoNode);
          _this.liveState = 1; // 设置为直播中
        },
      });
    },
    // 下播
    async endLive() {
      // 取消发布
      await unpublish(this.room, this.audioTrack, this.videoTrack);
      // 取消订阅
      await unsubscribe(this.audience);
      this.liveState = 2;
    },
    // 开播前检查接口   获取房间号
    preCheck() {
      return new Promise(resolve => {
        this.$store.dispatch('ajax', {
          req: {
            method: 'post',
            url: '/2/video/live/pre_check.json',
            params: {
              live_type: 1,
              language: 0, // 0 英语  1 阿语
            },
          },
          onSuccess: res => {
            resolve(res);
          },
        });
      });
    },
    // 重置信息，重新开播
    onRefresh() {
      this.liveState = 0;
      this.$refs.goLiveRef.onClearData();
    },
  },
};
</script>

<style lang="less" scoped>
.live {
  width: 1300px;
  height: 650px;
  display: flex;
  justify-content: space-between;
  margin: auto;
  border: 1px solid #ebebeb;
  border-radius: 3px;
  padding: 10px;
  .operation {
    height: 100%;
    width: 500px;
    padding: 10px;
    background-color: #f2f2f2;
    display: flex;
    justify-content: space-between;
    .tab-content {
      height: 560px;
      overflow: auto;
    }
  }
  .player-content {
    flex: 1;
    padding: 0 10px 0 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .bolb-text {
    .dialog-title {
      font-size: 14px;
      text-align: left;
      margin-bottom: 8px;
    }
  }
}
</style>
<style lang="less">
.el-dialog__header {
  display: none;
}
</style>
