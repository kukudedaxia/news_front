<template>
  <div class="page">
    <div class="page-left">
      <p :class="['page-title', 'text-right', `page-title-${index}`]">
        <template v-if="index == 1">
          <span data-swiper-parallax="-100">{{ $t('slide1.beeto') }}</span>
          <span data-swiper-parallax="-200">{{ $t('slide1.born') }}</span>
          <span data-swiper-parallax="-300">{{ $t('slide1.for') }}</span>
        </template>
        <template v-if="index == 2">
          <span data-swiper-parallax="-100">{{ $t('slide2.borowse') }}</span>
          <span data-swiper-parallax="-300">{{ $t('slide2.express') }}</span>
        </template>
        <template v-if="index == 3">
          <span data-swiper-parallax="-100">{{ $t('slide3.beet') }}</span>
          <span data-swiper-parallax="-300">{{ $t('slide3.meet') }}</span>
        </template>
        <template v-if="index == 4">
          <span data-swiper-parallax="-100">{{ $t('slide4.be') }}</span>
          <span data-swiper-parallax="-200">{{ $t('slide4.gift') }}</span>
          <span data-swiper-parallax="-300">{{ $t('slide4.features') }}</span>
        </template>
      </p>
      <template>
        <p :class="['page-info', 'text-right', `page-info-${index}`]">
          {{ $t(`slide${index}.info`) }}
        </p>
      </template>
      <div class="page-btngroup">
        <el-popover width="114" trigger="hover" :close-delay="100">
          <img
            src="https://img.bee-cdn.com/large/3b9ae203lz1gmcys74d08j2078078a9t.jpg"
            alt="code"
            class="code"
            loading="lazy"
          />
          <a class="page-btn apple" data-item="apple" slot="reference" @click="goApple"></a>
        </el-popover>
        <el-popover width="114" trigger="hover" :close-delay="100">
          <img
            src="https://img.bee-cdn.com/large/3b9ae203lz1gmcys74d08j2078078a9t.jpg"
            alt="code"
            class="code"
            loading="lazy"
          />
          <div class="page-btn google" data-item="google" slot="reference"></div>
        </el-popover>
        <el-popover width="114" trigger="hover" :close-delay="100">
          <img
            src="https://img.bee-cdn.com/large/3b9ae203lz1gmcys74d08j2078078a9t.jpg"
            alt="code"
            class="code"
            loading="lazy"
          />
          <div class="page-btn huawei" id="huawei" data-item="huawei" slot="reference"></div>
        </el-popover>
      </div>
    </div>
    <div>
      <div :class="['page-image', `web-phone-${index}`]" />
    </div>
  </div>
</template>
<script>
// import { on } from '../../utils/dom';
export default {
  name: 'Slide',
  props: {
    index: [String, Number],
  },
  methods: {
    goApple() {
      console.log('苹果' + this.index);
    },
  },
};
</script>
<style lang="less">
.page {
  width: 902px;
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -67px;
}
.page-left {
  // margin-right: 30px;
  flex: 1;
}
.page-title {
  text-align: left;
  font-family: SF-UI-Text-Heavy;
  font-size: 48px;
  color: #333333;
  letter-spacing: -1px;
  line-height: 60px;
  margin: 0;
  margin-bottom: 20px;

  > span {
    display: block;
  }
}
.page-title-1 {
  margin-bottom: 26px;
}
.page-title-2,
.page-title-3 {
  margin-top: 30px;
  margin-bottom: 42px;
}
.page-title-4 {
  margin-bottom: 36px;
}

.page-info {
  font-family: SF-UI-Text-Regular;
  font-size: 14px;
  color: #333333;
  letter-spacing: 0;
  line-height: 24px;
  white-space: pre-line;
  margin-bottom: 39px;
  width: 513px;
  text-align: left;
}
.page-info-2,
.page-info-3,
.page-info-4 {
  margin-bottom: 53px;
}

.page-btngroup {
  display: flex;
  .page-btn {
    width: 114px;
    height: 38px;
    margin-right: 22px;
    cursor: pointer;
    display: block;
  }
  .page-btn:hover {
    opacity: 0.8;
  }
}

.apple {
  background: url('../../assets/images/apple.png') no-repeat;
  background-size: 100% 100%;
}
.google {
  background: url('../../assets/images/google.png') no-repeat;
  background-size: 100% 100%;
}
.huawei {
  background: url('../../assets/images/huawei.png') no-repeat;
  background-size: 100% 100%;
}
// 手机图
.page-image {
  width: 276px;
  height: 530px;
  // margin-top: 30px;
}
.web-phone-1 {
  background: url('../../assets/images/web_phone_english_1.png') no-repeat;
  background-size: 100% 100%;
}
.web-phone-2 {
  background: url('../../assets/images/web_phone_english_2.png') no-repeat;
  background-size: 100% 100%;
}
.web-phone-3 {
  background: url('../../assets/images/web_phone_english_3.png') no-repeat;
  background-size: 100% 100%;
}
.web-phone-4 {
  background: url('../../assets/images/web_phone_english_4.png') no-repeat;
  background-size: 100% 100%;
}
.code {
  width: 100%;
  height: 100%;
}

.apple::before {
  content: '/';
}
// 阿语特殊处理
html[lang='ar'] .page-btngroup {
  direction: ltr;
  justify-content: flex-end;
}
html[lang='ar'] .web-phone-1 {
  background: url('../../assets/images/web_phone_1.png') no-repeat;
  background-size: 100% 100%;
}
html[lang='ar'] .web-phone-2 {
  background: url('../../assets/images/web_phone_2.png') no-repeat;
  background-size: 100% 100%;
}
html[lang='ar'] .web-phone-3 {
  background: url('../../assets/images/web_phone_3.png') no-repeat;
  background-size: 100% 100%;
}
html[lang='ar'] .web-phone-4 {
  background: url('../../assets/images/web_phone_4.png') no-repeat;
  background-size: 100% 100%;
}
</style>
