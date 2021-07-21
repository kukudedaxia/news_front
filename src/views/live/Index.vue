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
            :disabled="liveState === 1 && live_type === 0"
            @liveState="onLiveClick"
            ref="goLiveRef"
          ></go-live>
        </el-tab-pane>
        <el-tab-pane
          label="Scheduled Beeto Live"
          name="2"
          :disabled="liveState === 1 && live_type === 1"
        >
          <scheduled-live
            :uid="uid"
            class="tab-content"
            ref="scheduledLiveRef"
            @liveState="onLiveClick"
          ></scheduled-live>
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
          >Release
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import GoLive from '@/components/live/GoToLive.vue';
import ScheduledLive from '@/components/live/ScheduledLive.vue';
import VideoPlayer from '@/components/live/VideoPlayer.vue';

import { initMain, joinLivingRoom } from '@/utils/live';

export default {
  components: {
    'go-live': GoLive,
    'scheduled-live': ScheduledLive,
    'video-player': VideoPlayer,
  },
  data() {
    return {
      activeName: '1',
      liveState: 0, // 0 未直播 1 直播中 2 已结束
      blobTextDialogShow: false, // 博文dialog显示
      uid: 1000005298,
      pushUrl: null, // 推流地址
      pullUrl: null, // 拉流地址
      streamKey: null, // 密钥
      lid: null, // 直播间id
      title: '', // 标题
      cover_img: '', // 封面id
      live_type: 1, // 0:预约feed开播 1:直接开播
      blobText: '', // 博文内容
      goLiveBtnLoading: false, // 直接开播btn按钮状态
      releaseLoading: false, // 直接开播确认弹窗btn状态
    };
  },
  created() {},
  mounted() {
    this.init();
  },
  methods: {
    // 重置信息，重新开播
    onRefresh() {
      this.liveState = 0;
      this.$refs.goLiveRef.onClearData();
    },
    // 获取初始化参数(只针对直接开播使用)
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
        },
      });
    },
    // 初始化sdk回调
    async initSdk(lid) {
      const _this = this;
      await initMain();
      const room = await joinLivingRoom(lid);
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
    // 开播、下播按钮处理函数
    onLiveClick(param) {
      try {
        this.live_type = param.live_type;
        // 此时是未开播状态，走开播流程
        if (this.liveState === 0) {
          // 直接开播流程
          if (this.live_type === 1) {
            this.initSdk(this.lid);
            this.goLiveBtnLoading = true;
            // 应该走开播前校验接口，但是后端未完成，现在直接弹出博文输入框
            this.title = param.title;
            this.cover_img = param.cover_img;
            // this.startLive(param);
            this.blobTextDialogShow = true;
            this.goLiveBtnLoading = false;
          } else {
            this.initSdk(param.lid);
            // 预约开播，不走校验逻辑
            this.startLive(param);
          }
          // 此时是直播状态，走下播流程
        } else if (this.liveState === 1) {
          // 直接开播-下播流程
          if (this.live_type === 1) {
            this.goLiveBtnLoading = false;
            // 下播确认弹窗
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
          } else {
            this.stopLive(param);
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    // 开播
    startLive(param) {
      let params = {};
      // 直接开播，需要将标题、封面、博文内容等参数上传
      if (this.live_type === 1) {
        this.releaseLoading = true;
        params = {
          uid: this.uid,
          lid: this.lid,
          pullUrl: this.pullUrl,
          title: this.title,
          coverPid: this.cover_img,
          statusContent: this.blobText,
          liveType: this.live_type,
        };
      } else {
        params = {
          uid: param.uid,
          lid: param.lid,
          pullUrl: param.pullUrl,
          title: param.title,
          coverPid: param.coverPid,
          liveType: this.live_type,
        };
      }
      this.$store.dispatch('ajax', {
        req: {
          method: 'post',
          url: 'liveApi/2/video/pc/start.json',
          params,
        },
        onSuccess: () => {
          this.$message({
            message: '开播成功',
            type: 'success',
          });
        },
        onComplete: () => {
          if (this.live_type === 1) {
            this.blobTextDialogShow = false;
            this.releaseLoading = false;
          } else {
            this.$refs.scheduledLiveRef.changeLiveState(param.lid, 1);
          }
        },
      });
    },
    // 下播
    stopLive(param) {
      let params = {};
      if (this.live_type === 1) {
        this.releaseLoading = true;
        params = {
          uid: this.uid,
          lid: this.lid,
          liveType: this.live_type,
        };
      } else {
        params = {
          uid: param.uid,
          lid: param.lid,
          liveType: this.live_type,
        };
      }
      this.$store.dispatch('ajax', {
        req: {
          method: 'post',
          url: 'liveApi/2/video/pc/stop.json',
          params,
        },
        onSuccess: () => {
          this.liveState = 2;
          this.$message({
            message: '下播成功',
            type: 'success',
          });
        },
        onComplete: () => {
          if (this.live_type === 1) {
            this.releaseLoading = false;
          } else {
            this.$refs.scheduledLiveRef.changeLiveState(param.lid, 2);
          }
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
