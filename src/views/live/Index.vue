<template>
  <div class="live">
    <div class="operation">
      <el-tabs
        v-model="activeName"
        :stretch="true"
        @tab-click="onTabClick"
        style="width: 100%;"
        class="flip-over"
      >
        <el-tab-pane
          :label="$t('live.goLive')"
          name="1"
          :disabled="liveState === 1 && live_type === 0"
          class="flip-over"
        >
          <go-live
            :liveState="liveState"
            :btnLoading="goLiveBtnLoading"
            :pushUrl="pushUrl"
            :streamKey.sync="streamKey"
            :blobText="blobText"
            :title="title"
            :startSource="startSource"
            @liveState="onLiveClick"
            ref="goLiveRef"
          ></go-live>
        </el-tab-pane>
        <el-tab-pane
          :label="$t('live.scheduleLive')"
          name="2"
          :disabled="liveState === 1 && live_type === 1"
          class="flip-over"
        >
          <scheduled-live
            :uid="uid"
            :liveState="liveState"
            class="tab-content "
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
        :uid="uid"
        @refresh="onRefresh"
      ></video-player>
    </div>
  </div>
</template>

<script>
import GoLive from '@/components/live/GoToLive.vue';
import ScheduledLive from '@/components/live/ScheduledLive.vue';
import VideoPlayer from '@/components/live/VideoPlayer.vue';
import Bus from '@/utils/bus';

import { initMain, joinLivingRoom, leaveRoom } from '@/utils/live';

