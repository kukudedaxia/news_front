/* eslint-disable no-unused-vars */
import axios from 'axios';
import qs from 'qs';
import SparkMD5 from 'spark-md5';

import logs from './log';
import { calChunkMd5, calFileMd5 } from './chunk';

import { uploadWithFile } from './utils/ImageUpload';
import { getImageURL } from './utils/WeiboImage';

let c_upload_urls = {
  list: [],
  index: 0,
};

function cleanRequest(req) {
  for (const i in req) {
    /* eslint guard-for-in: 0 */
    if (req[i] !== 0 && !req[i]) {
      delete req[i];
    }
  }
}

axios.defaults.withCredentials = true;

axios.interceptors.request.use(
  function(request) {
    const params = request.params;
    const body = request.data;
    if (params) {
      cleanRequest(params);
    }
    if (body) {
      cleanRequest(body);
    }
    return request;
  },
  function(error) {
    return Promise.reject(error);
  },
);

// Add a response interceptor
axios.interceptors.response.use(
  function(response) {
    // TODO 响应错误统一处理
    const data = response.data;
    // if (data) {
    //   if (data.ok === -100 && data.url) {
    //     window.location.href = data.url;
    //   }
    // }
    return response;
  },
  function(error) {
    if (error && error.response) {
      const data = error.response.data;
    }
    const config = error.config;
    config && (config.__retryCount = config.__retryCount || 0);
    if ((config && config.__retryCount >= config.retry) || !config || !config.retry) {
      // 代表重试次数完了
      return Promise.reject(error);
    }
    // Increase the retry count
    config.__retryCount += 1;

    if (config.__retryCount % 5 === 0) {
      c_upload_urls.index =
        c_upload_urls.index + 1 >= c_upload_urls.list.length ? 0 : c_upload_urls.index + 1;
      config.url = config.url.replace(/.+\?/, () => {
        return `${c_upload_urls.list[c_upload_urls.index]}?`;
      });
    }
    // Create new promise to handle exponential backoff
    var backoff = new Promise(function(resolve) {
      setTimeout(
        function() {
          resolve();
        },
        config.retryDelay ? config.retryDelay : 1000,
      );
    });

    // Return the promise in which recalls axios to retry the request
    return backoff.then(function() {
      return axios(config); //这里失败了再重新调用请求
    });
  },
);

let [checkRetry, batchTimer, detailTimer] = [0, undefined, undefined];

class wbUploader {
  constructor(opts) {
    //lh FIRST： 合并默认参数配置 并初始化dom事件
    MidClone(this.options, opts);
    if (opts.inputEle && opts.inputEle.target) {
      let obj = opts.inputEle;
      const ele = document.querySelector(obj.target);
      ele.addEventListener('click', () => {
        const inputObj = document.createElement('input');
        inputObj.setAttribute('id', '_ef');
        inputObj.setAttribute('type', 'file');
        inputObj.setAttribute('style', 'visibility:hidden');
        obj.accept && inputObj.setAttribute('accept', obj.accept);
        inputObj.click();
        inputObj.addEventListener('change', $event => {
          this.addFiles($event);
        });
      });
    }
    if (opts.inputEle && opts.inputEle.area) {
      let obj = opts.inputEle;
      const ele = document.querySelector(obj.area);
      ele.addEventListener(
        'dragenter',
        e => {
          e.preventDefault();
        },
        false,
      );
      ele.addEventListener(
        'dragover',
        e => {
          e.preventDefault();
        },
        false,
      );
      ele.addEventListener(
        'drop',
        e => {
          console.log(e);
          e.preventDefault();
          this.addFiles({
            target: e.dataTransfer,
          });
        },
        false,
      );
      ele.addEventListener(
        'drop',
        e => {
          console.log(e);
          e.preventDefault();
          this.addFiles({
            target: e.dataTransfer,
          });
        },
        false,
      );
    }

    opts.default &&
      opts.default.source &&
      (this.options.dispatchParams.source = opts.default.source); //source ？代表什么
  }

