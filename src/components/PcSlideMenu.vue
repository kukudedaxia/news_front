<template>
  <div class="slide-content">
    <div class="fix">
      <div class="slide-logo">
        <img :src="require('../assets/images/logo2.jpeg')" />
        <span class="alpha">Alpha</span>
      </div>
      <el-divider class="divider"></el-divider>
      <el-menu
        :default-active="path"
        class="vertical-menu"
        router
        @select="index => links(index)"
        ref="child"
      >
        <el-menu-item index="/">
          <div class="menu-item" slot="title">
            <img class="menu-icon" :src="require('../assets/svg/5.svg')" />

            <span>监控</span>
          </div>
        </el-menu-item>
        <el-menu-item index="/news">
          <div class="menu-item" slot="title">
            <img class="menu-icon" :src="require('../assets/images/menu_4.png')" />
            <span>快讯</span>
          </div>
        </el-menu-item>
        <el-menu-item index="/article">
          <div class="menu-item" slot="title">
            <img class="menu-icon" :src="require('../assets/svg/2.svg')" />

            <span>深度</span>
          </div>
        </el-menu-item>

        <el-menu-item index="/about">
          <div class="menu-item" slot="title">
            <img class="menu-icon" :src="require('../assets/svg/3.svg')" />

            <span>关于我们</span>
          </div>
        </el-menu-item>
        <el-menu-item index="/example">
          <div class="menu-item" slot="title">
            <img class="menu-icon" :src="require('../assets/svg/6.svg')" />
            <span>工具详情</span>
          </div>
        </el-menu-item>
      </el-menu>
      <el-divider class="divider"></el-divider>
    </div>
    <div class="bottom">
      <div class="icons">
        <a href="https://twitter.com/TheNewsDao" target="_blank" alt="twitter"
          ><div class="icon twitter"></div
        ></a>
        <a href="https://discord.gg/qQEwJAPQ" target="_blank" alt="twitter">
          <div class="icon discord"></div>
        </a>
        <a href="https://t.me/news_dao" target="_blank" alt="twitter">
          <div class="icon telegram"></div>
        </a>
      </div>
      <div>
        <el-popover trigger="hover" placement="top" :close-delay="100" ref="popoverRef">
          <div class="flex" slot="reference">
            <span class="icon wechat"></span>
            <span>: richyour001</span>
          </div>
          <div class="code-box">
            <img class="code" :src="require('../assets/images/qrcode.jpg')" />
          </div>
        </el-popover>
      </div>
      <p>web3搬运工 <br />© 2022 BCACA.INC</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PcSlideMenu',
  data() {
    return {
      pc: true,
    };
  },
  computed: {
    path() {
      return this.$store.state.toPage.path;
    },
  },
  created() {
    if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
      this.pc = false;
      // 移动端操作
    } else {
      this.pc = true;
      // PC端操作
    }
  },
  methods: {
    links(index) {
      console.log(index);
      this.$store.commit('setKey', { key: 'slideMenuShow', val: false });
      if (index == '/channel') {
        this.$refs.child.activeIndex = this.path;
        window._czc.push(['_trackEvent', '页面', '跳转后台', this.path, 5151]);
        setTimeout(() => {
          window.open('https://bcaca.xyz/user-center/');
        }, 200);
      } else {
        this.$router.push({ path: index });
      }
    },
  },
};
</script>
<style lang="less" scoped>
.slide-content {
  position: fixed;
  height: calc(100vh);
  display: flex;
  flex-direction: column;
  border-right: 1px solid hsla(0, 0%, 53%, 0.2);
  background: #fff;
  justify-content: space-between;
  width: 280px;
}
/deep/.el-menu {
  background: transparent;
  border-right: none;
}
.menu-item {
  // font-weight: bold;
}
.slide-logo {
  line-height: 56px;
  height: 56px;
  padding: 0 10px;
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: flex-end;
  img {
    width: 130px;
    margin-top: 10px;
    display: inline-flex;
  }
}
.vertical-menu {
  /deep/.el-menu-item {
    height: 48px;
    line-height: 48px;
    font-size: 17px;
    padding-left: 10px;
    margin-bottom: 6px;
    .menu-item {
      padding-left: 10px;
      &:hover {
        background: #f6f6f6;
        border-radius: 6px;
        color: #4266a1;
        font-weight: bold;
      }
    }
    &:hover {
      background: none;
    }
  }
  /deep/.el-menu-item.is-active {
    background: none;
    .menu-item {
      background: #f6f6f6;
      border-radius: 6px;
      color: #000;
      font-weight: bold;
    }
  }
}
.icon {
  width: 20px;
  height: 20px;
  margin: 0 10px;
}
.twitter {
  background: url('~@/assets/images/twitter.png') no-repeat;
  background-size: 100% 100%;
}
.discord {
  background: url('~@/assets/images/discord.png') no-repeat;
  background-size: 100% 100%;
}
.telegram {
  background: url('~@/assets/images/telegram.png') no-repeat;
  background-size: 100% 100%;
}
.wechat {
  background: url('~@/assets/images/wechat1.png') no-repeat;
  background-size: 100% 100%;
}
.bottom {
  position: relative;
  bottom: 20px;
  width: 100%;
  margin-top: 30px;
  .icons {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
  }
  p {
    text-align: center;
    color: #666;
    font-size: 14px;
  }
}
.divider {
  width: 80%;
  margin: 24px auto;
}
.menu-icon {
  width: 20px;
  height: 20px;
  display: inline-block;
  margin-right: 10px;
}
.menu-icon-1 {
  background: url('~@/assets/images/menu_1.png') no-repeat;
  background-size: 100% 100%;
}
.menu-icon-2 {
  background: url('~@/assets/images/menu_2.png') no-repeat;
  background-size: 100% 100%;
}
.menu-icon-3 {
  background: url('~@/assets/images/menu_3.png') no-repeat;
  background-size: 100% 100%;
}
.menu-icon-4 {
  background: url('~@/assets/images/menu_4.png') no-repeat;
  background-size: 100% 100%;
}
.alpha {
  font-size: 14px;
  /* display: inline-block; */
  padding: 2px 6px;
  /* background: red; */
  font-weight: lighter;
  line-height: 14px;
  background: linear-gradient(270deg, #2196f3 0%, #3f51b5 100%);
  color: #fff;
  border-radius: 4px;
  margin-left: 10px;
  margin-bottom: 4px;
}
.flex {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  span {
    display: inline-block;
    margin-right: 2px;
  }
}
.code-box {
  width: 160px;
  .code {
    width: 100%;
  }
}
@media (max-width: 767px) {
}
@media (max-width: 992px) {
}
@media (max-width: 1200px) {
}
@media (min-width: 768px) {
}
</style>
