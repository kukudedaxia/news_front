<template>
  <div class="articles">
    <div class="top">
      <ul>
        <div v-for="(item, index) in types" :key="index" class="type-box">
          <li @click="change(item)">
            <a :class="{ active: item.id == type }">{{ item.name }}</a>
          </li>
          <el-divider direction="vertical" v-if="index < types.length - 1"></el-divider>
        </div>
      </ul>
      <el-input
        popper-class="my-autocomplete"
        v-model="keywords"
        placeholder="请输入内容"
        :trigger-on-focus="false"
        class="serach"
        size="medium"
        type="search"
        @change="Search"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
        <template slot-scope="{ item }">
          <div class="name">{{ item.value }}</div>
        </template>
      </el-input>
    </div>

    <scroll
      :loading="loading"
      :finished="nextPage == -1"
      :length="list.length"
      @load="getData"
      :immediateCheck="false"
      :loadingCon="false"
      :maxLength="false"
    >
      <template v-slot:content v-if="list.length > 0">
        <div class="box">
          <div
            class="article"
            v-for="(item, index) in list"
            :key="index"
            @click="() => goDetail(item)"
          >
            <div class="meta">
              <div class="flex">
                <div class="author">{{ item.author || '' }}</div>
                <el-divider v-if="item.author" direction="vertical"></el-divider>
                <div>{{ moment(item.ctime).format('YYYY/MM/DD HH:MM') }}</div>
              </div>
              <el-divider v-if="item.tags" direction="vertical" class="divider"></el-divider>
              <div class="tags" v-if="item.tags">
                <a class="tag" v-for="(tag, oindex) in item.tags.data.slice(0, 2)" :key="oindex">{{
                  tag.name
                }}</a>
                <a class="tag" v-if="item.tags.data.length > 2">+More</a>
              </div>
            </div>
            <div class="content">
              <div class="content-left">
                <div class="title" v-if="item.title_zh">{{ item.title_zh }}</div>

                <div class="title">{{ item.title }}</div>
                <div class="desc">
                  <article
                    class="markdown-body hidden-sm-and-down text-overflow-4"
                    @click="() => goDetail(item)"
                  >
                    <div v-html="item.summary" />
                  </article>
                  <article class="markdown-body  hidden-md-and-up" @click="() => goDetail(item)">
                    <div class="text-overflow-1" v-html="item.summary" />
                  </article>
                </div>
                <div class="action">
                  <span><i class="el-icon-view" />{{ item.view_count }}</span>
                </div>
              </div>
              <!-- <div class="content-right" v-if="item.img">
                <img :src="item.images[0]" />
              </div> -->
            </div>
          </div>
        </div>
      </template>
    </scroll>
    <!-- 骨架屏 -->

    <el-skeleton :loading="loading" animated :count="5" v-if="loading">
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
    </el-skeleton>

    <template v-if="list.length < 1 && isFirstload">
      <el-empty class="no-data" description="暂无数据"></el-empty>
    </template>
  </div>
</template>
<script>
import 'github-markdown-css/github-markdown-light.css';
import scroll from '../components/scroll';
export default {
  name: 'Article',
  components: {
    scroll,
  },
  data() {
    return {
      types: [
        {
          name: '推荐',
          id: 1,
        },
        {
          name: '全部',
          id: 0,
        },
      ],
      type: 1,
      isFirstload: false,
      loading: false,
      currentpage: 1,
      nextPage: 1,
      list: [],
      scrollTop: 0,
      keywords: '', //搜索相关
    };
  },
  created() {
    this.getData();
  },
  methods: {
    change(item) {
      this.type = item.id;
      this.list = [];
      this.currentpage = 1;
      this.getData();
    },
    init() {
      this.type = 1;
      this.list = [];
      this.currentpage = 1;
      this.nextPage = 1;
      this.getData();
    },
    getData() {
      this.loading = true;
      this.$store.dispatch('ajax', {
        req: {
          url: '/articles',
          params: {
            tagId: '',
            page: this.currentpage,
            pageSize: 10,
            is_recommand: this.type,
            keywords: this.keywords,
          },
        },
        onSuccess: res => {
          console.log(res);
          this.loading = false;
          this.list = this.list.concat(res.data);
          this.currentpage += 1;
          if (res.meta.pagination.current_page >= res.meta.pagination.total_pages) {
            this.nextPage = -1;
          }
        },
        onComplete: () => {
          this.isFirstload = true;
        },
      });
    },
    goDetail(item) {
      // this.$router.push({
      //   path: `/article/${item.id}`,
      // });
      window._czc && window._czc.push(['_trackEvent', '页面文章', '点击跳转', item.id, 5143]);
      const link = this.$router.resolve({ path: `/article/${item.id}` });
      window.open(link.href, '_blank');
    },

    // 搜索
    // querySearch(queryString, cb) {},
    Search() {
      this.list = [];
      this.currentpage = 1;
      this.getData();
    },
    createStateFilter(queryString) {
      return state => {
        return state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
      };
    },
  },
  activated() {
    console.log('进入前', this.scrollTop);
    if (this.$route.meta.refresh) {
      this.scrollTop = 0;
      this.init();
    }
    this.$nextTick(() => {
      document.documentElement.scrollTop = this.scrollTop;
    });
  },
  beforeRouteLeave(to, from, next) {
    console.log(to, from, next, 'beforeRouteLeave');
    console.log(document.documentElement.scrollTop, '离开前');
    this.scrollTop = document.documentElement.scrollTop;
    next();
    // ...
  },
  // beforeRouteEnter(to, from, next) {
  //   console.log(to, from, next, 'beforeRouteEnter');
  //   if (from.name && from.name.includes('ArticleDetail')) {
  //     console.log('不刷新');
  //     to.meta.refresh = false;
  //     next();
  //   } else {
  //     // 其他页面进来需要刷新
  //     console.log('刷新');
  //     to.meta.refresh = true;
  //     next();
  //   }
  // },
};
</script>
<style lang="less" scoped>
.articles {
  min-height: calc(100vh - 100px);
  background: var(--fill-1);
  border-radius: 4px;
  // border: 1px solid #e7eaf2;
  max-width: 980px;
  margin: 0 auto;
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-right: 1px solid hsla(0, 0%, 53%, 0.2);
}
.skeleton-wrap {
  padding: 20px;
  /deep/.el-skeleton__item {
    height: 18px;
    line-height: 18px;
    margin-bottom: 6px;
  }
}
.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid hsla(0, 0%, 59.2%, 0.1);
  ul {
    display: flex;
    align-items: center;
    padding: 20px 12px;
    font-size: 16px;
  }
  .type-box {
    display: flex;
    align-items: center;
  }
  li {
    padding: 0 10px;
  }
  a {
    text-decoration: none;
    cursor: pointer;
    color: #909090;
    &:hover {
      color: #4266a1;
    }
  }
  a.active {
    color: #4266a1;
  }
}
.serach {
  margin-right: 20px;
  max-width: 200px;
  /deep/.el-input__inner {
    border-radius: 10px;
    border: 1px solid #4465a1;
  }
  /deep/.el-input__icon {
    color: #4465a1;
    font-weight: bold;
  }
}