  version = '20210913_1';
  threadsDone = 0;
  successIndex = [];
  // 默认配置
  options = {
    default: {
      source: 339644097,
      max_size: 15 * 1024 * 1024 * 1024,
      dispatchUrl: 'https://www.weibo.com/ajax/multimedia/dispatch',
      batchScreenshotUrl: 'https://www.weibo.com/ajax/multimedia/output',
      batchDetailUrl: 'https://www.weibo.com/ajax/multimedia/batch',
      autoLog: true,
    },
    urls: {
      init_url: '',
      upload_url: '',
      check_url: '',
    },
    dispatchParams: {
      source: 339644097,
      types: 'video',
      version: 4,
      auth_accept: 'weibo',
      size: 1024 * 1024,
    },
    strategy: {
      chunk_delay: 3000,
      chunk_read_timeout: 30000,
      chunk_retry: 200,
      chunk_size: 8192,
      chunk_slow_speed: 100,
      chunk_timeout: 180000,
      threads: 1,
      upload_protocol: 'binary',
      url_tag: '1',
    },
    log: {
      version: 1,
    },
  };
  fileList = [];
  currFile = {};
  time = {
    md5: {},
    discovery: {},
    init: {},
    upload: {},
    check: {},
    screenshot: {},
  };
  // 上传片
  uploadArr = [];
  uploadProgress = 0;
  needFontEndScreenshot = true;
  // 调度
  async dispatch(params) {
    this.time.discovery.start = new Date();
    logs.updateLog({
      ...this.options.log,
      start_date: this.time.discovery.start.getTime(),
      process_status: 'discovery',
    });
    try {
      // let res = await axios.get(this.handleUrl(this.options.default.dispatchUrl, params), {
      //   timeout: this.options.strategy.chunk_timeout || 10000,
      // });
      // this.time.discovery.end = new Date();
      // logs.updateLog({
      //   discovery_time: (this.time.discovery.end - this.time.discovery.start) / 1000,
      //   process_status: 'discovery',
      //   // discovery_log_info: '{"ab":"1493-g0,1191-g0"}',
      //   discovery_log_info: JSON.stringify(res.data.data) || '',
      // });
      // let {
      //   video: { check_url, init_url, upload_url, upload_urls },
      // } = res.data.data;
      // 重写
      let check_url = '/multimedia/2/video/pc/upload/check.json';
      let init_url = '/multimedia/2/video/pc/upload/init.json';
      let upload_url = 'https://test.bee.to/2/fileplatform/upload.json';
      this.options.urls = { check_url, init_url, upload_url };
      // if (upload_urls) {
      //   const index = upload_urls.indexOf(upload_url);
      //   if (index >= 0) {
      //     upload_urls.splice(index, 1);
      //   }
      //   c_upload_urls = {
      //     list: [upload_url, ...upload_urls],
      //     index: 0,
      //   };
      // } else {
      c_upload_urls = {
        list: [upload_url],
        index: 0,
      };
      // }
      return true;
    } catch (err) {
      this.emit('error', 'dispatch失败');
    }
  }
  // 添加上传文件
  async addFiles(evt) {
    const files =
      (evt && evt.target && evt.target.files) ||
      (evt && evt.path && evt.path[0] && evt.path[0].files);
    this.fileList.push(...files);
    this.emit('beforeInit', 'beforeInit');
  }
  // 初始化
  async init() {
    logs.initLog();
    //1 先调度一下获取上传配置
    let dispatchStatus = await this.dispatch(this.options.dispatchParams);
    console.log(dispatchStatus, 'dispatchStatus');
    if (!dispatchStatus) return;

    this.currFile = this.fileList[0];
    let file = this.currFile;
    file.progress = [];
    file.sliceInfo = [];
    file.time = {};
    file.hash = SparkMD5.hash(`${file.lastModified}|${file.size}|${file.name}`);
    logs.updateLog({
      file_length: file.size,
      filename: file.name,
    });
    let wbUploader = localStorage.getItem('wbUploader');
    if (wbUploader && wbUploader !== 'undefined') {
      try {
        wbUploader = JSON.parse(wbUploader);
        for (let [key, item] of Object.entries(wbUploader)) {
          if (key == file.hash && !item.isUpload) {
            if (item.publish !== undefined) {
              let checkRes = await this.checkFileMd5(item.initRes, file, true);
              console.log(checkRes, '=============checkRes============');
              if (checkRes.result) {
                const res = await this.batchDetailsSync({ ids: item.initRes.media_id });
                if (
                  (res && res.request_id && Object.keys(res).length !== 1) ||
                  (checkRes.received &&
                    this.options.strategy.chunk_size * 1024 * checkRes.received.length < file.size)
                ) {
                  this.successIndex = this.successIndex.concat(...checkRes.received);
                  file.initRes = item.initRes;
                  checkRes.received && (file.received = checkRes.received);
                  file.initRes = item.initRes;
                  this.options.strategy = item.initRes.strategy;
                  const fileSize = file.size;
                  const chunkSize = this.options.strategy.chunk_size * 1024;
                  const chunkCount = Math.ceil(fileSize / chunkSize);
                  if (checkRes.received[checkRes.received.length - 1] === chunkCount - 1) {
                    let pro =
                      this.options.strategy.chunk_size * 1024 * (checkRes.received.length - 1) +
                      (fileSize - this.options.strategy.chunk_size * 1024 * (chunkCount - 1));
                    this.currFile.progress = [pro];
                  } else {
                    this.currFile.progress = [
                      this.options.strategy.chunk_size * 1024 * checkRes.received.length,
                    ];
                  }
                  this.needFontEndScreenshot = false; // ?
                  this.emit('beforeUpload', file);
                  return;
                }
              }
            }
          }
        }
      } catch (e) {
        wbUploader = {};
        console.log(e);
      }
    }
    this.time.md5.start = new Date();
    let md5 = await this.handleUploadFileMd5(file, file.hash); // ?md5在哪里使用的
    this.time.md5.end = new Date();
    let { initParams, biz_file } = this.handleParams(file, md5);
    let { blob, contentType } = this.handleMultipartMixed(biz_file);
    this.time.init.start = new Date();

    let { data: initRes } = await this.videoInit(
      this.options.urls.init_url,
      initParams,
      blob,
      contentType,
    );

    if (!initRes) return;

    console.log(initRes, 'initRes');

    logs.updateLog({
      md5_time: (this.time.md5.end - this.time.md5.start) / 1000,
      init_time: (this.time.init.end - this.time.init.start) / 1000,
      chunk_size: initRes.strategy.chunk_size * 1024,
      seg_num: Math.ceil(file.size / (initRes.strategy.chunk_size * 1024)),
      file_token: initRes.media_id,
      media_id: initRes.media_id || '',
    });
    if (initRes.error) {
      this.emit('error', '初始化失败');
    } else {
      let fileObj = {
        hash: file.hash,
        initRes,
        isUpload: true,
        time: Date.now(),
      };
      if (wbUploader && wbUploader !== 'undefined') {
        wbUploader[fileObj.hash] = fileObj;
      } else {
        wbUploader = {
          [fileObj.hash]: fileObj,
        };
      }
      localStorage.setItem('wbUploader', JSON.stringify(wbUploader));
      file.initRes = initRes;
      logs.initLogRes(initRes);

      initRes.strategy.chunk_retry = 2;
      this.options.strategy = initRes.strategy;

      file.detail = await getVideoInfo(file);
      this.emit('beforeUpload', file);
    }
  }
  // 前端截图
  async handleScreenshot(file) {
    let videoSize = await getVideoInfo(file);
    this.emit('screenshot', { detail: videoSize });
    // logs.updateLog({
    //   screenshot_type: 'end',
    // });
    // console.log(videoSize, 'videoSize');
    try {
      if (videoSize.height && this.needFontEndScreenshot) {
        logs.updateLog({
          screenshot_type: 'font',
        });
        let arr = [];
        this.time.screenshot.curStart = new Date();
        // 为什么分九份 触发两次截屏 第一次没有arr 第二次9个 （）
        for (let i = 0; i < 9; i++) {
          if (i == 0) {
            arr[i] = await getVideoScreenshot(file, 1, true, this);
            console.log(new Date().getTime(), '第一帧图片');
          } else {
            arr[i] = await getVideoScreenshot(file, (videoSize.duration / 9) * i);
          }
          // 可以这里
          if (this.currFile.name === file.name) {
            this.screenshot = arr;
            this.currFile.detail = { detail: videoSize, screenshot: arr };
          }
          if (i == 0) {
            console.log(arr, 'arr', new Date().getTime());
            this.emit('screenshot', this.currFile.detail);
          }
        }
        this.emit('screenshot', this.currFile.detail);
        this.time.screenshot.curEnd = new Date();
        logs.updateLog({
          screenshot_time: (this.time.screenshot.curEnd - this.time.screenshot.curStart) / 1000,
          is_screenshot_success: true,
        });
      } else {
        logs.updateLog({
          screenshot_type: 'end',
        });
        let arr = [];
        this.screenshot = arr;
        this.currFile.detail = { detail: videoSize, screenshot: arr };
        this.emit('screenshot', this.currFile.detail);
        this.needFontEndScreenshot = true;
      }
    } catch (e) {
      if (videoSize.height) {
        logs.updateLog({
          screenshot_type: 'end',
        });
        let arr = [];
        this.screenshot = arr;
        this.currFile.detail = { detail: videoSize, screenshot: arr };
        this.emit('screenshot', this.currFile.detail);
      }
    }
  }
  // 上传
  async upload() {
    logs.updateLog({
      process_status: 'upload',
    });
    let file = this.currFile;
    // 较小文件截图不同步 ????   大于200M以上不会截图
    if (file.size < 3 * 1024 * 1024) {
      console.log('开始截屏0', new Date().getTime());
      await this.handleScreenshot(file);
    } else if (file.size > 200 * 1024 * 1024) {
      // 超过两百K
      console.log('开始截屏1', new Date().getTime());
      let videoSize = await getVideoInfo(file);
      logs.updateLog({
        screenshot_type: 'end',
      });
      let arr = [];
      this.screenshot = arr;
      this.currFile.detail = { detail: videoSize, screenshot: arr };
      this.emit('screenshot', this.currFile.detail);
    } else {
      console.log('开始截屏2', new Date().getTime());
      this.handleScreenshot(file);
    }
    file.logs = {
      file_length: file.size,
      start_upload_time: Date.now(),
    };
    if (file.size > this.options.default.max_size) {
      this.emit('error', 'to large');
      return;
    }
    await this.uploadFile(file);
  }

