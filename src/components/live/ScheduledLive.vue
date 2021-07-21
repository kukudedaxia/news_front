<template>
  <div class="scheduled_live">
    <p class="title">
      Appointment List
    </p>
    <ul>
      <li v-for="item in liveList" :key="item.streamKey">
        <img :src="`https://img.bee-cdn.com/orj360/${item.liveInfoBean.coverPid}.jpg`" />
        <div class="right-box">
          <div>
            <p>Title: {{ item.liveInfoBean.title }}</p>
            <p>Time: {{ item.liveInfoBean.apptTime }}</p>
            <p>Permission: {{ item.liveInfoBean.visible }}</p>
          </div>
          <div class="btn-operation">
            <el-button
              type="primary"
              size="small"
              :disabled="item.liveState === 2"
              :loading="item.loading"
              @click="onLiveClick(item)"
            >
              {{
                item.liveState === 0
                  ? 'start Live'
                  : item.liveState === 1
                  ? 'End Live'
                  : 'Live Ended'
              }}
            </el-button>
            <el-button
              type="primary"
              plain
              size="small"
              v-clipboard:copy="item.pushUrl"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
              >Copy URL</el-button
            >
            <el-button
              type="primary"
              plain
              size="small"
              v-clipboard:copy="item.streamKey"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
              >Copy Key</el-button
            >
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    uid: Number,
  },
  data() {
    return {
      liveList: [],
    };
  },
  created() {
    this.getSubLiveList();
  },
  methods: {
    // 获取预约直播列表
    getSubLiveList() {
      this.$store.dispatch('ajax', {
        req: {
          method: 'post',
          url: 'liveApi/2/video/pc/subLiveList.json',
          params: {
            uid: this.uid,
          },
        },
        onSuccess: ({ data }) => {
          data.forEach(item => {
            item.loading = false;
            item.liveState = 0; // 0 未直播 1 直播中 2 已结束
          });
          this.liveList = data;
        },
        onComplete: () => {},
      });
    },
    // 按钮点击
    onLiveClick(item) {
      item.loading = true;
      const param = {
        live_type: 0, // 0:预约feed开播 1:直接开播
        uid: item.liveInfoBean.uid,
        lid: item.liveInfoBean.lid,
        pullUrl: item.pullUrl,
        streamKey: item.streamKey,
        title: item.liveInfoBean.title,
        coverPid: item.liveInfoBean.coverPid,
      };
      this.$emit('liveState', param);
    },
    // 改变直播状态
    changeLiveState(lid, state) {
      this.liveList.forEach(item => {
        if (item.liveInfoBean.lid === lid) {
          item.loading = false;
          item.liveState = state;
        }
      });
    },
    // ----- copy ----- //
    onCopy(e) {
      this.$message({
        message: '复制成功！',
        type: 'success',
      });
    },
    onError(e) {
      // 复制失败
      this.$message({
        message: '复制失败！',
        type: 'error',
      });
    },
  },
};
</script>

<style lang="less" scoped>
.scheduled_live {
  text-align: left;
  height: 100%;
  overflow-y: auto;
  .title {
    font-weight: bold;
  }
  ul {
    li {
      padding: 20px 0;
      display: flex;
      border-bottom: 2px solid #ffffff;
      & > img {
        width: 150px;
        height: 200px;
        object-fit: cover;
      }
      .right-box {
        margin-left: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        p {
          margin-bottom: 15px;
        }
      }
      .btn-operation {
        display: flex;
      }
    }
  }
}
</style>