export default {
  components: {
    'go-live': GoLive,
    'scheduled-live': ScheduledLive,
    'video-player': VideoPlayer,
  },
  computed: {
    user() {
      return this.$store.state.userInfo;
    },
    leaveLivingDialog() {
      return this.$store.state.live.leaveLivingDialog;
    },
  },
  watch: {
    leaveLivingDialog: {
      handler(newV) {
        if (newV) {
          this.leaveLiveConfirm();
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      room: null, // 直播间实例
      startSource: 1, // 直播来源  0 app   1 web
      activeName: '1',
      liveState: 0, // 0 未直播 1 直播中 2 已结束
      uid: 1000005298,
      pushUrl: null, // 推流地址
      pullUrl: null, // 拉流地址
      streamKey: null, // 密钥
      lid: null, // 直播间id
      title: '', // 标题
      cover_img: '', // 封面id
      live_type: 1, // 0:预约feed开播 1:直接开播
      scheduledParam: {}, // 预约直播参数
      blobText: '', // 博文内容
      goLiveBtnLoading: false, // 直接开播btn按钮状态
      TOKEN: '',
    };
  },
  created() {
    this.uid = Number(this.user.id);
    this.$store.commit('route/setLoadingState', true);
    this.getToken();
  },
  mounted() {},
  methods: {
    // 获取直播token
    getToken() {
      this.$store.dispatch('ajax', {
        req: {
          method: 'post',
          url: '/multimedia/2/video/pc/user_token.json',
          params: {
            auth_uid: this.uid,
          },
        },
        onSuccess: async ({ data }) => {
          this.TOKEN = data.token;
          await this.initIM();
          this.access();
        },
        onFail: ({ error }) => {
          this.$message.error(error);
        },
      });
    },
    // 检测是否有直播
    access() {
      this.$store.dispatch('ajax', {
        req: {
          method: 'post',
          url: '/multimedia/2/video/pc/access.json',
          params: {
            uid: this.uid,
          },
        },
        onSuccess: ({ data }) => {
          // 不存在直播，走直接开播逻辑
          if (data.access) {
            this.init();
          } else {
            this.lid = data.lid;
            this.pullUrl = data.pullUrl;
            this.pushUrl = data.pushUrl;
            this.streamKey = data.streamKey;
            this.title = data.title;
            this.blobText = data.content;
            this.startSource = data.startSource;
            this.initSdk(this.lid, 2);
          }
        },
        onFail: ({ error }) => {
          this.$message.error(error);
        },
        onComplete: () => {
          this.$store.commit('route/setLoadingState', false);
        },
      });
    },
    // 重置信息，重新开播
    onRefresh() {
      this.activeName = '1';
      this.liveState = 0;
      this.$refs.goLiveRef.onClearData();
      this.init();
    },
    // 获取初始化参数(只针对直接开播使用)
    init() {
      this.$store.dispatch('ajax', {
        req: {
          method: 'post',
          url: '/multimedia/2/video/pc/init.json',
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
        onFail: ({ error }) => {
          this.$message.error(error);
        },
      });
    },
    // 初始化im
    initIM() {
      const _this = this;
      return new Promise(resolve => {
        initMain(this.TOKEN).then(im => {
          // 添加事件监听
          im.watch({
            // 监听消息通知
            message(event) {
              console.log('message', event);
              // msg 1 app下播  2 审核后台下播  3 obs停止推流
              const msg = event.message.content.event;
              if (msg === 1 || msg === 2) {
                const remoteTracks = _this.room.getRemoteTracks();
                if (remoteTracks.length > 0) {
                  _this.room.unsubscribe(remoteTracks);
                }
                _this.onRefresh();
                _this.stopLive();
                _this.startSource = 1;
              }
              // 如果是obs断流，则弹窗提醒用户
              if (msg === 3) {
                _this.$alert(_this.$t('live.obsMsg'), '', {
                  confirmButtonText: _this.$t('live.ok'),
                  showClose: false,
                  callback: () => {},
                });
              }
            },
            // 监听 IM 连接状态变化
            status(event) {
              console.log('connection status:', event.status);
            },
          });
          resolve();
        });
      });
    },
    // 初始化sdk回调
    // state 1 直播  2 续播
    async initSdk(lid, state = 1) {
      const _this = this;
      this.room = await joinLivingRoom(lid);
      // 注册房间事件监听器，重复注册时，仅最后一次注册有效
      this.room.registerRoomEventListener({
        /**
         * 当本端被剔出房间
         * @description 被踢出房间可能是由于服务端超出一定时间未能收到 rtcPing 消息，所以认为己方离线。
         * 另一种可能是己方 rtcPing 失败次数超出上限，故而主动断线
         * @param byServer
         * 当值为 false 时，说明本端 rtcPing 超时
         * 当值为 true 时，说明本端收到被踢出房间通知
         */
        onKickOff(byServer) {
          console.log('onKickOff', byServer);
        },
        /**
         * 接收到房间信令时回调，用户可通过房间实例的 `sendMessage(name, content)` 接口发送信令
         * @param name 信令名
         * @param content 信令内容
         * @param senderUserId 发送者 Id
         * @param messageUId 消息唯一标识
         */
        onMessageReceive(name, content, senderUserId, messageUId) {
          console.log('onMessageReceive', name, content, senderUserId, messageUId);
        },
        /**
         * 监听房间属性变更通知
         * @param name
         * @param content
         */
        onRoomAttributeChange(name, content) {
          console.log('onRoomAttributeChange', name, content);
        },
        /**
         * 房间用户禁用/启用音频
         * @param audioTrack RCRemoteAudioTrack 类实例
         */
        onAudioMuteChange(audioTrack) {
          console.log('onAudioMuteChange', audioTrack);
        },
        /**
         * 房间用户禁用/启用视频
         * @param videoTrack RCRemoteVideoTrack 类实例对象
         */
        onVideoMuteChange(videoTrack) {
          console.log('onVideoMuteChange', videoTrack);
        },
        /**
         * 房间内用户发布资源
         * @param tracks 新发布的音轨与视轨数据列表，包含新发布的 RCRemoteAudioTrack 与 RCRemoteVideoTrack 实例
         */
        async onTrackPublish(tracks) {
          console.log('onTrackPublish', tracks);
          // 按业务需求选择需要订阅资源，通过 room.subscribe 接口进行订阅
          _this.room.subscribe(tracks).then(({ code }) => {
            console.log(code);
            if (state === 1) {
              _this.mcuConfig();
            }
          });
        },
        /**
         * 房间用户取消发布资源
         * @param tracks 被取消发布的音轨与视轨数据列表
         * @description 当资源被取消发布时，SDK 内部会取消对相关资源的订阅，业务层仅需处理 UI 业务
         */
        onTrackUnpublish(tracks) {
          console.log('onTrackUnpublish', tracks);
        },
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
            const videoNode = document.querySelector('#videoNode');
            track.play(videoNode);
            _this.liveState = 1; // 设置为直播中
          }
        },
        /**
         * 人员加入  只会监听到直播
         * @param userIds 加入的人员 id 列表
         */
        onUserJoin(userIds) {
          console.log('onUserJoin', userIds);
        },
        /**
         * 人员退出  只会监听到主播
         * @param userIds
         */
        onUserLeave(userIds) {
          console.log('onUserLeave', userIds);
          // 如果主播被提出房间，则走下播接口
          _this.stopLive().then(() => {
            _this.$alert(_this.$t('live.closeMsg'), '', {
              confirmButtonText: _this.$t('live.ok'),
              showClose: false,
              callback: () => {},
            });
          });
        },
      });
      // 如果是续播，初始化完room实例后需要订阅远端流
      if (state === 2) {
        // 弹窗是因为用户无操作没法直接播放流
        this.$alert(this.$t('live.msg4'), '', {
          confirmButtonText: this.$t('live.continue'),
          showClose: false,
          callback: () => {
            const remoteTracks = this.room.getRemoteTracks();
            console.log(remoteTracks);
            if (remoteTracks.length > 0) {
              this.room.subscribe(remoteTracks);
              this.liveState = 1; // 设置为直播中
            }
          },
        });
      }
    },
    // 开播、下播按钮处理函数
    onLiveClick(param) {
      try {
        this.live_type = param.live_type;
        // 此时是未开播状态，走开播流程
        if (this.liveState === 0) {
          // 直接开播流程
          if (this.live_type === 1) {
            this.goLiveBtnLoading = true;
            // 走开播前校验
            this.title = param.title;
            this.cover_img = param.cover_img;
            this.blobText = param.blobText;
            this.check();
          } else {
            // 预约开播，不走校验逻辑
            this.scheduledParam = param;
            this.initSdk(param.lid);
            setTimeout(() => {
              this.startLive();
            }, 1000);
          }
          // 此时是直播状态，走下播流程
        } else if (this.liveState === 1) {
          // 直接开播-下播流程
          if (this.live_type === 1) {
            this.goLiveBtnLoading = false;
            // 下播确认弹窗
            this.$confirm(this.$t('live.endMsg'), this.$t('live.endTitle'), {
              confirmButtonText: this.$t('live.endBtn'),
              cancelButtonText: this.$t('live.cancel'),
              cancelButtonClass: 'be-btn--dark',
              showClose: false,
              closeOnClickModal: false,
            })
              .then(() => {
                this.goLiveBtnLoading = true;
                // 确认下播
                this.stopLive();
              })
              .catch(() => {});
          } else {
            this.stopLive();
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    // 检验开播合规性
    check() {
      this.$store.dispatch('ajax', {
        req: {
          method: 'post',
          url: '/multimedia/2/video/pc/check.json',
          params: {
            uid: this.uid,
            lid: this.lid,
            title: this.title,
            statusContent: this.blobText,
          },
        },
        onSuccess: ({ data }) => {
          // 15分钟内有预约直播，弹窗提醒
          if (data.haveLiveOnline === 0 && data.haveSchedule === 1) {
            this.$alert(this.$t('live.startMsg'), this.$t('live.strtTitle'), {
              confirmButtonText: this.$t('live.ok'),
              callback: () => {},
            });
            // 此处应有title和博文合规校验
            // 如果有正在直播的，弹窗提醒
          } else if (data.haveLiveOnline === 1) {
            this.initSdk(this.lid, 2);
          } else {
            // 校验通过，初始化sdk，并开播
            this.initSdk(this.lid);
            setTimeout(() => {
              this.startLive();
            }, 2000);
          }
        },
        onFail: ({ error }) => {
          this.$message.error(error);
        },
        onComplete: () => {
          this.goLiveBtnLoading = false;
        },
      });
    },
    // 开播
    startLive() {
      let params = {};
      // 直接开播，需要将标题、封面、博文内容等参数上传
      if (this.live_type === 1) {
        params = {
          uid: this.uid,
          lid: this.lid,
          pullUrl: this.pullUrl,
          pushUrl: this.pushUrl,
          streamKey: this.streamKey,
          title: this.title,
          coverPid: this.cover_img,
          statusContent: this.blobText,
          liveType: this.live_type,
        };
      } else {
        params = {
          uid: this.scheduledParam.uid,
          lid: this.scheduledParam.lid,
          pullUrl: this.scheduledParam.pullUrl,
          pushUrl: this.scheduledParam.pushUrl,
          streamKey: this.scheduledParam.streamKey,
          title: this.scheduledParam.title,
          coverPid: this.scheduledParam.coverPid,
          statusContent: 'test',
          liveType: this.live_type,
        };
      }
      this.$store.dispatch('ajax', {
        req: {
          method: 'post',
          url: '/multimedia/2/video/pc/start.json',
          params,
        },
        onSuccess: () => {
          this.$message({
            message: this.$t('live.success'),
            type: 'success',
          });
          this.$refs.scheduledLiveRef.changeLiveState(this.scheduledParam.lid, 1);
          this.$store.commit('live/setLiving', true);
        },
        onFail: ({ error }) => {
          this.$message.error(error);
        },
        onComplete: () => {
          if (this.live_type === 1) {
            this.goLiveBtnLoading = false;
          } else {
            this.$refs.scheduledLiveRef.changeBtnLoading(this.scheduledParam.lid);
          }
        },
      });
    },
    // 下播
    stopLive() {
      return new Promise(resolve => {
        let params = {};
        if (this.live_type === 1) {
          params = {
            uid: this.uid,
            lid: this.lid,
            liveType: this.live_type,
          };
        } else {
          params = {
            uid: this.scheduledParam.uid,
            lid: this.scheduledParam.lid,
            liveType: this.live_type,
          };
        }
        this.$store.dispatch('ajax', {
          req: {
            method: 'post',
            url: '/multimedia/2/video/pc/stop.json',
            params,
          },
          onSuccess: () => {
            leaveRoom(this.room);
            this.liveState = 2;
            this.$message({
              message: this.$t('live.success'),
              type: 'success',
            });
            this.$refs.scheduledLiveRef.changeLiveState(this.scheduledParam.lid, 2);
            this.$store.commit('live/setLiving', false);
            resolve();
          },
          onFail: ({ error }) => {
            this.$message.error(error);
          },
          onComplete: () => {
            if (this.live_type === 1) {
              this.goLiveBtnLoading = false;
            } else {
              this.$refs.scheduledLiveRef.changeBtnLoading(this.scheduledParam.lid);
            }
          },
        });
      });
    },
    // 设置mcu合流布局
    mcuConfig() {
      this.$store.dispatch('ajax', {
        req: {
          method: 'post',
          url: '/multimedia/2/video/pc/mcu_config.json',
          params: {
            roomId: this.lid,
          },
        },
        onSuccess: () => {
          console.log('mcu success');
          // this.$message.success(this.$t('live.success'));
        },
        onFail: ({ error }) => {
          this.$message.error(error);
        },
      });
    },
    // tabs点击
    onTabClick(tab) {
      if (tab.name === '2') {
        this.$refs.scheduledLiveRef.getSubLiveList();
      }
    },
    // 离开直播弹窗
    leaveLiveConfirm() {
      this.$confirm(this.$t('live.leaveMsg'), this.$t('live.leaveTitle'), {
        confirmButtonText: this.$t('live.endBtn'),
        cancelButtonText: this.$t('live.cancel'),
        cancelButtonClass: 'be-btn--dark',
        closeOnClickModal: false,
        showClose: false,
      })
        .then(() => {
          this.stopLive().then(() => {
            // 触发bus
            Bus.$emit('stopLive');
          });
        })
        .catch(() => {});
    },
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('route/setLoadingState', false);
    // 如果在直播状态下离开live页面，则弹窗提示是否结束直播
    if (this.liveState === 1) {
      this.leaveLiveConfirm();
    } else {
      next();
    }
  },
};
</script>

<style lang="less" scoped>
.live {
  width: 1140px;
  height: 553px;
  display: flex;
  justify-content: space-between;
  margin: auto;
  border: 1px solid rgba(255, 255, 255, 0.03);
  background: #000000;
  border-radius: 10px;
  margin-top: 20px;
  overflow: hidden;
  .operation {
    height: 100%;
    width: 416px;
    background: #16161a;
    display: flex;
    justify-content: space-between;
    .tab-content {
      height: 485px;
      overflow: auto;
    }
  }
  .player-content {
    flex: 1;
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
.live {
  .el-dialog__header {
    display: none;
  }

  .el-tabs__header {
    .el-tabs__nav-wrap::after {
      background: #000000;
      border-radius: 10px 0 0 0;
    }
    .el-tabs__item {
      font-family: SFUIText-Regular;
      font-size: 16px;
      color: #dddddd;
      height: 50px;
      line-height: 50px;
    }
    .el-tabs__item.is-disabled {
      color: rgba(221, 221, 221, 0.2);
    }
    .el-tabs__item.is-active {
      font-family: SFUIText-Bold;
      color: #ff536c;
    }

    .el-tabs__active-bar {
      height: 3px;
      background-image: linear-gradient(90deg, #ff9e39 1%, #ff536c 100%);
      border-radius: 2px;
    }
  }
}
html[lang='ar'] .el-tabs__item {
  transform: scaleX(-1) !important;
}
</style>
