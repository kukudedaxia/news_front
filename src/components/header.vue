<template>
  <div class="header">
    <div
      :class="[
        'header-icon',
        {
          'ar-logo-icon': lang == 'ar',
          'logo-icon': lang !== 'ar',
        },
      ]"
      @click="goHome"
    ></div>
    <div class="header-right">
      <span class="lanuage" @click="changeLanuage" title="language">{{ $t(lang) }}</span>
    </div>
  </div>
</template>
<script>
import { loadLanguageAsync } from '@/utils/i18n';
export default {
  name: 'Header',
  data() {
    return {
      theme: 'light',
    };
  },
  methods: {
    changeLanuage() {
      this.lang == 'en'
        ? loadLanguageAsync('ar').then(() => {
            localStorage.setItem('lanuage', 'ar');
          })
        : loadLanguageAsync('en').then(() => {
            localStorage.setItem('lanuage', 'en');
          });
    },
    goHome() {
      this.$router.push({ name: 'Home' });
    },
  },
  computed: {
    lang() {
      return this.$store.state.language;
    },
  },
};
</script>
<style lang="less">
.header {
  display: flex;
  max-width: 900px;
  justify-content: space-between;
  position: relative;
  padding-top: 23px;
  // left: 0;
  // right: 0;
  z-index: 99;
  // top: 23px;
  margin: auto;
}
.header-icon {
  width: 110px;
  height: 33px;
  cursor: pointer;
}
.ar-logo-icon {
  background: url('../assets/images/logo_arabic.png') no-repeat;
  background-size: 100% 100%;
}
.logo-icon {
  background: url('../assets/images/logo_english.png') no-repeat;
  background-size: 100% 100%;
}

.header-right {
  .lanuage {
    color: var(--text);
    color: #fff;
    font-size: 10px;
    padding: 3px 7px;
    background: #333333;
    border-radius: 9px;
    line-height: 33px;
    cursor: pointer;
  }
}
</style>
