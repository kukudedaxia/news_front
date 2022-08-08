<template>
  <div class="timeline">
    <div class="menu" v-if="type == 'home'">
      <el-menu
        :default-active="String(channelId)"
        class="fixed-nav"
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
        :finishedText="finishedText"
      >
        <template v-slot:content v-if="list.length > 0">
          <div v-for="(object, index) in list" :key="index">
            <div class="date">
              <div class="box">
                <span class="month">{{ time(object.date) }}</span>
                <span class="year">-{{ moment(object.date).format('YYYY') }}</span>
              </div>
              <div class="day">{{ moment(object.date).format('MM/DD') }}</div>
            </div>
            <el-timeline class="times">
              <el-timeline-item
                v-for="(item, oindex) in object.lives"
                :key="oindex"
                :timestamp="moment(item.ctime).format('HH:mm')"
                placement="top"
                :class="['item', { filter: type == 'indicators' && oindex < 3 && index == 0 }]"
              >
                <div @click="() => goDetail(item)">
                  <template>
                    <div>
                      <div>
                        <Texts :data="item" />
                      </div>
                      <div class="images" v-if="item.images && item.images.length > 0">
                        <el-image
                          :src="item.images[0]"
                          lazy
                          :preview-src-list="item.images"
                          fit="cover"
                          @click.stop="() => {}"
                        ></el-image>
                        <span class="num" v-if="item.images.length > 1"
                          >+{{ item.images.length - 1 }}</span
                        >
                      </div>
                    </div>
                  </template>
                  <div class="bottom" v-if="type == 'home'">
                    <div class="flex" @click.stop="() => {}">
                      <a v-if="item.link" :href="item.link" target="_blank"
                        ><i class="el-icon-link"></i>原文链接</a
                      >
                      <Share
                        :link="item.qrcode"
                        :data="item"
                        type="home"
                        :channelName="channelItem.name"
                      />
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
import Texts from '../components/text';
import moment from 'moment';
export default {
  name: 'TimeLine',
  components: {
    scroll: scroll,
    Share,
    Texts,
  },
  props: {
    channels: Array,
    type: {
      type: String,
      default: 'home',
    },
    finishedText: String,
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
      load: false,
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
      console.log(this.channelId, 2);
      // if (this.type !== 'indicators') {
      this.isFirstload = false;
      this.page = 1;
      this.nextPage = 1;
      this.loading = false;
      this.load = true;
      this.getData('init');
      // }
    },
  },
  created() {
    console.log(this.channelId, 1);
    if (!this.load) {
      this.getData('init');
    }
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
            pageSize: type == 'home' ? this.pageSize : 20,
          },
        },
        onSuccess: res => {
          this.loading = false;
          this.page += 1;
          // 针对别的只加载一页
          if (this.type !== 'home') {
            this.nextPage = -1;
          } else {
            this.nextPage = res.data.nextPage;
          }
          this.list = this.resetArr(this.list, res.data.list);
        },
        onComplete: () => {
          this.isFirstload = true;
        },
      });
    },
    // 重组数据
    resetArr(arr1, arr2) {
      let noCommon = [];
      arr2.forEach(item => {
        //最后一条和下一页相同
        if (arr1.length > 0 && arr1[arr1.length - 1].date == item.date) {
          arr1[arr1.length - 1].lives = arr1[arr1.length - 1].lives.concat(item.lives);
        } else {
          noCommon = noCommon.concat(item);
        }
      });
      return arr1.concat(noCommon);
    },
    changeChannel(data) {
      console.log(1);
      this.$store.commit('setChannel', data.id);
      document.documentElement.scrollTop = 0;
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      this.$store.commit('setChannel', key);
      document.documentElement.scrollTop = 0;
    },
    goDetail(item) {
      if (this.type == 'indicators') {
        this.$message('请前往群聊获取更多详情信息');
        // const link = this.$router.resolve({ path: `/detail/${item.id}?type=1` });
        // window.open(link.href, '_blank');
      } else {
        this.$router.push({
          path: `/detail/${item.id}?type=1&channel=${
            this.channelItem ? this.channelItem.name : ''
          }`,
        });
      }
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
    time(timeStamp) {
      let m2 = moment();
      let m1 = moment(timeStamp);
      let du = moment.duration(m2 - m1, 'ms'); //做差
      let year1 = m1.get('year');
      let year2 = m2.get('year');
      if (year1 == year2) {
        let days = du.get('days');
        //  输出结果为   01天08时09分40秒
        if (days == 0) {
          return '今天';
        }
        if (days > 0) {
          if (days == 1) {
            return '昨天';
          }
          return this.getWeek(timeStamp);
        }
      } else {
        return moment(timeStamp).format('DD/MM/YYYY');
      }
    },
    getWeek(date) {
      // 参数时间戳
      let week = moment(date).day();
      switch (week) {
        case 1:
          return '周一';
        case 2:
          return '周二';
        case 3:
          return '周三';
        case 4:
          return '周四';
        case 5:
          return '周五';
        case 6:
          return '周六';
        case 0:
          return '周日';
      }
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
  padding: 20px 16px 0;
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
  /deep/.el-timeline-item__content {
    background: #f5f5f5;
    border-radius: 6px;
    padding: 10px;
  }
}
.menu {
  width: 100%;
  overflow: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  display: flex;
  background: #fff;
  /** 滚动条 **/
  ::-webkit-scrollbar {
    width: 2px;
    height: 2px;
    border-radius: 50px;
  } /* 这是针对缺省样式 (必须的) */
  ::-webkit-scrollbar-track {
    background-color: transparent;
  } /* 滚动条的滑轨背景颜色 */

  ::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 1px;
  } /* 滑块颜色 */
  ::-webkit-scrollbar-button {
    background-color: transparent;
  } /* 滑轨两头的监听按钮颜色 */

  // ::-webkit-scrollbar-corner {
  //   background-color: #f9f9f9;
  // } /* 横向滚动条和纵向滚动条相交处尖角的颜色 */
  /deep/.el-menu.el-menu--horizontal {
    border-bottom: none;
  }
  .menu-item {
    cursor: pointer;
    font-size: 17px;
    color: #666;
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
    font-weight: bold;
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
  padding: 20px 20px 35px 20px;
  // margin-bottom: 20px;
  background: #fff;
  z-index: 101;
  // position: -webkit-sticky;
  // position: sticky;
  // top: 0px;

  .day {
    font-size: 30px;
    color: #3667a6;
  }
  .box {
    margin-right: 20px;
    background: #3667a6;
    color: #fff;
    display: inline-flex;
    font-size: 14px;
    flex-direction: row;
    padding: 4px 10px;
    border-radius: 10px;
    align-items: center;
    .month {
      font-weight: bold;
      // font-size: 20px;
    }
  }
}
.times {
  padding: 0 10px;
  .item:last-child {
    padding-bottom: 0;
  }
}
.item {
  position: relative;
  /deep/.el-timeline-item__content {
    cursor: pointer;
  }
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
    // font-family: Tahoma;
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

.menu {
  .fixed-nav {
    max-width: 960px;
    height: 100%;
    display: flex;
    align-items: center;
    line-height: 1;
  }
}
.filter {
  filter: blur(3px);
}
@media (max-width: 767px) {
  .block /deep/.el-timeline-item__wrapper {
    padding-left: 20px;
  }
}

@media (max-width: 992px) {
  .menu .menu-item {
    font-size: 16px;
    height: 40px;
    line-height: 40px;
    padding: 0 12px;
  }
  .date {
    padding: 20px 10px 30px;
    .day {
      font-size: 28px;
    }
  }
  .times {
    padding: 0;
  }
  .menu {
    position: fixed;
    top: 56px;
    width: 100%;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 10%);
    transition: all 0.2s;
    transform: translateZ(0);
    z-index: 900;
    left: 0;
    height: 50px;
    .fixed-nav {
      width: auto;
      overflow-x: auto;
      margin: auto;
    }
  }
}

@media screen and (min-width: 993px) {
  .no-data {
    margin-top: 120px;
  }
  .menu {
    padding: 0 16px;
  }
  .menu-item:first-child {
    padding-left: 0;
  }
  .menu-item:last-child {
    padding-right: 0;
  }
}
</style>
