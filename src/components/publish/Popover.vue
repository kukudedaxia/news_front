<!--
 * @Author: jianbang
 * @Description: 话题、用户popover检索组件
-->
<template>
  <div class="com-popover">
    <!-- 检索中 -->
    <div class="searching flex-align" v-if="searchLoading">
      <img src="@/assets/images/publisher/account_icon_searching@3x.png" class="seatch-icon" />
      {{ $t('publisher.searching') }}
    </div>
    <!-- 创建话题 -->
    <div
      class="topic-create text-right"
      v-else-if="!searchLoading && type === 'topic' && topicList.length === 0"
      @click="createTopic"
    >
      <p :class="tools.checkLan(text) === 'ar' ? 'pub-rtl' : 'pub-ltr'">#{{ text }}</p>
      <span>
        {{ $t('publisher.topic') }}
      </span>
    </div>
    <div class="user-result" v-else-if="!searchLoading && type === 'user' && userList.length === 0">
      <p>
        {{ $t('publisher.noResults') }}
      </p>
    </div>
    <div class="list-content" v-else>
      <p class="top-title text-right" v-if="topicList.length > 0 || userList.length > 0">
        {{ topTitle }}
      </p>
      <ul class="list-box" v-infinite-scroll="onLoadTopic" v-if="type === 'topic'">
        <li
          v-for="item in topicList"
          class="infinite-list-item"
          :key="item.title"
          @click="itemClick(item.desc1)"
        >
          <topic-item :item="item"></topic-item>
        </li>
      </ul>
      <ul class="list-box" v-infinite-scroll="onLoadUser" v-if="type === 'user'">
        <li
          v-for="item in userList"
          class="infinite-list-item"
          :key="item.username"
          @click="itemClick(item.username)"
        >
          <user-item :item="item"></user-item>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import UserItem from '@/components/publish/UserItem';
import TopicItem from '@/components/publish/TopicItem';

export default {
  props: {
    // 类型  topic、user
    type: {
      type: String,
      default: '',
    },
    // 检索文本
    text: [String, Number],
  },
  components: {
    'user-item': UserItem,
    'topic-item': TopicItem,
  },
  computed: {
    topTitle() {
      let msg = '';
      switch (this.type) {
        case 'topic':
          msg = this.$t('publisher.selectTopic');
          break;
        case 'user':
          msg = this.$t('publisher.selectUser');
          break;
      }
      return msg;
    },
    lang() {
      return this.$store.state.lanuage;
    },
  },
  watch: {
    text: {
      handler(v) {
        if (this.type === 'user') {
          this.searchUser();
          return;
        }
        if (this.type === 'topic') {
          this.searchTopic();
        }
      },
    },
  },
  data() {
    return {
      searchLoading: false,
      topicList: [],
      topicPage: 1,
      userList: [],
      userpage: 1,
    };
  },
  mounted() {
    // this.searchUser();
  },
  methods: {
    onLoadTopic() {},
    onLoadUser() {},
    itemClick(data) {
      this.$emit('onItemClick', data);
    },
    // @ 用户检索
    searchUser() {
      this.searchLoading = true;
      this.$store.dispatch('ajax', {
        req: {
          method: 'get',
          url: 'api/pc/status/beet/at',
          params: {
            keyword: this.text,
            page: this.userpage,
            count: 50,
          },
        },
        onSuccess: ({ data }) => {
          this.userList = data.users.splice(0, 10);
        },
        onFail: ({ error }) => {
          this.$message.error(error);
        },
        onComplete: () => {
          this.searchLoading = false;
        },
      });
    },
    // # 话题检索
    searchTopic() {
      this.searchLoading = true;
      this.$store.dispatch('ajax', {
        req: {
          method: 'get',
          url: 'api/pc/status/search/topic',
          params: {
            keyword: this.text,
            // keyword: this.text ? this.text.replaceAll('#', '') : this.text,
            page: this.topicPage,
            count: 50,
          },
        },
        onSuccess: ({ data }) => {
          this.topicList = data.topics.splice(0, 10);
        },
        onFail: ({ error }) => {
          this.$message.error(error);
        },
        onComplete: () => {
          this.searchLoading = false;
        },
      });
    },
    // 创建话题
    createTopic() {
      this.$emit('onCreateTopic');
    },
  },
};
</script>

<style lang="less" scoped>
.com-popover {
  width: 240px;
  // height: 390px;
  background: #ffffff;
  border: 1px solid #eff1f5;
  box-shadow: 4px 4px 10px 0 rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  z-index: 99;
  .searching {
    padding: 20px;
    font-family: SFUIText-Regular;
    font-size: 12px;
    color: #777f8e;
    justify-content: center;
    .seatch-icon {
      width: 11px;
      height: 11px;
      margin: 0 5px;
      animation: turn 1s linear infinite;
    }
  }
  .list-content {
    height: 332px;
    display: flex;
    flex-direction: column;
    .top-title {
      font-family: SFUIText-Regular;
      font-size: 12px;
      color: #777f8e;
      text-align: left;
      padding: 12px;
    }
    .list-box {
      margin-bottom: 12px;
      flex: 1;
      overflow: auto;
    }
  }
  .topic-create {
    padding: 18px 19px;
    text-align: left;
    cursor: pointer;
    & > p,
    & > span {
      display: block;
    }
    & > p {
      font-family: SFUIText-Regular;
      font-size: 16px;
      color: #333333;
      letter-spacing: 0;
      margin-bottom: 2px;
    }
    & > span {
      font-family: SFUIText-Regular;
      font-size: 12px;
      color: #777f8e;
      letter-spacing: 0;
    }
  }
  .user-result {
    padding: 18px 19px;
    text-align: left;
    p {
      font-family: SFUIText-Regular;
      font-size: 12px;
      color: #777f8e;
      letter-spacing: 0;
    }
  }
}
</style>
