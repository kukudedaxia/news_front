<template>
  <div class="timeline">
    <div class="menu">
      <el-menu
        :default-active="String(channelId)"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item
          :class="[{ active: item.id == channelId }, 'menu-item']"
          v-for="(item, index) in channels"
          :index="String(item.id)"
          :key="index"
          >{{ item.name }}</el-menu-item
        >
      </el-menu>
    </div>
    <div class="block">
      <scroll
        :loading="loading"
        :finished="nextPage == -1"
        :length="list.length"
        @load="getData"
        @check="check"
        :immediateCheck="false"
        :loadingCon="true"
        :maxLength="false"
      >
        <template v-slot:content v-if="list.length > 0">
          <div v-for="(object, index) in list" :key="index">
            <div class="date">
              <div class="day">{{ moment(object.date).format('DD/MM') }}</div>
              <div class="box">
                <span class="month">{{ month[object.date.substring(5, 7)] }}</span>
                <span class="year">{{ moment(object.date).format('YYYY') }}</span>
              </div>
            </div>
            <el-timeline class="times">
              <el-timeline-item
                v-for="(item, index) in object.lives"
                :key="index"
                :timestamp="moment(item.ctime).format('HH:mm')"
                placement="top"
                class="item"
              >
                <div>
                  <template>
                    <div>
                      <div @click="() => goDetail(item)">
                        <div
                          :class="[
                            'desc',
                            item.raw_message_zh ? 'text-overflow-6' : 'text-overflow-4',
                          ]"
                        >
                          <template v-if="item.raw_message_zh">
                            <div class="flex">
                              <span class="bold">[译文]&nbsp;</span>
                              <p>{{ item.raw_message_zh }}</p>
                            </div>
                          </template>
                          <template v-if="item.raw_message_zh">
                            <br />
                            <br />
                          </template>
                          <div class="flex">
                            <!-- <span class="hot" v-if="index % 3 == 0">精</span> -->
                            <span class="bold">[原文]&nbsp;</span>
                            <p>{{ item.raw_message }}</p>
                          </div>
                        </div>
                      </div>
                      <div class="images" v-if="item.images && item.images.length > 0">
                        <el-image
                          :src="item.images[0]"
                          lazy
                          :preview-src-list="item.images"
                          fit="cover"
                        ></el-image>
                        <span class="num" v-if="item.images.length > 1"
                          >+{{ item.images.length - 1 }}</span
                        >
                      </div>
                    </div>
                  </template>
                  <div class="bottom">
                    <div class="flex">
                      <a :href="item.link" target="_blank"><i class="el-icon-link"></i>原文链接</a>
                      <Share :link="item.qrcode" :data="item" />
                    </div>
                  </div>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </template>
      </scroll>
      <template v-if="list.length < 1 && isFirstload">
        <el-empty class="no-data" description="暂无数据"></el-empty>
      </template>
    </div>
  </div>
