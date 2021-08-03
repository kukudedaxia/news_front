import axios from 'axios';
import { stringify } from 'qs';
import Cookies from 'js-cookie';
import router from '../router';
import store from '../store/index';
const request = axios.create({
  paramsSerializer: params => stringify(params, { arrayFormat: 'comma' }),
});
request.interceptors.request.use(req => {
  req.withCredentials = true;
  return req;
});

request.interceptors.response.use(
  response => {
    // console.log(response);

    if (response.data.error_code) {
      switch (response.data.error_code) {
        case 35000:
          // 返回 401 清除token信息并跳转到登录页面
          Cookies.remove('uid');
          Cookies.remove('SUB');
          Cookies.remove('userInfo');
          // 解决退出时候 还有权限接口仍在访问
          if (router.currentRoute.meta.auth) {
            router.replace({
              path: '/login',
              query: {
                redirect: router.currentRoute.fullPath,
              },
            });
          }
          return Promise.reject(response);
      }
    }
    return Promise.resolve(response);
  },
  function(error) {
    console.log(error, '返回1');
    // 对响应错误做点什么
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 返回 401 清除token信息并跳转到登录页面
          Cookies.remove('uid');
          Cookies.remove('userInfo');
          Cookies.remove('SUB');
          store.commit('setUser', {});
          router.replace({
            path: '/login',
            query: {
              redirect: router.currentRoute.fullPath,
            },
          });
      }
    }
    return Promise.reject(error.response.data);
  },
);

export default request;
