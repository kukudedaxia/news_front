<template>
  <div>
    <div class="tabs">
      <el-tabs v-model="activeName">
        <el-tab-pane label="Login With Phone" name="phone">
          <div class="con">
            <div class="line">
              <el-input placeholder="请输入内容" v-model="phone">
                <el-select v-model="areaCode" slot="prepend" placeholder="请选择" class="area-code">
                  <el-option :value="item.num" v-for="(item ,index) of areaList" :key="index"></el-option>
                </el-select>
              </el-input>
            </div>
            <div class="line">
              <el-input placeholder="请输入验证码" v-model="verifyCode">
                <template slot="append">
                  <span>get verification Code</span>
                </template>
              </el-input>
            </div>
          </div>
          <el-button class="login-btn" type="danger">Login</el-button>
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
          <el-button class="login-btn" type="danger">Login</el-button>
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
import ThirdLogin from '@/components/thirdLogin';
export default {
  name: 'Login',
  components: {
    ThirdLogin,
  },
  data() {
    return {
      activeName: 'phone',
      phone: '',
      areaCode: '+1',
      areaList: [],
      verifyCode: '',
      account: '',
      password: '',
    };
  },
  created() {
    this.getArea();
  },
  methods: {
    getArea() {
      this.$store.dispatch('ajax', {
        req: {
          method: 'post',
          url: '/web/country/list',
        },
        onSuccess: res => {
          this.areaList = res.data;
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
