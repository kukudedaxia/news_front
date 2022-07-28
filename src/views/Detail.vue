<template>
  <div class="wrap">
    <div class="left">
      <template v-if="load">
        <div class="content no-border articles" v-if="name == 'ArticleDetail'">
          <div class="top">
            <h2>{{ article.title }}</h2>
            <div class="meta">
              <span class="author">{{ article.author }}</span>
              <span class="time">{{ article.ctime }}</span>
            </div>
            <div class="tags">
              <el-tag
                :class="['tag']"
                v-for="(item, index) in article.tags.data"
                size="small"
                :key="index"
                >{{ item.name }}</el-tag
              >
            </div>
          </div>
          <article class="markdown-body">
            <hr class="hr" />
            <div v-html="article.summary" />
          </article>
          <article class="markdown-body">
            <hr class="hr" />
            <div v-html="article.content" />
          </article>
          <div class="extra">
            <a class="link" :href="article.link" target="_blank"
              ><i class="el-icon-link"></i>原文链接</a
            >
          </div>
        </div>
        <div class="content no-border" v-else>
          <!-- <div class="pos-title">详情</div> -->
          <div class="title">
            <div class="time">
              <i class="el-icon-time" />
              <span>{{ moment(object.ctime).format('YYYY/MM/DD HH:MM:SS') }}</span>
            </div>
            <div class="type" v-if="channelName">
              <el-tag class="tag">{{ channelName }}</el-tag>
            </div>
            <div class="flexs">
              <div class="line">
                <span class="bold">来源:</span>
                <span>{{ object.source }}</span>
              </div>
              <div class="line">
                <span class="bold">作者:</span>
                <span>{{ object.author || object.author_text }}</span>
              </div>
            </div>
          </div>
          <div class="article">
            <template>
              <div>
                <template v-if="object.raw_message_zh">
                  <p class="font-18">
                    <span class="bold">[译文]&nbsp;</span>{{ object.raw_message_zh }}
                  </p>
                  <br />
                </template>
                <p :class="[{ gray: object.raw_message_zh, 'font-18': !object.raw_message_zh }]">
                  <span class="bold">[原文]&nbsp;</span>{{ object.raw_message }}
                </p>
              </div>
              <div
                :class="[
                  'img-wrap',
                  {
                    'img-wrap-0': object.images.length == 1,
                  },
                ]"
                v-if="object.images && object.images.length > 0"
              >
                <ImgBox :images="object.images" />
              </div>
              <div class="extra">
                <a class="link" :href="object.link" target="_blank"
                  ><i class="el-icon-link"></i>原文链接</a
                >
                <Share
                  :link="object.qrcode"
                  :data="object"
                  :channelName="channelName"
                  type="detail"
                />
              </div>
            </template>
          </div>
        </div>
        <div class="more no-border" v-if="object.self_threads && object.self_threads.length > 0">
          <div class="pos-title">延展</div>
          <div class="timeline">
            <el-timeline class="times">
              <el-timeline-item
                v-for="(item, index) in object.self_threads"
                :key="index"
                :timestamp="moment(item.ctime).format('HH:mm YYYY/MM/DD')"
                placement="top"
                class="item"
              >
                <div class="con">
                  <template v-if="item.raw_message_zh">
                    <p class="font-18">
                      <span class="bold">[译文] &nbsp;</span>{{ item.raw_message_zh }}
                    </p>
                    <br />
                  </template>
                  <p class="gray"><span class="bold">[原文]&nbsp;</span>{{ item.raw_message }}</p>
                </div>
                <div
                  :class="[
                    'img-wrap',
                    {
                      'nested-0': item.images.length == 1,
                      'nested-1': item.images.length > 1,
                    },
                  ]"
                  v-if="item.images && item.images.length > 0"
                >
                  <ImgBox :images="item.images" />
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
        <div class="tip"></div>
      </template>

      <div class="load-wrap" v-else>
        <loading>
          <span class="loading-text no-flip-over">加载中...</span>
        </loading>
      </div>
    </div>
    <div class="right no-border sticky" v-if="load">
      <Top :type="name" :size="5" :tags="article.tags ? article.tags.data : []" />
    </div>
  </div>
