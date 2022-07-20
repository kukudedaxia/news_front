<template>
  <div id="app" :class="{ dark: $route.name === 'Live' }">
    <page-loading v-if="pageLoading"></page-loading>
    <div :class="['nav', { nav1: path !== '/' }]">
      <Header v-if="footerShow" />
    </div>
    <div :class="['main', { homepage: path == '/' }]">
      <keep-alive>
        <router-view v-wechat-title="$i18n.t($route.meta.title)" v-if="$route.meta.keepAlive" />
      </keep-alive>
      <router-view
        v-wechat-title="$i18n.t($route.meta.title)"
        v-if="!$route.meta.keepAlive"
        :key="$route.fullPath"
      />
    </div>
    <template>
      <SlideMenu />
    </template>
    <Footer v-if="footerShow" />
    <!-- 返回顶部 -->
    <el-backtop :bottom="80" :right="clientWidth < 769 ? 20 : 100">
      <svg
        data-v-0b82b7b1=""
        width="20"
        height="20"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class=""
      >
        <path
          data-v-0b82b7b1=""
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M2.75 1C2.33579 1 2 1.33579 2 1.75C2 2.16421 2.33579 2.5 2.75 2.5H13.25C13.6642 2.5 14 2.16421 14 1.75C14 1.33579 13.6642 1 13.25 1H2.75ZM7.24407 3.87287C7.64284 3.41241 8.35716 3.41241 8.75593 3.87287L13.0622 8.84535C13.6231 9.49299 13.163 10.5 12.3063 10.5H10V14C10 14.5523 9.55228 15 9 15H7C6.44772 15 6 14.5523 6 14V10.5H3.69371C2.83696 10.5 2.37691 9.49299 2.93778 8.84535L7.24407 3.87287Z"
          fill="#8A919F"
        ></path>
      </svg>
    </el-backtop>
    <!-- 微信长图tip弹窗 -->
    <van-overlay :show="show" class="overlay" @click="closeOverlay">
      <img :src="require('./assets/svg/tip.svg')" />
    </van-overlay>
    <!-- 生成长图 -->
    <Generate :show="picture.state" :data="picture.data" />
  </div>
</template>

<script>
import Generate from '@/components/generate.vue';
import Header from '@/components/header';
import Footer from '@/components/footer';
import PageLoading from '@/components/common/Loadings';
import SlideMenu from '@/components/SlideMenu';

import Vue from 'vue';
import { Popup } from 'vant';

Vue.use(Popup);

export default {
  name: 'APP',
  components: {
    Header,
    Footer,
    Generate,
    'page-loading': PageLoading,
    SlideMenu,
  },
  computed: {
    pageLoading() {
      return this.$store.getters['route/getLoading'];
    },
    path() {
      return this.$route.path;
    },
    clientWidth() {
      return document.body.clientWidth;
    },
    show() {
      return this.$store.state.vant_overlay;
    },
    picture() {
      return this.$store.state.vant_overlay1;
    },
    show1() {
      return this.$store.state.slideMenuShow;
    },
  },
  data() {
    return {
      footerShow: false,
    };
  },
  created() {
    this.$router.onReady(() => {
      this.footerShow = true;
    });
    // this.$notify({
    //   title: '自定义位置',
    //   message: '左下角弹出的消息',
    //   position: 'bottom-left',
    //   duration: 0,
    // });
  },
  methods: {
    closeOverlay() {
      this.$store.dispatch('changeOverlay', false);
    },
    closeMenu() {
      console.log(111);
      this.$store.commit('setKey', { key: 'slideMenuShow', val: false });
    },
  },
  // beforeRouteEnter(to, from, next) {
  //   // 不能直接获取组件实例 `this`，需通过vm访问组件实例;
  //   next(vm => {
  //     // 通过vm访问组件实例;
  //   });
  // },
  // beforeRouteUpdate(to, from, next) {
  //   // 可以访问this
  //   this.name = to.params.id; // 可以获取路由参数
  //   next();
  // },
  // beforeRouteLeave(to, from, next) {
  //   const answer = window.confirm('Do you really want to leave? you have unsaved changes!');
  //   if (answer) {
  //     next();
  //   } else {
  //     next(false); // 可通过此方法取消导航
  //   }
  // },
};
</script>
<style lang="less">
.overlay {
  z-index: 999 !important;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.8);
  .info {
    color: #409eff;
    font-size: 16px;
    p {
      margin-bottom: 10px;
    }
  }
}
</style>
<style lang="less" scoped>
.main {
  border: 1px solid transparent;
  background: #f4f5f5;
  min-height: calc(100vh - 158px);
  // margin-top: 30px;
  max-width: 1020px;
  margin: 30px auto 0;
}
.nav {
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  // position: -webkit-sticky;
  // position: sticky;
  top: 0px;
  z-index: 200;
}
.back {
  font-size: 30px;
  font-weight: bold;
}
/deep/.el-backtop {
  z-index: 101;
}
.slides {
  height: 100%;
  min-width: 200px;
}
@media (max-width: 992px) {
  .nav1 {
    position: sticky;
    top: 0;
  }
}
@media screen and (max-width: 760px) {
  .main {
    margin-top: 0;
    border: none;
  }
}
</style>
