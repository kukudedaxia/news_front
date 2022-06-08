<template>
  <div :class="{ bg: path != '/login' && path != '/' }">
    <div class="header com-header">
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
      <div class="menus" v-if="showMenu && tabs">
        <el-tabs :value="path" @tab-click="onTabClick" class="flip-over" ref="tabs">
          <template v-for="(item, index) in tabs">
            <el-tab-pane
              :key="index"
              :label="$t('nav_' + item.name)"
              :name="`/${item.name}`"
              class="flip-over"
              v-if="item.show"
            >
            </el-tab-pane>
          </template>
          <!-- <el-tab-pane :label="$t('nav2')" name="/live" class="flip-over"> </el-tab-pane> -->
        </el-tabs>
      </div>
      <div class="header-right">
        <router-link
          v-if="path && (path == '/' || path == '/login')"
          to="/publisher"
          class="menu-item create"
          >{{ $t('lives') }}</router-link
        >
        <!-- <router-link to="/" class="menu-item">{{ $t('home') }}</router-link> -->

        <span
          :class="['menu-item lang', { active: lang == 'ar' }]"
          @click="changeLanuage"
          title="language"
          >{{ $t('ar1') }}</span
        >
        <el-divider direction="vertical" class="devider"></el-divider>
        <span
          :class="['menu-item lang', { active: lang == 'en' }]"
          @click="changeLanuage"
          title="language"
          >{{ $t('en1') }}</span
        >

        <!-- <span class="lanuage" @click="changeLanuage" title="language">{{ $t(lang) }}</span> -->

        <span v-if="showMenu" class="menu-item logout" @click="logout">{{
          $t('login.logout')
        }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import Cookies from 'js-cookie';
import { loadLanguageAsync } from '@/utils/i18n';
import Bus from '@/utils/bus';

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
    tabs() {
      return this.$store.state.tab;
    },
    path() {
      return this.$route.path;
    },
    uid() {
      return this.$store.state.uid;
    },
    loginType() {
      return this.$store.state.loginType;
    },
    living() {
      return this.$store.state.live.living;
    },
    showMenu() {
      return (
        Object.keys(this.user).length > 0 &&
        this.path !== '/login' &&
        this.path !== '/' &&
        !this.$route.meta.hideMenu
      );
    },
  },
  watch: {
    lang() {
      if (this.$refs.tabs && this.$refs.tabs.$el) {
        this.renderTab(this.$refs.tabs.$el);
      }
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
      if (this.living) {
        this.$store.commit('live/setLeaveLivingDialog', true);
        Bus.$on('stopLive', () => {
          this.$store.commit('live/setLeaveLivingDialog', false);
        });
      } else {
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
      }
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
          Cookies.remove('uid');

          if (process.env.NODE_ENV === 'production') {
            Cookies.remove('SUB', {
              domain: process.env.VUE_APP_DOMAIN,
            });
          } else {
            Cookies.remove('SUB');
          }
          Cookies.remove('userInfo');
          Cookies.remove('tab');
          this.$store.commit('setUser', {});
          this.$store.commit('setTab', {});
          if (this.loginType == 'google') {
            this.signOutGoogle();
          }
          if (this.loginType == 'facebook') {
            this.signOutFaceBook();
          }
          window.localStorage.removeItem('wbUploader');
          window.location.href = window.location.origin;
          // this.$router.push('/');
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
    // new
    onTabClick(tab) {
      // console.log(tab);
      this.$router.push({ path: tab.name });
    },
    renderTab($el) {
      this.$nextTick(() => {
        const activeEl = $el.querySelector('.el-tabs__item.is-active');
        const lineEl = $el.querySelector('.el-tabs__active-bar');
        const style = getComputedStyle(activeEl);
        const pl = style.paddingLeft.match(/\d+/)[0] * 1;
        const pr = style.paddingRight.match(/\d+/)[0] * 1;
        const w = style.width.match(/\d+/)[0] * 1;
        lineEl.style.transform = 'translateX(' + (activeEl.offsetLeft + pl) + 'px)';
        lineEl.style.width = w - pl - pr + 'px';
      });
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

.menus {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .el-dialog__header {
    display: none;
  }
  .el-tabs__nav {
    direction: initial;
  }

  .el-tabs__header {
    padding-left: 20px;
    margin: 0;
    .el-tabs__nav-wrap::after {
      height: 0;
      // background: #000000;
      // border-radius: 10px 0 0 0;
      // height: 1px;
    }
    .el-tabs__item {
      font-size: 18px;
      color: #333333;
      height: 78px;
      line-height: 78px;
      padding: 0 30px;
    }
    .el-tabs__item.is-disabled {
      color: rgba(221, 221, 221, 0.2);
    }
    .el-tabs__item.is-active {
      font-weight: 700;
      color: var(--color-16);
    }
    .el-tabs__active-bar {
      height: 3px;
      // background-image: linear-gradient(90deg, #ff9e39 1%, #ff536c 100%);
      background: var(--color-1);
      border-radius: 2px;
    }

    &::after {
      content: '';
      width: 100%;
      // height: 1px;
      position: absolute;
      bottom: 0;
      left: 0;
      // background-color: #000000;
      // border-radius: 10px 0 0 0;
    }
  }
}
.dark .menus .el-tabs__header .el-tabs__item:not(.is-active) {
  color: #dddddd;
}
html[lang='ar'] {
  .menus {
    .el-tabs__item {
      transform: scaleX(-1) !important;
      padding: 0 30px !important;
    }
  }
}
</style>
<style lang="less">
.bg {
  background: #fff;
}
.dark .bg {
  background: transparent;
}
.header {
  display: flex;
  max-width: 1130px;
  justify-content: space-between;
  position: relative;
  // padding-top: 23px;
  // padding-bottom: 22px;
  // left: 0;
  // right: 0;
  z-index: 99;
  // top: 23px;
  margin: auto;
  align-items: center;
  height: 78px;
}
.header-icon {
  width: 40px;
  height: 40px;
  cursor: pointer;
}
.ar-logo-icon {
  background: url('http://localhost:8080/dev-assets/img/logo.39a47231.png') no-repeat;
  background-size: 100% 100%;
}
.logo-icon {
  background: url('http://localhost:8080/dev-assets/img/logo.39a47231.png') no-repeat;
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
  margin: 0 20px;
}
.header-right {
  display: flex;
  align-items: center;
  font-size: 14px;
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
  // margin-right: 20px;
  font-size: 16px;
  cursor: pointer;
}
.create {
  margin-right: 20px;
}
.lang {
  margin: 0 5px;
  color: #777f8e;
}
.lang.active {
  color: #333333;
}
.logout {
  margin-left: 40px;
}

html[lang='ar'] .logout {
  margin-right: 20px;
}

html[lang='ar'] .create {
  margin-left: 20px;
  margin-right: 0;
}
.devider {
  background-color: rgba(0, 0, 0, 0.6) !important;
}
</style>
