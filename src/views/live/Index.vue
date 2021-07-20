<template>
  <div class="live">
    <div class="operation">
      <el-tabs v-model="activeName" :stretch="true" style="width: 100%;">
        <el-tab-pane label="Go Live Now" name="1">
          <go-live
            :liveState="liveState"
            :btnLoading="goLiveBtnLoading"
            :pushUrl="pushUrl"
            :streamKey="streamKey"
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
        <el-button
          type="primary"
          size="small"
          :disabled="blobText == ''"
          :loading="releaseLoading"
          @click="startLive()"
        >
          Release
        </el-button>
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
  setLayoutMode,
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
      blobTextDialogShow: false, // 博文dialog显示
      goLiveBtnLoading: false,
      // 直播参数
      room: null, // 房间实例
      audioTrack: null,
      videoTrack: null,
      liveUrl: null, // 直播订阅地址
      // ------ new ------ //
      releaseLoading: false,
      uid: 1000005298,
      pushUrl: null, // 推流地址
      pullUrl: null, // 拉流地址
      streamKey: null, // 密钥
      lid: null, // 直播间id
      title: '', // 标题
      cover_img: '', // 封面id
      live_type: 1, // 0:预约feed开播 1:直接开播
      blobText: '', // 博文内容
    };
  },
  created() {},
  mounted() {
    this.init();
    // this.liveHandler();
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
          // 应该走开播前校验接口，但是后端未完成，现在直接弹出博文输入框
          this.live_type = param.live_type;
          this.title = param.title;
          this.cover_img = param.cover_img;
          // this.startLive(param);
          this.blobTextDialogShow = true;
        } else if (this.liveState === 1) {
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
        this.goLiveBtnLoading = false;
      } catch (error) {
        console.error(error);
      }
    },
    // 开播
    startLive() {
      this.releaseLoading = true;
      this.$store.dispatch('ajax', {
        req: {
          method: 'post',
          url: 'liveApi/2/video/pc/start.json',
          params: {
            uid: this.uid,
            lid: this.lid,
            pushUrl: this.pushUrl,
            title: this.title,
            coverPid: this.cover_img,
            statusContent: this.blobText,
            liveUrl: 'test',
          },
        },
        onSuccess: ({ data }) => {
          console.log(data);
        },
        onComplete: () => {
          this.blobTextDialogShow = false;
          this.releaseLoading = false;
        },
      });
      // try {
      // const _this = this;
      // const [audioTrack, videoTrack] = await createMicrophoneAndCameraTracks();
      // this.audioTrack = audioTrack;
      // this.videoTrack = videoTrack;
      // // 获取roomId
      // const { lid } = await this.preCheck();
      // this.lid = lid;
      // // 加入房间
      // const room = (this.room = await joinLivingRoom(lid));
      // // 设置音视频参数
      // await createCameraVideoTrack();
      // // 推流
      // const liveUrl = (this.liveUrl = await publish(room, audioTrack, videoTrack));
      // await setLayoutMode(room);
      // // 走后端开播接口
      // await this.startLiveApi(param);
      // // 获取观众实例
      // const audience = (this.audience = getAudienceClient());
      // // 订阅直播地址
      // await subscribe(audience, liveUrl);
      // this.goLiveBtnLoading = false;
      // // 注册流数据监听
      // audience.registerTrackEventListener({
      //   /**
      //    * 订阅的音视频流通道已建立, track 已可以进行播放
      //    * @param track RCRemoteTrack 类实例
      //    */
      //   onTrackReady(track) {
      //     const videoNode = document.querySelector('#videoNode');
      //     // const videoNode = _this.$refs.videoRef.$el.querySelector('#videoNode');
      //     track.play(videoNode);
      //     _this.liveState = 1; // 设置为直播中
      //   },
      // });
      // } catch (error) {
      //   this.$message.error(error);
      // }
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
    // ------- 新的逻辑 ------ //
    init() {
      this.$store.dispatch('ajax', {
        req: {
          method: 'post',
          url: 'liveApi/2/video/pc/init.json',
          params: {
            uid: this.uid,
          },
        },
        onSuccess: ({ data }) => {
          this.pushUrl = data.pushUrl;
          this.streamKey = data.streamKey;
          this.lid = data.lid;
          this.pullUrl = data.pullUrl;
          this.initSdk();
        },
      });
    },
    async initSdk() {
      const _this = this;
      await initMain();
      const room = await joinLivingRoom(this.lid);
      // 注册房间事件监听器，重复注册时，仅最后一次注册有效
      room.registerRoomEventListener({
        /**
         * 当本端被剔出房间
         * @description 被踢出房间可能是由于服务端超出一定时间未能收到 rtcPing 消息，所以认为己方离线。
         * 另一种可能是己方 rtcPing 失败次数超出上限，故而主动断线
         * @param byServer
         * 当值为 false 时，说明本端 rtcPing 超时
         * 当值为 true 时，说明本端收到被踢出房间通知
         */
        onKickOff(byServer) {
          console.log(byServer);
        },
        /**
         * 接收到房间信令时回调，用户可通过房间实例的 `sendMessage(name, content)` 接口发送信令
         * @param name 信令名
         * @param content 信令内容
         * @param senderUserId 发送者 Id
         * @param messageUId 消息唯一标识
         */
        onMessageReceive(name, content, senderUserId, messageUId) {
          console.log(name, content, senderUserId, messageUId);
        },
        /**
         * 监听房间属性变更通知
         * @param name
         * @param content
         */
        onRoomAttributeChange(name, content) {
          console.log(name, content);
        },
        /**
         * 房间用户禁用/启用音频
         * @param audioTrack RCRemoteAudioTrack 类实例
         */
        onAudioMuteChange(audioTrack) {
          console.log(audioTrack);
        },
        /**
         * 房间用户禁用/启用视频
         * @param videoTrack RCRemoteVideoTrack 类实例对象
         */
        onVideoMuteChange(videoTrack) {
          console.log(videoTrack);
        },
        /**
         * 房间内用户发布资源
         * @param tracks 新发布的音轨与视轨数据列表，包含新发布的 RCRemoteAudioTrack 与 RCRemoteVideoTrack 实例
         */
        async onTrackPublish(tracks) {
          console.log(tracks);
          // 按业务需求选择需要订阅资源，通过 room.subscribe 接口进行订阅
          const { code } = await room.subscribe(tracks);
          // if (code !== RCRTCCode.SUCCESS) {
          //   console.log('资源订阅失败 ->', code);
          // }
        },
        /**
         * 房间用户取消发布资源
         * @param tracks 被取消发布的音轨与视轨数据列表
         * @description 当资源被取消发布时，SDK 内部会取消对相关资源的订阅，业务层仅需处理 UI 业务
         */
        onTrackUnpublish(tracks) {
          console.log(tracks);
        },
        /**
         * 订阅的音视频流通道已建立, track 已可以进行播放
         * @param track RCRemoteTrack 类实例
         */
        onTrackReady(track) {
          console.log(track);
          const videoNode = document.querySelector('#videoNode');
          track.play(videoNode);
          _this.liveState = 1; // 设置为直播中
        },
        /**
         * 人员加入
         * @param userIds 加入的人员 id 列表
         */
        onUserJoin(userIds) {
          console.log(userIds);
        },
        /**
         * 人员退出
         * @param userIds
         */
        onUserLeave(userIds) {
          console.log(userIds);
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.live {
  width: 1130px;
  height: 650px;
  display: flex;
  justify-content: space-between;
  margin: auto;
  border: 1px solid #ebebeb;
  border-radius: 3px;
  padding: 10px;
  margin-top: 20px;
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
