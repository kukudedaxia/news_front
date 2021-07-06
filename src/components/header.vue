<template>
  <div class="header">
    <div
      :class="[
        'header-icon',
        {
          'ar-logo-icon': lang == 'ar',
          'logo-icon': lang !== 'ar',
        },
      ]"
      @click="goHome"
    ></div>
    <div class="header-right">
      <router-link to="/login" class="menu-item">Live</router-link>
      <router-link to="/" class="menu-item">Home</router-link>
      <div class="user">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            用户名
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="logout">logout</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <span class="lanuage" @click="changeLanuage" title="language">{{ $t(lang) }}</span>
    </div>
  </div>
</template>
<script>
import { loadLanguageAsync } from '@/utils/i18n';
export default {
  name: 'Header',
  data() {
    return {
      theme: 'light',
    };
  },
  computed: {
    lang() {
      return this.$store.state.language;
    },
    user() {
      return this.$store.state.userInfo;
    },
    path() {
      return this.$store.state.toPage.path;
    },
  },
  methods: {
    changeLanuage() {
      this.lang == 'en'
        ? loadLanguageAsync('ar').then(() => {
            localStorage.setItem('lanuage', 'ar');
          })
        : loadLanguageAsync('en').then(() => {
            localStorage.setItem('lanuage', 'en');
          });
    },
    goHome() {
      this.$router.push({ name: 'Home' });
    },
    handleCommand(command) {
      this.logoutLoading = true;
      if (command == 'logout') {
        this.$message('用户退出登录 ' + command);
        this.$store.dispatch('ajax', {
          req: {
            method: 'post',
            url: `/sign/api/logout`,
            data: {
              entry: 'sinbad',
              uid: '12341234',
              sub: '23412341243',
            },
          },
          onSuccess: (res) => {
            console.log(res)
            this.logoutLoading = false;
          },
          onFail: res => {
            console.log(res);
            this.logoutLoading = false;
          },
        });
      }
    },
  },
};
</script>
<style lang="less">
.header {
  display: flex;
  max-width: 900px;
  justify-content: space-between;
  position: relative;
  padding-top: 23px;
  // left: 0;
  // right: 0;
  z-index: 99;
  // top: 23px;
  margin: auto;
}
.header-icon {
  width: 110px;
  height: 33px;
  cursor: pointer;
}
.ar-logo-icon {
  background: url('https://img.bee-cdn.com/large/3b9ae203lz1gmm2z2o377j209602rt8m.jpg') no-repeat;
  background-size: 100% 100%;
}
.logo-icon {
  background: url('https://img.bee-cdn.com/large/3b9ae203lz1gmm2xst0yhj209602r0sn.jpg') no-repeat;
  background-size: 100% 100%;
}

.lanuage {
  color: #fff;
  font-size: 12px;
  background: #333;
  border-radius: 12px;
  line-height: 22px;
  cursor: pointer;
  width: 36px;
  height: 22px;
  text-align: center;
  display: inline-block;
  vertical-align: middle;
  transform: scale(0.83);
  -webkit-text-size-adjust: none;
  -webkit-transform: scale(0.83, 0.83);
}
.header-right {
  display: flex;
}
.user {
  margin: 0 20px;
}
html[lang='ar'] .lanuage {
  line-height: 20px;
}
.menu-item {
  margin: 0 20px;
}
</style>
