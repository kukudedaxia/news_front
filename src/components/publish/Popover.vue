<!--
 * @Author: jianbang
 * @Description: 话题、用户popover检索组件
-->
<template>
  <div class="com-popover">
    <!-- 检索中 -->
    <div class="searching flex-align" v-if="searchLoading">
      <img src="@/assets/images/publisher/account_icon_searching@3x.png" class="seatch-icon" />
      Searching…
    </div>
    <!-- 创建话题 -->
    <div
      class="topic-create"
      v-else-if="!searchLoading && type === 'topic' && topicList.length === 0"
    >
      <p>
        Visual frequency
      </p>
      <span>
        Create a topic
      </span>
    </div>
    <div class="user-result" v-else-if="!searchLoading && type === 'user' && userList.length === 0">
      <p>
        No Result
      </p>
    </div>
    <div class="list-content" v-else>
      <p class="top-title" v-if="topicList.length > 0 || userList.length > 0">
        {{ topTitle }}
      </p>
      <ul class="list-box" v-infinite-scroll="load" v-if="type === 'topic'">
        <li
          v-for="item in topicList"
          class="infinite-list-item"
          :key="item.title"
          @click="itemClick(item.title)"
        >
          <topic-item :item="item"></topic-item>
        </li>
      </ul>
      <ul class="list-box" v-infinite-scroll="load" v-if="type === 'user'">
        <li
          v-for="item in userList"
          class="infinite-list-item"
          :key="item.userName"
          @click="itemClick(item.userName)"
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
          msg = 'Select or enter the topic you want to use.';
          break;
        case 'user':
          msg = 'Select or enter the person you want to @';
          break;
      }
      return msg;
    },
  },
  data() {
    return {
      searchLoading: true,
      topicList: [
        {
          title: 'Electronic products',
          num: 99,
        },
        {
          title: 'Novel coronavirus',
          num: 99,
        },
      ],
      userList: [
        {
          coverImg: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
          userName: 'troyesivan',
          nickName: 'Troye SivaSivaSiva',
        },
        {
          coverImg: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
          userName: 'troyesivan2',
          nickName: 'Troye SivaSivaSiva',
        },
      ],
    };
  },
  mounted() {
    this.searchUser();
  },
  methods: {
    load() {},
    itemClick(data) {
      this.$emit('onItemClick', data);
    },
    // @ 用户检索
    searchUser() {
      setTimeout(() => {
        this.searchLoading = false;
      }, 1000);
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
