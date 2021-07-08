import moment from 'moment';
import store from '../store';
// 上报埋点
export const sendReport = (params, callbacks) => {
  let data = {
    time: moment(new Date().getTime())
      .utc()
      .format('YYYY/MM/DD HH:mm'),
    uid: '',
    action: '',
    object_id: '',
    uicode: '',
    luicode: '',
    fid: '',
    lfid: '',
    cardid: '',
    lcardid: '',
    from_val: 'BT11192010',
    wm: '',
    oldwm: '',
    ip: '',
    version: '',
    aid: '',
    ua: '',
    extend: 'source:1', //pc
    ...params,
  };
  let req = {
    method: 'post',
    url: 'api/log/r?enc=0',
    data: data,
  };
  return store.dispatch('ajax', { req, ...callbacks });
};

