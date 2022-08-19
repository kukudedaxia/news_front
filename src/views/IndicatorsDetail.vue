<template>
  <div class="ind-detail">
    <div class="menu-title hidden-sm-and-down">指标监控-{{ item.name }}</div>
    <div class="top" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
      <el-card class="box-card">
        <div @click="() => goDetail(item)">
          <h3 class="title">{{ item.name }}</h3>
          <p>
            {{ item.description }}
          </p>
          <div class="btns" v-show="!loading">
            <el-button type="primary" size="mini" round @click.stop="showDialog(item, 1)"
              >微信群</el-button
            >
            <el-button type="primary" size="mini" round @click.stop="showDialog(item, 2)"
              >电报群</el-button
            >
          </div>
        </div>
      </el-card>
    </div>
    <div class="content" v-if="id">
      <TimeLine
        :channels="[]"
        class="times"
        type="indicators"
        :finishedText="'前往群聊获取更多详情信息...'"
      />
    </div>
    <van-overlay :show="show" @click="show = false" z-index="102">
      <div class="wrapper" @click.stop>
        <div class="block" v-if="type == 1 || type == 2">
          <p>
            扫描或识别二维码 <br /><span class="name">[{{ item.name }}]</span>
          </p>
          <img :src="type == 1 ? item.wechat_qrcode : item.tg_qrcode" class="code" />
          <a :href="item.tg_link" target="_blank" v-if="type == 2"
            ><i class="el-icon-position" />电报链接</a
          >
        </div>
      </div>
    </van-overlay>
  </div>
</template>
<script>
import TimeLine from '../components/timeline1.vue';
export default {
  name: 'IndicatorsDetail',
  components: {
    TimeLine,
  },
  data() {
    return {
      loading: true,
      list: [],
      item: {},
      type: '',
      show: false,
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
  },
  async created() {
    await this.getCard();
  },
  methods: {
    showDialog(item, type) {
      window._czc && window._czc.push(['_trackEvent', '页面快讯', '点击弹窗二维码', type, 5145]);
      this.type = type;
      this.show = true;
    },
    getCard() {
      this.loading = true;
      this.$store.dispatch('ajax', {
        req: {
          url: `channels/${this.id}`,
        },
        onSuccess: res => {
          this.item = res.data;
        },
        onComplete: () => {
          this.loading = false;
        },
      });
    },
  },
};
</script>
<style lang="less" scoped>
.ind-detail {
  border-right: 1px solid hsla(0, 0%, 53%, 0.2);
}
.box-card {
  max-width: 600px;
  margin: 40px auto 0;
  border-style: solid;
  border-color: #e5e7eb;
  box-shadow: 0 4px 12px #0000000f, 0 0 2px #0000001a;
  border-radius: 6px;
  cursor: pointer;
  .title {
    font-size: 16px;
    color: rgb(3, 54, 102);
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
  /deep/.el-button--primary {
    background-color: #4266a1;
    border-color: #4266a1;
  }
}
.tips {
  color: #4266a1;
  text-align: center;
}
.menu-title {
  padding: 20px 20px;
  font-size: 20px;
  font-weight: 600;
  line-height: 20px;
  border-bottom: 1px solid hsla(0, 0%, 53%, 0.2);
  color: #010102;
}
.content {
  padding-bottom: 40px;
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
    font-size: 20px;
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
@media (max-width: 767px) {
}
@media (max-width: 992px) {
  .box-card {
    margin: 20px;
    margin-bottom: 0;
  }
}
@media (max-width: 1200px) {
}
@media (min-width: 768px) {
}
</style>
