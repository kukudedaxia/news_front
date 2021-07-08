<template>
  <div>
    <div class="tabs">
      <el-tabs v-model="activeName" @tab-click="changeTab">
        <el-tab-pane label="Login With Phone" name="phone">
          <div class="con">
            <div class="line">
              <el-select v-model="areaCode" slot="prepend" placeholder="请选择" class="area-code">
                <el-option :value="item.num" v-for="(item, index) of areaList" :key="index">
                  <span style="float: left">{{ item.place }}</span>
                  <span style="float: right">{{ item.num }}</span>
                </el-option>
              </el-select>
              <input
                placeholder="请输入内容"
                v-model="phone"
                @focus="phoneInputFocus"
                @input="checkInputRules('phone', 11)"
                class="input"
                v-arInput
              />
            </div>
            <div class="line">
              <el-input placeholder="请输入验证码" v-model="verifyCode">
                <template slot="append">
                  <span>get verification Code</span>
                </template>
              </el-input>
            </div>
          </div>
          <el-button
            class="login-btn"
            type="danger"
            :disabled="disabled"
            :loading="loginLoading"
            @click="login"
            >Login</el-button
          >
          <p class="info">
            I.ve read and agreedto the <a href="/term">Terms of Use</a> and
            <a href="policy">Privacy policy</a>
          </p>
        </el-tab-pane>
        <el-tab-pane label="Account Login" name="account">
          <div class="con">
            <div class="line">
              <el-input placeholder="请输入内容" v-model="account"> </el-input>
            </div>
            <div class="line">
              <el-input placeholder="请输入密码" v-model="password"> </el-input>
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
            >Login</el-button
          >
          <p class="info">
            I.ve read and agreedto the <a href="/term">Terms of Use</a> and
            <a href="policy">Privacy policy</a>
          </p>
        </el-tab-pane>
      </el-tabs>
    </div>
    <ThirdLogin />
  </div>
</template>
<script>
import Cookies from 'js-cookie';
import Loading from '@/components/common/Loading';
import ThirdLogin from '@/components/thirdLogin';
export default {
  name: 'Login',
  components: {
    ThirdLogin,
  },
  data() {
    return {
      activeName: 'account',
      phone: '7529908827',
      areaCode: '+44',
      areaList: [],
      verifyCode: '',
      account: 'a11',
      password: 'qwe123',
      codeLoading: false,
      loginLoading: false,
      codeTimes: '', // 倒计时计数
      codeCount: 0,
      errorMsg: '',
      showPwd: false, // 是否显示密码明文
    };
  },
  created() {
    this.getArea();
  },
  methods: {
    changeTab() {
      this.errorMsg = '';
    },
    getArea() {
      this.$store.dispatch('ajax', {
        req: {
          method: 'post',
          url: '/web/country/list',
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
      this.codeTimes = 20;
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
    phoneInputFocus() {
      this.errorMsg = '';
    },
    login() {
      const that = this;
      this.loginLoading = true;
      this.$store.dispatch('ajax', {
        req: {
          method: 'post',
          url: `/sign/api/login`,
          data: {
            entry: 'sinbad',
            user: this.activeName == 'phone' ? this.areaCode + this.phone : this.account,
            pwd: this.password,
            type: this.activeName == 'phone' ? '1' : '2',
            code: String(this.verifyCode),
          },
        },
        onSuccess: res => {
          this.loginLoading = false;
          const uid = res.data.user.id;
          const replaceUrl = that.$route.query.redirect || '/';
          Cookies.set('uid', uid);
          Cookies.set('SUB', res.data.gsid);
          this.$router.push({ path: replaceUrl });
        },
        onFail: res => {
          if (res.error_code == 30070) {
            this.$message.error('You have no permission');
          } else {
            this.errorMsg = res.error;
          }
          this.loginLoading = false;
        },
      });
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
</style>
