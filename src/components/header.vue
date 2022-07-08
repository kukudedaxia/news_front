<template>
  <div :class="{ bg: path != '/login' && path != '/' }">
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
      <div class="header-right">
        <el-menu
          :default-active="path"
          @select="index => links(index)"
          class="el-menu-demo"
          mode="horizontal"
          background-color="#fff"
          ref="child"
        >
          <el-menu-item index="/">快讯</el-menu-item>
          <el-menu-item index="/channel" @click="handleClick">定制频道</el-menu-item>
          <el-menu-item index="/about">关于我们</el-menu-item>
        </el-menu>
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
        this.$refs.child.activeIndex = '/';
        setTimeout(() => {
          window.open('https://manage.newsdao.finance/#/');
        }, 200);
      } else {
        this.$router.push({ path: index });
      }
    },
    handleClick() {
      console.log('1');
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
.header {
  display: flex;
  max-width: 1200px;
  position: relative;
  z-index: 99;
  // top: 23px;
  margin: auto;
  align-items: center;
  height: 60px;
}
.header-icon {
  width: 146px;
  height: 50px;
  cursor: pointer;
}
.logo-icon {
  background: url('https://img.bee-cdn.com/large/3b9ae203lz1h3xfkt29rvj20i8066weq.jpg') no-repeat;

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
  /deep/.el-menu.el-menu--horizontal {
    border-bottom: none;
  }
  /deep/.el-menu--horizontal > .el-menu-item.is-active {
    border-bottom: 3px solid #3667a6;
  }
}

.devider {
  background-color: rgba(0, 0, 0, 0.6) !important;
}
@media screen and (max-width: 760px) {
  .header {
    height: 56px;
    padding: 0 10px;
  }
  .logo-icon {
    height: 40px;
    width: 42px;
    background: url('https://img.bee-cdn.com/large/3b9ae203lz1h3xg5nzxnjj205k05kq3a.jpg') no-repeat;
    background-size: 100% 100%;
  }
  .header-right {
    margin-left: 20px;
    /deep/.el-menu-item {
      font-size: 16px;
      height: 56px;
      line-height: 56px;
      padding: 0 10px;
      margin: 0;
    }
  }
}
</style>
