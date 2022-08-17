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
        <span class="alpha">Alpha</span>
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
            <span class="menu-icon menu-icon-farm"></span>
            <span>指标监控</span>
          </div>
        </el-menu-item>
        <el-menu-item index="/news">
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
        <el-menu-item index="/example">
          <div class="menu-item" slot="title">
            <span class="menu-icon menu-icon-draw"></span>
            <span>使用示范</span>
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
        <div class="flex" @click="copy">
          <span class="icon wechat"></span>
          <span>: richyour001</span>
          <input
            id="copywechat"
            readonly
            type="text"
            value=""
            style="position: fixed; top: -20px; left: 0; opacity: 0; z-index: -10"
          />
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
    copy() {
      const inputElement = document.getElementById('copywechat');
      inputElement.value = 'richyour001';
      inputElement.select();
      document.execCommand('Copy');
      // navigator.clipboard.writeText(inputElement.value);
      this.$message({
        dangerouslyUseHTMLString: true,
        message: '<div class="copy-tip">复制微信号成功，请前往微信添加微好友</div>',
        type: 'success',
        duration: 1000,
        customClass: 'zui',
      });
    },
  },
};
</script>
<style lang="less">
.zui {
  z-index: 2500 !important;
}
.copy-tip {
  white-space: nowrap;
}
</style>
<style lang="less" scoped>
/deep/.el-menu {
  background: transparent;
  border-right: none;
}
.menu-item {
  // font-weight: bold;
}
.slide-logo {
  display: flex;
  align-items: center;
  line-height: 56px;
  height: 56px;
  padding: 0 10px;
  font-weight: bold;
  font-size: 20px;
  img {
    width: 80px;
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
    color: #3667a6;
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
.wechat {
  background: url('~@/assets/images/wechat1.png') no-repeat;
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
.alpha {
  font-size: 12px;
  /* display: inline-block; */
  padding: 2px 6px;
  /* background: red; */
  font-weight: lighter;
  line-height: 14px;
  background: linear-gradient(270deg, #2196f3 0%, #3f51b5 100%);
  color: #fff;
  border-radius: 4px;
  margin-left: 10px;
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
@media (max-width: 767px) {
}
@media (max-width: 992px) {
}
@media (max-width: 1200px) {
}
@media (min-width: 768px) {
}
</style>
