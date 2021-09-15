import axios from 'axios';
import SparkMD5 from 'spark-md5';
import qs from 'qs';

const b_crc32 = str => {
  var a_table =
    '00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D';
  var b_table = a_table.split(' ').map(function(s) {
    return parseInt(s, 16);
  });
  var crc = -1;
  for (var i = 0, iTop = str.length; i < iTop; i++) {
    crc = (crc >>> 8) ^ b_table[(crc ^ str.charCodeAt(i)) & 0xff];
  }
  return (crc ^ -1) >>> 0;
};

const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;

// 读取文件切片
const readChunk = (file, start, end) => {
  return new Promise(resolve => {
    const fileReader = new FileReader();
    fileReader.onload = evt => resolve(evt.target.result);
    fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
  });
};

const calFileMd5 = async file => {
  const fileSize = file.size;
  const spark = new SparkMD5.ArrayBuffer();
  const chunk = await readChunk(file, 0, fileSize);
  spark.append(chunk);
  return spark.end();
};

/**
 * 获取图片二进制
 * @param {Blob|File} file 图片路径
 * @returns {ArrayBuffer} 图片二进制
 */
const getArrayBuffer = file => {
  return new Promise(resolve => {
    var fileReader = new FileReader();
    fileReader.onload = evt => resolve(evt.target.result);
    fileReader.onerror = () => resolve('');
    fileReader.readAsArrayBuffer(file);
  });
};

/**
 * 获取图片字符串
 * @param {Blob|File} file 图片路径
 * @returns {string}
 */
const getBinaryString = file => {
  return new Promise(resolve => {
    var fileReader = new FileReader();
    fileReader.onload = evt => resolve(evt.target.result);
    fileReader.onerror = () => resolve('');
    fileReader.readAsBinaryString(file);
  });
};

/**
 * 网络异常
 * @param {String} code
 * @param {Error} err
 */
const NetErrExpection = function(err) {
  console.log(err);
  let message = '系统异常';
  if (navigator.onLine === false) {
    message = '网络未连接';
  }
  if (err.code == 'ECONNABORTED') {
    message = '上传超时';
  }
  this.code = -100;
  this.message = `上传图片失败:${message}(${err})`;
};
/**
 * 图片上传异常
 * @param {String|Number} code 错误码
 */
const UploadExpection = function(code) {
  const message_map = {
    1: '用户未登录',
    2: '上传数据无效',
    3: '回调地址无效',
    4: '未找到上传文件',
    5: '无权上传',
    6: '上传uid无效',
    7: '未指定返回信息类型',
    8: '上传数据出错',
    9: '上传MIME类型不支持',
    10: '上传文件大小无效',
    11: '存储出错',
    12: '上传EXIF信息过长',
    13: '上传回调出错',
    14: '回调返回出错',
    15: '错误的请求',
    '-1': '没有登录',
    '-2': '没有收到POST数据',
    '-3': '没有指定cb参数',
    '-4': '没有发现提交上传文件',
    '-5': '该app没有开放图片上传服务',
    '-6': 'uid非法',
    '-7': '参数s值不支持',
    '-8': '数据上传失败',
    '-9': '文件mime类型不支持',
    '-10': '文件字节数超过限制',
    '-11': '存储错误',
    '-12': '图片exif信息超长(2k)',
  };
  const abs_ret = Math.abs(code);
  this.code = code;
  this.message = `上传图片失败:${message_map[abs_ret] || '未知错误'}(${code})`;
};

// eslint-disable-next-line no-unused-vars
const uploadWithFile = async (input, opts = {}, ori = 0, file_source = 1) => {
  let data = '';
  data = await getArrayBuffer(input);
  let resp;
  try {
    const cs = b_crc32(await getBinaryString(input));
    const md5 = await calFileMd5(input).catch(err => {
      throw new Error(`计算image MD5失败(${err.message})`);
    });
    const hdOption = {
      file_source,
      cs,
      ent: 'alpha',
      appid: 339644097,
      uid:
        (window.$CONFIG && window.$CONFIG.uid) ||
        (window.$CONFIG && window.$CONFIG.user && window.$CONFIG.user.id), //???????
      raw_md5: md5,
      ori: ori, //
    };
    const querystring = qs.stringify(hdOption);
    const url = `${process.env.VUE_APP_UPLOAD_URL}/upload.json?${querystring}`;

    var ajax = axios.create();
    delete ajax.defaults.headers.common['X-Requested-With'];
    resp = await ajax.request({
      url,
      method: 'post',
      data: data,
      withCredentials: true,
      timeout: 1000 * 60 * 2,
      xsrfCookieName: null,
    });
  } catch (err) {
    throw new NetErrExpection(err);
  }
  if (resp.data.ret) {
    return resp.data.pic.pid;
  } else if (resp.data.ret === false) {
    throw new UploadExpection(resp.data.errno);
  } else if (!resp.data.code || resp.data.code != 'A00006') {
    throw new UploadExpection(resp.data.data && resp.data.data.count);
  }
  return resp.data.data.pics.pic_1.pid;
};

// const uploadImg = async (file)  => {
//   try {
//     this.file = file;
//     const base64 = await fileByBase64(file);
//     const blob = await base64ByBlob(base64);
//     const md5 = await getMd5(blob);
//     const cs = await getCrc32(blob);
//     const form = new FormData();
//     form.append('file', blob);
//     $.ajax({
//       type: 'post',
//       data: form.get('file'),
//       // eslint-disable-next-line prettier/prettier
//           url: `${process.env.VUE_APP_UPLOAD_URL}/upload.json?file_source=1&cs=${cs}&ent=alpha&appid=339644097&uid=${this.user.id}&raw_md5=${md5}`,
//       async: true,
//       contentType: 'application/x-www-form-urlencoded',
//       processData: false,
//       crossDomain: true, //设置跨域为true
//       xhrFields: {
//         withCredentials: true, //默认情况下，标准的跨域请求是不会发送cookie的
//       },
//       headers: {
//         Accept: 'application/json',
//       },
//       success: res => {
//         if (res.ret) {
//           this.fileList.push({
//             pid: res.pic.pid,
//           });
//         } else {
//           this.$message.error(this.$t('live.uploadErr'));
//         }
//       },
//       error: () => {
//       },
//     });
//   } catch (error) {
//     console.error(error);
//   }
// },
export { uploadWithFile };
