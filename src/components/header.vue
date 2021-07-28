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
      <span
        v-if="Object.keys(user).length > 0 && path == '/live'"
        class="menu-item"
        @click="logout"
        >{{ $t('login.logout') }}</span
      >
      <router-link v-if="path && path !== '/live'" to="/live" class="menu-item">{{
        $t('lives')
      }}</router-link>
      <router-link to="/" class="menu-item">{{ $t('home') }}</router-link>
      <!-- <div class="user" v-if="Object.keys(user).length > 0">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">{{ user.nickname }} </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="logout">{{ $t('login.logout') }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div> -->

      <span class="lanuage" @click="changeLanuage" title="language">{{ $t(lang) }}</span>
    </div>
  </div>
</template>
<script>
import Cookies from 'js-cookie';
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
    uid() {
      return this.$store.state.uid;
    },
    loginType() {
      return this.$store.state.loginType;
    },
  },
  watch: {
    // uid(v) {
    //   if (v) {
    //     this.$store.dispatch('getUser');
    //   } else {
    //     this.$store.commit('setUser', {});
    //   }
    // },
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
        const text = this.$t('signText');
        this.$confirm(`<strong>${text}</strong>`, this.$t('login.logout'), {
          confirmButtonText: this.$t('live.ok'),
          cancelButtonText: this.$t('live.cancel'),
          cancelButtonClass: 'cancel-btn',
          confirmButtonClass: 'confirm-btn',
          type: '',
          customClass: 'custom-message',
          dangerouslyUseHTMLString: true,
        })
          .then(() => {
            this.logout();
          })
          .catch(() => {});
      }
    },
    logout() {
      this.$alert(this.$t('signText'), '', {
        customClass: 'custom-messsage',
        confirmButtonText: this.$t('login.logout'),
        cancelButtonText: this.$t('live.cancel'),
        cancelButtonClass: 'cancel-btn',
        confirmButtonClass: 'confirm-btn',
        showCancelButton: true,
        callback: action => {
          if (action == 'confirm') {
            this.logouts();
          }
        },
      });
    },
    logouts() {
      this.$store.dispatch('ajax', {
        req: {
          method: 'post',
          url: `/sign/api/logout`,
          data: {
            entry: 'sinbad',
            sub: Cookies.get('SUB'),
          },
        },
        onSuccess: () => {
          Cookies.remove('userInfo');
          this.$store.commit('setUser', {});
          if (this.loginType == 'google') {
            this.signOutGoogle();
          }
          if (this.loginType == 'facebook') {
            this.signOutFaceBook();
          }
          this.$router.push('/');
        },
        onFail: res => {
          console.log(res);
        },
      });
    },
    signOutGoogle() {
      if (window.google) {
        window.google.accounts.id.cancel();
        window.google.accounts.id.disableAutoSelect();
        console.log('logoutgoogle');
      }
    },
    signOutFaceBook() {
      if (window.FB) {
        window.FB.logout(function(response) {
          console.log(response, 'logoutFacebook');
          // user is now logged out
        });
      }
    },
  },
};
</script>
<style lang="less">
.custom-message {
  vertical-align: inherit;
}
html[lang='ar'] .el-message-box__headerbtn {
  right: auto;
  left: 15px;
}
</style>
<style lang="less">
.header {
  display: flex;
  max-width: 1130px;
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
  color: #333333;
  text-decoration: none;
  margin-right: 20px;
}
</style>
