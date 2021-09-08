<!--
 * @Author: jianbang
 * @Description: 话题item组件
-->
<template>
  <div class="com-topic-item flex-align">
    <p class="title text-overflow-1">
      {{ item.title }}
    </p>
    <span>{{ item.num }}Posts</span>
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
  &:hover {
    background-color: #f9f9fb;
    .title {
      color: #ff536c;
    }
  }
  .title {
    font-family: SFUIText-Regular;
    font-size: 16px;
    color: #333333;
    letter-spacing: 0;
    margin-bottom: 2px;
    width: 100%;
    text-align: left;
  }
  & > span {
    font-family: SFUIText-Regular;
    font-size: 12px;
    color: #777f8e;
    letter-spacing: 0;
  }
}
</style>
