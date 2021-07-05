<template>
  <div class="live">
    <div class="operation">
      <el-tabs v-model="activeName" :stretch="true" style="width: 100%;">
        <el-tab-pane label="Go Live Now" name="1">
          <go-live></go-live>
        </el-tab-pane>
        <el-tab-pane label="Scheduled Beeto Live" name="2">
          <scheduled-live class="tab-content"></scheduled-live>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="player-content">
      <video-player></video-player>
    </div>
  </div>
</template>

<script>
import GoLive from '@/components/live/GoToLive.vue';
import ScheduledLive from '@/components/live/ScheduledLive.vue';
import VideoPlayer from '@/components/live/VideoPlayer.vue';

import { RongIMClient } from '@rongcloud/imlib-v2';
import { installer, RCRTCCode } from '@rongcloud/plugin-rtc';
// 获取 RCLivingType 枚举定义
import { RCLivingType } from '@rongcloud/plugin-rtc';

export default {
  components: {
    'go-live': GoLive,
    'scheduled-live': ScheduledLive,
    'video-player': VideoPlayer,
  },
  data() {
    return {
      activeName: '2',
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      try {
        await this.IMinit();

        // 获取 IMLib 的单例实例
        const im = RongIMClient.getInstance();

        // 初始化 RCRTCClient，初始化过程推荐放在建立连接之前
        const rtcClient = im.install(installer, {});

        // 获取roomId
        const { lid } = await this.preCheck();

        /**
         * 主播加入直播房间或观众上麦场景调用，观众上麦之前需先取消已订阅的直播间资源
         * 从 5.0.7 开始增加返回 `tracks` 与 `userIds`
         *   userIds - 当前已加入房间的主播人员列表
         *   tracks  - 当前已发布至房间内的其他主播资源
         * @param roomId:String 房间 Id
         * @param livingType 直播类型
         * * 当 `livingType` 值为 `RCLivingType.AUDIO` 时表示开始音频直播
         * * 当 `livingType` 值为 `RCLivingType.VIDEO` 时表示开始音视频直播
         */
        const { code, room, userIds, tracks } = await rtcClient.joinLivingRoom(
          String(lid), // 房间号必须是字符串
          RCLivingType.VIDEO, //
        );
        // 若加入失败，则 room、userIds、tracks 值为 undefined
        if (code !== RCRTCCode.SUCCESS) {
          console.log('join room failed:', code);
          return;
        }

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
          onKickOff(byServer) {},

          /**
           * 接收到房间信令时回调，用户可通过房间实例的 `sendMessage(name, content)` 接口发送信令
           * @param name 信令名
           * @param content 信令内容
           * @param senderUserId 发送者 Id
           * @param messageUId 消息唯一标识
           */
          onMessageReceive(name, content, senderUserId, messageUId) {},

          /**
           * 监听房间属性变更通知
           * @param name
           * @param content
           */
          onRoomAttributeChange(name, content) {},

          /**
           * 房间用户禁用/启用音频
           * @param audioTrack RCRemoteAudioTrack 类实例
           */
          onAudioMuteChange(audioTrack) {},

          /**
           * 房间用户禁用/启用视频
           * @param videoTrack RCRemoteVideoTrack 类实例对象
           */
          onVideoMuteChange(videoTrack) {},

          /**
           * 房间内用户发布资源
           * @param tracks 新发布的音轨与视轨数据列表，包含新发布的 RCRemoteAudioTrack 与 RCRemoteVideoTrack 实例
           */
          async onTrackPublish(tracks) {
            // 按业务需求选择需要订阅资源，通过 room.subscribe 接口进行订阅
            const { code } = await room.subscribe(tracks);
            if (code !== RCRTCCode.SUCCESS) {
              console.log('资源订阅失败 ->', code);
            }
          },

          /**
           * 房间用户取消发布资源
           * @param tracks 被取消发布的音轨与视轨数据列表
           * @description 当资源被取消发布时，SDK 内部会取消对相关资源的订阅，业务层仅需处理 UI 业务
           */
          onTrackUnpublish(tracks) {},

          /**
           * 订阅的音视频流通道已建立, track 已可以进行播放
           * @param track RCRemoteTrack 类实例
           */
          onTrackReady(track) {
            if (track.isAudioTrack()) {
              // 音轨不需要传递播放控件
              track.play();
            } else {
              // 视轨需要一个 video 标签才可进行播放
              const element = document.createElement('video');
              document.body.appendChild(element);
              track.play(element);
            }
          },

          /**
           * 人员加入
           * @param userIds 加入的人员 id 列表
           */
          onUserJoin(userIds) {},

          /**
           * 人员退出
           * @param userIds
           */
          onUserLeave(userIds) {},
        });
      } catch (error) {
        console.error(error);
      }
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

    // ------ 直播初始化函数 ------- //
    // IM初始化
    IMinit() {
      // 初始化 IMLib
      RongIMClient.init('c9kqb3rdc63ej');

      // 设置 IM 连接状态监听
      RongIMClient.setConnectionStatusListener({
        onChanged(status) {
          // 连接状态变更通知
          // console.log(status);
        },
      });

      // 建立 IM 连接
      return new Promise((resolve, reject) => {
        RongIMClient.connect(
          'ehD5kBhGQl/u1GOXFWhyWkKZ8J6A8aHdmVzjREuDmvw=@y4sa.cn.rongnav.com;y4sa.cn.rongcfg.com',
          {
            onSuccess(userId) {
              // 连接已成功, 可以进行 RTC 相关业务操作
              console.log(`IM连接成功,${userId}`);
              resolve(userId);
            },
            onTokenIncorrect() {
              // 连接失败，token 无效
              console.error(`连接失败，token`);
            },
            onError: function(errorCode) {
              console.error(`IM连接失败${errorCode}`);
              reject(errorCode);
              // 连接失败, 失败原因 -> errorCode);
            },
          },
        );
      });
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
}
</style>
