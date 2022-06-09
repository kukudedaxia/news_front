<template>
  <div class="bottom com-footer">
    <div class="bottom-info">
      <!-- <span class="power">{{ $t('desc.power') }}</span> -->
      <div class="bottom-link">
        <a href="/about" target="_blank">{{ $t('desc.about') }}</a>
        <a href="/newsroom" target="_blank">{{ $t('newsroom') }}</a>
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
  background: rgba(255, 255, 255, 0.8);
}
.bottom-link {
  display: grid;
  grid-template-columns: repeat(6, auto);
  grid-column-gap: 55px;
}
.bottom-info {
  height: 100px;
  display: flex;
  width: 1200px;
  justify-content: space-around;
  line-height: 100px;
  a {
    font-size: 12px;
    color: var(--color-16);
    cursor: pointer;
    text-decoration: none;
    display: flex;
    align-items: center;
    line-height: 14px;
  }
  a:hover {
    color: #346aa7;
  }
}

html[lang='ar'] .power {
  margin-left: 200px;
  margin-right: 0;
}
@media screen and (max-width: 760px) {
  .bottom-info .power {
    display: none;
  }
}
</style>