  // 上传文件
  async uploadFile(
    file,
    start = this.currFile.received ? this.currFile.received.length : 0,
    threads = this.options.strategy.threads, //这是结尾？？？
    chunkSize = this.options.strategy.chunk_size * 1024,
  ) {
    const fileSize = file.size;
    const chunkCount = Math.ceil(fileSize / chunkSize);
    this.uploadArr = [];
    for (let i = 0; i < chunkCount; i++) {
      this.uploadArr.push({ index: i, status: 'ready' });
    }
    if (this.currFile.received) {
      this.currFile.received.map(item => {
        this.uploadArr[item].status = 'success';
        if (item === chunkCount - 1) {
          this.currFile.progress[item] =
            fileSize - this.options.strategy.chunk_size * 1024 * (chunkCount - 1);
        } else {
          this.currFile.progress[item] = this.options.strategy.chunk_size * 1024;
        }
      });
    }

    if (this.uploadArr.every(item => item.status === 'success')) {
      logs.updateLog({
        end_upload_time: Date.now(),
      });
      this.handleUploadSuccess(file.initRes, file);
      return true;
    }

    let currentMax = start + threads > chunkCount ? chunkCount : start + threads;
    let currentThreads = currentMax - start;

    let curTh = threads;
    let threadsArr = [];
    let totalProgress = start * chunkSize;
    totalProgress = Math.floor((totalProgress / file.size) * 100);
    totalProgress = totalProgress > 100 ? 100 : totalProgress;
    logs.updateLog({
      process_value: totalProgress,
    });

    file.cancelSource = [];
    let filterArr = this.uploadArr.filter(item => item.status == 'ready');
    if (curTh) {
      for (let i = 0; i < curTh; i++) {
        let eleArr = [];
        for (let ele = 0; ele < filterArr.length; ele += curTh) {
          if (ele + i < filterArr.length) {
            eleArr.push(filterArr[ele + i].index);
          }
        }
        threadsArr.push(eleArr);
      }
    }
    console.log(threadsArr, '准备好切片后 uploadFile');
    threadsArr.forEach(async (item, thIndex) => {
      for (let index = 0; index < item.length; index++) {
        // 上传切片
        let chunkIndex = item[index];
        const start = chunkIndex * chunkSize;
        const end =
          (chunkIndex + 1) * chunkSize >= file.size ? file.size : (chunkIndex + 1) * chunkSize;
        const chunkFile = file.slice(start, end);
        const chunkMd5 = await calChunkMd5(file, start, end);
        let chunkDetail = {
          chunkIndex,
          chunkCount,
          chunkFile,
          chunkMd5,
          end,
          start,
        };
        console.log(chunkDetail, 'chunkDetail', index);
        await this.uploadChunk(file, chunkDetail, currentMax, thIndex);
      }
    });
    return true;
  }

