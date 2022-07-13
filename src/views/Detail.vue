<template>
  <div class="wrap">
    <div class="left">
      <template v-if="load">
        <div class="content no-border">
          <!-- <div class="pos-title">详情</div> -->
          <div class="title">
            <div class="time">
              <i class="el-icon-time" />
              <span>{{ moment(object.ctime).format('YYYY/MM/DD HH:MM:SS') }}</span>
            </div>
            <div class="type">
              <span>来自:</span><el-tag class="tag">{{ channelName }}</el-tag>
            </div>
            <div class="flexs">
              <div class="line">
                <span class="bold">来源:</span>
                <span>TWITTER</span>
              </div>
              <div class="line">
                <span class="bold">作者:</span>
                <span>JOE</span>
              </div>
            </div>
          </div>
          <div class="article">
            <template v-if="type == 1">
              <div>
                <template v-if="object.raw_message_zh">
                  <p class="font-18">
                    <span class="bold">[译文]&nbsp;</span>{{ object.raw_message_zh }}
                  </p>
                  <br />
                </template>
                <p class="gray"><span class="bold">[原文]&nbsp;</span>{{ object.raw_message }}</p>
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
                <Share link="https://www.baidu.com" />
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
    <!-- <div class="right no-border sticky">
      <Top type="detail" />
    </div> -->
  </div>
</template>
<script>
import Loading from '@/components/common/Loading';
import Share from '../components/share';
import ImgBox from '@/components/ImgBox';
export default {
  name: 'Detail',
  components: {
    // Top,
    Share,
    ImgBox,
    Loading,
  },
  data() {
    return {
      load: false,
      type: 1,
      object: {},
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    channelName() {
      return this.$route.query.channel;
    },
  },
  created() {
    this.init();
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
  },
};
</script>
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
