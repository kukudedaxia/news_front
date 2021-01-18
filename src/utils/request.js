import axios from 'axios';
import { stringify } from 'qs';

const request = axios.create({
  paramsSerializer: params => stringify(params, { arrayFormat: 'comma' }),
});
request.interceptors.request.use(req => {
  req.withCredentials = true;
  return req;
});

request.interceptors.response.use(response => {
  return response;
});

const emptyFunc = () => {};
/**
 * @description: 单次ajax请求，回调方式
 * @param {object} payload
 * @param {object} payload.req axios请求配置
 * @param {function} payload.onSuccess 成功回调
 * @param {function} payload.onFail 失败回调
 * @param {function} payload.onError 错误回调
 * @param {function} payload.onComplete 完成回调。
 * @return {boolean} 成功true 失败false
 */
const ajax = payload => {
  // console.log(payload, 'payload');
  if (!payload) {
    return false;
  }
  let req = {
    baseURL: `//${window.location.host}/api/`,
    method: 'get',
    headers: {
      'content-type': 'application/json',
    },
  };
  let reqConf = Object.assign({}, req, payload.req);
  payload.onFail = payload.onFail || emptyFunc;
  payload.onComplete = payload.onComplete || emptyFunc;
  payload.onError = payload.onError || emptyFunc;

  request(reqConf)
    .then(res => {
      if (res && res.data && (res.data.error_code === 10000 || res.data.error === 'success')) {
        payload.onSuccess && payload.onSuccess(res.data, reqConf, res);
      } else {
        payload.onFail && payload.onFail(res.data, reqConf, res);
      }
      payload.onComplete && payload.onComplete(null, res.data, reqConf, res);
    })
    .catch(err => {
      payload.onError && payload.onError(err, reqConf);
      payload.onComplete && payload.onComplete(err, null, reqConf, null);
    });
  return true;
};

export default ajax;
