<!--
 * @Author: lenghui
 * @Description: 图片组件
-->
<template>
  <div style="flex: 1">
    <slot></slot>
    <ul class="auto-list">
      <li
        v-for="(item, index) of renderList"
        :key="index"
        :class="[
          autoClass,
          index % 3 == 2 ? 'right-box' : index % 3 == 0 ? 'left-box' : '',
          renderList.length - index <= 3 ? 'bottom-box' : '',
        ]"
      >
        <div :class="['blob-img-box']">
          <!-- <el-image
            :src="item"
            :key="index"
            :preview-src-list="renderList"
            lazy
            class="blob-img"
            fit="cover"
          ></el-image> -->
          <el-image
            class="hidden-sm-and-down blob-img"
            :src="item"
            :key="index"
            :preview-src-list="renderList"
            fit="cover"
            @click.stop="() => {}"
          ></el-image>
          <van-image
            class="hidden-md-and-up blob-img"
            fit="cover"
            :src="item"
            :key="'vant' + index"
            @click.stop="sceneImg(renderList, index)"
          />
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import i18n from '@/utils/i18n';
import Vue from 'vue';
import { ImagePreview } from 'vant';

Vue.use(ImagePreview);

export default {
  name: 'ImgBox',
  props: {
    images: Array,
  },
  data() {
    return {
      pitcureWindow: false,
      opacity: 0.001,
      current: -1,
      attr: {},
      imageList: [],
    };
  },
  computed: {
    // 自适应布局
    autoClass() {
      const length = this.images.length;
      let calssName = '';
      if (length === 1) {
        calssName = this.$route.name == 'status' ? 'auto-box-1' : 'auto-box-1';
      } else if (length === 2 || length === 4) {
        calssName = 'auto-box-2';
      } else {
        calssName = 'auto-box-3';
      }
      return calssName;
    },
    lang() {
      return i18n.locale;
    },
    clientHeight() {
      return window.innerHeight || document.documentElement.clientHeight;
    },
    renderList() {
      if (this.imageList.length > 12) {
        return this.imageList.slice(0, 12);
      }
      return this.imageList.slice(0, this.imageList.length);
    },
  },
  created() {
    this.imageList = JSON.parse(JSON.stringify(this.images));
  },
  mounted() {},
  methods: {
    sceneImg(images, index) {
      ImagePreview({
        images: images, //需要预览的图片 URL 数组
        showIndex: true, //是否显示页码
        loop: false, //是否开启循环播放
        startPosition: index, //图片预览起始位置索引
        closeable: true,
      });
    },
  },
};
</script>
<style lang="less" scoped>
.auto-list {
  margin-top: 10px;
  margin-top: 10px;
  background: #f2f6fc;
  li {
    display: inline-block;
    vertical-align: top;
    font-size: 0px;
  }
}

// 列表布局
.auto-box-1 {
  width: 100%;
  padding: 0;
}
.feed {
  width: 66.66%;
  padding: 0;
}
.auto-box-2 {
  width: 50%;
  padding: 0 3px 6px 3px;
}
.auto-box-3 {
  width: 33.33%;
  padding: 0 3px 6px 3px;
}
.bottom-box {
  padding-bottom: 0;
}
.blob-img-box {
  height: 0;
  position: relative;
  background-color: #e6e6e6;
  padding-bottom: 100%;
  display: inline-block;
  width: 100%;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent !important;
}
.blob-img {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50%;
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  vertical-align: top;
  z-index: 0;
}
</style>
