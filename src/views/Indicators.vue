<template>
  <div>
    <div class="content" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
      <el-row :gutter="16">
        <el-col :xs="24" :sm="12" :md="8" :lg="8" v-for="(item, index) in channels" :key="index">
          <el-card class="box-card">
            <h3 class="title">{{ item.name }}</h3>
            <p>
              {{ item.description }}
            </p>
            <div class="btns">
              <el-button type="primary" size="mini" round @click="showDialog(item, 1)"
                >微信群</el-button
              >
              <el-button type="primary" size="mini" round @click="showDialog(item, 2)"
                >电报群</el-button
              >
            </div>
          </el-card>
        </el-col>
      </el-row>
      <div class="tips" v-if="!loading">敬请期待后续会更新监控群组...</div>
    </div>
    <van-overlay :show="show" @click="show = false" z-index="1000">
      <div class="wrapper" @click.stop>
        <div class="block">
          <p>
            扫描或识别二维码 <br /><span class="name">[{{ current.name }}]</span>
          </p>
          <img :src="type == 1 ? current.wechat_qrcode : current.tg_qrcode" class="code" />
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
      type: '',
      loading: false,
    };
  },
  created() {
    this.getData();
  },
  methods: {
    showDialog(item, type) {
      this.type = type;
      if (type == 1) {
        this.current = item;
      } else if (type == 2) {
        this.current = item;
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
  },
};
</script>
<style lang="less" scoped>
.box-card {
  margin-bottom: 20px;
  border-style: solid;
  border-color: #e5e7eb;
  box-shadow: 0 4px 12px #0000000f, 0 0 2px #0000001a;
  border-radius: 6px;
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
@media (max-width: 767px) {
}
@media (max-width: 992px) {
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
  p {
    color: #008cfc;
    font-size: 20px;
    text-align: center;
    margin-top: -10px;
    margin-bottom: 10px;
  }
  .name {
    color: #ffc107;
    font-weight: bold;
  }
  .code {
    max-width: 300px;
  }
}
@media (max-width: 1200px) {
}
@media (min-width: 768px) {
}
</style>
