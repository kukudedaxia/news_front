<template>
  <div class="slide-content">
    <div class="fix">
      <div class="slide-logo">
        <img :src="require('../assets/images/logo2.jpeg')" />
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
        <el-menu-item index="/indicators">
          <div class="menu-item" slot="title">
            <span class="menu-icon menu-icon-farm"></span>
            <span>指标监控</span>
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
      <p>web3搬运工 <br /><br />© 2022 BCACA.INC</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PcSlideMenu',
  data() {
    return {};
  },
  computed: {
    path() {
      return this.$store.state.toPage.path;
    },
  },
  created() {},
  methods: {
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
  margin-bottom: 10px;
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
      color: #4266a1;
      font-weight: bold;
    }
  }
}
.icon {
  width: 26px;
  height: 26px;
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
@media (max-width: 767px) {
}
@media (max-width: 992px) {
}
@media (max-width: 1200px) {
}
@media (min-width: 768px) {
}
</style>
