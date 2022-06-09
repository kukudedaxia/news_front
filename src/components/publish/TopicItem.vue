<!--
 * @Author: jianbang
 * @Description: 话题item组件
-->
<template>
  <div class="com-topic-item flex-align">
    <p
      :class="[
        'title text-overflow-1',
        lang === 'en' ? 'pub-ltr pub-text_left' : 'pub-rtl pub-text_right',
      ]"
    >
      {{ item.desc1 }}
    </p>
    <span
      :class="
        tools.checkLan(item.desc1) === 'en' ? 'pub-ltr pub-text_left' : 'pub-rtl pub-text_right'
      "
      >{{ item.desc2 }}</span
    >
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    lang() {
      return this.$store.state.language;
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="less" scoped>
.com-topic-item {
  padding: 10px 19px;
  cursor: pointer;
  flex-direction: column;
  align-items: flex-start;
  transition: 0.3s;
  &:hover {
    background-color: #fff4b6;
  }
  .title {
    font-family: Tahoma;
    font-size: 16px;
    color: #333333;
    letter-spacing: 0;
    margin-bottom: 2px;
    width: 100%;
    text-align: left;
  }
  & > span {
    display: block;
    font-family: Tahoma;
    font-size: 12px;
    color: #777f8e;
    letter-spacing: 0;
  }
}
</style>
