/**
 * 融云直播
 * @author jianbang
 * @description 融云sdk初始化、操作方法
 */

import { RongIMClient } from '@rongcloud/imlib-v2';
import * as RongIMLib from '@rongcloud/imlib-v4';
import {
  installer,
  RCRTCCode,
  RCLivingType,
  RCMediaType,
  RCFrameRate,
  RCResolution,
  MixLayoutMode,
  MixVideoRenderMode,
} from '@rongcloud/plugin-rtc';

const APPkEY = process.env.VUE_APP_APPkEY;

let rtcClient = null; // rtcClient实例

/**
 * 音视频初始化入口函数
 * @param role 1 主播  2 观众
 */
const initMain = async TOKEN => {
  // IM v2初始化
  // await IMinit(TOKEN);
  // // 获取 IMLib 的单例实例
  // const im = RongIMClient.getInstance();

  // IM v4初始化
  const im = await IMinitV4(TOKEN);
  // 初始化 RTCClient
  rtcClient = im.install(installer, {
    // logLevel: 0,
  });
  return im;
};

/**
 * IM初始化 v2版本
 * @returns 返回promise类型的IM实例
 */
const IMinit = TOKEN => {
  // 初始化 IMLib
  RongIMClient.init(APPkEY);

  // 设置 IM 连接状态监听
  RongIMClient.setConnectionStatusListener({
    // eslint-disable-next-line no-unused-vars
    onChanged(status) {
      // 连接状态变更通知
      // console.log(status);
    },
  });

  // 建立 IM 连接
  return new Promise(resolve => {
    RongIMClient.connect(TOKEN, {
      onSuccess(userId) {
        // 连接已成功, 可以进行 RTC 相关业务操作
        console.log(`IM连接成功,userId:${userId}`);
        resolve(userId);
      },
      onTokenIncorrect() {
        // 连接失败，token 无效
        throw new Error('连接失败，token:');
      },
      onError(errorCode) {
        throw new Error(`IM连接失败${errorCode}`);
      },
    });
  });
};

/**
 * IM初始化 v4版本
 * @returns 返回promise类型的IM实例
 */
const IMinitV4 = TOKEN => {
  // 获取 IMLib 实例
  const im = RongIMLib.init({ appkey: APPkEY });

  // 建立 IM 连接
  return new Promise(resolve => {
    im.connect({ token: TOKEN })
      .then(user => {
        console.log('IM链接成功, 链接用户 id 为: ', user.id);
        resolve(im);
      })
      .catch(error => {
        console.log('IM链接失败: ', error.code, error.msg);
      });
  });
};

/**
 * 获取麦克风、摄像头权限
 * @param RCFrameRate 帧率 10、15、24、30
 * @param RCResolution  分辨率
 * @returns 返回音视频流的对象
 */
const createMicrophoneAndCameraTracks = () => {
  return new Promise(resolve => {
    rtcClient.createMicrophoneAndCameraTracks().then(({ code, tracks }) => {
      if (code === RCRTCCode.SUCCESS) {
        console.log('麦克风和摄像头开启成功');
        // tracks 包含一个 RCMicphoneAudioTrack 实例和一个 RCCameraVideoTrack 实例
        resolve(tracks);
      } else {
        throw new Error('麦克风和摄像头开启失败 ->', code);
      }
    });
  });
};

/**
 * 加入直播间（主播端）
 * @description 主播加入直播房间或观众上麦场景调用，观众上麦之前需先取消已订阅的直播间资源
 * 从 5.0.7 开始增加返回 `tracks` 与 `userIds`
 * userIds - 当前已加入房间的主播人员列表
 * tracks  - 当前已发布至房间内的其他主播资源
 * @param roomId:String 房间 Id
 * @param livingType 直播类型
 * * 当 `livingType` 值为 `RCLivingType.AUDIO` 时表示开始音频直播
 * * 当 `livingType` 值为 `RCLivingType.VIDEO` 时表示开始音视频直播
 * @returns 返回room实例
 */
