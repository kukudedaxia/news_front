<template>
  <div class="home">
    <div class="top">
      <swiper-box v-if="lang == 'en'" />
      <ar-swiper-box v-if="lang == 'ar'" />
    </div>
  </div>
</template>

<script>
import swiperBox from '@/components/swiperBox';
import arSwiperBox from '@/components/arSwiperBox';
export default {
  name: 'Home',
  components: {
    'swiper-box': swiperBox,
    'ar-swiper-box': arSwiperBox,
  },
  computed: {
    lang() {
      return this.$store.state.language;
    },
  },
};
</script>
<style lang="less" scoped>
.home {
  margin-top: -56px;
  min-width: 1068px;
}
</style>