  //  上传切片
  async uploadChunk(file, chunkDetail, currentMax, threads) {
    let { initRes } = file;
    let { chunkIndex, chunkCount, chunkFile, chunkMd5, end, start } = chunkDetail;
    let params = {
      source: this.options.default.source,
      upload_id: initRes.upload_id,
      media_id: initRes.media_id,
      upload_protocol: 'binary',
      type: 'video',
      client: 'other',
      index: chunkIndex,
      size: end - start,
      start_loc: start,
      count: chunkCount,
      check: chunkMd5,
      sectioncheck: chunkMd5,
    };
    let url = this.handleUrl(c_upload_urls.list[c_upload_urls.index], params);
    console.log(url, 'url');
    let postVideoRes;
    file.progress[chunkIndex] = 0;

    lastLoad = 0;
    lastTime = Date.now();
    let cancelToken = axios.CancelToken; //>>>>>>>>>>>>>>
    file.cancelSource[threads] = cancelToken.source();

    try {
      this.time.upload.curStart = new Date();
      file.time.start = this.time.upload.curStart;
      let initTime = this.time.upload.curStart.getTime();
      postVideoRes = await axios.post(url, chunkFile, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'X-Up-Auth': initRes.auth,
        },
        cancelToken: file.cancelSource[threads].token,
        onUploadProgress: progressEvent => {
          this.handleUploadProgress(progressEvent, file, chunkIndex, end, start); //这里上传进度
        },
        retry: this.options.strategy.chunk_retry,
        retryDelay: this.options.strategy.chunk_delay,
      });

