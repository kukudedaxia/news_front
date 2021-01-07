<template>
  <div class="bottom">
    <div class="bottom-info">
      <span class="power">Powered by Weibo</span>
      <router-link to="/about"
        ><span>{{ $t('desc.about') }}</span></router-link
      >
      <router-link to="/concat"
        ><span>{{ $t('desc.concat') }}</span></router-link
      >
      <router-link to="/community"
        ><span>{{ $t('desc.community') }}</span></router-link
      >
      <router-link to="/terms"
        ><span>{{ $t('desc.terms') }}</span></router-link
      >
      <router-link to="/policy"
        ><span>{{ $t('desc.policy') }}</span></router-link
      >
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
    display: flex;
    align-items: center;
    line-height: 12px;
  }
  a:hover {
    color: #00a1d6;
  }
  .power {
    margin-right: 200px;
    font-size: 12px;
    color: #999;
    cursor: default;
    display: flex;
    align-items: center;
    line-height: 12px;
  }
}

html[lang='ar'] .power {
  margin-left: 200px;
  margin-right: 0;
}
</style>
