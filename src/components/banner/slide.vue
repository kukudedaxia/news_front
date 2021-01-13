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
        <el-popover width="114" trigger="hover" placement="bottom" :close-delay="100">
          <img
            src="https://img.bee-cdn.com/large/3b9ae203lz1gmcys74d08j2078078a9t.jpg"
            alt="code"
            class="code"
            loading="lazy"
          />
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
          <img
            src="https://img.bee-cdn.com/large/3b9ae203lz1gmcys74d08j2078078a9t.jpg"
            alt="code"
            class="code"
            loading="lazy"
          />
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
          <img
            src="https://img.bee-cdn.com/large/3b9ae203lz1gmcys74d08j2078078a9t.jpg"
            alt="code"
            class="code"
            loading="lazy"
          />
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
      <div :class="['page-image', `web-phone-${index}`]">
        <!-- <img
          v-if="index < 2"
          :src="lang == 'ar' ? imgList[index - 1].small_ar : imgList[index - 1].small"
          style="width:100%;height:100%;"
        />
        <img
          :src="lang == 'ar' ? imgList[index - 1].normal_ar : imgList[index - 1].normal"
          style="width:100%;height:100%;position:absolute;top:0px;left:0px;"
        /> -->
      </div>
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
      imgList: [
        {
          small: 'https://img.bee-cdn.com/webp720/3b9ae203lz1gmm520bk93j20n01837al.jpg',
          small_ar: 'https://img.bee-cdn.com/webp720/3b9ae203lz1gmm51gyqmzj20n0183jxf.jpg',
          normal: 'https://img.bee-cdn.com/large/3b9ae203lz1gmm2ii672fj20n01837al.jpg',
          normal_ar: 'https://img.bee-cdn.com/large/3b9ae203lz1gmm1n5dc2jj20n0183jxf.jpg',
        },
        {
          normal: 'https://img.bee-cdn.com/large/3b9ae203lz1gmm1q1bh2nj20n0183dky.jpg',
          normal_ar: 'https://img.bee-cdn.com/large/3b9ae203lz1gmm1okq2uhj20n018378w.jpg',
        },
        {
          normal: 'https://img.bee-cdn.com/large/3b9ae203lz1gmm1r6610cj20n018343l.jpg',
          normal_ar: 'https://img.bee-cdn.com/large/3b9ae203lz1gmm1ovuoi5j20n018379c.jpg',
        },
        {
          normal: 'https://img.bee-cdn.com/large/3b9ae203lz1gmm1qmszswj20n0183agd.jpg',
          normal_ar: 'https://img.bee-cdn.com/large/3b9ae203lz1gmm1q27eruj20n0183n3d.jpg',
        },
      ],
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
      this.$store.dispatch('send', { action: '5336', from: '90276_90001' });
      const form = document.createElement('form');
      form.method = 'get';
      form.setAttribute('action', 'https://static.bee-cdn.com/static-resource/apk/beeto.apk');
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    },
  },
};
</script>
<style lang="less">
.page {
  width: 900px;
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
  width: 276px;
  height: 530px;
  position: relative;
  // margin-top: 30px;
}
.web-phone-1 {
  background: url('https://img.bee-cdn.com/large/3b9ae203lz1gmm2ii672fj20n01837al.jpg') no-repeat;
  background-size: 100% 100%;
}
.web-phone-2 {
  background: url('https://img.bee-cdn.com/large/3b9ae203lz1gmm1q1bh2nj20n0183dky.jpg') no-repeat;
  background-size: 100% 100%;
}
.web-phone-3 {
  background: url('https://img.bee-cdn.com/large/3b9ae203lz1gmm1r6610cj20n018343l.jpg') no-repeat;
  background-size: 100% 100%;
}
.web-phone-4 {
  background: url('https://img.bee-cdn.com/large/3b9ae203lz1gmm1qmszswj20n0183agd.jpg') no-repeat;
  background-size: 100% 100%;
}
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
  background: url('https://img.bee-cdn.com/large/3b9ae203lz1gmm1n5dc2jj20n0183jxf.jpg') no-repeat;
  background-size: 100% 100%;
}
html[lang='ar'] .web-phone-2 {
  // background: url('https://img.bee-cdn.com/large/3b9ae203lz1gmjuvmfbndj207o0epadu.jpg') no-repeat;
  background: url('https://img.bee-cdn.com/large/3b9ae203lz1gmm1okq2uhj20n018378w.jpg') no-repeat;
  background-size: 100% 100%;
}
html[lang='ar'] .web-phone-3 {
  // background: url('https://img.bee-cdn.com/large/3b9ae203lz1gmjuvz791xj207o0epada.jpg') no-repeat;
  background: url('https://img.bee-cdn.com/large/3b9ae203lz1gmm1ovuoi5j20n018379c.jpg') no-repeat;
  background-size: 100% 100%;
}
html[lang='ar'] .web-phone-4 {
  // background: url('https://img.bee-cdn.com/large/3b9ae203lz1gmjuw72at0j207o0epaau.jpg') no-repeat;
  background: url('https://img.bee-cdn.com/large/3b9ae203lz1gmm1q27eruj20n0183n3d.jpg') no-repeat;
  background-size: 100% 100%;
}
</style>