const joinLivingRoom = roomId => {
  return new Promise(resolve => {
    rtcClient
      .joinLivingRoom(
        String(roomId), // 房间号必须是字符串
        RCLivingType.VIDEO, //
      )
      .then(({ code, room }) => {
        // 若加入失败，则 room、userIds、tracks 值为 undefined
        if (code === RCRTCCode.SUCCESS) {
          console.log('加入房间成功', roomId);
          // 返回房间实例
          resolve(room);
        } else {
          throw new Error('加入房间失败 ->', code);
        }
      });
  });
};

/**
 * 退出直播间（主播端）
 * @param room实例
 */
const leaveRoom = room => {
  return new Promise(resolve => {
    rtcClient.leaveRoom(room).then(({ code }) => {
      // 若加入失败，则 room、userIds、tracks 值为 undefined
      if (code === RCRTCCode.SUCCESS) {
        console.log('退出房间成功');
        // 返回房间实例
        resolve(room);
      } else {
        throw new Error('退出房间失败 ->', code);
      }
    });
  });
};

/**
 * 设置推送视频流的参数（主播端）
 * @param RCFrameRate 帧率 10、15、24、30
 * @param RCResolution  分辨率
 */
const createCameraVideoTrack = async () => {
  return new Promise(resolve => {
    rtcClient
      .createCameraVideoTrack('RongCloudRTC', {
        frameRate: RCFrameRate.FPS_15,
        resolution: RCResolution.W1920_H1080,
      })
      .then(({ code, track }) => {
        if (code === RCRTCCode.SUCCESS) {
          console.log('视频参数设置成功! FPS:15、分辨率:1920*1080');
          resolve(track);
        } else {
          throw new Error('设置视频参数失败 ->', code);
        }
      });
  });
};

/**
 * 推送音视频流（主播端）
 * @param room 房间实例
 * @param audioTrack 音频资源
 * @param videoTrack 视频资源
 * @returns 返回直播订阅地址
 */
const publish = (room, audioTrack, videoTrack) => {
  return new Promise(resolve => {
    room.publish([audioTrack, videoTrack]).then(({ code, liveUrl }) => {
      if (code === RCRTCCode.SUCCESS) {
        // 直播订阅地址
        console.log('直播资源发布成功，订阅地址:', liveUrl);
        resolve(liveUrl);
      } else {
        throw new Error('资源发布失败 ->', code);
      }
    });
  });
};

/**
 * 取消推送音视频流（主播端）
 * @param room 房间实例
 * @param audioTrack 音频资源
 * @param videoTrack 视频资源
 * @returns 返回直播订阅地址
 */
const unpublish = (room, audioTrack, videoTrack) => {
  return new Promise(resolve => {
    room.unpublish([audioTrack, videoTrack]).then(({ code, liveUrl }) => {
      if (code === RCRTCCode.SUCCESS) {
        // 直播订阅地址
        console.log('直播资源取消发布成功');
        resolve(liveUrl);
      } else {
        throw new Error('取消发布失败 ->,', code);
      }
    });
  });
};

/**
 * 初始化观众实例
 * @returns 返回audience实例
 */
const getAudienceClient = () => {
  return rtcClient.getAudienceClient();
};

/**
 * 订阅直播间资源(观众端)-不加入房间，通过liveUrl订阅
 * @param liveUrl 直播资源地址
 * @param livingType 直播间类型，其有效值为 `RCLivingType` 所定义的枚举值
 * @param mediaType 订阅资源类型，其有效值为 `RCMediaType` 所定义的枚举值
 * @param subTiny 当值为 `true` 时将订阅小流，否则订阅大流。默认值为 `false`
 */
const subscribe = async (
  audience,
  liveUrl,
  livingType = RCLivingType.VIDEO,
  mediaType = RCMediaType.AUDIO_VIDEO,
  subTiny = false,
) => {
  return new Promise(resolve => {
    audience.subscribe(liveUrl, livingType, mediaType, subTiny).then(({ code }) => {
      if (code === RCRTCCode.SUCCESS) {
        console.log('订阅视频流成功');
        resolve();
      } else {
        throw new Error('订阅主播资源失败 ->', code);
      }
    });
  });
};

