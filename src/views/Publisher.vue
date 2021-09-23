<!--
 * @Author: jianbang
 * @Description: 发布器页面
-->
<template>
  <div class="publisher">
    <!-- 发布器 -->
    <publisher ref="publisher"></publisher>
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
  beforeRouteLeave(to, from, next) {
    // 当离开发布页时，需要弹窗提醒用户手动保存草稿
    this.$refs.publisher.draftSave();
    next();
    // this.$confirm(this.$t('publisher.videoDialogTitle'), '', {
    //   confirmButtonText: this.$t('publisher.confirm'),
    //   cancelButtonText: this.$t('publisher.cancel'),
    // })
    //   .then(() => {
    //     this.$refs.publisher.draftSave();
    //     // next();
    //   })
    //   .catch(() => {});
    // ...todo
  },
};
</script>

<style lang="less" scoped>
.publisher {
  // padding: 20px auto;
}
</style>
