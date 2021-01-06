<template>
  <div class="bottom">
    <div class="bottom-info">
      <span class="power">Powered by Weibo</span>
      <router-link to="/about">{{ $t('desc.about') }}</router-link>
      <router-link to="/concat">{{ $t('desc.concat') }}</router-link>
      <a>{{ $t('desc.community') }}</a>
      <a>{{ $t('desc.terms') }}</a>
      <a>{{ $t('desc.policy') }}</a>
    </div>
  </div>
</template>
<style lang="less" scoped>
.bottom {
  display: flex;
  justify-content: center;
}
.bottom-info {
  height: 100px;
  display: flex;
  width: 900px;
  justify-content: space-around;
  line-height: 100px;
  > a {
    font-family: SF-UI-Text-Regular;
    font-size: 12px;
    color: #333333;
    cursor: pointer;
    text-decoration: none;
  }
  a:hover {
    color: #00a1d6;
  }
  .power {
    margin-right: 200px;
    font-size: 12px;
    color: #999;
    cursor: default;
  }
}

html[lang='ar'] .power {
  margin-left: 200px;
  margin-right: 0;
}
</style>
