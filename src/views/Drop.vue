<template>
  <div class="wrap Drop">
    <div class="menu-title hidden-sm-and-down">空投</div>
    <div class="tip">
      提示：空投挖掘板块包括固定回报任务以及拥有潜在空投机会的任务； Bcaca
      仅负责搬运有潜力的任务内容，无法确保任务100%获得回报； 请务必自行对任务内容做详尽调研；
    </div>
    <div class="content">
      <div class="top card">
        <van-skeleton title :row="4" :loading="pinLoading">
          <template v-if="Object.keys(pinned).length > 0">
            <div :class="['type', `type-${currentIndex}`]">{{ pinned.category.data.name }}</div>
            <div class="pha">
              <div class="line">
                <span class="bold">任务概要</span>
                <p>{{ pinned.summary }}</p>
              </div>
              <div class="line">
                <span class="bold">任务入口</span>
                <p>
                  <a class="link" :href="pinned.entry_link" target="_blank">{{
                    pinned.entry_link
                  }}</a>
                </p>
              </div>
              <div class="line">
                <span class="bold">教程</span>
                <p>{{ pinned.tutorial }}</p>
              </div>
              <div class="line">
                <span class="bold">推荐程度</span>
                <span class="hot">
                  <img
                    v-for="hot in pinned.star"
                    :key="hot"
                    :src="require('../assets/images/hot.png')"
                  />
                </span>
              </div>
            </div>
            <div class="times">
              <span class="time" v-if="pinned.started_at"
                >开始日期：{{ pinned.started_at.split(' ')[0] }}</span
              >
              <span class="time" v-if="pinned.ended_at"
                >截止日期：{{ pinned.ended_at.split(' ')[0] }}</span
              >
            </div>
          </template>
          <div>暂无数据</div>
        </van-skeleton>
      </div>
      <div class="filter" v-show="load">
        <el-radio-group v-model="type" class="group" size="small" @change="changeFilter">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button :label="item.id" v-for="(item, index) in categories" :key="index">{{
            item.name
          }}</el-radio-button>
        </el-radio-group>
        <el-input
          v-model="keywords"
          placeholder="请输入内容"
          :trigger-on-focus="false"
          class="serach"
          size="medium"
          type="search"
          @change="Search"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <scroll
        :loading="loading"
        :finished="nextPage == -1"
        :length="list.length"
        @load="getData"
        :immediateCheck="false"
        :loadingCon="true"
        :maxLength="false"
        finishedText="暂无更多数据..."
        class="scrollwrap"
      >
        <template v-slot:content>
          <div class="list" v-if="list.length > 0">
            <div class="card" v-for="(item, index) in list" :key="index">
              <!-- <div class="title">{{ item.title }}</div> -->
              <div :class="['type', `type-${item.index}`]">{{ item.category.data.name }}</div>
              <div class="pha">
                <div class="line">
                  <span class="bold">任务概要</span>
                  <p style="white-space: break-spaces;">{{ item.summary }}</p>
                </div>
                <div class="line">
                  <span class="bold">任务入口</span>
                  <p>
                    <a class="link" :href="item.entry_link" target="_blank">{{
                      item.entry_link
                    }}</a>
                  </p>
                </div>
                <div class="line">
                  <span class="bold">教程</span>
                  <p>{{ item.tutorial }}</p>
                </div>
                <div class="line">
                  <span class="bold">推荐程度</span>
                  <span class="hot">
                    <img
                      v-for="hot in item.star"
                      :key="hot"
                      :src="require('../assets/images/hot.png')"
                    />
                  </span>
                </div>
              </div>
              <div class="times">
                <span class="time" v-if="pinned.started_at"
                  >开始日期：{{ item.started_at.split(' ')[0] }}</span
                >
                <span class="time" v-if="pinned.ended_at"
                  >截止日期：{{ item.ended_at.split(' ')[0] }}</span
                >
              </div>
            </div>
          </div>
          <template v-if="list.length == 0 && !loading">
            <el-empty class="no-data" description="暂无数据"></el-empty>
          </template>
        </template>
      </scroll>
      <!-- <template v-if="list.length < 1 && isFirstload">
        <el-empty class="no-data" description="暂无数据"></el-empty>
      </template> -->
    </div>
  </div>
