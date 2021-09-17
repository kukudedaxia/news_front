<!--
 * @Author: jianbang
 * @Description: Feed流 tabs组件
-->
<template>
  <div class="com-feed-tabs">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!-- <el-tab-pane label="Beets" name="Beets">Beets</el-tab-pane> -->
      <el-tab-pane :label="`${$t('publisher.drafts')}(${draftList.length})`" name="Drafts">
        <ul class="infinite-list" v-infinite-scroll="load" style="overflow:auto">
          <li v-for="(item, index) in draftList" class="infinite-list-item" :key="index">
            <Drafts :data="item"></Drafts>
          </li>
        </ul>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Drafts from '@/components/publish/Drafts';
export default {
  name: 'ComFeedTabs',
  components: {
    Drafts,
  },
  data() {
    return {
      activeName: 'Drafts',
      // 草稿箱参数
      draftStart: 1,
      draftSize: 20,
      draftList: [
        {
          text:
            'This app is a video collection app developed in the Middle Eastern Arabs. You can make some interesting videos by yourself. ',
          time: '03/01/2020 14:4',
          power: 'Public',
          imgUrls: [
            {
              url: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
              piiic: false,
            },
          ],
        },
        {
          text:
            'This app is a video collection app developed in the Middle Eastern Arabs. You can make some interesting videos by yourself. ',
          time: '03/01/2020 14:4',
          power: 'Public',
          imgUrls: [
            {
              url: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
              piiic: true,
            },
          ],
        },
        {
          text:
            'This app is a video collection app developed in the Middle Eastern Arabs. You can make some interesting videos by yourself. This app is a video collection app developed in the Middle Eastern Arabs. You can make some interesting…',
          time: '03/01/2020 14:4',
          power: 'Public',
          imgUrls: [
            {
              url: 'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
              piiic: false,
            },
            {
              url: 'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
              piiic: false,
            },
            {
              url: 'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
              piiic: false,
            },
            {
              url: 'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
              piiic: false,
            },
            {
              url: 'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
              piiic: false,
            },
            {
              url: 'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
              piiic: false,
            },
            {
              url: 'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
              piiic: false,
            },
            {
              url: 'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
              piiic: false,
            },
            {
              url: 'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
              piiic: false,
            },
          ],
        },
        {
          text:
            'هذا هو تطبيق لجمع الفيديو تم تطويره في الشرق الأوسط العربي. يمكنك صنع بعض مقاطع الفيديو المثيرة لمثير للاهتمام هذا هو تطبيق لجمع الفيديو تم تطويره في الشرق الأ',
          time: '03/01/2020 14:4',
          power: 'Public',
          video: {
            url: 'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
            time: '12:40',
          },
        },
        {
          text:
            'This app is a video collection app developed in the Middle Eastern Arabs. You can make some interesting videos by yourself. ',
          time: '03/01/2020 14:4',
          power: 'Public',
        },
      ],
    };
  },
  methods: {
    handleClick() {},
    load() {
      this.searchDraftList();
    },
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
          console.log(data);
        },
        onFail: ({ error }) => {
          this.$message.error(error);
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.com-feed-tabs {
  width: 782px;
  margin: 20px auto;
  background: #ffffff;
  border-radius: 6px;
  overflow: hidden;
  .el-tabs {
    /deep/.el-tabs__header {
      padding: 20px 0 0 0;
      margin-bottom: 0;
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
          background-image: linear-gradient(90deg, #ff9e39 1%, #ff536c 100%);
          border-radius: 2px;
        }
        .el-tabs__item {
          font-family: SFUIText-Regular;
          font-size: 16px;
          color: #333333;
          letter-spacing: 0;
          text-align: center;
          height: 20px;
          line-height: 20px;
        }
        .is-active {
          font-family: SFUIText-Semibold;
          color: #ff536c;
        }
      }
    }
  }
}
</style>
