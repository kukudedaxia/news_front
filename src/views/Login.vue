<template>
  <div id="login">
    <div class="tabs">
      <el-tabs v-model="activeName" @tab-click="changeTab">
        <el-tab-pane :label="$t('login.tab1')" name="phone" class="mt-30">
          <div class="con" v-if="!hide">
            <div class="line">
              <el-select v-model="areaCode" slot="prepend" placeholder="请选择" class="area-code">
                <el-option :value="item.num" v-for="(item, index) of areaList" :key="index">
                  <span class="place">{{ item.place }}</span>
                  <span class="codes">{{ item.num }}</span>
                </el-option>
              </el-select>
              <input
                :placeholder="$t('login.phoneph')"
                v-model="phone"
                @focus="errorHide"
                @input="checkInputRules('phone', 11)"
                class="input"
                v-arInput
              />
            </div>
            <p class="tip_info tip_1" v-if="errorMsg && this.tip == '1'">
              <img src="@/assets/images/icon_warn1.png" class="icon_warn" />
              <span class="no-flip-over">{{ errorMsg }}</span>
            </p>
            <div class="line">
              <input
                :placeholder="$t('login.codeph')"
                v-model="verifyCode"
                class="input"
                @input="checkInputRules('verifyCode', 6)"
                style="width: 176px;"
              />
              <template>
                <span
                  :class="['send', { resend: send, time: codeTimes > 0 && send }]"
                  v-if="!codeLoading"
                  @click="errorPhone()"
                >
                  {{
                    codeTimes > 0
                      ? `${codeTimes}s`
                      : send
                      ? $t('login.resend')
                      : $t('login.getcode')
                  }}
                </span>
                <loading :isComplete="false" v-else style="width: 164px" />
              </template>
            </div>
            <p class="tip_info" v-if="errorMsg && this.tip == ''">
              <img src="@/assets/images/icon_warn1.png" class="icon_warn" />
              <span class="no-flip-over">{{ errorMsg }}</span>
            </p>
          </div>
          <el-button
            class="login-btn"
            type="danger"
            :disabled="disabled"
            :loading="loginLoading"
            @click="login"
            >{{ $t('login.login') }}</el-button
          >
          <el-divider
            ><span class="continue">{{ $t('login.continue') }}</span></el-divider
          >
          <ThirdLogin v-if="activeName == 'phone'" />
          <p class="info" v-if="lang == 'en'">
            I've read and agreed to the <br />
            <a href="/terms" target="_blank">Terms of Use</a>,<a href="/community" target="_blank"
              >Community Guidelines</a
            >
            and
            <a href="/policy" target="_blank">Privacy Policy</a>
          </p>
          <p class="info" v-else>
            لقد قرأت ووافقت على<br />
            <a href="/terms" target="_blank">شروط الاستخدام </a>,<a
              href="/community"
              target="_blank"
              >قواعد المجتمع</a
            >
            و
            <a href="/policy" target="_blank">سياسة الخصوصية</a>
          </p>
        </el-tab-pane>
        <el-tab-pane :label="$t('login.tab2')" name="account" class="mt-30">
          <div class="con">
            <div class="line">
              <input
                :placeholder="$t('login.accountph')"
                v-model="account"
                class="input inputs"
                @focus="errorHide"
                type="text"
              />
              <!-- <img
                src="@/assets/images/icon_clear.png"
                class="icon icon-clear"
                v-show="account != ''"
                @mousedown.prevent="account = ''"
              /> -->
            </div>
            <p class="tip_info tip_1" v-if="errorMsg && this.tip == '1'">
              <img src="@/assets/images/icon_warn1.png" class="icon_warn" />
              <span class="no-flip-over">{{ errorMsg }}</span>
            </p>
            <div class="line">
              <input
                :placeholder="$t('login.passwordph')"
                v-model="password"
                class="input  inputs password"
                @focus="errorHide"
                :type="showPwd ? 'text' : 'password'"
              />
              <img
                :src="
                  showPwd
                    ? require('@/assets/images/pwd_open.png')
                    : require('@/assets/images/pwd_close.png')
                "
                class="icon-pwd"
                @click="showPwd = !showPwd"
              />
            </div>
          </div>
          <p class="tip_info" v-if="errorMsg && this.tip == ''">
            <img src="@/assets/images/icon_warn1.png" class="icon_warn" />
            <span class="no-flip-over">{{ errorMsg }}</span>
          </p>
          <el-button
            class="login-btn"
            type="danger"
            :disabled="disabled"
            :loading="loginLoading"
            @click="login"
            >{{ $t('login.login') }}</el-button
          >
          <el-divider
            ><span class="continue">{{ $t('login.continue') }}</span></el-divider
          >
          <ThirdLogin v-if="activeName == 'account'" />
          <p class="info" v-if="lang == 'en'">
            I've read and agreed to the <br />
            <a href="/terms" target="_blank">Terms of Use</a>,<a href="/community" target="_blank"
              >Community Guidelines</a
            >
            and
            <a href="/policy" target="_blank">Privacy Policy</a>
          </p>
          <p class="info" v-else>
            لقد قرأت ووافقت على<br />
            <a href="/terms" target="_blank">شروط الاستخدام </a>,<a
              href="/community"
              target="_blank"
              >قواعد المجتمع</a
            >
            و
            <a href="/policy" target="_blank">سياسة الخصوصية</a>
          </p></el-tab-pane
        >
      </el-tabs>
    </div>
  </div>
