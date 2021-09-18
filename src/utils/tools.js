import moment from 'moment';
import i18n from './i18n';
const tools = {
  // eslint-disable-next-line prettier/prettier
  emptyFunc() { },
  /**
   * 转换转发文字格式
   * param {parseEntities:Array, text: string} Object
   */
  transformReposts(item) {
    let res = [];
    const arr = item.parseEntities.filter(item => item.indices);
    //gif
    const gifArr = item.parseEntities.filter(item => item.type == 'gif');
    // for (let item of arr) {
    if (item) {
      for (let i = 0; i < arr.length; i++) {
        const d = arr[i];
        if (i == 0) {
          const pre = { type: 'normal' };
          pre.indices = [0, d.indices[0]];
          pre.text = item.text.substring(pre.indices[0], pre.indices[1]);
          if (pre.text.length > 0) {
            res.push(pre);
          }
        }
        d.text = item.text.substring(d.indices[0], d.indices[1] + 1);
        res.push(d);
        const next = { type: 'normal' };
        next.indices =
          i == arr.length - 1
            ? [d.indices[1] + 1, item.text.length]
            : [d.indices[1] + 1, arr[i + 1].indices[0]];
        next.text = item.text.substring(next.indices[0], next.indices[1]);
        if (next.text !== '') {
          res.push(next);
        }
      }
    }
    //git 特殊处理
    if (gifArr.length > 0) {
      const id = 'gif:' + gifArr[0].entityId;
      let gitObj = {};
      if (item.objects) {
        gitObj = item.objects[id];
      }
      res.push({
        type: 'gif',
        object: gitObj,
      });
    }
    return res;
  },
  /**
   * @description: 获取文档完整的高度
   */
  getScrollHeight(node) {
    let height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    if (node) {
      height = node.scrollHeight;
    }
    return height;
  },
  /**
   * @description: 获取滚动条当前的位置
   */
  getScrollTop() {
    let scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
      scrollTop = document.documentElement.scrollTop;
    } else if (document.body) {
      scrollTop = document.body.scrollTop;
    }
    return scrollTop;
  },
  /**
   * @description: 获取当前可视范围的高度
   */
  getClientHeight() {
    return document.documentElement.clientHeight;
  },
  /**
   * @description: 获取当前可视范围的宽度
   */
  getClientWidth() {
    return document.documentElement.clientWidth;
  },
  /**
   * @description: 转换视频时间格式
   * param 时间秒
   */
  transformVideoTime(seconds, moment) {
    const duration = Math.ceil(seconds);
    let m1 = moment.duration(duration, 'seconds');
    let hours = m1.get('hours');
    let mins = m1.get('minutes');
    let sec = m1.get('seconds');
    mins = mins > 9 ? mins : '0' + mins;
    sec = sec > 9 ? sec : '0' + sec;
    if (hours > 0) {
      return `${hours}:${mins}:${sec}`;
    } else {
      return `${mins}:${sec}`;
    }
  },
  requestFullscreen(ele) {
    // 全屏兼容代码
    if (ele.requestFullscreen) {
      ele.requestFullscreen();
    } else if (ele.webkitRequestFullscreen) {
      ele.webkitRequestFullscreen();
    } else if (ele.mozRequestFullScreen) {
      ele.mozRequestFullScreen();
    } else if (ele.msRequestFullscreen) {
      ele.msRequestFullscreen();
    }
  },
  // 取消全屏
  exitFullscreen(ele) {
    if (ele.exitFullscreen) {
      ele.exitFullscreen();
    } else if (ele.webkitExitFullscreen) {
      ele.webkitExitFullscreen();
    } else if (ele.msExitFullscreen) {
      ele.msExitFullscreen();
    } else if (ele.mozCancelFullScreen) {
      ele.mozCancelFullScreen();
    }
  },
  // 验证白名单
  isApp() {
    if (navigator.userAgent.indexOf('beeto') > -1 || navigator.userAgent.search('beeto') > -1) {
      return true;
    } else {
      return false;
    }
  },
  // 获取需要绑定滚动事件的元素
  getScroller(el, root = window) {
    const overflowScrollReg = /scroll|auto/i;
    let node = el;
    while (node && node.tagName !== 'HTML' && node.nodeType === 1 && node !== root) {
      const { overflowY } = window.getComputedStyle(node);
      if (overflowScrollReg.test(overflowY)) {
        if (node.tagName !== 'BODY') {
          return node;
        }
        // see: https://github.com/youzan/vant/issues/3823
        const { overflowY: htmlOverflowY } = window.getComputedStyle(node.parentNode);

        if (overflowScrollReg.test(htmlOverflowY)) {
          return node;
        }
      }
      node = node.parentNode;
    }

    return root;
  },
  // 弹窗底部背景滚动解决方案
  dialogFixed(isOpend) {
    if (isOpend) {
      document.body.style.position = 'fixed';
      document.body.style.top = '0px';
      document.body.style.right = '0px';
      document.body.style.left = '0px';
    } else {
      document.body.style.position = 'static';
      document.body.style.top = null;
      document.body.style.right = null;
      document.body.style.left = null;
    }
  },
  /**
   * @title 判断传入的字符串的首字母是否为阿拉伯语
   * @rules
   *  1. all=true 全检测，若字符串中有阿语，则返回true，否则false
   *  2. all=false，只检测首字母(不包含符合和特殊字符)
   */
  checkAr(str, all) {
    str = String(str);
    let result = '';
    // eslint-disable-next-line no-misleading-character-class
    let pattAr = /[\u0600-\u06FF\u0750-\u077F\u08A0—\u08FF\uFB50—\uFDFF\uFE70—\uFEFF]/;
    // eslint-disable-next-line no-unused-vars
    let parrEn = /[A-Za-z]/;
    for (let i = 0; i < str.length; i++) {
      let initials = str.charAt(i);
      // 如果遇到英文，则返回false
      if (!all) {
        if (parrEn.test(initials)) {
          result = false;
          break;
        }
      }
      // 遇到阿语返回true
      if (pattAr.test(initials)) {
        result = true;
        break;
      }
    }
    return result;
  },
  /**
   * @title 限制input只能输入数字
   * @description 若有非数字字符，则过滤
   */
  limitNumber(val) {
    return val.replace(/[^0-9]/g, '');
  },
  /**
   * @title 限制文本框(数字类型)输入的长度
   * @params  // ref: data目标数据   len: 最大长度
   */
  limitInputLength(vm, ref, len) {
    // ref: data目标数据   len: 最大长度
    if (vm[ref].length > len) {
      vm[ref] = vm[ref].slice(0, len);
    }
  },
  /**
   * @title 截取表情特殊字符 会延长后取一位
   */
  truncated(str, num) {
    let index = Array.from(str)[num - 1].codePointAt(0) > 0xffff ? num + 1 : num;
    return str.slice(0, index);
  },
  /**
   * @title 设置过期时间展示
   * @params start：string
   */
  transformTime(exper) {
    const expertTime = moment.unix(exper);
    const now = moment();
    const diffTime = expertTime.diff(now, 'seconds');
    console.log(diffTime, 'diff');
    if (diffTime < 0) {
      return i18n.t('vote.close');
    }
    //const seconds = diffTime % 60;
    const minutes = Math.floor(diffTime / 60) % 60;
    const hours = Math.floor(diffTime / 3600) % 24;
    const day = Math.floor(diffTime / 3600 / 24);
    console.log(day, hours, minutes);
    if (day > 0) {
      return hours > 0 ? i18n.t('vote.day', [day, hours]) : i18n.t('vote.day1', [day]);
    }
    if (hours > 0) {
      return minutes > 0 ? i18n.t('vote.hour', [hours, minutes]) : i18n.t('vote.hour1', [hours]);
    }
    return i18n.t('vote.min', [minutes]);
  },

  /**
   * @title 节流函数
   * @params 间隔200ms执行一次
   */
  throttle(fn, times = 200) {
    let canRun = true;
    return () => {
      if (!canRun) return;
      canRun = false;
      setTimeout(() => {
        fn();
        canRun = true;
      }, times);
    };
  },
  // 判断是什么端
  // 1代表“PC”、2代表“iOS”、3代表“Android”
  checkSource() {
    const u = navigator.userAgent;
    const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    if (isAndroid) return 3;
    const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isiOS) return 2;
    return 1;
  },

  /**
   * @title 批量生成分享meta标签
   * @param [{property:'og:title',content: 'xxx'}]
   */
  createShareMeta(paramsArr) {
    const fragment = document.createDocumentFragment();
    Array.prototype.forEach.call(paramsArr, item => {
      try {
        // 判断元素是否存在，如果存在则替换属性
        const metaDom = document.querySelector(`meta[property='${item.property}']`);
        if (metaDom) {
          metaDom.setAttribute('content', item.content);
          throw Error();
        }
        const meta = document.createElement('meta');
        meta.setAttribute('property', item.property);
        meta.setAttribute('content', item.content);

        fragment.appendChild(meta);
        // eslint-disable-next-line no-empty
      } catch (error) {}
    });
    document.head.appendChild(fragment);
  },
  convertNumbers(num) {
    if (num < 1000) {
      return num;
    } else {
      var newNum = (num / 1000).toFixed(3);
      return newNum.split('.')[0] + '.' + newNum.split('.')[1].substring(0, 1) + 'K';
    }
  },

  /**
   * @title date format
   * @params  // ref: data目标数据   len: 最大长度
   */
  dateFormat(date, fmt) {
    if (!date) return '';
    var o = {
      'M+': date.getMonth() + 1, //月份
      'd+': date.getDate(), //日
      'h+': date.getHours(), //小时
      'm+': date.getMinutes(), //分
      's+': date.getSeconds(), //秒
      'q+': Math.floor((date.getMonth() + 3) / 3), //季度
      S: date.getMilliseconds(), //毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp('(' + k + ')').test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length),
        );
    return fmt;
  },

  /**
   * @title 生成指定范围数字的数组
   */
  arrayRange(array, start, end) {
    let length = end - start + 1;
    let step = start - 1;
    return array.constructor.apply(null, { length: length }).map(() => {
      step++;
      return step < 10 ? `0${step}` : step;
    });
  },
};
export default tools;
