<template>
  <div class="indicators">
    <div class="content" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
      <div class="list">
        <el-row :gutter="16">
          <el-col :xs="24" :sm="12" :md="8" :lg="8" v-show="channels.length > 0">
            <el-card class="box-card box-card1">
              <div>
                <h3 class="title" style="color: red">
                  特级监控 <img :src="require('../assets/images/head.png')" />
                </h3>
                <p>
                  前600名早期支持者免费席位<br />
                  (剩余: 56)
                </p>
                <div class="btns">
                  <!-- <el-button type="primary" size="mini" round @click.stop="showDialog(item, 3)"
                    >详情</el-button
                  > -->
                  <el-button type="primary" size="mini" round @click.stop="showDialog(item, 1)"
                    >微信</el-button
                  >
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" v-for="(item, index) in channels" :key="index">
            <el-card class="box-card">
              <div @click="() => goDetail(item)">
                <h3 class="title">{{ item.name }}</h3>
                <p>
                  {{ item.description }}
                </p>
                <div class="btns">
                  <!-- <el-button type="primary" size="mini" round @click.stop="showDialog(item, 3)"
                    >详情</el-button
                  > -->

                  <el-button
                    v-show="false"
                    type="primary"
                    size="mini"
                    round
                    @click.stop="showDialog(item, 1)"
                    >微信群</el-button
                  >
                  <el-button
                    v-show="false"
                    type="primary"
                    size="mini"
                    round
                    @click.stop="showDialog(item, 2)"
                    >电报群</el-button
                  >
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div class="tips" v-if="!loading">敬请期待后续会更新监控群组...</div>
    </div>
    <van-overlay :show="show" @click="show = false" z-index="102">
      <div class="wrapper" @click.stop>
        <div class="block" v-if="type == 1 || type == 2">
          <p>扫描或识别二维码 <br /></p>
          <p>请添加管理员为好友备注"入群"</p>
          <img :src="type == 1 ? current.wechat_qrcode : current.tg_qrcode" class="code" />
          <a :href="current.tg_link" target="_blank" v-if="type == 2"
            ><i class="el-icon-position" />电报链接</a
          >
        </div>
        <div class="block block1" v-if="type == 3 && loaded">
          <div class="timeline" v-if="list.length > 0">
            <el-timeline class="times">
              <el-timeline-item
                v-for="(item, index) in list"
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
          <el-empty description="暂无数据" v-else></el-empty>
          <div class="tips" v-if="list.length > 0">前往群聊获取更多详情信息</div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>
<script>
export default {
  name: 'Indicators',
  data() {
    return {
      show: false,
      channels: [],
      current: {},
      list: [],
      type: '',
      loading: false,
      loaded: false,
      loadingDetail: '',
    };
  },
  created() {
    this.getData();
  },
  methods: {
    showDialog(item, type) {
      window._czc && window._czc.push(['_trackEvent', '页面快讯', '点击弹窗二维码', type, 5145]);
      this.type = type;
      if (type == 1) {
        // this.current = item;
        this.current = {
          name: '官方精选',
          wechat_qrcode: require('../assets/images/qrcode.jpg'),
        };
      } else if (type == 2) {
        this.current = item;
      } else if (type == 3) {
        this.loadingDetail = this.$loading({
          lock: true,
          text: '加载中',
          background: 'transparent',
        });
        this.getDetails(item.id);
      }
      this.show = true;
    },
    getData() {
      this.loading = true;
      this.$store.dispatch('ajax', {
        req: {
          url: 'channels',
          params: {
            page: 1,
            pageSize: 1000,
            is_indicators: 1,
            qrcode: 1,
          },
        },
        onSuccess: res => {
          this.channels = this.channels.concat(res.data);
          this.loading = false;
        },
        onComplete: () => {
          this.loading = false;
        },
      });
    },
    getDetails(id) {
      this.list = [];
      this.loaded = false;
      this.$store.dispatch('ajax', {
        req: {
          url: 'lives/timeline',
          params: {
            channelId: id,
            page: 1,
            pageSize: 10,
          },
        },
        onSuccess: res => {
          let arr = [];
          res.data.list.forEach(item => {
            arr = arr.concat(item.lives);
          });
          this.list = arr;
        },
        onComplete: () => {
          this.loadingDetail.close();
          this.loaded = true;
        },
      });
    },
    goDetail(item) {
      window._czc && window._czc.push(['_trackEvent', '页面指标', '路由跳转', item.id, 5142]);
      this.$router.push({
        path: `/indicators/${item.id}`,
      });
    },
  },
};
</script>
<style lang="less">
.el-loading-mask.is-fullscreen .el-loading-spinner .circular {
  height: 30px;
  width: 30px;
}
</style>
<style lang="less" scoped>
.indicators {
  padding: 20px;
  /deep/.el-loading-spinner {
    margin-top: 20px;
  }
  /deep/.el-loading-spinner .circular {
    width: 30px;
    height: 30px;
  }
}
.box-card {
  margin-bottom: 20px;
  border-style: solid;
  border-color: #e5e7eb;
  box-shadow: 0 4px 12px #0000000f, 0 0 2px #0000001a;
  border-radius: 6px;
  cursor: pointer;
  .title {
    font-size: 16px;
    color: rgb(3, 54, 102);
    display: flex;
    align-items: center;
    img {
      width: 30px;
      height: 30px;
      margin-top: -10px;
    }
  }
  p {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-height: 18px;
    height: 36px;
    font-size: 14px;
    color: rgba(3, 54, 102, 0.45);
  }
}
.btns {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 28px;
  /deep/.el-button--primary {
    background-color: #ffc207;
    border-color: #ffeb3b;
    color: #000;
  }
}
.tips {
  color: #4266a1;
  text-align: center;
}
.block {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 3px 12px #0000000f, 0 0 2px #0000001a;
  min-height: 200px;
  > p {
    color: #008cfc;
    font-size: 18px;
    text-align: center;
    margin-top: -10px;
    margin-bottom: 10px;
    font-weight: bold;
  }
  .name {
    color: #ffc107;
    font-weight: bold;
  }
  .code {
    max-width: 300px;
    min-width: 280px;
    border: 1px solid #ebebeb;
    border-radius: 10px;
  }
  a {
    color: #2196f3;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: normal;
  }
}
.block1 {
  min-width: 300px;
  max-height: 80%;
  overflow: scroll;
  .tips {
    font-weight: bold;
  }
}
.list {
  min-height: calc(100vh - 220px);
}
.timeline {
  .con {
    color: #000;
  }
  /deep/.el-timeline-item__timestamp {
    color: #aaaaaa;
  }
  .gray {
    color: #000;
  }
  /deep/.el-timeline-item__tail {
    border-left: 2px dotted #3667a6;
  }
  /deep/.el-timeline-item__node {
    background-color: #3667a6;
  }
}
@media (max-width: 767px) {
}
@media (max-width: 992px) {
  .indicators {
    padding: 0;
  }
  .content {
    padding: 20px 16px;
  }
  .box-card {
    margin-bottom: 16px;
    background: #fafafa;
  }
  .tips {
    font-size: 14px;
  }
  .block {
    .code {
      max-width: 280px;
      min-width: 200px;
    }
  }
}

.box-card1 {
  background-clip: padding-box, border-box;
  background-origin: padding-box, border-box;
  background-image: linear-gradient(to right, #fff, #fff), linear-gradient(90deg, #ffc107, #ff9800);
  border: 2px solid transparent;
  /deep/.el-card__body {
    padding: 18px 20px;
  }
}
@media (max-width: 1200px) {
}
@media (min-width: 768px) {
}
</style>