      this.uploadArr[chunkIndex].status = 'success';
      this.time.upload.curEnd = new Date();
      file.time.end = this.time.upload.curEnd;
      let sliceEndTime = this.time.upload.curEnd.getTime();
      let spentTime = sliceEndTime - initTime;

      let current_time = this.time.upload.curEnd - this.time.upload.curStart;
      this.time.upload.rtt += current_time / 1000;

      let current_speed =
        params.size / 1024 / (Number(this.time.upload.curEnd - this.time.upload.curStart) / 1000);
      if (current_speed < this.options.strategy.chunk_slow_speed) {
        c_upload_urls.index =
          c_upload_urls.index + 1 >= c_upload_urls.list.length ? 0 : c_upload_urls.index + 1;
      }
      //console.log(current_speed, 'current_speed')

      file.sliceInfo[chunkIndex] = {
        requestURL: encodeURIComponent(url),
        responseHeader: JSON.stringify(postVideoRes.headers),
        requestHeader: JSON.stringify({
          'Content-Type': 'application/octet-stream',
          'X-Up-Auth': initRes.auth,
        }),
        statusCode: postVideoRes.status,
        // sliceMessage : msg || '',
        responseBody: JSON.stringify(postVideoRes.data),
        sliceNum: chunkIndex,
        sliceStartTime: initTime,
        sliceEndTime: sliceEndTime,
        sliceTime: spentTime,
        sliceSize: end - start,
        sliceSpeed: (end - start) / spentTime,
        loadedSize: end,
        fileSize: this.currFile.size,
        fileName: this.currFile.name,
        referUrl:
          document && document.location && document.location.href
            ? encodeURIComponent(document.location.href)
            : '',
      };
      // logs.updateLog({
      //   sliceInfo: file.sliceInfo,
      // });
      // let upload_time =
      //   this.time.upload.curEnd && this.time.discovery.start
      //     ? (this.time.upload.curEnd - this.time.discovery.start) / 1000
      //     : 0;
      // let upload_length = end;
      // logs.updateLog({
      //   dataupload_time: this.time.upload.rtt,
      //   upload_time: upload_time,
      //   upload_length: upload_length,
      //   upload_speed: Math.ceil(upload_time && upload_length / 1000 / upload_time) || 0,
      //   current_upload_length: params.size,
      //   dataupload_speed: Math.ceil(params.size / current_time) || 0,
      // });
    } catch (err) {
      console.log(err);
      this.emit('error', '网络问题');
      throw new NetErrExpection(err);
    }
    if (!postVideoRes) {
      // this.stop = true;
    }
    this.successIndex.push(chunkIndex);
    // let checkRes = await this.checkFileMd5(initRes, file, true);
    this.uploadCallback(file, chunkIndex, chunkCount, postVideoRes.data, currentMax, threads);
    return postVideoRes.data;
  }
  // 上传进度处理
  handleUploadProgress(e, file, chunkIndex, end, start) {
    let { progress } = file;
    if (e.loaded) {
      let sec = (Date.now() - lastTime) / 1000;
      let load = e.loaded - lastLoad > 0 ? e.loaded - lastLoad : e.loaded;
      let speed = formatSpeed(load / sec);
      lastTime = Date.now();
      lastLoad = e.loaded;

      progress[chunkIndex] = Math.floor((e.loaded / e.total) * (end - start));
      if (progress) {
        let totalProgress = 0;
        for (let i = 0; i < progress.length; i++) {
          totalProgress += progress[i] ? progress[i] : 0;
        }
        totalProgress = Math.floor((totalProgress / file.size) * 100);
        let uploadProgress =
          totalProgress > this.uploadProgress ? totalProgress : this.uploadProgress;
        logs.updateLog({
          process_value: uploadProgress,
        });
        const quotaSize = (file.size * (100 - uploadProgress)) / 100;
        const quotaTime = quotaSize / speed.speed;
        this.emit('uploadStatus', {
          progress: uploadProgress,
          speed,
          file: file,
          quotaTime,
        });
      }
    }
  }

  async uploadCallback(file, index, count, res, currentMax, threads) {
    let { initRes } = file;
    // let allSuccess = false;
    // this.threadsDone++;
    // if (this.threadsDone === threads) {
    //   allSuccess = true;
    //   this.threadsDone = 0;
    // }
    if (res.error) {
      throw new Error('上传失败');
    } else if (res.fid) {
      // this.handleUploadSuccess(res, file, true);
    }
    // if (allSuccess === true) {
    console.log(this.uploadArr, 'uploadCallback');
    if (this.uploadArr.every(item => item.status === 'success')) {
      this.fileList.pop();
      // if (res.fid) {
      this.handleUploadSuccess(initRes, file);
      logs.updateLog({
        end_upload_time: Date.now(),
      });
    }
    // this.uploadFile(file, currentMax, threads);
    // }
  }

  async handleUploadSuccess(initRes, file) {
    this.time.check.start = new Date();
    // 成功后检查切片是否都上传完成
    let checkRes = await this.checkFileMd5(initRes, file);
    this.time.check.end = new Date();
    if (checkRes.data.result) {
      this.fileList.splice(0, 1);
      this.successIndex = [];
      logs.updateLog({
        is_success: true,
        check_time: (this.time.check.end - this.time.check.start) / 1000,
      });
      this.emit('success', { file: file });
      if (this.options.default.autoLog) {
        // 上传成功打印日志
        this.uploadLog();
      }

      if (
        !(
          this.currFile.detail &&
          this.currFile.detail.screenshot &&
          this.currFile.detail.screenshot.length
        )
      ) {
        const params = {
          source: this.options.default.source,
          ids: this.currFile.initRes.media_id,
          labels: 'screenshot',
        };
        this.currFile.detail = {};
        const start = new Date();
        //这里??? 是否上传完在获取截图
        // batchTimer = setInterval(() => {
        //   this.batchScreenshot(params).then(res => {
        //     if (res.data && res.data[initRes.media_id] && res.data[initRes.media_id].screenshot) {
        //       let a = res.data[initRes.media_id].screenshot.file_detail;
        //       let screenArray = [];
        //       a = JSON.parse(a);
        //       if (Object.values(a).length) {
        //         const end = new Date();
        //         logs.updateLog({
        //           screenshot_time: (end - start) / 1000,
        //           is_screenshot_success: true,
        //         });
        //         clearInterval(batchTimer);
        //         a.files.forEach(item => {
        //           screenArray.push({ pid: item.file_id, url: item.url });
        //         });
        //         this.screenshot = screenArray;
        //         this.currFile.detail.screenshot = screenArray;
        //         this.emit('screenshot', this.currFile.detail);
        //       }
        //     }
        //   });
        // }, 2000);
        // detailTimer = setInterval(() => {
        //   this.batchDetails({ ids: this.currFile.initRes.media_id }).then(res => {
        //     if (
        //       res.data &&
        //       res.data[initRes.media_id] &&
        //       res.data[initRes.media_id].video_basic_info &&
        //       res.data[initRes.media_id].video_basic_info.width
        //     ) {
        //       let { width, height, duration } = res.data[initRes.media_id].video_basic_info;
        //       this.currFile.detail.detail = { width, height, duration };
        //       this.emit('screenshot', this.currFile.detail);
        //       clearInterval(detailTimer);
        //     }
        //   });
        // }, 2000);
      }
    } else {
      //在这里错误才触发。。。。。能改为手动
      this.reUpload();
    }
  }

  // md5 数据更新
  updateMd5 = (id, isDelete = false, isCancel = false) => {
    let wbUploader = localStorage.getItem('wbUploader');
    if (wbUploader && wbUploader !== 'undefined') {
      wbUploader = JSON.parse(wbUploader);
      let k = '';
      for (let [key, item] of Object.entries(wbUploader)) {
        if (id === item.initRes.media_id) {
          item.publish = false;
          k = key;
          wbUploader[k].isUpload = !isCancel;
          if (isDelete) {
            delete wbUploader[k];
          }
        }
        if (item.time) {
          if ((Date.now - item.time) / 1000 / 60 / 60 / 24 > 1) {
            delete wbUploader[k];
          }
        } else {
          delete wbUploader[k];
        }
      }
    }
    localStorage.setItem('wbUploader', JSON.stringify(wbUploader));
  };

  //  检查远端是否存在这个Md5
  checkFileMd5 = async (initRes, file, restore = false) => {
    logs.updateLog({
      process_status: 'check',
    });
    const fileSize = file.size;
    const chunkCount = Math.ceil(fileSize / (this.options.strategy.chunk_size * 1024));
    let params = {
      source: this.options.default.source,
      upload_id: initRes.upload_id,
      media_id: initRes.media_id,
      upload_protocol: 'binary',
      count: chunkCount,
      action: 'finish',
      size: fileSize,
      client: 'web',
      status: '',
    };
    if (restore) {
      params.action = 'restore';
    }
    let res;
    try {
      res = await axios.post(this.options.urls.check_url, qs.stringify(params), {
        headers: {
          'X-Up-Auth': initRes.auth,
        },
        // retry: this.options.strategy.chunk_retry,
        retry: 3,
        retryDelay: this.options.strategy.chunk_delay,
      });
    } catch (err) {
      this.emit('error', 'check-网络问题');
      throw new NetErrExpection(err);
    }
    return res.data;
  };

  //初始化接口
  videoInit = (url, params, blob, contentType) => {
    logs.updateLog({
      process_status: 'init',
    });
    this.time.init.start = new Date();
    return axios
      .post(this.handleUrl(url, params), blob, {
        headers: {
          'Content-Type': contentType,
        },
        timeout: this.options.strategy.chunk_timeout || 10000,
        retry: this.options.strategy.chunk_retry,
        retryDelay: this.options.strategy.chunk_delay,
      })
      .then(
        res => {
          this.time.init.end = new Date();
          if (res.data.error_code == 10000) {
            return res.data;
          } else {
            this.emit('error', 'init' + res.data.error);
            return {
              data: false,
            };
          }
        },
        error => {
          this.emit('error', 'init');
        },
      );
  };

  handleUrl = (url, params) => {
    if (/\?/.test(url)) {
      return `${url}&${qs.stringify(params)}`;
    } else {
      return `${url}?${qs.stringify(params)}`;
    }
  };

  handleParams(file, md5) {
    console.log(md5);
    let initParams = {
      source: this.options.default.source,
      access_token: '',
      size: file.size,
      length: file.length,
      name: file.name,
      type: 'whale',
      client: 'other',
      authKey: '1197330635',
    };
    // 重写
    let biz_file = {
      mediaprops: `{"action":"pre_upload","ori":0,"pri":0,"createtype":"localfile","raw_md5": '${md5}' ,"print_mark":1,"video_type":"whale","width":1920,"height":1080,"duration":8.439000129699707,"screenshot":0,"trans_version":1,"trans_config":{"whale_drawtext":"@jack2033"}}`,
      c: 'other',
      size: file.size,
      name: file.name,
      availability: {
        encoders: [
          {
            type: 'openh264',
            version: 1,
          },
        ],
        upload_protocols: ['binary', 'sve'],
        setting: {
          force_encode: false,
        },
      },
      type: 'whale',
    };
    return { initParams, biz_file };
  }

  /**
   * multipart/mixed 所使用的 contentType 以及 data
   * @export
   */
  handleMultipartMixed = biz_file => {
    let boundary = 1024 * 2019 + 'weiboPro' + new Date().getTime();
    let header = `--${boundary}\r\n`;
    let content = `${header}Content-Disposition: form-data; name="biz_file"\r\n\r\n${JSON.stringify(
      biz_file,
    )}`;
    let footer = `\r\n--${boundary}--\r\n`;
    let contentType = `multipart/mixed; boundary=${boundary}`;
    let blob = new Blob([content, footer]);
    return { blob, contentType };
  };

  cancel = () => {
    this.updateMd5(this.currFile.initRes.media_id, false, true);
    if (this.currFile && this.currFile.cancelSource) {
      this.currFile.cancelSource.map(item => {
        item.cancel && item.cancel('取消');
      });
    }
    // this.currFile && this.currFile.cancelSource && this.currFile.cancelSource.cancel('取消');
    logs.updateLog({
      is_cancel: true,
    });
    this.currFile = {};
    this.fileList.splice(0, 1);
    this.successIndex = [];
    this.emit('error', 'cancel');
    console.log('用户取消');
    detailTimer && clearInterval(detailTimer);
    batchTimer && clearInterval(batchTimer);
  };

  stop = () => {
    this.currFile.cancelSource.map(item => item.cancel && item.cancel('暂停'));
    // this.currFile.cancelSource.cancel('暂停');
    // let totalProgress = start * chunkSize;
    // totalProgress = Math.floor((totalProgress / file.size) * 100);
    // logs.updateLog({
    //   process_value: totalProgress,
    // });
  };

  handleUploadFileMd5 = async (file, hash) => {
    // let md5 = localStorage.getItem(`md5_${hash}`);
    // // 如果本地MD5为空
    // if (md5 == null) {
    //   // 计算本地文件MD5
    //   md5 = await calFileMd5(file).catch((err) => {
    //     throw new Error(`计算视频MD5失败(${err.message})`);
    //   });
    //   // 记录计算后的md5值,下次免运算
    //   localStorage.setItem(`md5_${hash}`, md5);
    // }
    const md5 = await calFileMd5(file).catch(err => {
      throw new Error(`计算视频MD5失败(${err.message})`);
    });
    return md5;
  };
  events = {};
  emit(eventName, fn) {
    let now = new Date();
    if (eventName == 'error') {
      logs.updateLog({
        total_time: (now - this.time.discovery.start) / 1000,
        is_success: false,
        error_msg: fn,
      });
      //上报失败的日志
      this.uploadLog(fn);
    } else if (eventName == 'success') {
      let total_time = (now - this.time.discovery.start) / 1000;
      logs.updateLog({
        total_time: +total_time,
        total_speed: Math.floor(fn.file.size / total_time),
      });
    }
    // eventHub.emit(eventName, fn);
    for (let key in this.events) {
      if (key === eventName) {
        let fnList = this.events[key];
        fnList.map(f => {
          f.call(undefined, fn);
        });
      }
    }
  }
  on(eventName, fn) {
    if (this.events[eventName] === undefined) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(fn);
  }

  uploadLog(action) {
    logs.upload(action);
  }

  updateLog(obj) {
    logs.updateLog(obj);
  }
  // 重传如果检测md5上传过，重传的时候需要额外先计算进度 然后统一再走一遍上传逻辑
  async reUpload() {
    logs.updateLog({
      extra: 'reupload',
    });
    let checkRes = await this.checkFileMd5(this.currFile.initRes, this.currFile, true);
    this.updateMd5(this.currFile.initRes.media_id, false); //更新md5
    if (checkRes.result) {
      // file.initRes = item.initRes;
      checkRes.received && (this.currFile.received = checkRes.received);
      // file.initRes = item.initRes;
      // this.options.strategy = item.initRes.strategy;
      // 起始位置添加
      const fileSize = this.currFile.size;
      const chunkSize = this.options.strategy.chunk_size * 1024;
      const chunkCount = Math.ceil(fileSize / chunkSize);
      if (checkRes.received[checkRes.received.length - 1] === chunkCount - 1) {
        let pro =
          this.options.strategy.chunk_size * 1024 * (checkRes.received.length - 1) +
          (fileSize - this.options.strategy.chunk_size * 1024 * (chunkCount - 1));
        this.currFile.progress = [pro];
      } else {
        this.currFile.progress = [
          this.options.strategy.chunk_size * 1024 * checkRes.received.length,
        ];
      }

      this.emit('beforeUpload', this.currFile);
      return;
    } else {
      this.emit('beforeUpload', this.currFile);
    }
  }

  // 拿取后端截图 这里后端没有
  batchScreenshot = params => {
    return axios
      .get(this.handleUrl(this.options.default.batchScreenshotUrl, params))
      .then(res => res.data);
  };

  // 拿取后端视频详情
  batchDetails = params => {
    return axios
      .get(this.handleUrl(this.options.default.batchDetailUrl, params))
      .then(res => res.data);
  };

  batchDetailsSync = async params => {
    try {
      const res = await axios.get(this.handleUrl(this.options.default.batchDetailUrl, params));
      return res.data.data;
    } catch (e) {
      console.log(e);
    }
  };
}

