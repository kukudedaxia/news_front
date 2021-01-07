<template>
  <div class="section-nav" :style="{ maxWidth: maxWidth + 'px' }">
    <ul class="section-nav-container">
      <li v-for="(item, index) in list" :key="index" @click="changeActive(index)">
        <a :href="item.link" :class="{ active: index == active }">{{ item.name }}</a>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'Section',
  props: {
    list: {
      type: Array,
      default() {
        return [
          {
            name: 'sssss',
            link: '#sens',
          },
        ];
      },
    },
  },
  data() {
    return {
      maxWidth: 0,
      active: -1,
      itemOffsetTop: [],
    };
  },
  mounted() {
    this.resize();
    window.addEventListener('resize', this.resize);
    window.addEventListener('scroll', this.onScroll);
    this.$nextTick(() => {
      this.list.forEach(val => {
        const item = document.getElementById(val.link.substring(1));
        this.itemOffsetTop.push({
          key: val.link,
          num: item.offsetTop,
          height: item.clientHeight,
        });
      });
    });
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('scroll', this.onScroll);
  },
  methods: {
    resize() {
      // 内容宽度为900 40是多余出来的边距
      const width = window.innerWidth - 940;
      if (width > 0) {
        this.maxWidth = Math.floor(width / 2);
      }
    },
    changeActive(index) {
      this.active = index;
      window.removeEventListener('scroll', this.onScroll);
      this.animationScrollTo(document.documentElement, this.itemOffsetTop[index].num - 80);
    },
    onScroll() {
      const scrollTop = document.documentElement.scrollTop;
      this.itemOffsetTop.forEach((val, index) => {
        if (scrollTop > val.num && scrollTop - val.num > val.height - 80) {
          if (index == this.itemOffsetTop.length - 1) {
            this.active = index;
          } else {
            this.active = index + 1;
          }
        } else if (scrollTop < this.itemOffsetTop[0].height / 2) {
          this.active = 0;
        }
      });
    },
    animationScrollTo(el, to) {
      let scrollY = 0;
      const beginY = el.scrollTop;
      const raf = window.requestAnimationFrame || (func => setTimeout(func, 10));
      const moveFn = () => {
        // 往上滑动
        if (beginY - to < 0) {
          scrollY += (to - beginY) / 10;
          if (scrollY <= to - beginY) {
            el.scrollTop = beginY + scrollY;
            raf(moveFn);
          } else {
            el.scrollTop = to;
            document.addEventListener('scroll', this.onScroll);
          }
        } else if (beginY - to > 0) {
          scrollY += (beginY - to) / 10;
          if (scrollY <= beginY - to) {
            el.scrollTop = beginY - scrollY;
            raf(moveFn);
          } else {
            el.scrollTop = to;
            document.addEventListener('scroll', this.onScroll);
          }
        }
      };
      raf(moveFn);
    },
  },
};
</script>
<style lang="less" scoped>
body {
  height: auto !important;
}

.section-nav {
  position: fixed;
  z-index: 4;
  top: 50%;
  left: 0;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  margin-top: 64px;
  padding-top: 30px;
  margin-bottom: -64px;
  padding-bottom: 64px;
  overflow: hidden;
  -webkit-transition: width 0.2s ease-out;
  -o-transition: width 0.2s ease-out;
  transition: width 0.2s ease-out;
  border-radius: 0 4px 4px 0;
  min-width: 210px;
}

@media screen and (max-width: 1640px) {
  .section-nav {
    min-width: 250px;
  }
}
@media screen and (max-width: 1440px) {
  .section-nav {
    min-width: 170px;
  }
}
@media screen and (max-width: 1280px) {
  .section-nav {
    min-width: 100px;
  }
}
@media screen and (max-width: 1140px) {
  .section-nav {
    display: none !important;
  }
}

.section-nav-container {
  position: relative;
  list-style-position: inside;
  list-style-type: none;
  -webkit-overflow-scrolling: touch;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  padding: 0 10px 30px 12px;
  border-radius: 5px;
  display: block;
  z-index: auto;
  -webkit-transition: opacity 0.2s ease-in;
  -o-transition: opacity 0.2s ease-in;
  transition: opacity 0.2s ease-in;
}
li {
  height: 22px;
  line-height: 22px;
  margin-bottom: 6px;
  overflow: hidden;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
  white-space: nowrap;
  a {
    font-size: 18px;
    color: #646a73;
    text-decoration: none;
  }
  a:hover {
    color: #3370ff;
  }
  a.active {
    color: #3370ff;
  }
}
</style>
