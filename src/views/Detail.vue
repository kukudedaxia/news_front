<template>
  <div class="wrap">
    <div class="left">
      <template v-if="load">
        <div class="content no-border">
          <div class="pos-title">详情</div>
          <div class="title">
            <div class="time">
              <i class="el-icon-time" />
              <span>07-05 09:20</span>
            </div>
            <div class="type">
              <el-tag class="tag">GameFi</el-tag>
            </div>
          </div>
          <div class="article">
            <template v-if="type == 1">
              <div>
                <template v-if="object.raw_message_zh">
                  <p><span class="bold">[译文]</span>{{ object.raw_message_zh }}</p>
                  <br />
                  <br />
                </template>
                <p><span class="bold">[原文]</span>{{ object.raw_message }}</p>
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

                <el-popover width="140" trigger="hover" placement="bottom" :close-delay="100">
                  <img
                    src="https://img.bee-cdn.com/large/3b9ae203lz1gmm6bogjkxj203v03v741.jpg"
                    alt="code"
                    class="code"
                    loading="lazy"
                  />
                  <a class="link" target="_blank" slot="reference"
                    ><i class="el-icon-share"></i>分享</a
                  >
                </el-popover>
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
                <div>
                  <template v-if="item.raw_message_zh">
                    <p><span class="bold">[译文]</span>{{ item.raw_message_zh }}</p>
                    <br />
                  </template>
                  <p><span class="bold">[原文]</span>{{ item.raw_message }}</p>
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
      </template>
      <div class="load-wrap" v-else>
        <loading>
          <span class="loading-text no-flip-over">加载中...</span>
        </loading>
      </div>
    </div>
    <div class="right no-border sticky">
      <Top type="detail" />
    </div>
  </div>
</template>
<script>
import Loading from '@/components/common/Loading';
import Top from '../components/home/top';
import ImgBox from '@/components/ImgBox';
export default {
  name: 'Detail',
  components: {
    Top,
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
    width: 800px;
  }
  .right {
    width: 300px;
    background: transparent;
    margin-left: 20px;
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
.extra {
  .link {
    color: #409eff;
    margin-right: 20px;
    i {
      margin-right: 6px;
    }
  }
}
.timeline {
  margin: 20px 0;
  padding: 20px;
}
.tag {
  margin-bottom: 10px;
  background: #4465a1;
  color: #fff;
  font-weight: bold;
  letter-spacing: 0.5px;
  font-size: 15px;
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
}
</style>
