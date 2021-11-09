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
    <a v-if="access" :href="url"
      >Riyadh Online</a
    >
  </div>
</template>

<script>
import Cookies from 'js-cookie';
import Publisher from '@/components/publish/Publisher.vue';
import FeedTabs from '@/components/common/FeedTabs.vue';

export default {
  components: {
    Publisher,
    'feed-tabs': FeedTabs,
  },
  computed: {
    draftNums() {
      return this.$store.state.publisher.draftNums;
    },
    access() {
      return this.$store.state.access;
    },
    url() {
      return `http://m.whale.weibo.com/riyadh/blindDate?hideHeader=true&SUB=${Cookies.get('SUB')}`;
    },
  },
  data() {
    return {
      textarea: '',
    };
  },
  beforeRouteLeave(to, from, next) {
    // 当离开发布页时，需要弹窗提醒用户手动保存草稿
    // 如果草稿数两大于等于最大保存草稿数，则不会走保存接口
    if (this.draftNums < 200) {
      this.$refs.publisher.draftSaveNoTime();
    }
    next();
  },
};
</script>

<style lang="less" scoped>
.publisher {
  // padding: 20px auto;
}
</style>
