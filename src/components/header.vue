<template>
  <div :class="{ bg: path != '/login' && path != '/' }">
    <div class="box">
      <div class="header com-header">
        <div
          :class="[
            'header-icon',
            {
              'logo-icon': lang !== 'ar',
            },
          ]"
          @click="goHome"
        ></div>
        <!-- <div class="header-right">
          <el-menu
            :default-active="path || ''"
            @select="index => links(index)"
            class="el-menu-demo"
            mode="horizontal"
            ref="child"
          >
            <el-menu-item index="/">快讯</el-menu-item>
            <el-menu-item index="/indicators">指标监控</el-menu-item>
            <el-menu-item index="/article">深度</el-menu-item>
            <el-menu-item index="/channel" @click="handleClick" class="hidden-md-and-down"
              >定制服务</el-menu-item
            >
          </el-menu>
        </div> -->
      </div>
      <div class="extras">
        <button class="collapse hidden-md-and-up">
          <template>
            <div
              class="collapse-icon collapse-icon-open"
              v-if="isCollapse == false"
              @click="change"
            ></div>
            <div class="collapse-icon collapse-icon-close" v-else @click="change"></div>
          </template>
        </button>
      </div>
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
    path() {
      const reg = new RegExp('(\\bdetail/\\b)', 'g');
      if (reg.test(this.$route.path)) {
        return '/';
      } else {
        return this.$route.path;
      }
    },
    isCollapse() {
      return this.$store.state.slideMenuShow;
    },
    uid() {
      return this.$store.state.uid;
    },
  },
  watch: {
    lang() {
      if (this.$refs.tabs && this.$refs.tabs.$el) {
        this.renderTab(this.$refs.tabs.$el);
      }
    },
    path() {
      if (this.path.includes('detail/')) {
        this.$refs.child.activeIndex = '/';
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
    // new
    links(index) {
      if (index == '/channel') {
        this.$refs.child.activeIndex = this.path;
        setTimeout(() => {
          window.open('https://bcaca.xyz/user-center');
        }, 200);
      } else {
        this.$router.push({ path: index });
      }
    },
    handleClick() {
      console.log('1');
    },
    // 侧边菜单
    change() {
      console.log(1);
      this.$store.commit('setKey', {
        key: 'slideMenuShow',
        val: !this.isCollapse,
      });
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

<style lang="less" scoped>
.bg {
  background: #fff;
}
.box {
  display: flex;
  align-items: center;
  max-width: 1200px;
  margin: auto;
  justify-content: space-between;
}
.header {
  display: flex;
  position: relative;
  z-index: 99;
  // top: 23px;
  align-items: center;
  height: 60px;
}
.extras {
  padding: 0 10px;
}
.header-icon {
  width: 146px;
  height: 50px;
  cursor: pointer;
}
.logo-icon {
  background: url('../assets/images/logo2.jpeg') no-repeat;

  background-size: 100% 100%;
}
.header-right {
  display: flex;
  align-items: center;
  margin-left: 20px;
  /deep/.el-menu-item {
    font-size: 20px;
    font-weight: bold;
    padding: 0;
    margin: 0 20px;
  }
  /deep/.el-menu--horizontal > .el-menu-item.is-active {
    border-bottom: 3px solid #3667a6;
  }
  // /deep/.el-menu.el-menu--horizontal {
  //   border-bottom: none;
  // }
  // /deep/.el-menu--horizontal > .el-menu-item.is-active {
  //   border-bottom: 3px solid #3667a6;
  //   background: #fff !important;
  // }
}
.collapse {
  background: none;
  border: none;
  padding: 0;
  line-height: 0;
  cursor: pointer;
  .collapse-icon {
    width: 26px;
    height: 26px;
    display: inline-block;
  }
  .collapse-icon-close {
    background: url('../assets/images/menu_open.png') no-repeat;
    background-size: 100% 100%;
  }
  .collapse-icon-open {
    background: url('../assets/images/menu_open.png') no-repeat;
    background-size: 100% 100%;
  }
}

.devider {
  background-color: rgba(0, 0, 0, 0.6) !important;
}
@media screen and (max-width: 992px) {
  .header {
    margin: 0;
  }
}
@media screen and (max-width: 760px) {
  .header {
    height: 56px;
    padding: 0 10px;
  }
  // .logo-icon {
  //   height: 40px;
  //   width: 42px;
  //   background: url('../assets/images/logo1.png') no-repeat;
  //   background-size: 100% 100%;
  // }
  .header-right {
    margin-left: 10px;
    /deep/.el-menu-item:first-child {
      margin-left: 12px;
    }
    /deep/.el-menu-item {
      font-size: 18px;
      height: 56px;
      line-height: 56px;
      padding: 0;
      margin-left: 0;
      margin-right: 20px;
    }
  }
}
</style>