//拷贝
const MidClone = (child, father) => {
  for (let [k, v] of Object.entries(father)) {
    if (typeof v === 'object' && child[k]) {
      Object.assign(child[k], father[k]);
    } else if (child[k]) {
      child[k] = father[k];
    }
  }
};

const formatSpeed = speed => {
  return {
    speed: speed,
    speedk: `${(speed / 1024).toFixed(2)} Kb/s`,
    speedM: `${(speed / 1024 / 1024).toFixed(2)} M/s`,
  };
};

/**
 * 网络异常
 * @param {String} code
 * @param {Error} err
 */
const NetErrExpection = err => {
  let message = '系统异常';
  if (navigator.onLine === false) {
    message = '网络未连接';
  }
  if (err.code == 'ECONNABORTED') {
    message = '上传超时';
  }
  throw new Error(message);
};

/**
 * 拿取本地上传视频文件的需要的信息
 * @export
 * @param {*} file
 * @param {*} second 截取图片的时间
 * @returns  {视频，地址，时间，宽高，截图}
 */
const getVideoInfo = file => {
  return new Promise(resolve => {
    let url = URL.createObjectURL(file);
    let video = document.createElement('video');
    video.src = url;
    let load = false;
    video.onloadeddata = () => {
      load = true;
      let info = {
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration,
      };
      video.src = '';
      URL.revokeObjectURL(url);
      video.src = '';
      resolve(info);
    };
    setTimeout(() => {
      if (!load) {
        resolve({});
        video.src = '';
      }
    }, 1000);
  });
};

// 这里
const getVideoScreenshot = (file, second = 0, uplaod = false, scope) => {
  return new Promise((rs, rj) => {
    let url = URL.createObjectURL(file);
    let video = document.createElement('video');
    let screenshot;
    video.src = url;
    setTimeout(() => {
      URL.revokeObjectURL(url);
      video.src = '';
      rj({});
    }, 10000);
    let imgInfo = () => {
      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      let src = canvas.toDataURL('image/png');
      rs({ url: src });
      if (uplaod) {
        canvas.toBlob(
          async function(blob) {
            const pid = await uploadWithFile(blob, { watermark: 0 });
            console.log(pid, 'pid');
            scope.emit('uploadScreen', pid);
          },
          'image/jpeg',
          0.95,
        );
      } else {
        rs({ url: src });
      }
    };
    video.onseeked = () => {
      imgInfo();
    };
    video.onloadeddata = () => {
      video.currentTime = second;
    };
  });
};

let lastTime, lastLoad;

export default wbUploader;
