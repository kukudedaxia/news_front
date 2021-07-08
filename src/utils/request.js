import axios from 'axios';
import { stringify } from 'qs';
// import Cookies from 'js-cookie'
// import router from '../router';

const request = axios.create({
  paramsSerializer: params => stringify(params, { arrayFormat: 'comma' }),
});
request.interceptors.request.use(req => {
  req.withCredentials = true;
  return req;
});


request.interceptors.response.use(response => {
  // console.log(response);
  // if (!response.data || response.data.error_code !== 10000) {
  //   alert(response.data.error);
  //   return Promise.reject(response);
  // }
  return Promise.resolve(response);
});
//   function(error) {
//     console.log(error,'返回1')
//     // 对响应错误做点什么
//     if (error.response) {
//       switch (error.response.status) {
//         case 401:
//           // 返回 401 清除token信息并跳转到登录页面
//           Cookies.remove('uid');
//           Cookies.remove('SUB');
//           router.replace({
//             path: '/login',
//             query: {
//               redirect: router.currentRoute.fullPath,
//             },
//           });
//       }
//     }
//     return Promise.reject(error.response.data);
//   },
// );

const emptyFunc = () => {};
/**
 * @description: 单次ajax请求，回调方式 后期同意放入vuex 删掉
 * @param {object} payload
 * @param {object} payload.req axios请求配置
 * @param {function} payload.onSuccess 成功回调
 * @param {function} payload.onFail 失败回调
 * @param {function} payload.onError 错误回调
 * @param {function} payload.onComplete 完成回调。
 * @return {boolean} 成功true 失败false
 */
export const ajax = payload => {
  console.log(payload, 'payload');
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

export default request;
