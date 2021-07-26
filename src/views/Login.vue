<template>
  <div>
    <div class="tabs">
      <el-tabs v-model="activeName" @tab-click="changeTab">
        <el-tab-pane :label="$t('login.tab1')" name="phone">
          <div class="con" v-if="!hide">
            <div class="line">
              <el-select v-model="areaCode" slot="prepend" placeholder="请选择" class="area-code">
                <el-option :value="item.num" v-for="(item, index) of areaList" :key="index">
                  <span style="float: left">{{ item.place }}</span>
                  <span style="float: right">{{ item.num }}</span>
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
            <div class="line">
              <input
                :placeholder="$t('login.codeph')"
                v-model="verifyCode"
                class="input"
                @input="checkInputRules('verifyCode', 6)"
              />
              <template>
                <span
                  class="send"
                  v-if="!codeLoading"
                  @click="phoneLengthCorrect ? sendCode() : errorPhone()"
                >
                  {{
                    codeTimes > 0
                      ? `${codeTimes}s`
                      : send
                      ? $t('login.resend')
                      : $t('login.getcode')
                  }}
                </span>
                <loading :isComplete="false" v-else style="width: 20px" />
              </template>
            </div>
            <p class="tip_info" v-if="errorMsg">
              <img src="@/assets/images/icon_warn.png" class="icon_warn" />
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
           <p class="info" v-if="lang == 'en'">
            I've read and agreed to the <a href="/terms" target="_blank">Terms of Use></a> and
            <a href="policy" target="_blank">Privacy policy></a>
          </p>
          <p class="info" v-else>
            لقد قرأت ووافقت على
            <a href="/terms" target="_blank">>شروط الاستخدام </a>
            و
            <a href="policy" target="_blank">>سياسة الخصوصية</a>
          </p>
        </el-tab-pane>
        <el-tab-pane :label="$t('login.tab2')" name="account">
          <div class="con">
            <div class="line">
              <input
                :placeholder="$t('login.accountph')"
                v-model="account"
                class="input"
                @focus="errorHide"
                type="text"
              />
              <img
                src="@/assets/images/icon_clear.png"
                class="icon icon-clear"
                v-show="account != ''"
                @mousedown.prevent="account = ''"
              />
            </div>
            <div class="line">
              <input
                :placeholder="$t('login.passwordph')"
                v-model="password"
                class="input password"
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
          <p class="tip_info" v-if="errorMsg">
            <img src="@/assets/images/icon_warn.png" class="icon_warn" />
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
          <p class="info" v-if="lang == 'en'">
            I've read and agreed to the <a href="/terms" target="_blank">Terms of Use></a> and
            <a href="policy" target="_blank">Privacy policy></a>
          </p>
          <p class="info" v-else>
            لقد قرأت ووافقت على
            <a href="/terms" target="_blank">شروط الاستخدام ></a>
            و
            <a href="policy" target="_blank">سياسة الخصوصية ></a>
          </p>
        </el-tab-pane>
      </el-tabs>
    </div>
    <ThirdLogin />
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
      this.getArea()
    }
  },
  methods: {
    keydown(event) {
      if (event.keyCode !== 13) return;
      this.login();
    },
    errorPhone() {
      this.errorMsg = 'Please fill in the phone number correctly';
    },
    changeTab() {
      if (this.activeName == 'account') {
        this.hide = true;
      } else {
        this.hide = false;
      }
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
          console.log('complete');
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
          Cookies.set('SUB', res.data.gsid);
          await this.$store.dispatch('getUser', uid);
          this.$store.commit('setLoginType', 'normal');
          this.$router.push({ path: 'live' });
        },
        onFail: res => {
          if (res.error_code == 30070) {
            this.$message.error(this.$t('login.permission'));
          } else {
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
<style lang="less" scoped>
.tabs {
  max-width: 500px;
  padding: 20px;
  margin: 100px auto;
  border: 1px solid #ccc;
}
.line {
  margin: 20px 0;
  height: 40px;
  display: flex;
  align-items: center;
  position: relative;
}
.area-code {
  width: 80px;
}
.login-btn {
  width: 100%;
}
.info {
  font-size: 12px;
  margin-top: 10px;
}
.send {
  cursor: pointer;
}
.tip_info {
  font-size: 12px;
  letter-spacing: 0;
  line-height: 18px;
  margin-top: 12px;
  color: #ee3b23;
  display: flex;
  align-items: center;
  .icon_warn {
    width: 12px;
    height: 12px;
    margin-right: 5px;
    margin-top: 1px;
    // vertical-align: -2px;
  }
}

.input {
  border: none;
  font-size: 16px;
  padding: 10px;
  flex: 1;
  &:focus {
    outline: 0;
  }
  &::placeholder {
    color: #c9cdd8;
  }
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
