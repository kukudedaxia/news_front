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

export default request;