/**
 * 加入直播房间（观众端）
 * @param roomId 房间 Id
 * @param livingType 直播类型
 * * 当 `livingType` 值为 `RCLivingType.AUDIO` 是表示音频直播
 * * 当 `livingType` 值为 `RCLivingType.AUDIO_VIDEO` 是表示音视频直播
 */
const joinLivingRoomAsAudience = async roomId => {
  return new Promise(resolve => {
    rtcClient
      .joinLivingRoomAsAudience(String(roomId), RCLivingType.AUDIO_VIDEO)
      .then(({ code, room }) => {
        if (code === RCRTCCode.SUCCESS) {
          console.log('加入房间成功', roomId);
          // 返回房间实例
          resolve(room);
        } else {
          throw new Error('加入房间失败 ->', code);
        }
      });
  });
};

/**
 * 退出直播间（观众端）
 * @param 观众端的room实例
 */
const leaveLivingRoomAsAudience = audienceRoom => {
  return new Promise(resolve => {
    rtcClient.leaveLivingRoomAsAudience(audienceRoom).then(({ code }) => {
      // 若加入失败，则 room、userIds、tracks 值为 undefined
      if (code === RCRTCCode.SUCCESS) {
        console.log('退出房间成功');
        // 返回房间实例
        resolve(audienceRoom);
      } else {
        throw new Error('退出房间失败 ->', code);
      }
    });
  });
};

/**
 * 取消订阅直播间资源（观众端）
 * @param audience 观众端实例
 */
const unsubscribe = async audience => {
  return new Promise(resolve => {
    audience.unsubscribe().then(({ code }) => {
      if (code === RCRTCCode.SUCCESS) {
        console.log('取消订阅成功');
        resolve();
      } else {
        throw new Error('取消订阅失败 ->', code);
      }
    });
  });
};

/**
 * 设置合流布局、分辨率
 * @param layoutMode CUSTOMIZE:自定义布局，需用户设置布局结构、SUSPENSION:悬浮布局、ADAPTATION:自适应布局
 * @param videoRenderMode CROP:当画布尺寸与视频分辨率比例不同时，裁剪视频内容、WHOLE: 当画布尺寸与视频分辨率不同时，压缩视频尺寸以填充画布
 * @param videoRenderMode 分辨率 默认W1920_H1080; 可以通过RCResolution查找所支持的分辨率
 * @param fps  默认帧率 30
 */
const setLayoutMode = async (
  room,
  layoutMode = 'ADAPTATION',
  videoRenderMode = 'WHOLE',
  resolvingPower = 'W1920_H1080',
  fps = 30,
) => {
  return new Promise(resolve => {
    // 获取构建器实例;
    const builder = room.getMCUConfigBuilder();
    // 修改布局模式;
    builder
      .setMixLayoutMode(MixLayoutMode[layoutMode])
      .setOutputVideoRenderMode(MixVideoRenderMode[videoRenderMode])
      .setOutputVideoResolution(RCResolution[resolvingPower])
      .setOutputVideoFPS(RCFrameRate[`FPS_${fps}`]);
    // 配置生效;
    builder.flush().then(({ code }) => {
      if (code === RCRTCCode.SUCCESS) {
        resolve();
        console.log('设置合流布局、分辨率成功');
      } else {
        throw new Error('设置合流布局模式失败 ->', code);
      }
    });
  });
};

/**
 * 观众端订阅视频流
 * @param liveUrl 订阅地址
 * @param node video标签dom节点
 */
const audienceSubscribe = async (liveUrl, node) => {
  const audience = getAudienceClient();
  await subscribe(audience, liveUrl);
  audience.registerTrackEventListener({
    /**
     * 订阅的音视频流通道已建立, track 已可以进行播放
     * @param track RCRemoteTrack 类实例
     */
    onTrackReady(track) {
      track.play(node);
    },
  });
};

export {
  initMain,
  IMinit,
  IMinitV4,
  publish,
  unpublish,
  leaveRoom,
  createCameraVideoTrack,
  createMicrophoneAndCameraTracks,
  joinLivingRoom,
  subscribe,
  unsubscribe,
  setLayoutMode,
  getAudienceClient,
  audienceSubscribe,
  joinLivingRoomAsAudience,
  leaveLivingRoomAsAudience,
};
