import axios from 'axios';
import qs from 'qs';

import store from '../../store';

const logs = {
  uploadLog: {},
  initRes: {},
  initLogRes(res) {
    console.log(res);
    this.initRes = res;
  },
  // 失败自己写
  initLog() {
    this.uploadLog = {
      version: 1, // 新版微博标记
      is_success: false, // 视频是否上传完成（true/false) [x] //--------------客户端-----------------
      file_type: 'video', // 文件类型（pic/video）[x]
      file_length: 0, // 文件长度（byte）[x]  //--------------客户端- origin-length ----------------
      file_id: '', // 文件上传成功后返回的文件id [x]
      // 'upload_id': '', // 文件MD5值
      filename: '', // 文件名 [x]
      upload_uuid: window.$CONFIG && window.$CONFIG.uid + '.' + Date.now(), // 本地生成的uuid，唯一标识一次上传 [x]
      process_value: 0, // 视频上传的进度0~100，只有upload、reupload会有数字，单位% [x]
      process_status: 'load', // 整个上传过程的状态：load-选中文件（初始化）；frontshot-截图（前端）；endshot-截图（后端）；md5-前端生成md5值；discovery-调discovery接口；init-调init接口；upload-调upload接口；check-调check接口；edit-上传完成后编辑；好长啊，后面估计还会加状态
      file_token: '', // init接口返回 [x]
      createtype: 'web', // 创建类型（localfile/shooting/web）[x]
      upload_length: 0, // 已上传长度（byte）[x]
      upload_time: 0, // discovery/init/upload接口的总耗时（秒）[x]
      upload_speed: 0, // current_upload_length / upload_time，单位KB/S [x]
      seg_num: 0, // 分片总数 [x]
      networktype: 'wifi', // 网络类型(wifi/2G/3G/4G/unkown) [x]
      error_code: '', // 错误码
      error_msg: '', // 错误信息 [x]
      start_date: 0, // 本次上传的开始时间(格林威治时间)
      end_date: 0, // 本次上传的结束时间(格林威治时间)
      bussiness_type: 'weibo', // 业务类型(weibo/krcom/vplus) [x]
      chunk_size: 0, // 分片大小（byte）[x]
      md5_time: 0, // 前端生成md5的时间（秒）[x]
      discovery_time: 0, // discovery请求耗时(秒) [x]
      init_time: 0, // init请求耗时(秒) [x]
      check_time: 0, // check请求耗时(秒) [x]
      dataupload_time: 0, // upload接口上传文件数据耗时(秒)
      dataupload_speed: 0, // upload接口上传文件数据速度，即分片单片上传的速度，单位KB/S
      current_upload_length: 0, //正常和upload_length一样，当次上传的长度(Byte)，重传情况和upload_length字段做区别
      // uid: window.$CONFIG && window.$CONFIG.uid, // 用户id：1683631694
      ua: navigator.userAgent, // 用户代理[x]
      is_flash: false, // 是否是flash上传（true/false）暂无 [x]
      extra: 'init', // init-页面初始化/change-弹层内入口init时/reupload-续传时/close-弹层关闭时/publish-发布微博
      cover_type: 'default', // 封面图类型：default-默认/front-前端截图/end-后端截图/custom-用户自定义
      screenshot_type: 'end', // 封面图截图类型：fail-截图不成功；front-前端截图；end-后端截图
      screenshot_time: 0, // 前、后端截图耗时（秒）
      is_screenshot_success: false, // 前、后端截图是否成功（true/false）
      // 新增
      trans_protocol: location.protocol, //传输协议，协议头 [x]
      is_cancel: false, //是否是用户主动取消 [x]
      total_time: 0, //整体时间 单位秒 [x]
      total_speed: 0, //整体速度 [x]   //--------------客户端-----------------
      start_upload_time: +new Date(), //开始时间:毫秒 [x]
      end_upload_time: 0, //上传结束时间:毫秒 [x]
      media_id: '', //media_id：init.json 返回的 media_id 字段 [x]
      discovery_log_info: '', //discovery.json 返回的 discovery_log_info 字段 [x]
      sliceInfo: [], //分片信息 [x]
    };
  },
  updateLog(obj, type) {
    if (type == 'reupload') {
      delete this.uploadLog['details'];
    }
    var curTime = +new Date();
    if (type == 'details') {
      this.uploadLog['details'] = this.uploadLog['details'] || [];
      this.uploadLog['details'].push(obj);
      this.uploadLog.end_date = curTime;
    } else {
      if (obj.upload_speed) {
        obj.total_speed = obj.upload_speed;
      }
      // console.log(this.uploadLog, obj);
      Object.assign(this.uploadLog, obj);
    }
  },
  upload(action) {
    if (action == 'cancel') {
      this.updateLog({
        is_cancel: true, //---------is_upload_cancel端内的区别is_cancel---------
      });
    }
    this.push();
  },
  //新增
  push() {
    console.log('上报视频日志')
    // store.dispatch('send', { action: '5335', extend: this.uploadLog });
    return false;

    var bodyFormData = new FormData();
    let retry = 1;
    bodyFormData.set('data', encodeURIComponent(JSON.stringify(this.uploadLog)));
    axios
      .post(
        // `${location.origin}/ajax/multimedia/post_log`,
        'https://multimedia.api.weibo.com/2/multimedia/post_log.json',
        qs.stringify({
          source: 339644097,
          data: JSON.stringify(this.uploadLog),
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Up-Auth': this.initRes && this.initRes.auth,
          },
        },
      )
      .then(
        () => {
          // console.log(res);
        },
        e => {
          if (e.message === 'Network Error') {
            if (retry > 0) {
              setTimeout(() => {
                retry -= 1;
                this.push();
              }, 10000);
            }
          }
        },
      );
  },
};

export default logs;
