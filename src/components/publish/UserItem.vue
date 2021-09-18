<!--
 * @Author: jianbang
 * @Description: 用户item组件
-->
<template>
  <div class="com-user-item flex-align">
    <img :src="item.avatar_hd" />
    <div class="info flex-align">
      <p class="text-overflow-1">{{ item.nickname }}</p>
      <span> @{{ item.username }} </span>
    </div>
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
.com-user-item {
  padding: 10px 19px;
  cursor: pointer;
  &:hover {
    background-color: #f9f9fb;
    .info > p {
      color: #ff536c;
    }
  }
  & > img {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 50%;
  }
  .info {
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    margin-left: 10px;
    flex: 1;
    & > p {
      font-family: SFUIText-Regular;
      font-size: 16px;
      color: #333333;
      letter-spacing: 0;
      line-height: 20px;
      margin-bottom: 3px;
      width: 135px;
      text-align: left;
    }
    & > span {
      font-family: SFUIText-Regular;
      font-size: 12px;
      color: #777f8e;
      letter-spacing: 0;
    }
  }
}
</style>
