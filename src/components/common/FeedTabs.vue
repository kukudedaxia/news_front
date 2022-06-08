<!--
 * @Author: jianbang
 * @Description: Feed流 tabs组件
-->
<template>
  <div id="feed-tab" class="com-feed-tabs">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!-- <el-tab-pane label="Beets" name="Beets">Beets</el-tab-pane> -->
      <el-tab-pane :label="`${$t('publisher.drafts', [draftList.length])}`" name="Drafts">
        <template v-if="!loading">
          <ul
            class="infinite-list"
            v-infinite-scroll="load"
            infinite-scroll-immediate="false"
            style="overflow:auto"
          >
            <li
              v-for="(item, index) in draftList"
              class="infinite-list-item"
              :key="index"
              @click="item.disabled ? '' : editDrafts(item)"
            >
              <Drafts
                :data="item"
                @deleteDraftSuccess="onDeleteSuccess"
                @draftNotEdit="onDraftNotEdit(item)"
                @draftCanEdit="onDraftCanEdit(item)"
              ></Drafts>
            </li>
          </ul>
          <default class="default" v-if="draftList.length === 0"></default>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Drafts from '@/components/publish/Drafts';
import Default from '@/components/common/Default';
import Bus from '@/utils/bus';

export default {
  name: 'ComFeedTabs',
  components: {
    Drafts,
    Default,
  },
  watch: {
    draftList: {
      handler(v) {
        this.$store.commit('publisher/setDraftNums', v.length);
      },
      deep: true,
    },
  },
  data() {
    return {
      activeName: 'Drafts',
      // 草稿箱参数
      draftStart: 1,
      draftSize: 20,
      draftList: [],
      loading: false,
    };
  },
  created() {
    this.loading = true;
    this.searchDraftList();
  },
  mounted() {
    Bus.$on('refreshDraft', () => {
      this.loading = true;
      this.searchDraftList();
    });
  },
  methods: {
    handleClick() {},
    load() {
      this.searchDraftList();
    },
    // 查找草稿箱历史记录
    searchDraftList() {
      this.$store.dispatch('ajax', {
        req: {
          method: 'get',
          url: 'api/pc/draft/page',
          params: {
            start: this.draftStart,
            size: this.draftSize,
          },
        },
        onSuccess: ({ data }) => {
          this.draftList = data.reverse();
        },
        onFail: ({ error }) => {
          this.$message.error(error);
        },
        onComplete: () => {
          this.loading = false;
        },
      });
    },
    // 删除草稿成功
    onDeleteSuccess(id) {
      const index = this.draftList.findIndex(item => item.id === id);
      if (index !== -1) {
        this.draftList.splice(index, 1);
      } else {
        this.searchDraftList();
      }
    },
    // 编辑草稿箱
    editDrafts(item) {
      this.$confirm(this.$t('publisher.editDraft'), '', {
        confirmButtonText: this.$t('publisher.confirm'),
        cancelButtonText: this.$t('publisher.cancel'),
      })
        .then(() => {
          this.searchDraftList();
          Bus.$emit('editDraft', item);
        })
        .catch(() => {});
    },
    // 草稿不可编辑
    onDraftNotEdit(item) {
      item.disabled = true;
    },
    // 草稿可编辑
    onDraftCanEdit(item) {
      item.disabled = false;
    },
  },
};
</script>

<style lang="less" scoped>
.com-feed-tabs {
  width: 782px;
  margin: 20px auto;
  background: var(--color-9);
  border-radius: 6px;
  overflow: hidden;
  .el-tabs {
    /deep/.el-tabs__header {
      padding: 20px 0 0 0;
      margin-bottom: 0;
      background: var(--color-11);
      .el-tabs__nav-wrap {
        .el-tabs__nav-scroll {
          padding-left: 40px;
        }
        &::after {
          background-color: #f6f6f6;
          height: 1px;
        }
      }
      .el-tabs__nav {
        height: 40px;
        .el-tabs__active-bar {
          height: 3px;
          background: linear-gradient(270deg, var(--color-18) 0%, var(--color-17) 100%);
          border-radius: 2px;
        }
        .el-tabs__item {
          font-family: Tahoma;
          font-size: 16px;
          color: #333333;
          letter-spacing: 0;
          text-align: center;
          height: 20px;
          line-height: 20px;
        }
        .is-active {
          font-weight: 700;
          color: var(--color-16);
        }
      }
    }
  }
  /deep/.default {
    margin: 60px auto;
    .default-img {
      width: 214px;
      height: 96px;
    }
    p {
      font-family: Tahoma;
      font-size: 14px;
      color: #777f8e;
      text-align: center;
      margin-top: 6px;
    }
  }
}
</style>

<style lang="less">
html[lang='ar'] #feed-tab .el-tabs .el-tabs__nav {
  width: auto;
}
html[lang='ar'] #feed-tab .el-tabs .el-tabs__item {
  transform: scaleX(-1);
}

html[lang='ar'] #feed-tab .el-tabs .el-tabs__item:last-child {
  flex: 1;
}
html[lang='ar'] #feed-tab .el-tabs .el-tabs__header {
  transform: scaleX(-1);
}
html[lang='ar'] #feed-tab .el-tabs .el-tabs__nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
html[lang='ar'] .com-feed-tabs .el-tabs .el-tabs__header .el-tabs__nav-wrap::after {
  height: 2px;
}
</style>
