<template>
  <div class="page">
    <div class="page-left">
      <p :class="['page-title', 'text-right', `page-title-${index}`]">
        <template v-if="index == 1">
          <span data-swiper-parallax="-50">{{ $t('slide1.title') }}</span>
        </template>
        <template v-if="index == 2">
          <span data-swiper-parallax="-50">{{ $t('slide2.title') }}</span>
        </template>
        <template v-if="index == 3">
          <span data-swiper-parallax="-50">{{ $t('slide3.title') }}</span>
        </template>
        <template v-if="index == 4">
          <span data-swiper-parallax="-50">{{ $t('slide4.title') }}</span>
        </template>
        <template v-if="index == 5">
          <span data-swiper-parallax="-50">{{ $t('slide5.title') }}</span>
        </template>
        <template v-if="index == 6">
          <span data-swiper-parallax="-50">{{ $t('slide6.title') }}</span>
        </template>
        <template v-if="index == 7">
          <span data-swiper-parallax="-50">{{ $t('slide7.title') }}</span>
        </template>
      </p>
      <template>
        <p :class="['page-info', 'text-right', `page-info-${index}`]" data-swiper-parallax="-100">
          {{ $t(`slide${index}.info`) }}
        </p>
      </template>
      <div class="page-btngroup">
        <el-popover width="114" trigger="hover" placement="bottom" :close-delay="100">
          <img :src="lang == 'ar' ? code.ar : code.en" alt="code" class="code" loading="lazy" />
          <a
            class="page-btn apple"
            href="https://apps.apple.com/sa/app/beeto/id1532750093"
            target="_blank"
            @click="goApple"
            data-item="apple"
            slot="reference"
          >
          </a>
        </el-popover>
        <el-popover width="114" trigger="hover" placement="bottom" :close-delay="100">
          <img :src="lang == 'ar' ? code.ar : code.en" alt="code" class="code" loading="lazy" />
          <a
            class="page-btn google"
            href="https://play.google.com/store/apps/details?id=com.weo.beeto"
            target="_blank"
            @click="goApple"
            data-item="google"
            slot="reference"
          >
          </a>
        </el-popover>
        <el-popover width="114" trigger="hover" placement="bottom" :close-delay="100">
          <img :src="lang == 'ar' ? code.ar : code.en" alt="code" class="code" loading="lazy" />
          <a
            class="page-btn huawei"
            target=""
            @click="goDownload"
            id="huawei"
            data-item="huawei"
            slot="reference"
          >
          </a>
        </el-popover>
      </div>
    </div>
    <div>
      <div :class="['page-image', `web-phone-${index}`]"></div>
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
  data() {
    return {
      code: {
        ar:
          process.env.NODE_ENV == 'production'
            ? 'https://img.bee-cdn.com/large/3b9ae203lz1gmnd0s373nj2078078q2u.jpg'
            : 'https://img.bee-cdn.com/large/3b9ae203lz1gmm6bogjkxj203v03v741.jpg',
        en:
          process.env.NODE_ENV == 'production'
            ? 'https://img.bee-cdn.com/large/3b9ae203lz1gmnd1dw083j20780780sm.jpg'
            : 'https://img.bee-cdn.com/large/3b9ae203lz1gmm6b6zrwij203v03v3y9.jpg',
      },
    };
  },
  computed: {
    lang() {
      return this.$store.state.language;
    },
  },
  methods: {
    goApple() {
      this.$store.dispatch('send', { action: '5335' });
    },
    goDownload() {
      this.$store.dispatch('send', { action: '5335' });
      this.$store.dispatch('send', { action: '5336', wm: '90276_90001' });
      const form = document.createElement('form');
      form.method = 'get';
      form.setAttribute(
        'action',
        `https://static.bee-cdn.com/static-resource/apk/${window.$CONFIG.apkVersion}`,
      );
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    },
  },
};
</script>
<style lang="less">
.page {
  width: 1020px;
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  // margin-top: -67px;
}
.page-left {
  // margin-right: 30px;
  padding-left: 20px;
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
  font-family: Tahoma;
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
}
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

.apple {
  background: url('https://img.bee-cdn.com/large/3b9ae203lz1gmm1870y3oj209i036a9x.jpg') no-repeat;
  background-size: 100% 100%;
}
.google {
  background: url('https://img.bee-cdn.com/large/3b9ae203lz1gmm5aunitej20ao036q35.jpg') no-repeat;
  background-size: 100% 100%;
}
.huawei {
  background: url('https://img.bee-cdn.com/large/3b9ae203lz1gmm19pjt2zj20ai036dfq.jpg') no-repeat;
  background-size: 100% 100%;
}
// 手机图
.page-image {
  width: 388px;
  height: 632px;
  position: relative;
  // margin-top: 30px;
}
.web-phone-1 {
  background: url('https://img.bee-cdn.com/large/3b9ae203lz1h30uzas3c1j20wv1h742w.jpg') no-repeat; //webp720
  background-size: 100% 100%;
}
.web-phone-2 {
  background: url('https://img.bee-cdn.com/large/3b9ae203lz1h30uzr6at4j20wv1h845o.jpg') no-repeat;
  background-size: 100% 100%;
}
.web-phone-3 {
  background: url('https://img.bee-cdn.com/large/3b9ae203lz1h30uzxvw3nj20wv1h778p.jpg') no-repeat;
  background-size: 100% 100%;
}
.web-phone-4 {
  background: url('https://img.bee-cdn.com/large/3b9ae203lz1h30v06x41dj20wv1h8wge.jpg') no-repeat;
  background-size: 100% 100%;
}
.web-phone-5 {
  background: url('https://img.bee-cdn.com/large/3b9ae203lz1h30v0fq1zlj20wv1h7doa.jpg') no-repeat;
  background-size: 100% 100%;
}
.web-phone-6 {
  background: url('https://img.bee-cdn.com/large/3b9ae203lz1h30v0opvzvj20wv1h8470.jpg') no-repeat;
  background-size: 100% 100%;
}
.web-phone-7 {
  background: url('https://img.bee-cdn.com/large/3b9ae203lz1h30v0x3h3yj20wv1h70wx.jpg') no-repeat;
  background-size: 100% 100%;
}