</template>
<script>
import JSEncrypt from 'jsencrypt';
import Cookies from 'js-cookie';
import Loading from '@/components/common/Loading';
import ThirdLogin from '@/components/thirdLogin';
export default {
  name: 'Login',
  components: {
    Loading,
    ThirdLogin,
  },
  data() {
    return {
      hide: false,
      activeName: 'phone',
      phone: '',
      areaCode: '+44',
      areaList: [],
      verifyCode: '',
      account: '',
      password: '',
      codeLoading: false,
      loginLoading: false,
      send: false, // 是否已经发送过验证码了
      codeTimes: '', // 倒计时计数
      codeCount: 0,
      tip: '',
      errorMsg: '',
      showPwd: false, // 是否显示密码明文
    };
  },
  created() {
    this.getArea();

    window.addEventListener('keydown', this.keydown);
  },
  destroyed() {
    window.removeEventListener('keydown', this.keydown);
  },
  computed: {
    // 手机号位数是否输入正确
    phoneLengthCorrect() {
      if (this.phone.length > 6 && this.phone.length < 12) {
        return true;
      }
      return false;
    },
    disabled() {
      if (this.activeName == 'phone') {
        if (this.verifyCode != '' && this.verifyCode.length === 6 && this.phoneLengthCorrect) {
          return false;
        }
      } else {
        if (this.account && this.password) {
          return false;
        }
      }
      return true;
    },
    lang() {
      return this.$store.state.language;
    },
  },
  watch: {
    password(val) {
      // eslint-disable-next-line no-useless-escape
      let str = val.replace(/[^\w\.\/]/gi, '');
      // eslint-disable-next-line no-useless-escape
      str = str.replace(/[`~!@#$%^&*+<>{}/\'[\]]/im, '').replace(/\s+/g, '');
      this.password = str;
    },
    lang() {
      this.getArea();
    },
  },
  methods: {
    keydown(event) {
      if (event.keyCode !== 13) return;
      this.login();
    },
    errorPhone() {
      this.tip = '1';
      this.errorMsg = this.$t('login.error');
    },
    changeTab() {
      if (this.activeName == 'account') {
        this.hide = true;
      } else {
        this.hide = false;
      }
      this.tip = '';
      this.errorMsg = '';
    },
    getArea() {
      this.$store.dispatch('ajax', {
        req: {
          method: 'post',
          url: '/api/web/country/list',
        },
        onSuccess: res => {
          this.areaList = res.data;
        },
        onComplete: () => {
          // console.log('complete');
        },
      });
    },
    // 发送验证码
    sendCode() {
      this.codeLoading = true;
      this.$store.dispatch('ajax', {
        req: {
          method: 'get',
          url: `/api/web/pwd/code/send`,
          params: {
            mobile: `${this.areaCode}${this.phone}`,
          },
        },
        onSuccess: () => {
          this.codeLoading = false;
          this.send = true;
          this.countDown();
        },
        onFail: res => {
          this.codeLoading = false;
          this.errorMsg = res.error;
        },
      });
    },
    countDown() {
      this.codeCount++;
      this.codeTimes = 60;
      let times = null;
      // eslint-disable-next-line no-undef
      if (!times) {
        times = setInterval(() => {
          this.codeTimes--;
          if (this.codeTimes <= 0) {
            clearInterval(times);
            times = null;
          }
        }, 1000);
      }
    },
    // 文本输入框（数字类型）校验
    checkInputRules(ref, len) {
      // 限制只输入数字
      this[ref] = this.tools.limitNumber(this[ref]);
      // 限制长度
      this.tools.limitInputLength(this, ref, len);
    },
    errorHide() {
      this.errorMsg = '';
    },
    login() {
      // const that = this;
      this.loginLoading = true;
      this.$store.dispatch('ajax', {
        req: {
          method: 'post',
          url: `/sign/api/login`,
          data: {
            entry: 'sinbad',
            user: this.activeName == 'phone' ? this.areaCode + this.phone : this.account,
            pwd: this.rsa(this.password),
            type: this.activeName == 'phone' ? '1' : '2',
            code: String(this.verifyCode),
          },
        },
        onSuccess: async res => {
          this.loginLoading = false;
          const uid = res.data.user.id;
          // const replaceUrl = that.$route.query.redirect || '/';
          Cookies.set('uid', uid);
          Cookies.set('SUB', res.data.gsid, {
            domain: process.env.VUE_APP_DOMAIN,
          });
          await this.$store.dispatch('getUser', uid);
          this.$store.commit('setLoginType', 'normal');
          this.$router.push({ path: 'live' });
        },
        onFail: res => {
          if (res.error_code == 30070 || res.error_code == 30071) {
            this.$message({
              type: 'warning',
              message: res.error_code == 30070 ? this.$t('login.permission') : res.error,
              customClass: 'warning_tip',
            });
          } else {
            if (res.error_code == 50002 || res.error_code == 30011) {
              this.tip = '1';
            } else {
              this.tip = '';
            }
            this.errorMsg = res.error;
          }
          this.loginLoading = false;
        },
        onComplete: () => {
          this.loginLoading = false;
        },
        onError: () => {
          this.loginLoading = false;
        },
      });
    },
    rsa(password) {
      let encryptor = new JSEncrypt();
      let pubKey =
        '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDfw1/P15GQzGGYvNwVmXIGGxea8Pb2wJcF7ZW7tmFdLSjOItn9kvUsbQgS5yxx+f2sAv1ocxbPTsFdRc6yUTJdeQolDOkEzNP0B8XKm+Lxy4giwwR5LJQTANkqe4w/d9u129bRhTu/SUzSUIr65zZ/s6TUGQD6QzKY1Y8xS+FoQQIDAQAB-----END PUBLIC KEY-----';
      encryptor.setPublicKey(pubKey); //设置公钥
      let rsaPassWord = encryptor.encrypt(password);
      console.log(rsaPassWord, 'rsa');
      return rsaPassWord;
    },
  },
};
</script>
<style lang="less">
.el-tabs__item {
  color: #333333;
}
#login {
  .el-tabs__header {
    height: 36px;
  }
  .el-tabs__nav-wrap,
  .el-tabs__nav-scroll {
    overflow: initial;
  }
  .el-tabs__item {
    font-size: 20px;
    font-family: 'SF-UI-Text-Regular';
  }
  .el-tabs__active-bar {
    bottom: -15px;
    height: 3px;
    background-image: linear-gradient(90deg, #ff9e39 1%, #ff536c 100%);
    border-radius: 2px;
  }
  .el-tabs__item.is-active {
    font-family: 'SFUIText-Bold';
    color: '#FF536C';
  }
  .el-tabs__nav-wrap::after {
    display: none;
  }
  .el-tabs__item:nth-child(2) {
    padding-right: 72px;
  }

  .el-input--suffix .el-input__inner {
    border: none;
    padding-left: 0;
    padding-right: 0;
    font-family: SFUIText-Medium;
    font-size: 16px;
    color: #333333;
  }
  .el-select .el-input .el-select__caret {
    color: #333333;
    font-size: 12px;
    width: 20px;
  }
  .el-input__suffix {
    right: 2px;
  }
  .el-tabs__nav {
    width: 340px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .el-select-dropdown {
    border: 1px solid #eeeeee;
    margin-top: 4px !important;
    box-shadow: none;
    border-radius: 0 0 10px 10px;
  }
  .el-select-dropdown__item.hover,
  .el-select-dropdown__item:hover {
    background-color: #f6f6f6;
  }
  .el-divider {
    background-color: #eeeeee;
  }
  .el-divider--horizontal {
    margin: 38px 0;
  }
  .el-divider__text {
    color: #777f8e;
    padding: 10px;
  }
}
.warning_tip {
  background: rgba(136, 142, 152, 0.96);
  border-radius: 20px;
  padding: 10px 12px;
  color: #ffffff;
  .el-message__content,
  .el-icon-warning {
    color: #ffffff;
  }
}
.el-popper .popper__arrow,
.el-popper .popper__arrow::after {
  display: none;
}
.el-popper[x-placement^='bottom'] {
  margin-top: 4px;
}

html[lang='ar'] #login .el-input__suffix {
  right: auto;
  left: 6px;
}
html[lang='ar'] #login .el-tabs__nav {
  width: auto;
}
html[lang='ar'] #login .el-tabs__item {
  transform: scaleX(-1);
}
html[lang='ar'] #login .el-tabs__item:nth-child(2) {
  padding-right: 0;
}
html[lang='ar'] #login .el-tabs__item:last-child {
  flex: 1;
  padding: 0 30px;
}
html[lang='ar'] #login .el-tabs__header {
  transform: scaleX(-1);
}
html[lang='ar'] #login .el-tabs__nav {
  width: 450px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-select-dropdown__item {
  color: #333;
  font-family: SFUIText-Medium;
}
.el-select-dropdown__item.selected {
  color: #ff563c;
}
</style>

<style lang="less" scoped>
#login {
  background: url('https://img.bee-cdn.com/large/3b9ae203lz1gmjuc12qltj21hc0ooe3u.jpg') no-repeat;
  background-size: 100% 100%;
  margin-top: -80px;
  height: 980px;
  display: flex;
  align-items: center;
}
.tabs {
  max-width: 440px;
  padding: 50px;
  margin: 100px auto;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 20px 55px -30px rgba(11, 0, 152, 0.3);
}
html[lang='ar'] .tabs {
  max-width: none;
}
.mt-30 {
  margin-top: 30px;
}
.line {
  margin: 20px 0;
  height: 50px;
  display: flex;
  align-items: center;
  position: relative;
  border-bottom: 1px solid #eeeeee;
}
.area-code {
  width: 64px;
  margin-right: 10px;
}
.login-btn {
  width: 100%;
  border-radius: 20px;
}
.info {
  font-size: 12px;
  margin-top: 30px;
  a {
    color: #346aa7;
    text-decoration: none;
    font-family: SFUIText-Medium;
  }
}
.send {
  cursor: pointer;
  font-family: SFUIText-Medium;
  font-size: 16px;
  color: #333333;
  white-space: nowrap;
}
html[lang='ar'] .send {
}
.resend {
  color: #ff536c;
}
.time {
  color: #777f8e;
}
.tip_info {
  font-size: 12px;
  letter-spacing: 0;
  line-height: 14px;
  margin-top: -5px;
  color: #ee3b23;
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  text-align: left;
  .icon_warn {
    width: 12px;
    height: 12px;
    margin-right: 5px;
    margin-top: 1px;
    // vertical-align: -2px;
  }
}
.tip_1 {
  margin-bottom: -12px;
}

.input {
  border: none;
  font-family: SFUIText-Medium;
  font-size: 16px;
  color: #333333;
  padding: 10px 10px 10px 0;
  flex: 1;
  &:focus {
    outline: 0;
  }
  &::placeholder {
    color: #c9cdd8;
  }
}
.inputs {
  // padding: 10px;
}
.icon-pwd {
  width: 20px;
  height: 20px;
  position: absolute;
  right: 10px;
  cursor: pointer;
}
.password {
  padding-right: 32px;
}
.icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.icon-clear {
  width: 20px;
  height: 20px;
  font-size: 19px;
  color: #c9cdd8;
  right: 10px;
}
.place {
  float: left;
  margin-right: 10px;
}
.codes {
  float: right;
}
html[lang='ar'] .place {
  float: right;
  margin-right: 0;
}
html[lang='ar'] .codes {
  float: left;
  direction: ltr;
  display: inline-block;
  margin-right: 10px;
}

html[lang='ar'] .password {
  padding-right: 10px;
  padding-left: 32px;
}
html[lang='ar'] .icon-pwd,
html[lang='ar'] .icon-clear {
  left: 10px;
  right: auto;
}
</style>
