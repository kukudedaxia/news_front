import moment from 'moment';
import store from '../store';
// 上报埋点
export const sendReport = (params, callbacks) => {
  let data = {
    action_time: moment(new Date().getTime())
      .utc()
      .format('YYYY/MM/DD HH:mm:ss'),
    uuid: '',
    action: '',
    scope: 'web',
    uicode: store.state.uicode,
    ip: '',
    attrs: '{}',
    url: '',
    extend: '',
    ...params,
  };
  let req = {
    method: 'post',
    url: '/eventlogs',
    data: data,
  };

  return store.dispatch('ajax', { req, ...callbacks });
};
