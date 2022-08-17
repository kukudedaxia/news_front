<!--
 * @Author: lenghui
 * @Description: 生成图片
-->

<template>
  <van-overlay :show="show" z-index="1000" @click="closeOverlay">
    <div class="model">
      <div class="top-tips">请长按图片保存，将本条快讯推荐给好友</div>
      <!-- <img class="picture" src="snapshot" alt="" /> -->
      <van-image class="picture" :src="data.snapshot || ''" :show-loading="loading">
        <template v-slot:loading>
          <van-loading type="spinner" size="20" />
          <span>加载中...</span>
        </template>
        <template v-slot:error><div class="failed">加载失败</div></template>
      </van-image>
    </div>
  </van-overlay>
</template>
<script>
export default {
  name: 'Generate',
  props: {
    show: Boolean,
    data: Object,
  },
  data() {
    return {
      loading: true, //图片loading
    };
  },
  created() {
    // this.loading = true
  },
  watch: {
    show(val) {
      if (val == true) {
        this.loading = true;
      }
    },
  },
  methods: {
    closeOverlay() {
      this.loading = false;
      this.$store.dispatch('changeOverlay1', {
        state: false,
        data: this.data,
      });
    },
  },
};
</script>
<style lang="less" scoped>
.top-tips {
  background: #2196f3;
  font-size: 15px;
  text-align: center;
  padding: 10px 0 16px;
  color: #fff;
}
.picture {
  width: auto;
  max-width: 300px;
  height: 100%;
  margin: 50px auto;
  display: block;
}
.failed {
  margin-top: 200px;
}
</style>