</template>
<script>
import scroll from '../components/scroll.vue';
export default {
  name: 'Drop',
  components: {
    scroll: scroll,
  },
  data() {
    return {
      type: 'all',
      keywords: '',
      categories: [],
      list: [],
      load: false,
      loading: true,
      currentpage: 1,
      nextPage: 0,
      isFirstload: false,
      pinLoading: false,
      pinned: {},
    };
  },
  computed: {
    currentIndex() {
      return this.categories.findIndex(item => item.id == this.pinned.category_id) || 0;
    },
  },
  async created() {
    await this.getPained();
    await this.getCategorys();
  },
  methods: {
    Search() {
      this.changeFilter();
    },
    changeFilter() {
      console.log(this.type, '11');
      this.currentpage = 1;
      this.list = [];
      this.nextPage = 0;
      if (this.type == 'all') {
        this.getData();
      } else {
        this.getFilterData();
      }
    },
    getCategorys() {
      this.$store.dispatch('ajax', {
        req: {
          url: `airdrop-categories`,
          page: 1,
          pageSize: 100,
        },
        onSuccess: res => {
          console.log(res);
          this.categories = res.data;
          this.getData();
        },
        onComplete: () => {
          this.load = true;
        },
      });
    },
    getPained() {
      return new Promise(resolve => {
        this.pinLoading = true;
        this.$store.dispatch('ajax', {
          req: {
            url: `airdrops/pinned`,
          },
          onSuccess: res => {
            this.pinned = res.data;
          },
          onComplete: () => {
            this.pinLoading = false;
            resolve();
          },
          onFail: () => {
            this.pinLoading = false;
            resolve();
          },
        });
      });
    },
    getData() {
      this.loading = true;
      this.$store.dispatch('ajax', {
        req: {
          url: `airdrops`,
          params: { page: this.currentpage, perPage: 10, keywords: this.keywords },
        },
        onSuccess: res => {
          res.data = res.data.map(item => {
            item.index = this.categories.findIndex(d => d.id == item.category_id);
            return item;
          });
          this.list = this.list.concat(res.data).filter(item => item.id != this.pinned.id);
          this.currentpage += 1;
          if (res.meta && res.meta.pagination.current_page >= res.meta.pagination.total_pages) {
            this.nextPage = -1;
          }
        },
        onComplete: () => {
          this.loading = false;
        },
        onFail: () => {
          this.loading = false;
        },
      });
    },
    getFilterData() {
      this.loading = true;
      this.$store.dispatch('ajax', {
        req: {
          url: `airdrops`,
          params: {
            category_id: this.type,
            page: this.currentpage,
            perPage: 10,
            keywords: this.keywords,
          },
        },
        onSuccess: res => {
          this.list = this.list.concat(res.data);
          this.currentpage += 1;
          if (res.meta && res.meta.pagination.current_page >= res.meta.pagination.total_pages) {
            this.nextPage = -1;
          }
        },
        onComplete: () => {
          this.loading = false;
        },
        onFail: () => {
          this.loading = false;
        },
      });
    },
  },
};
</script>
<style lang="less">
.Drop {
  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background-color: #4465a2;
    border-color: #4465a2;
  }
}
</style>
<style lang="less" scoped>
.wrap {
  max-width: 1120px;
  margin: 0 auto;
  border-right: 1px solid hsla(0, 0%, 53%, 0.2);
}
.menu-title {
  padding: 20px 20px;
  font-size: 20px;
  font-weight: 600;
  line-height: 20px;
  border-bottom: 1px solid hsla(0, 0%, 53%, 0.2);
  color: #010102;
}
.tip {
  max-width: 680px;
  margin: 30px auto;
  font-size: 14px;
  color: #666;
}
.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 800px;
  margin: 0 auto;
  align-items: flex-start;
}
.top {
  padding-right: 80px;
}
.title {
  padding-left: 10px;
  font-size: 18px;
  margin-bottom: 10px;
  color: #4465a2;
  font-weight: bold;
}
.card {
  width: 100%;
  padding: 20px;
  position: relative;
  border-color: #e5e7eb;
  box-shadow: 0 4px 12px #0000000f, 0 0 2px #0000001a;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  .line {
    display: flex;
    margin-bottom: 10px;
    font-size: 14px;
    word-break: break-word;
    .bold {
      font-weight: bold;
      white-space: nowrap;
      margin-right: 16px;
      min-width: 64px;
      text-align: right;
      font-size: 14px;
    }
  }
  .bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    // padding-left: 20px;
  }
  .time {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 14px;
    color: #666;
  }
  .hot {
    display: flex;
    img {
      width: 16px;
      margin: 0 2px;
    }
  }
}
.times {
  display: flex;
  justify-content: space-between;
  padding: 0 6px;
}
.filter {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 20px;
  width: 100%;
}
.group {
  padding: 20px 0;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 2;
  // width: 100%;
  margin: 10px 0;
}
.search {
  flex: 1;
  width: 100%;
  margin-left: 40px;
}
.link {
  color: #4465a2;
  cursor: pointer;
}
.type {
  position: absolute;
  background: linear-gradient(45deg, #5f73e6, #4465a2);
  right: -40px;
  padding: 4px 50px;
  transform: rotate(40deg) scale(1);
  font-size: 14px;
  color: #fff;
  white-space: nowrap;
}
.type-1 {
  background: linear-gradient(45deg, #8bc34a, #9e9e9e);
}
.type-2 {
  background: linear-gradient(45deg, #e91e63, #9e9e9e);
}
.type-3 {
  background: linear-gradient(45deg, #00bcd4, #9e9e9e);
}
.type-4 {
  background: linear-gradient(45deg, #607d8b, #9e9e9e);
}
.type-5 {
  background: linear-gradient(45deg, #795548, #9e9e9e);
}
.type-6 {
  background: linear-gradient(45deg, #8bc34a, #cddc39);
}

.list {
  .card {
    // padding-right: 80px;
    width: 660px;
    margin-bottom: 20px;
    .pha {
      padding-right: 80px;
    }
  }
}
.scrollwrap {
  width: 100%;
}
.serach {
  flex: 1;
  margin-left: 40px;
}
@media (max-width: 767px) {
}
@media (max-width: 992px) {
  .filter {
    flex-direction: column;
    align-items: flex-start;
  }
  .group {
    top: 46px;
    display: flex;
    flex-wrap: nowrap;
    padding: 10px 0;
    width: 100%;
    overflow: scroll;
  }
  .serach {
    width: 80%;
    margin-left: 10%;
  }
  .content {
    padding: 0 16px;
  }
  .tip {
    padding: 0 16px;
  }
  .type {
    transform: rotate(40deg) scale(0.8);
    font-size: 14px;
    color: #fff;
    top: 12px;
    width: 56px;
    box-sizing: content-box;
    text-align: center;
    right: -50px;
  }
  .list .card {
    width: 100%;
    .pha {
      padding-right: 34px;
    }
  }
}
@media (max-width: 1200px) {
}
@media (min-width: 768px) {
  .scrollwrap {
    padding-bottom: 50px;
    width: 100%;
  }
}
@media (min-width: 993px) {
  .type {
    top: 20px;
  }
}
</style>
