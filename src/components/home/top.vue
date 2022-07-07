<template>
  <div class="sticky" id="sticky">
    <div class="warp">
      <div class="top">
        <div class="bold" v-if="type == 'list'">文章 精选</div>
        <div class="bold" v-else>推荐阅读</div>
        <div class="refresh" v-if="type == 'list'">
          <i class="el-icon-refresh" /><span>点击刷新</span>
        </div>
      </div>
      <div class="content">
        <template v-if="type == 'list'">
          <div class="panel" v-for="(item, index) in 10" :key="index">
            <div class="info">
              <span class="title">全球经济复苏</span>
              <p class="desc text-overflow-4">
                地球佛塑科技发达饭撒地方拉萨地方了啊设计的疯狂拉升肌肤垃圾联发科三的肌肤轮廓啊手机发的卡拉斯京对方考虑啊是江东父老
              </p>
            </div>
            <el-image
              class="img"
              src="https://cdn-news.jin10.com/bcb4a014-f94d-4362-aba1-02e23ef8ccef.jpg"
              fit="cover"
            ></el-image>
          </div>
          <p class="tips">刷新获取新文章</p>
        </template>
        <template v-else>
          <div class="panel" v-for="(item, index) in 6" :key="index">
            <div class="info">
              <span class="title">还是看法胡椒粉</span>
              <p class="desc text-overflow-2">
                发誓绝对丽芳就阿斯利康的风景阿斯利康飞机阿莱克斯减肥啊开始减肥啦睡觉啊可是江东父老卡
              </p>
            </div>
            <el-image
              class="img"
              src="https://cdn-news.jin10.com/bcb4a014-f94d-4362-aba1-02e23ef8ccef.jpg"
              fit="cover"
            ></el-image>
          </div>
          <p class="tips">来自于智能推荐</p>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Top',
  props: {
    type: {
      type: String,
      default: 'list', //list 首页 detail 详情
    },
  },
  created() {
    const throttle = this.tools.throttle(this.checkBottom);
    this.listenFun = () => {
      throttle();
    };
    window.addEventListener('scroll', this.listenFun, false);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.listenFun);
  },
  methods: {
    checkBottom() {
      const contentHeight = document.getElementById('sticky').offsetHeight + 200;
      const srcollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const clientHegiht = document.documentElement.clientHeight || document.body.offsetHeight;
      console.log(srcollTop, contentHeight, clientHegiht, '------------');
      if (srcollTop + clientHegiht >= contentHeight) {
        console.log(1);
        this.sticky = true;
        this.top = clientHegiht - contentHeight;
        document.getElementById('sticky').setAttribute('style', `top: ${this.top}px`);
      } else {
        console.log(2);
        this.sticky = false;
        document.getElementById('sticky').style = '';
      }
    },
  },
};
</script>
<style lang="less" scoped>
.warp {
  width: 100%;
  background-color: #fff;
  height: 100%;
  overflow: scroll;
  border-radius: 4px;
  border: 1px solid #f2f2f2;
  padding-bottom: 20px;
}
.top {
  height: 40px;
  padding: 0 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  border-bottom: 1px solid #f9f9f9;
  .refresh {
    color: #939393;
    font-size: 13px;
    cursor: pointer;
    display: flex;
    > i {
      font-size: 18px;
      margin-right: 6px;
    }
    &:hover {
      color: #3667a6;
    }
  }
}
.content {
  background: #f8f9fa;
  margin: 0 10px;
}

.icon {
  display: inline-block;
  height: 20px;
  border-radius: 4px;
  line-height: 20px;
  text-align: center;
  font-size: 14px;
  width: 20px;
  transform: scale(0.8);
  color: #fff;
}
.panel {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  cursor: pointer;
  padding: 10px;
  position: relative;
  &::after {
    display: block;
    content: ' ';
    position: absolute;
    top: -50%;
    right: -50%;
    bottom: -50%;
    left: -50%;
    pointer-events: none;
    -webkit-transform: scale(0.5, 0.5);
    -ms-transform: scale(0.5, 0.5);
    transform: scale(0.5, 0.5);
    border-top: 1px solid #d3d3d3;
  }
  &:hover {
    background: #fafafa;
  }
  .img {
    width: 80px;
    height: 80px;
    border-radius: 6px;
    margin-left: 10px;
  }
  .info {
    flex: 1;
  }
  .desc {
    color: #666;
    font-size: 13px;
  }
  .title {
    font-weight: bold;
    margin-bottom: 6px;
    display: block;
    font-size: 15px;
  }
}
.tips {
  color: #999;
  font-size: 13px;
  text-align: center;
  padding: 10px 0;
}
.bold {
  font-weight: bold;
}
@media screen and (min-width: 1080px) {
  .content {
    background: #f8f9fa;
    margin: 0 20px;
  }
}
</style>
