import {ajax} from '../utils/request';
import moment from 'moment';
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
    url: 'log/r?enc=0',
    data: data,
  };
  console.log(req)
  return ajax({ req, ...callbacks });
};
