const MyCookie = {
  setCookie(c_name, value, expire) {
    var date = new Date();
    date.setSeconds(date.getSeconds() + expire);
    document.cookie = c_name + '=' + escape(value) + '; expires=' + date.toGMTString();
    //console.log(document.cookie)
  },
  getCookie(c_name) {
    if (document.cookie.length > 0) {
      let c_start = document.cookie.indexOf(c_name + '=');
      if (c_start != -1) {
        c_start = c_start + c_name.length + 1;
        let c_end = document.cookie.indexOf(';', c_start);
        if (c_end == -1) c_end = document.cookie.length;
        return unescape(document.cookie.substring(c_start, c_end));
      }
    }
    return '';
  },
  delCookie(c_name) {
    this.setCookie(c_name, '', -1);
  },
};

export default MyCookie;
