<!--
 * @Author: jianbang
 * @Description: 发布器页面
-->
<template>
  <div class="publisher">
    <!-- 发布器 -->
    <publisher></publisher>
    <!-- Feed流 - tab组件 -->
    <feed-tabs></feed-tabs>
  </div>
</template>

<script>
import Publisher from '@/components/publish/Publisher.vue';
import FeedTabs from '@/components/common/FeedTabs.vue';

export default {
  components: {
    Publisher,
    'feed-tabs': FeedTabs,
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
  // padding: 20px auto;
}
</style>
