<!--
  @author jianbang
  缺省页
 -->
<template>
  <div class="default">
    <img
      src="https://img.bee-cdn.com/large/3b9ae203lz1gsxmvmcom0j20e606c75m.jpg"
      class="default-img"
    />
    <p>{{ $t('live.default') }}</p>
  </div>
</template>

<script>
export default {
  name: 'Default',
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
