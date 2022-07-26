<template>
  <div class="sticky" id="sticky">
    <div class="wrap">
      <div class="top">
        <div class="bold" v-if="type == 'list'">文章 精选</div>
        <div class="bold" v-else>推荐阅读</div>
        <div class="refresh" v-if="type == 'list'" @click="() => getData('refresh')">
          <i class="el-icon-refresh" /><span>点击刷新</span>
        </div>
      </div>
      <div class="content">
        <template>
          <el-skeleton :loading="loading" animated :count="5">
            <template slot="template">
              <div class="skeleton-wrap">
                <div class="skeleton-desc">
                  <el-skeleton-item variant="p" style="width: 50%" />
                  <div>
                    <el-skeleton-item variant="text" />
                    <el-skeleton-item variant="text" style="width: 90%;" />
                  </div>
                </div>
                <el-skeleton-item variant="image" class="skeleton-img" />
              </div>
            </template>
            <template>
              <div v-for="(item, index) in list" :key="index" class="panel-wrap">
                <div class="panel" @click="() => goDetail(item)">
                  <div class="info">
                    <p class="title text-overflow-1">{{ item.title }}</p>
                    <p class="desc text-overflow-2">
                      {{
                        item.summary.length > 50
                          ? item.summary.substring(0, 50) + '...'
                          : item.summary
                      }}
                    </p>
                  </div>
                  <el-image
                    class="img"
                    src="https://cdn-news.jin10.com/bcb4a014-f94d-4362-aba1-02e23ef8ccef.jpg"
                    fit="cover"
                  ></el-image>
                </div>
                <div class="source">
                  <span v-if="item.author">{{
                    item.author.length > 18 ? item.author.substring(0, 18) + '...' : item.author
                  }}</span>
                  <span class="small">来源:{{ item.source }}</span>
                </div>
              </div>
            </template>
          </el-skeleton>

          <p class="tips" v-if="!loading">
            <i class="el-icon-bell" />{{ type == 'list' ? '刷新获取新文章' : '来自于智能推荐' }}
          </p>
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
    size: {
      type: Number,
      default: 10,
    },
  },
  data() {
    return {
      loading: false,
      list: [],
    };
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
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.loading = true;
      this.$store.dispatch('ajax', {
        req: {
          url: '/articles',
          params: {
            tagId: '',
            page: Math.ceil(Math.random() * 20),
            pageSize: this.size,
          },
        },
        onSuccess: res => {
          console.log(res);
          this.loading = false;
          this.list = res.data;
        },
        onComplete: () => {
          this.isFirstload = true;
        },
      });
    },
    goDetail(item) {
      this.$router.push({
        path: `/article/${item.id}`,
      });
    },
    checkBottom() {
      if (document.getElementById('sticky')) {
        const contentHeight = document.getElementById('sticky').offsetHeight + 200;
        const srcollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const clientHegiht = document.documentElement.clientHeight || document.body.offsetHeight;
        console.log(srcollTop, contentHeight, clientHegiht, '------------');
        if (srcollTop + clientHegiht >= contentHeight) {
          this.sticky = true;
          this.top = clientHegiht - contentHeight;
          document.getElementById('sticky').setAttribute('style', `top: ${this.top}px`);
        } else {
          this.sticky = false;
          document.getElementById('sticky').style = '';
        }
      }
    },
  },
};
</script>
<style lang="less" scoped>
.wrap {
  width: 300px;
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
  // background: #f8f9fa;
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
.panel-wrap {
  position: relative;
  padding-bottom: 10px;
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
  .panel {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 10px;
    cursor: pointer;
    &:hover {
      background: rgb(54 103 166/0.08);
    }
    .img {
      width: 60px;
      height: 60px;
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
      font-size: 15px;
    }
  }
  .source {
    font-size: 13px;
    color: #666;
    font-weight: bold;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    span {
      word-break: break-all;
    }
    .small {
      font-size: 12px;
      word-break: keep-all;
    }
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
// 骨架屏
.skeleton-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  .skeleton-desc {
    flex: 1;
  }
  .skeleton-img {
    width: 60px;
    height: 60px;
    margin-left: 10px;
  }
}

@media screen and (max-width: 960px) {
  .wrap {
    width: 100%;
  }
}
</style>
