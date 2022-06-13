<template>
  <div id="app" :class="{ dark: $route.name === 'Live' }">
    <page-loading v-if="pageLoading"></page-loading>
    <div id="nav">
      <Header />
    </div>
    <div :class="['main', { homepage: path == '/' }]">
      <router-view v-wechat-title="$i18n.t($route.meta.title)" />
    </div>
    <Footer v-if="footerShow" />
  </div>
</template>

<script>
import Header from '@/components/header';
import Footer from '@/components/footer';
import PageLoading from '@/components/common/Loadings';

export default {
  name: 'APP',
  components: {
    Header,
    Footer,
    'page-loading': PageLoading,
  },
  computed: {
    pageLoading() {
      return this.$store.getters['route/getLoading'];
    },
    path() {
      return this.$route.path;
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
<style lang="less" scoped>
.main {
  border: 1px solid transparent;
  min-height: calc(100vh - 178px);
}
.homepage {
  background: rgba(255, 255, 255, 0.8);
}
</style>
