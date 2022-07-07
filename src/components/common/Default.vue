<!--
  @author jianbang
  缺省页
 -->
<template>
  <div class="default">
    <template v-if="type === 'dark-1'">
      <img
        src="https://img.bee-cdn.com/large/3b9ae203lz1gsxmvmcom0j20e606c75m.jpg"
        class="default-img"
      />
      <p>无数据</p>
    </template>
    <template v-if="type === 1">
      <img
        src="https://img.bee-cdn.com/large/3b9ae203lz1gkggi9zo77j20hu08040d.jpg"
        class="default-img"
      />
      <p>无数据</p>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Default',
  props: {
    type: {
      type: [String, Number],
      default: 1,
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="less" scoped>
.default {
  text-align: center;
  .default-img {
    width: 170px;
    height: 76px;
  }
  p {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #666666;
  }
}
</style>
