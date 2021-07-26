<template>
  <div class="scheduled_live text-right">
    <p class="title">
      {{ $t('live.liveStream') }}
    </p>
    <ul>
      <li v-for="item in liveList" :key="item.streamKey">
        <img :src="`http://img.whale.weibo.com/orj1080/${item.liveInfoBean.coverPid}.jpg`" />
        <div class="right-box">
          <div>
            <p>{{ $t('live.scheduleTitle') }}: {{ item.liveInfoBean.title }}</p>
            <p>
              {{ $t('live.time') }}:
              {{ $moment(new Date(item.liveInfoBean.apptTime)).format('DD/MM/YYYY HH:mm ') }}
            </p>
            <p>{{ $t('live.privacy') }}: {{ visible(item.liveInfoBean.visible) }}</p>
          </div>
          <div class="btn-operation">
            <el-button
              type="primary"
              size="small"
              :disabled="item.liveState === 2 || (liveState === 1 && item.liveState !== 1)"
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
              :disabled="liveState === 1 && item.liveState !== 1"
              >{{ $t('live.copyURL') }}</el-button
            >
            <el-button
              type="primary"
              plain
              size="small"
              v-clipboard:copy="item.streamKey"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
              :disabled="liveState === 1 && item.liveState !== 1"
              >{{ $t('live.copyKey') }}</el-button
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
    // 直播状态：0 未直播 1 直播中 2 已结束
    liveState: {
      type: Number,
      default: 0,
    },
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
    // 隐私列表
    visible(visible) {
      const visibleMap = new Map([
        [0, this.$t('live.public')],
        [1, this.$t('live.private')],
        [2, this.$t('live.onlyFollowers')],
        [3, this.$t('live.onlyFriends')],
      ]);
      return visibleMap.get(visible);
    },
    // 获取预约直播列表
    getSubLiveList() {
      this.$store.dispatch('ajax', {
        req: {
          method: 'post',
          url: '/multimedia/2/video/pc/subLiveList.json',
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
        pushUrl: item.pushUrl,
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
    // 改变按钮loading状态
    changeBtnLoading(lid) {
      this.liveList.forEach(item => {
        if (item.liveInfoBean.lid === lid) {
          item.loading = false;
        }
      });
    },
    // ----- copy ----- //
    onCopy() {
      this.$message({
        message: this.$t('live.success'),
        type: 'success',
      });
    },
    onError() {
      // 复制失败
      this.$message({
        message: this.$t('live.failed'),
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
html[lang='ar'] {
  .right-box {
    margin-right: 20px;
    margin-left: 0 !important;
  }
  .el-button + .el-button {
    margin-right: 10px;
    margin-left: 0;
  }
}
</style>
