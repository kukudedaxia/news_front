/**
 * 图床 upload-img 参数生成
 */

import crc32 from './crc32';
import SparkMD5 from 'spark-md5';

/**
 * 将file文件转为base64
 * @param file 图片源文件
 */
const fileByBase64 = file => {
  return new Promise(resolve => {
    var reader = new FileReader();
    // 传入一个参数对象即可得到基于该参数对象的文本内容
    reader.readAsDataURL(file);
    reader.onload = function(e) {
      // target.result 该属性表示目标对象的DataURL
      resolve(e.target.result);
    };
  });
};

/**
 * 将base64转为blob
 * @param base64 base64格式的数据
 */
const base64ByBlob = base64 => {
  return new Promise(resolve => {
    var arr = base64.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    resolve(new Blob([u8arr], { type: mime }));
  });
};

/**
 * 获取crc32
 * @param blob blob格式的数据
 */
const getCrc32 = blob => {
  return new Promise(resolve => {
    var reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    reader.onloadend = function(evt) {
      const result = crc32(new Uint8Array(evt.target.result));
      resolve(result);
    };
  });
};

/**
 * 获取md5
 * @param blob blob格式的数据
 */
const getMd5 = blob => {
  return new Promise(resolve => {
    let reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    reader.onload = function(e) {
      let spark = new SparkMD5.ArrayBuffer();
      spark.append(e.target.result);
      resolve(spark.end());
    };
  });
};

export { fileByBase64, base64ByBlob, getCrc32, getMd5 };