</template>
<script>
import scroll from './scroll';
import Share from '../components/share';
export default {
  name: 'TimeLine',
  components: {
    scroll: scroll,
    Share,
  },
  props: {
    channels: Array,
  },
  data() {
    return {
      active: 0,
      loading: true,
      page: 1,
      pageSize: 10,
      list: [],
      isFirstload: false,
      nextPage: 1,
      month: {
        '01': '一月.',
        '02': '二月.',
        '03': '三月.',
        '04': '四月.',
        '05': '五月.',
        '06': '六月.',
        '07': '七月.',
        '08': '八月.',
        '09': '九月.',
        '10': '十月.',
        '11': '十一月.',
        '12': '十二月.',
      },
    };
  },
  computed: {
    channelId() {
      return this.$store.state.channelId;
    },
    viewItem() {
      return this.list[this.active];
    },
    channelItem() {
      return this.channels.find(item => item.id == this.channelId);
    },
  },
  watch: {
    channelId() {
      this.isFirstload = false;
      this.page = 1;
      this.nextPage = 1;
      this.loading = false;
      this.getData('init');
    },
  },
  created() {
    this.getData();
  },
  methods: {
    getData(type) {
      if (!this.channelId) {
        this.loading = false;
        return;
      }
      this.loading = true;
      if (type == 'init') {
        this.list = [];
      }
      this.$store.dispatch('ajax', {
        req: {
          url: 'lives/timeline',
          params: {
            channelId: this.channelId,
            page: this.page,
            pageSize: this.pageSize,
          },
        },
        onSuccess: res => {
          this.loading = false;
          this.page += 1;
          this.nextPage = res.data.nextPage;
          // let arr = [];
          // res.data.list.forEach(item => {
          //   item.lives.forEach(d => {
          //     d.date = item.date;
          //     arr.push(d);
          //   });
          // });
          this.list = this.list.concat(res.data.list);
        },
        onComplete: () => {
          this.isFirstload = true;
        },
      });
    },
    changeChannel(data) {
      console.log(1);
      this.$store.commit('setChannel', data.id);
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      this.$store.commit('setChannel', key);
    },
    goDetail(item) {
      console.log(item);
      this.$router.push({
        path: `/detail/${item.id}?type=1&channel=${this.channelItem.name}`,
      });
    },
    isInViewPortOfTwo(el) {
      const viewPortHeight =
        window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      const top = el.getBoundingClientRect() && el.getBoundingClientRect().top;
      console.log('top', top);
      return top <= viewPortHeight + 100;
    },
    check() {
      console.log('滚动检查');
      // let active = 0;
      // let items = document.getElementsByClassName('item');
      // for (var i = 0; i < items.length; i++) {
      //   if (!this.isInViewPortOfTwo(items[i])) {
      //     active = i + 1;
      //     break;
      //   }
      // }
      // console.log(active);
      // this.active = active;
    },
  },
};
</script>
<style lang="less">
.code {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}
</style>
<style lang="less" scoped>
.block {
  min-height: 300px;
  /deep/.el-timeline-item__tail {
    border-left: 2px dotted #d9d9d9;
  }
  /deep/.el-timeline-item__timestamp.is-top {
    padding: 10px 12px;
    background: #f5f8ff;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 400;
    color: #409eff;
    display: inline-block;
    position: relative;
  }
  /deep/.el-timeline-item__wrapper {
    top: -10px;
    z-index: 100;
  }
}
.menu {
  width: 100%;
  overflow: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  display: flex;
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
  /deep/.el-menu.el-menu--horizontal {
    border-bottom: none;
  }
  .menu-item {
    cursor: pointer;
    font-size: 18px;
    color: #666666;
    white-space: nowrap;
    // margin: 0 10px;
    position: relative;
    transition: none;
    display: block;
    padding: 0 16px;
    height: 48px;
    line-height: 48px;
    &::before {
      content: ' ';
      position: absolute;
      width: 0;
      left: 50%;
      bottom: 0;
      height: 3px;
      background: #3667a6;
      border-radius: 6px;
      transition: none;
    }
    &:hover {
      color: #3667a6;
    }
  }
  .menu-item.active {
    color: #3667a6;
    border-bottom: 0;
    &::before {
      left: 25%;
      width: 50%;
      transition: width 0.5s, left 0.5s;
    }
  }
}
.date {
  display: flex;
  align-items: center;
  padding: 30px 20px 20px 20px;
  margin-bottom: 20px;
  background: #fff;
  z-index: 101;
  // position: -webkit-sticky;
  // position: sticky;
  // top: 0px;

  .day {
    font-size: 32px;
    color: #3667a6;
  }
  .box {
    margin-left: 20px;
    background: #3667a6;
    color: #fff;
    display: inline-flex;
    font-size: 15px;
    flex-direction: column;
    padding: 4px 10px;
    border-radius: 10px;
    .year {
      font-weight: bold;
      font-size: 20px;
    }
  }
}
.times {
  padding: 0 10px;
}
.item {
  cursor: pointer;
  position: relative;
}

.bottom {
  margin-top: 20px;
  .flex {
    display: flex;
    a {
      color: #409eff;
      cursor: pointer;
      margin-right: 20px;
      &:hover {
        text-decoration: underline;
      }
    }
    i {
      margin-right: 4px;
    }
  }
}
.desc {
  font-size: 16px;
}
.hot {
  background: linear-gradient(138.41deg, #409eff 8.14%, #3667a6 91.81%);
  line-height: 18px;
  color: #fff;
  font-size: 11px;
  font-weight: 500;
  text-align: center;
  border-radius: 5px 1px 5px 1px;
  width: 32px;
  height: 18px;
  margin-right: 6px;
  margin-top: 3px;
  line-height: 18px;
  padding: 2px 4px;
}
.images {
  width: 200px;
  min-height: 100px;
  margin: 20px 0;
  position: relative;
  .num {
    background: rgba(0, 0, 0, 0.3);
    border: 0 solid rgba(0, 0, 0, 0.03);
    border-radius: 6px;
    font-family: Tahoma;
    font-size: 28px;
    color: #fff;
    letter-spacing: 0;
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.bold {
  font-weight: bold;
  color: #3667a6;
}
.flex {
  p {
    display: initial;
  }
  > span {
    word-break: keep-all;
    margin-right: 4px;
  }
}
@media screen and (max-width: 1080px) {
  .menu .menu-item {
    font-size: 15px;
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
    margin: 0;
  }
  .date {
    padding: 20px 10px;
    .day {
      font-size: 28px;
    }
  }
  .times {
    padding: 0;
  }
}
@media screen and (min-width: 1080px) {
  .no-data {
    margin-top: 120px;
  }
}
</style>
