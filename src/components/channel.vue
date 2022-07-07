<template>
  <div class="channel">
    <div class="wrap" v-if="channels.length > 0">
      <div class="flex">
        <span>频道({{ channels.length }}):</span>
        <div class="con">
          <div class="arrow arrow-right" @click="navScrollRight()"></div>
          <div class="hidden-left" />
          <div class="tabs-nav-list" ref="list">
            <div class="tabs-nav-list-wrapper" ref="wrapper">
              <el-tag
                :class="[
                  'tag',
                  {
                    active: activeChannel == item.id,
                  },
                ]"
                v-for="(item, index) in channels"
                @click="() => changeChannel(item)"
                :key="index"
                >{{ item.name }}</el-tag
              >
            </div>
          </div>
          <div class="hidden-right" />
          <div class="arrow arrow-left" @click="navScrollLeft()"></div>
        </div>
      </div>
      <div class="refresh">
        <i class="el-icon-refresh-right"></i>
        <span>刷新</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Channel',
  props: {
    channels: Array,
  },
  data() {
    return {
      activeChannel: '',
    };
  },
  created() {
    this.activeChannel = this.channels[0].id;
    this.$store.commit('setChannel', this.activeChannel);
    // this.getChannel();
  },
  methods: {
    getChannel() {
      this.$store.dispatch('ajax', {
        req: {
          url: 'channels',
          params: {
            channelId: 1,
            page: 1,
            pageSize: 100,
          },
        },
        onSuccess: res => {
          this.channels = this.channels.concat(res.data);
          this.activeChannel = this.channels[0].id;
        },
      });
    },
    changeChannel(data) {
      this.activeChannel = data.id;
      this.$store.commit('setChannel', this.activeChannel);
    },
    navScrollLeft() {
      let listOffsetWidth = this.$refs.list.offsetWidth;
      let listScrollLeft = this.$refs.list.scrollLeft;
      let wrapperScrollWidth = this.$refs.wrapper.scrollWidth;
      console.log(listOffsetWidth, listScrollLeft, wrapperScrollWidth, '111');
      switch (true) {
        case wrapperScrollWidth - listOffsetWidth - listScrollLeft <= 0:
          console.log(1);
          this.$refs.list.scrollTo({
            left: 0,
            behavior: 'smooth',
          });
          break;

        case wrapperScrollWidth - listOffsetWidth - listScrollLeft >= listOffsetWidth:
          console.log(2);
          this.$refs.list.scrollTo({
            left: this.$refs.list.scrollLeft + listOffsetWidth,
            behavior: 'smooth',
          });
          break;

        case wrapperScrollWidth - listOffsetWidth - listScrollLeft < listOffsetWidth:
          console.log(3);
          this.$refs.list.scrollTo({
            left: wrapperScrollWidth - listOffsetWidth,
            behavior: 'smooth',
          });
          break;
      }
    },

    navScrollRight() {
      let listOffsetWidth = this.$refs.list.offsetWidth;
      let listScrollLeft = this.$refs.list.scrollLeft;

      this.$refs.list.scrollTo({
        left: listScrollLeft - listOffsetWidth,
        behavior: 'smooth',
      });
    },
  },
};
</script>
<style lang="less" scoped>
.channel {
  .wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
    font-weight: bold;
  }
  .flex {
    display: flex;
    align-items: center;
  }
}
.con {
  max-width: 700px;
  background: #f2f2f2;
  height: 46px;
  box-shadow: 0 0 8px 0 #f3f3f3;
  border-radius: 6px;
  margin: 0px 14px 0 14px;
  box-sizing: border-box;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  position: relative;
  /** 滚动条 **/
  ::-webkit-scrollbar {
    width: 0;
    height: 0;
    border-radius: 50px;
  } /* 这是针对缺省样式 (必须的) */
  ::-webkit-scrollbar-track {
    background-color: transparent;
  } /* 滚动条的滑轨背景颜色 */

  ::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 3px;
  } /* 滑块颜色 */

  ::-webkit-scrollbar-button {
    background-color: transparent;
  } /* 滑轨两头的监听按钮颜色 */

  ::-webkit-scrollbar-corner {
    background-color: #f9f9f9;
  } /* 横向滚动条和纵向滚动条相交处尖角的颜色 */
}

.tabs-nav-list {
  max-width: 700px;
  height: 40px;
  margin: 0 14px;
  overflow-x: auto;
  transition: width 0.5s;

  .tabs-nav-list-wrapper {
    height: 100%;
    display: flex;
    align-items: center;
  }
  .tag {
    margin-right: 10px;
    height: 26px;
    line-height: 26px;
    background-color: #fafafa;
    border-color: #e5e5e5;
    color: #666666;
    cursor: pointer;
    &:hover {
      filter: brightness(0.8);
    }
  }
  .tag:last-child {
    margin-right: 0;
  }
  .active {
    background-color: #ffeb3b;
    border-color: #dfc21b;
    color: #000;
    &:hover {
      filter: brightness(1);
    }
  }
}

.arrow {
  width: 28px;
  height: 24px;
  background-size: 13px 16px;
  font-size: 0;
  cursor: pointer;
  transition: width 0.5s, border-radius 0.5s;
  overflow: hidden;
  &:hover {
    filter: brightness(0.8);
  }
}
.arrow-right {
  background: #fdda13 url('~@/assets/images/web_newsroom_page_icon_Previous_normal.png') no-repeat
    50%;
  background-size: 16px 23px;
  border-radius: 14px 3px 3px 14px;
}
.arrow-left {
  background: #fdda13 url('~@/assets/images/web_newsroom_page_icon_next_normal.png') no-repeat 50%;
  background-size: 16px 23px;
  border-radius: 3px 14px 14px 3px;
  cursor: pointer;
}
.hidden-left {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 38px;
  left: 54px;
  border-radius: 1px;
  background: linear-gradient(270deg, hsla(0, 0%, 100%, 0), #f2f2f2);
}
.hidden-right {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 38px;
  border-radius: 1px;
  right: 54px;
  background: linear-gradient(270deg, #f2f2f2, hsla(0, 0%, 100%, 0));
}

.refresh {
  cursor: pointer;
  i {
    margin-left: 6px;
  }
  &:hover {
    color: #409eff;
  }
}
@media screen and (max-width: 760px) {
  .channel {
    .wrap {
      position: relative;
    }
    .flex {
      > span {
        display: none;
      }
    }
    .refresh {
    }
  }
  .hidden-left {
    left: 0px;
  }
  .hidden-right {
    right: 0px;
  }
  .con {
    margin: 10px 0;
    width: 100%;
    padding: 0;
  }
  .tabs-nav-list {
    width: 100%;
  }
  .arrow {
    display: none;
  }
}
</style>
