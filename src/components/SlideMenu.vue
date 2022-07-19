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
    <el-menu :default-active="path" class="vertical-menu" router @select="closeMenu">
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
      <el-menu-item index="/about">
        <div class="menu-item" slot="title">
          <span class="menu-icon menu-icon-draw"></span>
          <span>关于我们</span>
        </div>
      </el-menu-item>
    </el-menu>
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
  },
};
</script>
<style lang="less" scoped>
/deep/.el-menu {
  background: transparent;
  border-right: none;
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
