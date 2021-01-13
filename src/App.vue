<template>
  <div id="app">
    <div id="nav">
      <Header />
    </div>
    <router-view v-wechat-title="$i18n.t($route.meta.title)" />
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/header';
import Footer from '@/components/footer';

export default {
  name: 'APP',
  components: {
    Header,
    Footer,
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
