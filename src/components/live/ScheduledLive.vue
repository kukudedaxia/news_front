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
            <p class="name">{{ item.liveInfoBean.title }}</p>
            <p class="time">
              <img src="@/assets/images/live/live_Schedule_time_icon1.png" class="tips-img" />
              {{ $moment(new Date(item.liveInfoBean.apptTime)).format('DD/MM/YYYY HH:mm ') }}
            </p>
            <p class="privacy">
              <img src="@/assets/images/live/live_Schedule_time_icon2.png" class="tips-img" />
              {{ visible(item.liveInfoBean.visible) }}
            </p>
          </div>
          <div class="btn-operation">
            <el-button
              type="primary"
              size="small"
              :disabled="item.liveState === 2 || (liveState === 1 && item.liveState !== 1)"
              :loading="item.loading"
              class="btn"
              @click="onLiveClick(item)"
            >
              {{
                item.liveState === 0
                  ? $t('live.startLive')
                  : item.liveState === 1
                  ? $t('live.endLive')
                  : $t('live.liveEnded')
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
              class="btn"
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
              class="btn"
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
  padding: 15px 20px;
  .title {
    font-family: SFUIText-Semibold;
    font-size: 14px;
    color: #dddddd;
    letter-spacing: 0;
  }
  ul {
    li {
      padding: 20px 0;
      display: flex;
      & > img {
        width: 90px;
        height: 116px;
        object-fit: cover;
        background: #2e2f32;
        background: rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.03);
        border-radius: 5px;
      }
      .right-box {
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 4px;

        .name {
          font-family: SFUIText-Semibold;
          font-size: 14px;
          color: #dddddd;
          margin-bottom: 10px;
        }
        .time,
        .privacy {
          font-family: SFUIText-Regular;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 4px;
        }
        .tips-img {
          width: 14px;
          height: 14px;
          vertical-align: -2px;
        }
      }
      .btn-operation {
        display: flex;
        .btn {
          font-family: SFUIText-Medium;
          font-size: 12px;
          color: #dddddd;
          letter-spacing: 0;
          text-align: center;
          border-radius: 21px;
          padding: 5px 9px;
          height: 24px;
        }
        .is-plain {
          border: 1px solid #6d7283;
          color: #6d7283;
          background-color: transparent;
        }
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