</template>
<script>
import 'github-markdown-css';
import Loading from '@/components/common/Loading';
import Share from '../components/share';
import ImgBox from '@/components/ImgBox';
import Top from '@/components/common/top';
export default {
  name: 'Detail',
  components: {
    Top,
    Share,
    ImgBox,
    Loading,
  },
  data() {
    return {
      load: false,
      object: {},
      article: {},
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    name() {
      return this.$route.name;
    },
    channelName() {
      return unescape(this.$route.query.channel || '');
    },
  },
  created() {
    console.log(this.name);
    if (this.name == 'ArticleDetail') {
      this.initArticle();
    } else {
      this.init();
    }
  },
  methods: {
    init() {
      this.$store.dispatch('ajax', {
        req: {
          url: `lives/${this.id}`,
        },
        onSuccess: res => {
          console.log(res);
          this.object = res.data;
        },
        onComplete: () => {
          this.load = true;
        },
      });
    },
    initArticle() {
      this.$store.dispatch('ajax', {
        req: {
          url: `articles/${this.id}`,
        },
        onSuccess: res => {
          console.log(res);
          this.article = res.data;
        },
        onComplete: () => {
          this.load = true;
        },
      });
    },
  },
};
</script>
<style lang="less">
.markdown-body {
  box-sizing: border-box;
  min-width: 200px;
  max-width: 980px;
  margin: 0 auto;
  padding: 25px;
  .hr {
    border-bottom: 1px solid #ddd;
  }
}

@media (max-width: 767px) {
  .markdown-body {
    padding: 15px;
  }
}
</style>
<style lang="less" scoped>
.wrap {
  display: flex;
  -webkit-box-flex: 1;
  -ms-flex-positive: 1;
  flex-grow: 1;
  .left {
    width: 100%;
    min-height: 300px;
  }
  .right {
    // width: 300px;
    background: transparent;
    margin-left: 20px;
  }
  /deep/.el-timeline-item__tail {
    border-left: 2px dotted #d9d9d9;
  }
}
.content {
  background: #fff;
  border-radius: 4px;
  border: 1px solid #e7eaf2;
  // min-height: calc(100vh - 200px);
  padding: 18px;
  margin-bottom: 40px;
}
.more {
  background: #fff;
  border-radius: 4px;
  border: 1px solid #e7eaf2;
  padding: 18px;
  margin: 30px 0 40px 0;
}
.pos-title {
  display: flex;
  font-size: 20px;
  font-weight: bold;
  align-items: center;

  &::before {
    width: 6px;
    height: 24px;
    background: #4465a1;
    -webkit-box-shadow: 1px 1px 5px 0 #aeabc2;
    box-shadow: 1px 1px 5px 0 #aeabc2;
    border-radius: 10px;
    display: block;
    content: '';
    margin-right: 20px;
  }
}
.title {
  h3 {
    font-size: 20px;
    font-weight: bold;
  }
  .time {
    margin: 20px 0;
    > i {
      color: #409eff;
      font-weight: bold;
      font-size: 18px;
      margin-right: 6px;
    }
  }
}
.bold {
  font-weight: bold;
}
.img-wrap {
  max-width: 600px;
  margin: 30px 0;
}
.img-wrap-0 {
  max-width: 300px;
}
.nested-0 {
  max-width: 200px;
  margin: 20px 0;
}
.nested-1 {
  max-width: 400px;
  margin: 20px 0;
}
.timeline {
  margin: 20px 0;
  padding: 20px;
}
.article {
  font-size: 14px;
}
.sticky {
  position: sticky;
  z-index: 99;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
}
.loading-text {
  margin-left: 10px;
}
.load-wrap {
  min-height: 400px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffff;
}
.con {
  margin-top: 10px;
}
.extra {
  margin-top: 20px;
  display: flex;
  .link {
    color: #409eff;
    cursor: pointer;
    margin-right: 20px;
    &:hover {
      text-decoration: underline;
    }
    i {
      margin-right: 6px;
    }
  }
}
.font-18 {
  font-size: 16px;
}
.gray {
  color: #666;
}
.type {
  color: #999;
  > span {
    margin-right: 10px;
  }
  .tag {
    margin-bottom: 10px;
    background: #4465a1;
    color: #fff;
    font-weight: bold;
    letter-spacing: 0.5px;
    font-size: 12px;
    height: 28px;
    line-height: 28px;
  }
}
.flexs {
  display: flex;
  /* color: #666; */
  font-size: 14px;
  color: #999;
  margin-bottom: 10px;
  .bold {
    font-weight: normal;
    margin-right: 4px;
  }
  .line {
    margin-right: 20px;
  }
}

.top {
  h2 {
    font-size: 22px;
    padding-bottom: 20px;
    font-weight: bold;
  }
}
.meta {
  display: flex;
  flex-direction: column;
  .author {
    color: #515767;
    font-weight: bold;
  }
  .time {
    color: #8a919f;
    font-size: 14px;
    line-height: 22px;
  }
}
.tags {
  display: flex;
  align-items: center;
  padding: 10px 0;
  flex-wrap: wrap;
  .tag {
    background: #fff;
    border: 1px solid #4265a2;
    margin: 10px 10px 0 0;
    color: #4265a2;
    border-radius: 20px;
    padding: 4px 12px;
    display: flex;
    align-items: center;
    font-size: 15px;
    height: 20px;
    box-sizing: content-box;
    font-weight: 500;
  }
}

@media screen and (max-width: 1080px) {
  .wrap {
    flex-direction: column;
    .left {
      width: 100%;
    }
    .right {
      width: 100%;
      margin-left: 0;
      max-height: 1000px;
      margin-bottom: 40px;
    }
  }
  .content {
    margin-bottom: 10px;
  }
  .more {
    margin: 10px 0;
  }
  .img-wrap {
    width: 100%;
  }
  .no-border {
    border-radius: 0;
    border: none;
  }
  .font-18 {
    font-size: 15px;
  }
}
</style>
