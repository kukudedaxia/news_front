<template>
  <div class="live">
    <div class="operation">
      <el-tabs v-model="activeName" :stretch="true" style="width: 100%;">
        <el-tab-pane label="Go Live Now" name="1">
          <go-live
            :liveState="liveState"
            :btnLoading="goLiveBtnLoading"
            @liveState="onLiveClick"
            ref="goLiveRef"
          ></go-live>
        </el-tab-pane>
        <el-tab-pane label="Scheduled Beeto Live" name="2" :disabled="liveState !== 0">
          <scheduled-live class="tab-content"></scheduled-live>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="player-content">
      <video-player
        ref="videoRef"
        :liveState="liveState"
        :lid="lid"
        @refresh="onRefresh"
      ></video-player>
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
      blobText: '', // 博文
      blobTextDialogShow: false, // 博文dialog显示
      goLiveBtnLoading: false,
      // 直播参数
      room: null, // 房间实例
      audioTrack: null,
      videoTrack: null,
      lid: null, // 房间号/直播id
      liveUrl: null, // 直播订阅地址
    };
  },
  mounted() {
    this.liveHandler();
  },
  methods: {
    liveHandler() {
      initMain();
    },
    // 开播、下播按钮处理函数
    async onLiveClick(param) {
      try {
        this.goLiveBtnLoading = true;
        if (this.liveState === 0) {
          // 开播
          this.startLive(param);
        } else if (this.liveState === 1) {
          this.goLiveBtnLoading = false;
          // 下播
          this.$confirm(
            'People are still watching your Beeto Live. Do you want to continue and end Beeto Live?',
            'End the Beeto live?',
            {
              confirmButtonText: 'End Beeto Live',
              cancelButtonText: 'Cancel',
            },
          )
            .then(() => {
              // 确认下播
              this.stopLive();
            })
            .catch(() => {});
        }
      } catch (error) {
        console.error(error);
      }
    },
    // 开播
    async startLive(param) {
      try {
        const _this = this;
        const [audioTrack, videoTrack] = await createMicrophoneAndCameraTracks();
        this.audioTrack = audioTrack;
        this.videoTrack = videoTrack;
        // 获取roomId
        const { lid } = await this.preCheck();
        this.lid = lid;
        // 加入房间
        const room = (this.room = await joinLivingRoom(lid));
        // 设置音视频参数
        await createCameraVideoTrack();
        // 推流
        const liveUrl = (this.liveUrl = await publish(room, audioTrack, videoTrack));
        // 走后端开播接口
        await this.startLiveApi(param);
        // 获取观众实例
        const audience = (this.audience = getAudienceClient());
        // 订阅直播地址
        await subscribe(audience, liveUrl);
        this.goLiveBtnLoading = false;

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
      } catch (error) {
        this.$message.error(error);
      }
    },
    // 下播
    async stopLive() {
      try {
        await this.stopLiveApi();
        // 取消发布
        await unpublish(this.room, this.audioTrack, this.videoTrack);
        // 取消订阅
        await unsubscribe(this.audience);
        this.liveState = 2;
      } catch (error) {
        this.$message.error(error);
      }
    },
    /**
     * 开播 - 调用后端接口
     * @param live_type  0 预约feed开播   1 直接开播
     */
    startLiveApi({ live_type, title, cover_img, mid }) {
      return new Promise((resolve, reject) => {
        this.$store.dispatch('ajax', {
          req: {
            method: 'post',
            url: 'liveApi/2/video/live/start.json',
            params: {
              live_type,
              start_source: 1, // 开播来源PC
              lid: this.lid, // 直播id, sdk获取
              live_url: this.liveUrl, // 直播url,sdk获取
              title,
              cover_img,
              mid: live_type === 0 ? mid : null,
            },
          },
          onSuccess: ({ data }) => {
            resolve(data);
          },
          onFail: ({ error }) => {
            reject(error);
          },
        });
      });
    },
    /**
     * 下播 - 调用后端接口
     * @param lid  直播id
     */
    stopLiveApi() {
      return new Promise((resolve, reject) => {
        this.$store.dispatch('ajax', {
          req: {
            method: 'post',
            url: 'liveApi/2/video/live/stop.json',
            params: {
              lid: this.lid, // 直播id, sdk获取
            },
          },
          onSuccess: ({ data }) => {
            resolve(data);
          },
          onFail: ({ error }) => {
            reject(error);
          },
        });
      });
    },
    // 开播前检查接口   获取房间号
    preCheck() {
      return new Promise(resolve => {
        this.$store.dispatch('ajax', {
          req: {
            method: 'post',
            url: 'liveApi/2/video/live/pre_check.json',
            params: {
              live_type: 1,
              language: 0, // 0 英语  1 阿语
            },
          },
          onSuccess: ({ data }) => {
            resolve(data);
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
