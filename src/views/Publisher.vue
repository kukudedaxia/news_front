<!--
 * @Author: jianbang
 * @Description: 发布器页面
-->
<template>
  <div class="publisher">
    <Publisher></Publisher>
  </div>
</template>

<script>
import Publisher from '@/components/publish/Publisher.vue';
export default {
  components: {
    Publisher,
  },
  data() {
    return {
      textarea: '',
    };
  },
};
</script>

<style lang="less" scoped>
.publisher {
  padding: 20px auto;
}
</style>
