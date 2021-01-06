<template>
  <swiper
    class="swiper"
    id="swiper"
    ref="mySwiper"
    :options="swiperOptions"
    :slides-per-view="3"
    :space-between="50"
    @swiper="onSwiper"
  >
    <swiper-slide class="slide slide-bg-1">
      <Slides index="1" />
    </swiper-slide>
    <swiper-slide class="slide slide-bg-2">
      <Slides index="2" />
    </swiper-slide>
    <swiper-slide class="slide slide-bg-3"> <Slides index="3"/></swiper-slide>
    <swiper-slide class="slide slide-bg-4"> <Slides index="4"/></swiper-slide>
    <div class="swiper-button-prev custom-prev" slot="button-prev"></div>
    <div class="swiper-button-next custom-next" slot="button-next"></div>
  </swiper>
</template>
<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import 'swiper/css/swiper.css';
import Slides from './banner/slide';

// Import Swiper styles
export default {
  name: 'Swipers',
  components: {
    Swiper,
    SwiperSlide,
    Slides,
  },
  data() {
    return {
      typed: '',
      swiperOptions: {
        speed: 1200,
        parallax: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        observeSlideChildren: true,
        loop: true,
        on: {
          transitionEnd: () => {
            if (this.swiper) {
              // console.log(this.swiper.activeIndex);
              const index = this.swiper.activeIndex;
              if (index == 0) {
                this.swiper.slideTo(4, 0);
              }
              if (index == 5) {
                this.swiper.slideTo(1, 0);
              }
            }
          },
        },
        // autoplay: {
        //   delay: 5000,
        //   disableOnInteraction: false,
        // },
      },
    };
  },

  mounted() {
    this.swiper = this.$refs.mySwiper.$swiper;
    // this.swiper.slideTo(1, 0, false);
  },
  methods: {
    onSwiper(swiper) {
      console.log(swiper);
    },
  },
};
</script>

<style lang="less" scoped>
.swiper {
  width: 100%;
}
.slide {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 980px;
}
.custom-prev,
.custom-next {
  color: #fff;
  outline: none;
  opacity: 0.6;
}
.custom-prev::after,
.custom-next::after {
  font-size: 30px;
}
.custom-prev {
  left: calc((100% - 1068px) / 2 - 30px);
}
.custom-next {
  right: calc((100% - 1068px) / 2 - 30px);
}
// 背景

.slide-bg-1 {
  background: url('../assets/images/bcakground_web_1.png') no-repeat;
  background-size: 100% 100%;
}
.slide-bg-2 {
  background: url('../assets/images/bcakground_web_2.png') no-repeat;
  background-size: 100% 100%;
}
.slide-bg-3 {
  background: url('../assets/images/bcakground_web_3.png') no-repeat;
  background-size: 100% 100%;
}
.slide-bg-4 {
  background: url('../assets/images/bcakground_web_4.png') no-repeat;
  background-size: 100% 100%;
}
</style>