// .web-phone-1 {
//   background: url('https://img.bee-cdn.com/large/3b9ae203lz1gmtyvh0cp8j20n0183gs5.jpg') no-repeat;
//   background-size: 100% 100%;
// }
// .web-phone-2 {
//   background: url('https://img.bee-cdn.com/large/3b9ae203lz1gmtyvyg0ryj20n0183wjr.jpg') no-repeat;
//   background-size: 100% 100%;
// }
// .web-phone-3 {
//   background: url('https://img.bee-cdn.com/large/3b9ae203lz1gmtyxafp5zj20n018379m.jpg') no-repeat;
//   background-size: 100% 100%;
// }
// .web-phone-4 {
//   background: url('https://img.bee-cdn.com/large/3b9ae203lz1gmtyxmngexj20n0183dmf.jpg') no-repeat;
//   background-size: 100% 100%;
// }
// .web-phone-5 {
//   background: url('https://img.bee-cdn.com/large/3b9ae203lz1gneyd8xce1j20n0183dhf.jpg') no-repeat;
//   background-size: 100% 100%;
// }
.code {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}

// 阿语特殊处理
html[lang='ar'] .page-btngroup {
  direction: ltr;
  justify-content: flex-end;
}
html[lang='ar'] .page-btn {
  margin-right: 0;
  margin-left: 22px;
}

html[lang='ar'] .web-phone-1 {
  // background: url('https://img.bee-cdn.com/large/3b9ae203lz1gmjuvc1xi5j207o0epgoi.jpg') no-repeat;
  background: url('https://img.bee-cdn.com/large/3b9ae203lz1h30wzsnwy7j20wv1h7dia.jpg') no-repeat;
  background-size: 100% 100%;
}
html[lang='ar'] .web-phone-2 {
  // background: url('https://img.bee-cdn.com/large/3b9ae203lz1gmjuvmfbndj207o0epadu.jpg') no-repeat;
  background: url('https://img.bee-cdn.com/large/3b9ae203lz1h30x035wfaj20wv1h7wji.jpg') no-repeat;
  background-size: 100% 100%;
}
html[lang='ar'] .web-phone-3 {
  // background: url('https://img.bee-cdn.com/large/3b9ae203lz1gmjuvz791xj207o0epada.jpg') no-repeat;
  background: url('https://img.bee-cdn.com/large/3b9ae203lz1h30x0iivhoj20wv1h778b.jpg') no-repeat;
  background-size: 100% 100%;
}
html[lang='ar'] .web-phone-4 {
  // background: url('https://img.bee-cdn.com/large/3b9ae203lz1gmjuw72at0j207o0epaau.jpg') no-repeat;
  background: url('https://img.bee-cdn.com/large/3b9ae203lz1h30x0tfzhej20wv1h741f.jpg') no-repeat;
  background-size: 100% 100%;
}
html[lang='ar'] .web-phone-5 {
  // background: url('https://img.bee-cdn.com/large/3b9ae203lz1gmjuw72at0j207o0epaau.jpg') no-repeat;
  background: url('https://img.bee-cdn.com/large/3b9ae203lz1h30x212oq8j20wv1h77d2.jpg') no-repeat;
  background-size: 100% 100%;
}
html[lang='ar'] .web-phone-6 {
  // background: url('https://img.bee-cdn.com/large/3b9ae203lz1gmjuw72at0j207o0epaau.jpg') no-repeat;
  background: url('https://img.bee-cdn.com/large/3b9ae203lz1h30x2gc76ej20wv1h7te2.jpg') no-repeat;
  background-size: 100% 100%;
}
html[lang='ar'] .web-phone-7 {
  // background: url('https://img.bee-cdn.com/large/3b9ae203lz1gmjuw72at0j207o0epaau.jpg') no-repeat;
  background: url('https://img.bee-cdn.com/large/3b9ae203lz1h30x2xrbanj20wv1h7n3o.jpg') no-repeat;
  background-size: 100% 100%;
}

@media screen and (max-width: 1440px) {
  .page {
    width: 900px;
    margin-top: -67px;
  }
  .page-image {
    zoom: 0.9;
  }
}
</style>
