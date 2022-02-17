<!--
 * @Author: lenghui
 * @Description: loading
-->
<template>
  <div class="wrap">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" class="svg">
      <g
        fill="none"
        stroke-width="5"
        stroke-miterlimit="10"
        :stroke="color"
        style="
          animation: 4s linear 0s infinite normal none running woo-spinner-_-rotate;
          height: 50px;
          transform-origin: center center;
          width: 50px;
        "
      >
        <circle cx="25" cy="25" r="20" opacity=".3"></circle>
        <circle
          cx="25"
          cy="25"
          r="20"
          stroke-dasharray="25,200"
          stroke-linecap="round"
          style="animation: 3s ease-in-out 0s infinite normal none running woo-spinner-_-dash"
        ></circle>
      </g>
    </svg>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    isComplete: { type: Boolean, default: false },
    isEmpty: { type: Boolean, default: false },
    color: {
      type: String,
      default: '#FF536C',
    },
  },
};
</script>

<style lang="less" scoped>
.wrap {
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  background: transparent;
}
.svg {
  width: 24px;
  height: 24px;
  padding: 0;
}
.text {
  margin-left: 6px;
  color: #777f8e;
  /* font-size: 12px; */
}
</style>
