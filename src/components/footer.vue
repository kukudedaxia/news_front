<template>
  <div class="bottom">
    <div class="bottom-info">
      <span class="power">{{ $t('desc.power') }}</span>
      <div class="bottom-link">
        <a href="/about" target="_blank">{{ $t('desc.about') }}</a>
        <a href="/concat" target="_blank">{{ $t('desc.concat') }}</a>
        <a href="/community" target="_blank">{{ $t('desc.community') }}</a>
        <a href="/terms" target="_blank">{{ $t('desc.terms') }}</a>
        <a href="/policy" target="_blank">{{ $t('desc.policy') }}</a>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.bottom {
  display: flex;
  justify-content: center;
}
.bottom-link {
  flex: 1;
  display: flex;
  justify-content: space-between;
}
.bottom-info {
  height: 100px;
  display: flex;
  width: 1130px;
  justify-content: space-around;
  line-height: 100px;
  a {
    font-family: SFUIText-Regular;
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
    margin-right: 247px;
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
