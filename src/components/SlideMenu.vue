<template>
  <van-popup
    class="slides"
    :value="show"
    position="right"
    get-container="body"
    overlay
    closeable
    @click-overlay="() => closeMenu()"
    @click-close-icon="() => closeMenu()"
  >
    <div class="slide-content">
      <div class="slide-logo">
        <img :src="require('../assets/images/logo1.jpg')" />
      </div>
      <el-menu
        :default-active="path"
        class="vertical-menu"
        router
        @select="index => links(index)"
        ref="child"
      >
        <el-menu-item index="/">
          <div class="menu-item" slot="title">
            <span class="menu-icon menu-icon-home"></span>
            <span>快讯</span>
          </div>
        </el-menu-item>
        <el-menu-item index="/article">
          <div class="menu-item" slot="title">
            <span class="menu-icon menu-icon-farm"></span>
            <span>深度</span>
          </div>
        </el-menu-item>
        <!-- <el-menu-item index="/channel">定制服务</el-menu-item> -->
        <el-menu-item index="/about">
          <div class="menu-item" slot="title">
            <span class="menu-icon menu-icon-draw"></span>
            <span>关于我们</span>
          </div>
        </el-menu-item>
      </el-menu>
      <el-divider></el-divider>
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
        <p>web3搬运工 <br /><br />© 2022 BCACA.INC</p>
      </div>
    </div>
  </van-popup>
</template>
<script>
export default {
  name: 'SlideMenu',
  data() {
    return {
      visable: false,
    };
  },
  computed: {
    show() {
      return this.$store.state.slideMenuShow;
    },
    path() {
      return this.$store.state.toPage.path;
    },
  },
  created() {},
  methods: {
    closeMenu() {
      this.$store.commit('setKey', { key: 'slideMenuShow', val: false });
    },
    links(index) {
      console.log(index);
      this.$store.commit('setKey', { key: 'slideMenuShow', val: false });
      if (index == '/channel') {
        this.$refs.child.activeIndex = this.path;
        setTimeout(() => {
          window.open('https://manage.newsdao.finance/#/');
        }, 200);
      } else {
        this.$router.push({ path: index });
      }
    },
  },
};
</script>
<style lang="less" scoped>
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
  img {
    width: 100px;
    margin-top: 15px;
    display: inline-flex;
  }
}
.vertical-menu {
  /deep/.el-menu-item {
    height: 48px;
    line-height: 48px;
  }
  /deep/.el-menu-item.is-active {
    background: rgba(15, 18, 23, 0.06);
    font-weight: bold;
  }
}
.icon {
  width: 20px;
  height: 20px;
  margin: 0 6px;
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
.bottom {
  position: absolute;
  bottom: 20px;
  width: 100%;
  .icons {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
  }
  p {
    text-align: center;
    color: #666;
    font-size: 13px;
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