.box {
  padding: 0 20px 20px;
  .article {
    cursor: pointer;
    &:hover {
      background: #fafafa;
      .markdown-body {
        background: #fafafa;
      }
    }
    /deep/img {
      width: 100px;
      height: 80px;
      object-fit: cover;
      border-radius: 6px;
    }
  }
  .markdown-body:hover {
    background: #fafafa;
  }
}
.meta {
  display: flex;
  align-items: center;
  color: #86909c;
  font-size: 13px;
  line-height: 22px;
  padding-top: 12px;
  .author {
    color: #4e5969;
    font-weight: bold;
  }
}
.content {
  display: flex;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e6eb;
  margin-top: 10px;
  width: 100%;
  align-items: center;
  .title {
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    color: #1d2129;
    width: 100%;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    margin-bottom: 8px;
  }
  .desc {
    color: #86909c;
    font-size: 14px;
    line-height: 22px;
    word-break: break-word;
  }
  .action {
    position: relative;
    font-size: 13px;
    line-height: 20px;
    color: #4e5969;
    flex-shrink: 0;
    margin-top: 10px;
    i {
      margin-right: 4px;
    }
  }
}
.content-left {
  flex-grow: 1;
}
.content-right {
  margin: 0 24px;
  img {
    width: 120px;
    height: 80px;
    border-radius: 4px;
    object-fit: cover;
  }
}
.tag {
  position: relative;
  flex-shrink: 0;
  font-size: 13px;
  line-height: 22px;
  padding: 0 8px;
  color: #86909c;
  display: inline-flex;
  align-items: center;
  border: 1px solid #4465a1;
  border-radius: 10px;
  color: #4465a1;
  margin-right: 10px;
  &:not(:last-child):after {
    position: absolute;
    right: -7px;
    display: block;
    content: ' ';
    width: 2px;
    height: 2px;
    border-radius: 50%;
    background: #4e5969;
  }
}
.flex {
  display: flex;
  align-items: center;
}
@media only screen and (max-width: 1199px) {
  .hidden-md-and-down1 {
    display: none !important;
  }
}
@media only screen and (max-width: 992) {
  .hidden-md-and-down1 {
    display: none !important;
  }
}
@media (max-width: 767px) {
  .article {
    /deep/img {
      display: none;
    }
  }
  .markdown-body p {
    margin-bottom: 0;
  }
  /deep/.markdown-body:hover {
    background: #fafafa;
  }
}
@media (max-width: 992px) {
  .desc {
    // display: -webkit-box;
    // overflow: hidden;
    // text-overflow: ellipsis;
    // -webkit-box-orient: vertical;
    // -webkit-line-clamp: 1;
  }
  .text-overflow-1 {
    height: 24px;
  }
  .content-right {
    margin-right: 0;
  }
  .meta {
    flex-direction: column;
    align-items: flex-start;
  }
  .divider {
    display: none;
  }
  .tags {
    padding-top: 8px;
  }
  .articles {
    margin-bottom: 10px;
  }
  /deep/.el-input--medium .el-input__inner {
    height: 40px;
    line-height: 40px;
  }
  .tag {
    margin-top: 5px;
  }
}
@media (max-width: 1200px) {
}
@media (min-width: 768px) {
}
</style>
<style lang="less">
@media (max-width: 767px) {
  .markdown-body p {
    margin-bottom: 0;
  }
}
</style>
