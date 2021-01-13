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
  background: url('https://img.bee-cdn.com/large/3b9ae203lz1gmm2z2o377j209602rt8m.jpg') no-repeat;
  background-size: 100% 100%;
}
.logo-icon {
  background: url('https://img.bee-cdn.com/large/3b9ae203lz1gmm2xst0yhj209602r0sn.jpg') no-repeat;
  background-size: 100% 100%;
}

.lanuage {
  color: #fff;
  font-size: 12px;
  background: #333;
  border-radius: 12px;
  line-height: 22px;
  cursor: pointer;
  width: 36px;
  height: 22px;
  text-align: center;
  display: inline-block;
  vertical-align: middle;
  transform: scale(0.83);
  -webkit-text-size-adjust: none;
  -webkit-transform: scale(0.83, 0.83);
}
html[lang='ar'] .lanuage {
  line-height: 20px;
}
</style>
